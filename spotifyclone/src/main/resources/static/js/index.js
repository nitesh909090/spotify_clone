// =====================================================
// SPOTIFY CLONE - INDEX.JS
// =====================================================

let audio = null;

let songs = [];

let currentIndex = 0;

let currentSong = null;

const STORAGE = {

    liked: "likedSongs",

    playlist: "myPlaylist",

    downloads: "downloadedSongs",

    recent: "recentlyPlayed"

};

// =====================================================
// USER KEY
// =====================================================

function getCurrentUser() {

    try {

        const user =
            JSON.parse(
                localStorage.getItem("user")
            );

        return user?.email ||
               user?.username ||
               "guest";

    } catch {

        return "guest";
    }
}

function getStorageKey(type) {

    return `${type}_${getCurrentUser()}`;
}

// =====================================================
// STORAGE FUNCTIONS
// =====================================================

function getData(type) {

    try {

        return JSON.parse(
            localStorage.getItem(
                getStorageKey(type)
            )
        ) || [];

    } catch {

        return [];
    }
}

function saveData(type, data) {

    localStorage.setItem(
        getStorageKey(type),
        JSON.stringify(data)
    );
}

// =====================================================
// SEARCH SONG
// =====================================================

async function searchSong() {

    const input =
        document.getElementById("searchInput");

    if (!input) return;

    const query =
        input.value.trim();

    if (!query) {

        alert("Please enter a song name");

        return;
    }

    const results =
        document.getElementById("results");

    if (!results) return;

    results.innerHTML = `
        <p style="color:#b3b3b3;">
            Searching...
        </p>
    `;

    try {

        const response =
            await fetch(
                `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`
            );

        if (!response.ok) {

            throw new Error(
                "Search failed"
            );
        }

        const data =
            await response.json();

        songs =
            (data.results || [])
                .filter(
                    song => song.previewUrl
                );

        if (songs.length === 0) {

            results.innerHTML = `
                <p style="color:#b3b3b3;">
                    No playable songs found.
                </p>
            `;

            return;
        }

        currentIndex = 0;

        displaySearchResults();

    } catch (error) {

        console.error(
            "Search Error:",
            error
        );

        results.innerHTML = `
            <p style="color:#ff5555;">
                Unable to search songs.
                Please try again.
            </p>
        `;
    }
}

// =====================================================
// DISPLAY SEARCH RESULTS
// =====================================================

function displaySearchResults() {

    const results =
        document.getElementById("results");

    if (!results) return;

    let html = "";

    songs.forEach(
        (song, index) => {

            const liked =
                isSongSaved(
                    "liked",
                    song
                );

            const playlist =
                isSongSaved(
                    "playlist",
                    song
                );

            html += `
                <div class="card">

                    <img
                        src="${
                            song.artworkUrl100 ||
                            "https://picsum.photos/200"
                        }"
                        alt="${escapeHTML(
                            song.trackName ||
                            "Song"
                        )}"
                    >

                    <h4>
                        ${escapeHTML(
                            song.trackName ||
                            "Unknown Song"
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            song.artistName ||
                            "Unknown Artist"
                        )}
                    </p>

                    <div class="song-buttons">

                        <button
                            class="play-btn"
                            onclick="playSongByIndex(${index})">
                            ▶ Play
                        </button>

                        <button
                            class="like-btn"
                            onclick="toggleLike(${index})">
                            ${
                                liked
                                ? "❤️ Liked"
                                : "🤍 Like"
                            }
                        </button>

                        <button
                            class="playlist-add-btn"
                            onclick="togglePlaylist(${index})">
                            ${
                                playlist
                                ? "✅ Added"
                                : "➕ Playlist"
                            }
                        </button>

                        <button
                            class="download-song-btn"
                            onclick="downloadSong(${index})">
                            ⬇ Download
                        </button>

                    </div>

                </div>
            `;
        }
    );

    results.innerHTML = html;
}

// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    if (!text) return "";

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// =====================================================
// PLAY SONG
// =====================================================

function playSongByIndex(index) {

    if (!songs[index]) return;

    if (!audio) {

        audio =
            document.getElementById(
                "audio-player"
            );
    }

    if (!audio) {

        alert(
            "Audio player not found."
        );

        return;
    }

    currentIndex = index;

    const song =
        songs[index];

    currentSong = song;

    if (!song.previewUrl) {

        alert(
            "This song does not have a playable preview."
        );

        return;
    }

    audio.src =
        song.previewUrl;

    audio.load();

    audio.play()
        .then(() => {

            updatePlayerUI(song);

        })
        .catch(error => {

            console.error(
                "Audio Play Error:",
                error
            );
        });

    addRecentlyPlayed(song);
}

