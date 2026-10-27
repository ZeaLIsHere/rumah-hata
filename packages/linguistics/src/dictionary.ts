/**
 * Dictionary & Interlinear Glossing Engine for Simalungun.
 * Follows Leipzig Glossing Rules, PRD Section 7.1, and Morphology Tier 2.
 */

import { syllabifyWord } from "./syllabifier.js";
import { transliterateLatinToAksara } from "./transliterator.js";
import { decomposeWord } from "./morphology.js";
import type {
  AnalysisResult,
  Direction,
  InterlinearAnalysis,
  LexiconEntry,
  LinguisticNote,
  PhraseEntry,
  TokenAnalysis
} from "./types.js";

/**
 * Searches the lexicon for an exact or substring match in Simalungun or Indonesian.
 */
export function searchLexicon(
  query: string,
  lexicon: LexiconEntry[],
  direction: "sim-id" | "id-sim" | "all" = "all"
): LexiconEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return lexicon.filter((entry) => {
    const lemmaMatch = entry.lemma.toLowerCase().includes(q);
    const glossMatch = entry.glosses.some((g) => g.toLowerCase().includes(q));

    if (direction === "sim-id") return lemmaMatch;
    if (direction === "id-sim") return glossMatch;
    return lemmaMatch || glossMatch;
  });
}

/**
 * Fully analyzes an input text (translates, breaks into syllables, generates interlinear gloss,
 * and attaches transliteration steps and provenance).
 */
