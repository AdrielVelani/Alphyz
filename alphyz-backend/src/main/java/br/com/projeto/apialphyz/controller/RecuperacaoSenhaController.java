package br.com.projeto.apialphyz.controller;

import br.com.projeto.apialphyz.model.Usuario;
import br.com.projeto.apialphyz.repository.UsuarioRepository;
import br.com.projeto.apialphyz.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/recuperar")
@CrossOrigin(origins = "*")
public class RecuperacaoSenhaController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    // ✅ 1. Enviar o e-mail com token
    @PostMapping("/enviar")
    public String enviarEmail(@RequestBody Usuario usuarioRequest) {
        String email = usuarioRequest.getEmail();

        System.out.println("Recebido do frontend: " + email);

        if (email == null || email.trim().isEmpty()) {
            return "E-mail não informado.";
        }

        email = email.trim();
        List<Usuario> usuarios = usuarioRepository.findByEmail(email);

        System.out.println("Resultado da busca: " + usuarios.size());

        if (usuarios.isEmpty()) {
            return "Email inválido.";
        }

        Usuario usuario = usuarios.get(0);

        // Cria token e define expiração
        String token = UUID.randomUUID().toString();
        long expira = Instant.now().plusSeconds(600).toEpochMilli(); // 10 minutos

        usuario.setResetToken(token);
        usuario.setTokenExpiration(expira);
        usuarioRepository.save(usuario);

        // Monta e envia o e-mail
        String link = "http://localhost:3000/redefinir-senha/" + token;
        String corpo = "Olá " + usuario.getNome() + ",\n\n"
                + "Clique no link abaixo para redefinir sua senha (válido por 10 minutos):\n"
                + link + "\n\nSe você não solicitou isso, ignore este e-mail.";

        emailService.enviarEmail(usuario.getEmail(), "Redefinição de senha", corpo);

        return "E-mail de recuperação enviado com sucesso!";
    }

    // ✅ 2. Redefinir a senha com o token
    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody Map<String, String> dados) {
        String token = dados.get("token");
        String novaSenha = dados.get("novaSenha");

        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "Token inválido."));
        }

        // Busca o usuário com o token
        List<Usuario> usuarios = usuarioRepository.findByResetToken(token);
        if (usuarios.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "Token inválido."));
        }

        Usuario usuario = usuarios.get(0);

        // Verifica se o token expirou
        if (usuario.getTokenExpiration() == null ||
                Instant.now().toEpochMilli() > usuario.getTokenExpiration()) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "Token expirado."));
        }

        // Atualiza a senha (aqui você pode aplicar hash com BCrypt se quiser)
        usuario.setSenha(novaSenha);
        usuario.setResetToken(null);
        usuario.setTokenExpiration(null);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso!"));
    }
}
