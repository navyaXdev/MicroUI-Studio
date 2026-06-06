# 🖥️ MicroUI Studio

> **Visual UI designer for embedded OLED displays — with ready-to-use Adafruit Arduino code.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-navyaxdev.github.io-38c7d8?style=for-the-badge&logo=github)](https://navyaxdev.github.io/MicroUI-Studio/)
![HTML](https://img.shields.io/badge/HTML-Single%20File-E34F26?style=flat-square&logo=html5)
![Vanilla JS](https://img.shields.io/badge/JS-Vanilla-F7DF1E?style=flat-square&logo=javascript)
![No dependencies](https://img.shields.io/badge/Dependencies-None-80d66b?style=flat-square)

---

## ✨ What is MicroUI Studio?

MicroUI Studio is a browser-based drag-and-drop UI builder for tiny embedded displays — think SSD1306 and SH110X OLED screens used with Arduino, ESP32, and similar microcontrollers. Design your UI visually, then copy the generated **Adafruit GFX** code straight into your project.

No installs. No build tools. Just open and design.

🔗 **Try it now:** [navyaxdev.github.io/MicroUI-Studio](https://navyaxdev.github.io/MicroUI-Studio/)

---

## 🚀 Features

### 🎨 Visual Canvas
- Pixel-accurate OLED preview with selectable **zoom levels** (3x – 6x)
- **Drag & drop** element positioning directly on the screen
- Toggle pixel grid overlay for precise alignment
- Supports **display rotation** (0°, 90°, 180°, 270°)

### 📐 Display Support
| Size | Inch | Notes |
|------|------|-------|
| 128 × 64 | 1.3" | Most common SSD1306 |
| 128 × 32 | 0.91" | Compact form factor |
| 96 × 64 | 0.96" | Color variant |
| 64 × 48 | 0.66" | Tiny / wearables |
| Custom | — | Any width × height |

### 🧩 Elements You Can Add
| Element | Description |
|---------|-------------|
| **Text** | Pixel-font text with scale 1–4 |
| **Box** | Outlined rectangle |
| **Fill** | Filled rectangle |
| **Line** | Horizontal line |
| **Circle** | Outlined circle |
| **Progress Bar** | Bar, Blocks, Ticks, or Thin line styles |

### 🎬 Animations (preview in real-time)
- **Text:** Blink, Marquee, Bounce, Typewriter
- **Progress:** Indeterminate (loading), Pulse

### ⚙️ Code Generation
- Supports **Adafruit SSD1306** and **Adafruit SH110X** libraries
- **I2C** and **SPI** bus modes
- Generates a complete `.ino` sketch — includes `setup()`, `loop()`, and helper functions
- One-click **Copy to clipboard** or **Download as `.ino`**

---

## 🖼️ Preview

```
┌─────────────────────────────┐
│ TEMP          ┌──────────┐  │
│ 24.8 C        │          │  │
│               └──────────┘  │
│─────────────────────────────│
│ ████████████░░░░░░░░░░░░░░  │
└─────────────────────────────┘
```

---

## 🛠️ How to Use

1. **Open** the live demo or clone & open `index.html` in any browser
2. **Select** your OLED display size and library from the left panel
3. **Add elements** (Text, Box, Circle, Progress Bar, etc.) using the element buttons
4. **Drag** elements on the canvas to position them
5. **Edit properties** — text content, size, color, animation — in the right panel
6. **Copy or download** the generated Arduino sketch
7. **Paste** the code into your Arduino IDE and flash to your device

---

## 📦 Getting Started Locally

No build step required — it's a single HTML file.

```bash
git clone https://github.com/navyaxdev/MicroUI-Studio.git
cd MicroUI-Studio
# Open index.html in your browser
open index.html
```

---

## 🔌 Arduino Dependencies

Install these libraries via the Arduino Library Manager:

- [`Adafruit SSD1306`](https://github.com/adafruit/Adafruit_SSD1306)
- [`Adafruit SH110X`](https://github.com/adafruit/Adafruit_SH110x)
- [`Adafruit GFX Library`](https://github.com/adafruit/Adafruit-GFX-Library)

---

## 🏗️ Tech Stack

- **Pure HTML + CSS + Vanilla JS** — zero dependencies, zero frameworks
- Pixel rendering via the **Canvas 2D API** (Bresenham line/circle algorithms)
- Custom **5×7 pixel font** renderer (GFX-compatible)
- Fully client-side — nothing is sent to any server

---

## 📁 Project Structure

```
MicroUI-Studio/
└── index.html    # The entire app — self-contained single file
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👤 Author

**Dinesh Patra**
- GitHub: [@navyaxdev](https://github.com/navyaxdev)
- Project: [MicroUI Studio](https://navyaxdev.github.io/MicroUI-Studio/)

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

---

<p align="center">Made with ❤️ for the embedded systems community</p>