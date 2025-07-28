package com.ognjen.oglasnik.dto;

import com.ognjen.oglasnik.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Role role;
}