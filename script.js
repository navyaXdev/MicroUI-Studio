
const screen = document.getElementById("screen");
const layers = document.getElementById("layers");
const props = document.getElementById("properties");
const code = document.getElementById("code");
const displaySize = document.getElementById("displaySize");
const customFields = document.getElementById("customFields");
const customW = document.getElementById("customW");
const customH = document.getElementById("customH");
const sizeMetric = document.getElementById("sizeMetric");
const layerMetric = document.getElementById("layerMetric");
const memoryMetric = document.getElementById("memoryMetric");
const rightRuler = document.getElementById("rightRuler");
const library = document.getElementById("library");
const wireMode = document.getElementById("wireMode");
const rotation = document.getElementById("rotation");
const previewZoom = document.getElementById("previewZoom");
const copyBtn = document.getElementById("copyBtn");
const copyBtnHtml = copyBtn.innerHTML;

const gfxFont = {
    " ": ["00000","00000","00000","00000","00000","00000","00000"],
    "!": ["00100","00100","00100","00100","00100","00000","00100"],
    ".": ["00000","00000","00000","00000","00000","01100","01100"],
    "-": ["00000","00000","00000","11111","00000","00000","00000"],
    "_": ["00000","00000","00000","00000","00000","00000","11111"],
    ":": ["00000","01100","01100","00000","01100","01100","00000"],
    "/": ["00001","00010","00100","01000","10000","00000","00000"],
    "0": ["01110","10001","10011","10101","11001","10001","01110"],
    "1": ["00100","01100","00100","00100","00100","00100","01110"],
    "2": ["01110","10001","00001","00010","00100","01000","11111"],
    "3": ["11110","00001","00001","01110","00001","00001","11110"],
    "4": ["00010","00110","01010","10010","11111","00010","00010"],
    "5": ["11111","10000","11110","00001","00001","10001","01110"],
    "6": ["00110","01000","10000","11110","10001","10001","01110"],
    "7": ["11111","00001","00010","00100","01000","01000","01000"],
    "8": ["01110","10001","10001","01110","10001","10001","01110"],
    "9": ["01110","10001","10001","01111","00001","00010","01100"],
    "A": ["01110","10001","10001","11111","10001","10001","10001"],
    "B": ["11110","10001","10001","11110","10001","10001","11110"],
    "C": ["01110","10001","10000","10000","10000","10001","01110"],
    "D": ["11110","10001","10001","10001","10001","10001","11110"],
    "E": ["11111","10000","10000","11110","10000","10000","11111"],
    "F": ["11111","10000","10000","11110","10000","10000","10000"],
    "G": ["01110","10001","10000","10111","10001","10001","01111"],
    "H": ["10001","10001","10001","11111","10001","10001","10001"],
    "I": ["01110","00100","00100","00100","00100","00100","01110"],
    "J": ["00111","00010","00010","00010","00010","10010","01100"],
    "K": ["10001","10010","10100","11000","10100","10010","10001"],
    "L": ["10000","10000","10000","10000","10000","10000","11111"],
    "M": ["10001","11011","10101","10101","10001","10001","10001"],
    "N": ["10001","11001","10101","10011","10001","10001","10001"],
    "O": ["01110","10001","10001","10001","10001","10001","01110"],
    "P": ["11110","10001","10001","11110","10000","10000","10000"],
    "Q": ["01110","10001","10001","10001","10101","10010","01101"],
    "R": ["11110","10001","10001","11110","10100","10010","10001"],
    "S": ["01111","10000","10000","01110","00001","00001","11110"],
    "T": ["11111","00100","00100","00100","00100","00100","00100"],
    "U": ["10001","10001","10001","10001","10001","10001","01110"],
    "V": ["10001","10001","10001","10001","10001","01010","00100"],
    "W": ["10001","10001","10001","10101","10101","10101","01010"],
    "X": ["10001","10001","01010","00100","01010","10001","10001"],
    "Y": ["10001","10001","01010","00100","00100","00100","00100"],
    "Z": ["11111","00001","00010","00100","01000","10000","11111"],
    "a": ["00000","00000","01110","00001","01111","10001","01111"],
    "b": ["10000","10000","10110","11001","10001","10001","11110"],
    "c": ["00000","00000","01110","10000","10000","10001","01110"],
    "d": ["00001","00001","01101","10011","10001","10001","01111"],
    "e": ["00000","00000","01110","10001","11111","10000","01110"],
    "f": ["00110","01001","01000","11100","01000","01000","01000"],
    "g": ["00000","01111","10001","10001","01111","00001","01110"],
    "h": ["10000","10000","10110","11001","10001","10001","10001"],
    "i": ["00100","00000","01100","00100","00100","00100","01110"],
    "j": ["00010","00000","00110","00010","00010","10010","01100"],
    "k": ["10000","10000","10010","10100","11000","10100","10010"],
    "l": ["01100","00100","00100","00100","00100","00100","01110"],
    "m": ["00000","00000","11010","10101","10101","10101","10101"],
    "n": ["00000","00000","10110","11001","10001","10001","10001"],
    "o": ["00000","00000","01110","10001","10001","10001","01110"],
    "p": ["00000","00000","11110","10001","11110","10000","10000"],
    "q": ["00000","00000","01101","10011","01111","00001","00001"],
    "r": ["00000","00000","10110","11001","10000","10000","10000"],
    "s": ["00000","00000","01111","10000","01110","00001","11110"],
    "t": ["01000","01000","11100","01000","01000","01001","00110"],
    "u": ["00000","00000","10001","10001","10001","10011","01101"],
    "v": ["00000","00000","10001","10001","10001","01010","00100"],
    "w": ["00000","00000","10001","10101","10101","10101","01010"],
    "x": ["00000","00000","10001","01010","00100","01010","10001"],
    "y": ["00000","00000","10001","10001","01111","00001","01110"],
    "z": ["00000","00000","11111","00010","00100","01000","11111"]
};

