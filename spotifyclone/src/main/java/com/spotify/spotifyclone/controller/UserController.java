package com.spotify.spotifyclone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.spotify.spotifyclone.entity.User;
import com.spotify.spotifyclone.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping("/test")
    public String test() {
        return "Backend Running";
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.saveUser(user);
    }
}