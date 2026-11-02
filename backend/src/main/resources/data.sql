-- =============================================================================
-- AgriPulse Smart Agriculture Suite Seed Data
-- =============================================================================

-- 1. Demo User
INSERT INTO users (id, email, password, full_name, phone, role)
VALUES (1, 'ravi@agripulse.io', 'agripulse123', 'Ravi Kumar', '+91 98490 12345', 'LEAD_AGRONOMIST')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 2. Primary Farm
INSERT INTO farms (id, user_id, name, location, total_acreage, leased_acreage, primary_irrigation, soil_type)
VALUES (1, 1, 'Green Valley Farm', 'Hyderabad, Telangana', 12.5, 0.5, 'Precision Drip & Automated Micro-Sprinkler', 'Red Sandy Loam')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 3. Parcels / Management Zones
INSERT INTO parcels (id, farm_id, code, name, acreage, crop_name, soil_moisture, soil_ph, crop_stage, ndvi_index, irrigation_status, coordinates_json)
VALUES 
(1, 1, 'P-101', 'Zone A - North Paddy Field', 4.2, 'Rice (Sona Masoori)', 72.0, 6.8, 'Tillering', 0.78, 'ACTIVE', '{"lat": 17.3850, "lng": 78.4867, "polygon": "Zone-A"}'),
(2, 1, 'P-102', 'Zone B - Cotton Basin', 3.8, 'Cotton (Bt-II RCH-659)', 64.0, 7.1, 'Flowering', 0.65, 'SCHEDULED', '{"lat": 17.3870, "lng": 78.4890, "polygon": "Zone-B"}'),
(3, 1, 'P-103', 'Zone C - Tomato Polyhouse', 2.5, 'Tomato (Arka Rakshak)', 68.0, 6.5, 'Ripening', 0.82, 'STANDBY', '{"lat": 17.3890, "lng": 78.4850, "polygon": "Zone-C"}'),
(4, 1, 'P-104', 'Zone D - High Density Orchard', 2.0, 'Sweet Orange (Mosambi)', 58.0, 6.9, 'Fruiting', 0.71, 'IDLE', '{"lat": 17.3840, "lng": 78.4820, "polygon": "Zone-D"}')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 4. Crops Portfolio
INSERT INTO crops (id, farm_id, parcel_id, name, variety, season, stage, planting_date, expected_harvest_date, health_score, yield_forecast, water_requirement, status)
VALUES
(1, 1, 1, 'Rice', 'Sona Masoori (BPT 5204)', 'Kharif 2026', 'Vegetative / Tillering', '2026-07-15', '2026-11-20', 87, '4.2 tons/ac (+8% vs target)', '5,200 L/day', 'OPTIMAL'),
(2, 1, 2, 'Cotton', 'Bt-II RCH-659', 'Kharif 2026', 'Flowering & Boll Formation', '2026-06-28', '2026-12-10', 92, '1.8 tons/ac (+12% vs target)', '3,800 L/day', 'OPTIMAL'),
(3, 1, 3, 'Tomato', 'Arka Rakshak Hybrid', 'Perennial 2026', 'Fruit Ripening', '2026-08-10', '2026-11-05', 78, '18.5 tons/ac (+5% vs target)', '2,900 L/day', 'ATTENTION'),
(4, 1, 4, 'Sweet Orange', 'Mosambi Elite', 'Perennial', 'Fruit Development', '2024-03-12', '2026-12-25', 95, '8.6 tons/ac (+15% vs target)', '2,100 L/day', 'OPTIMAL')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 5. Soil Metrics
INSERT INTO soil_metrics (id, farm_id, nitrogen_level, phosphorus_level, potassium_level, soil_ph, organic_matter, electrical_conductivity, moisture_depth_15cm, moisture_depth_30cm, moisture_depth_60cm, overall_vitality_index)
VALUES (1, 1, 185.0, 34.0, 240.0, 6.8, 2.4, 0.85, 70.0, 65.0, 58.0, 88)
ON DUPLICATE KEY UPDATE overall_vitality_index = VALUES(overall_vitality_index);

