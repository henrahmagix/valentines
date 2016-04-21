(function (document, Pressure) {

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
    var iconsPath = 'lib/Font-Awesome-SVG-PNG/black/svg/';
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

    var startForceTouch = function () {
        document.body.classList.add('force-touch');
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

    // With force touch.
    var styleForceValue = function (forceValue) {
        // Style the circle and heart like iOS 9+ 3d touch.
        // Copied from https://github.com/freinbichler/3d-touch/blob/e8f606284c2e08b039b3a2e595c4d6b1e2e52055/3dtouch.js#L47-L48
        heart.style.webkitTransform = 'translateX(-50%) translateY(-50%) scale(' + (1 + forceValue * 1.5) + ')';
        circle.style.webkitFilter = 'blur(' + forceValue * 30 + 'px)';
    };

    // Pressure.js http://yamartino.github.io/pressure/
    var isSetup = false;
    Pressure.set(valentines, {
        start: function (event) {
            if (ended) {
                return;
            }
            if (!isSetup) {
                startForceTouch();
            }
            start();
        },
        end: function (event) {
            if (ended) {
                return;
            }
            styleForceValue(0);
            reset();
        },
        change: function (forceValue, event) {
            if (ended) {
                return;
            }
            styleForceValue(forceValue);
            if (forceValue >= 0.95) {
                end();
            }
        },
        unsupported: function () {
            // Use non-force-touch functions.
            if (!isSetup) {
                // Only run once.
                heartStart();
                startNoForceTouch();
            }
            isSetup = true;
        }
    });

    // Finish loading. A function in the event queue will only be processed
    // once every other bit of JavaScript here has run.
    window.setTimeout(function () {
        document.getElementById('main').style.display = '';
        document.getElementById('loading').style.display = 'none';
    }, 1000);

}(window.document, window.Pressure));
