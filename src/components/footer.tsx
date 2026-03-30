export function Footer() {
  return (
    <footer className="bg-navy py-12 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <span className="text-navy font-bold text-xs">W3</span>
            </div>
            <span className="text-white/60 font-medium text-sm">
              W3Sourcing
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-white/35">
            <a href="#services" className="hover:text-gold transition-colors">Services</a>
            <a href="#why-us" className="hover:text-gold transition-colors">Why Us</a>
            <a href="#process" className="hover:text-gold transition-colors">Process</a>
            <a href="#industries" className="hover:text-gold transition-colors">Industries</a>
            <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
          </div>

          <p className="text-sm text-white/25">
            &copy; {new Date().getFullYear()} W3 Sourcing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
