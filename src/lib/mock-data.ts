export type Employee = {
  id: string;
  name: string;
  phone: string;
  area: string;
  team: string;
  online: boolean;
  updated: string;
  x: number; // % position on map
  y: number;
  initials: string;
};

export const employees: Employee[] = [
  { id: "1", name: "Rohan Kumar", phone: "+91 98765 43210", area: "A-Block, Sector 63, Noida", team: "Field Sales", online: true, updated: "Just now", x: 24, y: 22, initials: "RK" },
  { id: "2", name: "Neha Sharma", phone: "+91 87654 32109", area: "Sector 18, Noida", team: "Field Sales", online: true, updated: "1 min ago", x: 68, y: 30, initials: "NS" },
  { id: "3", name: "Amit Patel", phone: "+91 96542 31098", area: "Sector 62, Noida", team: "Delivery", online: true, updated: "2 min ago", x: 46, y: 48, initials: "AP" },
  { id: "4", name: "Pooja Singh", phone: "+91 91234 56789", area: "Sector 15, Noida", team: "Delivery", online: true, updated: "3 min ago", x: 76, y: 62, initials: "PS" },
  { id: "5", name: "Vikas Yadav", phone: "+91 99887 66554", area: "Sector 71, Noida", team: "Service", online: true, updated: "5 min ago", x: 18, y: 68, initials: "VY" },
  { id: "6", name: "Anjali Verma", phone: "+91 90909 80808", area: "Sector 5, Noida", team: "Service", online: true, updated: "6 min ago", x: 58, y: 80, initials: "AV" },
  { id: "7", name: "Karan Mehta", phone: "+91 90011 22334", area: "Sector 137, Noida", team: "Field Sales", online: false, updated: "35 min ago", x: 34, y: 88, initials: "KM" },
  { id: "8", name: "Sneha Rao", phone: "+91 93456 78901", area: "Sector 44, Noida", team: "Delivery", online: false, updated: "1 hr ago", x: 86, y: 14, initials: "SR" },
];

export const alerts = [
  { id: "a1", who: "Rohan Kumar", initials: "RK", text: "is now online", time: "09:40 AM", day: "Today", online: true },
  { id: "a2", who: "Neha Sharma", initials: "NS", text: "is now online", time: "09:36 AM", day: "Today", online: true },
  { id: "a3", who: "Amit Patel", initials: "AP", text: "is now offline", time: "09:20 AM", day: "Today", online: false },
  { id: "a4", who: "Pooja Singh", initials: "PS", text: "is now online", time: "08:45 PM", day: "Yesterday", online: true },
  { id: "a5", who: "Vikas Yadav", initials: "VY", text: "is now offline", time: "07:30 PM", day: "Yesterday", online: false },
];

export const history = [
  { time: "09:05 AM", place: "Reached A-Block, Sector 63", note: "Check-in" },
  { time: "10:40 AM", place: "Client visit — Sector 62", note: "Stopped 25 min" },
  { time: "12:15 PM", place: "Moving via Noida Expressway", note: "12 km" },
  { time: "01:30 PM", place: "Lunch break — Sector 18", note: "Stopped 40 min" },
  { time: "03:10 PM", place: "Client visit — Sector 15", note: "Stopped 30 min" },
];
