export const INSTAGRAM_HANDLE = "girgitstudios";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export const STUDIO_CONTACT = {
  email: "thegirgitstudios@gmail.com",
  phones: ["+91 93542 82892", "+91 80770 81205"],
  whatsappNumber: "919354282892",
  streetAddress: "D-7, D Block, Basement, Baraula, Sector 49",
  landmark: "Opposite Pillar No. 19",
  locality: "Noida",
  region: "Uttar Pradesh",
  postalCode: "201304",
  country: "IN",
  coordinates: "28.56° N · 77.37° E",
  // Profile links show in the contact section and in Google's business data
  socials: [{ label: "Instagram", href: INSTAGRAM_URL }],
};

export const STUDIO_ADDRESS = `${STUDIO_CONTACT.streetAddress}, ${STUDIO_CONTACT.locality} ${STUDIO_CONTACT.postalCode}`;

// Google Maps finds the studio by its business listing name
const MAPS_QUERY = encodeURIComponent(`Girgit Studios, Sector 49, ${STUDIO_CONTACT.locality}`);
export const GOOGLE_MAPS = {
  place: `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`,
  embed: `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`,
};

export const HALF_DAY_HOURS = 5;
export const FULL_DAY_HOURS = 8;
/** Shortest custom booking, for shoots that need neither a half nor a full day */
export const MIN_CUSTOM_HOURS = 2;

export const STUDIO_AMENITIES = [
  "Lighting",
  "Makeup room",
  "Changing room",
  "Steam iron",
  "Air conditioning",
  "Parking",
  "Bluetooth speaker",
  "Wi-Fi",
  "Water dispenser",
  "Refrigerator",
  "Standing fan",
  "Equipment trolley",
];

export const STUDIO_PACKAGES = [
  { name: "2 sets combo", description: "Any two sets in one booking." },
  { name: "Full studio", description: "Every set and space in the studio." },
];

export const BOOKING_TERMS = [
  "GST is applicable. Full advance payment is required to confirm a booking.",
  "Extra studio time is charged by the hour and must be paid before extending the shoot.",
  "Share the crew size when making the booking.",
  "Booked time starts at the first entry and ends at the last exit.",
  "Cancellations made 72 or more hours in advance are refundable. Later cancellations and no-shows are non-refundable.",
];

export const STUDIO_POLICIES = [
  "No smoking or open flames without approval.",
  "Paint, liquids, powders, colours, flour and similar materials need prior approval.",
  "Footwear must be clean and studio-appropriate.",
  "Lift furniture and props; do not drag them across cycloramas or finished surfaces.",
  "Shoot-related damage, stains or excess cleaning are chargeable.",
  "Keep food and beverages away from equipment and sensitive sets.",
  "Pets and animals need prior approval.",
  "Use only booked spaces and included equipment.",
  "Follow all Girgit Studios safety instructions.",
  "CCTV surveillance may be in use for security.",
  "Clients are responsible for their crew, talent, vendors and equipment.",
  "Girgit Studios may stop a shoot if property, safety or policies are compromised.",
  "A private washroom is on the third floor and accessible via stairs only.",
];

/** Click-to-chat link for the studio's WhatsApp, optionally with a pre-filled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${STUDIO_CONTACT.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
