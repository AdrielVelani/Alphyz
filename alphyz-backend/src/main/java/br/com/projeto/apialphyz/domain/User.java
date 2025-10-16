package br.com.projeto.apialphyz.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String nome;
    private String telefone;
    private String cep;
    private String rua;
    private String numero;
    private String complemento;

    @Indexed(unique = true)
    private String cpf;

    @Indexed(unique = true)
    private String email;

    /** senha armazenada como hash (BCrypt) */
    private String senhaHash;

    private Instant criadoEm = Instant.now();

    public User() {}

    public User(String id, String nome, String telefone, String cep, String rua, String numero, String complemento,
                String cpf, String email, String senhaHash, Instant criadoEm) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.cep = cep;
        this.rua = rua;
        this.numero = numero;
        this.complemento = complemento;
        this.cpf = cpf;
        this.email = email;
        this.senhaHash = senhaHash;
        this.criadoEm = criadoEm;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getRua() { return rua; }
    public void setRua(String rua) { this.rua = rua; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }

    public Instant getCriadoEm() { return criadoEm; }
    public void setCriadoEm(Instant criadoEm) { this.criadoEm = criadoEm; }
}
