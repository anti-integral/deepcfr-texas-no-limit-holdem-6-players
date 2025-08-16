from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

app = FastAPI(title="DeepCFR Poker Web API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSION: Dict[str, Any] = {"ready": True, "hands_played": 0}

class NewGameConfig(BaseModel):
    stake: float = 200.0
    sb: float = 1.0
    bb: float = 2.0
    position: int = 0
    models_dir: Optional[str] = None

class HumanAction(BaseModel):
    action: str  # "FOLD" | "CHECK" | "CALL" | "RAISE"
    amount: Optional[float] = None

@app.get("/api/health")
def health():
    return {"ok": True}

@app.post("/api/new_game")
def new_game(cfg: NewGameConfig):
    SESSION["cfg"] = cfg.model_dump()
    SESSION["hands_played"] = 0
    SESSION["state"] = {
        "stage": "preflop",
        "pot": 0.0,
        "players": [{"id": i, "chips": cfg.stake, "bet": 0.0, "active": True} for i in range(6)],
        "community_cards": [],
        "human_position": cfg.position,
        "legal_actions": ["FOLD", "CHECK", "RAISE"],
        "message": "Game initialized",
    }
    return {"ok": True, "state": SESSION["state"]}

@app.get("/api/state")
def state():
    return {"ok": True, "state": SESSION.get("state", {})}

@app.post("/api/human_action")
def human_action(a: HumanAction):
    st = SESSION.get("state", {})
    st["message"] = f"Received human action: {a.action} {a.amount if a.amount else ''}".strip()
    st["pot"] = float(st.get("pot", 0.0)) + (a.amount or 0.0)
    SESSION["state"] = st
    return {"ok": True, "state": st}

@app.post("/api/new_hand")
def new_hand():
    SESSION["hands_played"] += 1
    st = SESSION.get("state", {})
    st["stage"] = "preflop"
    st["community_cards"] = []
    st["message"] = f"New hand #{SESSION['hands_played']} started"
    for p in st.get("players", []):
        p["bet"] = 0.0
        p["active"] = True
    SESSION["state"] = st
    return {"ok": True, "state": st}
