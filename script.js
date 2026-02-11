// ==================== Configuration ====================
const YOUTUBE_VIDEO_ID = "QehAVGZPIUg"; // Replace with your desired YouTube video ID

// ==================== DOM Elements ====================
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const mainSection = document.getElementById("main-section");
const successSection = document.getElementById("success-section");
const confettiContainer = document.getElementById("confetti-container");
const heartsContainer = document.getElementById("hearts-container");
const bgMusic = document.getElementById("bg-music");
const youtubeVideo = document.getElementById("youtube-video");
const hintText = document.querySelector(".hint-text");

// ==================== State Variables ====================
let noButtonClickCount = 0;
let isNoButtonMoving = false;

// Playful text for the NO button
const noButtonTexts = [
  "Are you sure?",
  "Really?",
  "Think again!",
  "Last chance!",
  "Don't do this!",
  "You're breaking my heart! 💔",
  "I'm gonna cry... 😢",
  "Please? 🥺",
  "Pretty please?",
  "Just say YES! 💖",
];

// ==================== NO Button Movement & Interaction ====================
function moveNoButton() {
  if (isNoButtonMoving) return;
  isNoButtonMoving = true;

  noButtonClickCount++;

  // Change text
  const textIndex = Math.min(noButtonClickCount - 1, noButtonTexts.length - 1);
  noBtn.innerHTML = `<span class="btn-icon">❌</span> ${noButtonTexts[textIndex]}`;

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  // Calculate random position within viewport
  // Ensure it doesn't go off screen (add extra buffer for scrollbars and shake animation)
  const maxX = viewportWidth - btnWidth - 100;
  const maxY = viewportHeight - btnHeight - 100;

  let randomX = Math.random() * maxX;
  let randomY = Math.random() * maxY;

  // Clamp values to ensure it stays within visible area
  randomX = Math.max(20, Math.min(randomX, maxX));
  randomY = Math.max(20, Math.min(randomY, maxY));

  // Apply position
  noBtn.style.position = "fixed";
  noBtn.style.left = randomX + "px";
  noBtn.style.top = randomY + "px";
  noBtn.style.zIndex = "1000"; // Higher z-index just in case

  // Add shake animation
  noBtn.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-10px)" },
      { transform: "translateX(10px)" },
      { transform: "translateX(0)" },
    ],
    {
      duration: 400,
      easing: "ease-in-out",
    },
  );

  // Reset flag
  setTimeout(() => {
    isNoButtonMoving = false;
  }, 400);
}

// ==================== Event Listeners for NO Button ====================
// Desktop hover: Run away!
noBtn.addEventListener("mouseenter", moveNoButton);

// Mobile tap: Run away!
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent click
  moveNoButton();
});

// Click fallback
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton();
});

// ==================== YES Button Click Handler ====================
yesBtn.addEventListener("click", () => {
  // 1. Play Music (if available and allowed)
  if (bgMusic) {
    bgMusic
      .play()
      .catch((err) =>
        console.log(
          "Audio autoplay prevented. User interaction needed sometimes.",
        ),
      );
  }

  // 2. Explode visual effects
  launchConfetti();
  createFloatingHearts(50); // Burst of hearts

  // 3. Play Video (Load immediately to bypass autoplay restrictions)
  youtubeVideo.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`;

  // 4. Smooth Transition
  // Fade out main section
  mainSection.style.transition = "opacity 1s ease-out";
  mainSection.style.opacity = "0";

  // Wait for fade out, then switch
  setTimeout(() => {
    mainSection.style.display = "none";
    successSection.style.display = "flex";

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1000);
});

// ==================== Confetti Animation ====================
function launchConfetti() {
  const confettiCount = 100;
  const colors = [
    "#ff4d6d",
    "#ff8fa3",
    "#fff0f3",
    "#c9184a",
    "#ffd700",
    "#eee",
  ];

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");

      // Random properties
      const left = Math.random() * 100;
      const size = Math.random() * 10 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = Math.random() * 3 + 2;

      confetti.style.left = left + "vw";
      confetti.style.width = size + "px";
      confetti.style.height = size + "px";
      confetti.style.backgroundColor = color;
      confetti.style.animationDuration = duration + "s";

      confettiContainer.appendChild(confetti);

      // Cleanup
      setTimeout(() => confetti.remove(), duration * 1000);
    }, i * 20); // Staggered creation
  }
}

// ==================== Floating Hearts Animation ====================
function createFloatingHearts(count = 1) {
  const symbols = ["❤️", "💖", "💘", "💝", "💕"];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];

    // Random Position
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = Math.random() * 3 + 3 + "s"; // 3-6s
    heart.style.fontSize = Math.random() * 2 + 1 + "rem";

    heartsContainer.appendChild(heart);

    // Cleanup
    setTimeout(() => heart.remove(), 6000);
  }
}

// Continuous background hearts
setInterval(() => createFloatingHearts(1), 800);

// ==================== Responsive Adjustments ====================
window.addEventListener("resize", () => {
  // Bring button back if it gets lost off-screen due to resize
  const rect = noBtn.getBoundingClientRect();
  if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
    noBtn.style.top = "50%";
    noBtn.style.left = "50%";
    noBtn.style.transform = "translate(-50%, -50%)";
    noBtn.style.position = "absolute"; // Reset to layout flow if possible or Keep fixed
  }
});

console.log("%c💖 Created with Love 💖", "font-size: 20px; color: #ff4d6d;");
