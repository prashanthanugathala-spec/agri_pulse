/**
 * High-fidelity fallback data for standalone Netlify deployments
 * Ensures full UI interactivity and telemetry metrics when backend server is offline
 */

export const mockDashboardOverview = {
  activeParcels: 4,
  averageMoisture: 68.2,
  activeAlertsCount: 2,
  systemVitalityScore: 92,
  liveWeather: {
    location: 'Hyderabad, Telangana',
    temperature: 29.4,
    conditionName: 'Clear Sky',
    humidity: 58,
    windSpeed: 12.0,
    uvIndex: 7,
    rainProbability: 10,
    advisories: [
      { type: 'HEAT_ADVISORY', title: 'Midday Solar Radiance Alert', message: 'Expected UV index peaks at 8.0 between 12:00 PM and 2:30 PM. Maintain drip pulse on Zone C polyhouse.' },
      { type: 'PEST_WINDOW', title: 'Favorable Spray Window', message: 'Low wind velocities (<10 km/h) forecasted for tomorrow morning 6:00 AM - 9:00 AM.' },
    ],
  },
  soilSummary: {
    nitrogen: 185.0,
    phosphorus: 34.0,
    potassium: 240.0,
    soilPh: 6.8,
    moistureDepth15cm: 68.0,
    moistureDepth30cm: 74.0,
    vitalityIndex: 88,
  },
  recentAlerts: [
    { id: 1, type: 'PEST_RISK', severity: 'HIGH', title: 'Early Blight Detected (Zone C)', message: 'Vision scan identified early blight signs on 3 tomato plants.', timestamp: '2026-09-30T10:15:00', resolved: false },
    { id: 2, type: 'WEATHER_RAIN', severity: 'MEDIUM', title: 'Rain Forecast (Sunday)', message: 'Sunday rainfall forecasted at 22mm. Automated irrigation paused.', timestamp: '2026-09-30T09:00:00', resolved: false },
  ],
  crops: [
    { id: 1, name: 'Samba Mahsuri Rice', variety: 'BPT-5204', parcel: 'Zone A - South Basin', stage: 'Tillering', healthScore: 94, acreage: 4.5 },
    { id: 2, name: 'Bt-Cotton', variety: 'Bollgard II', parcel: 'Zone B - East Terrace', stage: 'Flowering & Boll Setting', healthScore: 88, acreage: 3.8 },
    { id: 3, name: 'Polyhouse Tomato', variety: 'Arka Rakshak', parcel: 'Zone C - Greenhouse A', stage: 'Fruit Ripening', healthScore: 82, acreage: 2.2 },
    { id: 4, name: 'Nagpur Mandarin Orange', variety: 'Sweet Orange', parcel: 'Zone D - Hill Slope', stage: 'Vegetative Growth', healthScore: 96, acreage: 2.0 },
  ],
};

export const mockParcels = [
  { id: 1, code: 'P-101', name: 'Zone A - South Basin', acreage: 4.5, cropName: 'Rice (BPT-5204)', soilMoisture: 72.0, soilPh: 6.6, cropStage: 'Tillering', ndviIndex: 0.82, irrigationStatus: 'ACTIVE' },
  { id: 2, code: 'P-102', name: 'Zone B - East Terrace', acreage: 3.8, cropName: 'Bt-Cotton (Bollgard II)', soilMoisture: 64.0, soilPh: 6.9, cropStage: 'Flowering', ndviIndex: 0.78, irrigationStatus: 'SCHEDULED' },
  { id: 3, code: 'P-103', name: 'Zone C - Polyhouse A', acreage: 2.2, cropName: 'Tomato (Arka Rakshak)', soilMoisture: 68.0, soilPh: 6.5, cropStage: 'Fruit Ripening', ndviIndex: 0.74, irrigationStatus: 'IDLE' },
  { id: 4, code: 'P-104', name: 'Zone D - Hill Slope', acreage: 2.0, cropName: 'Mandarin Orange', soilMoisture: 65.0, soilPh: 7.1, cropStage: 'Vegetative', ndviIndex: 0.88, irrigationStatus: 'STANDBY' },
];

export const mockCrops = [
  { id: 1, name: 'Samba Mahsuri Rice', variety: 'BPT-5204', season: 'Kharif', stage: 'Tillering', healthScore: 94, yieldForecast: '5.8 tons/ha', waterRequirement: 'High', status: 'OPTIMAL' },
  { id: 2, name: 'Bt-Cotton', variety: 'Bollgard II', season: 'Kharif', stage: 'Flowering', healthScore: 88, yieldForecast: '3.2 tons/ha', waterRequirement: 'Medium', status: 'ATTENTION' },
  { id: 3, name: 'Polyhouse Tomato', variety: 'Arka Rakshak', season: 'Year-Round', stage: 'Fruit Ripening', healthScore: 82, yieldForecast: '45 tons/ha', waterRequirement: 'Controlled Drip', status: 'ALERT' },
  { id: 4, name: 'Nagpur Mandarin Orange', variety: 'Sweet Orange', season: 'Perennial', stage: 'Vegetative', healthScore: 96, yieldForecast: '18 tons/ha', waterRequirement: 'Micro-Sprinkler', status: 'OPTIMAL' },
];

export const mockSoilMetrics = {
  nitrogen: 185.0,
  phosphorus: 34.0,
  potassium: 240.0,
  soilPh: 6.8,
  organicCarbon: 0.72,
  electricalConductivity: 0.45,
  moistureDepth15cm: 68.0,
  moistureDepth30cm: 74.0,
  vitalityIndex: 88,
  temperature: 24.2,
};

export const mockSoilTests = [
  { id: 1, parcelCode: 'P-101', testDate: '2026-09-25', nitrogen: 185, phosphorus: 34, potassium: 240, ph: 6.8, organicCarbon: 0.72, status: 'NORMAL' },
  { id: 2, parcelCode: 'P-102', testDate: '2026-09-20', nitrogen: 172, phosphorus: 31, potassium: 228, ph: 6.9, organicCarbon: 0.68, status: 'NORMAL' },
  { id: 3, parcelCode: 'P-103', testDate: '2026-09-15', nitrogen: 195, phosphorus: 42, potassium: 260, ph: 6.4, organicCarbon: 0.85, status: 'OPTIMAL' },
];

export const mockWeatherCurrent = {
  id: 1,
  farmId: 1,
  location: 'Hyderabad, Telangana',
  temperature: 29.4,
  conditionName: 'Clear Sky',
  humidity: 58,
  windSpeed: 12.0,
  uvIndex: 7,
  evapotranspiration: 4.6,
  rainProbability: 10,
  recordedAt: '2026-09-30T10:00:00',
};

export const mockWeatherForecast = [
  { day: 'Today', temp: 29.4, condition: 'Sunny', icon: 'wb_sunny', rain: 10 },
  { day: 'Thu', temp: 30.1, condition: 'Partly Cloudy', icon: 'partly_cloudy_day', rain: 15 },
  { day: 'Fri', temp: 28.5, condition: 'Cloudy', icon: 'cloud', rain: 25 },
  { day: 'Sat', temp: 27.8, condition: 'Scattered Rain', icon: 'rainy', rain: 60 },
  { day: 'Sun', temp: 28.2, condition: 'Light Showers', icon: 'rainy_light', rain: 40 },
  { day: 'Mon', temp: 29.0, condition: 'Sunny', icon: 'wb_sunny', rain: 10 },
  { day: 'Tue', temp: 30.0, condition: 'Sunny', icon: 'wb_sunny', rain: 5 },
];

