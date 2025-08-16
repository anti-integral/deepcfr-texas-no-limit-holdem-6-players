import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as api from "./lib/api";

type Player = { id: number; chips: number; bet: number; active: boolean };

export default function App() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<any>(null);
  const [stake, setStake] = useState(200);
  const [sb, setSb] = useState(1);
  const [bb, setBb] = useState(2);
  const [position, setPosition] = useState(0);
  const [raiseAmt, setRaiseAmt] = useState(4);

  const legal = useMemo<string[]>(() => state?.state?.legal_actions ?? [], [state]);

  async function doInit() {
    setLoading(true);
    try {
      const res = await api.newGame({ stake, sb, bb, position, models_dir: null });
      setState(res);
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    const res = await api.getState();
    setState(res);
  }

  async function doAction(a: string, amount?: number) {
    setLoading(true);
    try {
      const res = await api.humanAction(a, amount);
      setState(res);
    } finally {
      setLoading(false);
    }
  }

  async function nextHand() {
    setLoading(true);
    try {
      const res = await api.newHand();
      setState(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  const players: Player[] = state?.state?.players ?? [];
  const pot = state?.state?.pot ?? 0;
  const stage = state?.state?.stage ?? "-";
  const msg = state?.state?.message ?? "Welcome";

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">DeepCFR Poker Web</h1>
          <span className="text-xs text-slate-400">API: {api.API_URL}</span>
        </header>

        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <Label htmlFor="stake">Stake</Label>
              <Input id="stake" type="number" value={stake} onChange={(e) => setStake(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="sb">SB</Label>
              <Input id="sb" type="number" value={sb} onChange={(e) => setSb(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="bb">BB</Label>
              <Input id="bb" type="number" value={bb} onChange={(e) => setBb(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="pos">Position</Label>
              <Input id="pos" type="number" min={0} max={5} value={position} onChange={(e) => setPosition(Number(e.target.value))} />
            </div>
            <div className="flex items-end">
              <Button onClick={doInit} disabled={loading} className="w-full">Initialize Game</Button>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-green-900/60 border-green-800 p-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold">Table</div>
              <div className="text-sm">Stage: <span className="font-mono">{stage}</span></div>
            </div>
            <div className="mt-4">
              <div className="text-lg">Pot: <span className="font-bold">${pot.toFixed(2)}</span></div>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {players.map((p) => (
                <Card
                  key={p.id}
                  className={`p-3 ${p.active ? "border-blue-400" : "border-slate-700 opacity-60"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Player {p.id}</div>
                    <div className="text-xs">Bet: ${p.bet.toFixed(2)}</div>
                  </div>
                  <div className="mt-1 text-sm">Chips: ${p.chips.toFixed(2)}</div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-4 space-y-3">
            <div className="text-lg font-semibold">Actions</div>
            <div className="flex gap-2">
              <Button variant="destructive" disabled={!legal.includes("FOLD") || loading} onClick={() => doAction("FOLD")}>Fold</Button>
              <Button disabled={!legal.some(a => a === "CHECK" || a === "CALL") || loading} onClick={() => doAction("CHECK")}>Check/Call</Button>
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="raise">Raise Amount</Label>
                <Input id="raise" type="number" value={raiseAmt} onChange={(e) => setRaiseAmt(Number(e.target.value))} />
              </div>
              <Button disabled={!legal.includes("RAISE") || loading} onClick={() => doAction("RAISE", raiseAmt)}>Raise</Button>
            </div>
            <div className="pt-2">
              <Button variant="secondary" disabled={loading} onClick={nextHand}>New Hand</Button>
            </div>
          </Card>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="font-semibold">Log</div>
          <div className="mt-2 text-sm text-slate-300 whitespace-pre-wrap">{msg}</div>
        </Card>
      </div>
    </div>
  );
}
