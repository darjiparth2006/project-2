// Minimal client logic for CRUD interactions
const apiBase = 'php';

/* UI helpers */
function showToast(msg){
  let t = document.querySelector('.toast');
  if(!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.style.display='block'; clearTimeout(t._hide);
  t._hide = setTimeout(()=>{ t.style.display='none'; }, 3000);
}

function toggleModal(show){
  const m = document.getElementById('alloc-modal');
  if(!m) return;
  m.style.display = show? 'flex':'none';
}

async function request(url, opts={}){
  const r = await fetch(url, opts);
  return r.json();
}

document.addEventListener('DOMContentLoaded',()=>{
  if(location.pathname.endsWith('books.html')) initBooks();
  if(location.pathname.endsWith('students.html')) initStudents();
  if(location.pathname.endsWith('status.html')) initStatus();
});

/* Books */
async function initBooks(){
  const form = document.getElementById('book-form');
  const tableBody = document.querySelector('#books-table tbody');
  const resetBtn = document.getElementById('book-reset');

  async function load(){
    const res = await request(`${apiBase}/books.php?action=list`);
    document.getElementById('books-count').textContent = res.length;
    tableBody.innerHTML = res.map(b=>`<tr data-title="${escape(b.title)}" data-author="${escape(b.author)}" data-isbn="${escape(b.isbn)}"><td>${escape(b.title)}</td><td>${escape(b.author)}</td><td>${escape(b.isbn)}</td><td class="actions"><button class="icon-btn" onclick="editBook(${b.id})">Edit</button><button class="btn secondary" onclick="openAlloc(${b.id}, '${escape(b.title)}')">Allocate</button></td></tr>`).join('');
  }

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const id = document.getElementById('book-id').value;
    const payload = {title:document.getElementById('book-title').value, author:document.getElementById('book-author').value, isbn:document.getElementById('book-isbn').value};
    const action = id? 'update':'create';
    if(id) payload.id = id;
    await request(`${apiBase}/books.php?action=${action}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    form.reset(); document.getElementById('book-id').value = '';
    load();
  });

  resetBtn.addEventListener('click',()=>{form.reset();document.getElementById('book-id').value=''});
  window.editBook = async id =>{
    const res = await request(`${apiBase}/books.php?action=get&id=${id}`);
    document.getElementById('book-id').value = res.id;
    document.getElementById('book-title').value = res.title;
    document.getElementById('book-author').value = res.author;
    document.getElementById('book-isbn').value = res.isbn;
  };

  window.openAlloc = async (id, title) =>{
    const sel = document.getElementById('alloc-student-select');
    sel.innerHTML = '<option>Loading...</option>';
    toggleModal(true);
    document.getElementById('alloc-book-title').textContent = title;
    sel.dataset.bookId = id;
    const students = await request(`${apiBase}/students.php?action=list`);
    sel.innerHTML = students.map(s=>`<option value="${s.id}">${s.name} (${s.email||'no email'})</option>`).join('');
  };

  document.getElementById('alloc-close')?.addEventListener('click',()=>toggleModal(false));
  document.getElementById('alloc-cancel')?.addEventListener('click',()=>toggleModal(false));
  document.getElementById('alloc-confirm')?.addEventListener('click', async ()=>{
    const sel = document.getElementById('alloc-student-select');
    const bookId = sel.dataset.bookId; const sid = sel.value;
    await request(`${apiBase}/allocate.php?action=allocate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({book_id:bookId,student_id:sid})});
    showToast('Book allocated'); toggleModal(false); load();
  });

  document.getElementById('books-search')?.addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase(); [...tableBody.querySelectorAll('tr')].forEach(r=>{
      const t = (r.dataset.title + ' ' + r.dataset.author + ' ' + r.dataset.isbn).toLowerCase(); r.style.display = t.includes(q)? 'table-row':'none';
    });
  });
  document.getElementById('refresh-books')?.addEventListener('click', load);

  load();
}

/* Students */
async function initStudents(){
  const form = document.getElementById('student-form');
  const tableBody = document.querySelector('#students-table tbody');
  const resetBtn = document.getElementById('student-reset');

  async function load(){
    const students = await request(`${apiBase}/students.php?action=list`);
    document.getElementById('students-count').textContent = students.length;
    tableBody.innerHTML = students.map(s=>`<tr data-name="${escape(s.name)}" data-email="${escape(s.email)}"><td>${escape(s.name)}</td><td>${escape(s.email)}</td><td>${escape((s.books||[]).map(b=>b.title).join(', '))}</td><td class="actions"><button class="icon-btn" onclick="editStudent(${s.id})">Edit</button></td></tr>`).join('');
  }

  document.getElementById('students-search')?.addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase(); [...tableBody.querySelectorAll('tr')].forEach(r=>{
      const t = (r.dataset.name + ' ' + r.dataset.email).toLowerCase(); r.style.display = t.includes(q)? 'table-row':'none';
    });
  });
  document.getElementById('refresh-students')?.addEventListener('click', load);

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const id = document.getElementById('student-id').value;
    const payload = {name:document.getElementById('student-name').value, email:document.getElementById('student-email').value};
    const action = id? 'update':'create'; if(id) payload.id=id;
    await request(`${apiBase}/students.php?action=${action}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    form.reset(); document.getElementById('student-id').value = '';
    load();
  });

  resetBtn.addEventListener('click',()=>{form.reset();document.getElementById('student-id').value=''});
  window.editStudent = async id =>{
    const res = await request(`${apiBase}/students.php?action=get&id=${id}`);
    document.getElementById('student-id').value = res.id;
    document.getElementById('student-name').value = res.name;
    document.getElementById('student-email').value = res.email;
  };

  load();
}

/* Status */
async function initStatus(){
  const tableBody = document.querySelector('#status-table tbody');
  const res = await request(`${apiBase}/allocate.php?action=list`);
  document.getElementById('alloc-count').textContent = res.length;
  tableBody.innerHTML = res.map(r=>`<tr data-student="${escape(r.student_name)}" data-book="${escape(r.book_title)}"><td>${escape(r.student_name)}</td><td>${escape(r.book_title)}</td><td>${escape(r.when_allocated)}</td></tr>`).join('');
  document.getElementById('alloc-search')?.addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase(); [...tableBody.querySelectorAll('tr')].forEach(r=>{
      const t = (r.dataset.student + ' ' + r.dataset.book).toLowerCase(); r.style.display = t.includes(q)? 'table-row':'none';
    });
  });
  document.getElementById('refresh-alloc')?.addEventListener('click', initStatus);
}

function escape(s){return String(s||'').replace(/[&<>\"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"})[c])}
