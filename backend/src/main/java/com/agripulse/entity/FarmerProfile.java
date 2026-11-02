package com.agripulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmer_profiles")
public class FarmerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true)
    private Long userId;

    @Column(name = "farmer_uid", nullable = false, length = 50)
    private String farmerUid;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(length = 50)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "experience_years")
    private Integer experienceYears = 12;

    @Column(name = "primary_occupation", length = 100)
    private String primaryOccupation = "Owner-Cultivator & Lead Agronomist";

    @Column(name = "education_level", length = 100)
    private String educationLevel = "B.Sc. Agriculture (PJTSAU)";

    @Column(name = "preferred_language", length = 100)
    private String preferredLanguage = "Telugu & English";

    @Column(name = "farming_type", length = 100)
    private String farmingType = "Integrated Precision & Regenerative";

    // Geographical & Farm Address
    @Column(name = "state", length = 100)
    private String state = "Telangana";

    @Column(name = "district", length = 100)
    private String district = "Rangareddy / Hyderabad";

    @Column(name = "village_mandal", length = 150)
    private String villageMandal = "Moinabad Mandal, Chilkur Village";

    @Column(name = "pincode", length = 20)
    private String pincode = "500075";

    // Land Details
    @Column(name = "farm_name", length = 150)
    private String farmName = "Green Valley Farm";

    @Column(name = "total_acreage")
    private Double totalAcreage = 12.5;

    @Column(name = "owned_acreage")
    private Double ownedAcreage = 12.0;

    @Column(name = "leased_acreage")
    private Double leasedAcreage = 0.5;

    @Column(name = "survey_numbers", length = 200)
    private String surveyNumbers = "Sy. No. 142/A, 143/B & 144/1";

    @Column(name = "soil_type", length = 100)
    private String soilType = "Red Sandy Loam with High Organic Matrix";

    @Column(name = "water_source", length = 150)
    private String waterSource = "Borewell with Solar Pump + Rainwater Reservoir";

    @Column(name = "primary_irrigation", length = 150)
    private String primaryIrrigation = "Precision Drip & Automated Micro-Sprinkler";

    // Government & Financial Scheme Linking
    @Column(name = "pm_kisan_id", length = 50)
    private String pmKisanId = "PMK-TS-984210";

    @Column(name = "pm_kisan_status", length = 50)
    private String pmKisanStatus = "ACTIVE_VERIFIED";

    @Column(name = "kcc_number", length = 50)
    private String kccNumber = "KCC-SBI-684291";

    @Column(name = "kcc_limit")
    private Double kccLimit = 350000.0;

    @Column(name = "kcc_bank", length = 100)
    private String kccBank = "State Bank of India (Agricultural Finance)";

    @Column(name = "soil_health_card_no", length = 50)
    private String soilHealthCardNo = "SHC-2026-TS-0491";

    @Column(name = "soil_health_status", length = 50)
    private String soilHealthStatus = "VALID_OPTIMAL";

    @Column(name = "crop_insurance_policy", length = 100)
    private String cropInsurancePolicy = "PMFBY-AIC-2026-90214";

    @Column(name = "crop_insurance_status", length = 50)
    private String cropInsuranceStatus = "ACTIVE_INSURED";

    @Column(name = "emergency_contact", length = 150)
    private String emergencyContact = "+91 94401 88921 (Kavitha Kumar - Spouse)";

    // Badges & JSON strings
    @Column(name = "certifications", columnDefinition = "TEXT")
    private String certifications;

    @Column(name = "machinery_inventory", columnDefinition = "TEXT")
    private String machineryInventory;

    @Column(name = "primary_crops", columnDefinition = "TEXT")
    private String primaryCrops;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public FarmerProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFarmerUid() { return farmerUid; }
    public void setFarmerUid(String farmerUid) { this.farmerUid = farmerUid; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getPrimaryOccupation() { return primaryOccupation; }
    public void setPrimaryOccupation(String primaryOccupation) { this.primaryOccupation = primaryOccupation; }

    public String getEducationLevel() { return educationLevel; }
    public void setEducationLevel(String educationLevel) { this.educationLevel = educationLevel; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public String getFarmingType() { return farmingType; }
    public void setFarmingType(String farmingType) { this.farmingType = farmingType; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getVillageMandal() { return villageMandal; }
    public void setVillageMandal(String villageMandal) { this.villageMandal = villageMandal; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }

    public Double getTotalAcreage() { return totalAcreage; }
    public void setTotalAcreage(Double totalAcreage) { this.totalAcreage = totalAcreage; }

    public Double getOwnedAcreage() { return ownedAcreage; }
    public void setOwnedAcreage(Double ownedAcreage) { this.ownedAcreage = ownedAcreage; }

    public Double getLeasedAcreage() { return leasedAcreage; }
    public void setLeasedAcreage(Double leasedAcreage) { this.leasedAcreage = leasedAcreage; }

    public String getSurveyNumbers() { return surveyNumbers; }
    public void setSurveyNumbers(String surveyNumbers) { this.surveyNumbers = surveyNumbers; }

    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }

    public String getWaterSource() { return waterSource; }
    public void setWaterSource(String waterSource) { this.waterSource = waterSource; }

    public String getPrimaryIrrigation() { return primaryIrrigation; }
    public void setPrimaryIrrigation(String primaryIrrigation) { this.primaryIrrigation = primaryIrrigation; }

    public String getPmKisanId() { return pmKisanId; }
    public void setPmKisanId(String pmKisanId) { this.pmKisanId = pmKisanId; }

    public String getPmKisanStatus() { return pmKisanStatus; }
    public void setPmKisanStatus(String pmKisanStatus) { this.pmKisanStatus = pmKisanStatus; }

    public String getKccNumber() { return kccNumber; }
    public void setKccNumber(String kccNumber) { this.kccNumber = kccNumber; }

    public Double getKccLimit() { return kccLimit; }
    public void setKccLimit(Double kccLimit) { this.kccLimit = kccLimit; }

    public String getKccBank() { return kccBank; }
    public void setKccBank(String kccBank) { this.kccBank = kccBank; }

    public String getSoilHealthCardNo() { return soilHealthCardNo; }
    public void setSoilHealthCardNo(String soilHealthCardNo) { this.soilHealthCardNo = soilHealthCardNo; }

    public String getSoilHealthStatus() { return soilHealthStatus; }
    public void setSoilHealthStatus(String soilHealthStatus) { this.soilHealthStatus = soilHealthStatus; }

    public String getCropInsurancePolicy() { return cropInsurancePolicy; }
    public void setCropInsurancePolicy(String cropInsurancePolicy) { this.cropInsurancePolicy = cropInsurancePolicy; }

    public String getCropInsuranceStatus() { return cropInsuranceStatus; }
    public void setCropInsuranceStatus(String cropInsuranceStatus) { this.cropInsuranceStatus = cropInsuranceStatus; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }

    public String getMachineryInventory() { return machineryInventory; }
    public void setMachineryInventory(String machineryInventory) { this.machineryInventory = machineryInventory; }

    public String getPrimaryCrops() { return primaryCrops; }
    public void setPrimaryCrops(String primaryCrops) { this.primaryCrops = primaryCrops; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
