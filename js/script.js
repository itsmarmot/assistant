const textBox = document.getElementById("text");
const bottomBar = document.getElementById("bottom-bar");
const input = document.getElementById("input");
const microphoneButton = document.getElementById("microphone");

const greetings = [
  "halo",
  "coy",
  "cuy",
  "oi",
  "woi",
  "halo cuy",
  "halo coy",
  "oke cuy",
  "oy cuy",
  "woi cuy",
  "halo mbak",
  "woy coy",
  "woi coy",
  "dengerin",
];

const responses = [
  "ada apakah gerangan memanggil saya?",
  "perihal apa yang membuat panjenengan memanggil saya?",
  "ngapa bang?",
  "iya kenapa?",
  "apa cuy?",
  // "nani deska?",
  // "NGAPA LU BANGSAT!!",
  // "NGAPA LU ANJING!!",
];

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "id-ID";

recognition.addEventListener("error", (e) => {
  const error = e.error;
  console.log({ error });
  if (error === "network") {
    speak("Koneksi internet lu ga stabil cuy.");
    speak("Atau emang lu ga punya kuota.");
  }
});

recognition.addEventListener("start", () => {
  console.log("recognition started");
  bottomBar.classList.add("listening");
  microphoneButton.classList.add("listening");
});

recognition.addEventListener("end", () => {
  console.log("recognition ended");
  bottomBar.classList.remove("listening");
  microphoneButton.classList.remove("listening");
});

const synth = window.speechSynthesis;

microphoneButton.addEventListener("click", () => {
  if (microphoneButton.classList.contains("listening")) {
    recognition.stop();
  } else {
    speechSynthesis.cancel();
    recognition.start();
  }
});

/* MAIN CODE */
recognition.addEventListener("result", async (e) => {
  const results = Array.from(e.results);
  const transcript = results
    .map((speechRecognitionResult) => speechRecognitionResult[0])
    .map(
      (speechRecognitionAlternative) => speechRecognitionAlternative.transcript
    )
    .join("");

  updateText(transcript);
  if (e.results[0].isFinal) {
    updateText("");
    addText(transcript, "me");

    if (greetings.includes(transcript.toLowerCase())) {
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      speak(randomResponse);
      return;
    }

    executeCommand(transcript);
  }
});
