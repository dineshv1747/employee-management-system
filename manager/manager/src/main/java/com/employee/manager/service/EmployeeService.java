package com.employee.manager.service;

import com.employee.manager.dto.*;
import com.employee.manager.entity.Employee;
import com.employee.manager.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new RuntimeException("Employee ID already exists");
        }
        Employee employee = new Employee();
        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setPosition(request.getPosition());
        employee.setSalary(request.getSalary());
        employee = employeeRepository.save(employee);
        return mapToResponse(employee);
    }

    public Page<EmployeeResponse> getAllEmployees(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return employeeRepository.findAllActive(pageable).map(this::mapToResponse);
    }

    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findActiveById(id);
        if (employee == null) throw new RuntimeException("Employee not found");
        return mapToResponse(employee);
    }

    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findActiveById(id);
        if (employee == null) throw new RuntimeException("Employee not found");
        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setPosition(request.getPosition());
        employee.setSalary(request.getSalary());
        employee.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(employeeRepository.save(employee));
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findActiveById(id);
        if (employee == null) throw new RuntimeException("Employee not found");
        employee.setDeletedAt(LocalDateTime.now());
        employeeRepository.save(employee);
    }

    public Page<EmployeeResponse> searchEmployees(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return employeeRepository.searchEmployees(keyword, pageable).map(this::mapToResponse);
    }

    private EmployeeResponse mapToResponse(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setEmployeeCode(employee.getEmployeeCode());
        response.setName(employee.getName());
        response.setEmail(employee.getEmail());
        response.setPhone(employee.getPhone());
        response.setPosition(employee.getPosition());
        response.setSalary(employee.getSalary());
        return response;
    }
}