package com.spotify.spotifyclone.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spotify.spotifyclone.entity.User;
import com.spotify.spotifyclone.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository repository;

    public User saveUser(User user) {

        if (user == null) {
            return null;
        }

        if (user.getUsername() == null ||
            user.getUsername().trim().isEmpty()) {
            return null;
        }

        if (user.getEmail() == null ||
            user.getEmail().trim().isEmpty()) {
            return null;
        }

        if (user.getPassword() == null ||
            user.getPassword().trim().isEmpty()) {
            return null;
        }

        String email = user.getEmail().trim().toLowerCase();

        if (repository.existsByEmail(email)) {
            return null;
        }

        user.setEmail(email);

        return repository.save(user);
    }

    public User login(String email, String password) {

        if (email == null || password == null) {
            return null;
        }

        Optional<User> optionalUser =
                repository.findByEmail(
                        email.trim().toLowerCase()
                );

        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();

        if (user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}