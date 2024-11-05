package com.example.proyecto_tingeso.services;

import com.example.proyecto_tingeso.entities.userEntity;
import com.example.proyecto_tingeso.repositories.userRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class userServiceTest {

    @Mock
    private userRepository UserRepository;

    @InjectMocks
    private userService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUsers() {
        userEntity user1 = new userEntity();
        userEntity user2 = new userEntity();
        when(UserRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        List<userEntity> users = userService.getUsers();

        assertEquals(2, users.size());
        verify(UserRepository, times(1)).findAll();
    }

    @Test
    void testSaveUserWithState() {
        userEntity user = new userEntity();
        user.setState("AP");
        when(UserRepository.save(user)).thenReturn(user);

        userEntity savedUser = userService.saveUser(user);

        assertEquals("AP", savedUser.getState());
        verify(UserRepository, times(1)).save(user);
    }

    @Test
    void testSaveUserWithoutState() {
        userEntity user = new userEntity();
        when(UserRepository.save(user)).thenReturn(user);

        userEntity savedUser = userService.saveUser(user);

        assertEquals("EV", savedUser.getState());
        verify(UserRepository, times(1)).save(user);
    }

    @Test
    void testGetUserById() {
        userEntity user = new userEntity();
        when(UserRepository.findById(1L)).thenReturn(Optional.of(user));

        userEntity foundUser = userService.getUserById(1L);

        assertNotNull(foundUser);
        verify(UserRepository, times(1)).findById(1L);
    }

    @Test
    void testGetUserByRut() {
        userEntity user = new userEntity();
        when(UserRepository.findByRut("12345678-9")).thenReturn(user);

        userEntity foundUser = userService.getUserByRut("12345678-9");

        assertNotNull(foundUser);
        verify(UserRepository, times(1)).findByRut("12345678-9");
    }

    @Test
    void testUpdateUser() {
        userEntity user = new userEntity();
        when(UserRepository.save(user)).thenReturn(user);

        userEntity updatedUser = userService.updateUser(user);

        assertNotNull(updatedUser);
        verify(UserRepository, times(1)).save(user);
    }

    @Test
    void testDeleteUserByIdSuccess() throws Exception {
        doNothing().when(UserRepository).deleteById(1L);

        boolean result = userService.deleteUserById(1L);

        assertTrue(result);
        verify(UserRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteUserByIdFailure() {
        doThrow(new RuntimeException("Error deleting")).when(UserRepository).deleteById(1L);

        Exception exception = assertThrows(Exception.class, () -> userService.deleteUserById(1L));

        assertEquals("Error deleting", exception.getMessage());
        verify(UserRepository, times(1)).deleteById(1L);
    }

    @Test
    void testGetUsersByState() {
        userEntity user = new userEntity();
        when(UserRepository.findByState("EV")).thenReturn(Arrays.asList(user));

        List<userEntity> users = userService.getUsersByState("EV");

        assertEquals(1, users.size());
        verify(UserRepository, times(1)).findByState("EV");
    }

    @Test
    void testGetUserStateByRut() {
        userEntity user = new userEntity();
        user.setState("AP");
        when(UserRepository.findByRut("12345678-9")).thenReturn(user);

        String state = userService.getUserStateByRut("12345678-9");

        assertEquals("AP", state);
        verify(UserRepository, times(1)).findByRut("12345678-9");
    }
}
