package com.example.friendrecommender;

import java.util.ArrayList;

public class User {
    public int id;
    public String name;
    public String location;
    public ArrayList<Integer> friendIds;

    public User(int id, String name, String location) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.friendIds = new ArrayList<>();
    }
}
