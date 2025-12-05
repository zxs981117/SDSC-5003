# CityU Campus Used Trading Platform (Spring Boot)

A comprehensive Second-hand Trading Platform designed for university campuses. This web application allows students to publish, search, and purchase used goods. It is built using **Spring Boot** for the backend, **MyBatis** for data persistence, and **Thymeleaf** for server-side rendering.

## 📋 Table of Contents
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Technologies & Dependencies](#-technologies--dependencies)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [How to Run](#-how-to-run)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features
* **User System**: Login, Registration, Personal Center, Password Management.
* **Goods Management**: Publish items, Edit items, Delete items, View details.
* **Browsing**: Homepage recommendations, Categorized viewing, Search functionality.
* **Transactions**: Shopping Cart, Order generation, Order history.
* **Message System**: Leave comments/messages on items.

---

## 📂 Project Structure

The project follows the standard Maven directory structure:

```text
Used-Trading-Platform2/
├── src/
│   ├── main/
│   │   ├── java/com/wsk/
│   │   │   ├── controller/    # Web Layer (Handles HTTP requests)
│   │   │   ├── service/       # Business Logic Layer
│   │   │   ├── dao/           # Data Access Layer (MyBatis Interfaces)
│   │   │   ├── bean/          # Entity classes (Database Tables)
│   │   │   └── SecondHandTradingApplication.java  # Main Start Class
│   │   │
│   │   └── resources/
│   │       ├── mapper/        # MyBatis XML Mappers (SQL queries)
│   │       ├── static/        # Static assets (CSS, JS, Images, Uploads)
│   │       ├── templates/     # Thymeleaf HTML Views
│   │       └── application.properties  # Database & Server Configuration
│   │
│   └── test/                  # Unit Tests
├── c2c.sql                    # Database Initialization Script (Import this!)
├── pom.xml                    # Project Dependencies (Maven)
└── README.md                  # Documentation
