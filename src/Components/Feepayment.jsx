// src/Components/Feepayment.js
import React, { useState, useEffect, useMemo } from 'react';
// Using simple text/symbols instead of icons due to previous issues
// import { FaDownload, FaCreditCard, FaSortAmountDown, FaSortAmountUp, FaFilter } from 'react-icons/fa';

// --- Mock Data ---
const MOCK_FEE_DETAILS = [
  { id: 'sem3-2024', description: "Semester 3", amount: 50000, lateFee: 500, reAdmFee: 1000, penalty: 0, dueDate: "2024-01-05", paidOn: "2024-01-10", status: "Paid", receiptUrl: "/path/to/receipt/sem3.pdf" },
  { id: 'sem2-2024', description: "Semester 2", amount: 48000, lateFee: 0, reAdmFee: 0, penalty: 0, dueDate: "2023-08-15", paidOn: "2023-08-10", status: "Paid", receiptUrl: "/path/to/receipt/sem2.pdf" },
  { id: 'sem1-2023', description: "Semester 1", amount: 45000, lateFee: 1000, reAdmFee: 0, penalty: 0, dueDate: "2023-02-20", paidOn: null, status: "Pending", receiptUrl: null },
  { id: 'hostel-2024-1', description: "Hostel Fee (Jan-Jun)", amount: 30000, lateFee: 0, reAdmFee: 0, penalty: 0, dueDate: "2024-01-15", paidOn: "2024-01-14", status: "Paid", receiptUrl: "/path/to/receipt/hostel1.pdf" },
  { id: 'exam-2023-nov', description: "Exam Fee (Nov 2023)", amount: 1500, lateFee: 200, reAdmFee: 0, penalty: 0, dueDate: "2023-10-25", paidOn: null, status: "Pending", receiptUrl: null },
];

// Helper to format currency
const formatCurrency = (value) => {
    if (typeof value !== 'number') return value; // Return as is if not a number
    return `₹${value.toLocaleString('en-IN')}`; // Indian Rupee format
};

