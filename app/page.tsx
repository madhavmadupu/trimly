import { PDFSummarizer } from "@/components/pdf-summarizer"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="container mx-auto py-8">
        <PDFSummarizer />
      </div>
    </div>
  )
}
