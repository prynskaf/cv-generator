import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractCVData, type ExtractedCVData } from "@/lib/gemini";
import mammoth from "mammoth";
import PDFParser from "pdf2json";

// ----------------------
// Normalize dates safely
// ----------------------
function normalizeDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null;

  const trimmed = dateString.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{4}-\d{2}$/.test(trimmed)) return `${trimmed}-01`;
  if (/^\d{4}$/.test(trimmed)) return `${trimmed}-01-01`;

  return null;
}

// ----------------------
// Extract text from PDF safely
// ----------------------
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      console.error("PDF parsing error:", err?.parserError ?? err);
      reject(new Error("Failed to extract text from PDF"));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        // Fallback if formImage.Pages missing
        if (!pdfData?.formImage?.Pages) {
          console.warn("PDF missing formImage.Pages — using fallback parser");
          resolve(pdfParser.getRawTextContent()?.trim() ?? "");
          return;
        }

        let text = "";

        for (const page of pdfData.formImage.Pages) {
          if (!page.Texts) continue;

          for (const block of page.Texts) {
            if (!block.R) continue;

            for (const obj of block.R) {
              if (obj.T) text += decodeURIComponent(obj.T) + " ";
            }
          }

          text += "\n\n";
        }

        resolve(text.trim());
      } catch (err) {
        console.error("PDF extraction fallback error:", err);
        try {
          // FINAL fallback to built-in parser
          resolve(pdfParser.getRawTextContent()?.trim() ?? "");
        } catch {
          reject(new Error("Failed to extract text from PDF"));
        }
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

// ----------------------
// Extract text from DOCX
// ----------------------
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value ?? "";
}

// ----------------------
// POST Route
// ----------------------
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload PDF or Word document." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // -------------------------
    // Extract CV text
    // -------------------------
    let cvText = "";

    if (file.type === "application/pdf") {
      cvText = await extractTextFromPDF(buffer);
    } else {
      cvText = await extractTextFromDOCX(buffer);
    }

    if (!cvText || cvText.trim().length < 100) {
      return NextResponse.json(
        {
          error:
            "Could not extract enough text from CV. Ensure it's not empty or scanned image-only.",
        },
        { status: 400 }
      );
    }

    console.log("Extracted CV length:", cvText.length);

    // -------------------------
    // AI parse CV text
    // -------------------------
    const extractedData: ExtractedCVData = await extractCVData(cvText);
    console.log("Extracted data:", extractedData);

    // -------------------------
    // Update user profile
    // -------------------------
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({
        full_name:
          extractedData.fullName || user.user_metadata?.full_name || "",
        email: extractedData.email || user.email || "",
        phone: extractedData.phone || null,
        location: extractedData.location || null,
        date_of_birth: normalizeDate(extractedData.dateOfBirth),
        professional_summary: extractedData.professionalSummary || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) throw profileError;

    // -------------------------
    // Clear & Insert EXPERIENCE
    // -------------------------
    await supabase.from("experiences").delete().eq("user_id", user.id);

    if (extractedData.experience?.length) {
      const rows = extractedData.experience.map((exp) => ({
        user_id: user.id,
        company: exp.company,
        position: exp.position,
        location: exp.location || null,
        start_date: normalizeDate(exp.startDate),
        end_date: exp.currentPosition ? null : normalizeDate(exp.endDate),
        is_current: exp.currentPosition,
        description: exp.description || null,
      }));

      const { error } = await supabase.from("experiences").insert(rows);
      if (error) throw error;
    }

    // -------------------------
    // EDUCATION
    // -------------------------
    await supabase.from("education").delete().eq("user_id", user.id);

    if (extractedData.education?.length) {
      const rows = extractedData.education.map((edu) => ({
        user_id: user.id,
        institution: edu.institution,
        degree: edu.degree,
        field_of_study: edu.fieldOfStudy || null,
        location: edu.location || null,
        start_date: normalizeDate(edu.startDate),
        end_date: edu.currentlyEnrolled ? null : normalizeDate(edu.endDate),
        is_current: edu.currentlyEnrolled,
        description: edu.description || null,
      }));

      const { error } = await supabase.from("education").insert(rows);
      if (error) throw error;
    }

    // -------------------------
    // SKILLS
    // -------------------------
    await supabase.from("skills").delete().eq("user_id", user.id);

    if (extractedData.skills?.length) {
      const rows = extractedData.skills.map((skill) => ({
        user_id: user.id,
        skill_name: skill.name,
        skill_level: skill.proficiencyLevel,
        skill_category: skill.category || null,
      }));

      const { error } = await supabase.from("skills").insert(rows);
      if (error) throw error;
    }

    // -------------------------
    // LINKS
    // -------------------------
    await supabase.from("links").delete().eq("user_id", user.id);

    if (extractedData.links) {
      const { error } = await supabase.from("links").insert({
        user_id: user.id,
        linkedin: extractedData.links.linkedin || null,
        github: extractedData.links.github || null,
        portfolio: extractedData.links.portfolio || null,
        other_links: extractedData.links.otherLinks || [],
      });
      if (error) throw error;
    }

    // -------------------------
    // LANGUAGES
    // -------------------------
    await supabase.from("languages").delete().eq("user_id", user.id);

    if (extractedData.languages?.length) {
      const rows = extractedData.languages.map((l) => ({
        user_id: user.id,
        name: l.name,
        proficiency: l.proficiency || null,
      }));

      const { error } = await supabase.from("languages").insert(rows);
      if (error) throw error;
    }

    // -------------------------
    // PROJECTS
    // -------------------------
    await supabase.from("projects").delete().eq("user_id", user.id);

    if (extractedData.projects?.length) {
      const rows = extractedData.projects.map((p) => ({
        user_id: user.id,
        name: p.name,
        description: p.description || null,
        technologies: p.technologies || [],
      }));

      const { error } = await supabase.from("projects").insert(rows);
      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: "CV uploaded & user profile updated successfully.",
      data: extractedData,
    });
  } catch (err: any) {
    console.error("CV upload error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process CV" },
      { status: 500 }
    );
  }
}