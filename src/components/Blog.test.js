import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import BlogForm from './BlogForm';
const blog = {
  title: 'Example',
  author: 'ExampleAuthor',
  url: 'ExampleURL',
  likes: 0,
  user: {
    username: 'ExampleBlogUser',
  },
};
const user = {
  name: 'ExampleName',
  username: 'ExampleUser',
};

const elementTitle = screen.queryByText('Example', { exact: false });
const elementAuthor = screen.queryByText('ExampleAuthor', { exact: false });
const elementURL = screen.queryByText('ExampleURL');
const elementLikes = screen.queryByText('0');

describe('Rendering Blog content', () => {
  let container;
  let div;
  const mockHandler = jest.fn();

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={user} updateLikes={mockHandler} />
    ).container;
    // At the start, togglableContent doesn't exist
    div = container.querySelector('.togglableContent');
  });

  test('renders content', () => {
    // screen.debug(container);

    expect(elementTitle).toBeDefined();
    expect(elementAuthor).toBeDefined();
    expect(elementURL).toBeNull();
    expect(elementLikes).toBeNull();
  });

  test('before clicking the button, blog content does not exist', () => {
    screen.debug(container);
    expect(div).toBeNull();
  });

  test('after clicking the button, blog content shows', async () => {
    screen.debug(container);

    const user = userEvent.setup();
    const button = screen.getByText('View');
    await user.click(button);

    screen.debug(container);
    // Togglable content exists after clicking the button View
    div = container.querySelector('.togglableContent');

    expect(div).not.toHaveStyle('display: none');
  });

  test('after blog content shows, click like button twice', async () => {
    screen.debug(container);

    const user = userEvent.setup();
    const button = screen.getByText('View');
    await user.click(button);

    screen.debug(container);

    const likeButton = screen.getByText('Like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});

describe('Blog Form Testing', () => {
  // Checks if the input values for the blog form are not empty
  test('test new blog form for correct details', async () => {
    const mockHandler = jest.fn();
    const { container } = render(<BlogForm createBlog={mockHandler} />);
    const inputs = screen.getAllByRole('textbox');

    const user = userEvent.setup();
    const createButton = screen.getByText('Create');
    await user.type(inputs[0], 'testing a form...');
    await user.type(inputs[1], 'testing a form...');
    await user.type(inputs[2], 'testing a form...');

    // userEvent.type(aInput, 'testing a form...');
    // userEvent.type(urlInput, 'testing a form...');
    screen.debug(container);
    expect(inputs[0].value).not.toBe('');
    expect(inputs[1].value).not.toBe('');
    expect(inputs[2].value).not.toBe('');

    await user.click(createButton);
    expect(mockHandler.mock.calls).toHaveLength(1);
  });
});