export const mockWeatherAdvisories = [
  { type: 'HEAT_ADVISORY', title: 'Midday Solar Radiance Alert', message: 'Expected UV index peaks at 8.0 between 12:00 PM and 2:30 PM. Maintain drip pulse on Zone C polyhouse.' },
  { type: 'PEST_WINDOW', title: 'Favorable Spray Window', message: 'Low wind velocities (<10 km/h) forecasted for tomorrow morning 6:00 AM - 9:00 AM.' },
];

export const mockIrrigationZones = [
  { id: 1, name: 'Zone A - Rice Basin', flowRate: 45, status: 'ACTIVE', valveOpen: true, scheduledTime: '06:00 AM', moistureLevel: 72 },
  { id: 2, name: 'Zone B - Cotton Basin', flowRate: 38, status: 'IDLE', valveOpen: false, scheduledTime: '04:30 AM', moistureLevel: 64 },
  { id: 3, name: 'Zone C - Tomato Polyhouse', flowRate: 22, status: 'STANDBY', valveOpen: false, scheduledTime: '11:00 AM', moistureLevel: 68 },
  { id: 4, name: 'Zone D - Citrus Orchard', flowRate: 50, status: 'STANDBY', valveOpen: false, scheduledTime: '05:00 PM', moistureLevel: 65 },
];

export const mockPestDiagnostics = [
  { id: 1, pestName: 'Early Blight (Alternaria solani)', cropTarget: 'Tomato', confidence: 94.6, severity: 'HIGH', parcel: 'Zone C Polyhouse', treatment: 'Foliar spray Chlorothalonil 75% WP @ 2g/L at early morning.' },
  { id: 2, pestName: 'Cotton Aphids (Aphis gossypii)', cropTarget: 'Bt-Cotton', confidence: 88.2, severity: 'LOW', parcel: 'Zone B East Terrace', treatment: 'Monitor closely. Apply Neem oil 1500 ppm if density exceeds 5 per leaf.' },
];

export const mockAlerts = [
  { id: 1, type: 'PEST_RISK', severity: 'HIGH', title: 'Early Blight Warning in Zone C', message: 'Detected on tomato foliage with 94.6% confidence.', timestamp: '2026-09-30T10:15:00', resolved: false },
  { id: 2, type: 'WEATHER_RAIN', severity: 'MEDIUM', title: 'Rain Forecast (Sunday 60%)', message: 'Forecasted precipitation: 18-24mm. Hold irrigation.', timestamp: '2026-09-30T09:00:00', resolved: false },
];

export const mockSensors = [
  { id: 1, code: 'SNS-SOIL-01', name: 'NPK Pro Probe A', parcelCode: 'P-101', battery: 94, signal: -68, status: 'ONLINE', type: 'SOIL_MULTI' },
  { id: 2, code: 'SNS-SOIL-02', name: 'NPK Pro Probe B', parcelCode: 'P-102', battery: 88, signal: -72, status: 'ONLINE', type: 'SOIL_MULTI' },
  { id: 3, code: 'SNS-WTH-04', name: 'Microclimate Hub', parcelCode: 'P-103', battery: 100, signal: -60, status: 'ONLINE', type: 'WEATHER' },
  { id: 4, code: 'SNS-VLV-01', name: 'Smart Drip Valve A', parcelCode: 'P-101', battery: 82, signal: -75, status: 'ONLINE', type: 'VALVE' },
];

export const mockSettings = {
  fullName: 'Ravi Kumar',
  email: 'ravi@agripulse.io',
  farmName: 'Precision Agriculture Estate',
  totalAcreage: 12.5,
  telemetryFrequency: 15,
  notificationsEnabled: true,
  smsAlerts: true,
};

export const mockUser = {
  id: 1,
  email: 'ravi@agripulse.io',
  fullName: 'Ravi Kumar',
  role: 'ESTATE_AGRONOMIST',
  farmName: 'Precision Agriculture Estate',
  totalAcreage: 12.5,
  token: 'agripulse_demo_jwt_token',
};

// ==========================================
// MARKET PRICES (Mandi & APMC Telemetry)
// ==========================================
export const mockMarketPrices = [
  {
    id: 1,
    commodity: 'Paddy (Dhan)',
    variety: 'Sona Masoori (BPT-5204)',
    category: 'Cereals',
    mandi: 'Bowenpally APMC, Hyderabad',
    state: 'Telangana',
    modalPrice: 2350,
    minPrice: 2180,
    maxPrice: 2490,
    msp: 2300,
    change: 45,
    unit: '₹ / Quintal',
    arrivalsTons: 380,
    trend: 'UP',
    advisory: 'Price trending above MSP. Strong mill demand; ideal selling window within next 10 days.',
  },
  {
    id: 2,
    commodity: 'Cotton (Kapas)',
    variety: 'Bt-Cotton (Medium Staple)',
    category: 'Cash Crops',
    mandi: 'Enamamula Mandi, Warangal',
    state: 'Telangana',
    modalPrice: 7420,
    minPrice: 7100,
    maxPrice: 7650,
    msp: 7121,
    change: 110,
    unit: '₹ / Quintal',
    arrivalsTons: 520,
    trend: 'UP',
    advisory: 'Export inquiries surging. Holding stock for another 2 weeks recommended for peak realization.',
  },
  {
    id: 3,
    commodity: 'Tomato',
    variety: 'Hybrid (Arka Rakshak)',
    category: 'Vegetables',
    mandi: 'Madanapalle APMC / Hyderabad',
    state: 'Andhra / Telangana',
    modalPrice: 1850,
    minPrice: 1400,
    maxPrice: 2100,
    msp: null,
    change: -80,
    unit: '₹ / Quintal',
    arrivalsTons: 840,
    trend: 'DOWN',
    advisory: 'Heavy arrivals from border districts. Early morning dispatch to local markets advised to preserve margins.',
  },
  {
    id: 4,
    commodity: 'Sweet Orange (Mosambi)',
    variety: 'Nagpur / Nalgonda Grade A',
    category: 'Fruits',
    mandi: 'Nalgonda Fruit Yard',
    state: 'Telangana',
    modalPrice: 4800,
    minPrice: 4200,
    maxPrice: 5300,
    msp: null,
    change: 150,
    unit: '₹ / Quintal',
    arrivalsTons: 210,
    trend: 'UP',
    advisory: 'High festive demand in metro cities. Direct farm-gate procurement offers ₹200 premium.',
  },
  {
    id: 5,
    commodity: 'Maize (Makka)',
    variety: 'Yellow Hybrid (Pioneer)',
    category: 'Cereals',
    mandi: 'Nizamabad APMC',
    state: 'Telangana',
    modalPrice: 2225,
    minPrice: 2050,
    maxPrice: 2310,
    msp: 2225,
    change: 0,
    unit: '₹ / Quintal',
    arrivalsTons: 310,
    trend: 'STABLE',
    advisory: 'Trading exactly at government MSP benchmark. Poultry feed demand remains constant.',
  },
  {
    id: 6,
    commodity: 'Red Chilli',
    variety: 'Teja S17 / Guntur Mirchi',
    category: 'Spices',
    mandi: 'Guntur Mirchi Yard',
    state: 'Andhra Pradesh',
    modalPrice: 18500,
    minPrice: 16800,
    maxPrice: 19800,
    msp: null,
    change: 350,
    unit: '₹ / Quintal',
    arrivalsTons: 1150,
    trend: 'UP',
    advisory: 'High oleoresin grade commanding premium. Cold storage retention advised if quality is A1.',
  },
  {
    id: 7,
    commodity: 'Soybean',
    variety: 'JS-335',
    category: 'Oilseeds',
    mandi: 'Indore Mandi',
    state: 'Madhya Pradesh',
    modalPrice: 4890,
    minPrice: 4650,
    maxPrice: 5050,
    msp: 4892,
    change: -25,
    unit: '₹ / Quintal',
    arrivalsTons: 430,
    trend: 'DOWN',
    advisory: 'Imported oil parity pressuring domestic prices. Government procurement counters active at MSP.',
  },
  {
    id: 8,
    commodity: 'Onion',
    variety: 'Nashik Red',
    category: 'Vegetables',
    mandi: 'Lasalgaon / Bowenpally',
    state: 'Maharashtra / Telangana',
    modalPrice: 2100,
    minPrice: 1750,
    maxPrice: 2350,
    msp: null,
    change: -50,
    unit: '₹ / Quintal',
    arrivalsTons: 920,
    trend: 'DOWN',
    advisory: 'Steady buffer stock releases by NAFED keeping prices stabilized.',
  },
];

