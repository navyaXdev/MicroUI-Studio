import { state, toolDefaults, activeElement, clampElement, syncTextBounds, textPixelSize } from './state.js';
import { drawPreviewCanvas } from './renderer.js';
import { generateAdafruitCode } from './codeGen.js';

// DOM Elements
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

function pxX(x) { return (x / state.width) * 100; }
function pxY(y) { return (y / state.height) * 100; }

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function labelFor(el) {
    if (el.type === "text") return `Text: ${el.text}`;
    return el.type.charAt(0).toUpperCase() + el.type.slice(1);
}

function render() {
    renderDesign();
    renderProperties();
}

function renderDesign() {
    screen.style.setProperty("--screen-ratio", `${state.width} / ${state.height}`);
    screen.style.setProperty("--grid-w", state.width);
    screen.style.setProperty("--grid-h", state.height);
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
        
        // CLEAN: Individual element layout transform block completely cleared
        node.style.transform = "none";
        
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
    
    const isText = el.type === "text";
    const hasAnim = el.animation && el.animation !== "none";
    
    props.innerHTML = `
    <div class="grid-2">
        <div class="field"><label>X</label><input data-prop="x" type="number" value="${el.x}"></div>
        <div class="field"><label>Y</label><input data-prop="y" type="number" value="${el.y}"></div>
        <div class="field"><label>Width</label><input data-prop="w" type="number" value="${el.w}" min="1" max="128"></div>
        <div class="field"><label>Height</label><input data-prop="h" type="number" value="${el.h}" disabled></div>
    </div>

    ${hasAnim ? `
    <div class="field">
        <label>Animation Speed (${el.animSpeed || 1}x)</label>
        <input data-prop="animSpeed" type="range" min="0.1" max="5" step="0.1" value="${el.animSpeed || 1}">
    </div>` : ""}

    ${isText ? `
    <div class="field" style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <input data-prop="wrap" type="checkbox" ${el.wrap ? "checked" : ""} style="width: auto; min-height: auto; cursor: pointer;">
        <label style="margin-bottom: 0; cursor: pointer; user-select: none;">Word Wrap (Auto New Line)</label>
    </div>
    <div class="field"><label>Text</label><input data-prop="text" value="${escapeHtml(el.text)}"></div>
    <div class="grid-2">
        <div class="field"><label>Text scale</label><input data-prop="size" type="number" min="1" max="4" value="${el.size}"></div>
        <div class="field"><label>Animation</label>
            <select data-prop="animation">
                <option value="none"${el.animation === "none" ? " selected" : ""}>None</option>
                <option value="blink"${el.animation === "blink" ? " selected" : ""}>Blink</option>
                <option value="marquee"${el.animation === "marquee" ? " selected" : ""}>Marquee</option>
                <option value="bounce"${el.animation === "bounce" ? " selected" : ""}>Bounce</option>
                <option value="typewriter"${el.animation === "typewriter" ? " selected" : ""}>Typewriter</option>
            </select>
        </div>
    </div>` : ""}
    ${el.type === "progress" ? `<div class="field"><label>Value</label><input data-prop="value" type="range" min="0" max="100" value="${el.value}"></div><div class="grid-2"><div class="field"><label>Style</label><select data-prop="style"><option value="bar"${el.style === "bar" ? " selected" : ""}>Bar</option><option value="blocks"${el.style === "blocks" ? " selected" : ""}>Blocks</option><option value="ticks"${el.style === "ticks" ? " selected" : ""}>Ticks</option><option value="thin"${el.style === "thin" ? " selected" : ""}>Thin line</option></select></div><div class="field"><label>Animation</label><select data-prop="animation"><option value="none"${el.animation === "none" ? " selected" : ""}>None</option><option value="indeterminate"${el.animation === "indeterminate" ? " selected" : ""}>Loading</option><option value="pulse"${el.animation === "pulse" ? " selected" : ""}>Pulse</option></select></div></div>` : ""}
    <div class="field"><label>OLED color</label><div class="swatches">
        ${["#38c7d8", "#ffffff", "#80d66b", "#e5be5d"].map(c => `<button class="swatch${el.color === c ? " active" : ""}" data-color="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")}
    </div></div>
    <button class="btn" id="deleteBtn"><svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 18h10l1-18"/></svg>Delete element</button>
    `;

    props.querySelectorAll("[data-prop]").forEach(input => {
        input.addEventListener(input.tagName === "SELECT" ? "change" : "input", event => {
            const key = event.target.dataset.prop;
            if (event.target.type === "checkbox") {
                el[key] = event.target.checked;
            } else {
                el[key] = event.target.type === "number" || event.target.type === "range" ? Number(event.target.value) : event.target.value;
            }
            
            clampElement(el);
            if (el.type === "text") syncTextBounds(el);
            renderDesign();
            if (key === "animation") renderProperties();
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

function startDrag(event) {
    const el = state.elements.find(item => item.id === Number(event.currentTarget.dataset.id));
    if(!el) return;
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

function renderCode() {
    code.textContent = generateAdafruitCode(library.value, wireMode.value, rotation.value);
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

// Event Listeners setup
document.querySelectorAll("[data-tool]").forEach(btn => btn.addEventListener("click", () => {
    const type = btn.dataset.tool;
    const next = { ...toolDefaults[type], id: Date.now(), color: state.color, wrap: false, animSpeed: 1 };
    clampElement(next);
    state.elements.push(next);
    state.activeId = next.id;
    render();
}));

document.querySelectorAll("[data-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("[data-mode]").forEach(item => item.classList.remove("active"));
        btn.classList.add("active");
        const mode = btn.dataset.mode;
        state.color = mode === "blue" ? "#38c7d8" : mode === "white" ? "#ffffff" : "#80d66b";
        renderDesign();
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

// Initial Execution
render();

// Game Loop Setup
setInterval(() => {
    state.frame = (state.frame + 1) % 10000;
    renderDesign();
}, 80);