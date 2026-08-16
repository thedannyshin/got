const HOUSE_COLORS = {
  Stark: "#8aa0b5",
  Lannister: "#b42318",
  Targaryen: "#7a1010",
  Baratheon: "#c9a227",
  Arryn: "#6ea8d8",
  Tully: "#8b2e2e",
  Frey: "#8a6b73",
  "Night's Watch": "#4a4a4a",
  "White Walkers": "#7ec8e3",
  Greyjoy: "#6b5b3a",
  Tyrell: "#3f7a3a",
  Martell: "#c45c12",
  Bolton: "#c48a96",
  Mormont: "#3d5c3a",
  "Free Folk": "#8a6844",
  Dothraki: "#6a3d1e",
  Clegane: "#5a5450",
  Baelish: "#4a3a5c",
  Seaworth: "#3d5f73",
  Tarth: "#4f7ea3",
  "R'hllor": "#9c1c1c",
  "Faceless Men": "#3a3532",
  Naath: "#c9b36a",
  Unsullied: "#4a4f46",
  "Second Sons": "#7a5a28",
  Faith: "#d8c9a0",
  Tarly: "#355a38",
  None: "#d4af37",
};

const tabsEl = document.getElementById("tabs");
const introEl = document.getElementById("season-intro");
const gridEl = document.getElementById("grid");

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function renderSeason(seasonNumber) {
  const season = SEASONS.find((item) => item.number === seasonNumber);
  if (!season) return;

  tabsEl.querySelectorAll("button").forEach((button) => {
    const selected = Number(button.dataset.season) === seasonNumber;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });

  introEl.innerHTML = `
    <h2>${season.title}</h2>
    <div class="meta">Season ${season.number} · ${season.year} · ${season.characters.length} main characters</div>
    <p>${season.blurb}</p>
  `;

  gridEl.replaceChildren();
  season.characters.forEach((id, index) => {
    const character = CHARACTERS[id];
    if (!character) return;

    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${Math.min(index, 16) * 28}ms`;
    card.style.setProperty("--house", HOUSE_COLORS[character.house] || HOUSE_COLORS.None);

    const portrait = document.createElement("div");
    portrait.className = "portrait";

    const img = document.createElement("img");
    img.src = character.image;
    img.alt = character.name;
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "fallback";
      fallback.textContent = initials(character.name);
      portrait.replaceChildren(fallback);
    });

    portrait.append(img);

    const houseBar = document.createElement("div");
    houseBar.className = "house-bar";

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.innerHTML = `
      <h3>${character.name}</h3>
      <span class="title">${character.title}</span>
    `;

    card.append(portrait, houseBar, caption);
    gridEl.append(card);
  });

  localStorage.setItem("got-season", String(seasonNumber));
}

function buildTabs() {
  SEASONS.forEach((season) => {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "tab";
    button.id = `tab-${season.number}`;
    button.dataset.season = String(season.number);
    button.setAttribute("aria-controls", "grid");
    button.setAttribute("aria-label", `Season ${season.number}`);
    button.innerHTML = `
      <span class="tab-full">Season ${season.number}</span>
      <span class="tab-short">${season.number}</span>
    `;
    button.addEventListener("click", () => renderSeason(season.number));
    tabsEl.append(button);
  });

  tabsEl.addEventListener("keydown", (event) => {
    const buttons = [...tabsEl.querySelectorAll("button")];
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;

    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % buttons.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + buttons.length) % buttons.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = buttons.length - 1;
    else return;

    event.preventDefault();
    buttons[next].focus();
    renderSeason(Number(buttons[next].dataset.season));
  });
}

buildTabs();
const saved = Number(localStorage.getItem("got-season"));
renderSeason(SEASONS.some((season) => season.number === saved) ? saved : 1);
