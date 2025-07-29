// orderView.js - ERWEITERT um Hecken-spezifische Action-Cards und Erschwerungen

import { getOrderDetailMockData } from './api.js';
import { showNotification } from './ui.js';
import { closeCustomerDetail } from './customerView.js';

// === ZENTRALE IMPORTE ===
import { 
  SERVICE_TYPES,
  ACTION_TYPES,
  ENTFERNUNGSARTEN,
  OBSTBAUM_ABSCHNITTMENGE,
  OBSTBAUM_WERKZEUG,
  ERSCHWERUNG_TYPES,
  SERVICE_LABELS,
  ACTION_LABELS,
  ERSCHWERUNG_LABELS,
  ERSCHWERUNG_ICONS,
  ENTFERNUNGSARTEN_LABELS,
  UNITS,
  MEASURE_LABELS,
  PLACEHOLDERS,
  getLabel
} from './constants.js';

import { 
  formatPrice, 
  formatTime, 
  formatMeasure,
  isValidServiceType,
  createErrorCard,
  createLayoutWarning
} from './utils.js';

// === ZENTRALE SERVICE-KONFIGURATION ===
const SERVICE_CONFIG = {
  [SERVICE_TYPES.VERTIKUTIEREN]: {
    image: 'vertikutieren_ergebnis.webp',
    color: '#f4c01e',
    layout: 'standard',
    unit: 'm²',
    measureLabel: 'Gesamt',
    actions: [
      { label: 'Mähen', icon: 'mähen.png' },
      { label: 'Nachsäen', icon: 'nachsäen.png' },
      { label: 'Düngen', icon: 'düngen.png' }
    ]
  },
  
  [SERVICE_TYPES.RASEN]: {
    image: 'rasenmähen_ergebnis.webp',
    color: '#7ca040',
    layout: 'standard',
    unit: 'm²',
    measureLabel: 'Gesamt'
  },
  
  [SERVICE_TYPES.HECKE]: {
    image: 'heckenschnitt_ergebnis.webp',
    color: '#84cc16',
    layout: 'hedge',
    // Hecken-spezifische Actions
    actions: {
      [ACTION_TYPES.HEDGE_FORMSCHNITT]: { 
        icon: 'fas fa-cut',
        color: '#7ba03f'
      },
      [ACTION_TYPES.HEDGE_SCHREDDERSCHNITT]: { 
        icon: 'fas fa-blender',
        color: '#fb923c'
      },
      [ACTION_TYPES.HEDGE_VERJUENGUNG]: { 
        icon: 'fas fa-down-left-and-up-right-to-center',
        color: '#f44a4a'
      },
      // NEU: Hecken-Rabatt Actions
      [ACTION_TYPES.HEDGE_SCHNITTRABATT]: {
        icon: 'rabatt_rueckseite.png',
        color: '#7ba03f',
        percentage: '20%',
        description: 'Rückseite muss nicht geschnitten werden'
      },
      [ACTION_TYPES.HEDGE_ENTSORGUNGSRABATT_BIOTONNE]: {
        icon: 'rabatt_biotonne.png',
        color: '#7ba03f',
        percentage: '10%',
        description: 'wir sammeln und entsorgen beim Kunden'
      },
      [ACTION_TYPES.HEDGE_ENTSORGUNGSRABATT_LIEGENLASSEN]: {
        icon: 'rabatt_liegen_lassen.png',
        color: '#7ba03f',
        percentage: '30%',
        description: 'Kunde sammelt und entsorgt alles selbst'
      }
    }
  },
  
  [SERVICE_TYPES.OBSTBAUM]: {
    image: 'obstbaumschnitt_ergebnis.webp',
    color: '#a16207',
    layout: 'tree',
    specialActions: {
      abschnittmenge: {
        [OBSTBAUM_ABSCHNITTMENGE.VIEL]: { label: 'Viel Abschnitt', icon: 'viel_abschnitt.png' },
        [OBSTBAUM_ABSCHNITTMENGE.NORMAL]: { label: 'Normal Abschnitt', icon: 'normal_abschnitt.png' }
      },
      werkzeug: {
        [OBSTBAUM_WERKZEUG.KETTENSAEGE]: { label: 'Astkneifer + Kettensäge', icon: 'astkneifer_kettensaege.png' },
        [OBSTBAUM_WERKZEUG.ROSENSCHERE]: { label: 'Rosenschere + Astkneifer', icon: 'rosenschere_astkneifer.png' }
      }
    }
  },
  
  [SERVICE_TYPES.STRAUCH]: {
    image: 'strauch_ergebnis.webp',
    color: '#dc5b29',
    layout: 'tree',
    actions: {
      [ACTION_TYPES.FORMSCHNITT]: { icon: 'fas fa-cut' },
      [ACTION_TYPES.RUECKSCHNITT]: { icon: 'fas fa-down-left-and-up-right-to-center' },
      [ACTION_TYPES.ENTFERNEN]: { 
        icon: 'fas fa-trash',
        options: ENTFERNUNGSARTEN_LABELS
      }
    }
  },
  
  [SERVICE_TYPES.BAUM]: {
    image: 'baum_ergebnis.webp',
    color: '#dc5b29',
    layout: 'tree',
    actions: {
      [ACTION_TYPES.FORMSCHNITT]: { icon: 'fas fa-cut' },
      [ACTION_TYPES.RUECKSCHNITT]: { icon: 'fas fa-down-left-and-up-right-to-center' }
    }
  },
  
  [SERVICE_TYPES.KONIFERE]: {
    image: 'konifere_ergebnis.webp',
    color: '#dc5b29',
    layout: 'tree',
    actions: {
      [ACTION_TYPES.FORMSCHNITT]: { icon: 'fas fa-cut' },
      [ACTION_TYPES.RUECKSCHNITT]: { icon: 'fas fa-down-left-and-up-right-to-center' },
      [ACTION_TYPES.ENTFERNEN]: { 
        icon: 'fas fa-trash',
        options: ENTFERNUNGSARTEN_LABELS
      }
    }
  },
  
  [SERVICE_TYPES.MICHA]: {
    image: 'micha_besichtigt_ergebnis.webp',
    color: '#34445d',
    layout: 'micha'
  }
};

