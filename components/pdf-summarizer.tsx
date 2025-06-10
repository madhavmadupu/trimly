"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Loader2, AlertCircle, Settings } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function PDFSummarizer() {
    const [file, setFile] = useState<File | null>(null)
    const [summary, setSummary] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [mood, setMood] = useState("professional")
    const [availableTime, setAvailableTime] = useState("medium")
    const [showParameters, setShowParameters] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setError("Please select a PDF file")
                return
            }
            setFile(selectedFile)
            setError("")
            setSummary("")
            setShowParameters(true) // Show parameters after file upload
        }
    }

    const handleSummarize = async () => {
        if (!file) {
            setError("Please select a PDF file first")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("mood", mood)
            formData.append("availableTime", availableTime)

            const response = await fetch("/api/summarize", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to summarize PDF")
            }

            setSummary(data.summary)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setFile(null)
        setSummary("")
        setError("")
        setShowParameters(false)
        setMood("professional")
        setAvailableTime("medium")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const moodOptions = [
        { value: "professional", label: "Professional", description: "Formal, business-appropriate tone" },
        { value: "casual", label: "Casual", description: "Conversational and friendly" },
        { value: "academic", label: "Academic", description: "Scholarly with analytical depth" },
        { value: "creative", label: "Creative", description: "Engaging with storytelling elements" },
    ]

    const timeOptions = [
        { value: "quick", label: "Quick Read (2-3 min)", description: "Essential points only" },
        { value: "medium", label: "Medium Read (5-10 min)", description: "Balanced overview" },
        { value: "detailed", label: "Detailed Read (15+ min)", description: "Comprehensive analysis" },
    ]

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Trimly AI</h1>
                <p className="text-muted-foreground">Upload a PDF document and get a personalized AI-generated summary</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload PDF
                    </CardTitle>
                    <CardDescription>
                        Select a PDF file to summarize. You'll be able to customize the summary style and length.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="pdf-upload">PDF File</Label>
                        <Input
                            id="pdf-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="cursor-pointer"
                        />
                    </div>

                    {file && (
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {showParameters && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Customize Your Summary
                        </CardTitle>
                        <CardDescription>
                            Choose how you'd like your summary to be written and how detailed it should be.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="mood-select">Summary Mood</Label>
                                <Select value={mood} onValueChange={setMood}>
                                    <SelectTrigger id="mood-select">
                                        <SelectValue placeholder="Select mood" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {moodOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{option.label}</span>
                                                    <span className="text-xs text-muted-foreground">{option.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="time-select">Available Reading Time</Label>
                                <Select value={availableTime} onValueChange={setAvailableTime}>
                                    <SelectTrigger id="time-select">
                                        <SelectValue placeholder="Select reading time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{option.label}</span>
                                                    <span className="text-xs text-muted-foreground">{option.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleSummarize} disabled={!file || isLoading} className="flex-1">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating Summary...
                                    </>
                                ) : (
                                    "Generate Custom Summary"
                                )}
                            </Button>
                            <Button variant="outline" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {summary && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Personalized Summary</CardTitle>
                        <CardDescription>
                            Generated with {moodOptions.find((m) => m.value === mood)?.label.toLowerCase()} tone •{" "}
                            {timeOptions.find((t) => t.value === availableTime)?.label.toLowerCase()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={summary}
                            readOnly
                            className="min-h-[300px] resize-none"
                            placeholder="Summary will appear here..."
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => navigator.clipboard.writeText(summary)}>
                                Copy Summary
                            </Button>
                            <Button variant="outline" onClick={() => setShowParameters(true)}>
                                Regenerate with Different Settings
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
