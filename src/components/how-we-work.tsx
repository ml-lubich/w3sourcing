import { ScrollSection } from "./scroll-animation";

const steps = [
  {
    number: "01",
    title: "Discovery & Alignment",
    description:
      "We begin by deeply understanding your organisation, culture, team dynamics, and the specific qualities that define success in the role. This goes beyond a job spec.",
  },
  {
    number: "02",
    title: "Targeted Search & Assessment",
    description:
      "Leveraging our sector-specific networks and rigorous assessment methodology, we identify and engage exceptional candidates who align with your requirements.",
  },
  {
    number: "03",
    title: "Transparent Process & Collaboration",
    description:
      "You're involved at every stage. We provide clear timelines, honest feedback, and regular updates — no black boxes, no surprises.",
  },
  {
    number: "04",
    title: "Long-Term Partnership",
    description:
      "Our relationship doesn't end at placement. We stay connected to ensure successful integration and continue to support your talent strategy as you grow.",
  },
];

export function HowWeWork() {
  return (
    <section id="process" className="py-24 sm:py-32 bg-gradient-to-br from-navy via-navy-light to-indigo relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-light/20 blur-3xl" />

      <ScrollSection className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="text-gold font-semibold text-sm tracking-widest uppercase">
            Our Process
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            How We Work
          </h2>
          <p className="mt-4 text-lg text-white/45 max-w-2xl mx-auto">
            A proven, transparent process built on partnership — not transactions.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden lg:block absolute top-12 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px bg-gradient-to-r from-gold/50 via-white/20 to-gold/50" />

          <div className="grid lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`animate-on-scroll delay-${i + 1} relative`}
              >
                {/* Step number circle */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mb-6 mx-auto lg:mx-0">
                  <span className="text-navy font-bold text-sm">
                    {step.number}
                  </span>
                </div>

                {/* Mobile connecting line */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden absolute left-1/2 top-14 w-px h-8 bg-gold/30 -translate-x-1/2" />
                )}

                <div className="text-center lg:text-left">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>
    </section>
  );
}