export function openOrderDetail(date) {
  const backBtn = document.getElementById('btn-back-detail');

  if (backBtn) {
      backBtn.innerHTML = `<i class="fas fa-arrow-left"></i> Zurück zur Kundenansicht`;
      backBtn.onclick = closeOrderDetail;
  }

  const template = document.getElementById('template-order-detail');
  const container = document.getElementById('view-container');
  if (!template || !container) return;

  const customerView = container.querySelector('#customerDetailView');
  if (customerView) customerView.style.display = 'none';

  const existing = container.querySelector('#orderDetailView');
  if (existing) existing.remove();

  const node = template.content.cloneNode(true);
  container.appendChild(node);
  const view = container.querySelector('#orderDetailView');
  view.classList.add('active');

  loadOrderDetailData(date);
}

export function closeOrderDetail() {
  const backBtn = document.getElementById('btn-back-detail');

  if (backBtn) {
    backBtn.innerHTML = `<i class="fas fa-arrow-left"></i> Zurück zur Kundenliste`;
    backBtn.onclick = closeCustomerDetail;
  }

  const container = document.getElementById('view-container');
  const orderView = container?.querySelector('#orderDetailView');
  const customerView = container?.querySelector('#customerDetailView');
  if (orderView) orderView.remove();
  if (customerView) customerView.style.display = 'block';
}

export function loadOrderDetailData(date) {
  console.log('🔍 Loading order detail for date:', date);
  const data = getOrderDetailMockData(date);
  console.log('📦 Order data:', data);
  if (!data) return;
  
  const title = document.getElementById('orderDetailTitle');
  if (title) title.textContent = `Termin vom ${data.displayDate}`;
  
  renderOrderInfoBar(data);
  renderServices(data.services || []);
}

function renderOrderInfoBar(order) {
  const bar = document.getElementById('orderInfoBar');
  if (!bar) return;
  bar.innerHTML = '';
  
  const formattedPrice = formatPrice(order.preis);
  bar.appendChild(createInfoCard('fas fa-euro-sign', 'Gesamtpreis', formattedPrice));
  bar.appendChild(createTimeCard('soll', 'Soll-Zeit', order.geplant + ' h'));
  
  const istClass = order.istZeitStatus === 'over-time' ? 'over-time' : 'on-time';
  bar.appendChild(createTimeCard('ist', 'Ist-Zeit', order.tatsaechlich + ' h', istClass));
  
  const personnel = document.createElement('div');
  personnel.className = 'info-card personnel-card';
  order.mitarbeiter.forEach(() => {
    const i = document.createElement('i');
    i.className = 'fas fa-user';
    personnel.appendChild(i);
  });
  bar.appendChild(personnel);
  
  order.mitarbeiter.forEach(name => {
    const c = document.createElement('div');
    c.className = 'employee-card';
    c.textContent = name;
    bar.appendChild(c);
  });
  
  bar.appendChild(createInfoCard('fas fa-play', 'Start-Uhrzeit', order.startzeit, 'start', '', '#7ba03f'));
  bar.appendChild(createInfoCard('fas fa-stop', 'End-Uhrzeit', order.endzeit, 'end', '', '#f44a4a'));
}

