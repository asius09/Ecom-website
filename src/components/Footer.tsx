"use client";
export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* About Section */}
          <div className="max-w-xs">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">About MyShop</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              MyShop is your one-stop destination for the latest products in
              electronics, fashion, home goods, and more. We&apos;re committed to
              providing quality products and excellent customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Categories</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="/categories/electronics"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Electronics
                </a>
              </li>
              <li>
                <a
                  href="/categories/clothing"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Clothing
                </a>
              </li>
              <li>
                <a
                  href="/categories/home-kitchen"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home & Kitchen
                </a>
              </li>
              <li>
                <a
                  href="/categories/sports-outdoors"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Sports & Outdoors
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="max-w-xs">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
              Subscribe to our newsletter to get the latest updates and offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MyShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
