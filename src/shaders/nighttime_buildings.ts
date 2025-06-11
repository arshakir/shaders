export const nighttime_buildings = `
//Colors
const vec3 WINDOW_COLOR = vec3(101., 179., 247.) / 255.;
const vec3 LIGHT_COLOR = vec3(252, 186, 3) / 255.;
const vec3 GRID_COLOR = vec3(184, 188, 191) / 255.;
const vec3 MOON_COLOR = vec3(215, 216, 202) / 255.;
const vec3 STAR_COLOR = vec3(209, 231, 255)/255.;

//Random and noise functions

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


  vec2 u = smoothstep(0., 1., f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}


//Box and building SDF
float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}
float sdfBuilding(vec3 p, float h) { return sdBox(p, vec3(0.5, h, 0.5)); }


vec3 getBuildingNormal(vec3 p, vec2 newpos, float n) {
  vec3 v = vec3(p.x - newpos.x, (p.y - 0.) / n, p.z - newpos.y);
  vec3 absv = abs(v);
  float m = max(max(absv.x, absv.y), absv.z);
  return sign(v) * vec3(equal(absv, vec3(m)));
}


vec3 getBuildingColor(vec3 ro, vec3 p, vec2 newpos, vec3 light, float n,
                      float d) {
  //Atmospheric coloring
  vec3 L = exp(-0.003 * d * vec3(5., 5., 1.));
  vec3 normal = getBuildingNormal(p, newpos, n);

  vec3 absp = abs(p);


  //Add grid color on certain spots
  float grid =
      step(0.05, abs(p.y - n)) * step(abs(p.y - floor(p.y * 2.) / 2.), 0.02) +
      step(abs(absp.x - floor(absp.x * 5.) / 5.), 0.04) *
          step(abs(absp.z - floor(absp.z * 5.) / 5.), 0.04);

  float window_light = step(0.4, random(newpos + floor(p.y * 2.)));
  float lightval = dot(normalize(normal), normalize(light - p)) / 5.;
  
  //Illuminate current building based on nearby buildings
  const float m = 1.;
  for (float x = -m; x <= m; x++) {
    for (float y = -m; y <= m; y++) {

      vec2 newpos = floor(p.xz) + vec2(x, y) + 0.5;

      if (mod(newpos.x, 4.0) == 0.5 || mod(newpos.y, 4.0) == 0.5)
        continue;

      float n = 15. * random(newpos);

      for (float i = 0.; i < 15.; i++) {
        if (i > n)
          break;
        vec3 p2 = vec3(newpos.x, i, newpos.y);
        float d = (distance(p, vec3(newpos.x, i, newpos.y)));

        vec3 viewdir = normalize(ro - p2);
        vec3 reflectdir =
            reflect(-normalize(p - p2), normalize(vec3(-x, 0., -y)));
        float spec = pow(max(dot(viewdir, reflectdir), 0.0), 9.);

        lightval += step(0.4, random(newpos + vec2(i * 2., i * 2. + 5.))) *
                        exp(-2.5 * d) +
                    spec / 10.;
      }
    }
  }

  //Add grid color or building color
  vec3 color = (1. - grid) * WINDOW_COLOR * lightval +
               grid * GRID_COLOR * lightval + vec3(1.) * lightval;

  return (1. - L) * vec3(0.5) + L * color;
}

//Gets moon and stars
vec3 getSky(vec3 ro, vec3 rd, vec3 p) {

  vec3 col = vec3(0.3) - 0.003*p.y;

  vec3 moon = vec3(0., 600., 5000.);
  
  float x = dot(normalize(rd), normalize(moon-ro));
  x = pow(x,300.);
  col += smoothstep(0.2,0.5, x) * (1.-noise(rd.xy*20.)/2.) * MOON_COLOR;
  
  //Stars made of noise
  col += smoothstep(0.95,1., noise(rd.xy*300.+3000.)) * STAR_COLOR;


  return col;
}

//Returns cloud density based on p
float cloudDensity(vec3 p, float d) {
    float density = 0.05 * noise(p.xz * 0.1 + iTime * 0.1 + p.y*0.1);
    density += 0.03 * noise(p.xz * 0.2 + iTime * 0.15 + p.y*0.1);
    density += 0.02 * noise(p.xz * 0.4 + iTime * 0.2 + p.y*0.1);
    
    float heightFade = 5./abs(p.y-15.)/abs(p.y-15.);
    density *= clamp(heightFade, 0.0, 1.0) * (exp(0.05*d)-1.);
    
    return clamp(density - 0.1, 0.0, 1.0)*0.02;
}

void mainImage(out vec4 o, in vec2 uv) {

  uv = (uv - iResolution.xy / 2.) / iResolution.y;

  vec3 final;

  float d;
  vec3 light = vec3(0., 20., 50.);
  vec3 ro = vec3(0.5, 15.5, iTime * 10.);
  vec3 rd = vec3(uv, 1.);

  for (int i = 0; i < 1000; i++) {

    vec3 p = ro + rd * d;
    float n = 15. * random(floor(p.xz) + 0.5);


    //Draw ground
    if (p.y < 5.) {
      final = vec3(0.5) * dot(vec3(0., 1., 0.), normalize(light - p));
      break;
    }
    

    vec2 hitpos;
    float s = 1.;
    vec3 normal;

    //Check nearby buildings to see if they are closer to p
    const float m = 1.;
    for (float x = -m; x <= m; x++) {
      for (float y = -m; y <= m; y++) {
        vec2 newpos = floor(p.xz) + vec2(x, y) + 0.5;

        if (mod(newpos.x, 4.0) == 0.5 || mod(newpos.y, 4.0) == 0.5)
          continue;

        float n = 15. * random(newpos);
        
        float sb = sdfBuilding(p - vec3(newpos.x, 0., newpos.y), n);
        s = min(s, sb);

        //Get spot of closest building
        hitpos += newpos * step(sb, 0.0001);
      }
    }
    
    final += cloudDensity(p,p.z-ro.z) *vec3(1.);
    if (s < 0.0000001) {
      final += getBuildingColor(ro, p, hitpos, light, n, d);
      break;
    }

    if (d > 50.) {
      final += getSky(ro, vec3(uv, 1.), p);
      break;
    }

    d += max(s, 0.01);
  }

  final = smoothstep(0., 1., final);
  o = vec4(final, 1.0);
}`
