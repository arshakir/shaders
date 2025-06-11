"use client"

import { useEffect, useRef } from "react"

interface ShaderCanvasProps {
  fragmentShader: string
  isPlaying?: boolean
  className?: string
}

export default function ShaderCanvas({ fragmentShader, isPlaying = false, className = "" }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const programRef = useRef<WebGLProgram | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const pausedTimeRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  const glRef = useRef<WebGLRenderingContext | null>(null)
  const positionBufferRef = useRef<WebGLBuffer | null>(null)
  const positionLocationRef = useRef<number>(-1)
  const timeLocationRef = useRef<WebGLUniformLocation | null>(null)
  const resolutionLocationRef = useRef<WebGLUniformLocation | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext
    if (!gl) {
      console.error("WebGL not supported")
      return
    }

    glRef.current = gl

    // Set canvas size to match container
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth
      const displayHeight = canvas.clientHeight

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth
        canvas.height = displayHeight
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Vertex shader (standard for fragment shaders)
    const vertexShaderSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `

    // Create shader function
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null

      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }

      return shader
    }

    // Create program function
    const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
      const program = gl.createProgram()
      if (!program) return null

      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program linking error:", gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
      }

      return program
    }

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)

    if (!vertexShader || !fragShader) return

    // Create program
    const program = createProgram(gl, vertexShader, fragShader)
    if (!program) return

    programRef.current = program

    // Use the program before setting uniforms
    gl.useProgram(program)

    // Set up geometry (full screen quad)
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, "a_position")
    const timeLocation = gl.getUniformLocation(program, "iTime")
    const resolutionLocation = gl.getUniformLocation(program, "iResolution")

    positionBufferRef.current = positionBuffer
    positionLocationRef.current = positionLocation
    timeLocationRef.current = timeLocation
    resolutionLocationRef.current = resolutionLocation

    // Render function
    const render = () => {
      if (!canvasRef.current || !programRef.current || !glRef.current) return

      const canvas = canvasRef.current
      const gl = glRef.current

      // Ensure canvas size matches container
      resizeCanvas()

      // Calculate time
      let time
      if (isPlaying) {
        const now = Date.now()
        const elapsed = now - startTimeRef.current
        time = (pausedTimeRef.current + elapsed) * 0.001
        lastTimeRef.current = time
      } else {
        time = lastTimeRef.current
      }

      // Set uniforms
      gl.uniform1f(timeLocationRef.current, time)
      gl.uniform2f(resolutionLocationRef.current, canvas.width, canvas.height)

      // Set up attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current)
      gl.enableVertexAttribArray(positionLocationRef.current)
      gl.vertexAttribPointer(positionLocationRef.current, 2, gl.FLOAT, false, 0, 0)

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(render)
      }
    }

    // Handle play/pause state changes
    if (isPlaying) {
      startTimeRef.current = Date.now()
      animationRef.current = requestAnimationFrame(render)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = undefined
        pausedTimeRef.current = lastTimeRef.current * 1000
      }
      // Still render one frame when paused to show the current state
      render()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
      if (programRef.current && glRef.current) {
        glRef.current.deleteProgram(programRef.current)
      }
    }
  }, [fragmentShader, isPlaying])

  return <canvas ref={canvasRef} className={`${className} w-full h-full`} />
}
