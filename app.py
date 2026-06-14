from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)
 
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '12345',        
    'database': 'clinic'  
}
def get_db():
     return mysql.connector.connect(host='localhost', user='root', password='12345', database='clinic')

# Serve the main page
@app.route('/')
def index():
    return render_template('index.html')
# GET: 
@app.route('/appointments', methods=['GET'])
def get_appointments():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, name, phone, department, date, TIME_FORMAT(time, '%H:%i:%s') as time FROM appointments")
    rows = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(rows)
# POST
@app.route('/appointments', methods=['POST'])
def add_appointment():
    appt = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO appointments (name, phone, department, date, time) VALUES (%s, %s, %s, %s, %s)",
        (appt['name'], appt['phone'], appt['department'], appt['date'], appt['time'])
    )
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    db.close()
    return jsonify({'ok': True, 'id': new_id})
# PUT
@app.route('/appointments/<int:appt_id>', methods=['PUT'])
def update_appointment(appt_id):
    appt = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "UPDATE appointments SET name=%s, phone=%s, department=%s, date=%s, time=%s WHERE id=%s",
        (appt['name'], appt['phone'], appt['department'], appt['date'], appt['time'], appt_id)
    )
    db.commit()
    cursor.close()
    db.close()
    return jsonify({'ok': True})
# DELETE
@app.route('/appointments/<int:appt_id>', methods=['DELETE'])
def delete_appointment(appt_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM appointments WHERE id=%s", (appt_id,))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({'ok': True})


if __name__ == '__main__':
    app.run(debug=True)