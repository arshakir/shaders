"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Github, Linkedin, Mail, Play, Pause, ExternalLink, Moon, Sun, Code2, Monitor, X } from "lucide-react"
import ShaderCanvas from "@/components/shader-canvas"
import CodeBlock from "@/components/code-block"
import { useTheme } from "@/components/theme-provider"

import {cubeish} from "@/shaders/cubeish"
import {endless_tunnel} from '@/shaders/endless_tunnel'
import {time_warden} from '@/shaders/time_warden'
import {tree} from '@/shaders/tree'

const prologue = `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;
`

const epilogue = `
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}`

// Sample shader data - replace with your actual shaders
const shaders = [
  {
    id: 1,
    title: "Cubeish",
    description: "A mesmerizing plasma effect with flowing waves and vibrant colors that shift through the spectrum.",
    tags: ["Animation", "Plasma", "Waves"],
    shadertoyUrl: "https://www.shadertoy.com/view/XfyBDW",
    fragmentShader: cubeish,
    createdDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Fractal Mandelbrot",
    description: "Classic Mandelbrot set fractal with smooth coloring and zoom capabilities.",
    tags: ["Fractal", "Mathematics", "Mandelbrot"],
    shadertoyUrl: "https://www.shadertoy.com/view/your-mandelbrot-shader-id",
    fragmentShader: endless_tunnel,
    createdDate: "2024-01-10",
  },
  {
    id: 3,
    title: "Noise Terrain",
    description: "Procedural terrain generation using Perlin noise with dynamic lighting and shadows.",
    tags: ["Noise", "Terrain", "Procedural"],
    shadertoyUrl: "https://www.shadertoy.com/view/your-terrain-shader-id",
    fragmentShader: time_warden,
    createdDate: "2024-01-05",
  },
  {
    id: 4,
    title: "Noise Terrain",
    description: "Procedural terrain generation using Perlin noise with dynamic lighting and shadows.",
    tags: ["Noise", "Terrain", "Procedural"],
    shadertoyUrl: "https://www.shadertoy.com/view/your-terrain-shader-id",
    fragmentShader: tree,
    createdDate: "2024-01-05",
  },
]

shaders.reverse();

