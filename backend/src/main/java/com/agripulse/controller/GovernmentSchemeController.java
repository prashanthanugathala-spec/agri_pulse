package com.agripulse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/government-schemes")
public class GovernmentSchemeController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSchemes() {
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createScheme("pm-kisan", "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
                "Ministry of Agriculture & Farmers Welfare, GoI", "Direct Income Support",
                "₹6,000 / year direct bank transfer in 3 equal instalments of ₹2,000.",
                "₹6,000 / year", "100% Cash Transfer",
                "All landholding farmer families with cultivable landholding in their name.",
                "https://pmkisan.gov.in"));

        list.add(createScheme("pmfby", "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
                "Ministry of Agriculture & Farmers Welfare", "Crop Insurance & Risk Mitigation",
                "Comprehensive non-preventable risk insurance from pre-sowing to post-harvest.",
                "Covers 100% of Sum Insured", "Farmers pay only 1.5% - 2% premium",
                "All farmers growing notified crops in notified areas.",
                "https://pmfby.gov.in"));

        list.add(createScheme("pmksy", "PMKSY - Per Drop More Crop (Micro Irrigation)",
                "Department of Agriculture & Farmers Welfare", "Irrigation & Water Conservation",
                "Up to 55% - 70% capital subsidy on Drip and Sprinkler irrigation systems.",
                "Up to ₹45,000 - ₹75,000 per hectare subsidy", "55% for Small & Marginal farmers",
                "All farmers possessing cultivable land with an assured water source.",
                "https://pmksy.gov.in"));

        list.add(createScheme("smam", "SMAM (Sub-Mission on Agricultural Mechanization)",
                "Ministry of Agriculture & Farmers Welfare", "Farm Machinery & Drones",
                "40% to 50% subsidy on Tractors, Tillers, Harvesters, and up to 50-100% on Agri Drones.",
                "₹50,000 to ₹5,00,000+ depending on machinery", "40% - 50% for Individual Farmers",
                "Individual farmers, FPOs, Cooperative societies, and SHGs.",
                "https://agrimachinery.nic.in"));

        list.add(createScheme("kcc", "Kisan Credit Card (KCC) Scheme",
                "Reserve Bank of India & NABARD", "Concessional Agricultural Credit",
                "Collateral-free crop loan up to ₹1.6 Lakhs; total credit limit up to ₹3 Lakhs @ 4% effective interest rate.",
                "Credit line based on crop scale of finance", "3% Interest Subvention Incentive",
                "All farmers—owner cultivators, tenant farmers, and sharecroppers.",
                "https://pmkisan.gov.in/KCC.aspx"));

        list.add(createScheme("pm-kusum", "PM-KUSUM (Solar Agriculture)",
                "Ministry of New and Renewable Energy (MNRE)", "Solar Energy & Pumping",
                "Up to 90% combined subsidy for replacing diesel pumps with Solar Agriculture Pumps.",
                "Up to ₹2,50,000+ subsidy on solar pump sets", "60% Subsidy + 30% Bank Loan (Farmer 10%)",
                "Farmers, groups of farmers, and Water User Associations.",
                "https://pmkusum.mnre.gov.in"));

        list.add(createScheme("pkvy", "PKVY (Paramparagat Krishi Vikas Yojana)",
                "Ministry of Agriculture & Farmers Welfare", "Organic Farming & Certification",
                "Financial assistance of ₹50,000 per hectare for cluster organic adoption & marketing.",
                "₹50,000 / hectare / 3 years", "₹31,000 direct input transfer",
                "Farmer groups / clusters of 20 or more farmers having 50 acres.",
                "https://pgsindia-ncof.gov.in"));

        list.add(createScheme("soil-health-card", "Soil Health Card Scheme",
                "Ministry of Agriculture & Farmers Welfare", "Soil Testing & Nutrient Prescriptions",
                "Free biennial soil analysis across 12 chemical parameters with dosage guidance.",
                "100% Free Testing & Advisory", "100% Fully Centrally Funded",
                "All farmers across every agricultural parcel in India.",
                "https://soilhealth.dac.gov.in"));

        return ResponseEntity.ok(list);
    }

    private Map<String, Object> createScheme(String id, String title, String ministry, String category,
                                             String benefitSummary, String financialAssistance,
                                             String subsidyPercent, String eligibility, String applicationUrl) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("title", title);
        map.put("ministry", ministry);
        map.put("category", category);
        map.put("benefitSummary", benefitSummary);
        map.put("financialAssistance", financialAssistance);
        map.put("subsidyPercent", subsidyPercent);
        map.put("eligibility", eligibility);
        map.put("applicationUrl", applicationUrl);
        map.put("status", "ACTIVE_OPEN");
        return map;
    }
}
