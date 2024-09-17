const { test, beforeEach, afterEach, after, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const assert = require('assert');
const Blog = require('../models/blog');
const app = require('../app');
const api = supertest(app);


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

describe('when there is initially some blogs saved', () => {
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
  
  test('blog with missing likes defaults to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'New Author',
      url: 'http://example.com/blogwithoutlikes'
    };
  
    // Make POST request to add the new blog
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const allBlogs = await api.get('/api/blogs');
    const addedBlog = allBlogs.body.find(blog => blog.title === newBlog.title);
    assert.strictEqual(addedBlog.likes, 0);
  });
  
  test('blog without title or url is not added', async () => {
    const newBlogWithoutTitle = {
      author: 'Author without title',
      url: 'http://example.com/blogwithouttitle',
      likes: 5
    };
  
    const newBlogWithoutUrl = {
      title: 'Blog without url',
      author: 'Author without url',
      likes: 5
    };
  
    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400);
  
    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400);
  });
  
  test('a blog can be deleted', async () => {
    // Get all blogs
    const allBlogs = await api.get('/api/blogs');
    // Delete last blog
    const lastBlog = allBlogs.body[allBlogs.body.length - 1]
    const lastBlogId = lastBlog.id;
    await api.delete(`/api/blogs/${lastBlogId}`).expect(204);
    // Make sure the blog was deleted
    const updatedBlogs = await api.get('/api/blogs');
    const deletedBlog = updatedBlogs.body.find(blog => blog.id === lastBlog.id);
    assert.strictEqual(deletedBlog, undefined);
  });
  
  test('likes can be updated', async () => {
    const allBlogs = await api.get('/api/blogs');
    const blogToUpdate = allBlogs.body[0];
    const updatedLikes = blogToUpdate.likes + 1;
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: updatedLikes })
      .expect(200);
    const updatedBlogs = await api.get('/api/blogs');
    const updatedBlog = updatedBlogs.body.find(blog => blog.id === blogToUpdate.id);
    assert.strictEqual(updatedBlog.likes, updatedLikes);
  });
});

after(async () => {
  await mongoose.connection.close();
});
