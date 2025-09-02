import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentVerificationList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

  // Fetch Students
  const fetchStudents = async () => {
    try {
        setLoading(true);
        const res = await axios.get("https://api.ec-businessschool.in/api/students");
        // ✅ Directly set the array
        setStudents(res.data || []);
    } catch (error) {
        console.error("Error fetching students", error);
    } finally {
        setLoading(false);
    }
   };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Delete Student
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://api.ec-businessschool.in/api/students/${id}`);
      alert("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student", error);
      alert("Failed to delete student");
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.endorsementCode.toLowerCase().includes(searchLower) ||
      student.academicPartnerCode.toLowerCase().includes(searchLower) ||
      student.fatherName.toLowerCase().includes(searchLower)
    );
  });

  // Toggle card expansion
  const toggleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Handle edit button click
  const handleEditClick = (id) => {
    navigate(`/student-verification-update/${id}`);
  };

  return (
    <section className="container mx-auto ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Student Verification
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and verify student records
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search students..."
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div 
              key={student._id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 ${expandedCard === student._id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}`}
            >
              <div className="p-5">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 relative">
                    <img
                      className="h-14 w-14 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm"
                      src={`https://api.ec-businessschool.in/${student.image.replace(/\\/g, '/')}`}
                      alt={student.name}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://ui-avatars.com/api/?name='+encodeURIComponent(student.name)+'&background=random';
                      }}
                    />
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.programApplied}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {student.academicPartnerCode}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {student.endorsementCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Father's Name</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {student.fatherName || 'N/A'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(student._id);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                      title="Edit"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStudent(student._id);
                      }}
                      className="p-2 text-red-600 hover:text-red-800 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                      title="Delete"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandCard(student._id);
                      }}
                      className="p-2 text-gray-600 hover:text-gray-800 dark:hover:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={expandedCard === student._id ? "Collapse" : "Expand"}
                    >
                      <svg 
                        className={`h-5 w-5 transform transition-transform ${expandedCard === student._id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {expandedCard === student._id && (
                <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50 dark:bg-gray-700/30">
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'} />
                    <DetailItem label="Country" value={student.country || 'N/A'} />
                    <DetailItem label="Specialization" value={student.specialization || 'N/A'} />
                    <DetailItem label="Session" value={student.session || 'N/A'} />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Documents
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <DocumentButton 
                        url={`https://api.ec-businessschool.in/${student.docFile}`} 
                        label="View Document"
                      />
                      <DocumentButton 
                        url={`https://api.ec-businessschool.in/${student.image}`} 
                        label="View Photo"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
          <div className="mx-auto max-w-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">
              {searchTerm ? "No matching students found" : "No students available"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? "Try adjusting your search query" : "Get started by adding a new student"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

// Reusable component for detail items
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value}</p>
  </div>
);

// Reusable component for document buttons
const DocumentButton = ({ url, label }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
  >
    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    {label}
  </a>
);

export default StudentVerificationList;