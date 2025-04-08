import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import {
	getDatabase,
	ref,
	child,
	get,
	set,
	update,
	remove,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// personalities file
import { personalities } from "../bts-code/personalities.js";

// don't touch

// todo: optimize images on cloudinary for performance.
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

// footer date
const date = new Date();

// function addData() {
// 	set(ref(db, "artTest/" + `${fName}${lName}`), {
// 		name: { firstName: fName, lastName: lName },
// 		dept: "ts is fast",
// 		canSwim: false,
// 	})
// 		.then(() => {
// 			console.log("data added successfully");
// 		})
// 		.catch((error) => {
// 			console.log("unsuccessful: " + error);
// 		});
// }
// addData();

// function getData() {
// 	get(child(dbRef, "articles/" + "elonmusk"))
// 		.then((snapshot) => {
// 			if (snapshot.exists()) {
// 				console.log("");
// 				console.log(snapshot.val().names);
// 				console.log(snapshot.val().story);
// 				console.log(snapshot.val().success);
// 			}
// 		})
// 		.catch((error) => {
// 			console.log('unsuccessful: ' + error);
// 		});
// }
// getData();

// uploading and updating the local personalities (10 for now). i'll stop doing local stuff once i learn auth so only i can write to the db.
// personalities.forEach((person) => {
// 	const personRef = ref(db, "personalities/" + person.id);
// 	set(personRef, person);
// });

// JavaScript for the navbar functionality
document.addEventListener("DOMContentLoaded", function () {
	// Get DOM elements
	const hamburger = document.getElementById("hamburger");
	const close = document.getElementById("close");
	const navLinks = document.querySelector(".nav-links");
	const navLinksItems = document.querySelectorAll(".nav-links li a");
	const desktopSearchBtn = document.querySelector(".search-btn");
	const mobileSearchInput = document.querySelector(".mobile-search-input");
	const headDiv = document.querySelector(".head-article-container");
	const copyrightDiv = document.getElementById("copyrights");
	const footerSearchInput = document.querySelector(".email-input");
	const latestArticlesGrids = document.querySelector(".article-grids");
	const backBtnEl = document.getElementById("backBtn");

	// Toggle menu function
	function toggleMenu() {
		navLinks.classList.toggle("active");
		if (navLinks.classList.contains("active")) {
			hamburger.style.display = "none";
			close.style.display = "inline";
		} else {
			hamburger.style.display = "inline";
			close.style.display = "none";
		}
	}

	// Close menu function
	function closeMenu() {
		// console.log("close menu called", navLinks.classList.contains("active"));
		if (navLinks.classList.contains("active")) {
			navLinks.classList.remove("active");
			hamburger.style.display = "inline";
			close.style.display = "none";
		}
	}

	// Event listeners
	hamburger.addEventListener("click", function (e) {
		e.stopPropagation(); // Prevent propagation to document
		toggleMenu();
	});

	close.addEventListener("click", function (e) {
		e.stopPropagation(); // Prevent propagation to document
		toggleMenu();
	});

	// Close menu when clicking on a link
	navLinksItems.forEach((item) => {
		item.addEventListener("click", function (e) {
			if (window.innerWidth <= 768) {
				closeMenu();
			}
		});
	});

	// Handle desktop search button click
	if (desktopSearchBtn) {
		desktopSearchBtn.addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation(); // Prevent propagation
			console.log("Desktop search clicked");
			// You could add modal or other search functionality here
		});
	}

	// Handle mobile search input (prevent menu close when clicking in search field)
	if (mobileSearchInput) {
		mobileSearchInput.addEventListener("click", function (e) {
			e.stopPropagation(); // Prevent the click from bubbling up to parent elements
		});

		// Handle search submission
		mobileSearchInput.addEventListener("keyup", function (e) {
			if (e.key === "Enter") {
				console.log("Mobile search submitted:", this.value);
				push("fdf", this.value);
				// Add your search functionality here
				closeMenu(); // Close the menu after submitting
			}
		});
	}

	// Prevent clicks inside the navbar from closing the menu
	navLinks.addEventListener("click", function (e) {
		e.stopPropagation();
	});

	// Close menu when clicking outside
	document.addEventListener("click", function () {
		closeMenu();
	});

	// ----------------------------
	// Modularized Rendering Functions
	// ----------------------------

	// Create and return main article element using createElement
	function renderMainArticle(mainPerson) {
		// link around article
		const storyLink = document.createElement("a");
		storyLink.classList.add("storyLink");
		storyLink.href = `../story.html?id=${mainPerson.id}`;

		// Create container for main article
		const container = document.createElement("div");

		// Create gradient overlay
		const gradient = document.createElement("div");
		gradient.classList.add("gradient");
		container.appendChild(gradient);

		// Create info div and its children
		const info = document.createElement("div");
		info.classList.add("info");

		const categoryTag = document.createElement("p");
		categoryTag.classList.add("category-tag");
		categoryTag.textContent = mainPerson.category;
		info.appendChild(categoryTag);

		const headTitle = document.createElement("p");
		headTitle.classList.add("head-title", "title");
		headTitle.textContent = mainPerson.title;
		info.appendChild(headTitle);

		const headSubTitle = document.createElement("p");
		headSubTitle.classList.add("head-sub-title", "sub-title");
		headSubTitle.textContent = mainPerson.subtitle;
		info.appendChild(headSubTitle);

		const credits = document.createElement("div");
		credits.classList.add("credits");

		const authorP = document.createElement("p");
		authorP.classList.add("author");
		authorP.textContent = mainPerson.author;
		credits.appendChild(authorP);

		const dot1 = document.createElement("span");
		dot1.classList.add("dot");
		credits.appendChild(dot1);

		const dateP = document.createElement("p");
		dateP.classList.add("date");
		dateP.textContent = mainPerson.date;
		credits.appendChild(dateP);

		const dot2 = document.createElement("span");
		dot2.classList.add("dot");
		credits.appendChild(dot2);

		const readingTimeP = document.createElement("p");
		readingTimeP.classList.add("reading-time");
		readingTimeP.textContent = mainPerson.reading_time + " read";
		credits.appendChild(readingTimeP);

		info.appendChild(credits);
		container.appendChild(info);

		// Create image element
		const img = document.createElement("img");
		img.classList.add("article-img");
		img.src = mainPerson.image_src;
		img.alt = `${mainPerson.name}'s image`;
		container.appendChild(img);
		storyLink.appendChild(container);

		return storyLink;
	}

	// Create and return an article element for latest articles
	function renderArticle(personality) {
		const storyLink = document.createElement("a");
		storyLink.href = `../story.html?id=${personality.id}`;
		storyLink.classList.add("storyLink");

		const articleContainer = document.createElement("div");
		articleContainer.classList.add("article-container");

		const gradient = document.createElement("div");
		gradient.classList.add("gradient");
		articleContainer.appendChild(gradient);

		const info = document.createElement("div");
		info.classList.add("info");

		const categoryTag = document.createElement("p");
		categoryTag.classList.add("category-tag");
		categoryTag.textContent = personality.category;
		info.appendChild(categoryTag);

		const titleP = document.createElement("p");
		titleP.classList.add("title");
		titleP.textContent = personality.title;
		info.appendChild(titleP);

		const subTitleP = document.createElement("p");
		subTitleP.classList.add("sub-title");
		subTitleP.textContent = personality.subtitle;
		info.appendChild(subTitleP);

		const credits = document.createElement("div");
		credits.classList.add("credits");

		const authorP = document.createElement("p");
		authorP.classList.add("author");
		authorP.textContent = personality.author;
		credits.appendChild(authorP);

		const dot1 = document.createElement("span");
		dot1.classList.add("dot");
		credits.appendChild(dot1);

		const dateP = document.createElement("p");
		dateP.classList.add("date");
		dateP.textContent = personality.date;
		credits.appendChild(dateP);

		const dot2 = document.createElement("span");
		dot2.classList.add("dot");
		credits.appendChild(dot2);

		const readingTimeP = document.createElement("p");
		readingTimeP.classList.add("reading-time");
		readingTimeP.textContent = personality.reading_time + " read";
		credits.appendChild(readingTimeP);

		info.appendChild(credits);
		articleContainer.appendChild(info);

		const img = document.createElement("img");
		img.classList.add("article-img");
		img.src = personality.image_src;
		img.alt = `${personality.name}'s image`;
		img.loading = "lazy";
		articleContainer.appendChild(img);
		storyLink.appendChild(articleContainer);

		return storyLink;
	}

	// ----------------------------
	// Load All Articles: Modularized rendering of main article and latest articles grid
	// ----------------------------
	async function loadAllArticles() {
		try {
			// Fetch all personalities with a single call
			const snapshot = await get(personalitiesRef);
			if (!snapshot.exists()) {
				console.log("No data found.");
				return;
			}

			const personalitiesArray = Object.values(snapshot.val());

			// --- Main Article Section ---
			const randIndex = Math.floor(Math.random() * personalitiesArray.length);
			const mainPerson = personalitiesArray[randIndex];
			headDiv.style.display = "none";
			headDiv.appendChild(renderMainArticle(mainPerson));

			// --- Latest Articles Grid ---
			latestArticlesGrids.innerHTML = "";
			personalitiesArray.forEach((personality) => {
				latestArticlesGrids.appendChild(renderArticle(personality));
			});

			headDiv.style.display = "flex";
			latestArticlesGrids.style.display = "flex";
		} catch (err) {
			console.error("Error loading articles:", err);
		}
	}

	// Calling the integrated function
	loadAllArticles();

	// the stories page
	const params = new URLSearchParams(window.location.search);
	const articleId = params.get("id");

	async function loadStory(id) {
		try {
			const snapshot = await get(child(dbRef, `personalities/${id}`));
			if (snapshot.exists()) {
				const article = snapshot.val();
				renderStory(article);
			} else {
				document.getElementById("storyContainer").innerHTML =
					"<p>Article not found :( </p>";
			}
		} catch (error) {
			console.log("Error fetching article:", error);
		}
	}

	function renderStory(article) {
		const container = document.getElementById("storyContainer");
		container.innerHTML = "";

		const titleEl = document.createElement("h1");
		titleEl.textContent = article.title;
		container.appendChild(titleEl);

		const metaEL = document.createElement("p");
		metaEL.textContent = `By ${article.author} on ${article.date}`;
		container.appendChild(metaEL);

		const imgEl = document.createElement("img");
		imgEl.src = `${article.image_src}`;
		container.appendChild(imgEl);

		const contentEl = document.createElement("p");
		contentEl.innerText = article.story;
		container.appendChild(contentEl);
	}

	// display article
	if (articleId) {
		loadStory(articleId);
	}

	// back btn
	backBtnEl.addEventListener("click", () => {
		window.history.back();
	});

	// submit email to db
	// footerSearchInput.addEventListener("keyup", function (e) {
	// 	let user = "Shayne Wuver";
	// 	if (e.key == "Enter") {
	// 		set(ref(db, "emails/" + user), {
	// 			name: user,
	// 			email: this.value,
	// 		})
	// 			.then(() => {
	// 				console.log("Email search submitted: ", this.value);
	// 			})
	// 			.catch((error) => {
	// 				console.log("unsuccessful: " + error);
	// 			});
	// 	}
	// });

	// date for footer
	const year = date.getFullYear();
	copyrightDiv.innerHTML = "";
	const copyrightText = document.createElement("p");
	copyrightText.innerHTML = `&copy; ${year} Rise from Rejections. All rights reserved.`;
	copyrightDiv.appendChild(copyrightText);
});
