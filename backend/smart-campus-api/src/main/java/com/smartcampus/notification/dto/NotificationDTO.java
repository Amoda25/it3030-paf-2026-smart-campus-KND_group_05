package com.smartcampus.notification.dto;

import java.time.LocalDateTime;

import com.smartcampus.notification.model.NotificationType;

public class NotificationDTO {

    private String id;
    private String userId;
    private NotificationType type;
    private String message;
    private String referenceId;
    private Boolean isRead;
    private LocalDateTime createdAt;

    private String targetUrl; 

    // GETTERS 

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public NotificationType getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    // SETTERS

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }
}
