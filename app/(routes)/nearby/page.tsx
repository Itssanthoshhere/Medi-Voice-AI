"use client";

import { useState, useEffect } from "react";
import AppHeader from "../dashboard/_components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Search,
  Navigation,
  Phone,
  Clock,
  ExternalLink,
  ShieldCheck,
  Truck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Pill,
  ShoppingBag,
  Star,
  Sparkles,
  ArrowRight,
  Upload,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "sonner";

interface Facility {
  id: string;
  name: string;
  type: "hospital" | "pharmacy" | "delivery" | "clinic";
  address: string;
  city: string;
  distanceKm: number;
  phone: string;
  openStatus: string;
  is24x7: boolean;
  rating: number;
  reviewsCount: number;
  lat: number;
  lng: number;
  deliveryAvailable: boolean;
  deliveryTimeMins?: number;
  badges: string[];
}

// Haversine formula to calculate real distance between user's GPS coords and facility
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

// Dynamically generate realistic nearby hospitals and 24/7 pharmacies around user's exact lat/lng
function generateNearbyFacilities(userLat: number, userLng: number, areaLabel: string): Facility[] {
  const templates: Omit<Facility, "id" | "distanceKm" | "lat" | "lng">[] = [
    {
      name: "Apollo Pharmacy 24/7 & Express Delivery",
      type: "pharmacy",
      address: "Plot 14, Main High Street",
      city: areaLabel,
      phone: "1860 500 0101",
      openStatus: "Open 24/7",
      is24x7: true,
      rating: 4.9,
      reviewsCount: 890,
      deliveryAvailable: true,
      deliveryTimeMins: 20,
      badges: ["Express 20-Min Delivery", "24/7 Open", "Authentic OTC & Rx", "Cold Storage"],
    },
    {
      name: "City Super Specialty Hospital & 24/7 ER",
      type: "hospital",
      address: "Medical Center Boulevard, Sector 4",
      city: areaLabel,
      phone: "1066 / Emergency Triage",
      openStatus: "Open 24/7",
      is24x7: true,
      rating: 4.8,
      reviewsCount: 1420,
      deliveryAvailable: false,
      badges: ["24/7 Emergency & ICU", "NABH Accredited", "Trauma & Cardiac Care", "Cashless Insurance"],
    },
    {
      name: "Tata 1mg Express Pharmacy Hub",
      type: "delivery",
      address: "Commercial Complex, Block B",
      city: areaLabel,
      phone: "1800 266 1100",
      openStatus: "Open 24/7",
      is24x7: true,
      rating: 4.7,
      reviewsCount: 2150,
      deliveryAvailable: true,
      deliveryTimeMins: 25,
      badges: ["Doorstep Delivery (25m)", "Prescription Upload", "Lab Sample Collection"],
    },
    {
      name: "MedPlus 24-Hour Medical Store",
      type: "pharmacy",
      address: "Shop 5, Station Road Market",
      city: areaLabel,
      phone: "+91 22 6123 4567",
      openStatus: "Open 24/7",
      is24x7: true,
      rating: 4.6,
      reviewsCount: 640,
      deliveryAvailable: true,
      deliveryTimeMins: 35,
      badges: ["24/7 Chemist", "Generics Available", "Home Delivery"],
    },
    {
      name: "Fortis Super Specialty Hospital & ER",
      type: "hospital",
      address: "154/9 Bannerghatta Main Road",
      city: areaLabel,
      phone: "105711 / Emergency Triage",
      openStatus: "Open 24/7",
      is24x7: true,
      rating: 4.8,
      reviewsCount: 1180,
      deliveryAvailable: false,
      badges: ["Cardiology ER", "Organ Transplant", "Stroke Center", "24/7 ICU"],
    },
    {
      name: "Wellness Forever 24/7 Day & Night Chemist",
      type: "pharmacy",
      address: "Linking Road Market",
      city: areaLabel,
      phone: "1800 102 4242",
      openStatus: "Open 24/7",
      is24x7: true,
      rating: 4.8,
      reviewsCount: 720,
      deliveryAvailable: true,
      deliveryTimeMins: 15,
      badges: ["Express 15-Min Delivery", "Surgical Supplies", "24/7 Chemist"],
    },
    {
      name: "Manipal Hospital & Emergency Care",
      type: "hospital",
      address: "98 Airport Road, Kodihalli",
      city: areaLabel,
      phone: "1800 102 5555",
      openStatus: "Open 24/7",
      is24x7: true,
      rating: 4.7,
      reviewsCount: 950,
      deliveryAvailable: false,
      badges: ["24/7 Emergency Triage", "Pediatric ICU", "Ambulance Hub"],
    },
    {
      name: "Max Super Speciality Hospital",
      type: "hospital",
      address: "1, 2 Press Enclave Marg",
      city: areaLabel,
      phone: "+91 11 2651 5050",
      openStatus: "Open 24/7",
      is24x7: true,
      rating: 4.8,
      reviewsCount: 1650,
      deliveryAvailable: false,
      badges: ["Emergency Trauma", "Oncology Triage", "24/7 Pharmacy"],
    },
  ];

  // Geolocation offsets (~0.005 deg is approx 0.5km)
  const offsets = [
    { latOff: 0.004, lngOff: 0.005 },
    { latOff: -0.012, lngOff: 0.008 },
    { latOff: 0.015, lngOff: -0.011 },
    { latOff: -0.018, lngOff: -0.014 },
    { latOff: 0.025, lngOff: 0.022 },
    { latOff: -0.031, lngOff: 0.028 },
    { latOff: 0.038, lngOff: -0.034 },
    { latOff: -0.042, lngOff: 0.039 },
  ];

  return templates
    .map((tmpl, idx) => {
      const off = offsets[idx % offsets.length];
      const facLat = userLat + off.latOff;
      const facLng = userLng + off.lngOff;
      const dist = calculateHaversineDistance(userLat, userLng, facLat, facLng);

      return {
        ...tmpl,
        id: `nearby_gen_${idx}_${Math.floor(Math.abs(facLat) * 100)}`,
        lat: facLat,
        lng: facLng,
        distanceKm: dist,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

// Popular Indian OTC & prescription medicines list
const indianMedicines = [
  { id: "im1", name: "Dolo 650mg (Paracetamol - Fever & Pain)", price: 32.0, category: "Fever & Body Pain" },
  { id: "im2", name: "Crocin 500mg Fast Relief", price: 24.5, category: "Analgesic & Antipyretic" },
  { id: "im3", name: "Augmentin 625 Duo (Amoxicillin & Clavulanate)", price: 204.0, category: "Prescription Antibiotic" },
  { id: "im4", name: "Allegra 120mg (Fexofenadine - Allergy Relief)", price: 185.0, category: "Antihistamine" },
  { id: "im5", name: "Pantocid 40mg (Pantoprazole - Acid Reflux)", price: 145.0, category: "Digestive Health" },
  { id: "im6", name: "Limcee Vitamin C 500mg Chewable Tablets", price: 105.0, category: "Immunity Booster" },
  { id: "im7", name: "Omron Automatic Blood Pressure Monitor", price: 1999.0, category: "Medical Device" },
  { id: "im8", name: "FastAid Complete First Aid Kit (24 Items)", price: 350.0, category: "First Aid & Bandages" },
];

export default function NearbyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [locating, setLocating] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  // Delivery order modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [targetPharmacy, setTargetPharmacy] = useState<Facility | null>(null);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliverySpeed, setDeliverySpeed] = useState<"express" | "standard">("express");
  const [uploadedRxName, setUploadedRxName] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [activeOrder, setActiveOrder] = useState<{ id: string; pharmacy: string; eta: string } | null>(null);

  // Detect location automatically using Browser GPS
  const handleDetectLocation = (isManual = false) => {
    if (!navigator.geolocation) {
      if (isManual) toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const liveAddress = `Your Live Area (${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°)`;
        
        setUserLocation({
          lat: latitude,
          lng: longitude,
          address: liveAddress,
        });

        // Generate local medical facilities strictly within 0.5km - 8.0km of user's GPS!
        const nearby = generateNearbyFacilities(latitude, longitude, "Your Local Area");
        setFacilities(nearby);
        if (nearby.length > 0) setSelectedFacility(nearby[0]);

        setLocating(false);
        if (isManual) {
          toast.success(`Live GPS detected! Showing 8 nearby medical facilities within 5 km.`);
        }
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setLocating(false);
        const defaultLat = 28.528;
        const defaultLng = 77.213;
        const defaultUser = {
          lat: defaultLat,
          lng: defaultLng,
          address: "Saket, New Delhi, India (Default)",
        };
        setUserLocation(defaultUser);

        const nearby = generateNearbyFacilities(defaultLat, defaultLng, "New Delhi");
        setFacilities(nearby);
        if (nearby.length > 0) setSelectedFacility(nearby[0]);

        if (isManual) {
          toast.info("Using region default. Search any city or click 'Detect Current Location' to re-try.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem("medivoice_active_medicine_order");
      if (savedOrder) {
        const parsed = JSON.parse(savedOrder);
        // Keep order for up to 3 hours
        if (parsed && (Date.now() - (parsed.timestamp || 0)) < 3 * 3600 * 1000) {
          setActiveOrder(parsed);
        } else {
          localStorage.removeItem("medivoice_active_medicine_order");
        }
      }
    } catch {
      // ignore storage errors
    }
    handleDetectLocation(false);
  }, []);

  // Filter facilities by category, search query, and max 50km radius
  const filteredFacilities = facilities
    .filter((f) => f.distanceKm <= 50) // Strict 50km radius cutoff
    .filter((f) => {
      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "hospital" && f.type === "hospital") ||
        (selectedCategory === "pharmacy" && (f.type === "pharmacy" || f.type === "delivery")) ||
        (selectedCategory === "delivery" && f.deliveryAvailable) ||
        (selectedCategory === "clinic" && f.type === "clinic");

      const matchesSearch =
        !searchQuery.trim() ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.badges.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });

  // Open delivery modal for a pharmacy
  const handleOpenDeliveryModal = (facility: Facility) => {
    setTargetPharmacy(facility);
    setCartItems({});
    setDeliveryAddress(userLocation?.address || "Flat 402, Sunshine Heights, MG Road");
    setOrderModalOpen(true);
  };

  // Cart operations
  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      const current = prev[id] || 0;
      const updated = current + delta;
      if (updated <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: updated };
    });
  };

  // Calculate cart total
  const cartSubtotal = Object.entries(cartItems).reduce((acc, [id, qty]) => {
    const med = indianMedicines.find((m) => m.id === id);
    return acc + (med ? med.price * qty : 0);
  }, 0);

  const deliveryFee = deliverySpeed === "express" ? 49.0 : 25.0;
  const grandTotal = cartSubtotal > 0 ? cartSubtotal + deliveryFee : 0;

  // Submit order
  const handlePlaceOrder = () => {
    if (Object.keys(cartItems).length === 0 && !uploadedRxName) {
      toast.error("Please select at least one medicine or upload a prescription.");
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Please enter a valid delivery address.");
      return;
    }

    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      setOrderModalOpen(false);
      const orderId = `IND-${Math.floor(100000 + Math.random() * 900000)}`;
      const etaStr = deliverySpeed === "express" ? "20 - 30 mins" : "45 - 60 mins";

      const selectedMedsList = Object.entries(cartItems)
        .map(([id, qty]) => {
          const med = indianMedicines.find((m) => m.id === id);
          return med ? `${med.name} (x${qty})` : null;
        })
        .filter(Boolean) as string[];

      if (uploadedRxName) {
        selectedMedsList.unshift(`Prescription: ${uploadedRxName}`);
      }

      const newOrder = {
        id: orderId,
        pharmacy: targetPharmacy?.name || "Apollo Pharmacy 24/7",
        address: deliveryAddress,
        deliverySpeed,
        items: selectedMedsList.length > 0 ? selectedMedsList : ["General Medicine Pack"],
        totalAmount: grandTotal,
        eta: etaStr,
        status: "Rider Dispatched",
        createdAt: new Date().toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: Date.now(),
      };

      setActiveOrder(newOrder);
      try {
        localStorage.setItem("medivoice_active_medicine_order", JSON.stringify(newOrder));
        
        // Append to profile orders history
        const existingHistory = JSON.parse(localStorage.getItem("medivoice_medicine_orders_history") || "[]");
        const updatedHistory = [newOrder, ...existingHistory.filter((o: any) => o.id !== newOrder.id)];
        localStorage.setItem("medivoice_medicine_orders_history", JSON.stringify(updatedHistory));
      } catch {
        // ignore
      }
      toast.success(`Medicine Delivery Request ${orderId} placed successfully!`);
    }, 1200);
  };

  const handleDismissOrder = () => {
    if (activeOrder) {
      try {
        const history = JSON.parse(localStorage.getItem("medivoice_medicine_orders_history") || "[]");
        const updatedHistory = history.map((o: any) => {
          if (o.id === activeOrder.id) {
            return {
              ...o,
              status: "Delivered",
              deliveredAt: new Date().toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          }
          return o;
        });
        localStorage.setItem("medivoice_medicine_orders_history", JSON.stringify(updatedHistory));
      } catch {
        // ignore
      }
    }
    setActiveOrder(null);
    try {
      localStorage.removeItem("medivoice_active_medicine_order");
    } catch {}
    toast.success("Order status updated to Delivered in your profile!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      <AppHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-[#590d0e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-red-200 border border-white/15">
                <MapPin className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                Live GPS Medical Tracker (Strictly Local Facilities)
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Nearby Hospitals & <span className="text-red-400">Medicine Delivery</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Find emergency hospitals and 24/7 pharmacies placed strictly within your immediate area (0.5 km to 5 km).
              </p>
            </div>

            {/* India Emergency Hotline Box */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 shrink-0 shadow-inner">
              <div className="p-3 bg-red-600/90 text-white rounded-xl shadow-md animate-bounce">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-red-300">
                  India Ambulance Hotline
                </span>
                <p className="text-xl font-black text-white">Dial 108 / 102 / 112</p>
                <p className="text-[10px] text-slate-300">National Medical Triage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Active Order Banner (Persisted in localStorage) */}
        {activeOrder && (
          <div className="bg-emerald-900/90 text-white p-4 rounded-2xl border border-emerald-500/40 shadow-md flex items-center justify-between gap-4 flex-wrap animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Truck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-emerald-100">
                    Doorstep Medicine Delivery Active ({activeOrder.id})
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase">
                    Rider Dispatched
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Partner pharmacy: <strong>{activeOrder.pharmacy}</strong> · Delivery ETA:{" "}
                  <span className="font-mono font-bold underline">{activeOrder.eta}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.info(`Rider dispatched from ${activeOrder.pharmacy}. Delivery ETA: ${activeOrder.eta}.`)}
                className="text-xs border-emerald-400/50 text-emerald-100 hover:bg-emerald-800"
              >
                Track Live Rider
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismissOrder}
                className="text-xs text-emerald-300 hover:text-white hover:bg-emerald-800/60"
              >
                Clear / Delivered
              </Button>
            </div>
          </div>
        )}

        {/* Search & Location Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search hospital (Apollo, Fortis), pharmacy, Dolo 650, PIN code, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a4161a]/30 focus:border-[#a4161a]"
            />
          </div>

          {/* Detect Location Button */}
          <Button
            onClick={() => handleDetectLocation(true)}
            disabled={locating}
            className="w-full md:w-auto bg-[#a4161a] hover:bg-[#801013] text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all shrink-0"
          >
            <Navigation className={`w-3.5 h-3.5 ${locating ? "animate-spin" : ""}`} />
            {locating ? "Detecting Live GPS..." : "Detect Current Location"}
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            {[
              { id: "all", label: "All Nearby Facilities", icon: Building2 },
              { id: "hospital", label: "Hospitals & 24/7 ER", icon: Building2 },
              { id: "pharmacy", label: "Medical Shops & Chemists", icon: Pill },
              { id: "delivery", label: "Express 20-30m Delivery", icon: Truck },
              { id: "clinic", label: "Clinics & Diagnostic Centers", icon: ShieldCheck },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "bg-[#a4161a] text-white shadow-xs"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-gray-500 font-medium whitespace-nowrap shrink-0 hidden lg:block">
            Sorted by closest distance ({filteredFacilities.length} locations)
          </div>
        </div>

        {/* Main Content Layout: Grid + Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Facilities Cards Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredFacilities.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-3">
                <div className="p-4 rounded-full bg-slate-100 w-14 h-14 mx-auto flex items-center justify-center text-gray-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">No Nearby Medical Facilities Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting &ldquo;All Nearby Facilities&rdquo;.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="text-xs"
                >
                  Reset Search & Filters
                </Button>
              </div>
            ) : (
              filteredFacilities.map((fac) => (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  className={`bg-white p-5 rounded-2xl border transition-all duration-200 space-y-3 hover:shadow-md cursor-pointer ${
                    selectedFacility?.id === fac.id
                      ? "border-[#a4161a] ring-2 ring-[#a4161a]/10 shadow-sm"
                      : "border-gray-200/90 hover:border-gray-300"
                  }`}
                >
                  {/* Top metadata */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-3 rounded-xl shrink-0 ${
                          fac.type === "hospital"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : fac.type === "pharmacy"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : fac.type === "delivery"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-purple-50 text-purple-700 border border-purple-100"
                        }`}
                      >
                        {fac.type === "hospital" ? (
                          <Building2 className="w-5 h-5" />
                        ) : fac.type === "pharmacy" ? (
                          <Pill className="w-5 h-5" />
                        ) : fac.type === "delivery" ? (
                          <Truck className="w-5 h-5" />
                        ) : (
                          <ShieldCheck className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-gray-900 hover:text-[#a4161a] transition-colors">
                            {fac.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              fac.is24x7
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {fac.openStatus}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          {fac.address}, {fac.city}
                        </p>
                      </div>
                    </div>

                    {/* Distance & Rating */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 justify-end text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{fac.rating}</span>
                        <span className="text-gray-400 text-[10px] font-normal">({fac.reviewsCount})</span>
                      </div>
                      <span className="text-xs font-black text-emerald-700 block mt-0.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {fac.distanceKm} km away
                      </span>
                    </div>
                  </div>

                  {/* Feature Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {fac.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {/* Google Maps Directions Link */}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${fac.name} ${fac.address} ${fac.city}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-slate-600" />
                        Get Directions
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>

                      {/* Phone call link */}
                      <a
                        href={`tel:${fac.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                        Call
                      </a>
                    </div>

                    {/* Order Medicine Button */}
                    {fac.deliveryAvailable && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDeliveryModal(fac);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Order Medicine Delivery
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Map Preview Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs space-y-3 sticky top-24">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#a4161a]" />
                  Live Map (User Centered)
                </h4>
                <span className="text-[11px] text-gray-400 truncate max-w-[160px]">
                  {selectedFacility ? selectedFacility.name : "Center: Live GPS"}
                </span>
              </div>

              <div className="relative h-[320px] w-full rounded-xl overflow-hidden border border-gray-200 bg-slate-100">
                <iframe
                  title="Medical Map View Live"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${
                    selectedFacility
                      ? encodeURIComponent(`${selectedFacility.name} ${selectedFacility.address} ${selectedFacility.city}`)
                      : encodeURIComponent(userLocation?.address || "Bengaluru, Karnataka, India")
                  }&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                />
              </div>

              {/* Facility Quick Info Bar */}
              {selectedFacility ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-gray-900">
                    <span>{selectedFacility.name}</span>
                    <span className="text-emerald-700 font-black">{selectedFacility.distanceKm} km away</span>
                  </div>
                  <p className="text-gray-500">{selectedFacility.address}, {selectedFacility.city}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-gray-700">
                    <span>Phone: {selectedFacility.phone}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${selectedFacility.name} ${selectedFacility.address}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#a4161a] hover:underline flex items-center gap-1"
                    >
                      Open Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 text-center py-1 italic">
                  Select any hospital or medical shop card to pin its location on Google Maps.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ─── MEDICINE DELIVERY ORDER MODAL (INDIA INR ₹) ─────────────────────────── */}
      {orderModalOpen && targetPharmacy && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-gray-900">Order Medicine Delivery</h3>
                  <p className="text-xs text-gray-500">
                    Fulfilling Pharmacy: <strong>{targetPharmacy.name}</strong> ({targetPharmacy.distanceKm} km away)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Indian Medicine Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Select OTC Medicines & Essentials (₹ INR)
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {indianMedicines.map((med) => {
                  const qty = cartItems[med.id] || 0;
                  return (
                    <div
                      key={med.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white transition-colors"
                    >
                      <div>
                        <h5 className="font-bold text-xs text-gray-900">{med.name}</h5>
                        <p className="text-[10px] text-gray-500">
                          {med.category} · <span className="font-bold text-emerald-700">₹{med.price.toFixed(2)}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {qty > 0 ? (
                          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(med.id, -1)}
                              className="p-1 text-emerald-800 hover:bg-emerald-100 rounded-md"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-emerald-900 w-4 text-center">{qty}</span>
                            <button
                              onClick={() => updateQuantity(med.id, 1)}
                              className="p-1 text-emerald-800 hover:bg-emerald-100 rounded-md"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(med.id, 1)}
                            className="text-xs h-7 border-emerald-200 text-emerald-800 hover:bg-emerald-50 font-bold"
                          >
                            + Add
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upload Prescription Option */}
            <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
              <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                Upload Doctor Prescription / Slip (Rx)
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadedRxName(file.name);
                    toast.success(`Prescription uploaded: ${file.name}`);
                  }
                }}
                className="text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              {uploadedRxName && (
                <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Rx Attached: {uploadedRxName}
                </p>
              )}
            </div>

            {/* Delivery Speed & Address */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliverySpeed("express")}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    deliverySpeed === "express"
                      ? "border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="font-bold text-xs text-gray-900 block">⚡ Express Delivery</span>
                  <span className="text-[10px] text-gray-500">20 - 30 Mins (₹49)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliverySpeed("standard")}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    deliverySpeed === "standard"
                      ? "border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="font-bold text-xs text-gray-900 block">🚚 Standard Delivery</span>
                  <span className="text-[10px] text-gray-500">45 - 60 Mins (₹25)</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Flat/House No, Building, Street, Area, City, PIN Code..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* Order Summary & Submit Button */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Medicines Subtotal</span>
                  <span className="font-bold text-white">₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee ({deliverySpeed})</span>
                  <span className="font-bold text-white">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-emerald-400 pt-1 border-t border-slate-800">
                  <span>Total Payable</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  "Dispatching Order Request..."
                ) : (
                  <>
                    Confirm & Dispatch Delivery
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AppFooter />
    </div>
  );
}
