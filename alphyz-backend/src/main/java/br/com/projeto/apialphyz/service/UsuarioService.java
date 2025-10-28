package br.com.projeto.apialphyz.service;

import br.com.projeto.apialphyz.dto.CadastroUsuarioDTO;
import br.com.projeto.apialphyz.dto.ReviewDTO;
import br.com.projeto.apialphyz.model.Usuario;
import br.com.projeto.apialphyz.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;


    // Construtor para injeção de dependências
    // pesquisar mais padrões de projeto
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;

    }

    public Usuario cadastrarNovoUsuario(CadastroUsuarioDTO cadastroUsuarioDTO) {

        // Verifica se o email ou CPF já estão no sistema
        if (usuarioRepository.existsByEmail(cadastroUsuarioDTO.getEmail())) {
            throw new RuntimeException("Esse email já está cadastrado.");
        } else if (usuarioRepository.existsByCpf(cadastroUsuarioDTO.getCpf())) {
            throw new RuntimeException("Esse CPF já está cadastrado.");
        }



        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(cadastroUsuarioDTO.getNome());
        novoUsuario.setEmail(cadastroUsuarioDTO.getEmail());
        novoUsuario.setCpf(cadastroUsuarioDTO.getCpf());
        novoUsuario.setTelefone(cadastroUsuarioDTO.getTelefone());
        novoUsuario.setSenha(cadastroUsuarioDTO.getSenha());
        novoUsuario.setCep(cadastroUsuarioDTO.getCep());
        novoUsuario.setCidade(cadastroUsuarioDTO.getCidade());
        novoUsuario.setEstado(cadastroUsuarioDTO.getEstado());
        novoUsuario.setRua(cadastroUsuarioDTO.getRua());
        novoUsuario.setComplemento(cadastroUsuarioDTO.getComplemento());
        novoUsuario.setNumero(cadastroUsuarioDTO.getNumero());

        //Parte a ser atualizada - Criptografia de Senha
        // ideia: Usar JWT

       // String senhaCriptografada = passwordEncoder.encode(registroDTO.getSenha());
       // novoUsuario.setSenha(senhaCriptografada);

        // novoUsuario.setRoles(Set.of(roleRepository.findByName("ROLE_USER")));

        return usuarioRepository.save(novoUsuario);
    }


    public void addReview(String id, ReviewDTO review) {
    }
}