// =====================================================
// PLAYER UI
// =====================================================

function updatePlayerUI(song) {

    const currentSongElement =
        document.getElementById(
            "currentSong"
        );

    const playPauseBtn =
        document.getElementById(
            "playPauseBtn"
        );

    if (currentSongElement) {

        currentSongElement.innerText =
            `${song.trackName || "Unknown Song"} - ${
                song.artistName ||
                "Unknown Artist"
            }`;
    }

    if (playPauseBtn) {

        playPauseBtn.innerText =
            "⏸";
    }
}

// =====================================================
// TOGGLE PLAY / PAUSE
// =====================================================

function togglePlayPause() {

    if (!audio) {

        audio =
            document.getElementById(
                "audio-player"
            );
    }

    const btn =
        document.getElementById(
            "playPauseBtn"
        );

    if (!audio) {

        alert(
            "Audio player not found."
        );

        return;
    }

    if (!audio.src) {

        alert(
            "Please play a song first."
        );

        return;
    }

    if (audio.paused) {

        audio.play()
            .then(() => {

                if (btn) {
                    btn.innerText = "⏸";
                }

            })
            .catch(error => {

                console.error(
                    "Play Error:",
                    error
                );
            });

    } else {

        audio.pause();

        if (btn) {

            btn.innerText =
                "▶";
        }
    }
}

// =====================================================
// NEXT SONG
// =====================================================

function nextSong() {

    if (songs.length === 0) return;

    currentIndex++;

    if (
        currentIndex >=
        songs.length
    ) {

        currentIndex = 0;
    }

    playSongByIndex(
        currentIndex
    );
}

// =====================================================
// PREVIOUS SONG
// =====================================================

function previousSong() {

    if (songs.length === 0) return;

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex =
            songs.length - 1;
    }

    playSongByIndex(
        currentIndex
    );
}

// =====================================================
// STATIC / LOCAL SONG PLAY
// =====================================================

function playSong(file) {

    if (!file) return;

    if (!audio) {

        audio =
            document.getElementById(
                "audio-player"
            );
    }

    if (!audio) return;

    audio.src = file;

    audio.load();

    audio.play()
        .then(() => {

            const currentSongElement =
                document.getElementById(
                    "currentSong"
                );

            const playPauseBtn =
                document.getElementById(
                    "playPauseBtn"
                );

            if (currentSongElement) {

                currentSongElement.innerText =
                    file;
            }

            if (playPauseBtn) {

                playPauseBtn.innerText =
                    "⏸";
            }

        })
        .catch(error => {

            console.error(
                "Local Audio Error:",
                error
            );
        });

    addRecentlyPlayed({

        trackName: file,

        artistName: "Local Song",

        previewUrl: file,

        artworkUrl100:
            "https://picsum.photos/200"

    });
}

// =====================================================
// LIKE SONG
// =====================================================

function toggleLike(index) {

    const song =
        songs[index];

    if (!song) return;

    let liked =
        getData("liked");

    const existingIndex =
        liked.findIndex(
            item =>
                item.trackId ===
                song.trackId
        );

    if (existingIndex !== -1) {

        liked.splice(
            existingIndex,
            1
        );

    } else {

        liked.unshift(song);
    }

    saveData(
        "liked",
        liked
    );

    displaySearchResults();

    updateLibraryViewIfOpen();
}

// =====================================================
// ADD / REMOVE PLAYLIST
// =====================================================

function togglePlaylist(index) {

    const song =
        songs[index];

    if (!song) return;

    let playlist =
        getData("playlist");

    const existingIndex =
        playlist.findIndex(
            item =>
                item.trackId ===
                song.trackId
        );

    if (existingIndex !== -1) {

        playlist.splice(
            existingIndex,
            1
        );

    } else {

        playlist.unshift(song);
    }

    saveData(
        "playlist",
        playlist
    );

    displaySearchResults();

    updateLibraryViewIfOpen();
}

// =====================================================
// CHECK SONG SAVED
// =====================================================

function isSongSaved(
    type,
    song
) {

    const data =
        getData(type);

    return data.some(
        item =>
            item.trackId ===
            song.trackId
    );
}

// =====================================================
// RECENTLY PLAYED
// =====================================================

function addRecentlyPlayed(song) {

    if (!song) return;

    let recent =
        getData("recent");

    const songId =
        song.trackId ||
        song.previewUrl ||
        song.trackName;

    recent =
        recent.filter(
            item =>
                (
                    item.trackId ||
                    item.previewUrl ||
                    item.trackName
                ) !== songId
        );

    recent.unshift(song);

    if (recent.length > 20) {

        recent =
            recent.slice(0, 20);
    }

    saveData(
        "recent",
        recent
    );

    updateLibraryViewIfOpen();
}

