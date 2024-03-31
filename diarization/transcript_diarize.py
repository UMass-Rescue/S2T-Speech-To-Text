from datasets import load_dataset
from datasets import Audio
from pyannote.audio import Pipeline
from transformers import pipeline
from diarize import ASRDiarizationPipeline
import torch

#setting up
device = "cuda" if torch.cuda.is_available() else "cpu"
path_to_audio_data = "../audioData"

def tuple_to_string(start_end_tuple, ndigits=1):
    return str((round(start_end_tuple[0], ndigits), round(start_end_tuple[1], ndigits)))


def format_as_transcription(raw_segments):
    return "\n\n".join(
        [
            chunk["speaker"] + " " + tuple_to_string(chunk["timestamp"]) + chunk["text"]
            for chunk in raw_segments
        ]
    )

#load dataset
print("Loading dataset...")
dataset = load_dataset("audiofolder",data_dir=path_to_audio_data)
dataset = dataset.cast_column("audio",Audio(sampling_rate=16_000))
dataset = dataset['train']
sample = next(iter(dataset))

#pyannote stuff
print("Loading Pyannote model...")
diarization_pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    use_auth_token="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")

#print("Speaker Diarization...")
#input_tensor = torch.from_numpy(sample["audio"]["array"][None, :]).float()
# outputs = diarization_pipeline(
#     {"waveform": input_tensor, "sample_rate": sample["audio"]["sampling_rate"]}
# )

#Whisper stuff
print("Loading Whisper model...")
asr_pipeline = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-base"
)
# print("Generating transcript...")
# outputs = asr_pipeline(
#     sample["audio"].copy(),
#     generate_kwargs={"max_new_tokens": 256, "language": "english"},
#     return_timestamps=True
# )
# print(outputs)


#Speechbox stuff
print("Generating Speaker Diarized Transcript...")

pipeline = ASRDiarizationPipeline(
    asr_pipeline=asr_pipeline, diarization_pipeline=diarization_pipeline
)

outputs = pipeline(sample["audio"].copy())
print(format_as_transcription(outputs))
