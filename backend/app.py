#No of endpoints required:-

#Get text and return the query result

#Get image and get the query result

#Make two endpoints for the above two tasks using flask
import flask
from flask import request, jsonify
from PIL import Image
from io import BytesIO
import base64
import weaviate
from transformers import CLIPProcessor, CLIPModel
import helper as h


app = flask.Flask(__name__)




@app.route('/query', methods=['GET'])
def getQuery():
	query = request.json['query']

	#get TextEmbeddings

	embedding = h.getTextEmbeddings(query)
	top_embedding , bottom_embedding = h.getTopAndBottomEmbeddings(embedding)
	top_products = h.getProducts(top_embedding)
	bottom_products = h.getProducts(bottom_embedding)
	ranking_top = h.getRanking(embedding.tolist()[0] , top_products["data"]["Get"]["FlipkartNoSegProducts"] , "Female Profile 1 Top") 
	ranking_bottom = h.getRanking(embedding.tolist()[0] , bottom_products["data"]["Get"]["FlipkartNoSegProducts"] , "Female Profile 1 Bottom") 

	top3top  = []
	for i in range(3):
		top3top.append(top_products["data"]["Get"]["FlipkartNoSegProducts"][i])
	# make it a different function
	# for key, value in ranking_top.items():
	# 	try:
	# 		if key == 3: break
	# 		top3top.append(top_products["data"]["Get"]["FlipkartNoSegProducts"][value])
			
	# 	except:
	# 		pass

	top3bottom  = []
	for i in range(3):
		top3bottom.append(bottom_products["data"]["Get"]["FlipkartNoSegProducts"][i])
	# for key, value in ranking_top.items():
	# 	try:
	# 		if key == 3: break
	# 		top3bottom.append(bottom_products["data"]["Get"]["FlipkartNoSegProducts"][value])
			
	# 	except:
	# 		pass
	
	response = {
		"message" : "Here are some outfits for you!",
	}

	outfits = []
	gender = "female"
	for i in range(3):
		top_title = top3top[i]["product"]
		bottom_title = top3bottom[i]["product"]
		outfit = {
			"prompt" : f"full-body potrait of {gender} model wearing {top_title} and {bottom_title} having white background day lighting 2k resolution",
			"top" : {"title" : top_title, "image" : top3top[i]["image"] , "price" : top3top[i]["price"] , "link" : top3top[i]["uRL"]},
			"bottom" : {"title" : bottom_title , "image" : top3bottom[i]["image"] , "price" : top3bottom[i]["price"] , "link" : top3bottom[i]["uRL"]}
		}
		outfits.append(outfit)

	response["outfits"] = outfits

	

	return jsonify(response)


@app.route('/image', methods=['GET'])
def getImage():
	image = request.json['image']

	return jsonify({'image': image, 'reply': "Here are some outfits for you!" , "components": [ 
		{
		"image": image,
		"price": 1000,
		"link": "https://www.amazon.in/",
		"title": "T-shirt",
		},

		{
		"title": "Jeans",
		"image": image,
		"price": 500,
		"link": "https://www.amazon.in/",
		},
	]})


if __name__ == '__main__':
	app.run(debug=True)
