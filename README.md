# Campus Used Trading Platform (Spring Boot)

A web-based Second-hand Trading Platform designed for university campuses. This project allows students to buy and sell used goods conveniently. It is built using **Spring Boot** and utilizes **MyBatis** for data access and **Thymeleaf** for the frontend.

## 📋 Table of Contents
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [How to Run](#-how-to-run)
- [Configuration](#-configuration)

---

## ✨ Features
* **User Authentication**: Token-based login system (implied by `token` package).
* **Goods Management**: Publish, edit, and delete trading items.
* **Browsing & Search**: Search functionality and categorized listings.
* **Global Error Handling**: Centralized exception handling (`error` and `handle` packages).
* **AOP Logging/Transaction**: Aspect-Oriented Programming support (`aspect` package).

---

## 📂 Project Structure

```text
Used-Trading-Platform/
├── SQL/
│   └── c2c.sql                # Database initialization script
├── src/main/
│   ├── java/com/wsk/
│   │   ├── aspect/            # AOP (Aspect Oriented Programming)
│   │   ├── bean/              # JavaBean / DTOs
│   │   ├── config/            # Spring Configuration classes
│   │   ├── controller/        # Web Controllers (API endpoints)
│   │   ├── dao/               # MyBatis Mapper Interfaces
│   │   ├── error/             # Error definitions
│   │   ├── handle/            # Global Exception Handlers
│   │   ├── pojo/              # Database Entity classes
│   │   ├── response/          # Standard Response Wrappers
│   │   ├── service/           # Business Logic Layer
│   │   ├── token/             # Token/Authentication logic
│   │   ├── tool/              # Utility classes
│   │   └── UsedTradingPlatformApplication.java  # Main Start Class
│   │
│   └── resources/
│       ├── mapping/           # MyBatis XML Mappers
│       ├── mystatic/          # Static assets (CSS, JS, Images)
│       ├── templates/         # Thymeleaf HTML Views
│       └── application.yml    # Main Configuration File
├── .gitignore
└── README.md
````

-----

## 🛠 Tech Stack

  * **Language**: Java 8+
  * **Framework**: Spring Boot
  * **Database**: MySQL 5.7 / 8.0
  * **ORM**: MyBatis
  * **Frontend**: Thymeleaf, HTML, CSS, JavaScript
  * **Build Tool**: Maven

-----

## ⚙️ Prerequisites

Before running the project, make sure you have:

1.  **JDK 1.8** or higher installed.
2.  **MySQL** server running.
3.  **Maven** installed (or use the IDE's built-in Maven).
4.  An IDE like **IntelliJ IDEA** or Eclipse.

-----

## 🚀 Installation & Setup

### 1\. Clone the Repository

```bash
git clone [https://github.com/wsk1103/Used-Trading-Platform2.git](https://github.com/wsk1103/Used-Trading-Platform2.git)
```

### 2\. Database Initialization

1.  Create a MySQL database (default name is usually `c2c` or `used_trading_platform`).
    ```sql
    CREATE DATABASE c2c DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
    ```
2.  Run the SQL script located at **`SQL/c2c.sql`** to create tables and import data.

### 3\. Application Configuration

Open `src/main/resources/application.yml`.
Modify the database connection settings to match your local environment:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/c2c?useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
    username: root          # Change to your MySQL username
    password: your_password # Change to your MySQL password
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis:
  mapper-locations: classpath:mapping/*.xml  # Points to XML mappers
```

-----

## ▶️ How to Run

### Option 1: Using IntelliJ IDEA (Recommended)

1.  Open the project directory.
2.  Wait for Maven to download dependencies.
3.  Locate `src/main/java/com/wsk/UsedTradingPlatformApplication.java`.
4.  Right-click and select **Run 'UsedTradingPlatformApplication'**.

### Option 2: Using Command Line

```bash
mvn spring-boot:run
```

Once started, access the application at:

  * **http://localhost:8080** (or the port defined in `application.yml`)

-----

## ❓ Troubleshooting

  * **Static Resources 404**:
    Since the static folder is named `mystatic`, ensure your Spring Boot configuration (or `WebMvcConfig`) correctly maps static resource paths to `classpath:/mystatic/`.

  * **Database Connection Failed**:
    Double-check the `url`, `username`, and `password` in `application.yml`.

-----

**License**
This project is open source.

```
```
