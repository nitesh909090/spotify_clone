const audio = document.getElementById("audio-player");

let songs = [];
let currentIndex = 0;

// ================= SEARCH SONG =================
async function searchSong() {

    const query = document.getElementById("searchInput").value;

    const response = await fetch(
        api key
    );

    const data = await response.json();

    songs = data.results;

    let html = "";

    songs.forEach((song, index) => {

        html += `
        <div class="card">

            <img src="${song.artworkUrl100}">

            <h4>${song.trackName}</h4>

            <p>${song.artistName}</p>

            <button onclick="playSongByIndex(${index})">
                Play
            </button>

        </div>
        `;
    });

    document.getElementById("results").innerHTML = html;
}

// ================= PLAY BY INDEX =================
function playSongByIndex(index) {

    currentIndex = index;

    const song = songs[index];

    audio.src = song.previewUrl;
    audio.play();

    document.getElementById("currentSong").innerText =
        song.trackName + " - " + song.artistName;

    document.getElementById("playPauseBtn").innerText = "⏸";
}

// ================= TOGGLE PLAY/PAUSE =================
function togglePlayPause() {

    const btn = document.getElementById("playPauseBtn");

    if (audio.paused) {
        audio.play();
        btn.innerText = "⏸";
    } else {
        audio.pause();
        btn.innerText = "▶";
    }
}

// ================= NEXT =================
function nextSong() {

    if (songs.length === 0) return;

    currentIndex++;

    if (currentIndex >= songs.length) currentIndex = 0;

    playSongByIndex(currentIndex);
}

// ================= PREVIOUS =================
function previousSong() {

    if (songs.length === 0) return;

    currentIndex--;

    if (currentIndex < 0) currentIndex = songs.length - 1;

    playSongByIndex(currentIndex);
}

// ================= PROGRESS BAR =================
const progressBar = document.getElementById("progressBar");
const currentTimeText = document.getElementById("currentTime");
const durationText = document.getElementById("duration");

audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    progressBar.value =
        (audio.currentTime / audio.duration) * 100;

    currentTimeText.innerText = formatTime(audio.currentTime);
    durationText.innerText = formatTime(audio.duration);
});

progressBar.addEventListener("input", () => {

    audio.currentTime =
        (progressBar.value / 100) * audio.duration;
});

// ================= TIME FORMAT =================
function formatTime(seconds) {

    if (isNaN(seconds)) return "0:00";

    let m = Math.floor(seconds / 60);
    let s = Math.floor(seconds % 60);

    if (s < 10) s = "0" + s;

    return `${m}:${s}`;
}

// ================= LOAD DURATION =================
audio.addEventListener("loadedmetadata", () => {
    durationText.innerText = formatTime(audio.duration);
});

// ================= AUTO NEXT =================
audio.addEventListener("ended", () => {
    nextSong();
});

// ================= VOLUME =================
document.getElementById("volumeSlider").addEventListener("input", function () {
    audio.volume = this.value;
});

// ================= STATIC CARD PLAY =================
function playSong(file) {

    audio.src = file;
    audio.play();

    document.getElementById("currentSong").innerText = file;
    document.getElementById("playPauseBtn").innerText = "⏸";
}

// ================= LOGOUT =================
function logout() {

    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// ================= PWA INSTALL =================
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

function installApp() {

    if (!deferredPrompt) {
        alert("Install option not available. Open in Chrome (HTTPS/localhost)");
        return;
    }

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choice) => {

        if (choice.outcome === "accepted") {
            console.log("App installed");
        }

        deferredPrompt = null;
    });
}
if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("/sw.js")
        .then(() => console.log("SW Registered"))
        .catch(err => console.log("SW Error", err));
}
