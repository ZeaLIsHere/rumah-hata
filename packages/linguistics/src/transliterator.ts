/**
 * Deterministic Latin -> Aksara Batak Simalungun Transliterator.
 * Rules based on Unicode Batak Standard (U+1BC0-U+1BFF) and Kozok (1999).
 */

import { syllabifyWord, parseSyllable } from "./syllabifier.js";
import type { TransliterationStep } from "./types.js";

// Ina ni Surat (Base characters)
const BASE_CONSONANTS: Record<string, { char: string; name: string }> = {
  h: { char: "\u1BC3", name: "Ha Simalungun (ᯃ)" },
  k: { char: "\u1BC3", name: "Ka Simalungun (ᯃ)" },
  b: { char: "\u1BC5", name: "Ba (ᯅ)" },
  p: { char: "\u1BC8", name: "Pa Simalungun (ᯈ)" },
  n: { char: "\u1BC9", name: "Na (ᯉ)" },
  w: { char: "\u1BCC", name: "Wa Simalungun (ᯌ)" },
  g: { char: "\u1BCF", name: "Ga Simalungun (ᯏ)" },
  j: { char: "\u1BD0", name: "Ja (ᯐ)" },
  d: { char: "\u1BD1", name: "Da (ᯑ)" },
  r: { char: "\u1BD3", name: "Ra Simalungun (ᯓ)" },
  m: { char: "\u1BD5", name: "Ma Simalungun (ᯕ)" },
  t: { char: "\u1BD6", name: "Ta Selatan (ᯖ)" },
  s: { char: "\u1BD9", name: "Sa Simalungun (ᯙ)" },
  y: { char: "\u1BDC", name: "Ya Simalungun (ᯜ)" },
  ng: { char: "\u1BDD", name: "Nga (ᯝ)" },
  l: { char: "\u1BDF", name: "La Simalungun (ᯟ)" },
  ny: { char: "\u1BE0", name: "Nya (ᯠ)" },
  c: { char: "\u1BD9", name: "Sa (pengganti Ca)" }
};

const INDEPENDENT_VOWELS: Record<string, { char: string; name: string }> = {
  a: { char: "\u1BC1", name: "A Simalungun (ᯁ)" },
  i: { char: "\u1BE4", name: "I mandiri (ᯤ)" },
  u: { char: "\u1BE5", name: "U mandiri (ᯥ)" },
  e: { char: "\u1BC1\u1BE9", name: "A + hatelingan /e/ (ᯁᯩ)" },
  o: { char: "\u1BC1\u1BEC", name: "A + sihorlu /o/ (ᯁᯬ)" }
};

const PANONGONAN = "\u1BF3"; // Virama Simalungun

export interface TransliterateOptions {
  includeSteps?: boolean;
}

export interface TransliterationResult {
  aksara: string;
  steps: TransliterationStep[];
}

/**
 * Transliterates a single syllable into Simalungun Batak script.
 */
