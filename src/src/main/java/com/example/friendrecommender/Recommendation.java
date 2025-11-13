package com.example.friendrecommender;

public class Recommendation implements Comparable<Recommendation> {
    public String name;
    public int mutualFriendsCount;
    public boolean sameLocation;

    public Recommendation(String name, int mutualFriendsCount, boolean sameLocation) {
        this.name = name;
        this.mutualFriendsCount = mutualFriendsCount;
        this.sameLocation = sameLocation;
    }

    @Override
    public int compareTo(Recommendation other) {
        if (this.mutualFriendsCount != other.mutualFriendsCount) {
            return Integer.compare(other.mutualFriendsCount, this.mutualFriendsCount);
        }
        return Boolean.compare(other.sameLocation, this.sameLocation);
    }
}
