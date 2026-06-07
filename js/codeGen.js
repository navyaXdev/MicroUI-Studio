import { state } from './state.js';

function escapeCode(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function generateAdafruitCode(libraryVal, wireModeVal, rotationVal) {
    const include = libraryVal.includes("SH110X") ? "#include <Adafruit_SH110X.h>" : "#include <Adafruit_SSD1306.h>";
    const colorConst = libraryVal.includes("SH110X") ? "SH110X_WHITE" : "SSD1306_WHITE";
    const isSpi = wireModeVal === "SPI";
    
    const pinBlock = isSpi
        ? "\n#define OLED_DC 9\n#define OLED_CS 10\n#define OLED_RESET 8\n"
        : "\n#define OLED_RESET -1\n";
        
    const constructor = libraryVal.includes("SH110X")
        ? (isSpi
            ? `Adafruit_SH1106G display(${state.width}, ${state.height}, &SPI, OLED_DC, OLED_RESET, OLED_CS);`
            : `Adafruit_SH1106G display(${state.width}, ${state.height}, &Wire, OLED_RESET);`)
        : (isSpi
            ? `Adafruit_SSD1306 display(${state.width}, ${state.height}, &SPI, OLED_DC, OLED_RESET, OLED_CS);`
            : `Adafruit_SSD1306 display(${state.width}, ${state.height}, &Wire, OLED_RESET);`);
            
    const begin = libraryVal.includes("SH110X")
        ? "display.begin(0x3C, true);"
        : (isSpi ? "display.begin(SSD1306_SWITCHCAPVCC);" : "display.begin(SSD1306_SWITCHCAPVCC, 0x3C);");

    const hasProgress = state.elements.some(el => el.type === "progress");
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
            const safeText = escapeCode(el.text);
            const scale = el.size;
            const textW = ((el.text.length * 6) - 1) * scale;
            
            if (el.animation === "blink") {
                return `  if ((frame / 18) % 2 == 1) {\n    display.setTextSize(${scale});\n    display.setCursor(${el.x}, ${el.y});\n    display.print("${safeText}");\n  }`;
            }
            if (el.animation === "flash") {
                return `  if ((frame / 6) % 2 == 1) {\n    display.setTextSize(${scale});\n    display.setCursor(${el.x}, ${el.y});\n    display.print("${safeText}");\n  }`;
            }
            if (el.animation === "marquee") {
                return `  int textX${index} = SCREEN_WIDTH - (frame % (SCREEN_WIDTH + ${textW + 8}));\n  display.setTextSize(${scale});\n  display.setCursor(textX${index}, ${el.y});\n  display.print("${safeText}");`;
            }
            if (el.animation === "bounce") {
                return `  int travel${index} = max(1, SCREEN_WIDTH - ${textW});\n  int pos${index} = frame % (travel${index} * 2);\n  int textX${index} = pos${index} > travel${index} ? travel${index} * 2 - pos${index} : pos${index};\n  display.setTextSize(${scale});\n  display.setCursor(textX${index}, ${el.y});\n  display.print("${safeText}");`;
            }
            if (el.animation === "wave") {
                return `  int textY${index} = ${el.y} + (sin(frame * 0.3) * 3);\n  display.setTextSize(${scale});\n  display.setCursor(${el.x}, textY${index});\n  display.print("${safeText}");`;
            }
            if (el.animation === "glitch") {
                return `  int textX${index} = ${el.x} + ((random(0, 10) > 8) ? random(-2, 3) : 0);\n  display.setTextSize(${scale});\n  display.setCursor(textX${index}, ${el.y});\n  display.print("${safeText}");`;
            }
            if (el.animation === "typewriter") {
                return `  int chars${index} = frame % ${safeText.length + 12};\n  display.setTextSize(${scale});\n  display.setCursor(${el.x}, ${el.y});\n  for (int i = 0; i < min(chars${index}, ${safeText.length}); i++) {\n    display.write("${safeText}"[i]);\n  }`;
            }
            return `  display.setTextSize(${scale});\n  display.setCursor(${el.x}, ${el.y});\n  display.print("${safeText}");`;
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

    return `${include}
#include <Adafruit_GFX.h>
${isSpi ? "#include <SPI.h>" : "#include <Wire.h>"}

#define SCREEN_WIDTH ${state.width}
#define SCREEN_HEIGHT ${state.height}
${pinBlock}
${constructor}

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