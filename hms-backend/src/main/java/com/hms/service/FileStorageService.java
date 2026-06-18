package com.hms.service;

import com.hms.entity.Patient;
import com.hms.entity.PatientReport;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.PatientReportRepository;
import com.hms.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final PatientRepository patientRepository;
    private final PatientReportRepository reportRepository;

    public FileStorageService(@Value("${app.file.upload-dir}") String uploadDir, 
                              PatientRepository patientRepository,
                              PatientReportRepository reportRepository) {
        this.patientRepository = patientRepository;
        this.reportRepository = reportRepository;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeReportFile(MultipartFile file, UUID patientUserId, String description) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        String newFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            PatientReport report = new PatientReport();
            report.setPatient(patient);
            report.setFileName(originalFileName);
            report.setFilePath(targetLocation.toString());
            report.setFileType(fileExtension.replace(".", ""));
            report.setFileSizeKb((int) (file.getSize() / 1024));
            report.setDescription(description);
            reportRepository.save(report);

            return newFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(UUID reportId) {
        PatientReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        try {
            Path filePath = Paths.get(report.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found " + report.getFileName());
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found " + report.getFileName());
        }
    }
}
