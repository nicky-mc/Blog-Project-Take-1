document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");

  if (blogId) {
    fetchBlogPost(blogId);
  } else {
    displayError("No blog post ID provided");
  }
});

function fetchBlogPost(id) {
  fetch(`/api/blog/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      displayBlogPost(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      displayError(
        "An error occurred while fetching the blog post: " + error.message
      );
    });
}

function displayBlogPost(post) {
  document.getElementById("blog-title").textContent = post.title;
}

function displayError(message) {
  const errorElement = document.createElement("p");
  errorElement.textContent = message;
  errorElement.style.color = "red";
  document.getElementById("blog-post").appendChild(errorElement);
}