// ==========================================
// DIFFERENT TYPES OF FARMING TECHNIQUES
// ==========================================
export const mockFarmingTechniques = [
  {
    id: 'precision',
    title: 'Precision Agriculture & Smart IoT Farming',
    category: 'Technology Driven',
    badge: 'High Efficiency',
    icon: 'sensors',
    tagline: 'Data-guided farming optimizing every square meter with IoT and AI.',
    description: 'Precision farming leverages GPS-guided field mapping, subterranean IoT soil probes, drone multispectral NDVI imagery, and variable rate technology (VRT) for seeds, water, and fertilizers.',
    waterSavings: '35 - 50%',
    yieldIncrease: '+20 - 35%',
    costReduction: '18% input savings',
    setupCost: 'Medium to High',
    skillLevel: 'Moderate (guided by AgriPulse)',
    idealFor: ['Paddy', 'Cotton', 'Maize', 'Orchards', 'Vegetables'],
    corePillars: [
      'Multi-depth subterranean soil moisture and NPK telemetry',
      'Automated closed-loop solenoid valve irrigation',
      'Drone thermal and multispectral crop stress monitoring',
      'Variable-Rate-Application (VRA) for targeted fertilizer delivery'
    ],
    adoptionSteps: [
      'Install IoT probe gateways across distinct soil zones',
      'Digitize parcel GIS boundary maps and soil nutrient baselines',
      'Connect solenoid valves to automated schedule controllers',
      'Calibrate telemetry thresholds with crop phenology stages'
    ]
  },
  {
    id: 'organic',
    title: 'Certified Organic Farming',
    category: 'Ecological & Sustainable',
    badge: 'Premium Price',
    icon: 'eco',
    tagline: 'Chemical-free farming using biological cycles and natural nutrient buffers.',
    description: 'Eliminates all synthetic fertilizers, chemical pesticides, and GMO seeds. Relies on green manuring (Dhaincha/Sunhemp), vermicomposting, bio-fertilizers (Azotobacter, Rhizobium, PSB), and biological pest management.',
    waterSavings: '20 - 30%',
    yieldIncrease: 'Gradual (+15% after transition)',
    costReduction: '40% chemical cost elimination',
    setupCost: 'Low to Medium',
    skillLevel: 'Moderate',
    idealFor: ['Rice', 'Pulses', 'Spices', 'Fruits', 'Vegetables'],
    corePillars: [
      'Organic matter enrichment via vermicompost and compost tea',
      'Green manuring with nitrogen-fixing leguminous plants',
      'Biological pest control using Neem, Trichoderma, and trap crops',
      'NPOP / Jaivik Bharat organic certification and premium market linkage'
    ],
    adoptionSteps: [
      'Establish 3-year transition protocol with buffer borders',
      'Build on-farm vermicompost and Panchagavya preparation pits',
      'Introduce Azospirillum, Rhizobium, and Phosphobacteria during sowing',
      'Register for PKVY government organic cluster subsidy'
    ]
  },
  {
    id: 'hydroponics',
    title: 'Hydroponics & Aquaponics (Soil-less)',
    category: 'Controlled Environment',
    badge: '10x Productivity',
    icon: 'water',
    tagline: 'High-density vertical soilless cultivation with 90% water recycling.',
    description: 'Hydroponics grows plants in nutrient-rich water solutions without soil using systems like Nutrient Film Technique (NFT), Deep Water Culture (DWC), and Dutch Buckets. Aquaponics couples this with recirculating aquaculture for fish and crop co-production.',
    waterSavings: '85 - 90%',
    yieldIncrease: '+300 - 500% per sq meter',
    costReduction: 'Minimal weeding & zero soil pathogen costs',
    setupCost: 'High',
    skillLevel: 'Specialized',
    idealFor: ['Leafy Greens', 'Tomato', 'Bell Pepper', 'Strawberries', 'Herbs'],
    corePillars: [
      'Automated EC (Electrical Conductivity) and pH balancing dosing pumps',
      'Closed-loop water recirculation filtration and UV sterilization',
      'Dissolved oxygen enrichment at root tips (6 - 8 mg/L)',
      'Substrate support using sterile expanded clay pebbles, perlite, or cocopeat'
    ],
    adoptionSteps: [
      'Construct polyhouse or indoor climate controlled facility',
      'Erect food-grade UV-stabilized PVC/polypropylene NFT channels',
      'Calibrate nutrient dosing reservoirs with automated EC controllers',
      'Source high-germination hybrid seeds and rockwool nursery plugs'
    ]
  },
  {
    id: 'drip',
    title: 'Precision Drip & Fertigation System',
    category: 'Hydraulic Optimization',
    badge: 'Essential Infrastructure',
    icon: 'water_drop',
    tagline: 'Delivering water and soluble fertilizers directly into root absorption zones.',
    description: 'Pressurized water network through inline drippers delivering micro-pulses directly to plant root horizons. Combined with Venturi injectors for simultaneous fertigation, slashing fertilizer wastage and weed growth.',
    waterSavings: '50 - 65%',
    yieldIncrease: '+25 - 40%',
    costReduction: '30% fertilizer quantity savings',
    setupCost: 'Medium (Up to 55-70% PMKSY subsidy)',
    skillLevel: 'Easy to Moderate',
    idealFor: ['Cotton', 'Tomato', 'Citrus / Orchard', 'Chilli', 'Sugarcane'],
    corePillars: [
      'Pressure-compensating (PC) inline drippers ensuring uniform flow',
      'Automated disc/screen sand filtration to eliminate clogging',
      'Venturi injector / fertilizer tanks for targeted nutrient feeding',
      'Soil moisture sensor feedback triggering pulsed irrigation cycles'
    ],
    adoptionSteps: [
      'Map farm elevation, water source discharge, and parcel zoning',
      'Apply for PMKSY Per Drop More Crop government capital subsidy',
      'Lay mainline HDPE, sub-mains, and UV-resistant drip lateral lines',
      'Install flush valves, air release valves, and solenoid actuators'
    ]
  },
  {
    id: 'zbnf',
    title: 'Zero Budget Natural Farming (ZBNF)',
    category: 'Natural & Indigenous',
    badge: 'Lowest Capital',
    icon: 'psychiatry',
    tagline: 'Subhash Palekar natural farming model relying on indigenous cow resources.',
    description: 'ZBNF eliminates external inputs, using indigenous desi cow dung and urine formulations to stimulate native soil microorganisms, mulching for water retention, and aeration of soil capillaries.',
    waterSavings: '40 - 50%',
    yieldIncrease: 'Stable sustainable yields',
    costReduction: '80% reduction in production costs',
    setupCost: 'Extremely Low',
    skillLevel: 'Traditional / Accessible',
    idealFor: ['Millets', 'Paddy', 'Pulses', 'Oilseeds', 'Cotton'],
    corePillars: [
      'Beejamrutha: Indigenous seed treatment against seed-borne pathogens',
      'Jeevamrutha: Fermented microbial culture (cow dung, urine, jaggery, pulse flour)',
      'Acchadana (Mulching): Soil cover with biomass to preserve humus',
      'Waaphasa: Soil aeration state with moisture-air micro-equilibrium'
    ],
    adoptionSteps: [
      'Maintain at least 1 indigenous Indian Desi breed cow (Gir, Sahiwal, Ongole)',
      'Prepare 200L Jeevamrutha drum for fortnightly soil application',
      'Retain 100% crop residues and cover soil with live green mulch',
      'Adopt multi-tier intercropping with legumes (blackgram, redgram)'
    ]
  },
  {
    id: 'regenerative',
    title: 'Regenerative Agriculture & Zero-Till',
    category: 'Soil Restoration',
    badge: 'Carbon Sequestering',
    icon: 'spa',
    tagline: 'Restoring living soil ecosystems, carbon capture, and microbial biomass.',
    description: 'Regenerative farming focuses on topsoil regeneration, increasing biodiversity, improving the water cycle, and capturing carbon in soil organic matter through zero or minimal tillage and continuous multispecies cover crops.',
    waterSavings: '30 - 45%',
    yieldIncrease: '+15 - 25% over 3 seasons',
    costReduction: '50% fuel & machinery wear reduction',
    setupCost: 'Low',
    skillLevel: 'Moderate',
    idealFor: ['Wheat', 'Maize', 'Soybean', 'Cotton', 'Gram'],
    corePillars: [
      'Zero-tillage / Direct Seed Drilling preserving fungal mycorrhizae',
      'Multi-species cover crops (cocktail mixes) providing continuous living roots',
      'Rotational grazing integration where livestock cycling is possible',
      'Carbon sequestration credit generation potential'
    ],
    adoptionSteps: [
      'Replace moldboard plows with Happy Seeder / Zero-till seed drill',
      'Broadcast cover crop seeds 3 weeks before main crop harvest',
      'Monitor soil organic carbon (SOC) levels with laboratory tests',
      'Maintain uninterrupted residue blanket on soil surface year-round'
    ]
  },
  {
    id: 'vertical_polyhouse',
    title: 'Protected Polyhouse & Vertical Farming',
    category: 'High-Tech Protected',
    badge: 'Climate Shielded',
    icon: 'domain',
    tagline: 'Shield crops from extreme weather, pests, and unseasonal rainfall.',
    description: 'Controlled Environment Agriculture (CEA) utilizing greenhouse/polyhouse structures with thermal shade nets, automated foggers, insect screens, and vertical growing racks for commercial horticulture.',
    waterSavings: '60 - 75%',
    yieldIncrease: '+400 - 800%',
    costReduction: 'Zero unseasonal weather crop loss',
    setupCost: 'High (State horticulture subsidies available up to 50%)',
    skillLevel: 'High',
    idealFor: ['Exotic Vegetables', 'Polyhouse Tomato', 'Capsicum', 'Flowers', 'Nurseries'],
    corePillars: [
      'Automated climate control (misters, cooling pads, and exhaust fans)',
      'UV-stabilized 200-micron polyethylene sheeting and 40-mesh insect net',
      'Vertical multi-tier trellis support systems maximizing canopy height',
      'Year-round continuous production independent of external seasons'
    ],
    adoptionSteps: [
      'Secure site layout with east-west orientation and windbreak buffers',
      'Apply for National Horticulture Mission (NHM) polyhouse subsidy',
      'Fabricate GI pipe tubular structural framework',
      'Install drip fertigation and micro-sprinkler misting lines'
    ]
  },
  {
    id: 'agroforestry',
    title: 'Agroforestry & Multi-Tier Crop Rotation',
    category: 'Biodiversity & Resilience',
    badge: 'Dual Income Stream',
    icon: 'forest',
    tagline: 'Integrating valuable timber and fruit trees with annual agricultural crops.',
    description: 'Combines agriculture and forestry technologies to create more diverse, productive, profitable, and sustainable land-use systems. Trees provide microclimate buffering, windbreak protection, and long-term timber revenue.',
    waterSavings: '25 - 35%',
    yieldIncrease: 'Diversified income (+45% total estate return)',
    costReduction: 'Natural windbreak reduces fruit drops and evaporation',
    setupCost: 'Low to Medium',
    skillLevel: 'Moderate',
    idealFor: ['Citrus + Groundnut', 'Teak / Malabar Neem + Ginger', 'Coconut + Cocoa', 'Paddy + Field Bund Trees'],
    corePillars: [
      'Boundary plantation with fast-growing timber or fruit species',
      'Inter-row cultivation of shade-tolerant medicinal or spice crops',
      'Deep tree root systems pumping subterranean minerals to topsoil via leaf fall',
      'Windbreak barrier reducing crop evapotranspiration stress'
    ],
    adoptionSteps: [
      'Demarcate parcel boundaries and irrigation channel bunds for tree planting',
      'Select species suited to region (Melia dubia, Sandalwood, Guava, Citrus)',
      'Plant annual crops in inter-spaces during the first 3-5 establishment years',
      'Implement selective pruning to manage canopy shade penetration'
    ]
  }
];

