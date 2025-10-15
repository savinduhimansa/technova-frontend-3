import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white text-[#1E3A8A]">
      <header>
        <Header />
      </header>

      <main className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-bold text-center mb-6 text-[#1E3A8A]">
            About Us
          </h1>
          <p className="text-center text-lg mb-12 text-gray-700">
            Welcome to{" "}
            <span className="font-semibold text-[#1E3A8A]">
              TechNova Computer Retail Management System
            </span>
            , where innovation meets reliability. We specialize in providing
            top-notch IT solutions, repair services, order and delivery, custom PC
            builds, spare parts, and customer support.
          </p>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-6 rounded-xl shadow-lg hover:bg-[#BFDBFE]/40 transition">
              <h2 className="text-2xl font-semibold mb-3 text-[#1E3A8A]">
                Our Mission
              </h2>
              <p className="text-gray-700">
                Our mission is to empower businesses and individuals with reliable
                IT services. We focus on efficiency, transparency, and customer
                satisfaction at every step.
              </p>
            </div>

            <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-6 rounded-xl shadow-lg hover:bg-[#BFDBFE]/40 transition">
              <h2 className="text-2xl font-semibold mb-3 text-[#1E3A8A]">
                Our Vision
              </h2>
              <p className="text-gray-700">
                We envision a future where technology is accessible, user-friendly,
                and secure for everyone. Our goal is to become a trusted partner in
                digital transformation.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-[#1E3A8A]">
              Meet Our Team
            </h2>
            <p className="text-gray-700 mb-8">
              A passionate group of technicians, developers, and support staff
              working together to serve you better.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Team Member Card */}
              <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-6 rounded-xl shadow-lg hover:bg-[#BFDBFE]/40 transition">
                <img
                  src="https://placehold.co/120x120/1E3A8A/ffffff?text=A"
                  alt="team-member"
                  className="w-24 h-24 mx-auto rounded-full border-4 border-[#1E3A8A] mb-4"
                />
                <h3 className="text-xl font-semibold text-[#1E3A8A]">
                  Alice Johnson
                </h3>
                <p className="text-gray-600">Lead Technician</p>
              </div>

              <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-6 rounded-xl shadow-lg hover:bg-[#BFDBFE]/40 transition">
                <img
                  src="https://placehold.co/120x120/1E3A8A/ffffff?text=B"
                  alt="team-member"
                  className="w-24 h-24 mx-auto rounded-full border-4 border-[#1E3A8A] mb-4"
                />
                <h3 className="text-xl font-semibold text-[#1E3A8A]">
                  Brian Smith
                </h3>
                <p className="text-gray-600">Manager</p>
              </div>

              <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-6 rounded-xl shadow-lg hover:bg-[#BFDBFE]/40 transition">
                <img
                  src="https://placehold.co/120x120/1E3A8A/ffffff?text=C"
                  alt="team-member"
                  className="w-24 h-24 mx-auto rounded-full border-4 border-[#1E3A8A] mb-4"
                />
                <h3 className="text-xl font-semibold text-[#1E3A8A]">
                  Carla Gomez
                </h3>
                <p className="text-gray-600">Customer Support</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-3 text-[#1E3A8A]">
              Get in Touch
            </h2>
            <p className="text-gray-700 mb-4">
              Have questions or need support? Reach out to us anytime.
            </p>
            <p className="text-lg font-medium text-[#3B82F6]">
              📧 support@technova.com
            </p>
            <p className="text-lg font-medium text-[#3B82F6]">📞 +94 77 123 4567</p>
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
