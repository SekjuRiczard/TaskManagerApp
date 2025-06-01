package com.example.zpsm2.controller;

import com.example.zpsm2.dto.UserProfileDto;
import com.example.zpsm2.service.UserDetailsServiceImpl;
import com.example.zpsm2.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> whoAmI() {
        // pobieramy userId, które ustawiliśmy w JwtAuthTokenFilter jako principal
        String userId = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        UserProfileDto profile = userService.loadProfileById(userId);
        return ResponseEntity.ok(profile);
    }
}
