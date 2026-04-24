package com.smartcampus.user.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smartcampus.security.roles.Role;
import com.smartcampus.user.model.User;
import com.smartcampus.user.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ Your feature (KEEP THIS)
    public List<User> getAllTechnicians() {
        return userRepository.findByRole(Role.TECHNICIAN);
    }

    // ✅ Existing system logic (KEEP THIS)
    @Transactional(readOnly = true)
    public User authenticate(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            if (!rawPassword.equals(user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }
        }

        return user;
    }

    @Transactional
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Single query: if no admin exists yet, first user becomes admin
        if (user.getRole() == null) {
            boolean adminExists = userRepository.existsByRole(Role.ADMIN);
            user.setRole(adminExists ? Role.USER : Role.ADMIN);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
