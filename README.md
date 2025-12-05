# Campus Used Trading Platform (Spring Boot)

A web-based Second-hand Trading Platform designed for university campuses. This project allows students to buy and sell used goods conveniently. It is built using **Spring Boot** and utilizes **MyBatis** for data access and **Thymeleaf** for the frontend.

## ✨ Features
* **User Authentication**: Token-based login system.
* **Goods Management**: Publish, edit, and delete trading items.
* **Browsing & Search**: Search functionality and categorized listings.
* **Global Error Handling**: Centralized exception handling.
* **AOP Logging/Transaction**: Aspect-Oriented Programming support.

---

## 📂 Project Structure

```text
SDSC-5003/
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
├── target/                    # [Auto-Generated] Maven Build Output
│   ├── classes/               # Compiled bytecode & resources
│   └── generated-sources/
├── .gitignore
└── README.md
````

-----

## 🛠 Tech Stack

  * **Language**: Java 8+
  * **Framework**: Spring Boot
  * **Database**: MySQL 5.7
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
git clone [https://github.com/zxs981117/SDSC-5003.git](https://github.com/zxs981117/SDSC-5003.git)
```

### 2\. Database Initialization (GUI Tool Recommended)

It is recommended to use graphical tools like **Navicat** or **DBeaver** for easier operation.

1.  **Connect to Database**:
    * Open Navicat or DBeaver and connect to your local MySQL server.

2.  **Create New Database**:
    * **Name**: `c2c` (Default recommendation)
    * **Character Set**: Select `utf8mb4` (Supports Chinese characters and emojis)
    * **Collation**: Select `utf8mb4_general_ci`
    * Execute creation.

3.  **Import Data**:
    * Select the newly created `c2c` database.
    * Choose **"Execute SQL File"** (Navicat) or **"Execute Script"** (DBeaver).
    * Select the file located in the project directory: `SQL/c2c.sql`.
    * Click Start and wait for the import to complete (Refresh the tables to verify data).

### 3\. Application Configuration

Open `src/main/resources/application.yml`.
Modify the database connection settings to match your local environment:

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/c2c?characterEncoding=utf8&useUnicode=true
    username: root          # Change to your MySQL username
    password: your_password # Change to your MySQL password
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


## License
This project is open source.
