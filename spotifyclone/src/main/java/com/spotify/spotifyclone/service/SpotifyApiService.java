package com.spotify.spotifyclone.service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;

@Service
public class SpotifyApiService {

    private final String BASE_URL =
            "https://v1.nocodeapi.com/niteshsharma857/spotify/wCebvKExdkzpIxct";

    public String searchSong(String songName) throws Exception {

        String encodedSong =
                URLEncoder.encode(
                        songName,
                        StandardCharsets.UTF_8);

        String url =
                BASE_URL
                + "/search?q="
                + encodedSong
                + "&type=track";

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .GET()
                        .build();

        HttpResponse<String> response =
                HttpClient.newHttpClient()
                        .send(
                                request,
                                HttpResponse.BodyHandlers.ofString());

        return response.body();
    }
}