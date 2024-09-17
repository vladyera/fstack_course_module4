const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const express = require('express');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const {title, url} = request.body;
  if (!title || !url) {
    return response.status(400).end();
  }
  const blog = new Blog(request.body);
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

// Delete function
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

// Update likes function
blogsRouter.put('/:id', async (request, response) => {
  const {likes} = request.body;
  await Blog.findByIdAndUpdate(request.params.id, {likes}, {new: true});
  response.status(200).end();
});
  

module.exports = blogsRouter;