import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container grid grid-cols-2 gap-8 py-8 md:grid-cols-4 lg:grid-cols-5">
        <div className="flex flex-col">
          <h3 className="mb-2 text-lg font-semibold">FanNation</h3>
          <p className="mb-4 text-sm text-muted-foreground">A place where passionate sports fans unite.</p>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Twitter</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Instagram</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Facebook</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="mb-2 text-lg font-semibold">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/categories/football" className="text-muted-foreground hover:text-foreground">
                Football
              </Link>
            </li>
            <li>
              <Link href="/categories/basketball" className="text-muted-foreground hover:text-foreground">
                Basketball
              </Link>
            </li>
            <li>
              <Link href="/categories/cricket" className="text-muted-foreground hover:text-foreground">
                Cricket
              </Link>
            </li>
            <li>
              <Link href="/categories/tennis" className="text-muted-foreground hover:text-foreground">
                Tennis
              </Link>
            </li>
            <li>
              <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                View All
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="mb-2 text-lg font-semibold">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/help" className="text-muted-foreground hover:text-foreground">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/guidelines" className="text-muted-foreground hover:text-foreground">
                Community Guidelines
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="mb-2 text-lg font-semibold">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-foreground">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/press" className="text-muted-foreground hover:text-foreground">
                Press
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col col-span-2 md:col-span-4 lg:col-span-1">
          <h3 className="mb-2 text-lg font-semibold">Subscribe</h3>
          <p className="mb-4 text-sm text-muted-foreground">Get the latest news and updates from FanNation.</p>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} FanNation. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-foreground">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
