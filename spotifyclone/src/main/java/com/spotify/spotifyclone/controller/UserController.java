package com.spotify.spotifyclone.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.spotify.spotifyclone.entity.User;
import com.spotify.spotifyclone.service.UserService;

@Controller
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<?> register(@RequestBody User user) {

        try {

            User savedUser = service.saveUser(user);

            if (savedUser == null) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(
                            Map.of(
                                "message",
                                "Email already registered or invalid details"
                            )
                        );
            }

            savedUser.setPassword(null);

            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                        Map.of(
                            "message",
                            "Registration failed"
                        )
                    );
        }
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody User user) {

        try {
            User loggedUser =
                    service.login(
                        user.getEmail(),
                        user.getPassword()
                    );
            if (loggedUser == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                            Map.of(
                                "message",
                                "Invalid Email Or Password"
                            )
                        );
            }
            loggedUser.setPassword(null);

            return ResponseEntity.ok(loggedUser);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                        Map.of(
                            "message",
                            "Login failed"
                        )
                    );
        }
    }
}