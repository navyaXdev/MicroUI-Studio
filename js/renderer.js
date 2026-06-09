import { state, syncTextBounds } from './state.js';
import { gfxFont } from './font.js';
import { getTextAnimationX, getTextAnimationY, shouldRenderText, getVisibleTextChars, animatedProgressValue } from './animations.js';

function drawPixel(ctx, x, y, color) {
    if (x < 0 || y < 0 || x >= state.width || y >= state.height) return;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

function drawLinePixels(ctx, x0, y0, x1, y1, color) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0);
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    while (true) {
        drawPixel(ctx, x0, y0, color);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
    }
}

function drawRectPixels(ctx, x, y, w, h, color) {
    drawLinePixels(ctx, x, y, x + w - 1, y, color);
    drawLinePixels(ctx, x, y + h - 1, x + w - 1, y + h - 1, color);
    drawLinePixels(ctx, x, y, x, y + h - 1, color);
    drawLinePixels(ctx, x + w - 1, y, x + w - 1, y + h - 1, color);
}

function drawCirclePixels(ctx, cx, cy, radius, color) {
    let x = Math.round(radius);
    let y = 0;
    let err = 0;
    while (x >= y) {
        [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]].forEach(([dx, dy]) => {
            drawPixel(ctx, cx + dx, cy + dy, color);
        });
        y++;
        if (err <= 0) {
            err += 2 * y + 1;
        } else {
            x--;
            err += 2 * (y - x) + 1;
        }
    }
}

function drawGfxText(ctx, el, color) {
    if (!shouldRenderText(el, state)) return;
    
    const scale = Math.max(1, Number(el.size) || 1);
    const drawX = getTextAnimationX(el, state);
    const drawY = getTextAnimationY(el, state);
    const text = getVisibleTextChars(el, state);
    
    let currentLine = 0;
    let charOffset = 0;
    const charWidth = 6 * scale;
    const lineHeight = 8 * scale;

    [...text].forEach((char) => {
        if (el.wrap && (charOffset * charWidth >= el.w)) {
            currentLine++;
            charOffset = 0;
        }

        const glyph = gfxFont[char] || gfxFont[" "];
        // Path logic mapping
        const pixelX = (el.animation && el.animation !== "none") ? (drawX + (charOffset * charWidth)) : (el.x + (charOffset * charWidth));
        const pixelY = drawY + (currentLine * lineHeight);

        // STRICT FIX: Condition ko wapas secure kar diya.
        // Pixel tabhi draw hoga jab wo strictly yellow box boundaries ke andar aur screen limits me ho!
        if (pixelX >= el.x && (pixelX + charWidth) <= (el.x + el.w) && pixelY >= el.y && (pixelY + lineHeight) <= (el.y + el.h)) {
            if (pixelX >= 0 && pixelX < 128 && pixelY >= 0 && pixelY < 64) {
                glyph.forEach((row, gy) => {
                    [...row].forEach((pixel, gx) => {
                        if (pixel !== "1") return;
                        ctx.fillStyle = color;
                        ctx.fillRect(pixelX + (gx * scale), pixelY + (gy * scale), scale, scale);
                    });
                });
            }
        }
        charOffset++;
    });
}

function drawProgress(ctx, el, color) {
    const value = animatedProgressValue(el, state);
    const fill = Math.max(0, Math.round((el.w - 4) * value / 100));
    const style = el.style || "bar";
    if (style === "thin") {
        drawLinePixels(ctx, el.x, el.y + Math.floor(el.h / 2), el.x + el.w - 1, el.y + Math.floor(el.h / 2), color);
        drawLinePixels(ctx, el.x, el.y + Math.floor(el.h / 2), el.x + fill, el.y + Math.floor(el.h / 2), color);
        return;
    }
    if (style === "blocks") {
        drawRectPixels(ctx, el.x, el.y, el.w, el.h, color);
        const blockCount = 8;
        const gap = 2;
        const blockW = Math.max(2, Math.floor((el.w - 4 - gap * (blockCount - 1)) / blockCount));
        const active = Math.round(blockCount * value / 100);
        ctx.fillStyle = color;
        for (let i = 0; i < active; i++) {
            ctx.fillRect(el.x + 2 + i * (blockW + gap), el.y + 2, blockW, Math.max(1, el.h - 4));
        }
        return;
    }
    if (style === "ticks") {
        drawRectPixels(ctx, el.x, el.y, el.w, el.h, color);
        ctx.fillStyle = color;
        for (let x = 2; x < fill + 2; x += 4) {
            ctx.fillRect(el.x + x, el.y + 2, 2, Math.max(1, el.h - 4));
        }
        return;
    }
    drawRectPixels(ctx, el.x, el.y, el.w, el.h, color);
    ctx.fillStyle = color;
    ctx.fillRect(el.x + 2, el.y + 2, fill, Math.max(1, el.h - 4));
}

export function drawPreviewCanvas(canvas) {
    canvas.width = state.width;
    canvas.height = state.height;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, state.width, state.height);
    state.elements.forEach(el => {
        const color = el.color || state.color;
        if (el.type === "text") {
            drawGfxText(ctx, el, color);
        } else if (el.type === "rect") {
            drawRectPixels(ctx, el.x, el.y, el.w, el.h, color);
        } else if (el.type === "fill") {
            ctx.fillStyle = color;
            ctx.fillRect(el.x, el.y, el.w, el.h);
        } else if (el.type === "line") {
            drawLinePixels(ctx, el.x, el.y, el.x + el.w, el.y, color);
        } else if (el.type === "circle") {
            drawCirclePixels(ctx, el.x + Math.round(el.w / 2), el.y + Math.round(el.h / 2), Math.round(Math.min(el.w, el.h) / 2), color);
        } else if (el.type === "progress") {
            drawProgress(ctx, el, color);
        }
    });
}