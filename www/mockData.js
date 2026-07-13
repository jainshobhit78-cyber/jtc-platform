// JTC Enterprise B2B Platform - Expanded Mock Database

const initialProducts = [
  // 1. Wires & Cables
  {
    id: "PROD001",
    name: "KEI FR PVC Copper Wire 1.5 Sqmm - Blue (90m)",
    category: "Wires & Cables",
    brand: "KEI",
    sku: "KEI-15-BL",
    price: 1420.00,
    stock: 250,
    unit: "Roll",
    image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=300&auto=format&fit=crop&q=60",
    specs: "Flame Retardant, 100% Electrolytic Copper, High Conductivity",
    minOrder: 5
  },
  {
    id: "PROD002",
    name: "KEI FR PVC Copper Wire 2.5 Sqmm - Red (90m)",
    category: "Wires & Cables",
    brand: "KEI",
    sku: "KEI-25-RD",
    price: 2450.00,
    stock: 180,
    unit: "Roll",
    image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=300&auto=format&fit=crop&q=60",
    specs: "Flame Retardant, High Tensile Strength, Double Insulated",
    minOrder: 5
  },
  {
    id: "PROD003",
    name: "Polycab Flexible Wire 1 Sqmm - Yellow (90m)",
    category: "Wires & Cables",
    brand: "Polycab",
    sku: "PC-10-YL",
    price: 1210.00,
    stock: 300,
    unit: "Roll",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=60",
    specs: "Highly Flexible, PVC Insulated, Multistrand Copper",
    minOrder: 10
  },
  {
    id: "PROD004",
    name: "Polycab Flexible Wire 1.5 Sqmm - Green (90m)",
    category: "Wires & Cables",
    brand: "Polycab",
    sku: "PC-15-GN",
    price: 1760.00,
    stock: 210,
    unit: "Roll",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=60",
    specs: "Grounding wire, Lead-Free PVC, Eco-friendly",
    minOrder: 10
  },
  // 2. Fans
  {
    id: "PROD005",
    name: "Crompton 1200mm Ceiling Fan - Brown",
    category: "Fans",
    brand: "Crompton",
    sku: "CROM-1200",
    price: 2090.00,
    stock: 154,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1618944847828-82e943c3dba7?w=300&auto=format&fit=crop&q=60",
    specs: "High Speed, Energy Efficient (3-Star), Double Ball Bearing",
    minOrder: 2
  },
  {
    id: "PROD006",
    name: "Crompton 900mm Ceiling Fan - White",
    category: "Fans",
    brand: "Crompton",
    sku: "CROM-900",
    price: 3250.00,
    stock: 120,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1618944847828-82e943c3dba7?w=300&auto=format&fit=crop&q=60",
    specs: "High air delivery, Silent operation, Decorative trim",
    minOrder: 2
  },
  // 3. Pumps
  {
    id: "PROD007",
    name: "Kirloskar 1HP Monoblock Pump - KDS-112",
    category: "Pumps",
    brand: "Kirloskar",
    sku: "KIR-1HP",
    price: 6750.00,
    stock: 85,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=60",
    specs: "1 Horsepower, Iron Body, High flow rate, Continuous duty",
    minOrder: 1
  },
  {
    id: "PROD008",
    name: "Crompton Water Pump - 0.5HP",
    category: "Pumps",
    brand: "Crompton",
    sku: "CROM-WP-05",
    price: 3890.00,
    stock: 95,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=60",
    specs: "Self-priming, Brass impeller, Thermal overload protection",
    minOrder: 1
  },
  // 4. Solar Solutions
  {
    id: "PROD009",
    name: "UTL 330W Solar Panel - Polycrystalline",
    category: "Solar Solutions",
    brand: "UTL",
    sku: "UTL-330",
    price: 8990.00,
    stock: 50,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&auto=format&fit=crop&q=60",
    specs: "High Efficiency Polycrystalline Cells, 25 Years Warranty",
    minOrder: 2
  },
  {
    id: "PROD010",
    name: "Luminous 150Ah Solar Battery - Tubular",
    category: "Solar Solutions",
    brand: "Luminous",
    sku: "LUM-150",
    price: 12450.00,
    stock: 45,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=300&auto=format&fit=crop&q=60",
    specs: "Tubular Plate design, Long backup time, Low maintenance",
    minOrder: 1
  },
  // 5. Lighting
  {
    id: "PROD013",
    name: "Havells 9W LED Bulb - Cool Daylight",
    category: "Lighting",
    brand: "Havells",
    sku: "HAV-LED9",
    price: 95.00,
    stock: 500,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=300&auto=format&fit=crop&q=60",
    specs: "Energy Saver LED Bulbs, B22 Base, 2 Years Warranty",
    minOrder: 50
  },
  // 6. Motors
  {
    id: "PROD014",
    name: "ABB 3-Phase Induction Motor 5HP",
    category: "Motors",
    brand: "ABB",
    sku: "ABB-MOT5",
    price: 18450.00,
    stock: 35,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=60",
    specs: "Industrial Grade, Cast Iron Frame, IP55 Protection",
    minOrder: 1
  },
  // 7. Electrical
  {
    id: "PROD011",
    name: "Havells MCB 16A Single Pole - C Curve",
    category: "Electrical",
    brand: "Havells",
    sku: "HAV-MCB16",
    price: 210.00,
    stock: 320,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=60",
    specs: "Short circuit breaking capacity 10kA, Finger-proof terminals",
    minOrder: 10
  },
  // 8. Industrial Products
  {
    id: "PROD015",
    name: "L&T Heavy Duty Contactor AC3 32A",
    category: "Industrial Products",
    brand: "L&T",
    sku: "LT-CONT32",
    price: 2450.00,
    stock: 65,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=60",
    specs: "3-Pole, auxiliary contacts, robust coil design",
    minOrder: 2
  },
  // 9. Switchgears
  {
    id: "PROD012",
    name: "L&T Switchgears 3 Pole Contactor - 9A",
    category: "Switchgears",
    brand: "L&T",
    sku: "LT-CON9",
    price: 1150.00,
    stock: 88,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=60",
    specs: "AC-3 Duty rating, High electrical lifecycle, Compact design",
    minOrder: 2
  },
  // 10. Modular & Accessories
  {
    id: "PROD016",
    name: "Anchor Roma 6A 1-Way Modular Switch",
    category: "Modular & Accessories",
    brand: "Anchor",
    sku: "ANC-ROM6",
    price: 35.00,
    stock: 1200,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=60",
    specs: "Smooth silent operations, fire retardant polycarbonate",
    minOrder: 100
  },
  // 11. Cable Management
  {
    id: "PROD017",
    name: "Precision PVC Conduit Pipe 25mm (3m)",
    category: "Cable Management",
    brand: "Precision",
    sku: "PREC-CP25",
    price: 65.00,
    stock: 800,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=60",
    specs: "Heavy mechanical stress resistance, non-flammable PVC",
    minOrder: 50
  },
  // 12. Generators
  {
    id: "PROD018",
    name: "Kirloskar Silent Diesel Generator 5kVA",
    category: "Generators",
    brand: "Kirloskar",
    sku: "KIR-GEN5",
    price: 135000.00,
    stock: 8,
    unit: "Piece",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=60",
    specs: "Liquid-cooled, soundproof enclosure, automatic transfer switch",
    minOrder: 1
  }
];

