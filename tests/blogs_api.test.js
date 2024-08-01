const { test, beforeEach, afterEach, after } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const assert = require('assert');
const Blog = require('../models/blog');
const app = require('../app');

const api = supertest(app);

// Define initial blogs
const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Author 1',
    url: 'http://example.com/blog1',
    likes: 5
  },
  {
    title: 'Blog 2',
    author: 'Author 2',
    url: 'http://example.com/blog2',
    likes: 10
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

test('blogs are returned as json and correct number of blogs', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs');

  response.body.forEach(blog => {
    assert.ok(blog.id);
    assert.strictEqual(blog._id, undefined);
  });
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'http://example.com/newblog',
    likes: 12
  };

  // Get the number of blogs before adding a new one
  const blogs = await api.get('/api/blogs');
  const initialLength = blogs.body.length;

  // Make POST request to add the new blog
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  // Get all blogs and verify the total number of blogs
  const newBlogs = await api.get('/api/blogs');
  assert.strictEqual(newBlogs.body.length, initialLength + 1);
});

after(async () => {
  await mongoose.connection.close();
});
