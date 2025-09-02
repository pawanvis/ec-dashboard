import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestInfo = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 10;

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async (term = "") => {
        try {
            setLoading(true);
            const response = await axios.get(`https://api.ec-businessschool.in/api/applications`, {
                params: term ? { search: term } : {}
            });
            setRequests(response.data);
        } catch (err) {
            setError("Failed to fetch requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this application?");
        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await axios.delete(`https://api.ec-businessschool.in/api/applications/${id}`);
            setRequests(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            alert("Failed to delete item.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRequests(searchTerm);
        setCurrentPage(1);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(requests.length / itemsPerPage);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
        </div>
    );

    return (
        <section className="container">
            <div className="flex items-center justify-between gap-x-3 mb-6">
                <div>
                    <h1 className="text-lg font-medium text-gray-800 dark:text-white">Request Information</h1>
                    <p className="text-gray-600 mt-1">All Request Information in one place</p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex mt-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800 mt-5">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {['Name', 'Email', 'Date', 'Phone', 'Zip', 'Status', 'Address', 'Actions'].map((header) => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {currentItems.length > 0 ? (
                                currentItems.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{request.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{request.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            {new Date(request.dateOfBirth).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{request.phone}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{request.zipCode}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${request.status === 'foreign' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{request.address}</td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(request._id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                disabled={deletingId === request._id}
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No requests found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {requests.length > itemsPerPage && (
                    <div className="flex justify-between items-center p-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                            Previous
                        </button>
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RequestInfo;
