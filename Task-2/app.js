'use strict';

const STORAGE_KEY = 'task-manager.tasks.v1';

// ---------- State ----------
let tasks = [];
const view = { status: 'all', category: 'all', query: '' };

// ---------- Persistence ----------
function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    showError('Could not save your tasks. Browser storage may be full or disabled.');
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

// ---------- DOM ----------
const $ = id => document.getElementById(id);
const list = $('list'), empty = $('empty'), summary = $('summary'), errorEl = $('error');
const addForm = $('add-form'), editDialog = $('edit-dialog'), editForm = $('edit-form');
let editingId = null, dragId = null;

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = !msg;
}

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function formatDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

// ---------- CRUD ----------
function addTask(title, category, due) {
  tasks.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title, category, due, completed: false });
  saveToLocalStorage();
  render();
}

function updateTask(id, changes) {
  tasks = tasks.map(t => (t.id === id ? { ...t, ...changes } : t));
  saveToLocalStorage();
  render();
}

function deleteTask(id, el) {
  const finish = () => { tasks = tasks.filter(t => t.id !== id); saveToLocalStorage(); render(); };
  if (el && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.classList.add('removing');
    setTimeout(finish, 280);
  } else finish();
}

// ---------- Filtering ----------
function visibleTasks() {
  const q = view.query.trim().toLowerCase();
  return tasks.filter(t =>
    (view.status === 'all' || (view.status === 'completed') === t.completed) &&
    (view.category === 'all' || t.category === view.category) &&
    (!q || t.title.toLowerCase().includes(q))
  );
}

// ---------- Render ----------
function createItem(t) {
  const li = document.createElement('li');
  li.className = 'task' + (t.completed ? ' done' : '');
  li.dataset.id = t.id;
  li.dataset.cat = t.category;
  li.draggable = true;

  const handle = document.createElement('span');
  handle.className = 'handle'; handle.textContent = '⠿'; handle.title = 'Drag to reorder'; handle.setAttribute('aria-hidden', 'true');

  const box = document.createElement('input');
  box.type = 'checkbox'; box.checked = t.completed;
  box.setAttribute('aria-label', `Mark "${t.title}" as ${t.completed ? 'active' : 'completed'}`);
  box.addEventListener('change', () => updateTask(t.id, { completed: box.checked }));

  const body = document.createElement('div');
  body.className = 'body';
  const name = document.createElement('span');
  name.className = 'name'; name.textContent = t.title;
  const meta = document.createElement('div');
  meta.className = 'meta';
  const cat = document.createElement('span');
  cat.className = 'cat'; cat.textContent = t.category;
  meta.append(cat);
  if (t.due) {
    const due = document.createElement('span');
    const late = !t.completed && t.due < todayStr();
    due.className = late ? 'overdue' : '';
    due.textContent = (late ? 'Overdue: ' : 'Due ') + formatDate(t.due);
    meta.append(due);
  }
  body.append(name, meta);

  const edit = document.createElement('button');
  edit.className = 'icon'; edit.type = 'button'; edit.textContent = 'Edit';
  edit.setAttribute('aria-label', `Edit "${t.title}"`);
  edit.addEventListener('click', () => openEdit(t));

  const del = document.createElement('button');
  del.className = 'icon del'; del.type = 'button'; del.textContent = 'Delete';
  del.setAttribute('aria-label', `Delete "${t.title}"`);
  del.addEventListener('click', () => deleteTask(t.id, li));

  li.append(handle, box, body, edit, del);

  li.addEventListener('dragstart', e => { dragId = t.id; li.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', t.id); });
  li.addEventListener('dragend', () => { dragId = null; li.classList.remove('dragging'); document.querySelectorAll('.drop-target').forEach(n => n.classList.remove('drop-target')); });
  li.addEventListener('dragover', e => { if (dragId && dragId !== t.id) { e.preventDefault(); li.classList.add('drop-target'); } });
  li.addEventListener('dragleave', () => li.classList.remove('drop-target'));
  li.addEventListener('drop', e => { e.preventDefault(); reorder(dragId, t.id); });
  return li;
}

function reorder(fromId, toId) {
  if (!fromId || fromId === toId) return;
  const from = tasks.findIndex(t => t.id === fromId);
  const [moved] = tasks.splice(from, 1);
  const to = tasks.findIndex(t => t.id === toId);
  tasks.splice(to, 0, moved);
  saveToLocalStorage();
  render();
}

function render() {
  const shown = visibleTasks();
  list.replaceChildren(...shown.map(createItem));

  const active = tasks.filter(t => !t.completed).length;
  summary.textContent = tasks.length
    ? `${active} active, ${tasks.length - active} completed`
    : 'Nothing here yet.';

  empty.hidden = shown.length > 0;
  if (!shown.length) {
    empty.textContent = tasks.length
      ? 'No tasks match your filters. Try a different filter or search.'
      : 'No tasks yet. Add your first task above.';
  }
  $('clear').disabled = !tasks.some(t => t.completed);
}

// ---------- Edit dialog ----------
function openEdit(t) {
  editingId = t.id;
  $('e-title').value = t.title;
  $('e-category').value = t.category;
  $('e-due').value = t.due || '';
  editDialog.showModal();
  $('e-title').focus();
}
editForm.addEventListener('submit', () => {
  const title = $('e-title').value.trim();
  if (title) updateTask(editingId, { title, category: $('e-category').value, due: $('e-due').value });
});
$('e-cancel').addEventListener('click', () => editDialog.close());

// ---------- Events ----------
addForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = $('title').value.trim();
  if (!title) { showError('Enter a task title before adding.'); $('title').focus(); return; }
  showError('');
  addTask(title, $('category').value, $('due').value);
  addForm.reset();
  $('title').focus();
});

document.querySelectorAll('.chip').forEach(chip =>
  chip.addEventListener('click', () => {
    view.status = chip.dataset.filter;
    document.querySelectorAll('.chip').forEach(c => {
      const on = c === chip;
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on);
    });
    render();
  })
);
$('search').addEventListener('input', e => { view.query = e.target.value; render(); });
$('cat-filter').addEventListener('change', e => { view.category = e.target.value; render(); });
$('clear').addEventListener('click', () => { tasks = tasks.filter(t => !t.completed); saveToLocalStorage(); render(); });

// Keep tabs in sync
window.addEventListener('storage', e => { if (e.key === STORAGE_KEY) { tasks = loadFromLocalStorage(); render(); } });

// ---------- Init ----------
tasks = loadFromLocalStorage();
render();