// ==========================================
// PESTICIDES & CROP PROTECTION DIRECTORY
// ==========================================
export const mockPesticides = [
  {
    id: 1,
    name: 'Neem Oil 10,000 PPM (Azadirachtin)',
    type: 'BIO_PESTICIDE',
    category: 'Botanical Insecticide & Repellent',
    targetPests: 'Aphids, Whiteflies, Thrips, Jassids, Leaf Miners, Caterpillars',
    targetCrops: 'Cotton, Tomato, Rice, Vegetables, Citrus',
    dosagePerAcre: '400 - 500 ml',
    dosagePerLiter: '2.5 - 3.0 ml',
    waterVolumePerAcre: '150 - 200 L',
    phiDays: 0,
    reiHours: 4,
    toxicityBand: 'GREEN',
    toxicityLabel: 'Slightly Toxic (Eco-Safe)',
    cibrcApproved: true,
    applicationMethod: 'Foliar spray during early morning or dusk. Thorough coverage of leaf undersides.',
    safetyNotes: 'Completely safe for honeybees and predatory ladybird beetles. Zero synthetic residue.',
  },
  {
    id: 2,
    name: 'Chlorantraniliprole 18.5% SC (Coragen)',
    type: 'CHEMICAL_INSECTICIDE',
    category: 'Anthranilic Diamide Insecticide',
    targetPests: 'Stem Borer, Leaf Folder (Rice), American Bollworm (Cotton), Fruit Borer (Tomato)',
    targetCrops: 'Rice, Cotton, Tomato, Maize, Sugarcane',
    dosagePerAcre: '60 ml',
    dosagePerLiter: '0.3 - 0.4 ml',
    waterVolumePerAcre: '150 - 200 L',
    phiDays: 14,
    reiHours: 24,
    toxicityBand: 'BLUE',
    toxicityLabel: 'Moderately Toxic',
    cibrcApproved: true,
    applicationMethod: 'Foliar spray at egg hatching or early instar larval stage.',
    safetyNotes: 'Target-specific ryanodine receptor activator. Wear rubber gloves and face mask.',
  },
  {
    id: 3,
    name: 'Trichoderma viride 1.5% WP',
    type: 'BIO_FUNGICIDE',
    category: 'Beneficial Antagonistic Fungal Agent',
    targetPests: 'Root Rot, Seed Rot, Wilt (Fusarium), Collar Rot, Damping Off',
    targetCrops: 'Cotton, Tomato, Pulses, Vegetables, Oilseeds',
    dosagePerAcre: '1.0 - 2.0 kg',
    dosagePerLiter: '5 - 10 g / L (Soil drench)',
    waterVolumePerAcre: '200 L for drenching',
    phiDays: 0,
    reiHours: 0,
    toxicityBand: 'GREEN',
    toxicityLabel: 'Eco-Safe (Bio-control)',
    cibrcApproved: true,
    applicationMethod: 'Seed treatment (10g/kg seed), soil drenching, or enriched in FYM/vermicompost.',
    safetyNotes: 'Do not mix with chemical fungicides. Apply with adequate soil moisture.',
  },
  {
    id: 4,
    name: 'Emamectin Benzoate 5% SG (Proclaim)',
    type: 'CHEMICAL_INSECTICIDE',
    category: 'Avermectin Biological Derivative',
    targetPests: 'Spodoptera (Fall Armyworm), Helicoverpa, Diamondback Moth, Shoot & Fruit Borer',
    targetCrops: 'Cotton, Tomato, Cabbage, Chilli, Maize',
    dosagePerAcre: '80 - 100 g',
    dosagePerLiter: '0.5 g',
    waterVolumePerAcre: '150 - 200 L',
    phiDays: 3,
    reiHours: 12,
    toxicityBand: 'YELLOW',
    toxicityLabel: 'Highly Toxic to Caterpillars',
    cibrcApproved: true,
    applicationMethod: 'Foliar spray upon first pest sighting.',
    safetyNotes: 'Translaminar activity penetrations. Do not spray during bee foraging hours.',
  },
  {
    id: 5,
    name: 'Chlorothalonil 75% WP (Kavach)',
    type: 'CHEMICAL_FUNGICIDE',
    category: 'Broad-Spectrum Multi-Site Protectant Fungicide',
    targetPests: 'Early Blight, Late Blight, Anthracnose, Leaf Spot, Downy Mildew',
    targetCrops: 'Tomato, Potato, Chilli, Groundnut, Citrus',
    dosagePerAcre: '400 - 500 g',
    dosagePerLiter: '2.0 - 2.5 g',
    waterVolumePerAcre: '200 L',
    phiDays: 7,
    reiHours: 24,
    toxicityBand: 'BLUE',
    toxicityLabel: 'Moderately Toxic',
    cibrcApproved: true,
    applicationMethod: 'Preventive foliar spray when relative humidity exceeds 80%.',
    safetyNotes: 'Multi-site inhibitor; low risk of pathogen resistance. Use protective goggles.',
  },
  {
    id: 6,
    name: 'Bacillus thuringiensis var. kurstaki (Bt)',
    type: 'BIO_INSECTICIDE',
    category: 'Microbial Endotoxin Formulation',
    targetPests: 'Bollworms, Spodoptera, Semiloopers, Cabbage Loopers',
    targetCrops: 'Cotton, Vegetables, Pulses, Tomato',
    dosagePerAcre: '300 - 400 g',
    dosagePerLiter: '1.5 - 2.0 g',
    waterVolumePerAcre: '150 - 200 L',
    phiDays: 0,
    reiHours: 4,
    toxicityBand: 'GREEN',
    toxicityLabel: 'Eco-Safe Microbial',
    cibrcApproved: true,
    applicationMethod: 'Spray on tender foliage at evening. Caterpillars ingest crystal protein.',
    safetyNotes: 'Non-toxic to humans, mammals, and beneficial insects. Rapidly biodegradable.',
  },
  {
    id: 7,
    name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
    type: 'CHEMICAL_FUNGICIDE',
    category: 'Dual Systemic Fungicide (Strobilurin + Triazole)',
    targetPests: 'Sheath Blight, Blast (Rice), Powdery Mildew, Anthracnose, Rust',
    targetCrops: 'Rice, Tomato, Chilli, Cotton, Mango',
    dosagePerAcre: '200 ml',
    dosagePerLiter: '1.0 ml',
    waterVolumePerAcre: '200 L',
    phiDays: 10,
    reiHours: 24,
    toxicityBand: 'BLUE',
    toxicityLabel: 'Moderately Toxic',
    cibrcApproved: true,
    applicationMethod: 'Preventive and early curative systemic protection with greening effect.',
    safetyNotes: 'Do not exceed 2 consecutive applications per season to prevent resistance.',
  },
  {
    id: 8,
    name: 'Pendimethalin 30% EC (Stomp)',
    type: 'HERBICIDE',
    category: 'Pre-Emergence Selective Herbicide',
    targetPests: 'Annual Grasses and Broadleaf Weeds (Echinochloa, Chenopodium, Amaranthus)',
    targetCrops: 'Cotton, Soybean, Groundnut, Rice (Direct Seeded), Onion',
    dosagePerAcre: '1.0 - 1.3 Liters',
    dosagePerLiter: '5.0 - 6.5 ml',
    waterVolumePerAcre: '200 L',
    phiDays: 45,
    reiHours: 24,
    toxicityBand: 'BLUE',
    toxicityLabel: 'Moderately Toxic',
    cibrcApproved: true,
    applicationMethod: 'Spray evenly on moist soil surface within 48-72 hours of sowing before weed emergence.',
    safetyNotes: 'Requires soil moisture for activation. Do not disturb chemical barrier film after spray.',
  },
];

