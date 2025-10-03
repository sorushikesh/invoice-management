export const indexMockData = {
  initialRevenue: [
    { month: "Apr", amount: 8200 },
    { month: "May", amount: 9450 },
    { month: "Jun", amount: 10120 },
    { month: "Jul", amount: 11230 },
    { month: "Aug", amount: 12480 },
    { month: "Sep", amount: 13150 },
  ],
  initialStatus: [
    { name: "Paid", value: 62 },
    { name: "Sent", value: 26 },
    { name: "Overdue", value: 12 },
  ],
  initialRecent: [
    { number: "INV-1034", client: "Acme Corp", date: "2025-09-26", amount: "$1,250", status: "Paid" },
    { number: "INV-1033", client: "Globex", date: "2025-09-24", amount: "$840", status: "Sent" },
    { number: "INV-1032", client: "Initech", date: "2025-09-22", amount: "$1,999", status: "Overdue" },
    { number: "INV-1031", client: "Acme Corp", date: "2025-09-20", amount: "$500", status: "Draft" },
  ],
};