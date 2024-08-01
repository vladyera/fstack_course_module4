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

after(async () => {
  await mongoose.connection.close();
});
