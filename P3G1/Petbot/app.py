from flask import Flask, render_template, request
# Using Python modules chatterbot to develop our petbot
# We used this documentation in order to train our chatterbot https://chatterbot.readthedocs.io/en/stable/tutorial.html
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

app = Flask(__name__)

my_bot = ChatBot(name='PyBot',storage_adapter="chatterbot.storage.SQLStorageAdapter")
trainer = ListTrainer(my_bot)

main_list = []

# function to read files
def readFile(inputfile):
    fh = open(inputfile, 'r')
    ft = fh.read()
    fl = ft.split("\n")
    return list(fl)

intro_list = readFile("./Data/intro.txt")
breeds_list = readFile("./Data/all.txt")
main_list = intro_list + breeds_list
#print("main list")
#print(main_list)

# using the trainer to train the petbot
trainer.train(main_list)

@app.route("/")
def home():
    return render_template("index.html")

#usage: http://127.0.0.1:5000/get?msg=Petbot
# REST API route and used in the Frontend HTML
@app.route("/get")
def get_bot_response():
    if request.method == 'GET':
        if request.args.get('msg'):
            user_input = request.args.get('msg')
            print("User =  " + user_input )
            bot_response = my_bot.get_response(user_input)
            # checking to see if response has a 10 % match 
            if bot_response.confidence > 0.1:
                bot_response = str(bot_response)
                print("bot_response = "+ bot_response)
                return str(my_bot.get_response(user_input))   
            else: 
                return("error")      
        else:
            return("invalid request.")
            

if __name__ == "__main__":
    app.run()