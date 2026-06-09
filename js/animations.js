function getAbsoluteRealTextWidth(el) {
    const text = String(el.text || "");
    const scale = Math.max(1, Number(el.size) || 1);
    return Math.max(scale, text.length * 6 * scale);
}

export function getTextAnimationX(el, state) {
    const realTextW = getAbsoluteRealTextWidth(el);
    const vFrame = state.frame * (el.animSpeed || 1);
    
    switch (el.animation) {
        case "marquee":
            // FIX: Real string width matrix calculation sequence mapping
            return el.x + el.w - (vFrame % (el.w + realTextW + 4));
            
        case "bounce": {
            const travel = Math.max(1, el.w - realTextW);
            const pos = vFrame % (travel * 2);
            return el.x + (pos > travel ? travel * 2 - pos : pos);
        }
        
        case "glitch": {
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
    const vFrame = state.frame * (el.animSpeed || 1);
    switch (el.animation) {
        case "wave": {
            return el.y + Math.round(Math.sin(vFrame * 0.3) * 3);
        }
        default:
            return el.y;
    }
}

export function shouldRenderText(el, state) {
    const vFrame = state.frame * (el.animSpeed || 1);
    if (el.animation === "blink" && Math.floor(vFrame / 18) % 2 === 0) {
        return false;
    }
    if (el.animation === "flash" && Math.floor(vFrame / 6) % 2 === 0) {
        return false;
    }
    return true;
}

export function getVisibleTextChars(el, state) {
    let text = String(el.text || "");
    const vFrame = state.frame * (el.animSpeed || 1);
    if (el.animation === "typewriter") {
        const visible = Math.floor(vFrame) % (text.length + 12);
        return text.slice(0, Math.min(text.length, visible));
    }
    return text;
}

export function animatedProgressValue(el, state) {
    const vFrame = state.frame * (el.animSpeed || 1);
    if (el.animation === "indeterminate") return vFrame % 101;
    if (el.animation === "pulse") {
        const pos = vFrame % 100;
        return pos > 50 ? 100 - (pos - 50) * 2 : pos * 2;
    }
    return el.value || 0;
}