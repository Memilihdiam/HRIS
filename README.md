# WEB BASED HUMAN RESOURCE INFORMATION SYSTEM (HRIS)
Human Resource Information System 

# COMPANY STRUCTURE
## Departments
```bash
| Department                | Code |
| ------------------------- | ---- |
| Management                | MG   |
| Procurement               | PR   |
| Sales                     | SL   |
| Business Development      | BD   |
| Tender                    | TD   |
| Project Management        | PM   |
| Operations                | OP   |
| Logistics                 | LG   |
| Warehouse                 | WH   |
| Supply Chain              | SC   |
| Finance                   | FN   |
| Accounting                | AC   |
| Finance & Accounting      | FA   |
| Human Resources           | HR   |
| General Affairs           | GA   |
| HR & GA                   | HG   |
| Legal                     | LE   |
| Compliance                | CP   |
| Quality Assurance         | QA   |
| Quality Control           | QC   |
| Information Technology    | IT   |
| Customer Service          | CS   |
| Health Safety Environment | HS   |
```

## Positions
```bash
| Position          | Code | Level |
| ----------------- |:----:|:-----:|
| Director          | DR   | 1     |
| General Manager   | GM   | 2     |
| Manager           | MG   | 3     |
| Assistant Manager | AM   | 4     |
| Supervisor        | SP   | 5     |
| Team Leader       | TL   | 6     |
| Coordinator       | CO   | 6     |
| Senior Staff      | SS   | 7     |
| Specialist        | SC   | 7     |
| Analyst           | AN   | 7     |
| Staff             | ST   | 8     |
| Officer           | OF   | 8     |
| Administrator     | AD   | 8     |
| Technician        | TC   | 8     |
| Operator          | OP   | 8     |
| Inspector         | IN   | 8     |
| Recruiter         | RC   | 8     |
| Accountant        | AC   | 8     |
| Storekeeper       | SK   | 8     |
| Junior Staff      | JS   | 9     |
| Intern            | IT   | 9     |
| Trainee           | TR   | 9     |

```

# PREPARATION
## Create Database

