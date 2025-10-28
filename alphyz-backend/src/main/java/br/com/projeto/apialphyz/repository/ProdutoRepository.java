package br.com.projeto.apialphyz.repository;

import br.com.projeto.apialphyz.model.Produto;
import br.com.projeto.apialphyz.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProdutoRepository extends MongoRepository<Produto, String> {
    List<Produto> findByNome(String nome);
}
