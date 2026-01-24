let musicMuted = localStorage.getItem("musicMuted") === "true";
let soundEffectsMuted = localStorage.getItem("soundEffectsMuted") === "true";
let backgroundMusicInstance = null;
let gameAudioInstances = [];

export function isMusicMuted() {
  return musicMuted;
}

export function isSoundEffectsMuted() {
  return soundEffectsMuted;
}

export function registerGameAudio(audioInstance) {
  gameAudioInstances.push(audioInstance);
  audioInstance.muted = musicMuted;
}

export function setMusicMuted(muted) {
  musicMuted = muted;
  localStorage.setItem("musicMuted", muted);
  if (backgroundMusicInstance) {
    backgroundMusicInstance.muted = muted;
  }
  gameAudioInstances.forEach((audio) => {
    audio.muted = muted;
  });
}

export function setSoundEffectsMuted(muted) {
  soundEffectsMuted = muted;
  localStorage.setItem("soundEffectsMuted", muted);
}

export function playBackgroundMusic(audioPath, volume = 0.7, loop = true) {
  window.addEventListener("DOMContentLoaded", function () {
    const audio = new Audio(audioPath);
    audio.preload = "auto";
    audio.volume = volume;
    audio.loop = loop;
    audio.muted = musicMuted;
    audio.play();
    backgroundMusicInstance = audio;
  });
}

export function addButtonHoverSound(audioPath = "../assets/audio/Click.wav") {
  window.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        if (!soundEffectsMuted) {
          const hoverAudio = new Audio(audioPath);
          hoverAudio.play();
        }
      });
    });
  });
}

window.addEventListener("keydown", (event) => {
  if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
    return; // This will prevent muting/unmuting when typing
  }

  if (event.key.toLowerCase() === "m") {
    setMusicMuted(!musicMuted);
    const checkbox = document.getElementById("muteMusicCheckbox");
    if (checkbox) {
      checkbox.checked = musicMuted;
    }
  } else if (event.key.toLowerCase() === "s") {
    setSoundEffectsMuted(!soundEffectsMuted);
    const checkbox = document.getElementById("muteSoundEffectsCheckbox");
    if (checkbox) {
      checkbox.checked = soundEffectsMuted;
    }
  }
});
