package com.example.friendrecommender;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.ArrayList;

@Service
public class UserDatabase {
    private ArrayList<User> users = new ArrayList<>();

    @PostConstruct
    public void populateInitialData() {
        addUser("Alice", "New York");
        addUser("Bob", "New York");
        addUser("Charlie", "London");
        addUser("David", "New York");
        addUser("Eve", "London");
        addUser("Frank", "New York");
        addUser("Asaman pal", "India");

        addFriendship("Alice", "Bob");
        addFriendship("Alice", "Charlie");
        addFriendship("Bob", "David");
        addFriendship("Bob", "Frank");
        addFriendship("Charlie", "David");
        addFriendship("Charlie", "Eve");

        System.out.println("\n--- Pre-populated network created. Ready! ---");
    }

    public User addUser(String name, String location) {
        int newId = users.size();
        User newUser = new User(newId, name, location);
        users.add(newUser);
        return newUser;
    }

    public User findUserByName(String name) {
        for (User user : users) {
            if (user.name.equalsIgnoreCase(name)) {
                return user;
            }
        }
        return null;
    }

    public ArrayList<User> getAllUsers() {
        return users;
    }

    public boolean addFriendship(String name1, String name2) {
        User user1 = findUserByName(name1);
        User user2 = findUserByName(name2);

        if (user1 != null && user2 != null && !user1.friendIds.contains(user2.id)) {
            user1.friendIds.add(user2.id);
            user2.friendIds.add(user1.id);
            return true;
        }
        return false;
    }

    public boolean deleteUser(String name) {
        User user = findUserByName(name);
        if (user == null) {
            return false;
        }

        // Remove this user from all friends' friend lists
        for (User otherUser : users) {
            otherUser.friendIds.remove(Integer.valueOf(user.id));
        }

        // Remove the user
        users.remove(user);
        return true;
    }
}