export function analyzeText(
  input: string,
  direction: Direction,
  lexicon: LexiconEntry[],
  phrasebook: PhraseEntry[]
): AnalysisResult {
  const cleanInput = input.trim();
  const notes: LinguisticNote[] = [];

  // 1. Check exact phrasebook match
  const phraseMatch = phrasebook.find((p) => {
    if (direction === "id-sim") {
      return p.indonesian.toLowerCase() === cleanInput.toLowerCase();
    }
    return p.simalungun.toLowerCase() === cleanInput.toLowerCase();
  });

  if (phraseMatch) {
    const latin = direction === "id-sim" ? phraseMatch.simalungun : phraseMatch.simalungun;
    const transResult = transliterateLatinToAksara(latin);
    const translation = direction === "id-sim" ? phraseMatch.simalungun : phraseMatch.indonesian;

    const words = latin.split(/\s+/);
    const tokens: TokenAnalysis[] = words.map((w) => ({
      surface: w,
      lemma: w.toLowerCase(),
      pos: "phrase_element",
      gloss: translation,
      syllables: syllabifyWord(w),
      morphemes: [{ form: w, type: "root", gloss: translation }],
      aksara: transliterateLatinToAksara(w).aksara,
      provenance: "phrasebook",
      validation: phraseMatch.validation,
      sourceRefs: [phraseMatch.sourceId]
    }));

    if (phraseMatch.context) {
      notes.push({ kind: "culture", text: phraseMatch.context });
    }

    return {
      input: cleanInput,
      direction,
      latin,
      aksara: phraseMatch.aksara || transResult.aksara,
      translation,
      tokens,
      transliterationSteps: transResult.steps,
      interlinear: {
        source: cleanInput,
        segmented: words.join("-"),
        gloss: translation,
        free: translation
      },
      notes
    };
  }

  // 2. Token-by-token analysis
  const rawTokens = cleanInput.match(/[\p{L}]+|[^\p{L}\s]+|\s+/gu) || [];
  const tokenAnalyses: TokenAnalysis[] = [];
  const latinWords: string[] = [];
  const translatedWords: string[] = [];
  const glossWords: string[] = [];

  for (const rawToken of rawTokens) {
    if (/^\s+$/.test(rawToken)) {
      translatedWords.push(rawToken);
      continue;
    }

    // Pass through non-letter tokens (numbers, punctuation, symbols like -=+!@#$%, 123)
    if (/^[^\p{L}]+$/u.test(rawToken)) {
      latinWords.push(rawToken);
      translatedWords.push(rawToken);
      glossWords.push(rawToken);
      continue;
    }

    const lower = rawToken.toLowerCase();
    latinWords.push(rawToken);

    // Look up in dictionary
    let foundEntry: LexiconEntry | undefined;
    if (direction === "id-sim") {
      foundEntry = lexicon.find((e) =>
        e.glosses.some((g) => g.toLowerCase() === lower)
      );
    } else {
      foundEntry = lexicon.find((e) => e.lemma.toLowerCase() === lower);
    }

    if (foundEntry) {
      const surfaceAksara = transliterateLatinToAksara(foundEntry.lemma).aksara;
      const transGloss =
        direction === "id-sim"
          ? foundEntry.lemma
          : foundEntry.glosses[0] || foundEntry.lemma;

      translatedWords.push(transGloss);
      glossWords.push(transGloss.toUpperCase());

      tokenAnalyses.push({
        surface: rawToken,
        lemma: foundEntry.lemma,
        pos: foundEntry.pos,
        gloss: transGloss,
        syllables: syllabifyWord(direction === "id-sim" ? foundEntry.lemma : rawToken),
        morphemes: [
          {
            form: foundEntry.morphology?.root || foundEntry.lemma,
            type: "root",
            gloss: transGloss
          }
        ],
        aksara: surfaceAksara,
        provenance: "dictionary",
        validation: foundEntry.validation,
        sourceRefs: foundEntry.sourceIds
      });

      if (foundEntry.culturalNote) {
        notes.push({ kind: "culture", text: foundEntry.culturalNote });
      }
    } else {
      // Direct dictionary lookup failed. Try Morphology Tier 2 (affix analysis)
      const morph = decomposeWord(rawToken, lexicon);

      if (morph && morph.rootEntry) {
        const rootEntry = morph.rootEntry;
        const surfaceAksara = transliterateLatinToAksara(rawToken).aksara;
        const rootGloss = rootEntry.glosses[0] || rootEntry.lemma;

        // Build combined gloss: e.g. "INTR-simalungun" or "ber-bahasa Simalungun"
        const morphGloss = `${morph.morphemes.map((m) => m.gloss).join("-")}`;
        translatedWords.push(`(${rootGloss})`);
        glossWords.push(morphGloss);

        tokenAnalyses.push({
          surface: rawToken,
          lemma: rootEntry.lemma,
          pos: rootEntry.pos ? `derived_${rootEntry.pos}` : "derived",
          gloss: morphGloss,
          syllables: syllabifyWord(rawToken),
          morphemes: morph.morphemes,
          aksara: surfaceAksara,
          provenance: "rule",
          validation: rootEntry.validation,
          sourceRefs: rootEntry.sourceIds
        });

        notes.push({
          kind: "morphology",
          text: `Kata '${rawToken}' diurai morfologis ke lema dasar '${rootEntry.lemma}' dengan afiksasi (${morph.morphemes.map((m) => m.form).join(" + ")}).`
        });
      } else {
        // Unknown token
        const isSim = direction === "sim-id" || direction === "sim-aksara";
        const tokenAksara = isSim ? transliterateLatinToAksara(rawToken).aksara : "";

        translatedWords.push(`[${rawToken}]`);
        glossWords.push("?");

        tokenAnalyses.push({
          surface: rawToken,
          lemma: null,
          pos: null,
          gloss: null,
          syllables: isSim ? syllabifyWord(rawToken) : [],
          morphemes: [{ form: rawToken, type: "root", gloss: "?" }],
          aksara: tokenAksara,
          provenance: isSim ? "rule" : "unknown",
          validation: "unverified",
          sourceRefs: []
        });

        notes.push({
          kind: "warning",
          text: `Kata '${rawToken}' belum terdaftar di leksikon tervalidasi.`
        });
      }
    }
  }

  // Determine full Latin and Aksara outputs
  let finalLatin = "";
  let finalAksara = "";
  let finalTranslation = "";

  if (direction === "id-sim") {
    finalLatin = translatedWords.join("");
    finalAksara = transliterateLatinToAksara(finalLatin).aksara;
    finalTranslation = finalLatin;
  } else if (direction === "sim-id") {
    finalLatin = cleanInput;
    finalAksara = transliterateLatinToAksara(cleanInput).aksara;
    finalTranslation = translatedWords.join("");
  } else {
    // sim-aksara
    finalLatin = cleanInput;
    finalAksara = transliterateLatinToAksara(cleanInput).aksara;
    finalTranslation = cleanInput;
  }

  const fullTranslit = transliterateLatinToAksara(
    direction === "id-sim" ? finalLatin : cleanInput
  );

  const interlinear: InterlinearAnalysis = {
    source: latinWords.join(" "),
    segmented: tokenAnalyses.map((t) => t.syllables.join("-") || t.surface).join(" "),
    gloss: glossWords.join(" "),
    free: finalTranslation
  };

  return {
    input: cleanInput,
    direction,
    latin: finalLatin,
    aksara: finalAksara,
    translation: finalTranslation,
    tokens: tokenAnalyses,
    transliterationSteps: fullTranslit.steps,
    interlinear,
    notes
  };
}
