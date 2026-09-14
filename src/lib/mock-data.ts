import rohanPhoto from "@/assets/employee-rohan.jpg";
import nehaPhoto from "@/assets/employee-neha.jpg";
import amitPhoto from "@/assets/employee-amit.jpg";
import poojaPhoto from "@/assets/employee-pooja.jpg";
import vikasPhoto from "@/assets/employee-vikas.jpg";
import anjaliPhoto from "@/assets/employee-anjali.jpg";
import karanPhoto from "@/assets/employee-karan.jpg";
import snehaPhoto from "@/assets/employee-sneha.jpg";

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
  photo: string;
};

export const employees: Employee[] = [
  { id: "1", name: "Rohan Kumar", phone: "+91 98765 43210", area: "A-Block, Sector 63, Noida", team: "Field Sales", online: true, updated: "Just now", x: 24, y: 22, initials: "RK", photo: rohanPhoto },
  { id: "2", name: "Neha Sharma", phone: "+91 87654 32109", area: "Sector 18, Noida", team: "Field Sales", online: true, updated: "1 min ago", x: 68, y: 30, initials: "NS", photo: nehaPhoto },
  { id: "3", name: "Amit Patel", phone: "+91 96542 31098", area: "Sector 62, Noida", team: "Delivery", online: true, updated: "2 min ago", x: 46, y: 48, initials: "AP", photo: amitPhoto },
  { id: "4", name: "Pooja Singh", phone: "+91 91234 56789", area: "Sector 15, Noida", team: "Delivery", online: true, updated: "3 min ago", x: 76, y: 62, initials: "PS", photo: poojaPhoto },
  { id: "5", name: "Vikas Yadav", phone: "+91 99887 66554", area: "Sector 71, Noida", team: "Service", online: true, updated: "5 min ago", x: 18, y: 68, initials: "VY", photo: vikasPhoto },
  { id: "6", name: "Anjali Verma", phone: "+91 90909 80808", area: "Sector 5, Noida", team: "Service", online: true, updated: "6 min ago", x: 58, y: 80, initials: "AV", photo: anjaliPhoto },
  { id: "7", name: "Karan Mehta", phone: "+91 90011 22334", area: "Sector 137, Noida", team: "Field Sales", online: false, updated: "35 min ago", x: 34, y: 88, initials: "KM", photo: karanPhoto },
  { id: "8", name: "Sneha Rao", phone: "+91 93456 78901", area: "Sector 44, Noida", team: "Delivery", online: false, updated: "1 hr ago", x: 86, y: 14, initials: "SR", photo: snehaPhoto },
];

export const alerts = [
  { id: "a1", who: "Rohan Kumar", initials: "RK", photo: rohanPhoto, text: "is now online", time: "09:40 AM", day: "Today", online: true },
  { id: "a2", who: "Neha Sharma", initials: "NS", photo: nehaPhoto, text: "is now online", time: "09:36 AM", day: "Today", online: true },
  { id: "a3", who: "Amit Patel", initials: "AP", photo: amitPhoto, text: "is now offline", time: "09:20 AM", day: "Today", online: false },
  { id: "a4", who: "Pooja Singh", initials: "PS", photo: poojaPhoto, text: "is now online", time: "08:45 PM", day: "Yesterday", online: true },
  { id: "a5", who: "Vikas Yadav", initials: "VY", photo: vikasPhoto, text: "is now offline", time: "07:30 PM", day: "Yesterday", online: false },
];

export type AttendanceRow = {
  id: string;
  name: string;
  initials: string;
  photo: string;
  team: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  distanceKm: number;
  status: "Present" | "Late" | "Absent";
};

export const attendanceToday: AttendanceRow[] = [
  { id: "1", name: "Rohan Kumar", initials: "RK", photo: rohanPhoto, team: "Field Sales", checkIn: "09:05 AM", checkOut: "—", hours: 7.4, distanceKm: 32, status: "Present" },
  { id: "2", name: "Neha Sharma", initials: "NS", photo: nehaPhoto, team: "Field Sales", checkIn: "09:12 AM", checkOut: "—", hours: 7.1, distanceKm: 27, status: "Present" },
  { id: "3", name: "Amit Patel", initials: "AP", photo: amitPhoto, team: "Delivery", checkIn: "10:02 AM", checkOut: "—", hours: 6.2, distanceKm: 54, status: "Late" },
  { id: "4", name: "Pooja Singh", initials: "PS", photo: poojaPhoto, team: "Delivery", checkIn: "08:55 AM", checkOut: "—", hours: 7.6, distanceKm: 41, status: "Present" },
  { id: "5", name: "Vikas Yadav", initials: "VY", photo: vikasPhoto, team: "Service", checkIn: "09:20 AM", checkOut: "—", hours: 7.0, distanceKm: 18, status: "Present" },
  { id: "6", name: "Anjali Verma", initials: "AV", photo: anjaliPhoto, team: "Service", checkIn: "09:48 AM", checkOut: "—", hours: 6.5, distanceKm: 22, status: "Late" },
  { id: "7", name: "Karan Mehta", initials: "KM", photo: karanPhoto, team: "Field Sales", checkIn: "09:02 AM", checkOut: "04:35 PM", hours: 7.5, distanceKm: 38, status: "Present" },
  { id: "8", name: "Sneha Rao", initials: "SR", photo: snehaPhoto, team: "Delivery", checkIn: "—", checkOut: "—", hours: 0, distanceKm: 0, status: "Absent" },
];

export const weeklyAnalytics = [
  { day: "Mon", present: 8, absent: 0, avgHours: 7.8 },
  { day: "Tue", present: 7, absent: 1, avgHours: 7.4 },
  { day: "Wed", present: 8, absent: 0, avgHours: 8.1 },
  { day: "Thu", present: 6, absent: 2, avgHours: 6.9 },
  { day: "Fri", present: 7, absent: 1, avgHours: 7.6 },
  { day: "Sat", present: 5, absent: 3, avgHours: 5.4 },
  { day: "Today", present: 7, absent: 1, avgHours: 7.0 },
];

export const teamPerformance = [
  { team: "Field Sales", visits: 42, distanceKm: 97, onTime: 92 },
  { team: "Delivery", visits: 68, distanceKm: 133, onTime: 84 },
  { team: "Service", visits: 25, distanceKm: 40, onTime: 88 },
];

export const myProfile = {
  name: "Rahul Verma",
  initials: "RV",
  phone: "+91 98765 43210",
  code: "QE-1042",
  team: "Field Sales",
  area: "Sector 63, Noida",
  checkIn: "09:05 AM",
  hoursToday: 7.4,
  distanceToday: 32,
  visitsToday: 6,
  monthPresent: 22,
  monthLate: 3,
  monthAbsent: 1,
};

export const history = [
  { time: "09:05 AM", place: "Reached A-Block, Sector 63", note: "Check-in" },
  { time: "10:40 AM", place: "Client visit — Sector 62", note: "Stopped 25 min" },
  { time: "12:15 PM", place: "Moving via Noida Expressway", note: "12 km" },
  { time: "01:30 PM", place: "Lunch break — Sector 18", note: "Stopped 40 min" },
  { time: "03:10 PM", place: "Client visit — Sector 15", note: "Stopped 30 min" },
];
