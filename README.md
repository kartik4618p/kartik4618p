# Book Collection Web Application

A Flask-based web application for managing a book collection with features to browse, search, upload, and view books.

## Features

- **User Authentication**: Login system with credentials
- **Browse Books**: View random books from Open Library API
- **Search Books**: Search for books by title
- **Upload Books**: Upload your own books with details and cover images
- **View Uploaded Books**: See all books uploaded by users
- **Rent/Buy Options**: Display rental and purchase prices for books

## Prerequisites

- Python 3.7 or higher
- MySQL Server installed and running
- MySQL database named `bookdb`

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure MySQL Database

Make sure MySQL is running and create a database:

```sql
CREATE DATABASE bookdb;
```

Update the database credentials in `app.py` if needed:

```python
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",  # Change this to your MySQL password
    database="bookdb"
)
```

### 3. Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

## Default Login Credentials

- **Username**: admin
- **Password**: 12345

## Project Structure

```
project/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── static/
│   ├── style.css         # Styling
│   ├── script.js         # Main page JavaScript
│   ├── uploaded.js       # Uploaded books JavaScript
│   └── uploads/          # Uploaded book images (auto-created)
└── templates/
    ├── index.html        # Home page
    ├── upload.html       # Book upload form
    └── uploaded.html     # Uploaded books page
```

## Usage

1. Open your browser and navigate to `http://localhost:5000`
2. Login with the default credentials
3. Browse random books or search for specific titles
4. Click "Upload" to add your own books
5. Click "Uploaded Books" to view all user-uploaded books

## Notes

- Book images are stored in the `static/uploads/` directory
- The application uses Open Library API for browsing and searching books
- User-uploaded books are stored in the MySQL database

