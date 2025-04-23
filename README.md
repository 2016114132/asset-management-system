
# Asset Management System

A full-featured asset tracking and management web application built with Node.js, Express, EJS, and PostgreSQL. This system allows users to manage assets, categories, employees, campuses, asset transfers, and requests. It includes dynamic reports and permission-based access control.

---

## Features

- **Dashboard**
  - Shows today’s date and asset statistics
  - Quick Actions panel for common tasks

- **Assets**
  - Add, view, edit, and delete assets
  - Categorize assets and associate them with campuses

- **Categories**
  - Manage asset types for structured classification

- **Asset Requests**
  - Submit and manage new, replacement, repair, and disposal requests
  - Approval and denial workflows for requests

- **Transfers**
  - Track and manage asset transfers across campuses or employees
  - Transfer status control with restrictions on finalized records

- **Employees**
  - Maintain employee directory with department and status info

- **Campuses**
  - Create and manage campus locations for asset tracking

- **Reports**
  - Generate dynamic reports with filters and summaries
  - Export report data to PDF, CSV, or Excel

- **User and Role Management**
  - Manage system users and their assigned roles
  - Set specific permissions per system module

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/2016114132/asset-management-system.git
```

```bash
cd asset-management-system
```

### 2. Install Dependencies

```bash
npm install
```

---

## PostgreSQL Database Setup (Step-by-Step)

### ✅ A. Install PostgreSQL

Follow the instructions for your OS:

- **Linux**:  
  ```bash
  sudo apt install postgresql
  ```

- **macOS (Homebrew)**:  
  ```bash
  brew install postgresql@17
  ```

Then verify the installation:
```bash
psql --version
```

### ✅ B. Create Database and User

Login to PostgreSQL:

- **Linux**:  
  ```bash
  sudo -u postgres psql
  ```

- **macOS**:  
  ```bash
  psql -U postgres
  ```

Then run the following commands:

- Create a new database
  ```sql
  CREATE DATABASE "asset-management-system-db";
  ```
- Create a new role (user)
  ```sql
  CREATE ROLE developer WITH LOGIN PASSWORD 'root';
  ```

- Grant privileges
  ```sql
  ALTER DATABASE "asset-management-system-db" OWNER TO developer;
  ```
  ```sql
  GRANT CREATE ON DATABASE "asset-management-system-db" TO developer;
  ```

Exit with:
```sql
\q
```

## Running the App
**Note:** Make sure you are inside the application's folder.

Run the following command to run Migrations and Seed test data:
```bash
npm run migrate
```

Start the application:
```bash
npm start
```

Then open:  
[http://localhost:3000](http://localhost:3000)

---
