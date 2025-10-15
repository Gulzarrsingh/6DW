// app.js
const workoutPlan = [
{
day: "Day 1 – Chest + Triceps + Core",
exercises: [
{ name: "Barbell Bench Press", sets: 4, reps: "8–10" },
{ name: "Incline Dumbbell Press", sets: 3, reps: "10–12" },
{ name: "Dumbbell Fly / Cable", sets: 3, reps: "12" },
{ name: "Triceps Dips / Close-Grip Push-Up", sets: 3, reps: "10–12" },
{ name: "Overhead Triceps Extension", sets: 3, reps: "12" },
{ name: "Plank", sets: 3, reps: "45 sec" },
{ name: "Hanging Leg Raise", sets: 3, reps: "15" }
],
cardio: "20 min brisk incline walk or cycling"
},
{
day: "Day 2 – Back + Biceps",
exercises: [
{ name: "Pull-Ups (or Lat Pulldown)", sets: 4, reps: "8–10" },
{ name: "Barbell Row", sets: 4, reps: "8–10" },
{ name: "Seated Cable Row", sets: 3, reps: "12" },
{ name: "Barbell Curl", sets: 3, reps: "10" },
{ name: "Hammer Curl", sets: 3, reps: "12" },
{ name: "Face Pull (optional)", sets: 2, reps: "15" }
],
cardio: "20 min rowing or light jog"
},
{
day: "Day 3 – Legs + Core",
exercises: [
{ name: "Squats", sets: 4, reps: "8–10" },
{ name: "Romanian Deadlift", sets: 3, reps: "10" },
{ name: "Walking Lunges", sets: 3, reps: "12 each leg" },
{ name: "Leg Press", sets: 3, reps: "12" },
{ name: "Standing Calf Raise", sets: 3, reps: "15" },
{ name: "Cable Crunch", sets: 3, reps: "15" },
{ name: "Russian Twist", sets: 3, reps: "20 each side" }
],
cardio: "20 min incline treadmill walk"
},
{
day: "Day 4 – Chest + Shoulders + Triceps",
exercises: [
{ name: "Incline Barbell Press", sets: 4, reps: "8–10" },
{ name: "Seated Dumbbell Shoulder Press", sets: 3, reps: "10" },
{ name: "Lateral Raise", sets: 3, reps: "12" },
{ name: "Cable Crossover", sets: 3, reps: "12" },
{ name: "Triceps Pushdown", sets: 3, reps: "12" },
{ name: "Diamond Push-Up", sets: 2, reps: "To failure" }
],
cardio: "20 min stair climber or cycling"
},
{
day: "Day 5 – Back + Biceps + Core",
exercises: [
{ name: "Deadlift", sets: 4, reps: "6–8" },
{ name: "Pull-Down (Wide Grip)", sets: 3, reps: "10" },
{ name: "One-Arm Dumbbell Row", sets: 3, reps: "10" },
{ name: "EZ Bar Curl", sets: 3, reps: "10" },
{ name: "Concentration Curl", sets: 3, reps: "12" },
{ name: "Hanging Knee Raise", sets: 3, reps: "15" },
{ name: "Side Plank", sets: 3, reps: "45 sec each side" }
],
cardio: "20 min jog or elliptical"
},
{
day: "Day 6 – Legs + Core",
exercises: [
{ name: "Front Squat or Goblet Squat", sets: 4, reps: "8–10" },
{ name: "Leg Curl", sets: 3, reps: "12" },
{ name: "Bulgarian Split Squat", sets: 3, reps: "10 each leg" },
{ name: "Calf Press (Machine)", sets: 3, reps: "15" },
{ name: "Ab Wheel Rollout", sets: 3, reps: "12" },
{ name: "Mountain Climbers", sets: 3, reps: "30 sec" }
],
cardio: "20 min brisk walk or light cycling"
}
];

const daysNav = document.getElementById('days-nav');
const dayView = document.getElementById('day-view');
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer');
const nextBtn = document.getElementById('next-exercise');