const initialCustomers = [
  {
    code: "JTCDE0245",
    name: "Sharma Electricals",
    owner: "Sharma Electricals",
    phone: "9876543210",
    email: "sharmaelectrics@example.com",
    address: "123, Industrial Area, Kanpur, Uttar Pradesh - 208001",
    gstin: "09ABCD1234F1Z5",
    creditLimit: 500000.00,
    outstanding: 124560.00,
    status: "Active",
    city: "Kanpur"
  },
  {
    code: "JTCDE0189",
    name: "Gupta Enterprises",
    owner: "Gupta Enterprises",
    phone: "9123456780",
    email: "guptaent@example.com",
    address: "45, General Ganj, Kanpur, Uttar Pradesh - 208001",
    gstin: "09EFGH5678G2Z4",
    creditLimit: 300000.00,
    outstanding: 24560.00,
    status: "Active",
    city: "Kanpur"
  },
  {
    code: "JTCDE0344",
    name: "Verma Traders",
    owner: "Verma Traders",
    phone: "9988776655",
    email: "vermatraders@example.com",
    address: "Chowk Bazar, Lucknow, Uttar Pradesh - 226003",
    gstin: "09IJKL9012H3Z3",
    creditLimit: 400000.00,
    outstanding: 18750.00,
    status: "Active",
    city: "Lucknow"
  },
  {
    code: "JTCDE0012",
    name: "Khandelwal & Sons",
    owner: "Khandelwal & Sons",
    phone: "9810233344",
    email: "khandelwals@example.com",
    address: "Naya Ganj, Kanpur, Uttar Pradesh - 208001",
    gstin: "09MNOP3456I4Z2",
    creditLimit: 600000.00,
    outstanding: 31200.00,
    status: "Active",
    city: "Kanpur"
  },
  {
    code: "JTCDE0512",
    name: "Agarwal Electricals",
    owner: "Agarwal Electricals",
    phone: "9899112233",
    email: "agarwalelect@example.com",
    address: "Lajpat Nagar, New Delhi - 110024",
    gstin: "07QRST7890J5Z1",
    creditLimit: 500000.00,
    outstanding: 21320.00,
    status: "Active",
    city: "Delhi"
  },
  {
    code: "JTCDE0088",
    name: "M/S Sharma & Co.",
    owner: "M/S Sharma & Co.",
    phone: "9454667788",
    email: "sharmaco@example.com",
    address: "Civil Lines, Kanpur, Uttar Pradesh - 208001",
    gstin: "09UVWX1234K6Z0",
    creditLimit: 250000.00,
    outstanding: 15600.00,
    status: "Active",
    city: "Kanpur"
  },
  {
    code: "JTCDE0404",
    name: "Jain Hardware",
    owner: "Jain Hardware",
    phone: "9870707070",
    email: "jainhardware@example.com",
    address: "Sadar Bazar, Jhansi, Uttar Pradesh - 284002",
    gstin: "09YZAB5678L7Z9",
    creditLimit: 350000.00,
    outstanding: 9580.00,
    status: "Inactive",
    city: "Jhansi"
  }
];

