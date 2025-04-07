// src/Components/Contact.js
import React from 'react'; // Keep React import
// Removed useState as it's not currently used for the static form
// Removed useNavigate - handled by Layout.js
// Removed annaunivlogo, name, sidebarItems - handled by Layout.js

function Contact() {
  // Removed handleLogout function - it's in Layout.js
  // Removed handleSidebarNavigate function - it's in Layout.js

  // --- Event Handlers (for the form, if needed later) ---
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    // TODO: Implement form submission logic
    // - Get form data (e.g., using useState or FormData)
    // - Validate data
    // - Send data to backend API
    console.log("Form submitted (logic not implemented)");
    alert("Thank you for your message! (Submission logic not implemented)");
    // Optionally clear the form fields
    event.target.reset();
  };

  // --- JSX for Contact Content ONLY ---
  // No <>, Header, or Sidebar here. That's handled by Layout.js
  return (
    // Container for the contact page content
    <div className="container mx-auto p-4 max-w-4xl"> {/* Adjust padding/margin if Layout handles it */}
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Contact Us</h3>

      {/* Contact Info Box */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8"> {/* Increased bottom margin */}
        <h4 className="text-xl font-semibold mb-4 text-gray-700">Get in Touch</h4>
        <p className="text-gray-700 mb-3 flex items-center gap-2"> {/* Increased bottom margin */}
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
           <strong>Email:</strong> <a href="mailto:s4tech1234@gmail.com" className="text-blue-600 hover:underline break-all">s4tech1234@gmail.com</a> {/* Added break-all */}
        </p>
        <p className="text-gray-700 mb-3 flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
           <strong>Phone:</strong> <a href="tel:+919876543210" className="text-blue-600 hover:underline">+91 98765 43210</a>
        </p>
        <p className="text-gray-700 flex items-start gap-2"> {/* Use items-start for multi-line address */}
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
           <strong>Address:</strong> <span>Anna University, Chennai - 600025, Tamil Nadu, India</span> {/* Wrap address in span */}
        </p>
      </div>

      {/* Contact Form */}
      {/* Added onSubmit handler */}
      <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-5 text-gray-800">Send a Message</h4> {/* Changed font weight */}
        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="contact-name"
            type="text"
            name="name" // Added name attribute for form handling
            required // Added basic validation
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none shadow-sm"
            placeholder="Enter your name"
          />
        </div>
        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="contact-email"
            type="email"
            name="email" // Added name attribute
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none shadow-sm"
            placeholder="Enter your email"
          />
        </div>
        {/* Message Textarea */}
        <div className="mb-5"> {/* Increased bottom margin */}
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            id="contact-message"
            name="message" // Added name attribute
            rows="5" // Increased rows
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none shadow-sm resize-y" // Allow vertical resize
            placeholder="Enter your message"
          ></textarea>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold px-6 py-2 rounded-md hover:from-teal-600 hover:to-cyan-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500" // Added focus styles
        >
          Send Message
        </button>
      </form>
    </div>
    // No closing </> needed
  );
}

export default Contact;