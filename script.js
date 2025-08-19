class ActDrawGame {
    constructor() {
        this.challenges = [];
        this.usedChallenges = new Set();
        this.currentChallenge = null;
        this.gameMode = null;
        this.timer = null;
        this.timeLeft = 60;
        this.audioContext = null;
        this.soundInterval = null;
        this.isMuted = false;
        
        this.initializeGame();
        this.bindEvents();
        this.initializeAudio();
    }

    initializeAudio() {
        try {
            // Create audio context for sound generation
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Audio not supported in this browser');
        }
    }

    playTickSound(frequency = 800) {
        if (!this.audioContext || this.isMuted) return;
        
        try {
            // Create multiple oscillators for more intense sound
            const oscillators = [];
            const gainNodes = [];
            
            // Main tone
            const mainOsc = this.audioContext.createOscillator();
            const mainGain = this.audioContext.createGain();
            mainOsc.connect(mainGain);
            mainGain.connect(this.audioContext.destination);
            
            mainOsc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            mainOsc.type = 'square'; // More aggressive than sine
            
            mainGain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            mainGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
            
            // Harmonic overtone (octave higher)
            const harmonicOsc = this.audioContext.createOscillator();
            const harmonicGain = this.audioContext.createGain();
            harmonicOsc.connect(harmonicGain);
            harmonicGain.connect(this.audioContext.destination);
            
            harmonicOsc.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime);
            harmonicOsc.type = 'sawtooth';
            
            harmonicGain.gain.setValueAtTime(0.08, this.audioContext.currentTime);
            harmonicGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.12);
            
            // Low rumble (sub-harmonic)
            const rumbleOsc = this.audioContext.createOscillator();
            const rumbleGain = this.audioContext.createGain();
            rumbleOsc.connect(rumbleGain);
            rumbleGain.connect(this.audioContext.destination);
            
            rumbleOsc.frequency.setValueAtTime(frequency * 0.5, this.audioContext.currentTime);
            rumbleOsc.type = 'triangle';
            
            rumbleGain.gain.setValueAtTime(0.06, this.audioContext.currentTime);
            rumbleGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            // Start all oscillators
            mainOsc.start(this.audioContext.currentTime);
            mainOsc.stop(this.audioContext.currentTime + 0.15);
            
            harmonicOsc.start(this.audioContext.currentTime);
            harmonicOsc.stop(this.audioContext.currentTime + 0.12);
            
            rumbleOsc.start(this.audioContext.currentTime);
            rumbleOsc.stop(this.audioContext.currentTime + 0.2);
            
        } catch (error) {
            console.log('Error playing tick sound:', error);
        }
    }

    playHonkSound() {
        if (!this.audioContext || this.isMuted) return;
        
        try {
            // Create multiple oscillators for intense honk sound
            const oscillators = [];
            
            // Main honk (descending)
            const mainHonk = this.audioContext.createOscillator();
            const mainGain = this.audioContext.createGain();
            mainHonk.connect(mainGain);
            mainGain.connect(this.audioContext.destination);
            
            mainHonk.frequency.setValueAtTime(600, this.audioContext.currentTime);
            mainHonk.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.8);
            mainHonk.type = 'sawtooth';
            
            mainGain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
            mainGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
            
            // High-pitched alarm (ascending)
            const alarmHonk = this.audioContext.createOscillator();
            const alarmGain = this.audioContext.createGain();
            alarmHonk.connect(alarmGain);
            alarmGain.connect(this.audioContext.destination);
            
            alarmHonk.frequency.setValueAtTime(800, this.audioContext.currentTime);
            alarmHonk.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.6);
            alarmHonk.type = 'square';
            
            alarmGain.gain.setValueAtTime(0.25, this.audioContext.currentTime);
            alarmGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
            
            // Low rumble (constant)
            const rumbleHonk = this.audioContext.createOscillator();
            const rumbleGain = this.audioContext.createGain();
            rumbleHonk.connect(rumbleGain);
            rumbleGain.connect(this.audioContext.destination);
            
            rumbleHonk.frequency.setValueAtTime(80, this.audioContext.currentTime);
            rumbleHonk.type = 'triangle';
            
            rumbleGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            rumbleGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
            
            // Start all honk sounds
            mainHonk.start(this.audioContext.currentTime);
            mainHonk.stop(this.audioContext.currentTime + 0.8);
            
            alarmHonk.start(this.audioContext.currentTime);
            alarmHonk.stop(this.audioContext.currentTime + 0.6);
            
            rumbleHonk.start(this.audioContext.currentTime);
            rumbleHonk.stop(this.audioContext.currentTime + 1.0);
            
        } catch (error) {
            console.log('Error playing honk sound:', error);
        }
    }

    startSoundCountdown() {
        // Clear any existing sound interval
        if (this.soundInterval) {
            clearInterval(this.soundInterval);
        }
        
        // Start playing sounds every second for the last 20 seconds
        this.soundInterval = setInterval(() => {
            if (this.timeLeft <= 20 && this.timeLeft > 0) {
                // Calculate pitch: much higher frequency as time runs out
                const baseFreq = 300;
                const pitchIncrease = (20 - this.timeLeft) * 80; // Increase by 80Hz each second
                const frequency = baseFreq + pitchIncrease;
                
                // Add extra intensity for last 10 seconds
                if (this.timeLeft <= 10) {
                    // Play double tick for last 10 seconds
                    this.playTickSound(frequency);
                    setTimeout(() => {
                        this.playTickSound(frequency + 100);
                    }, 150);
                } else {
                    this.playTickSound(frequency);
                }
            }
        }, 1000);
    }

    stopSoundCountdown() {
        if (this.soundInterval) {
            clearInterval(this.soundInterval);
            this.soundInterval = null;
        }
    }

    async initializeGame() {
        await this.loadChallenges();
        this.loadUsedChallenges();
    }

    async loadChallenges() {
        try {
            // Try to load from localStorage first
            const saved = localStorage.getItem('skribbleact_challenges');
            if (saved) {
                this.challenges = JSON.parse(saved);
                console.log(`Loaded ${this.challenges.length} challenges from cache`);
            }

            // If we don't have enough challenges, fetch more
            if (this.challenges.length < 50) {
                await this.fetchNewChallenges();
            }
        } catch (error) {
            console.error('Error loading challenges:', error);
            await this.fetchNewChallenges();
        }
    }

    async fetchNewChallenges() {
        try {
            const newChallenges = [];
            
            // Fetch films from TMDB API (popular films)
            const films = await this.fetchFilms();
            newChallenges.push(...films);
            
            // Fetch UK TV shows from TV Maze API
            const tvShows = await this.fetchUKTVShows();
            newChallenges.push(...tvShows);
            
            // Add some classic UK TV shows manually
            const classicUKShows = [
                'Doctor Who', 'EastEnders', 'Coronation Street', 'Emmerdale',
                'The Great British Bake Off', 'Top Gear', 'Strictly Come Dancing',
                'Britain\'s Got Talent', 'The X Factor', 'Match of the Day',
                'Antiques Roadshow', 'Gardeners\' World', 'Countryfile',
                'The One Show', 'This Morning', 'Loose Women', 'Good Morning Britain',
                'BBC News', 'ITV News', 'Channel 4 News'
            ];
            
            classicUKShows.forEach(show => {
                newChallenges.push({
                    title: show,
                    type: 'TV Show',
                    category: 'UK Classic'
                });
            });

            // Add some classic films manually
            const classicFilms = [
                'The Godfather', 'Pulp Fiction', 'The Shawshank Redemption',
                'Forrest Gump', 'The Matrix', 'Titanic', 'Avatar',
                'Star Wars: A New Hope', 'The Lord of the Rings',
                'Harry Potter and the Philosopher\'s Stone', 'Jurassic Park',
                'Back to the Future', 'E.T. the Extra-Terrestrial',
                'Jaws', 'The Exorcist', 'Rocky', 'Die Hard',
                'Indiana Jones and the Raiders of the Lost Ark',
                'Ghostbusters', 'The Terminator'
            ];

            classicFilms.forEach(film => {
                newChallenges.push({
                    title: film,
                    type: 'Film',
                    category: 'Classic'
                });
            });

            // Merge with existing challenges and remove duplicates
            const allChallenges = [...this.challenges, ...newChallenges];
            const uniqueChallenges = this.removeDuplicates(allChallenges);
            
            this.challenges = uniqueChallenges;
            
            // Save to localStorage
            localStorage.setItem('skribbleact_challenges', JSON.stringify(this.challenges));
            console.log(`Total challenges available: ${this.challenges.length}`);
            
        } catch (error) {
            console.error('Error fetching challenges:', error);
            // Fallback to basic challenges if API fails
            this.challenges = this.getFallbackChallenges();
        }
    }

    async fetchFilms() {
        try {
            // Using a free film API (OMDB alternative)
            const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=1b7c076a0e4849aeefd1f3c429c79f3b&language=en-US&page=1');
            const data = await response.json();
            
            return data.results.slice(0, 20).map(movie => ({
                title: movie.title,
                type: 'Film',
                category: 'Popular',
                year: movie.release_date?.split('-')[0] || ''
            }));
        } catch (error) {
            console.error('Error fetching films:', error);
            return [];
        }
    }

    async fetchUKTVShows() {
        try {
            // Using TV Maze API for UK shows
            const response = await fetch('https://api.tvmaze.com/schedule?country=GB&date=' + new Date().toISOString().split('T')[0]);
            const data = await response.json();
            
            const ukShows = data
                .filter(show => show.show && show.show.name)
                .slice(0, 15)
                .map(show => ({
                    title: show.show.name,
                    type: 'TV Show',
                    category: 'UK Current',
                    network: show.show.network?.name || 'BBC'
                }));
            
            return ukShows;
        } catch (error) {
            console.error('Error fetching UK TV shows:', error);
            return [];
        }
    }

    removeDuplicates(challenges) {
        const seen = new Set();
        return challenges.filter(challenge => {
            const key = challenge.title.toLowerCase();
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    getFallbackChallenges() {
        return [
            { title: 'The Office', type: 'TV Show', category: 'UK/US' },
            { title: 'Friends', type: 'TV Show', category: 'US' },
            { title: 'Breaking Bad', type: 'TV Show', category: 'US' },
            { title: 'Game of Thrones', type: 'TV Show', category: 'US' },
            { title: 'The Crown', type: 'TV Show', category: 'UK' },
            { title: 'Peaky Blinders', type: 'TV Show', category: 'UK' },
            { title: 'Downton Abbey', type: 'TV Show', category: 'UK' },
            { title: 'Sherlock', type: 'TV Show', category: 'UK' },
            { title: 'Black Mirror', type: 'TV Show', category: 'UK' },
            { title: 'The Inbetweeners', type: 'TV Show', category: 'UK' },
            { title: 'Inception', type: 'Film', category: 'Sci-Fi' },
            { title: 'The Dark Knight', type: 'Film', category: 'Action' },
            { title: 'Interstellar', type: 'Film', category: 'Sci-Fi' },
            { title: 'La La Land', type: 'Film', category: 'Musical' },
            { title: 'Parasite', type: 'Film', category: 'Thriller' }
        ];
    }

    loadUsedChallenges() {
        const saved = localStorage.getItem('skribbleact_used');
        if (saved) {
            this.usedChallenges = new Set(JSON.parse(saved));
        }
    }

    saveUsedChallenges() {
        localStorage.setItem('skribbleact_used', JSON.stringify([...this.usedChallenges]));
    }

    generateChallenge() {
        if (this.challenges.length === 0) {
            this.showMessage('No challenges available. Please refresh the page.', 'error');
            return;
        }

        // Filter out used challenges
        const availableChallenges = this.challenges.filter(
            challenge => !this.usedChallenges.has(challenge.title)
        );

        if (availableChallenges.length === 0) {
            // If all challenges have been used, reset the used list
            this.usedChallenges.clear();
            this.saveUsedChallenges();
            this.showMessage('All challenges completed! Starting fresh! 🎉', 'success');
            return this.generateChallenge();
        }

        // Randomly select a challenge
        const randomIndex = Math.floor(Math.random() * availableChallenges.length);
        this.currentChallenge = availableChallenges[randomIndex];
        
        // Mark as used
        this.usedChallenges.add(this.currentChallenge.title);
        this.saveUsedChallenges();

        this.displayChallenge();
        this.showModeSelection();
    }

    displayChallenge() {
        const challengeCard = document.getElementById('challengeCard');
        const title = document.querySelector('.challenge-title');
        const description = document.querySelector('.challenge-description');

        title.textContent = this.currentChallenge.title;
        description.innerHTML = `
            <strong>Type:</strong> ${this.currentChallenge.type}<br>
            <strong>Category:</strong> ${this.currentChallenge.category}
            ${this.currentChallenge.year ? `<br><strong>Year:</strong> ${this.currentChallenge.year}` : ''}
            ${this.currentChallenge.network ? `<br><strong>Network:</strong> ${this.currentChallenge.network}` : ''}
        `;

        challengeCard.classList.add('active');
    }

    showModeSelection() {
        // Randomly select mode (act or draw)
        const modes = [
            { type: 'act', text: '🎭 Act It Out', class: 'btn-act' },
            { type: 'draw', text: '🎨 Draw It', class: 'btn-draw' }
        ];
        
        const randomMode = modes[Math.floor(Math.random() * modes.length)];
        this.gameMode = randomMode.type;
        
        // Display the selected mode
        const challengeMode = document.getElementById('challengeMode');
        challengeMode.innerHTML = `
            <div class="selected-mode ${randomMode.class}">
                <h2>${randomMode.text}</h2>
                <p>Get ready to ${randomMode.type === 'act' ? 'act out' : 'draw'} <strong>${this.currentChallenge.title}</strong>!</p>
                <button class="btn btn-start" id="startBtn">
                    🚀 Start Challenge
                </button>
            </div>
        `;
        
        document.getElementById('modeSelection').style.display = 'block';
        document.getElementById('timerSection').style.display = 'none';
        
        // Bind the start button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame(this.gameMode);
        });
    }

    hideModeSelection() {
        document.getElementById('modeSelection').style.display = 'none';
    }

    startGame(mode) {
        this.gameMode = mode;
        this.hideModeSelection();
        this.startTimer();
        this.showTimerSection();
        
        const modeText = mode === 'act' ? 'Acting' : 'Drawing';
        this.showMessage(`🎯 ${modeText} mode activated! Good luck!`, 'game');
    }

    startTimer() {
        this.timeLeft = 60;
        this.updateTimerDisplay();
        this.startSoundCountdown(); // Start sound countdown
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.endGame();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        
        // Prevent negative numbers
        if (this.timeLeft < 0) {
            this.timeLeft = 0;
        }
        
        timerElement.textContent = this.timeLeft;
        
        // Remove all timer classes first
        timerElement.classList.remove('warning', 'critical');
        
        // Apply visual effects based on time remaining
        if (this.timeLeft <= 20 && this.timeLeft > 10) {
            // Warning phase - last 20 seconds
            timerElement.classList.add('warning');
        } else if (this.timeLeft <= 10 && this.timeLeft > 0) {
            // Critical phase - last 10 seconds
            timerElement.classList.add('critical');
        }
        
        // Show sound indicator for last 20 seconds
        this.updateSoundIndicator();
    }

    updateSoundIndicator() {
        const timerSection = document.getElementById('timerSection');
        let soundIndicator = timerSection.querySelector('.sound-indicator');
        
        if (this.timeLeft <= 20 && this.timeLeft > 0) {
            if (!soundIndicator) {
                soundIndicator = document.createElement('div');
                soundIndicator.className = 'sound-indicator';
                soundIndicator.innerHTML = '🔊 Sound On';
                timerSection.appendChild(soundIndicator);
            }
        } else if (soundIndicator) {
            soundIndicator.remove();
        }
    }

    endGame() {
        clearInterval(this.timer);
        this.stopSoundCountdown(); // Stop sound countdown
        
        // Play honk sound when time runs out
        this.playHonkSound();
        
        this.showMessage('⏰ Time\'s up! How did you do?', 'timer');
        
        // Reset challenge card
        const challengeCard = document.getElementById('challengeCard');
        challengeCard.classList.remove('active');
        
        // Show next challenge button
        document.getElementById('nextBtn').style.display = 'inline-block';
    }

    showTimerSection() {
        document.getElementById('timerSection').style.display = 'block';
    }

    hideTimerSection() {
        document.getElementById('timerSection').style.display = 'none';
    }

    nextChallenge() {
        this.hideTimerSection();
        this.resetChallengeCard();
        this.currentChallenge = null;
        this.gameMode = null;
    }

    resetChallengeCard() {
        const challengeCard = document.getElementById('challengeCard');
        const title = document.querySelector('.challenge-title');
        const description = document.querySelector('.challenge-description');

        title.textContent = 'Ready to Play?';
        description.textContent = 'Tap the button below to get a random film or TV show!';
        challengeCard.classList.remove('active');
    }

    showMessage(message, type = 'info') {
        // Remove any existing messages first
        const existingMessages = document.querySelectorAll('.game-notification');
        existingMessages.forEach(msg => msg.remove());
        
        // Create a better notification
        const messageDiv = document.createElement('div');
        messageDiv.className = 'game-notification';
        
        // Set icon based on message type
        let icon = '💬';
        if (type === 'success') icon = '✅';
        if (type === 'warning') icon = '⚠️';
        if (type === 'error') icon = '❌';
        if (type === 'timer') icon = '⏰';
        if (type === 'game') icon = '🎮';
        
        messageDiv.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.classList.add('fade-out');
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 4000);
    }

    bindEvents() {
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateChallenge();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextChallenge();
        });

        // Bind mute button (will be added dynamically)
        document.addEventListener('click', (e) => {
            if (e.target.id === 'muteBtn') {
                this.toggleMute();
            }
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const muteBtn = document.getElementById('muteBtn');
        
        if (this.isMuted) {
            muteBtn.innerHTML = '🔊 Unmute';
            muteBtn.classList.add('btn-unmute');
            muteBtn.classList.remove('btn-sound');
        } else {
            muteBtn.innerHTML = '🔇 Mute';
            muteBtn.classList.add('btn-sound');
            muteBtn.classList.remove('btn-unmute');
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ActDrawGame();
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    }
});
