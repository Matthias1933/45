// constants.js - Zentrale Enums und Konfiguration für bessere Typsicherheit

// ===== ZENTRALE ENUMS =====
export const SERVICE_TYPES = {
  VERTIKUTIEREN: 'vertikutieren',
  RASEN: 'rasen',
  HECKE: 'hecke',
  OBSTBAUM: 'obstbaum',
  STRAUCH: 'strauch',
  BAUM: 'baum',
  KONIFERE: 'konifere',
  MICHA: 'micha'
};

export const ACTION_TYPES = {
  FORMSCHNITT: 'formschnitt',
  RUECKSCHNITT: 'rueckschnitt',
  ENTFERNEN: 'entfernen',
  // Hecken-spezifische Actions
  HEDGE_FORMSCHNITT: 'hedge_formschnitt',
  HEDGE_SCHREDDERSCHNITT: 'hedge_schredderschnitt',
  HEDGE_VERJUENGUNG: 'hedge_verjuengung',
  // NEU: Hecken-Rabatt Actions
  HEDGE_SCHNITTRABATT: 'hedge_schnittrabatt',
  HEDGE_ENTSORGUNGSRABATT_BIOTONNE: 'hedge_entsorgungsrabatt_biotonne',
  HEDGE_ENTSORGUNGSRABATT_LIEGENLASSEN: 'hedge_entsorgungsrabatt_liegenlassen'
};

// NEU: Erschwerungen-Types
export const ERSCHWERUNG_TYPES = {
  ZAUN_HECKE: 'zaun_hecke',
  POOL: 'pool',
  BEET: 'beet',
  SCHUPPEN: 'schuppen',
  NACHBARN: 'nachbarn',
  PODEST: 'podest',
  PLANE: 'plane',
  SONSTIGES: 'sonstiges'
};

export const ENTFERNUNGSARTEN = {
  BODEN: 'boden',
  WURZEL: 'wurzel'
};

export const OBSTBAUM_ABSCHNITTMENGE = {
  VIEL: 'viel',
  NORMAL: 'normal'
};

export const OBSTBAUM_WERKZEUG = {
  KETTENSAEGE: 'kettensaege',
  ROSENSCHERE: 'rosenschere'
};

export const ZEIT_STATUS = {
  ON_TIME: 'on-time',
  OVER_TIME: 'over-time'
};

// ===== ICON MAPPINGS =====
export const WORK_TYPE_ICONS = {
  [SERVICE_TYPES.VERTIKUTIEREN]: 'fas fa-fan',
  [SERVICE_TYPES.RASEN]: 'fa-solid fa-wheat-awn',
  [SERVICE_TYPES.MICHA]: 'fa-solid fa-user-check',
  [SERVICE_TYPES.HECKE]: 'fa-solid fa-scissors',
  [SERVICE_TYPES.OBSTBAUM]: 'fa-solid fa-apple-whole',
  [SERVICE_TYPES.STRAUCH]: 'fa-solid fa-tree',
  [SERVICE_TYPES.BAUM]: 'fa-solid fa-tree',
  [SERVICE_TYPES.KONIFERE]: 'fa-solid fa-tree'
};

// NEU: Erschwerungen Icon Mappings
export const ERSCHWERUNG_ICONS = {
  [ERSCHWERUNG_TYPES.ZAUN_HECKE]: 'erschwernis_zaun_hecke.png',
  [ERSCHWERUNG_TYPES.POOL]: 'erschwernis_pool.png',
  [ERSCHWERUNG_TYPES.BEET]: 'erschwernis_beet.png',
  [ERSCHWERUNG_TYPES.SCHUPPEN]: 'erschwernis_schuppen.png',
  [ERSCHWERUNG_TYPES.NACHBARN]: 'erschwernis_nachbarn.png',
  [ERSCHWERUNG_TYPES.PODEST]: 'erschwernis_podest.png',
  [ERSCHWERUNG_TYPES.PLANE]: 'erschwernis_plane.png',
  [ERSCHWERUNG_TYPES.SONSTIGES]: 'erschwernis_sonstiges.png'
};

// ===== MEHRSPRACHIGE LABELS =====
export const SERVICE_LABELS = {
  [SERVICE_TYPES.VERTIKUTIEREN]: {
    de: 'Vertikutieren',
    en: 'Scarifying'
  },
  [SERVICE_TYPES.RASEN]: {
    de: 'Rasenmähen',
    en: 'Lawn Mowing'
  },
  [SERVICE_TYPES.MICHA]: {
    de: 'Von Micha besichtigt',
    en: 'Inspected by Micha'
  },
  [SERVICE_TYPES.HECKE]: {
    de: 'Heckenschnitt',
    en: 'Hedge Trimming'
  },
  [SERVICE_TYPES.OBSTBAUM]: {
    de: 'Obstbaumschnitt',
    en: 'Fruit Tree Pruning'
  },
  [SERVICE_TYPES.STRAUCH]: {
    de: 'Strauchschnitt',
    en: 'Shrub Trimming'
  },
  [SERVICE_TYPES.BAUM]: {
    de: 'Baumschnitt',
    en: 'Tree Pruning'
  },
  [SERVICE_TYPES.KONIFERE]: {
    de: 'Koniferenschnitt',
    en: 'Conifer Trimming'
  }
};

