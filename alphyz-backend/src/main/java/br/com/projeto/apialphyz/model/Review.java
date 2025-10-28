package br.com.projeto.apialphyz.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String reviewedUserID;
    private String reviewerUserID;
    private String reviewedDate;
    private int rating;

    public String getReviewedUserID() {
        return reviewedUserID;
    }


    public void setReviewedUserID(String reviewedUserID) {
        this.reviewedUserID = reviewedUserID;
    }

    public String getReviewerUserID() {
        return reviewerUserID;
    }
    public void setReviewerUserID(String reviewerUserID) {
        this.reviewerUserID = reviewerUserID;
    }
    public String getReviewedDate() {
        return reviewedDate;
    }
    public void setReviewedDate(String reviewedDate) {
        this.reviewedDate = reviewedDate;
    }
    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
}