function createTimeCard(type, label, value, extra = '') {
  const card = document.createElement('div');
  card.className = `info-card time-card ${type === 'soll' ? 'soll-card' : 'ist-card ' + extra}`;
  
  const icon = document.createElement('i');
  icon.className = 'fa-regular fa-clock';
  
  const content = document.createElement('div');
  content.className = 'card-content';
  
  const l = document.createElement('div');
  l.className = 'card-label';
  l.textContent = label;
  
  const v = document.createElement('div');
  v.className = 'card-value';
  v.textContent = value;
  
  content.appendChild(l);
  content.appendChild(v);
  card.appendChild(icon);
  card.appendChild(content);
  
  return card;
}

function createInfoCard(iconClass, label, value, type = '', extraClass = '', iconColor = '') {
  const card = document.createElement('div');
  card.className = `info-card ${extraClass}`;
  if (type === 'start') card.classList.add('start-time-card');
  
  const icon = document.createElement('i');
  icon.className = iconClass;
  if (iconColor) icon.style.color = iconColor;
  
  const content = document.createElement('div');
  content.className = 'card-content';
  
  const l = document.createElement('div');
  l.className = 'card-label';
  l.innerHTML = label;
  
  const v = document.createElement('div');
  v.className = 'card-value';
  v.textContent = value;
  
  content.appendChild(l);
  content.appendChild(v);
  card.appendChild(icon);
  card.appendChild(content);
  
  return card;
}

function renderServices(services) {
  const section = document.getElementById('servicesSection');
  if (!section) return;
  section.innerHTML = '';
  
  services.forEach(serviceData => {
    if (!isValidServiceType(serviceData.type)) {
      const errorCard = createErrorCard(serviceData.type, 'Service');
      section.appendChild(errorCard);
      return;
    }
    
    const serviceConfig = SERVICE_CONFIG[serviceData.type];
    if (!serviceConfig) {
      console.error('Unknown service type:', serviceData.type);
      return;
    }
    
    const card = document.createElement('div');
    card.className = 'order-detail-card';
    
    const row = document.createElement('div');
    row.className = 'service-row';
    
    row.appendChild(createServiceCard(serviceData, serviceConfig));
    
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'service-actions-container';
    
    // 1. **Time-Price-Card** IMMER zuerst
    const timePriceCard = createTimePriceCard(serviceData);
    if (timePriceCard) actionsContainer.appendChild(timePriceCard);
    
    // 2. Separate Action-Card (außer Hecke)
    const actionsCard = createActionsCard(serviceData, serviceConfig);
    if (actionsCard) actionsContainer.appendChild(actionsCard);
    
    // 3. Erschwernisse (nur Hecke)
    if (serviceData.type === SERVICE_TYPES.HECKE && serviceData.erschwerungen) {
      const erschwernisCard = createErschwernissenCard(serviceData.erschwerungen);
      if (erschwernisCard) actionsContainer.appendChild(erschwernisCard);
    }
    
    // 4. Hecken-Rabatt Cards (wenn vorhanden)
    if (serviceData.type === SERVICE_TYPES.HECKE && serviceData.hedgeDiscounts) {
      const discounts = serviceData.hedgeDiscounts;
      
      // Rückseitenrabatt Card (wenn aktiv)
      if (discounts.rueckseite) {
        const discountCard = createHedgeDiscountCard(ACTION_TYPES.HEDGE_SCHNITTRABATT, serviceConfig);
        if (discountCard) actionsContainer.appendChild(discountCard);
      }
      
      // Entsorgungsrabatt Card (nur einer kann aktiv sein)
      if (discounts.entsorgung === 'biotonne') {
        const discountCard = createHedgeDiscountCard(ACTION_TYPES.HEDGE_ENTSORGUNGSRABATT_BIOTONNE, serviceConfig);
        if (discountCard) actionsContainer.appendChild(discountCard);
      } else if (discounts.entsorgung === 'liegenlassen') {
        const discountCard = createHedgeDiscountCard(ACTION_TYPES.HEDGE_ENTSORGUNGSRABATT_LIEGENLASSEN, serviceConfig);
        if (discountCard) actionsContainer.appendChild(discountCard);
      }
    }
    
    // 5. Individuelle Preis-Anpassungen
    if (serviceData.adjustments) {
      const adjustmentsCard = createPricingAdjustmentsCard(serviceData);
      if (adjustmentsCard) actionsContainer.appendChild(adjustmentsCard);
    }
    
    row.appendChild(actionsContainer);
    
    const btn = document.createElement('button');
    btn.className = 'btn-service-data';
    btn.innerHTML = '<i class="fa-regular fa-share-from-square"></i><br><span>Daten</span><br><span>übernehmen</span>';
    const serviceLabel = getLabel(SERVICE_LABELS[serviceData.type]);
    btn.addEventListener('click', () => showNotification(`Daten von ${serviceLabel} übernommen`, 'info'));
    row.appendChild(btn);
    
    card.appendChild(row);
    section.appendChild(card);
  });
}

