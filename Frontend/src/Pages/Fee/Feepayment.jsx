// Fee Payment Component: Handles fee management for both students and administrators
// Features: View fees, make payments, download documents, and manage sample fees (admin only)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return `₹${number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

function Feepayment() {
  const navigate = useNavigate();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(null);
    const [downloadingDoc, setDownloadingDoc] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
  const [sortOption, setSortOption] = useState('date-desc');
    const [addingSampleFees, setAddingSampleFees] = useState(false);
    const [clearingFees, setClearingFees] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);

        if (role === 'Admin') {
            fetchStudents();
        } else {
            fetchFees();
        }
    }, []);

    useEffect(() => {
        if (userRole === 'Admin' && selectedStudentId) {
            setLoading(true);
            fetchFees();
        }
    }, [selectedStudentId]);

    const fetchFees = async () => {
        try {
    const token = localStorage.getItem('authToken');
    if (!token) {
                navigate('/login');
        return;
    }

            const response = await axios.get(`${API_BASE_URL}/fees/student`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFees(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch fees. Please try again later.');
            console.error('Error fetching fees:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/students/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStudents(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('Failed to fetch students. Please try again.');
        } finally {
            setLoadingStudents(false);
            setLoading(false);
        }
    };

    const handleDownloadDocument = async (feeId) => {
        setDownloadingDoc(feeId);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/fees/document/${feeId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `fee_document_${feeId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
    } catch (err) {
            setError('Failed to download document. Please try again.');
            console.error('Error downloading document:', err);
    } finally {
            setDownloadingDoc(null);
        }
    };

    const handlePayNow = async (feeId) => {
        if (!window.confirm('Are you sure you want to proceed with the payment?')) {
            return;
        }

      setProcessingPayment(feeId);
      try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${API_BASE_URL}/fees/pay/${feeId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            await fetchFees();
            alert('Payment successful!');
      } catch (err) {
            setError('Payment failed. Please try again.');
            console.error('Error processing payment:', err);
      } finally {
          setProcessingPayment(null);
      }
    };

    const clearFees = async () => {
        if (!selectedStudentId) {
            alert('Please select a student first');
            return;
        }

        if (!window.confirm('This will delete all fees for the selected student. Continue?')) {
            return;
        }

        setClearingFees(true);
        try {
       const token = localStorage.getItem('authToken');
            await axios.delete(`${API_BASE_URL}/fees/clear-fees/${selectedStudentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            await fetchFees();
            alert('Fees cleared successfully!');
        } catch (err) {
            setError('Failed to clear fees. Please try again.');
            console.error('Error clearing fees:', err);
        } finally {
            setClearingFees(false);
        }
    };

    const addSampleFees = async () => {
        if (!selectedStudentId) {
            alert('Please select a student first');
            return;
        }

        if (!window.confirm('This will add sample fee records. Continue?')) {
            return;
        }

        setAddingSampleFees(true);
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${API_BASE_URL}/fees/add-sample-fees`, 
                { studentId: selectedStudentId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            await fetchFees();
            alert('Sample fees added successfully!');
       } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to add sample fees. Please try again.';
            setError(errorMessage);
            console.error('Error adding sample fees:', err);
       } finally {
            setAddingSampleFees(false);
        }
    };

    const displayFees = fees
        .filter(fee => {
            const matchesSearch = fee.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || fee.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const [sortBy, sortDir] = sortOption.split('-');
            const direction = sortDir === 'asc' ? 1 : -1;
            
            switch (sortBy) {
                case 'date':
                    return (new Date(a.dueDate) - new Date(b.dueDate)) * direction;
                case 'amount':
                    return (parseFloat(a.amount) - parseFloat(b.amount)) * direction;
                default:
                    return 0;
            }
        });

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

  if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
        <div className="container mx-auto p-4 md:p-6 max-w-6xl">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 tracking-tight">
                Fee Payments
            </h3>

            {userRole === 'Admin' && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-grow w-full md:w-auto">
                            <select
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                disabled={loadingStudents}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none text-sm shadow-sm disabled:opacity-50"
                            >
                                <option value="">Select a Student</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} ({student.email})
                                    </option>
                                ))}
                            </select>
          </div>
                        <div className="flex gap-2">
                            <button
                                onClick={clearFees}
                                disabled={clearingFees || !selectedStudentId || loadingStudents}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {clearingFees ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Clearing...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Clear Fees
                                    </>
                                )}
                            </button>
                            <button
                                onClick={addSampleFees}
                                disabled={addingSampleFees || !selectedStudentId || loadingStudents}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150 shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {addingSampleFees ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Sample Fees
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {userRole === 'Admin' && !selectedStudentId ? (
                <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-sm border border-gray-200">
                    Please select a student to view their fees
                </div>
            ) : (
                <>
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search fees..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none text-sm shadow-sm"
                                />
                            </div>
                            <div className="flex gap-4">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none text-sm shadow-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                </select>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none text-sm shadow-sm"
                                >
                                    <option value="date-desc">Due Date (Latest)</option>
                                    <option value="date-asc">Due Date (Earliest)</option>
                                    <option value="amount-desc">Amount (High to Low)</option>
                                    <option value="amount-asc">Amount (Low to High)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {displayFees.length === 0 ? (
                        <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-sm border border-gray-200">
                            No fees found
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {displayFees.map((fee) => (
                                        <tr key={fee.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(fee.amount)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(fee.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    fee.status === 'Paid' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {fee.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex gap-2">
                                                    {fee.status === 'Pending' && (
                                                        <button
                                                            onClick={() => handlePayNow(fee.id)}
                                                            disabled={processingPayment === fee.id}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            {processingPayment === fee.id ? (
                                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                'Pay Now'
                                                            )}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDownloadDocument(fee.id)}
                                                        disabled={downloadingDoc === fee.id}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        {downloadingDoc === fee.id ? (
                                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            'Download'
                                                        )}
                                                    </button>
                        </div>
                      </td>
                    </tr>
                                    ))}
            </tbody>
          </table>
        </div>
                    )}
                </>
            )}
    </div>
  );
}

export default Feepayment;