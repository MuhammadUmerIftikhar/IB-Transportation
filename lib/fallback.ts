/**
 * Default website content.
 *
 * Used whenever Sanity is not connected yet (or a collection is still empty),
 * and by `npm run seed` to pre-fill a fresh Sanity dataset with this content.
 *
 * Relative imports only: this file is also loaded by the seed script outside Next.js.
 */
import type { PortableTextBlock } from "next-sanity";
import type { Faq, Service, SiteSettings, Testimonial, Vehicle } from "./types";

function paragraphs(id: string, ...texts: string[]): PortableTextBlock[] {
  return texts.map((text, i) => ({
    _type: "block",
    _key: `${id}-p${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${id}-s${i}`, text, marks: [] }],
  }));
}

export const fallbackSettings: SiteSettings = {
  companyName: "IB Transportation",
  tagline: "Airport transfers, tours & group transport across the UAE",
  phone: "+971 55 745 8352",
  whatsappNumber: "971557458352",
  whatsappMessage: "Hello IB Transportation! I'd like to book a ride.",
  email: undefined,
  address: "Dubai, United Arab Emirates",
  availability: "Available 24/7",
  heroBadge: "Available 24/7 · All over the UAE",
  heroTitle: "Your trusted ride for",
  heroRotatingWords: [
    "Airport Transfers",
    "Hotel Pickups",
    "Family Tours",
    "Office Commutes",
    "UAE Road Trips",
    "Group Tours",
    "Desert Safaris",
  ],
  heroSubtitle:
    "From DXB arrivals to the desert dunes, IB Transportation gets you there in comfort. Sedans to 50-seat buses, booked in seconds on WhatsApp — day or night.",
  heroImage: "/images/hero.jpg",
  stats: [
    { value: "24/7", label: "Always on the road" },
    { value: "7", label: "Emirates covered" },
    { value: "6", label: "Vehicle types" },
    { value: "50", label: "Seats in our biggest bus" },
  ],
  whyChooseUs: [
    {
      icon: "clock",
      title: "Available 24/7",
      description:
        "Early-morning flight or late-night arrival — we're on the road around the clock, every day of the year.",
    },
    {
      icon: "map",
      title: "All over the UAE",
      description:
        "Dubai, Abu Dhabi, Sharjah and every emirate in between. One message covers the whole country.",
    },
    {
      icon: "message",
      title: "Book in seconds",
      description:
        "No apps, no long forms. Send us a WhatsApp message with your trip details and you're sorted.",
    },
    {
      icon: "users",
      title: "A vehicle for every group",
      description:
        "From a 4-seat sedan to a 50-seat bus — we match the right vehicle to your group and luggage.",
    },
    {
      icon: "smile",
      title: "Friendly, professional drivers",
      description:
        "Courteous drivers who know UAE roads inside out and are happy to help with your bags.",
    },
    {
      icon: "sparkles",
      title: "Clean, comfortable rides",
      description:
        "Air-conditioned, well-kept vehicles so every trip feels relaxed — whatever the weather outside.",
    },
  ],
  destinations: [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
    "Al Ain",
    "Hatta",
    "DXB Airport",
    "DWC Airport",
    "AUH Airport",
    "Dubai Marina",
    "Palm Jumeirah",
  ],
  socialLinks: {},
  seoTitle: "IB Transportation | Airport Transfers, Tours & Vehicle Hire in the UAE",
  seoDescription:
    "Book airport pick & drop, hotel transfers, family & group tours, office transport and desert safari rides across the UAE. Sedan, SUV, 7-seater, van, mini van and bus — available 24/7 on WhatsApp.",
};

