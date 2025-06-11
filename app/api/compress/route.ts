import { NextRequest, NextResponse } from "next/server"
import { Buffer } from "buffer"
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib"

export const runtime = "nodejs"

async function getPdfParser() {
    const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js")
    return pdfParse as (data: Buffer, options?: any) => Promise<{ text: string }>
}

function splitLines(
    text: string,
    font: PDFFont,
    fontSize: number,
    maxWidth: number
): string[] {
    const words = text.split(/\s+/)
    const lines: string[] = []
    let current = ""
    for (const w of words) {
        const test = current ? `${current} ${w}` : w
        if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
            current = test
        } else {
            if (current) lines.push(current)
            current = w
        }
    }
    if (current) lines.push(current)
    return lines
}

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData()
        const file = form.get("file")
        const mood = form.get("mood")
        const availableTime = form.get("availableTime")

        if (!(file instanceof File))
            return NextResponse.json({ error: "PDF file is required" }, { status: 400 })
        if (typeof mood !== "string")
            return NextResponse.json({ error: "Mood is required" }, { status: 400 })
        if (typeof availableTime !== "string")
            return NextResponse.json({ error: "Available time is required" }, { status: 400 })

        const timeMap: Record<string, number> = { quick: 3, medium: 7, detailed: 20 }
        const minutes = timeMap[availableTime] ?? 7

        const arrayBuf = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuf)
        const pdfParse = await getPdfParser()
        const { text: rawText } = await pdfParse(buffer)

        const userPrompt = `
        You are Trimly AI, a PDF summarization service.
        Mood: ${mood}
        Please compress and summarize the following text so it can be read in about ${minutes} minutes:

        ${rawText}
        `.trim();

        let summary: string
        const ollamaRes = await fetch(
            "http://127.0.0.1:11434/models/your-model/completions",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userPrompt, max_tokens: 2000, temperature: 0.7 }),
            }
        )
        if (!ollamaRes.ok) {
            const errText = await ollamaRes.text()
            throw new Error(`Ollama error: ${errText}`)
        }
        const { choices: ollamaChoices } = (await ollamaRes.json()) as { choices: { text: string }[] }
        summary = ollamaChoices[0]?.text.trim() ?? ""
        if (!summary) throw new Error("Empty summary from Ollama")

        /**
        const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are Trimly AI, an expert summarizer." },
                    { role: "user", content: userPrompt },
                ],
                max_tokens: 2000,
                temperature: 0.7,
            }),
        })

        if (!chatRes.ok) {
            const errTxt = await chatRes.text()
            throw new Error(`OpenAI error: ${errTxt}`)
        }

        const chatJson = await chatRes.json() as {
            choices: { message: { content: string } }[]
        }

        const summary = chatJson.choices[0]?.message.content.trim() ?? ""
        if (!summary) {
            throw new Error("Received empty summary from OpenAI")
        }
        */

        let clean = summary
            .replace(/-\s*\r?\n\s*/g, "")
            .replace(/\r\n/g, "\n");

        const paras = clean.split(/\n{2,}/)

        const pdfDoc = await PDFDocument.create()
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const fontSize = 12
        const lineHeight = fontSize * 1.5
        const margin = 50

        let page = pdfDoc.addPage()
        let { width, height } = page.getSize()
        let cursorY = height - margin
        const maxWidth = width - margin * 2

        for (const para of paras) {
            const text = para.replace(/\n+/g, " ").trim()
            const lines = splitLines(text, font, fontSize, maxWidth)

            for (const line of lines) {
                if (cursorY < margin + lineHeight) {
                    page = pdfDoc.addPage()
                        ; ({ width, height } = page.getSize())
                    cursorY = height - margin
                }
                page.drawText(line, {
                    x: margin,
                    y: cursorY,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                })
                cursorY -= lineHeight
            }

            cursorY -= lineHeight
        }

        const pdfBytes = await pdfDoc.save()
        const pdfBase64 = Buffer.from(pdfBytes).toString("base64")
        const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`

        const origNameNoExt = file.name.replace(/\.pdf$/i, "")
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const filename = `${origNameNoExt}-${timestamp}-by-Trimly.ai.pdf`

        return NextResponse.json({ summary, pdf: pdfDataUrl, filename })
    } catch (err: unknown) {
        console.error("[/api/compress] Error:", err)
        const msg = err instanceof Error ? err.message : "Unexpected error"
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}