const initialOrders = [
  {
    id: "JTCORD2405132",
    customer: "Sharma Electricals",
    customerCode: "JTCDE0245",
    date: "12 May 2024 | 09:30 AM",
    amount: 25430.00,
    status: "Confirmed",
    paymentStatus: "Paid",
    items: [
      { productId: "PROD001", name: "KEI FR PVC Copper Wire 1.5 Sqmm - Blue (90m)", qty: 10, price: 1420.00 },
      { productId: "PROD005", name: "Crompton 1200mm Ceiling Fan - Brown", qty: 4, price: 2090.00 },
      { productId: "PROD011", name: "Havells MCB 16A Single Pole", qty: 14, price: 210.00 }
    ],
    timeline: [
      { title: "Order Placed", time: "12 May 2024, 09:30 AM", desc: "Order booked successfully via Customer App." },
      { title: "Order Confirmed", time: "12 May 2024, 11:15 AM", desc: "Stock verification and credit check cleared by ERP." }
    ],
    reservedUntil: "13 May 2024, 09:30 AM",
    remarks: "Deliver at warehouse back door."
  },
  {
    id: "JTCORD2405108",
    customer: "Gupta Enterprises",
    customerCode: "JTCDE0189",
    date: "10 May 2024 | 04:15 PM",
    amount: 18750.00,
    status: "Packed",
    paymentStatus: "Paid",
    items: [
      { productId: "PROD002", name: "KEI FR PVC Copper Wire 2.5 Sqmm - Red (90m)", qty: 5, price: 2450.00 },
      { productId: "PROD008", name: "Crompton Water Pump - 0.5HP", qty: 1, price: 3890.00 },
      { productId: "PROD011", name: "Havells MCB 16A Single Pole", qty: 12, price: 210.00 }
    ],
    timeline: [
      { title: "Order Placed", time: "10 May 2024, 04:15 PM", desc: "Order submitted via Collection Agent App." },
      { title: "Order Confirmed", time: "10 May 2024, 05:45 PM", desc: "Confirmed by accounts department." },
      { title: "Order Packed", time: "11 May 2024, 10:30 AM", desc: "Ready for dispatch at warehouse Bay 4." }
    ],
    dispatchTo: "Kanpur",
    expectedDelivery: "14 May 2024",
    remarks: "Urgently needed for project site."
  },
  {
    id: "JTCORD2405089",
    customer: "Verma Traders",
    customerCode: "JTCDE0344",
    date: "08 May 2024 | 11:20 AM",
    amount: 42860.00,
    status: "Invoice Generated",
    paymentStatus: "Unpaid",
    items: [
      { productId: "PROD007", name: "Kirloskar 1HP Monoblock Pump", qty: 5, price: 6750.00 },
      { productId: "PROD009", name: "UTL 330W Solar Panel", qty: 1, price: 8990.00 },
      { productId: "PROD011", name: "Havells MCB 16A Single Pole", qty: 6, price: 210.00 }
    ],
    timeline: [
      { title: "Order Placed", time: "08 May 2024, 11:20 AM", desc: "Booked via sales portal." },
      { title: "Order Confirmed", time: "08 May 2024, 01:00 PM", desc: "Credit limit verified." },
      { title: "Invoice Generated", time: "09 May 2024, 10:00 AM", desc: "Invoice # INV245089 sent to dealer email." }
    ],
    invoiceNo: "INV245089",
    remarks: "B2B Credit terms apply."
  },
  {
    id: "JTCORD2405062",
    customer: "Agarwal Electricals",
    customerCode: "JTCDE0512",
    date: "06 May 2024 | 10:05 AM",
    amount: 31240.00,
    status: "Delivered",
    paymentStatus: "Paid",
    items: [
      { productId: "PROD003", name: "Polycab Flexible Wire 1 Sqmm - Yellow", qty: 20, price: 1210.00 },
      { productId: "PROD011", name: "Havells MCB 16A Single Pole", qty: 33, price: 210.00 }
    ],
    timeline: [
      { title: "Order Placed", time: "06 May 2024, 10:05 AM", desc: "Order details sent." },
      { title: "Order Confirmed", time: "06 May 2024, 12:30 PM", desc: "Approved." },
      { title: "Dispatched", time: "07 May 2024, 09:00 AM", desc: "Shipped via JTC Logistics Truck UP78-T-4545." },
      { title: "Delivered", time: "07 May 2024, 04:00 PM", desc: "Received and signed by Agarwal Store Manager." }
    ],
    deliveredOn: "07 May 2024",
    remarks: ""
  },
  {
    id: "JTCORD2405031",
    customer: "Jain Hardware",
    customerCode: "JTCDE0404",
    date: "03 May 2024 | 05:45 PM",
    amount: 9560.00,
    status: "Cancelled",
    paymentStatus: "Refunded",
    items: [
      { productId: "PROD004", name: "Polycab Flexible Wire 1.5 Sqmm - Green", qty: 5, price: 1760.00 },
      { productId: "PROD011", name: "Havells MCB 16A Single Pole", qty: 3, price: 210.00 }
    ],
    timeline: [
      { title: "Order Placed", time: "03 May 2024, 05:45 PM", desc: "Order placed." },
      { title: "Cancelled", time: "04 May 2024, 11:00 AM", desc: "Cancelled on customer request. Out of stock on Polycab wires." }
    ],
    cancelledOn: "04 May 2024",
    remarks: "Dealer requested cancellation."
  }
];

