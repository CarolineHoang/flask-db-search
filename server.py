from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)
import json

# get data from json file
with open('./vocaloid.json') as f:
  data = json.load(f)
#####---------------------------
##### variables



producers = data

p_id = 31

display_producers = []





#Simple Homepage incase we open to the base url
@app.route('/')
def hello_world():
   return render_template('homepage.html', search_ids = [] , display_producers= [] )


@app.route('/view/<idVal>')
def view(idVal=None, display_producers= []):
    global producers
    display_producers = edit_display([idVal], producers)
    return render_template('view.html', idVal=idVal, display_producers= display_producers)


@app.route('/create')
def create():
    return render_template('create.html')

@app.route('/edit/<idVal>')
def edit(idVal=None, display_producers= []):
    global producers
    display_producers = edit_display([idVal], producers)
    return render_template('edit.html', idVal=idVal, display_producers= display_producers)

@app.route('/search', methods=['GET', 'POST'])
def search():
    global producers
    #global p_id

    json_data = request.get_json()   
    name= json_data["name"] 
    search_result = []
    # Delete an entry with a matching Id as that in the JSON
    found = False
    s= 0
    while (not found and s<len(producers) ):
        if (name.lower() in producers[s]['name'].lower() and len(name)>0):
            search_result.append(producers[s]['id'])       
        # print(producers[s]['id'])
        s+=1
    #send back the WHOLE array of data, so the view can redisplay it
    return jsonify( search_ids= search_result)


@app.route('/show_producer', methods=['GET', 'POST'])
def show_producer():
    global producers
    # global display_producers

    json_data = request.get_json()   
    ids = json_data["search_ids"] 
    display_producers = []
    
    # add new entry to array with 
    # a new id and the values the user sent in JSON

    display_producers = edit_display(ids, producers)
    return jsonify(display_producers= display_producers)

@app.route('/<idVal>/update_desc', methods=['GET', 'POST'])
def update_desc(idVal):
    global producers
    json_data = request.get_json()   
    ids = json_data["search_ids"] 
    newDesc = json_data["newDesc"]
    display_producers = []
    for p in producers:
        if (p['id']== int(ids)):
            p['desc']=newDesc
    return jsonify(display_producers= display_producers)

def edit_display(id_list, producers_list):
    display_producers=[]
    for i in id_list:
        for p in producers_list:
            # print(i == 1, i)
            if (p['id']== int(i)):
                producer_entry = {
                    "id": int(i),
                    "name": p['name'],
                    "startYear": p['startYear'],
                    "songNum": p['songNum'],
                    "desc": p['desc'],
                    "vocaloids": p['vocaloids'],
                    "profileImg": p['profileImg']
                }
                display_producers.append(producer_entry)
                # print("\n\n\n array= {} \n\n\n".format(display_producers))
    return display_producers



@app.route('/<idVal>/get_producer', methods=['GET', 'POST'])
def get_producer(idVal):
    global producers
    json_data = request.get_json()   
    ids = json_data["search_ids"] 
    display_producers = []

    
    # add new entry to array with 
    # a new id and the values the user sent in JSON

    display_producers = edit_display(ids, producers)

    #send back the WHOLE array of data, so the view can redisplay it
    # return render_template('view.html', idVal=idVal, display_producers= display_producers)
    view(idVal, [1,34,234])
    return jsonify( display_producers= display_producers)




@app.route('/save_producer', methods=['GET', 'POST'])
def save_producer():
    global producers
    global p_id
    json_data = request.get_json()   
    name = json_data["name"] 
    startYear = json_data["startYear"] 
    songNum = json_data["songNum"] 
    desc = json_data["desc"] 
    vocaloids= json_data['vocaloids']
    profileImg= json_data['profileImg']
    # add new entry to array with 
    # a new id and the values the user sent in JSON
    p_id += 1
    new_producer_entry = {
        "id": p_id,
        "name": name,
        "startYear": startYear,
        "songNum": songNum,
        "desc": desc,
        "vocaloids": vocaloids,
        "profileImg": profileImg
    }
    producers.append(new_producer_entry)
    #send back the WHOLE array of data, so the view can redisplay it
    return jsonify(idVal =  p_id, display_producers= display_producers)


@app.route('/delete_producer', methods=['GET', 'POST'])
def delete_producer():
    global producers

    json_data = request.get_json()   
    id_string = json_data["id"] 
    ids = json_data["id_list"]["search_ids"] 
    id_num = int(id_string)

    # Delete an entry with a matching Id as that in the JSON
    deleted = False
    s= 0
    # print("\n\n ... Deleting ... \n\n")
    while (not deleted and s<len(producers) ):
        if (producers[s]['id']== id_num):
            del producers[s]
        s+=1
    return jsonify(display_producers= display_producers)


if __name__ == '__main__':
   app.run(debug = True)




