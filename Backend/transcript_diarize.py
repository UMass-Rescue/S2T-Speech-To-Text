from datasets import load_dataset
from datasets import Audio
from pyannote.audio import Pipeline
from transformers import pipeline
from diarize import ASRDiarizationPipeline
import torch
import os
import csv

#setting up
device = "cuda" if torch.cuda.is_available() else "cpu"

def tuple_to_string(start_end_tuple, ndigits=1):
    return str((round(start_end_tuple[0], ndigits), round(start_end_tuple[1], ndigits)))

def format_as_transcription(raw_segments):
    return "\n\n".join(
        [
            chunk["speaker"] + " " + tuple_to_string(chunk["timestamp"]) + chunk["text"]
            for chunk in raw_segments
        ]
    )

def read_filenames_and_write_to_csv(folder_path, csv_file_path):
    with open(csv_file_path, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['file_name', 'transcription'])
        for filename in os.listdir(folder_path):
            if os.path.isfile(os.path.join(folder_path, filename)) and filename != "metadata.csv":
                csv_writer.writerow([filename, ""])

def createMetaData():
    print("Creating metadata.csv file before loading dataset...")
    if os.path.exists("../audioData/metadata.csv"):
        os.remove("../audioData/metadata.csv")
    read_filenames_and_write_to_csv("../audioData","../audioData/metadata.csv")

def load_data():
    #load dataset
    createMetaData()
    print("Loading dataset...")
    dataset = load_dataset("audiofolder", data_dir="../audioData")
    dataset = dataset.cast_column("audio",Audio(sampling_rate=16_000))
    dataset = dataset['train']
    return dataset

def diarize():
    print("Loading Pyannote model...")
    diarization_pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        use_auth_token="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")
    print("Loading Whisper model...")
    asr_pipeline = pipeline(
        "automatic-speech-recognition",
        model="openai/whisper-small"
    )
    output_dict = {}
    dataset = load_data()
    iterator = iter(dataset) 
    count=0
    while True:
        try:
            sample = next(iterator)
            file_name = sample["audio"]["path"].split("\\")[-1]
            print("Generating Speaker Diarized Transcript...")
            asr_diarization_pipeline = ASRDiarizationPipeline(
                asr_pipeline=asr_pipeline, diarization_pipeline=diarization_pipeline
            )
            outputs = asr_diarization_pipeline(sample["audio"].copy())
            output_dict[count] = {"file_name":file_name,"transcript":format_as_transcription(outputs)}
            count +=1
        except StopIteration:
            break
    return output_dict