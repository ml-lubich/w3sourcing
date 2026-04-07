import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedLegalHeading } from "@/components/animated-legal-heading";
import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms and conditions governing your use of the W3 Sourcing website and related online materials.",
  alternates: { canonical: "/terms" },
  openGraph: {
    url: "/terms",
    title: "Terms of Use | W3 Sourcing",
    type: "article",
  },
  twitter: {
    title: "Terms of Use | W3 Sourcing",
  },
  robots: { index: true, follow: true },
};

export default function TermsOfUsePage() {
  return (
    <LegalPageShell>
      <article className="mx-auto max-w-3xl px-6 text-primary">
        <p className="text-sm font-medium text-accent">Legal</p>
        <AnimatedLegalHeading
          level={1}
          text="Terms of Use"
          className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl"
        />
        <p className="mt-4 text-sm text-text-secondary">Last updated: 6 April 2026</p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-text-secondary">
          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="1. Agreement" className="text-lg font-bold text-primary" />
            <p>
              By accessing or using the website operated by W3 Sourcing (&quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;) at or linking to our domains (the &quot;Site&quot;), you agree to these Terms of Use.
              If you do not agree, do not use the Site.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="2. The Site" className="text-lg font-bold text-primary" />
            <p>
              The Site provides information about W3 Sourcing and our recruitment and executive search services. Unless
              we expressly agree otherwise in writing, use of the Site does not create a client, candidate, or employment
              relationship with us.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading
              level={2}
              text="3. Not professional advice"
              className="text-lg font-bold text-primary"
            />
            <p>
              Content on the Site is for general information only. It is not legal, tax, financial, or HR advice. You are
              responsible for your own decisions and for seeking independent professional advice where appropriate.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading
              level={2}
              text="4. Intellectual property"
              className="text-lg font-bold text-primary"
            />
            <p>
              The Site and its content (including text, graphics, logos, layout, and software) are owned by us or our
              licensors and are protected by intellectual property laws. You may view and print a reasonable number of
              copies for personal, non-commercial use. You must not copy, scrape, redistribute, or exploit the Site or its
              content for commercial purposes without our prior written consent.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="5. Acceptable use" className="text-lg font-bold text-primary" />
            <p>You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Use the Site in any way that violates applicable law or infringes others&apos; rights;</li>
              <li>Attempt to gain unauthorised access to our systems, other users, or third-party services;</li>
              <li>Introduce malware, overload, or disrupt the Site or its infrastructure;</li>
              <li>Use automated means to access the Site in a manner that impairs our operations or without permission.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading
              level={2}
              text="6. Third-party links"
              className="text-lg font-bold text-primary"
            />
            <p>
              The Site may contain links to third-party websites. We are not responsible for their content or practices.
              Your use of third-party sites is at your own risk and subject to their terms.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="7. Disclaimer" className="text-lg font-bold text-primary" />
            <p>
              The Site and its content are provided &quot;as is&quot; and &quot;as available&quot;. To the fullest extent
              permitted by law, we disclaim all warranties, whether express or implied, including implied warranties of
              merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Site
              will be uninterrupted, error-free, or free of harmful components.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading
              level={2}
              text="8. Limitation of liability"
              className="text-lg font-bold text-primary"
            />
            <p>
              To the fullest extent permitted by applicable law, we and our affiliates, directors, and personnel will
              not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of
              profits, data, or goodwill, arising from or related to your use of the Site. Our aggregate liability for
              claims arising from the Site (other than liability that cannot be limited by law) shall not exceed one
              hundred pounds sterling (GBP 100) or the amount you paid us for services directly related to the claim in
              the twelve months before the event giving rise to liability, whichever is greater.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="9. Indemnity" className="text-lg font-bold text-primary" />
            <p>
              You agree to indemnify and hold harmless W3 Sourcing and its personnel from claims, damages, losses, and
              expenses (including reasonable legal fees) arising from your misuse of the Site or breach of these Terms,
              to the extent permitted by law.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading
              level={2}
              text="10. Governing law and jurisdiction"
              className="text-lg font-bold text-primary"
            />
            <p>
              These Terms are governed by the laws of England and Wales, without regard to conflict-of-law principles.
              The courts of England and Wales shall have exclusive jurisdiction to resolve disputes arising from or
              relating to these Terms or the Site, subject to any mandatory rights you may have under the laws of your
              country of residence.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="11. Changes" className="text-lg font-bold text-primary" />
            <p>
              We may modify these Terms at any time. The &quot;Last updated&quot; date will reflect changes. Continued
              use of the Site after changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="12. Contact" className="text-lg font-bold text-primary" />
            <p>
              Questions about these Terms:{" "}
              <a href="mailto:info@w3sourcing.com" className="font-medium text-accent hover:underline">
                info@w3sourcing.com
              </a>
              .
            </p>
          </section>

          <p className="pt-4 border-t border-gray-border/35">
            See also:{" "}
            <Link href="/privacy" className="font-medium text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </article>
    </LegalPageShell>
  );
}
