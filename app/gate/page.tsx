import type { Metadata } from "next";
import { GateForm } from "@/components/gate-form";
import { isGateEnabled } from "@/lib/gate";

export const metadata: Metadata = {
  title: "PRIVATE",
  robots: { index: false, follow: false },
};

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const params = await searchParams;
  const from = typeof params.from === "string" && params.from.startsWith("/") ? params.from : "/";

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-5">
      <div className="w-full max-w-[320px] text-center">
        <p className="mb-8 text-[10px] tracking-[0.28em] text-muted">PRIVATE</p>
        {isGateEnabled() ? (
          <GateForm from={from} hasError={params.error === "1"} />
        ) : (
          <p className="text-xs leading-relaxed text-muted">
            ゲートは無効です（SITE_ACCESS_PASSWORD が未設定）。
          </p>
        )}
      </div>
    </main>
  );
}
