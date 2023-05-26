var muted = false;
var canvas = document.getElementById("strmplyr");
var ctx = canvas.getContext("2d");
var videoContainer;
var video = document.createElement("video"); // create a video element


var videoSrc = "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"
if (video.canPlayType('application/vnd.apple.mpegurl')) {
    alert('HLS Unsupported')
        // canvas.remove()
        // video.controls = true

    // document.body.appendChild(video)

    // video.src = videoSrc;

    var mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', function() {
        alert('sourceopen')
        var sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');

        fetch(videoSrc)
            .then(function(response) {
                let div = document.createElement('div')
                div.innerHTML = 'Response:' + JSON.stringify(response.text())
                document.body.appendChild(div)

                return response.text();
            })
            .then(function(data) {
                let div = document.createElement('div')
                div.innerHTML = 'Data:' + JSON.stringify(data)
                document.body.appendChild(div)

                sourceBuffer.appendBuffer(data);
            });
    });


    videoContainer = {
        video: video,
        ready: false
    }

    video.onerror = function(e) {
        alert("error occured")
        let div = document.createElement('div')
        div.innerHTML = 'Error:' + e
        document.body.appendChild(div)
    }
    video.oncanplay = readyToPlayVideo;
} else
if (Hls.isSupported()) {
    alert('HLS Supported')
    var hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    videoContainer = {
        video: video,
        ready: false
    }

    video.onerror = function(e) {
        document.body.removeChild(canvas);
        document.body.innerHTML += "<h2>There is a problem loading the video</h2><br>";
        document.body.innerHTML += "Users of IE9+ , the browser does not support WebM videos used by this demo";
        document.body.innerHTML += "<br><a href='https://tools.google.com/dlpage/webmmf/'> Download IE9+ WebM support</a> from tools.google.com<br> this includes Edge and Windows 10";

    }
    video.oncanplay = readyToPlayVideo;
    video.play();
}

function readyToPlayVideo(event) {
    console.log('ReadyToPlay')
    videoContainer.scale = 1;
    videoContainer.ready = true;
    requestAnimationFrame(updateCanvas);
}

function updateCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (videoContainer !== undefined && videoContainer.ready) {

        video.muted = muted;
        var scale = videoContainer.scale;
        var vidH = window.innerHeight;
        var vidW = window.innerWidth;
        var top = canvas.height / 2 - (vidH / 2) * scale;
        var left = canvas.width / 2 - (vidW / 2) * scale;

        ctx.drawImage(videoContainer.video, left, top, vidW * scale, vidH * scale);
        drawPlayIcon();

        if (videoContainer.video.paused) {
            // drawPlayIcon();
        }
    }


    requestAnimationFrame(updateCanvas);
}

function drawPlayIcon() {

    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "yellow";
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    var size = (canvas.height / 2) * 0.1;
    ctx.moveTo(canvas.width / 2 + size / 2, canvas.height / 2);
    ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 + size);
    ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 - size);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
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

canvas.addEventListener("click", playPauseClick);