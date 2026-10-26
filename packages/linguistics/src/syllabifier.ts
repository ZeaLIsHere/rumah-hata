/**
 * Simalungun Syllabifier (Silabifikasi Simalungun)
 * Per Saragih (1989) & Tarigan (1989).
 */

const DIGRAPHS = ["ng", "ny"];
const DIPHTHONGS = ["ou", "ei"];

export interface SyllablePart {
  onset: string;
  nucleus: string;
  coda: string;
}

/**
 * Break a single word into syllables.
 */
export function syllabifyWord(rawWord: string): string[] {
  const word = rawWord.trim().toLowerCase();
  if (!word) return [];

  // Match vowel centers (including diphthongs ou, ei)
  interface NucleusMatch {
    vowel: string;
    start: number;
    end: number;
  }

  const nuclei: NucleusMatch[] = [];
  let i = 0;
  while (i < word.length) {
    // Check diphthongs
    const two = word.slice(i, i + 2);
    if (DIPHTHONGS.includes(two)) {
      nuclei.push({ vowel: two, start: i, end: i + 2 });
      i += 2;
      continue;
    }
    // Single vowel
    if ("aiueo".includes(word[i])) {
      nuclei.push({ vowel: word[i], start: i, end: i + 1 });
      i += 1;
      continue;
    }
    i += 1;
  }

  // If no vowel found (e.g. abbreviation or non-word), return whole word
  if (nuclei.length === 0) {
    return [word];
  }

  // If only 1 vowel, whole word is 1 syllable
  if (nuclei.length === 1) {
    return [word];
  }

  // Find split points between consecutive nuclei
  const splitIndices: number[] = [];

  for (let k = 0; k < nuclei.length - 1; k++) {
    const currentNucleus = nuclei[k];
    const nextNucleus = nuclei[k + 1];

    const consonantsBetween = word.slice(currentNucleus.end, nextNucleus.start);
    const startOffset = currentNucleus.end;

    if (consonantsBetween.length === 0) {
      // V-V hiatus (e.g. "di-a-tei", "hu-a") -> split directly between vowels
      splitIndices.push(nextNucleus.start);
    } else {
      // Analyze consonants between vowels
      const tokens: string[] = [];
      let cIdx = 0;
      while (cIdx < consonantsBetween.length) {
        const dig = consonantsBetween.slice(cIdx, cIdx + 2);
        if (DIGRAPHS.includes(dig)) {
          tokens.push(dig);
          cIdx += 2;
        } else {
          tokens.push(consonantsBetween[cIdx]);
          cIdx += 1;
        }
      }

      if (tokens.length === 1) {
        // 1 consonant (or digraph like 'ng') -> belongs to onset of next syllable (V-CV)
        splitIndices.push(startOffset);
      } else {
        // 2 or more consonants -> first token to coda, rest to onset (VC-CV)
        const firstTokenLen = tokens[0].length;
        splitIndices.push(startOffset + firstTokenLen);
      }
    }
  }

  // Slice syllables using splitIndices
  const syllables: string[] = [];
  let prev = 0;
  for (const s of splitIndices) {
    syllables.push(word.slice(prev, s));
    prev = s;
  }
  syllables.push(word.slice(prev));

  return syllables;
}

/**
 * Split a syllable into Onset, Nucleus, and Coda.
 */
export function parseSyllable(syllable: string): SyllablePart {
  const syl = syllable.toLowerCase();

  // Find nucleus
  let nStart = -1;
  let nEnd = -1;
  let nText = "";

  for (let i = 0; i < syl.length; i++) {
    const two = syl.slice(i, i + 2);
    if (DIPHTHONGS.includes(two)) {
      nStart = i;
      nEnd = i + 2;
      nText = two;
      break;
    }
    if ("aiueo".includes(syl[i])) {
      nStart = i;
      nEnd = i + 1;
      nText = syl[i];
      break;
    }
  }

  if (nStart === -1) {
    return { onset: syl, nucleus: "", coda: "" };
  }

  const onset = syl.slice(0, nStart);
  const coda = syl.slice(nEnd);

  return { onset, nucleus: nText, coda };
}
