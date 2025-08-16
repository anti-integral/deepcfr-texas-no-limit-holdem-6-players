from PyQt5.QtWidgets import QApplication

GREEN_FELT = "#1C6B3F"
GOLD = "#D4AF37"
SLATE = "#2B2F36"
TEXT_LIGHT = "#F5F5F5"
ACCENT_BLUE = "#5C85D6"
DANGER_RED = "#D9534F"
SECONDARY = "#6C757D"
RADIUS = 8

def app_qss():
    return f"""
    QWidget {{
      background-color: {SLATE};
      color: {TEXT_LIGHT};
      font-size: 14px;
    }}

    QMainWindow {{
      background-color: {SLATE};
    }}

    /* Group boxes (player panels etc.) */
    QGroupBox {{
      border: 1px solid #555;
      border-radius: {RADIUS}px;
      margin-top: 0.7em;
      padding: 8px;
      background-color: #2E333B;
    }}

    QGroupBox::title {{
      subcontrol-origin: margin;
      left: 12px;
      padding: 0 6px;
      color: {GOLD};
      font-weight: bold;
    }}

    /* Player panel states via dynamic property */
    QGroupBox[playerClass="current"] {{
      border: 2px solid {ACCENT_BLUE};
      background-color: #2B3A4D;
    }}

    QGroupBox[playerClass="button"] {{
      border: 2px solid {GOLD};
      background-color: #363B2E;
    }}

    /* Table felt and frames */
    QWidget#pokerTable {{
      background-color: {GREEN_FELT};
      border: 2px solid #0F3D22;
      border-radius: 28px;
      padding: 12px;
    }}

    QFrame#communityFrame {{
      background-color: rgba(255,255,255,0.08);
      border-radius: {RADIUS}px;
      border: 1px solid rgba(255,255,255,0.12);
    }}

    /* Buttons */
    QPushButton {{
      background-color: {ACCENT_BLUE};
      border: none;
      color: white;
      padding: 10px 16px;
      font-size: 14px;
      border-radius: {RADIUS}px;
    }}
    QPushButton:hover {{
      background-color: #6A96EF;
    }}
    QPushButton:disabled {{
      background-color: #777;
      color: #ddd;
    }}

    QPushButton[class="danger"] {{
      background-color: {DANGER_RED};
    }}
    QPushButton[class="danger"]:hover {{
      background-color: #C9302C;
    }}

    QPushButton[class="secondary"] {{
      background-color: {SECONDARY};
    }}
    QPushButton[class="secondary"]:hover {{
      background-color: #868E96;
    }}

    /* History panel */
    QLabel#historyText {{
      background-color: #202429;
      padding: 8px;
      border-radius: {RADIUS}px;
      color: {TEXT_LIGHT};
    }}

    /* Card look via 'card' dynamic property, text color handled via rich text per card */
    QLabel[class="card"] {{
      background-color: white;
      border: 1px solid #333;
      border-radius: {RADIUS}px;
      padding: 6px;
      font-size: 20px;
      font-weight: bold;
      min-width: 90px;
      min-height: 130px;
      qproperty-alignment: AlignCenter;
      color: black;
    }}
    """

def apply_theme(app: QApplication):
    app.setStyleSheet(app_qss())
