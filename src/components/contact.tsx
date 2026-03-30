"use client";

import { useState } from "react";
import { ScrollSection } from "./scroll-animation";

const offices = [
  {
    city: "London",
    address: "128 City Road, London, EC1V 2NX",
    flag: "🇬🇧",
  },
  {
    city: "Singapore",
    address: "Far East Finance Building, 14 Robinson Road #08-01, Singapore 048545",
    flag: "🇸🇬",
  },
];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="py-24 sm:py-32 bg-white">
      <ScrollSection className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="text-gold font-semibold text-sm tracking-widest uppercase">
            Contact Us
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
            Let&apos;s Start a Conversation
          </h2>
          <p className="mt-4 text-lg text-navy/50 max-w-2xl mx-auto">
            Whether you&apos;re looking to build a team or take your next career step,
            we&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-3 animate-on-scroll delay-1">
            {submitted ? (
              <div className="rounded-2xl bg-green-50 border border-green-200 p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Message Sent</h3>
                <p className="text-navy/50">Thank you for reaching out. We&apos;ll be in touch shortly.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-navy/10 bg-slate-50 px-4 py-3 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-navy/10 bg-slate-50 px-4 py-3 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                      placeholder="Smith"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-xl border border-navy/10 bg-slate-50 px-4 py-3 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">
                    I&apos;m looking for...
                  </label>
                  <select className="w-full rounded-xl border border-navy/10 bg-slate-50 px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all">
                    <option>Hiring talent for my team</option>
                    <option>Exploring career opportunities</option>
                    <option>Partnership or collaboration</option>
                    <option>General enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="w-full rounded-xl border border-navy/10 bg-slate-50 px-4 py-3 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary text-navy font-semibold px-8 py-3.5 rounded-full text-sm w-full sm:w-auto"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Offices */}
          <div className="lg:col-span-2 animate-on-scroll delay-2">
            <h3 className="text-lg font-bold text-navy mb-6">Our Offices</h3>
            <div className="space-y-6">
              {offices.map((office) => (
                <div
                  key={office.city}
                  className="rounded-xl border border-navy/8 p-6 hover:border-gold/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{office.flag}</span>
                    <span className="font-semibold text-navy">
                      {office.city}
                    </span>
                  </div>
                  <p className="text-sm text-navy/50 leading-relaxed">
                    {office.address}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-navy/8 p-6">
              <h4 className="font-semibold text-navy mb-2">Email Us</h4>
              <p className="text-sm text-navy/50">
                info@w3sourcing.com
              </p>
            </div>

            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy/40 hover:bg-gold/10 hover:text-gold transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </ScrollSection>
    </section>
  );
}
