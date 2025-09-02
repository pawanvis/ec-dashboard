import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const BlogList = () => {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('https://api.ec-businessschool.in/api/blogs')
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs')
                }
                const data = await response.json()
                setBlogs(data)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchBlogs()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return
        
        setDeletingId(id)
        try {
            const response = await fetch(`https://api.ec-businessschool.in/api/blogs/${id}`, {
                method: 'DELETE'
            })
            
            if (!response.ok) {
                throw new Error('Failed to delete blog')
            }
            
            setBlogs(blogs.filter(blog => blog._id !== id))
        } catch (err) {
            alert(err.message)
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Error: </strong> {error}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto ">
            {/* Header with Add New button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-lg font-medium text-gray-800 dark:text-white">
                        Blog Posts
                    </h1>
                    <p className="text-gray-600 mt-1">Manage your blog content</p>
                </div>
                <Link 
                    to="/blog-post" 
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Blog
                </Link>
            </div>

            {/* Blog Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <div key={blog._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.02]">
                        {/* Blog Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img 
                                src={`https://api.ec-businessschool.in/uploads/${blog.blog_img}`} 
                                alt={blog.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x225?text=Blog+Image'
                                }}
                            />
                            {/* Action Buttons */}
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <Link 
                                    to={`/blog-edit/${blog._id}`}
                                    className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-blue-600 transition-colors shadow-sm"
                                    title="Edit"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </Link>
                                
                                <button 
                                    onClick={() => handleDelete(blog._id)}
                                    disabled={deletingId === blog._id}
                                    className={`p-2 bg-white/90 rounded-full ${deletingId === blog._id ? 'text-gray-400' : 'text-gray-700 hover:text-red-600'} transition-colors shadow-sm`}
                                    title="Delete"
                                >
                                    {deletingId === blog._id ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-800">
                                    {blog.category}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {blog.blog_date}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                                {blog.title}
                            </h3>
                            
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                {blog.blog_description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    By {blog.author_name}
                                </span>
                                
                                <Link 
                                    to={`/blog/${blog.blog_url}`} 
                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                                >
                                    Read More
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {blogs.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing 1 to {blogs.length} of {blogs.length} entries
                    </div>
                </div>
            )}

            {blogs.length === 0 && !loading && (
                <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No blogs found</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating a new blog post.</p>
                    <div className="mt-6">
                        <Link
                            to="/blog-post"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Blog Post
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BlogList