package com.ognjen.oglasnik.service;

import com.ognjen.oglasnik.dto.LogDto;
import com.ognjen.oglasnik.model.Log;
import com.ognjen.oglasnik.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogService {
    private final LogRepository logRepository;

    public Page<LogDto> getLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        return logRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    public Page<LogDto> getLogsByUsername(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        return logRepository.findByUsernameContainingIgnoreCase(username, pageable)
                .map(this::mapToDto);
    }

    private LogDto mapToDto(Log log) {
        return new LogDto(
                log.getUsername(),
                log.getAction(),
                log.getMethod(),
                log.getTimestamp(),
                log.getIpAddress(),
                log.getUserAgent(),
                log.getDetails()
        );
    }

}
