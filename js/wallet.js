// Inicializar valores por defecto en el almacenamiento local
if (!localStorage.getItem('balance')) {
  localStorage.setItem('balance', '5000.00'); // Saldo inicial
}

if (!localStorage.getItem('transactions')) {
  const initialTransactions = [
    { type: 'Depósito', amount: 5000, date: '2026-07-20', detail: 'Carga inicial' }
  ];
  localStorage.setItem('transactions', JSON.stringify(initialTransactions));
}

// Función global para obtener el saldo
function getBalance() {
  return parseFloat(localStorage.getItem('balance')).toFixed(2);
}

// Función global para actualizar el saldo
function updateBalance(newBalance) {
  localStorage.setItem('balance', newBalance);
}

// Actualizar la vista del saldo si existe el elemento en la pantalla activa
$(document).ready(function() {
  if ($('#currentBalance').length) {
    $('#currentBalance').text(getBalance());
  }
});