package com.agripulse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/market-prices")
public class MarketPriceController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPrices() {
        List<Map<String, Object>> prices = new ArrayList<>();

        prices.add(createPrice(1L, "Paddy (Dhan)", "Sona Masoori (BPT-5204)", "Cereals", "Bowenpally APMC, Hyderabad", "Telangana", 2350, 2180, 2490, 2300, 45, 380, "UP", "Price trending above MSP. Strong mill demand; ideal selling window within next 10 days."));
        prices.add(createPrice(2L, "Cotton (Kapas)", "Bt-Cotton (Medium Staple)", "Cash Crops", "Enamamula Mandi, Warangal", "Telangana", 7420, 7100, 7650, 7121, 110, 520, "UP", "Export inquiries surging. Holding stock for another 2 weeks recommended for peak realization."));
        prices.add(createPrice(3L, "Tomato", "Hybrid (Arka Rakshak)", "Vegetables", "Madanapalle APMC / Hyderabad", "Andhra / Telangana", 1850, 1400, 2100, null, -80, 840, "DOWN", "Heavy arrivals from border districts. Early morning dispatch to local markets advised to preserve margins."));
        prices.add(createPrice(4L, "Sweet Orange (Mosambi)", "Nagpur / Nalgonda Grade A", "Fruits", "Nalgonda Fruit Yard", "Telangana", 4800, 4200, 5300, null, 150, 210, "UP", "High festive demand in metro cities. Direct farm-gate procurement offers ₹200 premium."));
        prices.add(createPrice(5L, "Maize (Makka)", "Yellow Hybrid (Pioneer)", "Cereals", "Nizamabad APMC", "Telangana", 2225, 2050, 2310, 2225, 0, 310, "STABLE", "Trading exactly at government MSP benchmark. Poultry feed demand remains constant."));
        prices.add(createPrice(6L, "Red Chilli", "Teja S17 / Guntur Mirchi", "Spices", "Guntur Mirchi Yard", "Andhra Pradesh", 18500, 16800, 19800, null, 350, 1150, "UP", "High oleoresin grade commanding premium. Cold storage retention advised if quality is A1."));
        prices.add(createPrice(7L, "Soybean", "JS-335", "Oilseeds", "Indore Mandi", "Madhya Pradesh", 4890, 4650, 5050, 4892, -25, 430, "DOWN", "Imported oil parity pressuring domestic prices. Government procurement counters active at MSP."));
        prices.add(createPrice(8L, "Onion", "Nashik Red", "Vegetables", "Lasalgaon / Bowenpally", "Maharashtra / Telangana", 2100, 1750, 2350, null, -50, 920, "DOWN", "Steady buffer stock releases by NAFED keeping prices stabilized."));

        return ResponseEntity.ok(prices);
    }

    private Map<String, Object> createPrice(Long id, String commodity, String variety, String category,
                                            String mandi, String state, int modalPrice, int minPrice,
                                            int maxPrice, Integer msp, int change, int arrivals,
                                            String trend, String advisory) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("commodity", commodity);
        map.put("variety", variety);
        map.put("category", category);
        map.put("mandi", mandi);
        map.put("state", state);
        map.put("modalPrice", modalPrice);
        map.put("minPrice", minPrice);
        map.put("maxPrice", maxPrice);
        map.put("msp", msp);
        map.put("change", change);
        map.put("unit", "₹ / Quintal");
        map.put("arrivalsTons", arrivals);
        map.put("trend", trend);
        map.put("advisory", advisory);
        return map;
    }
}
