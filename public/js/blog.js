let blogId = decodeURI(location.pathname.split("/").pop());

fetch(`/api/blog/${blogId}`)
  .then((res) => res.json())
  .then((data) => {
    setupBlog(data);
  })
  .catch((err) => {
    console.log(err);
    location.replace("/");
  });

const setupBlog = (data) => {
  const banner = document.querySelector(".banner");
  const blogTitle = document.querySelector(".title");
  const titleTag = document.querySelector("title");
  const publish = document.querySelector(".published");
  const article = document.querySelector(".article");

  banner.style.backgroundImage = `url(${data.bannerImage})`;

  titleTag.innerHTML += blogTitle.innerHTML = data.title;
  publish.innerHTML += data.publishedAt;
  article.innerHTML = data.article;
};
