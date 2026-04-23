package com.smartcampus.ticket.dto;

public class TicketImageResponseDTO {

    private String id;
    private String ticketId;
    private String fileName;
    private String imageUrl;
    private Long fileSize;
    private String uploadedAt;

    public TicketImageResponseDTO() {
    }

    public String getId() {
        return id;
    }

    public String getTicketId() {
        return ticketId;
    }

    public String getFileName() {
        return fileName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public String getUploadedAt() {
        return uploadedAt;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public void setUploadedAt(String uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
