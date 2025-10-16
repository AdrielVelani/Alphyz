package br.com.projeto.apialphyz.dto;

public class AuthResponse {
    private String token;
    private Usuario usuario;

    public AuthResponse() {}

    public AuthResponse(String token, Usuario usuario) {
        this.token = token;
        this.usuario = usuario;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public static class Usuario {
        private String id;
        private String nome;
        private String email;

        public Usuario() {}
        public Usuario(String id, String nome, String email) {
            this.id = id;
            this.nome = nome;
            this.email = email;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
