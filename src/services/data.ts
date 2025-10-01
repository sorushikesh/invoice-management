export type Customer = {
  id: string;
  tenantId: string;
  name: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export type Tenant = {
  id: string;
  name: string;
  logoUrl?: string;
  brandColor?: string; // hex
  theme?: "light" | "dark";
};

export type CustomerStatus = "Active" | "Inactive";
export type CustomerSize = "Small" | "Medium" | "Enterprise";

export type CustomerContact = {
  id: string;
  name: string;
  role?: string;
  email: string;
  phone?: string;
};

export type CustomerDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  updated: string;
};


export type CustomerCategory = "Individual" | "Business";
export type CommunicationPreference = "Email" | "SMS" | "WhatsApp";
export type LoyaltyEventType = "Earned" | "Redeemed";

export type StoreLoyaltyEvent = {
  id: string;
  type: LoyaltyEventType;
  points: number;
  description: string;
  date: string;
};

export type StorePurchase = {
  id: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
};

export type StoreRefund = {
  id: string;
  reference: string;
  date: string;
  amount: number;
  reason: string;
};

export type StoreCustomerDocument = {
  id: string;
  kind: "ID Proof" | "Address Proof";
  name: string;
  uploaded: string;
};

export type StoreCustomer = {
  id: string;
  tenantId: string;
  name: string;
  type: CustomerCategory;
  status: CustomerStatus;
  loyaltyId?: string;
  loyaltyPoints: number;
  email: string;
  phone?: string;
  preferredCommunication: CommunicationPreference;
  kycDocuments?: StoreCustomerDocument[];
  purchaseHistory: StorePurchase[];
  refunds: StoreRefund[];
  loyaltyHistory: StoreLoyaltyEvent[];
  createdAt: string;
  notes?: string;
};
export type VendorStatus = "Active" | "Inactive";
export type BusinessCategory = "Manufacturer" | "Distributor" | "Service Provider";

export type Vendor = {
  id: string;
  tenantId: string;
  name: string;
  status: VendorStatus;
  businessCategory: BusinessCategory;
  registrationNumber?: string;
  rating?: number; // 0-5
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankSwift?: string;
  upcomingContractExpiry?: string; // ISO date
};

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";

export type Invoice = {
  id: string; // same as number for now
  number: string;
  customerId: string;
  customerName: string;
  date: string; // ISO date
  due: string; // ISO date
  amount: number; // in default currency
  status: InvoiceStatus;
  tenantId: string;
  subject?: string;
  po?: string;
  taxNumber?: string;
  currency?: string; // currency code like USD
};

export type Expense = {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string;
  category: string;
  amount: number;
  memo?: string;
  tenantId: string;
};

export type PaymentStatus = "COMPLETED" | "PENDING" | "FAILED";
export type Payment = {
  id: string;
  invoiceNumber: string;
  date: string;
  method: string;
  amount: number;
  status: PaymentStatus;
  tenantId: string;
};

import { getTenantId } from "@/lib/auth";

// Mock datasets (replace with API calls later)
const tenants: Tenant[] = [
  { id: "t-acme", name: "Acme", logoUrl: "/logos/acme.svg", brandColor: "#4f46e5", theme: "light" },
  { id: "t-globex", name: "Globex", logoUrl: "/logos/globex.svg", brandColor: "#0ea5e9", theme: "light" },
];

const customers: Customer[] = [
  { id: "c-001", tenantId: "t-acme", name: "Acme Corp", addressLine1: "123 Main St", city: "Metropolis", state: "NY", postalCode: "10001", country: "USA" },
  { id: "c-002", tenantId: "t-globex", name: "Globex Inc.", addressLine1: "456 Tech Way", city: "Silicon Valley", state: "CA", postalCode: "94025", country: "USA" },
  { id: "c-003", tenantId: "t-acme", name: "Initech", addressLine1: "789 Office Park", city: "Austin", state: "TX", postalCode: "73301", country: "USA" }
];


