package br.com.projeto.apialphyz.controller;

import br.com.projeto.apialphyz.dto.CadastroUsuarioDTO;
import br.com.projeto.apialphyz.dto.LoginDTO;
import br.com.projeto.apialphyz.model.Usuario;
import br.com.projeto.apialphyz.repository.UsuarioRepository;
import br.com.projeto.apialphyz.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/autenticar")
public class CadastroController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    public CadastroController(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarUsuario(@RequestBody CadastroUsuarioDTO cadastroUsuarioDTO) {
        try {
            Usuario novoUsuario = usuarioService.cadastrarNovoUsuario(cadastroUsuarioDTO);
            Map<String, Object> resp = new HashMap<>();
            resp.put("message", "Usuário registrado com sucesso!");
            resp.put("id", novoUsuario.getId());
            resp.put("email", novoUsuario.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login) {
        List<Usuario> lista = usuarioRepository.findByEmail(login.getEmail());
        if (lista == null || lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Credenciais inválidas"));
        }
        Usuario u = lista.get(0);
        // Senha salva como texto simples (sem criptografia neste projeto)
        if (u.getSenha() == null || !u.getSenha().equals(login.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Credenciais inválidas"));
        }
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "OK");
        resp.put("userId", u.getId());
        resp.put("nome", u.getNome());
        // Token placeholder para desenvolvimento
        resp.put("token", "dev-token");
        return ResponseEntity.ok(resp);
    }
}