let state = {
currentDay: 0,
currentIndex: 0,
isRunning: false,
timer: null,
remaining: 0,
settings: JSON.parse(localStorage.getItem('wg-settings') || '{}') || { restDuration: 60, units: 'kg', showCardio: true }
};

function renderDays() {
daysNav.innerHTML = '';
workoutPlan.forEach((d, i) => {
const b = document.createElement('button');
b.className = 'day-btn' + (i === state.currentDay ? ' active' : '');
b.textContent = `Day ${i+1}`;
b.onclick = () => { state.currentDay = i; state.currentIndex = 0; render(); };
daysNav.appendChild(b);
});
}

function render() {
renderDays();
const day = workoutPlan[state.currentDay];
dayView.innerHTML = `<h2>${day.day}</h2>`;
const list = document.createElement('div');

day.exercises.forEach((ex, idx) => {
const exDiv = document.createElement('div');
exDiv.className = 'exercise';
exDiv.dataset.index = idx;
exDiv.innerHTML = `<div><div class="ex-name">${ex.name}</div><div class="ex-sets">${ex.sets} sets • ${ex.reps}</div></div>
<div>${state.currentIndex===idx ? '▶' : ''}</div>`;
list.appendChild(exDiv);
});

if (state.settings.showCardio && day.cardio) {
const c = document.createElement('p');
c.style.marginTop = '8px';
c.style.color = '#475569';
c.textContent = `Cardio: ${day.cardio}`;
dayView.appendChild(c);
}

dayView.appendChild(list);
updateTimerDisplay();
}

function updateTimerDisplay() {
if (state.isRunning) {
const sec = state.remaining;
const mm = String(Math.floor(sec/60)).padStart(2,'0');
const ss = String(sec%60).padStart(2,'0');
timerDisplay.textContent = `${mm}:${ss}`;
} else {
timerDisplay.textContent = '00:00';
}
}

function startRestTimer() {
if (state.timer) clearInterval(state.timer);
state.remaining = Number(state.settings.restDuration || 60);
state.isRunning = true;
updateTimerDisplay();
state.timer = setInterval(() => {
state.remaining--;
updateTimerDisplay();
if (state.remaining <= 0) {
clearInterval(state.timer);
state.isRunning = false;
state.timer = null;
alert('Rest over — next set/exercise!');
updateTimerDisplay();
}
}, 1000);
}

startTimerBtn.addEventListener('click', () => {
if (state.isRunning) {
// stop
if (state.timer) clearInterval(state.timer);
state.isRunning = false;
state.timer = null;
updateTimerDisplay();
startTimerBtn.textContent = 'Start Timer';
} else {
startRestTimer();
startTimerBtn.textContent = 'Stop Timer';
}
});

nextBtn.addEventListener('click', () => {
const day = workoutPlan[state.currentDay];
if (state.currentIndex < day.exercises.length - 1) state.currentIndex++;
else state.currentIndex = 0;
render();
});


// Settings modal
const modal = document.getElementById('settings-modal');
document.getElementById('open-settings').onclick = () => {
modal.classList.remove('hidden');
document.getElementById('rest-duration').value = state.settings.restDuration || 60;
document.getElementById('units-select').value = state.settings.units || 'kg';
document.getElementById('show-cardio').checked = state.settings.showCardio !== false;
};
document.getElementById('close-settings').onclick = () => modal.classList.add('hidden');
document.getElementById('save-settings').onclick = () => {
const r = Number(document.getElementById('rest-duration').value || 60);
const u = document.getElementById('units-select').value;
const sc = document.getElementById('show-cardio').checked;
state.settings = { restDuration: r, units: u, showCardio: sc };
localStorage.setItem('wg-settings', JSON.stringify(state.settings));
document.getElementById('weight-display').textContent = `${state.settings.units === 'kg' ? '87 kg' : '192 lb'}`;
modal.classList.add('hidden');
render();
};

// init
render();
