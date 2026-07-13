// JTC Platform - Interactive Core Application Script

// Global Application State (Re-initialized from localStorage)
let state = {
  products: [],
  customers: [],
  orders: [],
  invoices: [],
  agents: [],
  collections: [],
  syncLogs: [],
  
  // Navigation State
  activePlatform: 'admin', // 'admin', 'customer', 'agent', 'specs'
  adminTab: 'dashboard',
  customerScreen: 'welcome', // welcome, login, register, home, categories, listing, details, cart, confirmation, dispatch, invoices, payments, profile
  agentScreen: 'login', // login, home, collection_form, success, leaderboard, history
  
  // Interaction State
  customerUser: {
    code: "JTCDE0245",
    name: "Sharma Electricals",
    creditLimit: 500000,
    outstanding: 124560,
    city: "Kanpur"
  },
  agentUser: null, // set on login
  customerCart: [],
  selectedCategory: 'Wires & Cables',
  selectedProductId: null,
  selectedOrderId: null,
  selectedInvoiceNo: null,
  activeCollectionFirm: null, // firm object currently collecting for
  
  // Notifications
  notifications: [
    { title: "New Order Booked", desc: "Order JTCORD2405132 confirmed via Customer App.", time: "10m ago", read: false },
    { title: "Payment Cleared", desc: "Gupta Enterprises paid ₹24,560 via UPI.", time: "1h ago", read: true }
  ]
};

// UI Elements & State Synchronizer
function initApp() {
  // Load data from mock database
  state.products = Database.getProducts();
  state.customers = Database.getCustomers();
  state.orders = Database.getOrders();
  state.invoices = Database.getInvoices();
  state.agents = Database.getAgents();
  state.collections = Database.getCollections();
  state.syncLogs = Database.getSyncLogs();
  
  // Setup Platform Switcher listeners
  document.querySelectorAll('.platform-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plat = e.currentTarget.dataset.platform;
      switchPlatform(plat);
    });
  });

  // Render initial platform view
  renderCurrentPlatform();
  showToast("Application Initialized & Synchronized with ERP Database");
}

function saveState() {
  Database.saveProducts(state.products);
  Database.saveCustomers(state.customers);
  Database.saveOrders(state.orders);
  Database.saveInvoices(state.invoices);
  Database.saveAgents(state.agents);
  Database.saveCollections(state.collections);
  Database.saveSyncLogs(state.syncLogs);
}

function switchPlatform(platform) {
  state.activePlatform = platform;
  
  // Update switcher buttons UI
  document.querySelectorAll('.platform-btn').forEach(btn => {
    if(btn.dataset.platform === platform) {
      btn.classList.add('bg-white', 'text-blue-900', 'shadow-sm');
      btn.classList.remove('text-white', 'hover:bg-blue-800');
    } else {
      btn.classList.remove('bg-white', 'text-blue-900', 'shadow-sm');
      btn.classList.add('text-white', 'hover:bg-blue-800');
    }
  });

  renderCurrentPlatform();
  showToast(`Switched view to: ${platform.toUpperCase()}`);
}

function renderCurrentPlatform() {
  // Hide all main containers
  document.getElementById('admin-container').style.display = 'none';
  document.getElementById('customer-container').style.display = 'none';
  document.getElementById('agent-container').style.display = 'none';
  document.getElementById('specs-container').style.display = 'none';

  if (state.activePlatform === 'admin') {
    document.getElementById('admin-container').style.display = 'flex';
    renderAdminDashboard();
  } else if (state.activePlatform === 'customer') {
    document.getElementById('customer-container').style.display = 'flex';
    renderCustomerApp();
  } else if (state.activePlatform === 'agent') {
    document.getElementById('agent-container').style.display = 'flex';
    renderAgentApp();
  } else if (state.activePlatform === 'specs') {
    document.getElementById('specs-container').style.display = 'block';
  }
}

