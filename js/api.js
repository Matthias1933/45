// api.js - ERWEITERT um Hecken-Actions und Erschwerungen Mock-Daten

import { formatPrice } from './utils.js';

export function getCustomerMockData(name) {
  const data = {
    'Johannes Schmidt': {
      einsatzort: {
        name: 'Johannes Schmidt',
        adresse: 'Marienfelder Chaussee 161, 12349 Berlin',
        telefon: '030 123456789',
        email: 'j.schmidt@email.de'
      },
      rechnung: {
        name: 'Johannes Schmidt',
        adresse: 'Marienfelder Chaussee 161, 12349 Berlin',
        telefon: '030 123456789',
        email: 'j.schmidt@email.de'
      },
      notizen: 'Zahlung immer pünktlich',
      dateien: ['vertrag.pdf'],
      rating: 5
    },
    'Sabine Meier': {
      einsatzort: {
        name: 'Sabine Meier',
        adresse: 'Mönckebergstraße 5, 20095 Hamburg',
        telefon: '040 987654321',
        email: 's.meier@email.de'
      },
      rechnung: {
        name: 'Meier GmbH',
        adresse: 'Mönckebergstraße 5, 20095 Hamburg',
        telefon: '040 987654321',
        email: 'buchhaltung@meier-gmbh.de'
      },
      notizen: 'Zahlung immer zum Monatsende',
      dateien: ['skizze.png'],
      rating: 4
    },
    'Klaus Weber': {
      einsatzort: {
        name: 'Klaus Weber',
        adresse: 'Marienplatz 8, 80331 München',
        telefon: '089 555666777',
        email: 'k.weber@email.de'
      },
      rechnung: {
        name: 'Klaus Weber',
        adresse: 'Marienplatz 8, 80331 München',
        telefon: '089 555666777',
        email: 'k.weber@email.de'
      },
      notizen: 'Hat häufig Sonderwünsche',
      dateien: [],
      rating: 3
    },
    'Maria Mustermann': {
      einsatzort: {
        name: 'Maria Mustermann',
        adresse: 'Hohe Str. 100, 50667 Köln',
        telefon: '0221 444555666',
        email: 'm.mustermann@email.de'
      },
      rechnung: {
        name: 'Maria Mustermann',
        adresse: 'Hohe Str. 100, 50667 Köln',
        telefon: '0221 444555666',
        email: 'm.mustermann@email.de'
      },
      notizen: '',
      dateien: [],
      rating: 2
    }
  };
  
  return data[name] || data['Johannes Schmidt'];
}

export function getCustomerOrderHistory(customerName) {
  const allOrderDetails = getAllOrderDetailData();
  const customerOrders = {};
  
  Object.keys(allOrderDetails).forEach(date => {
    const orderData = allOrderDetails[date];
    let belongsToCustomer = false;
    
    if (customerName === 'Johannes Schmidt') {
      belongsToCustomer = ['2024-04-17', '2023-09-22', '2022-05-31'].includes(date);
    } else if (customerName === 'Sabine Meier') {
      belongsToCustomer = ['2024-06-12'].includes(date);
    } else if (customerName === 'Klaus Weber') {
      belongsToCustomer = ['2024-03-25'].includes(date);
    } else if (customerName === 'Maria Mustermann') {
      belongsToCustomer = ['2024-07-08'].includes(date);
    }
    
    if (belongsToCustomer) {
      const year = date.split('-')[0];
      if (!customerOrders[year]) {
        customerOrders[year] = [];
      }
      
      customerOrders[year].push({
        date: date,
        displayDate: orderData.displayDate,
        price: orderData.preis,
        sollZeit: orderData.geplant,
        istZeit: orderData.tatsaechlich,
        istZeitStatus: orderData.istZeitStatus,
        arbeiten: orderData.arbeiten || [],
        bilder: orderData.bilder || []
      });
    }
  });
  
  return customerOrders;
}

