// src/Components/Contact.js
import React, { useState } from 'react'; // Import useState

// Removed imports/variables handled by Layout.js

function Contact() {
  // --- State for Form Inputs ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  // --- State for Form Submission Status ---
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error
  const [formMessage, setFormMessage] = useState(''); // To display success/error messages

  // --- Handle Input Changes ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- Handle Form Submission ---
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent default page reload
    setFormStatus('submitting');
    setFormMessage(''); // Clear previous messages

    console.log("Form Data Submitted:", formData);

    // --- Simulate API Call ---
    // Replace this with your actual fetch/axios call to your backend
    setTimeout(() => {
      // Simulate success/failure randomly for demonstration
      const success = Math.random() > 0.2; // 80% chance of success

      if (success) {
        setFormStatus('success');
        setFormMessage('Your message has been sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' }); // Clear form on success
        // Optionally reset status after a few seconds
         setTimeout(() => { setFormStatus('idle'); setFormMessage(''); }, 5000);
      } else {
        setFormStatus('error');
        setFormMessage('Sorry, there was an error sending your message. Please try again later.');
        // Keep form data in case of error for user convenience
      }
    }, 1500); // Simulate 1.5 second network delay
  };

  // --- JSX for Contact Content ONLY ---
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 tracking-tight">
        Contact Us
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Contact Info Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg border border-gray-200">
          <h4 className="text-xl font-semibold mb-5 text-gray-700 border-b pb-2">Get in Touch</h4>
          <div className="space-y-4"> {/* Added space between items */}
            <p className="text-gray-700 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
              <span className="font-medium">Email:</span>
              <a href="mailto:s4tech1234@gmail.com" className="text-blue-600 hover:text-blue-800 hover:underline break-all">s4tech1234@gmail.com</a>
            </p>
            <p className="text-gray-700 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
              <span className="font-medium">Phone:</span>
              <a href="tel:+919876543210" className="text-blue-600 hover:text-blue-800 hover:underline">+91 98765 43210</a>
            </p>
            <p className="text-gray-700 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
              <span className="font-medium">Address:</span>
              <span>Anna University,<br/>Chennai - 600025,<br/>Tamil Nadu, India</span>
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h4 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-2">Send a Message</h4>
          <form onSubmit={handleFormSubmit} className="space-y-5"> {/* Added space between form elements */}
            {/* Name Input */}
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="contact-name"
                type="text"
                name="name" // Crucial for state update
                value={formData.name} // Controlled component
                onChange={handleInputChange} // Update state on change
                required // HTML5 validation
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-teal-400 focus:border-transparent outline-none shadow-sm transition duration-150 ease-in-out"
                placeholder="e.g., Saravana Kumar"
                disabled={formStatus === 'submitting'} // Disable during submission
              />
            </div>
            {/* Email Input */}
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-teal-400 focus:border-transparent outline-none shadow-sm transition duration-150 ease-in-out"
                placeholder="e.g., saravana@example.com"
                disabled={formStatus === 'submitting'}
              />
            </div>
            {/* Message Textarea */}
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-teal-400 focus:border-transparent outline-none shadow-sm resize-y transition duration-150 ease-in-out"
                placeholder="Enter your query or message here..."
                disabled={formStatus === 'submitting'}
              ></textarea>
            </div>

            {/* Submit Button & Status Message */}
            <div>
              <button
                type="submit"
                disabled={formStatus === 'submitting'} // Disable button while submitting
                className={`w-full flex justify-center items-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold px-6 py-2.5 rounded-md hover:from-teal-600 hover:to-cyan-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {formStatus === 'submitting' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>

              {/* Display Success/Error Message */}
              {formMessage && (
                <div className={`mt-4 text-center p-3 rounded-md text-sm font-medium ${
                  formStatus === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                  formStatus === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : ''
                }`}>
                  {formMessage}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;