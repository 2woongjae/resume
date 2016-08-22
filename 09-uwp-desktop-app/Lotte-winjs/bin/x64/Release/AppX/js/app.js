$(function(){

    var socket = io("http://localhost:50415");

    socket.on("message", function (vtouch, info) {

        if (vtouch === null) console.log("Debug");

        app.checkVTouch(vtouch);

    });

    socket.on("Reload", function () {app.reload();});

}); // 스크립트 로드 후 소켓 커넥션 및 이벤트 설정.

var app = (function () {
    "use strict";

    var LIMIT_TIME = 300,
        isReady = true,
        timeout = null,
        title = "LotteCinema",
        version = "1.0",
        rootPath = "http://127.0.0.1/Downloads/", 
        movieDB = [], // "http://127.0.0.1/state.txt", 무비 배열
        index = 0; // 현재 선택된 영화 index

    var getIndex = function () {

        return index;

    };

    var getMovieDB = function () {

        return movieDB;

    };

    var selectIndex = function (_index) {

        // 같은 것 무시 && 없는 칸 무시
        if (index != _index && _index < movieDB.length) {

            index = _index;

            VideoPanel.updateView();
            PosterPanel.updateView(true); // 선택 이펙트가 있으면 true, 없으면 false

        }

    };

    var nextIndex = function () {

        index = index > movieDB.length - 2 ? 0 : index + 1; // 순환 처리

        VideoPanel.updateView();
        PosterPanel.updateView(false); // 자동 넘김 or 디스플레이 화살표 (R)

    };

    var prevIndex = function () {

        index = index < 1 ? movieDB.length - 1 : index - 1; // 순환 처리

        VideoPanel.updateView();
        PosterPanel.updateView(false); // 디스플레이 화살표 (L)

    };

    var trigger = function (vtouch, isUserInLine, isUserInArea, isUnlockUser, isLockUserHitDisplay, isUnlockUserHitDisplay) {

        if (isUserInLine > -1) { // 앞에 가릴때, 절대로 선택 행동이 일어나지 않는다.

            GuidePanel.showBackGuide();

        } else { // 앞에 가리지 않았을때

            if (isUnlockUser > -1) { // 한명이라도 언락 유저가 있을때

                if (isLockUserHitDisplay > -1) { // 락인 유저가 손들었을때

                    GuidePanel.showLockGuide();

                    if (isUnlockUserHitDisplay > -1) { // 언락인 유저가 손들었을 때

                        // 언락 & 락 유저 둘다 뭔짓 중
                        lockUnlockTrigger(vtouch);

                    } else {

                        // 락인 유저의 트리거
                        lockTrigger(vtouch);
                       
                    }
                    

                } else {

                    if (isUnlockUserHitDisplay > -1) { // 언락인 유저가 손들었을 때

                        GuidePanel.showPosterGuide();

                        // 언락 유저의 트리거
                        unlockTrigger(vtouch);

                    } else {

                        GuidePanel.hideGuide();

                        // 아무짓 노노

                    }

                }

            } else { // 언락 유저가 아예 없을때

                if (isUserInArea > -1) { // 한사람이라도 선택 영역에 있을 때

                    GuidePanel.showLockGuide();

                    // 락인 유저의 트리거
                    lockTrigger(vtouch);

                } else { // 아무도 선택 영역에 없을 때

                    GuidePanel.hideGuide();

                    // 아무짓 노노

                }

            }

        }

    };

    // mm => pixel
    var getScreenPoint = function (_point) {

        var x = Math.round(_point.x * 1920);
        var y = Math.round(_point.y * 1080);

        var point = { 'x': x, 'y': y };

        return point;

    };

    var lockUnlockTrigger = function (vtouch) {

        // 영역 구분 처리
        for (var i = 0; i < 6; i++) {

            if (vtouch[i].isTracking) {

                if (Users[i].tracking == 0) { // *** 락된 사용자

                    if (-vtouch[i].head.z > Area.front && -vtouch[i].head.z < Area.back && vtouch[i].head.x > Area.left && vtouch[i].head.x < Area.right) {

                        if ((vtouch[i].right.isHit || vtouch[i].left.isHit) && (vtouch[i].right.id == "DISPLAY" || vtouch[i].left.id == "DISPLAY")) {

                            if (isLockAreaInUse(vtouch[i])) {

                                if (vtouch[i].trigger == "D" || vtouch[i].trigger == "H") {

                                    Users[i].isRight = getIsRight(vtouch[i]);
                                    Users[i].tracking = 1;

                                    GuidePanel.doEffect(0); // 락버튼 애니메이션

                                }

                            }

                        }

                    }

                } else if (Users[i].tracking == 1) { // *** 언락된 사용자

                    if (-vtouch[i].head.z > Area.front && -vtouch[i].head.z < Area.back && vtouch[i].head.x > Area.left && vtouch[i].head.x < Area.right) {

                        if (Users[i].isRight === null) console.log("언락된 사용자가 'Users[i].isRight === null' 코드 오류");

                        var touch = (Users[i].isRight) ? vtouch[i].right : vtouch[i].left;

                        if (touch.isHit) {

                            if (touch.id == "POSTER") {

                                if (vtouch[i].trigger == "D" || vtouch[i].trigger == "H") {

                                    if (!isReady) continue;

                                    isReady = false;

                                    if (timeout !== null) clearTimeout(timeout);

                                    timeout = setTimeout(function () {

                                        isReady = true;

                                    }, LIMIT_TIME);

                                    if (touch.point.x > (1 / 6) * 0 && touch.point.x < (1 / 6) * 1) {

                                        selectIndex(0);

                                    } else if (touch.point.x > (1 / 6) * 1 && touch.point.x < (1 / 6) * 2) {

                                        selectIndex(1);

                                    } else if (touch.point.x > (1 / 6) * 2 && touch.point.x < (1 / 6) * 3) {

                                        selectIndex(2);

                                    } else if (touch.point.x > (1 / 6) * 3 && touch.point.x < (1 / 6) * 4) {

                                        selectIndex(3);

                                    } else if (touch.point.x > (1 / 6) * 4 && touch.point.x < (1 / 6) * 5) {

                                        selectIndex(4);

                                    } else if (touch.point.x > (1 / 6) * 5 && touch.point.x < (1 / 6) * 6) {

                                        selectIndex(5);

                                    }

                                }

                            } else if (touch.id == "L") {

                                if (vtouch[i].trigger == "D" || vtouch[i].trigger == "H") {

                                    if (!isReady) continue;

                                    isReady = false;

                                    if (timeout !== null) clearTimeout(timeout);

                                    timeout = setTimeout(function () {

                                        isReady = true;

                                    }, LIMIT_TIME);

                                    GuidePanel.doEffect(1);

                                }

                            } else if (touch.id == "R") {

                                if (vtouch[i].trigger == "D" || vtouch[i].trigger == "H") {

                                    if (!isReady) continue;

                                    isReady = false;

                                    if (timeout !== null) clearTimeout(timeout);

                                    timeout = setTimeout(function () {

                                        isReady = true;

                                    }, LIMIT_TIME);

                                    GuidePanel.doEffect(2);

                                }

                            }

                        }

                    }

                }

            }

        }

    };

    var unlockTrigger = function (vtouch) {

        // 영역 구분 처리
        for (var i = 0; i < 6; i++) {

            if (vtouch[i].isTracking) {

                if (Users[i].tracking == 1) { // *** 언락된 사용자

                    if (-vtouch[i].head.z > Area.front && -vtouch[i].head.z < Area.back && vtouch[i].head.x > Area.left && vtouch[i].head.x < Area.right) {

                        if (Users[i].isRight === null) console.log("언락된 사용자가 'Users[i].isRight === null' 코드 오류");

                        var touch = (Users[i].isRight) ? vtouch[i].right : vtouch[i].left;

                        if (touch.isHit) {

                            if (touch.id == "POSTER") {

                                if (vtouch[i].trigger == "D" || vtouch[i].trigger == "H") {

                                    if (!isReady) continue;

                                    isReady = false;

                                    if (timeout !== null) clearTimeout(timeout);

                                    timeout = setTimeout(function () {

                                        isReady = true;

                                    }, LIMIT_TIME);

                                    if (touch.point.x > (1 / 6) * 0 && touch.point.x < (1 / 6) * 1) {

                                        selectIndex(0);

                                    } else if (touch.point.x > (1 / 6) * 1 && touch.point.x < (1 / 6) * 2) {

                                        selectIndex(1);

                                    } else if (touch.point.x > (1 / 6) * 2 && touch.point.x < (1 / 6) * 3) {

                                        selectIndex(2);

                                    } else if (touch.point.x > (1 / 6) * 3 && touch.point.x < (1 / 6) * 4) {

                                        selectIndex(3);

                                    } else if (touch.point.x > (1 / 6) * 4 && touch.point.x < (1 / 6) * 5) {

                                        selectIndex(4);

                                    } else if (touch.point.x > (1 / 6) * 5 && touch.point.x < (1 / 6) * 6) {

                                        selectIndex(5);

                                    }

                                }

                            } else if (touch.id == "L") {

                                if (vtouch[i].trigger == "D" || vtouch[i].trigger == "H") {

                                    if (!isReady) continue;

                                    isReady = false;

                                    if (timeout !== null) clearTimeout(timeout);

                                    timeout = setTimeout(function () {

                                        isReady = true;

                                    }, LIMIT_TIME);

                                    GuidePanel.doEffect(1);

                                }

                            } else if (touch.id == "R") {

                                if (vtouch[i].trigger == "D" || vtouch[i].trigger == "H") {

                                    if (!isReady) continue;

                                    isReady = false;

                                    if (timeout !== null) clearTimeout(timeout);

                                    timeout = setTimeout(function () {

                                        isReady = true;

                                    }, LIMIT_TIME);

                                    GuidePanel.doEffect(2);

                                }

                            }

                        }


                    }

                }

            }

        }

    };

    var lockTrigger = function (vtouch) {

        for (var i = 0; i < 6; i++) {

            if (vtouch[i].isTracking) {

                if (Users[i].tracking == 0) { // *** 락된 사용자

                    if (-vtouch[i].head.z > Area.front && -vtouch[i].head.z < Area.back && vtouch[i].head.x > Area.left && vtouch[i].head.x < Area.right) {

                        if ((vtouch[i].right.isHit || vtouch[i].left.isHit) && (vtouch[i].right.id == "DISPLAY" || vtouch[i].left.id == "DISPLAY")) {

                            if (isLockAreaInUse(vtouch[i])) {

                                if (vtouch[i].trigger == "D" || vtouch[i].trigger == "H") {

                                    Users[i].isRight = getIsRight(vtouch[i]);
                                    Users[i].tracking = 1;

                                    GuidePanel.doEffect(0); // 락버튼 애니메이션

                                }

                            }

                        }

                    }

                }

            }

        }

    };
    
    // 상황 설정
    var checkVTouch = function (vtouch) {

        var isUserInArea = -1; // 언락 유저가 영역에 등장
        var isUserInLine = -1; // 걍 유저가 라인 앞으로 등장
        var isUnlockUser = -1; // 언락 유저가 있는가
        var isLockUserHitDisplay = -1; // 락인 유저가 손 들었을때
        var isUnlockUserHitDisplay = -1; // 언락인 유저가 손 들었을때

        // 영역 구분 처리
        for (var i = 0; i < 6; i++) {

            if (vtouch[i].isTracking) {

                if (Users[i].tracking == -1) { // 없다.

                    Users[i].tracking = 0;
                    console.log("Users " + i + " 이 카메라에 새로 등장함.");

                } else if (Users[i].tracking == 0) { // *** 락된 사용자

                    if (-vtouch[i].head.z < Area.front) isUserInLine = i;

                    if (-vtouch[i].head.z > Area.front && -vtouch[i].head.z < Area.back && vtouch[i].head.x > Area.left && vtouch[i].head.x < Area.right) {

                        isUserInArea = i;

                        if (vtouch[i].right.isHit || vtouch[i].left.isHit) isLockUserHitDisplay = i;

                    }

                } else if (Users[i].tracking == 1) { // *** 언락된 사용자

                    isUnlockUser = i;

                    if (-vtouch[i].head.z < Area.front) isUserInLine = i;

                    if (-vtouch[i].head.z > Area.front && -vtouch[i].head.z < Area.back && vtouch[i].head.x > Area.left && vtouch[i].head.x < Area.right) {

                        if (Users[i].isRight === null) console.log("언락된 사용자가 'Users[i].isRight === null' 코드 오류");

                        var touch = (Users[i].isRight) ? vtouch[i].right : vtouch[i].left;

                        if (touch.isHit) {

                            isUnlockUserHitDisplay = i;

                        }

                    }

                }

            } else {

                if (Users[i].tracking != -1) {

                    Users[i].tracking = -1;
                    Users[i].isRight = false;

                    console.log("Users " + i + " 이 카메라에서 사라짐.");

                }

            }

        }

        trigger(vtouch, isUserInLine, isUserInArea, isUnlockUser, isLockUserHitDisplay, isUnlockUserHitDisplay);

    };

    var getIsRight = function (vtouch) {

        if (vtouch.right.isHit && vtouch.left.isHit) {

            if (vtouch.right.id == "DISPLAY" && vtouch.left.id == "DISPLAY") {

                var right = getScreenPoint(vtouch.right.point);
                var left = getScreenPoint(vtouch.left.point);

                var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 520 && right.y < 1080);
                var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 520 && left.y < 1080);

                if (isR && isL) {

                    console.log("우세안 위치로 비교 right : " + Math.abs(right.x - 960) + ", left : " + Math.abs(left.x - 960));

                    if (Math.abs(right.x - 960) <= Math.abs(left.x - 960)) { return true; }
                    else { return false; }

                } else if (isR) { return true; }

                else if (isL) { return false; }

            } else if (vtouch.right.id == "DISPLAY") {

                var right = getScreenPoint(vtouch.right.point);
                var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 520 && right.y < 1080);

                if (isR) { return true; }


            } else if (vtouch.left.id == "DISPLAY") {

                var left = getScreenPoint(vtouch.left.point);
                var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 520 && left.y < 1080);

                if (isL) { return false; }

            }

        } else if (vtouch.right.isHit) {

            if (vtouch.right.id == "DISPLAY") {

                var right = getScreenPoint(vtouch.right.point);

                var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 520 && right.y < 1080);

                if (isR) { return true; }

            }

        } else if (vtouch.left.isHit) {

            if (vtouch.left.id == "DISPLAY") {

                var left = getScreenPoint(vtouch.left.point);

                var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 520 && left.y < 1080);

                if (isL) { return false; }

            }

        }

        return true;

    };

    var isLockAreaInUse = function (vtouch) {

        var i = vtouch.id;

        if (vtouch === undefined) return;
        if (vtouch === null) return;
        if (!vtouch.isTracking) return;

        if (vtouch.right.isHit && vtouch.left.isHit) {

            if (vtouch.right.id == "DISPLAY" && vtouch.right.id == "DISPLAY") {

                var right = getScreenPoint(vtouch.right.point);
                var left = getScreenPoint(vtouch.left.point);

                var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 520 && right.y < 1080);
                var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 520 && left.y < 1080);

                if (isR && isL) {

                    if (Math.abs(right.x - 960) <= Math.abs(left.x - 960)) {

                        return true;

                    } else {

                        return true;

                    }

                } else if (isR) {

                    return true;

                } else if (isL) {

                    return true;

                } else {

                    return false;

                }

            } else if (vtouch.right.id == "DISPLAY") {

                var right = getScreenPoint(vtouch.right.point);
                var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 520 && right.y < 1080);

                if (isR) {

                    return true;

                } else {

                    return false;

                }

            } else if (vtouch.left.id == "DISPLAY") {

                var left = getScreenPoint(vtouch.left.point);
                var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 520 && left.y < 1080);

                if (isL) {

                    return true;

                } else {

                    return false;

                }

            } else {

                return false;

            }

        } else if (vtouch.right.isHit) {

            if (vtouch.right.id == "DISPLAY") {

                var right = getScreenPoint(vtouch.right.point);

                var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 520 && right.y < 1080);

                if (isR) {

                    return true;

                } else {

                    return false;

                }

            }

        } else if (vtouch.left.isHit) {

            if (vtouch.left.id == "DISPLAY") {

                var left = getScreenPoint(vtouch.left.point);

                var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 520 && left.y < 1080);

                if (isL) {

                    return true;

                } else {

                    return false;

                }

            } else {

                return false;

            }

        } else {

            return false;

        }

        return false;

    };

    var reload = function () {

        javascript: history.go(0);

    };

    // 초기화
    WinJS.xhr({

        url: "http://127.0.0.1/state.txt",

        headers: { "If-Modified-Since": "Mon, 27 Mar 1972 00:00:00 GMT" }

    }).then(function (xhr) {

        var items = JSON.parse(xhr.responseText);
        
        for (var i = 0; i < items.movies.length; i++) {
            if (items.movies[i].title === undefined) {
                continue;
            }

            movieDB.push(items.movies[i]);
        }

        PosterPanel.makeDom();
        VideoPanel.makeDom();

    });

    return {

        rootPath: rootPath,

        getIndex: getIndex,

        getMovieDB: getMovieDB,

        selectIndex: selectIndex,

        nextIndex: nextIndex,

        prevIndex: prevIndex,

        checkVTouch: checkVTouch,

        reload: reload

    };

}());

var Users = [
    {
        tracking: -1,
        isRight: null
    },
    {
        tracking: -1,
        isRight: null
    },
    {
        tracking: -1,
        isRight: null
    },
    {
        tracking: -1,
        isRight: null
    },
    {
        tracking: -1,
        isRight: null
    },
    {
        tracking: -1,
        isRight: null
    }
];

var Area = {
    front: 1700,
    back: 2600,
    left: -1200,
    right: 1200
};