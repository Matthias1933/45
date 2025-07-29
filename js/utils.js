// utils.js - Zentrale Utility-Funktionen und Helper

import { 
  CURRENT_LANGUAGE, 
  getLabel, 
  UNITS, 
  PLACEHOLDERS,
  SERVICE_TYPES,
  ACTION_TYPES 
} from './constants.js';

// ===== PREIS-FORMATIERUNG =====
/**
 * Formatiert einen Preiswert einheitlich für die UI-Anzeige (europäisch)
 * @param {number|string|null|undefined} value - Der Preiswert
 * @param {boolean} showCurrency - Ob das Währungssymbol angezeigt werden soll
 * @returns {string} Formatierter Preis
 */
export function formatPrice(value, showCurrency = true) {
  // Robuste Validierung
  if (value === null || value === undefined || value === '') {
    console.warn('⚠️ formatPrice: Received null/undefined/empty value');
    return getLabel(PLACEHOLDERS.NO_DATA);
  }
  
  // String zu Number konvertieren
  const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
  
  if (isNaN(numValue)) {
    console.warn(`⚠️ formatPrice: Invalid number value: ${value}`);
    return getLabel(PLACEHOLDERS.NO_DATA);
  }
  
  // Europäische Formatierung: Komma statt Punkt
  const formatted = numValue.toFixed(2).replace('.', ',');
  const currency = getLabel(UNITS.EURO);
  
  return showCurrency ? `${formatted} ${currency}` : formatted;
}

// ===== ZEIT-FORMATIERUNG =====
/**
 * Formatiert Zeitwerte einheitlich
 * @param {string|null|undefined} value - Der Zeitwert (z.B. "2:30")
 * @param {boolean} showUnit - Ob die Zeiteinheit angezeigt werden soll
 * @returns {string} Formatierte Zeit
 */
export function formatTime(value, showUnit = true) {
  if (!value) {
    console.warn('⚠️ formatTime: Received empty value');
    return getLabel(PLACEHOLDERS.NO_DATA);
  }
  
  const unit = getLabel(UNITS.HOUR);
  return showUnit ? `${value} ${unit}` : value;
}

// ===== DATUM-FORMATIERUNG =====
/**
 * Formatiert ISO-Datum für deutsche Anzeige
 * @param {string} isoDate - Datum im ISO-Format (YYYY-MM-DD)
 * @returns {string} Formatiertes Datum (DD.MM.YYYY)
 */
export function formatDate(isoDate) {
  if (!isoDate) {
    console.warn('⚠️ formatDate: Received empty date');
    return getLabel(PLACEHOLDERS.NO_DATA);
  }
  
  try {
    const [year, month, day] = isoDate.split('-');
    return `${day}.${month}.${year}`;
  } catch (error) {
    console.error(`⚠️ formatDate: Invalid date format: ${isoDate}`, error);
    return getLabel(PLACEHOLDERS.NO_DATA);
  }
}

// ===== MAß-FORMATIERUNG =====
/**
 * Formatiert Maßangaben mit Einheit (europäisch)
 * @param {number|null|undefined} value - Der Maßwert
 * @param {string} unit - Die Einheit (aus UNITS)
 * @returns {string} Formatierte Maßangabe
 */
export function formatMeasure(value, unit = 'm') {
  if (value === null || value === undefined || value === '') {
    return getLabel(PLACEHOLDERS.NO_DATA);
  }
  
  // Robuste Number-Konvertierung
  const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
  
  if (isNaN(numValue)) {
    console.warn(`⚠️ formatMeasure: Invalid measure value: ${value}`);
    return getLabel(PLACEHOLDERS.NO_DATA);
  }
  
  // Europäische Formatierung: Komma statt Punkt für Dezimalzahlen
  const formatted = numValue % 1 === 0 ? numValue.toString() : numValue.toFixed(1).replace('.', ',');
  
  // Einheit aus UNITS holen oder Fallback
  const unitLabel = UNITS[unit.toUpperCase()]?.[CURRENT_LANGUAGE] || unit;
  
  return `${formatted} ${unitLabel}`;
}

// ===== FEHLERBEHANDLUNG =====
/**
 * Erstellt eine sichtbare Fehlermeldung für unbekannte Service-Types
 * @param {string} serviceType - Der unbekannte Service-Type
 * @param {string} context - Kontext der Fehlermeldung
 * @returns {HTMLElement} Element mit Fehlermeldung
 */
export function createErrorCard(serviceType, context = 'Service') {
  console.error(`❌ Unknown ${context}: ${serviceType}`);
  
  const errorCard = document.createElement('div');
  errorCard.className = 'error-card';
  errorCard.style.cssText = `
    background: #fee2e2;
    border: 2px solid #f87171;
    border-radius: 8px;
    padding: 12px;
    color: #dc2626;
    font-weight: 600;
    text-align: center;
    margin: 8px 0;
  `;
  
  const unknownLabel = getLabel(PLACEHOLDERS.UNKNOWN_SERVICE);
  errorCard.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i>
    ${unknownLabel}: <code>${serviceType}</code>
    <br><small>Check: ${context} Configuration</small>
  `;
  
  return errorCard;
}

/**
 * Erstellt eine Warnung für fehlendes Layout
 * @param {string} serviceType - Service-Type ohne Layout
 * @param {string} layoutType - Der angeforderte Layout-Type
 * @returns {HTMLElement} Element mit Layout-Warnung
 */
export function createLayoutWarning(serviceType, layoutType) {
  console.warn(`⚠️ Missing layout '${layoutType}' for service: ${serviceType}`);
  
  const warningCard = document.createElement('div');
  warningCard.className = 'layout-warning';
  warningCard.style.cssText = `
    background: #fef3c7;
    border: 2px solid #f59e0b;
    border-radius: 8px;
    padding: 12px;
    color: #92400e;
    font-weight: 500;
    text-align: center;
    margin: 8px 0;
  `;
  
  const missingLabel = getLabel(PLACEHOLDERS.MISSING_LAYOUT);
  warningCard.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    ${missingLabel}: <code>${layoutType}</code>
    <br><small>Service: ${serviceType}</small>
  `;
  
  return warningCard;
}

