import { NextResponse } from "next/server";
import { transliterateLatinToAksara } from "@rumah-hata/linguistics";
import lexiconJson from "../../../../../../data/simalungun/lexicon.json";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, direction } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Teks wajib diisi" }, { status: 400 });
    }

    // Supported keys: DeepSeek, OpenCode, OpenRouter, OpenAI
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const apiKey =
      deepseekKey ||
      process.env.OPENCODE_API_KEY ||
      process.env.OPENROUTER_API_KEY ||
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          available: false,
          message: "Kunci API server belum dikonfigurasi di environment variable."
        },
        { status: 200 }
      );
    }

    // Intelligent provider & model auto-detection
    let defaultBaseUrl = "https://api.deepseek.com";
    let defaultModel = "deepseek-chat";

    if (deepseekKey || process.env.OPENCODE_BASE_URL?.includes("deepseek")) {
      defaultBaseUrl = "https://api.deepseek.com";
      defaultModel = "deepseek-chat";
    } else if (apiKey.startsWith("sk-or-")) {
      defaultBaseUrl = "https://openrouter.ai/api/v1";
      defaultModel = "google/gemini-2.0-flash-001";
    } else if (apiKey.startsWith("sk-")) {
      // If user sets OPENCODE_BASE_URL explicitly to deepseek, it will be overridden below.
      // Default standard OpenAI
      defaultBaseUrl = "https://api.openai.com/v1";
      defaultModel = "gpt-4o-mini";
    }

    const baseUrl =
      process.env.OPENCODE_BASE_URL ||
      process.env.DEEPSEEK_BASE_URL ||
      process.env.OPENAI_BASE_URL ||
      defaultBaseUrl;

    const model =
      process.env.OPENCODE_MODEL ||
      process.env.DEEPSEEK_MODEL ||
      process.env.OPENAI_MODEL ||
      defaultModel;

    // Inject grounding context: compact dictionary references
    const dictionaryGroundedContext = (lexiconJson as any[]).map((e) => ({
      lemma: e.lemma,
      glosses: e.glosses,
      pos: e.pos
    }));

    const systemPrompt = `Anda adalah penerjemah ahli dan presisi untuk Bahasa Indonesia dan Bahasa Batak Simalungun.
Prinsip utama:
1. AKURASI LINGUISTIK: Utamakan kosakata resmi Simalungun yang ada pada kamus acuan yang dilampirkan.
2. JANGAN MENGARANG kosakata: Jangan menyamakan aturan Simalungun dengan Toba/Karo tanpa bukti.
3. Jawab HANYA dalam format JSON valid tanpa tanda markdown.

Format output JSON:
{
  "translation": "hasil terjemahan dalam bahasa target",
  "explanation": "catatan tata bahasa singkat"
}

Kamus Acuan Baku Simalungun:
${JSON.stringify(dictionaryGroundedContext)}`;

    const userPrompt =
      direction === "id-sim"
        ? `Terjemahkan kalimat berikut dari Bahasa Indonesia ke Bahasa Batak Simalungun:\n"${text}"`
        : `Terjemahkan kalimat berikut dari Bahasa Batak Simalungun ke Bahasa Indonesia:\n"${text}"`;

    const requestBody: any = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2
    };

    // DeepSeek natively supports response_format json_object
    if (baseUrl.includes("deepseek.com")) {
      requestBody.response_format = { type: "json_object" };
    }

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedErr = errText;
      try {
        const j = JSON.parse(errText);
        parsedErr = j.error?.message || j.message || errText;
      } catch (_) {}

      return NextResponse.json(
        {
          error: "Penyedia AI menolak permintaan",
          details: parsedErr,
          providerUrl: baseUrl,
          modelUsed: model
        },
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
        explanation: "Terjemahan AI berlandaskan kamus"
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
