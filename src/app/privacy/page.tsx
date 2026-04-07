import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedLegalHeading } from "@/components/animated-legal-heading";
import { LegalPageShell } from "@/components/legal-page-shell";

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

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell>
      <article className="mx-auto max-w-3xl px-6 text-primary">
        <p className="text-sm font-medium text-accent">Legal</p>
        <AnimatedLegalHeading
          level={1}
          text="Privacy Policy"
          className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl"
        />
        <p className="mt-4 text-sm text-text-secondary">Last updated: 6 April 2026</p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-text-secondary">
          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="1. Introduction" className="text-lg font-bold text-primary" />
            <p>
              This Privacy Policy describes how W3 Sourcing (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) handles
              information when you visit our website or otherwise interact with us in connection with our recruitment
              and executive search services. We respect your privacy and are committed to protecting personal data in
              line with applicable laws.
            </p>
            <p>
              This policy is provided for general information. It does not constitute legal advice. If you need
              certainty for your situation, you should obtain professional advice.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="2. Who we are" className="text-lg font-bold text-primary" />
            <p>
              W3 Sourcing operates globally with a presence in the United Kingdom and Singapore. For privacy-related
              enquiries, contact us at{" "}
              <a href="mailto:info@w3sourcing.com" className="font-medium text-accent hover:underline">
                info@w3sourcing.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading
              level={2}
              text="3. Information we may collect"
              className="text-lg font-bold text-primary"
            />
            <p>Depending on how you interact with us, we may process categories of information such as:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-primary">Contact and enquiry data:</span> name, email address, phone
                number, employer, role, and the content of messages you send when you contact us.
              </li>
              <li>
                <span className="font-medium text-primary">Recruitment-related data:</span> CV or résumé, employment
                history, skills, compensation expectations, references, and other information you voluntarily provide for
                search, assessment, or placement activities.
              </li>
              <li>
                <span className="font-medium text-primary">Client and business contact data:</span> professional contact
                details and correspondence relating to mandates, contracts, and service delivery.
              </li>
              <li>
                <span className="font-medium text-primary">Technical and usage data:</span> IP address, browser type,
                device identifiers, general location derived from IP, pages viewed, and timestamps, collected through
                hosting, analytics, or similar tools we use to operate and improve the site.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading
              level={2}
              text="4. How we use information"
              className="text-lg font-bold text-primary"
            />
            <p>We use personal information for purposes such as:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Responding to enquiries and providing recruitment and executive search services;</li>
              <li>Evaluating suitability for roles, introducing candidates to clients, and facilitating interviews;</li>
              <li>Managing our relationship with clients and candidates, including contracts, billing, and compliance;</li>
              <li>Operating, securing, and improving our website and internal processes;</li>
              <li>Complying with legal obligations and defending our legal rights where necessary.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading
              level={2}
              text="5. Legal bases (where applicable)"
              className="text-lg font-bold text-primary"
            />
            <p>
              Where the UK GDPR or EU GDPR applies, we rely on appropriate bases such as performance of a contract,
              legitimate interests (for example, operating our business and responding to enquiries, balanced against
              your rights), consent where required, and legal obligation.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading
              level={2}
              text="6. Cookies and similar technologies"
              className="text-lg font-bold text-primary"
            />
            <p>
              Our website may use cookies or similar technologies as implemented by our hosting or analytics providers.
              We also store a theme preference (light or dark mode) in your browser&apos;s local storage to improve your
              experience. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading
              level={2}
              text="7. Sharing and international transfers"
              className="text-lg font-bold text-primary"
            />
            <p>
              We may share information with trusted service providers (such as hosting, IT, and communications tools)
              who process data on our instructions. Because we operate internationally, your information may be
              processed in countries other than your own. Where required, we use appropriate safeguards for cross-border
              transfers.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="8. Retention" className="text-lg font-bold text-primary" />
            <p>
              We retain personal information only as long as necessary for the purposes described in this policy,
              including to meet legal, regulatory, and professional obligations relating to recruitment and record
              keeping.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="9. Your rights" className="text-lg font-bold text-primary" />
            <p>
              Depending on your location, you may have rights to access, correct, delete, or restrict processing of your
              personal data, to object to certain processing, to data portability, and to withdraw consent where
              processing is consent-based. You may also have the right to lodge a complaint with a supervisory
              authority. To exercise these rights, contact us using the email above.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="10. Security" className="text-lg font-bold text-primary" />
            <p>
              We implement appropriate technical and organisational measures designed to protect personal information.
              No method of transmission over the internet is completely secure; we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="11. Children" className="text-lg font-bold text-primary" />
            <p>
              Our services are directed at professionals and organisations. We do not knowingly collect personal
              information from children.
            </p>
          </section>

          <section className="space-y-3">
            <AnimatedLegalHeading level={2} text="12. Changes" className="text-lg font-bold text-primary" />
            <p>
              We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top will
              change when we do. Material changes may be communicated through the website or by other appropriate
              means.
            </p>
          </section>

          <p className="pt-4 border-t border-gray-border/35">
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
