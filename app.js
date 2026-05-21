(function () {
  const STORAGE_KEY = 'habit_tracker_data';

  let data = loadData();
  let viewWeekStart = getMonday(new Date());

  /* helpers */
  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function todayStr() {
    return formatDate(new Date());
  }

  function isToday(d) {
    return formatDate(d) === todayStr();
  }

  function isFuture(d) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return d > today;
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  /* data */
  function defaultData() {
    return { habits: [], checkmarks: {} };
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.habits)) {
          return parsed;
        }
      }
    } catch (e) {}
    return defaultData();
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function addHabit(name) {
    name = name.trim();
    if (!name) return false;
    const habit = { id: generateId(), name };
    data.habits.push(habit);
    if (!data.checkmarks[habit.id]) {
      data.checkmarks[habit.id] = {};
    }
    saveData();
    render();
    return true;
  }

  function renameHabit(id, newName) {
    newName = newName.trim();
    if (!newName) return;
    const habit = data.habits.find(function (h) { return h.id === id; });
    if (habit) {
      habit.name = newName;
      saveData();
      render();
    }
  }

  function deleteHabit(id) {
    data.habits = data.habits.filter(function (h) { return h.id !== id; });
    delete data.checkmarks[id];
    saveData();
    render();
  }

  function toggleCheck(habitId, dateStr) {
    if (!data.checkmarks[habitId]) {
      data.checkmarks[habitId] = {};
    }
    data.checkmarks[habitId][dateStr] = !data.checkmarks[habitId][dateStr];
    saveData();
    render();
  }

  function getStreak(habitId) {
    const marks = data.checkmarks[habitId] || {};
    const today = new Date();
    const todayKey = formatDate(today);

    if (!marks[todayKey]) return 0;

    let streak = 0;
    let d = new Date(today);
    while (true) {
      const key = formatDate(d);
      if (marks[key]) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  function getWeekDays() {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(viewWeekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }

  function isCurrentWeek() {
    const today = new Date();
    const monday = getMonday(today);
    return formatDate(monday) === formatDate(viewWeekStart);
  }

  function weekLabel() {
    const start = viewWeekStart;
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const opts = { month: 'short', day: 'numeric' };
    if (start.getFullYear() !== end.getFullYear()) {
      opts.year = 'numeric';
    }

    let label = start.toLocaleDateString('en-US', opts) + ' – ' + end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (isCurrentWeek()) {
      label = 'this week  ·  ' + label;
    }
    return label;
  }

  function goToToday() {
    viewWeekStart = getMonday(new Date());
    render();
  }

  function goPrevWeek() {
    viewWeekStart.setDate(viewWeekStart.getDate() - 7);
    render();
  }

  function goNextWeek() {
    viewWeekStart.setDate(viewWeekStart.getDate() + 7);
    render();
  }

  /* rendering */
  function render() {
    const emptyEl = document.getElementById('empty-state');
    const weekNav = document.getElementById('week-nav');
    const tracker = document.getElementById('tracker');

    if (data.habits.length === 0) {
      emptyEl.classList.remove('hidden');
      weekNav.classList.add('hidden');
      tracker.classList.add('hidden');
      return;
    }

    emptyEl.classList.add('hidden');
    weekNav.classList.remove('hidden');
    tracker.classList.remove('hidden');

    renderWeekNav();
    renderGrid();
  }

  function renderWeekNav() {
    document.getElementById('week-label').textContent = weekLabel();
    document.getElementById('prev-btn').onclick = goPrevWeek;
    document.getElementById('next-btn').onclick = goNextWeek;
    document.getElementById('today-btn').onclick = goToToday;
  }

  function renderGrid() {
    const days = getWeekDays();
    const isCurrent = isCurrentWeek();

    renderHeader(days);
    renderBody(days, isCurrent);
  }

  function renderHeader(days) {
    const el = document.getElementById('grid-header');
    const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    let html = '<div class="cell"></div>';
    days.forEach(function (d, i) {
      const cls = isToday(d) ? 'cell today' : 'cell';
      html += '<div class="' + cls + '">' + dayNames[i] + '</div>';
    });
    el.innerHTML = html;
  }

  function renderBody(days, isCurrent) {
    const el = document.getElementById('grid-body');
    const today = todayStr();
    let html = '';

    data.habits.forEach(function (habit) {
      const streak = getStreak(habit.id);
      const streakClass = streak === 0 ? 'streak zero' : streak >= 7 ? 'streak fire' : streak >= 3 ? 'streak hot' : 'streak';

      html += '<div class="habit-row" data-id="' + habit.id + '">';
      html += '<div class="cell">';

      html += '<span class="streak ' + streakClass + '">' + streak + '</span>';

      html += '<span class="habit-name" data-id="' + habit.id + '">' + escapeHtml(habit.name) + '</span>';
      html += '<button class="delete-btn" data-id="' + habit.id + '" aria-label="Delete ' + escapeHtml(habit.name) + '">✕</button>';
      html += '</div>';

      days.forEach(function (d) {
        const dateStr = formatDate(d);
        const checked = data.checkmarks[habit.id] && data.checkmarks[habit.id][dateStr];
        const isTodayCell = isToday(d);
        const future = isFuture(d);

        let cls = 'cell day-cell';
        if (isTodayCell) cls += ' today';
        if (checked) cls += ' checked';
        if (future && !isCurrent) cls += ' future';

        const icon = checked ? '●' : '○';
        html += '<div class="' + cls + '" data-habit="' + habit.id + '" data-date="' + dateStr + '" tabindex="' + (future && !isCurrent ? '-1' : '0') + '" role="checkbox" aria-checked="' + (checked ? 'true' : 'false') + '" aria-label="' + escapeHtml(habit.name) + ' ' + d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + '">';
        html += '<span class="check-icon">' + icon + '</span>';
        html += '</div>';
      });

      html += '</div>';
    });

    el.innerHTML = html;

    /* inline rename */
    var names = el.querySelectorAll('.habit-name');
    Array.from(names).forEach(function (span) {
      span.addEventListener('click', function (e) {
        var id = span.getAttribute('data-id');
        var current = span.textContent;
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'habit-name-input';
        input.value = current;
        input.maxLength = 60;
        span.replaceWith(input);
        input.focus();
        input.select();

        function finish() {
          var val = input.value.trim();
          if (val && val !== current) {
            renameHabit(id, val);
          } else {
            render();
          }
        }

        input.addEventListener('blur', finish);
        input.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter') {
            input.blur();
          } else if (ev.key === 'Escape') {
            render();
          }
        });
      });
    });

    /* delete handlers */
    var delBtns = el.querySelectorAll('.delete-btn');
    Array.from(delBtns).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-id');
        deleteHabit(id);
      });
    });

    /* cell toggle */
    var cells = el.querySelectorAll('.day-cell:not(.future)');
    Array.from(cells).forEach(function (cell) {
      cell.addEventListener('click', function () {
        var habitId = cell.getAttribute('data-habit');
        var dateStr = cell.getAttribute('data-date');
        toggleCheck(habitId, dateStr);
      });

      cell.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var habitId = cell.getAttribute('data-habit');
          var dateStr = cell.getAttribute('data-date');
          toggleCheck(habitId, dateStr);
        }
      });
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* init */
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('add-form');
    var input = document.getElementById('habit-input');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (addHabit(input.value)) {
        input.value = '';
        input.focus();
      }
    });

    render();
  });

})();