function createServiceCard(serviceData, serviceConfig) {
  const card = document.createElement('div');
  card.className = `service-card ${serviceData.type}`;
  
  switch (serviceConfig.layout) {
    case 'standard':
      card.innerHTML = createStandardLayout(serviceData, serviceConfig);
      break;
    case 'hedge':
      card.innerHTML = createHedgeLayout(serviceData, serviceConfig);
      break;
    case 'tree':
      card.innerHTML = createTreeLayout(serviceData, serviceConfig);
      break;
    case 'micha':
      card.innerHTML = createMichaLayout(serviceData, serviceConfig);
      break;
    default:
      const warningCard = createLayoutWarning(serviceData.type, serviceConfig.layout);
      card.appendChild(warningCard);
  }
  
  return card;
}

function createStandardLayout(serviceData, serviceConfig) {
  const measureValue = serviceData.measure || '';
  const measureUnit = getLabel(UNITS[serviceConfig.unit?.toUpperCase()]) || serviceConfig.unit || '';
  const measureLabel = serviceConfig.measureLabel || getLabel(MEASURE_LABELS.TOTAL);
  const serviceLabel = getLabel(SERVICE_LABELS[serviceData.type]);
  
  return `
    <h3 style="color: ${serviceConfig.color}">${serviceLabel}</h3>
    <div class="service-visual">
      <div class="service-measure-group">
        <div class="service-measure">
          <span class="label">${measureLabel}</span>
          <span class="value">${measureValue} ${measureUnit}</span>
        </div>
        <div class="service-arrow">
          <div class="service-arrow-top"></div>
          <div class="service-arrow-bottom"></div>
        </div>
      </div>
      <div class="service-img-wrap">
        <img class="service-img" src="${serviceConfig.image}" alt="${serviceLabel}" />
      </div>
    </div>
    <div class="service-horizontal-arrow">
      <div class="service-horz-arrow">
        <div class="service-horz-arrow-right"></div>
      </div>
    </div>`;
}

function createHedgeLayout(serviceData, serviceConfig) {
  const measures = serviceData.measures || {};
  const serviceLabel = getLabel(SERVICE_LABELS[serviceData.type]);
  const heightLabel = getLabel(MEASURE_LABELS.HEIGHT);
  const widthLabel = getLabel(MEASURE_LABELS.WIDTH);
  const lengthLabel = getLabel(MEASURE_LABELS.LENGTH);
  const depthLabel = getLabel(MEASURE_LABELS.DEPTH);
  const meterUnit = getLabel(UNITS.METER);
  
  return `
    <h3 style="color: ${serviceConfig.color}">${serviceLabel}</h3>
    <div class="hedge-visual-area">
      <div class="hedge-img-wrap">
        <img class="hedge-img" src="${serviceConfig.image}" alt="${serviceLabel}" />
      </div>
      <span class="hedge-hoehe-label">${heightLabel}:</span>
      <span class="hedge-hoehe-value">${measures.height || '2,5'} ${meterUnit}</span>
      <div class="hedge-hoehe-arrow">
        <div class="hedge-arrow-line"></div>
        <div class="hedge-arrow-top"></div>
        <div class="hedge-arrow-bottom"></div>
      </div>
      <span class="hedge-tiefe-label">${depthLabel}:</span>
      <span class="hedge-tiefe-value">${measures.depth || '1,2'} ${meterUnit}</span>
      <div class="hedge-tiefe-arrow">
        <svg viewBox="0 0 50 35">
          <defs>
            <marker id="hedge-arrowhead-tiefe" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto">
              <polygon points="0 0, 4 2, 0 4" fill="#888" />
            </marker>
          </defs>
          <line x1="4" y1="4" x2="42" y2="29" stroke="#888" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#hedge-arrowhead-tiefe)" />
        </svg>
      </div>
      <span class="hedge-laenge-label">${lengthLabel}:</span>
      <span class="hedge-laenge-value">${measures.length || '12'} ${meterUnit}</span>
      <div class="hedge-laenge-arrow">
        <svg viewBox="0 0 72 40">
          <defs>
            <marker id="hedge-arrowhead-laenge" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto">
              <polygon points="0 0, 4 2, 0 4" fill="#888" />
            </marker>
          </defs>
          <line x1="4" y1="31" x2="70" y2="1" stroke="#888" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#hedge-arrowhead-laenge)" />
        </svg>
      </div>
    </div>`;
}

