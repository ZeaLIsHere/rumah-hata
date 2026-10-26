import type {
  GoldCase,
  LexiconEntry,
  PhraseEntry
} from "@rumah-hata/linguistics";

// Import canonical linguistic datasets
import lexiconJson from "../../../../data/simalungun/lexicon.json";
import phrasebookJson from "../../../../data/simalungun/phrasebook.json";
import aksaraRulesJson from "../../../../data/simalungun/aksara-rules.json";
import sourcesJson from "../../../../data/simalungun/sources.json";
import goldSetJson from "../../../../data/simalungun/gold-set.json";

export const simalungunLexicon = lexiconJson as LexiconEntry[];
export const simalungunPhrasebook = phrasebookJson as PhraseEntry[];
export const simalungunAksaraRules = aksaraRulesJson;
export const simalungunSources = sourcesJson;
export const simalungunGoldSet = goldSetJson as GoldCase[];
