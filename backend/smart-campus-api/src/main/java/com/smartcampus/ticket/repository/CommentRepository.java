package com.smartcampus.ticket.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smartcampus.ticket.model.Comment;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    //Get all comments for a ticket
    List<Comment> findByTicketId(String ticketId);


    //To delete the comment along with a ticket delete
    void deleteByTicketId(String ticketId);

}