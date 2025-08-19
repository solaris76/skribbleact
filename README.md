# 🎬 SkribbleAct - Film & TV Game

A fun party game that combines charades and Pictionary! Players can choose to either act out or draw film titles and UK TV shows. **Now with 1,080+ challenges and massive variety!**

## 🎯 How to Play

1. **Generate Challenge**: Tap the "Generate Challenge" button to get a random film or TV show
2. **Random Mode**: Each challenge randomly shows either **"Draw It!"** 🎨 or **"Act It!"** 🎭
3. **Timer**: You have 60 seconds to perform your challenge
4. **Fresh Content**: Every page reload brings 50 completely new challenges
5. **Next Round**: Click "Next Challenge" to continue playing

## 🚀 **NEW FEATURES (Latest Update)**

### **🎯 Massive Challenge Database:**
- **500+ Film Titles** across 9 categories (Classic, Modern Blockbusters, International, Cult Classics, Sci-Fi & Fantasy, Action & Adventure, Comedy & Romance, Horror & Thriller, Animation & Family)
- **300+ Streaming TV Shows** from Netflix, Amazon Prime, Disney+, HBO Max, Hulu, Apple TV+
- **100+ OMDB API Films** for current popular titles
- **Total: 1,080+ Challenges** - virtually unlimited variety!

### **🔄 Anti-Repeat System:**
- **Session-based tracking** - fresh content on every page reload
- **API page rotation** - uses different pages each time
- **Timestamp randomization** - adds unpredictability to sorting
- **Challenge rotation** - session-specific shuffling for maximum variety

### **📱 Enhanced UI/UX:**
- **Loading indicator** with progress bar and real-time status updates
- **Random challenge mode** - "Draw It!" or "Act It!" for every challenge
- **Beautiful animations** and modern design
- **Mobile-first responsive** design

## 🛠️ Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the game server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Development Mode
For development with auto-restart:
```bash
npm run dev
```

## 🌐 Data Sources

The game fetches content from multiple sources:
- **OMDB API**: Current popular films (with your API key)
- **TV Maze API**: Current UK TV shows and schedules
- **Massive Fallback Database**: 500+ classic and modern films
- **Streaming Database**: 300+ shows from major platforms

## 📱 Game Modes

### 🎭 Acting Mode
- Perfect for groups who love charades
- Use body language and gestures
- No speaking allowed!

### 🎨 Drawing Mode
- Great for artistic players
- Use any drawing surface
- No words or letters!

### 📝 **Describe Mode**
- Perfect for storytellers and wordsmiths
- Describe the plot and story without revealing the title
- **Rules**: No character names, no actor names, no title mentions
- Use creative descriptions and plot details to help others guess

### 🎵 **Sing Mode**
- Perfect for musical players and those who love soundtracks
- Hum or sing the theme music without revealing the title
- **Rules**: No lyrics allowed - just melody and rhythm
- Use the iconic music and themes to help others guess

### 🎲 **Random Mode Selection**
- **Every challenge** randomly shows either "Draw It!" 🎨, "Act It!" 🎭, "Describe It!" 📝, or "Sing It!" 🎵
- **Independent of content type** - films can be "Draw It!" and TV shows can be "Act It!"
- **25% chance** for each mode for maximum variety and surprise

## 🎮 Game Flow

1. **Loading Screen** → Fresh challenges loading with progress indicator
2. **Welcome Screen** → Ready to play with challenge count
3. **Generate Challenge** → Get random title with random mode
4. **Mode Display** → See "Draw It!" 🎨, "Act It!" 🎭, "Describe It!" 📝, or "Sing It!" 🎵
5. **Game Timer** → 60-second countdown with visual feedback
6. **Results** → Time's up!
7. **Next Round** → Continue playing with new random mode

## 🔧 Technical Details

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js with Express
- **APIs**: OMDB (films), TV Maze (TV shows)
- **Database**: Massive local fallback with 1,080+ challenges
- **Anti-Repeat**: Sophisticated tracking and rotation system
- **Responsive**: Mobile-first design approach
- **PWA Ready**: Service worker and manifest for app-like experience

## 🎉 Tips for Great Gameplay

- **For Acting**: Use exaggerated gestures and facial expressions
- **For Drawing**: Start with the main concept, add details later
- **Team Play**: Split into teams and keep score
- **Time Management**: Use the full 60 seconds strategically
- **Creativity**: Think outside the box for challenging titles
- **Variety**: Every reload brings completely fresh challenges!
- **Four Modes**: Draw, Act, Describe, or Sing for maximum gameplay variety

## 🐛 Troubleshooting

### Game won't load challenges
- Check your internet connection
- Refresh the page to retry API calls
- The game includes massive fallback content (1,080+ challenges)

### Timer not working
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser console for errors

### Styling issues
- Clear browser cache
- Ensure CSS file is loading
- Check for browser compatibility

## 📊 **Challenge Categories**

### **Films (500+ titles):**
- **Classic Films**: The Godfather, Casablanca, Citizen Kane
- **Modern Blockbusters**: Avengers, Star Wars, The Matrix
- **International**: Parasite, Roma, Crouching Tiger
- **Cult Classics**: Rocky Horror, Donnie Darko, The Big Lebowski
- **Sci-Fi & Fantasy**: Blade Runner, Star Trek, The Terminator
- **Action & Adventure**: Die Hard, Indiana Jones, Mission Impossible
- **Comedy & Romance**: Groundhog Day, Love Actually, Notting Hill
- **Horror & Thriller**: The Shining, Scream, Get Out
- **Animation & Family**: Toy Story, Frozen, The Lion King

### **TV Shows (300+ titles):**
- **Netflix**: Stranger Things, The Crown, Bridgerton
- **Amazon Prime**: The Boys, Fleabag, Good Omens
- **Disney+**: The Mandalorian, Loki, WandaVision
- **HBO Max**: Game of Thrones, Succession, The White Lotus
- **Hulu**: The Handmaid's Tale, Only Murders in the Building
- **Apple TV+**: Ted Lasso, Severance, The Morning Show

## 📄 License

MIT License - Feel free to modify and distribute!

## 🤝 Contributing

Want to add more challenges or improve the game?
- Add new film/TV show titles to the fallback databases
- Improve the UI/UX
- Add new game modes
- Enhance the anti-repeat system
- Expand the challenge categories

---

**Have fun playing SkribbleAct with 1,080+ fresh challenges! 🎭🎨✨**
