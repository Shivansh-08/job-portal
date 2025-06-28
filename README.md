# JobConnect - Full Stack Job Portal 🚀

🌍 **Live Demo:** [https://job-portal-client-brown.vercel.app](https://job-portal-client-brown.vercel.app)

JobConnect is a full-featured job portal that allows users to search and apply for jobs, while enabling recruiters to post openings and manage applicants efficiently. The platform includes secure authentication, role-based access control, and modern UI components for a seamless experience.

---



## ✨ Features

### 👨‍💼 For Job Seekers:
- Browse and search 500+ job listings with filters.
- View job descriptions and company details.
- Secure registration and login with JWT authentication.
- Apply to jobs with a single click.
- Track application status in real-time.

### 🏢 For Recruiters:
- Post new jobs and manage listings through an intuitive dashboard.
- View applicants and application stats per job.
- Edit and delete job posts.
- Streamlined job management to reduce overhead by 30%.

### 🔐 Authentication & Authorization:
- Role-based access (Job Seeker vs Recruiter).
- JWT-secured login and protected routes.
- Password hashing and session management.

---

## 🛠️ Tech Stack

**Frontend**
- ReactJS  
- Tailwind CSS  
- React Router  
- Axios  

**Backend**
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

**DevOps / Cloud Services**
- Cloudinary (Image Uploads)  
- Sentry (Error Tracking)  
- Vercel   


---

## 📦 Installation

1. **Clone the repository**

 

2. **Frontend Setup:**

   ```bash
   cd client
   npm install
   npm start
   ```

3. **Backend Setup:**

   ```bash
   cd server
   npm install
   npm run dev
   ```

4. **Environment Variables:**

   ### 🖥️ Frontend `.env` (client)

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_BACKEND_URL=https://your-backend-url.com
   ```

   ### 🛠️ Backend `.env` (server)

   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

---

## 📸 Screenshots

### 🗂️ Job Listings

![Job Listings](https://github.com/user-attachments/assets/17140554-dc47-4c35-b314-1a603b496217)

---

### 📊 Recruiter Dashboard

![Recruiter Dashboard](https://github.com/user-attachments/assets/fcfd65f1-ed22-4318-9905-11023900291c)

---

### 📄 Job Details

![Job Details](https://github.com/user-attachments/assets/65ec3004-a308-47f9-aeab-83df5acdf6c4)

---

## 🧩 Future Enhancements

* Resume parsing.
* Email notifications for applicants.
* Chat functionality between recruiters and applicants.

---

## 🤝 Contributing

Pull requests are welcome!  
To contribute:

1. Fork the repository  
2. Create your branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m 'Add feature'`)  
4. Push to the branch (`git push origin feature/YourFeature`)  
5. Open a pull request  

---

💼 Empowering job seekers and recruiters through a modern and responsive job portal.
