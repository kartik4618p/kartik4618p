from flask import Flask, request, redirect, render_template, jsonify
import mysql.connector
import os

app = Flask(__name__)
UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Connect to MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="bookdb"
)
cursor = db.cursor()

# Create uploads folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    mobile VARCHAR(20),
    bookname VARCHAR(200),
    author VARCHAR(200),
    description TEXT,
    rentprice DECIMAL(10,2),
    buyprice DECIMAL(10,2),
    image VARCHAR(200)
)
""")

# -------------------------------------------
# UPLOAD BOOK (POST)
# -------------------------------------------
@app.route("/upload", methods=["POST"])
def upload():
    name = request.form["name"]
    mobile = request.form["mobile"]
    bookname = request.form["bookname"]
    author = request.form["author"]
    description = request.form["description"]
    rentprice = request.form["rentprice"]
    buyprice = request.form["buyprice"]

    file = request.files["image"]
    filename = file.filename
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    cursor.execute("""
        INSERT INTO books (name, mobile, bookname, author, description, rentprice, buyprice, image)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """, (name, mobile, bookname, author, description, rentprice, buyprice, filename))

    db.commit()

    return redirect("/")  # redirect back to home

# -------------------------------------------
# DISPLAY UPLOADED BOOKS PAGE
# -------------------------------------------
@app.route("/uploaded_books")
def uploaded_books():
    return render_template("uploaded.html")

# -------------------------------------------
# FETCH ALL UPLOADED BOOKS (JSON API)
# -------------------------------------------
@app.route("/api/uploaded_books")
def api_uploaded_books():
    cursor.execute("SELECT * FROM books")
    rows = cursor.fetchall()

    books = []
    for r in rows:
        books.append({
            "id": r[0],
            "name": r[1],
            "mobile": r[2],
            "bookname": r[3],
            "author": r[4],
            "description": r[5],
            "rentprice": float(r[6]),
            "buyprice": float(r[7]),
            "image": r[8]
        })

    return jsonify(books)

# -------------------------------------------
# UPLOAD PAGE
# -------------------------------------------
@app.route("/upload_page")
def upload_page():
    return render_template("upload.html")

# -------------------------------------------
# HOME PAGE
# -------------------------------------------
@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
