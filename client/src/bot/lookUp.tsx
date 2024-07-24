

export function readTextOut(text: string): void {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Speech synthesis not supported by your browser.");
  }
}