export function transliterateSyllable(
  syllable: string,
  stepCounter: { count: number }
): { aksara: string; steps: TransliterationStep[] } {
  const parts = parseSyllable(syllable);
  const steps: TransliterationStep[] = [];
  let result = "";

  // 1. Onset + Nucleus
  if (!parts.onset) {
    // Independent vowel
    const indep = INDEPENDENT_VOWELS[parts.nucleus];
    if (indep) {
      result += indep.char;
      stepCounter.count++;
      steps.push({
        step: stepCounter.count,
        rule: "R-INDEP-VOWEL",
        input: parts.nucleus,
        output: indep.char,
        explanation: `Vokal mandiri '${parts.nucleus}' ditulis dengan aksara dasar ${indep.name}.`
      });
    } else {
      // Fallback
      result += "\u1BC1";
      stepCounter.count++;
      steps.push({
        step: stepCounter.count,
        rule: "R-INDEP-DEFAULT",
        input: parts.nucleus,
        output: "\u1BC1",
        explanation: `Vokal '${parts.nucleus}' ditulis dengan dasar A Simalungun.`
      });
    }
  } else {
    // Consonant onset
    const base = BASE_CONSONANTS[parts.onset];
    if (base) {
      result += base.char;
      stepCounter.count++;
      steps.push({
        step: stepCounter.count,
        rule: "R-BASE-CONS",
        input: parts.onset,
        output: base.char,
        explanation: `Konsonan awal '${parts.onset}' ditulis dengan aksara dasar ${base.name}.`
      });
    } else {
      // Unknown consonant: transcribe each letter if possible or keep as is
      result += parts.onset;
    }

    // Nucleus attachment
    if (parts.nucleus === "a") {
      // Inherent vowel: no diacritic needed
      stepCounter.count++;
      steps.push({
        step: stepCounter.count,
        rule: "R-INHERENT-A",
        input: "a",
        output: "",
        explanation: "Vokal /a/ melekat inheren pada aksara dasar tanpa tanda vokal."
      });
    } else if (parts.nucleus === "i") {
      result += "\u1BEA";
      stepCounter.count++;
      steps.push({
        step: stepCounter.count,
        rule: "R-VOWEL-I",
        input: "i",
        output: "\u1BEA",
        explanation: "Vokal /i/ dibentuk dengan diakritik haluan (ᯪ)."
      });
    } else if (parts.nucleus === "u") {
      if (parts.onset === "s") {
        // Special case: Simalungun Sa + U uses U+1BEF
        result += "\u1BEF";
        stepCounter.count++;
        steps.push({
          step: stepCounter.count,
          rule: "R-VOWEL-U-SA",
          input: "su",
          output: "\u1BEF",
          explanation: "Suku kata 'su' memakai diakritik haboritan khusus Sa Simalungun (ᯯ, U+1BEF)."
        });
      } else {
        result += "\u1BEE";
        stepCounter.count++;
        steps.push({
          step: stepCounter.count,
          rule: "R-VOWEL-U",
          input: "u",
          output: "\u1BEE",
          explanation: "Vokal /u/ dibentuk dengan diakritik haboritan (ᯮ)."
        });
      }
    } else if (parts.nucleus === "e") {
      result += "\u1BE9";
      stepCounter.count++;
      steps.push({
        step: stepCounter.count,
        rule: "R-VOWEL-E",
        input: "e",
        output: "\u1BE9",
        explanation: "Vokal /e/ dibentuk dengan diakritik hatelingan (ᯩ)."
      });
    } else if (parts.nucleus === "o") {
      result += "\u1BEC";
      stepCounter.count++;
      steps.push({
        step: stepCounter.count,
        rule: "R-VOWEL-O",
        input: "o",
        output: "\u1BEC",
        explanation: "Vokal /o/ dibentuk dengan diakritik sihorlu (ᯬ)."
      });
    } else if (parts.nucleus === "ou") {
      result += "\u1BED";
      stepCounter.count++;
      steps.push({
        step: stepCounter.count,
        rule: "R-VOWEL-OU",
        input: "ou",
        output: "\u1BED",
        explanation: "Diftong khas Simalungun /-ou/ dibentuk dengan diakritik hatulungan (ᯭ)."
      });
    } else if (parts.nucleus === "ei") {
      result += "\u1BE9\u1BEA";
      stepCounter.count++;
      steps.push({
        step: stepCounter.count,
        rule: "R-VOWEL-EI",
        input: "ei",
        output: "\u1BE9\u1BEA",
        explanation: "Diftong /-ei/ dibentuk dari kombinasi hatelingan (ᯩ) dan haluan (ᯪ)."
      });
    }
  }

  // 2. Coda
  if (parts.coda) {
    if (parts.coda === "ng") {
      result += "\u1BF0";
      stepCounter.count++;
      steps.push({
        step: stepCounter.count,
        rule: "R-CODA-NG",
        input: "ng",
        output: "\u1BF0",
        explanation: "Konsonan sengau akhir /-ng/ menggunakan tanda haminsaran (ᯰ)."
      });
    } else if (parts.coda === "h") {
      result += "\u1BF1";
      stepCounter.count++;
      steps.push({
        step: stepCounter.count,
        rule: "R-CODA-H",
        input: "h",
        output: "\u1BF1",
        explanation: "Konsonan hembus akhir /-h/ menggunakan tanda hajoringan (ᯱ)."
      });
    } else {
      // General consonant coda: base char + panongonan virama
      const codaBase = BASE_CONSONANTS[parts.coda];
      if (codaBase) {
        result += codaBase.char + PANONGONAN;
        stepCounter.count++;
        steps.push({
          step: stepCounter.count,
          rule: "R-CODA-VIRAMA",
          input: parts.coda,
          output: codaBase.char + PANONGONAN,
          explanation: `Konsonan akhir '-${parts.coda}' dimatikan dengan ${codaBase.name} + panongonan (᯳).`
        });
      }
    }
  }

  return { aksara: result, steps };
}

/**
 * Transliterates full Latin Simalungun text to Aksara Batak Simalungun.
 */
export function transliterateLatinToAksara(text: string): TransliterationResult {
  const stepCounter = { count: 0 };
  const allSteps: TransliterationStep[] = [];

  // Match words and non-word separators (spaces, punctuation)
  const tokens = text.match(/[\p{L}]+|[^\p{L}\s]+|\s+/gu) || [];
  let fullAksara = "";

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      fullAksara += token;
    } else if (/^[^\p{L}]+$/u.test(token)) {
      // Punctuation
      fullAksara += token;
    } else {
      // Word: syllabify and transliterate each syllable
      const syllables = syllabifyWord(token);
      let wordAksara = "";
      for (const syl of syllables) {
        const sylRes = transliterateSyllable(syl, stepCounter);
        wordAksara += sylRes.aksara;
        allSteps.push(...sylRes.steps);
      }
      fullAksara += wordAksara;
    }
  }

  return { aksara: fullAksara, steps: allSteps };
}
