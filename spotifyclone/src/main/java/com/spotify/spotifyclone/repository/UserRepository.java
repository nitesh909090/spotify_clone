package com.spotify.spotifyclone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.spotify.spotifyclone.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}