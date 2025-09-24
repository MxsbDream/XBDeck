// --- Gestion du focus et navigation au clavier/manette ---

const tiles = Array.from(document.querySelectorAll('.tile'));
let focusedIndex = 0;
tiles[focusedIndex].focus();

function setFocus(index) {
  tiles[focusedIndex].blur();
  focusedIndex = index;
  tiles[focusedIndex].focus();
}

// Navigation clavier (flèches)
document.addEventListener('keydown', (e) => {
  const cols = 4;
  let idx = focusedIndex;
  if (['ArrowRight', 'd', 'D'].includes(e.key)) idx = Math.min(tiles.length - 1, idx + 1);
  if (['ArrowLeft', 'q', 'Q', 'a', 'A'].includes(e.key)) idx = Math.max(0, idx - 1);
  if (['ArrowUp', 'z', 'Z', 'w', 'W'].includes(e.key)) idx = Math.max(0, idx - cols);
  if (['ArrowDown', 's', 'S'].includes(e.key)) idx = Math.min(tiles.length - 1, idx + cols);

  // Entrée = action (simulate)
  if (e.key === 'Enter' || e.key === ' ') {
    tiles[focusedIndex].classList.add('ring-4', 'ring-green-400');
    setTimeout(() => tiles[focusedIndex].classList.remove('ring-4', 'ring-green-400'), 150);
  }

  if (idx !== focusedIndex) setFocus(idx);
});

// --- Compatibilité manettes (Xbox, PlayStation, Nintendo) ---
let gamepadIndex = null;

function pollGamepad() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const pad = pads[gamepadIndex];
  if (!pad) return;

  // Mapping des boutons pour Xbox/PS/Switch
  const dpadUp    = pad.buttons[12]?.pressed; // D-Pad Up
  const dpadDown  = pad.buttons[13]?.pressed; // D-Pad Down
  const dpadLeft  = pad.buttons[14]?.pressed; // D-Pad Left
  const dpadRight = pad.buttons[15]?.pressed; // D-Pad Right
  const btnA      = pad.buttons[0]?.pressed;  // Xbox A / Switch B / PS X
  const btnB      = pad.buttons[1]?.pressed;  // Xbox B / Switch A / PS O

  // Pour éviter les actions multiples (anti-repeat)
  if (!window._btnState) window._btnState = {};

  function handleBtn(name, pressed, cb) {
    if (!window._btnState[name] && pressed) cb();
    window._btnState[name] = pressed;
  }

  handleBtn('up', dpadUp, () => setFocus(Math.max(0, focusedIndex - 4)));
  handleBtn('down', dpadDown, () => setFocus(Math.min(tiles.length - 1, focusedIndex + 4)));
  handleBtn('left', dpadLeft, () => setFocus(Math.max(0, focusedIndex - 1)));
  handleBtn('right', dpadRight, () => setFocus(Math.min(tiles.length - 1, focusedIndex + 1)));
  handleBtn('A', btnA, () => {
    tiles[focusedIndex].classList.add('ring-4', 'ring-green-400');
    setTimeout(() => tiles[focusedIndex].classList.remove('ring-4', 'ring-green-400'), 150);
  });
  // (B peut servir à revenir en arrière, à personnaliser)
}

window.addEventListener('gamepadconnected', (e) => {
  gamepadIndex = e.gamepad.index;
  console.log('Manette détectée :', e.gamepad.id);
  setInterval(pollGamepad, 1000 / 30); // 30 FPS pour la détection des boutons
});