const storeCustomers: StoreCustomer[] = [
  {
    id: "cu-001",
    tenantId: "t-acme",
    name: "John Carter",
    type: "Individual",
    status: "Active",
    loyaltyId: "LOY-1001",
    loyaltyPoints: 820,
    email: "john.carter@example.com",
    phone: "+1 555 401 0101",
    preferredCommunication: "Email",
    kycDocuments: [
      { id: "cu-001-doc-1", kind: "ID Proof", name: "Passport_JohnC.pdf", uploaded: "2025-01-12" },
    ],
    purchaseHistory: [
      { id: "cu-001-inv-1", reference: "INV-2001", date: "2025-08-20", amount: 240, status: "Paid" },
      { id: "cu-001-inv-2", reference: "INV-2042", date: "2025-09-14", amount: 185, status: "Paid" },
    ],
    refunds: [
      { id: "cu-001-ref-1", reference: "RF-301", date: "2025-07-01", amount: 45, reason: "Damaged item" },
    ],
    loyaltyHistory: [
      { id: "cu-001-loy-1", type: "Earned", points: 120, description: "Purchase INV-2001", date: "2025-08-20" },
      { id: "cu-001-loy-2", type: "Redeemed", points: 200, description: "Gift card redemption", date: "2025-08-28" },
      { id: "cu-001-loy-3", type: "Earned", points: 180, description: "Purchase INV-2042", date: "2025-09-14" },
    ],
    createdAt: "2024-11-03",
    notes: "Prefers weekend deliveries",
  },
  {
    id: "cu-002",
    tenantId: "t-acme",
    name: "Brightside Bakery",
    type: "Business",
    status: "Active",
    loyaltyId: "LOY-2045",
    loyaltyPoints: 1560,
    email: "orders@brightsidebakery.co",
    phone: "+1 555 409 2210",
    preferredCommunication: "WhatsApp",
    kycDocuments: [
      { id: "cu-002-doc-1", kind: "ID Proof", name: "LLC_Certificate.pdf", uploaded: "2025-02-04" },
      { id: "cu-002-doc-2", kind: "Address Proof", name: "Utility_Bill_April.pdf", uploaded: "2025-02-04" },
    ],
    purchaseHistory: [
      { id: "cu-002-inv-1", reference: "INV-2050", date: "2025-09-02", amount: 980, status: "Paid" },
      { id: "cu-002-inv-2", reference: "INV-2074", date: "2025-09-25", amount: 1120, status: "Sent" },
    ],
    refunds: [],
    loyaltyHistory: [
      { id: "cu-002-loy-1", type: "Earned", points: 500, description: "Bulk order bonus", date: "2025-08-15" },
      { id: "cu-002-loy-2", type: "Earned", points: 320, description: "Purchase INV-2050", date: "2025-09-02" },
    ],
    createdAt: "2024-06-24",
  },
  {
    id: "cu-003",
    tenantId: "t-globex",
    name: "Amelia Rivera",
    type: "Individual",
    status: "Inactive",
    loyaltyId: "LOY-3099",
    loyaltyPoints: 140,
    email: "amelia.rivera@example.com",
    phone: "+1 555 622 7711",
    preferredCommunication: "SMS",
    purchaseHistory: [
      { id: "cu-003-inv-1", reference: "INV-3021", date: "2025-05-11", amount: 90, status: "Paid" },
    ],
    refunds: [
      { id: "cu-003-ref-1", reference: "RF-410", date: "2025-06-08", amount: 30, reason: "Returned item" },
    ],
    loyaltyHistory: [
      { id: "cu-003-loy-1", type: "Earned", points: 90, description: "Purchase INV-3021", date: "2025-05-11" },
      { id: "cu-003-loy-2", type: "Redeemed", points: 50, description: "Coupon redemption", date: "2025-05-20" },
    ],
    createdAt: "2024-09-18",
  },
];
const vendors: Vendor[] = [
  {
    id: "v-101",
    tenantId: "t-acme",
    name: "Paper Street Supplies",
    status: "Active",
    businessCategory: "Distributor",
    registrationNumber: "PSS-74829",
    rating: 4.5,
    contactName: "Marla Singer",
    email: "sales@paperstreet.com",
    phone: "+1 555 555 0101",
    website: "https://paperstreet.com",
    addressLine1: "1 Paper Ln",
    city: "Metropolis",
    state: "NY",
    postalCode: "10001",
    country: "USA",
    taxId: "PSS-101",
    paymentTerms: "Net 30",
    bankAccountNumber: "6738421987",
    bankName: "First National Bank",
    bankSwift: "FNUSUS33",
    upcomingContractExpiry: "2025-12-15",
  },
  {
    id: "v-102",
    tenantId: "t-acme",
    name: "Acme Printing",
    status: "Inactive",
    businessCategory: "Service Provider",
    registrationNumber: "ACP-44021",
    rating: 3.8,
    contactName: "Dwight Stone",
    email: "support@acmeprinting.com",
    phone: "+1 555 555 0102",
    website: "https://printwithacme.com",
    addressLine1: "200 Print Blvd",
    city: "Gotham",
    state: "NJ",
    postalCode: "07030",
    country: "USA",
    taxId: "ACP-102",
    paymentTerms: "Net 15",
    bankAccountNumber: "2987743211",
    bankName: "Metro Credit Union",
    bankSwift: "MCUUUS44",
    upcomingContractExpiry: "2025-10-05",
  },
  {
    id: "v-103",
    tenantId: "t-globex",
    name: "Cloud Hosting Co.",
    status: "Active",
    businessCategory: "Service Provider",
    registrationNumber: "CHC-99210",
    rating: 4.9,
    contactName: "Julia Chen",
    email: "billing@cloudhost.co",
    phone: "+1 555 555 0103",
    website: "https://cloudhost.co",
    addressLine1: "77 Cloud Way",
    city: "San Francisco",
    state: "CA",
    postalCode: "94105",
    country: "USA",
    taxId: "CHC-103",
    paymentTerms: "Net 30",
    bankAccountNumber: "5566778899",
    bankName: "Pacific Bank",
    bankSwift: "PACBUS66",
    upcomingContractExpiry: "2026-03-01",
  },
  {
    id: "v-104",
    tenantId: "t-acme",
    name: "Zenith Manufacturing",
    status: "Active",
    businessCategory: "Manufacturer",
    registrationNumber: "ZEN-55120",
    rating: 4.2,
    contactName: "Marta Lopez",
    email: "accounts@zenithmfg.com",
    phone: "+1 555 555 0104",
    website: "https://zenithmfg.com",
    addressLine1: "460 Industrial Park",
    city: "Austin",
    state: "TX",
    postalCode: "73301",
    country: "USA",
    taxId: "ZEN-551",
    paymentTerms: "Net 60",
    bankAccountNumber: "1122334455",
    bankName: "Lone Star Bank",
    bankSwift: "LSBTUS77",
    upcomingContractExpiry: "2025-11-20",
  },
];

