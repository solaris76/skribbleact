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
        console.log('🎬 ActDrawGame - Loading fresh challenges...');
        await this.loadChallenges();
        this.loadUsedChallenges();
        this.showReadyState();
    }

    async loadChallenges() {
        console.log('📡 Loading 50 fresh challenges from APIs...');
        try {
            // Clear any existing challenges
            this.challenges = [];
            
            // Fetch fresh films and TV shows
            const films = await this.fetchFilms();
            const tvShows = await this.fetchUKTVShows();
            
            // Combine and ensure exactly 50 challenges
            let allChallenges = [...films, ...tvShows];
            
            // If we don't have enough, fetch more from different sources
            if (allChallenges.length < 50) {
                console.log(`📊 Only got ${allChallenges.length} challenges, fetching more...`);
                const additionalFilms = await this.fetchMoreFilms();
                const additionalTV = await this.fetchMoreTVShows();
                allChallenges = [...allChallenges, ...additionalFilms, ...additionalTV];
            }
            
            // Remove duplicates and ensure exactly 50
            this.challenges = this.ensureExactly50Challenges(allChallenges);
            
            console.log(`✅ Loaded ${this.challenges.length} fresh challenges`);
            console.log('🎬 Films:', this.challenges.filter(c => c.type === 'Film').length);
            console.log('📺 TV Shows:', this.challenges.filter(c => c.type === 'TV Show').length);
            
        } catch (error) {
            console.error('❌ Error loading challenges:', error);
            this.challenges = [];
        }
    }

    async fetchFilms() {
        try {
            console.log('🎬 Fetching popular films from TMDB...');
            
            // Try TMDB first
            const tmdbResponse = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=1b7c076a0e4849aeefd1f3c429c79f3b&language=en-US&page=1');
            
            if (!tmdbResponse.ok) {
                throw new Error(`TMDB API error: ${tmdbResponse.status} ${tmdbResponse.statusText}`);
            }
            
            const data = await tmdbResponse.json();
            console.log('📊 TMDB response:', data);
            
            if (!data.results || !Array.isArray(data.results)) {
                throw new Error('TMDB API returned invalid data structure');
            }
            
            const films = data.results.slice(0, 25).map(movie => ({
                title: movie.title,
                type: 'Film',
                category: 'Popular',
                year: movie.release_date?.split('-')[0] || '',
                source: 'TMDB Popular'
            }));
            
            console.log(`✅ Fetched ${films.length} popular films from TMDB`);
            return films;
            
        } catch (error) {
            console.error('❌ Error fetching films from TMDB:', error);
            
            // Fallback to a different approach - use a public movie database
            console.log('🔄 Trying fallback film source...');
            try {
                const fallbackFilms = await this.fetchFallbackFilms();
                console.log(`✅ Fallback fetched ${fallbackFilms.length} films`);
                return fallbackFilms;
            } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError);
                return [];
            }
        }
    }

    async fetchFallbackFilms() {
        try {
            console.log('🎬 Fetching films from fallback source...');
            
            // Use a simple public movie list as fallback
            const fallbackMovies = [
                'The Shawshank Redemption', 'The Godfather', 'Pulp Fiction', 'Fight Club',
                'Forrest Gump', 'The Matrix', 'Goodfellas', 'The Silence of the Lambs',
                'Interstellar', 'The Dark Knight', 'Inception', 'The Departed',
                'Gladiator', 'The Lord of the Rings', 'Titanic', 'Avatar',
                'Jurassic Park', 'Back to the Future', 'E.T.', 'Jaws',
                'Rocky', 'Die Hard', 'Indiana Jones', 'Ghostbusters',
                'The Terminator', 'Alien', 'The Exorcist', 'The Shining',
                'A Clockwork Orange', '2001: A Space Odyssey', 'Apocalypse Now',
                'Taxi Driver', 'Raging Bull', 'Casino', 'Heat', 'Collateral'
            ];
            
            const films = fallbackMovies.map(title => ({
                title: title,
                type: 'Film',
                category: 'Classic',
                year: '',
                source: 'Fallback Database'
            }));
            
            return films;
            
        } catch (error) {
            console.error('❌ Fallback film fetch failed:', error);
            return [];
        }
    }

    async fetchMoreFilms() {
        try {
            console.log('🎬 Fetching more films from TMDB...');
            const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=1b7c076a0e4849aeefd1f3c429c79f3b&language=en-US&page=1');
            
            if (!response.ok) {
                throw new Error(`TMDB Top Rated API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📊 TMDB Top Rated response:', data);
            
            if (!data.results || !Array.isArray(data.results)) {
                throw new Error('TMDB Top Rated API returned invalid data structure');
            }
            
            const films = data.results.slice(0, 15).map(movie => ({
                title: movie.title,
                type: 'Film',
                category: 'Top Rated',
                year: movie.release_date?.split('-')[0] || '',
                source: 'TMDB Top Rated'
            }));
            
            console.log(`✅ Fetched ${films.length} top rated films from TMDB`);
            return films;
            
        } catch (error) {
            console.error('❌ Error fetching more films from TMDB:', error);
            return [];
        }
    }

    async fetchUKTVShows() {
        try {
            console.log('📺 Fetching UK TV shows from TV Maze...');
            const response = await fetch('https://api.tvmaze.com/schedule?country=GB&date=' + new Date().toISOString().split('T')[0]);
            
            if (!response.ok) {
                throw new Error(`TV Maze API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📊 TV Maze response:', data);
            
            if (!Array.isArray(data)) {
                throw new Error('TV Maze API returned invalid data structure');
            }
            
            const ukShows = data
                .filter(show => show.show && show.show.name)
                .slice(0, 20)
                .map(show => ({
                    title: show.show.name,
                    type: 'TV Show',
                    category: 'UK Current',
                    network: show.show.network?.name || 'BBC',
                    source: 'TV Maze Schedule'
                }));
            
            console.log(`✅ Fetched ${ukShows.length} UK TV shows from TV Maze`);
            return ukShows;
            
        } catch (error) {
            console.error('❌ Error fetching UK TV shows from TV Maze:', error);
            
            // Fallback to basic UK shows
            console.log('🔄 Using fallback UK TV shows...');
            const fallbackUKShows = [
                'Doctor Who', 'EastEnders', 'Coronation Street', 'Emmerdale',
                'The Great British Bake Off', 'Top Gear', 'Strictly Come Dancing',
                'Britain\'s Got Talent', 'The X Factor', 'Match of the Day',
                'Antiques Roadshow', 'Gardeners\' World', 'Countryfile',
                'The One Show', 'This Morning', 'Loose Women', 'Good Morning Britain',
                'BBC News', 'ITV News', 'Channel 4 News', 'Sky News'
            ];
            
            const shows = fallbackUKShows.map(title => ({
                title: title,
                type: 'TV Show',
                category: 'UK Classic',
                network: 'Various',
                source: 'Fallback UK Shows'
            }));
            
            console.log(`✅ Fallback fetched ${shows.length} UK TV shows`);
            return shows;
        }
    }

    async fetchMoreTVShows() {
        try {
            console.log('📺 Fetching more TV shows from TV Maze...');
            const response = await fetch('https://api.tvmaze.com/shows?page=1');
            
            if (!response.ok) {
                throw new Error(`TV Maze Shows API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📊 TV Maze Shows response:', data);
            
            if (!Array.isArray(data)) {
                throw new Error('TV Maze Shows API returned invalid data structure');
            }
            
            const tvShows = data
                .filter(show => show.name && show.language === 'English')
                .slice(0, 15)
                .map(show => ({
                    title: show.name,
                    type: 'TV Show',
                    category: 'International',
                    network: show.network?.name || 'Various',
                    source: 'TV Maze Shows'
                }));
            
            console.log(`✅ Fetched ${tvShows.length} additional TV shows from TV Maze`);
            return tvShows;
            
        } catch (error) {
            console.error('❌ Error fetching more TV shows from TV Maze:', error);
            
            // Fallback to basic international shows
            console.log('🔄 Using fallback international TV shows...');
            const fallbackIntShows = [
                'Breaking Bad', 'Game of Thrones', 'The Office', 'Friends',
                'The Crown', 'Peaky Blinders', 'Downton Abbey', 'Sherlock',
                'Black Mirror', 'The Inbetweeners', 'Stranger Things',
                'The Walking Dead', 'Modern Family', 'The Big Bang Theory'
            ];
            
            const shows = fallbackIntShows.map(title => ({
                title: title,
                type: 'TV Show',
                category: 'International',
                network: 'Various',
                source: 'Fallback International Shows'
            }));
            
            console.log(`✅ Fallback fetched ${shows.length} international TV shows`);
            return shows;
        }
    }

    ensureExactly50Challenges(allChallenges) {
        // Remove duplicates first
        const uniqueChallenges = this.removeDuplicates(allChallenges);
        
        // If we have exactly 50, return them
        if (uniqueChallenges.length === 50) {
            return uniqueChallenges;
        }
        
        // If we have more than 50, randomly select 50
        if (uniqueChallenges.length > 50) {
            const shuffled = this.shuffleArray([...uniqueChallenges]);
            return shuffled.slice(0, 50);
        }
        
        // If we have less than 50, we'll return what we have
        // (this shouldn't happen with our API calls, but just in case)
        console.warn(`⚠️ Only got ${uniqueChallenges.length} challenges, less than 50`);
        return uniqueChallenges;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    removeDuplicates(challenges) {
        const seen = new Set();
        return challenges.filter(challenge => {
            const key = challenge.title.toLowerCase().trim();
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    loadUsedChallenges() {
        // Always start with a clean slate - no previously used challenges
        this.usedChallenges = new Set();
        console.log('🔄 Starting with fresh challenge list - no previously used challenges');
    }

    generateChallenge() {
        console.log('🎲 Generating new challenge...');
        console.log(`📊 Available challenges: ${this.challenges.length}`);
        console.log(`🔄 Used challenges: ${this.usedChallenges.size}`);
        
        if (this.challenges.length === 0) {
            this.showMessage('No challenges available. Please refresh the page.', 'error');
            return;
        }

        // Filter out used challenges
        const availableChallenges = this.challenges.filter(
            challenge => !this.usedChallenges.has(challenge.title)
        );

        console.log(`🎯 Available challenges (not used): ${availableChallenges.length}`);

        if (availableChallenges.length === 0) {
            // If all challenges have been used, reload fresh challenges
            console.log('🔄 All challenges used up! Reloading fresh challenges...');
            this.usedChallenges.clear();
            this.loadChallenges().then(() => {
                this.showMessage('🔄 Fresh challenges loaded! Starting over! 🎉', 'success');
                this.generateChallenge();
            });
            return;
        }

        // Randomly select a challenge
        const randomIndex = Math.floor(Math.random() * availableChallenges.length);
        this.currentChallenge = availableChallenges[randomIndex];
        
        // Mark as used
        this.usedChallenges.add(this.currentChallenge.title);
        
        console.log(`✅ Selected challenge: "${this.currentChallenge.title}" (${this.currentChallenge.type})`);
        console.log(`📊 Remaining challenges: ${availableChallenges.length - 1}`);

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
            <br><strong>Source:</strong> ${this.currentChallenge.source || 'API'}
        `;

        challengeCard.classList.add('active');
    }

    showReadyState() {
        console.log('🎉 App ready! Fresh challenges loaded.');
        const challengeCard = document.getElementById('challengeCard');
        const title = document.querySelector('.challenge-title');
        const description = document.querySelector('.challenge-description');
        
        title.textContent = '🎬 Fresh Challenges Loaded!';
        description.innerHTML = `
            <strong>Total Challenges:</strong> ${this.challenges.length}<br>
            <strong>Films:</strong> ${this.challenges.filter(c => c.type === 'Film').length}<br>
            <strong>TV Shows:</strong> ${this.challenges.filter(c => c.type === 'TV Show').length}<br>
            <br>
            <em>Every reload brings 50 completely fresh challenges!</em>
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
