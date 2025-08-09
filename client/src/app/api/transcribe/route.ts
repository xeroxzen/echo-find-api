import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    let audioFile = formData.get("file") as File | null;
    if (!audioFile) {
      audioFile = formData.get("audio") as File | null;
    }

    if (!audioFile) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    const upstream = new FormData();
    // Use the received blob directly
    upstream.append(
      "file",
      audioFile,
      audioFile.name || `audio-${Date.now()}.wav`
    );
    upstream.append("model", process.env.WHISPER_MODEL || "whisper-1");
    upstream.append("response_format", "verbose_json");
    if (process.env.WHISPER_LANGUAGE) {
      upstream.append("language", process.env.WHISPER_LANGUAGE);
    }
    // Ask for word-level timestamps when possible (OpenAI accepts either variant)
    upstream.append("timestamp_granularities[]", "word");
    upstream.append("timestamp_granularities", "word");

    const resp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: upstream,
    });

    if (!resp.ok) {
      let detail: any = undefined;
      try {
        detail = await resp.json();
      } catch {}
      return NextResponse.json(
        { error: "Transcription failed", detail },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to transcribe", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