// ==========================================
// GOVERNMENT SCHEMES & SUBSIDIES
// ==========================================
export const mockGovSchemes = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    ministry: 'Ministry of Agriculture & Farmers Welfare, GoI',
    category: 'Direct Income Support',
    benefitSummary: '₹6,000 / year direct bank transfer in 3 equal instalments of ₹2,000.',
    financialAssistance: '₹6,000 / year',
    subsidyPercent: '100% Cash Transfer',
    eligibility: 'All landholding farmer families with cultivable landholding in their name (subject to exclusion criteria).',
    documentsRequired: ['Aadhaar Card linked to Mobile', 'Pattadar Passbook / Land Record (7/12)', 'Active Bank Account with NPCI Aadhaar Seeding', 'Active Mobile Number'],
    applicationUrl: 'https://pmkisan.gov.in',
    status: 'ACTIVE_OPEN',
    deadline: 'Continuous rolling enrollment',
    keyFeatures: [
      'Direct Benefit Transfer (DBT) directly into farmer Aadhaar-seeded bank account',
      'Three 4-monthly cycles: April-July, August-November, December-March',
      'Over 11 Crore beneficiary farmers currently supported across India',
      'e-KYC verification mandatory via OTP or biometric face authentication'
    ]
  },
  {
    id: 'pmfby',
    title: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Crop Insurance & Risk Mitigation',
    benefitSummary: 'Comprehensive non-preventable risk insurance from pre-sowing to post-harvest.',
    financialAssistance: 'Covers 100% of Sum Insured for crop loss',
    subsidyPercent: 'Farmers pay only 1.5% - 2% premium (Remaining 95%+ subsidized by Govt)',
    eligibility: 'All farmers growing notified crops in notified areas (both loanee and non-loanee farmers).',
    documentsRequired: ['Land Ownership Record / Land Possession Certificate', 'Sowing Certificate / Village Patwari Report', 'Bank Account Passbook Copy', 'Aadhaar Card'],
    applicationUrl: 'https://pmfby.gov.in',
    status: 'ACTIVE_OPEN',
    deadline: 'Cutoff date varies by Kharif / Rabi season (Usually July 31 for Kharif, Dec 31 for Rabi)',
    keyFeatures: [
      'Extremely low farmer premium: 2.0% for Kharif crops, 1.5% for Rabi crops, 5% for Annual Commercial/Horticulture crops',
      'Covers localized calamities: Hailstorm, landslide, inundation, cloudburst',
      'Post-harvest loss coverage up to 14 days for crops kept in field for drying',
      'Direct claim settlement via National Crop Insurance Portal (NCIP)'
    ]
  },
  {
    id: 'pmksy',
    title: 'PMKSY - Per Drop More Crop (Micro Irrigation)',
    ministry: 'Department of Agriculture, Cooperation & Farmers Welfare',
    category: 'Irrigation & Water Conservation',
    benefitSummary: 'Up to 55% - 70% capital subsidy on Drip and Sprinkler irrigation systems.',
    financialAssistance: 'Up to ₹45,000 - ₹75,000 per hectare subsidy',
    subsidyPercent: '55% for Small & Marginal farmers; 45% for Other farmers (Higher in several states)',
    eligibility: 'All farmers possessing cultivable land with an assured water source (borewell, open well, canal).',
    documentsRequired: ['Pattadar Passbook / ROR 1-B', 'Water and Electricity Availability Certificate', 'Soil and Water Test Report', 'Aadhaar & Bank Details'],
    applicationUrl: 'https://pmksy.gov.in',
    status: 'ACTIVE_OPEN',
    deadline: 'Annual state allocation cycles (Apply through State Horticulture / Micro-Irrigation Dept)',
    keyFeatures: [
      'Subsidized installation of ISI-marked Drip & Micro-Sprinkler networks',
      'Saves 40% - 60% irrigation water and improves fertilizer use efficiency via fertigation',
      'Tripartite warranty and 3-5 years maintenance support by authorized suppliers',
      'Farm pond construction subsidy available under watershed component'
    ]
  },
  {
    id: 'smam',
    title: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Farm Machinery & Drones',
    benefitSummary: '40% to 50% subsidy on Tractors, Tillers, Harvesters, and up to 50-100% on Agri Drones.',
    financialAssistance: '₹50,000 to ₹5,00,000+ depending on machinery power rating',
    subsidyPercent: '40% - 50% for Individual Farmers; 80% for Custom Hiring Centers (CHCs)',
    eligibility: 'Individual farmers, Farmer Producer Organizations (FPOs), Cooperative societies, and SHGs.',
    documentsRequired: ['Land Ownership Records', 'Aadhaar Card', 'Caste Certificate (if claiming SC/ST reservation)', 'Bank Account Passbook', 'Quotation from authorized dealer'],
    applicationUrl: 'https://agrimachinery.nic.in',
    status: 'ACTIVE_OPEN',
    deadline: 'Quarterly state quota releases (First-come-first-served basis via portal)',
    keyFeatures: [
      'Financial assistance for purchasing laser land levelers, power weeders, balers, seed drills',
      'Kisan Drone Promotion: Up to ₹5 Lakh subsidy (50%) for FPOs and agriculture graduates',
      'Custom Hiring Centers (CHCs) establishment support up to ₹10-25 Lakhs project cost',
      'Reduces labor bottleneck and slashes operational cultivation hours by 60%'
    ]
  },
  {
    id: 'kcc',
    title: 'Kisan Credit Card (KCC) Scheme',
    ministry: 'Reserve Bank of India & NABARD',
    category: 'Concessional Agricultural Credit',
    benefitSummary: 'Collateral-free crop loan up to ₹1.6 Lakhs; total credit limit up to ₹3 Lakhs @ 4% effective interest rate.',
    financialAssistance: 'Credit line based on crop scale of finance + acreage',
    subsidyPercent: '3% Interest Subvention Incentive for prompt repayment (Effective rate 4% p.a.)',
    eligibility: 'All farmers—owner cultivators, tenant farmers, oral lessees, sharecroppers, and SHG members.',
    documentsRequired: ['Completed KCC Application Form', 'Land Record / Tenancy Agreement', 'Aadhaar Card & Voter ID / PAN', 'Crop Cultivation Details'],
    applicationUrl: 'https://pmkisan.gov.in/KCC.aspx',
    status: 'ACTIVE_OPEN',
    deadline: 'Available year-round across all commercial, rural, and cooperative banks',
    keyFeatures: [
      'Single revolving credit facility covering seed, fertilizer, pesticide, and labor expenses',
      'Atm-enabled RuPay Kisan Card for easy cash withdrawal at any bank ATM',
      'Simple interest charged; no compounding if repaid within 1 year',
      'Coverage extended to Animal Husbandry, Dairy, and Fisheries activities'
    ]
  },
  {
    id: 'pm-kusum',
    title: 'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)',
    ministry: 'Ministry of New and Renewable Energy (MNRE)',
    category: 'Solar Energy & Pumping',
    benefitSummary: 'Up to 90% combined subsidy for replacing diesel pumps with high-efficiency Solar Agriculture Pumps.',
    financialAssistance: 'Up to ₹2,50,000+ subsidy on 3 HP to 7.5 HP solar pump sets',
    subsidyPercent: '60% (30% Central + 30% State Govt subsidy); 30% Bank Loan; Farmer pays only 10%',
    eligibility: 'Farmers, groups of farmers, Water User Associations (WUAs), and FPOs.',
    documentsRequired: ['Land Records (Khatauni / ROR)', 'Aadhaar Card', 'Borewell / Open Well Depth & Discharge Certificate', 'Bank Account Details'],
    applicationUrl: 'https://pmkusum.mnre.gov.in',
    status: 'ACTIVE_OPEN',
    deadline: 'State Renewable Energy Development Agency rounds (e.g. REDCO / TSREDCO)',
    keyFeatures: [
      'Standalone Solar PV Water Pumping Systems (3 HP, 5 HP, 7.5 HP DC/AC surface & submersible)',
      'Solarisation of existing grid-connected agricultural pumps with grid export meter',
      'Earn extra income by selling surplus daytime solar power back to state DISCOMs',
      'Eliminates diesel bills and ensures reliable daytime irrigation'
    ]
  },
  {
    id: 'pkvy',
    title: 'PKVY (Paramparagat Krishi Vikas Yojana)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Organic Farming & Certification',
    benefitSummary: 'Financial assistance of ₹50,000 per hectare for cluster organic adoption, certification & marketing.',
    financialAssistance: '₹50,000 / hectare / 3 years',
    subsidyPercent: '₹31,000 directly transferred to farmer for organic inputs (bio-fertilizers, seeds)',
    eligibility: 'Farmer groups / clusters of 20 or more farmers having 50 acres (20 hectares) contiguous land.',
    documentsRequired: ['Cluster Group Resolution', 'Land Ownership Records of members', 'Aadhaar & Bank Passbooks', 'Soil baseline test report'],
    applicationUrl: 'https://pgsindia-ncof.gov.in',
    status: 'ACTIVE_OPEN',
    deadline: 'Cluster project proposal through District Agriculture Officer (DAO)',
    keyFeatures: [
      'Participatory Guarantee System (PGS-India) certification at zero cost to farmers',
      'Assistance for on-farm vermicompost units, bio-pesticide preparation, and neem cake',
      'Support for packaging, labeling, and Jaivik Kheti organic portal marketing',
      'Builds soil carbon and earns 20-40% premium price in organic retail'
    ]
  },
  {
    id: 'soil-health-card',
    title: 'Soil Health Card Scheme',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Soil Testing & Nutrient Prescriptions',
    benefitSummary: 'Free biennial soil analysis across 12 chemical parameters with crop-specific fertilizer dosage guidance.',
    financialAssistance: '100% Free Testing & Advisory',
    subsidyPercent: '100% Fully Centrally Funded',
    eligibility: 'All farmers across every agricultural parcel in India.',
    documentsRequired: ['Soil sample GPS coordinates', 'Land survey number / Khatauni', 'Farmer Mobile Number & Aadhaar'],
    applicationUrl: 'https://soilhealth.dac.gov.in',
    status: 'ACTIVE_OPEN',
    deadline: 'Continuous grid-sampling every 2 years by Agriculture Extension Officers',
    keyFeatures: [
      'Analyzes 12 parameters: N, P, K (macronutrients); S (secondary); Zn, Fe, Cu, Mn, Bo (micronutrients); pH, EC, OC (physical)',
      'Specific fertilizer prescriptions prevent excessive urea and DAP over-application',
      'Reported 8-10% cost reduction in chemical fertilizers and 5-6% yield improvement',
      'Directly viewable on mobile and downloadable in regional languages'
    ]
  }
];