export const fallbackServices: Service[] = [
  {
    _id: "service-airport-transfer",
    title: "Airport Pick & Drop",
    slug: "airport-transfer",
    icon: "plane",
    shortDescription:
      "Stress-free rides to and from DXB, DWC, Abu Dhabi and Sharjah airports — arrivals or departures, any hour.",
    image: "/images/airport.jpg",
    highlights: [
      "All UAE airports covered",
      "Arrivals & departures, 24/7",
      "Room for all your luggage",
      "Sedan to bus for any group size",
    ],
    body: paragraphs(
      "airport",
      "Landing after a long flight? The last thing you want is a taxi queue. Book your airport transfer with IB Transportation and travel straight to your hotel, home or office in a clean, air-conditioned vehicle.",
      "We cover Dubai International (DXB), Dubai World Central (DWC), Abu Dhabi (AUH) and Sharjah (SHJ) airports, for both arrivals and departures. Share your flight number and arrival time when you book on WhatsApp so we can plan your pickup.",
      "Travelling with family or a group? Choose a 7-seater, van, mini van or bus so everyone — and every suitcase — rides together.",
    ),
  },
  {
    _id: "service-hotel-transfer",
    title: "Hotels Pick & Drop",
    slug: "hotel-transfer",
    icon: "hotel",
    shortDescription:
      "Seamless rides between your hotel and the airport, malls, attractions, meetings or anywhere in the city.",
    image: "/images/hotel.jpg",
    highlights: [
      "Door-to-door hotel pickups",
      "Malls, attractions & meetings",
      "Comfortable rides at any hour",
      "Perfect for tourists & guests",
    ],
    body: paragraphs(
      "hotel",
      "Staying at a hotel in Dubai or anywhere in the UAE? We pick you up right at the lobby and drop you wherever your plans take you — the airport, a shopping mall, a business meeting or a dinner reservation.",
      "Just send us your hotel name, destination and preferred time on WhatsApp, and we'll take care of the rest.",
    ),
  },
  {
    _id: "service-family-tours",
    title: "Family Tours",
    slug: "family-tours",
    icon: "family",
    shortDescription:
      "Spacious, comfortable vehicles for family days out — beaches, parks, malls and attractions at your own pace.",
    image: "/images/family.jpg",
    highlights: [
      "Spacious 7-seaters & vans",
      "Travel at your own pace",
      "Beaches, parks & attractions",
      "Half-day or full-day plans",
    ],
    body: paragraphs(
      "family",
      "Make family outings easy. Instead of juggling taxis, keep everyone together in one spacious vehicle with plenty of room for strollers, shopping bags and beach gear.",
      "Tell us where you'd like to go — theme parks, beaches, malls or the city's landmarks — and we'll plan a comfortable ride for the whole family.",
    ),
  },
  {
    _id: "service-office-transport",
    title: "Office Pick & Drop",
    slug: "office-transport",
    icon: "briefcase",
    shortDescription:
      "Reliable daily commutes and staff transport for companies, with schedules that fit your shifts.",
    image: "/images/office.jpg",
    highlights: [
      "Daily staff transport",
      "Flexible shift schedules",
      "Sedans for executives",
      "Vans & buses for teams",
    ],
    body: paragraphs(
      "office",
      "Keep your team moving with dependable office pick and drop. Whether it's a single executive or a full shift of staff, we provide the right vehicle on a schedule that works for your business.",
      "Contact us on WhatsApp with your pickup points, timings and number of staff to set up a daily, weekly or monthly arrangement.",
    ),
  },
  {
    _id: "service-uae-tours",
    title: "All Over UAE Tour",
    slug: "uae-tours",
    icon: "map",
    shortDescription:
      "Explore all seven emirates — from the Grand Mosque in Abu Dhabi to the mountains of Ras Al Khaimah.",
    image: "/images/uae-tour.jpg",
    highlights: [
      "All 7 emirates",
      "City tours & day trips",
      "Landmarks & hidden gems",
      "Your itinerary, your pace",
    ],
    body: paragraphs(
      "uae",
      "Discover the best of the Emirates in comfort. Visit the Sheikh Zayed Grand Mosque in Abu Dhabi, the heritage areas of Sharjah, the beaches of Fujairah or the mountains of Ras Al Khaimah and Hatta.",
      "Share your wish list and we'll arrange the right vehicle for a city tour, a full-day trip or a multi-stop journey across the UAE.",
    ),
  },
  {
    _id: "service-group-tours",
    title: "Groups Tour",
    slug: "group-tours",
    icon: "users",
    shortDescription:
      "Vans and buses for corporate events, weddings, school trips and big group outings.",
    image: "/images/groups.jpg",
    highlights: [
      "Vans & buses up to 50 seats",
      "Events, weddings & school trips",
      "Corporate group transport",
      "One booking for the whole group",
    ],
    body: paragraphs(
      "groups",
      "Moving a big group? Keep everyone together with a spacious van, mini van or bus. We handle transport for corporate events, conferences, weddings, school trips, sports teams and group sightseeing.",
      "Send us your group size, pickup points and schedule on WhatsApp, and we'll recommend the best vehicle for the job.",
    ),
  },
  {
    _id: "service-desert-safari",
    title: "Desert Safari",
    slug: "desert-safari",
    icon: "desert",
    shortDescription:
      "Ride out to the golden dunes for an unforgettable desert safari, with pickup from your hotel or home.",
    image: "/images/desert-safari.jpg",
    highlights: [
      "Hotel & home pickup",
      "Sunset & evening safaris",
      "Families, couples & groups",
      "Safe, comfortable ride back",
    ],
    body: paragraphs(
      "safari",
      "No trip to the UAE is complete without the desert. Watch the sun set over the golden dunes, enjoy the thrill of the sand and spend an evening under the stars.",
      "We'll pick you up from your hotel or home and get you back safely after your adventure. Message us on WhatsApp with your date and group size to plan your safari.",
    ),
  },
];

