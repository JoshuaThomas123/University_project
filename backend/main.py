from flask import request, jsonify
from config import app, db
from models import Contact
import hashlib
import os
import pdfplumber
from ai_model import AISummarizer  

# creates a upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# starts the ai class
ai_summarizer = AISummarizer()

# password protection
def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def verify_password(stored_password, provided_password):
    return stored_password == hash_password(provided_password)

# calls the model to generate summary text
def summarize_text(text):
    try:
        summary = ai_summarizer.summarize(text)
        return summary
    except Exception as e:
        print(f"Error during summarization: {str(e)}")
        return None

# gets all contacts
@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contacts": json_contacts})

# creates new contacts
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
        return jsonify({"message": "An error occurred while creating the user", "error": str(e)}), 400
    
    return jsonify({"message": "User created!"}), 201

# handles pdf upload
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
        filename = file.filename.replace(" ", "_")  # sanitize filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        try:
            # extract text
            file.save(filepath)
            with pdfplumber.open(filepath) as pdf:
                pdf_text = ""
                for page in pdf.pages:
                    pdf_text += page.extract_text() or ""
            
            # update the pdf text with path
            contact.pdf_path = filepath
            contact.pdf_text = pdf_text
            db.session.commit()
            
            return jsonify({
                "message": "PDF uploaded successfully",
                "pdf_path": filepath,
                "pdf_text": pdf_text
            }), 201
        except Exception as e:
            return jsonify({"message": "Failed to process the PDF", "error": str(e)}), 500
    else:
        return jsonify({"message": "Invalid file type. Only PDF files are allowed"}), 400

# create a summary
@app.route("/summarize/<int:user_id>", methods=["POST"])
def summarize(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404
    if not contact.pdf_text:
        return jsonify({"message": "No PDF text available for summarization"}), 400
    
    try:
        # creates the summary
        summary = summarize_text(contact.pdf_text)
        if not summary:
            return jsonify({"message": "Failed to generate summary"}), 500
        
        # update the summary
        contact.summary = summary
        db.session.commit()
        
        return jsonify({
            "message": "Summary generated successfully",
            "summary": summary
        }), 200
    except Exception as e:
        return jsonify({"message": "Failed to generate summary", "error": str(e)}), 500

# create questions
@app.route("/generate_questions/<int:user_id>", methods=["POST"])
def generate_questions(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404
    if not contact.pdf_text:
        return jsonify({"message": "No PDF text available for question generation"}), 400
    
    try:
        questions = ai_summarizer.generate_questions(contact.pdf_text, num_questions=5)
         # update questions to model
        contact.questions = str(questions) 
        db.session.commit()
        
        return jsonify({
            "message": "Questions generated successfully",
            "questions": questions
        }), 200
    except Exception as e:
        return jsonify({"message": "Failed to generate questions", "error": str(e)}), 500

# create flashcards
@app.route("/generate_flashcards/<int:user_id>", methods=["POST"])
def generate_flashcards(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404
    if not contact.pdf_text:
        return jsonify({"message": "No PDF text available for flashcard generation"}), 400
    
    try:
        flashcards = ai_summarizer.generate_flashcards(contact.pdf_text, num_flashcards=2)
        # update flashcards to model
        contact.flashcards = str(flashcards)
        db.session.commit()
        
        return jsonify({
            "message": "Flashcards generated successfully",
            "flashcards": flashcards
        }), 200
    except Exception as e:
        return jsonify({"message": "Failed to generate flashcards", "error": str(e)}), 500

# create mindmap
@app.route("/generate_mindmap/<int:user_id>", methods=["POST"])
def generate_mindmap(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404
    if not contact.pdf_text:
        return jsonify({"message": "No PDF text available for mind map generation"}), 400
    
    try:
        mindmap = ai_summarizer.generate_mindmap(contact.pdf_text, max_topics=5, max_subtopics=3)
        # update mindmap to model
        contact.mindmap = str(mindmap)
        db.session.commit()
        return jsonify({
            "message": "Mind map generated successfully",
            "mindmap": mindmap
        }), 200
    except Exception as e:
        return jsonify({"message": "Failed to generate mind map", "error": str(e)}), 500
# used to login for user
@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    
    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Username and password are required"
        }), 400
    user = Contact.query.filter_by(username=username).first()
    if not user or not verify_password(user.password, password):
        return jsonify({
            "success": False,
            "message": "Invalid username or password"
        }), 401
    return jsonify({
        "success": True,
        "message": "Login successful",
        "user_id": user.id  
    }), 200

# Run the Flask app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
