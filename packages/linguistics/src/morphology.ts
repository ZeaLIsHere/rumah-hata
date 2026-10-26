/**
 * Simalungun Morphological Affix Analyzer.
 * Per Saragih dkk. (1989) "Struktur Bahasa Simalungun".
 */

import type { LexiconEntry, Morpheme } from "./types.js";

export interface MorphDecomposition {
  surface: string;
  lemma: string;
  rootEntry: LexiconEntry | null;
  prefixes: string[];
  suffixes: string[];
  circumfixes: string[];
  morphemes: Morpheme[];
}

/**
 * Common Simalungun affixes and their linguistic glosses
 */
const PREFIX_MAP: Record<string, { gloss: string; type: Morpheme["type"] }> = {
  mar: { gloss: "INTR", type: "prefix" },
  tar: { gloss: "POT", type: "prefix" },
  di: { gloss: "PASS", type: "prefix" },
  par: { gloss: "AGENT", type: "prefix" },
  pa: { gloss: "CAUS", type: "prefix" },
  ha: { gloss: "NOM", type: "prefix" }
};

const SUFFIX_MAP: Record<string, { gloss: string; type: Morpheme["type"] }> = {
  hon: { gloss: "APPL", type: "suffix" },
  an: { gloss: "LOC", type: "suffix" },
  on: { gloss: "NOM", type: "suffix" }
};

/**
 * Attempts morphological decomposition of a surface word against verified lexicon.
 */
export function decomposeWord(
  surfaceWord: string,
  lexicon: LexiconEntry[]
): MorphDecomposition | null {
  const word = surfaceWord.toLowerCase().trim();
  if (!word || word.length < 3) return null;

  // 1. Direct match check
  const exact = lexicon.find((e) => e.lemma.toLowerCase() === word);
  if (exact) {
    // If the entry explicitly defines derived root, unpack it
    if (exact.morphology?.type === "derived" && exact.morphology.root) {
      const rootCand = exact.morphology.root;
      const rootEntry = lexicon.find((e) => e.lemma.toLowerCase() === rootCand) || exact;
      return {
        surface: surfaceWord,
        lemma: rootCand,
        rootEntry,
        prefixes: [],
        suffixes: [],
        circumfixes: exact.morphology.affixes || [],
        morphemes: [
          {
            form: (exact.morphology.affixes || []).join("-"),
            type: "prefix",
            gloss: "NOM"
          },
          {
            form: rootCand,
            type: "root",
            gloss: rootEntry.glosses[0] || rootCand
          }
        ]
      };
    }

    return {
      surface: surfaceWord,
      lemma: exact.lemma,
      rootEntry: exact,
      prefixes: [],
      suffixes: [],
      circumfixes: [],
      morphemes: [
        {
          form: exact.lemma,
          type: "root",
          gloss: exact.glosses[0] || exact.lemma
        }
      ]
    };
  }

  // 2. Circumfix check: ha-...-on
  if (word.startsWith("ha") && word.endsWith("on") && word.length > 5) {
    const candidateRoot = word.slice(2, -2); // e.g. habonaron -> bonar
    const rootEntry = lexicon.find((e) => e.lemma.toLowerCase() === candidateRoot);
    if (rootEntry) {
      return {
        surface: surfaceWord,
        lemma: rootEntry.lemma,
        rootEntry,
        prefixes: [],
        suffixes: [],
        circumfixes: ["ha-...-on"],
        morphemes: [
          { form: "ha-...-on", type: "prefix", gloss: "NOM" },
          { form: candidateRoot, type: "root", gloss: rootEntry.glosses[0] || candidateRoot }
        ]
      };
    }
  }

  // 3. Prefix + Suffix check (e.g. mar-...-hon)
  for (const [pre, preInfo] of Object.entries(PREFIX_MAP)) {
    if (word.startsWith(pre)) {
      const rest = word.slice(pre.length);

      // Check with suffix
      for (const [suf, sufInfo] of Object.entries(SUFFIX_MAP)) {
        if (rest.endsWith(suf) && rest.length > suf.length + 2) {
          const rootCand = rest.slice(0, -suf.length);
          const rootEntry = lexicon.find((e) => e.lemma.toLowerCase() === rootCand);
          if (rootEntry) {
            return {
              surface: surfaceWord,
              lemma: rootEntry.lemma,
              rootEntry,
              prefixes: [pre],
              suffixes: [suf],
              circumfixes: [],
              morphemes: [
                { form: pre + "-", type: preInfo.type, gloss: preInfo.gloss },
                { form: rootCand, type: "root", gloss: rootEntry.glosses[0] || rootCand },
                { form: "-" + suf, type: sufInfo.type, gloss: sufInfo.gloss }
              ]
            };
          }
        }
      }

      // Check prefix alone
      const rootEntry = lexicon.find((e) => e.lemma.toLowerCase() === rest);
      if (rootEntry) {
        return {
          surface: surfaceWord,
          lemma: rootEntry.lemma,
          rootEntry,
          prefixes: [pre],
          suffixes: [],
          circumfixes: [],
          morphemes: [
            { form: pre + "-", type: preInfo.type, gloss: preInfo.gloss },
            { form: rest, type: "root", gloss: rootEntry.glosses[0] || rest }
          ]
        };
      }
    }
  }

  // 4. Suffix alone check (-hon, -an)
  for (const [suf, sufInfo] of Object.entries(SUFFIX_MAP)) {
    if (word.endsWith(suf) && word.length > suf.length + 2) {
      const rest = word.slice(0, -suf.length);
      const rootEntry = lexicon.find((e) => e.lemma.toLowerCase() === rest);
      if (rootEntry) {
        return {
          surface: surfaceWord,
          lemma: rootEntry.lemma,
          rootEntry,
          prefixes: [],
          suffixes: [suf],
          circumfixes: [],
          morphemes: [
            { form: rest, type: "root", gloss: rootEntry.glosses[0] || rest },
            { form: "-" + suf, type: sufInfo.type, gloss: sufInfo.gloss }
          ]
        };
      }
    }
  }

  // 5. Nasal assimilation check (maN- prefix):
  // manurat -> surat (n -> s)
  // mamikir -> pikir (m -> p)
  if (word.startsWith("man") && word.length > 4) {
    const cand = "s" + word.slice(3);
    const rootEntry = lexicon.find((e) => e.lemma.toLowerCase() === cand);
    if (rootEntry) {
      return {
        surface: surfaceWord,
        lemma: rootEntry.lemma,
        rootEntry,
        prefixes: ["man-"],
        suffixes: [],
        circumfixes: [],
        morphemes: [
          { form: "maN-", type: "prefix", gloss: "ACT" },
          { form: cand, type: "root", gloss: rootEntry.glosses[0] || cand }
        ]
      };
    }
  }

  if (word.startsWith("mam") && word.length > 4) {
    const cand = "p" + word.slice(3);
    const rootEntry = lexicon.find((e) => e.lemma.toLowerCase() === cand);
    if (rootEntry) {
      return {
        surface: surfaceWord,
        lemma: rootEntry.lemma,
        rootEntry,
        prefixes: ["mam-"],
        suffixes: [],
        circumfixes: [],
        morphemes: [
          { form: "maN-", type: "prefix", gloss: "ACT" },
          { form: cand, type: "root", gloss: rootEntry.glosses[0] || cand }
        ]
      };
    }
  }

  return null;
}