function createTreeLayout(serviceData, serviceConfig) {
  const measures = serviceData.measures || {};
  const serviceLabel = getLabel(SERVICE_LABELS[serviceData.type]);
  const heightLabel = getLabel(MEASURE_LABELS.HEIGHT);
  const widthLabel = getLabel(MEASURE_LABELS.WIDTH);
  const meterUnit = getLabel(UNITS.METER);
  
  return `
    <h3 style="color: ${serviceConfig.color}">${serviceLabel}</h3>
    <div class="service-visual">
      <div class="service-measure-group">
        <div class="service-measure">
          <span class="label">${heightLabel}</span>
          <span class="value">${measures.height || '2,5'} ${meterUnit}</span>
        </div>
        <div class="service-arrow">
          <div class="service-arrow-top"></div>
          <div class="service-arrow-bottom"></div>
        </div>
      </div>
      <div class="service-img-wrap">
        <img class="service-img" src="${serviceConfig.image}" alt="${serviceLabel}" />
      </div>
    </div>
    <div class="service-horizontal-arrow">
      <div class="service-horz-arrow">
        <div class="service-horz-arrow-right"></div>
      </div>
      <div class="horz-measure">
        <span class="label">${widthLabel}</span>
        <span class="value">${measures.width || '3,2'} ${meterUnit}</span>
      </div>
    </div>`;
}

function createMichaLayout(serviceData, serviceConfig) {
  const serviceLabel = getLabel(SERVICE_LABELS[serviceData.type]);
  
  return `
    <h3 style="color: ${serviceConfig.color}">${serviceLabel}</h3>
    <div class="service-visual">
      <div class="service-img-wrap micha-centered">
        <img class="service-img" src="${serviceConfig.image}" alt="${serviceLabel}" />
      </div>
    </div>`;
}

function createActionsCard(serviceData, serviceConfig) {
  // Nur für Hecke mit hedgeAction: Keine separate Karte mehr!
  if (serviceData.type === SERVICE_TYPES.HECKE && serviceData.hedgeAction) {
    return null;
  }

  if (serviceData.type === SERVICE_TYPES.VERTIKUTIEREN && serviceData.actions && serviceConfig.actions) {
    return createStandardActionsCard(serviceData.actions, serviceConfig.actions);
  }
  
  if (serviceData.type === SERVICE_TYPES.OBSTBAUM && serviceConfig.specialActions) {
    return createObstbaumActionsCard(serviceData, serviceConfig.specialActions);
  }
  
  if (serviceData.action && serviceConfig.actions) {
    return createPropertiesCard(serviceData, serviceConfig);
  }
  
  return null;
}

// GEÄNDERT: Funktion für Hecken-Rabatt Cards - Kompakte Struktur
function createHedgeDiscountCard(discountType, serviceConfig) {
  const actionConfig = serviceConfig.actions[discountType];
  
  if (!actionConfig) {
    console.warn(`Unknown hedge discount type: ${discountType}`);
    return null;
  }
  
  const card = document.createElement('div');
  card.className = 'service-info-card hedge-discount-card';
  
  const actionLabel = getLabel(ACTION_LABELS[discountType]);
  
  card.innerHTML = `
    <h4 class="hedge-discount-header">${actionLabel}</h4>
    <img class="hedge-discount-icon" src="${actionConfig.icon}" alt="${actionLabel}" />
    <span class="hedge-discount-percentage" style="color: ${actionConfig.color}">
      ${actionConfig.percentage}
    </span>
    <p class="hedge-discount-description">${actionConfig.description}</p>
  `;
  
  return card;
}

