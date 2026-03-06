import { footerLinks } from '@/lib/content'

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F7] py-12 xl:py-8 px-6 xl:px-16" aria-label="Site footer">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center xl:justify-between gap-4">
        {/* Logo / brand */}
        <p className="text-[13px] font-semibold text-[#1D1D1F]">iPhone 17 Pro Max</p>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul
            className="flex flex-wrap justify-center xl:justify-start gap-x-4 gap-y-2"
            role="list"
          >
            {footerLinks.map((link, index) => (
              <li key={link.href + index} className="flex items-center gap-4">
                {index > 0 && (
                  <span className="text-[#D2D2D7] select-none" aria-hidden="true">
                    |
                  </span>
                )}
                <a
                  href={link.href}
                  className="text-[13px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 rounded-sm"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <p className="text-[13px] text-[#6E6E73] text-center xl:text-right">
          &copy; 2026 Sankofa. All rights reserved.
          <br className="xl:hidden" />
          <span className="hidden xl:inline"> </span>
          iPhone is a trademark of Apple Inc.
        </p>
      </div>
    </footer>
  )
}
