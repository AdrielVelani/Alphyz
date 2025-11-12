package br.com.projeto.apialphyz.controller;

import br.com.projeto.apialphyz.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
//@PreAuthorize("hasRole('ADMIN')")
public class AdminController {


    @Autowired
    private AdminService adminService;

    @PostMapping("/ban/{userId}")
    public ResponseEntity<?> banUser(@PathVariable String userId) {
          adminService.banUser(userId);
        return ResponseEntity.ok("User banned successfully.");
    }



    @GetMapping("/reports")
    public ResponseEntity<?> getReports() {
        return ResponseEntity.ok(adminService.getAllReports());
    }

}
