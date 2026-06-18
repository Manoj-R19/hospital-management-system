package com.hms.dto.response;

import java.math.BigDecimal;

public class AdminDashboardStatsResponse {
    private long totalDoctors;
    private long totalPatients;
    private long totalAppointments;
    private BigDecimal revenue;
    private long pendingRequests;
    private long todayActivity;

    public AdminDashboardStatsResponse() {
    }

    public AdminDashboardStatsResponse(long totalDoctors, long totalPatients, long totalAppointments, BigDecimal revenue, long pendingRequests, long todayActivity) {
        this.totalDoctors = totalDoctors;
        this.totalPatients = totalPatients;
        this.totalAppointments = totalAppointments;
        this.revenue = revenue;
        this.pendingRequests = pendingRequests;
        this.todayActivity = todayActivity;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getTodayActivity() {
        return todayActivity;
    }

    public void setTodayActivity(long todayActivity) {
        this.todayActivity = todayActivity;
    }
}
