"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, Eye, Github, Linkedin, Mail, Play, Pause, ExternalLink } from "lucide-react"
import ShaderCanvas from "@/components/shader-canvas"

// Sample shader data - replace with your actual shaders
const shaders = [
  {
    id: 1,
    title: "Plasma Wave",
    description: "A mesmerizing plasma effect with flowing waves and vibrant colors that shift through the spectrum.",
    tags: ["Animation", "Plasma", "Waves"],
    shadertoyUrl: "https://www.shadertoy.com/view/your-plasma-shader-id",
    fragmentShader: `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;
    
    float d1 = length(uv + vec2(sin(u_time * 0.5), cos(u_time * 0.3)));
    float d2 = length(uv + vec2(cos(u_time * 0.7), sin(u_time * 0.9)));
    
    float plasma = sin(d1 * 8.0 + u_time) + sin(d2 * 6.0 + u_time * 1.5);
    plasma += sin((uv.x + uv.y) * 4.0 + u_time * 2.0);
    
    vec3 color = vec3(
        sin(plasma + u_time) * 0.5 + 0.5,
        sin(plasma + u_time + 2.0) * 0.5 + 0.5,
        sin(plasma + u_time + 4.0) * 0.5 + 0.5
    );
    
    gl_FragColor = vec4(color, 1.0);
}`,
    createdDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Fractal Mandelbrot",
    description: "Classic Mandelbrot set fractal with smooth coloring and zoom capabilities.",
    tags: ["Fractal", "Mathematics", "Mandelbrot"],
    shadertoyUrl: "https://www.shadertoy.com/view/your-mandelbrot-shader-id",
    fragmentShader: `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

vec3 mandelbrot(vec2 c) {
    vec2 z = vec2(0.0);
    int iterations = 100;
    
    for(int i = 0; i < 100; i++) {
        if(length(z) > 2.0) break;
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
    }
    
    float t = float(iterations) / 100.0;
    return vec3(t * 0.5, t * 0.8, t);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = (uv - 0.5) * 3.0;
    uv.x *= u_resolution.x / u_resolution.y;
    
    float zoom = 1.0 + sin(u_time * 0.1) * 0.5;
    uv *= zoom;
    uv += vec2(-0.5, 0.0);
    
    vec3 color = mandelbrot(uv);
    gl_FragColor = vec4(color, 1.0);
}`,
    createdDate: "2024-01-10",
  },
  {
    id: 3,
    title: "Noise Terrain",
    description: "Procedural terrain generation using Perlin noise with dynamic lighting and shadows.",
    tags: ["Noise", "Terrain", "Procedural"],
    shadertoyUrl: "https://www.shadertoy.com/view/your-terrain-shader-id",
    fragmentShader: `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv *= 8.0;
    uv += u_time * 0.1;
    
    float n = noise(uv) * 0.5;
    n += noise(uv * 2.0) * 0.25;
    n += noise(uv * 4.0) * 0.125;
    
    vec3 color = vec3(n * 0.3, n * 0.6, n * 0.2);
    color += vec3(0.1, 0.2, 0.1);
    
    gl_FragColor = vec4(color, 1.0);
}`,
    createdDate: "2024-01-05",
  },
]

export default function ShaderPortfolio() {
  const [selectedShader, setSelectedShader] = useState<(typeof shaders)[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#20202a" }}>
      {/* Header */}
      <header className="border-b border-[#44495e] bg-[#2C2E3E]/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#C6D0E9" }}>
                Shader Portfolio
              </h1>
              <p className="mt-1" style={{ color: "#63718B" }}>
                Fragment Shader Creations & Experiments
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hover:bg-[#44495e]/30" style={{ color: "#C6D0E9" }}>
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-[#44495e]/30" style={{ color: "#C6D0E9" }}>
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-[#44495e]/30" style={{ color: "#C6D0E9" }}>
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-3" style={{ color: "#C6D0E9" }}>
            Creative{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(to right, #CDDBF9, #B8C9EA)`,
              }}
            >
              Shaders
            </span>
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-6" style={{ color: "#63718B" }}>
            This portfolio showcases my journey in shader programming and visual effects. Each shader represents hours
            of experimentation with mathematics, color theory, and creative coding. Feel free to explore the code and
            reach out if you have any questions!
          </p>
        </section>

        {/* Shader Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {shaders.map((shader) => (
            <Card
              key={shader.id}
              className="transition-all duration-300 group border-[#44495e] hover:border-[#CDDBF9]/50"
              style={{ backgroundColor: "#2C2E3E" }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle style={{ color: "#C6D0E9" }}>{shader.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#44495e]/30"
                    style={{ color: "#C6D0E9" }}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <CardDescription style={{ color: "#63718B" }}>{shader.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Shader Preview */}
                <div className="aspect-square rounded-lg overflow-hidden" style={{ backgroundColor: "#20202a" }}>
                  <ShaderCanvas
                    fragmentShader={shader.fragmentShader}
                    isPlaying={isPlaying}
                    className="w-full h-full"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {shader.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="border-[#44495e]"
                      style={{
                        backgroundColor: "#44495e",
                        color: "#C6D0E9",
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
                        className="flex-1 border-[#44495e] hover:bg-[#44495e]/30"
                        style={{
                          backgroundColor: "#2C2E3E",
                          color: "#C6D0E9",
                        }}
                        onClick={() => setSelectedShader(shader)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="max-w-4xl max-h-[80vh] border-[#44495e]"
                      style={{ backgroundColor: "#20202a" }}
                    >
                      <DialogHeader>
                        <DialogTitle style={{ color: "#C6D0E9" }}>{selectedShader?.title}</DialogTitle>
                        <DialogDescription style={{ color: "#63718B" }}>
                          {selectedShader?.description}
                        </DialogDescription>
                      </DialogHeader>

                      {selectedShader && (
                        <Tabs defaultValue="preview" className="w-full">
                          <TabsList className="grid w-full grid-cols-2" style={{ backgroundColor: "#2C2E3E" }}>
                            <TabsTrigger
                              value="preview"
                              className="data-[state=active]:bg-[#CDDBF9]/20"
                              style={{ color: "#C6D0E9" }}
                            >
                              Preview
                            </TabsTrigger>
                            <TabsTrigger
                              value="code"
                              className="data-[state=active]:bg-[#CDDBF9]/20"
                              style={{ color: "#C6D0E9" }}
                            >
                              Source Code
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="preview" className="mt-4">
                            <div
                              className="aspect-video rounded-lg overflow-hidden"
                              style={{ backgroundColor: "#20202a" }}
                            >
                              <ShaderCanvas
                                fragmentShader={selectedShader.fragmentShader}
                                isPlaying={isPlaying}
                                className="w-full h-full"
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="code" className="mt-4">
                            <ScrollArea
                              className="h-96 w-full rounded-md border p-4"
                              style={{
                                backgroundColor: "#2C2E3E",
                                borderColor: "#44495e",
                              }}
                            >
                              <pre className="text-sm" style={{ color: "#63718B" }}>
                                <code>{selectedShader.fragmentShader}</code>
                              </pre>
                            </ScrollArea>
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#44495e] hover:bg-[#44495e]/30"
                    style={{
                      backgroundColor: "#2C2E3E",
                      color: "#B8DEEB",
                    }}
                    asChild
                  >
                    <a href={shader.shadertoyUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#44495e] hover:bg-[#44495e]/30"
                    style={{
                      backgroundColor: "#2C2E3E",
                      color: "#C6D0E9",
                    }}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-xs" style={{ color: "#63718B" }}>
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
