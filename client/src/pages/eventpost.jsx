import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import axios from 'axios';

const Eventpost = () => {
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
        event_description: "",
        event_img: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                event_img: e.target.files[0]
            }));
        };

        const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = new FormData();
            
            // ✅ सही keys backend के अनुसार
            data.append('meta_title', formData.meta_title);
            data.append('meta_description', formData.meta_description);
            data.append('meta_keywords', formData.meta_keywords);
            data.append('event_title', formData.event_title);
            data.append('event_url', formData.event_url);
            data.append('author_name', formData.author_name);
            data.append('category', formData.category);
            data.append('event_date', formData.event_date);
            data.append('event_description', content);

            if (formData.event_img) {
                data.append('event_img', formData.event_img);
            }

            const response = await axios.post(
                'https://api.ec-businessschool.in/api/events',
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            console.log('Event created successfully:', response.data);
            alert('Event created successfully!');
            
            // Reset form
            setFormData({
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
            setContent("");
        } catch (error) {
            console.error('Error creating event:', error.response?.data || error.message);
            alert(`Error creating event: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <React.Fragment>
            <div className="flex items-center gap-x-3 mb-5">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">Event Post</h2>
            </div>
            <section className="w-full p-6 mx-auto bg-white rounded-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="meta_title" className="text-gray-700 dark:text-gray-200">Meta Title</label>
                            <input 
                                id="meta_title" 
                                type="text" 
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                                value={formData.meta_title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="meta_description" className="text-gray-700 dark:text-gray-200">Meta Description</label>
                            <input 
                                id="meta_description" 
                                type="text" 
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                                value={formData.meta_description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="meta_keywords" className="text-gray-700 dark:text-gray-200">Meta Keywords</label>
                            <input 
                                id="meta_keywords" 
                                type="text" 
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                                value={formData.meta_keywords}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="event_title" className="text-gray-700 dark:text-gray-200">Event Title</label>
                            <input 
                                id="event_title" 
                                type="text" 
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                                value={formData.event_title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="event_url" className="text-gray-700 dark:text-gray-200">Event URL</label>
                            <input 
                                id="event_url" 
                                type="text" 
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                                value={formData.event_url}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="author_name" className="text-gray-700 dark:text-gray-200">Author Name</label>
                            <input 
                                id="author_name" 
                                type="text" 
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                                value={formData.author_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="text-gray-700 dark:text-gray-200">Category</label>
                            <input 
                                id="category" 
                                type="text" 
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="event_date" className="text-gray-700 dark:text-gray-200">Event Date</label>
                            <input 
                                id="event_date" 
                                type="date" 
                                className="block mt-2 w-full px-5 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" 
                                value={formData.event_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
                        <div>
                            <label htmlFor="event_img" className="text-gray-700 dark:text-gray-200">Upload Image</label>
                            <label htmlFor="dropzone-file" className="flex flex-col items-center w-full p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-gray-500 dark:text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                </svg>

                                <h2 className="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">Upload Image File</h2>

                                <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">Upload or drag & drop your file SVG, PNG, JPG or GIF.</p>

                                <input 
                                    id="dropzone-file" 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                {formData.event_img && (
                                    <p className="mt-2 text-sm text-green-500">File selected: {formData.event_img.name}</p>
                                )}
                            </label>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="event_description" className="text-gray-700 dark:text-gray-200 mb-2">Event Description</label>
                            <JoditEditor
                                ref={editor}
                                value={content}
                                onChange={(newContent) => setContent(newContent)}
                                config={{
                                    readonly: false,
                                    height: 400,
                                    placeholder: "Start writing...",
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button 
                            type="submit" 
                            className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Now'}
                        </button>
                    </div>
                </form>
            </section>
        </React.Fragment>
    );
};

export default Eventpost;