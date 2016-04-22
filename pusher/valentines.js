(function (document, Pusher) {

    var valentines = document.getElementById('valentines');
    var heart = document.getElementById('heart');
    var circle = document.getElementById('circle');

    var ended = false;

    var bodyClassNames = ['start', 'end', 'reset'];
    var setBodyClass = function (classNameToSet) {
        if (classNameToSet) {
            if (bodyClassNames.indexOf(classNameToSet) === -1) {
                throw new Error('setBodyClass: className ' + classNameToSet + ' not in bodyClassNames: ' + bodyClassNames.join(', '));
            }
            document.body.classList.add(classNameToSet);
        }
        bodyClassNames.forEach(function (className) {
            if (className !== classNameToSet) {
                document.body.classList.remove(className);
            }
        });
    };

    var setTransitionDuration = function (element, durationCSS) {
        if (!durationCSS) {
            durationCSS = null;
        }
        element.style.transitionDuration = durationCSS;
        element.style.webkitTransitionDuration = durationCSS;
        element.style.mozTransitionDuration = durationCSS;
    };

    var start = function (durationCSS) {
        setBodyClass('start');
        document.body.classList.remove('beat');
        setTransitionDuration(heart, durationCSS);
    };
    var end = function () {
        setBodyClass('end');
        setTransitionDuration(heart, null);
        ended = true;
    };
    var reset = function (backToBeginning) {
        setBodyClass(backToBeginning ? null : 'reset');
        setTransitionDuration(heart, null);
    };
    var resetBackToBeginning = function () {
        reset(true);
    };
    var beat = function () {
        document.body.classList.add('beat');
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
    var delay = 1000; // overrides css transition-delay
    var delayCSS = delay + 'ms';
    // Mouse or touch events.
    var eventIn = 'mousedown';
    var eventOut = 'mouseup';
    if ('ontouchstart' in window) {
        eventIn = 'touchstart';
        eventOut = 'touchend';
    }

    var completed = false;
    var running = false;

    var heartStart = function () {
        completed = false;
        running = true;
        start(delayCSS);
        timeout = window.setTimeout(function () {
            completed = true;
            running = false;
            end();
        }, delay);
    };
    var heartEnd = function () {
        window.clearTimeout(timeout);
        reset();
    };
    var heartBeat = function () {
        beat();
    };

    var startPusher = function () {
        document.body.classList.add('no-force-touch');
    };
    var cancelPusher = function () {
        heartEnd();
    };
    var resetPusher = function () {
        resetBackToBeginning();
    };

    // http://button.pusher.io/
    var pusher = new Pusher('087e104eb546157304a9', {cluster:'eu'});
    var pusherButton = pusher.subscribe('button');

    var timer = {};

    pusherButton.bind('press', function (data) {
        timer.start = Date.now();
        if (completed) {
            completed = false;
            return;
        }
        heartStart();
        startPusher();
    });
    pusherButton.bind('release', function (data) {
        timer.end = Date.now();
        if (completed) {
            return;
        } else if (running) {
            if (timer.end - timer.start <= 500) {
                heartBeat();
            }
            cancelPusher();
        } else {
            resetPusher();
        }
    });

    // Finish loading. A function in the event queue will only be processed
    // once every other bit of JavaScript here has run.
    window.setTimeout(function () {
        document.getElementById('main').style.display = '';
        document.getElementById('loading').style.display = 'none';
    }, 1000);

}(window.document, window.Pusher));
