/**
 * Schema types for Rumah Hata linguistic engine.
 * Defined per PRD Section 7.1 and AGENT.md Section 4.
 */

export type Direction = "id-sim" | "sim-id" | "sim-aksara";

export type Provenance =
  | "dictionary"
  | "phrasebook"
  | "rule"
  | "ai-grounded"
  | "unknown";

export type ValidationStatus = "unverified" | "community" | "expert";

export type MorphemeType = "root" | "prefix" | "suffix" | "infix" | "redup";

export interface Morpheme {
  form: string;
  type: MorphemeType;
  gloss: string;
}

export interface TokenAnalysis {
  surface: string;
  lemma: string | null;
  pos: string | null;
  gloss: string | null;
  syllables: string[];
  morphemes: Morpheme[];
  aksara: string;
  provenance: Provenance;
  validation: ValidationStatus;
  sourceRefs: string[];
}

export interface TransliterationStep {
  step: number;
  rule: string;
  input: string;
  output: string;
  explanation: string;
}

export interface InterlinearAnalysis {
  source: string;
  segmented: string;
  gloss: string;
  free: string;
}

export interface LinguisticNote {
  kind: "culture" | "phonology" | "morphology" | "warning";
  text: string;
}

export interface AnalysisResult {
  input: string;
  direction: Direction;
  latin: string;
  aksara: string;
  translation: string;
  tokens: TokenAnalysis[];
  transliterationSteps: TransliterationStep[];
  interlinear: InterlinearAnalysis;
  notes: LinguisticNote[];
}

export interface LexiconEntry {
  id: string;
  lemma: string;
  pos: string;
  glosses: string[];
  aksara: string;
  morphology?: {
    type: string;
    root: string;
    affixes?: string[];
  };
  examples: Array<{
    simalungun: string;
    indonesian: string;
    aksara: string;
  }>;
  culturalNote?: string;
  sourceIds: string[];
  validation: ValidationStatus;
}

export interface PhraseEntry {
  id: string;
  simalungun: string;
  indonesian: string;
  aksara: string;
  context?: string;
  sourceId: string;
  validation: ValidationStatus;
}

export interface GoldCase {
  id: string;
  latin: string;
  aksara: string;
  syllables: string[];
  description: string;
  sourceId: string;
}