const invoices: Invoice[] = [
  { id: "INV-1001", number: "INV-1001", customerId: "c-001", customerName: "Acme Corp", date: "2025-09-21", due: "2025-10-21", amount: 1250, status: "Sent", tenantId: "t-acme" },
  { id: "INV-1002", number: "INV-1002", customerId: "c-002", customerName: "Globex Inc.", date: "2025-09-24", due: "2025-10-24", amount: 840, status: "Paid", tenantId: "t-globex" },
  { id: "INV-1003", number: "INV-1003", customerId: "c-003", customerName: "Initech", date: "2025-09-28", due: "2025-10-28", amount: 1999, status: "Overdue", tenantId: "t-acme" },
  { id: "INV-1004", number: "INV-1004", customerId: "c-001", customerName: "Acme Corp", date: "2025-10-01", due: "2025-10-31", amount: 500, status: "Draft", tenantId: "t-acme" },
];

const expenses: Expense[] = [
  { id: "EXP-5001", vendorId: "v-101", vendorName: "Paper Street Supplies", date: "2025-09-20", category: "Office", amount: 210.5, memo: "Paper & pens", tenantId: "t-acme" },
  { id: "EXP-5002", vendorId: "v-102", vendorName: "Acme Printing", date: "2025-09-25", category: "Printing", amount: 430, memo: "Marketing flyers", tenantId: "t-acme" },
  { id: "EXP-5003", vendorId: "v-103", vendorName: "Cloud Hosting Co.", date: "2025-09-28", category: "Hosting", amount: 99, memo: "Monthly hosting", tenantId: "t-globex" },
  { id: "EXP-5004", vendorId: "v-101", vendorName: "Paper Street Supplies", date: "2025-10-01", category: "Office", amount: 55.75, memo: "Notebooks", tenantId: "t-acme" },
];

const payments: Payment[] = [
  { id: "PAY-1001", invoiceNumber: "INV-1001", date: "2025-09-21", method: "Credit Card", amount: 1250, status: "COMPLETED", tenantId: "t-acme" },
  { id: "PAY-1002", invoiceNumber: "INV-1002", date: "2025-09-24", method: "Bank Transfer", amount: 840, status: "COMPLETED", tenantId: "t-globex" }
];

