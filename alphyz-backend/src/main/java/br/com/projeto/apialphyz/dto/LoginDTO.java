package br.com.projeto.apialphyz.dto;

public class LoginDTO {
    private String email;
    private String password;

    public LoginDTO() {
        // Construtor vazio necessário para o Spring
    }

    public LoginDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters e Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginDTO{" +
                "email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                '}';
    }
}
