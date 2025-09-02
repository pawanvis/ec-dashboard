import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ApplyNow = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const navigate = useNavigate();

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        
        const response = await axios.get(
          `https://api.ec-businessschool.in/api/forms?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Handle the new API response format
        const apps = response.data.items || response.data.data || [];
        const pages = response.data.totalPages || 1;
        
        if (!Array.isArray(apps)) {
          throw new Error('Invalid data format received from API');
        }

        setApplications(apps);
        setTotalPages(pages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.message || 'Failed to fetch applications');
        }
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentPage, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper function to map new API data to the expected structure
  const mapApplicationData = (app) => {
    return {
      _id: app._id,
      firstName: app.firstName,
      lastName: app.lastName,
      email: app.email,
      phone: app.phone,
      dateOfBirth: app.dob,
      gender: app.gender,
      country: app.country,
      fatherName: app.fatherName,
      motherName: app.motherName,
      maritalStatus: app.maritalStatus,
      highestQualification: app.highestQualifications,
      address: {
        line1: app.addressLine1,
        line2: app.addressLine2,
        city: app.city,
        state: app.state
      },
      educationDetails: app.education_type ? [{
        institution: '', // Not available in new API
        degree: app.highestQualifications,
        fieldOfStudy: app.education_type,
        documents: app.education_documents ? app.education_documents.map(doc => ({
          type: 'Education Document',
          filePath: doc.path
        })) : []
      }] : [],
      statementOfPurpose: app.purpose_documents && app.purpose_documents.length > 0 ? {
        title: app.purpose_type || 'Statement of Purpose',
        filePath: app.purpose_documents[0].path
      } : null,
      employmentDocuments: app.employment_documents ? app.employment_documents.map(doc => ({
        type: app.employment_type || 'Employment Document',
        filePath: doc.path
      })) : [],
      identificationDocuments: app.identification_documents ? app.identification_documents.map(doc => ({
        type: app.identification_type || 'Identification Document',
        filePath: doc.path
      })) : [],
      awards: app.awards_documents ? app.awards_documents.map(doc => ({
        title: app.awards_type || 'Award',
        filePath: doc.path
      })) : [],
      resumeDocuments: app.resume_documents || [],
      createdAt: app.createdAt,
      status: 'Applications' // Default status as it's not provided in the new API
    };
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading applications...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Applications</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
  
  if (!applications || applications.length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-100">
          <div className="bg-white dark:bg-gray-800 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-white">No applications found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              There are currently no candidate applications to display.
            </p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className=" from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ">
      <div className="mx-auto">

        <div className="flex items-center gap-x-3 mb-5">
          <div>
            <h1 className="text-lg font-medium text-gray-800 dark:text-white">
               Candidate Applications
            </h1>
            <p className="text-gray-600 mt-1">Candidate Applications Enquire for Website </p>
          </div>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => {
            const mappedApp = mapApplicationData(app);
            return (
              <div 
                key={mappedApp._id}
                className="bg-white dark:bg-gray-800 shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                onClick={() => setSelectedApp(mappedApp)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {mappedApp.firstName} {mappedApp.lastName}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                      ${mappedApp.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        mappedApp.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'} shadow-sm`}>
                      {mappedApp.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{mappedApp.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{mappedApp.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {new Date(mappedApp.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Highest Qualification</p>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{mappedApp.highestQualification}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Applied On</p>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {new Date(mappedApp.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Application Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 hover:scale-100">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Application Details
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">ID: {selectedApp._id}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-5">
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Information
                      </h4>
                      <DetailItem label="Full Name" value={`${selectedApp.firstName} ${selectedApp.lastName}`} />
                      <DetailItem label="Email" value={selectedApp.email} />
                      <DetailItem label="Phone" value={selectedApp.phone} />
                      <DetailItem label="Date of Birth" value={new Date(selectedApp.dateOfBirth).toLocaleDateString()} />
                      <DetailItem label="Gender" value={selectedApp.gender} />
                      <DetailItem label="Country" value={selectedApp.country} />
                      <DetailItem label="Father's Name" value={selectedApp.fatherName} />
                      <DetailItem label="Mother's Name" value={selectedApp.motherName} />
                      <DetailItem label="Marital Status" value={selectedApp.maritalStatus} />
                    </div>

                    {/* Address */}
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Address
                      </h4>
                      <DetailItem label="Line 1" value={selectedApp.address?.line1} />
                      <DetailItem label="Line 2" value={selectedApp.address?.line2} />
                      <DetailItem label="City" value={selectedApp.address?.city} />
                      <DetailItem label="State" value={selectedApp.address?.state} />
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-5">
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                        Education
                      </h4>
                      <DetailItem label="Highest Qualification" value={selectedApp.highestQualification} />
                      {selectedApp.educationDetails?.map((edu, index) => (
                        <div key={index} className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <DetailItem label="Field of Study" value={edu.fieldOfStudy} />
                          <DetailItem label="Degree" value={edu.degree} />
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Education Documents</p>
                            {edu.documents?.map((doc, docIndex) => (
                              <DocumentLink key={docIndex} type={doc.type} path={doc.filePath} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Documents
                    </h4>
                    <DetailItem label="Statement of Purpose" value={selectedApp.statementOfPurpose?.title} isLink={selectedApp.statementOfPurpose?.filePath} />
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Employment Documents
                      </p>
                      {selectedApp.employmentDocuments?.map((doc, index) => (
                        <DocumentLink key={index} type={doc.type} path={doc.filePath} />
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Identification Documents
                      </p>
                      {selectedApp.identificationDocuments?.map((doc, index) => (
                        <DocumentLink key={index} type={doc.type} path={doc.filePath} />
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Awards
                      </p>
                      {selectedApp.awards?.map((award, index) => (
                        <DocumentLink key={index} type={award.title} path={award.filePath} />
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Resume
                      </p>
                      {selectedApp.resumeDocuments?.map((doc, index) => (
                        <DocumentLink key={index} type="Resume" path={doc.path} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-12">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize transition-colors duration-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg gap-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Previous</span>
          </button>

          <div className="items-center hidden lg:flex gap-x-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 text-sm rounded-lg ${currentPage === page 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize transition-colors duration-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg gap-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

// Helper component for detail items
const DetailItem = ({ label, value, isLink, icon }) => {
  if (!value) return null;
  
  return (
    <div className="mb-3">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </p>
      {isLink ? (
        <a 
          href={`https://api.ec-businessschool.in${value}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Document
        </a>
      ) : (
        <p className="text-gray-700 dark:text-gray-300 font-medium">{value}</p>
      )}
    </div>
  );
};

// Helper component for document links
const DocumentLink = ({ type, path }) => {
  if (!path) return null;
  
  return (
    <div className="flex items-center mb-2">
      <span className="text-gray-700 dark:text-gray-300 text-sm mr-2">{type}:</span>
      <a 
        href={`https://api.ec-businessschool.in${path}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        View
      </a>
    </div>
  );
};

export default ApplyNow;