define(function (require) {
    "use strict";

    var VideoPanel = (function () {

        var dom = $("#VideoPanel"),
            domVideoList = null;

        var app = null;

        var updateView = function () {

            var index = app.getIndex();
          
            for (var i = 0; i < domVideoList.length; i++) {

                if (i == index) {

                    $(domVideoList[i]).stop(true, false).fadeIn();

                    domVideoList[i].play();

                } else {

                    $(domVideoList[i]).stop(true, true).fadeOut(function () {

                        if (domVideoList[i] !== undefined) {

                            domVideoList[i].currentTime = 0;

                        }

                    });

                    domVideoList[i].pause();

                }
            }
        };

        var pauseVideo = function () {
            var index = app.getIndex();
            if (domVideoList) domVideoList[index].pause();
        };

        var playVideo = function () {
            var index = app.getIndex();
            if (domVideoList) domVideoList[index].play();
        };

        var makeDom = function (state) {

            var movieDB = app.getMovieDB();

            for (var i = 0; i < movieDB.length; i++) {

                var item = movieDB[i];

                dom.append(toStaticHTML("<video class=\"video\" id=\"video" + i + "\" src=\"" + app.getRootPath() + item.video_url + "\"></video>"));

            }

            domVideoList = dom.find(".video");

            for (var i = 0; i < domVideoList.length; i++) {

                domVideoList[i].load();
                domVideoList[i].volume = 0.8;

                domVideoList[i].onended = function () {

                    app.nextIndex(false);

                }

            }

            updateView();

        };

        var setApp = function (_app) {

            app = _app;

        };

        return {

            updateView: updateView,
            makeDom: makeDom,
            pauseVideo: pauseVideo,
            playVideo: playVideo,
            setApp: setApp

        };

    }());

    return VideoPanel;

});