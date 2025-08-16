export const API_URL = import.meta.env.VITE_API_URL as string;

export type NewGameConfig = {
  stake: number;
  sb: number;
  bb: number;
  position: number;
  models_dir?: string | null;
};

export async function newGame(cfg: NewGameConfig) {
  const res = await fetch(`${API_URL}/api/new_game`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cfg),
  });
  return res.json();
}

export async function getState() {
  const res = await fetch(`${API_URL}/api/state`);
  return res.json();
}

export async function humanAction(action: string, amount?: number) {
  const res = await fetch(`${API_URL}/api/human_action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, amount }),
  });
  return res.json();
}

export async function newHand() {
  const res = await fetch(`${API_URL}/api/new_hand`, { method: "POST" });
  return res.json();
}
