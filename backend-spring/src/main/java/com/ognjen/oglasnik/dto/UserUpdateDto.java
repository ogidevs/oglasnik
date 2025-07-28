package com.ognjen.oglasnik.dto;

import com.ognjen.oglasnik.model.Role;
import lombok.Data;

@Data
public class UserUpdateDto {
    private String email;
    private Role role;
}