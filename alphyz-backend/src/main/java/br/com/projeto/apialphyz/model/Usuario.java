package br.com.projeto.apialphyz.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "Usuario")
public class Usuario {
    @Id
    private String id;
    private String nome;
    private String senha;
    private String telefone;
    private String rua;
    private String complemento;
    private Integer numero;
    private Integer cep;
    private String cidade;
    private String estado;
    private Role role;
    private List<String> reviews = new ArrayList<>();


    @Indexed(unique=true)
    private String email;
    @Indexed(unique=true)
    private String cpf;
    
    private String resetToken;
    private Long tokenExpiration;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }


    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }


    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }


    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }



    public String getTelefone() {
        return telefone;
    }
    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getRua() {
        return rua;
    }
    public void setRua(String rua) {
        this.rua = rua;
    }
    public String getComplemento() {
        return complemento;
    }
    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }
    public Integer getNumero() {
        return numero;
    }
    public void setNumero(Integer numero) {
        this.numero = numero;
    }
    public Integer getCep() {
        return cep;
    }
    public void setCep(Integer cep) {
        this.cep = cep;
    }
    public String getCidade() {
        return cidade;
    }
    public void setCidade(String cidade) {
        this.cidade = cidade;
    }
    public String getEstado() {
        return estado;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }

 public Role getRole() {
        return role;
 }
 public void setRole(Role role) {
        this.role = role;
 }
 public List<String> getReviews() {
        return reviews;
    }
    public void setReviews(List<String> reviews) {
        this.reviews = reviews;
    }
    public String getResetToken() {
    return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
   }

    public Long getTokenExpiration() {
        return tokenExpiration;
    }

    public void setTokenExpiration(Long tokenExpiration) {
         this.tokenExpiration = tokenExpiration;
    }

}