function createErschwernissenCard(erschwerungen) {
  if (!erschwerungen || erschwerungen.length === 0) {
    return null;
  }
  
  const card = document.createElement('div');
  card.className = 'service-info-card erschwerungen-card';
  
  const header = document.createElement('h4');
  header.className = 'erschwerungen-header';
  header.textContent = 'Erschwerungen';
  card.appendChild(header);
  
  const content = document.createElement('div');
  content.className = 'erschwerungen-content';
  
  const itemsPerColumn = 2;
  const columns = Math.ceil(erschwerungen.length / itemsPerColumn);
  
  for (let col = 0; col < columns; col++) {
    if (col > 0) {
      const divider = document.createElement('div');
      divider.className = 'erschwerungen-divider';
      content.appendChild(divider);
    }
    
    const column = document.createElement('div');
    column.className = 'erschwerungen-column';
    
    const startIndex = col * itemsPerColumn;
    const endIndex = Math.min(startIndex + itemsPerColumn, erschwerungen.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      const item = createErschwernisItem(erschwerungen[i]);
      if (item) column.appendChild(item);
    }
    
    content.appendChild(column);
  }
  
  card.appendChild(content);
  return card;
}

function createErschwernisItem(erschwerung) {
  const erschwerungConfig = ERSCHWERUNG_LABELS[erschwerung.type];
  const iconPath = ERSCHWERUNG_ICONS[erschwerung.type];
  
  if (!erschwerungConfig) {
    console.warn(`Unknown erschwerung type: ${erschwerung.type}`);
    return null;
  }
  
  const item = document.createElement('div');
  item.className = 'erschwerung-item';
  
  const iconDiv = document.createElement('div');
  iconDiv.className = 'erschwerung-icon';
  const icon = document.createElement('img');
  icon.src = iconPath;
  icon.alt = getLabel(erschwerungConfig);
  iconDiv.appendChild(icon);
  
  const content = document.createElement('div');
  content.className = 'erschwerung-content';
  
  let contentText = erschwerungConfig.description;
  
  switch (erschwerung.type) {
    case ERSCHWERUNG_TYPES.NACHBARN:
      contentText += ` - Bei ${erschwerung.anzahl} Nachbarn`;
      break;
      
    case ERSCHWERUNG_TYPES.SONSTIGES:
      contentText += ` - Auf ${erschwerung.meter} Metern`;
      if (erschwerung.beschreibung) {
        contentText += ` (${erschwerung.beschreibung})`;
      }
      break;
      
    default:
      contentText += ` - Auf ${erschwerung.meter} Metern`;
      break;
  }
  
  content.textContent = contentText;
  
  const status = document.createElement('div');
  status.className = 'erschwerung-status';
  status.textContent = '✓';
  
  item.appendChild(iconDiv);
  item.appendChild(content);
  item.appendChild(status);
  
  return item;
}

function createHedgeActionsCard(serviceData, serviceConfig) {
  const card = document.createElement('div');
  card.className = 'service-info-card hedge-actions-card';
  
  const hedgeAction = serviceData.hedgeAction;
  const actionConfig = serviceConfig.actions[hedgeAction];
  
  if (!actionConfig) {
    console.warn(`Unknown hedge action: ${hedgeAction}`);
    return null;
  }
  
  const actionLabel = getLabel(ACTION_LABELS[hedgeAction]);
  
  switch (hedgeAction) {
    case ACTION_TYPES.HEDGE_FORMSCHNITT:
      card.innerHTML = `
        <div class="hedge-formschnitt-card">
          <div class="hedge-formschnitt-icon" style="color: ${actionConfig.color}">
            <i class="${actionConfig.icon}"></i>
          </div>
          <div class="hedge-formschnitt-title">${actionLabel}</div>
        </div>`;
      break;
      
    case ACTION_TYPES.HEDGE_SCHREDDERSCHNITT:
      card.innerHTML = `
        <div class="hedge-schredderschnitt-card">
          <div class="hedge-schredderschnitt-icon" style="color: ${actionConfig.color}">
            <i class="${actionConfig.icon}"></i>
          </div>
          <div class="hedge-schredderschnitt-title">${actionLabel}</div>
        </div>`;
      break;
      
    case ACTION_TYPES.HEDGE_VERJUENGUNG:
      card.innerHTML = `
        <div class="hedge-verjuengung-card">
          <div class="hedge-verjuengung-icon" style="color: ${actionConfig.color}">
            <i class="${actionConfig.icon}"></i>
          </div>
          <div class="hedge-verjuengung-title">${actionLabel}</div>
        </div>`;
      break;
  }
  
  return card;
}

