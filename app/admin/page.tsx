"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8010";

const ADMIN_STORAGE = "fr_admin_master_key_v1";

type UserRow = {
  id: string;
  name: string;
  role: string;
  api_key: string;
  active: boolean;
  created_at: string;
};

export default function AdminPage() {
  const [master, setMaster] = useState("");
  const [saved, setSaved] = useState(false);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("researcher");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const k = localStorage.getItem(ADMIN_STORAGE) || "";
    setMaster(k);
    setSaved(!!k);
  }, []);

  function saveKey() {
    const k = master.trim();
    localStorage.setItem(ADMIN_STORAGE, k);
    setSaved(!!k);
  }

  function clearKey() {
    localStorage.removeItem(ADMIN_STORAGE);
    setMaster("");
    setSaved(false);
  }

  async function loadUsers() {
    setMsg("");
    const k = localStorage.getItem(ADMIN_STORAGE) || "";
    if (!k) return setMsg("Paste master admin key first.");
    const r = await fetch(`${API}/admin/users`, {
      headers: { "x-admin-key": k },
    });
    if (!r.ok) return setMsg(await r.text());
    const data = await r.json();
    setUsers(Array.isArray(data) ? data : []);
  }

  async function createUser() {
    setMsg("");
    const k = localStorage.getItem(ADMIN_STORAGE) || "";
    if (!k) return setMsg("Paste master admin key first.");
    if (!name.trim()) return setMsg("Enter a name.");

    const r = await fetch(`${API}/admin/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-key": k,
      },
      body: JSON.stringify({ name: name.trim(), role }),
    });

    if (!r.ok) return setMsg(await r.text());
    const u = await r.json();
    setMsg(`✅ Created: ${u.name} (${u.role}) — API key copied below.`);
    setName("");
    await loadUsers();
  }

  async function rotateKey(userId: string) {
    setMsg("");
    const k = localStorage.getItem(ADMIN_STORAGE) || "";
    if (!k) return setMsg("Paste master admin key first.");

    const r = await fetch(`${API}/admin/users/${userId}/rotate-key`, {
      method: "POST",
      headers: { "x-admin-key": k },
    });

    if (!r.ok) return setMsg(await r.text());
    await loadUsers();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Console</h1>
          <Link href="/" className="text-sm text-zinc-300 underline">
            Back
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-zinc-300">
            Master key status:{" "}
            {saved ? (
              <span className="text-green-300">✅ set</span>
            ) : (
              <span className="text-red-300">❌ not set</span>
            )}
          </div>

          <input
            value={master}
            onChange={(e) => setMaster(e.target.value)}
            placeholder="Paste master admin key (from backend .env)"
            className="mt-3 w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 outline-none"
          />

          <div className="mt-3 flex gap-2">
            <button
              onClick={saveKey}
              className="rounded-xl bg-zinc-100 px-4 py-2 text-zinc-950 font-semibold hover:bg-white"
            >
              Save
            </button>
            <button
              onClick={clearKey}
              className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15"
            >
              Remove
            </button>
            <button
              onClick={loadUsers}
              className="ml-auto rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15"
            >
              Load Users
            </button>
          </div>

          {msg ? <p className="mt-3 text-sm text-zinc-300">{msg}</p> : null}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Create Researcher Key</h2>
            <label className="mt-3 block text-sm text-zinc-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 outline-none"
              placeholder="e.g., John Doe"
            />
            <label className="mt-3 block text-sm text-zinc-300">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 outline-none"
            >
              <option value="viewer">viewer</option>
              <option value="researcher">researcher</option>
              <option value="admin">admin</option>
            </select>

            <button
              onClick={createUser}
              className="mt-4 w-full rounded-xl bg-zinc-100 px-4 py-3 text-zinc-950 font-semibold hover:bg-white"
            >
              Create
            </button>
            <p className="mt-3 text-xs text-zinc-400">
              Share the generated API key privately with that person.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Users</h2>
            <div className="mt-3 space-y-3">
              {users.map((u) => (
                <div key={u.id} className="rounded-xl border border-white/10 bg-zinc-900/50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      {u.name} <span className="text-xs text-zinc-400">({u.role})</span>
                    </div>
                    <button
                      onClick={() => rotateKey(u.id)}
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs hover:bg-white/15"
                    >
                      Rotate key
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-zinc-400 break-all">
                    API key: <span className="text-zinc-200">{u.api_key}</span>
                  </div>
                </div>
              ))}
              {!users.length ? (
                <p className="text-sm text-zinc-400">No users loaded yet.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
