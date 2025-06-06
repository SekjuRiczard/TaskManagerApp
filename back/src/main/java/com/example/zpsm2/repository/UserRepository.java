package com.example.zpsm2.repository;

import com.example.zpsm2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User>findByUsername(String username);
    boolean existsByUsername(String username);

}
