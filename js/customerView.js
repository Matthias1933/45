// customerView.js - ÜBERARBEITET: Nutzt ausschließlich zentrale Konstanten und Utils

import { getCustomerMockData, getCustomerOrderHistory } from './api.js';
import { openImage, expandImages, takeOrderData, editCustomer } from './ui.js';
import { openOrderDetail } from './orderView.js';

// === ZENTRALE IMPORTE - Lokale Mappings entfernt ===
import { 
  WORK_TYPE_ICONS, 
  SERVICE_LABELS, 
  SERVICE_TYPES,
  getLabel 
} from './constants.js';

import { 
  formatPrice, 
  formatTime, 
  formatDate 
} from './utils.js';

export function openCustomerDetail(name, number, statusHtml) {
  const sharedHeader = document.getElementById('sharedDetailHeader');
  const backBtn = document.getElementById('btn-back-detail');
  const editBtn = document.getElementById('btn-edit-detail');

  if(sharedHeader) sharedHeader.style.display = 'flex';

  if(backBtn) {
    backBtn.innerHTML = `<i class="fas fa-arrow-left"></i> Zurück zur Kundenliste`;
    backBtn.onclick = closeCustomerDetail;
  }
  if(editBtn) {
    editBtn.onclick = editCustomer;
  }

  const headerName = sharedHeader?.querySelector('#detailCustomerName');
  if(headerName) headerName.textContent = name;

  const headerNumber = sharedHeader?.querySelector('#detailCustomerNumber');
  if(headerNumber) headerNumber.textContent = number;

  const headerStatus = sharedHeader?.querySelector('#detailCustomerStatus');
  if(headerStatus) headerStatus.innerHTML = statusHtml;

  const template = document.getElementById('template-customer-detail');
  const container = document.getElementById('view-container');
  const listView = document.querySelector('.content');

  if (!template || !container) return;
  container.innerHTML = '';
  const node = template.content.cloneNode(true);
  container.appendChild(node);
  if (listView) listView.style.display = 'none';
  const view = container.querySelector('#customerDetailView');
  view.classList.add('active');

  loadCustomerDetailData(name);
  loadOrderTimeline(name);
}

export function closeCustomerDetail() {
  const sharedHeader = document.getElementById('sharedDetailHeader');
  if(sharedHeader) sharedHeader.style.display = 'none';

  const container = document.getElementById('view-container');
  const listView = document.querySelector('.content');
  if (container) container.innerHTML = '';
  if (listView) listView.style.display = '';
}

export function initCustomerCards() {
  document.querySelectorAll('.customer-card').forEach((card, idx) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, idx * 100);

    card.addEventListener('click', () => {
      const name = card.querySelector('.customer-name')?.textContent || '';
      const number = card.querySelector('.customer-number')?.textContent || '';
      const status = card.querySelector('.status-badge')?.outerHTML || '';
      openCustomerDetail(name, number, status);
    });
  });
}

export function loadCustomerDetailData(name) {
  const data = getCustomerMockData(name);
  if (!data) return;
  
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  
  set('einsatzortName', data.einsatzort.name);
  set('einsatzortAdresse', data.einsatzort.adresse);
  set('einsatzortTelefon', data.einsatzort.telefon);
  set('einsatzortEmail', data.einsatzort.email);
  set('rechnungName', data.rechnung.name);
  set('rechnungAdresse', data.rechnung.adresse);
  set('rechnungTelefon', data.rechnung.telefon);
  set('rechnungEmail', data.rechnung.email);
  set('kundenNotizen', data.notizen || '-');

  const filesList = document.getElementById('kundenDateien');
  if (filesList) {
    filesList.innerHTML = '';
    (data.dateien || []).forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      filesList.appendChild(li);
    });
  }
  
  const rating = document.getElementById('detailCustomerRating');
  if (rating) rating.innerHTML = '⭐'.repeat(parseInt(data.rating, 10) || 0);
}

function loadOrderTimeline(customerName) {
  const timelineContainer = document.getElementById('order-timeline');
  if (!timelineContainer) return;

  const orderHistory = getCustomerOrderHistory(customerName);
  timelineContainer.innerHTML = '';

  if (Object.keys(orderHistory).length === 0) {
    timelineContainer.innerHTML = '<p class="no-orders">Keine Termine bisher erfasst</p>';
    return;
  }

  Object.keys(orderHistory)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .forEach(year => {
      const yearSection = createYearSection(year, orderHistory[year]);
      timelineContainer.appendChild(yearSection);
    });
}

function createYearSection(year, orders) {
  const yearSection = document.createElement('div');
  yearSection.className = 'year-section';
  
  const yearTitle = document.createElement('h3');
  yearTitle.className = 'year-title';
  yearTitle.textContent = year;
  yearSection.appendChild(yearTitle);

  orders.forEach(order => {
    const orderContainer = createOrderContainer(order);
    yearSection.appendChild(orderContainer);
  });

  return yearSection;
}

