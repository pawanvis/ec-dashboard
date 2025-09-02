import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courseenquire = () => {
  const [brochureRequests, setBrochureRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBrochureRequests = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.ec-businessschool.in/api/brochure', {
        params: { page, limit: 10, search }
      });
      setBrochureRequests(response.data.data);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching brochure requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrochureRequests();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBrochureRequests(1, searchTerm);
  };

  const handlePageChange = (page) => {
    fetchBrochureRequests(page, searchTerm);
  };

  // 🆕 Delete function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`https://api.ec-businessschool.in/api/brochure/${id}`);
      setBrochureRequests(prev => prev.filter(item => item._id !== id)); // remove from UI
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
      console.error('Delete error:', err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <React.Fragment>
      <section className="container">
        <div className="flex items-center justify-between gap-x-3 mb-6">
          <div>
              <h1 className="text-lg font-medium text-gray-800 dark:text-white ">Brochure Requests</h1>
              <p className="text-gray-600 mt-1">All Brochure Requests in one place</p>
          </div>
          <form onSubmit={handleSearch} className="flex">
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

        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">Full Name</th>
                      <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">Email</th>
                      <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">Phone</th>
                      <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">Course Interest</th>
                      <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">Agreed to Updates</th>
                      <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">Date</th>
                      <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">Actions</th> {/* 🆕 */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {brochureRequests.map((request) => (
                      <tr key={request._id}>
                        <td className="px-4 py-4 text-sm text-gray-500">{request.fullName}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{request.email}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{request.phone}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{request.courseInterest}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{request.agreeToUpdates ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          <button
                            onClick={() => handleDelete(request._id)}
                            className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-5 py-2 text-sm text-gray-700 bg-white border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <div className="items-center hidden lg:flex gap-x-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-2 py-1 text-sm rounded-md ${
                  currentPage === page
                    ? 'text-blue-500 bg-blue-100'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-5 py-2 text-sm text-gray-700 bg-white border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Courseenquire;
