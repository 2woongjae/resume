define(function (require) {
    "use strict";

    var dartAnimation = (function () {

        var dartnum = 0;

        var dartRemoveTime = 1000*30;

        var shoot = function (_color, dom, _x, _y) {

            var id = "Dart" + dartnum;

            if (_color === "green") {

                $(dom).append(" <div id='" + id + "'style='position:absolute; top:" + (_y-110) + "px;left:" + (_x-235) + "px; width:500px; height:510px;background-image:url(./images/dartview/dart_green.png); '></div>");

                animation(id, greenDart, false);

            } else {

                $(dom).append(" <div id='" + id + "'style='position:absolute; top:" + (_y - 110) + "px;left:" + (_x - 235) + "px; width:500px; height:510px;background-image:url(./images/dartview/dart_red.png); '></div>");

                animation(id, redDart, false);

            }

            setTimeout(function () {

                $("#" + id).remove();

            }, dartRemoveTime);

            dartnum++;

            if (dartnum == 1000) dartnum = 0;

        };

        var greenDart = {

            url: "./images/dartview/dart_green.png",
            width: -500,
            framenumber: 9,
            currentframe: 0,
            rate: 15

        };

        var redDart = {

            url: "./images/dartview/dart_red.png",
            width: -500,
            framenumber: 9,
            currentframe: 0,
            rate: 15

        };

        var anihandles = {};

        var setFrame = function (_id, _obj) {

            $("#" + _id).css("background-position", "" + _obj.currentframe * _obj.width + "px 0px");

        };

        var animation = function (_id, _obj, loop) {

            if (anihandles[_id]) clearInterval(anihandles[_id]);

            if (_obj.framenumber > 1) {

                anihandles[_id] = setInterval(function () {

                    _obj.currentframe++;

                    if (loop == false && (_obj.currentframe == _obj.framenumber)) {

                        clearInterval(anihandles[_id]);

                        anihandles[_id] = false;

                    } else {

                        _obj.currentframe %= _obj.framenumber;

                        setFrame(_id, _obj);

                    }

                }, _obj.rate);

            }

        };

        var addImage = function (url) {

            if ($.inArray(url, imagesToPreload) < 0) imagesToPreload.push();

            imagesToPreload.push(url);
        };

        var imagesToPreload = [];

        var startPreloading = function (endCallback, progressCallback) {

            var images = [];

            var total = imagesToPreload.length;

            for (var i = 0; i < total; i++) {

                var image = new Image();

                images.push(image);

                image.src = imagesToPreload[i];

            }

            var preloadingPoller = setInterval(function () {

                var counter = 0;

                var total = imagesToPreload.length;

                for (var i = 0; i < total; i++) {

                    if (images[i].complete) counter++;

                }

                if (counter == total) {

                    clearInterval(preloadingPoller);

                    endCallback();

                } else {

                    if (progressCallback) {

                        count++;

                        progressCallback((count / total) * 100);

                    }

                }

            }, 100);

        };

        return {

            shoot: shoot

        };

    }());

    return dartAnimation;

});