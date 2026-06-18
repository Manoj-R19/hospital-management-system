package com.hms.service;

import com.hms.dto.request.AdminRegistrationRequest;
import com.hms.dto.response.AdminResponse;
import com.hms.entity.Admin;
import com.hms.entity.User;
import com.hms.enums.UserRole;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.AdminRepository;
import com.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepository adminRepository,
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AdminResponse registerAdmin(AdminRegistrationRequest request) {
        if (request.getPassword() == null || request.getConfirmPassword() == null ||
                !request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }


        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new IllegalArgumentException("Phone number already in use");
        }

        // Save User
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.ADMIN);
        user = userRepository.save(user);

        // Save Admin Profile
        Admin admin = new Admin();
        admin.setUser(user);
        admin.setFullName(request.getFullName());
        admin.setEmail(request.getEmail());
        admin.setPhoneNumber(request.getPhoneNumber());

        admin = adminRepository.save(admin);



        return mapToResponse(admin);
    }

    public AdminResponse getAdminById(UUID id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        return mapToResponse(admin);
    }

    private AdminResponse mapToResponse(Admin admin) {
        return new AdminResponse(
                admin.getId(),
                admin.getFullName(),
                admin.getEmail(),
                admin.getPhoneNumber(),
                admin.getUser().getRole().name(),
                admin.getUser().getIsActive(),
                admin.getCreatedAt(),
                admin.getUpdatedAt()
        );
    }
}