function createStandardActionsCard(actionStatus, actionConfig) {
  const card = document.createElement('div');
  card.className = 'service-info-card actions-card';
  
  const list = document.createElement('div');
  list.className = 'actions-list';
  
  actionStatus.forEach((done, index) => {
    if (index < actionConfig.length) {
      const action = actionConfig[index];
      const item = document.createElement('div');
      item.className = 'action-item';
      item.innerHTML = `
        <img class="action-icon" src="${action.icon}" alt="${action.label}" />
        <div class="action-content">
          <div class="action-label">${action.label}</div>
          <div class="action-status ${done ? 'done' : 'not-done'}">${done ? '✓' : '✗'}</div>
        </div>`;
      list.appendChild(item);
    }
  });
  
  card.appendChild(list);
  return card;
}

function createObstbaumActionsCard(serviceData, specialActions) {
  const card = document.createElement('div');
  card.className = 'service-info-card actions-card obstbaum-actions';
  
  const list = document.createElement('div');
  list.className = 'actions-list';
  
  if (serviceData.abschnittmenge && specialActions.abschnittmenge[serviceData.abschnittmenge]) {
    const abschnitt = specialActions.abschnittmenge[serviceData.abschnittmenge];
    const item = document.createElement('div');
    item.className = 'action-item';
    item.innerHTML = `
      <img class="action-icon" src="${abschnitt.icon}" alt="${abschnitt.label}" />
      <div class="action-content">
        <div class="action-label">${abschnitt.label}</div>
        <div class="action-status done">✓</div>
      </div>`;
    list.appendChild(item);
  }
  
  if (serviceData.werkzeug && specialActions.werkzeug[serviceData.werkzeug]) {
    const werkzeug = specialActions.werkzeug[serviceData.werkzeug];
    const item = document.createElement('div');
    item.className = 'action-item';
    item.innerHTML = `
      <img class="action-icon" src="${werkzeug.icon}" alt="${werkzeug.label}" />
      <div class="action-content">
        <div class="action-label">${werkzeug.label}</div>
        <div class="action-status done">✓</div>
      </div>`;
    list.appendChild(item);
  }
  
  card.appendChild(list);
  return card;
}

function createPropertiesCard(serviceData, serviceConfig) {
  const card = document.createElement('div');
  card.className = 'service-info-card strauch-properties-card';
  
  const actionConfig = serviceConfig.actions[serviceData.action];
  if (!actionConfig) return null;
  
  const actionLabel = getLabel(ACTION_LABELS[serviceData.action]);
  
  switch (serviceData.action) {
    case ACTION_TYPES.FORMSCHNITT:
      card.innerHTML = `
        <div class="formschnitt-card">
          <div class="formschnitt-icon">
            <i class="${actionConfig.icon}"></i>
          </div>
          <div class="formschnitt-title">${actionLabel}</div>
        </div>`;
      break;
      
    case ACTION_TYPES.RUECKSCHNITT:
      card.innerHTML = `
        <div class="rueckschnitt-card">
          <div class="rueckschnitt-icon">
            <i class="${actionConfig.icon}"></i>
          </div>
          <div class="rueckschnitt-title">${actionLabel}</div>
          <div class="rueckschnitt-height">${serviceData.zielhoehe} m</div>
        </div>`;
      break;
      
    case ACTION_TYPES.ENTFERNEN:
      const entfernungsart = serviceData.entfernungsart || ENTFERNUNGSARTEN.BODEN;
      const bodenLabel = getLabel(ENTFERNUNGSARTEN_LABELS[ENTFERNUNGSARTEN.BODEN]);
      const wurzelLabel = getLabel(ENTFERNUNGSARTEN_LABELS[ENTFERNUNGSARTEN.WURZEL]);
      
      card.innerHTML = `
        <div class="entfernung-card">
          <div class="entfernung-left">
            <div class="entfernung-icon">
              <i class="${actionConfig.icon}"></i>
            </div>
            <div class="entfernung-title">${actionLabel}</div>
          </div>
          <div class="entfernung-right">
            <div class="entfernung-option ${entfernungsart === ENTFERNUNGSARTEN.BODEN ? 'active' : 'inactive'}">
              ${bodenLabel}
            </div>
            <div class="entfernung-option ${entfernungsart === ENTFERNUNGSARTEN.WURZEL ? 'active' : 'inactive'}">
              ${wurzelLabel}
            </div>
          </div>
        </div>`;
      break;
  }
  
  return card;
}

