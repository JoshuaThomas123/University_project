from config import db

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    DOB = db.Column(db.String(10), nullable=False)
    pdf_path = db.Column(db.String(255), nullable=True)  
    pdf_text = db.Column(db.Text, nullable=True)         
    summary = db.Column(db.Text, nullable=True)          
    questions = db.Column(db.Text, nullable=True)        
    flashcards = db.Column(db.Text, nullable=True)       
    mindmap = db.Column(db.Text, nullable=True)          

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "password": self.password,
            "DOB": self.DOB,
            "pdf_path": self.pdf_path,
            "pdf_text": self.pdf_text,
            "summary": self.summary,
            "questions": self.questions,  
            "flashcards": self.flashcards,  
            "mindmap": self.mindmap  
        }