export function getCustomerById(id?: string): Customer | undefined {
  if (!id) return undefined;
  const tid = activeTenantId();
  const customer = customers.find(c => c.id === id);
  return tid ? (customer && customer.tenantId === tid ? customer : undefined) : customer;
}


function composeCustomerAddress(source: Partial<Customer>): string | undefined {
  const parts = [source.addressLine1, source.city, source.state, source.postalCode, source.country]
    .filter((segment) => (segment ?? "").toString().trim().length > 0) as string[];
  if (parts.length === 0) return undefined;
  return parts.join(", ");
}
export function getTenants(): Tenant[] { return tenants; }

function activeTenantId(): string | undefined { return getTenantId(); }

export function getCustomers(): Customer[] {
  const tid = activeTenantId();
  return tid ? customers.filter(c => c.tenantId === tid) : customers;
}

export function getStoreCustomers(): StoreCustomer[] {
  const tid = activeTenantId();
  return tid ? storeCustomers.filter((c) => c.tenantId === tid) : storeCustomers;
}

export function getStoreCustomerById(id?: string): StoreCustomer | undefined {
  if (!id) return undefined;
  const tid = activeTenantId();
  const customer = storeCustomers.find((c) => c.id === id);
  return tid ? (customer && customer.tenantId === tid ? customer : undefined) : customer;
}
export function getVendors(): Vendor[] {
  const tid = activeTenantId();
  return tid ? vendors.filter(v => v.tenantId === tid) : vendors;
}
export function getVendorById(id?: string): Vendor | undefined {
  const tid = activeTenantId();
  const v = vendors.find(v => v.id === id);
  return tid ? (v && v.tenantId === tid ? v : undefined) : v;
}
export function getInvoices(): Invoice[] {
  const tid = activeTenantId();
  return tid ? invoices.filter(i => i.tenantId === tid) : invoices;
}
export function getInvoiceByNumber(number?: string): Invoice | undefined {
  if (!number) return undefined;
  const tid = activeTenantId();
  const inv = invoices.find(i => i.number === number);
  return tid ? (inv && inv.tenantId === tid ? inv : undefined) : inv;
}
export function getInvoicesByCustomerId(customerId: string): Invoice[] {
  const tid = activeTenantId();
  return invoices.filter(i => i.customerId === customerId && (!tid || i.tenantId === tid));
}
export function getExpensesByVendorId(vendorId: string): Expense[] {
  const tid = activeTenantId();
  return expenses.filter(e => e.vendorId === vendorId && (!tid || e.tenantId === tid));
}
export function getPayments(): Payment[] {
  const tid = activeTenantId();
  return tid ? payments.filter(p => p.tenantId === tid) : payments;
}

// Create a new store customer (in-memory mock)

export function createStoreCustomer(input: Omit<StoreCustomer, "id" | "tenantId" | "purchaseHistory" | "refunds" | "loyaltyHistory" | "kycDocuments" | "createdAt"> & {
  tenantId?: string;
  loyaltyPoints?: number;
  kycDocuments?: StoreCustomerDocument[];
}): StoreCustomer {
  const tid = input.tenantId || activeTenantId() || tenants[0]?.id || "t-acme";
  const idSeed = Math.random().toString(36).slice(2, 8).toUpperCase();
  const customer: StoreCustomer = {
    id: `cu-${idSeed}`,
    tenantId: tid,
    name: input.name,
    type: input.type,
    status: input.status,
    loyaltyId: input.loyaltyId,
    loyaltyPoints: input.loyaltyPoints ?? 0,
    email: input.email,
    phone: input.phone,
    preferredCommunication: input.preferredCommunication,
    kycDocuments: input.kycDocuments,
    purchaseHistory: [],
    refunds: [],
    loyaltyHistory: [],
    createdAt: new Date().toISOString().slice(0, 10),
    notes: input.notes,
  };
  storeCustomers.unshift(customer);
  return customer;
}
// Create a new invoice (in-memory mock)

