package com.example.proyecto_tingeso.services;

import com.example.proyecto_tingeso.entities.loanEntity;
import com.example.proyecto_tingeso.entities.userEntity;
import com.example.proyecto_tingeso.repositories.loanRepository;
import com.example.proyecto_tingeso.repositories.userRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class loanServiceTest {

    @Mock
    private loanRepository LoanRepository;

    @Mock
    private userRepository UserRepository;

    @InjectMocks
    private loanService loanService;

    private loanEntity loan;
    private userEntity user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Inicializamos un loanEntity común para todas las pruebas
        loan = new loanEntity();
        loan.setId(1L);
        loan.setRut("12345678-9");
        loan.setTermMonths(120); // Plazo de 10 años
        loan.setMonthlyPayment(100.0f);
        loan.setMonthlyIncome(1000.0f);
        loan.setAmount(100000.0f);

        // Inicializamos un userEntity común para todas las pruebas
        user = new userEntity();
        user.setRut("12345678-9");
        user.setAge(65);
    }

    @Test
    void testGetLoanById() {
        // Usamos doReturn para devolver un Optional explícito
        doReturn(Optional.of(loan)).when(LoanRepository).findById(1L);
        when(UserRepository.findByRut("12345678-9")).thenReturn(user);

        loanEntity foundLoan = loanService.getLoanById(1L);

        assertNotNull(foundLoan, "El préstamo encontrado no debería ser nulo");
        assertEquals("Rechazado", foundLoan.getAgeEvaluation(), "La evaluación de edad debería ser 'Rechazado'");
        assertEquals(75, foundLoan.getFinalApplicantAge(), "La edad final del solicitante debería ser 75");
        verify(LoanRepository, times(1)).findById(1L);
        verify(UserRepository, times(1)).findByRut("12345678-9");
    }

    @Test
    void testSaveLoan() {
        when(LoanRepository.save(any(loanEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        loanEntity savedLoan = loanService.saveLoan(loan);

        assertNotNull(savedLoan, "El préstamo guardado no debería ser nulo");
        assertEquals(10.0, savedLoan.getDebtToIncomeRatio(), 0.01, "El ratio de deuda/ingreso debería ser 10.0");
        verify(LoanRepository, times(1)).save(loan);
    }

    @Test
    void testGetLoansByRut() {
        when(LoanRepository.findByRut("12345678-9")).thenReturn(List.of(loan));

        List<loanEntity> loans = loanService.getLoansByRut("12345678-9");

        assertEquals(1, loans.size(), "Debería haber un préstamo asociado al RUT especificado");
        verify(LoanRepository, times(1)).findByRut("12345678-9");
    }

    @Test
    void testCalculateDebtToIncomeRatioInSaveLoan() {
        when(LoanRepository.save(any(loanEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        loanService.saveLoan(loan);

        assertEquals(10.0, loan.getDebtToIncomeRatio(), 0.01, "El ratio de deuda/ingreso debería ser 10.0");
    }

    @Test
    void testCalculateFinalApplicantAgeInGetLoanById() {
        doReturn(Optional.of(loan)).when(LoanRepository).findById(1L);
        when(UserRepository.findByRut("12345678-9")).thenReturn(user);

        loanEntity foundLoan = loanService.getLoanById(1L);

        assertEquals("Rechazado", foundLoan.getAgeEvaluation(), "La evaluación de edad debería ser 'Rechazado'");
        assertEquals(75, foundLoan.getFinalApplicantAge(), "La edad final del solicitante debería ser 75");
    }
}
