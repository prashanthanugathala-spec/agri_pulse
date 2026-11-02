# AgriPulse — Smart Agriculture Management Platform

> Production-ready full-stack enterprise biological and agronomic instrumentation suite built from Google Stitch designs.

---

## 1. Overview & Technology Stack

- **Frontend**: React 19 (Vite 8) + React Router v7
- **Animations & Micro-interactions**: GSAP (GreenSock Animation Platform) + `@gsap/react` + `ScrollTrigger` with `gsap.context()` cleanup and `prefers-reduced-motion` compliance
- **Styling**: Tailwind CSS + Custom Design System CSS Variables Theme File (`src/theme.css` and `src/index.css`)
- **Backend**: Java 21+ with Spring Boot 3.3.4 (REST API, Validation, Jackson, HikariCP)
- **Database**: MySQL 8.0+ (Spring Data JPA / Hibernate)

---

## 2. Project Structure

```
agrii/
├── frontend/
│   ├── public/
│   │   └── logo.svg                     # Vector brand logo
│   ├── src/
│   │   ├── animations/
│   │   │   └── gsapHelpers.js           # GSAP entrance, stagger, and hover hooks
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Button.jsx               # Cupertino rounded-full button
│   │   │   ├── Card.jsx                 # Ambient rounded-3xl container
│   │   │   ├── CommandPalette.jsx       # ⌘K / Ctrl+K fast navigator
│   │   │   ├── DashboardLayout.jsx      # Shell layout with Navbar & Sidebar
│   │   │   ├── FeedbackStates.jsx       # LoadingState, ErrorState, EmptyState
│   │   │   ├── MetricCard.jsx           # 6-Metric matrix cards
│   │   │   ├── Modal.jsx                # Accessible modal dialog
│   │   │   ├── Navbar.jsx               # Header with search, weather & alerts
│   │   │   ├── Sidebar.jsx              # Module navigation with 12 routes
│   │   │   └── StatusBadge.jsx          # Cupertino status chips
│   │   ├── pages/
│   │   │   ├── AiChatPage.jsx           # AgriPulse AI Agronomist
│   │   │   ├── AlertsPage.jsx           # Proactive Incidents Feed
│   │   │   ├── AnalyticsPage.jsx        # Yield Intelligence & Revenue
│   │   │   ├── AuthPage.jsx             # Sign In & Register
│   │   │   ├── CropsPage.jsx            # Crop Portfolio & Phenology
│   │   │   ├── DashboardPage.jsx        # Executive 6-Metric Matrix
│   │   │   ├── FarmMapPage.jsx          # Interactive GIS Polygon Map
│   │   │   ├── FarmerProfilePage.jsx    # Agronomist & Farmer Profile with Digital Pass
│   │   │   ├── IrrigationPage.jsx       # Automated Valves & Emergency Stop
│   │   │   ├── LandingPage.jsx          # Editorial Public Landing Page
│   │   │   ├── OnboardingPage.jsx       # Multi-Step Property Setup
│   │   │   ├── PestPage.jsx             # Vision Pathology Diagnostic
│   │   │   ├── SensorsPage.jsx          # IoT Edge Fleet & Gateway
│   │   │   ├── SettingsPage.jsx         # Prescriptions & Preferences
│   │   │   ├── SoilPage.jsx             # N-P-K & Depth Hydrology Profiles
│   │   │   └── WeatherPage.jsx          # Microclimate & 7-Day Forecast
│   │   ├── services/
│   │   │   └── api.js                   # Unified Axios API service layer
│   │   ├── theme.css                    # Design system tokens (CSS variables)
│   │   ├── index.css                    # Tailwind v4 theme mapping & typography
│   │   ├── App.jsx                      # React Router route registry
│   │   └── main.jsx
│   ├── vite.config.js                   # Proxying /api to http://localhost:8080
│   └── package.json
│
├── backend/
│   ├── src/main/
│   │   ├── java/com/agripulse/
│   │   │   ├── AgriPulseApplication.java
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   ├── controller/
│   │   │   │   ├── AiAgronomistController.java
│   │   │   │   ├── AlertController.java
│   │   │   │   ├── AnalyticsController.java
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── CropController.java
│   │   │   │   ├── DashboardController.java
│   │   │   │   ├── FarmController.java
│   │   │   │   ├── FarmerProfileController.java
│   │   │   │   ├── IrrigationController.java
│   │   │   │   ├── PestController.java
│   │   │   │   ├── RecommendationController.java
│   │   │   │   ├── SensorController.java
│   │   │   │   ├── SettingsController.java
│   │   │   │   ├── SoilController.java
│   │   │   │   └── WeatherController.java
│   │   │   ├── dto/
│   │   │   │   ├── AuthDTO.java
│   │   │   │   ├── DashboardOverviewDTO.java
│   │   │   │   └── FarmerProfileDTO.java
│   │   │   ├── entity/
│   │   │   │   ├── AiChatMessage.java
│   │   │   │   ├── Alert.java
│   │   │   │   ├── Crop.java
│   │   │   │   ├── Farm.java
│   │   │   │   ├── FarmerProfile.java
│   │   │   │   ├── IrrigationZone.java
│   │   │   │   ├── Parcel.java
│   │   │   │   ├── PestDiagnostic.java
│   │   │   │   ├── Recommendation.java
│   │   │   │   ├── SensorDevice.java
│   │   │   │   ├── SoilMetric.java
│   │   │   │   ├── SoilTest.java
│   │   │   │   ├── User.java
│   │   │   │   └── WeatherData.java
│   │   │   ├── repository/
│   │   │   │   └── ... (13 Spring Data JPA repositories)
│   │   │   └── service/
│   │   │       └── ... (13 business domain services)
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── schema.sql
│   │       └── data.sql
│   ├── mvn.cmd                          # Bundled Maven runner configured with JDK 26
│   └── pom.xml
│
├── scripts/
│   ├── test_endpoints.cjs               # Automated test suite for all 18 backend APIs
│   └── test_frontend_routes.cjs         # Automated test suite for all 15 SPA routes
└── README.md
```

