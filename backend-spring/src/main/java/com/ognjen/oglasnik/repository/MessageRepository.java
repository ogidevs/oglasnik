package com.ognjen.oglasnik.repository;

import com.ognjen.oglasnik.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // Primer za budućnost:
    // List<Message> findByPrimalacId(Long primalacId);
}