export const fallbackVehicles: Vehicle[] = [
  {
    _id: "vehicle-sedan",
    name: "Sedan",
    slug: "sedan",
    type: "sedan",
    tagline: "Solo, couples & business",
    passengers: 4,
    luggage: 3,
    models: "Toyota Camry, Hyundai Sonata or similar",
    description:
      "A smooth, quiet ride for solo travellers, couples and business guests. Ideal for airport runs, hotel transfers and meetings across the city.",
    features: ["Air-conditioned", "Airport & city rides", "Business travel"],
    image: "/images/fleet/sedan.webp",
    facing: "right",
  },
  {
    _id: "vehicle-suv",
    name: "SUV",
    slug: "suv",
    type: "suv",
    tagline: "Premium comfort & space",
    passengers: 6,
    luggage: 4,
    models: "Toyota Land Cruiser, Nissan Patrol or similar",
    description:
      "Commanding, spacious and built for UAE roads. Extra legroom and luggage space make it a favourite for VIP transfers, families and desert trips.",
    features: ["Air-conditioned", "Extra legroom", "Great for desert trips"],
    image: "/images/fleet/suv.webp",
    facing: "right",
  },
  {
    _id: "vehicle-seven-seater",
    name: "7 Seater",
    slug: "seven-seater",
    type: "seven-seater",
    tagline: "Families & small groups",
    passengers: 7,
    luggage: 5,
    models: "Kia Carnival, Toyota Innova or similar",
    description:
      "Room for the whole family in one comfortable vehicle. Perfect for airport pickups with kids, family tours and small group outings.",
    features: ["Air-conditioned", "Family friendly", "Generous boot space"],
    image: "/images/fleet/seven-seater.webp",
    facing: "left",
  },
  {
    _id: "vehicle-van",
    name: "Van",
    slug: "van",
    type: "van",
    tagline: "Medium groups & extra luggage",
    passengers: 9,
    luggage: 7,
    models: "Hyundai Staria, Hyundai H1 or similar",
    description:
      "A roomy van for medium-sized groups who want to travel together. Comfortable seating and space for luggage, shopping or sports gear.",
    features: ["Air-conditioned", "Easy sliding doors", "Group friendly"],
    image: "/images/fleet/van.webp",
    facing: "left",
  },
  {
    _id: "vehicle-mini-van",
    name: "Mini Van",
    slug: "mini-van",
    type: "mini-van",
    tagline: "Larger groups & staff transport",
    passengers: 14,
    luggage: 10,
    models: "Toyota Hiace or similar",
    description:
      "The go-to choice for bigger groups, staff transport and city tours. High roof, comfortable seats and plenty of room for everyone's bags.",
    features: ["Air-conditioned", "High roof", "Staff & tour transport"],
    image: "/images/fleet/mini-van.webp",
    facing: "left",
  },
  {
    _id: "vehicle-bus",
    name: "Bus",
    slug: "bus",
    type: "bus",
    tagline: "Events, tours & big groups",
    passengers: 50,
    luggage: 40,
    models: "Toyota Coaster, King Long or similar · 22 to 50 seats",
    description:
      "From mini buses to full-size coaches, we move big groups in one go — weddings, corporate events, school trips and sightseeing tours.",
    features: ["Air-conditioned", "22 – 50 seat options", "Large luggage hold"],
    image: "/images/fleet/bus.webp",
    facing: "left",
  },
];

export const fallbackFaqs: Faq[] = [
  {
    _id: "faq-booking",
    question: "How do I book a ride?",
    answer:
      "Tap any “Book Now” button on this website. It opens a WhatsApp chat with our team with your trip details pre-filled — just send the message with your pickup, drop-off, date, time and number of passengers and we'll confirm your booking. You can also call us directly.",
  },
  {
    _id: "faq-availability",
    question: "Are you really available 24/7?",
    answer:
      "Yes. We operate around the clock, every day of the year — including early-morning and late-night airport pickups.",
  },
  {
    _id: "faq-coverage",
    question: "Which areas do you cover?",
    answer:
      "We cover the whole UAE: Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain, Al Ain, Hatta and all major airports.",
  },
  {
    _id: "faq-vehicle",
    question: "Which vehicle should I choose?",
    answer:
      "A Sedan fits up to 4 passengers, an SUV up to 6, a 7 Seater up to 7, a Van up to 9, a Mini Van up to 14 and our Buses carry from 22 up to 50 passengers. Not sure? Tell us your group size and luggage on WhatsApp and we'll recommend the best fit.",
  },
  {
    _id: "faq-airport",
    question: "What details do you need for an airport pickup?",
    answer:
      "Your flight number, arrival date and time, the terminal if you know it, the number of passengers and bags, and your drop-off address. Send them on WhatsApp and we'll plan your pickup.",
  },
  {
    _id: "faq-tours",
    question: "Can you arrange transport for tours, desert safaris or events?",
    answer:
      "Absolutely. We provide transport for family tours, UAE city tours, desert safaris, group tours, corporate events and weddings — from a single sedan to multiple buses.",
  },
  {
    _id: "faq-price",
    question: "How much does a ride cost?",
    answer:
      "Prices depend on the distance, the vehicle and the type of trip. Send your trip details on WhatsApp or call us and we'll give you a quick quote.",
  },
];

/** Add real customer reviews in Sanity Studio — the section stays hidden until there are some. */
export const fallbackTestimonials: Testimonial[] = [];
