import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedLegalHeading } from "@/components/animated-legal-heading";
import { LegalPageShell } from "@/components/legal-page-shell";
import { privacyPolicy, type ContentBlock } from "@/content/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How W3 Sourcing collects, uses, and protects personal information when you use our website and services.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    url: "/privacy",
    title: "Privacy Policy | W3 Sourcing",
    type: "article",
  },
  twitter: {
    title: "Privacy Policy | W3 Sourcing",
  },
  robots: { index: true, follow: true },
};

function renderBlock(block: ContentBlock, key: number): React.ReactNode {
  switch (block.type) {
    case "p":
      return <p key={key}>{block.text}</p>;
    case "ul":
      return (
        <ul key={key} className="list-disc space-y-1 pl-5">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} className="list-decimal space-y-1 pl-5">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case "dl":
      return (
        <dl key={key} className="space-y-2">
          {block.items.map((item, i) => (
            <div key={i} className="flex flex-wrap gap-x-1">
              <dt className="font-medium text-primary">{item.term}:</dt>
              <dd>{item.definition}</dd>
            </div>
          ))}
        </dl>
      );
    case "sub":
      return (
        <div key={key} className="space-y-2">
          <h3 className="text-sm font-bold text-primary">{block.heading}</h3>
          {block.blocks.map((b, i) => renderBlock(b, i))}
        </div>
      );
  }
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell>
      <article className="mx-auto max-w-3xl px-6 text-primary">
        <p className="text-sm font-medium text-accent">Legal</p>
        <AnimatedLegalHeading
          level={1}
          text={privacyPolicy.title}
          className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl"
        />
        <p className="mt-4 text-sm text-text-secondary">Last updated: {privacyPolicy.lastUpdated}</p>

        <div className="mt-8 space-y-4 text-sm leading-relaxed text-text-secondary">
          {privacyPolicy.preamble.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-10 space-y-2">
          <AnimatedLegalHeading
            level={2}
            text={privacyPolicy.dpaTitle}
            className="text-xl font-extrabold tracking-tight text-primary sm:text-2xl"
          />
          <p className="text-sm leading-relaxed text-text-secondary">{privacyPolicy.dpaIntro}</p>
        </div>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-text-secondary">
          {privacyPolicy.sections.map((section) => (
            <section key={section.id} className="space-y-3">
              <AnimatedLegalHeading
                level={2}
                text={section.heading}
                className="text-lg font-bold text-primary"
              />
              {section.blocks.map((block, i) => renderBlock(block, i))}
            </section>
          ))}

          <div className="space-y-4 border-t border-gray-border/35 pt-6 text-text-secondary">
            <p>
              Please address all questions to{" "}
              <a href={`mailto:${privacyPolicy.contactEmail}`} className="font-medium text-accent hover:underline">
                {privacyPolicy.contactEmail}
              </a>
            </p>
            <div className="flex flex-wrap gap-8">
              {privacyPolicy.addresses.map((addr, i) => (
                <address key={i} className="not-italic whitespace-pre-line text-xs leading-relaxed">
                  {addr}
                </address>
              ))}
            </div>
          </div>

          <p className="border-t border-gray-border/35 pt-4">
            See also:{" "}
            <Link href="/terms" className="font-medium text-accent hover:underline">
              Terms of Use
            </Link>
            .
          </p>
        </div>
      </article>
    </LegalPageShell>
  );
}
