import React, { useState } from "react";
import axios from "axios";

const AcademicPartnersPost = () => {
  const [formData, setFormData] = useState({
    apCode: "",
    apName: "",
    apNo: "",
    instituteType: "",
    contactPerson: "",
    contactNumber: "",
    country: "",
    state: "",
    address: "",
    website: "",
    email: "",
    workPermitArea: "",
    images: null
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      images: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await axios.post("https://api.ec-businessschool.in/api/partners", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage({ text: response.data.message, type: "success" });
      // Reset form after successful submission
      setFormData({
        apCode: "",
        apName: "",
        apNo: "",
        instituteType: "",
        contactPerson: "",
        contactNumber: "",
        country: "",
        state: "",
        address: "",
        website: "",
        email: "",
        workPermitArea: "",
        images: null
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to submit form",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="flex items-center gap-x-3 mb-5">
        <div>
            <h1 className="text-lg font-medium text-gray-800 dark:text-white">Academic Partners</h1>
            <p className="text-gray-600 mt-1">Post the Academic Partners in one place</p>
        </div>
      </div>
      <section className="w-full p-6 mx-auto bg-white rounded-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700 md:rounded-lg">
        {message.text && (
          <div className={`mb-4 p-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="apCode" className="text-gray-700 dark:text-gray-200">Academic Partner Code</label>
              <input 
                id="apCode" 
                type="text" 
                value={formData.apCode}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>

            <div>
              <label htmlFor="apName" className="text-gray-700 dark:text-gray-200">Academic Partner Name</label>
              <input 
                id="apName" 
                type="text" 
                value={formData.apName}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>

            <div>
              <label htmlFor="apNo" className="text-gray-700 dark:text-gray-200">Academic Partner No</label>
              <input 
                id="apNo" 
                type="text" 
                value={formData.apNo}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>

            <div>
              <label htmlFor="instituteType" className="text-gray-700 dark:text-gray-200">Institute Type</label>
              <input 
                id="instituteType" 
                type="text" 
                value={formData.instituteType}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>

            <div>
              <label htmlFor="contactPerson" className="text-gray-700 dark:text-gray-200">Contact Person</label>
              <input 
                id="contactPerson" 
                type="text" 
                value={formData.contactPerson}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="text-gray-700 dark:text-gray-200">Contact Number</label>
              <input 
                id="contactNumber" 
                type="text" 
                value={formData.contactNumber}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>

            <div>
              <label htmlFor="country" className="text-gray-700 dark:text-gray-200">Country</label>
              <input 
                id="country" 
                type="text" 
                value={formData.country}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="text-gray-700 dark:text-gray-200">State</label>
              <input 
                id="state" 
                type="text" 
                value={formData.state}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="text-gray-700 dark:text-gray-200">Address</label>
              <input 
                id="address" 
                type="text" 
                value={formData.address}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>
            
            <div>
              <label htmlFor="website" className="text-gray-700 dark:text-gray-200">Website</label>
              <input 
                id="website" 
                type="text" 
                value={formData.website}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</label>
              <input 
                id="email" 
                type="email" 
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>

            <div>
              <label htmlFor="workPermitArea" className="text-gray-700 dark:text-gray-200">Work Permit Area</label>
              <input 
                id="workPermitArea" 
                type="text" 
                value={formData.workPermitArea}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
            <div>
              <label htmlFor="images" className="text-gray-700 dark:text-gray-200">Upload Image</label>
              <label htmlFor="dropzone-file" className="flex flex-col items-center w-full p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-gray-500 dark:text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>

                <h2 className="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">
                  {formData.images ? formData.images.name : "Upload Image File"}
                </h2>

                <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">Upload or drag & drop your file SVG, PNG, JPG or GIF.</p>

                <input 
                  id="dropzone-file" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button 
              type="submit" 
              className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Now"}
            </button>
          </div>
        </form>
      </section>
    </React.Fragment>
  );
};

export default AcademicPartnersPost;