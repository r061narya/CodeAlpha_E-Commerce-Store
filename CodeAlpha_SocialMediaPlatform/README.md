# MiniSocial - Social Media Platform

MiniSocial is a simple full-stack social media platform developed as a college minor project.

The project allows users to create accounts, log in securely, create posts, upload images, like posts, and add comments.

The frontend is built with HTML, CSS, and JavaScript, while the backend uses Node.js, Express.js, and MongoDB.

---

## Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Logout functionality

### Posts
- Create text posts
- Upload images with posts
- View posts in the feed
- Like and unlike posts
- View individual posts

### Comments
- Add comments to posts
- View comments on individual posts

### Profile
- View user profile
- Display username and email
- Add and edit bio
- Upload profile picture
- Display posts, followers, and following counts

### User Relationships
- Follow users
- Unfollow users

> Note: The follower/following user interface is still being improved.

---

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Fetch API
- LocalStorage

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- CORS
- dotenv

---

## Project Structure

```text
MiniSocial/
│
├── backend/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── postRoutes.js
│   │
│   ├── uploads/
│   │   ├── posts/
│   │   └── profiles/
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── auth.js
│   │   ├── feed.js
│   │   ├── post.js
│   │   └── profile.js
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   └── post.html
│
└── README.md