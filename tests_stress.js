window.onload = function() {

    var statusDiv = document.getElementById('status');
    var imagesDiv = document.getElementById('images');
    var canvasAnimation = document.getElementById('animation');
    var width = canvasAnimation.offsetWidth;
    var height = canvasAnimation.offsetHeight;
    var lastTraceLogTimestamp = 0;
    var lastCaptureTime = 0;

    var ctxAnimation = canvasAnimation.getContext('2d');
    var textColors = ['black', 'white'];
    var iterations = 0;

    ctxAnimation.textAlign = 'center';
    ctxAnimation.textBaseline = 'middle';
    ctxAnimation.font = '12px arial';

    captureGIF();

    function captureGIF() {

        var now = Date.now();

        if(iterations >= 50) {
            return;
        }

        setStatus('capturing GIF ' + now + ' iteration = ' + iterations);

        var elapsed = lastCaptureTime > 0 ? ((now - lastCaptureTime) / 1000).toFixed(2) : 0;
        lastCaptureTime = now;

        var color;
        
        if(elapsed > 1) { 
            color = 'red';
            console.log('TOO SLOW! on the ' + iterations + ' == ' + elapsed + ' seconds');
        } else {
            color = ( (Math.random() * 0xFFFF) | 0).toString(16);
            while(color.length < 6) {
                color = '0' + color;
            }
            color = '#' + color;
        }

        // Draw in the canvas
        ctxAnimation.fillStyle = color;
        ctxAnimation.fillRect(0, 0, width, height);

        textColors.forEach(function(txtColor, offset) {
            ctxAnimation.fillStyle = txtColor;
            ctxAnimation.fillText(elapsed, width / 2 - offset, height / 2 - offset);
        });


        // Make a one-frame GIF
        var ag = new Animated_GIF({ repeat: null, workerPath: 'dist/Animated_GIF.worker.js' });
        ag.setSize(width, height);
        ag.addFrame(canvasAnimation);

        ag.getBase64GIF(function(gif) {
            var img = document.createElement('img');
            img.src = gif;
            imagesDiv.appendChild(img);
            setTimeout(captureGIF, 10);
        });

        iterations++;

    }

    function setStatus(msg) {
        statusDiv.innerHTML = msg;
    }

};