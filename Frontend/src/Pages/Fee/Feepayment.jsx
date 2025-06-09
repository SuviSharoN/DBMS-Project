// src/Pages/Fee/Feepayment.jsx
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
        // Get user role from localStorage
        const role = localStorage.getItem('userRole');
        setUserRole(role);

        // If admin, fetch list of students
        if (role === 'Admin') {
            fetchStudents();
        } else {
            // If student, fetch their fees
            fetchFees();
        }
    }, []);

    // Effect to fetch fees when admin selects a student
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
            setLoading(false); // Set loading to false after fetching students
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

            // Create a blob URL and trigger download
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
            
            // Refresh the fees list
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
            
            // Refresh the fees list
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
            
            // Refresh the fees list
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

    // Filter and sort fees
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

            {/* Admin Controls */}
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {clearingFees ? 'Clearing...' : 'Clear Fees'}
                            </button>
                            <button
                                onClick={addSampleFees}
                                disabled={addingSampleFees || !selectedStudentId || loadingStudents}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                {addingSampleFees ? 'Adding Sample Fees...' : 'Add Sample Fees'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                    <button 
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setError(null)}
                    >
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                        </svg>
                    </button>
                </div>
            )}

            {/* Only show fees table if student is logged in or admin has selected a student */}
            {(userRole === 'Student' || (userRole === 'Admin' && selectedStudentId)) && (
                <>
                    {/* Controls: Search, Filter, Sort */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
                        {/* Search */}
                        <div className="relative flex-grow w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search by Description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none text-sm shadow-sm"
                            />
                        </div>
                        {/* Filter Status */}
                        <div className="relative w-full md:w-auto">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none text-sm bg-white shadow-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                            </select>
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
                        </div>
                        {/* Sort Options */}
                        <div className="relative w-full md:w-auto">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none text-sm bg-white shadow-sm"
                            >
                                <option value="date-desc">Sort: Date (Newest)</option>
                                <option value="date-asc">Sort: Date (Oldest)</option>
                                <option value="amount-desc">Sort: Amount (High-Low)</option>
                                <option value="amount-asc">Sort: Amount (Low-High)</option>
                            </select>
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
                        </div>
                    </div>

                    {/* Fees Display (Table) */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] border-collapse text-sm">
                                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-3 text-left font-semibold">Description</th>
                                        <th className="p-3 text-right font-semibold">Amount</th>
                                        <th className="p-3 text-center font-semibold">Due Date</th>
                                        <th className="p-3 text-center font-semibold">Status</th>
                                        <th className="p-3 text-center font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {displayFees.length > 0 ? (
                                        displayFees.map((fee) => (
                                            <tr key={fee.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                                                <td className="p-3 text-left font-medium text-gray-800">{fee.description}</td>
                                                <td className="p-3 text-right text-gray-700">{formatCurrency(fee.amount)}</td>
                                                <td className="p-3 text-center text-gray-600">
                                                    {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        fee.status === 'Paid' 
                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                    }`}>
                                                        {fee.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleDownloadDocument(fee.id)}
                                                            disabled={downloadingDoc === fee.id}
                                                            className="px-3 py-1 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition duration-150 shadow-sm flex items-center justify-center gap-1"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                            <span>{downloadingDoc === fee.id ? 'Downloading...' : 'Document'}</span>
                                                        </button>
                                                        {fee.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handlePayNow(fee.id)}
                                                                disabled={processingPayment === fee.id}
                                                                className="px-3 py-1 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition duration-150 shadow-sm flex items-center justify-center gap-1"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span>{processingPayment === fee.id ? 'Processing...' : 'Pay Now'}</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center p-10 text-gray-500">
                                                No fees match your current filter/search criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Show message for admin when no student is selected */}
            {userRole === 'Admin' && !selectedStudentId && !loadingStudents && (
                <div className="text-center p-8 text-gray-500">
                    Please select a student to view their fees
                </div>
            )}
        </div>
    );
}

export default Feepayment;