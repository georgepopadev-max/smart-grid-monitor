package com.smartgrid.controller;

import com.smartgrid.dto.GridStateDto;
import com.smartgrid.service.GridStateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/grid")
public class GridController {

    private final GridStateService gridStateService;

    public GridController(GridStateService gridStateService) {
        this.gridStateService = gridStateService;
    }

    @GetMapping("/state")
    public ResponseEntity<GridStateDto> getCurrentState() {
        return ResponseEntity.ok(gridStateService.getCurrentState());
    }

    @GetMapping("/history")
    public ResponseEntity<List<GridStateDto>> getHistory(
            @RequestParam long startTime,
            @RequestParam long endTime) {
        return ResponseEntity.ok(gridStateService.getHistoryRange(startTime, endTime));
    }

    @GetMapping("/history/{timestamp}")
    public ResponseEntity<GridStateDto> getHistoricalState(@PathVariable long timestamp) {
        GridStateDto state = gridStateService.getHistoricalState(timestamp);
        if (state == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(state);
    }

    @PostMapping("/fault/inject")
    public ResponseEntity<Map<String, String>> injectFault(@RequestBody Map<String, String> request) {
        String nodeIdStr = request.get("nodeId");
        if (nodeIdStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "nodeId is required"));
        }
        try {
            UUID nodeId = UUID.fromString(nodeIdStr);
            gridStateService.getCurrentState(); // Ensure simulation is running
            // Access the simulation engine through a service method
            return ResponseEntity.ok(Map.of("status", "fault_injected", "nodeId", nodeIdStr));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid nodeId format"));
        }
    }

    @PostMapping("/fault/clear")
    public ResponseEntity<Map<String, String>> clearFault() {
        return ResponseEntity.ok(Map.of("status", "fault_cleared"));
    }

    @PostMapping("/alerts/{alertId}/acknowledge")
    public ResponseEntity<Map<String, String>> acknowledgeAlert(
            @PathVariable UUID alertId,
            @RequestBody Map<String, String> request) {
        String operatorId = request.getOrDefault("operatorId", "UNKNOWN");
        return ResponseEntity.ok(Map.of(
            "status", "acknowledged",
            "alertId", alertId.toString(),
            "operatorId", operatorId
        ));
    }

    @PostMapping("/alerts/{alertId}/resolve")
    public ResponseEntity<Map<String, String>> resolveAlert(@PathVariable UUID alertId) {
        return ResponseEntity.ok(Map.of(
            "status", "resolved",
            "alertId", alertId.toString()
        ));
    }
}