// --- Component ---
function Feepayment() {
  // State
  const [feeDetails, setFeeDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('date-desc'); // Default sort: newest due date first
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'Paid', 'Pending'

  // --- Simulate Fetching Data ---
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      try {
        // Calculate total amount for each item
        const processedFees = MOCK_FEE_DETAILS.map(fee => ({
          ...fee,
          totalAmt: fee.amount + fee.lateFee + fee.reAdmFee + fee.penalty
        }));
        setFeeDetails(processedFees);
        setError(null);
      } catch (err) {
        console.error("Failed to process fee data:", err);
        setError("Failed to load fee details.");
        setFeeDetails([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // --- Derive Displayed Fees based on Filter/Sort ---
  const displayFees = useMemo(() => {
    let filtered = [...feeDetails];

    // 1. Filter by Status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(fee => fee.status === filterStatus);
    }

    // 2. Sort
    const [sortBy, sortDir] = sortOption.split('-');
    const direction = sortDir === 'asc' ? 1 : -1;

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date': // Sort by due date
          // Handle null/pending dates (push them to the end when ascending, beginning when descending)
          const dateA = a.dueDate ? new Date(a.dueDate) : (direction === 1 ? Infinity : -Infinity);
          const dateB = b.dueDate ? new Date(b.dueDate) : (direction === 1 ? Infinity : -Infinity);
          comparison = dateA - dateB;
          break;
        case 'amount':
          comparison = a.totalAmt - b.totalAmt;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'desc': // Description (Semester/Fee type)
        default:
          comparison = a.description.localeCompare(b.description);
          break;
      }
      // Apply direction and secondary sort by due date if primary comparison is equal
      return comparison * direction || (new Date(b.dueDate) - new Date(a.dueDate)); // Secondary sort: newest due date first
    });

    return filtered;
  }, [feeDetails, filterStatus, sortOption]);

  // --- Calculate Pending Amount ---
  const totalPendingAmount = useMemo(() => {
    return displayFees
      .filter(fee => fee.status === 'Pending')
      .reduce((sum, fee) => sum + fee.totalAmt, 0);
  }, [displayFees]); // Recalculate only when displayed fees change

  // --- Event Handlers ---
  const handleDownloadReceipt = (receiptUrl, description) => {
    if (!receiptUrl) { console.error("No receipt URL for:", description); return; }
    console.log("Downloading receipt for:", description, "from:", receiptUrl);
    alert(`Download functionality not implemented for ${description}. URL: ${receiptUrl}`);
  };

  const handlePayNow = (feeId, description, amount) => {
    console.log("Initiating payment for:", description, "(ID:", feeId, ") Amount:", formatCurrency(amount));
    alert(`Payment gateway integration not implemented for ${description}. Amount: ${formatCurrency(amount)}`);
    // TODO: Integrate with a payment gateway
  };

  // --- Render Logic ---
  if (isLoading) return <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div></div>;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-100 rounded-lg">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl"> {/* Wider container */}
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 tracking-tight">
        Fee Payment Portal
      </h3>

      {/* Filter and Sort Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Filter by Status */}
          <div className="relative w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-transparent outline-none text-sm bg-white shadow-sm"
            >
              <option value="all">Show All Statuses</option>
              <option value="Paid">Show Paid</option>
              <option value="Pending">Show Pending</option>
            </select>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
          </div>

          {/* Sort Options */}
          <div className="relative w-full sm:w-auto">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-transparent outline-none text-sm bg-white shadow-sm"
            >
              <option value="date-desc">Sort: Due Date (Newest)</option>
              <option value="date-asc">Sort: Due Date (Oldest)</option>
              <option value="amount-desc">Sort: Amount (High-Low)</option>
              <option value="amount-asc">Sort: Amount (Low-High)</option>
              <option value="status-asc">Sort: Status (A-Z)</option>
              <option value="desc-asc">Sort: Description (A-Z)</option>
            </select>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
          </div>
        </div>

        {/* Pending Amount Summary */}
        {filterStatus !== 'Paid' && totalPendingAmount > 0 && (
             <div className="text-right mt-4 sm:mt-0">
                <span className="text-sm text-gray-600">Total Pending: </span>
                <span className="font-bold text-red-600 text-lg">{formatCurrency(totalPendingAmount)}</span>
            </div>
        )}
      </div>


      {/* Fee Details Table/List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-sm"> {/* Min width for horizontal scroll */}
            {/* Table Header */}
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left font-semibold">Description</th>
                <th className="p-3 text-right font-semibold">Amount</th>
                <th className="p-3 text-right font-semibold">Add. Fees</th> {/* Combined Late/ReAdm/Penalty */}
                <th className="p-3 text-right font-semibold">Total Due</th>
                <th className="p-3 text-center font-semibold">Due Date</th>
                <th className="p-3 text-center font-semibold">Status</th>
                <th className="p-3 text-center font-semibold">Paid On</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {displayFees.length > 0 ? (
                displayFees.map((fee) => {
                  const isPaid = fee.status === "Paid";
                  const additionalFees = fee.lateFee + fee.reAdmFee + fee.penalty;
                  return (
                    <tr key={fee.id} className={`hover:bg-gray-50 transition-colors duration-150 ${isPaid ? 'bg-green-50/30' : 'bg-red-50/30'}`}>
                      {/* Description */}
                      <td className="p-3 text-left font-medium text-gray-800">{fee.description}</td>
                      {/* Amount */}
                      <td className="p-3 text-right text-gray-700">{formatCurrency(fee.amount)}</td>
                      {/* Additional Fees */}
                      <td className="p-3 text-right text-orange-600">
                        {additionalFees > 0 ? formatCurrency(additionalFees) : '-'}
                        {/* Optional: Tooltip/details for breakdown */}
                      </td>
                      {/* Total Amount */}
                      <td className="p-3 text-right font-semibold text-gray-900">{formatCurrency(fee.totalAmt)}</td>
                      {/* Due Date */}
                      <td className="p-3 text-center text-gray-600">{fee.dueDate || '-'}</td>
                      {/* Status Badge */}
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isPaid
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200 animate-pulse' // Pulse for pending
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      {/* Paid On */}
                      <td className="p-3 text-center text-gray-600">{fee.paidOn || '-'}</td>
                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {/* Pay Now Button */}
                          {!isPaid ? (
                            <button
                              onClick={() => handlePayNow(fee.id, fee.description, fee.totalAmt)}
                              className="px-3 py-1 rounded-md text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition duration-150 shadow-sm flex items-center gap-1"
                              aria-label={`Pay now for ${fee.description}`}
                            >
                              {/* <FaCreditCard /> */}
                              <span>Pay Now</span>
                            </button>
                          ) : (
                             <div className="w-[70px]"></div> // Placeholder for alignment
                          )}
                          {/* Download Button */}
                          {fee.receiptUrl ? (
                            <button
                              onClick={() => handleDownloadReceipt(fee.receiptUrl, fee.description)}
                              className="px-3 py-1 rounded-md text-xs font-medium bg-gray-500 text-white hover:bg-gray-600 transition duration-150 shadow-sm flex items-center gap-1"
                              aria-label={`Download receipt for ${fee.description}`}
                            >
                              {/* <FaDownload /> */}
                              <span>Receipt</span>
                            </button>
                          ) : (
                             <div className="w-[70px]"></div> // Placeholder for alignment
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                // No Fees Message
                <tr>
                  <td colSpan="8" className="text-center p-10 text-gray-500">
                    No fee details match your current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Feepayment;