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

const articleGrids = document.querySelector(".article-grids");

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

// Load All Articles: Modularized rendering of main article and latest articles grid
async function loadAllArticles() {
	try {
		// Fetch all personalities with a single call
		const snapshot = await get(personalitiesRef);
		if (!snapshot.exists()) {
			console.log("No data found.");
			return;
		}

		const personalitiesArray = Object.values(snapshot.val());

		// Latest Articles Grid
		articleGrids.innerHTML = "";
		personalitiesArray.forEach((personality) => {
			articleGrids.appendChild(renderArticle(personality));
		});

		articleGrids.style.display = "flex";
	} catch (err) {
		console.error("Error loading articles:", err);
	}
}

// Calling the integrated function
loadAllArticles();
