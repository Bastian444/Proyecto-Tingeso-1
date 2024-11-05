package com.example.proyecto_tingeso.controllers;

import com.example.proyecto_tingeso.entities.userEntity;
import com.example.proyecto_tingeso.services.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin("*")
public class userController {
    @Autowired
    userService UserService;

    @GetMapping("/")
    public ResponseEntity<List<userEntity>> listUsers() {
        List<userEntity> userEntities = UserService.getUsers();
        return ResponseEntity.ok(userEntities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<userEntity> getUserById(@PathVariable Long id) {
        userEntity user = UserService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/")
    public ResponseEntity<userEntity> addUser(@RequestBody userEntity user) {
        userEntity userNew = UserService.saveUser(user);
        return ResponseEntity.ok(userNew);
    }

    @PutMapping("/")
    public ResponseEntity<userEntity> updateUser(@RequestBody userEntity user) {
        userEntity userUpdated = UserService.updateUser(user);
        return ResponseEntity.ok(userUpdated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteUserById(@PathVariable Long id) throws Exception {
        var isDeleted = UserService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String rut = credentials.get("rut");
        String password = credentials.get("password");

        userEntity user = UserService.getUserByRut(rut);
        if (user != null && user.getPassword().equals(password)) {
            Map<String, String> response = new HashMap<>();
            response.put("name", user.getName());
            response.put("rut", user.getRut());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<List<userEntity>> getUsersByState(@PathVariable String state) {
        List<userEntity> users = UserService.getUsersByState(state);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserState(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String state = request.get("state");
        userEntity user = UserService.getUserById(id);
        if (user != null) {
            user.setState(state);
            UserService.saveUser(user);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    @GetMapping("/state/rut/{rut}")
    public ResponseEntity<String> getUserStateByRut(@PathVariable String rut) {
        String state = UserService.getUserStateByRut(rut);
        return (state != null)
                ? ResponseEntity.ok(state)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Estado de cuenta no encontrado");
    }
}
