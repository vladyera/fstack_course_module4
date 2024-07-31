const {test, describe} = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ];

  test('of empty list is zero', () => {
    const emptyList = [];
    const totalLikes = listHelper.totalLikes(emptyList);
    assert.strictEqual(totalLikes, 0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const totalLikes = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(totalLikes, listWithOneBlog[0].likes);
  });

  test('of a bigger list is calculated right', () => {
    const newList = [...listWithOneBlog, {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Some Title',
      author: 'Vlad',
      url: 'https://google.com',
      likes: 15,
      __v: 0
    }];
    const totalLikesResult = listHelper.totalLikes(newList);
    const totalLikes = newList.reduce((sum, blog) => sum + blog.likes, 0);
    assert.strictEqual(totalLikes, totalLikesResult);
  });
})