"use client"

import { useState } from "react"
import { Check, Copy, Code, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodeSnippetProps {
  code: string
  language: string
  title?: string
  description?: string
}

export function CodeSnippet({ code, language, title, description }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "sql", label: "SQL" },
  ]

  const currentLanguage = languageOptions.find((option) => option.value === language) || languageOptions[0]

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{title || currentLanguage.label}</span>
          {description && <span className="text-xs text-muted-foreground">- {description}</span>}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => setExpanded(!expanded)}>
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
          </Button>
        </div>
      </div>
      <div className={cn("transition-all duration-200", expanded ? "max-h-[500px]" : "max-h-[200px]", "overflow-auto")}>
        <pre className="p-4 text-sm font-mono overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

export function CodeSnippetEditor() {
  const [code, setCode] = useState("// Write your code here")
  const [language, setLanguage] = useState("javascript")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder="Title (optional)"
            className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Tabs defaultValue={language} onValueChange={setLanguage}>
          <TabsList className="grid grid-cols-5 h-8">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="typescript">TypeScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="p-0">
        <textarea
          className="w-full min-h-[200px] p-4 font-mono text-sm bg-background border-0 focus:outline-none resize-y"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div className="flex justify-end p-3 border-t">
        <Button className="bg-primary hover:bg-primary/90">Share Snippet</Button>
      </div>
    </div>
  )
}

