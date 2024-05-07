from transformers import pipeline
from fastapi.responses import JSONResponse

def summarize(transcribed_text):
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    summarized_text = summarizer(transcribed_text, max_length=130, min_length=30, do_sample=False)
    return JSONResponse(content= {"summarized_text" : summarized_text[0]['summary_text'] })
