import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
	getDatabase,
	ref,
	get,
	child,
	set,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { personalities } from "../bts-code/personalities.js";

// Firebase Config
const firebaseConfig = {
	apiKey: "AIzaSyAkidMW8oxhj2UbMZo3iX31sy8sjEf-zEA",
	authDomain: "rise-from-rejection.firebaseapp.com",
	databaseURL: "https://rise-from-rejection-default-rtdb.firebaseio.com",
	projectId: "rise-from-rejection",
	storageBucket: "rise-from-rejection.firebasestorage.app",
	messagingSenderId: "976543624439",
	appId: "1:976543624439:web:ecb3feb91d44ac70b437f2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);
const personalitiesRef = ref(db, "personalities");

// Cache DOM references (avoid repeated lookups)
const dom = {
	hamburger: document.getElementById("hamburger"),
	closeIcon: document.getElementById("close"),
	navLinks: document.querySelector(".nav-links"),
	navItems: document.querySelectorAll(".nav-links li a"),
	searchBtn: document.querySelector(".search-btn"),
	mobileSearch: document.querySelector(".mobile-search-input"),
	mainContainer: document.querySelector(".head-article-container"),
	gridContainer: document.querySelector(".article-grids"),
	footerName: document.querySelector(".name-input"),
	footerEmail: document.querySelector(".email-input"),
	copyright: document.getElementById("copyrights"),
	backBtn: document.getElementById("backBtn"),
};

// Nav toggle helpers
const toggleMenu = () => {
	dom.navLinks.classList.toggle("active");
	const open = dom.navLinks.classList.contains("active");
	dom.hamburger.style.display = open ? "none" : "inline";
	dom.closeIcon.style.display = open ? "inline" : "none";
};

const closeMenu = () => {
	if (dom.navLinks.classList.contains("active")) toggleMenu();
};

// Renderers
function renderMainArticle(person) {
	const link = document.createElement("a");
	link.className = "mainStoryLink";
	link.href = `../story.html?id=${person.id}`;

	const container = document.createElement("div");
	container.className = "head-article-container";

	container.innerHTML = `
    <div class="gradient"></div>
    <div class="info">
      <p class="category-tag">${person.category}</p>
      <p class="head-title title">${person.title}</p>
      <p class="head-sub-title sub-title">${person.subtitle}</p>
      <div class="credits">
        <p class="author">${person.author}</p>
        <span class="dot"></span>
        <p class="date">${person.date}</p>
        <span class="dot"></span>
        <p class="reading-time">${person.reading_time} read</p>
      </div>
    </div>
    <img class="article-img" src="${person.image_src}" alt="${person.name} image" />
  `;

	link.appendChild(container);
	return link;
}

function renderArticle(person) {
	const link = document.createElement("a");
	link.className = "storyLink";
	link.href = `../story.html?id=${person.id}`;

	const html = `
    <div class="article-container">
      <div class="gradient"></div>
      <div class="info">
        <p class="category-tag">${person.category}</p>
        <p class="title">${person.title}</p>
        <p class="sub-title">${person.subtitle}</p>
        <div class="credits">
          <p class="author">${person.author}</p>
          <span class="dot"></span>
          <p class="date">${person.date}</p>
          <span class="dot"></span>
          <p class="reading-time">${person.reading_time} read</p>
        </div>
      </div>
      <img class="article-img" loading="lazy" src="${person.image_src}" alt="${person.name} image" />
    </div>
  `;

	link.innerHTML = html;
	return link;
}

// Load content
async function loadAllArticles() {
	try {
		const snap = await get(personalitiesRef);
		if (!snap.exists()) return;
		const people = Object.values(snap.val());

		// Main Article
		const main = renderMainArticle(
			people[Math.floor(Math.random() * people.length)]
		);
		if (dom.mainContainer) dom.mainContainer.replaceWith(main);

		// Latest Articles (max 12)
		if (dom.gridContainer) {
			const fragment = document.createDocumentFragment();
			people
				.slice(0, 12)
				.forEach((p) => fragment.appendChild(renderArticle(p)));
			dom.gridContainer.innerHTML = "";
			dom.gridContainer.appendChild(fragment);
		}
	} catch (err) {
		console.error("Error loading articles:", err);
	}
}

// Load story page
async function loadStory(id) {
	try {
		const snap = await get(child(dbRef, `personalities/${id}`));
		const article = snap.exists() ? snap.val() : null;
		const container = document.getElementById("storyContainer");
		if (!article) {
			container.innerHTML = "<h2>Article not found :(</h2>";
			return;
		}
		container.innerHTML = `
      <p class="category-tag">${article.category}</p>
      <h1 id="title">${article.title}</h1>
      <p id="subtitle">${article.subtitle}</p>
      <div class="credits">
        <p class="author">${article.author}</p><span class="dot"></span>
        <p class="date">${article.date}</p><span class="dot"></span>
        <p class="reading-time">${article.reading_time} read</p>
      </div>
      <img id="articleImg" src="${article.image_src}" />
      <div id="storyContent">${article.story}</div>
    `;
	} catch (err) {
		console.error("Error fetching article:", err);
	}
}

// Event bindings
function bindEvents() {
	dom.hamburger?.addEventListener("click", (e) => {
		e.stopPropagation();
		toggleMenu();
	});
	dom.closeIcon?.addEventListener("click", (e) => {
		e.stopPropagation();
		toggleMenu();
	});
	dom.navItems.forEach((item) =>
		item.addEventListener(
			"click",
			() => window.innerWidth <= 768 && closeMenu()
		)
	);
	dom.searchBtn?.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
	});
	dom.mobileSearch?.addEventListener("click", (e) => e.stopPropagation());

	dom.mobileSearch?.addEventListener("keyup", (e) => {
		if (e.key === "Enter") {
			console.log("Search:", e.target.value);
			closeMenu();
		}
	});

	dom.backBtn?.addEventListener("click", () => window.history.back());

	// Footer subscription
	dom.footerEmail?.addEventListener("keyup", (e) => {
		if (e.key === "Enter" && dom.footerName.value) {
			const user = dom.footerName.value;
			set(ref(db, `emails/${user}`), {
				name: user,
				email: dom.footerEmail.value,
			});
			alert(`${user}, thanks for subscribing!`);
			dom.footerName.value = dom.footerEmail.value = "";
		}
	});

	// Disable default option
	const select = document.getElementById("storyCategory-input");
	const defaultOpt = document.getElementById("default");
	select?.addEventListener(
		"click",
		() => defaultOpt && (defaultOpt.disabled = true)
	);
}

// Footer date
function setFooterDate() {
	dom.copyright.innerHTML = `<p>&copy; ${new Date().getFullYear()} Rise from Rejections. All rights reserved.</p>`;
}

// Init
document.addEventListener("DOMContentLoaded", () => {
	bindEvents();
	loadAllArticles();
	const id = new URLSearchParams(window.location.search).get("id");
	if (id) loadStory(id);
	setFooterDate();
});