export const ACTION_LABELS = {
  [ACTION_TYPES.FORMSCHNITT]: {
    de: 'Formschnitt',
    en: 'Shape Cutting'
  },
  [ACTION_TYPES.RUECKSCHNITT]: {
    de: 'Rückschnitt auf',
    en: 'Cut back to'
  },
  [ACTION_TYPES.ENTFERNEN]: {
    de: 'Entfernt',
    en: 'Removed'
  },
  // Hecken-spezifische Action Labels
  [ACTION_TYPES.HEDGE_FORMSCHNITT]: {
    de: 'Formschnitt',
    en: 'Shape Cutting'
  },
  [ACTION_TYPES.HEDGE_SCHREDDERSCHNITT]: {
    de: 'Schredderschnitt',
    en: 'Shredder Cut'
  },
  [ACTION_TYPES.HEDGE_VERJUENGUNG]: {
    de: 'Verjüngung',
    en: 'Rejuvenation'
  },
  // NEU: Hecken-Rabatt Labels
  [ACTION_TYPES.HEDGE_SCHNITTRABATT]: {
    de: 'Schnittrabatt',
    en: 'Cut Discount'
  },
  [ACTION_TYPES.HEDGE_ENTSORGUNGSRABATT_BIOTONNE]: {
    de: 'Entsorgungsrabatt',
    en: 'Disposal Discount'
  },
  [ACTION_TYPES.HEDGE_ENTSORGUNGSRABATT_LIEGENLASSEN]: {
    de: 'Entsorgungsrabatt',
    en: 'Disposal Discount'
  }
};

// NEU: Erschwerungen Labels
export const ERSCHWERUNG_LABELS = {
  [ERSCHWERUNG_TYPES.ZAUN_HECKE]: {
    de: 'Zaun/Hecke',
    description: 'zwischen Zaun und Hecke schneiden',
    en: 'Fence/Hedge'
  },
  [ERSCHWERUNG_TYPES.POOL]: {
    de: 'Pool',
    description: 'Pool an der Hecke',
    en: 'Pool'
  },
  [ERSCHWERUNG_TYPES.BEET]: {
    de: 'Beet',
    description: 'Beet an der Hecke',
    en: 'Flower Bed'
  },
  [ERSCHWERUNG_TYPES.SCHUPPEN]: {
    de: 'Schuppen',
    description: 'Schuppen an der Hecke',
    en: 'Shed'
  },
  [ERSCHWERUNG_TYPES.NACHBARN]: {
    de: 'Nachbarn',
    description: 'vom Nachbargrundstück aus schneiden',
    en: 'Neighbors'
  },
  [ERSCHWERUNG_TYPES.PODEST]: {
    de: 'Podest/Anhöhe',
    description: 'Hecke steht auf Podest/Anhöhe',
    en: 'Platform/Hill'
  },
  [ERSCHWERUNG_TYPES.PLANE]: {
    de: 'Plane',
    description: 'Plane auslegen',
    en: 'Tarp'
  },
  [ERSCHWERUNG_TYPES.SONSTIGES]: {
    de: 'Sonstiges',
    description: 'Sonstige Erschwerung',
    en: 'Other'
  }
};

export const ENTFERNUNGSARTEN_LABELS = {
  [ENTFERNUNGSARTEN.BODEN]: {
    de: 'über dem Erdboden gekappt',
    en: 'cut above ground level'
  },
  [ENTFERNUNGSARTEN.WURZEL]: {
    de: 'mit Wurzel entfernt',
    en: 'removed with roots'
  }
};

// ===== UNITS =====
export const UNITS = {
  SQUARE_METER: {
    de: 'm²',
    en: 'sqm'
  },
  METER: {
    de: 'm',
    en: 'm'
  },
  HOUR: {
    de: 'h',
    en: 'h'
  },
  EURO: {
    de: '€',
    en: '€'
  }
};

// ===== STANDARD MEASURE LABELS =====
export const MEASURE_LABELS = {
  TOTAL: {
    de: 'Gesamt',
    en: 'Total'
  },
  HEIGHT: {
    de: 'Höhe',
    en: 'Height'
  },
  WIDTH: {
    de: 'Breite',
    en: 'Width'
  },
  LENGTH: {
    de: 'Länge',
    en: 'Length'
  },
  DEPTH: {
    de: 'Tiefe',
    en: 'Depth'
  }
};

// ===== AKTUELLE SPRACHE =====
export let CURRENT_LANGUAGE = 'de'; // Default: Deutsch

// ===== UTILITY FUNKTIONEN =====
export function setLanguage(lang) {
  if (['de', 'en'].includes(lang)) {
    CURRENT_LANGUAGE = lang;
    console.log(`🌐 Language switched to: ${lang}`);
  } else {
    console.warn(`⚠️ Unknown language: ${lang}. Keeping current: ${CURRENT_LANGUAGE}`);
  }
}

export function getLabel(labelObject, fallback = '–') {
  if (!labelObject) {
    console.warn('⚠️ Label object is undefined');
    return fallback;
  }
  
  return labelObject[CURRENT_LANGUAGE] || labelObject.de || fallback;
}

// ===== PLACEHOLDER TEXTE =====
export const PLACEHOLDERS = {
  NO_DATA: {
    de: '–',
    en: '–'
  },
  NO_DETAILS: {
    de: 'keine Detailinfo',
    en: 'no details available'
  },
  UNKNOWN_SERVICE: {
    de: 'Unbekannter Service-Typ',
    en: 'Unknown service type'
  },
  MISSING_LAYOUT: {
    de: 'Layout nicht definiert',
    en: 'Layout not defined'
  }
};