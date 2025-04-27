// src/Pages/Fee/Feepayment.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Using axios for consistency, ensure it's installed

// --- REMOVED react-loader-spinner import ---
// import { TailSpin } from 'react-loader-spinner';

// Define the base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to format currency
const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return `₹${number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

function Feepayment() {
  const navigate = useNavigate();
  const [feeDetails, setFeeDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('date-desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [processingPayment, setProcessingPayment] = useState(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(null);
  const [actionError, setActionError] = useState(null);

  // --- Fetch Fee Data (Memoized) ---
  const fetchFees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setActionError(null);
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.warn("No auth token found. Redirecting to login.");
        navigate('/login', { state: { message: "Authentication required. Please log in." }, replace: true });
        setIsLoading(false);
        return;
    }

    try {
        console.log(`Fetching fee details from: ${API_BASE_URL}/fees`);
        const response = await axios.get(`${API_BASE_URL}/fees`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        console.log("Fetched fee details:", response.data);
        // Assuming backend sends array directly
        setFeeDetails(Array.isArray(response.data) ? response.data : []);

    } catch (err) {
        console.error("Failed to fetch fees:", err);
        let errorMsg = "Error loading fee details.";
         if (err.response) {
            errorMsg = err.response.data?.message || `Failed to fetch fees: ${err.response.statusText} (${err.response.status})`;
             if (err.response.status === 401 || err.response.status === 403) {
                errorMsg = "Unauthorized or forbidden access to fee details.";
                 console.warn(`Auth error (${err.response.status}) fetching fees. Clearing token.`);
                 localStorage.removeItem('authToken');
                 navigate('/login', { state: { message: "Session expired or invalid. Please log in again." }, replace: true });
            }
        } else if (err.request) { errorMsg = "Network Error: Could not reach server."; }
        else { errorMsg = err.message; }
        setError(errorMsg);
        setFeeDetails([]);
    } finally {
        setIsLoading(false);
    }
  }, [navigate]); // Added navigate dependency

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  // --- Derive Displayed Fees (Memoized) ---
  const displayFees = useMemo(() => {
     if (!feeDetails) return [];
     let filtered = [...feeDetails];
     if (filterStatus !== 'all') { filtered = filtered.filter(fee => fee.status === filterStatus); }
     const [sortBy, sortDir] = sortOption.split('-');
     const direction = sortDir === 'asc' ? 1 : -1;
     filtered.sort((a, b) => {
       let comparison = 0;
       const dateA = a.dueDate ? new Date(a.dueDate).getTime() : (direction === 1 ? Infinity : -Infinity);
       const dateB = b.dueDate ? new Date(b.dueDate).getTime() : (direction === 1 ? Infinity : -Infinity);
       switch (sortBy) {
         case 'date': comparison = dateA - dateB; break;
         case 'amount': comparison = parseFloat(a.totalAmt || 0) - parseFloat(b.totalAmt || 0); break;
         case 'status': comparison = (a.status || '').localeCompare(b.status || ''); break;
         case 'desc': default: comparison = (a.description || '').localeCompare(b.description || ''); break;
       }
       return comparison * direction || (dateB - dateA);
     });
     return filtered;
  }, [feeDetails, filterStatus, sortOption]);

  // --- Calculate Pending Amount (Memoized) ---
  const totalPendingAmount = useMemo(() => {
    return displayFees.filter(fee => fee.status === 'Pending').reduce((sum, fee) => sum + parseFloat(fee.totalAmt || 0), 0);
  }, [displayFees]);

  // --- Event Handlers (Memoized) ---
  const handlePayNow = useCallback(async (feeId, description, amount) => {
      setActionError(null);
      const token = localStorage.getItem('authToken');
      if (!token) { alert("Authentication required."); navigate('/login'); return; }
      if (!window.confirm(`Confirm payment of ${formatCurrency(amount)} for "${description}"?`)) return;

      setProcessingPayment(feeId);
      try {
          const response = await axios.post(`${API_BASE_URL}/fees/pay/${feeId}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
          if (!response.data?.success) throw new Error(response.data?.message || 'Payment failed');
          alert(response.data.message || "Payment successful!");
          fetchFees(); // Refresh list
      } catch (err) {
          const errorMsg = `Payment Error: ${err.response?.data?.message || err.message}`;
          setActionError(errorMsg); alert(errorMsg);
      } finally {
          setProcessingPayment(null);
      }
  }, [fetchFees, navigate]);

  const handleDownloadReceipt = useCallback(async (receiptFilename, description) => {
       setActionError(null);
       if (!receiptFilename) { alert(`No receipt for "${description}".`); return; }
       const token = localStorage.getItem('authToken');
       if (!token) { alert("Authentication required."); navigate('/login'); return; }

       const downloadUrl = `${API_BASE_URL}/fees/receipt/${encodeURIComponent(receiptFilename)}`;
       setDownloadingReceipt(receiptFilename);
       try {
           // Using fetch for blob handling
           const response = await fetch(downloadUrl, { headers: { 'Authorization': `Bearer ${token}` } });
           if (!response.ok) {
               let errorMsg = `Download failed: ${response.statusText} (${response.status})`;
               if (response.status === 404) errorMsg = "Receipt file not found.";
               else if (response.status === 401) { errorMsg = "Unauthorized. Please log in again."; navigate('/login'); }
               else if (response.status === 403) errorMsg = "Forbidden: Cannot download this receipt.";
               else { try { errorMsg = await response.text() || errorMsg; } catch (err) {err} }
               throw new Error(errorMsg);
           }
           const blob = await response.blob();
           const objectUrl = window.URL.createObjectURL(blob);
           const link = document.createElement('a');
           link.href = objectUrl;
           link.setAttribute('download', receiptFilename);
           document.body.appendChild(link);
           link.click();
           link.parentNode.removeChild(link);
           window.URL.revokeObjectURL(objectUrl);
       } catch (err) {
           const errorMsg = `Download Error: ${err.message}`;
           setActionError(errorMsg); alert(errorMsg);
       } finally {
           setDownloadingReceipt(null);
       }
  }, [navigate]);


  // --- Render Logic ---
  if (isLoading) {
    return ( <div className="flex justify-center items-center h-60"><p className="text-lg text-gray-600">Loading Fee Details...</p></div> );
  }
  if (error) {
    return ( <div className="container mx-auto p-6 text-center"><div className="p-6 bg-red-100 text-red-700 rounded-lg shadow border border-red-300"><h3 className="text-xl font-semibold mb-3">Error Loading Fee Information</h3><p>{error}</p><button onClick={fetchFees} className="mt-4 mr-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Retry</button></div></div> );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 tracking-tight">Fee Payment Portal</h3>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between flex-wrap">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto min-w-[180px]"><label htmlFor="filterStatus" className="text-xs font-medium text-gray-500 absolute -top-1.5 left-2 bg-white px-1">Status</label><select id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm bg-white shadow-sm"><option value="all">Show All</option><option value="Paid">Paid</option><option value="Pending">Pending</option></select><span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span></div>
               <div className="relative w-full sm:w-auto min-w-[200px]"><label htmlFor="sortOption" className="text-xs font-medium text-gray-500 absolute -top-1.5 left-2 bg-white px-1">Sort By</label><select id="sortOption" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm bg-white shadow-sm"><option value="date-desc">Due Date (Newest)</option><option value="date-asc">Due Date (Oldest)</option><option value="amount-desc">Amount (High-Low)</option><option value="amount-asc">Amount (Low-High)</option><option value="status-asc">Status (A-Z)</option><option value="desc-asc">Description (A-Z)</option></select><span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span></div>
          </div>
           {filterStatus !== 'Paid' && totalPendingAmount > 0 && ( <div className="text-right mt-4 sm:mt-0"><span className="text-sm text-gray-600">Total Pending: </span><span className="font-bold text-red-600 text-lg">{formatCurrency(totalPendingAmount)}</span></div> )}
           {actionError && <div className="w-full text-center text-red-500 text-sm mt-2">{actionError}</div>}
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-sm">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 uppercase tracking-wider text-xs">
              <tr>
                <th className="p-3 text-left font-semibold">Description</th><th className="p-3 text-right font-semibold">Base Amt</th><th className="p-3 text-right font-semibold">Add. Fees</th><th className="p-3 text-right font-semibold">Total Due</th><th className="p-3 text-center font-semibold w-28">Due Date</th><th className="p-3 text-center font-semibold w-24">Status</th><th className="p-3 text-center font-semibold w-28">Paid On</th><th className="p-3 text-center font-semibold w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayFees.length > 0 ? (
                displayFees.map((fee) => {
                  const isPaid = fee.status === "Paid";
                  const isPending = fee.status === "Pending";
                  const additionalFees = (parseFloat(fee.lateFee || 0) + parseFloat(fee.reAdmFee || 0) + parseFloat(fee.penalty || 0));
                  return (
                    <tr key={fee.id} className={`hover:bg-gray-50/80 transition-colors duration-150 ${isPaid ? 'bg-green-50/30' : (isPending ? 'bg-red-50/30' : '')}`}>
                      <td className="p-3 text-left font-medium text-gray-800 whitespace-nowrap">{fee.description}</td>
                      <td className="p-3 text-right text-gray-700">{formatCurrency(fee.amount)}</td>
                      <td className="p-3 text-right text-orange-600"> {additionalFees > 0 ? formatCurrency(additionalFees) : '-'} </td>
                      <td className="p-3 text-right font-semibold text-gray-900">{formatCurrency(fee.totalAmt)}</td>
                      <td className="p-3 text-center text-gray-600 whitespace-nowrap">{fee.dueDate || '-'}</td>
                      <td className="p-3 text-center"><span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ isPaid ? 'bg-green-100 text-green-800 border-green-200' : isPending ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-800 border-gray-200' }`}>{fee.status}</span></td>
                      <td className="p-3 text-center text-gray-600 whitespace-nowrap">{fee.paidOn || '-'}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {/* --- MODIFIED: Pay Now Button --- */}
                          {isPending ? (
                            <button
                                onClick={() => handlePayNow(fee.id, fee.description, fee.totalAmt)}
                                disabled={processingPayment === fee.id || isLoading}
                                className={`px-3 py-1 rounded-md text-xs font-medium text-white transition duration-150 shadow-sm flex items-center justify-center min-w-[85px] h-[26px] ${ // Ensure consistent size
                                    processingPayment === fee.id ? 'bg-gray-400 cursor-wait' : 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none'
                                } disabled:opacity-60 disabled:cursor-not-allowed`}
                                aria-label={`Pay now for ${fee.description}`}
                            >
                               {/* Show Text Instead of Spinner */}
                               {processingPayment === fee.id ? 'Paying...' : 'Pay Now'}
                            </button>
                          ) : ( <div className="min-w-[85px] h-[26px]"></div> )}

                          {/* --- MODIFIED: Download Receipt Button --- */}
                          {fee.receiptFilename ? (
                            <button
                              onClick={() => handleDownloadReceipt(fee.receiptFilename, fee.description)}
                              disabled={downloadingReceipt === fee.receiptFilename || isLoading}
                              className={`px-3 py-1 rounded-md text-xs font-medium text-white transition duration-150 shadow-sm flex items-center justify-center min-w-[85px] h-[26px] ${ // Ensure consistent size
                                downloadingReceipt === fee.receiptFilename ? 'bg-gray-400 cursor-wait' : 'bg-gray-500 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 focus:outline-none'
                              } disabled:opacity-60 disabled:cursor-not-allowed`}
                              aria-label={`Download receipt for ${fee.description}`}
                            >
                               {/* Show Text Instead of Spinner */}
                               {downloadingReceipt === fee.receiptFilename ? 'Wait...' : 'Receipt'}
                            </button>
                          ) : ( <div className="min-w-[85px] h-[26px]"></div> )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : ( <tr><td colSpan="8" className="text-center p-10 text-gray-500 italic">{feeDetails.length === 0 ? "No fee details available." : "No fees match filter."}</td></tr> )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Feepayment;