// ==========================================
// WATER FLOW TO SOIL TELEMETRY
// ==========================================
export const mockWaterFlowTelemetry = {
  instantaneousFlowRateLpm: 48.2,
  instantaneousFlowRateM3h: 2.89,
  mainlinePressureBar: 2.4,
  flowVelocityMs: 1.42,
  cumulativeWaterTodayLiters: 1240,
  waterEfficiencyIndex: 94.2,
  infiltrationRateMmHr: 14.5,
  soilSaturationDeficitMm: 18.2,
  flowMeterHealth: 'CALIBRATED_ONLINE',
  depthHydrology: [
    {
      horizon: 'Surface (0 - 5 cm)',
      moisturePercent: 62.4,
      targetPercent: 65.0,
      flowAbsorptionRate: '18.2 L/hr/m²',
      saturationState: 'ABSORBING',
      status: 'OPTIMAL',
      description: 'Active capillary infiltration. No surface pooling or runoff detected.',
    },
    {
      horizon: 'Active Feeder Root Zone (15 cm)',
      moisturePercent: 68.0,
      targetPercent: 70.0,
      flowAbsorptionRate: '12.4 L/hr/m²',
      saturationState: 'HYDRATED',
      status: 'OPTIMAL',
      description: 'Primary root water uptake active. Transpiration support at peak efficiency.',
    },
    {
      horizon: 'Subterranean Reserve Zone (30 cm)',
      moisturePercent: 74.0,
      targetPercent: 75.0,
      flowAbsorptionRate: '6.8 L/hr/m²',
      saturationState: 'FIELD_CAPACITY',
      status: 'SATISFACTORY',
      description: 'Deep moisture buffer maintained. Prevents deep percolation leaching losses.',
    },
  ],
  parcelWaterDistribution: [
    {
      parcelId: 1,
      code: 'P-101',
      name: 'Zone A - South Basin (Rice)',
      acreage: 4.5,
      currentFlowLpm: 45.0,
      todayDeliveredLiters: 580,
      flowDurationMin: 45,
      soilMoistureBefore: 66.0,
      soilMoistureCurrent: 72.0,
      valveStatus: 'ACTIVE',
      deliveryMethod: 'Regulated Basin Infiltration',
      moistureDeltaPercent: '+6.0%',
      flowHealth: 'OPTIMAL'
    },
    {
      parcelId: 2,
      code: 'P-102',
      name: 'Zone B - East Terrace (Cotton)',
      acreage: 3.8,
      currentFlowLpm: 0.0,
      todayDeliveredLiters: 340,
      flowDurationMin: 30,
      soilMoistureBefore: 60.5,
      soilMoistureCurrent: 64.0,
      valveStatus: 'STANDBY',
      deliveryMethod: 'Sub-surface Micro Drip',
      moistureDeltaPercent: '+3.5%',
      flowHealth: 'SCHEDULED'
    },
    {
      parcelId: 3,
      code: 'P-103',
      name: 'Zone C - Polyhouse A (Tomato)',
      acreage: 2.2,
      currentFlowLpm: 0.0,
      todayDeliveredLiters: 180,
      flowDurationMin: 20,
      soilMoistureBefore: 64.0,
      soilMoistureCurrent: 68.0,
      valveStatus: 'IDLE',
      deliveryMethod: 'Pressure-Compensated Drip Pulsing',
      moistureDeltaPercent: '+4.0%',
      flowHealth: 'OPTIMAL'
    },
    {
      parcelId: 4,
      code: 'P-104',
      name: 'Zone D - Hill Slope (Orange)',
      acreage: 2.0,
      currentFlowLpm: 0.0,
      todayDeliveredLiters: 140,
      flowDurationMin: 15,
      soilMoistureBefore: 62.0,
      soilMoistureCurrent: 65.0,
      valveStatus: 'STANDBY',
      deliveryMethod: 'Micro-Sprinkler Root Ring',
      moistureDeltaPercent: '+3.0%',
      flowHealth: 'OPTIMAL'
    }
  ],
  hourlyFlowReadings: [
    { time: '06:00 AM', flowLpm: 42, soilMoisture: 65 },
    { time: '07:00 AM', flowLpm: 48, soilMoisture: 67 },
    { time: '08:00 AM', flowLpm: 46, soilMoisture: 69 },
    { time: '09:00 AM', flowLpm: 12, soilMoisture: 71 },
    { time: '10:00 AM', flowLpm: 0, soilMoisture: 70 },
    { time: '11:00 AM', flowLpm: 0, soilMoisture: 69 },
    { time: '12:00 PM', flowLpm: 0, soilMoisture: 68 },
    { time: '01:00 PM', flowLpm: 0, soilMoisture: 68 },
  ]
};

