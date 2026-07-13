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
  adminUsers: [],
  
  // Navigation State
  activePlatform: 'admin', // 'admin', 'customer', 'agent', 'specs'
  adminTab: 'dashboard',
  customerScreen: 'welcome', // welcome, login, register, home, categories, listing, details, cart, confirmation, dispatch, invoices, profile, pricelist, support, schemes, helpfaq
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
  searchQuery: '',
  categoryFilter: 'All',
  brandFilter: 'All',
  
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
  state.adminUsers = Database.getAdminUsers();
  
  // Setup Platform Switcher listeners
  document.querySelectorAll('.platform-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plat = e.currentTarget.dataset.platform;
      switchPlatform(plat);
    });
  });

  // Attach button ripple effects globally
  document.body.addEventListener('click', function(e) {
    const target = e.target.closest('.btn-primary, .btn-secondary, .platform-btn, .cust-nav-btn, .agent-nav-btn');
    if (target) {
      createRipple(e, target);
    }
  });

  // Render initial platform view
  renderCurrentPlatform();
  showToast("Design System Ready & Active", "success");
}

function saveState() {
  Database.saveProducts(state.products);
  Database.saveCustomers(state.customers);
  Database.saveOrders(state.orders);
  Database.saveInvoices(state.invoices);
  Database.saveAgents(state.agents);
  Database.saveCollections(state.collections);
  Database.saveSyncLogs(state.syncLogs);
  Database.saveAdminUsers(state.adminUsers);
}

// Button Ripple Effect
function createRipple(event, element) {
  const circle = document.createElement("span");
  const diameter = Math.max(element.clientWidth, element.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  
  const rect = element.getBoundingClientRect();
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add("ripple");

  const ripple = element.getElementsByClassName("ripple")[0];
  if (ripple) {
    ripple.remove();
  }
  element.appendChild(circle);
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
  showToast(`Switched to: ${platform.toUpperCase()}`);
}

function renderCurrentPlatform() {
  const adminCont = document.getElementById('admin-container');
  const custCont = document.getElementById('customer-container');
  const agtCont = document.getElementById('agent-container');
  const specsCont = document.getElementById('specs-container');

  if (adminCont) adminCont.style.display = 'none';
  if (custCont) custCont.style.display = 'none';
  if (agtCont) agtCont.style.display = 'none';
  if (specsCont) specsCont.style.display = 'none';

  if (state.activePlatform === 'admin') {
    if (adminCont) {
      adminCont.style.display = 'flex';
      renderAdminDashboard();
    }
  } else if (state.activePlatform === 'customer') {
    if (custCont) custCont.style.display = 'flex';
    renderCustomerApp();
  } else if (state.activePlatform === 'agent') {
    if (agtCont) agtCont.style.display = 'flex';
    renderAgentApp();
  } else if (state.activePlatform === 'specs') {
    if (specsCont) specsCont.style.display = 'block';
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
  
  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  }, 50);

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

  document.querySelectorAll('.admin-tab-pane').forEach(pane => {
    pane.style.display = 'none';
  });

  const activePane = document.getElementById(`admin-pane-${state.adminTab}`);
  if(activePane) {
    activePane.style.display = 'block';
  }

  // Populate dynamic tables
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
  } else if (state.adminTab === 'settings') {
    populateAdminSettings();
  }
}

function populateAdminDashboardHome() {
  const totalOrders = state.orders.length;
  const totalSales = state.orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.amount : sum, 0);
  const totalCustomers = state.customers.length;
  const totalOutstanding = state.customers.reduce((sum, c) => sum + c.outstanding, 0);
  
  document.getElementById('stat-orders').innerText = totalOrders;
  document.getElementById('stat-sales').innerText = `₹${totalSales.toLocaleString('en-IN')}`;
  document.getElementById('stat-customers').innerText = totalCustomers;
  document.getElementById('stat-outstanding').innerText = `₹${totalOutstanding.toLocaleString('en-IN')}`;

  const pendingOrders = state.orders.filter(o => o.status === 'Pending').length;
  const pendingInvoices = state.invoices.filter(i => i.status === 'Unpaid').length;
  const activeAgents = state.agents.filter(a => a.status === 'Active').length;

  document.getElementById('stat-pending-orders').innerText = pendingOrders;
  document.getElementById('stat-pending-invoices').innerText = pendingInvoices;
  document.getElementById('stat-collections-due').innerText = `₹${totalOutstanding.toLocaleString('en-IN')}`;
  document.getElementById('stat-active-agents').innerText = activeAgents;

  setTimeout(initDashboardCharts, 100);
}

