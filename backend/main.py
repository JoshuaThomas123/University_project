from flask import request, jsonify
from config import app, db
from models import Contact
import hashlib
import os
import pdfplumber
from ai_model import AISummarizer  


UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


ai_summarizer = AISummarizer()


def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def verify_password(stored_password, provided_password):
    return stored_password == hash_password(provided_password)

@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contacts": json_contacts})

@app.route("/create_contact", methods=["POST"])
def create_contact():
    username = request.json.get("username")
    password = request.json.get("password")
    DOB = request.json.get("DOB")
   
    if not username or not password or not DOB:
        return jsonify({"message": "You must include username, password, and DOB"}), 400
    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters long"}), 400
    
    hashed_password = hash_password(password)
    new_contact = Contact(username=username, password=hashed_password, DOB=DOB)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": "An error occurred while creating the user"}), 400
    return jsonify({"message": "User created!"}), 201

@app.route("/upload_pdf/<int:user_id>", methods=["POST"])
def upload_pdf(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404

    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if file and file.filename.endswith('.pdf'):
        filename = file.filename.replace(" ", "_")  
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
           
            with pdfplumber.open(filepath) as pdf:
                pdf_text = ""
                for page in pdf.pages:
                    pdf_text += page.extract_text() or ""

          
            summary = ai_summarizer.summarize(pdf_text)

            
            contact.pdf_path = filepath
            contact.pdf_text = pdf_text
            contact.summary = summary
            db.session.commit()

            return jsonify({
                "message": "PDF uploaded successfully",
                "pdf_path": filepath,
                "pdf_text": pdf_text,
                "summary": summary
            }), 201
        except Exception as e:
            return jsonify({"message": "Failed to process the PDF", "error": str(e)}), 500
    else:
        return jsonify({"message": "Invalid file type. Only PDF files are allowed"}), 400

@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    if not username or not password:
        return jsonify({"success": False, "message": "Username and password are required"}), 400
    
    user = Contact.query.filter_by(username=username).first()
    if not user or not verify_password(user.password, password):
        return jsonify({"success": False, "message": "Invalid username or password"}), 401
    return jsonify({"success": True, "message": "Login successful"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
