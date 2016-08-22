define(function (require) {
    "use strict";

    var GuidePanel = (function () {

        var dom = $("#GuidePanel"),
            domNotiList = [],
            domBackNoti = null,
            domPosterNoti = null,
            domPosterFinger = null,
            domPosterMent1 = null,
            domPosterMent2 = null,
            domLockNoti = null,
            domLockMent1 = null,
            domLockMent2 = null,
            domLockFinger = null,
            domLockButton1 = null,
            domLockButton2 = null,
            domLockVideo = null,
            domNormalButton1 = null,
            domDownButton1 = null,
            domNormalButton2 = null,
            domDownButton2 = null,
            domRight = null,
            domLeft = null,
            domEffect = null,
            domLittleLockNoti = null,
            domLittleLockButton1 = null,
            domLittleLockButton2 = null,
            domLittleLockMent = null,
            timeout = null,
            selectTimer = null,
            changeTimer = null,
            index = -1,



            isPosterGuide = true, //포스터 선택 가이드는 최초한번만 보여진다.app.selectIndex이후에 false로 바뀜,
            isCloseState = false,


            isEffect = false,
            isAnimate = false,
            isWaitDelay = false;

        var PosterPanel = null;
        var VideoPanel = null;
        var app = null;

        var changeGuide = function (_index) {

            //현재 가이드가 LittleLockGUide
            if (_index == 3) {

                isWaitDelay = true;
                clearTimeout(changeTimer);
                changeTimer = setTimeout(function () {
                    isWaitDelay = false;
                }, 3000);

                if (index != _index) {
                    stopFingerAnimate();

                    fingerAnimate(_index);

                    if (index == 0) VideoPanel.playVideo();

                    index = _index;
                    updateView();
                }
            }

            else {
                if (index != _index) {

                    if (isEffect || isWaitDelay) {
                        return;
                    }//Lock이나 LittleLock이 애니메이션중이면 아무 동작 안한다.


                    stopFingerAnimate();

                    fingerAnimate(_index);

                    if (index == 0) VideoPanel.playVideo();

                    index = _index;
                    updateView();


                }

            }



        };


        var updateView = function () {

            if (!isAnimate) {

                isAnimate = true;

                for (var i = 0; i < domNotiList.length; i++) {

                    if (i == index) {

                        if (i == 0) {

                            domDownButton1.fadeOut(0);

                            domNormalButton1.fadeIn(0);

                            domDownButton2.fadeOut(0);

                            domNormalButton2.fadeIn(0);

                        }

                        domNotiList[i].stop(true, false).fadeIn(0);

                    } else {
                        var time = 0;
                        //if (i == 3) time = 1000;
                        domNotiList[i].stop(true, false).fadeOut(time, "easeInOutExpo", function () {

                            isAnimate = false;

                        });

                    }
                }

            }


        };

        var doEffect = function (_index) {

            if (domEffect !== null) return;

            var circleWidth, circleHeight;

            if (_index === 0) {
                if (index === 0) domEffect = domLockButton1; // 정리 필요
                else {
                    domEffect = domLittleLockButton1; // 정리 필요
                    isWaitDelay = false;
                    clearTimeout(changeTimer);
                }
                circleWidth = 1000;
                circleHeight = 1000;
            }
            else if (_index === 1) {
                domEffect = domLeft;
                circleWidth = 500;
                circleHeight = 500;
            }
            else if (_index === 2) {
                domEffect = domRight;
                circleWidth = 500;
                circleHeight = 500;
            }
            else if (_index === 3) {

                if (index === 0) domEffect = domLockButton2; // 정리 필요
                else {
                    domEffect = domLittleLockButton2; // 정리 필요
                    isWaitDelay = false;
                    clearTimeout(changeTimer);
                }
                circleWidth = 1000;
                circleHeight = 1000;

            }

            if (!isEffect) {

                isEffect = true;
                clearTimeout(selectTimer);

                domEffect.effect.stop(true, false).css({ width: "100px", height: "100px", opacity: "1" }).fadeIn(0).animate({

                    width: "80px",
                    height: "80px",
                    opacity: "1"

                }, 100).animate({

                    width: circleWidth + "px",
                    height: circleHeight + "px",
                    opacity: 0

                }, 200, function () {

                    if (_index == 0) {

                        domNormalButton1.fadeOut(200);
                        domNormalButton2.fadeOut(200);

                        domDownButton1.fadeIn(200);
                        domDownButton2.fadeIn(200);

                    } else if (_index == 1) {

                        app.prevIndex(true);

                        app.like(app.getMovieDB()[app.getIndex()]._id);

                    } else if (_index == 2) {

                        app.nextIndex(true);

                        app.like(app.getMovieDB()[app.getIndex()]._id);

                    }

                    if (_index == 0 || _index == 3) { isEffect = false; }
                    else {
                        selectTimer = setTimeout(function () {
                            isEffect = false;
                        }, 300);
                    }


                });

            };

            if (timeout !== null) clearTimeout(timeout);

            timeout = setTimeout(function () {

                domEffect = null;

            }, 500);

        };

        var showLockGuide = function (_show) { //비디오 유무

            if (_show) {

                domLockVideo.fadeIn(0);

                VideoPanel.pauseVideo();

            } else {

                domLockVideo.fadeOut(0);

            }

            isPosterGuide = true;

            changeGuide(0);

        };


        var showPosterGuide = function () {

            changeGuide(1);

        };


        var showBackGuide = function () {

            // changeGuide(2);

        };

        var showLittleLockGuide = function () {

            changeGuide(3);

        };



        var hideGuide = function () {

            changeGuide(-1);

        };

        var hideArrow = function () {

            $(domLeft).fadeOut(1000, "easeInOutExpo");

            $(domRight).fadeOut(1000, "easeInOutExpo");

        };

        var showArrow = function () {

            $(domLeft).fadeIn(0);

            $(domRight).fadeIn(0);

        };


        function fingerAnimate(_index) {

            var dom;
            var position;

            if (_index == 0) {

                dom = domLockFinger;

                dom.css({ "bottom": " -800px" }).animate({

                    "bottom": "-295px"

                }, 1000).delay(500).animate({

                    "bottom": "-800px"

                }, 1000, function () {

                    fingerAnimate(_index);

                });

            } else if (_index == 1) {

                if (isPosterGuide) {

                    dom = domPosterFinger;

                    $(domPosterFinger).show();

                    position = 3;

                    dom.css({ "bottom": "-595px" }).animate({

                        "bottom": "-245px"

                    }, 1000, function () {

                        if (PosterPanel.getDomPosterList()) {

                            $(PosterPanel.getDomPosterList()[position]).switchClass("deactive", "active");

                            $(PosterPanel.getDomPosterList()[position].select).fadeIn(0);

                            PosterPanel.doEffect(position);

                        }

                    }).delay(500).animate({

                        "bottom": "-595px"

                    }, 1000, function () {

                        if (PosterPanel.getDomPosterList()) {

                            $(PosterPanel.getDomPosterList()[position]).switchClass("active", "deactive");

                            $(PosterPanel.getDomPosterList()[position].select).fadeOut(0);

                        }

                        fingerAnimate(_index);

                    });

                } else {

                    stopFingerAnimate();

                }

            }

        };

        function stopFingerAnimate() {

            var list = PosterPanel.getDomPosterList();

            for (var i = 0; i < list.length; i++) {

                if (i != app.getIndex()) $(list[i].select).fadeOut(0);

            }

            if (index == 1) {

                $(domPosterFinger).stop(true, false);

                if (app.getIndex() != 4) $(list[4]).switchClass("active", "deactive");

            }

        };


        function setPosterGuide(_bool) {

            if (isPosterGuide != _bool) {

                isPosterGuide = _bool;

                if (isPosterGuide) {

                    $(domPosterFinger).stop(true, false).show();

                    stopFingerAnimate();

                    fingerAnimate(index);

                }

                else $(domPosterFinger).stop(true, false).hide();

            }

        }

        function setCloseState(_bool) {
            isCloseState = _bool;

            if (isCloseState) {

                if (index == 0) {       //락가이드 

                    $(domLockMent1).text("한 발짝 뒤로 물러나   다트를 가리켜 주세요");
                    $(domLockMent2).text("");

                } else if (index == 1) { //포스터가이드 

                    $(domPosterMent1).text("한 발짝 뒤로 물러나주세요");

                    $(domPosterMent2).text("한 발짝 뒤로 물러나주세요");

                } else if (index == 2) { //

                } else if (index == 3) { //리틀락가이드 

                    $(domLittleLockMent).text("한 발짝 뒤로 물러나   다트를 가리켜 주세요");

                }

            } else {

                if (index == 0) {       //락가이드 

                    $(domLockMent1).text("손가락으로 원하는   컬러의 다트를 가리키면 충전완료!");
                    $(domLockMent2).text("힘을 내요 슈퍼  파월~~!");

                } else if (index == 1) { //포스터가이드 

                    $(domPosterMent1).text("발자국 위에서 다트를 던져 포스터를 가리켜 보세요");

                    $(domPosterMent2).text("예고편을 볼 수 있습니다");

                } else if (index == 2) { //

                } else if (index == 3) { //리틀락가이드 

                    $(domLittleLockMent).text("함께 하려면 원하는 다트를 손가락으로 가리켜 주세요");

                }

            }

        }

        // 초기화 - make dom
        dom.append(toStaticHTML("<div id=\"lockNoti\" class=\"guide\">"
                                    + "<div id=\"background\"></div>"
                                    + "<div id=\"button1\">"
                                        + "<img id=\"buttonImg1\" class=\"normal\" src=\"/images/dartview/red_nor.png\"/>"
                                        + "<img id=\"buttonImg1\" class=\"down\" src=\"/images/dartview/red_sel.png\"/>"
                                        + "<div class=\"effect\"></div>"
                                    + "</div>"
                                    + "<div id=\"button2\">"
                                        + "<img id=\"buttonImg2\" class=\"normal\" src=\"/images/dartview/green_nor.png\"/>"
                                        + "<img id=\"buttonImg2\" class=\"down\" src=\"/images/dartview/green_sel.png\"/>"
                                        + "<div class=\"effect\"></div>"
                                    + "</div>"
                                    + "<div id=\"finger\" ></div>"
                                    + "<video id=\"lockVideo\" src=\"/images/guideview/Lotte_trailer_video_3.mp4\" loop autoplay></video>"
                                    + "<div id=\"ment1\">손가락으로 원하는 컬러의   다트를 가리키면 충전완료!.</div>"
                                    + "<div id=\"ment2\">힘을 내요   슈퍼 파월~~!</div>"
                                  + "</div>"
                                 + "<div id=\"backNoti\" class=\"guide\">"
                                    + "<div id=\"ment1\">발자국 위에 서 주세요</div>"
                                    + "<div id=\"ment2\">발자국 위에 서 주세요</div>"
                                  + "</div>"
                                  + "<div id=\"posterNoti\"  class=\"guide\">"
                                      + "<div id=\"finger\" ></div>"
                                      + "<div id=\"ment1\">발자국 위에 서서 포스터를 가리켜보세요</div>"
                                      + "<div id=\"ment2\">예고편을 볼 수 있습니다</div>"
                                  + "</div>"
                                  + "<div id=\"littleLockNoti\" class=\"guide\">"
                                    + "<div id=\"background\"></div>"
                                    + "<div id=\"button1\">"
                                        + "<img id=\"buttonImg1\" class=\"normal\" src=\"/images/dartview/red_multi_nor.png\"/>"
                                        + "<img id=\"buttonImg1\" class=\"down\" src=\"/images/dartview/red_multi_sel.png\"/>"
                                        + "<div class=\"effect\"></div>"
                                    + "</div>"
                                    + "<div id=\"button2\">"
                                        + "<img id=\"buttonImg2\" class=\"normal\" src=\"/images/dartview/green_multi_nor.png\"/>"
                                        + "<img id=\"buttonImg2\" class=\"down\" src=\"/images/dartview/green_multi_sel.png\"/>"
                                        + "<div class=\"effect\"></div>"
                                    + "</div>"
                                    + "<div id=\"ment1\">함께 하려면 원하는 다트를 손가락으로 가리켜 주세요</div>"
                                  + "</div>"
                                  + "<div id=\"arrowNoti\">"
                                       + "<div id=\"left\">"
                                            + "<img id=\"img\" src=\"/images/guideview/left.png\"/>"
                                            + "<div class=\"effect\"></div>"
                                       + "</div>"
                                       + "<div id=\"right\">"
                                            + "<img id=\"img\" src=\"/images/guideview/right.png\"/>"
                                            + "<div class=\"effect\"></div>"
                                       + "</div>"
                                     + "</div>"

                                  ));

        domLockNoti = dom.find("#lockNoti");
        domLockButton1 = domLockNoti.find("#button1");
        domLockButton2 = domLockNoti.find("#button2");
        domNormalButton1 = domLockButton1.find("#buttonImg1.normal");
        domDownButton1 = domLockButton1.find("#buttonImg1.down");
        domLockButton1.effect = domLockButton1.find(".effect");
        domNormalButton2 = domLockButton2.find("#buttonImg2.normal");
        domDownButton2 = domLockButton2.find("#buttonImg2.down");
        domLockButton2.effect = domLockButton2.find(".effect");
        domLockFinger = domLockNoti.find("#finger")
        domLockVideo = domLockNoti.find("#lockVideo");
        domLockMent1 = domLockNoti.find("#ment1");
        domLockMent2 = domLockNoti.find("#ment2");

        domBackNoti = dom.find("#backNoti");
        domPosterNoti = dom.find("#posterNoti");
        domPosterFinger = domPosterNoti.find("#finger");
        domPosterMent1 = domPosterNoti.find("#ment1");
        domPosterMent2 = domPosterNoti.find("#ment2");
        domLeft = dom.find("#left");
        domLeft.effect = domLeft.find(".effect");
        domRight = dom.find("#right");
        domRight.effect = domRight.find(".effect");

        domLittleLockNoti = dom.find("#littleLockNoti");
        domLittleLockMent = domLittleLockNoti.find("#ment1");
        domLittleLockButton1 = domLittleLockNoti.find("#button1");
        domLittleLockButton1.effect = domLittleLockButton1.find(".effect");
        domLittleLockButton2 = domLittleLockNoti.find("#button2");
        domLittleLockButton2.effect = domLittleLockButton2.find(".effect");

        domNotiList.push(domLockNoti);
        domNotiList.push(domPosterNoti);
        domNotiList.push(domBackNoti);
        domNotiList.push(domLittleLockNoti);

        updateView();

        var setPosterPanel = function (_posterPanel) {

            PosterPanel = _posterPanel;

        };

        var setVideoPanel = function (_videoPanel) {

            VideoPanel = _videoPanel;

        };

        var setApp = function (_app) {

            app = _app;

        };

        return {

            showLockGuide: showLockGuide,

            showPosterGuide: showPosterGuide,

            showBackGuide: showBackGuide,

            showLittleLockGuide: showLittleLockGuide,

            hideGuide: hideGuide,

            doEffect: doEffect,

            setPosterGuide: setPosterGuide,

            showArrow: showArrow,

            hideArrow: hideArrow,

            setCloseState: setCloseState,

            setPosterPanel: setPosterPanel,

            setVideoPanel: setVideoPanel,

            setApp: setApp

        };

    }());

    return GuidePanel;

});