// ==========================================
// DEEP CROP ANALYSIS
// ==========================================
export const mockCropAnalysis = {
  selectedCropId: 1,
  cropName: 'Samba Mahsuri Rice (BPT-5204)',
  parcelCode: 'P-101 (Zone A - South Basin, 4.5 Acres)',
  phenologyStage: 'Active Tillering (Day 48 of 145)',
  daysToHarvest: 97,
  ndviHealthIndex: 0.82,
  canopyCoveragePercent: 78,
  stressLevel: 'LOW_VIGOROUS',
  soilCompatibilityScore: 94,
  projectedYieldPerAcre: '5.8 Tons/ha (2.35 Tons/ac)',
  benchmarkYieldPerAcre: '5.2 Tons/ha',
  expectedRevenuePerAcre: '₹55,225',
  nutrientAbsorption: {
    nitrogen: { requiredKg: 120, absorbedKg: 85, balanceState: 'OPTIMAL' },
    phosphorus: { requiredKg: 40, absorbedKg: 32, balanceState: 'OPTIMAL' },
    potassium: { requiredKg: 60, absorbedKg: 48, balanceState: 'RICH' },
  },
  waterStressIndex: 0.12, // 0 = no stress, 1 = severe drought
  thermalStressIndex: 0.18,
  pestVulnerability: [
    { pest: 'Yellow Stem Borer (Scirpophaga incertulas)', riskLevel: 'MEDIUM', thresholdAlert: 'Monitor dead hearts; pheromone trap catch at 3 moths/day.' },
    { pest: 'Brown Planthopper (Nilaparvata lugens)', riskLevel: 'LOW', thresholdAlert: 'Submerged base clean; no nymph clusters at tiller base.' },
    { pest: 'Bacterial Leaf Blight (Xanthomonas)', riskLevel: 'LOW', thresholdAlert: 'Prophylactic bio-copper spray advised if rainfall intensifies.' },
  ],
  phenologyTimeline: [
    { stage: 'Germination & Nursery', durationDays: '0 - 25', status: 'COMPLETED' },
    { stage: 'Transplanting & Tillering', durationDays: '26 - 55', status: 'CURRENT' },
    { stage: 'Panicle Initiation', durationDays: '56 - 85', status: 'UPCOMING' },
    { stage: 'Flowering & Grain Filling', durationDays: '86 - 120', status: 'UPCOMING' },
    { stage: 'Physiological Maturity & Harvest', durationDays: '121 - 145', status: 'UPCOMING' },
  ],
  agronomicAdvisory: [
    'Maintain shallow standing water layer (2-3 cm) during tillering phase to promote maximum effective tillers.',
    'Apply second top-dressing of nitrogen (Urea @ 25 kg/ac) blended with Neem cake to prevent volatilization loss.',
    'Scout for dead hearts caused by stem borer; release Trichogramma egg parasitoids @ 20,000/acre if adult moths are spotted.'
  ]
};

