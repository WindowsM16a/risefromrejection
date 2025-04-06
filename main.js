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
const firebaseConfig = {
	apiKey: "AIzaSyAkidMW8oxhj2UbMZo3iX31sy8sjEf-zEA",
	authDomain: "rise-from-rejection.firebaseapp.com",
	databaseURL: "https://rise-from-rejection-default-rtdb.firebaseio.com",
	projectId: "rise-from-rejection",
	storageBucket: "rise-from-rejection.firebasestorage.app",
	messagingSenderId: "976543624439",
	appId: "1:976543624439:web:ecb3feb91d44ac70b437f2",
};

// reading values from objects in the array

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

// DOM elements
const inputFieldEl = document.getElementById("search-input-field");

const headDiv = document.querySelector(".head-article-container");

// footer date
const date = new Date();
let copyrightDiv = document.getElementById("copyrights");

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
// 			console.log("unsuccessful: ", error);
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
// 			console.log(error);
// 		});
// }
// getData();

// uploading and updating the local personalities (10 for now). i'll stop doing local stuff once i learn auth so only i can write to the db.
personalities.forEach((person) => {
	const personRef = ref(db, "personalities/" + person.id);
	set(personRef, person);
});

// JavaScript for the navbar functionality
document.addEventListener("DOMContentLoaded", function () {
	// Get DOM elements
	const hamburger = document.getElementById("hamburger");
	const close = document.getElementById("close");
	const navLinks = document.querySelector(".nav-links");
	const navLinksItems = document.querySelectorAll(".nav-links li a");
	const desktopSearchBtn = document.querySelector(".search-btn");
	const mobileSearchInput = document.querySelector(".mobile-search-input");

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

	// dynamically rendering articles
	// todo: the main article should be random

	// we're using jk rowling's for tests
	function mainArticle() {
		let randNum = Math.floor(Math.random() * 10 + 1);
		get(child(dbRef, "personalities/" + randNum)).then((snapshot) => {
			if (snapshot.exists()) {
				// so i don't keep writing val
				const snapVal = snapshot.val();

				const jCountry = snapVal.country;
				// console.log("this is it: " + jCountry);
				const jInd = snapVal.industry;
				const jImgSrc = snapVal.image_src;
				const jAuthor = snapVal.author;
				const jWriteDate = snapVal.date;
				const jCategory = snapVal.category;
				const jReadTime = snapVal.reading_time;
				const jName = snapVal.name;
				const jTitle = snapVal.title;
				const jSubtitle = snapVal.subtitle;

				headDiv.style.display = "none";
				headDiv.innerHTML = `<div class="gradient"></div>
			<div class="info">
			<p class="category-tag">${jCategory}</p>
			<p class="head-title title">${jTitle}
			</p>
			<p class="head-sub-title sub-title">${jSubtitle}
			</p>
			<div class="credits">
			<p class="author">${jAuthor}</p>
			<span class="dot"></span>
			<p class="date">${jWriteDate}</p>
			<span class="dot"></span>
			<p class="reading-time">${jReadTime} read</p>
			</div>
			</div>
			<img
			class="article-img"
			src="${jImgSrc}"
			alt="${jName} image"
			/>`;

				// display it
				headDiv.style.display = "block";
			}
		});
	}
	// call the function
	mainArticle();

	// date for footer
	let year = date.getFullYear();
	// console.log(year);
	copyrightDiv.innerHTML = "";
	let copyrightText = document.createElement("p");
	copyrightText.innerHTML = `&copy; ${year} Rise from Rejections. All rights reserved.`;
	copyrightDiv.append(copyrightText);
});
