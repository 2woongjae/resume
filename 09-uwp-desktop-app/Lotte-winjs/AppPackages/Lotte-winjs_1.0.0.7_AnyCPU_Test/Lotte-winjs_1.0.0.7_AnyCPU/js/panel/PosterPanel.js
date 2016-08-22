/*
    
    PosterPanel.js - Poster 패널

*/

var PosterPanel = (function () {
    "use strict";

    var dom = $("#PosterPanel"),
        isAnimate = false,
        domPosterList = null;

    var updateView = function (_isSelect) {

        var index = app.getIndex();

        isAnimate = true;

        if (_isSelect) {

            $(domPosterList[index].effect).stop(true, false).css({ width: "100px", height: "100px", opacity: "1" }).fadeIn(0).animate({

                width: "80px",

                height: "80px",

                opacity: "1"

            }, 100).animate({

                width: "1500px",

                height: "1500px",

                opacity: 0

            }, 300, function () {

                for (var i = 0; i < domPosterList.length; i++) {

                    if (i == index) {

                        domPosterList[i].select.fadeIn(200);

                        $(domPosterList[i]).switchClass("deactive", "active");

                    } else {

                        domPosterList[i].select.fadeOut(200);

                        $(domPosterList[i]).switchClass("active", "deactive");

                    }
                }

                isAnimate = false;
            }
            );
        }

        else {

            for (var i = 0; i < domPosterList.length; i++) {

                if (i == index) {

                    domPosterList[i].select.fadeIn(200);

                    $(domPosterList[i]).switchClass("deactive", "active");

                } else {

                    domPosterList[i].select.fadeOut(200);

                    $(domPosterList[i]).switchClass("active", "deactive");

                }
            }
        }

    };

    var makeDom = function () {

        var movieDB = app.getMovieDB();

        for (var i = 0; i < movieDB.length; i++) {

            var item = movieDB[i];

            dom.append(toStaticHTML(" <div id=\"poster" + i + "\" class=\"poster deactive\">"
                + "<div id=\"image\">"
                    + "<img src=\"" + app.rootPath + item.poster_url + "\"/>"
                    + "<div class=\"effect\"></div>"
                + "</div>"
                + "<img id=\"select\" src=\"/images/posterview/select.png\"/></div>"));

        }

        domPosterList = dom.find(".poster");


        for (var i = 0; i < movieDB.length; i++) {
            domPosterList[i].poster = $(domPosterList[i]).find("#image img");
            domPosterList[i].select = $(domPosterList[i]).find("#select");
            domPosterList[i].effect = $(domPosterList[i]).find(".effect");
        }

        updateView();

    };
    
    return {

        updateView: updateView,
        makeDom: makeDom

    };

}());