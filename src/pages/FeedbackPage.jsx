// src/components/FeedbackPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/feedback');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Could not load feedbacks.');
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white relative overflow-hidden">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Soft radial glows */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.35),transparent_55%)]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-10 bg-white/70 border border-[#BFDBFE] rounded-3xl shadow-xl backdrop-blur-md p-8">
          {/* Feedback Form panel */}
          <div className="w-full lg:w-1/2 border border-[#BFDBFE] rounded-2xl shadow-md p-6 bg-[#DBEAFE]">
            <h2 className="text-3xl font-bold mb-6 text-center text-[#1E40AF]">
              Share Your Feedback
            </h2>
            <FeedbackForm onFeedbackSubmitted={fetchFeedbacks} />
          </div>

          {/* Feedback List panel */}
          <div className="w-full lg:w-1/2 bg-white/70 border border-[#BFDBFE] rounded-2xl shadow-md p-2">
            <FeedbackList feedbacks={feedbacks} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default FeedbackPage;
