package com.hms.service;

import com.hms.entity.*;
import com.hms.repository.*;
import com.hms.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BloodBankService {

    private final BloodStockRepository bloodStockRepository;
    private final BloodDonorRepository bloodDonorRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final BloodRequestMatchRepository bloodRequestMatchRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public BloodBankService(BloodStockRepository bloodStockRepository,
                            BloodDonorRepository bloodDonorRepository,
                            BloodRequestRepository bloodRequestRepository,
                            BloodRequestMatchRepository bloodRequestMatchRepository,
                            PatientRepository patientRepository,
                            UserRepository userRepository) {
        this.bloodStockRepository = bloodStockRepository;
        this.bloodDonorRepository = bloodDonorRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.bloodRequestMatchRepository = bloodRequestMatchRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // Compatibility Checker
    // ==========================================
    public boolean isCompatible(String donorGroup, String recipientGroup) {
        if (donorGroup == null || recipientGroup == null) return false;
        donorGroup = donorGroup.trim().toUpperCase();
        recipientGroup = recipientGroup.trim().toUpperCase();

        if (donorGroup.equals(recipientGroup)) return true;
        if ("O-".equals(donorGroup)) return true; // Universal donor
        if ("AB+".equals(recipientGroup)) return true; // Universal recipient

        if ("O+".equals(donorGroup)) {
            return recipientGroup.endsWith("+");
        }
        if ("A-".equals(donorGroup)) {
            return "A-".equals(recipientGroup) || "A+".equals(recipientGroup) || 
                   "AB-".equals(recipientGroup) || "AB+".equals(recipientGroup);
        }
        if ("A+".equals(donorGroup)) {
            return "A+".equals(recipientGroup) || "AB+".equals(recipientGroup);
        }
        if ("B-".equals(donorGroup)) {
            return "B-".equals(recipientGroup) || "B+".equals(recipientGroup) || 
                   "AB-".equals(recipientGroup) || "AB+".equals(recipientGroup);
        }
        if ("B+".equals(donorGroup)) {
            return "B+".equals(recipientGroup) || "AB+".equals(recipientGroup);
        }
        if ("AB-".equals(donorGroup)) {
            return "AB-".equals(recipientGroup) || "AB+".equals(recipientGroup);
        }
        return false;
    }

    // ==========================================
    // Haversine Distance Calculation (km)
    // ==========================================
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // ==========================================
    // Stats & Summaries
    // ==========================================
    public Map<String, Object> getStats() {
        List<BloodRequest> requests = bloodRequestRepository.findAll();
        long total = requests.size();
        long pending = requests.stream().filter(r -> "PENDING".equals(r.getStatus())).count();
        long fulfilled = requests.stream().filter(r -> "FULFILLED".equals(r.getStatus())).count();
        long activeDonors = bloodDonorRepository.count();

        List<BloodStock> stocks = bloodStockRepository.findAll();
        long lowStockCount = stocks.stream()
                .filter(s -> s.getUnitsAvailable().compareTo(s.getLowStockThreshold()) < 0)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRequests", total);
        stats.put("pendingRequests", pending);
        stats.put("fulfilledRequests", fulfilled);
        stats.put("activeDonors", activeDonors);
        stats.put("lowStockCount", lowStockCount);
        return stats;
    }

    // ==========================================
    // Stock Management
    // ==========================================
    public List<BloodStock> getStock() {
        return bloodStockRepository.findAll();
    }

    @Transactional
    public BloodStock adjustStock(String bloodGroup, BigDecimal available, BigDecimal reserved) {
        BloodStock stock = bloodStockRepository.findByBloodGroup(bloodGroup)
                .orElseThrow(() -> new ResourceNotFoundException("Blood group stock not found"));
        if (available != null) {
            stock.setUnitsAvailable(available);
        }
        if (reserved != null) {
            stock.setUnitsReserved(reserved);
        }
        return bloodStockRepository.save(stock);
    }

    // ==========================================
    // Donor Management
    // ==========================================
    public List<BloodDonor> getAllDonors() {
        return bloodDonorRepository.findAll();
    }

    @Transactional
    public BloodDonor registerDonor(Map<String, Object> payload) {
        String fullName = (String) payload.get("fullName");
        String bloodGroup = (String) payload.get("bloodGroup");
        String phoneNumber = (String) payload.get("phoneNumber");
        String email = (String) payload.get("email");
        String address = (String) payload.get("address");
        BigDecimal latitude = payload.get("latitude") != null ? new BigDecimal(payload.get("latitude").toString()) : null;
        BigDecimal longitude = payload.get("longitude") != null ? new BigDecimal(payload.get("longitude").toString()) : null;
        Boolean consent = payload.get("notificationConsent") == null || (Boolean) payload.get("notificationConsent");

        UUID patientId = null;
        Patient patient = null;
        if (payload.get("patientId") != null) {
            patientId = UUID.fromString(payload.get("patientId").toString());
            patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        }

        BloodDonor donor = new BloodDonor();
        donor.setPatient(patient);
        donor.setFullName(fullName);
        donor.setBloodGroup(bloodGroup);
        donor.setPhoneNumber(phoneNumber);
        donor.setEmail(email);
        donor.setAddress(address);
        donor.setLatitude(latitude);
        donor.setLongitude(longitude);
        donor.setNotificationConsent(consent);
        donor.setIsEligible(true);

        return bloodDonorRepository.save(donor);
    }

    // ==========================================
    // Emergency Requests
    // ==========================================
    public List<BloodRequest> getAllRequests() {
        return bloodRequestRepository.findAll();
    }

    @Transactional
    public BloodRequest createRequest(Map<String, Object> payload) {
        UUID requesterId = UUID.fromString(payload.get("requesterId").toString());
        String bloodGroup = (String) payload.get("bloodGroup");
        BigDecimal units = new BigDecimal(payload.get("unitsRequired").toString());
        String urgency = (String) payload.getOrDefault("urgencyLevel", "HIGH");
        String hospitalName = (String) payload.get("hospitalName");
        String address = (String) payload.get("hospitalAddress");
        BigDecimal lat = payload.get("hospitalLatitude") != null ? new BigDecimal(payload.get("hospitalLatitude").toString()) : null;
        BigDecimal lng = payload.get("hospitalLongitude") != null ? new BigDecimal(payload.get("hospitalLongitude").toString()) : null;
        String notes = (String) payload.get("notes");

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Requester user not found"));

        Patient patient = null;
        if (payload.get("patientId") != null && !payload.get("patientId").toString().isEmpty()) {
            UUID patientId = UUID.fromString(payload.get("patientId").toString());
            patient = patientRepository.findById(patientId).orElse(null);
        }

        BloodRequest request = new BloodRequest();
        request.setRequester(requester);
        request.setPatient(patient);
        request.setBloodGroup(bloodGroup);
        request.setUnitsRequired(units);
        request.setUrgencyLevel(urgency);
        request.setHospitalName(hospitalName);
        request.setHospitalAddress(address);
        request.setHospitalLatitude(lat);
        request.setHospitalLongitude(lng);
        request.setNotes(notes);
        request.setStatus("PENDING");

        request = bloodRequestRepository.save(request);

        // Auto-run donor matching and save results
        matchAndSaveDonors(request);

        return request;
    }

    @Transactional
    public void matchAndSaveDonors(BloodRequest request) {
        List<BloodDonor> donors = bloodDonorRepository.findByIsEligibleTrue();
        double hospitalLat = request.getHospitalLatitude() != null ? request.getHospitalLatitude().doubleValue() : 19.0760; // default Mumbai lat
        double hospitalLng = request.getHospitalLongitude() != null ? request.getHospitalLongitude().doubleValue() : 72.8777; // default Mumbai lng

        for (BloodDonor donor : donors) {
            if (isCompatible(donor.getBloodGroup(), request.getBloodGroup())) {
                double donorLat = donor.getLatitude() != null ? donor.getLatitude().doubleValue() : hospitalLat;
                double donorLng = donor.getLongitude() != null ? donor.getLongitude().doubleValue() : hospitalLng;
                double distance = calculateDistance(hospitalLat, hospitalLng, donorLat, donorLng);

                // For simplicity, match all compatible donors. Filter by distance threshold in queries if needed.
                BloodRequestMatch match = new BloodRequestMatch();
                match.setRequest(request);
                match.setDonor(donor);
                match.setDistanceKm(new BigDecimal(distance).setScale(2, RoundingMode.HALF_UP));
                match.setNotificationStatus("PENDING");
                bloodRequestMatchRepository.save(match);
            }
        }
    }

    public List<Map<String, Object>> getMatchesForRequest(UUID requestId) {
        List<BloodRequestMatch> matches = bloodRequestMatchRepository.findByRequestId(requestId);
        
        return matches.stream().map(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("donorId", m.getDonor().getId());
            map.put("fullName", m.getDonor().getFullName());
            map.put("bloodGroup", m.getDonor().getBloodGroup());
            map.put("phoneNumber", m.getDonor().getPhoneNumber());
            map.put("address", m.getDonor().getAddress());
            map.put("distanceKm", m.getDistanceKm());
            map.put("notificationStatus", m.getNotificationStatus());
            map.put("notifiedAt", m.getNotifiedAt());
            map.put("responseAt", m.getResponseAt());
            return map;
        }).sorted(Comparator.comparing(m -> new BigDecimal(m.get("distanceKm").toString())))
          .collect(Collectors.toList());
    }

    @Transactional
    public void notifyDonors(UUID requestId) {
        List<BloodRequestMatch> matches = bloodRequestMatchRepository.findByRequestId(requestId);
        LocalDateTime now = LocalDateTime.now();
        for (BloodRequestMatch match : matches) {
            match.setNotificationStatus("NOTIFIED");
            match.setNotifiedAt(now);
            bloodRequestMatchRepository.save(match);
            
            // Simulating sending SMS / Email / Voice Call alert
            System.out.println("ALERT SENT: Emergency blood request for group " + 
                               match.getRequest().getBloodGroup() + " to donor " + 
                               match.getDonor().getFullName() + " at phone: " + 
                               match.getDonor().getPhoneNumber());
        }
        
        BloodRequest req = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        req.setStatus("MATCHING");
        bloodRequestRepository.save(req);
    }

    @Transactional
    public BloodRequestMatch updateMatchStatus(UUID matchId, String status) {
        BloodRequestMatch match = bloodRequestMatchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match record not found"));
        match.setNotificationStatus(status);
        match.setResponseAt(LocalDateTime.now());
        match = bloodRequestMatchRepository.save(match);

        // If completed or accepted, adjust stock and request status accordingly
        if ("ACCEPTED".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status)) {
            BloodRequest req = match.getRequest();
            req.setStatus("FULFILLED");
            req.setFulfilledAt(LocalDateTime.now());
            bloodRequestRepository.save(req);

            // Auto deduct stock
            BloodStock stock = bloodStockRepository.findByBloodGroup(req.getBloodGroup()).orElse(null);
            if (stock != null) {
                BigDecimal available = stock.getUnitsAvailable().subtract(req.getUnitsRequired());
                if (available.compareTo(BigDecimal.ZERO) < 0) {
                    available = BigDecimal.ZERO;
                }
                stock.setUnitsAvailable(available);
                bloodStockRepository.save(stock);
            }
        }

        return match;
    }

    @Transactional
    public BloodRequest updateRequestStatus(UUID id, String status) {
        BloodRequest req = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        req.setStatus(status);
        if ("FULFILLED".equalsIgnoreCase(status)) {
            req.setFulfilledAt(LocalDateTime.now());
        }
        return bloodRequestRepository.save(req);
    }
}