const initialInvoices = [
  {
    invoiceNo: "INV245089",
    orderId: "JTCORD2405089",
    customer: "Verma Traders",
    customerCode: "JTCDE0344",
    date: "13 May 2024",
    amount: 42860.00,
    status: "Unpaid"
  },
  {
    invoiceNo: "INV245088",
    orderId: "JTCORD2405132",
    customer: "Sharma Electricals",
    customerCode: "JTCDE0245",
    date: "13 May 2024",
    amount: 25430.00,
    status: "Paid"
  },
  {
    invoiceNo: "INV245087",
    orderId: "JTCORD2405108",
    customer: "Gupta Enterprises",
    customerCode: "JTCDE0189",
    date: "12 May 2024",
    amount: 18750.00,
    status: "Paid"
  },
  {
    invoiceNo: "INV245086",
    orderId: "JTCORD2405062",
    customer: "Agarwal Electricals",
    customerCode: "JTCDE0512",
    date: "11 May 2024",
    amount: 31240.00,
    status: "Paid"
  },
  {
    invoiceNo: "INV245085",
    orderId: "JTCORD2405031",
    customer: "M/S Sharma & Co.",
    customerCode: "JTCDE0088",
    date: "11 May 2024",
    amount: 15600.00,
    status: "Paid"
  },
  {
    invoiceNo: "INV245084",
    orderId: "JTCORD2405011",
    customer: "Jain Hardware",
    customerCode: "JTCDE0404",
    date: "10 May 2024",
    amount: 9580.00,
    status: "Overdue"
  }
];

