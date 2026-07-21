// Funciones de ayuda para obtener y actualizar saldo en localStorage
function getBalance() {
  return localStorage.getItem('walletBalance') || '5000.00';
}

function updateBalance(newBalance) {
  localStorage.setItem('walletBalance', newBalance);
}

$(document).ready(function () {
  // Cargar saldo actual al iniciar cualquier página que tenga la vista de saldo
  if ($('#currentBalance').length) {
    $('#currentBalance').text(getBalance());
  }

  // 1. Manejo de Inicio de Sesión (login.html)
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();

    const validEmail = 'admin@alkewallet.com';
    const validPassword = 'alkewallet2026';

    if (email === validEmail && password === validPassword) {
      $('#loginAlert').addClass('d-none');
      window.location.href = 'menu.html';
    } else {
      $('#loginAlert')
        .text('Correo o contraseña incorrectos. Usa usuario@correo.com / 123456')
        .removeClass('d-none');
    }
  });

  // 2. Manejo de Depósitos (deposit.html)
  $('#depositForm').on('submit', function (e) {
    e.preventDefault();
    const amountInput = $('#depositAmount');
    const amount = parseFloat(amountInput.val());
    const alertDiv = $('#depositAlert');

    if (!isNaN(amount) && amount > 0) {
      let currentBalance = parseFloat(getBalance());
      let newBalance = currentBalance + amount;
      updateBalance(newBalance.toFixed(2));

      // Registrar la transacción
      let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const newTransaction = {
        type: 'Depósito',
        detail: 'Abono en cuenta',
        date: new Date().toLocaleDateString('es-ES'),
        amount: amount
      };
      transactions.unshift(newTransaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      // Actualizar vista
      $('#currentBalance').text(getBalance());
      amountInput.val('');
      alertDiv
        .removeClass('d-none alert-danger')
        .addClass('alert-success')
        .text(`¡Depósito realizado con éxito! Nuevo saldo: $${getBalance()}`);
    } else {
      alertDiv
        .removeClass('d-none alert-success')
        .addClass('alert-danger')
        .text('Ingresa un monto válido.');
    }
  });

  // 3. Manejo de Envío de Dinero (sendmoney.html)
  $('#sendMoneyForm').on('submit', function (e) {
    e.preventDefault();
    const contact = $('#contactSearch').val().trim();
    const amountInput = $('#sendAmount');
    const amount = parseFloat(amountInput.val());
    const alertDiv = $('#sendAlert');
    let currentBalance = parseFloat(getBalance());

    if (!contact) {
      alertDiv
        .removeClass('d-none alert-success')
        .addClass('alert-danger')
        .text('Selecciona o escribe un contacto.');
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alertDiv
        .removeClass('d-none alert-success')
        .addClass('alert-danger')
        .text('Ingresa un monto válido.');
      return;
    }

    if (amount > currentBalance) {
      alertDiv
        .removeClass('d-none alert-success')
        .addClass('alert-danger')
        .text('Saldo insuficiente para realizar la transferencia.');
      return;
    }

    // Realizar la transferencia
    let newBalance = currentBalance - amount;
    updateBalance(newBalance.toFixed(2));

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const newTransaction = {
      type: 'Transferencia',
      detail: `Envío a ${contact}`,
      date: new Date().toLocaleDateString('es-ES'),
      amount: -amount
    };
    transactions.unshift(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Actualizar vista
    $('#currentBalance').text(getBalance());
    $('#contactSearch').val('');
    amountInput.val('');
    alertDiv
      .removeClass('d-none alert-danger')
      .addClass('alert-success')
      .text(`¡Transferencia enviada a ${contact}! Nuevo saldo: $${getBalance()}`);
  });

  // 4. Cargar Historial de Movimientos (transactions.html)
  if ($('#transactionList').length) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const listBody = $('#transactionList');

    if (transactions.length === 0) {
      listBody.html('<tr><td colspan="4" class="text-center text-muted">No hay movimientos registrados.</td></tr>');
    } else {
      let rows = '';
      transactions.forEach(function (tx) {
        const isPositive = tx.amount > 0;
        const amountClass = isPositive ? 'text-success font-weight-bold' : 'text-danger font-weight-bold';
        const formattedAmount = (isPositive ? '+$' : '-$') + Math.abs(tx.amount).toFixed(2);

        rows += `
          <tr>
            <td><span class="badge ${isPositive ? 'bg-success' : 'bg-danger'}">${tx.type}</span></td>
            <td>${tx.detail}</td>
            <td>${tx.date}</td>
            <td class="text-end ${amountClass}">${formattedAmount}</td>
          </tr>
        `;
      });
      listBody.html(rows);
    }
  }
});