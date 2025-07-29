export function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('active');
}

export function openCustomerModal() {
  const modal = document.getElementById('customerModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeCustomerModal() {
  const modal = document.getElementById('customerModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

export function switchTab(tabName) {
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`btn-tab-${tabName}`)?.classList.add('active');
  document.getElementById(`tab-${tabName}`)?.classList.add('active');
}

export function showConfirmationDialog() {
  document.getElementById('confirmationModal')?.classList.add('active');
}

export function openImage(img) {
  const src = img.querySelector('img')?.src;
  if (!src) return;
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:5000;';
  const imgEl = document.createElement('img');
  imgEl.src = src;
  imgEl.style.maxWidth = '90%';
  modal.appendChild(imgEl);
  modal.addEventListener('click',()=>modal.remove());
  document.body.appendChild(modal);
}

export function showNotification(message, type='info') {
  const n = document.createElement('div');
  n.className = `notification ${type}`;
  n.textContent = message;
  n.style.cssText = 'position:fixed;top:20px;right:20px;padding:10px;border-radius:6px;background:#fff;z-index:5000;box-shadow:0 2px 8px rgba(0,0,0,0.1)';
  document.body.appendChild(n);
  setTimeout(()=>n.remove(),3000);
}

export function updateFooterYear() {
  const span = document.querySelector('.footer span');
  if (span) span.textContent = span.textContent.replace(/\d{4}/, new Date().getFullYear());
}

export function cancelDiscard() {
  document.getElementById('confirmationModal')?.classList.remove('active');
}

export function confirmDiscard() {
  document.getElementById('confirmationModal')?.classList.remove('active');
  closeCustomerModal();
}

export function toggleRechnungsadresse() {
  const cb = document.getElementById('sameAsEinsatzort');
  const fields = document.querySelectorAll('#tab-rechnungsadresse input, #tab-rechnungsadresse select');
  if (!cb) return;
  if (cb.checked) {
    fields.forEach(f => { f.disabled = true; f.style.backgroundColor = '#eee'; });
    copyEinsatzortToRechnung();
  } else {
    fields.forEach(f => { f.disabled = false; f.style.backgroundColor = ''; });
  }
}

function copyEinsatzortToRechnung() {
  const map = [
    ['einsatzort_anrede','rechnung_anrede'],
    ['einsatzort_vorname','rechnung_vorname'],
    ['einsatzort_nachname','rechnung_nachname'],
    ['einsatzort_zusatz','rechnung_zusatz'],
    ['einsatzort_strasse','rechnung_strasse'],
    ['einsatzort_plz','rechnung_plz'],
    ['einsatzort_ort','rechnung_ort'],
    ['einsatzort_telefon','rechnung_telefon'],
    ['einsatzort_email','rechnung_email']
  ];
  map.forEach(([s,t])=>{
    const sv = document.querySelector(`[name="${s}"]`);
    const tv = document.querySelector(`[name="${t}"]`);
    if (sv && tv) tv.value = sv.value;
  });
}

export function saveCustomer() {
  showNotification('✓ Kunde gespeichert', 'success');
  setTimeout(closeCustomerModal, 1500);
}

export function expandImages(id) {
  document.getElementById(id)?.classList.toggle('expanded');
}

export function takeOrderData(date) {
  showNotification(`Daten vom ${date} übernommen`, 'info');
}

export function editCustomer() {
  showNotification('Kundenbearbeitung noch nicht implementiert');
}