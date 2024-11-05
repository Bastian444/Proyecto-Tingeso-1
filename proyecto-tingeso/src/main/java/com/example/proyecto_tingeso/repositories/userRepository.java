package com.example.proyecto_tingeso.repositories;

import com.example.proyecto_tingeso.entities.userEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface userRepository extends JpaRepository<userEntity, Long> {
    public userEntity findByRut(String rut);
    List<userEntity> findByCategory(String category);
    List<userEntity> findByAgeGreaterThan(int age);

    // Método para encontrar usuarios por estado
    List<userEntity> findByState(String state);

    @Query(value = "SELECT * FROM users WHERE users.rut = :rut", nativeQuery = true)
    userEntity findByRutNative(@Param("rut") String rut);
}
