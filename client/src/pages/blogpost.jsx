import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";

const Blogpost = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    title: "",
    blog_url: "",
    author_name: "",
    category: "",
    blog_date: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle text inputs
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};

    // Check empty fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "This field is required";
      }
    });

    // Blog description check
    if (!content.trim()) {
      newErrors.blog_description = "Blog description is required";
    }

    // Image check
    if (!image) {
      newErrors.blog_img = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("blog_description", content);
    data.append("blog_img", image);

    try {
      setLoading(true);
      const res = await axios.post("https://api.ec-businessschool.in/api/blogs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog posted successfully!");
      console.log(res.data);

      // Reset form
      setFormData({
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        title: "",
        blog_url: "",
        author_name: "",
        category: "",
        blog_date: "",
      });
      setContent("");
      setImage(null);
      setErrors({});
    } catch (error) {
      console.error("Error posting blog:", error);
      alert("Failed to post blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="flex items-center gap-x-3 mb-5">
        <div>
          <h1 className="text-lg font-medium text-gray-800 dark:text-white">
            Blog Post
          </h1>
          <p className="text-gray-600 mt-1">Post the Blog Post in one place</p>
        </div>
      </div>
      <section className="w-full p-6 mx-auto bg-white rounded-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700 md:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              { label: "Meta Title", name: "meta_title" },
              { label: "Meta Description", name: "meta_description" },
              { label: "Meta Keywords", name: "meta_keywords" },
              { label: "Blog Title", name: "title" },
              { label: "Blog URL", name: "blog_url" },
              { label: "Author Name", name: "author_name" },
              { label: "Category", name: "category" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-gray-700 dark:text-gray-200">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm">{errors[field.name]}</p>
                )}
              </div>
            ))}
            <div>
              <label className="text-gray-700 dark:text-gray-200">
                Blog Date
              </label>
              <input
                name="blog_date"
                value={formData.blog_date}
                onChange={handleChange}
                type="date"
                className="block mt-2 w-full px-5 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600"
              />
              {errors.blog_date && (
                <p className="text-red-500 text-sm">{errors.blog_date}</p>
              )}
            </div>
          </div>

          {/* Upload Image */}
          <div className="grid grid-cols-1 gap-6 mt-4">
            <div>
              <label className="text-gray-700 dark:text-gray-200">
                Upload Image
              </label>
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center w-full p-5 mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl"
              >
                <input
                  id="dropzone-file"
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {image ? (
                  <p className="text-sm text-gray-600">{image.name}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to upload
                  </p>
                )}
              </label>
              {errors.blog_img && (
                <p className="text-red-500 text-sm">{errors.blog_img}</p>
              )}
            </div>

            {/* Blog Description */}
            <div>
              <label className="text-gray-700 dark:text-gray-200 mb-2">
                Blog Description
              </label>
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
              {errors.blog_description && (
                <p className="text-red-500 text-sm">
                  {errors.blog_description}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 text-white bg-gray-700 rounded-md hover:bg-gray-600"
            >
              {loading ? "Submitting..." : "Submit Now"}
            </button>
          </div>
        </form>
      </section>
    </React.Fragment>
  );
};

export default Blogpost;
