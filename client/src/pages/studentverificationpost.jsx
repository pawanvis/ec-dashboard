import React, { useState } from "react";
import axios from "axios";

const Studentverificationpost = () => {
  const initialFormData = {
    academicPartnerCode: "",
    endorsementCode: "",
    name: "",
    fatherName: "",
    dob: "",
    gender: "",
    programApplied: "",
    specialization: "",
    session: "",
    country: "",
    motherName: "",
    image: null,
    docFile: null
  };

  const initialErrors = {
    academicPartnerCode: "",
    endorsementCode: "",
    name: "",
    fatherName: "",
    dob: "",
    gender: "",
    programApplied: "",
    specialization: "",
    session: "",
    country: "",
    motherName: "",
    image: "",
    docFile: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [apiResponse, setApiResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "academicPartnerCode":
        if (!value.trim()) error = "Academic Partner Code is required";
        else if (!/^[A-Za-z0-9]{6,12}$/.test(value)) 
          error = "Must be 6-12 alphanumeric characters";
        break;
      case "endorsementCode":
        if (!value.trim()) error = "Endorsement Code is required";
        else if (!/^[A-Za-z0-9]{6,12}$/.test(value))
          error = "Must be 6-12 alphanumeric characters";
        break;
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (!/^[A-Za-z\s]{3,50}$/.test(value))
          error = "Must be 3-50 letters only";
        break;
      case "fatherName":
        if (!value.trim()) error = "Father's name is required";
        else if (!/^[A-Za-z\s]{3,50}$/.test(value))
          error = "Must be 3-50 letters only";
        break;
      case "motherName":
        if (!value.trim()) error = "Mother's name is required";
        else if (!/^[A-Za-z\s]{3,50}$/.test(value))
          error = "Must be 3-50 letters only";
        break;
      case "dob":
        if (!value) error = "Date of birth is required";
        else {
          const dobDate = new Date(value);
          const today = new Date();
          const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
          
          if (dobDate > today) error = "Date cannot be in the future";
          else if (dobDate > minAgeDate) error = "Student must be at least 16 years old";
        }
        break;
      case "gender":
        if (!value) error = "Gender is required";
        break;
      case "programApplied":
        if (!value.trim()) error = "Program is required";
        break;
      case "specialization":
        if (!value.trim()) error = "Specialization is required";
        break;
      case "session":
        if (!value.trim()) error = "Session is required";
        else if (!/^[A-Za-z0-9\s-]{3,20}$/.test(value))
          error = "Invalid session format";
        break;
      case "country":
        if (!value.trim()) error = "Country is required";
        else if (!/^[A-Za-z\s]{3,50}$/.test(value))
          error = "Must be 3-50 letters only";
        break;
      case "image":
        if (!value) error = "Image is required";
        else if (!value.type.match(/image\/(jpeg|jpg|png|gif)/))
          error = "Only JPG, PNG or GIF images are allowed";
        else if (value.size > 2 * 1024 * 1024)
          error = "Image must be less than 2MB";
        break;
      case "docFile":
        if (!value) error = "Document is required";
        else if (value.type !== "application/pdf")
          error = "Only PDF files are allowed";
        else if (value.size > 5 * 1024 * 1024)
          error = "Document must be less than 5MB";
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    
    if (id === "image" || id === "docFile") {
      const file = files[0];
      setFormData({ ...formData, [id]: file });
      setErrors({ ...errors, [id]: validateField(id, file) });
    } else {
      setFormData({ ...formData, [id]: value });
      setErrors({ ...errors, [id]: validateField(id, value) });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const showNotification = (message, success) => {
    setPopupMessage(message);
    setIsSuccess(success);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification("Please fix all validation errors before submitting", false);
      return;
    }
    
    setIsSubmitting(true);
    setApiResponse(null);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await axios.post(
        "https://api.ec-businessschool.in/api/students",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );

      setApiResponse(response.data);
      showNotification("Student verification submitted successfully!", true);
      setFormData(initialFormData); // Clear form after successful submission
      setErrors(initialErrors);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg = error.response?.data?.message || "Failed to submit student verification. Please try again.";
      showNotification(errorMsg, false);
      setApiResponse({
        error: errorMsg
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      {/* Success/Failure Popup */}
      {showPopup && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${isSuccess ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          <div className="flex items-center">
            <span className="mr-2">
              {isSuccess ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
            <span>{popupMessage}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-x-3 mb-5">
        <div>
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Student Verification
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and verify student records
          </p>
        </div>
      </div>

      {apiResponse && !apiResponse.error && (
        <div className="mb-6 p-4 rounded-md bg-green-100 text-green-800">
          <div>
            <p className="font-bold">{apiResponse.message}</p>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-semibold">Name:</span> {apiResponse.student.name}</p>
                <p><span className="font-semibold">Father's Name:</span> {apiResponse.student.fatherName}</p>
                <p><span className="font-semibold">DOB:</span> {new Date(apiResponse.student.dob).toLocaleDateString()}</p>
                <p><span className="font-semibold">Gender:</span> {apiResponse.student.gender}</p>
              </div>
              <div>
                <p><span className="font-semibold">Program:</span> {apiResponse.student.programApplied}</p>
                <p><span className="font-semibold">Specialization:</span> {apiResponse.student.specialization}</p>
                <p><span className="font-semibold">Session:</span> {apiResponse.student.session}</p>
                <p><span className="font-semibold">Country:</span> {apiResponse.student.country}</p>
              </div>
            </div>
            <div className="mt-4">
              <p><span className="font-semibold">Academic Partner Code:</span> {apiResponse.student.academicPartnerCode}</p>
              <p><span className="font-semibold">Endorsement Code:</span> {apiResponse.student.endorsementCode}</p>
            </div>
          </div>
        </div>
      )}

      <section className="w-full p-6 mx-auto bg-white rounded-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700 md:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Academic Partner Code */}
            <div>
              <label htmlFor="academicPartnerCode" className="text-gray-700 dark:text-gray-200">Academic Partner Code*</label>
              <input 
                id="academicPartnerCode" 
                type="text" 
                className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${errors.academicPartnerCode ? 'border-red-500' : 'border-gray-200'} rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`} 
                value={formData.academicPartnerCode}
                onChange={handleChange}
              />
              {errors.academicPartnerCode && (
                <p className="mt-1 text-sm text-red-600">{errors.academicPartnerCode}</p>
              )}
            </div>

            {/* Endorsement Code */}
            <div>
              <label htmlFor="endorsementCode" className="text-gray-700 dark:text-gray-200">Endorsement Code*</label>
              <input 
                id="endorsementCode" 
                type="text" 
                className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${errors.endorsementCode ? 'border-red-500' : 'border-gray-200'} rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`} 
                value={formData.endorsementCode}
                onChange={handleChange}
              />
              {errors.endorsementCode && (
                <p className="mt-1 text-sm text-red-600">{errors.endorsementCode}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="text-gray-700 dark:text-gray-200">Name*</label>
              <input 
                id="name" 
                type="text" 
                className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`} 
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Father's Name */}
            <div>
              <label htmlFor="fatherName" className="text-gray-700 dark:text-gray-200">Father's Name*</label>
              <input 
                id="fatherName" 
                type="text" 
                className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${errors.fatherName ? 'border-red-500' : 'border-gray-200'} rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`} 
                value={formData.fatherName}
                onChange={handleChange}
              />
              {errors.fatherName && (
                <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>
              )}
            </div>

            {/* Mother's Name */}
            <div>
              <label htmlFor="motherName" className="text-gray-700 dark:text-gray-200">Mother's Name*</label>
              <input 
                id="motherName" 
                type="text" 
                className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${errors.motherName ? 'border-red-500' : 'border-gray-200'} rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`} 
                value={formData.motherName}
                onChange={handleChange}
              />
              {errors.motherName && (
                <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="text-gray-700 dark:text-gray-200">Date of Birth*</label>
              <input 
                id="dob" 
                type="date" 
                className={`block mt-2 w-full px-5 py-2.5 text-gray-700 bg-white border ${errors.dob ? 'border-red-500' : 'border-gray-200'} rounded-lg placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`} 
                value={formData.dob}
                onChange={handleChange}
              />
              {errors.dob && (
                <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="text-gray-700 dark:text-gray-200">Gender*</label>
              <select
                id="gender"
                className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${errors.gender ? 'border-red-500' : 'border-gray-200'} rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>

            {/* Program Applied */}
            <div>
              <label htmlFor="programApplied" className="text-gray-700 dark:text-gray-200">Program Applied*</label>
              <input 
                id="programApplied" 
                type="text" 
                className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${errors.programApplied ? 'border-red-500' : 'border-gray-200'} rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`} 
                value={formData.programApplied}
                onChange={handleChange}
              />
              {errors.programApplied && (
                <p className="mt-1 text-sm text-red-600">{errors.programApplied}</p>
              )}
            </div>

            {/* Specialization */}
            <div>
              <label htmlFor="specialization" className="text-gray-700 dark:text-gray-200">Specialization*</label>
              <input 
                id="specialization" 
                type="text" 
                className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${errors.specialization ? 'border-red-500' : 'border-gray-200'} rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`} 
                value={formData.specialization}
                onChange={handleChange}
              />
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
              )}
            </div>

            {/* Session */}
            <div>
              <label htmlFor="session" className="text-gray-700 dark:text-gray-200">Session*</label>
              <input 
                id="session" 
                type="text" 
                className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${errors.session ? 'border-red-500' : 'border-gray-200'} rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`} 
                value={formData.session}
                onChange={handleChange}
              />
              {errors.session && (
                <p className="mt-1 text-sm text-red-600">{errors.session}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="text-gray-700 dark:text-gray-200">Country*</label>
              <input 
                id="country" 
                type="text" 
                className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${errors.country ? 'border-red-500' : 'border-gray-200'} rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`} 
                value={formData.country}
                onChange={handleChange}
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            {/* Document File */}
            <div>
              <label htmlFor="docFile" className="text-gray-700 dark:text-gray-200">Upload Document (PDF)*</label>
              <input 
                id="docFile" 
                type="file" 
                className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${errors.docFile ? 'border-red-500' : 'border-gray-200'} rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300`}
                accept=".pdf"
                onChange={handleChange}
              />
              {errors.docFile && (
                <p className="mt-1 text-sm text-red-600">{errors.docFile}</p>
              )}
              {formData.docFile && !errors.docFile && (
                <p className="mt-1 text-sm text-green-600">Document selected: {formData.docFile.name}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label htmlFor="image" className="text-gray-700 dark:text-gray-200">Upload Image*</label>
              <label htmlFor="image" className={`flex flex-col items-center w-full p-5 mx-auto mt-2 text-center bg-white border-2 ${errors.image ? 'border-red-500' : 'border-gray-300'} border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-gray-500 dark:text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                <h2 className="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">
                  {formData.image ? formData.image.name : "Upload Image File"}
                </h2>
                <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
                  {formData.image ? "File selected" : "Upload or drag & drop your file SVG, PNG, JPG or GIF."}
                </p>
                <input 
                  id="image" 
                  type="file" 
                  className="hidden" 
                  onChange={handleChange}
                  accept="image/*"
                />
              </label>
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
            </div>

          </div>

          <div className="flex justify-end mt-6">
            <button 
              type="submit" 
              className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Now"}
            </button>
          </div>
        </form>
      </section>
    </React.Fragment>
  );
};

export default Studentverificationpost;