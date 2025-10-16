// app.js (enhanced tracker version)

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
progress: JSON.parse(localStorage.getItem('wg-progress') || '{}') // store entered weights/reps
};

// ---------- DOM Elements ----------
const daysNav = document.getElementById('days-nav');
const dayView = document.getElementById('day-view');

// ---------- Render ----------
function renderDays() {
daysNav.innerHTML = '';
workoutPlan.forEach((d, i) => {
const b = document.createElement('button');
b.className = 'day-btn' + (i === state.currentDay ? ' active' : '');
b.textContent = `Day ${i + 1}`;
b.onclick = () => { state.currentDay = i; render(); };
daysNav.appendChild(b);
});
}

function render() {
renderDays();
const day = workoutPlan[state.currentDay];
const key = `day${state.currentDay}`;
const saved = state.progress[key] || {};

let html = `<h2>${day.day}</h2>`;
day.exercises.forEach((ex, idx) => {
html += `<div class="exercise">
<div class="ex-name">${ex.name}</div>
<div class="set-inputs">`;

for (let s = 1; s <= ex.sets; s++) {
const record = saved[`${idx}-${s}`] || { weight: '', reps: '' };
html += `
<div class="set">
<label>Set ${s}</label>
<input type="number" min="0" class="weight" data-ex="${idx}" data-set="${s}" placeholder="kg" value="${record.weight}">
<input type="number" min="0" class="reps" data-ex="${idx}" data-set="${s}" placeholder="reps" value="${record.reps}">
</div>`;
}

html += `</div></div>`;
});

if (state.settings.showCardio && day.cardio)
html += `<p class="cardio">Cardio: ${day.cardio}</p>`;

dayView.innerHTML = html;

// attach input listeners
dayView.querySelectorAll('input').forEach(input => {
input.addEventListener('input', handleInputChange);
});
}

// ---------- Save Input ----------
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

// ---------- Settings Modal ----------
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
render();
};

// ---------- Init ----------
render();
