package com.hms.controller;

import com.hms.entity.BloodStock;
import com.hms.entity.BloodDonor;
import com.hms.entity.BloodRequest;
import com.hms.entity.BloodRequestMatch;
import com.hms.service.BloodBankService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/blood-bank")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class BloodBankController {

    private final BloodBankService bloodBankService;

    public BloodBankController(BloodBankService bloodBankService) {
        this.bloodBankService = bloodBankService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(bloodBankService.getStats());
    }

    @GetMapping("/stock")
    public ResponseEntity<List<BloodStock>> getStock() {
        return ResponseEntity.ok(bloodBankService.getStock());
    }

    @PostMapping("/stock/adjust")
    public ResponseEntity<BloodStock> adjustStock(@RequestBody Map<String, Object> payload) {
        String bloodGroup = (String) payload.get("bloodGroup");
        BigDecimal available = payload.get("unitsAvailable") != null ? new BigDecimal(payload.get("unitsAvailable").toString()) : null;
        BigDecimal reserved = payload.get("unitsReserved") != null ? new BigDecimal(payload.get("unitsReserved").toString()) : null;
        return ResponseEntity.ok(bloodBankService.adjustStock(bloodGroup, available, reserved));
    }

    @GetMapping("/donors")
    public ResponseEntity<List<BloodDonor>> getAllDonors() {
        return ResponseEntity.ok(bloodBankService.getAllDonors());
    }

    @PostMapping("/donors")
    public ResponseEntity<BloodDonor> registerDonor(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(bloodBankService.registerDonor(payload));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<BloodRequest>> getAllRequests() {
        return ResponseEntity.ok(bloodBankService.getAllRequests());
    }

    @PostMapping("/requests")
    public ResponseEntity<BloodRequest> createRequest(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(bloodBankService.createRequest(payload));
    }

    @GetMapping("/requests/{id}/matches")
    public ResponseEntity<List<Map<String, Object>>> getMatchesForRequest(@PathVariable UUID id) {
        return ResponseEntity.ok(bloodBankService.getMatchesForRequest(id));
    }

    @PostMapping("/requests/{id}/notify")
    public ResponseEntity<Void> notifyDonors(@PathVariable UUID id) {
        bloodBankService.notifyDonors(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/matches/{id}/status")
    public ResponseEntity<BloodRequestMatch> updateMatchStatus(@PathVariable UUID id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(bloodBankService.updateMatchStatus(id, status));
    }

    @PutMapping("/requests/{id}/status")
    public ResponseEntity<BloodRequest> updateRequestStatus(@PathVariable UUID id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(bloodBankService.updateRequestStatus(id, status));
    }
}
