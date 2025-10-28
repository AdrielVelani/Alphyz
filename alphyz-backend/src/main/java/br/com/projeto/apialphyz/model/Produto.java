package br.com.projeto.apialphyz.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Roupa")
public class Produto {
    @Id
    private String id;
    private String nome;
    private String tamanho;
    private String descricao;
    private String imgURL;
    private boolean ativo = true;
    //Ver onde colocar (Talvez precise ser no admin): private double preco;


    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }


    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setTamanho(String tamanho) {
        this.tamanho = tamanho;
    }

    public String getTamanho() {
        return tamanho;
    }

    public boolean isAtivo() {
        return ativo;
    }
    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public String getImgURL() {
        return imgURL;
    }

    public void setImgURL(String imgURL) {
        this.imgURL = imgURL;
    }

    // public double getPreco() {
    //    return preco;
    //  }
    //  public void setPreco(double preco) {
    //     this.preco = preco;
    //}

}
