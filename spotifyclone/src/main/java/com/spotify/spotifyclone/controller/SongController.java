package com.spotify.spotifyclone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spotify.spotifyclone.service.SpotifyApiService;

@RestController
@RequestMapping("/song")
@CrossOrigin("*")
public class SongController {

    @Autowired
    private SpotifyApiService spotifyApiService;

    @GetMapping("/search")
    public String searchSong(
            @RequestParam String name)
            throws Exception {

        return spotifyApiService.searchSong(name);
    }
}