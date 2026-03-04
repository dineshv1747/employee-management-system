package com.employee.manager.dto;

import lombok.Data;

@Data
public class EmployeeResponse {
    private Long id;
    private String employeeCode;
    private String name;
    private String email;
    private String phone;
    private String position;
    private Double salary;
}