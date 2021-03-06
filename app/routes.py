from app import app
from flask import jsonify
from flask import request
import re
from bs4 import BeautifulSoup
import requests

#Get a list of all comics matching search term from duckduckgo and return a list
@app.route("/getcomic/<string:search_query>", methods=['GET'])
def get_comic_list(search_query):
    # search_query = input("xkcd to search for? ")

    url = "https://duckduckgo.com/html/?q=site%3Axkcd.com%20" + search_query

    data = requests.get(url)

    #Initialize our soup object from our HTML results (or local file)
    soup = BeautifulSoup(data.text, 'html.parser')

    #Use BeautifulSoup to parse through the entire HTML and return the specific anchor tags we're looking for
    result_urls = soup.find_all('a', {'class': 'result__url'})

    #Results from our regex matches
    regex_results = []

    #Loop through all the anchor tags we captured and apply some regex to get the text we want, then push that to our results list
    for result in result_urls:
        x = re.findall("xkcd.com/(\d+)/", str(result))
        print(regex_results)
        #Check if regex matched
        if x and x[0] not in regex_results:
            regex_results.append(x[0])
    response = jsonify(regex_results)
    return response

#Get JSON object of a single comic
@app.route("/comic/<int:comic_number>", methods=['GET'])
def get_single_comic(comic_number):
        url = "https://dynamic.xkcd.com/api-0/jsonp/comic/" + str(comic_number)
        comic = requests.get(url).json()
        return jsonify(comic)

######################## SLACK TEST################################
@app.route("/helloworld", methods=["POST"])
def hello_world():
        print(request.form['text'])
        return jsonify({
                "response_type": "in_channel",
                "text": "Hello World, I'm alive!"
        })


@app.route("/solocomic", methods=['POST'])
def get_solo_comic():
        print(request.form['text'])
        url = "https://dynamic.xkcd.com/api-0/jsonp/comic/" + request.form['text']
        comic = requests.get(url).json()
        print(comic['img'])

        returnComic = {
            "blocks": [
                {
                    "type": "image",
                    "image_url": comic['img'],
                    "alt_text": comic['title']
                }
            ]
        }
        comicObject = jsonify(returnComic)
        return comicObject
