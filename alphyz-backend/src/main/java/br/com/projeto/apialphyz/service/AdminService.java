package br.com.projeto.apialphyz.service;

import br.com.projeto.apialphyz.model.Denuncia;
import br.com.projeto.apialphyz.model.Usuario;
import br.com.projeto.apialphyz.repository.DenunciaRepository;
import br.com.projeto.apialphyz.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminService {

        private final UsuarioRepository userRepository;
        private final DenunciaRepository denunciaRepository;

        public AdminService(UsuarioRepository userRepository, DenunciaRepository denunciaRepository) {
            this.userRepository = userRepository;
            this.denunciaRepository = denunciaRepository;
        }

        public List<Denuncia> getAllReports() {
            return denunciaRepository.findAll();
        }

        public Usuario banUser(String userId) {
            Usuario user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            return userRepository.save(user);
        }
}
