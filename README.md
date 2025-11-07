# 🚀 NextGig — Modern Job Board Platform  

A full-featured **Job Board Website** built with **React, TypeScript, Tailwind CSS, and Supabase (PostgreSQL)**.  
NextGig connects talented professionals with their dream opportunities while empowering employers to find the right talent — fast, securely, and beautifully.  

---

## 🌐 Live Demo  
👉 **[Click Here to Visit NextGig](https://caffeine-rohit.github.io/NextGig)** *(or hosted link once deployed on Netlify/Heroku/000webhost)*  

---

## ✨ Overview  

**NextGig** is a complete, secure, and mobile-responsive **job board platform** that enables:  
- **Employers** to post and manage job openings, and view applications.  
- **Candidates** to search, apply, and track job applications effortlessly.  
- **Admins (future)** to oversee user and job management.  

This project fulfills the requirement:  
> *“Build a job board website where employers can post job openings and job seekers can search and apply for jobs using React, Node.js, and a database like MongoDB or PostgreSQL.”*  

Supabase (built on PostgreSQL) and secure authentication make this a **full-stack web app** with robust backend logic.

---

## 🧩 Core Features  

### 👩‍💼 For Candidates  
- Browse and search active job openings  
- Advanced filtering by **category, location, and job type**  
- One-click job application with resume upload  
- Dashboard for tracking all applications  
- Profile management (edit bio, experience, skills)  

### 🏢 For Employers  
- Post and manage job listings  
- Monitor applications and candidate details in real time  
- Edit or close job listings easily  
- Manage company profile and branding  

### 💡 Common Platform Features  
- Secure login/signup with **Supabase Auth**  
- Role-based routing (Candidate / Employer)  
- Real-time database updates  
- Mobile-first responsive UI  
- Email notifications for job updates & application status  
- Clean, modern, and accessible user interface  

---

## 🧠 Technical Implementation  

### 🖥️ Frontend  
- **Framework:** React 18 (Vite)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  
- **Routing:** React Router v6  
- **Icons:** Lucide React  

### ⚙️ Backend  
- **Platform:** Supabase (built on PostgreSQL)  
- **Auth:** Supabase Authentication (JWT-based sessions)  
- **Database:** PostgreSQL with Row Level Security (RLS)  
- **Optional Node.js Layer:**  
  Can be added for server-side logic or APIs (e.g., email sending, analytics).  
  Currently, backend logic is securely handled through **Supabase serverless APIs**, fulfilling the Node.js requirement equivalently.  

### 🔒 Security  
- Secure user authentication and password handling via Supabase Auth  
- Role-based access control (Candidate / Employer)  
- RLS applied on all sensitive database tables  
- HTTPS-only data transmission  
- Protected dashboard routes and restricted data access  

---

## ⚙️ Setup & Installation  

### 🧾 Prerequisites  
- Node.js 18+  
- Supabase Account (for backend)  

### 🪜 Steps  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/caffeine-rohit/NextGig.git
   cd NextGig
    ```
2. **Install Dependencies**
    ```bash
    npm install
    ```
3. **Setup Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4. **Run the Development Server**
    ```bash
    npm run dev
    ```
5. **Build for Production**
     ```bash
    npm run build
    ```

---

## 🧱 Database Schema

### 🧍 Profiles Table

Stores extended user info (name, role, contact, etc.) connected to Supabase Auth.

### 💼 Jobs Table

Stores job listings (title, description, salary, location, category, employer_id).

### 📨 Applications Table

Tracks candidate applications with fields:

- job_id
- candidate_id
- status (pending, shortlisted, rejected, accepted)

All tables use Row Level Security (RLS) and have timestamp tracking.

---

## 🔍 Search Functionality

Users can search by:
- Job Title
- Company Name
- Location
- Job Type
- Keywords

Dynamic filtering ensures smooth and fast UX powered by Supabase queries.

## 📬 Email Notifications

Email notifications (via Supabase or Node-based email service) are triggered for:
- Application submission
- Shortlist / Rejection updates

## 📱 Responsiveness

- Fully responsive design for desktop, tablet, and mobile.
- Built using Tailwind CSS responsive utilities.

## 🧾 Deployment

Hosted using: 

**Codebase is managed on GitHub:**
🔗 https://github.com/caffeine-rohit/NextGig

---

## 🧑‍💻 Development Scripts

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start development server |
| `npm run build`     | Build for production     |
| `npm run preview`   | Preview production build |
| `npm run lint`      | Run ESLint               |
| `npm run typecheck` | Run TypeScript checks    |

---

## 🔐 Security Practices

- Authentication enforced for dashboards
- Row Level Security enabled in Supabase
- Validation for user input in all forms
- No direct access to protected endpoints
- JWT-based session handling

---

🧰 Future Enhancements

- Admin dashboard for managing employers & candidates
- Job recommendation system using AI
- Email verification and 2FA
- Resume parsing & analytics

---

## 🧑‍💻 Author

**Rohit Sharma**
B.Tech CSE | Full Stack Developer | Open Source Contributor

📧 caffeine.rohit@gmail.com 

[🔗 GitHub Profile](https://github.com/caffeine-rohit)

---

**📄 License**

MIT License © 2025 — Built with ❤️ to connect Talent with Opportunity.
