package br.com.projeto.apialphyz.controller;


import br.com.projeto.apialphyz.model.Usuario;
import br.com.projeto.apialphyz.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;



    @GetMapping
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    @PostMapping
    public Usuario salvar(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
}
