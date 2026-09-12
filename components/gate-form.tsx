"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function GateForm({ from, hasError }: { from: string; hasError: boolean }) {
  return (
    <form action="/api/gate" method="post" className="flex flex-col gap-3">
      <input type="hidden" name="from" value={from} />
      <Input
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="パスワード"
        aria-label="パスワード"
        aria-invalid={hasError || undefined}
        required
      />
      <Button type="submit">ENTER</Button>
      {hasError && (
        <p role="alert" className="text-[10px] tracking-[0.12em] text-accent">
          パスワードが違います
        </p>
      )}
    </form>
  );
}
