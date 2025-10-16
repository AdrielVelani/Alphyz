package br.com.projeto.apialphyz.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CadastroRequest {

    @NotBlank
    private String nome;

    @NotBlank
    private String telefone;

    @NotBlank
    @Pattern(regexp = "\\d{8}", message = "CEP deve ter 8 dígitos (apenas números)")
    private String cep;

    @NotBlank private String rua;
    @NotBlank private String numero;
    private String complemento;

    @NotBlank
    @Pattern(regexp = "\\d{11}", message = "CPF deve ter 11 dígitos (apenas números)")
    private String cpf;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    private String senha;

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

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}
