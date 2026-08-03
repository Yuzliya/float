import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const baseUrl = String(body.baseUrl || "").replace(/\/+$/, "");
    const apiKey = String(body.apiKey || "");
    const model = String(body.model || "moss-tts");
    const input = String(body.input || "");
    const voice = String(body.voice || "default");

    if (!baseUrl || !apiKey || !input) {
      return NextResponse.json(
        { error: "baseUrl、apiKey、input 不能为空" },
        { status: 400 }
      );
    }

    const upstream = await fetch(`${baseUrl}/audio/speech`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input,
        voice,
        response_format: "mp3",
      }),
    });

    const data = await upstream.arrayBuffer();

    return new NextResponse(data, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "audio/mpeg",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "TTS 请求失败" },
      { status: 500 }
    );
  }
}
