package com.example.zpsm2.service;

import com.example.zpsm2.dto.UserProfileDto;
import com.example.zpsm2.model.User;
import com.example.zpsm2.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository repo) {
        this.userRepository = repo;
    }

    /**
     * Ładuje profil użytkownika po jego ID
     */
    public UserProfileDto loadProfileById(String id) {
        Integer userId = Integer.parseInt(id);  // lub UUID.fromString(id) jeśli masz UUID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        // mapujesz encję na DTO
        UserProfileDto dto = new UserProfileDto();
        dto.setId(String.valueOf(user.getId()));
        dto.setUsername(user.getUsername());
        // tu możesz dodać inne pola, jak email, imię itp.
        return dto;
    }
}