const state = {
    width: 128,
    height: 64,
    color: "#38c7d8",
    activeId: 1,
    frame: 0,
    elements: [
    { id: 1, type: "text", x: 6, y: 6, w: 56, h: 9, text: "TEMP", size: 1, color: "#38c7d8", animation: "none" },
    { id: 2, type: "text", x: 6, y: 22, w: 70, h: 18, text: "24.8 C", size: 2, color: "#ffffff", animation: "none" },
    { id: 3, type: "rect", x: 86, y: 7, w: 30, h: 22, color: "#80d66b" },
    { id: 4, type: "progress", x: 8, y: 51, w: 94, h: 8, value: 62, color: "#e5be5d", style: "bar", animation: "none" },
    { id: 5, type: "line", x: 0, y: 45, w: 128, h: 2, color: "#38c7d8" }
    ]
};

const toolDefaults = {
    text: { type: "text", x: 10, y: 10, w: 54, h: 10, text: "LABEL", size: 1, animation: "none" },
    rect: { type: "rect", x: 20, y: 14, w: 42, h: 22 },
    fill: { type: "fill", x: 18, y: 18, w: 34, h: 16 },
    line: { type: "line", x: 8, y: 32, w: 64, h: 2 },
    circle: { type: "circle", x: 82, y: 16, w: 20, h: 20 },
    progress: { type: "progress", x: 12, y: 48, w: 76, h: 8, value: 55, style: "bar", animation: "none" }
};

function pxX(x) { return (x / state.width) * 100; }
function pxY(y) { return (y / state.height) * 100; }

function activeElement() {
    return state.elements.find(el => el.id === state.activeId) || state.elements[0];
}

function textPixelSize(el) {
    const text = String(el.text || "");
    const scale = Math.max(1, Number(el.size) || 1);
    return {
    w: Math.max(scale, ((text.length * 6) - 1) * scale),
    h: 8 * scale
    };
}

