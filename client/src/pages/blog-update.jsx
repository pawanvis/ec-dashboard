import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";

const BlogUpdate = () => {
    const editor = useRef(null);
    const [content, setContent] = useState("");

  return (
    <React.Fragment>
        <div className="flex items-center gap-x-3 mb-5">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Blog Update</h2>
        </div>
        <section className="w-full p-6 mx-auto bg-white rounded-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700 md:rounded-lg">
        <form>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <label htmlFor="metaTitle" className="text-gray-700 dark:text-gray-200">Meta Title</label>
                <input id="metaTitle" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" />
            </div>

            <div>
                <label htmlFor="metaDescription" className="text-gray-700 dark:text-gray-200">Meta Description</label>
                <input id="metaDescription" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" />
            </div>

            <div>
                <label htmlFor="metaKeywords" className="text-gray-700 dark:text-gray-200">Meta Keywords</label>
                <input id="metaKeywords" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" />
            </div>

            <div>
                <label htmlFor="blogTitle" className="text-gray-700 dark:text-gray-200">Blog Title</label>
                <input id="blogTitle" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" />
            </div>

            <div>
                <label htmlFor="blogUrl" className="text-gray-700 dark:text-gray-200">Blog URL</label>
                <input id="blogUrl" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" />
            </div>

            <div>
                <label htmlFor="author" className="text-gray-700 dark:text-gray-200">Author Name</label>
                <input id="author" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" />
            </div>

            <div>
                <label htmlFor="category" className="text-gray-700 dark:text-gray-200">Category</label>
                <input id="category" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" />
            </div>

            <div>
                <label htmlFor="blogDate" className="text-gray-700 dark:text-gray-200">Blog Date</label>
                <input id="blogDate" type="date" className="block mt-2 w-full px-5 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 dark:focus:border-blue-300" />
            </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
                <div>
                    <label for="file" className="text-gray-700 dark:text-gray-200 ">Upload Image</label>
                    <label for="dropzone-file" className="flex flex-col items-center w-full p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 text-gray-500 dark:text-gray-400">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>

                        <h2 className="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">Upload Image File</h2>

                        <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">Upload or darg & drop your file SVG, PNG, JPG or GIF. </p>

                        <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="blogDescription" className="text-gray-700 dark:text-gray-200 mb-2">Blog Description</label>
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
            <button type="submit" className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                Submit Now
            </button>
            </div>
        </form>
        </section>

    </React.Fragment>
  );
};

export default BlogUpdate;
