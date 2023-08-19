from PIL import Image
from io import BytesIO
import base64
import weaviate
from transformers import CLIPProcessor, CLIPModel
import numpy as np
from weaviate.util import generate_uuid5

client = weaviate.Client(url="https://2cd4-182-79-4-252.ngrok-free.app")



checkpoint = "patrickjohncyh/fashion-clip"

model = CLIPModel.from_pretrained(checkpoint)
processor = CLIPProcessor.from_pretrained(checkpoint)

def getRanking(original_vector , products , user_profile):
    text_rank = text_based_rank(original_vector , products)
    popularity_rank = rank_by_popularity(products)
    user_vector = getUserProfile(user_profile)["vector"]
    user_rank = rank_by_userprofile(user_vector , products)
    combine_tuples = combineTuples(text_rank , popularity_rank , user_rank)
    rrf_rank = reciprocal_rank_fusion(combine_tuples , [0.4, 0.25, 0.1, 0.25])
    return rrf_rank

def getUserProfile(user_profile):
    user_profile_top = client.data_object.get_by_id(
    uuid=generate_uuid5(user_profile),
    class_name="Customer_Profile",
    with_vector=True
    )
    return user_profile_top

def text_based_rank(original_vector, products):
    product_text_embeddings = {}
    for i, product in enumerate(products):
        product_text_embedding = getTextEmbeddings(f"Name: {product['product']}, Color: {product['colour']}, Fit: {product['fit']}, Type: {product['type']}")
        product_text_embeddings[i] = product_text_embedding.tolist()[0]
    cosine_similarities = {}
    for i, embedding in product_text_embeddings.items():
        cosine_similarities[i] = cosine_similarity(original_vector, embedding).tolist()[0][0]
    cosine_similarity_ranking = sorted(cosine_similarities.items(), key=lambda x: x[1], reverse=True)
    rank_tuples = []
    for i, (rank, _) in enumerate(cosine_similarity_ranking):
        rank_tuples.append((i, rank))
    return rank_tuples

def rank_by_popularity(products):
    popularity_scores = {}
    for i, product in enumerate(products):
        popularity_scores[i] = (float(product["rating"]))**2 * product["numberRatings"]
    popularity_rank = sorted(popularity_scores.items(), key=lambda x: x[1], reverse=True)
    rank_tuples = []
    for i, (rank, _) in enumerate(popularity_rank):
        rank_tuples.append((i, rank))
    return rank_tuples

def rank_by_userprofile(user_top_vector, products):
    product_scores = {}
    for i, product in enumerate(products):
        product_scores[i] = cosine_similarity(user_top_vector, product["_additional"]["vector"]).tolist()[0][0]
    product_score_rank = sorted(product_scores.items(), key=lambda x: x[1], reverse=True)
    rank_tuples = []
    for i, (rank, _) in enumerate(product_score_rank):
        rank_tuples.append((i, rank))
    return rank_tuples

def combineTuples(text_rank, popularity_rank, user_rank):
    combined_rank = {}
    for i in range(len(text_rank)):
        combined_rank[i] = [i, text_rank[i][1], popularity_rank[i][1], user_rank[i][1]]
    return combined_rank

def reciprocal_rank_fusion(combine_tuples, weights):
    fused = {}
    for key, value in combine_tuples.items():
        fused_score = sum(weights[i] * (1 / (val + 1)) for i, val in enumerate(value))
        fused[key] = fused_score
    fused_ranking = sorted(fused.items(), key=lambda x: x[1], reverse=True)
    rrf_rank = {}
    for i, (rank, _) in enumerate(fused_ranking):
        rrf_rank[i] = rank
    return rrf_rank



def getTextEmbeddings(text):
	inputs = processor(text=text , images=Image.new('RGB' , (72 , 72)), return_tensors="pt", padding=True)
	outputs = model(**inputs , return_dict=True)
	return outputs["text_embeds"]

def getTopAndBottomEmbeddings(embeddings):
	response = (
    client.query
    .get("PinterestImages", [ "top {... on PinterestTop {_additional {vector} }}" , "bottom {... on PinterestBottom { _additional {vector} }}"])
    .with_near_vector({"vector" : embeddings.tolist()[0]})
    .with_additional(["vector"])
    .with_limit(5)
    .do())

	top_embedding = weightedMeanPoolTopEmbeddings(response , embeddings)
	bottom_embedding = weightedMeanPoolBottomEmbeddings(response , embeddings)

	return top_embedding , bottom_embedding

def getProducts(embedding):
	return (
    client.query
    .get("FlipkartNoSegProducts",["uRL", "brand", "category", "product", "price", "rating", "numberRatings", "colour", "brand", "image", "fit", "type"])
    .with_near_vector({"vector" : embedding})
    .with_additional(["vector"])
    .with_limit(12)
    .do()
	)


def weightedMeanPoolTopEmbeddings(response , embeddings):
	list_of_embeddings = []
	for i in range(len(response["data"]["Get"]["PinterestImages"])):
		top_embedding = response["data"]["Get"]["PinterestImages"][i]["top"][0]['_additional']["vector"]
		list_of_embeddings.append(top_embedding)

	list_of_embeddings.append(embeddings.tolist()[0])
	weights = [0.07, 0.07, 0.07, 0.07, 0.07, 0.65]
	weighted_mean = weighted_mean_pooling(list_of_embeddings, weights)
	return weighted_mean

def weightedMeanPoolBottomEmbeddings(response , embeddings):
	list_of_embeddings = []
	for i in range(len(response["data"]["Get"]["PinterestImages"])):
		bottom_embedding = response["data"]["Get"]["PinterestImages"][i]["bottom"][0]['_additional']["vector"]
		list_of_embeddings.append(bottom_embedding)

	list_of_embeddings.append(embeddings.tolist()[0])
	weights = [0.07, 0.07, 0.07, 0.07, 0.07, 0.65]
	weighted_mean = weighted_mean_pooling(list_of_embeddings, weights)
	return weighted_mean

def weighted_mean_pooling(vector_list, weight_list):
    vectors_array = np.array(vector_list)
    weights_array = np.array(weight_list)
    weighted_sum = np.sum(vectors_array * weights_array[:, np.newaxis], axis=0)
    sum_of_weights = np.sum(weights_array)
    weighted_mean = weighted_sum / sum_of_weights
    return weighted_mean

def cosine_similarity(vector1, vector2):
    vector1 = np.array(vector1)
    vector1 = vector1.reshape(1, -1)
    vector2 = np.array(vector2)
    vector2 = vector2.reshape(-1, 1)
    dot_product = np.dot(vector1, vector2)
    norm1 = np.linalg.norm(vector1)
    norm2 = np.linalg.norm(vector2)
    return dot_product / (norm1 * norm2)