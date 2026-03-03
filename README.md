# ⏱️ My ETimer App

A beautiful and interactive timer application built with Vue 3 and TypeScript. Perfect for managing multiple timed tasks with visual feedback and sound effects.

**DEMO** <https://waqasahmed.pk/myetimer/>

## ✨ Features

- **Multiple Task Management**: Add, delete, and reorder multiple timed tasks
- **Sequential Timer**: Tasks run in order, one after another
- **Manual Reordering**: Reorder tasks using the up/down controls
- **Four Control Actions**: Start, Pause, Continue, and Stop
- **Visual Feedback**: Color-coded borders, progress bars, and status indicators
- **Sound Effects**: Start sound, task completion sound, and celebration sound
- **Data Persistence**: Save/load your task lists using browser storage
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate to project directory
cd my-etimer-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit `http://localhost:5173` to see My ETimer App in action!

## 📖 How to Use

### Adding Tasks

1. Enter time in seconds and task description
2. Click "Add Task" or press Enter
3. Repeat to add multiple tasks

### Managing Tasks

- **Reorder tasks**: Use the ↑/↓ buttons
- **Move to top/bottom**: Use the ⏫/⏬ buttons
- **Delete a task**: Click the red delete button

### Controlling the Timer

- **Start**: Begin from the first task
- **Pause**: Temporarily stop the current task
- **Continue**: Resume from where you paused
- **Stop**: Reset all tasks to initial state
- **Save**: Store your task list in browser storage

### Visual Indicators

- **Green border**: Task is running
- **Yellow border**: Task is paused
- **Gray border**: Task is completed
- **Progress bar**: Shows time remaining
- **Overall progress bar**: Shows completion percentage

## 🎯 Use Cases

- Workout routines
- Study sessions
- Meditation practices
- Cooking steps
- Presentations

## 📁 Project Structure

```
my-etimer-app/
├── public/
│   └── sounds/           # Sound files
├── src/
│   ├── components/       # Vue components
│   ├── App.vue          # Main app component
│   └── main.ts          # Entry point
├── index.html
└── package.json
```

## 🎨 Customization

### Sound Files

Replace the files in `public/sounds/` with your own:

- `start-fire.mp3` - Start sound
- `change.m4a` - Task completion sound
- `finish-celebration.wav` - All tasks completed sound

### Timer Speed

Adjust `TICK_INTERVAL` in `TimePeriod.vue` (default: 1000ms)

## 📝 Notes

- Tasks are automatically saved to browser localStorage
- Sounds are pre-loaded to eliminate playback delays
- Works on all modern browsers

---

Happy timing with My ETimer App! ⏱️