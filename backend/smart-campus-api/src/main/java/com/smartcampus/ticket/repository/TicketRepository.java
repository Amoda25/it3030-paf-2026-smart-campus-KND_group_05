package com.smartcampus.ticket.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartcampus.ticket.model.Ticket;
import com.smartcampus.ticket.model.TicketStatus;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByCreatedByOrderByCreatedAtDesc(String createdBy);
    List<Ticket> findByAssignedToOrderByCreatedAtDesc(String assignedTo);
    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);
}