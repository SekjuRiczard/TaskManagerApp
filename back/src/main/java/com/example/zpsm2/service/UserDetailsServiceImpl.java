package com.example.zpsm2.service;// UserDetailsServiceImpl.java


import com.example.zpsm2.model.User;
import com.example.zpsm2.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.UUID;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDetails loadUserById(String id) throws UsernameNotFoundException {
        Integer userId;
        try {
            userId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("Invalid user ID: " + id);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + id));
        return buildUserDetails(user);
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("[UDS] loadUserByUsername -> " + username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("[UDS] USER NOT FOUND: " + username);
                    return new UsernameNotFoundException("User not found: " + username);
                });
        System.out.println("[UDS] found user, hashedPass=" + user.getPassword());
        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(User user) {
        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
                .build();
    }
}