function createTimePriceCard(serviceData) {
  const card = document.createElement('div');
  card.className = 'service-info-card time-price-card';
  
  /* — Kopf­banner nur beim Heckenschnitt — */
  if (serviceData.type === SERVICE_TYPES.HECKE && serviceData.hedgeAction) {
    const banner = document.createElement('div');
    banner.className = 'schnittart-banner';
    const cfg   = SERVICE_CONFIG[SERVICE_TYPES.HECKE].actions[serviceData.hedgeAction];
    const label = getLabel(ACTION_LABELS[serviceData.hedgeAction]);
    banner.innerHTML = `
      <i class="schnittart-icon ${cfg.icon}" style="color:${cfg.color}"></i>
      <div class="schnittart-text">
        <span class="schnittart-label">Schnittart</span>
        <span class="schnittart-value">${label}</span>
      </div>`;
    card.appendChild(banner);
  }
  
  /* — Restliche Infos — */
  const info = document.createElement('div');
  info.className = 'time-price-info';
  addTPItem(info, 'fa-regular fa-clock', 'Soll‑Zeit', serviceData.sollZeit);
  addTPItem(info, 'fa-solid fa-euro-sign', 'Preis', formatPrice(serviceData.preis));
  card.appendChild(info);
  return card;
}

function addTPItem(container, iconCls, label, value) {
  if (!value) return;
  const item = document.createElement('div');
  item.className = 'time-price-item';
  item.innerHTML = `
    <i class="time-price-icon ${iconCls}"></i>
    <div class="time-price-content">
      <span class="time-price-label">${label}</span>
      <span class="time-price-value">${value}</span>
    </div>`;
  if (container.children.length) {
    const div = document.createElement('div');
    div.className = 'time-price-divider';
    container.appendChild(div);
  }
  container.appendChild(item);
}

function createPricingAdjustmentsCard(serviceData) {
  const adj = serviceData.adjustments;
  const card = document.createElement('div');
  card.className = 'service-info-card pricing-adjustments-card';
  
  const basePrice = formatPrice(adj.basePrice, false);
  const discount = formatPrice(adj.discount, false);
  const surcharge = formatPrice(adj.surcharge, false);
  
  const hasDiscount = adj.discount > 0;
  const hasSurcharge = adj.surcharge > 0;
  const adjustmentCount = (hasDiscount ? 1 : 0) + (hasSurcharge ? 1 : 0);
  
  let adjustmentsHTML = '';
  
  if (hasDiscount) {
    adjustmentsHTML += `
      <div class="adjustment-item">
        <span class="price-euro-icon green">€</span>
        <div class="price-text-block">
          <span class="price-label">Rabatt</span>
          <span class="price-value">${discount}</span>
        </div>
      </div>`;
  }
  
  if (hasSurcharge) {
    adjustmentsHTML += `
      <div class="adjustment-item">
        <span class="price-euro-icon red">€</span>
        <div class="price-text-block">
          <span class="price-label">Aufpreis</span>
          <span class="price-value">${surcharge}</span>
        </div>
      </div>`;
  }
  
  card.innerHTML = `
    <h4 class="pricing-card-header">Rabatt / Aufpreis individuell</h4>
    <div class="pricing-adjustments adjustments-count-${adjustmentCount}">
      <div class="pricing-details">
        <div class="price-item">
          <span class="price-euro-icon black">€</span>
          <div class="price-text-block">
            <span class="price-label">Grundpreis</span>
            <span class="price-value">${basePrice}</span>
          </div>
        </div>
        <div class="adjustments-row">
          ${adjustmentsHTML}
        </div>
      </div>
      <div class="pricing-divider"></div>
      <div class="reasoning-section">
        <span class="reasoning-header">Begründung</span>
        <div class="reasoning-content">
          <img class="reasoning-icon" src="begründung.png" alt="Begründung" />
          <span class="reasoning-text">${adj.reasoning}</span>
        </div>
      </div>
    </div>`;
  
  return card;
}