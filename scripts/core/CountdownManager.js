export class CountdownManager {
  constructor(options = {}) {
    this.countStart = options.countStart || 3;
    this.countDuration = options.countDuration || 1000; // ms per count
    this.finalMessage = options.finalMessage || "DEFEND EARTH!";
    this.finalMessageDuration = options.finalMessageDuration || 1000;
    this.overlayId = options.overlayId || "countdownOverlay";
    this.numberId = options.numberId || "countdownNumber";
    this.textId = options.textId || "countdownText";
  }

  /**
   * Start the countdown animation
   * Returns a promise that resolves when countdown is complete
   */
  start() {
    return new Promise((resolve) => {
      const overlay = document.getElementById(this.overlayId);
      const numberDisplay = document.getElementById(this.numberId);
      const textDisplay = document.getElementById(this.textId);

      // Ensure overlay is visible
      if (overlay) {
        overlay.classList.remove("hidden");
      }

      let count = this.countStart;

      const updateCountdown = () => {
        if (count > 0) {
          numberDisplay.textContent = count;
          textDisplay.textContent = "";
          count--;
          setTimeout(updateCountdown, this.countDuration);
        } else {
          // Show final message
          numberDisplay.textContent = "";
          textDisplay.textContent = this.finalMessage;

          // Hide overlay and resolve promise
          setTimeout(() => {
            if (overlay) {
              overlay.classList.add("hidden");
            }
            resolve();
          }, this.finalMessageDuration);
        }
      };

      updateCountdown();
    });
  }
}
