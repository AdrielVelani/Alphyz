package br.com.projeto.apialphyz.service;

import br.com.projeto.apialphyz.config.JwtService;
import br.com.projeto.apialphyz.domain.User;
import br.com.projeto.apialphyz.dto.AuthResponse;
import br.com.projeto.apialphyz.dto.CadastroRequest;
import br.com.projeto.apialphyz.dto.LoginRequest;
import br.com.projeto.apialphyz.repo.UserRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AuthResponse cadastrar(CadastroRequest r) {
        if (users.existsByEmail(r.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }
        if (users.existsByCpf(r.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }

        User u = new User();
        u.setNome(r.getNome());
        u.setTelefone(r.getTelefone());
        u.setCep(r.getCep());
        u.setRua(r.getRua());
        u.setNumero(r.getNumero());
        u.setComplemento(r.getComplemento());
        u.setCpf(r.getCpf());
        u.setEmail(r.getEmail());
        u.setSenhaHash(encoder.encode(r.getSenha()));

        try {
            u = users.save(u);
        } catch (DuplicateKeyException e) {
            throw new IllegalArgumentException("E-mail ou CPF já cadastrado.");
        }

        String token = jwt.generate(u.getId(), Map.of("nome", u.getNome(), "email", u.getEmail()), 3600 * 12);
        return new AuthResponse(token, new AuthResponse.Usuario(u.getId(), u.getNome(), u.getEmail()));
    }

    public AuthResponse login(LoginRequest r) {
        User u = users.findByEmail(r.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas."));

        if (!encoder.matches(r.getSenha(), u.getSenhaHash())) {
            throw new IllegalArgumentException("Credenciais inválidas.");
        }
        String token = jwt.generate(u.getId(), Map.of("nome", u.getNome(), "email", u.getEmail()), 3600 * 12);
        return new AuthResponse(token, new AuthResponse.Usuario(u.getId(), u.getNome(), u.getEmail()));
    }
}
