/* UTILITY FUNCTIONS */
let cities;
fetchJSON(location.href + "json/wilayah.json").then(
  (response) => (cities = response)
);

function addText(text, whoIsTalking) {
  const newParagraph = document.createElement("p");
  newParagraph.textContent = text;
  newParagraph.classList.add(whoIsTalking);

  textBox.appendChild(newParagraph);
  newParagraph.scrollIntoView();
}

function updateText(text) {
  input.value = text;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onstart = () => {
    recognition.stop();
    console.log("stop recognition and start speaking");
    addText(text, "assistant");
  };
  utterance.onend = () => {
    recognition.start();
    console.log("start recognition and stop speaking");

    // removing the event listener
    utterance.onstart = () => {};
    utterance.onend = () => {};
  };

  synth.speak(utterance);
}

function executeCommand(transcript) {
  transcript = transcript.toLowerCase();
  const command = commands.find((cmd) => {
    return transcript.startsWith(cmd.command);
  });
  if (command) {
    const param = transcript.substring(command.command.length + 1);
    command.execute(param);
  }
}

function tellTheTime() {
  const now = new Date();
  const time = now.getHours() + ":" + now.getMinutes();
  speak("Sekarang jam " + time);
}

function tellTheDate() {
  const now = new Date();
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
  ];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const day = days[now.getDay()];
  const month = months[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();

  speak(`Hari ini hari ${day}. Tanggal ${date} ${month} ${year}`);
}

async function definisi(kata) {
  speak("Bentar cuy, gua googling dulu.");
  const base_url = "https://new-kbbi-api.herokuapp.com/cari/" + kata;
  let response = await fetchJSON(base_url);
  console.log(response);
  if (!response.status) {
    speak("Ga dapet cuy. Aowkaokawok.");
    speak(response.message);
    return;
  }
  const deskripsi = response.data[0].arti.map((e) => e.deskripsi);

  for (let i = 0; i < deskripsi.length; i++) {
    const kalimat = deskripsi[i].replace(/--/g, kata);
    speak(`${i + 1}. ${kalimat}`);
  }
  speak("Itu aja cuy.");
}

async function getWeather(city) {
  if (!cities) {
    speak(
      "tunggu bentar cuy. gua belum selesai ngeload data wilayah. coba lagi nanti."
    );
    return;
  }

  speak("Bentar cuy, gua cari dulu.");

  const wilayah = cities.find((kota) => {
    return [
      kota.provinsi.toLowerCase(),
      kota.kota.toLowerCase(),
      kota.kecamatan.toLowerCase(),
    ].some((e) => e.includes(city.toLowerCase()));
  });

  if (!wilayah) {
    speak(city + " itu daerah mana cuy?");
    return;
  }

  const base_url = "https://ibnux.github.io/BMKG-importer/cuaca/";
  const { id, provinsi, kota, kecamatan } = wilayah;
  const url = base_url + id + ".json";
  const weathers = await fetchJSON(url);
  if (weathers.length > 0) {
    const daerah = `Provinsi ${provinsi}, ${kota}, Kecamatan ${kecamatan}`;
    speak("Ini cuaca di wilayah " + daerah + " cuy");

    for (const { jamCuaca, cuaca, humidity, tempC } of weathers) {
      const [tanggal, jam] = jamCuaca.split(" ");
      const kalimat = `Tanggal ${tanggal.split("-")[2]}, jam ${jam
        .split(":")[0]
        .replace(
          "00",
          "12 malam"
        )}. ${cuaca}, dengan kelembapan ${humidity} dan temperatur ${tempC} derajat celcius`;

      speak(kalimat);
    }

    speak("Itu aja cuy");
  }
}

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response.json()))
      .catch(reject);
  });
}
