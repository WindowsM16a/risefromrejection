import { personalities } from "./bts-code/personalities.js";
console.log(personalities[0]);

const hamburger = document.getElementById("hamburger");
const close = document.getElementById("close");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
	navLinks.classList.toggle("active");
	hamburger.style.display = "none";
	close.style.display = "inline";
});
close.addEventListener("click", () => {
	navLinks.classList.toggle("active");
	hamburger.style.display = "inline";
	close.style.display = "none";
});
