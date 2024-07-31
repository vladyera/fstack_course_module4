const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.reduce((favorite, blog) => {
    return (blog.likes > favorite.likes) ? blog : favorite;
  });
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorBlogCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});

  const topAuthor = Object.keys(authorBlogCount).reduce((top, author) => {
    return authorBlogCount[author] > top.blogs ? { author, blogs: authorBlogCount[author] } : top;
  }, { author: '', blogs: 0 });

  return topAuthor;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorLikesCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const topAuthor = Object.keys(authorLikesCount).reduce((top, author) => {
    return authorLikesCount[author] > top.likes ? { author, likes: authorLikesCount[author] } : top;
  }, { author: '', likes: 0 });

  return topAuthor;
};

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
};