document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("blog-form");
  form.addEventListener("submit", handleSubmit);
});

async function handleSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const summary = document.getElementById("summary").value;
  const article = document.getElementById("article").value;
  const bannerImageFile = document.getElementById("banner-image").files[0];

  try {
    let bannerImageUrl = "";
    if (bannerImageFile) {
      bannerImageUrl = await uploadImage(bannerImageFile);
    }

    const blogPost = {
      title,
      summary,
      article,
      bannerImage: bannerImageUrl,
    };

    console.log("Sending blog post data:", blogPost);

    const response = await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogPost),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create blog post");
    }

    const result = await response.json();
    alert("Blog post created successfully!");
    window.location.href = `/blog/${result.id}?id=${result.id}`;
  } catch (error) {
    console.error("Error details:", error);
    alert(
      "Failed to create blog post. Please try again. Error: " + error.message
    );
  }
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload image");
    }

    const result = await response.json();
    return result.imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image: " + error.message);
  }
}
