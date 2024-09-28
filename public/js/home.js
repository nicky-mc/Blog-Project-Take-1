const blogsSection = document.querySelector(".blogs-section");

fetch("/api/blogs")
  .then((res) => res.json())
  .then((data) => {
    blogsSection.innerHTML = ""; // Clear any existing content
    data.forEach((blog) => {
      blogsSection.innerHTML += `
            <div class="blog-card">
                <img src="${blog.bannerImage}" class="blog-image" alt="${blog.title}">
                <h1 class="blog-title">${blog.title}</h1>
                <p class="blog-overview">${blog.summary}</p>
                <a href="/${blog.id}" class="btn dark">read</a>
            </div>
            `;
    });
  })
  .catch((error) => {
    console.error("Error fetching blogs:", error);
    blogsSection.innerHTML =
      "<p>Error loading blogs. Please try again later.</p>";
  });
