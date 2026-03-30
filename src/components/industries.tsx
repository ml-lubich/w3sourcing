import { ScrollSection } from "./scroll-animation";

const industries = [
  {
    category: "Technology",
    color: "from-blue-500/10 to-indigo-500/10",
    borderColor: "border-blue-500/20",
    textColor: "text-blue-600",
    roles: [
      "Product Management",
      "Software Engineering",
      "Data & Analytics",
      "AI / Machine Learning",
      "DevOps & Infrastructure",
      "Cyber Security",
      "Go-to-Market & Sales",
      "CTO & VP Engineering",
    ],
  },
  {
    category: "Legal",
    color: "from-amber-500/10 to-gold/10",
    borderColor: "border-gold/20",
    textColor: "text-gold-dark",
    roles: [
      "Associates",
      "Senior Associates",
      "Counsel",
      "Partners",
      "Practice Group Leaders",
      "General Counsel",
      "Legal Operations",
      "Compliance Officers",
    ],
  },
  {
    category: "Finance",
    color: "from-emerald-500/10 to-teal-500/10",
    borderColor: "border-emerald-500/20",
    textColor: "text-emerald-600",
    roles: [
      "Private Banking",
      "Investment Banking",
      "Risk & Compliance",
      "Corporate Advisory",
      "M&A",
      "Venture Capital",
      "Private Equity",
      "Quantitative Analysis",
    ],
  },
];

export function Industries() {
  return (
    <section id="industries" className="py-24 sm:py-32 bg-slate-50">
      <ScrollSection className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="text-gold font-semibold text-sm tracking-widest uppercase">
            Sectors & Functions
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
            Industries & Functions
          </h2>
          <p className="mt-4 text-lg text-navy/50 max-w-2xl mx-auto">
            Specialist knowledge across the functions that matter most to your business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {industries.map((industry, i) => (
            <div
              key={industry.category}
              className={`animate-on-scroll delay-${i + 1} rounded-2xl bg-white p-8 shadow-sm hover:shadow-lg transition-shadow duration-500`}
            >
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${industry.color} ${industry.borderColor} border mb-6`}
              >
                <span className={`text-sm font-semibold ${industry.textColor}`}>
                  {industry.category}
                </span>
              </div>
              <div className="space-y-3">
                {industry.roles.map((role) => (
                  <div
                    key={role}
                    className="flex items-center gap-3 text-sm text-navy/70"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gold/60 shrink-0" />
                    {role}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollSection>
    </section>
  );
}