---

## 3. Database Setup & Initialization

The platform uses MySQL 8.0+. A schema script (`schema.sql`) and authentic seed dataset (`data.sql`) are provided.

### 1. Create the Database:
```sql
CREATE DATABASE IF NOT EXISTS agripulse_suite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Seed Data Execution:
```bash
mysql -u root -p agripulse_suite_db < backend/src/main/resources/schema.sql
mysql -u root -p agripulse_suite_db < backend/src/main/resources/data.sql
```

The seed data provisions:
- **Lead Agronomist**: Ravi Kumar (`ravi@agripulse.io` / `agripulse123`)
- **Estate**: Green Valley Farm, Hyderabad, Telangana (12.5 Acres)
- **4 Managed Parcels**: Zone A (North Paddy), Zone B (Cotton Basin), Zone C (Polyhouse), Zone D (Orchard)
- **4 Crops**: Sona Masoori Rice, Bt-II Cotton, Arka Rakshak Tomato, Mosambi Sweet Orange
- **6 IoT Sensors & Gateways**: Soil probes, Weather station, Ultrasonic flowmeter, Drone RTK
- **Soil & Weather Telemetry**: N-P-K reserves, 3-depth moisture, 7-day microclimate forecast
- **Incident Engine**: Proactive critical and warning alert records
- **AI Agronomist Context**: Grounded conversational history and agronomy citations

---

## 4. Environment Variables

Configure these in `backend/src/main/resources/application.properties` or set them in your environment:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DB_HOST` | `localhost` | MySQL hostname |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `agripulse_suite_db` | MySQL database name |
| `DB_USERNAME` | `root` | Database user |
| `DB_PASSWORD` | `An@291006` | Database password |
| `SERVER_PORT` | `8080` | Spring Boot REST port |

---

## 5. How to Run Locally

### Start Backend (Spring Boot):
```bash
cd backend
.\mvn.cmd spring-boot:run
```
The REST API starts on `http://localhost:8080/`.

### Start Frontend (Vite + React):
```bash
cd frontend
npm run dev
```
The application opens on `http://localhost:5174/` (or `http://localhost:5173/`).

---

## 6. Complete REST API Reference

