import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

const AdmissionsEnquire = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingId, setDeletingId] = useState(null);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://api.ec-businessschool.in/api/counselling');
            setEnquiries(response.data); // assuming data is an array
        } catch (error) {
            console.error('Error fetching enquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this enquiry?");
        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await axios.delete(`https://api.ec-businessschool.in/api/counselling/${id}`);
            // Remove deleted enquiry from state without re-fetching all
            setEnquiries((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Error deleting enquiry:", error);
            alert("Failed to delete enquiry");
        } finally {
            setDeletingId(null);
        }
    };

    const totalPages = Math.ceil(enquiries.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = enquiries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((currentPage) => currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((currentPage) => currentPage + 1);
    };

    const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
    };

    return (
        <React.Fragment>
            <div>
                <h1 className="text-lg font-medium text-gray-800 dark:text-white ">Admissions Enquiries</h1>
                <p className="text-gray-600 mt-1">All Admissions Enquiries in one place</p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md mt-5">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Country Code</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Phone</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Agreed Terms</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center px-4 py-6 text-gray-500 dark:text-gray-300">
                                    Loading...
                                </td>
                            </tr>
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map((enquiry, index) => (
                                <tr key={enquiry._id || index}>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-white">{enquiry.name}</td>
                                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{enquiry.email}</td>
                                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{enquiry.phoneCode}</td>
                                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{enquiry.phone}</td>
                                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{enquiry.agreedToTerms ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        <button
                                            onClick={() => handleDelete(enquiry._id)}
                                            disabled={deletingId === enquiry._id}
                                            className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300`}
                                        >
                                            {/* {deletingId === enquiry._id ? 'Deleting...' : 'Delete'} */}
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center px-4 py-6 text-gray-500 dark:text-gray-300">
                                    No enquiries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm font-medium rounded-md border ${currentPage === 1
                        ? 'text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
                        }`}
                >
                    Previous
                </button>

                <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageClick(i + 1)}
                            className={`px-3 py-1 text-sm rounded-md ${currentPage === i + 1
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm font-medium rounded-md border ${currentPage === totalPages
                        ? 'text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
                        }`}
                >
                    Next
                </button>
            </div>
        </React.Fragment>
    );
};

export default AdmissionsEnquire;
