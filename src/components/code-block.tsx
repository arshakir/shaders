"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow, prism } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Fira_Code } from 'next/font/google'

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira-code',
})


interface CodeBlockProps {
  code: string
  language: string
  theme: string
}

export default function CodeBlock({ code, language, theme }: CodeBlockProps) {
  // Enhanced dark theme
  const darkTheme = {
    ...tomorrow,
    'pre[class*="language-"]': {
      ...tomorrow['pre[class*="language-"]'],
      background: "#20202a",
      color: "#63718B",
      fontSize: "0.875rem",
      lineHeight: "1.6",
      fontFamily: "var(--font-fira-code), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      padding: "1.5rem",
      borderRadius: "0.75rem",
      border: "1px solid #44495e",
      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    'code[class*="language-"]': {
      ...tomorrow['code[class*="language-"]'],
      background: "#20202a",
      color: "#C6D0E9",
      fontSize: "0.875rem",
      lineHeight: "1.6",
      fontFamily: "var(--font-fira-code), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    comment: { color: "#3b3b4d", fontStyle: "italic" },
    keyword: { color: "#F6BBE7", fontWeight: "600" },
    function: { color: "#CDDBF9" },
    number: { color: "#E6DFB8" },
    string: { color: "#B1DBA4" },
    operator: { color: "#C6D0E9" },
    punctuation: { color: "#C6D0E9" },
    property: { color: "#CDDBF9" },
    builtin: { color: "#B8DEEB" },
    variable: { color: "#C6D0E9" },
  }

  // Enhanced light theme
  const lightTheme = {
    ...prism,
    'pre[class*="language-"]': {
      ...prism['pre[class*="language-"]'],
      background: "#E6E6F1",
      color: "#708190",
      fontSize: "0.875rem",
      lineHeight: "1.6",
      fontFamily: "var(--font-fira-code), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      padding: "1.5rem",
      borderRadius: "0.75rem",
      border: "1px solid #CCCBD9",
      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
    },
    'code[class*="language-"]': {
      ...prism['code[class*="language-"]'],
      background: "#E6E6F1",
      color: "#708190",
      fontSize: "0.875rem",
      lineHeight: "1.6",
      fontFamily: "var(--font-fira-code), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    comment: { color: "#9CA6B9", fontStyle: "italic" },
    keyword: { color: "#8787BF", fontWeight: "600" },
    function: { color: "#6A8CBC" },
    number: { color: "#DE956F" },
    string: { color: "#7D9685" },
    operator: { color: "#708190" },
    punctuation: { color: "#414560" },
    property: { color: "#6A8CBC" },
    builtin: { color: "#7170C2" },
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
          borderRadius: "0.75rem",
          fontSize: "0.875rem",
          lineHeight: "1.6",
          maxHeight: "none",
          overflow: "visible",
        }}
        wrapLines={true}
        wrapLongLines={true}
        showLineNumbers={true}
        lineNumberStyle={{
          color: theme === "dark" ? "#565f89" : "#71717a",
          fontSize: "0.75rem",
          paddingRight: "1rem",
          minWidth: "3rem",
          textAlign: "right",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
