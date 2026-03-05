import React, { useState, useEffect } from 'react';

function EmployeeForm({ employee, onSave, onCancel }) {
  const [form, setForm] = useState({
    employeeCode: '', name: '', email: '', phone: '', position: '', salary: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) setForm(employee);
  }, [employee]);

  const validate = () => {
    const newErrors = {};

    if (!form.employeeCode || !/^EMP[0-9]{3,6}$/.test(form.employeeCode))
      newErrors.employeeCode = 'Employee ID must be like EMP001 or EMP0001';

    if (!form.name || form.name.length < 2)
      newErrors.name = 'Name must be at least 2 characters';

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(form.email))
      newErrors.email = 'Enter a valid email (e.g. user@example.com)';

    if (!form.phone || !/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = 'Phone must be exactly 10 digits';

    if (!form.position || !/^[a-zA-Z\s]+$/.test(form.position))
      newErrors.position = 'Position must contain letters only';

    if (!form.salary || isNaN(form.salary) || Number(form.salary) < 0)
      newErrors.salary = 'Salary must be a positive number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ marginBottom: '20px' }}>
          {employee ? '✏️ Edit Employee' : '➕ Add Employee'}
        </h3>
        <form onSubmit={handleSubmit}>

          <label style={styles.label}>Employee ID</label>
          <input
            style={styles.input}
            name="employeeCode"
            placeholder="e.g. EMP001"
            value={form.employeeCode}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setForm({ ...form, employeeCode: val });
              setErrors({ ...errors, employeeCode: '' });
            }}
          />
          {errors.employeeCode && <p style={styles.error}>{errors.employeeCode}</p>}

          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            name="name"
            placeholder="e.g. Dinesh Kumar"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p style={styles.error}>{errors.name}</p>}

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            name="email"
            placeholder="e.g. user@example.com"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p style={styles.error}>{errors.email}</p>}

          <label style={styles.label}>Phone</label>
          <input
            style={styles.input}
            name="phone"
            placeholder="10 digits only (e.g. 9876543210)"
            maxLength="10"
            value={form.phone}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setForm({ ...form, phone: val });
              setErrors({ ...errors, phone: '' });
            }}
          />
          {errors.phone && <p style={styles.error}>{errors.phone}</p>}

          <label style={styles.label}>Position</label>
          <input
            style={styles.input}
            name="position"
            placeholder="e.g. Software Developer"
            value={form.position}
            onChange={(e) => {
              const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
              setForm({ ...form, position: val });
              setErrors({ ...errors, position: '' });
            }}
          />
          {errors.position && <p style={styles.error}>{errors.position}</p>}

          <label style={styles.label}>Salary (₹)</label>
          <input
            style={styles.input}
            name="salary"
            type="number"
            placeholder="e.g. 50000"
            value={form.salary}
            onChange={handleChange}
          />
          {errors.salary && <p style={styles.error}>{errors.salary}</p>}

          <div style={styles.buttons}>
            <button type="submit" style={styles.saveBtn}>
              {employee ? 'Update' : 'Save'}
            </button>
            <button type="button" style={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white', padding: '32px',
    borderRadius: '12px', width: '420px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    maxHeight: '90vh', overflowY: 'auto',
  },
  label: {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#374151', marginBottom: '4px',
  },
  input: {
    width: '100%', padding: '10px', marginBottom: '4px',
    border: '1px solid #ddd', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box',
  },
  error: {
    color: 'red', fontSize: '12px', marginBottom: '10px', marginTop: '0px',
  },
  buttons: { display: 'flex', gap: '12px', marginTop: '16px' },
  saveBtn: {
    flex: 1, padding: '10px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '15px',
  },
  cancelBtn: {
    flex: 1, padding: '10px', backgroundColor: '#e5e7eb',
    color: '#333', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '15px',
  },
};

export default EmployeeForm;