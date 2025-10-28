package br.com.projeto.apialphyz.service;

import br.com.projeto.apialphyz.model.Denuncia;
import br.com.projeto.apialphyz.repository.DenunciaRepository;

import java.util.List;

public class DenunciaService {

    private final DenunciaRepository denunciaRepository;

    public DenunciaService(DenunciaRepository denunciaRepository) {
        this.denunciaRepository = denunciaRepository;
    }

    public List<Denuncia> getAllReports() {
        return denunciaRepository.findAll();
    }

    public Denuncia saveDenuncia(Denuncia denuncia) {
        return denunciaRepository.save(denuncia);
    }
}
