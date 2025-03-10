// Select elements
const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const downloadVideoButton = document.getElementById('downloadVideo');
const videoElement = document.getElementById('video');
const videoTextInput = document.getElementById('videoText');

let mediaRecorder;
let audioChunks = [];
let videoStream;
let audioStream;
let finalVideoBlob;

// Start recording audio
startRecordingButton.addEventListener('click', async () => {
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;

    // Get user media
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });

    const audioTrack = audioStream.getAudioTracks()[0];
    const videoTrack = videoStream.getVideoTracks()[0];

    // Combine video and audio tracks
    const mediaStream = new MediaStream([audioTrack, videoTrack]);
    videoElement.srcObject = mediaStream;

    // Record audio
    mediaRecorder = new MediaRecorder(audioStream);
    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        // Combine the audio and video into a single video blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        audioChunks = [];

        const videoBlob = new Blob([videoStream], { type: 'video/webm' });

        // Merge audio and video
        const videoWithAudioBlob = new Blob([videoBlob, audioBlob], { type: 'video/webm' });

        finalVideoBlob = videoWithAudioBlob;
        const videoUrl = URL.createObjectURL(finalVideoBlob);
        videoElement.src = videoUrl;

        // Enable download button
        downloadVideoButton.disabled = false;
    };

    mediaRecorder.start();
});

// Stop recording
stopRecordingButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
});

// Download video
downloadVideoButton.addEventListener('click', () => {
    if (finalVideoBlob) {
        const url = URL.createObjectURL(finalVideoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video_with_audio.webm';
        a.click();
        URL.revokeObjectURL(url);
    }
});
