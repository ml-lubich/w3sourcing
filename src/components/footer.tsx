"use client";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Results", href: "#stats" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const sectors = [
  { label: "Technology", href: "#features" },
  { label: "Legal", href: "#features" },
  { label: "Finance", href: "#features" },
];

export function Footer() {
  return (
    <footer className="bg-gradient-cta text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple to-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <span className="text-white font-bold text-xs">W3</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                W3Sourcing
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Global recruitment excellence for Tech, Legal & Finance.
              Offices in London and Singapore.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white/30 text-xs font-semibold tracking-[0.15em] uppercase mb-5">
              Navigation
            </h4>
            <div className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/40 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Sectors */}
          <div>
            <h4 className="text-white/30 text-xs font-semibold tracking-[0.15em] uppercase mb-5">
              Sectors
            </h4>
            <div className="flex flex-col gap-3">
              {sectors.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white/40 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/30 text-xs font-semibold tracking-[0.15em] uppercase mb-5">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:info@w3sourcing.com"
                className="block text-white/40 hover:text-white transition-colors text-sm"
              >
                info@w3sourcing.com
              </a>
              <p className="text-white/25 text-sm">London &middot; Singapore</p>
            </div>
            <div className="mt-5 flex gap-4">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-accent/80 flex items-center justify-center transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} W3 Sourcing. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
