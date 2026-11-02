-- =============================================================================
-- AgriPulse Smart Agriculture Suite Database Schema
-- Database: agripulse_suite_db (MySQL 8.0+)
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'AGRONOMIST',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(200) NOT NULL,
    total_acreage DOUBLE NOT NULL,
    leased_acreage DOUBLE DEFAULT 0.0,
    primary_irrigation VARCHAR(100),
    soil_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_farm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS parcels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    acreage DOUBLE NOT NULL,
    crop_name VARCHAR(100),
    soil_moisture DOUBLE DEFAULT 65.0,
    soil_ph DOUBLE DEFAULT 6.8,
    crop_stage VARCHAR(50),
    ndvi_index DOUBLE DEFAULT 0.75,
    irrigation_status VARCHAR(50) DEFAULT 'SCHEDULED',
    coordinates_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_parcel_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT,
    parcel_id BIGINT,
    name VARCHAR(100) NOT NULL,
    variety VARCHAR(100) NOT NULL,
    season VARCHAR(50) NOT NULL,
    stage VARCHAR(50) NOT NULL,
    planting_date DATE,
    expected_harvest_date DATE,
    health_score INT DEFAULT 85,
    yield_forecast VARCHAR(100),
    water_requirement VARCHAR(100),
    status VARCHAR(50) DEFAULT 'OPTIMAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_crop_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
    CONSTRAINT fk_crop_parcel FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS soil_metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT,
    nitrogen_level DOUBLE DEFAULT 185.0,
    phosphorus_level DOUBLE DEFAULT 34.0,
    potassium_level DOUBLE DEFAULT 240.0,
    soil_ph DOUBLE DEFAULT 6.8,
    organic_matter DOUBLE DEFAULT 2.4,
    electrical_conductivity DOUBLE DEFAULT 0.85,
    moisture_depth_15cm DOUBLE DEFAULT 70.0,
    moisture_depth_30cm DOUBLE DEFAULT 65.0,
    moisture_depth_60cm DOUBLE DEFAULT 58.0,
    overall_vitality_index INT DEFAULT 88,
    tested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_soil_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS soil_tests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parcel_name VARCHAR(100) NOT NULL,
    sample_code VARCHAR(50) NOT NULL,
    lab_name VARCHAR(150),
    ph DOUBLE,
    status VARCHAR(50) DEFAULT 'OPTIMAL',
    notes TEXT,
    tested_date DATE
);

CREATE TABLE IF NOT EXISTS weather_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT,
    location VARCHAR(100) NOT NULL,
    temperature DOUBLE NOT NULL,
    condition_name VARCHAR(50) NOT NULL,
    humidity INT NOT NULL,
    wind_speed DOUBLE NOT NULL,
    uv_index INT DEFAULT 7,
    evapotranspiration DOUBLE DEFAULT 4.6,
    rain_probability INT DEFAULT 10,
    forecast_json TEXT,
    advisories_json TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_weather_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS irrigation_zones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT,
    parcel_id BIGINT,
    zone_name VARCHAR(100) NOT NULL,
    valve_state BOOLEAN DEFAULT FALSE,
    mode VARCHAR(50) DEFAULT 'AUTO',
    moisture_threshold DOUBLE DEFAULT 60.0,
    flow_rate_lpm DOUBLE DEFAULT 45.0,
    water_consumed_today DOUBLE DEFAULT 480.0,
    next_run_time VARCHAR(100),
    last_run_duration_min INT DEFAULT 35,
    CONSTRAINT fk_irrigation_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
    CONSTRAINT fk_irrigation_parcel FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pest_diagnostics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT,
    crop_name VARCHAR(100) NOT NULL,
    issue_name VARCHAR(150) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    confidence_score DOUBLE NOT NULL,
    image_url VARCHAR(500),
    affected_zone VARCHAR(100),
    treatment_recommendation TEXT,
    ai_analysis_summary TEXT,
    diagnosed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pest_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    grounding_sources VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sensor_devices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT,
    device_code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(100) NOT NULL,
    parcel_code VARCHAR(50),
    battery_percentage INT DEFAULT 95,
    signal_rssi VARCHAR(50) DEFAULT '-68 dBm (Strong)',
    status VARCHAR(50) DEFAULT 'ONLINE',
    last_ping VARCHAR(100),
    reading_display VARCHAR(100),
    CONSTRAINT fk_sensor_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    severity VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    parcel_code VARCHAR(50),
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alert_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recommendations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT,
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    priority VARCHAR(50) NOT NULL,
    impact_category VARCHAR(50) NOT NULL,
    action_cta VARCHAR(100),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendation_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS farmer_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    farmer_uid VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(150),
    avatar_url VARCHAR(500),
    experience_years INT DEFAULT 12,
    primary_occupation VARCHAR(100) DEFAULT 'Owner-Cultivator & Lead Agronomist',
    education_level VARCHAR(100) DEFAULT 'B.Sc. Agriculture',
    preferred_language VARCHAR(100) DEFAULT 'Telugu & English',
    farming_type VARCHAR(100) DEFAULT 'Integrated Precision & Regenerative',
    state VARCHAR(100) DEFAULT 'Telangana',
    district VARCHAR(100) DEFAULT 'Rangareddy / Hyderabad',
    village_mandal VARCHAR(150) DEFAULT 'Moinabad Mandal, Chilkur Village',
    pincode VARCHAR(20) DEFAULT '500075',
    farm_name VARCHAR(150) DEFAULT 'Green Valley Farm',
    total_acreage DOUBLE DEFAULT 12.5,
    owned_acreage DOUBLE DEFAULT 12.0,
    leased_acreage DOUBLE DEFAULT 0.5,
    survey_numbers VARCHAR(200) DEFAULT 'Sy. No. 142/A, 143/B & 144/1',
    soil_type VARCHAR(100) DEFAULT 'Red Sandy Loam with High Organic Matrix',
    water_source VARCHAR(150) DEFAULT 'Borewell with Solar Pump + Rainwater Reservoir',
    primary_irrigation VARCHAR(150) DEFAULT 'Precision Drip & Automated Micro-Sprinkler',
    pm_kisan_id VARCHAR(50) DEFAULT 'PMK-TS-984210',
    pm_kisan_status VARCHAR(50) DEFAULT 'ACTIVE_VERIFIED',
    kcc_number VARCHAR(50) DEFAULT 'KCC-SBI-684291',
    kcc_limit DOUBLE DEFAULT 350000.0,
    kcc_bank VARCHAR(100) DEFAULT 'State Bank of India (Agricultural Finance)',
    soil_health_card_no VARCHAR(50) DEFAULT 'SHC-2026-TS-0491',
    soil_health_status VARCHAR(50) DEFAULT 'VALID_OPTIMAL',
    crop_insurance_policy VARCHAR(100) DEFAULT 'PMFBY-AIC-2026-90214',
    crop_insurance_status VARCHAR(50) DEFAULT 'ACTIVE_INSURED',
    emergency_contact VARCHAR(150) DEFAULT '+91 94401 88921 (Kavitha Kumar - Spouse)',
    certifications TEXT,
    machinery_inventory TEXT,
    primary_crops TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

