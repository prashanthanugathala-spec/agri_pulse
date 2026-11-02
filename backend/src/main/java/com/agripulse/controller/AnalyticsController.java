package com.agripulse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics(@RequestParam(defaultValue = "season") String timeframe) {
        return ResponseEntity.ok(Map.of(
                "seasonYieldForecastTons", 28.5,
                "projectedRevenueInr", "₹14,20,000",
                "waterSavingsPercent", 18.4,
                "waterSavingsLiters", 48600,
                "fertilizerCostReductionPercent", 12.2,
                "averageNdvi", 0.74,
                "timeframe", timeframe
        ));
    }

    @GetMapping("/yield-trends")
    public ResponseEntity<List<Map<String, Object>>> getYieldTrends() {
        return ResponseEntity.ok(List.of(
                Map.of("month", "Jun", "target", 3.2, "actual", 3.4),
                Map.of("month", "Jul", "target", 3.5, "actual", 3.6),
                Map.of("month", "Aug", "target", 3.8, "actual", 3.9),
                Map.of("month", "Sep", "target", 4.0, "actual", 4.2),
                Map.of("month", "Oct", "target", 4.1, "actual", 4.25)
        ));
    }

    @GetMapping("/export")
    public ResponseEntity<Map<String, String>> exportReport(@RequestParam(defaultValue = "pdf") String format) {
        return ResponseEntity.ok(Map.of(
                "status", "GENERATED",
                "reportUrl", "/exports/agripulse_harvest_report_" + System.currentTimeMillis() + "." + format,
                "message", "Report compiled and ready for download."
        ));
    }
}