// ==========================================
// FARMER PROFILE FALLBACK
// ==========================================
export const mockFarmerProfile = {
  id: 1,
  userId: 1,
  farmerUid: 'AP-FRM-2026-8842',
  fullName: 'Ravi Kumar',
  phone: '+91 98490 12345',
  email: 'ravi@agripulse.io',
  avatarUrl: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=400&q=80',
  experienceYears: 14,
  primaryOccupation: 'Owner-Cultivator & Lead Agronomist',
  educationLevel: 'B.Sc. Agriculture (Prof. Jayashankar Telangana State Agricultural University)',
  preferredLanguage: 'Telugu & English',
  farmingType: 'Integrated Precision, Drip Fertigation & Regenerative',
  state: 'Telangana',
  district: 'Rangareddy / Greater Hyderabad',
  villageMandal: 'Chilkur Village, Moinabad Mandal',
  pincode: '500075',
  farmName: 'Green Valley Farm',
  totalAcreage: 12.5,
  ownedAcreage: 12.0,
  leasedAcreage: 0.5,
  surveyNumbers: 'Sy. No. 142/A, 143/B & 144/1',
  soilType: 'Red Sandy Loam with Active Microbial Matrix',
  waterSource: 'Dual Borewell with 7.5 HP Solar Pump + Rainwater Recharge Pond',
  primaryIrrigation: 'Automated Precision Drip & Micro-Sprinkler Fleet',
  pmKisanId: 'PMK-TS-984210',
  pmKisanStatus: 'ACTIVE_VERIFIED',
  kccNumber: 'KCC-SBI-684291',
  kccLimit: 350000.0,
  kccBank: 'State Bank of India (Agricultural Finance - Moinabad)',
  soilHealthCardNo: 'SHC-2026-TS-0491',
  soilHealthStatus: 'VALID_OPTIMAL',
  cropInsurancePolicy: 'PMFBY-AIC-2026-90214',
  cropInsuranceStatus: 'ACTIVE_INSURED',
  emergencyContact: '+91 94401 88921 (Kavitha Kumar - Spouse)',
  certifications: [
    'NPOP Certified Organic Estate (APEDA/TEL/2024)',
    'Good Agricultural Practices (INDGAP-Level 2)',
    'National Mission on Natural Farming (NMNF Recognized)',
    'Precision IoT Irrigation Benchmark Estate'
  ],
  machineryInventory: [
    'Mahindra Yuvo Tech+ 585 DI (49 HP 4WD)',
    'DJI Agras T40 RTK Precision Spraying Drone',
    'Netafim Automation Fertigation Dosing Channel',
    'Laser Land Leveller & Multi-Crop Pneumatic Planter',
    'AgriPulse 4-Depth Soil Capacitance Probe Network'
  ],
  primaryCrops: [
    'Rice (Sona Masoori BPT 5204) — 4.2 Acres',
    'Cotton (Bt-II RCH-659) — 3.8 Acres',
    'Polyhouse Tomato (Arka Rakshak) — 2.5 Acres',
    'Sweet Orange (Mosambi Elite) — 2.0 Acres'
  ],
  activeParcelsCount: 4,
  vitalityScore: 92,
  waterSavedPercentage: 24.0,
  verifiedBadges: [
    'PM-KISAN Verified',
    'KCC Credit Active',
    'Soil Health Optimal',
    'IoT Edge Connected',
    'NPOP Certified Organic'
  ],
  updatedAt: new Date().toISOString()
};


