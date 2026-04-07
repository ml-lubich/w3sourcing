export type FaqItem = Readonly<{
  q: string;
  a: string;
}>;

export const faqItems: readonly FaqItem[] = [
  {
    q: "What sectors do you specialise in?",
    a: "We focus exclusively on three high-impact sectors: Technology (VC-backed and scale-ups), Legal (Magic Circle, US elite, and in-house), and Banking & Finance (investment banking, private equity, risk and compliance). That depth lets us judge calibre and fit in ways broad tools cannot—so you see candidates other generalist firms simply can't reach.",
  },
  {
    q: "How quickly can you fill a role?",
    a: "Our average time-to-shortlist is 14 days. For executive searches, we typically present a qualified shortlist within 2-3 weeks. Urgent hires can be fast-tracked, with candidates presented within 5-7 business days depending on the role complexity.",
  },
  {
    q: "What is your fee structure?",
    a: "We operate on a retained and contingency basis depending on the seniority and complexity of the search. Executive and leadership roles are typically retained, while mid-level positions can be handled on a contingency basis. We're happy to discuss the best model for your specific needs.",
  },
  {
    q: "Do you operate globally?",
    a: "Yes. We have active search capability across the U.S., U.K., EU, UAE, and Asia, with offices in London and Singapore. We place candidates across 45+ countries, with depth in major financial and technology centres.",
  },
  {
    q: "What makes W3 Sourcing different from other recruiters?",
    a: "Three things: deep sector expertise (our consultants are former industry practitioners), a genuinely global network built over 12+ years, and an honest, consultative approach. We also believe outstanding hires still need human taste—automation can widen the funnel, but it doesn't steward your brand or know who will truly thrive. We'll tell you when a search is unrealistic and help you recalibrate—that candour is why 98% of our clients come back.",
  },
  {
    q: "Do you offer any guarantees?",
    a: "Yes. All placements come with a 12-month free replacement guarantee. If a candidate leaves or doesn't work out within the first year, we'll conduct a replacement search at no additional cost. Our 98% retention rate means we rarely need to use it.",
  },
];
