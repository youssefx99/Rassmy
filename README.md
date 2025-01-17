# **Job Application Platform**

A comprehensive platform for job seekers and companies to connect. This platform enables users to find and apply for jobs, track their applications, and receive notifications, while companies can post jobs, manage applications, and interact with potential employees.

---

## **Features**

### **For Users**
- **Authentication**: Signup, Login, and Logout.
- **Profile Management**: Manage personal information and job interests.
- **Job Features**:
  - View all jobs.
  - Save jobs for later review.
  - Apply to jobs.
  - Track application status.
- **Notifications**: Stay updated with job-related notifications.

### **For Companies**
- **Authentication**: Signup, Login, and Logout.
- **Job Management**:
  - Post new jobs.
  - Update or delete existing job posts.
  - View applications for jobs.
  - Offer jobs to users.
- **Employee Management**: Manage employees and roles.

### **General**
- **Notifications System**: Notifications for users and companies.
- **Secure Authentication**: JWT-based authentication.

---

## **Tech Stack**

### **Frontend**
- HTML, CSS, Vanilla JavaScript.

### **Backend**
- **Framework**: Node.js with Express.js.
- **Database**: MongoDB.
- **Authentication**: JSON Web Tokens (JWT).
- **Tools**:
  - Postman for API testing.
  - CORS for secure cross-origin communication.

---

## **Installation**

### **Prerequisites**
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### **Steps**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/job-application-platform.git
   cd job-application-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory.
   - Add the following:
     ```
     PORT=3030
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRES_IN=90d
     DATABASE_URL=mongodb://localhost:27017/jobPlatform
     ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Run the frontend**:
   - Serve the `public/` folder using any static server (e.g., Live Server in VS Code).

6. **Access the application**:
   - Backend: `http://localhost:3030`
   - Frontend: Open the `public/index.html` in your browser.

---

## **Folder Structure**

### **Backend**
```
backend/
├── controllers/         # API logic
├── models/              # Database schemas
├── routes/              # API routes
├── utils/               # Utility functions
├── server.js            # Main server entry point
└── app.js               # Express app configuration
```



## **API Documentation**

### **Base URL**
```
http://localhost:3030
```

### **Authentication**
- **Signup**: `POST /user/signup`
- **Login**: `POST /user/login`
- **Logout**: `GET /user/logout`

### **Jobs**
- **Get All Jobs**: `GET /jobs`
- **Create Job**: `POST /jobs`
- **Update Job**: `PATCH /jobs/:id`
- **Delete Job**: `DELETE /jobs/:id`

### **Companies**
- **Get All Companies**: `GET /company`
- **Create Company**: `POST /company`
- **Update Company**: `PATCH /company/:id`
- **Delete Company**: `DELETE /company/:id`
