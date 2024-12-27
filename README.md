# 📖 Novel App

## 📝 Description

This project is a web application for creating and sharing stories. Users can create new stories, view existing stories, and interact with other users.

## 🌟 Features

* **✨ User Authentication:** Secure user authentication using Firebase Authentication.
* **📝 Story Creation:** Create new stories with title, summary, rating, and tags.
* **📖 Story Viewing:** View detailed information about individual stories, including title, summary, author, rating, and tags.
* **👤 User Profiles:** View user profiles with information like username and bio.

## Getting Started

### Prerequisites

* Node.js and npm
* Firebase account (for authentication)
* Firebase project with Email/Password Authentication
    1. Go to the Firebase Console and navigate to your project.
    2. Select the Auth panel and then click the Sign In Method tab.
    3. Click Email/Password and turn on the Enable switch, then click Save.
    4. Go to your project's settings.
    5. Select create a web app.
    6. Paste the firebase configuration into novel-app/firebase.ts
    7. Replace getAnalytics and analytics by getAuth and auth.
* MongoDB
    1. Install [MongoDB & MongoDBCompass](https://www.mongodb.com/try/download/community).
    2. Open MongoDBCompass.

### 🚀 Installation

1. **Clone the repository:**
```bash
   git clone https://github.com/fyambos/express-novel-app.git
```
2. **Install front-end dependencies:**
```bash
    cd novel-app
    npm install
```
3. **Running the front-end application**
```bash
    ng serve
```
4. **Install back-end dependencies:**
```bash
    cd src/backend
    npm install
```
5. **Running the back-end application**
```bash
    node server.js
```
## 📂 Project Structure
```plaintext
novel-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── guards/
│   │   ├── pages/
│   │   ├── services/
│   │   └── app.module.ts
│   ├── assets/
│   ├── backend/
│   │   ├── models/
│   │   ├── server.js
│   │   └── package.json
│   ├── environments/
├── package.json
└── README.md

```

## 🛠️ Technology Stack
- **Frontend**: Angular, Angular Material
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Firebase**: Authentication

## 📜 Licence

Ce projet est sous licence [MIT](https://opensource.org/licenses/MIT).