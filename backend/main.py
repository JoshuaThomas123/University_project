from flask import request, jsonify
from config import app, db
from models import Contact
import hashlib  


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


@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
def update_contact(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    contact.username = data.get("username", contact.username)
    if "password" in data:
        contact.password = hash_password(data["password"])  
    contact.DOB = data.get("DOB", contact.DOB)

    db.session.commit()
    return jsonify({"message": "User updated."}), 200


@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(contact)
    db.session.commit()
    return jsonify({"message": "User deleted."}), 200


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
