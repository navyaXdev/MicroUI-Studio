# 🚀 MicroUI Studio

**Visual UI Builder for Embedded OLED Displays**

MicroUI Studio is a browser-based visual editor for designing embedded display interfaces for OLED screens like SSD1306 and SH110X.
It allows developers to visually create UI layouts and automatically generate Arduino-compatible Adafruit display code.

---

## ✨ Features

* 🎨 Drag-and-drop OLED UI designer
* 📟 Multiple OLED display size support
* ⚡ Live preview rendering
* 🧩 Add UI components visually:

  * Text
  * Rectangles
  * Filled boxes
  * Lines
  * Circles
  * Progress bars
* 📐 Grid system for alignment
* 🧠 Automatic Adafruit GFX code generation
* 📋 One-click code copy
* 💾 Export Arduino `.ino` sketch
* 🌙 Modern dark developer UI
* 📱 Responsive design

---

## 🖥️ Supported Displays

| Display Type     | Resolution |
| ---------------- | ---------- |
| 1.3" OLED        | 128×64     |
| 0.91" OLED       | 128×32     |
| 0.96" Color OLED | 96×64      |
| 0.66" OLED       | 64×48      |
| Custom Displays  | Supported  |

---

## 🔧 Supported Libraries

* Adafruit SSD1306
* Adafruit SH110X
* Adafruit GFX

---

## 🚌 Communication Modes

* I2C
* SPI

---

## 📸 Preview

MicroUI Studio provides a visual canvas where you can:

* Design embedded dashboards
* Create IoT interfaces
* Build sensor monitoring screens
* Prototype OLED UI layouts quickly

---

## 🛠️ Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript

No frameworks required.

---

## 📂 Project Structure

```bash
MicroUI-Studio/
│
├── index.html
├── README.md
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/navyaXdev/MicroUI-Studio.git
```

### 2. Open Project

Simply open:

```bash
index.html
```

in your browser.

No installation needed.

---

## 🧠 How It Works

1. Select OLED display size
2. Add UI elements visually
3. Drag components on canvas
4. Customize properties
5. Generated Arduino code updates automatically
6. Copy/export code into Arduino IDE

---

## 📦 Generated Arduino Example

```cpp
display.setTextSize(2);
display.setCursor(6, 22);
display.print("24.8 C");

display.drawRect(86, 7, 30, 22, SSD1306_WHITE);

display.display();
```

---

## 🎯 Future Plans

* Image importing
* Bitmap converter
* Touch UI simulation
* ESP32 live preview
* Project save/load
* Figma-style alignment tools
* Multi-screen support
* Real-time hardware preview

---

## 🤝 Contributing

Contributions are welcome!

Feel free to:

* Fork the repository
* Create feature branches
* Submit pull requests

---

## 📜 License

MIT License

---

## 👨‍💻 Author

Developed by **Dinesh Patra**

---

## ⭐ Support

If you like this project:

* Star the repository
* Share with embedded developers
* Contribute ideas and improvements

---

## 🔥 Vision

Making embedded UI design as easy as designing in Figma.