const initialAgents = [
  {
    id: "AGT001",
    name: "Rohit Kumar",
    phone: "9876843210",
    area: "Kanpur",
    pending: 125430.00,
    collected: 345238.00,
    status: "Active",
    target: 500000.00,
    todayFirms: [
      { name: "Sharma Electricals", due: 124560.00, address: "123, Industrial Area, Kanpur", status: "Pending" },
      { name: "Gupta Enterprises", due: 24560.00, address: "45, General Ganj, Kanpur", status: "Collected", amount: 24560.00, date: "13 May 2024" }
    ],
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "AGT002",
    name: "Amit Verma",
    phone: "9123456790",
    area: "Lucknow",
    pending: 95260.00,
    collected: 315600.00,
    status: "Active",
    target: 400000.00,
    todayFirms: [
      { name: "Verma Traders", due: 18750.00, address: "Chowk Bazar, Lucknow", status: "Pending" }
    ],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "AGT003",
    name: "Sandeep Yadav",
    phone: "9898776655",
    area: "Allahabad",
    pending: 75320.00,
    collected: 185400.00,
    status: "Active",
    target: 300000.00,
    todayFirms: [],
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "AGT004",
    name: "Pawan Tiwari",
    phone: "9810233344",
    area: "Kanpur Dehat",
    pending: 48450.00,
    collected: 145780.00,
    status: "Active",
    target: 250000.00,
    todayFirms: [],
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "AGT005",
    name: "Vikash Singh",
    phone: "9334455667",
    area: "Fatehpur",
    pending: 45200.00,
    collected: 95300.00,
    status: "Inactive",
    target: 200000.00,
    todayFirms: [],
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=60"
  }
];

const initialCollections = [
  {
    id: "COL001",
    agent: "Rohit Kumar",
    customer: "Sharma Electricals",
    amount: 50000.00,
    date: "13 May 2024",
    mode: "Cheque",
    reference: "CHQ564821",
    status: "Pending Verification"
  },
  {
    id: "COL002",
    agent: "Rohit Kumar",
    customer: "Gupta Enterprises",
    amount: 24560.00,
    date: "13 May 2024",
    mode: "UPI",
    reference: "UPI98457221",
    status: "Cleared"
  },
  {
    id: "COL003",
    agent: "Amit Verma",
    customer: "Verma Traders",
    amount: 15000.00,
    date: "12 May 2024",
    mode: "Bank Transfer",
    reference: "TXN548231",
    status: "Cleared"
  },
  {
    id: "COL004",
    agent: "Sandeep Yadav",
    customer: "Agarwal Electricals",
    amount: 21320.00,
    date: "11 May 2024",
    mode: "Cash",
    reference: "CASH-REC098",
    status: "Cleared"
  }
];

