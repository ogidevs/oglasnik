package com.ognjen.oglasnik.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LogDto {
    private String username;
    private String action;
    private String method;
    private Instant timestamp;
    private String ipAddress;
    private String userAgent;
    private String details;
}
