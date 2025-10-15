import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white text-[#1E3A8A]">
      <Header />

      <main className="min-h-[60vh]">
        <section className="max-w-4xl mx-auto px-4 py-12">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-[#1E40AF]">
            Privacy Policy
          </h1>
          <p className="mt-3 text-center text-sm text-[#1E3A8A]/80">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          {/* TL;DR */}
          <div className="mt-8 rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E40AF]">TL;DR (Plain-English)</h2>
            <ul className="mt-3 list-disc list-inside text-sm">
              <li>We only collect what we need to run TechNova and improve your experience.</li>
              <li>We don’t sell your personal data. Ever.</li>
              <li>You control your data—download it, update it, or ask us to delete it.</li>
              <li>Security matters to us. We use industry-standard safeguards.</li>
              <li>Questions? We’re one email away: <span className="text-[#3B82F6]">privacy@technova.example</span></li>
            </ul>
          </div>

          {/* About TechNova */}
          <div className="mt-8 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">About TechNova</h2>
            <p className="mt-2 text-sm">
              TechNova is a modern computer retail and service platform. We help you discover hardware you’ll
              love, track orders smoothly, and get real support from real humans. Our privacy approach is simple:
              collect less, protect more, explain clearly.
            </p>
          </div>

          {/* Scope */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Scope</h2>
            <p className="mt-2 text-sm">
              This policy applies to our websites, apps, and services where it’s linked. By using TechNova,
              you agree to this policy.
            </p>
          </div>

          {/* What we collect */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Information We Collect</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><span className="font-semibold">Account details:</span> name, email, password (hashed), phone (optional).</li>
              <li><span className="font-semibold">Order & delivery info:</span> shipping address, purchase history, billing metadata.</li>
              <li><span className="font-semibold">Support interactions:</span> messages, feedback, service tickets.</li>
              <li><span className="font-semibold">Usage data:</span> device, browser, pages viewed, general location (from IP), timestamps.</li>
              <li><span className="font-semibold">Cookies & similar tech:</span> to keep you signed in and remember preferences.</li>
              <li><span className="font-semibold">Optional extras:</span> saved carts, wishlists, review content you submit.</li>
            </ul>
          </div>

          {/* How we use it */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">How We Use Data</h2>
            <ul className="mt-3 list-disc list-inside text-sm">
              <li>Provide core features (accounts, checkout, support, delivery updates).</li>
              <li>Improve performance and fix issues.</li>
              <li>Personalize content (e.g., relevant products, saved preferences).</li>
              <li>Prevent fraud and secure our platform.</li>
              <li>Communicate important updates (policy changes, service notices).</li>
            </ul>
          </div>

          {/* Legal bases (GDPR-style, friendly) */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Legal Bases for Processing</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><span className="font-semibold">Contract:</span> to fulfill orders and provide requested services.</li>
              <li><span className="font-semibold">Legitimate interests:</span> to safeguard accounts, prevent abuse, and improve TechNova.</li>
              <li><span className="font-semibold">Consent:</span> for optional things (e.g., marketing emails). You can withdraw anytime.</li>
              <li><span className="font-semibold">Legal obligation:</span> when we’re required to keep certain records.</li>
            </ul>
          </div>

          {/* Sharing */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">How We Share Information</h2>
            <p className="mt-2 text-sm">
              We don’t sell your personal data. We share limited information with:
            </p>
            <ul className="mt-3 list-disc list-inside text-sm">
              <li>Trusted service providers (e.g., payments, delivery, analytics) under strict agreements.</li>
              <li>Law enforcement or regulators when legally required.</li>
              <li>Another organization if we undergo a merger or acquisition (we’ll notify you where possible).</li>
            </ul>
          </div>

          {/* Cookies */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Cookies & Tracking</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><span className="font-semibold">Essential:</span> login sessions, security, checkout.</li>
              <li><span className="font-semibold">Preferences:</span> theme, saved cart.</li>
              <li><span className="font-semibold">Analytics:</span> aggregated usage to improve UX.</li>
            </ul>
            <p className="mt-3 text-sm">
              You can control cookies in your browser settings. Blocking essential cookies may break some features.
            </p>
          </div>

          {/* Analytics & Ads */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Analytics & Marketing</h2>
            <p className="mt-2 text-sm">
              We use privacy-respecting analytics to understand what works and what doesn’t. Marketing emails are
              opt-in and easy to unsubscribe from. We don’t do creepy tracking or sell your data.
            </p>
          </div>

          {/* Payments */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Payments</h2>
            <p className="mt-2 text-sm">
              Payments are processed by PCI-compliant providers. We don’t store full card details on TechNova servers.
            </p>
          </div>

          {/* Security */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Security</h2>
            <p className="mt-2 text-sm">
              We use encryption in transit, hashed passwords, role-based access, and monitoring. No system is 100% secure,
              but we work hard to protect your information.
            </p>
          </div>

          {/* Retention */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Data Retention</h2>
            <p className="mt-2 text-sm">
              We keep personal data only as long as necessary—then either anonymize it or delete it safely. You can also
              request deletion whenever you want.
            </p>
          </div>

          {/* Your rights */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Your Privacy Controls</h2>
            <ul className="mt-3 list-disc list-inside text-sm">
              <li>Access your data and request a copy.</li>
              <li>Update or correct inaccurate information.</li>
              <li>Delete your account/data (unless we must keep some for legal reasons).</li>
              <li>Opt out of marketing communications anytime.</li>
            </ul>
            <p className="mt-3 text-sm">
              To exercise these rights, email us at <span className="text-[#3B82F6]">privacy@technova.example</span>.
            </p>
          </div>

          {/* Children */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Children’s Privacy</h2>
            <p className="mt-2 text-sm">
              TechNova isn’t intended for children under the age of 13. If you believe a child provided personal data,
              contact us and we’ll remove it.
            </p>
          </div>

          {/* International transfers */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">International Data Transfers</h2>
            <p className="mt-2 text-sm">
              Your data may be processed in other countries by vetted providers with appropriate protections in place.
            </p>
          </div>

          {/* Third-party links */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Third-Party Links</h2>
            <p className="mt-2 text-sm">
              We may link to third-party sites. Their privacy practices are their own—please review their policies.
            </p>
          </div>

          {/* Do Not Track */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Do Not Track</h2>
            <p className="mt-2 text-sm">
              Some browsers offer a “Do Not Track” signal. While standards are evolving, we honor privacy by design and
              minimize tracking by default.
            </p>
          </div>

          {/* Changes */}
          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Changes to This Policy</h2>
            <p className="mt-2 text-sm">
              If we make material changes, we’ll notify you through the site or email. We encourage you to review this
              page regularly.
            </p>
          </div>

          {/* Contact */}
          <div className="mt-8 rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] p-6 shadow-sm text-center">
            <h2 className="text-xl font-semibold text-[#1E40AF]">Contact Us</h2>
            <p className="mt-2 text-sm">
              Questions, requests, or feedback? We’d love to help.
            </p>
            <p className="mt-2 text-sm">
              📧 <span className="text-[#3B82F6]">privacy@technova.example</span>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
