export function Footer() {
  return (
    <footer className="w-full py-16 px-4 sm:px-6 lg:px-20 bg-white">
      <div className="max-w-[1240px] mx-auto">
        {/* Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#0f0f0f] rounded-lg w-9 h-9 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-black font-semibold text-xl">Spotto</span>
            </div>
            <p className="text-[#666666] text-sm leading-[21px] max-w-[360px]">
              Discover Stockholm like never before with our minimalist map experience.
            </p>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Product Links */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-black">Product</h4>
                <div className="space-y-3">
                  <a href="#features" className="block text-sm text-[#666666] hover:text-gray-900">Features</a>
                  <a href="#pricing" className="block text-sm text-[#666666] hover:text-gray-900">Pricing</a>
                </div>
              </div>

              {/* Company Links */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-black">Company</h4>
                <div className="space-y-3">
                  <a href="#about" className="block text-sm text-[#666666] hover:text-gray-900">About</a>
                  <a href="#blog" className="block text-sm text-[#666666] hover:text-gray-900">Blog</a>
                  <a href="#careers" className="block text-sm text-[#666666] hover:text-gray-900">Careers</a>
                </div>
              </div>

              {/* Support Links */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-black">Support</h4>
                <div className="space-y-3">
                  <a href="#help" className="block text-sm text-[#666666] hover:text-gray-900">Help Center</a>
                  <a href="#contact" className="block text-sm text-[#666666] hover:text-gray-900">Contact</a>
                  <a href="#privacy" className="block text-sm text-[#666666] hover:text-gray-900">Privacy</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Social */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-[#e5e5e5]">
          <p className="text-sm text-[#666666] mb-4 sm:mb-0">
            © 2025 Spotto. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-2xl border border-[#e5e5e5] flex items-center justify-center hover:bg-gray-50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 8.5C6 7.11929 7.11929 6 8.5 6C9.88071 6 11 7.11929 11 8.5C11 9.88071 9.88071 11 8.5 11C7.11929 11 6 9.88071 6 8.5Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11.5 4.5H13M2 6V11C2 12.8856 2 13.8284 2.58579 14.4142C3.17157 15 4.11438 15 6 15H10C11.8856 15 12.8284 15 13.4142 14.4142C14 13.8284 14 12.8856 14 11V6C14 4.11438 14 3.17157 13.4142 2.58579C12.8284 2 11.8856 2 10 2H6C4.11438 2 3.17157 2 2.58579 2.58579C2 3.17157 2 4.11438 2 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-2xl border border-[#e5e5e5] flex items-center justify-center hover:bg-gray-50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 4.5C14 5.32843 13.3284 6 12.5 6C11.6716 6 11 5.32843 11 4.5C11 3.67157 11.6716 3 12.5 3C13.3284 3 14 3.67157 14 4.5Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 8.5C11 9.88071 9.88071 11 8.5 11C7.11929 11 6 9.88071 6 8.5C6 7.11929 7.11929 6 8.5 6C9.88071 6 11 7.11929 11 8.5Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 6V11C2 12.8856 2 13.8284 2.58579 14.4142C3.17157 15 4.11438 15 6 15H10C11.8856 15 12.8284 15 13.4142 14.4142C14 13.8284 14 12.8856 14 11V6C14 4.11438 14 3.17157 13.4142 2.58579C12.8284 2 11.8856 2 10 2H6C4.11438 2 3.17157 2 2.58579 2.58579C2 3.17157 2 4.11438 2 6Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-2xl border border-[#e5e5e5] flex items-center justify-center hover:bg-gray-50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 7V10M10.5 7V10M2 5H14M12.5 5L11.9746 11.1457C11.8667 12.2107 11.8128 12.7432 11.5852 13.1284C11.3825 13.4679 11.0913 13.7344 10.7448 13.9083C10.3547 14.1 9.82139 14.1 8.75469 14.1H7.24531C6.17861 14.1 5.64527 14.1 5.25521 13.9083C4.90873 13.7344 4.61752 13.4679 4.41477 13.1284C4.18716 12.7432 4.13328 12.2107 4.02539 11.1457L3.5 5M6.5 5V3.5C6.5 2.67157 7.17157 2 8 2V2C8.82843 2 9.5 2.67157 9.5 3.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 