// ===== VALIDIERUNG =====
/**
 * Validiert Service-Type gegen bekannte Enums
 * @param {string} serviceType - Zu validierender Service-Type
 * @returns {boolean} True wenn gültig
 */
export function isValidServiceType(serviceType) {
  const isValid = Object.values(SERVICE_TYPES).includes(serviceType);
  if (!isValid) {
    console.warn(`⚠️ Invalid service type: ${serviceType}`);
  }
  return isValid;
}

/**
 * Validiert Action-Type gegen bekannte Enums (erweitert um neue Hecken-Rabatt Actions)
 * @param {string} actionType - Zu validierender Action-Type
 * @returns {boolean} True wenn gültig
 */
export function isValidActionType(actionType) {
  const isValid = Object.values(ACTION_TYPES).includes(actionType);
  if (!isValid) {
    console.warn(`⚠️ Invalid action type: ${actionType}`);
  }
  return isValid;
}

/**
 * NEU: Prüft ob ein Action-Type ein Hecken-Rabatt ist
 * @param {string} actionType - Zu prüfender Action-Type
 * @returns {boolean} True wenn es ein Hecken-Rabatt ist
 */
export function isHedgeDiscountType(actionType) {
  const hedgeDiscountTypes = [
    ACTION_TYPES.HEDGE_SCHNITTRABATT,
    ACTION_TYPES.HEDGE_ENTSORGUNGSRABATT_BIOTONNE,
    ACTION_TYPES.HEDGE_ENTSORGUNGSRABATT_LIEGENLASSEN
  ];
  return hedgeDiscountTypes.includes(actionType);
}

// ===== LAZY LOADING FÜR BILDER =====
/**
 * Erstellt Lazy-Loading Observer für Bilder
 * @param {number} threshold - Anzahl Bilder, ab der Lazy Loading aktiviert wird
 * @returns {IntersectionObserver|null} Observer oder null
 */
export function createImageLazyLoader(threshold = 5) {
  if (!('IntersectionObserver' in window)) {
    console.warn('⚠️ IntersectionObserver not supported - Lazy loading disabled');
    return null;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const dataSrc = img.getAttribute('data-src');
        
        if (dataSrc) {
          img.src = dataSrc;
          img.removeAttribute('data-src');
          img.classList.remove('lazy-loading');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px'
  });
  
  return observer;
}

/**
 * Wendet Lazy Loading auf Bildcontainer an
 * @param {HTMLElement} container - Container mit Bildern
 * @param {number} visibleCount - Anzahl sofort sichtbarer Bilder
 */
export function applyLazyLoading(container, visibleCount = 2) {
  const images = container.querySelectorAll('img');
  
  if (images.length <= visibleCount) {
    return; // Nicht genug Bilder für Lazy Loading
  }
  
  const observer = createImageLazyLoader();
  if (!observer) return;
  
  images.forEach((img, index) => {
    if (index >= visibleCount) {
      // Lazy Loading für Bilder ab Index visibleCount
      const currentSrc = img.src;
      img.setAttribute('data-src', currentSrc);
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4='; // Transparentes Placeholder
      img.classList.add('lazy-loading');
      observer.observe(img);
    }
  });
}

// ===== DATEN-VALIDIERUNG =====
/**
 * Validiert Auftragsdaten auf Vollständigkeit
 * @param {Object} orderData - Auftragsdaten
 * @returns {Object} Validierungsergebnis
 */
export function validateOrderData(orderData) {
  const errors = [];
  const warnings = [];
  
  // Pflichtfelder prüfen
  if (!orderData.datum) errors.push('Missing datum');
  if (!orderData.preis) warnings.push('Missing preis');
  if (!orderData.services || !Array.isArray(orderData.services)) {
    errors.push('Missing or invalid services array');
  }
  
  // Services validieren
  if (orderData.services) {
    orderData.services.forEach((service, index) => {
      if (!service.type) {
        errors.push(`Service ${index}: Missing type`);
      } else if (!isValidServiceType(service.type)) {
        warnings.push(`Service ${index}: Unknown type '${service.type}'`);
      }
      
      if (typeof service.preis !== 'number') {
        warnings.push(`Service ${index}: Preis should be number, got ${typeof service.preis}`);
      }
      
      // NEU: Hecken-Rabatt Validierung
      if (service.hedgeDiscounts && Array.isArray(service.hedgeDiscounts)) {
        service.hedgeDiscounts.forEach((discountType, discountIndex) => {
          if (!isValidActionType(discountType)) {
            warnings.push(`Service ${index}, Discount ${discountIndex}: Unknown discount type '${discountType}'`);
          } else if (!isHedgeDiscountType(discountType)) {
            warnings.push(`Service ${index}, Discount ${discountIndex}: '${discountType}' is not a hedge discount type`);
          }
        });
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// ===== DEBUG HELPER =====
/**
 * Loggt Datenstruktur für Debugging
 * @param {any} data - Zu loggende Daten
 * @param {string} label - Label für den Log
 */
export function debugLog(data, label = 'Debug') {
  if (process.env.NODE_ENV === 'development' || window.DEBUG) {
    console.group(`🔍 ${label}`);
    console.log(data);
    console.groupEnd();
  }
}