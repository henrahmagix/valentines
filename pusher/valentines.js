(function (document, Pusher) {

    var valentines = document.getElementById('valentines');
    var heart = document.getElementById('heart');
    var circle = document.getElementById('circle');

    var ended = false;

    var start = function () {
        document.body.classList.add('start');
        document.body.classList.remove('end', 'reset');
    };
    var end = function () {
        document.body.classList.add('end');
        document.body.classList.remove('start', 'reset');
        ended = true;
    };
    var reset = function () {
        document.body.classList.add('reset');
        document.body.classList.remove('start', 'end');
    };

    // Load icon svgs inline so they can be styled and not a font.
    var iconsPath = '../lib/Font-Awesome-SVG-PNG/black/svg/';
    var loadFontIcon = function (name, element) {
        var icon = iconsPath + name + '.svg';
        var id = 'fa-' + name;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', icon, true);
        xhr.onload = function (event) {
            var icon = xhr.responseXML.documentElement;
            icon.id = id;
            icon.classList.add(id);
            element.appendChild(icon);
        };

        // Following line is just to be on the safe side;
        // not needed if your server delivers SVG with correct MIME type
        xhr.overrideMimeType('image/svg+xml');
        xhr.send('');
    };

    loadFontIcon('heart', heart);
    loadFontIcon('heart-o', heart);

    // Without force touch.
    var timeout;
    var delay = 2000; // 2 seconds
    // Mouse or touch events.
    var eventIn = 'mousedown';
    var eventOut = 'mouseup';
    if ('ontouchstart' in window) {
        eventIn = 'touchstart';
        eventOut = 'touchend';
    }

    var heartStart = function () {
        start();
        timeout = window.setTimeout(function () {
            endNoForceTouch();
            end();
        }, delay);
    };
    var heartEnd = function () {
        window.clearTimeout(timeout);
        reset();
    };

    var startNoForceTouch = function () {
        document.body.classList.add('no-force-touch');
        valentines.addEventListener(eventIn, heartStart, false);
        valentines.addEventListener(eventOut, heartEnd, false);
    };
    var endNoForceTouch = function () {
        valentines.removeEventListener(eventIn, heartStart);
        valentines.removeEventListener(eventOut, heartEnd);
    };
    var cancelNoForceTouch = function () {
        heartEnd();
        endNoForceTouch();
    };

    // http://button.pusher.io/
    var pusher = new Pusher('087e104eb546157304a9', {cluster:'eu'});
    var pusherButton = pusher.subscribe('button');

    pusherButton.bind('press', function(data) {
        heartStart();
        startNoForceTouch();
    });
    pusherButton.bind('release', function(data) {
      cancelNoForceTouch();
    });

    // Finish loading. A function in the event queue will only be processed
    // once every other bit of JavaScript here has run.
    window.setTimeout(function () {
        document.getElementById('main').style.display = '';
        document.getElementById('loading').style.display = 'none';
    }, 1000);

}(window.document, window.Pusher));
