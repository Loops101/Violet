// ==================== Game Logic (Intro & Puzzle) ====================

// Elements
const introSection = document.getElementById('intro-section');
const planeContainer = document.getElementById('plane-container');
const envelopeContainer = document.getElementById('envelope-container');
const envelopeLottie = document.getElementById('envelope-lottie'); // New Lottie Element
const puzzleSection = document.getElementById('puzzle-section');
const puzzleContainer = document.getElementById('puzzle-container');
const puzzleHint = document.getElementById('puzzle-hint');
const mainSectionGame = document.getElementById('main-section');

// State
let puzzleSolved = false;

// ==================== Intro Animation ====================
document.addEventListener('DOMContentLoaded', () => {
    // 0. Enforce Initial Visibility State
    // Strictly hide other sections to prevent overlap
    if (puzzleSection) {
        puzzleSection.classList.add('hidden');
        puzzleSection.style.display = 'none'; // Double down
    }
    if (mainSectionGame) {
        mainSectionGame.classList.add('hidden');
        mainSectionGame.style.display = 'none'; // Double down
    }
    if (introSection) {
        introSection.style.display = 'flex';
        introSection.classList.remove('hidden');
    }

    // 1. Setup Background
    if (SITE_DETAILS.backgroundImage) {
        // Apply background to body, but Intro might cover it if responsive
        document.body.style.backgroundImage = `url('${SITE_DETAILS.backgroundImage}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }

    // 2. Start Plane Animation
    setTimeout(() => {
        planeContainer.classList.add('fly-in');
    }, 500);

    // 3. Show Envelope after Plane lands
    planeContainer.addEventListener('animationend', () => {
        planeContainer.style.display = 'none';
        envelopeContainer.classList.remove('hidden');
        envelopeContainer.classList.add('fade-in');
    });

    // 4. Envelope Click
    // Lottie component doesn't always bubble clicks perfectly, so we click the container
    envelopeContainer.addEventListener('click', () => {
        // Try to play music on first interaction
        const audio = document.getElementById('bg-music');
        if (audio) {
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio autoplay blocked:", e));
        }

        // Transition: Intro -> Puzzle
        introSection.classList.add('fade-out');

        setTimeout(() => {
            introSection.style.display = 'none';

            // Show Puzzle
            puzzleSection.style.display = 'flex'; // Explicit
            puzzleSection.classList.remove('hidden');
            puzzleSection.classList.add('fade-in');

            initPuzzle();
        }, 800); // Wait for fade-out
    });
});

// ==================== Puzzle Logic ====================
function initPuzzle() {
    // Use avatar image for puzzle, actual image for reveal
    const avatarSrc = SITE_DETAILS.avatarImage || SITE_DETAILS.puzzleImage || 'images/Her.jpg';
    const actualSrc = SITE_DETAILS.actualImage || avatarSrc;

    // Store actual image for reveal after completion
    puzzleContainer.dataset.actualImage = actualSrc;

    // 1. Load Avatar Image to get natural dimensions
    const validImage = new Image();
    validImage.src = avatarSrc;

    validImage.onload = () => {
        const aspect = validImage.naturalWidth / validImage.naturalHeight;

        let rows, cols;

        // Auto-detect best grid based on aspect ratio
        if (aspect >= 1.25) {
            // Landscape
            cols = 4;
            rows = 3;
        } else if (aspect <= 0.8) {
            // Portrait
            cols = 3;
            rows = 4;
        } else {
            // Square-ish
            cols = 3;
            rows = 3;
        }

        // Allow override from details.js if present (e.g., SITE_DETAILS.grid = { rows: 3, cols: 3 })
        if (SITE_DETAILS.grid) {
            if (SITE_DETAILS.grid.rows) rows = SITE_DETAILS.grid.rows;
            if (SITE_DETAILS.grid.cols) cols = SITE_DETAILS.grid.cols;
        }

        createPuzzleGrid(rows, cols, avatarSrc, aspect);
    };

    validImage.onerror = () => {
        console.error("Failed to load puzzle image, fallback to square 3x3");
        createPuzzleGrid(3, 3, avatarSrc, 1);
    };
}

function createPuzzleGrid(rows, cols, imageSrc, imageAspect) {
    const pieces = [];

    // Calculate Container Size
    const maxWidth = Math.min(window.innerWidth - 40, 400); // Max width 400px
    const maxHeight = window.innerHeight - 200; // Leave space for headers

    let containerWidth, containerHeight;

    if (imageAspect > 1) {
        // Landscape or Square constraint by width
        containerWidth = maxWidth;
        containerHeight = containerWidth / imageAspect;
    } else {
        // Portrait constraint by height (or width if it fits)
        containerHeight = Math.min(maxHeight, maxWidth / imageAspect);
        containerWidth = containerHeight * imageAspect;
    }

    // Ensure it doesn't overflow width on mobile
    if (containerWidth > window.innerWidth - 40) {
        containerWidth = window.innerWidth - 40;
        containerHeight = containerWidth / imageAspect;
    }

    const pieceWidth = containerWidth / cols;
    const pieceHeight = containerHeight / rows;

    puzzleContainer.style.width = `${containerWidth}px`;
    puzzleContainer.style.height = `${containerHeight}px`;
    puzzleContainer.style.display = 'grid';
    puzzleContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    puzzleContainer.style.gap = '2px';

    // Create pieces
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.style.width = `100%`; // Fill grid cell
            piece.style.height = `100%`;
            piece.style.backgroundImage = `url('${imageSrc}')`;
            // Important: background-size must match container size
            piece.style.backgroundSize = `${containerWidth}px ${containerHeight}px`;
            piece.style.backgroundPosition = `-${c * pieceWidth}px -${r * pieceHeight}px`;
            piece.dataset.r = r;
            piece.dataset.c = c;
            piece.dataset.idx = r * cols + c;
            piece.draggable = true;

            // Touch support
            piece.addEventListener('touchstart', handleTouchStart, { passive: false });
            piece.addEventListener('touchmove', handleTouchMove, { passive: false });
            piece.addEventListener('touchend', handleTouchEnd);

            pieces.push(piece);
        }
    }

    // Shuffle
    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);

    // Render
    puzzleContainer.innerHTML = '';
    shuffledPieces.forEach(piece => {
        puzzleContainer.appendChild(piece);
        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragover', dragOver);
        piece.addEventListener('drop', dragDrop);
        piece.addEventListener('touchstart', handleTouchStart);
    });
}

// Drag & Drop Vars
let draggedPiece = null;

function dragStart(e) {
    draggedPiece = this;
    e.dataTransfer.setData("text/plain", ""); // Firefox requirement
}

function dragOver(e) {
    e.preventDefault();
}

function dragDrop(e) {
    e.preventDefault();
    if (this === draggedPiece) return;
    swapPieces(draggedPiece, this);
    checkWin();
}

// Touch Logic (True drag-and-drop for mobile)
let draggedTouchPiece = null;
let dragClone = null;
let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;
let selectedPiece = null; // For tap-to-swap mode

function handleTouchStart(e) {
    e.preventDefault();

    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    draggedTouchPiece = this;
    isDragging = false;

    // Add slight scale to indicate it's ready to drag
    this.style.transition = 'transform 0.1s ease';
    this.style.transform = 'scale(1.05)';
}

function handleTouchMove(e) {
    e.preventDefault();

    if (!draggedTouchPiece) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    // Start dragging if moved more than 10px (allows tap-to-swap for smaller movements)
    if (!isDragging && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
        isDragging = true;

        // Clear any selected piece when starting to drag
        if (selectedPiece) {
            selectedPiece.style.opacity = '1';
            selectedPiece.style.transform = 'none';
            selectedPiece.style.border = '';
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
        }

        // Create a visual clone that follows the finger
        dragClone = draggedTouchPiece.cloneNode(true);
        dragClone.style.position = 'fixed';
        dragClone.style.zIndex = '1000';
        dragClone.style.opacity = '0.8';
        dragClone.style.pointerEvents = 'none';
        dragClone.style.width = draggedTouchPiece.offsetWidth + 'px';
        dragClone.style.height = draggedTouchPiece.offsetHeight + 'px';
        dragClone.style.transform = 'scale(1.1)';
        document.body.appendChild(dragClone);

        // Make original piece semi-transparent
        draggedTouchPiece.style.opacity = '0.3';
    }

    // Move the clone with the finger
    if (isDragging && dragClone) {
        dragClone.style.left = (touch.clientX - draggedTouchPiece.offsetWidth / 2) + 'px';
        dragClone.style.top = (touch.clientY - draggedTouchPiece.offsetHeight / 2) + 'px';
    }
}

function handleTouchEnd(e) {
    if (!draggedTouchPiece) return;

    if (isDragging && dragClone) {
        // Find which piece is under the touch point
        const touch = e.changedTouches[0];
        dragClone.style.display = 'none'; // Temporarily hide clone
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        dragClone.style.display = 'block';

        // Check if we're over another puzzle piece
        const targetPiece = elementBelow?.closest('.puzzle-piece');

        if (targetPiece && targetPiece !== draggedTouchPiece) {
            // Swap the pieces
            swapPieces(draggedTouchPiece, targetPiece);
            checkWin();
        }

        // Remove the clone
        if (dragClone && dragClone.parentNode) {
            dragClone.parentNode.removeChild(dragClone);
        }
        dragClone = null;

        // Reset the dragged piece
        draggedTouchPiece.style.opacity = '1';
        draggedTouchPiece.style.transform = 'none';
        draggedTouchPiece.style.transition = '';
    } else {
        // TAP-TO-SWAP MODE (didn't move enough to trigger drag)
        if (!selectedPiece) {
            // First tap - select this piece
            selectedPiece = draggedTouchPiece;
            selectedPiece.classList.add('selected');
            selectedPiece.style.opacity = '0.7';
            selectedPiece.style.transform = 'scale(1.05)';
            selectedPiece.style.border = '3px solid #ff69b4';
            selectedPiece.style.transition = '';
        } else if (selectedPiece === draggedTouchPiece) {
            // Tapped same piece - deselect
            selectedPiece.style.opacity = '1';
            selectedPiece.style.transform = 'none';
            selectedPiece.style.border = '';
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
        } else {
            // Second tap on different piece - swap
            swapPieces(selectedPiece, draggedTouchPiece);
            checkWin();

            // Reset both pieces
            selectedPiece.style.opacity = '1';
            selectedPiece.style.transform = 'none';
            selectedPiece.style.border = '';
            selectedPiece.classList.remove('selected');
            draggedTouchPiece.style.opacity = '1';
            draggedTouchPiece.style.transform = 'none';
            selectedPiece = null;
        }
    }

    draggedTouchPiece = null;
    isDragging = false;
}


function swapPieces(piece1, piece2) {
    const parent = piece1.parentNode;
    const sibling1 = piece1.nextSibling === piece2 ? piece1 : piece1.nextSibling;

    // Simple DOM swap using placeholders
    const temp = document.createElement('div');
    parent.insertBefore(temp, piece1);
    parent.insertBefore(piece1, piece2);
    parent.insertBefore(piece2, temp);
    parent.removeChild(temp);
}

function checkWin() {
    const currentPieces = Array.from(puzzleContainer.children);
    let isCorrect = true;

    currentPieces.forEach((piece, index) => {
        if (parseInt(piece.dataset.idx) !== index) {
            isCorrect = false;
        }
    });

    if (isCorrect && !puzzleSolved) {
        puzzleSolved = true;
        onPuzzleComplete();
    }
}

function onPuzzleComplete() {
    puzzleHint.textContent = SITE_DETAILS.successMessage;
    puzzleContainer.style.border = "none";
    puzzleContainer.style.gap = "0";

    // Get the actual image to reveal
    const actualImageSrc = puzzleContainer.dataset.actualImage;

    // First, remove borders from puzzle pieces to show seamless avatar image
    const pieces = document.querySelectorAll('.puzzle-piece');
    pieces.forEach(p => {
        p.style.border = 'none';
        p.style.transform = 'none';
    });

    // Get current puzzle container dimensions to maintain size
    const containerWidth = puzzleContainer.offsetWidth;
    const containerHeight = puzzleContainer.offsetHeight;

    // Wait a moment for borders to disappear, then start fade transition
    setTimeout(() => {
        // Create actual image element (hidden initially)
        const actualImg = document.createElement('img');
        actualImg.src = actualImageSrc;
        actualImg.style.position = 'absolute';
        actualImg.style.top = '0';
        actualImg.style.left = '0';
        actualImg.style.width = containerWidth + 'px';
        actualImg.style.height = containerHeight + 'px';
        actualImg.style.objectFit = 'cover';
        actualImg.style.borderRadius = '10px';
        actualImg.style.opacity = '0';
        actualImg.style.transition = 'opacity 1s ease-in-out';
        actualImg.style.zIndex = '10';

        // Make puzzle container relative for absolute positioning
        puzzleContainer.style.position = 'relative';
        puzzleContainer.style.width = containerWidth + 'px';
        puzzleContainer.style.height = containerHeight + 'px';

        // Add actual image on top
        puzzleContainer.appendChild(actualImg);

        // Trigger fade in after a brief moment
        setTimeout(() => {
            actualImg.style.opacity = '1';
        }, 50);

        // After fade completes, remove puzzle pieces
        setTimeout(() => {
            // Remove all puzzle pieces
            pieces.forEach(p => p.remove());

            // Keep image centered and at same size - don't change positioning
            actualImg.style.position = 'absolute';
            actualImg.style.top = '50%';
            actualImg.style.left = '50%';
            actualImg.style.transform = 'translate(-50%, -50%)';

            // Wait 3 seconds showing the actual image, then transition to main section
            setTimeout(() => {
                // Smooth fade and scale transition
                puzzleSection.style.transition = "transform 1s ease, opacity 1s ease";
                puzzleSection.style.transform = "scale(0.8)";
                puzzleSection.style.opacity = "0";

                setTimeout(() => {
                    puzzleSection.style.display = 'none';

                    // Show Main Section with fade in
                    mainSectionGame.style.display = 'flex';
                    mainSectionGame.classList.remove('hidden');
                    mainSectionGame.classList.add('fade-in');

                    // Play background music when main section loads
                    const audio = document.getElementById('bg-music');
                    if (audio && SITE_DETAILS.bgAudio) {
                        audio.src = SITE_DETAILS.bgAudio;
                        audio.volume = 0.5;
                        audio.play().catch(e => console.log("Audio autoplay blocked:", e));
                    }
                }, 1000);
            }, 3000); // 3-second delay showing actual image
        }, 1000); // Wait for fade to complete
    }, 300); // Brief delay after removing borders
}
