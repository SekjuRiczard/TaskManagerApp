package com.example.zpsm2.controller;

import com.example.zpsm2.dto.JwtResponse;
import com.example.zpsm2.dto.LoginRequest;
import com.example.zpsm2.dto.SignupRequest;
import com.example.zpsm2.service.AuthService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService=authService;
    }
    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@RequestBody SignupRequest req) {
        JwtResponse jwt = authService.register(req);       // 1. dostajesz JwtResponse
        String token = jwt.getToken();                     // 2. wyciągasz sam String
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .body(jwt);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest req) {
        JwtResponse jwt = authService.login(req);       // 1. dostajesz JwtResponse
        String token = jwt.getToken();                     // 2. wyciągasz sam String
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .body(jwt);
    }
}
