import { Lettering } from "@/components/lettering";
import { cn } from "@/lib/utils";
import type { LetteringKey } from "@/lib/site-content";

/**
 * 見出しは筆文字だけにする。読みを補う英字の小さなラベルは添えない
 * （余白で見せる設計が濁るため）。
 */
export function SectionHeading({
  keyName,
  className,
  height = 34,
}: {
  keyName: LetteringKey;
  className?: string;
  height?: number;
}) {
  return (
    <h2 className={cn("mb-10", className)}>
      <Lettering keyName={keyName} height={height} />
    </h2>
  );
}