function syncTextBounds(el) {
    if (el.type !== "text") return;
    const size = textPixelSize(el);
    el.w = size.w;
    el.h = size.h;
}

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
    const scale = Math.max(1, Number(el.size) || 1);
    const textW = textPixelSize(el).w;
    let drawX = el.x;
    if (el.animation === "blink" && Math.floor(state.frame / 18) % 2 === 0) return;
    if (el.animation === "marquee") {
    drawX = state.width - (state.frame % (state.width + textW + 8));
    }
    if (el.animation === "bounce") {
    const travel = Math.max(1, state.width - textW);
    const pos = state.frame % (travel * 2);
    drawX = pos > travel ? travel * 2 - pos : pos;
    }
    let text = String(el.text || "");
    if (el.animation === "typewriter") {
    const visible = state.frame % (text.length + 12);
    text = text.slice(0, Math.min(text.length, visible));
    }
    [...text].forEach((char, index) => {
    const glyph = gfxFont[char] || gfxFont[" "];
    glyph.forEach((row, gy) => {
        [...row].forEach((pixel, gx) => {
        if (pixel !== "1") return;
        ctx.fillStyle = color;
        ctx.fillRect(drawX + ((index * 6 + gx) * scale), el.y + (gy * scale), scale, scale);
        });
    });
    });
}

function animatedProgressValue(el) {
    if (el.animation === "indeterminate") return state.frame % 101;
    if (el.animation === "pulse") {
    const pos = state.frame % 100;
    return pos > 50 ? 100 - (pos - 50) * 2 : pos * 2;
    }
    return el.value || 0;
}

