"use client";

import { useState, useTransition } from "react";
import { removeKeyword, setKeywordActive, updateKeyword } from "@/app/dashboard/actions";

type Keyword = {
  id: string;
  term: string;
  active: boolean;
};

export default function KeywordRow({ keyword }: { keyword: Keyword }) {
  const [isEditing, setIsEditing] = useState(false);
  const [term, setTerm] = useState(keyword.term);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateKeyword(keyword.id, term);
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      setIsEditing(false);
    });
  }

  function handleCancel() {
    setTerm(keyword.term);
    setError(null);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            autoFocus
            className="flex-1 border border-line bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="text-sm text-accent hover:text-accent-dark disabled:opacity-60"
          >
            {isPending ? "Guardando…" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-ink/40 hover:text-accent"
          >
            Cancelar
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-accent">{error}</p>}
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between py-3">
      <span className={`text-sm ${keyword.active ? "text-ink" : "text-ink/40"}`}>
        {keyword.term}
        {!keyword.active && " (pausada)"}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-sm text-ink/40 hover:text-accent"
        >
          Editar
        </button>
        <form action={setKeywordActive.bind(null, keyword.id, !keyword.active)}>
          <button type="submit" className="text-sm text-ink/40 hover:text-accent">
            {keyword.active ? "Pausar" : "Reactivar"}
          </button>
        </form>
        <form action={removeKeyword.bind(null, keyword.id)}>
          <button type="submit" className="text-sm text-ink/40 hover:text-accent">
            Quitar
          </button>
        </form>
      </div>
    </li>
  );
}
