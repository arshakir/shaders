#define PI 3.1415926538
#define T (iTime + 3.)
const vec3 COLOR = vec3(245., 213., 144.) / 255.;

float sdTriangleIsosceles(in vec2 p, in vec2 q) {
  p.x = abs(p.x);
  vec2 a = p - q * clamp(dot(p, q) / dot(q, q), 0.0, 1.0);
  vec2 b = p - q * vec2(clamp(p.x / q.x, 0.0, 1.0), 1.0);
  float s = -sign(q.y);
  vec2 d = min(vec2(dot(a, a), s * (p.x * q.y - p.y * q.x)),
               vec2(dot(b, b), s * (p.y - q.y)));
  return -sqrt(d.x) * sign(d.y);
}

float random(float x) { return fract(sin(x) * 938475.0); }
float noise(float x) {
  float i = floor(x); // integer
  float f = fract(x); // fraction
  return mix(random(i), random(i + 1.0), smoothstep(0., 1., f));
}
vec2 noise2D(float x) {
  return vec2(noise(x * 234.), noise(x * 324.)) - vec2(0.5);
}

vec2 rotate(vec2 u, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, s, -s, c);
  return m * u;
}

// Renders a glowing triangle based on point u, width w, length l
vec3 renderTriangle(vec2 u, float w, float l) {
  float sdf = sdTriangleIsosceles(u, vec2(w, l));
  vec3 col = step(sdf, 0.002) * COLOR;
  float dist = step(0.002, sdf) * 1. / sdf;
  dist *= 0.005;
  dist = pow(dist, 1.1);
  col += dist * COLOR;
  return col;
}

vec3 renderCenter(vec2 u) {

  // Inner circle
  float sdf = length(u) - 0.1;
  vec3 col = step(sdf, 0.01) * COLOR;
  float dist = step(0.01, sdf) * 1. / sdf;
  dist *= 0.01;
  dist = pow(dist, 0.8);
  col += dist * COLOR;

  // Outer Ring
  float sdfRing = abs(length(u) - 0.25);
  col += smoothstep(0.007, 0., sdfRing) * vec3(0.7);

  return col;
}

// Render each clock hands
vec3 renderSecond(vec2 u) {
  u = rotate(u, T * 2. * PI / 5.);
  return renderTriangle(u, 0.01, 0.9);
}

vec3 renderMinute(vec2 u) {
  u = rotate(u, T * 2. * PI / 30.);
  vec3 col = renderTriangle(u, 0.0025, 0.8);
  col += renderTriangle(vec2(u.x - 0.02, u.y), 0.0025, 0.5);
  col += renderTriangle(vec2(u.x + 0.02, u.y), 0.0025, 0.55);
  return col;
}

vec3 renderHour(vec2 u) {
  u = rotate(u, T * 2. * PI / 60.);
  vec3 col = renderTriangle(u, 0.0025, 0.6);
  float w = 0.001;
  col += renderTriangle(vec2(u.x - 0.02, u.y), w, 0.4);
  col += renderTriangle(vec2(u.x + 0.02, u.y), w, 0.45);
  col += renderTriangle(vec2(u.x - 0.04, u.y), w, 0.3);
  col += renderTriangle(vec2(u.x + 0.04, u.y), w, 0.35);
  return col;
}

// Renders the glowing circles and lighting
vec3 renderBackground(vec2 u) {

  vec3 col;

  // Creates the circles
  for (int i = 0; i < 75; i++) {
    vec2 pos = 3. * noise2D(float(i) * 2. + T * 0.0005);
    float sdf = distance(u, pos);
    col += step(sdf, 0.001);
    float dist = 1. / sdf;
    float n = noise(float(i) + T + 200.);
    dist *= 0.000 + 0.01 * n;
    dist = pow(dist, 0.9 + 2. * n);
    col += dist;
  }

  // Light on the left edge
  float sdf = distance(vec2(u.x, u.y * 20.), vec2(-0.925, 0.2 * 20.));
  float dist = 1. / sdf;
  float n = noise(T * 8.);
  dist *= 0.05 + 0.05 * n;
  dist = pow(dist, 1. + 0.25 * n);
  col += dist * COLOR;

  // Moving lights from corner
  for (int i = 0; i < 5; i++) {
    vec2 o = vec2(0.5 + 2. * noise(T / 2. + 2. * float(i) + 28.), -0.8);
    vec2 u = u + o;
    u = rotate(u, -1.);
    sdf = length(vec2(u.x * 10., u.y));
    dist = 1. / sdf;
    n = noise(T + 1248.);
    dist *= 0.045 + 0.025 * n;
    dist = pow(dist, 1. + 0.15 * n);
    col += dist;
  }

  return col;
}

void mainImage(out vec4 o, in vec2 u) {

  u = (u - iResolution.xy / 2.) / iResolution.y;

  vec3 col = renderBackground(u);

  u *= fract(T / 5.) * 1.5;
  col += renderCenter(u) + renderSecond(u) + renderMinute(u) + renderHour(u);

  o = vec4(col, 1.0);
}
