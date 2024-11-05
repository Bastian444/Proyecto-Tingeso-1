package com.example.proyecto_tingeso.controllers;

import com.example.proyecto_tingeso.entities.loanEntity;
import com.example.proyecto_tingeso.services.loanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/loans")
@CrossOrigin("*")
public class loanController {
    @Autowired
    private loanService loanService;

    @GetMapping("/")
    public ResponseEntity<List<loanEntity>> listLoans() {
        List<loanEntity> loans = loanService.getAllLoans();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<loanEntity> getLoanById(@PathVariable Long id) {
        loanEntity loan = loanService.getLoanById(id);
        if (loan != null) {
            return ResponseEntity.ok(loan);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> saveLoan(@RequestBody loanEntity loan) {
        System.out.println("Received loan data: " + loan); // Debugging line to print received data
        try {
            loanEntity savedLoan = loanService.saveLoan(loan);
            return ResponseEntity.ok(savedLoan);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLoanState(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String state = request.get("state");
        loanEntity loan = loanService.getLoanById(id);
        if (loan != null) {
            loan.setState(state);
            loanService.saveLoan(loan);
            return ResponseEntity.ok(loan);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Préstamo no encontrado");
        }
    }

    @GetMapping("/user/{rut}")
    public ResponseEntity<List<loanEntity>> getLoansByRut(@PathVariable String rut) {
        List<loanEntity> loans = loanService.getLoansByRut(rut);
        return ResponseEntity.ok(loans);
    }
}
