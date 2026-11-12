document.querySelectorAll(".team-card").forEach((card) => {
  const image = card.querySelector("img");
  if (!image) {
    throw new Error("A team card is missing its profile image.");
  }
});
