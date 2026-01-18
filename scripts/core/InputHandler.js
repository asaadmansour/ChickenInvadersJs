export class InputHandler {
  constructor() {
    this.bindings = {};
    this.initEventListeners();
  }

  /**
   * Initialize event listeners for keydown and keyup events
   */
  initEventListeners() {
    window.addEventListener("keydown", (event) => {
      if (this.bindings[event.code]) {
        event.preventDefault();
        this.bindings[event.code].pressed = true;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (this.bindings[event.code]) {
        this.bindings[event.code].pressed = false;
      }
    });
  }

  /**
   * Bind a key to an action
   * @param {string} keyCode - The key code (e.g., "ArrowUp", "Space")
   * @param {Function} action - The action to perform when the key is pressed
   */
  bindKey(keyCode, action) {
    this.bindings[keyCode] = { action: action, pressed: false };
  }

  /**
   * Process input and execute bound actions for pressed keys
   */
  processInput() {
    for (const key in this.bindings) {
      if (this.bindings[key].pressed) {
        this.bindings[key].action();
      }
    }
  }

  /**
   * Clear all key bindings
   */
  clearBindings() {
    this.bindings = {};
  }
}
