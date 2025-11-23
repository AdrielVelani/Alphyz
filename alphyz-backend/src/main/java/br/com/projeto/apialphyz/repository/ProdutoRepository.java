package br.com.projeto.apialphyz.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import br.com.projeto.apialphyz.model.Produto;

public interface ProdutoRepository extends MongoRepository<Produto, String> {
    List<Produto> findByUsuarioId(String usuarioId);
}



