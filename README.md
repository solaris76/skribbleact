# 🎬 SkribbleAct - Film & TV Game

A fun party game that combines charades and Pictionary! Players can choose to either act out or draw film titles and UK TV shows.

## 🎯 How to Play

1. **Generate Challenge**: Tap the "Generate Challenge" button to get a random film or TV show
2. **Choose Mode**: Select whether you want to act it out or draw it
3. **Timer**: You have 60 seconds to perform your challenge
4. **No Repeats**: The game tracks used challenges to ensure variety
5. **Next Round**: Click "Next Challenge" to continue playing

## 🚀 Features

- **Dynamic Content**: Fetches current films and UK TV shows from APIs
- **No Repeats**: Local storage prevents duplicate challenges
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Timer System**: 60-second countdown with visual feedback
- **Mobile Friendly**: Works perfectly on all devices
- **Offline Fallback**: Includes classic films and TV shows if APIs are unavailable

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

The game fetches content from:
- **TMDB API**: Popular films and movies
- **TV Maze API**: Current UK TV shows
- **Local Database**: Classic films and UK TV shows

## 📱 Game Modes

### 🎭 Acting Mode
- Perfect for groups who love charades
- Use body language and gestures
- No speaking allowed!

### 🎨 Drawing Mode
- Great for artistic players
- Use any drawing surface
- No words or letters!

## 🎮 Game Flow

1. **Welcome Screen** → Ready to play
2. **Generate Challenge** → Get random title
3. **Mode Selection** → Choose act or draw
4. **Game Timer** → 60-second countdown
5. **Results** → Time's up!
6. **Next Round** → Continue playing

## 🔧 Technical Details

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js with Express
- **Storage**: Local Storage for challenge tracking
- **APIs**: TMDB (films), TV Maze (TV shows)
- **Responsive**: Mobile-first design approach

## 🎉 Tips for Great Gameplay

- **For Acting**: Use exaggerated gestures and facial expressions
- **For Drawing**: Start with the main concept, add details later
- **Team Play**: Split into teams and keep score
- **Time Management**: Use the full 60 seconds strategically
- **Creativity**: Think outside the box for challenging titles

## 🐛 Troubleshooting

### Game won't load challenges
- Check your internet connection
- Refresh the page to retry API calls
- The game includes fallback content

### Timer not working
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser console for errors

### Styling issues
- Clear browser cache
- Ensure CSS file is loading
- Check for browser compatibility

## 📄 License

MIT License - Feel free to modify and distribute!

## 🤝 Contributing

Want to add more challenges or improve the game?
- Add new film/TV show titles
- Improve the UI/UX
- Add new game modes
- Enhance the timer system

---

**Have fun playing SkribbleAct! 🎭🎨**
