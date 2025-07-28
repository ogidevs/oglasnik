package com.ognjen.oglasnik.repository;

import com.ognjen.oglasnik.model.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, Long>, JpaSpecificationExecutor<Log> {
    List<Log> findByUsername(String username);
    Page<Log> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
}