function createOrderContainer(order) {
  const orderContainer = document.createElement('div');
  orderContainer.className = 'order-container';
  orderContainer.setAttribute('data-order-date', order.date);
  orderContainer.style.cursor = 'pointer';

  orderContainer.addEventListener('click', (e) => {
    if (e.target.closest('.btn-take-data, .work-image, .expand-images-btn')) {
      return;
    }
    openOrderDetail(order.date);
  });

  const orderMainInfo = document.createElement('div');
  orderMainInfo.className = 'order-main-info';

  const compactInfoSection = document.createElement('div');
  compactInfoSection.className = 'compact-info-section';

  const datePriceColumn = createDatePriceColumn(order);
  const timeCardsColumn = createTimeCardsColumn(order);
  
  compactInfoSection.appendChild(datePriceColumn);
  compactInfoSection.appendChild(timeCardsColumn);

  const verticalDivider = document.createElement('div');
  verticalDivider.className = 'vertical-divider';

  const workSection = createWorkSection(order);

  orderMainInfo.appendChild(compactInfoSection);
  orderMainInfo.appendChild(verticalDivider);
  orderMainInfo.appendChild(workSection);

  const imagesSection = createImagesSection(order);

  orderContainer.appendChild(orderMainInfo);
  orderContainer.appendChild(imagesSection);

  return orderContainer;
}

function createDatePriceColumn(order) {
  const column = document.createElement('div');
  column.className = 'date-price-column';

  // === ZENTRALE FORMATIERUNG GENUTZT ===
  const formattedPrice = formatPrice(order.price);

  const dateCard = document.createElement('div');
  dateCard.className = 'info-card date-card';
  dateCard.innerHTML = `
    <i class="fas fa-calendar-alt"></i>
    <div class="card-content">
      <div class="card-label">Datum</div>
      <div class="card-value">${order.displayDate}</div>
    </div>
  `;

  const priceCard = document.createElement('div');
  priceCard.className = 'info-card price-card';
  priceCard.innerHTML = `
    <i class="fas fa-euro-sign"></i>
    <div class="card-content">
      <div class="card-label">Preis</div>
      <div class="card-value">${formattedPrice}</div>
    </div>
  `;

  column.appendChild(dateCard);
  column.appendChild(priceCard);
  return column;
}

function createTimeCardsColumn(order) {
  const column = document.createElement('div');
  column.className = 'time-cards-column';

  const sollCard = document.createElement('div');
  sollCard.className = 'info-card time-card soll-card';
  sollCard.innerHTML = `
    <i class="fa-regular fa-clock"></i>
    <div class="card-content">
      <div class="card-label">Soll-Zeit</div>
      <div class="card-value">${order.sollZeit} h</div>
    </div>
  `;

  const istCard = document.createElement('div');
  istCard.className = `info-card time-card ist-card ${order.istZeitStatus}`;
  istCard.innerHTML = `
    <i class="fa-regular fa-clock"></i>
    <div class="card-content">
      <div class="card-label">Ist-Zeit</div>
      <div class="card-value">${order.istZeit} h</div>
    </div>
  `;

  column.appendChild(sollCard);
  column.appendChild(istCard);
  return column;
}

function createWorkSection(order) {
  const workSection = document.createElement('div');
  workSection.className = 'work-section';

  const workCards = document.createElement('div');
  workCards.className = 'work-cards';

  order.arbeiten.forEach(arbeit => {
    const workCard = document.createElement('div');
    workCard.className = `work-card work-${arbeit.type}`;
    
    // === ZENTRALE KONSTANTEN GENUTZT - Lokale Mappings entfernt ===
    const iconClass = WORK_TYPE_ICONS[arbeit.type] || 'fa-solid fa-wrench';
    const serviceLabel = getLabel(SERVICE_LABELS[arbeit.type]) || arbeit.type;
    
    workCard.innerHTML = `
      <div class="work-type"><i class="${iconClass}"></i> ${serviceLabel}</div>
      <div class="work-description">${arbeit.description}</div>
    `;
    workCards.appendChild(workCard);
  });

  const takeDataBtn = document.createElement('button');
  takeDataBtn.className = 'btn-take-data';
  takeDataBtn.innerHTML = `Daten übernehmen <i class="fas fa-arrow-right"></i>`;
  takeDataBtn.addEventListener('click', () => takeOrderData(order.date));

  workSection.appendChild(workCards);
  workSection.appendChild(takeDataBtn);
  return workSection;
}

function createImagesSection(order) {
  const imagesSection = document.createElement('div');
  imagesSection.className = 'images-section';

  const imageGallery = document.createElement('div');
  imageGallery.className = 'image-gallery';
  imageGallery.id = `gallery-${order.date}`;

  if (order.bilder && order.bilder.length > 0) {
    order.bilder.forEach((bild, index) => {
      const workImage = document.createElement('div');
      workImage.className = 'work-image';
      workImage.innerHTML = `<img src="${bild.src}" alt="${bild.alt}">`;
      
      if (index >= 2) {
        workImage.style.display = 'none';
        workImage.classList.add('hidden-image');
      }
      
      workImage.addEventListener('click', () => openImage(workImage));
      
      imageGallery.appendChild(workImage);
    });

    if (order.bilder.length > 2) {
      const expandBtn = document.createElement('button');
      expandBtn.className = 'expand-images-btn';
      expandBtn.textContent = '+';
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const isExpanded = imageGallery.classList.contains('expanded');
        
        if (isExpanded) {
          imageGallery.querySelectorAll('.work-image').forEach((img, index) => {
            if (index >= 2) {
              img.style.display = 'none';
            }
          });
          imageGallery.classList.remove('expanded');
          expandBtn.textContent = '+';
        } else {
          imageGallery.querySelectorAll('.work-image').forEach((img) => {
            img.style.display = 'block';
          });
          imageGallery.classList.add('expanded');
          expandBtn.textContent = '−';
        }
      });
      imageGallery.appendChild(expandBtn);
    }
  }

  imagesSection.appendChild(imageGallery);
  return imagesSection;
}