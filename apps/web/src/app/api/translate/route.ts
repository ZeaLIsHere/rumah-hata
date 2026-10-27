import { NextResponse } from "next/server";
import { transliterateLatinToAksara, syllabifyWord } from "@rumah-hata/linguistics";
import lexiconJson from "../../../../../../data/simalungun/lexicon.json";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, direction } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Teks wajib diisi" }, { status: 400 });
    }

    // Supported OpenAI-compatible keys: OPENCODE_API_KEY, OPENROUTER_API_KEY, OPENAI_API_KEY
    const apiKey =
      process.env.OPENCODE_API_KEY ||
      process.env.OPENROUTER_API_KEY ||
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          available: false,
          message: "API key server belum dikonfigurasi di environment variable."
        },
        { status: 200 }
      );
    }

    const baseUrl =
      process.env.OPENCODE_BASE_URL ||
      process.env.OPENAI_BASE_URL ||
      "https://openrouter.ai/api/v1";

    const model =
      process.env.OPENCODE_MODEL ||
      process.env.OPENAI_MODEL ||
      "google/gemini-2.0-flash-001";

    // Inject grounding context: send compact dictionary references
    const dictionaryGroundedContext = (lexiconJson as any[]).map((e) => ({
      lemma: e.lemma,
      glosses: e.glosses,
      pos: e.pos
    }));

    const systemPrompt = `Anda adalah penerjemah ahli dan presisi untuk Bahasa Indonesia dan Bahasa Batak Simalungun.
Prinsip utama:
1. AKURASI LINGUISTIK: Utamakan kosakata resmi Simalungun yang ada pada kamus acuan yang dilampirkan.
2. JANGAN MENGARANG kosakata: Jangan menyamakan aturan Simalungun dengan Toba/Karo tanpa bukti.
3. Jawab HANYA dalam format JSON valid tanpa markdown formatting.

Format output JSON:
{
  "translation": "hasil terjemahan dalam bahasa target",
  "explanation": "catatan tata bahasa singkat",
  "tokens": [
    { "word": "kata", "translation": "makna", "isKnown": true/false }
  ]
}

Kamus Acuan Baku Simalungun:
${JSON.stringify(dictionaryGroundedContext)}`;

    const userPrompt =
      direction === "id-sim"
        ? `Terjemahkan kalimat berikut dari Bahasa Indonesia ke Bahasa Batak Simalungun:\n"${text}"`
        : `Terjemahkan kalimat berikut dari Bahasa Batak Simalungun ke Bahasa Indonesia:\n"${text}"`;

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: "Gagal memproses terjemahan AI", details: errText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Parse clean JSON output
    let parsed: any;
    try {
      const cleaned = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      parsed = {
        translation: rawContent.trim(),
        explanation: "Terjemahan AI berlandaskan kamus",
        tokens: []
      };
    }

    // Generate accurate Aksara transliteration deterministically
    const simalungunText = direction === "id-sim" ? parsed.translation : text;
    const aksaraResult = transliterateLatinToAksara(simalungunText);

    return NextResponse.json({
      available: true,
      translation: parsed.translation,
      explanation: parsed.explanation,
      aksara: aksaraResult.aksara,
      transliterationSteps: aksaraResult.steps,
      provenance: "ai-grounded",
      validation: "unverified"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
