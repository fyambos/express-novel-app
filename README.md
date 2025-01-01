# 📖 Novel App

## 📝 Description

This project is a web application for creating and sharing stories. Users can create new stories, view existing stories, and interact with other users.

## 🌟 Features

* **✨ User Authentication:** Secure user authentication using Firebase Authentication.
* **📖 Story Creation:** Create chaptered stories with title, summary, rating, and tags.
* **📝 Rich Text Editor:** Rich Text Editor built-in for adding style to chapter contents.
* **👤 User Profiles:** View user profiles with information like username and bio.
* **🌔 Dark Mode:** Toggle between light and dark mode.
* **💬 Add comments:** Add comments to stories, reply to comments.
* **📊 Statistics:** Display story statistics such as number of chapters, word count, likes etc.
* **📍 Bookmark Chapters:** Let users bookmark chapters to continue reading later.
* **✅ Mark as read:** Let users mark stories as read and display them in the profile.
* **❤️ Likes:** Like chapters or comments and display users who liked.
* **🔃 Reorder chapters:** Mingle with the order of chapters with a drag handle.
* **🗑️ Delete:** Ability to delete chapters, users and stories, while preserving dependant objects.
* **💬 Direct Messages:** Add a chat feature for authors and readers to communicate.

## 📈 Improvements
* **🔔 Subscribe & Follow:** Follow users or stories and get notified when a new story/chapter is posted.
* **🌐 Multi-language Support:** Add multi-language support for users to switch between languages.
* **🔍 Search Functionality:** Implement search for users and stories to easily find content.
* **⭐ Story Ratings:** Allow users to rate stories and see an average rating displayed.
* **🗂️ Story Filters:** Filter stories by tags or ratings for easy browsing.
* **👥 Multi-author Stories:** Allow multiple authors to co-author a story, with clear author attributions.
* **📊 Profile Statistics:** Display profile statistics such as number of words read or written.
* **🏆 Achievements/Badges:** Give users achievements or badges for milestones (e.g., writing a certain number of chapters, gaining followers, reading x amount of words etc.).
* **🔔 Real-time:** Real time notification features, and enhancing chat features to real time with socket.io.

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