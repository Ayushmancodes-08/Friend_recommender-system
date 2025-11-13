package com.example.friendrecommender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class FriendController {

    @Autowired
    private UserDatabase userDatabase;

    @Autowired
    private RecommendationEngine recommendationEngine;

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return userDatabase.getAllUsers().stream()
            .map(user -> new UserDTO(user, userDatabase))
            .collect(Collectors.toList());
    }

    @PostMapping("/users")
    public ResponseEntity<User> addUser(@RequestBody CreateUserRequest request) {
        if (userDatabase.findUserByName(request.name()) != null) {
            return ResponseEntity.badRequest().build();
        }
        User newUser = userDatabase.addUser(request.name(), request.location());
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/friendships")
    public ResponseEntity<String> addFriendship(@RequestBody CreateFriendshipRequest request) {
        boolean success = userDatabase.addFriendship(request.name1(), request.name2());
        if (success) {
            return ResponseEntity.ok("Friendship created between " + request.name1() + " and " + request.name2());
        } else {
            return ResponseEntity.badRequest().body("Failed to create friendship. Users may not exist or are already friends.");
        }
    }

    @GetMapping("/users/{name}/recommendations")
    public ResponseEntity<List<Recommendation>> getRecommendations(@PathVariable String name) {
        User user = userDatabase.findUserByName(name);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<Recommendation> recommendations = recommendationEngine.generateRecommendations(user);
        return ResponseEntity.ok(recommendations);
    }

    @DeleteMapping("/users/{name}")
    public ResponseEntity<String> deleteUser(@PathVariable String name) {
        boolean success = userDatabase.deleteUser(name);
        if (success) {
            return ResponseEntity.ok("User " + name + " deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    static class UserDTO {
        public int id;
        public String name;
        public String location;
        public List<String> friends;

        public UserDTO(User user, UserDatabase db) {
            this.id = user.id;
            this.name = user.name;
            this.location = user.location;
            this.friends = new ArrayList<>();
            for (int friendId : user.friendIds) {
                User friend = db.getAllUsers().get(friendId);
                this.friends.add(friend.name);
            }
        }
    }
}
