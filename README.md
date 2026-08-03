# WEB BASED HUMAN RESOURCE INFORMATION SYSTEM (HRIS)
Human Resource Information System 

# PREPARATION
## Create Database
**TABLE: departments**
```sql
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_code VARCHAR(3) NOT NULL UNIQUE,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: positions**
```sql
CREATE TABLE positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    position_code VARCHAR(3) NOT NULL UNIQUE,
    position_name VARCHAR(100) NOT NULL,
    basic_salary BIGINT NOT NULL,
    allowance BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_positions_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    UNIQUE KEY uk_department_position (
        department_id,
        position_name
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: employees**
```sql
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(20) NOT NULL UNIQUE,

    department_sequence_join INT(3) NOT NULL,
    position_sequence_join INT(3) NOT NULL,

    name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female') DEFAULT NULL,
    address TEXT,
    date_of_birth DATE,

    email VARCHAR(255) NOT NULL UNIQUE,
    telephone_number VARCHAR(20),

    bank_name VARCHAR(100),
    account_number VARCHAR(30),

    join_date DATE NOT NULL,

    department_id INT NOT NULL,
    position_id INT NOT NULL,

    employment_status ENUM(
        'Tetap',
        'Kontrak',
        'Magang'
    ) NOT NULL DEFAULT 'Tetap',

    role ENUM(
        'Employee',
        'Manager',
        'Admin'
    ) NOT NULL DEFAULT 'Employee',

    ptkp_status ENUM(
        'TK/0',
        'TK/1',
        'TK/2',
        'TK/3',
        'K/0',
        'K/1',
        'K/2',
        'K/3',
        'K/I/0',
        'K/I/1',
        'K/I/2',
        'K/I/3'
    ) DEFAULT 'TK/0',

    password VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,

    INDEX idx_employee_department (department_id),
    INDEX idx_employee_position (position_id),

    CONSTRAINT fk_employees_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_employees_position
        FOREIGN KEY (position_id)
        REFERENCES positions(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: payroll**
```sql
CREATE TABLE payroll (
    id INT AUTO_INCREMENT PRIMARY KEY,

    employee_id INT NOT NULL,

    payroll_month TINYINT NOT NULL,
    payroll_year YEAR NOT NULL,

    basic_salary BIGINT DEFAULT 0,
    allowance BIGINT DEFAULT 0,
    bonus BIGINT DEFAULT 0,
    overtime_pay BIGINT DEFAULT 0,
    deduction BIGINT DEFAULT 0,
    tax BIGINT DEFAULT 0,
    bpjs BIGINT DEFAULT 0,

    total_salary BIGINT NOT NULL,

    payment_date DATE,

    payment_status ENUM(
        'Pending',
        'Review',
        'Approve',
        'Paid',
        'Cancelled'
    ) DEFAULT 'Pending',

    generated_by INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_payroll_employee (employee_id),
    INDEX idx_payroll_generated_by (generated_by),

    UNIQUE KEY uk_payroll_period (
        employee_id,
        payroll_month,
        payroll_year
    ),

    CONSTRAINT fk_payroll_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_payroll_generated_by
        FOREIGN KEY (generated_by)
        REFERENCES employees(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: attendance**
```sql
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,

    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,

    check_in TIME NULL,
    check_out TIME NULL,

    late_minutes INT DEFAULT 0,
    early_leave_minutes INT DEFAULT 0,

    status ENUM(
        'Hadir',
        'Izin',
        'Sakit',
        'Alpha',
        'Libur'
    ) DEFAULT 'Alpha',

    work_hours DECIMAL(5,2) DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_attendance_employee (employee_id),

    UNIQUE KEY uk_attendance_employee_date (
        employee_id,
        attendance_date
    ),

    CONSTRAINT fk_attendance_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Node Project Preparation
### Initial Node Project
Starting in terminal '*npm init -y*'
**NOTE : INSTALL NODE FIRST BEFORE USING THIS COMMAND LINE**

