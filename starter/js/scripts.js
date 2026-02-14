console.log("scripts.js loaded");

function fixImagePath(path) {
  if (!path) return null;
  return path.replace("..", ".");
}

let aboutMeData = null;
let projectsData = [];

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed (${response.status}) for ${url}`);
  }
  return response.json();
}

async function fetchAboutMeData() {
  return fetchJSON("./data/aboutMeData.json");
}

async function fetchProjectsData() {
  return fetchJSON("./data/projectsData.json");
}

function populateAboutMe(data) {
  const aboutMeContainer = document.getElementById("aboutMe");
  if (!aboutMeContainer) return;

  aboutMeContainer.innerHTML = "";

  const p = document.createElement("p");
  p.textContent = data.aboutMe || "About me information not available.";

  const headshotDiv = document.createElement("div");
  headshotDiv.className = "headshotContainer";

  const img = document.createElement("img");
  img.src = fixImagePath(data.headshot) || "./images/card_placeholder_bg.webp";
  img.alt = "Headshot";

  headshotDiv.appendChild(img);
  aboutMeContainer.appendChild(p);
  aboutMeContainer.appendChild(headshotDiv);
}

function createProjectCards(projects) {
  const projectList = document.getElementById("projectList");
  if (!projectList) return;

  projectList.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "projectCard";
    card.id = project.project_id;
    card.dataset.projectId = project.project_id;

    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `View project: ${project.project_name || "Untitled Project"}`
    );

    const title = document.createElement("h4");
    title.textContent = project.project_name || "Untitled Project";

    const desc = document.createElement("p");
    desc.textContent = project.short_description || "No description available.";

    const bgImage =
      fixImagePath(project.card_image) || "./images/card_placeholder_bg.webp";

    card.style.backgroundImage = `url(${bgImage})`;

    card.appendChild(title);
    card.appendChild(desc);
    projectList.appendChild(card);
  });
}

function updateSpotlight(project) {
  const spotlight = document.getElementById("projectSpotlight");
  const spotlightTitles = document.getElementById("spotlightTitles");
  if (!spotlight || !spotlightTitles) return;

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
  a.rel = "noopener noreferrer";

  spotlightTitles.appendChild(h3);
  spotlightTitles.appendChild(p);
  spotlightTitles.appendChild(a);
}

function setActiveCard(activeCard) {
  const cards = document.querySelectorAll("#projectList .projectCard");

  cards.forEach((c) => {
    c.classList.remove("active");
    c.removeAttribute("aria-selected");
    c.style.outline = "";
    c.style.outlineOffset = "";
  });

  if (!activeCard) return;

  activeCard.classList.add("active");
  activeCard.setAttribute("aria-selected", "true");
  activeCard.style.outline = "3px solid currentColor";
  activeCard.style.outlineOffset = "4px";
}

function setupProjectSelection(projects) {
  const projectList = document.getElementById("projectList");
  if (!projectList) return;

  const getProjectById = (id) => projects.find((p) => p.project_id === id);

  projectList.addEventListener("click", (e) => {
    const card = e.target.closest(".projectCard");
    if (!card) return;

    const project = getProjectById(card.dataset.projectId);
    if (!project) return;

    setActiveCard(card);
    updateSpotlight(project);
  });

  projectList.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    const card = e.target.closest(".projectCard");
    if (!card) return;

    e.preventDefault();

    const project = getProjectById(card.dataset.projectId);
    if (!project) return;

    setActiveCard(card);
    updateSpotlight(project);
  });
}

function setupProjectArrows() {
  const projectList = document.getElementById("projectList");
  const leftArrow = document.querySelector(".arrow-left");
  const rightArrow = document.querySelector(".arrow-right");

  if (!projectList || !leftArrow || !rightArrow) return;

  const scrollPrev = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      projectList.scrollBy({ top: -200, behavior: "smooth" });
    } else {
      projectList.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      projectList.scrollBy({ top: 200, behavior: "smooth" });
    } else {
      projectList.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  leftArrow.addEventListener("click", scrollPrev);
  rightArrow.addEventListener("click", scrollNext);

  leftArrow.tabIndex = 0;
  rightArrow.tabIndex = 0;
  leftArrow.setAttribute("role", "button");
  rightArrow.setAttribute("role", "button");

  leftArrow.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollPrev();
    }
  });

  rightArrow.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollNext();
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

  if (
    !form ||
    !emailInput ||
    !messageInput ||
    !emailError ||
    !messageError ||
    !charactersLeft
  )
    return;

  const illegalRegex = /[^a-zA-Z0-9@._-\s]/;
  const emailIllegalRegex = /[^a-zA-Z0-9@._-]/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const updateCounter = () => {
    const remaining = 300 - messageInput.value.length;
    charactersLeft.textContent = `Remaining: ${remaining}/300`;
    charactersLeft.classList.toggle("error", remaining < 0);
  };

  const validateEmail = () => {
    emailError.textContent = "";
    if (!emailInput.value) {
      emailError.textContent = "Email is required.";
      return false;
    }
    if (!emailRegex.test(emailInput.value)) {
      emailError.textContent = "Invalid email format.";
      return false;
    }
    if (emailIllegalRegex.test(emailInput.value)) {
      emailError.textContent = "Email contains illegal characters.";
      return false;
    }
    return true;
  };

  const validateMessage = () => {
    messageError.textContent = "";
    if (!messageInput.value) {
      messageError.textContent = "Message is required.";
      return false;
    }
    if (messageInput.value.length > 300) {
      messageError.textContent = "Message must be 300 characters or less.";
      return false;
    }
    if (illegalRegex.test(messageInput.value)) {
      messageError.textContent = "Message contains illegal characters.";
      return false;
    }
    return true;
  };

  messageInput.addEventListener("input", () => {
    updateCounter();
    if (messageError.textContent) validateMessage();
  });

  emailInput.addEventListener("input", () => {
    if (emailError.textContent) validateEmail();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailValid = validateEmail();
    const messageValid = validateMessage();

    if (emailValid && messageValid) {
      alert("Form submitted successfully!");
      form.reset();
      updateCounter();
    }
  });

  updateCounter();
}

async function init() {
  try {
    aboutMeData = await fetchAboutMeData();
    populateAboutMe(aboutMeData);

    projectsData = await fetchProjectsData();
    createProjectCards(projectsData);

    setupProjectSelection(projectsData);
    setupProjectArrows();
    setupFormValidation();

    if (projectsData.length > 0) {
      updateSpotlight(projectsData[0]);
      const firstCard = document.querySelector("#projectList .projectCard");
      setActiveCard(firstCard);
    }
  } catch (err) {
    console.error(err);
  }
}

init();
