# 📚 Trimly AI — Smart Book & PDF Summarizer

**Trimly AI** is a powerful Next.js application that compresses and summarizes books or PDF files based on the **time** you have and the **mood** you're in.

Powered by **open-source large language models (LLMs)**, Trimly AI delivers personalized, focused summaries that help you absorb information faster and smarter.

---

## ✨ Features

- 🔍 **PDF & Book Upload** — Upload large files and extract meaningful content.
- 🧠 **Smart Summarization** — Automatically summarizes content using open-source LLMs.
- 🕐 **Time-Based Compression** — Choose how long you want to read (e.g., 5-min, 15-min summaries).
- 😌 **Mood-Adaptive Style** — Summaries adapt to your mood (e.g., casual, focused, academic).
- 📄 **PDF Export** — Download generated summaries as PDF files.
- 💡 **Local LLM Integration** — Works with self-hosted or API-based open-source models like Mistral, LLaMA, or Gemma.

---

## 📦 Tech Stack

- **Frontend**: Next.js App Router + Tailwind CSS
- **Backend**: Server Actions + Edge API Routes
- **PDF Parsing**: `pdf-parse`
- **PDF Generation**: `pdfkit`
- **LLMs**: Locally hosted models or via REST API (Ollama, LM Studio, etc.)

---

## 🚀 Getting Started

```bash
git clone https://github.com/madhavmadupu/trimly.git
cd trimly
npm install
npm run dev
```

## 🧠 How It Works

1.  **Upload a book/PDF**
    
2.  **Choose your time limit and mood**
    
3.  **Trimly AI** analyzes the content and generates a summary
    
4.  **Download or view** the output instantly
    

___

## 🛠 API Routes

-   `POST /api/extract-text`: Extract raw text from uploaded PDF
    
-   `POST /api/generate-pdf`: Generate a downloadable summary PDF
    
-   `POST /api/summarize`: (Pluggable LLM-based route for summaries)
    

___

## 📌 Roadmap

-    Support for EPUB and DOCX formats
    
-    Chrome extension for webpage summarization
    
-    Speech-to-text support for audiobooks
    
-    Offline summarization using WebAssembly LLMs
    

___

## 🧪 Demo

Coming soon...

___

## 🤝 Contributing

Pull requests welcome! If you're excited about AI, summarization, or building smart reading tools — join us.

___

## 📜 License

MIT License — use freely, contribute openly.

___

## 🔗 Acknowledgements
- [pdf-parse](https://www.npmjs.com/package/pdf-parse)
    
-   [pdfkit](https://www.npmjs.com/package/pdfkit)
    
-   [Ollama](https://ollama.ai)
    
-   [Next.js](https://nextjs.org)