-- 6. Soil Tests History
INSERT INTO soil_tests (id, parcel_name, sample_code, lab_name, ph, status, notes, tested_date)
VALUES
(1, 'Zone A - North Paddy Field', 'SMP-2026-101', 'Telangana State Agronomy Lab', 6.8, 'OPTIMAL', 'Optimal N-P-K balance, adequate humic fraction.', '2026-10-10'),
(2, 'Zone B - Cotton Basin', 'SMP-2026-102', 'CRIDA Central Soil Testing', 7.1, 'OPTIMAL', 'Slightly alkaline profile, recommended sulfur gypsum buffer.', '2026-10-12'),
(3, 'Zone C - Tomato Polyhouse', 'SMP-2026-103', 'Horticultural Research Institute', 6.5, 'ATTENTION', 'Calcium uptake lower than threshold; apply foliar calcium nitrate.', '2026-10-18')
ON DUPLICATE KEY UPDATE sample_code = VALUES(sample_code);

-- 7. Weather Telemetry
INSERT INTO weather_data (id, farm_id, location, temperature, condition_name, humidity, wind_speed, uv_index, evapotranspiration, rain_probability, forecast_json, advisories_json)
VALUES (1, 1, 'Hyderabad, Telangana', 29.4, 'Clear Sky', 58, 12.0, 7, 4.6, 10,
'[{"day": "Today", "temp": 29.4, "condition": "Sunny", "icon": "wb_sunny", "rain": 10}, {"day": "Fri", "temp": 30.1, "condition": "Partly Cloudy", "icon": "partly_cloudy_day", "rain": 15}, {"day": "Sat", "temp": 28.5, "condition": "Cloudy", "icon": "cloud", "rain": 25}, {"day": "Sun", "temp": 27.8, "condition": "Scattered Rain", "icon": "rainy", "rain": 60}, {"day": "Mon", "temp": 28.2, "condition": "Light Showers", "icon": "rainy_light", "rain": 40}, {"day": "Tue", "temp": 29.0, "condition": "Sunny", "icon": "wb_sunny", "rain": 10}, {"day": "Wed", "temp": 30.0, "condition": "Sunny", "icon": "wb_sunny", "rain": 5}]',
'[{"type": "HEAT_ADVISORY", "title": "Midday Solar Radiance Alert", "message": "Expected UV index peaks at 8.0 between 12:00 PM and 2:30 PM. Maintain drip pulse on Zone C polyhouse."}, {"type": "PEST_WINDOW", "title": "Favorable Spray Window", "message": "Low wind velocities (<10 km/h) forecasted for tomorrow morning 6:00 AM - 9:00 AM."}]')
ON DUPLICATE KEY UPDATE temperature = VALUES(temperature);

-- 8. Irrigation Automation Zones
INSERT INTO irrigation_zones (id, farm_id, parcel_id, zone_name, valve_state, mode, moisture_threshold, flow_rate_lpm, water_consumed_today, next_run_time, last_run_duration_min)
VALUES
(1, 1, 1, 'Zone A - Paddy Drip Sub-main 1', TRUE, 'AUTO', 65.0, 48.0, 520.0, 'In progress (18 min remaining)', 45),
(2, 1, 2, 'Zone B - Cotton Furrow Solenoid', FALSE, 'AUTO', 60.0, 42.0, 360.0, 'Today, 18:30 IST', 30),
(3, 1, 3, 'Zone C - Polyhouse Micro-mist', FALSE, 'MANUAL', 70.0, 24.0, 210.0, 'Manual Trigger Standby', 20),
(4, 1, 4, 'Zone D - Orchard Deep Ring Drip', FALSE, 'AUTO', 55.0, 35.0, 150.0, 'Tomorrow, 06:00 IST', 40)
ON DUPLICATE KEY UPDATE zone_name = VALUES(zone_name);

