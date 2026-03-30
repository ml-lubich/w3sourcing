import { ScrollSection } from "./scroll-animation";

const reasons = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: "Deep Domain Expertise",
    description:
      "Our consultants are specialists, not generalists. Years of focused experience in Tech, Legal, and Finance means we understand the roles, the markets, and the talent.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Global Reach, Local Insight",
    description:
      "With presence across the US, UK, EU, UAE, and Asia, we combine a global network with deep local market intelligence to find talent wherever it is.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "Human-Led & Relationship-Driven",
    description:
      "We believe great recruitment is built on relationships. Every search is led by experienced consultants who take the time to understand your culture and goals.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Ethics & Confidentiality",
    description:
      "Discretion is non-negotiable. We operate with the highest standards of professional ethics, ensuring complete confidentiality for candidates and clients alike.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="py-24 sm:py-32 bg-gradient-to-b from-white to-slate-50">
      <ScrollSection className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="text-gold font-semibold text-sm tracking-widest uppercase">
            Why Choose Us
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
            Why W3 Sourcing
          </h2>
          <p className="mt-4 text-lg text-navy/50 max-w-2xl mx-auto">
            What sets us apart in a crowded market — the principles
            that drive every engagement.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className={`animate-on-scroll delay-${i + 1} glass-card-light rounded-2xl p-8 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500`}
            >
              <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-gold mb-5 group-hover:bg-gold/10 transition-colors duration-300">
                {reason.icon}
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">
                {reason.title}
              </h3>
              <p className="text-navy/50 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </ScrollSection>
    </section>
  );
}
