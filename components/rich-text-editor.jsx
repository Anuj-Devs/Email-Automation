"use client"

import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"

// dynamic import to ensure it only loads on the client
const ReactQuill = dynamic(
  async () => {
    const mod = await import("react-quill")
    return mod.default
  },
  {
    ssr: false,
    loading: () => <div className="h-40 w-full animate-pulse rounded-xl bg-muted/50" aria-label="Loading editor" />,
  },
)

export function RichTextEditor({ value, onChange, label }) {
  // Quill toolbar and formats (full-featured set)
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "clean"],
    ],
    clipboard: { matchVisual: true },
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
  ]

  return (
    <div className="space-y-2">
      {label ? <label className="text-sm text-muted-foreground">{label}</label> : null}
      <Card className="overflow-hidden rounded-2xl border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40">
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={onChange}
          modules={modules}
          formats={formats}
          className="rte-quill"
        />
      </Card>
    </div>
  )
}
