// app.js – Workout Tracker with History, Timer & Vibration

// ---------- Workout Plan ----------
const workoutPlan = [
{
day: "Day 1 – Chest + Triceps + Core",
exercises: [
{ name: "Barbell Bench Press", sets: 4 },
{ name: "Incline Dumbbell Press", sets: 3 },
{ name: "Dumbbell Fly / Cable", sets: 3 },
{ name: "Triceps Dips / Close-Grip Push-Up", sets: 3 },
{ name: "Overhead Triceps Extension", sets: 3 },
{ name: "Plank", sets: 3 },
{ name: "Hanging Leg Raise", sets: 3 }
],
cardio: "20 min brisk incline walk or cycling"
},
{
day: "Day 2 – Back + Biceps",
exercises: [
{ name: "Pull-Ups (or Lat Pulldown)", sets: 4 },
{ name: "Barbell Row", sets: 4 },
{ name: "Seated Cable Row", sets: 3 },
{ name: "Barbell Curl", sets: 3 },
{ name: "Hammer Curl", sets: 3 },
{ name: "Face Pull (optional)", sets: 2 }
],
cardio: "20 min rowing or light jog"
},
{
day: "Day 3 – Legs + Core",
exercises: [
{ name: "Squats", sets: 4 },
{ name: "Romanian Deadlift", sets: 3 },
{ name: "Walking Lunges", sets: 3 },
{ name: "Leg Press", sets: 3 },
{ name: "Standing Calf Raise", sets: 3 },
{ name: "Cable Crunch", sets: 3 },
{ name: "Russian Twist", sets: 3 }
],
cardio: "20 min incline treadmill walk"
},
{
day: "Day 4 – Chest + Shoulders + Triceps",
exercises: [
{ name: "Incline Barbell Press", sets: 4 },
{ name: "Seated Dumbbell Shoulder Press", sets: 3 },
{ name: "Lateral Raise", sets: 3 },
{ name: "Cable Crossover", sets: 3 },
{ name: "Triceps Pushdown", sets: 3 },
{ name: "Diamond Push-Up", sets: 2 }
],
cardio: "20 min stair climber or cycling"
},
{
day: "Day 5 – Back + Biceps + Core",
exercises: [
{ name: "Deadlift", sets: 4 },
{ name: "Pull-Down (Wide Grip)", sets: 3 },
{ name: "One-Arm Dumbbell Row", sets: 3 },
{ name: "EZ Bar Curl", sets: 3 },
{ name: "Concentration Curl", sets: 3 },
{ name: "Hanging Knee Raise", sets: 3 },
{ name: "Side Plank", sets: 3 }
],
cardio: "20 min jog or elliptical"
},
{
day: "Day 6 – Legs + Core",
exercises: [
{ name: "Front Squat / Goblet Squat", sets: 4 },
{ name: "Leg Curl", sets: 3 },
{ name: "Bulgarian Split Squat", sets: 3 },
{ name: "Calf Press (Machine)", sets: 3 },
{ name: "Ab Wheel Rollout", sets: 3 },
{ name: "Mountain Climbers", sets: 3 }
],
cardio: "20 min brisk walk or cycling"
}
];

// ---------- State ----------
let state = {
currentDay: 0,
settings: JSON.parse(localStorage.getItem('wg-settings') || '{}') || { restDuration: 60, units: 'kg', showCardio: true },
progress: JSON.parse(localStorage.getItem('wg-progress') || '{}'),
startTime: null,
timer: null
};

// ---------- DOM ----------
const daysNav = document.getElementById('days-nav');
const dayView = document.getElementById('day-view');
const historyView = document.getElementById('history-view');
const startTimeEl = document.getElementById('start-time');
const currentTimeEl = document.getElementById('current-time');

// ---------- Time Display ----------
function updateTime() {
if (!state.startTime) {
state.startTime = new Date();
startTimeEl.textContent = state.startTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}
currentTimeEl.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}
setInterval(updateTime, 1000);
updateTime();

// ---------- Rendering ----------
function renderDays() {
daysNav.innerHTML = '';
workoutPlan.forEach((d, i) => {
const b = document.createElement('button');
b.className = 'day-btn' + (i === state.currentDay ? ' active' : '');
b.textContent = `Day ${i + 1}`;
b.onclick = () => { state.currentDay = i; renderWorkout(); };
daysNav.appendChild(b);
});
}

