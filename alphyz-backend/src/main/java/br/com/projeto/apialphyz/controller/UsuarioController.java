package br.com.projeto.apialphyz.controller;

import br.com.projeto.apialphyz.dto.ReviewDTO;
import br.com.projeto.apialphyz.model.Usuario;
import br.com.projeto.apialphyz.repository.UsuarioRepository;
import br.com.projeto.apialphyz.service.UsuarioService;
import br.com.projeto.apialphyz.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EmailService emailService;

    // Lista todos os usuários
    @GetMapping
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    // Cadastra novo usuário
    @PostMapping
    public Usuario salvar(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Buscar usuário por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable String id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ================================
    // GET /usuarios/{id}/
    // ================================
 @GetMapping("/{id}/produtos")
public ResponseEntity<?> listarProdutosDoUsuario(@PathVariable String id) {
    return usuarioService.listarProdutosDoUsuario(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}


    // Adiciona review
    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable String id, @RequestBody ReviewDTO review) {
        usuarioService.addReview(id, review);
        return ResponseEntity.ok("Review added successfully.");
    }

    // Endpoint de recuperação de senha
    @PostMapping("/recuperar-senha")
    public ResponseEntity<String> recuperarSenha(@RequestBody String email) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email.trim()).stream().findFirst();

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("E-mail não encontrado.");
        }

        Usuario usuario = usuarioOpt.get();

        String token = UUID.randomUUID().toString();
        long expira = Instant.now().plusSeconds(600).toEpochMilli();

        usuario.setResetToken(token);
        usuario.setTokenExpiration(expira);
        usuarioRepository.save(usuario);

        String link = "http://localhost:3000/redefinir-senha?token=" + token;
        String corpo = "Olá, " + usuario.getNome() + "!\n\n"
                + "Você solicitou a redefinição de senha. Clique no link abaixo para redefinir (válido por 10 minutos):\n"
                + link + "\n\nSe não foi você, ignore este e-mail.";

        emailService.enviarEmail(usuario.getEmail(), "Recuperação de senha", corpo);

        return ResponseEntity.ok("E-mail de recuperação enviado com sucesso!");
    }
}
