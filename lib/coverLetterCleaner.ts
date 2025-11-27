/**
 * Cover Letter Cleaner
 * Aggressively removes greetings, signatures, headers, and duplicates
 */

/**
 * Removes all greetings from text
 */
function removeGreetings(text: string): string {
  // Remove standalone greeting lines
  text = text.replace(/^dear\s+(hiring\s+manager|mr\.|mrs\.|ms\.|dr\.|sir|madam)[,.:]?\s*$/gmi, '')
  // Remove greetings at start of lines
  text = text.replace(/^dear\s+(hiring\s+manager|mr\.|mrs\.|ms\.|dr\.|sir|madam)[,.:]?\s*/gmi, '')
  // Remove greetings anywhere in text
  text = text.replace(/\s*dear\s+(hiring\s+manager|mr\.|mrs\.|ms\.|dr\.|sir|madam)[,.:]?\s*/gi, ' ')
  return text.trim()
}

/**
 * Removes all signatures and closings from text
 */
function removeSignatures(text: string): string {
  const signatures = [
    'sincerely',
    'best regards',
    'regards',
    'yours sincerely',
    'yours truly',
    'respectfully',
    'cordially',
  ]
  
  for (const sig of signatures) {
    // Remove standalone signature lines
    text = text.replace(new RegExp(`^${sig}[,.:]?\\s*$`, 'gmi'), '')
    // Remove signatures at start of lines
    text = text.replace(new RegExp(`^${sig}[,.:]?\\s*`, 'gmi'), '')
    // Remove signatures anywhere in text
    text = text.replace(new RegExp(`\\s*${sig}[,.:]?\\s*`, 'gi'), ' ')
  }
  
  return text.trim()
}

/**
 * Removes contact information (email, phone, address, date)
 */
function removeContactInfo(text: string): string {
  const lines = text.split('\n')
  const filtered = lines.filter(line => {
    const lower = line.trim().toLowerCase()
    
    // Remove email addresses
    if (lower.match(/^[^\s]+@[^\s]+\.[^\s]+$/)) return false
    
    // Remove phone numbers
    if (lower.match(/^\+?[\d\s\-\(\)]{7,}$/)) return false
    
    // Remove dates
    if (lower.match(/^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}$/i)) return false
    if (lower.match(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/)) return false
    
    // Remove addresses
    if (lower.match(/^\d+.*(street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|circle|cir|apartment|apt|suite|ste)/i)) return false
    
    // Remove standalone names (likely signatures) - but keep if it's part of a sentence
    if (lower.match(/^[a-z]+\s+[a-z]+[,.]?\s*$/i) && lower.length < 30 && !lower.includes('.')) return false
    
    return true
  })
  
  return filtered.join('\n').trim()
}

/**
 * Removes duplicate paragraphs or sentences
 */
function removeDuplicates(text: string): string {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const seen = new Set<string>()
  const unique: string[] = []
  
  for (const para of paragraphs) {
    const normalized = para.trim().toLowerCase().replace(/\s+/g, ' ')
    // Check if we've seen this paragraph before (allowing for minor variations)
    let isDuplicate = false
    for (const seenPara of seen) {
      // If 80% of words match, consider it a duplicate
      const words1 = normalized.split(/\s+/)
      const words2 = seenPara.split(/\s+/)
      const commonWords = words1.filter(w => words2.includes(w))
      const similarity = commonWords.length / Math.max(words1.length, words2.length)
      if (similarity > 0.8) {
        isDuplicate = true
        break
      }
    }
    
    if (!isDuplicate) {
      seen.add(normalized)
      unique.push(para.trim())
    }
  }
  
  return unique.join('\n\n').trim()
}

/**
 * Comprehensive cover letter cleaning
 */
export function cleanCoverLetter(text: string): string {
  let cleaned = text.trim()
  
  // Step 1: Remove greetings
  cleaned = removeGreetings(cleaned)
  
  // Step 2: Remove signatures
  cleaned = removeSignatures(cleaned)
  
  // Step 3: Remove contact information
  cleaned = removeContactInfo(cleaned)
  
  // Step 4: Remove duplicate paragraphs
  cleaned = removeDuplicates(cleaned)
  
  // Step 5: Clean up whitespace
  cleaned = cleaned.replace(/\s+/g, ' ')
  cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n')
  cleaned = cleaned.trim()
  
  return cleaned
}

