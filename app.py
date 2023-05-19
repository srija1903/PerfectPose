from flask import Flask,render_template,request,send_file,send_from_directory,jsonify
import pickle
import numpy as np
# Importing the pickle file of the knn classified dataset
model = pickle.load(open('exercises.pkl','rb+'))
# file = open('./src/Person1.json')
# model = json.load(file)
# keypoints = model.values()
# Assigning the Flask  API to app
app = Flask(__name__,template_folder='public')
# Creating a route for the pose detection page
@app.route("/detect",methods=['POST','GET'])
def main():
    if(request.method == 'POST'):
        inputs = [x for x in request.form.values()]
        input_parse = list(inputs)
        inputs_parse_float=[float(x) for x in input_parse]
        result= model.predict([inputs_parse_float])
        print(result[0])
        return result[0]
    if(request.method == 'GET'):
        return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)