// src/components/FeedbackForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 

const FeedbackForm = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    serviceRating: '',
    comments: ''
  });

  // State to hold validation errors
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Validate the form data
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+$/i;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.serviceRating) {
      newErrors.serviceRating = 'Please select a rating';
    }

    if (!formData.comments) {
      newErrors.comments = 'Comments are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔹 Check if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You have to log in first.");
    return; // stop here if not logged in
  }

  if (validateForm()) {
    try {
      await axios.post(
        "http://localhost:5001/api/feedback",
        formData,
        { headers: { Authorization: `Bearer ${token}` } } // attach token if required
      );
      toast.success("Thank you for your feedback! It has been submitted successfully.");
      
      // Reset form and errors
      setFormData({ email: "", name: "", serviceRating: "", comments: "" });
      setErrors({});
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      toast.error("An error occurred. Please try again later.");
    }
  } else {
    // Display an error if form validation fails
    toast.error("Please correct the form errors before submitting.");
  }
};


  // Map rating -> caption
  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  return (
    <>
      <div className="form-container min-h-screen bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white text-[#1E3A8A] px-6 py-10">
        <h2 className="form-title text-3xl font-extrabold text-center text-[#1E40AF]">
          Customer Feedback Form
        </h2>
        <p className="form-description mt-2 mb-8 text-center text-[#1E3A8A]">
          We'd love to hear about your experience with our system. Your feedback helps us improve!
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl rounded-2xl bg-white border border-[#BFDBFE] shadow-sm p-6 space-y-6"
        >
          <div className="form-group">
            <label htmlFor="email" className="form-label block text-sm font-semibold text-[#1E40AF] mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input w-full rounded-lg bg-white border border-[#BFDBFE] px-4 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
              placeholder="yourname@example.com"
            />
            {errors.email && (
              <p className="error-message mt-1 text-xs text-[#EF4444]">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label block text-sm font-semibold text-[#1E40AF] mb-1">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input w-full rounded-lg bg-white border border-[#BFDBFE] px-4 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
              placeholder="e.g., Jane Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label block text-sm font-semibold text-[#1E40AF] mb-2">
              How would you rate your overall experience?
            </label>

            {/* Rating buttons with captions */}
            <div className="rating-group flex items-end gap-5">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label
                  key={rating}
                  className={`rating-label group relative inline-flex flex-col items-center justify-start gap-1 cursor-pointer`}
                >
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-full transition
                    ${formData.serviceRating === String(rating)
                      ? 'bg-[#3B82F6] text-white shadow'
                      : 'bg-white text-[#1E40AF] border border-[#BFDBFE] hover:bg-[#EFF6FF]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceRating"
                      value={rating}
                      checked={formData.serviceRating === String(rating)}
                      onChange={handleChange}
                      className="rating-radio absolute opacity-0 inset-0 cursor-pointer"
                    />
                    <span className="rating-star text-sm font-bold">{rating}</span>
                  </div>
                  {/* Caption under the button */}
                  <span
                    className={`text-xs font-medium ${
                      formData.serviceRating === String(rating) ? 'text-[#1E40AF]' : 'text-[#1E3A8A]'
                    }`}
                  >
                    {ratingLabels[rating]}
                  </span>
                </label>
              ))}
            </div>

            {errors.serviceRating && (
              <p className="error-message mt-2 text-xs text-[#EF4444]">{errors.serviceRating}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="comments" className="form-label block text-sm font-semibold text-[#1E40AF] mb-1">
              Comments or Suggestions
            </label>
            <textarea
              id="comments"
              name="comments"
              rows="4"
              value={formData.comments}
              onChange={handleChange}
              className="form-textarea w-full rounded-lg bg-white border border-[#BFDBFE] px-4 py-3 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
              placeholder="What did you like or what could be improved?"
            />
            {errors.comments && (
              <p className="error-message mt-1 text-xs text-[#EF4444]">{errors.comments}</p>
            )}
          </div>

          <div className="form-actions flex justify-end">
  <button
    type="submit"
    className="submit-button rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-6 py-2 text-sm font-bold text-white shadow transition"
  >
    Submit Feedback
  </button>
</div>

        </form>
      </div>
    </>
  );
};

export default FeedbackForm;
