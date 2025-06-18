let currentSong = null;
let isPlaying = false;
let audio = document.getElementById('audio-player');

let songs = {
    'feel-it': { title: 'feel it', artist: 'd4vd', cover: 'covers/feel-it.png', file: 'songs/feel-it.mp3' },
    'saturn': { title: 'saturn', artist: 'sza', cover: 'covers/saturn.png', file: 'songs/saturn.mp3' },
    'glue-song': { title: 'glue song', artist: 'beabadoobee', cover: 'covers/glue-song.png', file: 'songs/glue-song.mp3' },
    'so-cynical': { title: 'so cynical (badum)', artist: 'le sserafim', cover: 'covers/so-cynical.png', file: 'songs/so-cynical.mp3' },
    'right-now': { title: 'right now', artist: 'newjeans', cover: 'covers/right-now.png', file: 'songs/right-now.mp3' },
    'ordinary': { title: 'ordinary', artist: 'alex warren', cover: 'covers/ordinary.png', file: 'songs/ordinary.mp3' },
    'nokia': { title: 'nokia', artist: 'drake', cover: 'covers/nokia.png', file: 'songs/nokia.mp3' },
    'bad-dreams': { title: 'bad dreams', artist: 'teddy swims', cover: 'covers/bad-dreams.png', file: 'songs/bad-dreams.mp3' }
};

function updateUserDisplay() {
    let nameInput = document.getElementById('username');
    let userDisplay = document.getElementById('user-display');
    
    if (nameInput && userDisplay) {
        let savedName = localStorage.getItem('spootifyUser');
        if (savedName) {
            nameInput.value = savedName;
            userDisplay.textContent = `welcome, ${savedName}`;
        }
    }
}

function saveUserName() {
    let nameInput = document.getElementById('username');
    let userDisplay = document.getElementById('user-display');
    
    if (nameInput && userDisplay) {
        let name = nameInput.value.trim();
        if (name) {
            localStorage.setItem('spootifyUser', name);
            userDisplay.textContent = `welcome, ${name}`;
        } else {
            localStorage.removeItem('spootifyUser');
            userDisplay.textContent = 'welcome';
        }
    }
}

function playSong(songId) {
    let song = songs[songId];
    if (!song) return;
    
    currentSong = songId;
    audio.src = song.file;
    
    document.getElementById('current-cover').src = song.cover;
    document.getElementById('current-title').textContent = song.title;
    document.getElementById('current-artist').textContent = song.artist;
    
    audio.play();
    isPlaying = true;
    updatePlayButton();
}

function togglePlayPause() {
    if (!currentSong) return;
    
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play();
        isPlaying = true;
    }
    updatePlayButton();
}

function updatePlayButton() {
    let playBtn = document.getElementById('play-pause-btn');
    if (isPlaying) {
        playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><rect x="6" y="4" width="2" height="12"/><rect x="12" y="4" width="2" height="12"/></svg>';
    } else {
        playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3v14l11-7L5 3z"/></svg>';
    }
}

function updateProgress() {
    if (audio.duration) {
        let progress = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progress').style.width = progress + '%';
    }
}

function setProgress(e) {
    let progressBar = document.getElementById('progress-bar');
    let rect = progressBar.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    if (audio.duration) {
        audio.currentTime = percent * audio.duration;
    }
}

updateUserDisplay();

let nameInput = document.getElementById('username');
if (nameInput) {
    nameInput.addEventListener("input", saveUserName);
}

document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener("click", function(e) {
        e.stopPropagation();
        let track = this.closest('.track');
        let songId = track.dataset.song;
        playSong(songId);
    });
});

let playPauseBtn = document.getElementById('play-pause-btn');
if (playPauseBtn) {
    playPauseBtn.addEventListener("click", togglePlayPause);
}

let progressBar = document.getElementById('progress-bar');
if (progressBar) {
    progressBar.addEventListener("click", setProgress);
}

audio.addEventListener('timeupdate', updateProgress);

audio.addEventListener('ended', function() {
    isPlaying = false;
    updatePlayButton();
    document.getElementById('progress').style.width = '0%';
});
