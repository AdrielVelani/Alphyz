package br.com.projeto.apialphyz;

import br.com.projeto.apialphyz.controller.UsuarioController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiAlphyzApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiAlphyzApplication.class, args);
    }

    @Autowired
    private UsuarioController usuarioController;


}