// ----------------------------------------------------
// TOAST NOTIFICATIONS
// ----------------------------------------------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 p-4 rounded-xl text-white font-medium shadow-lg transform transition-all duration-300 translate-y-4 opacity-0`;
  
  let bg = 'bg-blue-600';
  let icon = 'info';
  if(type === 'success') { bg = 'bg-emerald-600'; icon = 'check_circle'; }
  if(type === 'error') { bg = 'bg-rose-600'; icon = 'error'; }
  if(type === 'warning') { bg = 'bg-amber-500'; icon = 'warning'; }

  toast.className += ` ${bg}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined">${icon}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  }, 50);

  // Remove toast
  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ----------------------------------------------------
// ADMIN DASHBOARD MODULE
// ----------------------------------------------------
function switchAdminTab(tab) {
  state.adminTab = tab;
  renderAdminDashboard();
}

function renderAdminDashboard() {
  // Update sidebar active link UI
  const menuItems = document.querySelectorAll('.admin-menu-item');
  menuItems.forEach(item => {
    if(item.dataset.tab === state.adminTab) {
      item.classList.add('bg-blue-800', 'text-white');
      item.classList.remove('text-slate-300', 'hover:bg-slate-800');
    } else {
      item.classList.remove('bg-blue-800', 'text-white');
      item.classList.add('text-slate-300', 'hover:bg-slate-800');
    }
  });

  // Hide all admin tab panes
  document.querySelectorAll('.admin-tab-pane').forEach(pane => {
    pane.style.display = 'none';
  });

  // Show selected pane
  const activePane = document.getElementById(`admin-pane-${state.adminTab}`);
  if(activePane) {
    activePane.style.display = 'block';
  }

  // Populate data depending on tab
  if (state.adminTab === 'dashboard') {
    populateAdminDashboardHome();
  } else if (state.adminTab === 'customers') {
    populateAdminCustomers();
  } else if (state.adminTab === 'orders') {
    populateAdminOrders();
  } else if (state.adminTab === 'products') {
    populateAdminProducts();
  } else if (state.adminTab === 'invoices') {
    populateAdminInvoices();
  } else if (state.adminTab === 'agents') {
    populateAdminAgents();
  } else if (state.adminTab === 'collections') {
    populateAdminCollections();
  } else if (state.adminTab === 'erp-sync') {
    populateAdminERPSync();
  }
}

// Sub-populators
function populateAdminDashboardHome() {
  // Compute metrics
  const totalOrders = state.orders.length;
  const totalSales = state.orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.amount : sum, 0);
  const totalCustomers = state.customers.length;
  const totalOutstanding = state.customers.reduce((sum, c) => sum + c.outstanding, 0);
  const pendingOrders = state.orders.filter(o => o.status === 'Pending').length;
  const pendingInvoices = state.invoices.filter(i => i.status === 'Unpaid').length;
  const totalCollections = state.collections.reduce((sum, c) => c.status === 'Cleared' ? sum + c.amount : sum, 0);
  const activeAgents = state.agents.filter(a => a.status === 'Active').length;

  document.getElementById('stat-orders').innerText = totalOrders;
  document.getElementById('stat-sales').innerText = `₹${totalSales.toLocaleString('en-IN')}`;
  document.getElementById('stat-customers').innerText = totalCustomers;
  document.getElementById('stat-outstanding').innerText = `₹${totalOutstanding.toLocaleString('en-IN')}`;
  document.getElementById('stat-pending-orders').innerText = pendingOrders;
  document.getElementById('stat-pending-invoices').innerText = pendingInvoices;
  document.getElementById('stat-collections-due').innerText = `₹${totalOutstanding.toLocaleString('en-IN')}`;
  document.getElementById('stat-active-agents').innerText = activeAgents;

  // Initialize charts (Chart.js wrapper checks if canvas exists)
  setTimeout(initDashboardCharts, 100);
}

let salesChart, categoryChart;
function initDashboardCharts() {
  const salesCtx = document.getElementById('salesOverviewChart');
  const catCtx = document.getElementById('topCategoriesChart');

  if (salesCtx) {
    if (salesChart) salesChart.destroy();
    salesChart = new Chart(salesCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'This Week (₹)',
            data: [120000, 245000, 187500, 312000, 428000, 156000, 254300],
            borderColor: '#0D47A1',
            backgroundColor: 'rgba(13, 71, 161, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3
          },
          {
            label: 'Last Week (₹)',
            data: [95000, 180000, 220000, 290000, 310000, 110000, 190000],
            borderColor: '#FF9800',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'bottom' } },
        scales: { y: { grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
      }
    });
  }

  if (catCtx) {
    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(catCtx, {
      type: 'doughnut',
      data: {
        labels: ['Wires & Cables', 'Electrical', 'Pumps', 'Solar Solutions', 'Fans', 'Switchgears'],
        datasets: [{
          data: [35, 25, 15, 10, 10, 5],
          backgroundColor: ['#0D47A1', '#1565C0', '#0288D1', '#FF9800', '#FB8C00', '#F9A825'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } },
        cutout: '65%'
      }
    });
  }
}

function populateAdminCustomers() {
  const tbody = document.getElementById('admin-customers-tbody');
  tbody.innerHTML = '';
  state.customers.forEach(cust => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-poppins font-medium">${cust.name}</td>
      <td class="font-mono">${cust.phone}</td>
      <td>${cust.email}</td>
      <td>${cust.city}</td>
      <td class="font-mono text-right font-medium text-slate-800">₹${cust.outstanding.toLocaleString('en-IN')}</td>
      <td><span class="status-chip ${cust.status === 'Active' ? 'status-delivered' : 'status-cancelled'}">${cust.status}</span></td>
      <td>
        <button class="text-blue-700 hover:text-blue-900 font-medium" onclick="viewCustomerLedger('${cust.code}')">View Ledger</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function populateAdminOrders() {
  const tbody = document.getElementById('admin-orders-tbody');
  tbody.innerHTML = '';
  state.orders.forEach(order => {
    const tr = document.createElement('tr');
    
    let statusClass = 'status-pending';
    if(order.status === 'Confirmed') statusClass = 'status-confirmed';
    if(order.status === 'Packed') statusClass = 'status-packed';
    if(order.status === 'Dispatched') statusClass = 'status-dispatched';
    if(order.status === 'Delivered') statusClass = 'status-delivered';
    if(order.status === 'Cancelled') statusClass = 'status-cancelled';
    if(order.status === 'Invoice Generated') statusClass = 'status-confirmed';
    
    let payClass = order.paymentStatus === 'Paid' ? 'status-paid' : 'status-unpaid';
    
    tr.innerHTML = `
      <td class="font-mono font-semibold">${order.id}</td>
      <td class="font-poppins">${order.customer}</td>
      <td class="text-xs text-slate-500">${order.date}</td>
      <td class="font-mono font-medium">₹${order.amount.toLocaleString('en-IN')}</td>
      <td><span class="status-chip ${statusClass}">${order.status}</span></td>
      <td><span class="status-chip ${payClass}">${order.paymentStatus}</span></td>
      <td class="flex gap-2">
        <button class="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded text-slate-700" onclick="viewOrderDetailsAdmin('${order.id}')">View</button>
        ${order.status === 'Confirmed' ? `<button class="px-3 py-1 text-xs font-semibold bg-purple-100 hover:bg-purple-200 text-purple-700 rounded" onclick="updateOrderStatus('${order.id}', 'Packed')">Pack</button>` : ''}
        ${order.status === 'Packed' ? `<button class="px-3 py-1 text-xs font-semibold bg-teal-100 hover:bg-teal-200 text-teal-700 rounded" onclick="updateOrderStatus('${order.id}', 'Dispatched')">Dispatch</button>` : ''}
        ${order.status === 'Dispatched' ? `<button class="px-3 py-1 text-xs font-semibold bg-green-100 hover:bg-green-200 text-green-700 rounded" onclick="updateOrderStatus('${order.id}', 'Delivered')">Deliver</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function viewOrderDetailsAdmin(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if(!order) return;
  state.selectedOrderId = orderId;
  
  // Show details panel overlay
  const panel = document.getElementById('admin-order-detail-panel');
  panel.classList.remove('hidden');
  
  document.getElementById('admin-detail-order-id').innerText = order.id;
  document.getElementById('admin-detail-cust').innerText = order.customer;
  document.getElementById('admin-detail-date').innerText = order.date;
  document.getElementById('admin-detail-remarks').innerText = order.remarks || 'None';
  document.getElementById('admin-detail-total').innerText = `₹${order.amount.toLocaleString('en-IN')}`;

  const itemsContainer = document.getElementById('admin-detail-items');
  itemsContainer.innerHTML = '';
  order.items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'flex justify-between py-2 border-b border-slate-100 text-sm';
    div.innerHTML = `
      <span class="font-medium text-slate-700">${item.name} <span class="text-xs text-slate-400">x${item.qty}</span></span>
      <span class="font-mono text-slate-600">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
    `;
    itemsContainer.appendChild(div);
  });

  const timelineContainer = document.getElementById('admin-detail-timeline');
  timelineContainer.innerHTML = '';
  order.timeline.forEach(tl => {
    const div = document.createElement('div');
    div.className = 'relative pl-6 pb-4 border-l border-blue-200 last:border-0';
    div.innerHTML = `
      <div class="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
      <div class="text-xs font-semibold text-slate-800">${tl.title}</div>
      <div class="text-[10px] text-slate-400 font-mono">${tl.time}</div>
      <div class="text-xs text-slate-500 mt-0.5">${tl.desc}</div>
    `;
    timelineContainer.appendChild(div);
  });
}

function closeOrderDetailsAdmin() {
  document.getElementById('admin-order-detail-panel').classList.add('hidden');
}

function updateOrderStatus(orderId, newStatus) {
  const order = state.orders.find(o => o.id === orderId);
  if(!order) return;
  order.status = newStatus;
  
  // Format Date-Time
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) + `, ${now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}`;
  
  order.timeline.push({
    title: `Order ${newStatus}`,
    time: dateStr,
    desc: `Status updated to ${newStatus} in admin console.`
  });

  // Sync back to invoice if delivered
  if(newStatus === 'Delivered') {
    order.paymentStatus = 'Paid';
    // Update matching invoice
    const inv = state.invoices.find(i => i.orderId === orderId);
    if(inv) inv.status = 'Paid';
  }

  saveState();
  populateAdminOrders();
  closeOrderDetailsAdmin();
  showToast(`Order ${orderId} updated to ${newStatus}`, 'success');
}

function populateAdminProducts() {
  const tbody = document.getElementById('admin-products-tbody');
  tbody.innerHTML = '';
  state.products.forEach(prod => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-semibold text-slate-700">${prod.name}</td>
      <td>${prod.category}</td>
      <td>${prod.brand}</td>
      <td class="font-mono text-xs">${prod.sku}</td>
      <td class="font-mono">₹${prod.price.toLocaleString('en-IN')}</td>
      <td class="font-mono text-center">${prod.stock}</td>
      <td><span class="status-chip ${prod.stock > 10 ? 'status-delivered' : 'status-pending'}">${prod.stock > 10 ? 'In Stock' : 'Low Stock'}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function populateAdminInvoices() {
  const tbody = document.getElementById('admin-invoices-tbody');
  tbody.innerHTML = '';
  state.invoices.forEach(inv => {
    const tr = document.createElement('tr');
    let statusClass = 'status-unpaid';
    if(inv.status === 'Paid') statusClass = 'status-delivered';
    if(inv.status === 'Overdue') statusClass = 'status-cancelled';

    tr.innerHTML = `
      <td class="font-mono font-semibold">${inv.invoiceNo}</td>
      <td class="font-mono text-xs text-slate-500">${inv.orderId}</td>
      <td class="font-poppins">${inv.customer}</td>
      <td class="text-xs text-slate-500">${inv.date}</td>
      <td class="font-mono font-medium">₹${inv.amount.toLocaleString('en-IN')}</td>
      <td><span class="status-chip ${statusClass}">${inv.status}</span></td>
      <td>
        <button class="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded" onclick="simulateInvoicePDF('${inv.invoiceNo}')">PDF</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function populateAdminAgents() {
  const tbody = document.getElementById('admin-agents-tbody');
  tbody.innerHTML = '';
  state.agents.forEach(agt => {
    const tr = document.createElement('tr');
    const completionPercent = Math.round((agt.collected / agt.target) * 100);
    tr.innerHTML = `
      <td class="flex items-center gap-3">
        <img class="w-8 h-8 rounded-full object-cover shadow-sm" src="${agt.avatarUrl}" alt="${agt.name}"/>
        <span class="font-poppins font-medium text-slate-800">${agt.name}</span>
      </td>
      <td class="font-mono text-sm">${agt.phone}</td>
      <td>${agt.area}</td>
      <td class="font-mono text-right text-rose-700">₹${agt.pending.toLocaleString('en-IN')}</td>
      <td class="font-mono text-right text-emerald-700">₹${agt.collected.toLocaleString('en-IN')}</td>
      <td>
        <div class="flex items-center gap-2">
          <div class="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-blue-600 h-full rounded-full" style="width: ${Math.min(completionPercent, 100)}%"></div>
          </div>
          <span class="text-xs font-semibold font-mono">${completionPercent}%</span>
        </div>
      </td>
      <td><span class="status-chip ${agt.status === 'Active' ? 'status-delivered' : 'status-cancelled'}">${agt.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function populateAdminCollections() {
  const tbody = document.getElementById('admin-collections-tbody');
  tbody.innerHTML = '';
  state.collections.forEach(col => {
    const tr = document.createElement('tr');
    let statusClass = col.status === 'Cleared' ? 'status-delivered' : 'status-pending';
    
    tr.innerHTML = `
      <td class="font-mono font-semibold">${col.id}</td>
      <td class="font-poppins">${col.agent}</td>
      <td class="font-poppins font-medium">${col.customer}</td>
      <td class="font-mono font-semibold text-slate-800">₹${col.amount.toLocaleString('en-IN')}</td>
      <td class="text-xs text-slate-500">${col.date}</td>
      <td><span class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold font-poppins">${col.mode}</span></td>
      <td class="font-mono text-xs text-slate-400">${col.reference}</td>
      <td><span class="status-chip ${statusClass}">${col.status}</span></td>
      <td>
        ${col.status === 'Pending Verification' ? `<button class="px-3 py-1 text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded" onclick="verifyCollection('${col.id}')">Verify</button>` : `<span class="text-xs text-emerald-600 font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-sm">verified</span> Verified</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function verifyCollection(colId) {
  const col = state.collections.find(c => c.id === colId);
  if(!col) return;
  col.status = 'Cleared';
  
  // Deduct outstanding from dealer
  const dealer = state.customers.find(c => c.name === col.customer);
  if(dealer) {
    dealer.outstanding = Math.max(0, dealer.outstanding - col.amount);
  }
  
  // Add collected amount to agent totals
  const agent = state.agents.find(a => a.name === col.agent);
  if(agent) {
    agent.collected += col.amount;
    agent.pending = Math.max(0, agent.pending - col.amount);
  }

  saveState();
  populateAdminCollections();
  showToast(`Collection receipt ${colId} verified and updated in ERP ledger`, 'success');
}

function populateAdminERPSync() {
  const logsContainer = document.getElementById('erp-sync-logs-list');
  logsContainer.innerHTML = '';
  state.syncLogs.forEach(log => {
    const div = document.createElement('div');
    div.className = 'flex gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl mb-2 text-sm';
    
    let colorClass = 'text-blue-600 bg-blue-50';
    let icon = 'sync';
    if(log.type === 'Success') { colorClass = 'text-green-600 bg-green-50'; icon = 'check_circle'; }
    if(log.type === 'Warning') { colorClass = 'text-amber-600 bg-amber-50'; icon = 'warning'; }
    
    div.innerHTML = `
      <div class="w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}">
        <span class="material-symbols-outlined text-xl">${icon}</span>
      </div>
      <div class="flex-1">
        <div class="flex justify-between items-center">
          <span class="font-semibold text-slate-800">${log.event}</span>
          <span class="text-xs font-mono text-slate-400">${log.time}</span>
        </div>
        <div class="text-xs text-slate-500 mt-0.5">${log.details}</div>
      </div>
    `;
    logsContainer.appendChild(div);
  });
}

function triggerManualERPSync() {
  const syncBtn = document.getElementById('btn-manual-sync');
  syncBtn.disabled = true;
  syncBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm">sync</span> Syncing ERP...`;
  
  setTimeout(() => {
    // Add sync log
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    state.syncLogs.unshift({
      time: timeStr,
      event: "Manual Sync Triggered",
      type: "Success",
      details: "Accounts, Invoices, and Inventory tables synchronized successfully with SAP ERP."
    });

    saveState();
    populateAdminERPSync();
    
    syncBtn.disabled = false;
    syncBtn.innerHTML = `<span class="material-symbols-outlined text-sm">sync</span> Sync Now`;
    showToast("ERP Re-Synchronization Complete!", "success");
  }, 2000);
}

function simulateInvoicePDF(invoiceNo) {
  const inv = state.invoices.find(i => i.invoiceNo === invoiceNo);
  if(!inv) return;

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative animate-fade-in">
      <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-600" onclick="this.closest('.fixed').remove()">
        <span class="material-symbols-outlined">close</span>
      </button>
      <div class="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
        <div>
          <div class="text-xs font-bold text-blue-900 tracking-wider uppercase">Jain Trading Corporation</div>
          <div class="text-xs text-slate-500 mt-1">B2B Distribution Network</div>
        </div>
        <div class="text-right">
          <div class="text-lg font-bold text-slate-800">INVOICE</div>
          <div class="text-sm font-mono text-slate-500 font-semibold">${inv.invoiceNo}</div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4 text-xs mb-6">
        <div>
          <span class="text-slate-400 block uppercase tracking-wider font-bold">Billed To</span>
          <strong class="text-slate-800 text-sm block mt-1">${inv.customer}</strong>
          <span class="text-slate-500 mt-0.5 block">Dealer Code: ${inv.customerCode}</span>
        </div>
        <div class="text-right">
          <span class="text-slate-400 block uppercase tracking-wider font-bold">Details</span>
          <span class="text-slate-800 block mt-1"><strong>Invoice Date:</strong> ${inv.date}</span>
          <span class="text-slate-800"><strong>Order Ref:</strong> ${inv.orderId}</span>
        </div>
      </div>
      
      <table class="w-full text-xs text-left mb-6">
        <thead>
          <tr class="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
            <th class="py-2.5 px-3">Item Description</th>
            <th class="py-2.5 px-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-3 px-3">Electrical Distribution Products & Cables Bulk Order</td>
            <td class="py-3 px-3 text-right font-mono font-semibold">₹${inv.amount.toLocaleString('en-IN')}</td>
          </tr>
          <tr class="border-t border-slate-100">
            <td class="py-3 px-3 text-right font-bold text-slate-600">Subtotal</td>
            <td class="py-3 px-3 text-right font-mono font-semibold">₹${(inv.amount / 1.18).toFixed(2)}</td>
          </tr>
          <tr>
            <td class="py-3 px-3 text-right font-bold text-slate-600">GST (18%)</td>
            <td class="py-3 px-3 text-right font-mono font-semibold">₹${(inv.amount - (inv.amount / 1.18)).toFixed(2)}</td>
          </tr>
          <tr class="border-t-2 border-slate-200">
            <td class="py-3 px-3 text-right font-bold text-slate-800 text-sm">Grand Total (Incl. GST)</td>
            <td class="py-3 px-3 text-right font-mono font-bold text-blue-900 text-sm">₹${inv.amount.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="flex gap-3">
        <button class="flex-1 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-poppins font-medium text-sm transition-all" onclick="showToast('Downloading PDF...', 'success'); this.closest('.fixed').remove()">Download PDF</button>
        <button class="px-5 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm transition-all" onclick="this.closest('.fixed').remove()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// ----------------------------------------------------
// CUSTOMER APP SIMULATOR MODULE
// ----------------------------------------------------
function navigateCustomer(screen) {
  state.customerScreen = screen;
  renderCustomerApp();
}

function renderCustomerApp() {
  const container = document.getElementById('customer-screen-area');
  container.innerHTML = '';

  // Get matching UI view generator
  if(state.customerScreen === 'welcome') {
    container.innerHTML = generateCustomerWelcomeUI();
  } else if (state.customerScreen === 'login') {
    container.innerHTML = generateCustomerLoginUI();
  } else if (state.customerScreen === 'home') {
    container.innerHTML = generateCustomerHomeUI();
  } else if (state.customerScreen === 'categories') {
    container.innerHTML = generateCustomerCategoriesUI();
  } else if (state.customerScreen === 'listing') {
    container.innerHTML = generateCustomerListingUI();
  } else if (state.customerScreen === 'details') {
    container.innerHTML = generateCustomerDetailsUI();
  } else if (state.customerScreen === 'cart') {
    container.innerHTML = generateCustomerCartUI();
  } else if (state.customerScreen === 'confirmation') {
    container.innerHTML = generateCustomerConfirmationUI();
    startBookingCountdown();
  } else if (state.customerScreen === 'invoices') {
    container.innerHTML = generateCustomerInvoicesUI();
  } else if (state.customerScreen === 'dispatch') {
    container.innerHTML = generateCustomerDispatchUI();
  } else if (state.customerScreen === 'profile') {
    container.innerHTML = generateCustomerProfileUI();
  }

  // Render bottom nav if not in login/welcome
  const isNavigable = !['welcome', 'login'].includes(state.customerScreen);
  const bottomNav = document.getElementById('customer-bottom-nav');
  if(bottomNav) {
    bottomNav.style.display = isNavigable ? 'flex' : 'none';
    if(isNavigable) updateCustomerBottomNavHighlight();
  }
}

function updateCustomerBottomNavHighlight() {
  const tabs = document.querySelectorAll('.cust-nav-btn');
  tabs.forEach(tab => {
    const screen = tab.dataset.screen;
    const isActive = (screen === 'home' && state.customerScreen === 'home') ||
                     (screen === 'orders' && ['dispatch', 'confirmation'].includes(state.customerScreen)) ||
                     (screen === 'brands' && ['categories', 'listing', 'details'].includes(state.customerScreen)) ||
                     (screen === 'invoices' && state.customerScreen === 'invoices') ||
                     (screen === 'profile' && state.customerScreen === 'profile');
    if(isActive) {
      tab.classList.add('text-blue-900', 'font-semibold');
      tab.classList.remove('text-slate-400');
    } else {
      tab.classList.remove('text-blue-900', 'font-semibold');
      tab.classList.add('text-slate-400');
    }
  });
}

// UI Creators
function generateCustomerWelcomeUI() {
  return `
    <div class="h-full flex flex-col justify-between py-12 px-6 animate-fade-in text-center">
      <div class="mt-8 flex flex-col items-center">
        <div class="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mb-4 shadow-lg">
          <span class="material-symbols-outlined text-white text-3xl">electric_bolt</span>
        </div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">JAIN TRADING</h1>
        <p class="text-xs font-bold text-blue-900 tracking-widest uppercase">CORPORATION</p>
        <p class="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Industrial & Electrical Distributor</p>
      </div>

      <div class="my-6">
        <img class="w-full max-h-52 object-contain" src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&auto=format&fit=crop&q=60" alt="Illustrative warehouse"/>
      </div>

      <div class="flex flex-col gap-3">
        <h2 class="text-lg font-bold text-slate-700">Enterprise B2B Hub</h2>
        <p class="text-xs text-slate-500 px-4">Book bulk inventory, track logistics timeline, view statements, and manage account payments with SAP ledger sync.</p>
        <button class="btn-primary mt-4" onclick="navigateCustomer('login')">Get Started</button>
      </div>
    </div>
  `;
}

function generateCustomerLoginUI() {
  return `
    <div class="h-full flex flex-col justify-between py-8 px-6 animate-fade-in">
      <div>
        <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mt-2 mb-6" onclick="navigateCustomer('welcome')">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
        </button>
        <h2 class="text-2xl font-bold text-slate-800">Welcome Back!</h2>
        <p class="text-xs text-slate-400 mt-1">Sign in to your dealer/distributor account</p>

        <div class="flex flex-col gap-4 mt-8">
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-2 uppercase">Mobile Number</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">phone_iphone</span>
              <input type="text" class="jtc-input pl-12" id="cust-phone-input" placeholder="+91 98765 43210" value="9876543210"/>
            </div>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-2 uppercase">Security PIN / Password</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
              <input type="password" class="jtc-input pl-12" id="cust-pwd-input" placeholder="••••••" value="123456"/>
            </div>
          </div>
          <div class="flex justify-between items-center text-xs text-slate-500">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked /> Remember account
            </label>
            <a href="#" class="text-blue-900 font-semibold">Forgot Security PIN?</a>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <button class="btn-primary" onclick="loginCustomerSim()">Login Account</button>
        <p class="text-center text-xs text-slate-400">Don't have a dealer account? <a href="#" class="text-blue-900 font-bold">Apply Now</a></p>
      </div>
    </div>
  `;
}

function loginCustomerSim() {
  const phone = document.getElementById('cust-phone-input').value;
  const match = state.customers.find(c => c.phone === phone);
  if(match) {
    state.customerUser = match;
    showToast(`Logged in successfully as ${match.name}`, 'success');
    navigateCustomer('home');
  } else {
    showToast("Invalid credentials or unregistered number", "error");
  }
}

function generateCustomerHomeUI() {
  // Compute outstanding dues
  const dues = state.customerUser.outstanding;
  const limit = state.customerUser.creditLimit;
  const available = limit - dues;
  
  return `
    <div class="animate-fade-in flex flex-col gap-5">
      <!-- App Header -->
      <div class="flex justify-between items-center bg-blue-900 -mx-4 px-4 py-4 pt-10 text-white rounded-b-3xl shadow-md">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span class="material-symbols-outlined text-sm text-white">store</span>
          </div>
          <div>
            <div class="text-[10px] text-blue-200 font-semibold uppercase tracking-wider">JTC Dealer App</div>
            <div class="text-xs font-semibold font-poppins">${state.customerUser.name}</div>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center" onclick="navigateCustomer('invoices')">
            <span class="material-symbols-outlined text-lg">receipt_long</span>
          </button>
          <button class="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center" onclick="showToast('No new alerts.')">
            <span class="material-symbols-outlined text-lg">notifications</span>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <!-- Financial Card -->
      <div class="bg-gradient-to-br from-blue-950 to-blue-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden -mt-2">
        <div class="absolute -right-10 -bottom-10 w-36 h-36 bg-white/5 rounded-full"></div>
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[10px] text-blue-200 block uppercase font-bold tracking-widest">Outstanding Dues</span>
            <strong class="text-2xl font-mono block mt-1">₹${dues.toLocaleString('en-IN')}</strong>
          </div>
          <button class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold rounded-lg text-xs" onclick="navigateCustomer('invoices')">Pay Dues</button>
        </div>
        <div class="border-t border-white/15 my-4"></div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span class="text-blue-200 block text-[10px]">CREDIT LIMIT</span>
            <span class="font-mono font-semibold">₹${limit.toLocaleString('en-IN')}</span>
          </div>
          <div class="text-right">
            <span class="text-blue-200 block text-[10px]">AVAILABLE BALANCE</span>
            <span class="font-mono font-semibold text-emerald-300">₹${available.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div>
        <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div class="grid grid-cols-4 gap-2">
          <button class="bg-white rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 hover:border-blue-300" onclick="navigateCustomer('categories')">
            <span class="material-symbols-outlined text-blue-900 mb-1">shopping_basket</span>
            <span class="text-[10px] font-semibold text-slate-600">Order Stock</span>
          </button>
          <button class="bg-white rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 hover:border-blue-300" onclick="navigateCustomer('invoices')">
            <span class="material-symbols-outlined text-blue-900 mb-1">payments</span>
            <span class="text-[10px] font-semibold text-slate-600">Pay Dues</span>
          </button>
          <button class="bg-white rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100" onclick="navigateCustomer('dispatch')">
            <span class="material-symbols-outlined text-blue-900 mb-1">local_shipping</span>
            <span class="text-[10px] font-semibold text-slate-600">Track Truck</span>
          </button>
          <button class="bg-white rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100" onclick="showToast('B2B schemes downloaded!')">
            <span class="material-symbols-outlined text-blue-900 mb-1">percent</span>
            <span class="text-[10px] font-semibold text-slate-600">Schemes</span>
          </button>
        </div>
      </div>

      <!-- Categories Slider -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider">Top Brands</h3>
          <button class="text-xs text-blue-900 font-bold" onclick="navigateCustomer('categories')">View All</button>
        </div>
        <div class="brand-slider">
          <div class="brand-card cursor-pointer" onclick="selectCategorySim('Wires & Cables')">
            <span class="font-bold text-blue-900 font-poppins">KEI</span>
            <span class="text-[9px] text-slate-400 mt-1">Cables</span>
          </div>
          <div class="brand-card cursor-pointer" onclick="selectCategorySim('Wires & Cables')">
            <span class="font-bold text-blue-900 font-poppins">Polycab</span>
            <span class="text-[9px] text-slate-400 mt-1">Wires</span>
          </div>
          <div class="brand-card cursor-pointer" onclick="selectCategorySim('Fans')">
            <span class="font-bold text-blue-900 font-poppins">Crompton</span>
            <span class="text-[9px] text-slate-400 mt-1">Fans</span>
          </div>
          <div class="brand-card cursor-pointer" onclick="selectCategorySim('Pumps')">
            <span class="font-bold text-blue-900 font-poppins">Kirloskar</span>
            <span class="text-[9px] text-slate-400 mt-1">Pumps</span>
          </div>
        </div>
      </div>

      <!-- Recent Orders List -->
      <div>
        <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Recent Bookings</h3>
        <div class="flex flex-col gap-2">
          ${state.orders.slice(0, 3).map(o => {
            let statusColor = 'text-amber-500 bg-amber-50';
            if(o.status === 'Delivered') statusColor = 'text-green-600 bg-green-50';
            if(o.status === 'Confirmed') statusColor = 'text-blue-600 bg-blue-50';
            if(o.status === 'Packed') statusColor = 'text-purple-600 bg-purple-50';
            if(o.status === 'Dispatched') statusColor = 'text-teal-600 bg-teal-50';
            
            return `
              <div class="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center cursor-pointer" onclick="viewOrderTimelineSim('${o.id}')">
                <div>
                  <div class="text-xs font-mono font-bold text-slate-800">${o.id}</div>
                  <div class="text-[10px] text-slate-400 font-mono mt-0.5">${o.date}</div>
                  <div class="flex items-center gap-1.5 mt-2">
                    <span class="text-[10px] px-2 py-0.5 rounded ${statusColor} font-semibold">${o.status}</span>
                    <span class="text-[10px] text-slate-500 font-mono">₹${o.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <span class="material-symbols-outlined text-slate-300 text-lg">chevron_right</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function selectCategorySim(cat) {
  state.selectedCategory = cat;
  navigateCustomer('listing');
}

function viewOrderTimelineSim(orderId) {
  state.selectedOrderId = orderId;
  navigateCustomer('dispatch');
}

function generateCustomerCategoriesUI() {
  const categories = [...new Set(state.products.map(p => p.category))];
  return `
    <div class="animate-fade-in">
      <div class="flex justify-between items-center mb-6 mt-2">
        <h2 class="text-lg font-bold text-slate-800">Product Categories</h2>
        <button class="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('cart')">
          <span class="material-symbols-outlined text-lg">shopping_cart</span>
          ${state.customerCart.length > 0 ? `<span class="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">${state.customerCart.reduce((s,i)=>s+i.qty,0)}</span>` : ''}
        </button>
      </div>

      <div class="relative mb-5">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input type="text" class="jtc-input pl-12 h-12 text-sm" placeholder="Search brands or products..."/>
      </div>

      <div class="grid grid-cols-2 gap-3">
        ${categories.map(cat => {
          let icon = 'cable';
          if(cat === 'Fans') icon = 'mode_fan';
          if(cat === 'Pumps') icon = 'water_pump';
          if(cat === 'Solar Solutions') icon = 'solar_power';
          if(cat === 'Electrical') icon = 'bolt';
          if(cat === 'Switchgears') icon = 'settings_input_composite';

          const count = state.products.filter(p => p.category === cat).length;

          return `
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between h-32 cursor-pointer hover:border-blue-300" onclick="selectCategorySim('${cat}')">
              <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900">
                <span class="material-symbols-outlined">${icon}</span>
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-800 leading-tight">${cat}</h4>
                <p class="text-[10px] text-slate-400 mt-0.5">${count} Products</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function generateCustomerListingUI() {
  const filtered = state.products.filter(p => p.category === state.selectedCategory);
  return `
    <div class="animate-fade-in">
      <div class="flex items-center justify-between mb-5 mt-2">
        <div class="flex items-center gap-2">
          <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('categories')">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <h2 class="text-base font-bold text-slate-800">${state.selectedCategory}</h2>
        </div>
        <button class="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('cart')">
          <span class="material-symbols-outlined text-lg">shopping_cart</span>
          ${state.customerCart.length > 0 ? `<span class="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">${state.customerCart.reduce((s,i)=>s+i.qty,0)}</span>` : ''}
        </button>
      </div>

      <div class="flex flex-col gap-3">
        ${filtered.map(prod => {
          return `
            <div class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex gap-3 hover:border-blue-300">
              <img class="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-100" src="${prod.image}" alt="${prod.name}"/>
              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <h4 class="text-xs font-semibold text-slate-800 leading-snug cursor-pointer" onclick="viewProductDetailsSim('${prod.id}')">${prod.name}</h4>
                  <p class="text-[10px] text-slate-400 font-mono mt-0.5">MOQ: ${prod.minOrder} ${prod.unit}s</p>
                </div>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs font-mono font-bold text-slate-800">₹${prod.price.toLocaleString('en-IN')} <span class="text-[9px] font-sans text-slate-400 font-normal">/${prod.unit}</span></span>
                  <button class="px-3 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded-md text-[10px] font-bold" onclick="addToCartSim('${prod.id}')">Add</button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function viewProductDetailsSim(prodId) {
  state.selectedProductId = prodId;
  navigateCustomer('details');
}

function addToCartSim(prodId) {
  const prod = state.products.find(p => p.id === prodId);
  if(!prod) return;
  
  const existing = state.customerCart.find(i => i.productId === prodId);
  if(existing) {
    existing.qty += prod.minOrder;
  } else {
    state.customerCart.push({
      productId: prodId,
      name: prod.name,
      price: prod.price,
      qty: prod.minOrder,
      unit: prod.unit
    });
  }

  showToast(`Added ${prod.name} to cart.`, 'success');
  renderCustomerApp(); // Reload to refresh cart badges
}

function generateCustomerDetailsUI() {
  const prod = state.products.find(p => p.id === state.selectedProductId);
  if(!prod) return '';

  return `
    <div class="animate-fade-in flex flex-col justify-between h-full">
      <div>
        <div class="flex items-center justify-between mb-4 mt-2">
          <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('listing')">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <h2 class="text-sm font-bold text-slate-700">Product details</h2>
          <button class="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('cart')">
            <span class="material-symbols-outlined text-lg">shopping_cart</span>
            ${state.customerCart.length > 0 ? `<span class="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">${state.customerCart.reduce((s,i)=>s+i.qty,0)}</span>` : ''}
          </button>
        </div>

        <img class="w-full h-44 object-cover rounded-2xl mb-4 bg-slate-100" src="${prod.image}" alt="${prod.name}"/>

        <div class="flex justify-between items-start mb-2">
          <span class="px-2 py-0.5 bg-blue-50 text-blue-900 rounded font-semibold text-[10px]">${prod.brand}</span>
          <span class="text-[10px] font-mono text-slate-400">SKU: ${prod.sku}</span>
        </div>
        <h3 class="text-sm font-bold text-slate-800 leading-snug">${prod.name}</h3>
        <p class="text-[10px] text-slate-500 mt-2 font-poppins">${prod.specs}</p>

        <div class="mt-4 border-t border-slate-100 pt-4">
          <h4 class="text-xs font-bold text-slate-700 mb-1.5 uppercase">B2B Terms</h4>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="bg-slate-50 p-2.5 rounded-lg">
              <span class="text-slate-400 text-[9px] block">MIN ORDER QTY</span>
              <strong class="text-slate-700 font-mono">${prod.minOrder} ${prod.unit}s</strong>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-lg">
              <span class="text-slate-400 text-[9px] block">UNIT PRICE</span>
              <strong class="text-slate-700 font-mono">₹${prod.price.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 mt-6 pb-4">
        <div class="flex-1">
          <span class="text-[10px] text-slate-400 block uppercase font-bold">Total price (Est)</span>
          <strong class="text-base font-mono text-slate-800 block mt-0.5">₹${(prod.price * prod.minOrder).toLocaleString('en-IN')}</strong>
        </div>
        <button class="btn-primary h-12 flex-1 text-sm font-semibold rounded-xl" onclick="addToCartSim('${prod.id}'); navigateCustomer('cart')">Book Stock</button>
      </div>
    </div>
  `;
}

function generateCustomerCartUI() {
  const subtotal = state.customerCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return `
    <div class="animate-fade-in flex flex-col justify-between h-full">
      <div>
        <div class="flex items-center gap-2 mb-6 mt-2">
          <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('categories')">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <h2 class="text-base font-bold text-slate-800">My Cart</h2>
        </div>

        ${state.customerCart.length === 0 ? `
          <div class="py-16 text-center">
            <span class="material-symbols-outlined text-slate-300 text-5xl mb-3">shopping_cart_off</span>
            <p class="text-xs text-slate-400">Cart is empty. Add bulk items from product lists.</p>
          </div>
        ` : `
          <div class="flex flex-col gap-3">
            ${state.customerCart.map((item, idx) => {
              return `
                <div class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex justify-between items-center">
                  <div class="flex-1 pr-4">
                    <h4 class="text-xs font-semibold text-slate-800 leading-tight">${item.name}</h4>
                    <span class="text-[10px] text-slate-400 font-mono mt-1 block">₹${item.price.toLocaleString('en-IN')} / ${item.unit}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button class="w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold text-xs" onclick="adjustCartQty(${idx}, -1)">-</button>
                    <span class="font-mono font-bold text-xs w-6 text-center">${item.qty}</span>
                    <button class="w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold text-xs" onclick="adjustCartQty(${idx}, 1)">+</button>
                  </div>
                </div>
              `;
            }).join('')}

            <div class="mt-6 border-t border-dashed border-slate-200 pt-4 text-xs flex flex-col gap-1.5 text-slate-600">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span class="font-mono">₹${subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between">
                <span>GST (18%)</span>
                <span class="font-mono">₹${gst.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between text-slate-800 font-bold text-sm border-t border-slate-100 pt-2.5 mt-1.5">
                <span>Total amount</span>
                <span class="font-mono text-blue-900">₹${total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        `}
      </div>

      ${state.customerCart.length > 0 ? `
        <div class="pt-6 pb-4">
          <button class="btn-primary w-full text-sm font-semibold rounded-xl h-12" onclick="placeOrderCustomerSim()">Book Order (24 Hr Hold)</button>
        </div>
      ` : ''}
    </div>
  `;
}

function adjustCartQty(idx, change) {
  const item = state.customerCart[idx];
  const prod = state.products.find(p => p.name === item.name);
  const min = prod ? prod.minOrder : 1;
  
  item.qty += change;
  if(item.qty < min) {
    state.customerCart.splice(idx, 1);
    showToast("Item removed from booking cart.");
  }
  renderCustomerApp();
}

function placeOrderCustomerSim() {
  const total = state.customerCart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 1.18;
  
  // Outstanding limit check
  if(state.customerUser.outstanding + total > state.customerUser.creditLimit) {
    showToast("Credit limit exceeded! Order blocked.", "error");
    return;
  }

  // Create new order
  const now = new Date();
  const orderId = "JTCORD" + now.getFullYear().toString().slice(-2) + "05" + Math.floor(100 + Math.random() * 900);
  const dateStr = now.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) + ` | ${now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true })}`;

  const newOrder = {
    id: orderId,
    customer: state.customerUser.name,
    customerCode: state.customerUser.code,
    date: dateStr,
    amount: parseFloat(total.toFixed(2)),
    status: "Confirmed",
    paymentStatus: "Unpaid",
    items: [...state.customerCart],
    timeline: [
      { title: "Order Booked", time: dateStr, desc: "B2B stock hold active for next 24 Hours." },
      { title: "Confirmed", time: dateStr, desc: "Stock verification and credit check cleared by ERP." }
    ],
    reservedUntil: new Date(now.getTime() + 24*60*60*1000).toLocaleString('en-IN')
  };

  // Add invoice
  const invNo = "INV" + Math.floor(245000 + Math.random() * 999);
  const newInvoice = {
    invoiceNo: invNo,
    orderId: orderId,
    customer: state.customerUser.name,
    customerCode: state.customerUser.code,
    date: now.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
    amount: parseFloat(total.toFixed(2)),
    status: "Unpaid"
  };

  state.orders.unshift(newOrder);
  state.invoices.unshift(newInvoice);
  
  // Update dealer outstanding dues
  state.customerUser.outstanding += parseFloat(total.toFixed(2));
  const mainDealer = state.customers.find(c => c.code === state.customerUser.code);
  if(mainDealer) mainDealer.outstanding = state.customerUser.outstanding;

  // Clear cart
  state.customerCart = [];

  // Register Sync Notification for Admin Pane
  state.notifications.unshift({
    title: "New B2B Order",
    desc: `Dealer ${state.customerUser.name} booked ${newOrder.items.length} lines of stock.`,
    time: "Just Now",
    read: false
  });

  saveState();
  state.selectedOrderId = orderId;
  navigateCustomer('confirmation');
  showToast("Order booked successfully!", "success");
}

let countdownTimer;
function startBookingCountdown() {
  clearInterval(countdownTimer);
  let seconds = 24 * 60 * 60; // 24 hours in seconds
  
  const hourEl = document.getElementById('cd-hour');
  const minEl = document.getElementById('cd-min');
  const secEl = document.getElementById('cd-sec');

  countdownTimer = setInterval(() => {
    seconds--;
    if(seconds <= 0) {
      clearInterval(countdownTimer);
      return;
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if(hourEl) hourEl.innerText = h.toString().padStart(2, '0');
    if(minEl) minEl.innerText = m.toString().padStart(2, '0');
    if(secEl) secEl.innerText = s.toString().padStart(2, '0');
  }, 1000);
}

function generateCustomerConfirmationUI() {
  const order = state.orders.find(o => o.id === state.selectedOrderId);
  if(!order) return '';

  return `
    <div class="h-full flex flex-col justify-between py-6 px-4 animate-fade-in text-center">
      <div class="flex flex-col items-center mt-6">
        <div class="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-3xl">check_circle</span>
        </div>
        <h2 class="text-lg font-bold text-slate-800">Booking Confirmed!</h2>
        <p class="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Booking ID: <span class="font-mono text-slate-600">${order.id}</span></p>

        <div class="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full">
          <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Hold Expires In</span>
          <div class="flex justify-center gap-3 mt-2 text-slate-800">
            <div>
              <span class="text-xl font-mono font-bold" id="cd-hour">24</span>
              <span class="text-[9px] text-slate-400 block uppercase">Hours</span>
            </div>
            <span class="text-lg font-bold mt-0.5">:</span>
            <div>
              <span class="text-xl font-mono font-bold" id="cd-min">00</span>
              <span class="text-[9px] text-slate-400 block uppercase">Minutes</span>
            </div>
            <span class="text-lg font-bold mt-0.5">:</span>
            <div>
              <span class="text-xl font-mono font-bold" id="cd-sec">00</span>
              <span class="text-[9px] text-slate-400 block uppercase">Seconds</span>
            </div>
          </div>
          <p class="text-[9px] text-slate-500 mt-3 px-2">Stock reserved at Bay 3 warehouse. Invoice will be generated automatically after packing confirmation.</p>
        </div>
      </div>

      <div class="flex flex-col gap-2 pb-4">
        <button class="btn-primary h-12 text-sm font-semibold rounded-xl" onclick="navigateCustomer('dispatch')">Track Delivery</button>
        <button class="btn-secondary h-12 text-sm font-semibold rounded-xl" onclick="navigateCustomer('home')">Back to Home</button>
      </div>
    </div>
  `;
}

function generateCustomerInvoicesUI() {
  const filtered = state.invoices.filter(i => i.customerCode === state.customerUser.code);
  return `
    <div class="animate-fade-in">
      <div class="flex items-center gap-2 mb-6 mt-2">
        <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('home')">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
        </button>
        <h2 class="text-base font-bold text-slate-800">My Dues & Invoices</h2>
      </div>

      <div class="flex flex-col gap-2.5">
        ${filtered.map(inv => {
          let statusClass = inv.status === 'Paid' ? 'status-delivered' : 'status-pending';
          
          return `
            <div class="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
              <div class="flex justify-between items-start">
                <div>
                  <span class="font-mono text-xs font-bold text-slate-800">${inv.invoiceNo}</span>
                  <span class="text-[9px] text-slate-400 block font-mono mt-0.5">Order Ref: ${inv.orderId}</span>
                </div>
                <span class="status-chip ${statusClass}">${inv.status}</span>
              </div>
              <div class="flex justify-between items-end mt-4">
                <div>
                  <span class="text-[9px] text-slate-400 block uppercase">Total Amount</span>
                  <strong class="text-sm font-mono text-slate-800">₹${inv.amount.toLocaleString('en-IN')}</strong>
                </div>
                <div class="flex gap-2">
                  <button class="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-[10px] font-semibold" onclick="simulateInvoicePDF('${inv.invoiceNo}')">View</button>
                  ${inv.status !== 'Paid' ? `<button class="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-[10px] font-semibold" onclick="payInvoiceSim('${inv.invoiceNo}')">Pay</button>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function payInvoiceSim(invNo) {
  const inv = state.invoices.find(i => i.invoiceNo === invNo);
  if(!inv) return;

  // Confirm dialog
  const check = confirm(`Authorize B2B payment of ₹${inv.amount.toLocaleString('en-IN')}?`);
  if(!check) return;

  inv.status = 'Paid';
  
  // Deduct outstanding
  state.customerUser.outstanding = Math.max(0, state.customerUser.outstanding - inv.amount);
  const mainDealer = state.customers.find(c => c.code === state.customerUser.code);
  if(mainDealer) mainDealer.outstanding = state.customerUser.outstanding;

  // Mark matching order paid
  const order = state.orders.find(o => o.id === inv.orderId);
  if(order) order.paymentStatus = 'Paid';

  // Push to collections log
  state.collections.unshift({
    id: "COL" + Math.floor(100 + Math.random() * 900),
    agent: "Self (Online Portal)",
    customer: state.customerUser.name,
    amount: inv.amount,
    date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
    mode: "UPI Portal",
    reference: "UPI" + Math.floor(10000000 + Math.random() * 90000000),
    status: "Cleared"
  });

  saveState();
  renderCustomerApp();
  showToast(`Payment of ₹${inv.amount.toLocaleString('en-IN')} processed successfully!`, 'success');
}

function generateCustomerDispatchUI() {
  const order = state.orders.find(o => o.id === state.selectedOrderId);
  if(!order) return '<p class="text-xs text-slate-400 py-8 text-center">No order active for dispatch tracking.</p>';

  // Status mapping
  const activeStep = ['Pending', 'Confirmed', 'Packed', 'Dispatched', 'Delivered'].indexOf(order.status);

  return `
    <div class="animate-fade-in">
      <div class="flex items-center gap-2 mb-6 mt-2">
        <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('home')">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
        </button>
        <h2 class="text-base font-bold text-slate-800">Dispatch Timeline</h2>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-5">
        <div class="flex justify-between items-start text-xs mb-3 border-b border-slate-50 pb-3">
          <div>
            <span class="text-slate-400 block font-semibold">Order Reference</span>
            <strong class="text-slate-800 font-mono">${order.id}</strong>
          </div>
          <div class="text-right">
            <span class="text-slate-400 block font-semibold">Bill Amount</span>
            <strong class="text-slate-800 font-mono">₹${order.amount.toLocaleString('en-IN')}</strong>
          </div>
        </div>
        <p class="text-[10px] text-slate-500 font-semibold uppercase leading-snug">Expected Delivery: <span class="font-mono text-slate-700 font-bold">${order.expectedDelivery || '14 May 2024'}</span></p>
      </div>

      <!-- Vertical Stepper Timeline -->
      <div class="relative pl-6 flex flex-col gap-6">
        <div class="absolute left-2.5 top-1.5 bottom-1.5 w-[2px] bg-slate-100"></div>

        <div class="relative flex gap-3 text-xs">
          <div class="absolute -left-[20px] top-0 w-3 h-3 rounded-full border-2 ${activeStep >= 0 ? 'bg-blue-900 border-blue-900 shadow' : 'bg-white border-slate-300'} z-10"></div>
          <div>
            <strong class="${activeStep >= 0 ? 'text-slate-800' : 'text-slate-400'} block">Order Placed</strong>
            <span class="text-[9px] text-slate-400 font-mono">12 May 2024, 09:30 AM</span>
            <p class="text-[10px] text-slate-500 mt-1">Booked successfully on platform.</p>
          </div>
        </div>

        <div class="relative flex gap-3 text-xs">
          <div class="absolute -left-[20px] top-0 w-3 h-3 rounded-full border-2 ${activeStep >= 1 ? 'bg-blue-900 border-blue-900 shadow' : 'bg-white border-slate-300'} z-10"></div>
          <div>
            <strong class="${activeStep >= 1 ? 'text-slate-800' : 'text-slate-400'} block">ERP Confirmed</strong>
            <span class="text-[9px] text-slate-400 font-mono">12 May 2024, 11:15 AM</span>
            <p class="text-[10px] text-slate-500 mt-1">Stock verification and credit check cleared.</p>
          </div>
        </div>

        <div class="relative flex gap-3 text-xs">
          <div class="absolute -left-[20px] top-0 w-3 h-3 rounded-full border-2 ${activeStep >= 2 ? 'bg-blue-900 border-blue-900 shadow' : 'bg-white border-slate-300'} z-10"></div>
          <div>
            <strong class="${activeStep >= 2 ? 'text-slate-800' : 'text-slate-400'} block">Packed at Warehouse</strong>
            <span class="text-[9px] text-slate-400 font-mono">Ready at Bay 4</span>
            <p class="text-[10px] text-slate-500 mt-1">Packed, sealed and tagged with serial bar codes.</p>
          </div>
        </div>

        <div class="relative flex gap-3 text-xs">
          <div class="absolute -left-[20px] top-0 w-3 h-3 rounded-full border-2 ${activeStep >= 3 ? 'bg-blue-900 border-blue-900 shadow' : 'bg-white border-slate-300'} z-10"></div>
          <div>
            <strong class="${activeStep >= 3 ? 'text-slate-800' : 'text-slate-400'} block">Shipped (In Transit)</strong>
            <span class="text-[9px] text-slate-400 font-mono">Truck: UP78-T-4545</span>
            <p class="text-[10px] text-slate-500 mt-1">Dispatched to Kanpur regional hub.</p>
          </div>
        </div>

        <div class="relative flex gap-3 text-xs">
          <div class="absolute -left-[20px] top-0 w-3 h-3 rounded-full border-2 ${activeStep >= 4 ? 'bg-blue-900 border-blue-900 shadow' : 'bg-white border-slate-300'} z-10"></div>
          <div>
            <strong class="${activeStep >= 4 ? 'text-slate-800' : 'text-slate-400'} block">Delivered & Closed</strong>
            <span class="text-[9px] text-slate-400 font-mono">Closed in ERP</span>
            <p class="text-[10px] text-slate-500 mt-1">Acknowledged and signed by store manager.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateCustomerProfileUI() {
  const cust = state.customerUser;
  return `
    <div class="animate-fade-in text-center">
      <div class="flex flex-col items-center py-6 border-b border-slate-100">
        <div class="w-16 h-16 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mb-3">
          <span class="material-symbols-outlined text-3xl">account_circle</span>
        </div>
        <h3 class="text-sm font-bold text-slate-800">${cust.owner}</h3>
        <p class="text-[10px] text-slate-400 font-mono mt-0.5">Code: ${cust.code}</p>
      </div>

      <div class="flex flex-col gap-1 mt-4 text-left text-xs">
        <div class="p-3 bg-white border border-slate-50 rounded-xl mb-1.5">
          <span class="text-[9px] text-slate-400 block">GSTIN</span>
          <strong class="text-slate-700 font-mono uppercase">${cust.gstin}</strong>
        </div>
        <div class="p-3 bg-white border border-slate-50 rounded-xl mb-1.5">
          <span class="text-[9px] text-slate-400 block">PHONE NUMBER</span>
          <strong class="text-slate-700 font-mono">+91 ${cust.phone}</strong>
        </div>
        <div class="p-3 bg-white border border-slate-50 rounded-xl mb-1.5">
          <span class="text-[9px] text-slate-400 block">REGISTERED ADDRESS</span>
          <strong class="text-slate-700">${cust.address}</strong>
        </div>
      </div>

      <button class="w-full mt-8 py-3 bg-slate-100 hover:bg-slate-200 text-rose-600 rounded-xl font-poppins font-medium text-xs transition-all" onclick="navigateCustomer('welcome')">Log Out Account</button>
    </div>
  `;
}

// ----------------------------------------------------
// COLLECTION AGENT APP MODULE (PURPLE + BLUE)
// ----------------------------------------------------
function navigateAgent(screen) {
  state.agentScreen = screen;
  renderAgentApp();
}

function renderAgentApp() {
  const container = document.getElementById('agent-screen-area');
  container.innerHTML = '';

  if(state.agentScreen === 'login') {
    container.innerHTML = generateAgentLoginUI();
  } else if (state.agentScreen === 'home') {
    container.innerHTML = generateAgentHomeUI();
  } else if (state.agentScreen === 'collection_form') {
    container.innerHTML = generateAgentCollectionFormUI();
  } else if (state.agentScreen === 'success') {
    container.innerHTML = generateAgentSuccessUI();
  } else if (state.agentScreen === 'leaderboard') {
    container.innerHTML = generateAgentLeaderboardUI();
  } else if (state.agentScreen === 'history') {
    container.innerHTML = generateAgentHistoryUI();
  }

  // Render bottom nav if not login
  const isNav = state.agentScreen !== 'login';
  const bottomNav = document.getElementById('agent-bottom-nav');
  if(bottomNav) {
    bottomNav.style.display = isNav ? 'flex' : 'none';
    if(isNav) updateAgentBottomNavHighlight();
  }
}

function updateAgentBottomNavHighlight() {
  const tabs = document.querySelectorAll('.agent-nav-btn');
  tabs.forEach(tab => {
    const screen = tab.dataset.screen;
    const isActive = (screen === 'home' && ['home', 'collection_form', 'success'].includes(state.agentScreen)) ||
                     (screen === 'leaderboard' && state.agentScreen === 'leaderboard') ||
                     (screen === 'history' && state.agentScreen === 'history');
    if(isActive) {
      tab.classList.add('text-indigo-900', 'font-semibold');
      tab.classList.remove('text-slate-400');
    } else {
      tab.classList.remove('text-indigo-900', 'font-semibold');
      tab.classList.add('text-slate-400');
    }
  });
}

// UI Creators
function generateAgentLoginUI() {
  return `
    <div class="h-full flex flex-col justify-between py-10 px-6 animate-fade-in">
      <div class="mt-4 flex flex-col items-center text-center">
        <div class="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-900 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
          <span class="material-symbols-outlined text-white text-3xl">route</span>
        </div>
        <h1 class="text-2xl font-bold text-slate-800">Agent Portal</h1>
        <p class="text-xs text-slate-400 mt-1">Field Collections & Ledger Sync</p>
      </div>

      <div class="flex flex-col gap-4">
        <div>
          <label class="text-xs font-bold text-slate-600 block mb-2 uppercase">Agent Phone</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">badge</span>
            <input type="text" class="jtc-input pl-12" id="agent-phone-input" placeholder="+91 98768 43210" value="9876843210"/>
          </div>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-600 block mb-2 uppercase">PIN</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
            <input type="password" class="jtc-input pl-12" id="agent-pwd-input" placeholder="••••" value="1111"/>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <button class="btn-primary bg-indigo-900 hover:bg-indigo-800 shadow-indigo-200" onclick="loginAgentSim()">Login Portal</button>
        <p class="text-center text-xs text-slate-400">Field agent credentials required.</p>
      </div>
    </div>
  `;
}

function loginAgentSim() {
  const phone = document.getElementById('agent-phone-input').value;
  const match = state.agents.find(a => a.phone === phone);
  if(match) {
    state.agentUser = match;
    showToast(`Welcome field agent ${match.name}`, 'success');
    navigateAgent('home');
  } else {
    showToast("Invalid credentials", "error");
  }
}

function generateAgentHomeUI() {
  const agt = state.agentUser;
  const targetCompleted = Math.round((agt.collected / agt.target) * 100);

  return `
    <div class="animate-fade-in flex flex-col gap-5">
      <!-- Agent Header -->
      <div class="flex justify-between items-center bg-indigo-950 -mx-4 px-4 py-4 pt-10 text-white rounded-b-3xl shadow-md">
        <div class="flex items-center gap-3">
          <img class="w-9 h-9 rounded-full object-cover border border-white/20" src="${agt.avatarUrl}"/>
          <div>
            <div class="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">Field Operations</div>
            <div class="text-xs font-semibold font-poppins">${agt.name}</div>
          </div>
        </div>
        <button class="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center" onclick="navigateAgent('login')">
          <span class="material-symbols-outlined text-lg">logout</span>
        </button>
      </div>

      <!-- KPI Progress Grid -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
          <span class="text-[10px] text-slate-400 block uppercase font-bold">Target Complete</span>
          <span class="text-xl font-bold text-indigo-900 block mt-1">${targetCompleted}%</span>
          <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div class="bg-indigo-600 h-full rounded-full" style="width: ${Math.min(targetCompleted, 100)}%"></div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
          <span class="text-[10px] text-slate-400 block uppercase font-bold">Collected Today</span>
          <span class="text-xl font-bold font-mono text-emerald-600 block mt-1">₹${agt.collected.toLocaleString('en-IN')}</span>
          <span class="text-[9px] text-slate-400 block mt-1">Target: ₹${agt.target.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <!-- GPS Map simulation placeholder -->
      <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div class="p-3 bg-slate-50 flex justify-between items-center border-b border-slate-100">
          <span class="text-xs font-bold text-slate-700 uppercase">Target Route Map</span>
          <span class="text-[10px] text-indigo-700 font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-xs">my_location</span> GPS Live</span>
        </div>
        <div class="h-32 bg-slate-100 relative flex items-center justify-center">
          <img class="absolute inset-0 w-full h-full object-cover opacity-60" src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=300&auto=format&fit=crop&q=60" alt="Simulation map grid"/>
          <div class="relative z-10 px-4 py-2 bg-indigo-900 text-white rounded-lg text-[10px] flex items-center gap-2 shadow-lg">
            <span class="material-symbols-outlined text-sm animate-ping">radio_button_checked</span>
            <span>2 Dealers on route today</span>
          </div>
        </div>
      </div>

      <!-- Today's Visits / Firms list -->
      <div>
        <h3 class="text-xs font-bold text-slate-700 uppercase mb-2">Today's Visits</h3>
        <div class="flex flex-col gap-2.5">
          ${agt.todayFirms.map((firm, idx) => {
            let isCollected = firm.status === 'Collected';
            return `
              <div class="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                <div>
                  <h4 class="text-xs font-semibold text-slate-800 leading-tight">${firm.name}</h4>
                  <span class="text-[9px] text-slate-400 mt-1 block">${firm.address}</span>
                  <span class="text-[10px] font-mono font-bold mt-2 block text-slate-700">Dues: ₹${firm.due.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  ${isCollected ? `
                    <span class="text-emerald-600 font-semibold text-xs flex items-center gap-1"><span class="material-symbols-outlined text-sm">verified</span> Collected</span>
                  ` : `
                    <button class="px-3.5 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-lg text-[10px] font-semibold" onclick="collectForFirmSim(${idx})">Collect</button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function collectForFirmSim(idx) {
  const firm = state.agentUser.todayFirms[idx];
  state.activeCollectionFirm = { ...firm, todayFirmIndex: idx };
  navigateAgent('collection_form');
}

function generateAgentCollectionFormUI() {
  const firm = state.activeCollectionFirm;
  return `
    <div class="h-full flex flex-col justify-between py-6 px-4 animate-fade-in">
      <div>
        <div class="flex items-center gap-2 mb-6">
          <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateAgent('home')">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <h2 class="text-sm font-bold text-slate-800">Record Ledger Collection</h2>
        </div>

        <div class="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 mb-6">
          <span class="text-[10px] text-indigo-800 block uppercase font-bold">DEALER FIRM</span>
          <strong class="text-sm text-indigo-950 block mt-0.5">${firm.name}</strong>
          <span class="text-[10px] font-mono text-indigo-700 block mt-2">Maximum Dues Outstanding: ₹${firm.due.toLocaleString('en-IN')}</span>
        </div>

        <div class="flex flex-col gap-4">
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-2 uppercase">Collected Amount (₹)</label>
            <input type="number" class="jtc-input font-mono" id="collection-amt-input" placeholder="Enter amount collected" value="${firm.due}"/>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-2 uppercase">Payment Mode</label>
            <select class="jtc-input" id="collection-mode-input">
              <option value="Cheque">Bank Cheque</option>
              <option value="UPI">UPI Digital Transfer</option>
              <option value="Cash">Cash Ledger</option>
              <option value="Bank Transfer">RTGS/NEFT Transfer</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-600 block mb-2 uppercase">Instrument Reference # (Txn ID/Cheque No)</label>
            <input type="text" class="jtc-input font-mono" id="collection-ref-input" placeholder="CHQ / UPI Ref / Cash details" value="CHQ${Math.floor(100000 + Math.random() * 900000)}"/>
          </div>
        </div>
      </div>

      <div class="pb-4">
        <button class="btn-primary bg-indigo-900 hover:bg-indigo-800 w-full rounded-xl text-sm font-semibold h-12" onclick="saveCollectionSim()">Confirm Ledger Entry</button>
      </div>
    </div>
  `;
}

function saveCollectionSim() {
  const amt = parseFloat(document.getElementById('collection-amt-input').value);
  const mode = document.getElementById('collection-mode-input').value;
  const ref = document.getElementById('collection-ref-input').value;
  
  const firm = state.activeCollectionFirm;
  if(isNaN(amt) || amt <= 0) {
    showToast("Enter a valid positive collected amount", "error");
    return;
  }

  // Record Collection Transaction
  const colId = "COL" + Math.floor(100 + Math.random() * 900);
  const colTxn = {
    id: colId,
    agent: state.agentUser.name,
    customer: firm.name,
    amount: amt,
    date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
    mode: mode,
    reference: ref,
    status: "Pending Verification" // Admin needs to verify
  };

  state.collections.unshift(colTxn);
  
  // Set today visit state to collected
  const targetFirmIdx = state.activeCollectionFirm.todayFirmIndex;
  state.agentUser.todayFirms[targetFirmIdx].status = 'Collected';
  state.agentUser.todayFirms[targetFirmIdx].amount = amt;
  state.agentUser.todayFirms[targetFirmIdx].date = colTxn.date;

  // Add notification to admin
  state.notifications.unshift({
    title: "Collection Recorded",
    desc: `${state.agentUser.name} submitted receipt ${colId} for verification.`,
    time: "Just Now",
    read: false
  });

  saveState();
  navigateAgent('success');
  showToast("Ledger collection registered. Awaiting admin clearing.", "success");
}

function generateAgentSuccessUI() {
  return `
    <div class="h-full flex flex-col justify-between py-10 px-4 animate-fade-in text-center">
      <div class="flex flex-col items-center mt-12">
        <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 shadow-inner">
          <span class="material-symbols-outlined text-4xl">check_circle</span>
        </div>
        <h2 class="text-xl font-bold text-slate-800">Receipt Generated!</h2>
        <p class="text-xs text-slate-400 mt-2">B2B collection recorded successfully</p>
        
        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 w-full mt-8">
          <div class="text-xs text-slate-400 uppercase tracking-widest font-bold">DIGITAL RECEIPT DETAILS</div>
          <div class="border-t border-dashed border-slate-200 my-3"></div>
          <div class="flex flex-col gap-2.5 text-xs text-left">
            <div class="flex justify-between">
              <span class="text-slate-400">Firm Name</span>
              <strong class="text-slate-800">${state.activeCollectionFirm.name}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Collected Amount</span>
              <strong class="text-slate-800 font-mono">₹${state.activeCollectionFirm.due.toLocaleString('en-IN')}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">ERP Sync State</span>
              <span class="text-amber-600 font-bold flex items-center gap-1"><span class="material-symbols-outlined text-xs animate-spin">sync</span> Pending verification</span>
            </div>
          </div>
        </div>
      </div>

      <div class="pb-4">
        <button class="btn-primary bg-indigo-900 hover:bg-indigo-800 w-full rounded-xl h-12 text-sm font-semibold shadow-indigo-200" onclick="navigateAgent('home')">Back to route</button>
      </div>
    </div>
  `;
}

function generateAgentLeaderboardUI() {
  const sorted = [...state.agents].sort((a,b) => b.collected - a.collected);
  return `
    <div class="animate-fade-in">
      <h2 class="text-base font-bold text-slate-800 mb-5 mt-2">Agent Performance</h2>

      <div class="flex flex-col gap-2.5">
        ${sorted.map((agt, idx) => {
          let badge = `<span class="font-mono font-bold text-slate-400 text-xs w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">${idx+1}</span>`;
          if(idx === 0) badge = `<span class="material-symbols-outlined text-amber-500 text-lg">workspace_premium</span>`;
          if(idx === 1) badge = `<span class="material-symbols-outlined text-slate-400 text-lg">workspace_premium</span>`;
          if(idx === 2) badge = `<span class="material-symbols-outlined text-amber-700 text-lg">workspace_premium</span>`;

          return `
            <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
              ${badge}
              <img class="w-8 h-8 rounded-full object-cover" src="${agt.avatarUrl}"/>
              <div class="flex-1">
                <div class="flex justify-between items-center">
                  <h4 class="text-xs font-semibold text-slate-800">${agt.name}</h4>
                  <span class="text-xs font-mono font-bold text-emerald-600">₹${agt.collected.toLocaleString('en-IN')}</span>
                </div>
                <div class="text-[9px] text-slate-400 mt-0.5">${agt.area} • Target: ₹${agt.target.toLocaleString('en-IN')}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function generateAgentHistoryUI() {
  const agt = state.agentUser;
  // Get collections corresponding to this agent
  const col = state.collections.filter(c => c.agent === agt.name);
  return `
    <div class="animate-fade-in">
      <h2 class="text-base font-bold text-slate-800 mb-5 mt-2">Collections History</h2>

      <div class="flex flex-col gap-2.5">
        ${col.length === 0 ? `
          <p class="text-xs text-slate-400 text-center py-12">No collections logged yet.</p>
        ` : col.map(c => {
          let statusClass = c.status === 'Cleared' ? 'status-delivered' : 'status-pending';
          return `
            <div class="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-xs font-semibold text-slate-800 leading-tight">${c.customer}</h4>
                  <span class="text-[9px] text-slate-400 font-mono mt-0.5">${c.date}</span>
                </div>
                <span class="status-chip ${statusClass}">${c.status}</span>
              </div>
              <div class="flex justify-between items-end mt-4 border-t border-slate-50 pt-2.5">
                <div class="text-[10px] text-slate-500 font-poppins">Mode: <span class="font-bold">${c.mode}</span></div>
                <strong class="text-sm font-mono text-slate-700">₹${c.amount.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Global scope bindings for simulation triggers
window.switchAdminTab = switchAdminTab;
window.viewOrderDetailsAdmin = viewOrderDetailsAdmin;
window.closeOrderDetailsAdmin = closeOrderDetailsAdmin;
window.updateOrderStatus = updateOrderStatus;
window.verifyCollection = verifyCollection;
window.triggerManualERPSync = triggerManualERPSync;
window.simulateInvoicePDF = simulateInvoicePDF;
window.navigateCustomer = navigateCustomer;
window.loginCustomerSim = loginCustomerSim;
window.selectCategorySim = selectCategorySim;
window.viewProductDetailsSim = viewProductDetailsSim;
window.addToCartSim = addToCartSim;
window.adjustCartQty = adjustCartQty;
window.placeOrderCustomerSim = placeOrderCustomerSim;
window.payInvoiceSim = payInvoiceSim;
window.viewOrderTimelineSim = viewOrderTimelineSim;
window.navigateAgent = navigateAgent;
window.loginAgentSim = loginAgentSim;
window.collectForFirmSim = collectForFirmSim;
window.saveCollectionSim = saveCollectionSim;

// Load App on Window Load
window.addEventListener('DOMContentLoaded', initApp);
