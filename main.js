import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
	getDatabase,
	ref,
	push,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
	databaseURL: "https://rise-from-rejection-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const namesInDB = ref(database, "names");
const dobInDB = ref(database, "dob");
const countriesInDB = ref(database, "countries");
const industriesInDB = ref(database, "industries");
const storiesInDB = ref(database, "stories");
const inputFieldEl = document.getElementById("search-input-field");

// JavaScript for the navbar functionality
document.addEventListener("DOMContentLoaded", function () {
	// Get DOM elements
	const hamburger = document.getElementById("hamburger");
	const close = document.getElementById("close");
	const navLinks = document.querySelector(".nav-links");
	const navLinksItems = document.querySelectorAll(".nav-links li a");
	const desktopSearchBtn = document.querySelector(".search-btn");
	const mobileSearchInput = document.querySelector(".mobile-search-input");
	const navbar = document.querySelector(".navbar");

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
				let inputValue = inputFieldEl.value;
				push(namesInDB, inputValue);
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
});
