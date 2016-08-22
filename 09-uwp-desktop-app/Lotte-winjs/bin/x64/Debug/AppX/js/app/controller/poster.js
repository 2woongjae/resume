define(function (require) {
    "use strict";

    var PosterPanel = (function () {

        var dartAnimation = require("./sprite");

        var dom = $("#PosterPanel"),
            isAnimate = false,
            selectTimer = null,
            domPosterList = [];

        var GuidePanel = null;
        var app = null;

        var doEffect = function (_index) {
            isAnimate = true;
            $(domPosterList[_index].effect).stop(true, false).css({ width: "100px", height: "100px", opacity: "1" }).fadeIn(0).animate({

                width: "80px",

                height: "80px",

                opacity: "1"

            }, 100).animate({

                width: "1500px",

                height: "1500px",

                opacity: 0

            }, 300, function () {

                isAnimate = false;
            });
        }

        var updateView = function (_isSelect, _x, _y, _isClick, _color) {

            var index = app.getIndex();

            if (_isSelect) {

                if (!isAnimate) {

                    isAnimate = true;
                    clearTimeout(selectTimer);

                    app.playAudio(12);
                    dartAnimation.shoot(_color, dom, _x * 3840, _y * 1080); // 다트 날아가는 애니메이션 함수 첫번째 인자는 색깔 ,  두번째는 박힐 dom , 세번째 네번째는 좌표값
                    $(domPosterList[index].effect).css({ "left": (((_x * 3840) - (640)*index) + "px"), "top": ((_y * 1080) + "px") }); //이펙트 위치 조절
                    // 이펙트 부분 
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

                        selectTimer = setTimeout(function () {

                            isAnimate = false;
                            $(domPosterList[index].effect).css({ "left": "2240px", "top": "540px" }); // 원복

                        }, 300);

                    });

                }

            }

            else {

                for (var i = 0; i < domPosterList.length; i++) {

                    if (i == index) {

                        domPosterList[i].select.fadeIn(200);

                        $(domPosterList[i]).switchClass("deactive", "active");

                        if (!_isClick) dartAnimation.shoot("green", domPosterList[i], 300, 450);
                        
                    } else {

                        domPosterList[i].select.fadeOut(200);

                        $(domPosterList[i]).switchClass("active", "deactive");

                    }

                }

            }

        };

        var getDomPosterList = function () {
            return domPosterList;
        }

        var makeDom = function () {

            var movieDB = app.getMovieDB();

            for (var i = 0; i < movieDB.length; i++) {

                var item = movieDB[i];

                dom.append(toStaticHTML(" <div id=\"poster" + i + "\" class=\"poster deactive\">"
                    + "<div id=\"image\">"
                        + "<img src=\"" + app.getRootPath() + item.poster_url.substr(41, item.poster_url.length - 1) + "\"/>"
                        + "<div class=\"effect\"></div>"
                    + "</div>"
                    + "<img id=\"select\" src=\"/images/posterview/light_04.png\"/></div>"));

            }

            domPosterList = dom.find(".poster");


            for (var i = 0; i < movieDB.length; i++) {
                domPosterList[i].poster = $(domPosterList[i]).find("#image img");
                domPosterList[i].select = $(domPosterList[i]).find("#select");
                domPosterList[i].effect = $(domPosterList[i]).find(".effect");
            }

            updateView();

        };

        var setGuidePanel = function (_guidePanel) {

            GuidePanel = _guidePanel;

        };

        var setApp = function (_app) {

            app = _app;

        };

        return {

            updateView: updateView,
            makeDom: makeDom,
            getDomPosterList: getDomPosterList,
            doEffect: doEffect,
            setGuidePanel: setGuidePanel,
            setApp: setApp

        };

    }());

    return PosterPanel;

});