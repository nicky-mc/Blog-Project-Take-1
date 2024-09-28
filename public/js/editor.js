const blogTitleField = document.querySelector(".title");
const blogSummaryField = document.querySelector(".summary");
const articleFeild = document.querySelector(".article");
const bannerImage = document.querySelector(".banner");
const publishBtn = document.querySelector(".publish-btn");
const uploadInput = document.querySelector("#banner-upload");

let bannerPath = "default-banner.jpg";

bannerImage.addEventListener("click", () => {
  uploadInput.click();
});

uploadInput.addEventListener("change", () => {
  const formData = new FormData();
  formData.append("image", uploadInput.files[0]);

  fetch("/api/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      bannerPath = data.imageUrl;
      bannerImage.style.backgroundImage = `url("${bannerPath}")`;
    });
});

publishBtn.addEventListener("click", () => {
  if (
    blogTitleField.value.length &&
    blogSummaryField.value.length &&
    articleFeild.value.length
  ) {
    // generating id
    let letters = "abcdefghijklmnopqrstuvwxyz";
    let blogTitle = blogTitleField.value.split(" ").join("-");
    let id = "";
    for (let i = 0; i < 4; i++) {
      id += letters[Math.floor(Math.random() * letters.length)];
    }

    // setting up docName
    let docName = `${blogTitle}-${id}`;
    let date = new Date(); // for published at info

    fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: blogTitleField.value,
        article: articleFeild.value,
        summary: blogSummaryField.value,
        bannerImage: bannerPath,
        publishedAt: date.toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Document written");
        location.href = `/${data.id}`;
      })
      .catch((err) => {
        console.error("Error adding document: ", err);
      });
  }
});
