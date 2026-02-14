console.log("scripts.js loaded");


function fixImagePath(path) {
  if (!path) return null;

  return path.replace("..", ".");
}


let aboutMeData = null;
let projectsData = [];


async function fetchAboutMeData() {
  const response = await fetch("./data/aboutMeData.json");
  return await response.json();
}

async function fetchProjectsData() {
  const response = await fetch("./data/projectsData.json");
  return await response.json();
}

function populateAboutMe(data) {
  const aboutMeContainer = document.getElementById("aboutMe");

  const p = document.createElement("p");
  p.textContent = data.aboutMe || "About me information not available.";

  const headshotDiv = document.createElement("div");
  headshotDiv.className = "headshotContainer";

  const img = document.createElement("img");
  img.src =
    fixImagePath(data.headshot) || "./images/card_placeholder_bg.webp";
  img.alt = "Headshot";

  headshotDiv.appendChild(img);

  aboutMeContainer.appendChild(p);
  aboutMeContainer.appendChild(headshotDiv);
}

function createProjectCards(projects) {
  const projectList = document.getElementById("projectList");

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "projectCard";
    card.id = project.project_id;

    const title = document.createElement("h4");
    title.textContent = project.project_name || "Untitled Project";

    const desc = document.createElement("p");
    desc.textContent =
      project.short_description || "No description available.";

    const bgImage =
      fixImagePath(project.card_image) ||
      "./images/card_placeholder_bg.webp";

    card.style.backgroundImage = `url(${bgImage})`;

    card.appendChild(title);
    card.appendChild(desc);

    card.addEventListener("click", () => {
      updateSpotlight(project);
    });

    projectList.appendChild(card);
  });
}

function updateSpotlight(project) {
  const spotlight = document.getElementById("projectSpotlight");
  const spotlightTitles = document.getElementById("spotlightTitles");

  spotlight.style.backgroundImage = `url(${
    fixImagePath(project.spotlight_image) ||
    "./images/spotlight_placeholder_bg.webp"
  })`;

while (spotlightTitles.firstChild) {
  spotlightTitles.removeChild(spotlightTitles.firstChild);
}

  const h3 = document.createElement("h3");
  h3.textContent = project.project_name || "Untitled Project";

  const p = document.createElement("p");
  p.textContent =
    project.long_description || "No detailed description available.";

  const a = document.createElement("a");
  a.textContent = "Click here to see more...";
  a.href = project.url || "#";
  a.target = "_blank";

  spotlightTitles.appendChild(h3);
  spotlightTitles.appendChild(p);
  spotlightTitles.appendChild(a);
}


function setupProjectArrows() {
  const projectList = document.getElementById("projectList");
  const leftArrow = document.querySelector(".arrow-left");
  const rightArrow = document.querySelector(".arrow-right");

  leftArrow.addEventListener("click", () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      projectList.scrollBy({ top: -200, behavior: "smooth" });
    } else {
      projectList.scrollBy({ left: -200, behavior: "smooth" });
    }
  });

  rightArrow.addEventListener("click", () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      projectList.scrollBy({ top: 200, behavior: "smooth" });
    } else {
      projectList.scrollBy({ left: 200, behavior: "smooth" });
    }
  });
}


function setupFormValidation() {
  const form = document.getElementById("formSection");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const charactersLeft = document.getElementById("charactersLeft");

  const illegalRegex = /[^a-zA-Z0-9@._-]/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  messageInput.addEventListener("input", () => {
    charactersLeft.textContent = `Characters: ${messageInput.value.length}/300`;
    charactersLeft.classList.toggle(
      "error",
      messageInput.value.length > 300
    );
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;
    emailError.textContent = "";
    messageError.textContent = "";

    if (!emailInput.value) {
      emailError.textContent = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(emailInput.value)) {
      emailError.textContent = "Invalid email format.";
      valid = false;
    } else if (illegalRegex.test(emailInput.value)) {
      emailError.textContent = "Email contains illegal characters.";
      valid = false;
    }

    if (!messageInput.value) {
      messageError.textContent = "Message is required.";
      valid = false;
    } else if (messageInput.value.length > 300) {
      messageError.textContent = "Message must be 300 characters or less.";
      valid = false;
    } else if (illegalRegex.test(messageInput.value)) {
      messageError.textContent = "Message contains illegal characters.";
      valid = false;
    }

    if (valid) {
      alert("Form submitted successfully!");
      form.reset();
      charactersLeft.textContent = "Characters: 0/300";
    }
  });
}


async function init() {
  aboutMeData = await fetchAboutMeData();
  populateAboutMe(aboutMeData);

  projectsData = await fetchProjectsData();
  createProjectCards(projectsData);


  updateSpotlight(projectsData[0]);

  setupProjectArrows();
  setupFormValidation();
}

init();
