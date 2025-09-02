import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

const EventUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const [formData, setFormData] = useState({
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        event_title: "",
        event_url: "",
        author_name: "",
        category: "",
        event_date: "",
        event_img: null
    });
    const [currentImage, setCurrentImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`https://api.ec-businessschool.in/api/events/${id}`);
                const eventData = response.data;
                
                setFormData({
                    meta_title: eventData.meta_title || "",
                    meta_description: eventData.meta_description || "",
                    meta_keywords: eventData.meta_keywords || "",
                    event_title: eventData.event_title || "",
                    event_url: eventData.event_url || "",
                    author_name: eventData.author_name || "",
                    category: eventData.category || "",
                    event_date: eventData.event_date ? new Date(eventData.event_date).toISOString().split('T')[0] : "",
                });
                
                setContent(eventData.event_description || "");
                setCurrentImage(eventData.event_img || "");
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching event:', error);
                toast.error('Error loading event data');
                navigate('/events');
            }
        };

        fetchEvent();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview URL for the new image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            
            // Update form data with the new file
            setFormData(prev => ({
                ...prev,
                event_img: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = new FormData();
            
            // Append all text fields
            Object.keys(formData).forEach(key => {
                if (key !== 'event_img' && formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });
            
            // Append editor content
            data.append('event_description', content);
            
            // Append image if it exists (either new file or existing image path)
            if (formData.event_img) {
                if (formData.event_img instanceof File) {
                    data.append('event_img', formData.event_img);
                } else {
                    // If it's not a File, it's probably the existing image path
                    data.append('event_img', currentImage);
                }
            }

            // Debug: Log FormData contents
            for (let [key, value] of data.entries()) {
                console.log(key, value);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };

            const response = await axios.put(
                `https://api.ec-businessschool.in/api/events/${id}`, 
                data, 
                config
            );

            toast.success('Event updated successfully!');
            navigate('/event-list');
            
        } catch (error) {
            console.error('Error updating event:', {
                message: error.message,
                response: error.response?.data,
                request: error.request
            });
            const errorMsg = error.response?.data?.message || 'Error updating event. Please try again.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }


    return (
        <div className="container ">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-lg font-medium text-gray-800 dark:text-white">
                        Update Event
                    </h1>
                    <p className="text-gray-600 mt-1">Manage your Event content</p>
                </div>
                <Link 
                    to="/event-list" 
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Back To Event List
                </Link>
            </div>
            
            
            <section className="w-full p-6 mx-auto bg-white rounded-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Meta Information */}
                        <div>
                            <label htmlFor="meta_title" className="block text-gray-700 dark:text-gray-200 mb-1">Meta Title*</label>
                            <input 
                                id="meta_title" 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" 
                                value={formData.meta_title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="meta_description" className="block text-gray-700 dark:text-gray-200 mb-1">Meta Description*</label>
                            <input 
                                id="meta_description" 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" 
                                value={formData.meta_description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="meta_keywords" className="block text-gray-700 dark:text-gray-200 mb-1">Meta Keywords*</label>
                            <input 
                                id="meta_keywords" 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" 
                                value={formData.meta_keywords}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Event Information */}
                        <div>
                            <label htmlFor="event_title" className="block text-gray-700 dark:text-gray-200 mb-1">Event Title*</label>
                            <input 
                                id="event_title" 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" 
                                value={formData.event_title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="event_url" className="block text-gray-700 dark:text-gray-200 mb-1">Event URL*</label>
                            <input 
                                id="event_url" 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" 
                                value={formData.event_url}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="author_name" className="block text-gray-700 dark:text-gray-200 mb-1">Author Name*</label>
                            <input 
                                id="author_name" 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" 
                                value={formData.author_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-gray-700 dark:text-gray-200 mb-1">Category*</label>
                            <input 
                                id="category" 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" 
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="event_date" className="block text-gray-700 dark:text-gray-200 mb-1">Event Date*</label>
                            <input 
                                id="event_date" 
                                type="date" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" 
                                value={formData.event_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="mt-6">
                        <label className="block text-gray-700 dark:text-gray-200 mb-2">Event Image</label>
                        <div className="flex flex-col items-center w-full p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl">
                            {/* Show preview of new image if available */}
                            {previewImage ? (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-2">New Image Preview:</p>
                                    <img 
                                        src={previewImage} 
                                        alt="Preview" 
                                        className="h-24 mx-auto object-contain"
                                    />
                                </div>
                            ) : currentImage ? (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                                    <img 
                                        src={`https://api.ec-businessschool.in/uploads/${currentImage}`} 
                                        alt="Current event" 
                                        className="h-24 mx-auto object-contain"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150?text=Event+Image';
                                        }}
                                    />
                                </div>
                            ) : null}
                            
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-gray-500 dark:text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                            </svg>

                            <h2 className="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">
                                {currentImage || previewImage ? 'Change Image' : 'Upload Image'}
                            </h2>
                            <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
                                Upload or drag & drop your file SVG, PNG, JPG or GIF.
                            </p>

                            <input 
                                id="event_img"
                                name="event_img"
                                type="file" 
                                className="hidden" 
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <button
                                type="button"
                                className="mt-3 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                                onClick={() => document.getElementById('event_img').click()}
                            >
                                Select File
                            </button>
                            
                            {formData.event_img && (
                                <p className="mt-2 text-sm text-green-500">
                                    {formData.event_img instanceof File 
                                        ? `New file selected: ${formData.event_img.name}`
                                        : `Using existing image: ${currentImage}`}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="mt-6">
                        <label className="block text-gray-700 dark:text-gray-200 mb-2">Event Description*</label>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            onChange={(newContent) => setContent(newContent)}
                            config={{
                                readonly: false,
                                height: 400,
                                placeholder: "Start writing...",
                                buttons: ['bold', 'italic', 'underline', 'strikethrough', '|', 
                                         'align', 'ul', 'ol', '|', 'font', 'fontsize', '|',
                                         'image', 'video', 'table', 'link', '|', 'undo', 'redo']
                            }}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end mt-6 gap-4">
                        <button 
                            type="button"
                            onClick={() => navigate('/event-list')}
                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : 'Update Event'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default EventUpdate;