**TABLE: departments**
```sql
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_code VARCHAR(2) NOT NULL UNIQUE,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: positions**
```sql
CREATE TABLE positions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    position_code VARCHAR(2) NOT NULL UNIQUE,
    position_name VARCHAR(100) NOT NULL,
    level INT(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: department_position**
```sql
CREATE TABLE department_position (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_id BIGINT NOT NULL,
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
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
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

    position_id BIGINT NOT NULL,

    password VARCHAR(255) NOT NULL,

    image_path TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,

    INDEX idx_employee_position (position_id),

    CONSTRAINT fk_employees_position
        FOREIGN KEY (position_id)
        REFERENCES department_position(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: employment_status**
```sql
CREATE TABLE employment_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: employee_employment_status**
```sql
CREATE TABLE employee_employment_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    start_work DATE NOT NULL,
    end_work DATE DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_employees_status_id
        FOREIGN KEY (status_id)
        REFERENCES employment_status(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_employees_employment_id
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: roles**
```sql
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


**TABLE: permissions**
```sql
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_name VARCHAR(50) NOT NULL, -- cth: 'Vendor', 'Procurement', 'HR'
    permission_name VARCHAR(100) NOT NULL UNIQUE, -- cth: 'create_po', 'approve_payroll'
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: employee_roles**
```sql
CREATE TABLE employee_roles (
    employee_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (employee_id, role_id),
    CONSTRAINT fk_er_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_er_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: role_permissions**
```sql
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: payroll**
```sql
CREATE TABLE payroll (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    employee_id BIGINT NOT NULL,

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

    generated_by BIGINT NULL,

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

**TABLE: payment_status**
```sql
CREATE TABLE payment_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: chart_of_account**
```sql
CREATE TABLE chart_of_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_code VARCHAR(20) NOT NULL UNIQUE, -- cth: '1100' untuk Kas Bank, '4100' untuk Pendapatan
    account_name VARCHAR(100) NOT NULL,
    account_type ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE') NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_coa_type (account_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: journal_entries**
```sql
CREATE TABLE journal_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entry_number VARCHAR(50) NOT NULL UNIQUE, -- Nomor Bukti Jurnal
    entry_date DATE NOT NULL,
    reference_type VARCHAR(50) NULL, -- cth: 'INVOICE', 'BILL', 'PAYROLL'
    reference_id BIGINT NULL,
    description TEXT,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_journal_date (entry_date),
    CONSTRAINT fk_journal_created_by FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: journal_entriy_lines**
```sql
CREATE TABLE journal_entry_lines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    journal_entry_id BIGINT NOT NULL,
    account_id INT NOT NULL,
    debit BIGINT DEFAULT 0,
    credit BIGINT DEFAULT 0,
    description VARCHAR(255),
    
    CONSTRAINT fk_jel_journal FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
    CONSTRAINT fk_jel_account FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: invoices**
```sql
CREATE TABLE invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    project_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    
    subtotal BIGINT NOT NULL DEFAULT 0,
    tax_amount BIGINT DEFAULT 0,
    discount_amount BIGINT DEFAULT 0,
    grand_total BIGINT NOT NULL,
    
    payment_status ENUM('UNPAID', 'PARTIAL', 'PAID') DEFAULT 'UNPAID',
    status ENUM('DRAFT', 'SENT', 'CANCELLED') DEFAULT 'DRAFT',
    
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_inv_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT,
    CONSTRAINT fk_inv_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_inv_created_by FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: invoice_items**
```sql
CREATE TABLE invoice_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    item_description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price BIGINT NOT NULL,
    total_price BIGINT NOT NULL,
    
    CONSTRAINT fk_inv_item_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: vendor_bills**
```sql
CREATE TABLE vendor_bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE, -- Nomor Tagihan dari Vendor
    po_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    
    total_amount BIGINT NOT NULL,
    payment_status ENUM('UNPAID', 'PARTIAL', 'PAID') DEFAULT 'UNPAID',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_bill_po FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bill_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: transaction**
```sql
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_number VARCHAR(50) NOT NULL UNIQUE,
    transaction_date DATE NOT NULL,
    
    -- Polymorphic relationship to other tables like payroll, purchase_orders, etc.
    related_entity_type VARCHAR(50) NOT NULL COMMENT 'e.g., payroll, purchase_order', 
    related_entity_id BIGINT NOT NULL,
    
    amount BIGINT NOT NULL,
    type ENUM('DEBIT', 'CREDIT') NOT NULL,
    description TEXT,
    
    payment_status_id INT NOT NULL,
    processed_by BIGINT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_transaction_related_entity (related_entity_type, related_entity_id),
    INDEX idx_transaction_status (payment_status_id),
    INDEX idx_transaction_processed_by (processed_by),
    
    CONSTRAINT fk_transactions_payment_status
        FOREIGN KEY (payment_status_id)
        REFERENCES payment_status(id)
        ON UPDATE CASCADE,

    CONSTRAINT fk_transactions_processed_by
        FOREIGN KEY (processed_by)
        REFERENCES employees(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: items**
```sql
CREATE TABLE items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL, -- cth: 'Pcs', 'Box', 'Kg', 'Lisensi'
    base_price BIGINT NOT NULL DEFAULT 0,
    
    type ENUM('Goods', 'Service') NOT NULL DEFAULT 'Goods',
    status ENUM('Active', 'Archived') DEFAULT 'Active',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_item_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: purchase_request**
```sql
CREATE TABLE purchase_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pr_number VARCHAR(50) NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    requested_by BIGINT NOT NULL,
    
    request_date DATE NOT NULL,
    required_date DATE NOT NULL,
    
    status ENUM('Draft', 'Submitted', 'Manager_Approved', 'Finance_Approved', 'Rejected', 'Processed') DEFAULT 'Draft',
    total_estimated_value BIGINT DEFAULT 0,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_pr_status (status),
    CONSTRAINT fk_pr_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pr_requested_by FOREIGN KEY (requested_by) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: purchase_orders**
```sql
CREATE TABLE purchase_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,
    pr_id BIGINT NULL, -- Bisa NULL jika PO dibuat langsung tanpa PR
    vendor_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    
    po_date DATE NOT NULL,
    expected_delivery_date DATE NOT NULL,
    
    subtotal BIGINT NOT NULL,
    tax_amount BIGINT DEFAULT 0,
    shipping_cost BIGINT DEFAULT 0,
    grand_total BIGINT NOT NULL,
    
    status ENUM('Draft', 'Sent_to_Vendor', 'On_Delivery', 'Completed', 'Cancelled') DEFAULT 'Draft',
    payment_status ENUM('Unpaid', 'Partial', 'Paid') DEFAULT 'Unpaid',
    
    terms_and_conditions TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_po_status (status),
    CONSTRAINT fk_po_pr FOREIGN KEY (pr_id) REFERENCES purchase_requests(id) ON DELETE SET NULL,
    CONSTRAINT fk_po_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE RESTRICT,
    CONSTRAINT fk_po_created_by FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: po_items**
```sql
CREATE TABLE po_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    po_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    
    quantity INT NOT NULL,
    unit_price BIGINT NOT NULL,
    total_price BIGINT NOT NULL, -- quantity * unit_price
    
    received_quantity INT DEFAULT 0, -- Untuk tracking saat barang tiba di gudang
    
    CONSTRAINT fk_po_item_po FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_po_item_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: pr_items**
```sql
CREATE TABLE pr_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pr_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    
    requested_quantity INT NOT NULL,
    estimated_unit_price BIGINT DEFAULT 0,
    total_estimated BIGINT DEFAULT 0,
    
    notes VARCHAR(255),
    
    CONSTRAINT fk_pr_item_pr FOREIGN KEY (pr_id) REFERENCES purchase_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_pr_item_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: attendance**
```sql
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    employee_id BIGINT NOT NULL,
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

**TABLE: industries**
```sql
CREATE TABLE industries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
)
```

**TABLE: vendors**
```sql
CREATE TABLE vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_code VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    pic_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    npwp VARCHAR(30) UNIQUE,
    
    rating DECIMAL(3,2) DEFAULT 0.00, -- Range 0.00 - 5.00
    status ENUM('ACTIVE', 'SUSPENDED', 'BLACKLISTED') DEFAULT 'ACTIVE',
    
    created_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    
    INDEX idx_vendor_status (status),
    CONSTRAINT fk_vendors_created_by FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: clients**
```sql
CREATE TABLE clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_code VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    industry_id BIGINT NOT NULL,
    pic_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone_number VARCHAR(20) NOT NULL,
    address TEXT,
    
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_industry_id FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: projects**
```sql
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(50) NOT NULL UNIQUE,
    project_name VARCHAR(200) NOT NULL,
    client_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    contract_value DECIMAL(18, 2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_client_id FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: teams**
```sql
CREATE TABLE teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    team_code VARCHAR(20) NOT NULL UNIQUE,
    team_name VARCHAR(100) NOT NULL,

    team_leader_id BIGINT NULL,

    description TEXT,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_team_leader
        FOREIGN KEY (team_leader_id)
        REFERENCES employees(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: team_members**
```sql
CREATE TABLE team_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    team_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,

    role_in_team VARCHAR(50),

    join_date DATE,
    leave_date DATE NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_team_employee (
        team_id,
        employee_id
    ),

    CONSTRAINT fk_tm_team
        FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tm_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: project_teams**
```sql
CREATE TABLE project_teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,

    assigned_date DATE NOT NULL,
    released_date DATE NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_project_team (
        project_id,
        team_id
    ),

    CONSTRAINT fk_pt_project
        FOREIGN KEY (project_id)
        REFERENCES project(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pt_team
        FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Node Project Preparation
### Initial Node Project
Starting in terminal '*npm init -y*'
**NOTE : INSTALL NODE FIRST BEFORE USING THIS COMMAND LINE**
