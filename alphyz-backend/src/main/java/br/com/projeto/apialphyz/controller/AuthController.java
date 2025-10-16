package br.com.projeto.apialphyz.controller;

import br.com.projeto.apialphyz.dto.AuthResponse;
import br.com.projeto.apialphyz.dto.CadastroRequest;
import br.com.projeto.apialphyz.dto.LoginRequest;
import br.com.projeto.apialphyz.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/cadastros")
    public ResponseEntity<AuthResponse> cadastrar(@Valid @RequestBody CadastroRequest req) {
        AuthResponse resp = service.cadastrar(req);
        return ResponseEntity.status(201).body(resp);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(service.login(req));
    }
}
