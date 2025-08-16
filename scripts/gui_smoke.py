import os
import sys
os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import QTimer

from scripts.gui_theme import apply_theme
from scripts.poker_gui import PokerGUI

def main():
    app = QApplication(sys.argv)
    apply_theme(app)
    window = PokerGUI()
    window.show()
    os.makedirs("docs", exist_ok=True)

    def snap_and_quit():
        try:
            pm = window.grab()
            out_path = os.path.join("docs", "gui_after.png")
            pm.save(out_path)
            print(f"Saved screenshot to {out_path}")
        except Exception as e:
            print(f"Failed to save screenshot: {e}")
        finally:
            app.quit()
    QTimer.singleShot(800, snap_and_quit)
    app.exec_()

if __name__ == "__main__":
    main()
