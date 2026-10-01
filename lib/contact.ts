/** Digits only, with country code — the format wa.me and tel: links expect. */
export function toDigits(number: string) {
  return number.replace(/\D/g, "");
}

/** https://wa.me/<number>?text=<message> — opens WhatsApp (app on mobile, web/desktop otherwise). */
export function whatsappUrl(number: string, message?: string) {
  const base = `https://wa.me/${toDigits(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telUrl(phone: string) {
  return `tel:+${toDigits(phone)}`;
}

export interface BookingDetails {
  name?: string;
  service?: string;
  vehicle?: string;
  pickup?: string;
  dropoff?: string;
  date?: string;
  time?: string;
  passengers?: number;
  notes?: string;
}

function formatDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Builds the pre-filled WhatsApp message from the booking form. Empty fields are left out. */
export function bookingMessage(companyName: string, details: BookingDetails) {
  const lines: [string, string | number | undefined][] = [
    ["👤 Name", details.name],
    ["🚘 Service", details.service],
    ["🚐 Vehicle", details.vehicle],
    ["📍 Pickup", details.pickup],
    ["🏁 Drop-off", details.dropoff],
    ["📅 Date", details.date ? formatDate(details.date) : undefined],
    ["⏰ Time", details.time],
    ["👥 Passengers", details.passengers],
    ["📝 Notes", details.notes],
  ];
  const body = lines
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return `Hello ${companyName}! 👋 I'd like to book a ride.\n\n${body}`;
}

export function serviceMessage(companyName: string, serviceTitle: string) {
  return `Hello ${companyName}! 👋 I'd like to book your ${serviceTitle} service. Please share availability and price.`;
}

export function vehicleMessage(companyName: string, vehicleName: string, passengers: number) {
  return `Hello ${companyName}! 👋 I'd like to book a ${vehicleName} (up to ${passengers} passengers). Please share availability and price.`;
}
