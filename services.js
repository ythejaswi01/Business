document.querySelectorAll(".service-feature").forEach((service) => {
  const image = service.querySelector("img");
  const contactLink = service.querySelector('a[href^="contact.html"]');
  if (!image || !contactLink) {
    throw new Error("Each service needs a relevant image and contact link.");
  }
});
