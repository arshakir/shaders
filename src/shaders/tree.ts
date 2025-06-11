export const tree = `
#define T iTime
const float PI = 3.1415926535897932384626433832795;

const vec3 TERRAIN_COLOR = vec3(204, 167, 108) / 255.;
const vec3 GRASS_COLOR = vec3(214, 255, 161) / 255.;
const vec3 WATER_COLOR = vec3(174, 214, 242) / 255.;
const vec3 WATER_DEEP_COLOR = vec3(64, 164, 223) / 255.;
const vec3 SKY_COLOR = vec3(189, 234, 240) / 255.;
const vec3 SUN_COLOR = vec3(255, 217, 122) / 255.;

// Random and Noise functions
float random(in vec2 st) {
  return fract(sin(dot(st.xy, vec2(1247.3259, 1356.12467))) * 87164.5453123);
}

float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = smoothstep(0.2, 1., f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float hash3(vec3 p) {
  p = fract(p * 0.3183099 + .1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n00 = mix(hash3(i), hash3(i + vec3(0, 0, 1)), f.z);
  float n01 = mix(hash3(i + vec3(0, 1, 0)), hash3(i + vec3(0, 1, 1)), f.z);
  float n10 = mix(hash3(i + vec3(1, 0, 0)), hash3(i + vec3(1, 0, 1)), f.z);
  float n11 = mix(hash3(i + vec3(1, 1, 0)), hash3(i + vec3(1, 1, 1)), f.z);
  float n0 = mix(n00, n01, f.y);
  float n1 = mix(n10, n11, f.y);
  return mix(n0, n1, f.x);
}

// SDF for trunk
float sdCappedCylinder(vec3 p, float h, float r) {
  p.y -= h;
  vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float gaussian(vec3 p, float r, float d, float a) {
  float r2 = (p.x * p.x + p.z * p.z) / a;
  return d * exp(-(r2 - r) * (r2 - r));
}

vec3 gaussianN(vec3 p, float r, float d, float a) {
  float r2 = p.x * p.x + p.z * p.z;
  r2 /= a;

  float dfdx = -4. * p.x / a * (r2 - r) * gaussian(p, r, d, a);
  float dfdz = -4. * p.z / a * (r2 - r) * gaussian(p, r, d, a);
  return vec3(dfdx, 0., dfdz);
}

// Function representing the terrain built out of gaussian functions
float f(vec3 p) {
  const float a = 10.;
  const float r = 2.;
  return gaussian(p, r, 1.3, a) - gaussian(p - vec3(5., 0., 15.), 0., 5., 20.) -

         gaussian(p - vec3(1.5, 0., 15.), 0., 7., 20.) -
         gaussian(p - vec3(-12., 0., 10.), 0., 7., 20.) -
         gaussian(p - vec3(-17., 0., 10.), 0., 7., 20.) -

         gaussian(p - vec3(-11., 0., 5.5), 0., 1., 10.) -

         gaussian(p - vec3(-3., 0., 11.), 0., 2., 20.) -

         gaussian(p - vec3(20., 0., 10.), 0., 3., 20.) -
         gaussian(p - vec3(17., 0., 10.), 0., 3., 20.) -
         gaussian(p - vec3(3., 0., 11.), 0., 2., 20.) -

         gaussian(p - vec3(9., 0., 11.), 0., 3., 30.) -
         gaussian(p - vec3(-4., 0., 11.), 0., 1., 30.)

         + p.y;
}

// Gradient of above
vec3 fnormal(vec3 p) {
  const float a = 10.;
  const float r = 2.;
  return gaussianN(p, r, 1.3, a) -
         gaussianN(p - vec3(5., 0., 15.), 0., 7., 20.) -
         gaussianN(p - vec3(1.5, 0., 15.), 0., 5., 20.) -
         gaussianN(p - vec3(-12., 0., 10.), 0., 7., 20.) -
         gaussianN(p - vec3(-17., 0., 10.), 0., 7., 20.) -

         gaussianN(p - vec3(-11., 0., 5.5), 0., 1., 10.) -

         gaussianN(p - vec3(-3., 0., 11.), 0., 2., 20.) -

         gaussianN(p - vec3(20., 0., 10.), 0., 3., 20.) -
         gaussianN(p - vec3(17., 0., 10.), 0., 3., 20.) -
         gaussianN(p - vec3(13., 0., 11.), 0., 2., 20.) -
         gaussianN(p - vec3(9., 0., 11.), 0., 3., 30.) -
         gaussianN(p - vec3(-4., 0., 11.), 0., 1., 30.)

         + vec3(0., 1., 0.);
}

// Water waves represented by sinusoids
float water(vec3 p) {
  return 0.3 + p.y - 0.03 * sin(p.x * 0.8 + T) - 0.02 * cos(p.x + T * 1.3) -
         0.01 * sin(p.x + T * 1.1) - 0.03 * sin(p.z + T) -
         0.01 * sin(p.z + T * 1.2) - 0.02 * cos(p.z * 0.7 + T * 1.7);
}

// Gradient of above
vec3 waterNormal(vec3 p) {
  float dfdx = -0.03 * 0.8 * cos(p.x * 0.8 + T) + 0.02 * sin(p.x + T * 1.3) -
               0.01 * cos(p.x + T * 1.1);
  float dfdy = 1.;
  float dfdz = -0.03 * cos(p.z + T) - 0.01 * cos(p.z + T * 1.2) +
               0.02 * 0.7 * sin(p.z * 0.7 + T * 1.7);

  return vec3(dfdx, dfdy, dfdz);
}

// Tree functions

float trunk(vec3 p) {
  float h = 1.;
  float r = 0.3;
  float f = sdCappedCylinder(p, h, r);
  return f;
}
float smin(float a, float b, float k) {
  k *= 1.0;
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

// Tree SDF
float tree(vec3 p) {

  float t = length(p / vec3(1., 1.5, 1.) - vec3(0., 2, 0.)) - .7 -
            noise3D(p * 2.) / 5. - noise3D(p * 5.) / 15.;
  float tt = length(p / vec3(1.5, 1., 1.5) - vec3(0., 1.7, 0.)) - .7 -
             noise3D(p * 2.) / 5. - noise3D(p * 5.) / 20.;

  // Blends 2 noisy spheres together to get a more tree shape
  return smin(t, tt, 0.4);
}

// Functions for normals using analytical normals
vec3 treeN(in vec3 pos) {
  vec2 e = vec2(1.0, -1.0) * 0.5773;
  const float eps = 0.0005;
  return normalize(
      e.xyy * tree(pos + e.xyy * eps) + e.yyx * tree(pos + e.yyx * eps) +
      e.yxy * tree(pos + e.yxy * eps) + e.xxx * tree(pos + e.xxx * eps));
}

vec3 trunkN(in vec3 pos) {
  vec2 e = vec2(1.0, -1.0) * 0.5773;
  const float eps = 0.0005;
  return normalize(
      e.xyy * trunk(pos + e.xyy * eps) + e.yyx * trunk(pos + e.yyx * eps) +
      e.yxy * trunk(pos + e.yxy * eps) + e.xxx * trunk(pos + e.xxx * eps));
}

// Shadow function, raymarches to light until an object is it
float sh(vec3 ro, vec3 light) {
  vec3 rd = light - ro;
  float d = 0.1;

  float mins = 1.;

  for (int i = 0; i < 5; i++) {
    vec3 p = ro + rd * d;
    float s = min(f(p), trunk(p));

    if (s < 0.001 || d > 100.)
      return 0.;
    float stree = tree(p);
    if (stree < 0.001)
      return noise(ro.xz * 2.) / 6.;

    d += 0.1;
    mins = min(mins, min(s, stree) + 0.1);
  }

  return mins;
}

// Blends grass and terrain together and apply lighting
vec3 getTerrainColor(vec3 p, vec3 light, float hitwater) {
  vec3 normal = fnormal(p);

  float lightlevel = dot(normalize(normal), normalize(light - p));

  float grass = dot(normalize(normal), vec3(0., 1., 0.));
  float a = smoothstep(0., 1., pow(grass, 5.) - hitwater);

  return lightlevel * sh(p, light) *
             mix(TERRAIN_COLOR - noise(p.xz * 5. + vec2(p.y, p.y * 2.)) / 30.,
                 GRASS_COLOR - noise(p.xz * 1.3) / 30., a) +
         (1. + normal.y) / 2. * SKY_COLOR / 30.;
}

vec3 getWaterColor(vec3 p, vec3 light, vec3 ro, float d) {
  vec3 normal = waterNormal(p);

  float lightlevel = dot(normalize(normal), normalize(light - p)) + 0.1;

  float depthFactor = clamp(exp(3. * d), 0., 1.);
  vec3 water_color = mix(WATER_DEEP_COLOR, WATER_COLOR, depthFactor);

  vec3 viewdir = normalize(ro - p);
  vec3 reflectdir = reflect(-normalize(light - p), normalize(normal));

  float fresnel = pow(1.0 - max(0.0, dot(viewdir, normal)), 2.0);

  return water_color * (lightlevel + 0.05) * 0.6;
}

vec3 getTreeColor(vec3 p, vec3 light) {

  vec3 normal = treeN(p);
  float lightlevel =
      clamp(dot(normalize(normal), normalize(light - p)), 0., 0.8);
  return GRASS_COLOR * (lightlevel + 0.2);
}

vec3 getTrunkColor(vec3 p, vec3 light) {

  vec3 normal = trunkN(p);
  float lightlevel =
      clamp(dot(normalize(normal), normalize(light - p)), 0., 1.);
  return TERRAIN_COLOR * (lightlevel + 0.1);
}

vec3 getSky(vec3 p) {
  float clouds = smoothstep(0.1, 1.2, noise(0.06 * p.xz));
  return SKY_COLOR * (1. - clouds) + clouds;
}

// Gets the color that the ray rd hits, used to display the reflection in the
// water
vec3 getReflection(vec3 ro, vec3 rd, vec3 light) {
  vec3 col;
  float d = 0.1;

  for (int i = 0; i < 500; i++) {
    vec3 p = ro + rd * d;

    float sTerrain = f(p);
    float sTree = tree(p);
    float sTrunk = trunk(p);

    if (sTrunk < 0.0001) {
      col = getTrunkColor(p, light);
      break;
    }

    if (sTree < 0.0001) {
      col = getTreeColor(p, light);
      break;
    }

    if (sTerrain < 0.00001) {

      col = getTerrainColor(p, light, 0.);

      col *= exp(-0.01 * d * vec3(1., 1., 0.8));

      break;
    }
    float ssky = -p.y + 10.;
    if (ssky < 0.1) {
      col = getSky(p);
      break;
    }

    d += max(0.01, min(min(sTerrain, ssky), sTree));
  }
  return col;
}

void mainImage(out vec4 o, in vec2 uv) {
  uv = (uv - iResolution.xy / 2.) / iResolution.y;

  float d = 0.01;
  vec3 ro = vec3(0., 1.5, -10.);
  vec3 rd = normalize(vec3(uv, 1.));
  vec3 light = vec3(-10., 10., -5.);

  float hitwater = 0.;

  vec3 col;
  vec3 reflectedCol;

  for (int i = 0; i < 700; i++) {

    vec3 p = ro + rd * d;

    // Get sdfs for each surface
    float sTerrain = f(p);
    float sWater = water(p);
    float sTree = tree(p);
    float sTrunk = trunk(p);
    float ssky = 20. - p.y;

    // Apply colors
    if (sTrunk < 0.0001) {
      col = getTrunkColor(p, light);
      break;
    }

    if (sTree < 0.0001) {
      col = getTreeColor(p, light);
      break;
    }

    if (sWater < 0.00001) {
      reflectedCol = getReflection(p + vec3(0., 1., 0.),
                                   reflect(rd, waterNormal(p)), light);
      hitwater = 1.;
    }

    if (sTerrain < 0.00001) {

      // Blend water color with reflection
      vec3 withWater = mix(getTerrainColor(p, light, hitwater) * 0.4 +
                               getWaterColor(p, light, ro, sWater),
                           reflectedCol, 0.1);

      col = mix(getTerrainColor(p, light, hitwater), withWater, hitwater);

      // Atmospheric coloring
      col *= exp(-0.015 * d * vec3(1., 1., 0.7));

      break;
    }

    if (ssky < 0.1) {
      col = getSky(p);
      break;
    }

    d += max(0.05, min(min(sTerrain, min(sWater, ssky)) * 0.2, sTree));
  }

  // After effects
  col = smoothstep(0., 1., col); // Better contrast

  // Closer to the sun makes it brighter
  col += pow(clamp(dot(normalize(rd), normalize(light)), 0., 1.), 1.1) *
         SUN_COLOR / 1.5;

  o = vec4(col, 1.);
}`
