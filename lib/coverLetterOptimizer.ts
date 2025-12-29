/**
 * Cover Letter Optimizer
 * Removes duplicate words, optimizes length, and ensures quality
 */

export interface CoverLetterOptimizationOptions {
  maxWords?: number
  minWords?: number
  maxParagraphs?: number
  removeDuplicates?: boolean
}

/**
 * Removes duplicate words and phrases from cover letter
 */
function removeDuplicateWords(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const seenPhrases = new Set<string>()
  const uniqueSentences: string[] = []

  for (const sentence of sentences) {
    const normalized = sentence.trim().toLowerCase()
    const words = normalized.split(/\s+/)
    
    // Check for duplicate key phrases (3+ word sequences)
    let hasDuplicate = false
    for (let i = 0; i <= words.length - 3; i++) {
      const phrase = words.slice(i, i + 3).join(' ')
      if (seenPhrases.has(phrase)) {
        hasDuplicate = true
        break
      }
      seenPhrases.add(phrase)
    }

    // Check for excessive word repetition in sentence
    const wordCounts = new Map<string, number>()
    for (const word of words) {
      const cleanWord = word.replace(/[^\w]/g, '')
      if (cleanWord.length > 3) { // Only check meaningful words
        wordCounts.set(cleanWord, (wordCounts.get(cleanWord) || 0) + 1)
      }
    }

    const hasRepeatedWords = Array.from(wordCounts.values()).some(count => count > 2)
    
    if (!hasDuplicate && !hasRepeatedWords) {
      uniqueSentences.push(sentence.trim())
    }
  }

  return uniqueSentences.join('. ') + (uniqueSentences.length > 0 ? '.' : '')
}

/**
 * Counts words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Counts paragraphs in text
 */
function countParagraphs(text: string): number {
  return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
}

/**
 * Optimizes cover letter by removing duplicates and ensuring length constraints
 */
export function optimizeCoverLetter(
  text: string,
  options: CoverLetterOptimizationOptions = {}
): string {
  const {
    maxWords = 350,
    minWords = 200,
    maxParagraphs = 4,
    removeDuplicates = true,
  } = options

  let optimized = text.trim()

  // Remove duplicate words/phrases
  if (removeDuplicates) {
    optimized = removeDuplicateWords(optimized)
  }

  // Ensure paragraph count
  const paragraphs = optimized.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  if (paragraphs.length > maxParagraphs) {
    // Keep first and last paragraphs, and middle ones up to max
    const keepCount = Math.min(maxParagraphs, paragraphs.length)
    const first = paragraphs[0]
    const last = paragraphs[paragraphs.length - 1]
    const middle = paragraphs.slice(1, -1).slice(0, keepCount - 2)
    optimized = [first, ...middle, last].filter(Boolean).join('\n\n')
  }

  // Ensure word count
  const wordCount = countWords(optimized)
  if (wordCount > maxWords) {
    // Truncate to max words while preserving sentence boundaries
    const sentences = optimized.split(/[.!?]+/).filter(s => s.trim().length > 0)
    let truncated = ''
    let currentWordCount = 0

    for (const sentence of sentences) {
      const sentenceWords = countWords(sentence)
      if (currentWordCount + sentenceWords <= maxWords) {
        truncated += (truncated ? '. ' : '') + sentence.trim()
        currentWordCount += sentenceWords
      } else {
        break
      }
    }
    optimized = truncated + (truncated ? '.' : '')
  } else if (wordCount < minWords && paragraphs.length > 0) {
    // If too short, we'll let the AI regenerate (this is just a safety check)
    console.warn(`Cover letter is too short (${wordCount} words, minimum ${minWords})`)
  }

  return optimized.trim()
}

/**
 * Validates cover letter quality
 */
export function validateCoverLetter(text: string): {
  isValid: boolean
  issues: string[]
  wordCount: number
  paragraphCount: number
} {
  const issues: string[] = []
  const wordCount = countWords(text)
  const paragraphCount = countParagraphs(text)

  if (wordCount < 200) {
    issues.push(`Too short: ${wordCount} words (minimum 200)`)
  }
  if (wordCount > 400) {
    issues.push(`Too long: ${wordCount} words (maximum 400)`)
  }
  if (paragraphCount < 3) {
    issues.push(`Too few paragraphs: ${paragraphCount} (minimum 3)`)
  }
  if (paragraphCount > 5) {
    issues.push(`Too many paragraphs: ${paragraphCount} (maximum 5)`)
  }

  // Check for excessive repetition
  const words = text.toLowerCase().split(/\s+/)
  const wordFreq = new Map<string, number>()
  for (const word of words) {
    const cleanWord = word.replace(/[^\w]/g, '')
    if (cleanWord.length > 4) { // Check meaningful words only
      wordFreq.set(cleanWord, (wordFreq.get(cleanWord) || 0) + 1)
    }
  }

  const repeatedWords = Array.from(wordFreq.entries())
    .filter(([_, count]) => count > 5)
    .map(([word]) => word)

  if (repeatedWords.length > 0) {
    issues.push(`Excessive word repetition: ${repeatedWords.slice(0, 3).join(', ')}`)
  }

  return {
    isValid: issues.length === 0,
    issues,
    wordCount,
    paragraphCount,
  }
}

