export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface AIInsights {
  wordCount: number;
  readingTime: number;
  summary: string;
  keyPoints: string[];
  relatedTopics: string[];
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Example glossary terms
const glossaryTerms: GlossaryTerm[] = [
  { term: 'algorithm', definition: 'A step-by-step procedure for solving a problem or completing a task' },
  { term: 'machine learning', definition: 'A type of AI that enables computers to learn without being explicitly programmed' },
  { term: 'neural network', definition: 'A computing system inspired by biological neural networks' },
  { term: 'database', definition: 'An organized collection of structured information or data' },
  { term: 'API', definition: 'Application Programming Interface - a set of protocols for building software applications' },
  { term: 'framework', definition: 'A platform for developing software applications with pre-written code' },
  { term: 'responsive design', definition: 'Web design approach that makes pages render well on various devices' },
  { term: 'encryption', definition: 'The process of converting information into secret code to prevent unauthorized access' }
];

export const aiUtils = {
  findGlossaryTerms: (text: string): GlossaryTerm[] => {
    const foundTerms: GlossaryTerm[] = [];
    const lowerText = text.toLowerCase();
    glossaryTerms.forEach(term => {
      if (lowerText.includes(term.term.toLowerCase())) {
        foundTerms.push(term);
      }
    });
    return foundTerms;
  },

  async generateInsights(text: string): Promise<AIInsights> {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const prompt = `
Analyze the following note and provide:
1. A concise 2-3 sentence summary in your own words.
2. 5-7 key points as a JSON array of strings, each 10-20 words, covering different aspects.
3. 3-5 related topics as a JSON array of strings.

Format your response as JSON:
{
  "summary": "string",
  "keyPoints": ["string", ...],
  "relatedTopics": ["string", ...]
}

Example Input:
"Engineering is the application of scientific and mathematical principles..."

Example Output:
{
  "summary": "Engineering applies science and math to solve real-world problems. It spans many disciplines and drives technological progress.",
  "keyPoints": [
    "Engineering uses scientific and mathematical principles for practical solutions.",
    "It includes civil, mechanical, electrical, and computer fields.",
    "Engineers solve problems with creativity and analysis.",
    "Modern engineering addresses sustainability and safety.",
    "Collaboration and communication are essential in engineering projects."
  ],
  "relatedTopics": [
    "Sustainable Engineering",
    "Emerging Technologies",
    "Engineering Ethics"
  ]
}

Now analyze this note:
"""${text.substring(0, 8000)}"""
`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          wordCount,
          readingTime,
          summary: result.summary?.trim() || 'No summary generated',
          keyPoints: Array.isArray(result.keyPoints) ? result.keyPoints : [],
          relatedTopics: Array.isArray(result.relatedTopics) ? result.relatedTopics : []
        };
      }
      // fallback
      return {
        wordCount,
        readingTime,
        summary: 'No summary generated',
        keyPoints: [],
        relatedTopics: []
      };
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return {
        wordCount,
        readingTime,
        summary: 'No summary generated',
        keyPoints: [],
        relatedTopics: []
      };
    }
  },

  async correctGrammar(text: string): Promise<string> {
    const prompt = `correct the spelling mistakes and grammar in the original text that is attached and give me just corrected sentence dont add extra things like this is the corrected sentence or anything, you just need to give me corrected sentence.
Original: ${text}
Fixed Grammar:`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    // The corrected sentence is here:
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  }
};