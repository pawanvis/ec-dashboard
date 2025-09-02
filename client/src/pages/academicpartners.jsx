import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Transition } from '@headlessui/react';

const EditPartnerModal = ({ partner, onCancel, onSave }) => {
    const [formData, setFormData] = useState({
        apCode: partner?.apCode || '',
        apName: partner?.apName || '',
        instituteType: partner?.instituteType || '',
        contactPerson: partner?.contactPerson || '',
        contactNumber: partner?.contactNumber || '',
        country: partner?.country || '',
        state: partner?.state || '',
        address: partner?.address || '',
        website: partner?.website || '',
        email: partner?.email || '',
        workPermitArea: partner?.workPermitArea || ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        partner?.images?.[0] ? `https://api.ec-businessschool.in/${partner.images[0]}` : null
    );
    const [uploading, setUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            const formDataToSend = new FormData();
            
            // Append all form fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            // Append image if exists
            if (imageFile) {
                formDataToSend.append('images', imageFile);
                setUploading(true);
            }

            const response = await axios.put(
                `https://api.ec-businessschool.in/api/partners/${partner._id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                onSave();
            } else {
                throw new Error(response.data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert(error.response?.data?.error || error.message || 'Failed to update partner');
        } finally {
            setIsSaving(false);
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-start p-4">
            <Transition
                show={true}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Edit Academic Partner</h2>
                            <p className="text-sm text-gray-500">Update partner details below</p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                            aria-label="Close"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Logo Section */}
                            <div className="lg:col-span-1">
                                <div className="space-y-4 sticky top-6">
                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                                        {imagePreview ? (
                                            <img 
                                                src={imagePreview} 
                                                alt="Partner Logo" 
                                                className="w-full h-full object-cover p-4"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400 p-8">
                                                <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm mt-2 text-center">Upload institution logo</span>
                                            </div>
                                        )}
                                    </div>
                                    <label className="block w-full">
                                        <span className="sr-only">Choose logo</span>
                                        <div className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-500 transition-all">
                                            <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            {imageFile ? imageFile.name : 'Select Image'}
                                        </div>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            name="images"
                                        />
                                    </label>
                                    {uploading && (
                                        <div className="flex items-center text-sm text-blue-600">
                                            <svg className="animate-spin mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Uploading...
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Form Fields */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField name="apCode" label="AP Code" value={formData.apCode} onChange={handleChange} required />
                                    <SelectField name="instituteType" label="Institute Type" value={formData.instituteType} onChange={handleChange} options={["University", "College", "School", "Training Center"]} />
                                    <InputField name="contactPerson" label="Contact Person" value={formData.contactPerson} onChange={handleChange} required />
                                    <InputField name="contactNumber" label="Contact Number" value={formData.contactNumber} onChange={handleChange} type="tel" required />
                                    <InputField name="email" label="Email" value={formData.email} onChange={handleChange} type="email" required />
                                    <SelectField name="country" label="Country" value={formData.country} onChange={handleChange} required options={["India", "USA", "UK", "Canada", "Australia"]} />
                                    <InputField name="state" label="State/Region" value={formData.state} onChange={handleChange} required />
                                    <InputField name="website" label="Website" value={formData.website} onChange={handleChange} placeholder="example.com" />
                                    <InputField name="workPermitArea" label="Work Permit Area" value={formData.workPermitArea} onChange={handleChange} />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`px-5 py-2.5 rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                                    isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </Transition>
        </div>
    );
};

const InputField = ({ label, name, value, onChange, type = "text", required, placeholder }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500"> *</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder={placeholder}
            required={required}
        />
    </div>
);

const SelectField = ({ label, name, value, onChange, options, required }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500"> *</span>}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required={required}
        >
            <option value="">Select an option</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

const AcademicPartners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPartner, setEditingPartner] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const response = await axios.get('https://api.ec-businessschool.in/api/partners');
            setPartners(response.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching partners:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this partner? This action cannot be undone.')) {
            try {
                await axios.delete(`https://api.ec-businessschool.in/api/partners/${id}`);
                fetchPartners();
            } catch (error) {
                console.error('Error deleting partner:', error);
                alert('Failed to delete partner. Please try again.');
            }
        }
    };

    const filteredPartners = partners.filter(partner => 
        partner.apCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.apName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="">
            <div className="">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-lg font-medium text-gray-800 dark:text-white">Academic Partners</h1>
                        <p className="text-gray-600 mt-1">Manage all institutional partnerships in one place</p>
                    </div>
                    
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search partners..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {filteredPartners.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {filteredPartners.map((partner) => (
                                <div key={partner._id} className="p-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex-shrink-0">
                                            {partner.images?.[0] ? (
                                                <img 
                                                    className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                                                    src={`https://api.ec-businessschool.in/${partner.images[0]}`} 
                                                    alt="Partner Logo"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {partner.apName || partner.apCode}
                                                </h3>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {partner.apCode}
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {partner.contactPerson}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {partner.contactNumber}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <a href={`mailto:${partner.email}`} className="text-blue-600 hover:underline">
                                                        {partner.email}
                                                    </a>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {partner.state}, {partner.country}
                                            </div>
                                        </div>
                                        
                                        <div className="flex-shrink-0 flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingPartner(partner)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                aria-label="Edit"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(partner._id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                aria-label="Delete"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No partners found</h3>
                            <p className="mt-1 text-gray-500">
                                {searchTerm ? 
                                    "No partners match your search criteria. Try a different search term." : 
                                    "There are currently no academic partners in the system."
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {editingPartner && (
                <EditPartnerModal 
                    partner={editingPartner} 
                    onCancel={() => setEditingPartner(null)} 
                    onSave={() => {
                        setEditingPartner(null);
                        fetchPartners();
                    }} 
                />
            )}
        </div>
    );
};

export default AcademicPartners;