package com.example.proyecto_tingeso.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;

@Entity
@Data
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class userEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String name;
    private String rut;
    private String category;
    private String email;
    private String password;
    private int age;
    private String sexo;
    private String phoneNumber;
    private String idFront;
    private String idBack;
    private String income;

    @Column(name = "state", nullable = false)
    private String state = "EV"; // Valor predeterminado al crear el usuario
}

/*
    Category:
    - E = Employee
    - C = Client

    State:
    - EV = En evaluación
    - V = Validado
    - R = Rechazado
 */
