package com.example.zpsm2.service;

import com.example.zpsm2.dto.JwtResponse;
import com.example.zpsm2.dto.LoginRequest;
import com.example.zpsm2.dto.SignupRequest;
import com.example.zpsm2.model.Role;
import com.example.zpsm2.model.User;
import com.example.zpsm2.repository.UserRepository;
import com.example.zpsm2.utils.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authManager, UserRepository userRepository,
                       PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authManager = authManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    public JwtResponse register(SignupRequest request){
        if(userRepository.existsByUsername(request.username)){
            throw new RuntimeException("Użytkownik juz istnieje");
        }
        User user = new User();
        user.setUsername(request.username);
        user.setEmail(request.email);
        user.setPassword(encoder.encode(request.password));
        user.setRole(Role.USER);
        userRepository.save(user);

        String token = jwtUtils.generateToken(String.valueOf(user.getId()));
        return new JwtResponse(token);
    }

    public JwtResponse login(LoginRequest request) {
        System.out.println("[LOGIN] Przy próbie autoryzacji dla: " + request.username);
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username, request.password)
            );
            System.out.println("[LOGIN] authenticate() OK");
            User u = userRepository.findByUsername(authentication.getName())
                    .orElseThrow();
            String token = jwtUtils.generateToken(String.valueOf(u.getId()));
            return new JwtResponse(token);
        } catch (Exception ex) {
            System.err.println("[LOGIN] authenticate() rzuciło wyjątek:");
            ex.printStackTrace();
            throw ex;
        }
    }
}