const erpSyncLogs = [
  { time: "Just Now", event: "ERP Ledger Sync Completed", type: "Success", details: "7 customer accounts reconciled with SAP S/4HANA" },
  { time: "5 Mins Ago", event: "Inventory Check Success", type: "Success", details: "Product stock synced from Zoho Inventory" },
  { time: "2 Hours Ago", event: "Collection Push", type: "Success", details: "Collection receipts posted to Microsoft Dynamics" },
  { time: "1 Day Ago", event: "Auto Sync Trigger", type: "Warning", details: "Oracle ERP sync connection timeout, retrying... Connected." }
];

const adminUsers = [
  { name: "Admin User", email: "admin@jtc.com", role: "Super Admin", status: "Active", lastLogin: "19 May 2024, 10:30 AM" },
  { name: "Manager User", email: "manager@jtc.com", role: "Manager", status: "Active", lastLogin: "19 May 2024, 09:15 AM" },
  { name: "Sales User", email: "sales@jtc.com", role: "Sales Executive", status: "Active", lastLogin: "18 May 2024, 08:45 AM" },
  { name: "Accounts User", email: "accounts@jtc.com", role: "Accounts", status: "Active", lastLogin: "18 May 2024, 04:20 PM" },
  { name: "Store User", email: "store@jtc.com", role: "Store Manager", status: "Inactive", lastLogin: "17 May 2024, 04:10 PM" }
];

// Helper functions for state updates
const Database = {
  getProducts: () => JSON.parse(localStorage.getItem('jtc_products')) || initialProducts,
  saveProducts: (data) => localStorage.setItem('jtc_products', JSON.stringify(data)),
  
  getCustomers: () => JSON.parse(localStorage.getItem('jtc_customers')) || initialCustomers,
  saveCustomers: (data) => localStorage.setItem('jtc_customers', JSON.stringify(data)),
  
  getOrders: () => JSON.parse(localStorage.getItem('jtc_orders')) || initialOrders,
  saveOrders: (data) => localStorage.setItem('jtc_orders', JSON.stringify(data)),
  
  getInvoices: () => JSON.parse(localStorage.getItem('jtc_invoices')) || initialInvoices,
  saveInvoices: (data) => localStorage.setItem('jtc_invoices', JSON.stringify(data)),
  
  getAgents: () => JSON.parse(localStorage.getItem('jtc_agents')) || initialAgents,
  saveAgents: (data) => localStorage.setItem('jtc_agents', JSON.stringify(data)),
  
  getCollections: () => JSON.parse(localStorage.getItem('jtc_collections')) || initialCollections,
  saveCollections: (data) => localStorage.setItem('jtc_collections', JSON.stringify(data)),
  
  getSyncLogs: () => JSON.parse(localStorage.getItem('jtc_synclogs')) || erpSyncLogs,
  saveSyncLogs: (data) => localStorage.setItem('jtc_synclogs', JSON.stringify(data)),

  getAdminUsers: () => JSON.parse(localStorage.getItem('jtc_adminusers')) || adminUsers,
  saveAdminUsers: (data) => localStorage.setItem('jtc_adminusers', JSON.stringify(data)),

  reset: () => {
    localStorage.removeItem('jtc_products');
    localStorage.removeItem('jtc_customers');
    localStorage.removeItem('jtc_orders');
    localStorage.removeItem('jtc_invoices');
    localStorage.removeItem('jtc_agents');
    localStorage.removeItem('jtc_collections');
    localStorage.removeItem('jtc_synclogs');
    localStorage.removeItem('jtc_adminusers');
    window.location.reload();
  }
};
