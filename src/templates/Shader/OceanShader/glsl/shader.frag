precision mediump float;
uniform vec3 uDepthColor; 
uniform vec3 uSurfaceColor;
uniform float uBigWavesElevation;

varying float vElevation;

void main() {
  float mixStrength = smoothstep(-uBigWavesElevation, uBigWavesElevation, vElevation);
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  gl_FragColor = vec4(color, 0.8);
}