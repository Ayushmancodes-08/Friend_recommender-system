package com.example.friendrecommender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class RecommendationEngine {

    @Autowired
    private UserDatabase userDatabase; 

    public int countMutualFriends(User userA, User userB) {
        int mutualCount = 0;
        for (int friendIdOfA : userA.friendIds) {
            if (userB.friendIds.contains(friendIdOfA)) {
                mutualCount++;
            }
        }
        return mutualCount;
    }

    public List<Recommendation> generateRecommendations(User currentUser) {
        List<Recommendation> recommendations = new ArrayList<>();

        for (User potentialFriend : userDatabase.getAllUsers()) {
            if (potentialFriend.id == currentUser.id) {
                continue;
            }
            if (currentUser.friendIds.contains(potentialFriend.id)) {
                continue;
            }

            int mutuals = countMutualFriends(currentUser, potentialFriend);
            boolean sameLoc = currentUser.location.equals(potentialFriend.location);

            if (mutuals > 0) {
                recommendations.add(new Recommendation(potentialFriend.name, mutuals, sameLoc));
            }
        }

        Collections.sort(recommendations);
        return recommendations;
    }
}