// ZENTRALE DATENQUELLE: Erweitert um Hecken-Actions und Erschwerungen
function getAllOrderDetailData() {
  return {
    '2024-04-17': {
      displayDate: '17.04.2024',
      preis: 197.00,
      geplant: '3:00',
      tatsaechlich: '2:48',
      istZeitStatus: 'on-time',
      mitarbeiter: ['Micha Wolf', 'Durau Josh'],
      startzeit: '08:15',
      endzeit: '11:03',
      arbeiten: [
        {
          type: 'vertikutieren',
          description: '500 m²\nDüngen\nNachsaat'
        },
        {
          type: 'rasen',
          description: '350 m²\nKantenschnitt\nBewässerung'
        },
        {
          type: 'micha',
          description: 'keine Detailinfo'
        }
      ],
      bilder: [
        { src: 'foto_hecke1.jpg', alt: 'Vertikutieren 1' },
        { src: 'foto_hecke2.jpg', alt: 'Vertikutieren 2' },
        { src: 'foto_hecke1.jpg', alt: 'Vertikutieren 3' },
        { src: 'foto_hecke2.jpg', alt: 'Vertikutieren 4' },
        { src: 'foto_hecke1.jpg', alt: 'Vertikutieren 5' }
      ],
      services: [
        {
          type: 'vertikutieren',
          measure: 500,
          actions: [true, true, false],
          sollZeit: '2:30',
          preis: 180.00,
          adjustments: {
            basePrice: 200.00,
            discount: 22.00,
            surcharge: 12.00,
            reasoning: 'Erhöhter Preis aufgrund spezieller Rasenpflegeanlage erforderlich'
          }
        },
        {
          type: 'rasen',
          measure: 350,
          sollZeit: '1:00',
          preis: 95.00
        },
        {
          type: 'micha',
          sollZeit: '0:30',
          preis: 17.00
        }
      ]
    },
    
    '2023-09-22': {
      displayDate: '22.09.2023',
      preis: 320.00,
      geplant: '5:00',
      tatsaechlich: '5:20',
      istZeitStatus: 'over-time',
      mitarbeiter: ['Pulat Hakan', 'Durau Josh', 'Mueller Tim'],
      startzeit: '07:30',
      endzeit: '12:50',
      arbeiten: [
        {
          type: 'obstbaum',
          description: '5 Meter hoch\n4 Meter breit\nKettensäge'
        },
        {
          type: 'strauch',
          description: '3 Meter hoch\n2,5 Meter breit\nHandsäge'
        },
        {
          type: 'hecke',
          description: 'Rückschnitt: 13 m\nlang x 6 m hoch x\n1,4 m tief'
        }
      ],
      bilder: [
        { src: 'foto_hecke1.jpg', alt: 'Obstbaum 1' },
        { src: 'foto_hecke2.jpg', alt: 'Obstbaum 2' }
      ],
      services: [
        {
          type: 'obstbaum',
          measures: { height: 5, width: 4 },
          abschnittmenge: 'viel',
          werkzeug: 'kettensaege',
          sollZeit: '1:45',
          preis: 120.00,
          adjustments: {
            basePrice: 130.00,
            discount: 10.00,
            surcharge: 0.00,
            reasoning: 'Bäume stark verwachsen - Mehraufwand durch schwere Erreichbarkeit'
          }
        },
        {
          type: 'strauch',
          measures: { height: 3, width: 2.5 },
          action: 'formschnitt',
          sollZeit: '1:15',
          preis: 95.00
        },
        {
          type: 'hecke',
          measures: { length: 13, height: 6, depth: 1.4 },
          hedgeAction: 'hedge_verjuengung',
          // NEU: Erschwerungen bei diesem Heckenschnitt
          erschwerungen: [
            {
              type: 'pool',
              meter: 8
            },
            {
              type: 'nachbarn',
              anzahl: 2
            },
            {
              type: 'podest',
              meter: 5
            }
          ],
          // NEU: Hecken-Rabatt Demonstrationsdaten - Bedingungslogik
          hedgeDiscounts: {
            rueckseite: true,  // Rückseitenrabatt aktiv
            entsorgung: 'biotonne'  // 'biotonne', 'liegenlassen' oder null
          },
          sollZeit: '2:00',
          preis: 105.00,
          adjustments: {
            basePrice: 90.00,
            discount: 0.00,
            surcharge: 15.00,
            reasoning: 'Aufpreis für Rückschnitt über 5m Höhe - spezielles Equipment erforderlich'
          }
        }
      ]
    },

    '2022-05-31': {
      displayDate: '31.05.2022',
      preis: 163.00,
      geplant: '3:15',
      tatsaechlich: '3:18',
      istZeitStatus: 'over-time',
      mitarbeiter: ['Pulat Hakan'],
      startzeit: '09:00',
      endzeit: '13:00',
      arbeiten: [
        {
          type: 'hecke',
          description: 'Formschnitt: 7 m\nlang x 2 m hoch x\n1,2 m tief'
        },
        {
          type: 'hecke',
          description: 'Formschnitt: 13 m\nlang x 3 m hoch x\n1,2 m tief'
        }
      ],
      bilder: [
        { src: 'foto_hecke1.jpg', alt: 'Hecke vorher' },
        { src: 'foto_hecke2.jpg', alt: 'Hecke nachher' }
      ],
      services: [
        {
          type: 'hecke',
          measures: { length: 7, height: 2, depth: 1.2 },
          hedgeAction: 'hedge_formschnitt',
          // NEU: Kleine Erschwerungen
          erschwerungen: [
            {
              type: 'beet',
              meter: 3
            }
          ],
          // NEU: Nur Rückseitenrabatt, keine Entsorgung
          hedgeDiscounts: {
            rueckseite: true,  // Rückseitenrabatt aktiv
            entsorgung: null   // Keine Entsorgungsrabatte
          },
          sollZeit: '1:30',
          preis: 80.00,
          adjustments: {
            basePrice: 85.00,
            discount: 5.00,
            surcharge: 0.00,
            reasoning: 'Stammkunden-Rabatt - langjährige Zusammenarbeit'
          }
        },
        {
          type: 'hecke',
          measures: { length: 13, height: 3, depth: 1.2 },
          hedgeAction: 'hedge_formschnitt',
          // Keine Erschwerungen bei dieser Hecke
          // NEU: Keine Rabatte
          hedgeDiscounts: {
            rueckseite: false,  // Kein Rückseitenrabatt
            entsorgung: null    // Keine Entsorgungsrabatte
          },
          sollZeit: '1:45',
          preis: 83.00
        }
      ]
    },

    '2024-06-12': {
      displayDate: '12.06.2024',
      preis: 280.00,
      geplant: '4:30',
      tatsaechlich: '4:15',
      istZeitStatus: 'on-time',
      mitarbeiter: ['Micha Wolf', 'Durau Josh'],
      startzeit: '08:30',
      endzeit: '13:15',
      arbeiten: [
        {
          type: 'hecke',
          description: '15 m lang x\n2,5 m hoch x\n1,8 m tief'
        },
        {
          type: 'rasen',
          description: '800 m²\nKantenschnitt\nBewässerung'
        }
      ],
      bilder: [
        { src: 'foto_hecke1.jpg', alt: 'Hecke 1' },
        { src: 'foto_hecke2.jpg', alt: 'Hecke 2' }
      ],
      services: [
        {
          type: 'hecke',
          measures: { length: 15, height: 2.5, depth: 1.8 },
          hedgeAction: 'hedge_schredderschnitt',
          // NEU: Viele Erschwerungen
          erschwerungen: [
            {
              type: 'zaun_hecke',
              meter: 6
            },
            {
              type: 'schuppen',
              meter: 4
            },
            {
              type: 'plane',
              meter: 9
            },
            {
              type: 'sonstiges',
              meter: 3,
              beschreibung: 'Sehr enge Stelle zwischen Gartenhaus und Mauer'
            }
          ],
          // NEU: Alle drei Hecken-Rabatt Cards demonstrieren - Verschiedene Szenarien
          hedgeDiscounts: {
            rueckseite: true,  // Rückseitenrabatt aktiv
            entsorgung: 'liegenlassen'  // Kunde entsorgt selbst (30%)
          },
          sollZeit: '3:30',
          preis: 180.00
        },
        {
          type: 'rasen',
          measure: 800,
          sollZeit: '1:00',
          preis: 100.00
        }
      ]
    },

    '2024-03-25': {
      displayDate: '25.03.2024',
      preis: 245.00,
      geplant: '3:15',
      tatsaechlich: '3:05',
      istZeitStatus: 'on-time',
      mitarbeiter: ['Durau Josh', 'Mueller Tim'],
      startzeit: '09:30',
      endzeit: '12:35',
      arbeiten: [
        {
          type: 'baum',
          description: '6 Meter hoch\n4 Meter breit\nFormschnitt'
        },
        {
          type: 'konifere',
          description: '3,5 Meter hoch\nRückschnitt auf 1,8m'
        }
      ],
      bilder: [
        { src: 'foto_hecke1.jpg', alt: 'Baum vorher' },
        { src: 'foto_hecke2.jpg', alt: 'Baum nachher' },
        { src: 'foto_hecke1.jpg', alt: 'Konifere vorher' },
        { src: 'foto_hecke2.jpg', alt: 'Konifere nachher' }
      ],
      services: [
        {
          type: 'baum',
          measures: { height: 6, width: 4 },
          action: 'formschnitt',
          sollZeit: '2:00',
          preis: 155.00,
          adjustments: {
            basePrice: 145.00,
            discount: 0.00,
            surcharge: 10.00,
            reasoning: 'Aufpreis für großen Baum - Spezialgerät erforderlich'
          }
        },
        {
          type: 'konifere',
          measures: { height: 3.5, width: 2.2 },
          action: 'rueckschnitt',
          zielhoehe: 1.8,
          sollZeit: '1:15',
          preis: 90.00
        }
      ]
    },

    // Termin für Maria Mustermann mit allen Hecken-Action-Typen UND verschiedenen Erschwerungen
    '2024-07-08': {
      displayDate: '08.07.2024',
      preis: 395.00,
      geplant: '6:00',
      tatsaechlich: '5:45',
      istZeitStatus: 'on-time',
      mitarbeiter: ['Micha Wolf', 'Pulat Hakan', 'Durau Josh'],
      startzeit: '07:00',
      endzeit: '12:45',
      arbeiten: [
        {
          type: 'hecke',
          description: 'Formschnitt: 8 m\nlang x 1,8 m hoch'
        },
        {
          type: 'hecke',
          description: 'Schredderschnitt: 12 m\nlang x 3,2 m hoch'
        },
        {
          type: 'hecke',
          description: 'Verjüngung: 6 m\nlang x 4 m hoch'
        }
      ],
      bilder: [
        { src: 'foto_hecke1.jpg', alt: 'Hecke Formschnitt' },
        { src: 'foto_hecke2.jpg', alt: 'Hecke Schredderschnitt' },
        { src: 'foto_hecke1.jpg', alt: 'Hecke Verjüngung' }
      ],
      services: [
        {
          type: 'hecke',
          measures: { length: 8, height: 1.8, depth: 1.0 },
          hedgeAction: 'hedge_formschnitt',
          // Keine Erschwerungen bei diesem Formschnitt
          // NEU: Keine Rabatte bei diesem Service
          hedgeDiscounts: {
            rueckseite: false,  // Kein Rückseitenrabatt
            entsorgung: null    // Keine Entsorgungsrabatte
          },
          sollZeit: '1:30',
          preis: 120.00
        },
        {
          type: 'hecke',
          measures: { length: 12, height: 3.2, depth: 1.5 },
          hedgeAction: 'hedge_schredderschnitt',
          // NEU: Mittlere Erschwerungen
          erschwerungen: [
            {
              type: 'pool',
              meter: 7
            },
            {
              type: 'plane',
              meter: 12
            }
          ],
          // NEU: Nur Entsorgungsrabatt (Biotonne), kein Rückseitenrabatt
          hedgeDiscounts: {
            rueckseite: false,     // Kein Rückseitenrabatt
            entsorgung: 'biotonne' // Wir entsorgen (10%)
          },
          sollZeit: '2:30',
          preis: 155.00,
          adjustments: {
            basePrice: 140.00,
            discount: 0.00,
            surcharge: 15.00,
            reasoning: 'Schredderschnitt bei starkem Bewuchs - Spezialgerät erforderlich'
          }
        },
        {
          type: 'hecke',
          measures: { length: 6, height: 4.0, depth: 2.0 },
          hedgeAction: 'hedge_verjuengung',
          // NEU: Alle Arten von Erschwerungen als Demo
          erschwerungen: [
            {
              type: 'zaun_hecke',
              meter: 4
            },
            {
              type: 'beet',
              meter: 2
            },
            {
              type: 'nachbarn',
              anzahl: 1
            },
            {
              type: 'podest',
              meter: 6
            },
            {
              type: 'sonstiges',
              meter: 2,
              beschreibung: 'Stromkabel müssen vorsichtig umgangen werden'
            }
          ],
          // NEU: Nur eine Entsorgungsrabatt-Card demonstrieren - Ohne Rückseitenrabatt
          hedgeDiscounts: {
            rueckseite: false,  // Kein Rückseitenrabatt
            entsorgung: 'liegenlassen'  // Nur Entsorgungsrabatt (30%)
          },
          sollZeit: '2:00',
          preis: 120.00,
          adjustments: {
            basePrice: 100.00,
            discount: 0.00,
            surcharge: 20.00,
            reasoning: 'Verjüngungsschnitt über 3m Höhe - erhöhter Aufwand'
          }
        }
      ]
    }
  };
}

export function getOrderDetailMockData(date) {
  const data = getAllOrderDetailData();
  return data[date] || null;
}

export function generateCustomerNumber() {
  return 'KNR-' + Math.floor(Math.random() * 90000 + 10000);
}

export { formatPrice };