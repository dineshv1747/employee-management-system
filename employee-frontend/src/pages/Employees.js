import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import EmployeeForm from '../components/EmployeeForm';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => { fetchEmployees(); }, [page]);

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAll(page);
      setEmployees(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim()) {
      try {
        const res = await employeeAPI.search(e.target.value);
        setEmployees(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setEmployees([]);
      }
    } else {
      fetchEmployees();
    }
  };

  const handleSave = async (form) => {
    try {
      if (editEmployee) {
        await employeeAPI.update(editEmployee.id, form);
      } else {
        await employeeAPI.create(form);
      }
      setShowForm(false);
      setEditEmployee(null);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  const handleEdit = (emp) => {
    setEditEmployee(emp);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        fetchEmployees();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete employee');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>👥 Employees</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={styles.addBtn}
            onClick={() => { setEditEmployee(null); setShowForm(true); }}>
            + Add Employee
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <input
        style={styles.search}
        placeholder="🔍 Search by name or email..."
        value={search}
        onChange={handleSearch}
      />

      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Emp ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Position</th>
            <th style={styles.th}>Salary</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="7" style={styles.noData}>
                {search
                  ? `❌ No employee found with "${search}"`
                  : '📋 No employees yet. Click + Add Employee to get started!'}
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.id} style={styles.row}>
                <td style={styles.td}>{emp.employeeCode}</td>
                <td style={styles.td}>{emp.name}</td>
                <td style={styles.td}>{emp.email}</td>
                <td style={styles.td}>{emp.phone}</td>
                <td style={styles.td}>{emp.position}</td>
                <td style={styles.td}>₹{emp.salary?.toLocaleString()}</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(emp)}>
                    ✏️ Edit
                  </button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(emp.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={styles.pagination}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}
          style={styles.pageBtn}>← Prev</button>
        <span style={{ fontWeight: '600' }}>
          Page {page + 1} of {totalPages || 1}
        </span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
          style={styles.pageBtn}>Next →</button>
      </div>

      {showForm && (
        <EmployeeForm
          employee={editEmployee}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditEmployee(null); }}
        />
      )}
    </div>
  );
}

const styles = {
  container: { padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '20px',
  },
  search: {
    width: '100%', padding: '10px 16px', marginBottom: '20px',
    border: '1px solid #ddd', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box',
  },
  table: {
    width: '100%', borderCollapse: 'collapse',
    backgroundColor: 'white', borderRadius: '12px',
    overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  thead: { backgroundColor: '#4f46e5', color: 'white' },
  th: { padding: '14px 12px', textAlign: 'center', fontWeight: '600' },
  row: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 8px', textAlign: 'center' },
  noData: { textAlign: 'center', padding: '50px', color: '#888', fontSize: '16px' },
  addBtn: {
    padding: '10px 20px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px',
  },
  logoutBtn: {
    padding: '10px 20px', backgroundColor: '#ef4444',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px',
  },
  editBtn: {
    padding: '6px 12px', backgroundColor: '#f59e0b',
    color: 'white', border: 'none', borderRadius: '6px',
    cursor: 'pointer', marginRight: '6px',
  },
  deleteBtn: {
    padding: '6px 12px', backgroundColor: '#ef4444',
    color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer',
  },
  pagination: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', gap: '16px', marginTop: '20px',
  },
  pageBtn: {
    padding: '8px 16px', border: '1px solid #ddd',
    borderRadius: '8px', cursor: 'pointer', backgroundColor: 'white',
  },
};

export default Employees;