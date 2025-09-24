// Simple tile focus animation (simulate Xbox navigation with keyboard)
const tiles = document.querySelectorAll('.tile');
let focusedIndex = 0;
tiles[focusedIndex].classList.add('focused');

function updateFocus(newIndex) {
  tiles[focusedIndex].classList.remove('focused');
  focusedIndex = newIndex;
  tiles[focusedIndex].classList.add('focused');
  tiles[focusedIndex].scrollIntoView({ behavior: "smooth", block: "center" });
}

document.addEventListener('keydown', (e) => {
  if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
    let cols = 4;
    let newIndex = focusedIndex;
    switch (e.key) {
      case "ArrowRight": newIndex = Math.min(tiles.length - 1, focusedIndex + 1); break;
      case "ArrowLeft": newIndex = Math.max(0, focusedIndex - 1); break;
      case "ArrowUp": newIndex = Math.max(0, focusedIndex - cols); break;
      case "ArrowDown": newIndex = Math.min(tiles.length - 1, focusedIndex + cols); break;
    }
    if (newIndex !== focusedIndex) updateFocus(newIndex);
  }
});

// Add focus style
const style = document.createElement('style');
style.innerHTML = `
  .tile.focused {
    outline: 4px solid #39ff14;
    outline-offset: -8px;
  }
`;
document.head.appendChild(style);
