var GuidePanel = (function () {
    "use strict";

    var dom = $("#GuidePanel"),
        domNotiList = [],
        domBackNoti = null,
        domPosterNoti = null,
        domLockNoti = null,
        domLockButton = null,
        domNormalButton = null,
        domDownButton = null,
        domRight = null,
        domLeft = null,
        domEffect = null,
        timeout = null,

        index = -1,

        //락, 왼쪽, 오른쪽의 이펙트 여부
        isEffect = [false, false, false];
        
    var changeGuide = function (_index) {

        if (index != _index) {
            index = _index;
            updateView();
        }

    };

    var updateView = function () {

        for (var i = 0; i < 3; i++) {

            if (i == index) {

                if (i == 0) {
                    domDownButton.fadeOut(0);
                    domNormalButton.fadeIn(0);
                }

                domNotiList[i].stop(true, false).fadeIn(500);

            } else {

                domNotiList[i].stop(true, false).fadeOut(500);

            }

        }

    };

    var doEffect = function (_index) {

        if (domEffect !== null) return;

        if (_index == 0) domEffect = domLockButton;
        else if (_index == 1) domEffect = domLeft;
        else if (_index == 2) domEffect = domRight;

        if (!isEffect[_index]) {

            isEffect[_index] = true;

            domEffect.effect.stop(true, false).css({ width: "100px", height: "100px", opacity: "1" }).fadeIn(0).animate({
                width: "80px",
                height: "80px",
                opacity: "1"
            }, 100).animate({
                width: "300px",
                height: "300px",
                opacity: 0
            }, 200, function () {

                if (_index == 0) {
                    domNormalButton.fadeOut(200);
                    domDownButton.fadeIn(200);
                }
                else if (_index == 1) app.prevIndex();
                else if (_index == 2) app.nextIndex();

                isEffect[_index] = false;

            });

        };

        if (timeout !== null) clearTimeout(timeout);

        timeout = setTimeout(function () {

            domEffect = null;

        }, 500);

    };

    var showLockGuide = function () { 
        
        changeGuide(0);
    
    };

    var showBackGuide = function () { 
        
        changeGuide(1); 
    
    };

    var showPosterGuide = function () { 
        
        changeGuide(2);
    
    };

    var hideGuide = function () {
        
        changeGuide(-1);
    
    };

    // 초기화 - make dom
    dom.append(toStaticHTML("<div id=\"lockNoti\" class=\"guide\">"
                                + "<img id=\"background\" src=\"/images/videoview/popup.png\"/>"
                                + "<div id=\"button\">" 
                                    + "<img id=\"buttonImg\" class=\"normal\" src=\"/images/videoview/unlock_01.png\"/>"
                                    + "<img id=\"buttonImg\" class=\"down\" src=\"/images/videoview/unlock_02.png\"/>"
                                    + "<div class=\"effect\"></div>"
                                + "</div>"
                                + "<div class=\"sprite\"></div>"
                              + "</div>"
                              + "<img id=\"backNoti\" class=\"guide\" src=\"/images/videoview/back.png\"/>"
                              + "<div id=\"posterNoti\">"
                                  + "<img id=\"poster\" class=\"guide\" src=\"/images/videoview/want.png\"/>"
                                  + "<div id=\"left\">"
                                    + "<img id=\"img\" src=\"/images/videoview/left.png\"/>"
                                    + "<div class=\"effect\"></div>"
                                  + "</div>"
                                  + "<div id=\"right\">"
                                    + "<img id=\"img\" src=\"/images/videoview/right.png\"/>"
                                    + "<div class=\"effect\"></div>"
                                  + "</div>"
                              + "</div>"  ));

    domLockNoti = dom.find("#lockNoti");
    domLockButton = dom.find("#button");
    domLockButton.effect = domLockButton.find(".effect");
    domDownButton = domLockButton.find("#buttonImg.down");
    domNormalButton = domLockButton.find("#buttonImg.normal");
    domBackNoti = dom.find("#backNoti");
    domPosterNoti = dom.find("#posterNoti");
    domLeft = dom.find("#left");
    domLeft.effect = domLeft.find(".effect");
    domRight = dom.find("#right");
    domRight.effect = domRight.find(".effect");
    domNotiList.push(domLockNoti);
    domNotiList.push(domBackNoti);
    domNotiList.push(domPosterNoti);

    updateView();

    return {

        showLockGuide: showLockGuide,

        showBackGuide: showBackGuide,

        showPosterGuide: showPosterGuide,

        hideGuide: hideGuide,

        doEffect: doEffect

    };

}());