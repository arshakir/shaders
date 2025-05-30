//data structure for plane representing equation ax + by + cz = d
struct Plane {
  vec3 abc;
  float d;
};

//data structure for cube of equation x^n + y^n +z^n = r^n
struct Cube {

  vec3 center;
  float radius;
  float n;
};

//determines if it was hit and color returned
struct hit {
  bool h;
  vec3 col;
};

//roatation functions
vec3 rotate3Dy(vec3 v, float angle) {

  return v * mat3(cos(angle), 0., sin(angle), 0., 1., 0., -sin(angle), 0.,
                  cos(angle));
}

vec3 rotate3Dx(vec3 v, float angle) {

  return v * mat3(1., 0., 0., 0., cos(angle), -sin(angle), 0., sin(angle),
                  cos(angle));
}

//calculates the equation of the cube as a function of t
float f(float t, vec3 ro, vec3 rd, Cube c) {
  return pow(ro.x + t * rd.x - c.center.x, c.n) +
         pow(ro.y + t * rd.y - c.center.y, c.n) +
         pow(ro.z + t * rd.z - c.center.z, c.n) - pow(c.radius, c.n);
}

//derivative of above function
float fprime(float t, vec3 ro, vec3 rd, Cube c) {
  return (c.n * pow(ro.x + rd.x * t - c.center.x, c.n-1.) * rd.x) +
         (c.n * pow(ro.y + rd.y * t - c.center.y, c.n-1.) * rd.y) +
         (c.n * pow(ro.z + rd.z * t - c.center.z, c.n-1.) * rd.z);
}

//gradient vector of cube c at pos
vec3 fgrad(vec3 pos, Cube c) {
  return vec3(c.n * pow(pos.x - c.center.x, c.n-1.),
              c.n * pow(pos.y - c.center.y, c.n-1.),
              c.n * pow(pos.z - c.center.z, c.n-1.));
}

//newton approximation to calculate the value t that the ray hits the cube
float newton(float xn, int d, vec3 ro, vec3 rd, Cube c) {

  for (int i = 0; i < 20; i++) {
    xn = xn - f(xn, ro, rd, c) / fprime(xn, ro, rd, c);
  }
  return xn;
}

//intersect plane function returns t such that ro + t*rd hits the plane
float iPlane(vec3 ro, vec3 rd, Plane p) {
  return (p.d - dot(p.abc, ro)) / (dot(p.abc, rd));
}

//returns t such that ro + rd*t hits the cube
float iCube(vec3 ro, vec3 rd, Cube c) {
  float t = newton(0.0, 20, ro, rd, c);

  if (f(t, ro, rd, c) < 0.01) {
    return t;
  }
  return -1.0;
}


//checks intersection of plane and cube
hit intersect(vec3 ro, vec3 rd, vec3 light) {

//initalize the plane and cube
  Plane p = Plane(vec3(0.0, 1.0, 0.0), -3.0);
  Cube c = Cube(vec3(5. * sin(iTime), 0.0, 5. * cos(iTime)), 1.0, 6.0);

  float tp = iPlane(ro, rd, p);
  float tc = iCube(ro, rd, c);

  if (tp > 0.) {
    if (tc > 0.) {
    
    //hit the cube return phong lighting
      vec3 pos = ro + tc * rd;
      
      //find dot product between normal of the cube and light directio 
      float d = dot(normalize(fgrad(pos, c)), normalize(light - ro - tc*rd));
      
      
      //calculate specular lighting
      vec3 viewdir = normalize(ro - pos);
      vec3 reflectdir = reflect(-normalize(light-pos), normalize(fgrad(pos,c)));
      float spec = pow(max(dot(viewdir, reflectdir), 0.0), 256.);
      if (d < 0.0){
          d = 0.0;
      }
      
      //return the correct rgb for lighting
      return hit(true, vec3(1.0,0.0,0.0) * (d + 0.3) + vec3(1.0,1.0,1.0) * spec/2.);

    }
    
    
    //hit plane
        vec3 pos = ro + tp * rd;
        
        //add in shadows by intersecting light direction with the cube
        float tt = iCube(pos, normalize(light - pos), c); 
        vec3 v = normalize(light - pos);
        vec3 pq = normalize(c.center - pos);

        float dd = length(cross(pq, v))/length(v);


        if (tt > 0.){
          return hit(true, vec3(dd));
        }
        
        
    float d = dot(normalize(p.abc), normalize(light - ro - tp * rd));
    return hit(true, vec3(1.0) * (d + 0.1));
  }

  return hit(false, vec3(0.0));
}



void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  // Normalized pixel coordinates(from 0 to 1)
  vec2 uv = fragCoord / max(iResolution.x, iResolution.y);

  vec2 p = (2.0 * fragCoord.xy - iResolution.xy) / iResolution.y;
  vec3 ro = vec3(0.0, 1.5, -7.);

//initliaze vectors
  vec3 rd = normalize(vec3(p, 2.0));
  vec3 light = vec3(0.0, 3.0, 0.0);

  vec3 col = vec3(0.);


//calculate color vector and output
  hit h = intersect(ro, rd, light);

  if (h.h) {
    col = h.col;
  }

  // Output to screen
  fragColor = vec4(col, 1.0);
}
