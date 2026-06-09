export const state = {
    width: 128,
    height: 64,
    color: "#38c7d8",
    activeId: 1,
    frame: 0,
    elements: [
        { id: 1, type: "text", x: 6, y: 6, w: 56, h: 9, text: "TEMP", size: 1, color: "#38c7d8", animation: "none", wrap: false },
        { id: 2, type: "text", x: 6, y: 22, w: 101, h: 16, text: "24.8 C", size: 2, color: "#ffffff", animation: "none", wrap: false },
        { id: 3, type: "rect", x: 86, y: 7, w: 30, h: 22, color: "#80d66b" },
        { id: 4, type: "progress", x: 8, y: 51, w: 94, h: 8, value: 62, color: "#e5be5d", style: "bar", animation: "none" },
        { id: 5, type: "line", x: 0, y: 45, w: 128, h: 2, color: "#38c7d8" }
    ]
};

export const toolDefaults = {
    text: { type: "text", x: 10, y: 10, w: 60, h: 10, text: "LABEL", size: 1, animation: "none", wrap: false },
    rect: { type: "rect", x: 20, y: 14, w: 42, h: 22 },
    fill: { type: "fill", x: 18, y: 18, w: 34, h: 16 },
    line: { type: "line", x: 8, y: 32, w: 64, h: 2 },
    circle: { type: "circle", x: 82, y: 16, w: 20, h: 20 },
    progress: { type: "progress", x: 12, y: 48, w: 76, h: 8, value: 55, style: "bar", animation: "none" }
};

export function activeElement() {
    return state.elements.find(el => el.id === state.activeId) || state.elements[0];
}

export function textPixelSize(el) {
    const text = String(el.text || "");
    const scale = Math.max(1, Number(el.size) || 1);
    
    if (el.wrap && el.w) {
        const currentW = Math.max(6, Math.min(128, el.w));
        const charsPerLine = Math.max(1, Math.floor(currentW / (6 * scale)));
        const lines = Math.ceil(text.length / charsPerLine) || 1;
        return {
            w: currentW,
            h: lines * 8 * scale
        };
    }
    
    const normalW = Math.max(scale, ((text.length * 6) - 1) * scale);
    return {
        w: Math.min(128, normalW),
        h: 8 * scale
    };
}

export function syncTextBounds(el) {
    if (el.type !== "text") return;
    const size = textPixelSize(el);
    
    if (!el.w) {
        el.w = size.w;
    }
    
    if (el.wrap) {
        el.h = size.h;
    } else {
        // Normal text size bound auto matching
        el.h = 8 * (Math.max(1, Number(el.size) || 1));
    }
}

export function clampElement(el) {
    el.w = Math.max(1, Math.min(128, Math.round(el.w)));
    el.h = Math.max(1, Math.min(64, Math.round(el.h)));
    el.x = Math.max(0, Math.min(128 - el.w, Math.round(el.x)));
    el.y = Math.max(0, Math.min(64 - el.h, Math.round(el.y)));
}