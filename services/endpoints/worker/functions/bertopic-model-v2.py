import json
from bertopic import BERTopic

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/PdfToVid/services/files/generated/test_data/arxiv-papers.json', 'r') as file:
    data = json.load(file)

# Extract abstracts from the data
abstracts = [paper['abstract'] for paper in data]

# Initialize BERTopic
topic_model = BERTopic()

print('fitting the model...')

# Fit the model to the abstracts and retrieve topics
topics, _ = topic_model.fit_transform(abstracts)

print('retrieving topic info...')

# Prepare the output data
output_data = []
for paper, topic in zip(data, topics):
    paper_output = {
        "id": paper["id"],
        "title": paper["title"],
        # "abstract": paper["abstract"],
        # "pdfLink": paper["pdfLink"],
        "topic": topic,
        "topic_words": topic_model.get_topic(topic)
    }
    output_data.append(paper_output)

# Write the output data to a new JSON file
output_path = '/Users/spankyed/Develop/Projects/PdfToVid/services/files/generated/test_data/topics_output.json'
with open(output_path, 'w') as output_file:
    json.dump(output_data, output_file, indent=4)

print(f"Topics written to {output_path}")
