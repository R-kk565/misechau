import { EMPTY, FOOTER, isEmpty } from "@/lib/site-content";

export function SiteFooter() {
  const name = isEmpty(FOOTER.copyrightName) ? EMPTY : FOOTER.copyrightName;

  return (
    <footer className="content-shell pb-14 pt-6">
      <div className="flex items-center gap-5">
        <span className="h-px flex-1 bg-line" />
        <small className="shrink-0 text-[9px] tracking-[0.2em] text-muted">
          © {FOOTER.year} {name}
        </small>
        <span className="h-px flex-1 bg-line" />
      </div>
    </footer>
  );
}
