package com.agripulse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/pesticides")
public class PesticideController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPesticides() {
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createPesticide(1L, "Neem Oil 10,000 PPM (Azadirachtin)", "BIO_PESTICIDE", "Botanical Insecticide & Repellent",
                "Aphids, Whiteflies, Thrips, Jassids, Leaf Miners", "Cotton, Tomato, Rice, Citrus", "400 - 500 ml", 0, 4, "GREEN", "Slightly Toxic (Eco-Safe)"));

        list.add(createPesticide(2L, "Chlorantraniliprole 18.5% SC (Coragen)", "CHEMICAL_INSECTICIDE", "Anthranilic Diamide Insecticide",
                "Stem Borer, Leaf Folder, Bollworm, Fruit Borer", "Rice, Cotton, Tomato, Maize", "60 ml", 14, 24, "BLUE", "Moderately Toxic"));

        list.add(createPesticide(3L, "Trichoderma viride 1.5% WP", "BIO_FUNGICIDE", "Beneficial Antagonistic Fungal Agent",
                "Root Rot, Seed Rot, Wilt (Fusarium), Damping Off", "Cotton, Tomato, Pulses, Vegetables", "1.0 - 2.0 kg", 0, 0, "GREEN", "Eco-Safe (Bio-control)"));

        list.add(createPesticide(4L, "Emamectin Benzoate 5% SG (Proclaim)", "CHEMICAL_INSECTICIDE", "Avermectin Biological Derivative",
                "Spodoptera, Helicoverpa, Diamondback Moth", "Cotton, Tomato, Cabbage, Chilli", "80 - 100 g", 3, 12, "YELLOW", "Highly Toxic to Caterpillars"));

        list.add(createPesticide(5L, "Chlorothalonil 75% WP (Kavach)", "CHEMICAL_FUNGICIDE", "Broad-Spectrum Multi-Site Protectant",
                "Early Blight, Late Blight, Anthracnose, Leaf Spot", "Tomato, Potato, Chilli, Groundnut", "400 - 500 g", 7, 24, "BLUE", "Moderately Toxic"));

        list.add(createPesticide(6L, "Bacillus thuringiensis var. kurstaki (Bt)", "BIO_INSECTICIDE", "Microbial Endotoxin Formulation",
                "Bollworms, Spodoptera, Semiloopers", "Cotton, Vegetables, Pulses, Tomato", "300 - 400 g", 0, 4, "GREEN", "Eco-Safe Microbial"));

        list.add(createPesticide(7L, "Azoxystrobin 18.2% + Difenoconazole 11.4% SC", "CHEMICAL_FUNGICIDE", "Dual Systemic Fungicide",
                "Sheath Blight, Blast, Powdery Mildew, Anthracnose", "Rice, Tomato, Chilli, Cotton", "200 ml", 10, 24, "BLUE", "Moderately Toxic"));

        list.add(createPesticide(8L, "Pendimethalin 30% EC (Stomp)", "HERBICIDE", "Pre-Emergence Selective Herbicide",
                "Annual Grasses and Broadleaf Weeds", "Cotton, Soybean, Groundnut, Rice", "1.0 - 1.3 Liters", 45, 24, "BLUE", "Moderately Toxic"));

        return ResponseEntity.ok(list);
    }

    private Map<String, Object> createPesticide(Long id, String name, String type, String category,
                                                String targetPests, String targetCrops, String dosagePerAcre,
                                                int phiDays, int reiHours, String toxicityBand, String toxicityLabel) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("name", name);
        map.put("type", type);
        map.put("category", category);
        map.put("targetPests", targetPests);
        map.put("targetCrops", targetCrops);
        map.put("dosagePerAcre", dosagePerAcre);
        map.put("phiDays", phiDays);
        map.put("reiHours", reiHours);
        map.put("toxicityBand", toxicityBand);
        map.put("toxicityLabel", toxicityLabel);
        map.put("cibrcApproved", true);
        return map;
    }
}
