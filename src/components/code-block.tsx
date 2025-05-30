"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow, prism } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeBlockProps {
  code: string
  language: string
  theme: string
}

export default function CodeBlock({ code, language, theme }: CodeBlockProps) {
  // Custom theme for dark mode
  const darkTheme = {
    ...tomorrow,
    'pre[class*="language-"]': {
      ...tomorrow['pre[class*="language-"]'],
      background: "#2C2E3E",
      color: "#63718B",
      fontSize: "0.875rem",
      lineHeight: "1.5",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    'code[class*="language-"]': {
      ...tomorrow['code[class*="language-"]'],
      background: "#2C2E3E",
      color: "#63718B",
      fontSize: "0.875rem",
      lineHeight: "1.5",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    comment: { color: "#B1DBA4", fontStyle: "italic" },
    keyword: { color: "#F6BBE7", fontWeight: "bold" },
    function: { color: "#CDDBF9" },
    number: { color: "#E6DFB8" },
    string: { color: "#EBB9B9" },
    operator: { color: "#C6D0E9" },
    punctuation: { color: "#63718B" },
    property: { color: "#CDDBF9" },
    builtin: { color: "#CDDBF9" },
    variable: { color: "#C6D0E9" },
  }

  // Custom theme for light mode
  const lightTheme = {
    ...prism,
    'pre[class*="language-"]': {
      ...prism['pre[class*="language-"]'],
      background: "#F8F9FA",
      color: "#708190",
      fontSize: "0.875rem",
      lineHeight: "1.5",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      border: "1px solid #D5D4E0",
    },
    'code[class*="language-"]': {
      ...prism['code[class*="language-"]'],
      background: "#F8F9FA",
      color: "#708190",
      fontSize: "0.875rem",
      lineHeight: "1.5",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    comment: { color: "#7D9685", fontStyle: "italic" },
    keyword: { color: "#8787BF", fontWeight: "bold" },
    function: { color: "#6A8CBC" },
    number: { color: "#DE956F" },
    string: { color: "#C34864" },
    operator: { color: "#313449" },
    punctuation: { color: "#708190" },
    property: { color: "#6A8CBC" },
    builtin: { color: "#6A8CBC" },
    variable: { color: "#313449" },
  }

  const selectedTheme = theme === "dark" ? darkTheme : lightTheme

  return (
    <div className="code-block">
      <SyntaxHighlighter
        language="glsl"
        style={selectedTheme}
        customStyle={{
          margin: 0,
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
