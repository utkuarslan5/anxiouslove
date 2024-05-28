precision mediump float;

uniform sampler2D textures[5]; // Reduced to 5 textures for feedback trails
uniform float blendFactors[5]; // Blend factors for each texture
uniform float textureInfluence[5]; // New uniform for texture influence
uniform vec2 resolution; // Resolution of the render targets
uniform vec4 blendColor; // New uniform for base blend color
uniform float blendSharpness; // New uniform for blend sharpness

// Function to create a gradient color
vec4 createGradient(float t) {
    vec4 colorA = vec4(0.0, 0.7, 1.0, 1.0); // Cyan
    vec4 colorB = vec4(0.5, 0.0, 0.5, 1.0); // Purple
    vec4 colorC = vec4(1.0, 0.0, 0.0, 1.0); // Red
    vec4 colorD = vec4(1.0, 0.70, 0.0, 1.0); // Yellow
    vec4 colorE = vec4(0.0, 1.0, 0.0, 1.0); // Green
    vec4 colorF = vec4(0.0, 0.0, 1.0, 1.0); // Blue

    float phase1 = smoothstep(0.0, 0.2, t);
    float phase2 = smoothstep(0.2, 0.4, t);
    float phase3 = smoothstep(0.4, 0.6, t);
    float phase4 = smoothstep(0.6, 0.8, t);
    float phase5 = smoothstep(0.8, 1.0, t);

    vec4 gradient = mix(colorA, colorB, phase1); // Transition from A to B
    gradient = mix(gradient, colorC, phase2); // Transition from current gradient to C
    gradient = mix(gradient, colorD, phase3); // Transition from current gradient to D
    gradient = mix(gradient, colorE, phase4); // Transition from current gradient to E
    gradient = mix(gradient, colorF, phase5); // Transition from current gradient to F

    return gradient;
}

// Blend Mode: Multiply
vec4 blendMultiply(vec4 baseColor, vec4 blendColor) {
    return baseColor * blendColor;
}

// Blend Mode: Screen
vec4 blendScreen(vec4 baseColor, vec4 blendColor) {
    return vec4(1.0) - ((vec4(1.0) - baseColor) * (vec4(1.0) - blendColor));
}

// Blend Mode: Overlay (combination of multiply and screen)
vec4 blendOverlay(vec4 baseColor, vec4 blendColor) {
    vec4 result;
    for (int i = 0; i < 3; i++) {
        result[i] = baseColor[i] < 0.5 ? (2.0 * baseColor[i] * blendColor[i]) : (1.0 - 2.0 * (1.0 - baseColor[i]) * (1.0 - blendColor[i]));
    }
    result.a = baseColor.a; // Preserve alpha of the base color
    return result;
}

vec3 adjustBrightness(vec3 color, float brightness) {
    return color + brightness;
}

vec3 adjustContrast(vec3 color, float contrast) {
    return (color - 0.5) * contrast + 0.5;
}

vec3 adjustSaturation(vec3 color, float saturation) {
    float grey = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(vec3(grey), color, saturation);
}

vec3 adjustGamma(vec3 color, float gamma) {
    return pow(color, vec3(1.0 / gamma));
}

void main() {
    float u_brightness = 0.0; // Typically, a range of -1.0 to 1.0
    float u_contrast = 1.0; // A typical range might be from 0.5 to 2.0.
    float u_saturation = 1.0; // Range: A value of 0.0 results in a grayscale image, while values greater than 1.0 increase the saturation, making the colors more intense.
    float u_gamma = 1.20; // The typical range is from 0.8 to 2.2

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0); // Start with a transparent color
    float totalAlpha = 0.0;

    for (int i = 0; i < 5; i++) {
        vec4 texColor = texture2D(textures[i], uv);
        float grayValue = (texColor.r + texColor.g + texColor.b) / 3.0;
        float influence = pow(blendFactors[i], blendSharpness) * textureInfluence[i];
        color += texColor * influence;
        totalAlpha += texColor.a * influence;
    }

    // Ensure color is normalized based on total alpha to prevent saturation
    if (totalAlpha > 0.0) {
        color /= totalAlpha;
    }

    // Set the calculated alpha to the color, ensuring it does not exceed 1.0
    color.a = min(totalAlpha, 1.0);

    // Adjust brightness, contrast, saturation, and gamma on the RGB components
    color.rgb = adjustBrightness(color.rgb, u_brightness);
    color.rgb = adjustContrast(color.rgb, u_contrast);
    color.rgb = adjustSaturation(color.rgb, u_saturation);
    color.rgb = adjustGamma(color.rgb, u_gamma);

    // Output the final color
    gl_FragColor = color;
}
