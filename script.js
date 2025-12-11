/* ============================================================
   FIREBASE CONFIG
============================================================ */
const firebaseConfig = {
    apiKey: "AIzaSyD6FGRcTR199KeG6VCT0_l5Y_dMzPLa7lc",
    authDomain: "ssmv-booking-1bd5a.firebaseapp.com",
    projectId: "ssmv-booking-1bd5a",
    storageBucket: "ssmv-booking-1bd5a.firebasestorage.app",
    messagingSenderId: "325552070962",
    appId: "1:325552070962:web:1e1472e0001d09003b372b"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const BOOKINGS = db.collection('bookings');

/* ============================================================
   LOCAL STORAGE (Hybrid Mode)
============================================================ */
const STORAGE_KEY = 'ssmv_booking_local';
function readLocal(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'); }catch(e){ return []; } }
function writeLocal(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
function newLocalId(){ return Date.now()+Math.floor(Math.random()*9999); }

/* ============================================================
   UTILITIES
============================================================ */
function formatDate(d){ if(!d) return ''; const obj=new Date(d+'T00:00:00'); const M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${M[obj.getMonth()]} ${obj.getDate()}, ${obj.getFullYear()}`; }
function formatTime(time){ if(!time) return ''; const [h,m]=time.split(':').map(Number); const am=h>=12?'PM':'AM'; const hour=h%12||12; return `${hour}:${String(m).padStart(2,'0')} ${am}`; }

/* ============================================================
   ADMIN LOGIN (works after DOM ready)
============================================================ */
const ADMIN = { user:'kshatriya302', pass:'0978' };
document.addEventListener('DOMContentLoaded', ()=>{
    const form=document.getElementById('loginForm');
    if(form){
        form.addEventListener('submit', (e)=>{
            e.preventDefault();
            const u=document.getElementById('username').value.trim();
            const p=document.getElementById('password').value.trim();
            if(u===ADMIN.user && p===ADMIN.pass){
                localStorage.setItem('adminLoggedIn','true');
                window.location.href='admin.html';
            } else {
                alert('Invalid admin credentials');
            }
        });
    }
});

function isLoggedIn(){ return localStorage.getItem('adminLoggedIn')==='true'; }
function logout(){ localStorage.removeItem('adminLoggedIn'); window.location.href='login.html'; }

/* ============================================================
   SYNC LOCAL -> CLOUD (upload unsynced)
============================================================ */
async function syncLocal(){
    if(!navigator.onLine) return;
    const items=readLocal(); let changed=false;
    for(let b of items){
        if(b.remoteId && !b.needsSync) continue;
        try{
            const payload={ name:b.name||'', email:b.email||'', phone:b.phone||'', date:b.date||'', time:b.time||'', numberOfPeople:b.numberOfPeople||'', details:b.details||'', localId:b.localId||newLocalId(), createdAt: firebase.firestore.FieldValue.serverTimestamp() };
            const res=await BOOKINGS.add(payload);
            b.remoteId=res.id; b.needsSync=false; changed=true;
        }catch(err){ console.warn('sync failed', err.message); }
    }
    if(changed) writeLocal(items);
}

/* ============================================================
   ADD BOOKING (hybrid)
============================================================ */
async function addBooking(data){
    const localId=newLocalId();
    const entry={ ...data, localId, needsSync:!navigator.onLine };
    const local=readLocal(); local.push(entry); writeLocal(local);
    if(navigator.onLine){
        try{
            const payload={ ...data, localId, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
            const res=await BOOKINGS.add(payload);
            const updated=readLocal().map(x=>{ if(x.localId===localId){ x.remoteId=res.id; x.needsSync=false; } return x; });
            writeLocal(updated);
            return { ok:true };
        }catch(err){ console.warn('add remote failed', err.message); return { ok:false, reason:err.message }; }
    }
    return { ok:false, reason:'offline' };
}

/* ============================================================
   BOOKING FORM HANDLER
============================================================ */
document.addEventListener('DOMContentLoaded', ()=>{
    const bookingForm=document.getElementById('bookingForm');
    if(!bookingForm) return;
    const dateInput=document.getElementById('appointmentDate');
    if(dateInput){ dateInput.min=new Date().toISOString().split('T')[0]; dateInput.addEventListener('change', ()=>{ const day=new Date(dateInput.value+'T00:00:00').toLocaleDateString('en-US',{ weekday:'long' }); const dayEl=document.getElementById('dayOfWeek'); if(dayEl) dayEl.textContent=`Selected day: ${day}`; }); }
    bookingForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const data={ name:(document.getElementById('fullName')||{}).value||'', email:(document.getElementById('email')||{}).value||'', phone:(document.getElementById('phone')||{}).value||'', date:(document.getElementById('appointmentDate')||{}).value||'', time:(document.getElementById('appointmentTime')||{}).value||'', numberOfPeople:(document.getElementById('numberOfPeople')||{}).value||'1', details:(document.getElementById('appointmentDetails')||{}).value||'' };
        if(!data.name||!data.email||!data.date||!data.time){ alert('Please fill required fields (Name, Email, Date, Time).'); return; }
        const submitBtn=bookingForm.querySelector('button[type="submit"]'); const origText=submitBtn?submitBtn.innerHTML:null; if(submitBtn){ submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...'; submitBtn.disabled=true; }
        try{ const res=await addBooking(data); await syncLocal(); showConfirmation(data); if(!res.ok){ if(res.reason==='offline') alert('You are offline. Booking saved locally and will sync when online.'); } }catch(err){ console.error('Booking error', err); alert('Error saving booking. Try again.'); }finally{ if(submitBtn){ submitBtn.disabled=false; submitBtn.innerHTML=origText; } bookingForm.reset(); }
    });
});

/* ============================================================
   CONFIRMATION MODAL
============================================================ */
function showConfirmation(b){
    const modal=document.getElementById('confirmationModal'); const box=document.getElementById('confirmationDetails'); if(!modal||!box) return;
    box.innerHTML=`<p><b>Name:</b> ${b.name}</p><p><b>Date:</b> ${formatDate(b.date)}</p><p><b>Time:</b> ${formatTime(b.time)}</p><p><b>People:</b> ${b.numberOfPeople}</p><p><b>Email:</b> ${b.email}</p><p><b>Phone:</b> ${b.phone}</p><p><b>Details:</b> ${b.details}</p>`;
    modal.classList.remove('hidden');
}

/* ============================================================
   LOAD ADMIN
============================================================ */
async function loadAdmin(){
    if(!isLoggedIn()){ window.location.href='login.html'; return; }
    await syncLocal();
    let list=[];
    try{ const snap=await BOOKINGS.get(); list=snap.docs.map(d=>({ id:d.id, ...d.data() })); }catch(err){ const local=readLocal(); list=local.map(x=>({ id:x.remoteId||x.localId, ...x })); }
    // stats
    const total=list.length; const today=new Date().toISOString().split('T')[0]; const todayCount=list.filter(b=>b.date===today).length; const totalPeople=list.reduce((s,b)=>s+Number(b.numberOfPeople||0),0);
    const elTotal=document.getElementById('totalBookings'); const elToday=document.getElementById('todayBookings'); const elPeople=document.getElementById('totalPeople'); if(elTotal) elTotal.textContent=total; if(elToday) elToday.textContent=todayCount; if(elPeople) elPeople.textContent=totalPeople;
    // render table
    const tbody=document.getElementById('bookingsTableBody'); if(!tbody) return; if(!list.length){ tbody.innerHTML='<tr><td colspan="7" class="text-center p-6">No bookings</td></tr>'; return; }
    tbody.innerHTML=list.map(b=>`<tr class="hover:bg-gray-50"><td class="p-3">#${b.id}</td><td class="p-3">${b.name}</td><td class="p-3">${formatDate(b.date)}<br><b>${formatTime(b.time)}</b></td><td class="p-3">${b.numberOfPeople}</td><td class="p-3">${b.email}<br>${b.phone}</td><td class="p-3 max-w-xs truncate">${b.details}</td><td class="p-3"><button onclick="deleteBooking('${b.id}')" class="text-red-600">🗑️</button></td></tr>`).join('');
}

/* ============================================================
   DELETE BOOKING
============================================================ */
async function deleteBooking(id){
    try{ await BOOKINGS.doc(id).delete(); }catch(e){}
    const filtered=readLocal().filter(x=>x.remoteId!==id && x.localId!==id); writeLocal(filtered); loadAdmin();
}

/* ============================================================
   SEARCH
============================================================ */
async function searchBookings(){
    const emailVal=(document.getElementById('searchEmail')||{}).value?.trim()||''; const phoneVal=(document.getElementById('searchPhone')||{}).value?.trim()||'';
    await syncLocal();
    let results=[];
    try{ const snap=await BOOKINGS.get(); results=snap.docs.map(d=>({ id:d.id, ...d.data() })).filter(b=> (emailVal && (b.email||'').toLowerCase()===emailVal.toLowerCase()) || (phoneVal && (b.phone||'').includes(phoneVal)) ); }catch(err){ const local=readLocal(); results=local.filter(b=> (emailVal && (b.email||'').toLowerCase()===emailVal.toLowerCase()) || (phoneVal && (b.phone||'').includes(phoneVal)) ).map(b=>({ id:b.remoteId||b.localId, ...b })); }
    displayUserBookings(results);
}

function displayUserBookings(list){
    const table=document.getElementById('userBookingsTable'); const cards=document.getElementById('userBookingsCards'); const searchResults=document.getElementById('searchResults'); const noResults=document.getElementById('noResults');
    if(!list.length){ if(searchResults) searchResults.classList.add('hidden'); if(noResults) noResults.classList.remove('hidden'); return; }
    if(noResults) noResults.classList.add('hidden'); if(searchResults) searchResults.classList.remove('hidden');
    if(table) table.innerHTML=list.map(b=>`<tr><td class="p-3">#${b.id}</td><td class="p-3">${formatDate(b.date)}<br>${formatTime(b.time)}</td><td class="p-3">${b.numberOfPeople}</td><td class="p-3">${b.details}</td><td class="p-3"><span class="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Confirmed</span></td></tr>`).join('');
    if(cards) cards.innerHTML=list.map(b=>`<div class="booking-card"><div class="booking-card-header"><div><b>${b.name||''}</b></div><div><span class="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Confirmed</span></div></div><div class="booking-card-content"><div class="booking-field"><span class="booking-field-label">Date:</span><span class="booking-field-value">${formatDate(b.date)}</span></div><div class="booking-field"><span class="booking-field-label">Time:</span><span class="booking-field-value">${formatTime(b.time)}</span></div><div class="booking-field"><span class="booking-field-label">People:</span><span class="booking-field-value">${b.numberOfPeople}</span></div><div class="booking-field"><span class="booking-field-label">Details:</span><span class="booking-field-value">${b.details}</span></div></div></div>`).join('');
}

/* ============================================================
   INIT
============================================================ */
window.addEventListener('load', async ()=>{ try{ await syncLocal(); }catch(e){ console.warn('init sync failed', e.message); } if(location.pathname.includes('admin.html')){ await loadAdmin(); setInterval(loadAdmin,30000); } });
window.addEventListener('online', async ()=>{ await syncLocal(); if(location.pathname.includes('admin.html')) loadAdmin(); });
window.toggleMobileMenu=function(){ const m=document.getElementById('mobileMenu'); if(m) m.classList.toggle('hidden'); };
