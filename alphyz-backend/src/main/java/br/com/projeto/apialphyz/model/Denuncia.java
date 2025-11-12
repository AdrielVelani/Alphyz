package br.com.projeto.apialphyz.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "denuncias")
public class Denuncia {

    @Id
    private String id;
    private String reporterId;
    private String reportedUserId;
    private String reason;

    public Denuncia() {
    }

    public Denuncia(String reporterId, String reportedUserId, String reason) {
        this.reporterId = reporterId;
        this.reportedUserId = reportedUserId;
        this.reason = reason;
    }

    public String getId() {
        return id;
    }

    public String getReporterId() {
        return reporterId;
    }

    public String getReportedUserId() {
        return reportedUserId;
    }

    public String getReason() {
        return reason;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setReporterId(String reporterId) {
        this.reporterId = reporterId;
    }

    public void setReportedUserId(String reportedUserId) {
        this.reportedUserId = reportedUserId;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}