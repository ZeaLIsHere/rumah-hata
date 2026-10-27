import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  syllabifyWord,
  transliterateLatinToAksara,
  analyzeText,
  decomposeWord
} from "../src/index.js";
import type { GoldCase, LexiconEntry, PhraseEntry } from "../src/types.js";

const goldSetPath = path.resolve(__dirname, "../../../data/simalungun/gold-set.json");
const lexiconPath = path.resolve(__dirname, "../../../data/simalungun/lexicon.json");
const phrasebookPath = path.resolve(__dirname, "../../../data/simalungun/phrasebook.json");

const goldSet: GoldCase[] = JSON.parse(fs.readFileSync(goldSetPath, "utf-8"));
const lexicon: LexiconEntry[] = JSON.parse(fs.readFileSync(lexiconPath, "utf-8"));
const phrasebook: PhraseEntry[] = JSON.parse(fs.readFileSync(phrasebookPath, "utf-8"));

describe("Simalungun Gold Set Transliteration Suite", () => {
  for (const item of goldSet) {
    it(`[${item.id}] ${item.latin} -> ${item.description}`, () => {
      // 1. Verify syllabification
      const syllables = syllabifyWord(item.latin);
      expect(syllables).toEqual(item.syllables);

      // 2. Verify deterministic transliteration
      const result = transliterateLatinToAksara(item.latin);
      expect(result.aksara).toBe(item.aksara);

      // 3. Verify step-by-step audit trail is generated
      expect(result.steps.length).toBeGreaterThan(0);
      for (const step of result.steps) {
        expect(step.rule).toBeDefined();
        expect(step.explanation.length).toBeGreaterThan(5);
      }
    });
  }
});

describe("Simalungun Morphology & Analyzer Suite", () => {
  it("decomposes prefix mar- + simalungun", () => {
    const morph = decomposeWord("marsimalungun", lexicon);
    expect(morph).not.toBeNull();
    expect(morph?.lemma).toBe("simalungun");
    expect(morph?.prefixes).toContain("mar");
    expect(morph?.morphemes.some((m) => m.gloss === "INTR")).toBe(true);
  });

  it("decomposes circumfix ha-...-on in habonaron", () => {
    const morph = decomposeWord("habonaron", lexicon);
    expect(morph).not.toBeNull();
    expect(morph?.lemma).toBe("bonar");
    expect(morph?.circumfixes).toContain("ha-...-on");
  });

  it("decomposes nasal assimilation man- + surat -> manurat", () => {
    const morph = decomposeWord("manurat", lexicon);
    expect(morph).not.toBeNull();
    expect(morph?.lemma).toBe("surat");
    expect(morph?.morphemes[0].gloss).toBe("ACT");
  });

  it("analyzes sentence with derived word, assigning rule provenance", () => {
    const analysis = analyzeText("marsimalungun", "sim-id", lexicon, phrasebook);
    expect(analysis.tokens[0].lemma).toBe("simalungun");
    expect(analysis.tokens[0].provenance).toBe("rule");
    expect(analysis.tokens[0].validation).toBe("expert");
    expect(analysis.notes.some((n) => n.kind === "morphology")).toBe(true);
  });

  it("preserves numbers and special symbols in translation output", () => {
    const analysis = analyzeText("horas 123 !@#", "sim-id", lexicon, phrasebook);
    expect(analysis.translation).toContain("123");
    expect(analysis.translation).toContain("!@#");
  });
});
