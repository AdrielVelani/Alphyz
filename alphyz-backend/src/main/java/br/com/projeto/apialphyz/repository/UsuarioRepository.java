package br.com.projeto.apialphyz.repository;

import br.com.projeto.apialphyz.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    List<Usuario> findByNome(String nome);
    List<Usuario> findByEmail(String email);
    List<Usuario> findByResetToken(String resetToken);
    Boolean existsByEmail(String email);
    Boolean existsByCpf(String cpf);
}