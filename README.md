🚀 Modern Full-Stack Blog: DRF & Next.js

📝 Project Overview

This project is a complete Blog Content Management System (CMS) built from scratch. It showcases a modern web development architecture, combining a robust Backend with a high-performance and dynamic Frontend.

The main objective is to demonstrate my ability to build scalable, secure, Full-Stack solutions, managing the API with Django and the frontend with Next.js.

✨ Key Features

    Secure Authentication (DRF-JWT): User registration and login powered by JSON Web Tokens (JWT).

    Post Management (CRUD): Full functionality to Create, Read, Update, and Delete blog posts.

    Access Control: Only the author of a post can edit or delete their own content.

    Performance: Frontend utilizes Next.js for Server-Side Rendering (SSR) for better SEO and performance.

    Professional Design: Clean and responsive user interface built using Tailwind CSS and shadcn/ui components.

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
    cd backend
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

The frontend server typically runs on port `3000`.

1.  **Install Dependencies:**
    ```bash
    cd frontend # Go to the frontend folder
    npm install
    ```
2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
