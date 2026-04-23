package com.smartcampus.ticket.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartcampus.ticket.model.TicketImage;

public interface TicketImageRepository extends MongoRepository<TicketImage, String> {
    List<TicketImage> findByTicketId(String ticketId);
}