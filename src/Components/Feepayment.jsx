// src/Components/Feepayment.js
import React from 'react'; // Explicitly import React (good practice)
// Removed useState as it's not currently used
// Removed useNavigate - handled by Layout.js
// Removed annaunivlogo and name - handled by Layout.js

function Feepayment() {

  // --- Data ---
  // NOTE: In a real application, this data would likely come from an API call (e.g., using useEffect and useState) or props.
  const feeDetails = [
    {
      id: 'sem3-2024', // Added a unique ID - better for keys
      description: "Semester 3",
      amount: "₹50,000",
      lateFee: "₹500",
      reAdmFee: "₹1,000",
      penalty: "₹0",
      totalAmt: "₹51,500",
      paidOn: "2024-01-10",
      status: "Paid",
      receipt: "Download", // Indicates a receipt is available
      receiptUrl: "/path/to/receipt/sem3.pdf" // Example URL for the actual receipt
    },
    {
      id: 'sem2-2024',
      description: "Semester 2",
      amount: "₹5,000",
      lateFee: "₹200",
      reAdmFee: "₹0",
      penalty: "₹0",
      totalAmt: "₹5,200",
      paidOn: "2024-02-05",
      status: "Paid",
      receipt: "Download",
      receiptUrl: "/path/to/receipt/sem2.pdf"
    },
    {
      id: 'sem1-2023',
      description: "Semester 1",
      amount: "₹40,000",
      lateFee: "₹1,000",
      reAdmFee: "₹2,000",
      penalty: "₹500",
      totalAmt: "₹43,500",
      paidOn: "Pending",
      status: "Pending",
      receipt: "-", // Indicates no receipt available
      receiptUrl: null
    },
  ];

  // --- Event Handlers ---
  const handleDownloadReceipt = (receiptUrl) => {
    if (!receiptUrl) {
      console.error("No receipt URL provided.");
      // Optionally show a user message
      return;
    }
    console.log("Attempting to download receipt from:", receiptUrl);
    // TODO: Implement actual download logic.
    // This might involve:
    // 1. Making an API call to get a secure download link.
    // 2. Directly linking to the URL if it's publicly accessible (less common/secure for receipts).
    //    window.open(receiptUrl, '_blank'); // Opens in new tab
    // 3. Triggering a file download initiated by the browser.
    alert(`Download functionality not yet implemented for URL: ${receiptUrl}`);
  };

  // --- JSX for Fee Payment Content ONLY ---
  return (
    // Container for the fee payment section
    <div className="container mx-auto p-4 max-w-6xl">
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-700">Fee Payment Details</h3>

      {/* Card-like container for the table */}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
          {/* Table Header */}
          <thead>
            <tr className="bg-cyan-500 text-white">
              <th className="p-3 border text-left">Description</th>
              <th className="p-3 border text-right">Amount</th>
              <th className="p-3 border text-right">Late Fee</th>
              <th className="p-3 border text-right">Re-adm. Fee</th>
              <th className="p-3 border text-right">Penalty</th>
              <th className="p-3 border text-right">Total Amt.</th>
              <th className="p-3 border text-center">Paid/Conf. On</th>
              <th className="p-3 border text-center">Status</th>
              <th className="p-3 border text-center">Receipt</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {feeDetails.length > 0 ? (
              // Map over fee details to create table rows
              feeDetails.map((fee) => ( // Use a unique ID for the key if available
                <tr key={fee.id} className="border hover:bg-gray-100 transition-colors duration-150">
                  <td className="p-3 border text-left">{fee.description}</td>
                  <td className="p-3 border text-right">{fee.amount}</td>
                  <td className="p-3 border text-right">{fee.lateFee}</td>
                  <td className="p-3 border text-right">{fee.reAdmFee}</td>
                  <td className="p-3 border text-right">{fee.penalty}</td>
                  <td className="p-3 border text-right font-semibold">{fee.totalAmt}</td>
                  <td className="p-3 border text-center">{fee.paidOn}</td>
                  {/* Conditional styling for status */}
                  <td className={`p-3 border text-center font-semibold ${fee.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                    {fee.status}
                  </td>
                  {/* Conditional rendering for the download button */}
                  <td className="p-3 border text-center">
                    {fee.receipt === "Download" && fee.receiptUrl ? (
                      <button
                        onClick={() => handleDownloadReceipt(fee.receiptUrl)} // Call handler on click
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-xs md:text-sm transition-colors duration-150"
                        aria-label={`Download receipt for ${fee.description}`} // Accessibility
                      >
                        Download
                      </button>
                    ) : (
                      // Display a dash if no receipt is available
                      "-"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              // Display message if no fee details exist
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">No fee details found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Feepayment;