function drawProgress(ctx, el, color) {
    const value = animatedProgressValue(el);
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

function drawPreviewCanvas(canvas) {
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

function render() {
    renderDesign();
    renderProperties();
}

function renderDesign() {
    screen.style.setProperty("--screen-ratio", `${state.width} / ${state.height}`);
    screen.style.width = `min(86vw, ${state.width * Number(previewZoom.value)}px)`;
    screen.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.className = `preview-canvas rot-${rotation.value}`;
    screen.appendChild(canvas);
    const content = document.createElement("div");
    content.className = `screen-content rot-${rotation.value}`;
    screen.appendChild(content);
    state.elements.forEach(el => {
    syncTextBounds(el);
    const node = document.createElement("div");
    node.className = `element el-${el.type}${el.id === state.activeId ? " active" : ""}`;
    node.dataset.id = el.id;
    node.style.left = `${pxX(el.x)}%`;
    node.style.top = `${pxY(el.y)}%`;
    node.style.width = `${pxX(el.w)}%`;
    node.style.height = `${pxY(el.h)}%`;
    node.style.color = el.color || state.color;
    node.style.setProperty("--font-size", `${Math.max(8, el.size * 8)}px`);
    node.style.setProperty("--fill", `${el.value || 55}%`);
    node.addEventListener("pointerdown", startDrag);
    content.appendChild(node);
    });
    drawPreviewCanvas(canvas);

    renderLayers();
    renderCode();
    sizeMetric.textContent = `${state.width} x ${state.height}`;
    rightRuler.textContent = `${state.width},${state.height}`;
    layerMetric.textContent = state.elements.length;
    memoryMetric.textContent = `${Math.ceil(state.width * state.height / 8 / 1024)} KB`;
}

function renderLayers() {
    layers.innerHTML = "";
    state.elements.slice().reverse().forEach(el => {
    const btn = document.createElement("button");
    btn.className = `layer${el.id === state.activeId ? " active" : ""}`;
    btn.innerHTML = `<strong>${labelFor(el)}</strong><span>x:${el.x} y:${el.y} w:${el.w} h:${el.h}</span>`;
    btn.onclick = () => { state.activeId = el.id; render(); };
    layers.appendChild(btn);
    });
}

function renderProperties() {
    const el = activeElement();
    if (!el) {
    props.innerHTML = `<p class="hint">Add an element to edit its properties.</p>`;
    return;
    }
    props.innerHTML = `
    <div class="grid-2">
        <div class="field"><label>X</label><input data-prop="x" type="number" value="${el.x}"></div>
        <div class="field"><label>Y</label><input data-prop="y" type="number" value="${el.y}"></div>
        <div class="field"><label>Width</label><input data-prop="w" type="number" value="${el.w}"></div>
        <div class="field"><label>Height</label><input data-prop="h" type="number" value="${el.h}"></div>
    </div>
    ${el.type === "text" ? `<div class="field"><label>Text</label><input data-prop="text" value="${escapeHtml(el.text)}"></div><div class="grid-2"><div class="field"><label>Text scale</label><input data-prop="size" type="number" min="1" max="4" value="${el.size}"></div><div class="field"><label>Animation</label><select data-prop="animation"><option value="none"${el.animation === "none" ? " selected" : ""}>None</option><option value="blink"${el.animation === "blink" ? " selected" : ""}>Blink</option><option value="marquee"${el.animation === "marquee" ? " selected" : ""}>Marquee</option><option value="bounce"${el.animation === "bounce" ? " selected" : ""}>Bounce</option><option value="typewriter"${el.animation === "typewriter" ? " selected" : ""}>Typewriter</option></select></div></div>` : ""}
    ${el.type === "progress" ? `<div class="field"><label>Value</label><input data-prop="value" type="range" min="0" max="100" value="${el.value}"></div><div class="grid-2"><div class="field"><label>Style</label><select data-prop="style"><option value="bar"${el.style === "bar" ? " selected" : ""}>Bar</option><option value="blocks"${el.style === "blocks" ? " selected" : ""}>Blocks</option><option value="ticks"${el.style === "ticks" ? " selected" : ""}>Ticks</option><option value="thin"${el.style === "thin" ? " selected" : ""}>Thin line</option></select></div><div class="field"><label>Animation</label><select data-prop="animation"><option value="none"${el.animation === "none" ? " selected" : ""}>None</option><option value="indeterminate"${el.animation === "indeterminate" ? " selected" : ""}>Loading</option><option value="pulse"${el.animation === "pulse" ? " selected" : ""}>Pulse</option></select></div></div>` : ""}
    <div class="field"><label>OLED color</label><div class="swatches">
        ${["#38c7d8", "#ffffff", "#80d66b", "#e5be5d"].map(c => `<button class="swatch${el.color === c ? " active" : ""}" data-color="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")}
    </div></div>
    <button class="btn" id="deleteBtn"><svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 18h10l1-18"/></svg>Delete element</button>
    `;

    props.querySelectorAll("[data-prop]").forEach(input => {
    input.addEventListener(input.tagName === "SELECT" ? "change" : "input", event => {
        const key = event.target.dataset.prop;
        el[key] = event.target.type === "number" || event.target.type === "range" ? Number(event.target.value) : event.target.value;
        clampElement(el);
        renderDesign();
    });
    });

    props.querySelectorAll("[data-color]").forEach(btn => {
    btn.addEventListener("click", () => {
        el.color = btn.dataset.color;
        render();
    });
    });

    document.getElementById("deleteBtn").onclick = () => {
    state.elements = state.elements.filter(item => item.id !== el.id);
    state.activeId = state.elements[0]?.id || null;
    render();
    };
}

function labelFor(el) {
    if (el.type === "text") return `Text: ${el.text}`;
    return el.type.charAt(0).toUpperCase() + el.type.slice(1);
}

function startDrag(event) {
    const el = state.elements.find(item => item.id === Number(event.currentTarget.dataset.id));
    state.activeId = el.id;
    const rect = screen.getBoundingClientRect();
    const start = { x: event.clientX, y: event.clientY, elX: el.x, elY: el.y };
    event.currentTarget.setPointerCapture(event.pointerId);

    function move(e) {
    const dx = Math.round(((e.clientX - start.x) / rect.width) * state.width);
    const dy = Math.round(((e.clientY - start.y) / rect.height) * state.height);
    el.x = start.elX + dx;
    el.y = start.elY + dy;
    clampElement(el);
    render();
    }

    function stop() {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    render();
}

function clampElement(el) {
    el.w = Math.max(1, Math.min(state.width, Math.round(el.w)));
    el.h = Math.max(1, Math.min(state.height, Math.round(el.h)));
    el.x = Math.max(0, Math.min(state.width - el.w, Math.round(el.x)));
    el.y = Math.max(0, Math.min(state.height - el.h, Math.round(el.y)));
}

function addElement(type) {
    const next = { ...toolDefaults[type], id: Date.now(), color: state.color };
    clampElement(next);
    state.elements.push(next);
    state.activeId = next.id;
    render();
}

function setSize() {
    const value = displaySize.value;
    customFields.hidden = value !== "custom";
    if (value === "custom") {
    state.width = Number(customW.value);
    state.height = Number(customH.value);
    } else {
    const [w, h] = value.split("x").map(Number);
    state.width = w;
    state.height = h;
    }
    state.elements.forEach(clampElement);
    render();
}

function renderCode() {
    const lib = library.value;
    const include = lib.includes("SH110X") ? "#include <Adafruit_SH110X.h>" : "#include <Adafruit_SSD1306.h>";
    const colorConst = lib.includes("SH110X") ? "SH110X_WHITE" : "SSD1306_WHITE";
    const isSpi = wireMode.value === "SPI";
    const pinBlock = isSpi
    ? "\n#define OLED_DC 9\n#define OLED_CS 10\n#define OLED_RESET 8\n"
    : "\n#define OLED_RESET -1\n";
    const constructor = lib.includes("SH110X")
    ? isSpi
        ? `Adafruit_SH1106G display(${state.width}, ${state.height}, &SPI, OLED_DC, OLED_RESET, OLED_CS);`
        : `Adafruit_SH1106G display(${state.width}, ${state.height}, &Wire, OLED_RESET);`
    : isSpi
        ? `Adafruit_SSD1306 display(${state.width}, ${state.height}, &SPI, OLED_DC, OLED_RESET, OLED_CS);`
        : `Adafruit_SSD1306 display(${state.width}, ${state.height}, &Wire, OLED_RESET);`;
    const begin = lib.includes("SH110X")
    ? isSpi ? "display.begin(0x3C, true);" : "display.begin(0x3C, true);"
    : isSpi ? "display.begin(SSD1306_SWITCHCAPVCC);" : "display.begin(SSD1306_SWITCHCAPVCC, 0x3C);";

    const hasProgress = state.elements.some(el => el.type === "progress");
    const hasAnimation = state.elements.some(el => el.animation && el.animation !== "none");
    const helperCode = hasProgress ? `
void drawProgressBar(int x, int y, int w, int h, int value, int style) {
int fill = max(0, ((w - 4) * value) / 100);
if (style == 1) {
display.drawRect(x, y, w, h, ${colorConst});
int blockCount = 8;
int gap = 2;
int blockW = max(2, (w - 4 - gap * (blockCount - 1)) / blockCount);
int active = (blockCount * value) / 100;
for (int i = 0; i < active; i++) {
    display.fillRect(x + 2 + i * (blockW + gap), y + 2, blockW, max(1, h - 4), ${colorConst});
}
} else if (style == 2) {
display.drawRect(x, y, w, h, ${colorConst});
for (int px = 2; px < fill + 2; px += 4) {
    display.fillRect(x + px, y + 2, 2, max(1, h - 4), ${colorConst});
}
} else if (style == 3) {
display.drawLine(x, y + h / 2, x + w - 1, y + h / 2, ${colorConst});
display.drawLine(x, y + h / 2, x + fill, y + h / 2, ${colorConst});
} else {
display.drawRect(x, y, w, h, ${colorConst});
display.fillRect(x + 2, y + 2, fill, max(1, h - 4), ${colorConst});
}
}
` : "";
    const styleIds = { bar: 0, blocks: 1, ticks: 2, thin: 3 };

    const drawLines = state.elements.map((el, index) => {
    if (el.type === "text") {
        const textW = textPixelSize(el).w;
        const safeText = escapeCode(el.text);
        if (el.animation === "blink") {
        return `  if ((frame / 18) % 2 == 1) {\n    display.setTextSize(${el.size});\n    display.setCursor(${el.x}, ${el.y});\n    display.print("${safeText}");\n  }`;
        }
        if (el.animation === "marquee") {
        return `  int textX${index} = SCREEN_WIDTH - (frame % (SCREEN_WIDTH + ${textW + 8}));\n  display.setTextSize(${el.size});\n  display.setCursor(textX${index}, ${el.y});\n  display.print("${safeText}");`;
        }
        if (el.animation === "bounce") {
        return `  int travel${index} = max(1, SCREEN_WIDTH - ${textW});\n  int pos${index} = frame % (travel${index} * 2);\n  int textX${index} = pos${index} > travel${index} ? travel${index} * 2 - pos${index} : pos${index};\n  display.setTextSize(${el.size});\n  display.setCursor(textX${index}, ${el.y});\n  display.print("${safeText}");`;
        }
        if (el.animation === "typewriter") {
        return `  int chars${index} = frame % ${String(el.text || "").length + 12};\n  display.setTextSize(${el.size});\n  display.setCursor(${el.x}, ${el.y});\n  for (int i = 0; i < min(chars${index}, ${String(el.text || "").length}); i++) {\n    display.write("${safeText}"[i]);\n  }`;
        }
        return `  display.setTextSize(${el.size});\n  display.setCursor(${el.x}, ${el.y});\n  display.print("${safeText}");`;
    }
    if (el.type === "rect") return `  display.drawRect(${el.x}, ${el.y}, ${el.w}, ${el.h}, ${colorConst});`;
    if (el.type === "fill") return `  display.fillRect(${el.x}, ${el.y}, ${el.w}, ${el.h}, ${colorConst});`;
    if (el.type === "line") return `  display.drawLine(${el.x}, ${el.y}, ${el.x + el.w}, ${el.y}, ${colorConst});`;
    if (el.type === "circle") return `  display.drawCircle(${el.x + Math.round(el.w / 2)}, ${el.y + Math.round(el.h / 2)}, ${Math.round(Math.min(el.w, el.h) / 2)}, ${colorConst});`;
    if (el.type === "progress") {
        let valueExpr = `${el.value || 0}`;
        if (el.animation === "indeterminate") valueExpr = "frame % 101";
        if (el.animation === "pulse") valueExpr = "((frame % 100) > 50 ? 100 - ((frame % 100) - 50) * 2 : (frame % 100) * 2)";
        return `  drawProgressBar(${el.x}, ${el.y}, ${el.w}, ${el.h}, ${valueExpr}, ${styleIds[el.style || "bar"]});`;
    }
    return "";
    }).join("\n");

    code.textContent = `${include}
#include <Adafruit_GFX.h>
${isSpi ? "#include <SPI.h>" : "#include <Wire.h>"}

#define SCREEN_WIDTH ${state.width}
#define SCREEN_HEIGHT ${state.height}
${pinBlock}

${constructor}

void setup() {
${isSpi ? "SPI.begin();" : "Wire.begin();"}
${begin}
display.setRotation(${rotation.value});
display.clearDisplay();
display.setTextColor(${colorConst});
}

void loop() {
drawDashboard();
delay(80);
}

void drawDashboard() {
unsigned long frame = millis() / 80;
display.clearDisplay();
${drawLines}
display.display();
}
${helperCode}`;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function escapeCode(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

document.querySelectorAll("[data-tool]").forEach(btn => btn.addEventListener("click", () => addElement(btn.dataset.tool)));
document.querySelectorAll("[data-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
    document.querySelectorAll("[data-mode]").forEach(item => item.classList.remove("active"));
    btn.classList.add("active");
    const mode = btn.dataset.mode;
    state.color = mode === "blue" ? "#38c7d8" : mode === "white" ? "#ffffff" : "#80d66b";
    });
});

displaySize.addEventListener("change", setSize);
customW.addEventListener("input", setSize);
customH.addEventListener("input", setSize);
library.addEventListener("change", renderCode);
wireMode.addEventListener("change", renderCode);
rotation.addEventListener("change", renderDesign);
previewZoom.addEventListener("change", renderDesign);

document.getElementById("gridBtn").onclick = () => screen.classList.toggle("show-grid");
document.getElementById("resetBtn").onclick = () => location.reload();
copyBtn.onclick = async () => {
    await navigator.clipboard.writeText(code.textContent);
    copyBtn.innerHTML = "Copied";
    setTimeout(() => { copyBtn.innerHTML = copyBtnHtml; }, 900);
};
document.getElementById("downloadBtn").onclick = () => {
    const blob = new Blob([code.textContent], { type: "text/x-arduino" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "oled_dashboard.ino";
    a.click();
    URL.revokeObjectURL(url);
};

render();
setInterval(() => {
    state.frame = (state.frame + 1) % 10000;
    if (state.elements.some(el => el.animation && el.animation !== "none")) {
    renderDesign();
    }
}, 80);
