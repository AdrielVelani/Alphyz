package br.com.projeto.apialphyz.controller;

import br.com.projeto.apialphyz.model.Produto;
import br.com.projeto.apialphyz.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    // criar produto
    @PostMapping
    public Produto criar(@RequestBody Produto produto) {
        return produtoService.criarProduto(produto);
    }

    // listar todos
    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.listarTodos();
    }

    // listar produtos por usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<Produto> listarPorUsuario(@PathVariable String usuarioId) {
        return produtoService.listarPorUsuario(usuarioId);
    }
}

