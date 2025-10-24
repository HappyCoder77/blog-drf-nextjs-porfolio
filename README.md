# 🚀 Full-Stack Blog Platform: DRF & Next.js (Robust JWT Implementation)
### 📝 Project Overview
This project is a complete Blog Content Management System (CMS) built from scratch, showcasing a modern and secure web development architecture. It combines a robust Django REST Framework (DRF) API with a high-performance Next.js frontend.

The main objective is to demonstrate my ability to build scalable, secure, Full-Stack solutions, specializing in complex JWT authentication flows and ensuring data integrity.

## ✨Key Features & Advanced Technical Solutions
### 🛡️ Core Features

* **Post Management (CRUD): Full functionality to Create, Read, Update, and Delete blog posts.

* **Access Control: Only the author of a post can edit or delete their own content.

* **Performance: Frontend utilizes Next.js for optimal rendering and user experience.

* **Professional Design: Clean and responsive user interface built using Tailwind CSS and shadcn/ui components.

### 🧠 Advanced Technical Solutions (Demonstrated Skills)

| Problem Solved | Technology / Concept | Implementation Detail |
| :--- | :--- | :--- |
| **Seamless Token Renewal** | **Axios Interceptors & Context API** | **Proactively intercepts `401 Unauthorized` errors** and automatically calls the refresh endpoint, eliminating manual re-login for the user. |
| **Auth State Synchronization** | **`useCallback` Hook** | Optimized the React `AuthContext` by wrapping state setters in `useCallback`, ensuring **clean synchronization** of the Axios client after login/logout and **preventing redundant renders**. |
| **Object-Level Permissions** | **Custom DRF Permissions** | Enforced author permissions by comparing the **Primary Keys (`.pk`)** of the request user and the object author, resolving common conflicts related to Simple JWT user instances. |
| **Database Integrity** | **Django Model `save()`** | Implemented custom logic to auto-generate unique **URL slugs** from the post title, preventing database `IntegrityError` collisions when titles are duplicated. |

## 🛠️ Tech Stack

| Component           | Technology                                      | Key Concepts Demonstrated                                                                                                                  |
| :------------------ | :---------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend (API)**   | **Django, Django REST Framework (DRF), Python** | **JWT Authentication** (`simplejwt`), RESTful API design, ORM Modeling, _Permission Classes_ (IsAuthenticatedOrReadOnly), CRUD operations. |
| **Frontend (UI)**   | **Next.js, React, JavaScript**                  | **Server-Side Rendering (SSR)**, Global State Management (Context API), Dynamic Routing.                                                   |
| **Styling**         | **Tailwind CSS, shadcn/ui**                     | Responsive design, high-quality component implementation.                                                                                  |
| **Version Control** | **Git & GitHub**                                | Monorepo structure management.                                                                                                             |


⚙️ Local Setup Instructions

To run the project on your local machine, please follow the steps for both the Backend and the Frontend.

### 1. Preparation (Cloning)

Clone the repository and move into the project directory:

Bash

```bash
git clone https://github.com/HappyCoder77/blog-drf-nextjs-porfolio.git
```

### 2. Backend (Django REST Framework)

The API server runs on port `8000`.

1.  **Install Dependencies:**
    ```bash
    cd backend #go to the backend folder
    python -m venv venv  # Create virtual environment
    source venv/bin/activate # Activate virtual environment
    pip install -r requirements.txt
    ```
2.  **Database Configuration and Migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
3.  **Run the Development Server:**
    ```bash
    python manage.py runserver
    ```

### 3. Frontend (Next.js)

The frontend server typically runs on port \`3000\`.

1.  **Install Dependencies:**
    ```bash
    cd frontend # Go to the frontend folder
    npm install
    ```
2.  **Configure Environment:**
    * Create a \`.env.local\` file in the \`frontend\` directory.
    * Add the API URL: \`NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/`
3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

---

## 👨‍💻 Author

**Saúl F. Rojas G.**

* Email: rojasaul77@gmail.com
* Github: https://github.com/HappyCoder77
