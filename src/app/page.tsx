"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Github, Linkedin, Mail, Play, Pause, ExternalLink, Moon, Sun, Code2, Monitor } from "lucide-react"
import ShaderCanvas from "@/components/shader-canvas"
import CodeBlock from "@/components/code-block"
import { useTheme } from "@/components/theme-provider"

import cubeish from '../shaders/cubeish.glsl'
import endless_tunnel from '../shaders/endless_tunnel.glsl'
import time_warden from '../shaders/time_warden.glsl'

const prologue = `
precision mediump float;
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
]

shaders.reverse();

export default function ShaderPortfolio() {
  const [selectedShader, setSelectedShader] = useState<(typeof shaders)[0] | null>(null)
  const [playingShader, setPlayingShader] = useState<number | null>(null)
  const [modalView, setModalView] = useState<"shader" | "code">("shader")
  const { theme, setTheme } = useTheme()

  const handlePlayShader = (shaderId: number) => {
    if (playingShader === shaderId) {
      setPlayingShader(null)
    } else {
      setPlayingShader(shaderId)
    }
  }

  // Theme colors based on current theme
  const colors = {
    background: theme === "dark" ? "#20202a" : "#E6E6F1",
    foreground: theme === "dark" ? "#63718B" : "#708190",
    card: theme === "dark" ? "#2C2E3E" : "#9CA6B9",
    border: theme === "dark" ? "#44495e" : "#D5D4E0",
    heading: theme === "dark" ? "#C6D0E9" : "#313449",
    accent: theme === "dark" ? "#CDDBF9" : "#6A8CBC",
    accentBright: theme === "dark" ? "#B8C9EA" : "#6E7EBF",
    url: theme === "dark" ? "#B8DEEB" : "#7170C2",
    badge: theme === "dark" ? "#44495e" : "#D5D4E0",
    badgeText: theme === "dark" ? "#C6D0E9" : "#313449",
    hoverBg: theme === "dark" ? "rgba(68, 73, 94, 0.3)" : "rgba(213, 212, 224, 0.3)",
    shaderBg: theme === "dark" ? "#20202a" : "#FFFFFF",
    modalBg: theme === "dark" ? "#20202a" : "#FFFFFF",
    modalCard: theme === "dark" ? "#2C2E3E" : "#F8F9FA",
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header
        className="border-b backdrop-blur-sm"
        style={{ borderColor: colors.border, backgroundColor: `${colors.card}10` }}
      >
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.heading }}>
                Shader Portfolio
              </h1>
              <p className="mt-1 text-sm sm:text-base" style={{ color: colors.foreground }}>
                Fragment Shader Creations & Experiments
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-opacity-30 transition-colors"
                style={{ color: colors.heading, backgroundColor: "transparent" }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-opacity-30 transition-colors"
                style={{ color: colors.heading, backgroundColor: "transparent" }}
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-opacity-30 transition-colors"
                style={{ color: colors.heading, backgroundColor: "transparent" }}
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-opacity-30 transition-colors"
                style={{ color: colors.heading, backgroundColor: "transparent" }}
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
        {/* Hero Section */}
        <section className="text-center mb-6 lg:mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4" style={{ color: colors.heading }}>
            Creative{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(to right, ${colors.accent}, ${colors.accentBright})`,
              }}
            >
              Shaders
            </span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-xl lg:max-w-2xl mx-auto mb-4 lg:mb-6"
            style={{ color: colors.foreground }}
          >
            This portfolio showcases my journey in shader programming and visual effects. Each shader represents hours
            of experimentation with mathematics, color theory, and creative coding. Feel free to explore the code and
            reach out if you have any questions!
          </p>
        </section>

        {/* Shader Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
          {shaders.map((shader) => (
            <Card
              key={shader.id}
              className="transition-all duration-300 group hover:shadow-lg"
              style={{
                backgroundColor: colors.card,
                borderColor: playingShader === shader.id ? colors.accent : colors.border,
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base lg:text-lg" style={{ color: colors.heading }}>
                    {shader.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-opacity-30 transition-colors"
                    style={{ color: colors.heading, backgroundColor: "transparent" }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlayShader(shader.id)
                    }}
                  >
                    {playingShader === shader.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <CardDescription className="text-xs sm:text-sm" style={{ color: colors.foreground }}>
                  {shader.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                {/* Shader Preview */}
                <div
                  className="aspect-square rounded-lg overflow-hidden relative border cursor-pointer"
                  style={{
                    backgroundColor: theme === "light" ? "#FFFFFF" : colors.shaderBg,
                    borderColor: theme === "light" ? "#E0E0E0" : colors.border,
                    boxShadow: theme === "light" ? "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" : "none",
                  }}
                  onClick={() => handlePlayShader(shader.id)}
                >
                  <ShaderCanvas
                    fragmentShader={prologue + shader.fragmentShader + epilogue}
                    isPlaying={playingShader === shader.id}
                    className="w-full h-full"
                  />
                  {playingShader !== shader.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/50 rounded-full p-3">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                  {playingShader === shader.id && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-green-500 rounded-full p-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 lg:gap-2">
                  {shader.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: colors.badge,
                        color: colors.badgeText,
                        borderColor: colors.border,
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs sm:text-sm hover:bg-opacity-30 transition-colors"
                        style={{
                          backgroundColor: colors.card,
                          color: colors.heading,
                          borderColor: colors.border,
                        }}
                        onClick={() => {
                          setSelectedShader(shader)
                          setModalView("shader")
                        }}
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">Details</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent
 className="fullscreen-dialog max-w-none w-screen h-screen max-h-screen p-0 gap-0 overflow-hidden m-0 rounded-none border-0"
                      style={{
                        backgroundColor: colors.modalBg,
                        borderColor: colors.border,
                        position: 'fixed',
                        inset: 0,
                        width: '100vw',
                        height: '100vh',
                        maxWidth: 'none',
                        maxHeight: 'none',
                        transform: 'none',
                        translate: 'none',
                      }}
                    >
                      {selectedShader && (
                        <div className="flex flex-col h-full">
                          {/* Header */}
                          <div
                            className="flex items-center justify-between p-6 border-b"
                            style={{ borderColor: colors.border }}
                          >
                            <div className="flex-1">
                              <DialogTitle className="text-2xl font-bold mb-2" style={{ color: colors.heading }}>
                                {selectedShader.title}
                              </DialogTitle>
                              <DialogDescription className="text-base" style={{ color: colors.foreground }}>
                                {selectedShader.description}
                              </DialogDescription>
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-2 mx-6">
                              <div
                                className="flex rounded-lg p-1"
                                style={{ backgroundColor: colors.modalCard, border: `1px solid ${colors.border}` }}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`px-4 py-2 transition-all ${modalView === "shader" ? "shadow-sm" : ""}`}
                                  style={{
                                    backgroundColor: modalView === "shader" ? colors.accent : "transparent",
                                    color: modalView === "shader" ? "white" : colors.heading,
                                  }}
                                  onClick={() => setModalView("shader")}
                                >
                                  <Monitor className="h-4 w-4 mr-2" />
                                  Shader
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`px-4 py-2 transition-all ${modalView === "code" ? "shadow-sm" : ""}`}
                                  style={{
                                    backgroundColor: modalView === "code" ? colors.accent : "transparent",
                                    color: modalView === "code" ? "white" : colors.heading,
                                  }}
                                  onClick={() => setModalView("code")}
                                >
                                  <Code2 className="h-4 w-4 mr-2" />
                                  Code
                                </Button>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="transition-colors"
                                style={{
                                  backgroundColor: colors.modalCard,
                                  color: colors.url,
                                  borderColor: colors.border,
                                }}
                              >
                                <a href={selectedShader.shadertoyUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  ShaderToy
                                </a>
                              </Button>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6 overflow-hidden">
                            {modalView === "shader" ? (
                              <div className="h-full flex flex-col">
                                {/* Large Shader Display */}
                                <div
                                  className="flex-1 rounded-xl overflow-hidden relative border-2 min-h-[60vh]"
                                  style={{
                                    backgroundColor: theme === "light" ? "#FFFFFF" : colors.shaderBg,
                                    borderColor: theme === "light" ? "#E0E0E0" : colors.border,
                                    boxShadow:
                                      theme === "light" ? "0 4px 12px rgba(0,0,0,0.1)" : "0 4px 12px rgba(0,0,0,0.3)",
                                  }}
                                >
                                  <ShaderCanvas
                                    fragmentShader={prologue + selectedShader.fragmentShader + epilogue}
                                    isPlaying={playingShader === selectedShader.id}
                                    className="w-full h-full"
                                  />
                                  {/* Floating Controls */}
                                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                                    <Button
                                      onClick={() => handlePlayShader(selectedShader.id)}
                                      size="lg"
                                      className="px-8 py-3 text-base font-medium shadow-lg backdrop-blur-sm"
                                      style={{
                                        backgroundColor: `${colors.accent}E6`,
                                        color: "white",
                                        border: `1px solid ${colors.accent}`,
                                      }}
                                    >
                                      {playingShader === selectedShader.id ? (
                                        <>
                                          <Pause className="h-5 w-5 mr-3" />
                                          Pause Animation
                                        </>
                                      ) : (
                                        <>
                                          <Play className="h-5 w-5 mr-3" />
                                          Play Animation
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {/* Shader Info */}
                                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                                  <div className="flex flex-wrap gap-2">
                                    {selectedShader.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-sm px-3 py-1"
                                        style={{
                                          backgroundColor: colors.badge,
                                          color: colors.badgeText,
                                          borderColor: colors.border,
                                        }}
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <p className="text-sm" style={{ color: colors.foreground }}>
                                    Created: {new Date(selectedShader.createdDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full flex flex-col">
                                {/* Code Header */}
                                <div
                                  className="flex items-center justify-between p-4 rounded-t-xl border-b"
                                  style={{
                                    backgroundColor: colors.modalCard,
                                    borderColor: colors.border,
                                  }}
                                >
                                  <h3 className="text-lg font-semibold" style={{ color: colors.heading }}>
                                    Fragment Shader Source Code
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm" style={{ color: colors.foreground }}>
                                    <Code2 className="h-4 w-4" />
                                    GLSL
                                  </div>
                                </div>

                                {/* Code Display */}
                                <div
                                  className="flex-1 rounded-b-xl overflow-hidden border-2 border-t-0"
                                  style={{
                                    backgroundColor: colors.modalCard,
                                    borderColor: colors.border,
                                  }}
                                >
                                  <ScrollArea className="h-full">
                                    <div className="p-6">
                                      <CodeBlock code={selectedShader.fragmentShader} language="glsl" theme={theme} />
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
                    className="hover:bg-opacity-30 transition-colors"
                    style={{
                      backgroundColor: colors.card,
                      color: colors.url,
                      borderColor: colors.border,
                    }}
                    asChild
                  >
                    <a href={shader.shadertoyUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    </a>
                  </Button>
                </div>

                <p className="text-xs" style={{ color: colors.foreground }}>
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
