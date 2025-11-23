package br.com.projeto.apialphyz.service;

import br.com.projeto.apialphyz.model.Produto;
import br.com.projeto.apialphyz.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public Produto criarProduto(Produto produto) {
        return produtoRepository.save(produto);
    }

    public List<Produto> listarPorUsuario(String usuarioId) {
        return produtoRepository.findByUsuarioId(usuarioId);
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }
}
