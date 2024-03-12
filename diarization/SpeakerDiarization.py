import torch
device = "cuda" if torch.cuda.is_available() else "cpu"
print(device)
from pyannote.audio import Pipeline
pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    use_auth_token="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")

# send pipeline to GPU (when available)
pipeline.to(torch.device(device))

# apply pretrained pipeline
diarization = pipeline("audio.mp3")

# print the result
for turn, _, speaker in diarization.itertracks(yield_label=True):
    print(f"start={turn.start:.1f}s stop={turn.end:.1f}s speaker_{speaker}")
# start=0.2s stop=1.5s speaker_0
# start=1.8s stop=3.9s speaker_1
# start=4.2s stop=5.7s speaker_0
# ...