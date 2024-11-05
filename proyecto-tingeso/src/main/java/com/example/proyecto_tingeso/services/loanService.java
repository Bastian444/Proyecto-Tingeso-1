package com.example.proyecto_tingeso.services;

import com.example.proyecto_tingeso.entities.loanEntity;
import com.example.proyecto_tingeso.entities.userEntity;
import com.example.proyecto_tingeso.repositories.loanRepository;
import com.example.proyecto_tingeso.repositories.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class loanService {
    @Autowired
    private loanRepository LoanRepository;

    @Autowired
    private userRepository UserRepository;

    public loanEntity getLoanById(Long id) {
        Optional<loanEntity> loanOpt = LoanRepository.findById(id);

        if (loanOpt.isPresent()) {
            loanEntity loan = loanOpt.get();
            userEntity user = UserRepository.findByRut(loan.getRut());

            if (user != null) {
                evaluateLoanRules(loan, user);
                calculateFinalApplicantAge(loan, user);
            }
            return loan;
        }
        return null;
    }

    public loanEntity saveLoan(loanEntity loan) {
        System.out.println("Saving loan with values: " + loan); // Debugging line
        calculateDebtToIncomeRatio(loan);
        return LoanRepository.save(loan);
    }

    private void evaluateLoanRules(loanEntity loan, userEntity user) {
        int rulesAchieved = 0;

        // R71: Saldo Mínimo Requerido
        if (loan.getAmountSavingsAcc() >= loan.getAmount() * 0.10) {
            rulesAchieved++;
        }

        // R72: Historial de Ahorro Consistente
        if (!loan.isSignificantWithdrawal() || loan.getWithdrawalAmount() < loan.getAmountSavingsAcc() * 0.50) {
            rulesAchieved++;
        }

        // R73: Depósitos Periódicos
        if (loan.getRecentDepositAmount() >= loan.getMonthlyIncome() * 0.05) {
            rulesAchieved++;
        }

        // R74: Relación Saldo/Años de Antigüedad
        double requiredSavings = loan.getSavingsAccAge() < 24 ? loan.getAmount() * 0.20 : loan.getAmount() * 0.10;
        if (loan.getAmountSavingsAcc() >= requiredSavings) {
            rulesAchieved++;
        }

        // R75: Retiros Recientes
        if (!loan.isRecentWithdrawal() || loan.getRecentWithdrawalAmount() < loan.getAmountSavingsAcc() * 0.30) {
            rulesAchieved++;
        }

        loan.setRulesAchieved(rulesAchieved);
    }

    private void calculateFinalApplicantAge(loanEntity loan, userEntity user) {
        // Convertir el plazo del préstamo de meses a años y sumar a la edad actual del usuario
        int termYears = loan.getTermMonths() / 12;
        int finalAge = user.getAge() + termYears;
        loan.setFinalApplicantAge(finalAge);

        // Evaluar la edad final del solicitante
        if (finalAge >= 70) {
            loan.setAgeEvaluation("Rechazado");
        } else {
            loan.setAgeEvaluation("Aprobado");
        }
    }

    public List<loanEntity> getLoansByRut(String rut) {
        return LoanRepository.findByRut(rut);
    }

    private void calculateDebtToIncomeRatio(loanEntity loan) {
        if (loan.getMonthlyIncome() > 0) {
            double ratio = (loan.getMonthlyPayment() / loan.getMonthlyIncome()) * 100.0 * 0.001;
            loan.setDebtToIncomeRatio(ratio);
        } else {
            loan.setDebtToIncomeRatio(0);
        }
    }

    public List<loanEntity> getAllLoans() {
        return LoanRepository.findAll();
    }
}
