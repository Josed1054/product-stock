"use client";

import { useState as useClientState, useState } from "react";

import { useAuthStore } from "./authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [token, setToken] = useState("");
  const router = useRouter();
  const setAuthToken = useAuthStore((s) => s.setToken);
  const [demoToken, setDemoToken] = useClientState<string | null>(null);
  const [copyMsg, setCopyMsg] = useClientState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = token.trim();
    if (!raw) return;
    // Accept tokens pasted with or without 'Bearer ' prefix
    const cleaned = raw.replace(/^Bearer\s+/i, "");
    setAuthToken(cleaned);
    router.replace("/products");
  };

  return (
    <div className="mx-auto my-16 max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="mb-4 text-2xl font-semibold text-zinc-100">
        Inicio de sesión
      </h1>
      <p className="mb-4 text-sm text-zinc-400">
        Pega un JWT válido para autenticar tus requests.
      </p>
      <div className="mb-4 rounded border border-zinc-800 bg-zinc-900 p-3">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="demo-token" className="font-medium text-zinc-200">
            Token de demostración
          </label>
          <div className="flex gap-2">
            <button
              className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800"
              onClick={async () => {
                try {
                  const res = await fetch("/api/auth/token");
                  const json = await res.json();
                  const t = json?.token as string | undefined;
                  if (t) {
                    setDemoToken(t);
                    setCopyMsg(null);
                  }
                } catch {}
              }}
            >
              Generar
            </button>
            <button
              className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
              onClick={async () => {
                if (!demoToken) return;
                try {
                  await navigator.clipboard.writeText(demoToken);
                  setCopyMsg("Copiado");
                } catch {
                  setCopyMsg("No se pudo copiar");
                }
              }}
              disabled={!demoToken}
            >
              Copiar
            </button>
            <button
              className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
              onClick={() => {
                if (demoToken) setToken(demoToken);
              }}
              disabled={!demoToken}
            >
              Usar
            </button>
          </div>
        </div>
        <textarea
          id="demo-token"
          className="h-20 w-full resize-none rounded border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-100"
          placeholder="(haz clic en Generar para obtener un token válido)"
          autoComplete="off"
          value={demoToken ?? ""}
          readOnly
        />
        {copyMsg && <div className="mt-1 text-xs text-zinc-400">{copyMsg}</div>}
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label htmlFor="jwt-token" className="text-sm text-zinc-300">
          Token JWT
        </label>
        <textarea
          id="jwt-token"
          className="h-32 w-full resize-none rounded border border-zinc-700 bg-zinc-900 p-2 text-sm text-zinc-100 placeholder-zinc-400"
          placeholder="Pega el JWT (sin 'Bearer') o usa el de demo"
          autoComplete="off"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          type="submit"
          className="rounded border border-zinc-700 bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-60"
          disabled={!token.trim()}
        >
          Guardar token
        </button>
      </form>
    </div>
  );
}
