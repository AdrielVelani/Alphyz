package br.com.projeto.apialphyz.repository;

import br.com.projeto.apialphyz.model.Denuncia;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DenunciaRepository extends MongoRepository<Denuncia, String> {
}
