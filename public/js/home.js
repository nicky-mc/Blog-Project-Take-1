document.addEventListener("DOMContentLoaded", () => {
  fetchBlogPosts();
});

function fetchBlogPosts() {
  fetch("/api/blogs")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((blogs) => {
      if (!Array.isArray(blogs)) {
        throw new Error("Expected an array of blogs, but got: " + typeof blogs);
      }
      displayBlogPosts(blogs);
    })
    .catch((error) => {
      console.error("Error:", error);
      displayError(
        "An error occurred while fetching blog posts: " + error.message
      );
    });
}

function displayBlogPosts(blogs) {
  const blogList = document.getElementById("blog-list");
  blogList.innerHTML = ""; // Clear existing content
  if (blogs.length === 0) {
    blogList.innerHTML = "<p>No blog posts found.</p>";
    return;
  }
  blogs.forEach((blog) => {
    const blogElement = document.createElement("article");
    blogElement.innerHTML = `
          <h2><a href="/blog/${blog.id}?id=${blog.id}">${blog.title}</a></h2>
          <img src="${blog.bannerImage}" alt="${blog.title}">
          <p>${blog.summary}</p>
      `;
    blogList.appendChild(blogElement);
  });
}

function displayError(message) {
  const errorElement = document.createElement("p");
  errorElement.textContent = message;
  errorElement.style.color = "red";
  document.getElementById("blog-list").appendChild(errorElement);
}