function renderWorkout() {
renderDays();
historyView.classList.add('hidden');
dayView.classList.remove('hidden');

const day = workoutPlan[state.currentDay];
const key = `day${state.currentDay}`;
const saved = state.progress[key] || {};

let html = `<h2>${day.day}</h2>`;
day.exercises.forEach((ex, idx) => {
html += `<div class="exercise"><div class="ex-name">${ex.name}</div><div class="set-inputs">`;

for (let s = 1; s <= ex.sets; s++) {
const record = saved[`${idx}-${s}`] || { weight: '', reps: '', done: false };
html += `
<div class="set ${record.done ? 'done' : ''}">
<label>Set ${s}</label>
<input type="number" min="0" class="weight" data-ex="${idx}" data-set="${s}" placeholder="kg" value="${record.weight}">
<input type="number" min="0" class="reps" data-ex="${idx}" data-set="${s}" placeholder="reps" value="${record.reps}">
<input type="checkbox" class="complete" data-ex="${idx}" data-set="${s}" ${record.done ? 'checked' : ''}> ✅
</div>`;
}
html += `</div></div>`;
});

if (state.settings.showCardio && day.cardio)
html += `<p class="cardio">Cardio: ${day.cardio}</p>`;

dayView.innerHTML = html;

// listeners
dayView.querySelectorAll('input').forEach(input => {
input.addEventListener('input', handleInputChange);
});
dayView.querySelectorAll('.complete').forEach(chk => {
chk.addEventListener('change', handleSetComplete);
});
}

function handleInputChange(e) {
const el = e.target;
const key = `day${state.currentDay}`;
if (!state.progress[key]) state.progress[key] = {};

const id = `${el.dataset.ex}-${el.dataset.set}`;
const record = state.progress[key][id] || {};
if (el.classList.contains('weight')) record.weight = el.value;
if (el.classList.contains('reps')) record.reps = el.value;

state.progress[key][id] = record;
localStorage.setItem('wg-progress', JSON.stringify(state.progress));
}

function handleSetComplete(e) {
const el = e.target;
const key = `day${state.currentDay}`;
const id = `${el.dataset.ex}-${el.dataset.set}`;
const record = state.progress[key][id] || {};
record.done = el.checked;
state.progress[key][id] = record;
localStorage.setItem('wg-progress', JSON.stringify(state.progress));

el.closest('.set').classList.toggle('done', el.checked);

if (el.checked) {
triggerVibration(100); // short buzz
startRestTimer();
}
}

// ---------- Rest Timer ----------
function startRestTimer() {
const rest = state.settings.restDuration || 60;
let timeLeft = rest;
if (state.timer) clearInterval(state.timer);
alert(`Rest ${timeLeft} seconds`);

state.timer = setInterval(() => {
timeLeft--;
if (timeLeft <= 0) {
clearInterval(state.timer);
triggerVibration([200, 100, 200]); // 3 short buzzes
alert("Rest over! Time for next set 💪");
}
}, 1000);
}

// ---------- Vibration ----------
function triggerVibration(pattern) {
if (navigator.vibrate) {
navigator.vibrate(pattern);
}
}

// ---------- History Tab ----------
function renderHistory() {
dayView.classList.add('hidden');
historyView.classList.remove('hidden');

let bests = {};

Object.values(state.progress).forEach(day => {
for (const [key, rec] of Object.entries(day)) {
if (rec.weight) {
const [exIdx] = key.split('-');
const exName = workoutPlan.flatMap(d => d.exercises)[exIdx]?.name;
if (exName) {
bests[exName] = Math.max(bests[exName] || 0, Number(rec.weight));
}
}
}
});

let html = `<h2>History – Best Weights</h2>`;
if (Object.keys(bests).length === 0) html += `<p>No data yet</p>`;
else {
html += `<table><tr><th>Exercise</th><th>Best (${state.settings.units})</th></tr>`;
for (const [ex, val] of Object.entries(bests)) {
html += `<tr><td>${ex}</td><td>${val}</td></tr>`;
}
html += `</table>`;
}

historyView.innerHTML = html;
}

// ---------- Tabs ----------
document.getElementById('workout-tab').onclick = function() {
this.classList.add('active');
document.getElementById('history-tab').classList.remove('active');
renderWorkout();
};

document.getElementById('history-tab').onclick = function() {
this.classList.add('active');
document.getElementById('workout-tab').classList.remove('active');
renderHistory();
};

// ---------- Settings ----------
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
modal.classList.add('hidden');
renderWorkout();
};

// ---------- Init ----------
renderWorkout();
