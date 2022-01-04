import React, { useState } from 'react';

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
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          Author:
          <input
            type='text'
            value={blogAuthor}
            name='Author'
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          Url:
          <input
            type='text'
            value={blogUrl}
            name='Url'
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button type='submit'>Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
