package com.hms.entity;

import java.math.BigDecimal;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;

@Entity
@Table(name = "blood_stock")
public class BloodStock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(length = 36)
    private UUID id;

    @Column(name = "blood_group", nullable = false, unique = true, length = 5)
    private String bloodGroup;

    @Column(name = "units_available", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitsAvailable = BigDecimal.ZERO;

    @Column(name = "units_reserved", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitsReserved = BigDecimal.ZERO;

    @Column(name = "low_stock_threshold", nullable = false, precision = 10, scale = 2)
    private BigDecimal lowStockThreshold = new BigDecimal("5.00");

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public BigDecimal getUnitsAvailable() {
        return unitsAvailable;
    }

    public void setUnitsAvailable(BigDecimal unitsAvailable) {
        this.unitsAvailable = unitsAvailable;
    }

    public BigDecimal getUnitsReserved() {
        return unitsReserved;
    }

    public void setUnitsReserved(BigDecimal unitsReserved) {
        this.unitsReserved = unitsReserved;
    }

    public BigDecimal getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(BigDecimal lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }
}
