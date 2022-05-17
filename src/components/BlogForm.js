import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    });
    setBlogTitle('');
    setBlogAuthor('');
    setBlogUrl('');
  };

  const handleBlogTitleChange = (event) => {
    setBlogTitle(event.target.value);
  };

  const handleBlogAuthorChange = (event) => {
    setBlogAuthor(event.target.value);
  };

  const handleBlogURLChange = (event) => {
    setBlogUrl(event.target.value);
  };

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            type='text'
            value={blogTitle}
            name='Title'
            onChange={handleBlogTitleChange}
            id='title-input'
          />
        </div>
        <div>
          Author:
          <input
            type='text'
            value={blogAuthor}
            name='Author'
            onChange={handleBlogAuthorChange}
            id='author-input'
          />
        </div>
        <div>
          Url:
          <input
            type='text'
            value={blogUrl}
            name='Url'
            onChange={handleBlogURLChange}
            id='url-input'
          />
        </div>
        <button type='submit' id='createblog-button'>
          Create
        </button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
