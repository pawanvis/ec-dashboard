# EC Admin

A full-stack web application with a **React (client)** and **Node.js/Express (server)** setup.  
This project is designed to manage and monitor admin functionalities for EC Business School and Technology.

## 📂 Project Structure
│── client/ # React frontend
│── server/ # Node.js + Express backend
│── README.md # Project documentation

## 🚀 Features

- 🔐 User Authentication (Login / Signup / JWT / Session)
- 📊 Admin Dashboard
- 🎓 Course Management
- 🧾 Student & Leads Management
- 💳 Payment Gateway Integration (Razorpay / PayPal)
- 📡 REST APIs for client-server communication
- 📈 Reports and Analytics

---

## 🛠️ Tech Stack

### **Frontend (client)**
- React.js
- React Router
- Axios
- TailwindCSS / Bootstrap

### **Backend (server)**
- Node.js
- Express.js
- JWT Authentication
- Database (MySQL / MongoDB)

---

cd client
npm install
npm start
Server
bash
Copy code
cd server
npm install
npm run dev

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ec_admin
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

## ⚙️ Installation

### Clone Repository
```bash
git clone https://github.com/your-username/ec-admin.git
cd ec-admin


