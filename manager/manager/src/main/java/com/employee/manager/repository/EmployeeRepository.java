package com.employee.manager.repository;

import com.employee.manager.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT e FROM Employee e WHERE e.deletedAt IS NULL")
    Page<Employee> findAllActive(Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.deletedAt IS NULL AND e.id = :id")
    Employee findActiveById(Long id);

    @Query("SELECT e FROM Employee e WHERE e.deletedAt IS NULL AND " +
            "(LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Employee> searchEmployees(String keyword, Pageable pageable);

    boolean existsByEmail(String email);
    boolean existsByEmployeeCode(String employeeCode);
}