| Domain | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Authenticate agronomist credentials |
| **Auth** | `POST` | `/api/auth/register` | Register new estate property |
| **Auth** | `GET` | `/api/auth/me` | Fetch active user profile |
| **Dashboard** | `GET` | `/api/dashboard/overview` | Aggregated 6-metric matrix, weather, parcels & alerts |
| **Dashboard** | `POST` | `/api/dashboard/run-diagnostic`| Execute edge gateway health check |
| **Farm** | `GET` | `/api/farm` | Get estate profile |
| **Farm** | `GET` | `/api/farm/parcels` | List all GIS polygons & zone actuators |
| **Farm** | `PUT` | `/api/farm/parcels/{id}` | Update parcel hydrology & irrigation status |
| **Crops** | `GET` | `/api/crops` | List crop portfolio & phenology stages |
| **Crops** | `POST` | `/api/crops` | Register new botanical strain |
| **Crops** | `DELETE` | `/api/crops/{id}` | Remove crop from portfolio |
| **Soil** | `GET` | `/api/soil/metrics` | N-P-K reserves & 3-depth moisture profile |
| **Soil** | `GET` | `/api/soil/tests` | Historical laboratory assay records |
| **Soil** | `POST` | `/api/soil/tests` | Log certified lab report |
| **Weather** | `GET` | `/api/weather/current` | Real-time microclimate, UV, ET0 & 7-day forecast |
| **Irrigation**| `GET` | `/api/irrigation/zones` | Solenoid valve states and flow rates |
| **Irrigation**| `POST` | `/api/irrigation/zones/{id}/toggle`| Actuate or close solenoid pulse valve |
| **Irrigation**| `POST` | `/api/irrigation/emergency-stop` | Master safety shutoff for all zones |
| **Pest** | `GET` | `/api/pest/diagnostics` | List pathology vision inference records |
| **Pest** | `POST` | `/api/pest/simulate-scan`| Run computer vision leaf pathology scan |
| **AI** | `GET` | `/api/ai/messages` | Get conversation history |
| **AI** | `POST` | `/api/ai/chat` | Send prompt to grounded AI agronomist |
| **Analytics** | `GET` | `/api/analytics/metrics` | Yield projections, water savings & revenue |
| **Analytics** | `GET` | `/api/analytics/yield-trends` | Monthly target vs actual biomass curves |
| **Analytics** | `GET` | `/api/analytics/export` | Generate printable dossier |
| **Sensors** | `GET` | `/api/sensors` | List 868 MHz LoRaWAN IoT sensor nodes |
| **Sensors** | `POST` | `/api/sensors/pair` | Authenticate and pair new hardware probe |
| **Sensors** | `POST` | `/api/sensors/{id}/calibrate` | Calibrate zero-point drift on sensor |
| **Alerts** | `GET` | `/api/alerts` | Incident feed filterable by status |
| **Alerts** | `POST` | `/api/alerts/{id}/resolve` | Mark threshold incident resolved |
| **Alerts** | `POST` | `/api/alerts/{id}/snooze` | Snooze alarm for specified hours |
| **Settings** | `GET` | `/api/settings` | Read workspace preferences |
| **Settings** | `PUT` | `/api/settings/profile` | Update estate details and sync frequency |

---

## 7. Assumptions & Engineering Decisions

1. **Authentication**: An open token authentication mechanism with demo credentials (`ravi@agripulse.io` / `agripulse123`) is configured with local persistence in `localStorage`.
2. **Database Credentials**: MySQL credentials are externalized to environment variables with default fallback (`${DB_PASSWORD:An@291006}`).
3. **Computer Vision Inference**: In addition to standard multipart image uploads, a simulated inference mode is provided so users can test pest detection without requiring external GPU infrastructure.
4. **GSAP & Reduced Motion**: Animations use `gsap.context()` for clean teardown upon unmount, and check `window.matchMedia('(prefers-reduced-motion: reduce)')` to disable heavy motion when requested by the OS.
5. **Interactive Farm Map**: Parcels are rendered as clean, high-precision SVG vector polygons with live state transitions, allowing direct click-to-inspect and valve triggering.
