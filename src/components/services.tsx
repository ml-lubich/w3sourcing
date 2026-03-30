import { ScrollSection } from "./scroll-animation";

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "VC-Backed Technology",
    description:
      "We partner with high-growth, venture-backed technology companies to build transformative teams. From mid-level engineers to C-suite leadership, we source the talent that scales startups into market leaders.",
    tags: ["Engineering", "Product", "AI/ML", "C-Suite", "GTM"],
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
      </svg>
    ),
    title: "Legal Recruitment",
    description:
      "Placing exceptional lawyers at the world's leading US and UK law firms. We understand the nuances of private practice, from associate hires through to partner-level lateral moves across all major practice areas.",
    tags: ["Associates", "Counsel", "Partners", "In-House", "Practice Leaders"],
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: "Banking & Finance",
    description:
      "Connecting top-tier talent with global financial institutions. Investment banking, corporate finance, risk & compliance, and advisory — we deliver professionals who drive financial performance and regulatory excellence.",
    tags: ["IB", "M&A", "Risk", "Compliance", "Private Banking"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-white">
      <ScrollSection className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="text-gold font-semibold text-sm tracking-widest uppercase">
            Our Expertise
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
            Three Pillars of Excellence
          </h2>
          <p className="mt-4 text-lg text-navy/50 max-w-2xl mx-auto">
            Deep specialisation across three high-impact sectors, delivering
            exceptional talent to the world&apos;s most ambitious organisations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`animate-on-scroll delay-${i + 1} group relative rounded-2xl bg-gradient-to-br from-navy to-indigo p-8 lg:p-10 overflow-hidden transition-transform duration-500 hover:-translate-y-2`}
            >
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gold/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-white/55 leading-relaxed text-sm mb-6">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-white/8 text-white/60 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollSection>
    </section>
  );
}
