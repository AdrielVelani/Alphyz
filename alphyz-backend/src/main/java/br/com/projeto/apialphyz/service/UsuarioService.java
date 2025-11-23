package br.com.projeto.apialphyz.service;

import br.com.projeto.apialphyz.dto.CadastroUsuarioDTO;
import br.com.projeto.apialphyz.dto.ReviewDTO;
import br.com.projeto.apialphyz.model.Produto;
import br.com.projeto.apialphyz.model.Usuario;
import br.com.projeto.apialphyz.repository.ProdutoRepository;
import br.com.projeto.apialphyz.repository.UsuarioRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Cadastrar novo usuário
     */
    public Usuario cadastrarNovoUsuario(CadastroUsuarioDTO dto) {

        // Verifica se o email já existe
        List<Usuario> lista = usuarioRepository.findByEmail(dto.getEmail());
        if (!lista.isEmpty()) {
            throw new RuntimeException("E-mail já está em uso");
        }

        Usuario u = new Usuario();
        u.setNome(dto.getNome());
        u.setEmail(dto.getEmail());
        u.setSenha(dto.getSenha());
        u.setCpf(dto.getCpf());
        u.setTelefone(dto.getTelefone());
        u.setRua(dto.getRua());
        u.setNumero(dto.getNumero());
        u.setComplemento(dto.getComplemento());
        u.setCep(dto.getCep());
        u.setEstado(dto.getEstado());
        u.setCidade(dto.getCidade());
        u.setReviews(new ArrayList<>());

        return usuarioRepository.save(u);
    }

    /**
     * Lista produtos do usuário
     */
    public Optional<Map<String, Object>> listarProdutosDoUsuario(String id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) return Optional.empty();

        Usuario usuario = usuarioOpt.get();

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("id", usuario.getId());
        resposta.put("nome", usuario.getNome());

        // CORREÇÃO: método correto para buscar produtos
        List<Produto> produtos = produtoRepository.findByUsuarioId(usuario.getId());
        resposta.put("produtos", produtos);

        return Optional.of(resposta);
    }

    /**
     * Adiciona um review ao usuário
     */
    public void addReview(String id, ReviewDTO review) {
        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado com id: " + id));

        try {
            String reviewJson = mapper.writeValueAsString(review);
            if (usuario.getReviews() == null) {
                usuario.setReviews(new ArrayList<>());
            }
            usuario.getReviews().add(reviewJson);
            usuarioRepository.save(usuario);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao serializar review", e);
        }
    }
}
