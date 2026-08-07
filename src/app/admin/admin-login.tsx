"use client";

import { useActionState } from "react";

import { login, type ActionState } from "./actions";

export function AdminLogin() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(login, {});

  return (
    <form action={formAction} className="glass-panel mt-8 max-w-sm rounded-2xl p-6">
      <label htmlFor="password" className="text-sm font-semibold text-primary">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        className="mt-2 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm text-primary outline-none focus:border-accent dark:border-white/15 dark:bg-white/5"
      />
      {state.error ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
