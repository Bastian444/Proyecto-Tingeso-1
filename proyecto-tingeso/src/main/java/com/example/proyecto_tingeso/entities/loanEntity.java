package com.example.proyecto_tingeso.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "loans")
public class loanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rut;
    private Date date;
    private float amount;  // Monto del préstamo solicitado
    private String type;   // Tipo de préstamo
    private String state;  // Estado del préstamo
    private double monthlyPayment;
    private double monthlyIncome;
    private double interest;
    private double debtToIncomeRatio;
    private int termMonths;
    private Boolean inDicom;
    private double debtUser;   // Monto de la deuda del usuario
    private int workYears;     // Antigüedad laboral en meses
    private double propertyValue; // Valor total de la propiedad

    // Nuevos atributos relacionados con ahorro y depósitos
    private double amountSavingsAcc;  // Saldo en cuenta de ahorros
    private int recentDepositAmount;  // Suma de depósitos en los últimos 12 meses
    private int savingsAccAge;        // Antigüedad de la cuenta de ahorros en meses
    private boolean significantWithdrawal; // Indicador si hubo retiro significativo (últimos 12 meses)
    private double withdrawalAmount;  // Monto del retiro significativo (si aplica)
    private boolean recentWithdrawal; // Indicador si hubo retiro reciente (últimos 6 meses)
    private double recentWithdrawalAmount; // Monto del retiro reciente (si aplica)
    private int rulesAchieved;        // Contador de reglas cumplidas
    private double maxFinancingAmount; // Monto máximo de financiamiento calculado

    @Transient
    private String ageEvaluation;

    @Transient
    private Integer finalApplicantAge;

    @Transient
    private String debtEvaluation;

    @Transient
    private String workEvaluation;

    public loanEntity(String rut, Date date, float amount, String type, String state, double monthlyPayment,
                      double monthlyIncome, double interest, int termMonths, Boolean inDicom, double debtUser,
                      int workYears, double propertyValue, double amountSavingsAcc, int recentDepositAmount,
                      int savingsAccAge, boolean significantWithdrawal, double withdrawalAmount, boolean recentWithdrawal,
                      double recentWithdrawalAmount, int rulesAchieved, double maxFinancingAmount) {
        this.rut = rut;
        this.date = date;
        this.amount = amount;
        this.type = type;
        this.state = state;
        this.monthlyPayment = monthlyPayment;
        this.monthlyIncome = monthlyIncome;
        this.interest = interest;
        this.termMonths = termMonths;
        this.inDicom = inDicom;
        this.debtUser = debtUser;
        this.workYears = workYears;
        this.propertyValue = propertyValue;
        this.amountSavingsAcc = amountSavingsAcc;
        this.recentDepositAmount = recentDepositAmount;
        this.savingsAccAge = savingsAccAge;
        this.significantWithdrawal = significantWithdrawal;
        this.withdrawalAmount = withdrawalAmount;
        this.recentWithdrawal = recentWithdrawal;
        this.recentWithdrawalAmount = recentWithdrawalAmount;
        this.rulesAchieved = rulesAchieved;
        this.maxFinancingAmount = maxFinancingAmount;
    }

    // Método para calcular las reglas de evaluación
    public void evaluateRules() {
        // R71: Saldo mínimo requerido (al menos el 10% del monto del préstamo)
        if (amountSavingsAcc >= 0.1 * amount) {
            rulesAchieved++;
        }

        // R72: Historial de ahorro consistente (sin retiros significativos > 50% del saldo)
        if (!significantWithdrawal || withdrawalAmount < 0.5 * amountSavingsAcc) {
            rulesAchieved++;
        }

        // R73: Depósitos periódicos (al menos el 5% de los ingresos mensuales en depósitos)
        if (recentDepositAmount >= 0.05 * monthlyIncome) {
            rulesAchieved++;
        }

        // R74: Relación saldo/años de antigüedad
        if ((savingsAccAge < 24 && amountSavingsAcc >= 0.2 * amount) ||
                (savingsAccAge >= 24 && amountSavingsAcc >= 0.1 * amount)) {
            rulesAchieved++;
        }

        // R75: Retiros recientes (no más del 30% del saldo en los últimos 6 meses)
        if (!recentWithdrawal || recentWithdrawalAmount < 0.3 * amountSavingsAcc) {
            rulesAchieved++;
        }
    }

    // Método para calcular el monto máximo de financiamiento
    public void calculateMaxFinancingAmount() {
        switch (type) {
            case "FV":
                maxFinancingAmount = propertyValue * 0.80;
                break;
            case "SV":
                maxFinancingAmount = propertyValue * 0.70;
                break;
            case "PC":
                maxFinancingAmount = propertyValue * 0.60;
                break;
            case "R":
                maxFinancingAmount = propertyValue * 0.50;
                break;
            default:
                maxFinancingAmount = 0;
                break;
        }
    }
}
