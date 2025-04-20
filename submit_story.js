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

// wait for everything to load
document.addEventListener("DOMContentLoaded", function () {
	//getting html elements
	const submitBtn = document.getElementById("submitBtn");
	const title = document.getElementById("storyTitle-input");
	const subtitle = document.getElementById("storySubtitle-input");
	const category = document.getElementById("storyCategory-input");
	const story = document.getElementById("story-input");
	const authorName = document.getElementById("authorName");

	// function for character limit
	function inputCharCounter(inputId, counterId, max) {
		// variables
		const input = document.getElementById(inputId);
		const counter = document.getElementById(counterId);
		const maxChar = max;

		// main part
		input.addEventListener("input", () => {
			const count = input.value.length;
			counter.textContent = `${count} / ${maxChar} characters`;
			if (count < max - 5) {
				counter.style.color = "#8e9196";
				counter.style.fontWeight = "485";
			} else {
				counter.style.color = "red";
				counter.style.fontWeight = "650";
			}
		});
	}

	// functionality
	submitBtn.addEventListener("click", function (e) {
		e.preventDefault();

		if (
			!title.value.trim() ||
			!subtitle.value.trim() ||
			!category.value.trim() ||
			!story.value.trim() ||
			!authorName.value.trim() ||
			!agree.checked
		) {
			alert(`Ma guy fill where you're required to.`);
			return;
		}

		// pushing to db
		set(ref(db, "personalities/" + 1), {
			author: authorName.value,
			title: title.value,
			subtitle: subtitle.value,
			story: story.value,
			industry: category.value,
		})
			.then(() => {
				alert("submitted successfully");
			})
			.catch((error) => {
				console.log("submission unsuccessful: " + error);
			});
	});

	// calling functions

	// story title
	inputCharCounter("storyTitle-input", "titleCharacters", 65);

	// story subtitle
	inputCharCounter("storySubtitle-input", "subtitleCharacters", 110);

	// story
	inputCharCounter("story-input", "storyCharacters", 2500);

	// image description
	inputCharCounter("imgDescription-input", "imgDescCharacters", 1200);
});
