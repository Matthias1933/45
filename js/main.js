// main.js - FUNKTIONSFÄHIGE VERSION: Ohne externe Module

import {
  toggleSidebar,
  openCustomerModal,
  closeCustomerModal,
  switchTab,
  showConfirmationDialog,
  openImage,
  showNotification,
  updateFooterYear,
  cancelDiscard,
  confirmDiscard,
  toggleRechnungsadresse,
  saveCustomer,
  expandImages,
  takeOrderData,
  editCustomer
} from './ui.js';

import { 
  openCustomerDetail, 
  closeCustomerDetail, 
  loadCustomerDetailData, 
  initCustomerCards 
} from './customerView.js';

import { 
  openOrderDetail, 
  closeOrderDetail, 
  loadOrderDetailData 
} from './orderView.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Kundenverwaltung App wird geladen...');
  
  try {
    // Footer-Jahr aktualisieren
    updateFooterYear();
    
    // Event Listeners registrieren
    document.getElementById('btn-toggle-sidebar')?.addEventListener('click', toggleSidebar);
    document.getElementById('btn-open-customer-modal')?.addEventListener('click', openCustomerModal);
    document.getElementById('btn-close-customer-modal')?.addEventListener('click', closeCustomerModal);
    document.getElementById('btn-cancel-modal')?.addEventListener('click', closeCustomerModal);
    document.getElementById('btn-save-customer')?.addEventListener('click', saveCustomer);
    document.getElementById('btn-cancel-discard')?.addEventListener('click', cancelDiscard);
    document.getElementById('btn-confirm-discard')?.addEventListener('click', confirmDiscard);
    document.getElementById('btn-tab-einsatzort')?.addEventListener('click', () => switchTab('einsatzort'));
    document.getElementById('btn-tab-rechnungsadresse')?.addEventListener('click', () => switchTab('rechnungsadresse'));
    document.getElementById('btn-tab-notizen')?.addEventListener('click', () => switchTab('notizen'));
    document.getElementById('btn-tab-dateien')?.addEventListener('click', () => switchTab('dateien'));
    document.getElementById('btn-tab-status')?.addEventListener('click', () => switchTab('status'));
    document.getElementById('sameAsEinsatzort')?.addEventListener('change', toggleRechnungsadresse);
    
    // Kundenkarten initialisieren
    initCustomerCards();
    
    console.log('✅ App erfolgreich geladen!');
    
  } catch (error) {
    console.error('❌ Fehler beim Laden der App:', error);
    showNotification('Fehler beim Laden der Anwendung', 'error');
  }
});

export {
  toggleSidebar,
  openCustomerModal,
  closeCustomerModal,
  switchTab,
  showConfirmationDialog,
  openImage,
  showNotification,
  updateFooterYear,
  cancelDiscard,
  confirmDiscard,
  toggleRechnungsadresse,
  saveCustomer,
  expandImages,
  takeOrderData,
  editCustomer,
  openCustomerDetail,
  closeCustomerDetail,
  loadCustomerDetailData,
  initCustomerCards,
  openOrderDetail,
  closeOrderDetail,
  loadOrderDetailData
};