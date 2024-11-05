package com.example.proyecto_tingeso.repositories;

import com.example.proyecto_tingeso.entities.loanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface loanRepository extends JpaRepository<loanEntity, Long> {

    public List<loanEntity> findByRut(String rut);

    @Query(value = "SELECT * FROM loans WHERE loans.rut = :rut", nativeQuery = true)
    loanEntity findByRutNative(@Param("rut") String rut);

    @Query(value = "SELECT * FROM loans WHERE loans.id = :id", nativeQuery = true)
    loanEntity findById(@Param("id") long id);
}
