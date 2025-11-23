package br.com.projeto.apialphyz.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "roupa") // sua collection chama roupa, mas guarda produtos
public class Produto {

    @Id
    private String id;

    private String nome;
    private String descricao;
    private Double preco;

    // este campo é essencial
    private String usuarioId;

    public Produto() {}

    public Produto(String nome, String descricao, Double preco, String usuarioId) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.usuarioId = usuarioId;
    }

    public String getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public Double getPreco() { return preco; }
    public String getUsuarioId() { return usuarioId; }

    public void setId(String id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setPreco(Double preco) { this.preco = preco; }
    public void setUsuarioId(String usuarioId) { this.usuarioId = usuarioId; }
}