-- 9. Pest & Disease Diagnostics
INSERT INTO pest_diagnostics (id, farm_id, crop_name, issue_name, severity, confidence_score, image_url, affected_zone, treatment_recommendation, ai_analysis_summary)
VALUES
(1, 1, 'Tomato', 'Early Blight (Alternaria solani)', 'MODERATE', 94.6, 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80', 'Zone C - Polyhouse Row 4', 'Apply Chlorothalonil 75% WP @ 2g/L or Mancozeb foliar spray at dawn. Prune lower affected leaves and sanitize shears.', 'Concentric bullseye lesions detected across 8.4% of lower canopy foliage. Favorable micro-humidity (78%) in Polyhouse Section 4 is accelerating fungal sporulation.'),
(2, 1, 'Cotton', 'Cotton Whitefly (Bemisia tabaci)', 'LOW', 88.2, 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80', 'Zone B - Cotton Basin Sector 2', 'Install yellow sticky traps (15 traps/acre). Apply Azadirachtin 10,000 ppm @ 1.5 mL/L if nymph population exceeds 6/leaf.', 'Localized early nymphal clustering observed on underside of mid-tier leaves. Predatory ladybird beetle activity is moderately active.'),
(3, 1, 'Rice', 'Bacterial Leaf Streak (Xanthomonas oryzae)', 'LOW', 91.0, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 'Zone A - North Paddy Field', 'Maintain balanced potash fertilization (25 kg/ha additional). Avoid heavy nitrogen top-dressing. Drain excess standing water.', 'Interveinal translucent lesions observed on upper tillers; minimal chlorosis present.')
ON DUPLICATE KEY UPDATE issue_name = VALUES(issue_name);

-- 10. AI Agronomist Chat History
INSERT INTO ai_chat_messages (id, sender, message, grounding_sources)
VALUES
(1, 'USER', 'What fertilizer formulation should I apply for Zone B Cotton entering peak flowering?', 'Telemetry: Parcel P-102'),
(2, 'AGRONOMIST_AI', 'Good morning Ravi! For Zone B Bt-Cotton currently entering the peak flowering and boll formation window, your soil telemetry indicates potassium at 240 kg/ha and nitrogen at 185 kg/ha. I recommend applying a foliar spray of Potassium Nitrate (13-0-45) @ 10g/L combined with 0.1% Boron to stimulate carbohydrate translocation to developing bolls and prevent flower shedding.', 'CRIDA Agronomic Handbook • Soil Sensor SNS-SOIL-02 Telemetry'),
(3, 'USER', 'Should I pause irrigation ahead of Sunday’s expected rainfall?', 'Telemetry: Weather Radar & Solenoid Valves'),
(4, 'AGRONOMIST_AI', 'Yes, that is an optimal decision. The Doppler radar and microclimate station project 60% probability of 18-24mm precipitation on Sunday afternoon. Pausing Zone A and Zone B tomorrow will prevent root zone waterlogging, save ~850 liters of pumped water, and allow the soil matrix to absorb the natural rainfall reservoir.', 'ECMWF 7-Day Microclimate Model • Irrigation Schedule Controller')
ON DUPLICATE KEY UPDATE message = VALUES(message);

-- 11. Sensors & Edge Gateway Fleet
INSERT INTO sensor_devices (id, farm_id, device_code, type, parcel_code, battery_percentage, signal_rssi, status, last_ping, reading_display)
VALUES
(1, 1, 'SNS-SOIL-01', 'Multi-Depth Soil Moisture Probe', 'P-101 (Zone A)', 94, '-65 dBm (Strong)', 'ONLINE', '2 mins ago', '72% Moisture • 6.8 pH'),
(2, 1, 'SNS-SOIL-02', 'Capacitive Soil Matrix Sensor', 'P-102 (Zone B)', 88, '-71 dBm (Good)', 'ONLINE', '4 mins ago', '64% Moisture • 7.1 pH'),
(3, 1, 'SNS-WTH-04', 'Microclimate Weather Station', 'Master Tower', 98, '-59 dBm (Strong)', 'ONLINE', 'Just now', '29.4°C • 58% RH • 12 km/h Wind'),
(4, 1, 'SNS-FLW-02', 'Ultrasonic Flowmeter Gateway', 'Main Pump Sump', 91, '-66 dBm (Strong)', 'ONLINE', '3 mins ago', '48.0 L/min Flow Active'),
(5, 1, 'SNS-LGT-01', 'Quantum PAR Solar Sensor', 'P-103 (Zone C)', 96, '-68 dBm (Strong)', 'ONLINE', '5 mins ago', '1,420 µmol/m²/s PAR'),
(6, 1, 'SNS-DRN-01', 'Multispectral RTK Drone Hub', 'Hangar Bay', 100, '-52 dBm (Strong)', 'CALIBRATED', '12 mins ago', 'NDVI Survey 0.78 Health Map Ready')
ON DUPLICATE KEY UPDATE device_code = VALUES(device_code);

-- 12. Proactive Alerts & Incidents
INSERT INTO alerts (id, farm_id, title, description, severity, category, parcel_code, resolved)
VALUES
(1, 1, 'Elevated Soil Moisture Deficit Alert', 'Zone D Orchard sensor SNS-SOIL-04 reported moisture at 58% (threshold: 60%). Deep root hydration recommended.', 'CRITICAL', 'IRRIGATION', 'P-104', FALSE),
(2, 1, 'Micro-climate Heat Index Surge', 'UV Index projected to touch 7.8 between 12:30 PM and 2:00 PM. High evapotranspiration rate active.', 'WARNING', 'WEATHER', 'GLOBAL', FALSE),
(3, 1, 'Early Blight Warning in Polyhouse', 'Visual diagnostic flagged early Alternaria solani spore symptoms on 8.4% of Tomato row foliage.', 'WARNING', 'PEST', 'P-103', FALSE),
(4, 1, 'Gateway Sensor Calibration Successful', 'Drone RTK station SNS-DRN-01 verified coordinate accuracy down to ±1.4cm precision.', 'OPTIMAL', 'SENSOR', 'P-101', TRUE)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 13. Recommendations
INSERT INTO recommendations (id, farm_id, title, summary, priority, impact_category, action_cta, completed)
VALUES
(1, 1, 'Execute 35-min Pulse Irrigation on Zone B Cotton', 'Soil matrix tension is dropping below 60 kPa as ambient temperature peaks. Automated pulse cycle will prevent boll shedding.', 'HIGH', 'WATER_SAVING', 'Start Zone B Cycle', FALSE),
(2, 1, 'Apply Preventive Copper Fungicide on Tomato Polyhouse', 'Morning relative humidity exceeded 80% for 3 consecutive days, creating ideal conditions for Alternaria spore proliferation.', 'HIGH', 'YIELD', 'Review Prescription', FALSE),
(3, 1, 'Top-dress Zone A Rice with Potassium Nitrate', 'Active tillering phase observed. Foliar potassium will strengthen stem vigor against potential pre-monsoon squalls.', 'MEDIUM', 'FERTILIZER', 'Schedule Application', FALSE),
(4, 1, 'Adjust Irrigation Thresholds Ahead of Sunday Rain', 'Reduce auto-trigger sensitivity from 65% to 55% to capture anticipated 20mm rainfall reservoir.', 'LOW', 'WATER_SAVING', 'Update Setpoints', TRUE)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 14. Farmer Profile
INSERT INTO farmer_profiles (id, user_id, farmer_uid, full_name, phone, email, avatar_url, experience_years, primary_occupation, education_level, preferred_language, farming_type, state, district, village_mandal, pincode, farm_name, total_acreage, owned_acreage, leased_acreage, survey_numbers, soil_type, water_source, primary_irrigation, pm_kisan_id, pm_kisan_status, kcc_number, kcc_limit, kcc_bank, soil_health_card_no, soil_health_status, crop_insurance_policy, crop_insurance_status, emergency_contact, certifications, machinery_inventory, primary_crops)
VALUES
(1, 1, 'AP-FRM-2026-8842', 'Ravi Kumar', '+91 98490 12345', 'ravi@agripulse.io', 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=400&q=80', 14, 'Owner-Cultivator & Lead Agronomist', 'B.Sc. Agriculture (PJTSAU)', 'Telugu & English', 'Integrated Precision & Regenerative', 'Telangana', 'Rangareddy / Hyderabad', 'Chilkur Village, Moinabad Mandal', '500075', 'Green Valley Farm', 12.5, 12.0, 0.5, 'Sy. No. 142/A, 143/B & 144/1', 'Red Sandy Loam with High Organic Matrix', 'Dual Borewell with 7.5 HP Solar Pump + Rainwater Reservoir', 'Precision Drip & Automated Micro-Sprinkler', 'PMK-TS-984210', 'ACTIVE_VERIFIED', 'KCC-SBI-684291', 350000.0, 'State Bank of India (Agricultural Finance)', 'SHC-2026-TS-0491', 'VALID_OPTIMAL', 'PMFBY-AIC-2026-90214', 'ACTIVE_INSURED', '+91 94401 88921 (Kavitha Kumar - Spouse)', '["NPOP Certified Organic Estate (APEDA/TEL/2024)", "Good Agricultural Practices (INDGAP-Level 2)", "National Mission on Natural Farming (NMNF Recognized)", "Precision IoT Irrigation Benchmark Estate"]', '["Mahindra Yuvo Tech+ 585 DI (49 HP 4WD)", "DJI Agras T40 RTK Precision Spraying Drone", "Netafim Automation Fertigation Dosing Channel", "Laser Land Leveller & Multi-Crop Pneumatic Planter", "AgriPulse 4-Depth Soil Capacitance Probe Network"]', '["Rice (Sona Masoori BPT 5204) — 4.2 Acres", "Cotton (Bt-II RCH-659) — 3.8 Acres", "Polyhouse Tomato (Arka Rakshak) — 2.5 Acres", "Sweet Orange (Mosambi Elite) — 2.0 Acres"]')
ON DUPLICATE KEY UPDATE farmer_uid = VALUES(farmer_uid);

