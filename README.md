# Oglasnik – Full-Stack Web Application (IT355 Project)

This is a complete full-stack web application project of a classified ads platform, developed as part of the IT355 – Web Systems 2 course. The application allows users to register, post, search, and manage ads, while administrators have the ability to manage all data within the system.

![Showcase 1](./showcase/1.png)

---

## 🚀 Key Features

### 👤 User Features

* **Authentication:** Secure user registration and login using JWT (JSON Web Token).
* **Ad Browsing:** Paginated and searchable list of all active ads.
* **Filtering:** Ability to filter ads by keyword and category.
* **Detailed View:** A page showing all details of an individual ad.
* **Create Ad:** A form for posting new ads with multiple image uploads.
* **Manage Own Ads:** Users can view, edit, and delete only the ads they have posted themselves.

### 🔧 Admin Features

* **Admin Panel:** Centralized dashboard for managing users and categories.
* **User Management:** Admin can view and delete user accounts.
* **Category Management:** Admin can add and delete ad categories.
* **"God Mode":** Admin has the ability to edit or delete **any** ad in the system.

---

## 💻 Used Technologies

### Backend (Spring Boot)

* **Language:** Java 17
* **Framework:** Spring Boot 3.x
* **Data Access:** Spring Data JPA (with `JpaSpecificationExecutor` for dynamic queries)
* **Database:** H2 (for development), easily portable to MySQL/PostgreSQL
* **Security:** Spring Security 6 (JWT, password hashing with BCrypt, RBAC using `@PreAuthorize`)
* **API:** RESTful API with full CRUD operations
* **Documentation:** Swagger / OpenAPI 3
* **Extras:** Lombok, MapStruct (for DTO conversion – optional), centralized error handling

### Frontend (React)

* **Framework:** React 18 (with Vite)
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios (with interceptors for automatic token handling and error processing)
* **State Management:** React Context API
* **Routing:** React Router
* **Notifications:** React Hot Toast
* **Icons:** React Icons
* **Forms:** React Hook Form

---

## ⚙️ Running the Project

The project consists of two parts: the backend server and the frontend client.

### 🔙 Running the Backend

**Prerequisites:**

* Java JDK 17 or newer
* Maven 3.x

**Steps:**

1. Clone the repository:

   ```bash
   git clone https://github.com/ogidevs/oglasnik
   ```
2. Navigate to the backend folder:

   ```bash
   cd ./backend-spring
   ```
3. Run the Spring Boot application using Maven:

   ```bash
   mvn spring-boot:run
   ```
4. The server will start at `http://localhost:8080`.

**API Documentation:**

* **Swagger UI:** `http://localhost:8080/swagger-ui.html`
* **H2 Database (for development):** `http://localhost:8080/h2-console`

    * **JDBC URL:** `jdbc:h2:file:~/oglasnikdb`

### 🔜 Running the Frontend

**Prerequisites:**

* Node.js 18.x or newer
* npm or yarn

**Steps:**

1. Navigate to the frontend folder:

   ```bash
   cd frontend/
   ```
2. Install all necessary dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm run dev
   ```
4. The application will be available at `http://localhost:5173`.

---

## ✅ Project Requirements Coverage

* [x] **Full-Stack Application:** Backend (Spring) and Frontend (React) are fully functional and integrated
* [x] **At least 2 roles:** `ROLE_USER` and `ROLE_ADMIN`
* [x] **At least 5 entities:** `User`, `Ad`, `Category`, `Image`, `Message`
* [x] **Spring Security with JWT:** Full authentication and authorization (RBAC) implemented
* [x] **Spring Data JPA:** Uses `JpaRepository` and `Specification API`
* [x] **Testing:** Unit tests (Mockito) for the service layer and integration tests (MockMvc, @SpringBootTest) for controllers
* [x] **Advanced Features:**

    * [x] Pagination and sorting
    * [x] Swagger / OpenAPI documentation
    * [x] Centralized error handling
    * [x] File upload to server