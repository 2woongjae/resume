/*
    
    VideoPanel.js - Video 패널

*/

var VideoPanel = (function () {
    "use strict";

    var dom = $("#VideoPanel"),
        domVideoList = null;

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

    var makeDom = function (state) {

        var movieDB = app.getMovieDB();

        for (var i = 0; i < movieDB.length; i++) {

            var item = movieDB[i];

            dom.append(toStaticHTML("<video class=\"video\" id=\"video" + i + "\" src=\"" + app.rootPath + item.video_url + "\"></video>"));

        }

        domVideoList = dom.find(".video");

        for (var i = 0; i < domVideoList.length; i++) {

            domVideoList[i].load();

            domVideoList[i].onloadstart = function () {

                console.log($(this).attr("id") + " : loadstart");

            }

            domVideoList[i].onloadedmetadata = function () {

                console.log($(this).attr("id") + " : loadedmetadata");

            }

            domVideoList[i].onloadeddata = function () {

                console.log($(this).attr("id") + " : loadeddata ");

            }

            domVideoList[i].oncanplay = function () {
                  
                console.log($(this).attr("id") + " : canplay");
            }

            domVideoList[i].oncanplaythrough = function () {

                console.log($(this).attr("id") + " : oncanplaythrough ");
            }

            domVideoList[i].onwaiting = function () {

                console.log($(this).attr("id") + " : onwaiting ");

            }

            domVideoList[i].onended = function () {

                app.nextIndex();

            }

        }

        updateView();

    };

    return {

        updateView: updateView,
        makeDom: makeDom

    };
       
}());