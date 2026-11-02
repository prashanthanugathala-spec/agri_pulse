package com.agripulse.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "soil_tests")
public class SoilTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parcel_name", nullable = false, length = 100)
    private String parcelName;

    @Column(name = "sample_code", nullable = false, length = 50)
    private String sampleCode;

    @Column(name = "lab_name", length = 150)
    private String labName;

    private Double ph;

    @Column(length = 50)
    private String status = "OPTIMAL";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "tested_date")
    private LocalDate testedDate;

    public SoilTest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getParcelName() { return parcelName; }
    public void setParcelName(String parcelName) { this.parcelName = parcelName; }

    public String getSampleCode() { return sampleCode; }
    public void setSampleCode(String sampleCode) { this.sampleCode = sampleCode; }

    public String getLabName() { return labName; }
    public void setLabName(String labName) { this.labName = labName; }

    public Double getPh() { return ph; }
    public void setPh(Double ph) { this.ph = ph; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDate getTestedDate() { return testedDate; }
    public void setTestedDate(LocalDate testedDate) { this.testedDate = testedDate; }
}