// =====================================================
// DOWNLOAD SONG
// =====================================================

async function downloadSong(index) {

    const song =
        songs[index];

    if (
        !song ||
        !song.previewUrl
    ) {

        alert(
            "Download not available for this song."
        );

        return;
    }

    try {

        const response =
            await fetch(
                song.previewUrl
            );

        if (!response.ok) {

            throw new Error(
                "Download failed"
            );
        }

        const blob =
            await response.blob();

        const url =
            window.URL.createObjectURL(
                blob
            );

        const a =
            document.createElement(
                "a"
            );

        a.href = url;

        a.download =
            `${song.trackName || "song"} - ${
                song.artistName ||
                "artist"
            }.m4a`;

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(
            url
        );

        let downloads =
            getData("downloads");

        const exists =
            downloads.some(
                item =>
                    item.trackId ===
                    song.trackId
            );

        if (!exists) {

            downloads.unshift(song);

            saveData(
                "downloads",
                downloads
            );
        }

        updateLibraryViewIfOpen();

    } catch (error) {

        console.error(
            "Download Error:",
            error
        );

        window.open(
            song.previewUrl,
            "_blank"
        );
    }
}

// =====================================================
// LIBRARY MODAL
// =====================================================

let libraryContainer = null;

function createLibraryContainer() {

    if (libraryContainer) return;

    libraryContainer =
        document.createElement(
            "div"
        );

    libraryContainer.id =
        "libraryView";

    libraryContainer.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: min(900px, 92%);
        max-height: 75vh;
        overflow-y: auto;
        background: #181818;
        color: white;
        border-radius: 15px;
        padding: 25px;
        z-index: 9999;
        box-shadow: 0 10px 40px rgba(0,0,0,.7);
        display: none;
    `;

    document.body.appendChild(
        libraryContainer
    );
}

// =====================================================
// SHOW LIBRARY
// =====================================================

function showLibrary(
    type,
    title
) {

    createLibraryContainer();

    const data =
        getData(type);

    let html = `

        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:20px;
        ">

            <h2>
                ${escapeHTML(title)}
            </h2>

            <button
                onclick="closeLibrary()"
                style="
                    border:none;
                    background:#333;
                    color:white;
                    padding:8px 15px;
                    border-radius:20px;
                    cursor:pointer;
                "
            >
                ✕ Close
            </button>

        </div>
    `;

    if (data.length === 0) {

        html += `

            <p style="color:#aaa;">
                No songs added yet.
            </p>

        `;

    } else {

        data.forEach(
            (song, index) => {

                html += `

                    <div style="
                        display:flex;
                        align-items:center;
                        gap:15px;
                        padding:12px;
                        margin-bottom:10px;
                        background:#242424;
                        border-radius:10px;
                    ">

                        <img
                            src="${
                                song.artworkUrl100 ||
                                "https://picsum.photos/60"
                            }"
                            style="
                                width:60px;
                                height:60px;
                                border-radius:8px;
                                object-fit:cover;
                            "
                            alt="Album"
                        >

                        <div style="flex:1;">

                            <strong>
                                ${escapeHTML(
                                    song.trackName ||
                                    "Unknown Song"
                                )}
                            </strong>

                            <p style="
                                margin:5px 0 0;
                                color:#aaa;
                                font-size:13px;
                            ">

                                ${escapeHTML(
                                    song.artistName ||
                                    "Unknown Artist"
                                )}

                            </p>

                        </div>

                        <button
                            onclick='playLibrarySong(${JSON.stringify(song).replace(/'/g, "&#39;")})'
                            style="
                                background:#1db954;
                                border:none;
                                border-radius:20px;
                                padding:8px 14px;
                                cursor:pointer;
                            "
                        >
                            ▶
                        </button>

                        ${
                            type !== "downloads"
                            ? `

                                <button
                                    onclick="removeFromLibrary('${type}', ${index})"
                                    style="
                                        background:#333;
                                        color:white;
                                        border:none;
                                        border-radius:20px;
                                        padding:8px 12px;
                                        cursor:pointer;
                                    "
                                >
                                    🗑
                                </button>

                            `
                            : ""
                        }

                    </div>

                `;
            }
        );
    }

    libraryContainer.innerHTML =
        html;

    libraryContainer.style.display =
        "block";
}

// =====================================================
// PLAY LIBRARY SONG
// =====================================================

function playLibrarySong(song) {

    if (
        !song ||
        !song.previewUrl
    ) {

        alert(
            "This song cannot be played."
        );

        return;
    }

    if (!audio) {

        audio =
            document.getElementById(
                "audio-player"
            );
    }

    if (!audio) return;

    currentSong =
        song;

    audio.src =
        song.previewUrl;

    audio.load();

    audio.play()
        .then(() => {

            updatePlayerUI(
                song
            );

        })
        .catch(error => {

            console.error(
                "Library Play Error:",
                error
            );
        });

    addRecentlyPlayed(
        song
    );
}

// =====================================================
// REMOVE FROM LIBRARY
// =====================================================

function removeFromLibrary(
    type,
    index
) {

    const data =
        getData(type);

    if (!data[index]) return;

    data.splice(
        index,
        1
    );

    saveData(
        type,
        data
    );

    const titles = {

        liked:
            "❤️ Liked Songs",

        playlist:
            "🎵 My Playlist",

        downloads:
            "⬇ Downloaded Songs",

        recent:
            "🕓 Recently Played"

    };

    showLibrary(
        type,
        titles[type]
    );
}

// =====================================================
// CLOSE LIBRARY
// =====================================================

function closeLibrary() {

    if (libraryContainer) {

        libraryContainer.style.display =
            "none";
    }
}

// =====================================================
// UPDATE OPEN LIBRARY
// =====================================================

function updateLibraryViewIfOpen() {

    if (!libraryContainer) {
        return;
    }

    if (
        libraryContainer.style.display !==
        "block"
    ) {
        return;
    }

    const titleElement =
        libraryContainer.querySelector(
            "h2"
        );

    if (!titleElement) return;

    const title =
        titleElement.innerText;

    let type = null;

    if (
        title.includes(
            "Liked Songs"
        )
    ) {

        type = "liked";

    } else if (
        title.includes(
            "My Playlist"
        )
    ) {

        type = "playlist";

    } else if (
        title.includes(
            "Downloaded Songs"
        )
    ) {

        type = "downloads";

    } else if (
        title.includes(
            "Recently Played"
        )
    ) {

        type = "recent";
    }

    if (!type) return;

    showLibrary(
        type,
        title
    );
}

// =====================================================
// SIDEBAR BUTTONS
// =====================================================

function setupLibraryButtons() {

    const menuItems =
        document.querySelectorAll(
            ".menu-item"
        );

    menuItems.forEach(
        (item, index) => {

            item.style.cursor =
                "pointer";

            item.onclick =
                function () {

                    if (index === 0) {

                        showLibrary(
                            "liked",
                            "❤️ Liked Songs"
                        );

                    } else if (index === 1) {

                        showLibrary(
                            "playlist",
                            "🎵 My Playlist"
                        );

                    } else if (index === 2) {

                        showLibrary(
                            "downloads",
                            "⬇ Downloaded Songs"
                        );

                    } else if (index === 3) {

                        showLibrary(
                            "recent",
                            "🕓 Recently Played"
                        );
                    }
                };
        }
    );
}

// =====================================================
// CREATE PLAYLIST BUTTON
// =====================================================

function setupCreatePlaylist() {

    const button =
        document.querySelector(
            ".playlist-btn"
        );

    if (!button) return;

    button.onclick =
        function () {

            const name =
                prompt(
                    "Enter playlist name:"
                );

            if (
                !name ||
                !name.trim()
            ) {
                return;
            }

            let playlists =
                JSON.parse(
                    localStorage.getItem(
                        getStorageKey(
                            "playlistNames"
                        )
                    )
                ) || [];

            playlists.push({

                name:
                    name.trim(),

                songs: []

            });

            localStorage.setItem(

                getStorageKey(
                    "playlistNames"
                ),

                JSON.stringify(
                    playlists
                )
            );

            alert(
                `Playlist "${name.trim()}" created successfully!`
            );
        };
}

// =====================================================
// SEARCH ENTER KEY
// =====================================================

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );

    if (!input) return;

    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                searchSong();
            }
        }
    );
}

// =====================================================
// PLAYER CONTROLS
// =====================================================

function setupPlayer() {

    audio =
        document.getElementById(
            "audio-player"
        );

    if (!audio) return;

    const progressBar =
        document.getElementById(
            "progressBar"
        );

    const currentTimeText =
        document.getElementById(
            "currentTime"
        );

    const durationText =
        document.getElementById(
            "duration"
        );

    const volumeSlider =
        document.getElementById(
            "volumeSlider"
        );

    audio.addEventListener(
        "timeupdate",
        function () {

            if (
                !audio.duration ||
                isNaN(audio.duration)
            ) {
                return;
            }

            if (progressBar) {

                progressBar.value =
                    (
                        audio.currentTime /
                        audio.duration
                    ) * 100;
            }

            if (currentTimeText) {

                currentTimeText.innerText =
                    formatTime(
                        audio.currentTime
                    );
            }

            if (durationText) {

                durationText.innerText =
                    formatTime(
                        audio.duration
                    );
            }
        }
    );

    audio.addEventListener(
        "loadedmetadata",
        function () {

            if (durationText) {

                durationText.innerText =
                    formatTime(
                        audio.duration
                    );
            }
        }
    );

    audio.addEventListener(
        "play",
        function () {

            const btn =
                document.getElementById(
                    "playPauseBtn"
                );

            if (btn) {

                btn.innerText =
                    "⏸";
            }
        }
    );

    audio.addEventListener(
        "pause",
        function () {

            const btn =
                document.getElementById(
                    "playPauseBtn"
                );

            if (btn) {

                btn.innerText =
                    "▶";
            }
        }
    );

    audio.addEventListener(
        "ended",
        function () {

            nextSong();
        }
    );

    if (progressBar) {

        progressBar.addEventListener(
            "input",
            function () {

                if (
                    !audio.duration ||
                    isNaN(audio.duration)
                ) {
                    return;
                }

                audio.currentTime =
                    (
                        Number(
                            progressBar.value
                        ) / 100
                    ) *
                    audio.duration;
            }
        );
    }

    if (volumeSlider) {

        audio.volume =
            Number(
                volumeSlider.value
            );

        volumeSlider.addEventListener(
            "input",
            function () {

                audio.volume =
                    Number(
                        this.value
                    );
            }
        );
    }
}

// =====================================================
// TIME FORMAT
// =====================================================

function formatTime(seconds) {

    if (
        !seconds ||
        isNaN(seconds)
    ) {

        return "0:00";
    }

    const minutes =
        Math.floor(
            seconds / 60
        );

    let secondsPart =
        Math.floor(
            seconds % 60
        );

    if (
        secondsPart < 10
    ) {

        secondsPart =
            "0" +
            secondsPart;
    }

    return `${minutes}:${secondsPart}`;
}

// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem(
        "user"
    );

    window.location.href =
        "/login";
}

// =====================================================
// PWA INSTALL
// =====================================================

let deferredPrompt = null;

window.addEventListener(
    "beforeinstallprompt",
    function (event) {

        event.preventDefault();

        deferredPrompt =
            event;

        console.log(
            "PWA install available"
        );
    }
);

async function installApp() {

    if (!deferredPrompt) {

        alert(
            "Install option available nahi hai.\n\n" +
            "Chrome me localhost:8080 open karo aur page refresh karo."
        );

        return;
    }

    deferredPrompt.prompt();

    const choice =
        await deferredPrompt.userChoice;

    console.log(
        "Install result:",
        choice.outcome
    );

    deferredPrompt =
        null;
}

// =====================================================
// SERVICE WORKER
// =====================================================

if (
    "serviceWorker" in
    navigator
) {

    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker
                .register(
                    "/sw.js"
                )
                .then(
                    function (
                        registration
                    ) {

                        console.log(
                            "Service Worker registered:",
                            registration.scope
                        );
                    }
                )
                .catch(
                    function (
                        error
                    ) {

                        console.error(
                            "Service Worker error:",
                            error
                        );
                    }
                );
        }
    );
}

// =====================================================
// LOGIN CHECK
// =====================================================

function checkLogin() {

    try {

        const user =
            JSON.parse(
                localStorage.getItem(
                    "user"
                )
            );

        if (!user) {

            window.location.href =
                "/login";

            return false;
        }

        return true;

    } catch {

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "/login";

        return false;
    }
}

// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (!checkLogin()) {
            return;
        }

        setupPlayer();

        setupLibraryButtons();

        setupCreatePlaylist();

        setupSearch();

        createLibraryContainer();

        const user =
            getCurrentUser();

        const usernameElement =
            document.getElementById(
                "username"
            );

        if (
            usernameElement &&
            user
        ) {

            try {

                const userData =
                    JSON.parse(
                        localStorage.getItem(
                            "user"
                        )
                    );

                if (
                    userData &&
                    userData.username
                ) {

                    usernameElement.innerText =
                        userData.username;
                }

            } catch {
                // Ignore invalid user data
            }
        }

        console.log(
            "Spotify Clone JS loaded successfully"
        );
    }
);
	

	