package com.example.proyecto_tingeso.services;

import com.example.proyecto_tingeso.entities.userEntity;
import com.example.proyecto_tingeso.repositories.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class userService {
    @Autowired
    userRepository UserRepository;

    public List<userEntity> getUsers() {
        return UserRepository.findAll();
    }

    public userEntity saveUser(userEntity user) {
        if (user.getState() == null || user.getState().isEmpty()) {
            user.setState("EV");
        }
        return UserRepository.save(user);
    }

    public userEntity getUserById(Long id) {
        return UserRepository.findById(id).orElse(null);
    }

    public userEntity getUserByRut(String rut) {
        return UserRepository.findByRut(rut);
    }

    public userEntity updateUser(userEntity user) {
        return UserRepository.save(user);
    }

    public boolean deleteUserById(Long id) throws Exception {
        try {
            UserRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public List<userEntity> getUsersByState(String state) {
        return UserRepository.findByState(state);
    }

    public String getUserStateByRut(String rut) {
        userEntity user = UserRepository.findByRut(rut);
        return (user != null) ? user.getState() : null;
    }
}