export function createInvoice(input: { number?: string; customerId: string; date: string; due: string; amount: number; status?: InvoiceStatus; subject?: string; po?: string; taxNumber?: string; currency?: string }): Invoice {
  const tid = activeTenantId();
  const customer = getCustomerById(input.customerId);
  const customerName = customer?.name || "Unknown";
  // Generate next invoice number by incrementing the highest numeric suffix
  const maxNum = invoices.reduce((max, inv) => {
    const m = /INV-(\d+)/.exec(inv.number);
    const n = m ? parseInt(m[1], 10) : 0;
    return Math.max(max, n);
  }, 0);
  const nextNumber = input.number && input.number.trim().length > 0 ? input.number : `INV-${String(maxNum + 1).padStart(4, "0")}`;
  const inv: Invoice = {
    id: nextNumber,
    number: nextNumber,
    customerId: input.customerId,
    customerName,
    date: input.date,
    due: input.due,
    amount: Math.max(0, Number(input.amount) || 0),
    status: input.status || "Draft",
    tenantId: tid || (customer?.tenantId || "t-acme"),
    subject: input.subject,
    po: input.po,
    taxNumber: input.taxNumber,
    currency: input.currency,
  };
  invoices.unshift(inv);
  return inv;
}

export function getCustomerBalance(customerId: string): { total: number; paid: number; due: number; overdue: number } {
  const inv = getInvoicesByCustomerId(customerId);
  const total = inv.reduce((s, i) => s + i.amount, 0);
  const paid = inv.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const overdue = inv.filter(i => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const due = Math.max(0, total - paid);
  return { total, paid, due, overdue };
}

// Mutations (mock, in-memory)

export function updateStoreCustomer(id: string, patch: Partial<StoreCustomer>): StoreCustomer | undefined {
  const idx = storeCustomers.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  const current = storeCustomers[idx];
  const next: StoreCustomer = {
    ...current,
    ...patch,
    kycDocuments: patch.kycDocuments ?? current.kycDocuments,
    purchaseHistory: patch.purchaseHistory ?? current.purchaseHistory,
    refunds: patch.refunds ?? current.refunds,
    loyaltyHistory: patch.loyaltyHistory ?? current.loyaltyHistory,
  };
  storeCustomers[idx] = next;
  return storeCustomers[idx];
}

export function createVendor(input: Omit<Vendor, "id" | "tenantId"> & { tenantId?: string }): Vendor {
  const tid = input.tenantId || activeTenantId() || tenants[0]?.id || "t-acme";
  const idSeed = Math.random().toString(36).slice(2, 8).toUpperCase();
  const vendor: Vendor = {
    id: `v-${idSeed}`,
    tenantId: tid,
    status: input.status,
    name: input.name,
    businessCategory: input.businessCategory,
    registrationNumber: input.registrationNumber,
    rating: input.rating,
    contactName: input.contactName,
    email: input.email,
    phone: input.phone,
    website: input.website,
    addressLine1: input.addressLine1,
    city: input.city,
    state: input.state,
    postalCode: input.postalCode,
    country: input.country,
    paymentTerms: input.paymentTerms,
    taxId: input.taxId,
    bankAccountNumber: input.bankAccountNumber,
    bankName: input.bankName,
    bankSwift: input.bankSwift,
    upcomingContractExpiry: input.upcomingContractExpiry,
  };
  vendors.unshift(vendor);
  return vendor;
}
export function updateVendorProfile(id: string, patch: Partial<Vendor>): Vendor | undefined {
  const idx = vendors.findIndex(v => v.id === id);
  if (idx === -1) return undefined;
  vendors[idx] = { ...vendors[idx], ...patch };
  return vendors[idx];
}

export function updateCustomerProfile(id: string, patch: Partial<Customer>): Customer | undefined {
  const idx = customers.findIndex(c => c.id === id);
  if (idx === -1) return undefined;
  customers[idx] = { ...customers[idx], ...patch };
  return customers[idx];
}

export function createCustomer(input: Omit<Customer, "id" | "tenantId"> & { tenantId?: string }): Customer {
  const tid = input.tenantId || activeTenantId() || tenants[0]?.id || "t-acme";
  const idSeed = Math.random().toString(36).slice(2, 8).toUpperCase();
  const customer: Customer = {
    id: `c-${idSeed}`,
    tenantId: tid,
    name: input.name,
    addressLine1: input.addressLine1,
    city: input.city,
    state: input.state,
    postalCode: input.postalCode,
    country: input.country
  };
  customers.unshift(customer);
  return customer;
}