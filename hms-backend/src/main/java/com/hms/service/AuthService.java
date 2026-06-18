package com.hms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.config.CustomUserDetails;
import com.hms.dto.request.AdminRegistrationRequest;
import com.hms.dto.request.LoginRequest;
import com.hms.dto.response.AdminResponse;
import com.hms.dto.response.AuthResponse;
import com.hms.entity.User;
import com.hms.enums.UserRole;
import com.hms.repository.UserRepository;
import com.hms.util.JwtUtil;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminService adminService;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AdminService adminService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminService = adminService;
    }

    public AuthResponse login(LoginRequest request, UserRole expectedRole) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        if (user.getRole() != expectedRole) {
            throw new IllegalArgumentException("Invalid role for this login portal");
        }

        String token = jwtUtil.generateToken(userDetails, user.getRole().name());

        return new AuthResponse(token, user.getRole().name(), user.getEmail(), user.getId().toString());
    }

    @Transactional
    public AdminResponse registerAdmin(AdminRegistrationRequest request) {
        return adminService.registerAdmin(request);
    }
}



