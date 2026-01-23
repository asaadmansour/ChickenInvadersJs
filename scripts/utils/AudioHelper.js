export function playBackgroundMusic(audioPath, volume = 0.7, loop = true) {
  window.addEventListener("DOMContentLoaded", function () {
    const audio = new Audio(audioPath);
    audio.preload = "auto";
    audio.volume = volume;
    audio.loop = loop;
    audio.play();
  });
}

export function addButtonHoverSound(audioPath = "../assets/audio/Click.wav") {
  window.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        const hoverAudio = new Audio(audioPath);
        hoverAudio.play();
      });
    });
  });
}
