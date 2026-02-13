📚 Education-App-Using-MERN

A full-stack mobile Education Management Application built using the MERN stack with a React Native frontend. The system implements secure role-based authentication for School and Guardian users, ensuring structured access control and academic management.

🚀 Overview

EduSphere is a cross-platform mobile application (Android & iOS) designed to streamline communication and academic monitoring between Schools and Guardians.

The backend is built using Node.js, Express.js, and MongoDB, while the mobile frontend is developed using React Native.

The platform uses JWT-based authentication and enforces Role-Based Access Control (RBAC) to ensure secure and restricted access to system features.

🔐 Role-Based Authentication

The system supports two primary roles:

🏫 School

Register and manage students

Update attendance records

Manage academic performance

Post announcements

Monitor guardian access

👨‍👩‍👧 Guardian

View student academic progress

Track attendance

Receive announcements

Access school updates

Each user logs in based on their assigned role. Authorization is enforced at:

API level (middleware validation)

Application level (role-specific UI rendering)

🏗 Tech Stack 📱 Mobile Frontend

React Native

Axios (API communication)

Context API / Redux (state management)

🖥 Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication