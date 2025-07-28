# Oglasnik – Full-Stack Web Application Projects

This repository hosts a comprehensive full-stack web application for a classified ads platform, developed to fulfill the requirements of two separate university courses:

- **IT355 - Web Systems 2:** Implemented with a **Java & Spring Boot** backend.
- **CS310 - Scripting Languages in Web Development:** Implemented with a **Node.js & Express.js** backend.

The project uniquely features **two distinct backend implementations** for a single, shared React frontend, demonstrating and comparing two of the most popular web development ecosystems. The application allows users to register, post, search, and manage ads, while administrators have advanced privileges to manage all data within the system.

![Showcase 1](./showcase/1.png)

---

## 🚀 Key Features

The core functionalities are consistent across both backend implementations, ensuring a seamless user experience regardless of the running server.

### 👤 User Features

- **Authentication:** Secure user registration and login using JWT (JSON Web Token) with password hashing.
- **Ad Browsing:** Paginated and searchable list of all active ads.
- **Filtering & Sorting:** Ability to filter ads by keyword and category, and sort results by date.
- **Detailed View:** A page showing all details of an individual ad, including images and owner information.
- **Create Ad:** A form for posting new ads with multiple image uploads.
- **Manage Own Ads:** Users can view, edit, and delete only the ads they have posted themselves.

### 🔧 Admin Features

- **Admin Panel:** Centralized dashboard for managing users, categories, and system logs.
- **User Management:** Admins can view and delete any user account.
- **Category Management:** Admins can add and delete ad categories.
- **"God Mode":** Admins have the ability to edit or delete **any** ad in the system.
- **Activity Logging (Node.js version):** A special feature to track significant user actions within the database.

---

## 💻 Technology Stacks

This project showcases two powerful, modern backend stacks connected to a single frontend, each fulfilling the requirements of its respective course.

### ☕ Backend 1: Java & Spring Boot (`/backend-spring`)

_Course: IT355 - Web Systems 2_

A robust, type-safe, and enterprise-grade implementation.

- **Language & Platform:** Java 17, Spring Boot 3.x
- **Data Access:** Spring Data JPA (with `JpaSpecificationExecutor` for dynamic queries)
- **Security:** Spring Security 6 (JWT, password hashing with BCrypt, RBAC using `@PreAuthorize`)
- **Database:** H2 (development), easily portable to MySQL/PostgreSQL
- **API:** RESTful API with full CRUD operations
- **API Documentation:** Swagger / OpenAPI 3 (auto-generated with `springdoc-openapi`)

### 🚀 Backend 2: Node.js & Express (`/backend-express`)

_Course: CS310 - Scripting Languages in Web Development_

A fast, flexible, and event-driven implementation using JavaScript.

- **Platform & Language:** Node.js, JavaScript (ES6+)
- **Framework:** Express.js
- **Data Access:** Mongoose (ODM for MongoDB)
- **Security:** JWT (`jsonwebtoken`), password hashing (`bcryptjs`), custom middleware for RBAC
- **Database:** MongoDB
- **File Uploads:** Multer
- **Validation:** `express-validator`

### ⚛️ Frontend (Shared)

A modern, reactive, and user-friendly single-page application that connects to either backend.

- **Framework:** React 18 (with Vite)
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios (with interceptors for token handling)
- **State Management:** React Context API
- **Routing:** React Router
- **UI/UX:** React Hot Toast (notifications), React Icons, React Hook Form

---

## ⚙️ Running the Project

The project consists of three main parts: the two backend servers and the shared frontend client. You only need to run **one backend at a time** with the frontend.

### 1. Running a Backend Server

Choose the backend you want to run.

#### A) Running the Spring Boot Backend

**Prerequisites:**

- Java JDK 17 or newer
- Maven 3.x

**Steps:**

1.  Navigate to the Spring backend folder: `cd backend-spring/`
2.  Run the application using Maven: `mvn spring-boot:run`
3.  The server will start at `http://localhost:8080`.

**API Documentation (Spring):**

- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **H2 Database Console:** `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:~/oglasnikdb`

#### B) Running the Node.js/Express Backend

**Prerequisites:**

- Node.js 18.x or newer
- npm or yarn
- A running instance of MongoDB

**Steps:**

1.  Navigate to the Express backend folder: `cd backend-express/`
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the root of the `/backend-express` directory and populate it based on `.env.example`.
4.  Run the development server: `npm run dev`
5.  The server will start at `http://localhost:5000`.

---

### 2. Running the Frontend

**Prerequisites:**

- Node.js 18.x or newer
- npm or yarn

**Steps:**

1.  Navigate to the frontend folder: `cd frontend/`
2.  Install dependencies: `npm install`
3.  **Important:** Open `frontend/src/api/axios.js` and ensure the `baseURL` points to the correct address of the **running** backend (`http://localhost:8080` for Spring, `http://localhost:5000` for Node.js).
4.  Start the development server: `npm run dev`
5.  The application will be available at `http://localhost:5173`.

---

## ✅ Project Requirements Coverage

This repository successfully covers the requirements for both courses.

### IT355 (Spring)

- [x] **Full-Stack Application:** Backend (Spring) and Frontend (React) are fully functional and integrated.
- [x] **At least 2 roles:** `ROLE_USER` and `ROLE_ADMIN` implemented.
- [x] **At least 5 entities:** `User`, `Ad`, `Category`, `Image`, `Log` are defined.
- [x] **Spring Security with JWT:** Full authentication and authorization (RBAC) implemented.
- [x] **Spring Data JPA:** Uses `JpaRepository` and `Specification API`.
- [x] **Advanced Features:** Pagination, sorting, Swagger documentation, and file uploads.

### CS310 (Node.js/Express)

- [x] **Full-Stack Application:** Backend (Node.js/Express) and Frontend (React) are fully functional.
- [x] **Technology Requirements:** Uses Node.js, Express, and MongoDB.
- [x] **Validation:** Backend validation is implemented with `express-validator`.
- [x] **Authentication:** JWT is used for authentication, and passwords are hashed with `bcryptjs`.
- [x] **Pagination & Sorting:** Implemented for the main ad list.
- [x] **RBAC Authorization:** Custom middleware protects routes based on user roles.
- [x] **Special Functionality:** User action logging is implemented.
- [x] **External Library:** `Multer` is used for file uploads.
