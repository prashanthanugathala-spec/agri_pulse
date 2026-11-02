package com.agripulse.dto;

import java.time.LocalDateTime;
import java.util.List;

public class FarmerProfileDTO {

    private Long id;
    private Long userId;
    private String farmerUid;
    private String fullName;
    private String phone;
    private String email;
    private String avatarUrl;
    private Integer experienceYears;
    private String primaryOccupation;
    private String educationLevel;
    private String preferredLanguage;
    private String farmingType;

    // Address
    private String state;
    private String district;
    private String villageMandal;
    private String pincode;

    // Farm details
    private String farmName;
    private Double totalAcreage;
    private Double ownedAcreage;
    private Double leasedAcreage;
    private String surveyNumbers;
    private String soilType;
    private String waterSource;
    private String primaryIrrigation;

    // Scheme & Government details
    private String pmKisanId;
    private String pmKisanStatus;
    private String kccNumber;
    private Double kccLimit;
    private String kccBank;
    private String soilHealthCardNo;
    private String soilHealthStatus;
    private String cropInsurancePolicy;
    private String cropInsuranceStatus;
    private String emergencyContact;

    // Lists & JSON fields
    private List<String> certifications;
    private List<String> machineryInventory;
    private List<String> primaryCrops;

    // Operational summary
    private Integer activeParcelsCount;
    private Integer vitalityScore;
    private Double waterSavedPercentage;
    private List<String> verifiedBadges;
    private LocalDateTime updatedAt;

    public FarmerProfileDTO() {}

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

    public List<String> getCertifications() { return certifications; }
    public void setCertifications(List<String> certifications) { this.certifications = certifications; }

    public List<String> getMachineryInventory() { return machineryInventory; }
    public void setMachineryInventory(List<String> machineryInventory) { this.machineryInventory = machineryInventory; }

    public List<String> getPrimaryCrops() { return primaryCrops; }
    public void setPrimaryCrops(List<String> primaryCrops) { this.primaryCrops = primaryCrops; }

    public Integer getActiveParcelsCount() { return activeParcelsCount; }
    public void setActiveParcelsCount(Integer activeParcelsCount) { this.activeParcelsCount = activeParcelsCount; }

    public Integer getVitalityScore() { return vitalityScore; }
    public void setVitalityScore(Integer vitalityScore) { this.vitalityScore = vitalityScore; }

    public Double getWaterSavedPercentage() { return waterSavedPercentage; }
    public void setWaterSavedPercentage(Double waterSavedPercentage) { this.waterSavedPercentage = waterSavedPercentage; }

    public List<String> getVerifiedBadges() { return verifiedBadges; }
    public void setVerifiedBadges(List<String> verifiedBadges) { this.verifiedBadges = verifiedBadges; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
