package com.hms.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hms.config.CustomUserDetails;
import com.hms.service.FileStorageService;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    // ==========================================
    // Upload Report
    // ==========================================

    @PostMapping("/upload/report")
    public ResponseEntity<Map<String, String>> uploadReport(

            @AuthenticationPrincipal CustomUserDetails userDetails,

            @RequestParam("file") MultipartFile file,

            @RequestParam("description") String description) {

        String fileName = fileStorageService.storeReportFile(
                file,
                userDetails.getUser().getId(),
                description
        );

        return ResponseEntity.ok(
                Map.of(
                        "fileName", fileName,
                        "message", "File uploaded successfully"
                )
        );
    }

    // ==========================================
    // Download Report
    // ==========================================

    @GetMapping("/reports/{id}")
    public ResponseEntity<Resource> downloadReport(
            @PathVariable UUID id) {

        Resource resource = fileStorageService.loadFileAsResource(id);

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\""
                )
                .body(resource);
    }
}