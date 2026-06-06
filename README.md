markdown# 🏢 Company Management System

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-72.8%25-yellow?style=for-the-badge&logo=javascript)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)
![HTML5](https://img.shields.io/badge/HTML5-Frontend-orange?style=for-the-badge&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-Styling-blue?style=for-the-badge&logo=css3)
![PWA](https://img.shields.io/badge/PWA-Service_Worker-purple?style=for-the-badge)
![SSO](https://img.shields.io/badge/SSO-Auth_Simulator-red?style=for-the-badge)

**A full-stack Company Management System with employee management, authentication, SSO simulation, and PWA support.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Project Structure](#-project-structure)

</div>

---

## 🚀 What is Company Management System?

A **full-stack web application** built with Node.js and Vanilla JavaScript to digitize and streamline company operations. It includes employee & department management, secure login, SSO (Single Sign-On) simulation, and is built as a **Progressive Web App (PWA)** with service worker support for offline capability.

> 💡 *Login → Manage employees, departments & company data → Accessible anywhere as a PWA*

---

## ✨ Features

- 🔐 **User Authentication** – Secure login system via `login.html`
- 🔑 **SSO Simulator** – Single Sign-On simulation for enterprise-style auth flow
- 👨‍💼 **Employee Management** – Add, update, view, and manage employee records
- 🏢 **Department Management** – Organize employees by departments
- 📊 **Dashboard** – Overview of company stats and activities
- 📱 **PWA Support** – Installable as a Progressive Web App with offline capability via Service Worker
- ⚡ **Fast & Lightweight** – Pure Vanilla JS frontend, no heavy frameworks
- 🌐 **Responsive UI** – Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **JavaScript (Vanilla)** | Core frontend logic & SPA behavior |
| **HTML5** | Page structure & layout |
| **CSS3** | Styling & responsive design |
| **Node.js** | Backend server runtime |
| **Express.js** | REST API & routing (server/) |
| **Service Worker** | PWA offline support & caching |
| **SSO Simulator** | Single Sign-On authentication flow |

---

## ⚙️ How It Works
User visits login page
↓
Authenticates via Login / SSO Simulator
↓
Dashboard loaded with company overview
↓
Admin manages employees, departments & records
↓
Data handled via Node.js REST API (server/)
↓
Service Worker caches assets for PWA/offline use

---

## 📁 Project Structure
componey-management-system/
│
├── css/                   # Stylesheets
├── js/                    # Frontend JavaScript modules
├── server/                # Backend API & routes
├── index.html             # Main dashboard page
├── login.html             # Login page
├── sso-simulator.html     # SSO authentication simulator
├── server.js              # Node.js entry point
├── service-worker.js      # PWA service worker
├── package.json
└── README.md

---

## 🔧 Installation

1. **Clone the repository:**
```bash
   git clone https://github.com/amitkuma-1234/componey-management-system.git
   cd componey-management-system
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Start the server:**
```bash
   node server.js
```

4. **Open in browser:**
http://localhost:3000

---

## 🔑 Authentication Options

| Method | File | Description |
|---|---|---|
| **Standard Login** | `login.html` | Username & password login |
| **SSO Simulator** | `sso-simulator.html` | Enterprise-style Single Sign-On flow |

---

## 📌 Use Cases

- 🏢 Small & medium business employee management
- 🎓 Full-stack portfolio & academic project
- 🔨 Enterprise app prototype with SSO
- 📱 PWA demo for offline-capable web apps

---

## 🙋‍♂️ Author

<div align="center">

**Amit Kumar**

[![GitHub](https://img.shields.io/badge/GitHub-amitkuma--1234-black?style=for-the-badge&logo=github)](https://github.com/amitkuma-1234)

⭐ **If you find this useful, please give it a star!** ⭐

</div>

---

<div align="center">
Made with ❤️ using Node.js + Vanilla JavaScript + PWA
</div>
