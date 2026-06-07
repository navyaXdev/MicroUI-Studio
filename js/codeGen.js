import { state } from './state.js';

function escapeCode(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function generateAdafruitCode(libraryVal, wireModeVal, rotationVal) {
    const include = libraryVal.includes("SH110X") ? "#include <Adafruit_SH110X.h>" : "#include <Adafruit_SSD1306.h>";
    const colorConst = libraryVal.includes("SH110X") ? "SH110X_WHITE" : "SSD1306_WHITE";
    const isSpi = wireModeVal === "SPI";
    const styleIds = { bar: 0, blocks: 1, ticks: 2, thin: 3 };

    const drawLines = state.elements.map((el, index) => {
        const safeW = Math.max(1, Math.min(128, Math.round(el.w || 1)));
        const safeX = Math.max(0, Math.min(128 - safeW, Math.round(el.x || 0)));

        if (el.type === "text") {
            const safeText = escapeCode(el.text);
            const scale = el.size;
            
            let renderingBlock = "";
            if (el.wrap) {
                renderingBlock = `  display.setTextSize(${scale});\n  display.setTextWrap(true);\n  display.setCursor(${safeX}, ${el.y});\n  display.print("${safeText}");`;
            } else {
                renderingBlock = `  display.setTextSize(${scale});\n  display.setTextWrap(false);\n  display.setCursor(${safeX}, ${el.y});\n  display.print("${safeText}");`;
            }
            
            if (el.animation === "blink") {
                return `  if (((millis() / 80) / 18) % 2 == 1) {\n  ${renderingBlock}\n  }`;
            } else if (el.animation === "marquee" || el.animation === "bounce" || el.animation === "typewriter" || el.animation === "wave") {
                return `  drawClippedText("${safeText}", ${safeX}, ${el.y}, ${safeW}, ${el.h}, ${scale}, "${el.animation}", frame, ${el.animSpeed || 1.0});`;
            } else {
                return `  drawClippedText("${safeText}", ${safeX}, ${el.y}, ${safeW}, ${el.h}, ${scale}, "none", frame, 1.0);`;
            }
        }
        if (el.type === "rect") return `  display.drawRect(${safeX}, ${el.y}, ${safeW}, ${el.h}, ${colorConst});`;
        if (el.type === "fill") return `  display.fillRect(${safeX}, ${el.y}, ${safeW}, ${el.h}, ${colorConst});`;
        if (el.type === "line") return `  display.drawLine(${safeX}, ${el.y}, ${safeX + safeW}, ${el.y}, ${colorConst});`;
        if (el.type === "circle") return `  display.drawCircle(${safeX + Math.round(safeW / 2)}, ${el.y + Math.round(el.h / 2)}, ${Math.round(Math.min(safeW, el.h) / 2)}, ${colorConst});`;
        if (el.type === "progress") {
            let valueExpr = `${el.value || 0}`;
            if (el.animation === "indeterminate") valueExpr = "(frame * " + (el.animSpeed || 1) + ") % 101";
            if (el.animation === "pulse") valueExpr = "(((int)(frame * " + (el.animSpeed || 1) + ") % 100) > 50 ? 100 - (((int)(frame * " + (el.animSpeed || 1) + ") % 100) - 50) * 2 : ((int)(frame * " + (el.animSpeed || 1) + ") % 100) * 2)";
            return `  drawProgressBar(${safeX}, ${el.y}, ${safeW}, ${el.h}, ${valueExpr}, ${styleIds[el.style || "bar"]});`;
        }
        return "";
    }).join("\n");

    const pinBlock = isSpi
        ? "\n#define OLED_DC 9\n#define OLED_CS 10\n#define OLED_RESET 8\n"
        : "\n#define OLED_RESET -1\n";
        
    const constructor = libraryVal.includes("SH110X")
        ? (isSpi ? `Adafruit_SH1106G display(${state.width}, ${state.height}, &SPI, OLED_DC, OLED_RESET, OLED_CS);` : `Adafruit_SH1106G display(${state.width}, ${state.height}, &Wire, OLED_RESET);`)
        : (isSpi ? `Adafruit_SSD1306 display(${state.width}, ${state.height}, &SPI, OLED_DC, OLED_RESET, OLED_CS);` : `Adafruit_SSD1306 display(${state.width}, ${state.height}, &Wire, OLED_RESET);`);
            
    const begin = libraryVal.includes("SH110X") ? "display.begin(0x3C, true);" : (isSpi ? "display.begin(SSD1306_SWITCHCAPVCC);" : "display.begin(SSD1306_SWITCHCAPVCC, 0x3C);");

    const hasProgress = state.elements.some(el => el.type === "progress");
    
    const declarationBlock = `// Forward Declarations\nvoid drawDashboard();\nvoid drawClippedText(String text, int bx, int by, int bw, int bh, int scale, String anim, unsigned long frame, float speed);\n${hasProgress ? "void drawProgressBar(int x, int y, int w, int h, int value, int style);\n" : ""}`;

    const helperCode = `
void drawClippedText(String text, int bx, int by, int bw, int bh, int scale, String anim, unsigned long frame, float speed) {
  int textW = text.length() * 6 * scale;
  int drawX = bx;
  int drawY = by;
  unsigned long vFrame = frame * speed;

  if (anim == "marquee") {
    drawX = bx + bw - (vFrame % (bw + textW + 4));
  } else if (anim == "bounce") {
    int travel = max(1, bw - textW);
    int pos = vFrame % (travel * 2);
    drawX = bx + (pos > travel ? travel * 2 - pos : pos);
  } else if (anim == "wave") {
    drawY = by + (int)(sin(vFrame * 0.3) * 3);
  } else if (anim == "typewriter") {
    int visible = vFrame % (text.length() + 12);
    if (visible < text.length()) {
      text = text.substring(0, visible);
    }
  }

  int currentX = drawX;
  for (int i = 0; i < text.length(); i++) {
    char c = text[i];
    int charWidth = 6 * scale;
    if (currentX + charWidth > bx && currentX < bx + bw) {
      display.setTextSize(scale);
      display.setCursor(currentX, drawY);
      display.print(c);
    }
    currentX += charWidth;
  }
}

${hasProgress ? `void drawProgressBar(int x, int y, int w, int h, int value, int style) {
  int fill = max(0, ((w - 4) * value) / 100);
  if (style == 1) {
    display.drawRect(x, y, w, h, ${colorConst});
    int blockCount = 8; int gap = 2;
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
}` : ""}`;

    return `${include}
#include <Adafruit_GFX.h>
${isSpi ? "#include <SPI.h>" : "#include <Wire.h>"}

#define SCREEN_WIDTH ${state.width}
#define SCREEN_HEIGHT ${state.height}
${pinBlock}
${constructor}

${declarationBlock}
void setup() {
  ${isSpi ? "SPI.begin();" : "Wire.begin();"}
  ${begin}
  display.setRotation(${rotationVal});
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