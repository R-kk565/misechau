import { SectionHeading } from "@/components/ui/section-heading";
import { CONTACT, EMPTY, isEmpty } from "@/lib/site-content";

export function ContactSection() {
  const disabled = isEmpty(CONTACT.email);

  return (
    <section id="contact" className="content-shell scroll-mt-[70px] py-24">
      <SectionHeading keyName="contact" />

      <div className="flex w-full items-center justify-between gap-6 rounded-[18px] border border-line bg-card px-6 py-7 shadow-[var(--shadow)]">
        <p className="text-[10px] leading-relaxed tracking-[0.16em] text-muted">{CONTACT.note}</p>
        {disabled ? (
          /* TODO: メールアドレスが決まるまでは非活性。 */
          <span aria-disabled="true" className="text-sm tracking-[0.1em] text-muted/60">
            {EMPTY}
          </span>
        ) : (
          <a
            href={`mailto:${CONTACT.email}`}
            className="truncate text-sm tracking-[0.1em] text-fg transition-colors duration-300 hover:text-accent"
          >
            {CONTACT.email}
          </a>
        )}
      </div>
    </section>
  );
}