let salesChart, categoryChart;
function initDashboardCharts() {
  if (typeof Chart === 'undefined') {
    console.warn("Chart.js is not loaded. Skipping dashboard chart initialization.");
    return;
  }

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
            backgroundColor: 'rgba(13, 71, 161, 0.08)',
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
        scales: { y: { grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } }
      }
    });
  }

  if (catCtx) {
    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(catCtx, {
      type: 'doughnut',
      data: {
        labels: ['Wires & Cables', 'Electrical', 'Pumps', 'Solar Solutions', 'Fans', 'Motors'],
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
        cutout: '70%'
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
      <td class="font-poppins font-semibold text-slate-800">${cust.name}</td>
      <td class="font-mono">${cust.phone}</td>
      <td>${cust.email}</td>
      <td>${cust.city}</td>
      <td class="font-mono text-right font-bold text-slate-800">₹${cust.outstanding.toLocaleString('en-IN')}</td>
      <td><span class="status-chip ${cust.status === 'Active' ? 'status-delivered' : 'status-cancelled'}">${cust.status}</span></td>
      <td>
        <button class="text-blue-700 hover:text-blue-900 font-semibold" onclick="viewCustomerLedger('${cust.code}')">View Ledger</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function viewCustomerLedger(code) {
  const cust = state.customers.find(c => c.code === code);
  if(!cust) return;
  alert(`Ledger details for ${cust.name}:\nOutstanding Balance: ₹${cust.outstanding.toLocaleString('en-IN')}\nCredit Limit: ₹${cust.creditLimit.toLocaleString('en-IN')}\nGSTIN: ${cust.gstin}`);
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
      <td class="font-mono font-bold text-slate-800">${order.id}</td>
      <td class="font-poppins font-medium">${order.customer}</td>
      <td class="text-xs text-slate-500 font-mono">${order.date}</td>
      <td class="font-mono font-bold text-slate-700">₹${order.amount.toLocaleString('en-IN')}</td>
      <td><span class="status-chip ${statusClass}">${order.status}</span></td>
      <td><span class="status-chip ${payClass}">${order.paymentStatus}</span></td>
      <td class="flex gap-2">
        <button class="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition" onclick="viewOrderDetailsAdmin('${order.id}')">View</button>
        ${order.status === 'Confirmed' ? `<button class="px-3 py-1.5 text-xs font-semibold bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition" onclick="updateOrderStatus('${order.id}', 'Packed')">Pack</button>` : ''}
        ${order.status === 'Packed' ? `<button class="px-3 py-1.5 text-xs font-semibold bg-teal-100 hover:bg-teal-200 text-teal-700 rounded transition" onclick="updateOrderStatus('${order.id}', 'Dispatched')">Dispatch</button>` : ''}
        ${order.status === 'Dispatched' ? `<button class="px-3 py-1.5 text-xs font-semibold bg-green-100 hover:bg-green-200 text-green-700 rounded transition" onclick="updateOrderStatus('${order.id}', 'Delivered')">Deliver</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function viewOrderDetailsAdmin(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if(!order) return;
  state.selectedOrderId = orderId;
  
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
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) + `, ${now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}`;
  
  order.timeline.push({
    title: `Order ${newStatus}`,
    time: dateStr,
    desc: `Status updated to ${newStatus} in admin console.`
  });

  if(newStatus === 'Delivered') {
    order.paymentStatus = 'Paid';
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
      <td class="font-semibold text-slate-800">${prod.name}</td>
      <td>${prod.category}</td>
      <td class="font-poppins">${prod.brand}</td>
      <td class="font-mono text-xs">${prod.sku}</td>
      <td class="font-mono font-semibold">₹${prod.price.toLocaleString('en-IN')}</td>
      <td class="font-mono text-center font-bold">${prod.stock}</td>
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
    let statusClass = inv.status === 'Paid' ? 'status-delivered' : 'status-pending';
    if(inv.status === 'Overdue') statusClass = 'status-cancelled';

    tr.innerHTML = `
      <td class="font-mono font-bold text-slate-800">${inv.invoiceNo}</td>
      <td class="font-mono text-xs text-slate-500">${inv.orderId}</td>
      <td class="font-poppins font-medium">${inv.customer}</td>
      <td class="text-xs text-slate-500 font-mono">${inv.date}</td>
      <td class="font-mono font-bold text-slate-700">₹${inv.amount.toLocaleString('en-IN')}</td>
      <td><span class="status-chip ${statusClass}">${inv.status}</span></td>
      <td>
        <button class="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition" onclick="simulateInvoicePDF('${inv.invoiceNo}')">PDF</button>
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
        <span class="font-poppins font-semibold text-slate-800">${agt.name}</span>
      </td>
      <td class="font-mono text-sm">${agt.phone}</td>
      <td>${agt.area}</td>
      <td class="font-mono text-right text-rose-700 font-semibold">₹${agt.pending.toLocaleString('en-IN')}</td>
      <td class="font-mono text-right text-emerald-700 font-bold">₹${agt.collected.toLocaleString('en-IN')}</td>
      <td>
        <div class="flex items-center gap-2">
          <div class="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-indigo-600 h-full rounded-full" style="width: ${Math.min(completionPercent, 100)}%"></div>
          </div>
          <span class="text-xs font-bold font-mono">${completionPercent}%</span>
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
      <td class="font-mono font-bold text-slate-800">${col.id}</td>
      <td class="font-poppins">${col.agent}</td>
      <td class="font-poppins font-medium text-slate-700">${col.customer}</td>
      <td class="font-mono font-bold text-slate-800">₹${col.amount.toLocaleString('en-IN')}</td>
      <td class="text-xs text-slate-500 font-mono">${col.date}</td>
      <td><span class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold font-poppins">${col.mode}</span></td>
      <td class="font-mono text-xs text-slate-400">${col.reference}</td>
      <td><span class="status-chip ${statusClass}">${col.status}</span></td>
      <td>
        ${col.status === 'Pending Verification' ? `<button class="px-3 py-1.5 text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded transition" onclick="verifyCollection('${col.id}')">Verify</button>` : `<span class="text-xs text-emerald-600 font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-sm">verified</span> Verified</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function verifyCollection(colId) {
  const col = state.collections.find(c => c.id === colId);
  if(!col) return;
  col.status = 'Cleared';
  
  const dealer = state.customers.find(c => c.name === col.customer);
  if(dealer) {
    dealer.outstanding = Math.max(0, dealer.outstanding - col.amount);
  }
  
  const agent = state.agents.find(a => a.name === col.agent);
  if(agent) {
    agent.collected += col.amount;
    agent.pending = Math.max(0, agent.pending - col.amount);
  }

  saveState();
  populateAdminCollections();
  showToast(`Collection receipt ${colId} verified and cleared!`, 'success');
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
  }, 1500);
}

function populateAdminSettings() {
  const tbody = document.getElementById('admin-users-tbody');
  tbody.innerHTML = '';
  state.adminUsers.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-poppins font-semibold text-slate-800">${user.name}</td>
      <td class="font-mono text-sm">${user.email}</td>
      <td><span class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold font-poppins">${user.role}</span></td>
      <td><span class="status-chip ${user.status === 'Active' ? 'status-delivered' : 'status-cancelled'}">${user.status}</span></td>
      <td class="font-mono text-xs text-slate-500">${user.lastLogin}</td>
      <td>
        <button class="text-blue-700 hover:text-blue-900 font-semibold" onclick="editAdminUserSim('${user.email}')">Edit</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editAdminUserSim(email) {
  alert(`Edit details for user: ${email}`);
}

function openAddModal(type) {
  const overlay = document.createElement('div');
  overlay.className = 'jtc-dialog-overlay';
  overlay.id = 'add-modal-overlay';
  
  let modalHtml = '';
  if (type === 'customer') {
    modalHtml = `
      <div class="jtc-dialog">
        <h3 class="text-lg font-bold font-poppins text-slate-800 mb-6">Add New B2B Dealer</h3>
        <div class="flex flex-col gap-4">
          <input type="text" id="new-cust-name" class="jtc-input" placeholder="Dealer / Firm Name"/>
          <input type="text" id="new-cust-phone" class="jtc-input" placeholder="Mobile Number"/>
          <input type="text" id="new-cust-email" class="jtc-input" placeholder="Email Address"/>
          <input type="text" id="new-cust-gst" class="jtc-input" placeholder="GSTIN No"/>
          <input type="text" id="new-cust-city" class="jtc-input" placeholder="City Hub"/>
          <input type="number" id="new-cust-limit" class="jtc-input" placeholder="Credit Limit (₹)" value="500000"/>
        </div>
        <div class="flex gap-4 mt-8">
          <button class="btn-primary flex-1" onclick="saveNewCustomer()">Save Dealer</button>
          <button class="btn-secondary flex-1" onclick="closeAddModal()">Cancel</button>
        </div>
      </div>
    `;
  } else if (type === 'product') {
    modalHtml = `
      <div class="jtc-dialog">
        <h3 class="text-lg font-bold font-poppins text-slate-800 mb-6">Add Stock Product</h3>
        <div class="flex flex-col gap-4">
          <input type="text" id="new-prod-name" class="jtc-input" placeholder="Product Name"/>
          <input type="text" id="new-prod-category" class="jtc-input" placeholder="Category (e.g. Wires & Cables)"/>
          <input type="text" id="new-prod-brand" class="jtc-input" placeholder="Brand Name"/>
          <input type="text" id="new-prod-sku" class="jtc-input" placeholder="SKU Code"/>
          <input type="number" id="new-prod-price" class="jtc-input" placeholder="Price per Unit (₹)"/>
          <input type="number" id="new-prod-stock" class="jtc-input" placeholder="Initial Stock Qty"/>
        </div>
        <div class="flex gap-4 mt-8">
          <button class="btn-primary flex-1" onclick="saveNewProduct()">Add Product</button>
          <button class="btn-secondary flex-1" onclick="closeAddModal()">Cancel</button>
        </div>
      </div>
    `;
  } else if (type === 'agent') {
    modalHtml = `
      <div class="jtc-dialog">
        <h3 class="text-lg font-bold font-poppins text-slate-800 mb-6">Assign Collection Agent</h3>
        <div class="flex flex-col gap-4">
          <input type="text" id="new-agt-name" class="jtc-input" placeholder="Agent Name"/>
          <input type="text" id="new-agt-phone" class="jtc-input" placeholder="Phone Number"/>
          <input type="text" id="new-agt-area" class="jtc-input" placeholder="Assigned Territory"/>
          <input type="number" id="new-agt-target" class="jtc-input" placeholder="Monthly Target (₹)" value="300000"/>
        </div>
        <div class="flex gap-4 mt-8">
          <button class="btn-primary flex-1" onclick="saveNewAgent()">Assign Agent</button>
          <button class="btn-secondary flex-1" onclick="closeAddModal()">Cancel</button>
        </div>
      </div>
    `;
  } else if (type === 'user') {
    modalHtml = `
      <div class="jtc-dialog">
        <h3 class="text-lg font-bold font-poppins text-slate-800 mb-6">Add Admin User</h3>
        <div class="flex flex-col gap-4">
          <input type="text" id="new-user-name" class="jtc-input" placeholder="Full Name"/>
          <input type="text" id="new-user-email" class="jtc-input" placeholder="Email Address"/>
          <select id="new-user-role" class="jtc-input">
            <option value="Super Admin">Super Admin</option>
            <option value="Manager">Manager</option>
            <option value="Sales Executive">Sales Executive</option>
            <option value="Accounts">Accounts</option>
            <option value="Store Manager">Store Manager</option>
          </select>
        </div>
        <div class="flex gap-4 mt-8">
          <button class="btn-primary flex-1" onclick="saveNewAdminUser()">Add User</button>
          <button class="btn-secondary flex-1" onclick="closeAddModal()">Cancel</button>
        </div>
      </div>
    `;
  }
  
  overlay.innerHTML = modalHtml;
  document.body.appendChild(overlay);
}

function closeAddModal() {
  const modal = document.getElementById('add-modal-overlay');
  if (modal) modal.remove();
}

function saveNewCustomer() {
  const name = document.getElementById('new-cust-name').value;
  const phone = document.getElementById('new-cust-phone').value;
  const email = document.getElementById('new-cust-email').value;
  const gstin = document.getElementById('new-cust-gst').value;
  const city = document.getElementById('new-cust-city').value;
  const limit = parseFloat(document.getElementById('new-cust-limit').value);

  if(!name || !phone || !email) {
    showToast("Please enter all required dealer details", "error");
    return;
  }

  state.customers.push({
    code: "JTCDE0" + Math.floor(100 + Math.random() * 900),
    name, owner: name, phone, email, address: `${city}, Uttar Pradesh`,
    gstin, creditLimit: limit, outstanding: 0, status: "Active", city
  });

  saveState();
  populateAdminCustomers();
  closeAddModal();
  showToast("New dealer account registered!", "success");
}

function saveNewProduct() {
  const name = document.getElementById('new-prod-name').value;
  const category = document.getElementById('new-prod-category').value;
  const brand = document.getElementById('new-prod-brand').value;
  const sku = document.getElementById('new-prod-sku').value;
  const price = parseFloat(document.getElementById('new-prod-price').value);
  const stock = parseInt(document.getElementById('new-prod-stock').value);

  if(!name || !category || !price) {
    showToast("Please enter all required product fields", "error");
    return;
  }

  state.products.push({
    id: "PROD" + Math.floor(100 + Math.random() * 900),
    name, category, brand, sku, price, stock, unit: "Piece",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=60",
    specs: "Added in admin interface", minOrder: 1
  });

  saveState();
  populateAdminProducts();
  closeAddModal();
  showToast("Product added to stock ledger!", "success");
}

function saveNewAgent() {
  const name = document.getElementById('new-agt-name').value;
  const phone = document.getElementById('new-agt-phone').value;
  const area = document.getElementById('new-agt-area').value;
  const target = parseFloat(document.getElementById('new-agt-target').value);

  if(!name || !phone || !area) {
    showToast("Please fill agent details", "error");
    return;
  }

  state.agents.push({
    id: "AGT" + Math.floor(100 + Math.random() * 900),
    name, phone, area, pending: 0, collected: 0, status: "Active", target,
    todayFirms: [],
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"
  });

  saveState();
  populateAdminAgents();
  closeAddModal();
  showToast("Collection agent roster updated!", "success");
}

function saveNewAdminUser() {
  const name = document.getElementById('new-user-name').value;
  const email = document.getElementById('new-user-email').value;
  const role = document.getElementById('new-user-role').value;

  if(!name || !email) {
    showToast("Name and email are required", "error");
    return;
  }

  state.adminUsers.push({
    name, email, role, status: "Active", lastLogin: "Never logged in"
  });

  saveState();
  populateAdminSettings();
  closeAddModal();
  showToast("Admin account user added!", "success");
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
          <div class="text-xs font-bold text-blue-900 tracking-wider uppercase font-poppins">Jain Trading Corporation</div>
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
          <span class="text-slate-800 font-mono"><strong>Order Ref:</strong> ${inv.orderId}</span>
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
  
  // Skeleton Loading Shimmer Simulation
  const screenArea = document.getElementById('customer-screen-area');
  screenArea.innerHTML = `
    <div class="flex flex-col gap-4 py-8">
      <div class="shimmer-loader h-12 w-3/4 rounded-lg"></div>
      <div class="shimmer-loader h-36 w-full rounded-2xl"></div>
      <div class="shimmer-loader h-20 w-full rounded-xl"></div>
      <div class="shimmer-loader h-20 w-full rounded-xl"></div>
    </div>
  `;
  
  setTimeout(() => {
    renderCustomerApp();
  }, 250); // Fluid loader delay
}

function renderCustomerApp() {
  const container = document.getElementById('customer-screen-area');
  container.innerHTML = '';
  
  // Transition Wrapper for slide effects
  const wrap = document.createElement('div');
  wrap.className = 'animate-slide-in';

  if(state.customerScreen === 'welcome') {
    wrap.innerHTML = generateCustomerWelcomeUI();
  } else if (state.customerScreen === 'login') {
    wrap.innerHTML = generateCustomerLoginUI();
  } else if (state.customerScreen === 'home') {
    wrap.innerHTML = generateCustomerHomeUI();
  } else if (state.customerScreen === 'categories') {
    wrap.innerHTML = generateCustomerCategoriesUI();
  } else if (state.customerScreen === 'listing') {
    wrap.innerHTML = generateCustomerListingUI();
  } else if (state.customerScreen === 'details') {
    wrap.innerHTML = generateCustomerDetailsUI();
  } else if (state.customerScreen === 'cart') {
    wrap.innerHTML = generateCustomerCartUI();
  } else if (state.customerScreen === 'confirmation') {
    wrap.innerHTML = generateCustomerConfirmationUI();
    startBookingCountdown();
  } else if (state.customerScreen === 'invoices') {
    wrap.innerHTML = generateCustomerInvoicesUI();
  } else if (state.customerScreen === 'dispatch') {
    wrap.innerHTML = generateCustomerDispatchUI();
  } else if (state.customerScreen === 'profile') {
    wrap.innerHTML = generateCustomerProfileUI();
  } else if (state.customerScreen === 'pricelist') {
    wrap.innerHTML = generateCustomerPriceListUI();
  } else if (state.customerScreen === 'support') {
    wrap.innerHTML = generateCustomerSupportUI();
  } else if (state.customerScreen === 'schemes') {
    wrap.innerHTML = generateCustomerSchemesUI();
  } else if (state.customerScreen === 'helpfaq') {
    wrap.innerHTML = generateCustomerHelpFAQUI();
  }

  container.appendChild(wrap);

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
                     (screen === 'profile' && ['profile', 'pricelist', 'support', 'schemes', 'helpfaq'].includes(state.customerScreen));
    if(isActive) {
      tab.classList.add('text-blue-900', 'font-semibold');
      tab.classList.remove('text-slate-400');
    } else {
      tab.classList.remove('text-blue-900', 'font-semibold');
      tab.classList.add('text-slate-400');
    }
  });
}

function generateCustomerWelcomeUI() {
  return `
    <div class="h-full flex flex-col justify-between py-8 px-2 text-center">
      <div class="mt-6 flex flex-col items-center">
        <div class="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mb-4 shadow-lg">
          <span class="material-symbols-outlined text-white text-3xl">electric_bolt</span>
        </div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">JAIN TRADING</h1>
        <p class="text-xs font-bold text-blue-900 tracking-widest uppercase">CORPORATION</p>
        <p class="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Industrial & Electrical Distributor</p>
      </div>

      <div class="my-4">
        <img class="w-full max-h-48 object-contain rounded-2xl" src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&auto=format&fit=crop&q=60" alt="Warehouse logistics"/>
      </div>

      <div class="flex flex-col gap-3">
        <h2 class="text-base font-bold text-slate-700">Enterprise B2B Hub</h2>
        <p class="text-[11px] text-slate-500 px-2 leading-relaxed">Book bulk inventory, track logistics timeline, view statements, and manage account payments with SAP ledger sync.</p>
        <button class="btn-primary mt-2 h-12 text-sm rounded-xl" onclick="navigateCustomer('login')">Get Started</button>
      </div>
    </div>
  `;
}

function generateCustomerLoginUI() {
  return `
    <div class="h-full flex flex-col justify-between py-6 px-2">
      <div>
        <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mt-2 mb-6" onclick="navigateCustomer('welcome')">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
        </button>
        <h2 class="text-xl font-bold text-slate-800">Welcome Back!</h2>
        <p class="text-xs text-slate-400 mt-1">Sign in to your dealer/distributor account</p>

        <div class="flex flex-col gap-4 mt-8">
          <div>
            <label class="text-[10px] font-bold text-slate-600 block mb-1.5 uppercase">Mobile Number</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">phone_iphone</span>
              <input type="text" class="jtc-input pl-12 h-12 text-sm" id="cust-phone-input" placeholder="+91 98765 43210" value="9876543210"/>
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-600 block mb-1.5 uppercase">Security PIN / Password</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
              <input type="password" class="jtc-input pl-12 h-12 text-sm" id="cust-pwd-input" placeholder="••••••" value="123456"/>
            </div>
          </div>
          <div class="flex justify-between items-center text-xs text-slate-500 mt-2">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked /> Remember me
            </label>
            <a href="#" class="text-blue-900 font-semibold">Forgot PIN?</a>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 mt-8">
        <button class="btn-primary h-12 text-sm rounded-xl" onclick="loginCustomerSim()">Login Account</button>
        <p class="text-center text-[11px] text-slate-400">Don't have an account? <a href="#" class="text-blue-900 font-bold">Apply</a></p>
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
  const dues = state.customerUser.outstanding;
  const limit = state.customerUser.creditLimit;
  const available = limit - dues;
  
  return `
    <div class="flex flex-col gap-4">
      <!-- App Header -->
      <div class="flex justify-between items-center bg-blue-900 -mx-4 px-4 py-4 pt-10 text-white rounded-b-3xl shadow-md">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span class="material-symbols-outlined text-sm text-white">store</span>
          </div>
          <div>
            <div class="text-[9px] text-blue-200 font-bold uppercase tracking-wider">JTC B2B Portal</div>
            <div class="text-xs font-semibold font-poppins">${state.customerUser.name}</div>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center" onclick="navigateCustomer('invoices')">
            <span class="material-symbols-outlined text-lg">receipt_long</span>
          </button>
          <button class="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center" onclick="showToast('No new alerts.')">
            <span class="material-symbols-outlined text-lg">notifications</span>
            <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <!-- Financial Card -->
      <div class="bg-gradient-to-br from-blue-950 to-blue-800 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
        <div class="absolute -right-8 -bottom-8 w-28 h-28 bg-white/5 rounded-full"></div>
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[9px] text-blue-200 block uppercase font-bold tracking-widest">Outstanding Dues</span>
            <strong class="text-xl font-mono block mt-1">₹${dues.toLocaleString('en-IN')}</strong>
          </div>
          <button class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold rounded-lg text-[10px]" onclick="navigateCustomer('invoices')">Pay Dues</button>
        </div>
        <div class="border-t border-white/10 my-3"></div>
        <div class="grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <span class="text-blue-200 block text-[8px] uppercase">Credit Limit</span>
            <span class="font-mono font-bold">₹${limit.toLocaleString('en-IN')}</span>
          </div>
          <div class="text-right">
            <span class="text-blue-200 block text-[8px] uppercase">Available Bal</span>
            <span class="font-mono font-bold text-emerald-300">₹${available.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div>
        <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Actions</h3>
        <div class="grid grid-cols-4 gap-2">
          <button class="bg-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 hover:border-blue-200" onclick="navigateCustomer('categories')">
            <span class="material-symbols-outlined text-blue-900 text-lg mb-1">shopping_basket</span>
            <span class="text-[9px] font-semibold text-slate-600 leading-none">Order Stock</span>
          </button>
          <button class="bg-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 hover:border-blue-200" onclick="navigateCustomer('pricelist')">
            <span class="material-symbols-outlined text-blue-900 text-lg mb-1">download_file</span>
            <span class="text-[9px] font-semibold text-slate-600 leading-none">Price List</span>
          </button>
          <button class="bg-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 hover:border-blue-200" onclick="navigateCustomer('schemes')">
            <span class="material-symbols-outlined text-blue-900 text-lg mb-1">percent</span>
            <span class="text-[9px] font-semibold text-slate-600 leading-none">Schemes</span>
          </button>
          <button class="bg-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 hover:border-blue-200" onclick="navigateCustomer('support')">
            <span class="material-symbols-outlined text-blue-900 text-lg mb-1">support</span>
            <span class="text-[9px] font-semibold text-slate-600 leading-none">Support</span>
          </button>
        </div>
      </div>

      <!-- Top Brands Slider -->
      <div>
        <div class="flex justify-between items-center mb-1">
          <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Brands</h3>
          <button class="text-[10px] text-blue-900 font-bold" onclick="navigateCustomer('categories')">View All</button>
        </div>
        <div class="brand-slider">
          <div class="brand-card cursor-pointer" onclick="selectCategorySim('Wires & Cables')">
            <span class="font-bold text-blue-900 font-poppins text-sm">KEI</span>
            <span class="text-[8px] text-slate-400">Wires</span>
          </div>
          <div class="brand-card cursor-pointer" onclick="selectCategorySim('Wires & Cables')">
            <span class="font-bold text-blue-900 font-poppins text-sm">Polycab</span>
            <span class="text-[8px] text-slate-400">Cables</span>
          </div>
          <div class="brand-card cursor-pointer" onclick="selectCategorySim('Fans')">
            <span class="font-bold text-blue-900 font-poppins text-sm">Crompton</span>
            <span class="text-[8px] text-slate-400">Fans</span>
          </div>
          <div class="brand-card cursor-pointer" onclick="selectCategorySim('Pumps')">
            <span class="font-bold text-blue-900 font-poppins text-sm">Kirloskar</span>
            <span class="text-[8px] text-slate-400">Pumps</span>
          </div>
        </div>
      </div>

      <!-- Recent Orders List -->
      <div>
        <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Bookings</h3>
        <div class="flex flex-col gap-2">
          ${state.orders.slice(0, 3).map(o => {
            let statusColor = 'text-amber-500 bg-amber-50';
            if(o.status === 'Delivered') statusColor = 'text-green-600 bg-green-50';
            if(o.status === 'Confirmed') statusColor = 'text-blue-600 bg-blue-50';
            if(o.status === 'Packed') statusColor = 'text-purple-600 bg-purple-50';
            if(o.status === 'Dispatched') statusColor = 'text-teal-600 bg-teal-50';
            
            return `
              <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-blue-200 transition" onclick="viewOrderTimelineSim('${o.id}')">
                <div>
                  <div class="text-[11px] font-mono font-bold text-slate-800">${o.id}</div>
                  <div class="text-[9px] text-slate-400 font-mono mt-0.5">${o.date}</div>
                  <div class="flex items-center gap-1.5 mt-1.5">
                    <span class="text-[9px] px-1.5 py-0.5 rounded ${statusColor} font-semibold">${o.status}</span>
                    <span class="text-[10px] text-slate-500 font-mono font-bold">₹${o.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <span class="material-symbols-outlined text-slate-300 text-base">chevron_right</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function generateCustomerCategoriesUI() {
  const categories = [...new Set(state.products.map(p => p.category))];
  return `
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center mt-2">
        <h2 class="text-base font-bold text-slate-800">Product Categories</h2>
        <button class="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('cart')">
          <span class="material-symbols-outlined text-lg">shopping_cart</span>
          ${state.customerCart.length > 0 ? `<span class="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">${state.customerCart.reduce((s,i)=>s+i.qty,0)}</span>` : ''}
        </button>
      </div>

      <div class="relative">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
        <input type="text" class="jtc-input pl-10 h-10 text-xs" placeholder="Search categories or products..."/>
      </div>

      <div class="grid grid-cols-3 gap-2">
        ${categories.map(cat => {
          let icon = 'cable';
          if(cat === 'Fans') icon = 'mode_fan';
          if(cat === 'Pumps') icon = 'water_pump';
          if(cat === 'Solar Solutions') icon = 'solar_power';
          if(cat === 'Electrical') icon = 'bolt';
          if(cat === 'Switchgears') icon = 'settings_input_composite';
          if(cat === 'Lighting') icon = 'lightbulb';
          if(cat === 'Motors') icon = 'settings';
          if(cat === 'Industrial Products') icon = 'engineering';
          if(cat === 'Modular & Accessories') icon = 'toggle_off';
          if(cat === 'Cable Management') icon = 'list_alt';
          if(cat === 'Generators') icon = 'electric_car';

          const count = state.products.filter(p => p.category === cat).length;

          return `
            <div class="bg-white rounded-xl p-2.5 shadow-sm border border-slate-100 flex flex-col justify-between h-24 cursor-pointer hover:border-blue-300 transition" onclick="selectCategorySim('${cat}')">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-900">
                <span class="material-symbols-outlined text-base">${icon}</span>
              </div>
              <div>
                <h4 class="text-[9px] font-bold text-slate-800 leading-tight">${cat}</h4>
                <p class="text-[8px] text-slate-400 mt-0.5">${count} Items</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="p-3 bg-blue-550 bg-slate-50 border border-slate-200 rounded-xl mt-2 flex items-center justify-between text-xs">
        <div>
          <strong class="text-slate-800 block text-[10px]">Can't find what you need?</strong>
          <span class="text-slate-500 text-[9px]">Request custom stock quote</span>
        </div>
        <button class="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-[9px] font-semibold" onclick="showToast('Custom quote request sent!', 'success')">Request</button>
      </div>
    </div>
  `;
}

function generateCustomerListingUI() {
  const filtered = state.products.filter(p => p.category === state.selectedCategory);
  return `
    <div>
      <div class="flex items-center justify-between mb-4 mt-2">
        <div class="flex items-center gap-2">
          <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('categories')">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <h2 class="text-sm font-bold text-slate-800">${state.selectedCategory}</h2>
        </div>
        <button class="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('cart')">
          <span class="material-symbols-outlined text-lg">shopping_cart</span>
          ${state.customerCart.length > 0 ? `<span class="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">${state.customerCart.reduce((s,i)=>s+i.qty,0)}</span>` : ''}
        </button>
      </div>

      <div class="flex flex-col gap-2.5">
        ${filtered.map(prod => {
          return `
            <div class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex gap-3 hover:border-blue-300 transition">
              <img class="w-14 h-14 rounded-lg object-cover bg-slate-50 border border-slate-100" src="${prod.image}" alt="${prod.name}"/>
              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <h4 class="text-[11px] font-bold text-slate-800 leading-snug cursor-pointer" onclick="viewProductDetailsSim('${prod.id}')">${prod.name}</h4>
                  <p class="text-[9px] text-slate-400 font-mono mt-0.5">MOQ: ${prod.minOrder} • Stock: ${prod.stock}</p>
                </div>
                <div class="flex justify-between items-center mt-2.5">
                  <span class="text-xs font-mono font-bold text-slate-800">₹${prod.price.toLocaleString('en-IN')} <span class="text-[8px] font-sans text-slate-400 font-normal">/${prod.unit}</span></span>
                  <button class="px-3 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded-md text-[9px] font-bold transition" onclick="addToCartSim('${prod.id}')">Add</button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function generateCustomerDetailsUI() {
  const prod = state.products.find(p => p.id === state.selectedProductId);
  if(!prod) return '';

  return `
    <div class="flex flex-col justify-between h-full">
      <div>
        <div class="flex items-center justify-between mb-4 mt-2">
          <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('listing')">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <h2 class="text-xs font-bold text-slate-700">Specification details</h2>
          <button class="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('cart')">
            <span class="material-symbols-outlined text-lg">shopping_cart</span>
          </button>
        </div>

        <img class="w-full h-40 object-cover rounded-xl mb-4 bg-slate-50 border border-slate-100" src="${prod.image}" alt="${prod.name}"/>

        <div class="flex justify-between items-start mb-2">
          <span class="px-2 py-0.5 bg-blue-50 text-blue-900 rounded font-bold text-[9px] uppercase tracking-wider">${prod.brand}</span>
          <span class="text-[9px] font-mono text-slate-400">SKU: ${prod.sku}</span>
        </div>
        <h3 class="text-xs font-bold text-slate-800 leading-snug">${prod.name}</h3>
        
        <div class="mt-4 border-t border-slate-100 pt-3">
          <h4 class="text-[10px] font-bold text-slate-700 mb-1.5 uppercase">Specifications</h4>
          <p class="text-[10px] text-slate-500 font-poppins leading-relaxed">${prod.specs}</p>
        </div>

        <div class="mt-4 border-t border-slate-100 pt-3">
          <h4 class="text-[10px] font-bold text-slate-700 mb-1.5 uppercase">B2B Order Options</h4>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="bg-slate-50 p-2 rounded-lg text-center">
              <span class="text-slate-400 text-[8px] block font-bold uppercase">MIN ORDER QTY</span>
              <strong class="text-slate-700 font-mono text-xs">${prod.minOrder} ${prod.unit}s</strong>
            </div>
            <div class="bg-slate-50 p-2 rounded-lg text-center">
              <span class="text-slate-400 text-[8px] block font-bold uppercase">UNIT PRICE</span>
              <strong class="text-slate-700 font-mono text-xs">₹${prod.price.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 mt-6 pb-4">
        <div class="flex-1">
          <span class="text-[9px] text-slate-400 block uppercase font-bold">Total price (Est)</span>
          <strong class="text-sm font-mono text-slate-800 block mt-0.5">₹${(prod.price * prod.minOrder).toLocaleString('en-IN')}</strong>
        </div>
        <button class="btn-primary h-11 flex-1 text-xs font-semibold rounded-xl" onclick="addToCartSim('${prod.id}'); navigateCustomer('cart')">Book Stock</button>
      </div>
    </div>
  `;
}

function generateCustomerCartUI() {
  const subtotal = state.customerCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return `
    <div class="flex flex-col justify-between h-full">
      <div>
        <div class="flex items-center gap-2 mb-4 mt-2">
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
          <div class="flex flex-col gap-2.5">
            ${state.customerCart.map((item, idx) => {
              return `
                <div class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex justify-between items-center">
                  <div class="flex-1 pr-4">
                    <h4 class="text-[11px] font-bold text-slate-800 leading-tight">${item.name}</h4>
                    <span class="text-[9px] text-slate-400 font-mono mt-1 block">₹${item.price.toLocaleString('en-IN')} / ${item.unit}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button class="w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold text-xs" onclick="adjustCartQty(${idx}, -1)">-</button>
                    <span class="font-mono font-bold text-xs w-6 text-center">${item.qty}</span>
                    <button class="w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold text-xs" onclick="adjustCartQty(${idx}, 1)">+</button>
                  </div>
                </div>
              `;
            }).join('')}

            <div class="mt-4 border-t border-dashed border-slate-200 pt-3 text-[11px] flex flex-col gap-1.5 text-slate-600">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span class="font-mono">₹${subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between">
                <span>GST (18%)</span>
                <span class="font-mono">₹${gst.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between text-slate-800 font-bold text-xs border-t border-slate-100 pt-2.5 mt-1">
                <span>Total amount</span>
                <span class="font-mono text-blue-900 text-sm font-bold">₹${total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        `}
      </div>

      ${state.customerCart.length > 0 ? `
        <div class="pt-6 pb-4">
          <button class="btn-primary w-full text-xs font-semibold rounded-xl h-11" onclick="placeOrderCustomerSim()">Book Order (24 Hr Hold)</button>
        </div>
      ` : ''}
    </div>
  `;
}

function generateCustomerPriceListUI() {
  return `
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2 mb-2 mt-2">
        <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('profile')">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
        </button>
        <h2 class="text-base font-bold text-slate-800">Distributor Price List</h2>
      </div>
      
      <p class="text-[11px] text-slate-500 leading-relaxed">Download current verified distributor pricing catalogs (PDF) directly synced from Zoho Inventory database.</p>

      <div class="flex flex-col gap-2.5 mt-2">
        <div class="bg-white p-3.5 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
          <div>
            <strong class="text-xs text-slate-800 block">Wires & Cables Price List</strong>
            <span class="text-[9px] text-slate-400 font-mono block mt-0.5">Updated: Today, 08:30 AM</span>
          </div>
          <button class="w-8 h-8 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center hover:bg-blue-100 transition" onclick="showToast('Price catalog PDF download started!', 'success')">
            <span class="material-symbols-outlined text-sm">download</span>
          </button>
        </div>

        <div class="bg-white p-3.5 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
          <div>
            <strong class="text-xs text-slate-800 block">Crompton Fans Catalog</strong>
            <span class="text-[9px] text-slate-400 font-mono block mt-0.5">Updated: 10 May 2024</span>
          </div>
          <button class="w-8 h-8 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center hover:bg-blue-100 transition" onclick="showToast('Catalog download started!', 'success')">
            <span class="material-symbols-outlined text-sm">download</span>
          </button>
        </div>

        <div class="bg-white p-3.5 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
          <div>
            <strong class="text-xs text-slate-800 block">Kirloskar Pumps Pricing</strong>
            <span class="text-[9px] text-slate-400 font-mono block mt-0.5">Updated: 01 May 2024</span>
          </div>
          <button class="w-8 h-8 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center hover:bg-blue-100 transition" onclick="showToast('Catalog download started!', 'success')">
            <span class="material-symbols-outlined text-sm">download</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function generateCustomerSupportUI() {
  return `
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2 mb-2 mt-2">
        <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('profile')">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
        </button>
        <h2 class="text-base font-bold text-slate-800">Support Desk</h2>
      </div>
      
      <p class="text-[11px] text-slate-500 leading-relaxed">Submit a ticket regarding stock delivery, ledger disputes, or sync errors directly to accounts.</p>

      <div class="flex flex-col gap-3.5 mt-2">
        <div>
          <label class="text-[9px] font-bold text-slate-600 block mb-1 uppercase">Ticket Category</label>
          <select class="jtc-input h-11 text-xs" id="support-category">
            <option>Dispatch / Delivery delay</option>
            <option>Ledger Reconcile Dispute</option>
            <option>Product Defect / Return</option>
            <option>Credit Limit Upgrade</option>
          </select>
        </div>
        <div>
          <label class="text-[9px] font-bold text-slate-600 block mb-1 uppercase">Order Reference (Optional)</label>
          <input type="text" class="jtc-input h-11 text-xs font-mono" id="support-ref" placeholder="e.g. JTCORD2405132"/>
        </div>
        <div>
          <label class="text-[9px] font-bold text-slate-600 block mb-1 uppercase">Message / Issue Details</label>
          <textarea class="jtc-input p-3 text-xs min-h-[80px]" id="support-msg" placeholder="Describe your issue..."></textarea>
        </div>
        
        <button class="btn-primary h-11 text-xs font-semibold rounded-xl mt-2" onclick="submitTicketSim()">Submit Ticket</button>
      </div>
    </div>
  `;
}

function submitTicketSim() {
  const cat = document.getElementById('support-category').value;
  const msg = document.getElementById('support-msg').value;

  if(!msg) {
    showToast("Please provide details for the ticket", "error");
    return;
  }

  showToast(`Ticket logged under: ${cat}. Accounts team will contact you.`, "success");
  navigateCustomer('home');
}

function generateCustomerSchemesUI() {
  return `
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2 mb-2 mt-2">
        <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('home')">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
        </button>
        <h2 class="text-base font-bold text-slate-800">B2B Schemes & Offers</h2>
      </div>

      <p class="text-[11px] text-slate-500 leading-relaxed">Book orders matching below schemes to receive cashbacks, credit offsets, or bulk discounts.</p>

      <div class="flex flex-col gap-3 mt-2">
        <div class="bg-gradient-to-r from-orange-550 from-amber-500 to-amber-600 p-4 rounded-2xl text-white shadow-sm relative overflow-hidden">
          <span class="px-2 py-0.5 bg-white/20 rounded text-[9px] uppercase font-bold tracking-wider">Mega Saver Offer</span>
          <strong class="text-sm block mt-2 font-poppins">Upto 15% Off Wires & Cables</strong>
          <p class="text-[9px] text-amber-100 mt-1 leading-relaxed">Order above 25 rolls of Polycab/KEI wires to trigger automatic credit rebate on invoicing.</p>
          <span class="text-[8px] text-amber-200 block font-mono mt-3 uppercase font-semibold">Valid till: 31 May 2024</span>
        </div>

        <div class="bg-gradient-to-r from-indigo-900 to-indigo-700 p-4 rounded-2xl text-white shadow-sm relative overflow-hidden">
          <span class="px-2 py-0.5 bg-white/20 rounded text-[9px] uppercase font-bold tracking-wider">Crompton Pump Festival</span>
          <strong class="text-sm block mt-2 font-poppins">Flat 10% Off Monoblocks</strong>
          <p class="text-[9px] text-indigo-150 text-indigo-200 mt-1 leading-relaxed">Buy 5 or more Kirloskar/Crompton pumps and get immediate accounts ledger credit notes.</p>
          <span class="text-[8px] text-indigo-300 block font-mono mt-3 uppercase font-semibold">Valid till: 20 May 2024</span>
        </div>
      </div>
    </div>
  `;
}

function generateCustomerHelpFAQUI() {
  return `
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2 mb-2 mt-2">
        <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700" onclick="navigateCustomer('profile')">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
        </button>
        <h2 class="text-base font-bold text-slate-800">Frequently Asked Questions</h2>
      </div>

      <div class="flex flex-col gap-2.5 mt-2">
        <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <strong class="text-[11px] text-slate-800 block">How can I place an order?</strong>
          <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">Search items, select quantities matching MOQs, add to cart, and book. Stock is reserved at warehouse.</p>
        </div>

        <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <strong class="text-[11px] text-slate-800 block">How long is the stock reserved?</strong>
          <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">B2B reservations remain active for 24 Hours. After that, unpaid pending allocations are automatically released.</p>
        </div>

        <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <strong class="text-[11px] text-slate-800 block">When does ledger reconcile?</strong>
          <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">Online transactions reconcile instantly. Cash/cheque collections sync once verified by admin accounts.</p>
        </div>
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
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.saveNewCustomer = saveNewCustomer;
window.saveNewProduct = saveNewProduct;
window.saveNewAgent = saveNewAgent;
window.saveNewAdminUser = saveNewAdminUser;
window.submitTicketSim = submitTicketSim;

// Load App on Window Load
window.addEventListener('DOMContentLoaded', initApp);
