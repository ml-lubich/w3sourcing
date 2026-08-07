"use client";

import { useActionState } from "react";

import { login, type ActionState } from "./actions";

export function AdminLogin() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(login, {});

  return (
    <form action={formAction} className="glass-panel w-full max-w-sm rounded-2xl p-7 text-left">
      <h1 className="relative mb-1 text-2xl font-extrabold tracking-tight text-primary">Jobs admin</h1>
      <p className="relative mb-5 text-sm text-text-secondary">
        Sign in to publish, edit, and close roles.
      </p>
      <label htmlFor="email" className="relative block text-sm font-semibold text-primary">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        autoFocus
        required
        className="relative mb-4 mt-2 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm text-primary outline-none focus:border-accent dark:border-white/15 dark:bg-white/5"
      />
      <label htmlFor="password" className="relative block text-sm font-semibold text-primary">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="relative mt-2 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm text-primary outline-none focus:border-accent dark:border-white/15 dark:bg-white/5"
      />
      {state.error ? <p className="relative mt-2 text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="relative mt-4 w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
