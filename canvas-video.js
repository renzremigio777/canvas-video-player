// This code is from the example document on stackoverflow documentation. See HTML for link to the example.
// This code is almost identical to the example. Mute has been added and a media source. Also added some error handling in case the media load fails and a link to fix IE9+ and Edge support.
// Code by Blindman67.


// Original source has returns 404
// var mediaSource = "http://video.webmfiles.org/big-buck-bunny_trailer.webm";
// New source from wiki commons. Attribution in the leading credits.
// var mediaSource = "http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv"
// var mediaSource = "http://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8"
var mediaSource = "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"

var muted = false;
var canvas = document.getElementById("myCanvas"); // get the canvas from the page
var ctx = canvas.getContext("2d");
var videoContainer; // object to hold video and associated info
var video = document.createElement("video"); // create a video element
canvas.width = innerWidth
canvas.height = innerHeight

if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(mediaSource);
    hls.attachMedia(video);
    video.play();
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = mediaSource;
    video.addEventListener('loadedmetadata', function() {
        video.play();
    });
}

// video.src = mediaSource;
// the video will now begin to load.
// As some additional info is needed we will place the video in a
// containing object for convenience
video.autoPlay = false; // ensure that the video does not auto play
video.loop = true; // set the video to loop.
video.muted = muted;
videoContainer = { // we will add properties as needed
    video: video,
    ready: false,
};
// To handle errors. This is not part of the example at the moment. Just fixing for Edge that did not like the ogv format video
video.onerror = function(e) {
    document.body.removeChild(canvas);
    document.body.innerHTML += "<h2>There is a problem loading the video</h2><br>";
    document.body.innerHTML += "Users of IE9+ , the browser does not support WebM videos used by this demo";
    document.body.innerHTML += "<br><a href='https://tools.google.com/dlpage/webmmf/'> Download IE9+ WebM support</a> from tools.google.com<br> this includes Edge and Windows 10";

}
video.oncanplay = readyToPlayVideo; // set the event to the play function that 
// can be found below
function readyToPlayVideo(event) { // this is a referance to the video
    // the video may not match the canvas size so find a scale to fit
    videoContainer.scale = Math.min(
        canvas.width / this.videoWidth,
        canvas.height / this.videoHeight);
    videoContainer.ready = true;
    // the video can be played so hand it off to the display function
    requestAnimationFrame(updateCanvas);
    // add instruction
    // document.getElementById("playPause").textContent = "Click video to play/pause.";
    // document.querySelector(".mute").textContent = "Mute";
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // only draw if loaded and ready
    if (videoContainer !== undefined && videoContainer.ready) {
        // find the top left of the video on the canvas
        video.muted = muted;
        var scale = videoContainer.scale;
        var vidH = videoContainer.video.videoHeight;
        var vidW = videoContainer.video.videoWidth;
        var top = canvas.height / 2 - (vidH / 2) * scale;
        var left = canvas.width / 2 - (vidW / 2) * scale;
        // now just draw the video the correct size
        ctx.drawImage(videoContainer.video, left, top, vidW * scale, vidH * scale);
        if (videoContainer.video.paused) { // if not playing show the paused screen 
            drawPayIcon();
        }
    }
    // all done for display 
    // request the next frame in 1/60th of a second
    requestAnimationFrame(updateCanvas);
}

function drawPayIcon() {
    ctx.fillStyle = "black"; // darken display
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#DDD"; // colour of play icon
    ctx.globalAlpha = 0.75; // partly transparent
    ctx.beginPath(); // create the path for the icon
    var size = (canvas.height / 2) * .1; // the size of the icon
    ctx.moveTo(canvas.width / 2 + size / 2, canvas.height / 2); // start at the pointy end
    ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 + size);
    ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 - size);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1; // restore alpha
}

function playPauseClick() {
    if (videoContainer !== undefined && videoContainer.ready) {
        if (videoContainer.video.paused) {
            videoContainer.video.play();
        } else {
            videoContainer.video.pause();
        }
    }
}

function videoMute() {
    muted = !muted;
    if (muted) {
        document.querySelector(".mute").textContent = "Mute";
    } else {
        document.querySelector(".mute").textContent = "Sound on";
    }


}
// register the event
canvas.addEventListener("click", playPauseClick);
// document.querySelector(".mute").addEventListener("click", videoMute)