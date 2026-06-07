import { textPixelSize } from './state.js';

export function getTextAnimationX(el, state) {
    const textW = textPixelSize(el).w;
    
    switch (el.animation) {
        case "marquee":
            return state.width - (state.frame % (state.width + textW + 8));
        case "bounce": {
            const travel = Math.max(1, state.width - textW);
            const pos = state.frame % (travel * 2);
            return pos > travel ? travel * 2 - pos : pos;
        }
        case "glitch": {
            // कभी-कभी 1-2 पिक्सेल का रैंडम झटका (X अक्ष पर)
            if (Math.random() > 0.85) {
                return el.x + (Math.random() > 0.5 ? 2 : -2);
            }
            return el.x;
        }
        default:
            return el.x;
    }
}

export function getTextAnimationY(el, state) {
    switch (el.animation) {
        case "wave": {
            // वर्टीकल वेव (सिंक्रोनस साइन वेव मोशन)
            return el.y + Math.round(Math.sin(state.frame * 0.3) * 3);
        }
        default:
            return el.y;
    }
}

export function shouldRenderText(el, state) {
    if (el.animation === "blink" && Math.floor(state.frame / 18) % 2 === 0) {
        return false;
    }
    if (el.animation === "flash" && Math.floor(state.frame / 6) % 2 === 0) {
        return false;
    }
    return true;
}

export function getVisibleTextChars(el, state) {
    let text = String(el.text || "");
    if (el.animation === "typewriter") {
        const visible = state.frame % (text.length + 12);
        return text.slice(0, Math.min(text.length, visible));
    }
    return text;
}

export function animatedProgressValue(el, state) {
    if (el.animation === "indeterminate") return state.frame % 101;
    if (el.animation === "pulse") {
        const pos = state.frame % 100;
        return pos > 50 ? 100 - (pos - 50) * 2 : pos * 2;
    }
    return el.value || 0;
}