export default function ShaderPortfolio() {
  const [selectedShader, setSelectedShader] = useState<(typeof shaders)[0] | null>(null)
  const [playingShader, setPlayingShader] = useState<number | null>(null)
  const [modalView, setModalView] = useState<"shader" | "code">("shader")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const handlePlayShader = (shaderId: number) => {
    if (playingShader === shaderId) {
      setPlayingShader(null)
    } else {
      setPlayingShader(shaderId)
    }
  }

  // Enhanced theme colors
  const colors = {
    // Background colors
    bgPrimary: theme === "dark" ? "#1a1b26" : "#fafafa",
    bgSecondary: theme === "dark" ? "#24283b" : "#ffffff",
    bgTertiary: theme === "dark" ? "#2f3349" : "#f4f4f5",

    // Text colors
    textPrimary: theme === "dark" ? "#c0caf5" : "#18181b",
    textSecondary: theme === "dark" ? "#9aa5ce" : "#3f3f46",
    textMuted: theme === "dark" ? "#565f89" : "#71717a",

    // Accent colors
    accentPrimary: theme === "dark" ? "#7aa2f7" : "#3b82f6",
    accentSecondary: theme === "dark" ? "#bb9af7" : "#8b5cf6",

    // Border colors
    border: theme === "dark" ? "#3b4261" : "#e4e4e7",
    borderLight: theme === "dark" ? "#414868" : "#f4f4f5",

    // Special colors
    success: theme === "dark" ? "#9ece6a" : "#22c55e",
    warning: theme === "dark" ? "#e0af68" : "#f59e0b",
    error: theme === "dark" ? "#f7768e" : "#ef4444",

    // Shader specific
    shaderBg: theme === "dark" ? "#1a1b26" : "#ffffff",
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: colors.bgPrimary }}>
      {/* Header */}
      <header
        className="border-b backdrop-blur-sm transition-colors duration-300"
        style={{
          borderColor: colors.border,
          backgroundColor: `${colors.bgSecondary}95`,
        }}
      >
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: colors.textPrimary }}>
                Shader Portfolio
              </h1>
              <p className="mt-2 text-base sm:text-lg" style={{ color: colors.textSecondary }}>
                Fragment Shader Creations & Experiments
              </p>
            </div>
            <div className="flex items-center gap-3 animate-slide-in">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full transition-all duration-200 hover:scale-105"
                style={{
                  color: colors.textPrimary,
                  backgroundColor: "transparent",
                  boxShadow: theme === "dark" ? "0 0 20px rgba(123, 162, 247, 0.1)" : "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full transition-all duration-200 hover:scale-105"
                style={{ color: colors.textPrimary, backgroundColor: "transparent" }}
              >
                <Github className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full transition-all duration-200 hover:scale-105"
                style={{ color: colors.textPrimary, backgroundColor: "transparent" }}
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full transition-all duration-200 hover:scale-105"
                style={{ color: colors.textPrimary, backgroundColor: "transparent" }}
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 lg:py-12">
        {/* Hero Section */}
        <section className="text-center mb-12 lg:mb-16 animate-fade-in">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ color: colors.textPrimary }}
          >
            Creative{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`,
              }}
            >
              Shaders
            </span>
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
            This portfolio showcases my journey in shader programming and visual effects. Each shader represents hours
            of experimentation with mathematics, color theory, and creative coding. Feel free to explore the code and
            reach out if you have any questions!
          </p>
        </section>

        {/* Shader Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {shaders.map((shader, index) => (
            <Card
              key={shader.id}
              className="group transition-all duration-300 hover:scale-[1.02] animate-fade-in border-0"
              style={{
                backgroundColor: colors.bgSecondary,
                borderColor: playingShader === shader.id ? colors.accentPrimary : colors.border,
                boxShadow:
                  theme === "dark"
                    ? playingShader === shader.id
                      ? "0 0 20px rgba(123, 162, 247, 0.3)"
                      : "0 4px 12px rgba(0, 0, 0, 0.3)"
                    : playingShader === shader.id
                      ? "0 8px 24px rgba(59, 130, 246, 0.15)"
                      : "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08)",
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                    {shader.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      color: colors.textPrimary,
                      backgroundColor: "transparent",
                      boxShadow: playingShader === shader.id ? `0 0 10px ${colors.accentPrimary}40` : "none",
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlayShader(shader.id)
                    }}
                  >
                    {playingShader === shader.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <CardDescription className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                  {shader.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Shader Preview */}
                <div
                  className="aspect-square rounded-xl overflow-hidden relative border cursor-pointer transition-all duration-300"
                  style={{
                    backgroundColor: colors.shaderBg,
                    borderColor: colors.borderLight,
                    boxShadow:
                      theme === "dark"
                        ? "inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                        : "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                  }}
                  onClick={() => handlePlayShader(shader.id)}
                >
                  <ShaderCanvas
                    fragmentShader={prologue + shader.fragmentShader + epilogue}
                    isPlaying={playingShader === shader.id}
                    className="w-full h-full"
                  />
                  {playingShader !== shader.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div
                        className="rounded-full p-4 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                        style={{ backgroundColor: `${colors.accentPrimary}80` }}
                      >
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                  {playingShader === shader.id && (
                    <div className="absolute top-3 right-3">
                      <div className="rounded-full p-2" style={{ backgroundColor: colors.success }}>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {shader.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-3 py-1 rounded-full font-medium transition-colors duration-200"
                      style={{
                        backgroundColor: colors.bgTertiary,
                        color: colors.textSecondary,
                        border: `1px solid ${colors.borderLight}`,
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          color: colors.textPrimary,
                          borderColor: colors.border,
                          boxShadow: theme === "dark" ? "0 2px 4px rgba(0, 0, 0, 0.2)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                        onClick={() => {
                          setSelectedShader(shader)
                          setModalView("shader")
                          setPlayingShader(shader.id)
                          setIsModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="fixed top-4 left-4 right-4 bottom-4 !max-w-none !w-auto max-h-none h-auto p-0 gap-0 overflow-hidden rounded-2xl border-0 translate-x-0 translate-y-0 [&>button]:hidden"
                      style={{
                        backgroundColor: colors.bgPrimary,
                        boxShadow:
                          theme === "dark" ? "0 25px 50px rgba(0, 0, 0, 0.5)" : "0 25px 50px rgba(0, 0, 0, 0.15)",
                        width: 'calc(100vw - 2rem)',
                        left: '1rem',
                        right: '1rem',
                      }}
                    >
                      {selectedShader && (
                        <div className="flex flex-col h-full">
                          {/* Enhanced Header */}
                          <div
                            className="flex items-center justify-between p-4 border-b flex-shrink-0"
                            style={{
                              borderColor: colors.border,
                              backgroundColor: colors.bgSecondary,
                            }}
                          >
                            <div className="flex-1 min-w-0 pr-4">
                              <DialogTitle
                                className="text-xl font-bold mb-1 tracking-tight"
                                style={{ color: colors.textPrimary }}
                              >
                                {selectedShader.title}
                              </DialogTitle>
                              <DialogDescription
                                className="text-sm leading-relaxed"
                                style={{ color: colors.textSecondary }}
                              >
                                {selectedShader.description}
                              </DialogDescription>
                            </div>

                            {/* Enhanced View Toggle */}
                            <div className="flex items-center gap-2 mx-8">
                              <div
                                className="flex rounded-xl p-1.5 border"
                                style={{
                                  backgroundColor: colors.bgTertiary,
                                  borderColor: colors.borderLight,
                                }}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`px-6 py-3 rounded-md transition-all duration-200 font-medium ${
                                    modalView === "shader" ? "shadow-sm" : ""
                                  }`}
                                  style={{
                                    backgroundColor: modalView === "shader" ? colors.accentPrimary : "transparent",
                                    color: modalView === "shader" ? "white" : colors.textPrimary,
                                  }}
                                  onClick={() => setModalView("shader")}
                                >
                                  <Monitor className="h-4 w-4 mr-2" />
                                  Shader
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`px-6 py-3 rounded-md transition-all duration-200 font-medium ${
                                    modalView === "code" ? "shadow-sm" : ""
                                  }`}
                                  style={{
                                    backgroundColor: modalView === "code" ? colors.accentPrimary : "transparent",
                                    color: modalView === "code" ? "white" : colors.textPrimary,
                                  }}
                                  onClick={() => setModalView("code")}
                                >
                                  <Code2 className="h-4 w-4 mr-2" />
                                  Code
                                </Button>
                              </div>
                            </div>

                            {/* Enhanced Actions */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="px-6 py-3 font-medium transition-all duration-200 hover:scale-105"
                                style={{
                                  backgroundColor: colors.bgSecondary,
                                  color: colors.accentPrimary,
                                  borderColor: colors.border,
                                }}
                              >
                                <a href={selectedShader.shadertoyUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  ShaderToy
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full transition-all duration-200 hover:scale-105"
                                style={{ color: colors.textMuted }}
                                onClick={() => setIsModalOpen(false)}
                              >
                                <X className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>

                          {/* Enhanced Content */}
                            <div className="flex-2 p-4 sm:p-6 lg:p-4 overflow-hidden">
                            {modalView === "shader" ? (
                              <div className="h-full flex flex-col">
                                {/* Large Shader Display */}
                                <div
  className="flex-1 rounded-2xl overflow-hidden relative border-2 min-h-0"
                                  style={{
                                    backgroundColor: colors.shaderBg,
                                    borderColor: colors.borderLight,
                                    boxShadow:
                                      theme === "dark"
                                        ? "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                                        : "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                                  }}
                                >
                                  <ShaderCanvas
                                    fragmentShader={prologue + selectedShader.fragmentShader + epilogue}
                                    isPlaying={playingShader === selectedShader.id}
                                    className="w-full h-full"
                                  />
                                  {/* Enhanced Floating Controls */}
                                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                                    <Button
                                      onClick={() => handlePlayShader(selectedShader.id)}
                                      size="lg"
                                      className="px-10 py-4 text-lg font-semibold rounded-full backdrop-blur-md transition-all duration-200 hover:scale-105"
                                      style={{
                                        backgroundColor: `${colors.accentPrimary}E6`,
                                        color: "white",
                                        border: `2px solid ${colors.accentPrimary}`,
                                        boxShadow: `0 8px 24px ${colors.accentPrimary}40`,
                                      }}
                                    >
                                      {playingShader === selectedShader.id ? (
                                        <>
                                          <Pause className="h-6 w-6 mr-3" />
                                          Pause Animation
                                        </>
                                      ) : (
                                        <>
                                          <Play className="h-6 w-6 mr-3" />
                                          Play Animation
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {/* Enhanced Shader Info */}
                                <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                                  <div className="flex flex-wrap gap-3">
                                    {selectedShader.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-sm px-4 py-2 rounded-full font-medium"
                                        style={{
                                          backgroundColor: colors.bgTertiary,
                                          color: colors.textSecondary,
                                          border: `1px solid ${colors.borderLight}`,
                                        }}
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
                                    Created: {new Date(selectedShader.createdDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full flex flex-col">
                                {/* Enhanced Code Header */}
                                <div
                                  className="flex items-center justify-between p-6 rounded-t-2xl border-b"
                                  style={{
                                    backgroundColor: colors.bgSecondary,
                                    borderColor: colors.border,
                                  }}
                                >
                                  <h3 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
                                    Fragment Shader Source Code
                                  </h3>
                                  <div
                                    className="flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full"
                                    style={{
                                      color: colors.textSecondary,
                                      backgroundColor: colors.bgTertiary,
                                    }}
                                  >
                                    <Code2 className="h-4 w-4" />
                                    GLSL
                                  </div>
                                </div>

                                {/* Enhanced Scrollable Code Display */}
                                <div
                                  className="flex-1 rounded-b-2xl overflow-hidden border-2 border-t-0"
                                  style={{
                                    backgroundColor: colors.bgSecondary,
                                    borderColor: colors.border,
                                    boxShadow:
                                      theme === "dark"
                                        ? "inset 0 2px 4px rgba(0, 0, 0, 0.2)"
                                        : "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
                                  }}
                                >
                                  <ScrollArea className="h-full max-h-[calc(100vh-14rem)]">
                                    <div className="p-6">
                                      <CodeBlock code={prologue + selectedShader.fragmentShader + epilogue} language="glsl" theme={theme} />
                                    </div>
                                  </ScrollArea>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      color: colors.accentPrimary,
                      borderColor: colors.border,
                    }}
                    asChild
                  >
                    <a href={shader.shadertoyUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <p className="text-xs font-medium" style={{ color: colors.textMuted }}>
                  Created: {new Date(shader.createdDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  )
}
