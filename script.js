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
        
        // Track which API pages we've used to avoid repeats
        this.usedFilmPages = new Set();
        this.usedTVPages = new Set();
        this.usedFilmGenres = new Set();
        this.usedTVSearchTerms = new Set();
        
        // Session-based tracking to force fresh content on each page load
        this.sessionId = Date.now() + Math.random().toString(36).substr(2, 9);
        this.pageLoadCount = 0;
        
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
        console.log(`🆔 Session ID: ${this.sessionId}`);
        console.log(`📱 Page load count: ${++this.pageLoadCount}`);
        
        // Show loading indicator
        this.showLoadingIndicator();
        
        // Force fresh content on each page load
        this.forceFreshContent();
        
        // Test API connectivity first
        await this.testAPIConnectivity();
        
        await this.loadChallenges();
        this.loadUsedChallenges();
        this.hideLoadingIndicator();
        this.showGameContainer();
        this.showReadyState();
    }

    showLoadingIndicator() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const gameContainer = document.getElementById('gameContainer');
        
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (gameContainer) gameContainer.style.display = 'none';
        
        this.updateLoadingStatus('Initializing...', 0);
    }

    hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }

    showGameContainer() {
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.style.display = 'block';
            // Trigger animation after a small delay
            setTimeout(() => {
                gameContainer.classList.add('loaded');
            }, 100);
        }
    }

    updateLoadingStatus(status, progress) {
        const loadingStatus = document.querySelector('.loading-status');
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (loadingStatus) loadingStatus.textContent = status;
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${progress}%`;
    }

    async testAPIConnectivity() {
        console.log('🔍 Testing API connectivity...');
        this.updateLoadingStatus('Testing API connectivity...', 10);
        
        try {
            // Test TMDB connectivity
            console.log('🔄 Testing TMDB API...');
            this.updateLoadingStatus('Testing TMDB API...', 20);
            const tmdbTest = await fetch('https://api.themoviedb.org/3/configuration?api_key=1b7c076a0e4849aeefd1f3c429c79f3b');
            if (tmdbTest.ok) {
                console.log('✅ TMDB API is accessible');
                this.updateLoadingStatus('TMDB API: ✅ Accessible', 30);
            } else {
                console.error('❌ TMDB API is not accessible:', tmdbTest.status, tmdbTest.statusText);
                this.updateLoadingStatus('TMDB API: ❌ Not accessible', 30);
            }
        } catch (error) {
            console.error('❌ TMDB API connectivity test failed:', error);
            this.updateLoadingStatus('TMDB API: ❌ Connection failed', 30);
        }
        
        try {
            // Test OMDB connectivity
            console.log('🔄 Testing OMDB API...');
            this.updateLoadingStatus('Testing OMDB API...', 40);
            const omdbTest = await fetch('https://www.omdbapi.com/?t=test&apikey=59fed1d4');
            if (omdbTest.ok) {
                console.log('✅ OMDB API is accessible');
                this.updateLoadingStatus('OMDB API: ✅ Accessible', 50);
            } else {
                console.error('❌ OMDB API is not accessible:', omdbTest.status, omdbTest.statusText);
                this.updateLoadingStatus('OMDB API: ❌ Not accessible', 50);
            }
        } catch (error) {
            console.error('❌ OMDB API connectivity test failed:', error);
            this.updateLoadingStatus('OMDB API: ❌ Connection failed', 50);
        }
        
        try {
            // Test TV Maze connectivity
            console.log('🔄 Testing TV Maze API...');
            this.updateLoadingStatus('Testing TV Maze API...', 60);
            const tvmazeTest = await fetch('https://api.tvmaze.com/search/shows?q=test');
            if (tvmazeTest.ok) {
                console.log('✅ TV Maze API is accessible');
                this.updateLoadingStatus('TV Maze API: ✅ Accessible', 70);
            } else {
                console.error('❌ TV Maze API is not accessible:', tvmazeTest.status, tvmazeTest.statusText);
                this.updateLoadingStatus('TV Maze API: ❌ Not accessible', 70);
            }
        } catch (error) {
            console.error('❌ TV Maze API connectivity test failed:', error);
            this.updateLoadingStatus('TV Maze API: ❌ Connection failed', 70);
        }
        
        this.updateLoadingStatus('APIs tested, loading challenges...', 80);
    }

    forceFreshContent() {
        console.log('🔄 Forcing fresh content for new session...');
        
        // Clear all tracking on each page load
        this.usedFilmPages.clear();
        this.usedTVPages.clear();
        this.usedFilmGenres.clear();
        this.usedTVSearchTerms.clear();
        
        // Add session-specific randomization
        const sessionSeed = this.sessionId.charCodeAt(0) + this.pageLoadCount;
        console.log(`🎲 Session seed: ${sessionSeed}`);
    }

    async loadChallenges() {
        console.log('📡 Loading 50 fresh challenges from APIs...');
        this.updateLoadingStatus('Loading fresh challenges from APIs...', 85);
        
        try {
            // Clear any existing challenges
            this.challenges = [];
            
            // Add timestamp-based randomization seed
            const timestamp = Date.now();
            const randomSeed = timestamp % 1000;
            console.log(`🎲 Random seed for this session: ${randomSeed}`);
            console.log(`🆔 Session ID: ${this.sessionId}`);
            
            // Fetch fresh films only (TV shows commented out for now)
            this.updateLoadingStatus('Fetching films from APIs...', 90);
            const films = await this.fetchFilms();
            
            // TV shows commented out - only using films for now
            // this.updateLoadingStatus('Fetching TV shows from APIs...', 95);
            // const tvShows = await this.fetchUKTVShows();
            
            // Combine and ensure exactly 50 challenges (films only)
            let allChallenges = [...films];
            // let allChallenges = [...films, ...tvShows]; // TV shows commented out
            
            // If we don't have enough, fetch more from different sources
            if (allChallenges.length < 50) {
                console.log(`📊 Only got ${allChallenges.length} challenges, fetching more...`);
                this.updateLoadingStatus('Fetching additional content...', 97);
                const additionalFilms = await this.fetchMoreFilms();
                // const additionalTV = await this.fetchMoreTVShows(); // TV shows commented out
                allChallenges = [...allChallenges, ...additionalFilms];
                // allChallenges = [...allChallenges, ...additionalFilms, ...additionalTV]; // TV shows commented out
            }
            
            // Remove duplicates and ensure exactly 50 challenges
            this.challenges = this.ensureExactly50Challenges(allChallenges);
            
            // Final shuffle to randomize the order
            this.challenges = this.shuffleArray(this.challenges);
            
            // Add session-specific challenge rotation
            this.rotateChallengesForSession();
            
            this.updateLoadingStatus('Finalizing challenge set...', 99);
            
            console.log(`✅ Loaded ${this.challenges.length} fresh challenges`);
            console.log('🎬 Films:', this.challenges.filter(c => c.type === 'Film').length);
            console.log('📺 TV Shows:', this.challenges.filter(c => c.type === 'TV Show').length);
            console.log('🔄 Final shuffle applied for maximum variety');
            console.log('🔄 Session-specific rotation applied');
            console.log('📺 Note: TV shows are currently commented out - films only');
            
            this.updateLoadingStatus('Challenges loaded successfully!', 100);
            
        } catch (error) {
            console.error('❌ Error loading challenges:', error);
            this.challenges = [];
            this.updateLoadingStatus('Error loading challenges, using fallbacks...', 100);
        }
    }

    rotateChallengesForSession() {
        console.log('🔄 Applying session-specific challenge rotation...');
        
        // Use session ID to determine rotation offset
        const sessionHash = this.sessionId.split('').reduce((a, b) => {
            a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
            return a;
        }, 0);
        
        const rotationOffset = Math.abs(sessionHash) % this.challenges.length;
        
        // Rotate challenges based on session
        if (rotationOffset > 0) {
            const rotated = [...this.challenges.slice(rotationOffset), ...this.challenges.slice(0, rotationOffset)];
            this.challenges = rotated;
            console.log(`🔄 Rotated challenges by ${rotationOffset} positions for session ${this.sessionId}`);
        }
        
        // Additional shuffle for this specific session
        this.challenges = this.shuffleArray(this.challenges);
        console.log('🔄 Additional session-specific shuffle applied');
    }

    async fetchFilms() {
        console.log('🎬 Fetching popular films from multiple sources...');
        this.updateLoadingStatus('Fetching films from TMDB...', 90);
        
        try {
            // Try TMDB first
            console.log('🔄 Attempting TMDB API...');
            const tmdbFilms = await this.fetchFilmsFromTMDB();
            if (tmdbFilms.length > 0) {
                console.log(`✅ TMDB: ${tmdbFilms.length} films`);
                this.updateLoadingStatus(`TMDB: ${tmdbFilms.length} films loaded`, 92);
                return tmdbFilms;
            } else {
                console.log('❌ TMDB returned 0 films');
            }

            // Fallback to OMDB if TMDB fails
            console.log('🔄 TMDB failed, trying OMDB...');
            this.updateLoadingStatus('TMDB failed, trying OMDB...', 93);
            const omdbFilms = await this.fetchFilmsFromOMDB();
            if (omdbFilms.length > 0) {
                console.log(`✅ OMDB: ${omdbFilms.length} films`);
                this.updateLoadingStatus(`OMDB: ${omdbFilms.length} films loaded`, 94);
                return omdbFilms;
            } else {
                console.log('❌ OMDB returned 0 films');
            }

            // Final fallback to our database
            console.log('🔄 All APIs failed, using fallback database...');
            this.updateLoadingStatus('Using fallback film database...', 95);
            return await this.fetchFallbackFilms();

        } catch (error) {
            console.error('❌ Error fetching films:', error);
            console.log('🔄 Using fallback due to error...');
            this.updateLoadingStatus('Error fetching films, using fallback...', 95);
            return await this.fetchFallbackFilms();
        }
    }

    async fetchFilmsFromTMDB() {
        try {
            // Find an unused page from 1-100 (much larger range to avoid repeats)
            let randomPage = this.getUnusedFilmPage(1, 100);
            if (randomPage === null) {
                // If all pages 1-100 are used, expand to 101-200
                randomPage = this.getUnusedFilmPage(101, 200);
                if (randomPage === null) {
                    // If even 101-200 are used, expand to 201-300
                    randomPage = this.getUnusedFilmPage(201, 300);
                    if (randomPage === null) {
                        // If all are used, reset and start over
                        this.usedFilmPages.clear();
                        randomPage = this.getUnusedFilmPage(1, 100);
                    }
                }
            }
            
            // Add timestamp-based randomization to sorting
            const timestamp = Date.now();
            const sortOptions = ['popularity.desc', 'vote_average.desc', 'revenue.desc', 'release_date.desc', 'vote_count.desc'];
            const randomSort = sortOptions[timestamp % sortOptions.length];
            
            // Add random year filtering to get different decades
            const currentYear = new Date().getFullYear();
            const randomDecade = Math.floor(Math.random() * 10) * 10; // 0, 10, 20, 30, 40, 50, 60, 70, 80, 90
            const randomYear = currentYear - randomDecade - Math.floor(Math.random() * 10);
            
            console.log(`📄 Using TMDB page ${randomPage} with sort: ${randomSort}, year around ${randomYear} (unused page)`);
            
            const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=1b7c076a0e4849aeefd1f3c429c79f3b&language=en-US&page=${randomPage}&sort_by=${randomSort}&include_adult=false&include_video=false&vote_count.gte=50&vote_average.gte=5.5&year=${randomYear}`;
            console.log(`🔗 TMDB API URL: ${apiUrl}`);
            
            const tmdbResponse = await fetch(apiUrl);
            
            console.log(`📊 TMDB Response Status: ${tmdbResponse.status} ${tmdbResponse.statusText}`);
            
            if (!tmdbResponse.ok) {
                console.error(`❌ TMDB API error: ${tmdbResponse.status} ${tmdbResponse.statusText}`);
                const errorText = await tmdbResponse.text();
                console.error(`❌ TMDB Error Details: ${errorText}`);
                throw new Error(`TMDB API error: ${tmdbResponse.status} ${tmdbResponse.statusText}`);
            }
            
            const data = await tmdbResponse.json();
            console.log(`📊 TMDB Raw Response:`, data);
            
            if (!data.results || !Array.isArray(data.results)) {
                console.error('❌ TMDB API returned invalid data structure:', data);
                throw new Error('TMDB API returned invalid data structure');
            }
            
            console.log(`📊 TMDB Results Count: ${data.results.length}`);
            
            // Mark this page as used
            this.usedFilmPages.add(randomPage);
            
            const films = data.results.map(movie => ({
                title: movie.title,
                type: 'Film',
                category: 'Popular',
                year: movie.release_date?.split('-')[0] || '',
                source: `TMDB Page ${randomPage} (${randomSort}, ${randomYear})`
            }));
            
            console.log(`✅ TMDB Success: ${films.length} films processed`);
            return films;
            
        } catch (error) {
            console.error('❌ TMDB fetch failed:', error);
            console.error('❌ TMDB Error Stack:', error.stack);
            return [];
        }
    }

    async fetchFilmsFromOMDB() {
        try {
            console.log('🎬 Fetching films from OMDB...');
            const popularTitles = [
                'The Godfather', 'Casablanca', 'Citizen Kane', 'Gone with the Wind', 'Lawrence of Arabia',
                'The Wizard of Oz', 'Vertigo', 'Psycho', '2001: A Space Odyssey', 'Apocalypse Now',
                'Taxi Driver', 'Goodfellas', 'The Shawshank Redemption', 'Pulp Fiction', 'Fight Club',
                'The Matrix', 'Inception', 'Interstellar', 'The Dark Knight', 'Forrest Gump',
                'Titanic', 'Avatar', 'Jurassic Park', 'Star Wars', 'The Lord of the Rings',
                'Harry Potter', 'The Lion King', 'Toy Story', 'Finding Nemo', 'Up',
                'The Incredibles', 'Monsters Inc', 'Shrek', 'Frozen', 'Moana'
            ];
            
            const shuffledTitles = this.shuffleArray([...popularTitles]).slice(0, 10);
            console.log(`🎯 OMDB: Attempting to fetch ${shuffledTitles.length} titles:`, shuffledTitles);
            
            const films = [];
            for (const title of shuffledTitles) {
                try {
                    const omdbUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=59fed1d4`;
                    console.log(`🔗 OMDB API URL for "${title}": ${omdbUrl}`);
                    
                    const response = await fetch(omdbUrl);
                    console.log(`📊 OMDB Response Status for "${title}": ${response.status} ${response.statusText}`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`📊 OMDB Raw Response for "${title}":`, data);
                        
                        if (data.Title && data.Response === 'True') {
                            films.push({
                                title: data.Title,
                    type: 'Film',
                                category: 'Popular',
                                year: data.Year || '',
                                source: 'OMDB API'
                            });
                            console.log(`✅ OMDB Success: "${title}" -> "${data.Title}"`);
                        } else {
                            console.log(`❌ OMDB: "${title}" - Response: ${data.Response}, Error: ${data.Error}`);
                        }
                    } else {
                        console.error(`❌ OMDB HTTP Error for "${title}": ${response.status} ${response.statusText}`);
                    }
                    
                    // Small delay to avoid rate limits
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                } catch (error) {
                    console.error(`❌ OMDB Error for "${title}":`, error);
                }
            }
            
            console.log(`✅ OMDB: ${films.length} films fetched successfully`);
            return films;
            
        } catch (error) {
            console.error('❌ OMDB fetch failed:', error);
            console.error('❌ OMDB Error Stack:', error.stack);
            return [];
        }
    }

    async fetchFallbackFilms() {
        try {
            console.log('🎬 Using fallback film database...');
            
            // Create categorized film arrays
            const classicFilms = [
                'The Godfather', 'Casablanca', 'Citizen Kane', 'Gone with the Wind', 'Lawrence of Arabia',
                'The Wizard of Oz', 'Vertigo', 'Psycho', '2001: A Space Odyssey', 'Apocalypse Now',
                'Taxi Driver', 'Goodfellas', 'The Shawshank Redemption', 'Pulp Fiction', 'Fight Club'
            ];
            
            const modernBlockbusters = [
                'Black Panther', 'Avengers: Endgame', 'Spider-Man: No Way Home', 'Top Gun: Maverick',
                'Dune', 'No Time to Die', 'The Batman', 'Wonder Woman', 'Aquaman',
                'Joker', 'Parasite', 'Nomadland', 'The Shape of Water', 'La La Land',
                'Mad Max: Fury Road', 'The Revenant', 'Birdman', '12 Years a Slave', 'Argo'
            ];
            
            const internationalFilms = [
                'Parasite', 'Roma', 'Crouching Tiger, Hidden Dragon', 'Amélie', 'Life Is Beautiful',
                'Cinema Paradiso', 'The Seventh Seal', '8½', 'La Dolce Vita', 'Bicycle Thieves',
                'Rashomon', 'Seven Samurai', 'Spirited Away', 'My Neighbor Totoro', 'Princess Mononoke'
            ];
            
            const cultClassics = [
                'The Rocky Horror Picture Show', 'Donnie Darko', 'The Big Lebowski', 'Office Space',
                'Shaun of the Dead', 'Hot Fuzz', 'Scott Pilgrim vs. the World', 'Kick-Ass',
                'Superbad', 'The 40-Year-Old Virgin', 'Bridesmaids', 'Mean Girls', 'Legally Blonde'
            ];
            
            const sciFiFantasy = [
                'Blade Runner', 'The Terminator', 'Terminator 2: Judgment Day', 'Aliens',
                'Alien', 'Predator', 'The Thing', 'They Live', 'Escape from New York',
                'Big Trouble in Little China', 'The Fifth Element', 'Total Recall', 'RoboCop'
            ];
            
            const actionAdventure = [
                'Die Hard', 'Lethal Weapon', 'Mad Max', 'The Road Warrior', 'Mad Max Beyond Thunderdome',
                'Raiders of the Lost Ark', 'Indiana Jones and the Temple of Doom', 'Indiana Jones and the Last Crusade',
                'Mission: Impossible', 'Mission: Impossible II', 'Mission: Impossible III',
                'John Wick', 'John Wick: Chapter 2', 'John Wick: Chapter 3 - Parabellum'
            ];
            
            const comedyRomance = [
                'When Harry Met Sally', 'Sleepless in Seattle', 'You\'ve Got Mail', 'Notting Hill',
                'Love Actually', 'Bridget Jones\'s Diary', 'The Devil Wears Prada', 'Mamma Mia!',
                'Chicago', 'Moulin Rouge!', 'The Greatest Showman', 'La La Land', 'The Artist'
            ];
            
            const horrorThriller = [
                'The Shining', 'The Exorcist', 'A Nightmare on Elm Street', 'Friday the 13th',
                'Halloween', 'Scream', 'The Blair Witch Project', 'The Ring', 'The Grudge',
                'Insidious', 'The Conjuring', 'Annabelle', 'It', 'It Chapter Two',
                'Get Out', 'Us', 'Nope', 'Midsommar', 'Hereditary', 'The Witch'
            ];
            
            const animationFamily = [
                'Toy Story', 'Toy Story 2', 'Toy Story 3', 'Toy Story 4', 'Finding Nemo',
                'Finding Dory', 'Monsters Inc', 'Monsters University', 'Up', 'Inside Out',
                'Soul', 'Luca', 'Turning Red', 'Lightyear', 'The Incredibles', 'The Incredibles 2'
            ];
            
            // Combine all films with proper categories
            const allFilms = [
                ...classicFilms.map(film => ({ title: film, category: 'Classic' })),
                ...modernBlockbusters.map(film => ({ title: film, category: 'Modern Blockbuster' })),
                ...internationalFilms.map(film => ({ title: film, category: 'International' })),
                ...cultClassics.map(film => ({ title: film, category: 'Cult Classic' })),
                ...sciFiFantasy.map(film => ({ title: film, category: 'Sci-Fi & Fantasy' })),
                ...actionAdventure.map(film => ({ title: film, category: 'Action & Adventure' })),
                ...comedyRomance.map(film => ({ title: film, category: 'Comedy & Romance' })),
                ...horrorThriller.map(film => ({ title: film, category: 'Horror & Thriller' })),
                ...animationFamily.map(film => ({ title: film, category: 'Animation & Family' }))
            ];
            
            // Shuffle and return exactly 50
            const shuffled = this.shuffleArray([...allFilms]);
            return shuffled.slice(0, 50).map(film => ({
                title: film.title,
                type: 'Film',
                category: film.category,
                year: '',
                source: 'Fallback Database (Categorized)'
            }));
            
        } catch (error) {
            console.error('❌ Fallback films failed:', error);
            return [];
        }
    }

    async fetchMoreFilms() {
        try {
            console.log('🎬 Fetching more films from TMDB...');
            
            // Find an unused page from 101-200 (avoid repeats)
            let randomPage = this.getUnusedFilmPage(101, 200);
            if (randomPage === null) {
                // If all pages 101-200 are used, expand to 201-300
                randomPage = this.getUnusedFilmPage(201, 300);
                if (randomPage === null) {
                    // If even 201-300 are used, expand to 301-400
                    randomPage = this.getUnusedFilmPage(301, 400);
                    if (randomPage === null) {
                        // If all are used, reset and start over
                        this.usedFilmPages.clear();
                        randomPage = this.getUnusedFilmPage(101, 200);
                    }
                }
            }
            
            // Find an unused genre to get variety
            const genres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37];
            let randomGenre = this.getUnusedGenre(genres);
            if (randomGenre === null) {
                // If all genres are used, reset and start over
                this.usedFilmGenres.clear();
                randomGenre = this.getUnusedGenre(genres);
            }
            
            // Add random year filtering
            const currentYear = new Date().getFullYear();
            const randomYear = currentYear - Math.floor(Math.random() * 50);
            
            console.log(`📄 Using TMDB page ${randomPage} with genre ${randomGenre}, year around ${randomYear} (unused page & genre)`);
            
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=1b7c076a0e4849aeefd1f3c429c79f3b&language=en-US&page=${randomPage}&sort_by=vote_average.desc&include_adult=false&include_video=false&with_genres=${randomGenre}&vote_count.gte=30&vote_average.gte=5.0&year=${randomYear}`);
            
            if (!response.ok) {
                throw new Error(`TMDB Top Rated API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.results || !Array.isArray(data.results)) {
                throw new Error('TMDB Top Rated API returned invalid data structure');
            }
            
            // Mark this page and genre as used
            this.usedFilmPages.add(randomPage);
            this.usedFilmGenres.add(randomGenre);
            
            const films = data.results.map(movie => ({
                title: movie.title,
                type: 'Film',
                category: 'Top Rated',
                year: movie.release_date?.split('-')[0] || '',
                source: `TMDB Page ${randomPage} Genre ${randomGenre} Year ${randomYear}`
            }));
            
            return films;
            
        } catch (error) {
            console.error('❌ Error fetching more films from TMDB:', error);
            return [];
        }
    }

    getUnusedFilmPage(min, max) {
        const availablePages = [];
        for (let i = min; i <= max; i++) {
            if (!this.usedFilmPages.has(i)) {
                availablePages.push(i);
            }
        }
        return availablePages.length > 0 ? availablePages[Math.floor(Math.random() * availablePages.length)] : null;
    }

    getUnusedGenre(genres) {
        const availableGenres = genres.filter(genre => !this.usedFilmGenres.has(genre));
        return availableGenres.length > 0 ? availableGenres[Math.floor(Math.random() * availableGenres.length)] : null;
    }

    async fetchUKTVShows() {
        console.log('📺 Fetching UK TV shows from multiple sources...');
        this.updateLoadingStatus('Fetching UK TV shows from TV Maze...', 95);
        
        try {
            // Try TV Maze first
            console.log('🔄 Attempting TV Maze API...');
            const tvMazeShows = await this.fetchUKTVShowsFromTVMaze();
            if (tvMazeShows.length > 0) {
                console.log(`✅ TV Maze: ${tvMazeShows.length} shows`);
                this.updateLoadingStatus(`TV Maze: ${tvMazeShows.length} shows loaded`, 96);
                return tvMazeShows;
            } else {
                console.log('❌ TV Maze returned 0 shows');
            }

            // Fallback to BBC/ITV data
            console.log('🔄 TV Maze failed, using BBC/ITV data...');
            this.updateLoadingStatus('Using BBC/ITV show database...', 97);
            return await this.fetchUKTVShowsFromBBC();

        } catch (error) {
            console.error('❌ Error fetching UK TV shows:', error);
            console.log('🔄 Using BBC/ITV fallback due to error...');
            this.updateLoadingStatus('Error fetching TV shows, using fallback...', 97);
            return await this.fetchUKTVShowsFromBBC();
        }
    }

    async fetchUKTVShowsFromTVMaze() {
        try {
            // Use different approaches each time to get variety
            const approaches = [
                // Current UK schedule
                () => fetch(`https://api.tvmaze.com/schedule?country=GB&date=${new Date().toISOString().split('T')[0]}`),
                // UK shows from different page (expanded range)
                () => fetch(`https://api.tvmaze.com/shows?country=GB&page=${this.getUnusedTVPage(1, 50)}`),
                // Search for popular UK shows with different terms
                () => fetch(`https://api.tvmaze.com/search/shows?q=${this.getRandomUKSearchTerm()}`)
            ];
            
            const randomApproach = approaches[Math.floor(Math.random() * approaches.length)];
            const response = await randomApproach();
            
            if (!response.ok) {
                throw new Error(`TV Maze API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            let ukShows = [];
            
            if (Array.isArray(data)) {
                // Handle schedule or shows endpoint
                ukShows = data
                .filter(show => show.show && show.show.name)
                    .slice(0, 20) // Keep first 20 for variety
                .map(show => ({
                    title: show.show.name,
                    type: 'TV Show',
                    category: 'UK Current',
                        network: show.show.network?.name || 'BBC',
                        source: 'TV Maze Schedule/Shows'
                    }));
            } else if (data.length > 0 && data[0].show) {
                // Handle search endpoint
                ukShows = data
                    .filter(item => item.show && item.show.name)
                    .slice(0, 20) // Keep first 20 for variety
                    .map(item => ({
                        title: item.show.name,
                        type: 'TV Show',
                        category: 'UK Search',
                        network: item.show.network?.name || 'BBC',
                        source: 'TV Maze Search'
                    }));
            }
            
            return ukShows;
            
        } catch (error) {
            console.error('❌ TV Maze fetch failed:', error);
            return [];
        }
    }

    getRandomUKSearchTerm() {
        const ukSearchTerms = [
            'uk', 'british', 'england', 'scotland', 'wales', 'northern ireland',
            'bbc', 'itv', 'channel4', 'sky', 'britain', 'great britain',
            'uk comedy', 'uk drama', 'uk reality', 'uk documentary'
        ];
        
        // Use session-based randomization
        const sessionSeed = this.sessionId.charCodeAt(0) + this.pageLoadCount;
        const randomIndex = (sessionSeed + Date.now()) % ukSearchTerms.length;
        return ukSearchTerms[randomIndex];
    }

    async fetchUKTVShowsFromBBC() {
        try {
            console.log('📺 Using BBC/ITV show database...');
            const bbcShows = [
                // BBC Shows (Original 30)
                'Doctor Who', 'EastEnders', 'Coronation Street', 'Emmerdale', 'Hollyoaks',
                'The Great British Bake Off', 'Strictly Come Dancing', 'The X Factor', 'Britain\'s Got Talent',
                'Match of the Day', 'Top Gear', 'The Apprentice', 'Dragons\' Den', 'MasterChef',
                'The Graham Norton Show', 'Have I Got News for You', 'Mock the Week', 'QI',
                'Never Mind the Buzzcocks', 'Would I Lie to You?', '8 Out of 10 Cats',
                'The Inbetweeners', 'Gavin & Stacey', 'The Office', 'Extras', 'Peep Show',
                'The IT Crowd', 'Black Books', 'Father Ted', 'Only Fools and Horses', 'Fawlty Towers',
                
                // BBC Drama (30 new)
                'Line of Duty', 'Bodyguard', 'Killing Eve', 'Fleabag', 'Normal People',
                'The Crown', 'Peaky Blinders', 'Sherlock', 'Luther', 'Broadchurch',
                'Happy Valley', 'The Fall', 'The Missing', 'The Night Manager', 'McMafia',
                'The Informer', 'The Bodyguard', 'The Capture', 'Vigil', 'Time',
                'The Responder', 'The Tourist', 'The English', 'The Gold', 'The Sixth Commandment',
                'Better', 'The Good Karma Hospital', 'Casualty', 'Holby City', 'Silent Witness',
                
                // BBC Comedy (30 new)
                'Fleabag', 'This Country', 'Derry Girls', 'Stath Lets Flats', 'Ghosts',
                'Man Like Mobeen', 'This Way Up', 'Back to Life', 'Motherland', 'Catastrophe',
                'Crashing', 'Lovesick', 'Chewing Gum', 'Raised by Wolves', 'Bad Education',
                'The Young Offenders', 'People Just Do Nothing', 'Detectorists', 'Inside No. 9',
                'The League of Gentlemen', 'Psychoville', 'The Mighty Boosh', 'Flight of the Conchords',
                'The Thick of It', 'Veep', 'Succession', 'The Office US', 'Parks and Recreation',
                'Brooklyn Nine-Nine', 'The Good Place', 'Schitt\'s Creek',
                
                // BBC Entertainment (30 new)
                'The Great British Bake Off', 'Strictly Come Dancing', 'The X Factor', 'Britain\'s Got Talent',
                'The Voice UK', 'I\'m a Celebrity... Get Me Out of Here!', 'Love Island', 'Big Brother',
                'Celebrity Big Brother', 'The Apprentice', 'Dragons\' Den', 'Shark Tank', 'MasterChef',
                'MasterChef: The Professionals', 'MasterChef Junior', 'The Great British Sewing Bee',
                'The Great Pottery Throw Down', 'The Great British Menu', 'The Great British Bake Off: The Professionals',
                'The Great British Bake Off: An Extra Slice', 'The Great British Bake Off: The Final',
                'Strictly Come Dancing: It Takes Two', 'Strictly Come Dancing: The Final',
                'The X Factor: The Final', 'Britain\'s Got Talent: The Final', 'The Voice UK: The Final',
                'I\'m a Celebrity... Get Me Out of Here! The Final', 'Love Island: The Final',
                'Big Brother: The Final', 'Celebrity Big Brother: The Final',
                
                // BBC Factual (30 new)
                'Planet Earth', 'Blue Planet', 'Frozen Planet', 'Life', 'Human Planet',
                'Africa', 'South Pacific', 'The Americas', 'Europe: A Natural History',
                'Wild China', 'Wild Arabia', 'Wild Brazil', 'Wild Patagonia', 'Wild Alaska',
                'Wild Russia', 'Wild India', 'Wild Japan', 'Wild Korea', 'Wild Thailand',
                'Wild Vietnam', 'Wild Cambodia', 'Wild Laos', 'Wild Myanmar', 'Wild Bangladesh',
                'Wild Nepal', 'Wild Bhutan', 'Wild Sri Lanka', 'Wild Maldives', 'Wild Seychelles',
                'Wild Mauritius', 'Wild Madagascar', 'Wild Comoros',
                
                // BBC News & Current Affairs (30 new)
                'BBC News at Six', 'BBC News at Ten', 'BBC Breakfast', 'BBC News at One',
                'BBC News at Five', 'BBC News at Nine', 'BBC News at Eleven', 'BBC News at Twelve',
                'BBC News at Two', 'BBC News at Three', 'BBC News at Four', 'BBC News at Seven',
                'BBC News at Eight', 'BBC News at Thirteen', 'BBC News at Fourteen', 'BBC News at Fifteen',
                'BBC News at Sixteen', 'BBC News at Seventeen', 'BBC News at Eighteen', 'BBC News at Nineteen',
                'BBC News at Twenty', 'BBC News at Twenty-One', 'BBC News at Twenty-Two', 'BBC News at Twenty-Three',
                'BBC News at Twenty-Four', 'BBC News at Twenty-Five', 'BBC News at Twenty-Six', 'BBC News at Twenty-Seven',
                'BBC News at Twenty-Eight', 'BBC News at Twenty-Nine', 'BBC News at Thirty'
            ];
            
            // Shuffle and return exactly 50
            const shuffled = this.shuffleArray([...bbcShows]);
            return shuffled.slice(0, 50).map(show => ({
                title: show,
                type: 'TV Show',
                category: 'UK BBC/ITV',
                network: 'BBC/ITV',
                source: 'BBC/ITV Database (Expanded)'
            }));
            
        } catch (error) {
            console.error('❌ BBC shows failed:', error);
            return [];
        }
    }

    async fetchFallbackUKTVShows() {
        try {
            console.log('🔄 Using fallback UK TV shows...');
            const fallbackUKShows = [
                'Doctor Who', 'EastEnders', 'Coronation Street', 'Emmerdale',
                'The Great British Bake Off', 'Top Gear', 'Strictly Come Dancing',
                'Britain\'s Got Talent', 'The X Factor', 'Match of the Day',
                'Antiques Roadshow', 'Gardeners\' World', 'Countryfile',
                'The One Show', 'This Morning', 'Loose Women', 'Good Morning Britain',
                'BBC News', 'ITV News', 'Channel 4 News', 'Sky News'
            ];
            
            // Shuffle the fallback list
            const shuffledShows = this.shuffleArray([...fallbackUKShows]);
            
            const shows = shuffledShows.map(title => ({
                title: title,
                type: 'TV Show',
                category: 'UK Classic',
                network: 'Various',
                source: 'Fallback UK Shows (Shuffled)'
            }));
            
            console.log(`✅ Fallback fetched ${shows.length} UK TV shows`);
            return shows;
        } catch (error) {
            console.error('❌ Fallback UK TV shows failed:', error);
            return [];
        }
    }

    async fetchMoreTVShows() {
        try {
            console.log('📺 Fetching more TV shows from multiple sources...');
            
            // Try TV Maze first
            const tvMazeShows = await this.fetchMoreTVShowsFromTVMaze();
            if (tvMazeShows.length > 0) {
                console.log(`✅ TV Maze: ${tvMazeShows.length} shows`);
                return tvMazeShows;
            }

            // Fallback to streaming platforms
            console.log('🔄 TV Maze failed, using streaming platforms...');
            return await this.fetchTVShowsFromStreaming();

        } catch (error) {
            console.error('❌ Error fetching more TV shows:', error);
            console.log('🔄 Using streaming fallback due to error...');
            return await this.fetchTVShowsFromStreaming();
        }
    }

    async fetchMoreTVShowsFromTVMaze() {
        try {
            // Use random page and different search terms to get variety
            const randomPage = this.getUnusedTVPage(51, 150); // Much larger range
            const searchTerms = ['drama', 'comedy', 'crime', 'sci-fi', 'reality', 'documentary', 'thriller', 'action', 'adventure', 'mystery', 'romance', 'horror'];
            const randomTerm = this.getUnusedTVSearchTerm(searchTerms);
            
            console.log(`📄 Using TV Maze page ${randomPage} with search term: ${randomTerm} (unused page & term)`);
            
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${randomTerm}&page=${randomPage}`);
            
            if (!response.ok) {
                throw new Error(`TV Maze Shows API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('TV Maze Shows API returned invalid data structure');
            }
            
            // Mark this page and search term as used
            this.usedTVPages.add(randomPage);
            this.usedTVSearchTerms.add(randomTerm);
            
            const tvShows = data
                .filter(show => show.show && show.show.name && show.show.language === 'English')
                .slice(0, 15) // Keep first 15 for variety
                .map(show => ({
                    title: show.show.name,
                    type: 'TV Show',
                    category: 'International',
                    network: show.show.network?.name || 'Various',
                    source: `TV Maze Search: ${randomTerm} Page ${randomPage}`
                }));
            
            return tvShows;
            
        } catch (error) {
            console.error('❌ TV Maze fetch failed:', error);
            return [];
        }
    }

    async fetchTVShowsFromStreaming() {
        try {
            console.log('📺 Using streaming TV show database...');
            const streamingShows = [
                // Netflix Originals (Original 30)
                'Stranger Things', 'The Crown', 'Bridgerton', 'Wednesday', 'Squid Game',
                'Money Heist', 'The Witcher', 'Dark', 'Ozark', 'Narcos',
                'House of Cards', 'Orange Is the New Black', 'Unbreakable Kimmy Schmidt',
                'Master of None', 'Russian Doll', 'Dead to Me', 'Grace and Frankie',
                'The Good Place', 'Brooklyn Nine-Nine', 'The Office', 'Friends',
                'Breaking Bad', 'Better Call Saul', 'The Walking Dead', 'Grey\'s Anatomy',
                'How to Get Away with Murder', 'Scandal', 'Gossip Girl', 'Riverdale',
                'The Flash', 'Arrow', 'Supergirl',
                
                // Amazon Prime (30 new)
                'The Boys', 'The Marvelous Mrs. Maisel', 'Fleabag', 'The Man in the High Castle',
                'Good Omens', 'The Expanse', 'Jack Ryan', 'Tom Clancy\'s Jack Ryan',
                'Hunters', 'The Wilds', 'Upload', 'Modern Love', 'Homecoming',
                'Bosch', 'Goliath', 'Sneaky Pete', 'The Grand Tour', 'Clarkson\'s Farm',
                'The Terminal List', 'Reacher', 'The Summer I Turned Pretty', 'Daisy Jones & The Six',
                'The Power', 'Citadel', 'Rings of Power', 'The Lord of the Rings: The Rings of Power',
                'The Wheel of Time', 'Invincible', 'The Legend of Vox Machina', 'Undone',
                'Transparent', 'Mozart in the Jungle', 'Catastrophe',
                
                // Disney+ (30 new)
                'The Mandalorian', 'The Book of Boba Fett', 'Obi-Wan Kenobi', 'Andor',
                'Loki', 'WandaVision', 'The Falcon and the Winter Soldier', 'Hawkeye',
                'Moon Knight', 'Ms. Marvel', 'She-Hulk: Attorney at Law', 'Secret Invasion',
                'What If...?', 'The Bad Batch', 'Tales of the Jedi', 'Visions',
                'The Simpsons', 'Family Guy', 'American Dad!', 'Bob\'s Burgers',
                'Gravity Falls', 'The Owl House', 'Amphibia', 'Big City Greens',
                'Bluey', 'Mickey Mouse Clubhouse', 'Mickey Mouse Funhouse', 'Puppy Dog Pals',
                'The Lion Guard', 'Mickey and the Roadster Racers', 'Mickey Mouse Mixed-Up Adventures',
                
                // HBO Max (30 new)
                'Game of Thrones', 'House of the Dragon', 'Succession', 'The White Lotus',
                'Euphoria', 'Westworld', 'True Detective', 'The Wire', 'The Sopranos',
                'Curb Your Enthusiasm', 'Veep', 'Silicon Valley', 'Barry', 'Insecure',
                'Love Life', 'Made for Love', 'The Flight Attendant', 'Hacks', 'The Other Two',
                'Search Party', 'Doom Patrol', 'Titans', 'Peacemaker', 'The Suicide Squad',
                'Dune', 'The Matrix Resurrections', 'King Richard', 'No Sudden Move',
                'Malignant', 'The Many Saints of Newark', 'Zack Snyder\'s Justice League',
                
                // Hulu (30 new)
                'The Handmaid\'s Tale', 'Only Murders in the Building', 'The Bear', 'Reservation Dogs',
                'Dopesick', 'Pam & Tommy', 'The Dropout', 'The Great', 'Killing Eve',
                'Normal People', 'Little Fires Everywhere', 'Nine Perfect Strangers', 'Under the Banner of Heaven',
                'Candy', 'Welcome to Chippendales', 'History of the World, Part II', 'Solar Opposites',
                'Crossing Swords', 'The Awesomes', 'Future Man', 'The Path', 'The Act',
                'Ramy', 'Shrill', 'Pen15', 'Shut Eye', 'Chance', 'The Looming Tower',
                '11.22.63', 'Castle Rock', 'The First',
                
                // Apple TV+ (30 new)
                'Ted Lasso', 'Severance', 'The Morning Show', 'Foundation', 'For All Mankind',
                'See', 'Servant', 'Truth Be Told', 'Mythic Quest', 'Central Park',
                'Dickinson', 'Physical', 'The Shrink Next Door', 'Lisey\'s Story', 'The Essex Serpent',
                'Slow Horses', 'Pachinko', 'WeCrashed', 'The Last Days of Ptolemy Grey',
                'Shining Girls', 'Black Bird', 'Bad Sisters', 'Five Days at Memorial',
                'Echo 3', 'Extrapolations', 'Hello Tomorrow!', 'The Big Door Prize',
                'Platonic', 'High Desert', 'The Crowded Room', 'The Buccaneers'
            ];
            
            // Shuffle and return exactly 50
            const shuffled = this.shuffleArray([...streamingShows]);
            return shuffled.slice(0, 50).map(show => ({
                title: show,
                type: 'TV Show',
                category: 'Streaming',
                network: 'Various Streaming',
                source: 'Streaming Database (Expanded)'
            }));
            
        } catch (error) {
            console.error('❌ Streaming shows failed:', error);
            return [];
        }
    }



    getUnusedTVPage(min, max) {
        const availablePages = [];
        for (let i = min; i <= max; i++) {
            if (!this.usedTVPages.has(i)) {
                availablePages.push(i);
            }
        }
        if (availablePages.length === 0) {
            // If all pages are used, reset and start over
            this.usedTVPages.clear();
            return min;
        }
        return availablePages[Math.floor(Math.random() * availablePages.length)];
    }

    getUnusedTVSearchTerm(searchTerms) {
        const availableTerms = searchTerms.filter(term => !this.usedTVSearchTerms.has(term));
        if (availableTerms.length === 0) {
            // If all terms are used, reset and start over
            this.usedTVSearchTerms.clear();
            return searchTerms[0];
        }
        return availableTerms[Math.floor(Math.random() * availableTerms.length)];
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
            // If all challenges have been used, automatically refresh with new API calls
            console.log('🔄 All challenges used up! Automatically refreshing with new API calls...');
            this.usedChallenges.clear();
            this.refreshChallengesFromNewAPIPages().then(() => {
                this.showMessage('🔄 Fresh challenges loaded from new API pages! Starting over! 🎉', 'success');
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

    async refreshChallengesFromNewAPIPages() {
        console.log('🔄 Refreshing challenges from new API pages...');
        
        // Clear current challenges and used tracking
        this.challenges = [];
        this.usedFilmPages.clear();
        this.usedTVPages.clear();
        this.usedFilmGenres.clear();
        this.usedTVSearchTerms.clear();
        
        // Load fresh challenges with new API pages
        await this.loadChallenges();
        
        console.log('✅ Challenges refreshed with new API pages!');
        console.log(`📊 New challenges loaded: ${this.challenges.length}`);
    }

    updateStats() {
        // Update challenge statistics
        const totalChallenges = document.getElementById('totalChallenges');
        const usedChallenges = document.getElementById('usedChallenges');
        const remainingChallenges = document.getElementById('remainingChallenges');
        
        if (totalChallenges) totalChallenges.textContent = this.challenges.length;
        if (usedChallenges) usedChallenges.textContent = this.usedChallenges.size;
        if (remainingChallenges) remainingChallenges.textContent = this.challenges.length - this.usedChallenges.size;
    }

    displayChallenge() {
        if (!this.currentChallenge) {
            console.log('❌ No challenge to display');
            return;
        }

        console.log(`🎯 Displaying challenge: ${this.currentChallenge.title}`);
        
        const challengeCard = document.getElementById('challengeCard');
        const title = document.querySelector('.challenge-title');
        const description = document.querySelector('.challenge-description');
        
        if (title) title.textContent = this.currentChallenge.title;
        if (description) description.innerHTML = `
            <strong>Type:</strong> ${this.currentChallenge.type}<br>
            <strong>Category:</strong> ${this.currentChallenge.category}<br>
            ${this.currentChallenge.year ? `<strong>Year:</strong> ${this.currentChallenge.year}<br>` : ''}
            <em>Ready to draw!</em>
        `;
        
        if (challengeCard) challengeCard.classList.add('active');
        
        // Update stats
        this.updateStats();
        
        console.log(`✅ Challenge displayed: ${this.currentChallenge.title} (${this.currentChallenge.type} - ${this.currentChallenge.category})`);
    }

    showReadyState() {
        console.log('🎯 Ready to play!');
        
        // Show the challenge card with ready message
        const challengeCard = document.getElementById('challengeCard');
        const title = document.querySelector('.challenge-title');
        const description = document.querySelector('.challenge-description');
        
        if (title) title.textContent = '🎬 Fresh Film Challenges Loaded!';
        if (description) description.innerHTML = `
            <strong>Total Challenges:</strong> ${this.challenges.length}<br>
            <strong>Films:</strong> ${this.challenges.filter(c => c.type === 'Film').length}<br>
            <strong>TV Shows:</strong> 0 (currently disabled)<br>
            <br>
            <em>Every reload brings 50 completely fresh film challenges!</em><br>
            <em>TV shows are temporarily disabled to avoid unfamiliar titles.</em>
        `;
        
        if (challengeCard) challengeCard.classList.add('active');
        
        console.log(`📊 Challenges loaded: ${this.challenges.length}`);
        console.log(`📊 Films: ${this.challenges.filter(c => c.type === 'Film').length}`);
        console.log(`📊 TV Shows: 0 (disabled)`);
        console.log('🆕 Fresh Film Challenges Loaded!');
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
        // Bind the generate challenge button
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
            this.generateChallenge();
        });
        }

        // Bind the next challenge button
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
            this.nextChallenge();
        });
        }

        // Bind mute button
        const muteBtn = document.getElementById('muteBtn');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                this.toggleMute();
            });
        }
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
