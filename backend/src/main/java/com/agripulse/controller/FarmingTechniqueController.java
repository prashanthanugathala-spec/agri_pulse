package com.agripulse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/farming-techniques")
public class FarmingTechniqueController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllTechniques() {
        List<Map<String, Object>> techniques = new ArrayList<>();

        techniques.add(createTechnique("precision", "Precision Agriculture & Smart IoT Farming", "Technology Driven", "High Efficiency", "sensors",
                "Data-guided farming optimizing every square meter with IoT and AI.",
                "35 - 50%", "+20 - 35%", "18% input savings", "Medium to High", "Moderate",
                Arrays.asList("Paddy", "Cotton", "Maize", "Orchards", "Vegetables")));

        techniques.add(createTechnique("organic", "Certified Organic Farming", "Ecological & Sustainable", "Premium Price", "eco",
                "Chemical-free farming using biological cycles and natural nutrient buffers.",
                "20 - 30%", "+15% after transition", "40% chemical cost elimination", "Low to Medium", "Moderate",
                Arrays.asList("Rice", "Pulses", "Spices", "Fruits", "Vegetables")));

        techniques.add(createTechnique("hydroponics", "Hydroponics & Aquaponics (Soil-less)", "Controlled Environment", "10x Productivity", "water",
                "High-density vertical soilless cultivation with 90% water recycling.",
                "85 - 90%", "+300 - 500%", "Minimal weeding costs", "High", "Specialized",
                Arrays.asList("Leafy Greens", "Tomato", "Bell Pepper", "Strawberries", "Herbs")));

        techniques.add(createTechnique("drip", "Precision Drip & Fertigation System", "Hydraulic Optimization", "Essential Infrastructure", "water_drop",
                "Delivering water and soluble fertilizers directly into root absorption zones.",
                "50 - 65%", "+25 - 40%", "30% fertilizer savings", "Medium", "Easy to Moderate",
                Arrays.asList("Cotton", "Tomato", "Citrus / Orchard", "Chilli", "Sugarcane")));

        techniques.add(createTechnique("zbnf", "Zero Budget Natural Farming (ZBNF)", "Natural & Indigenous", "Lowest Capital", "psychiatry",
                "Subhash Palekar natural farming model relying on indigenous cow resources.",
                "40 - 50%", "Stable sustainable yields", "80% cost reduction", "Extremely Low", "Traditional",
                Arrays.asList("Millets", "Paddy", "Pulses", "Oilseeds", "Cotton")));

        techniques.add(createTechnique("regenerative", "Regenerative Agriculture & Zero-Till", "Soil Restoration", "Carbon Sequestering", "spa",
                "Restoring living soil ecosystems, carbon capture, and microbial biomass.",
                "30 - 45%", "+15 - 25%", "50% fuel savings", "Low", "Moderate",
                Arrays.asList("Wheat", "Maize", "Soybean", "Cotton", "Gram")));

        techniques.add(createTechnique("vertical_polyhouse", "Protected Polyhouse & Vertical Farming", "High-Tech Protected", "Climate Shielded", "domain",
                "Shield crops from extreme weather, pests, and unseasonal rainfall.",
                "60 - 75%", "+400 - 800%", "Zero unseasonal loss", "High", "High",
                Arrays.asList("Exotic Vegetables", "Polyhouse Tomato", "Capsicum", "Flowers", "Nurseries")));

        techniques.add(createTechnique("agroforestry", "Agroforestry & Multi-Tier Crop Rotation", "Biodiversity & Resilience", "Dual Income Stream", "forest",
                "Integrating valuable timber and fruit trees with annual agricultural crops.",
                "25 - 35%", "+45% total estate return", "Natural windbreak protection", "Low to Medium", "Moderate",
                Arrays.asList("Citrus + Groundnut", "Teak + Ginger", "Coconut + Cocoa", "Paddy + Field Bund Trees")));

        return ResponseEntity.ok(techniques);
    }

    private Map<String, Object> createTechnique(String id, String title, String category, String badge, String icon,
                                                String tagline, String waterSavings, String yieldIncrease,
                                                String costReduction, String setupCost, String skillLevel,
                                                List<String> idealFor) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("title", title);
        map.put("category", category);
        map.put("badge", badge);
        map.put("icon", icon);
        map.put("tagline", tagline);
        map.put("waterSavings", waterSavings);
        map.put("yieldIncrease", yieldIncrease);
        map.put("costReduction", costReduction);
        map.put("setupCost", setupCost);
        map.put("skillLevel", skillLevel);
        map.put("idealFor", idealFor);
        return map;
    }
}
