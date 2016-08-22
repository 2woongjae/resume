define(function (require) {
    "use strict";

    var app = (function () {

        var LIMIT_TIME = 500,
            UNLOCK_RIGHT_POS_X = 3205,
            UNLOCK_LEFT_POS_X = 635,
            isReady = true,
            timeout = null,
            title = "LotteCinema",
            version = "1.0",
            rootPath = "http://127.0.0.1/Downloads/",
            movieDB = [],
            serviceIp = "http://127.0.0.1/",
            audtag = null,
            isUsers = false,
            audindex = 0,
            index = 0; // 현재 선택된 영화 index

        var GuidePanel = require("./guide");
        var PosterPanel = require("./poster");
        var VideoPanel = require("./video");

        GuidePanel.setPosterPanel(PosterPanel);
        GuidePanel.setVideoPanel(VideoPanel);
        PosterPanel.setGuidePanel(GuidePanel);

        var Users = [
        {
            tracking: -1,
            isRight: null,
            color: 0    // 1 : green / 2 : red
        },
        {
            tracking: -1,
            isRight: null,
            color: 0
        },
        {
            tracking: -1,
            isRight: null,
            color: 0
        },
        {
            tracking: -1,
            isRight: null,
            color: 0
        },
        {
            tracking: -1,
            isRight: null,
            color: 0
        },
        {
            tracking: -1,
            isRight: null,
            color: 0
        }
        ];

        var Area = {
            front: 1700,
            back: 2600,
            left: -1200,
            right: 1200
        };

        var getIndex = function () {

            return index;

        };

        var getMovieDB = function () {

            return movieDB;

        };

        var selectIndex = function (_index, _x, _y, _uid) {
            console.log(index + " / " + _index);
            // 같은 것 무시 && 없는 칸 무시
            if (index != _index && _index < movieDB.length) { 

                index = _index;

                like(movieDB[index]._id);

                VideoPanel.updateView();

            }

            GuidePanel.setPosterGuide(false);

            if (Users[_uid].color == 1) PosterPanel.updateView(true, _x, _y, true, "green"); // 선택 이펙트가 있으면 true, 없으면 false
            else if (Users[_uid].color == 2) PosterPanel.updateView(true, _x, _y, true, "red"); // 선택 이펙트가 있으면 true, 없으면 false

        };

        var nextIndex = function (_isRightClick) {

            index = index > movieDB.length - 2 ? 0 : index + 1; // 순환 처리

            VideoPanel.updateView();

            PosterPanel.updateView(false, 0, 0, _isRightClick); // 자동 넘김 or 디스플레이 화살표 (R)

        };

        var prevIndex = function (_isLeftClick) {

            index = index < 1 ? movieDB.length - 1 : index - 1; // 순환 처리

            VideoPanel.updateView();
            PosterPanel.updateView(false, 0, 0, _isLeftClick); // 디스플레이 화살표 (L)

        };

        var trigger = function (vtouch, isLockUserInLine, isUnlockUserInLine, isUserInArea, isUnlockUser, isLockUserHitDisplay, isUnlockUserHitDisplay, isUser) {

            if (isUser > -1) { // 사람 있을 때

                if (!isUsers) {

                    isUsers = true;

                }

            } else { // 없을 때

                if (isUsers) {

                    isUsers = false;

                    GuidePanel.setPosterGuide(true);
                    GuidePanel.setCloseState(false);
                    GuidePanel.showPosterGuide();

                }

            }

            if (isUnlockUser > -1) { // 한명이라도 언락 유저가 있을때

                if (isLockUserInLine > -1) { // 락유저가 가까이 있을 때 

                    if (isLockUserHitDisplay > -1) {    //락 유저가 손을 들었을 떄

                        GuidePanel.setCloseState(true);
                        GuidePanel.showLittleLockGuide();

                    } else {

                        GuidePanel.setCloseState(true);
                        GuidePanel.showPosterGuide();

                    }

                    lockTrigger(vtouch, false);


                } else {

                    if (isLockUserHitDisplay > -1) { //락 유저가 손을 들었을 때 

                        GuidePanel.setCloseState(false);
                        GuidePanel.showLittleLockGuide();
                        lockTrigger(vtouch, false); // 락인 유저의 트리거

                        playAudio(8);

                    } else {

                        if (isUnlockUserInLine > -1) {

                            GuidePanel.setCloseState(true);
                            GuidePanel.showPosterGuide();

                            playAudio(2);

                        } else {

                            GuidePanel.setCloseState(false);
                            GuidePanel.showPosterGuide();

                        }

                    }

                }

                if (isUnlockUserHitDisplay > -1) { // 언락인 유저가 손들었을 때

                    GuidePanel.showArrow();
                    unlockTrigger(vtouch); // 언락 유저의 트리거

                } else {

                    GuidePanel.hideArrow();

                }

            } else { // 언락 유저가 아예 없을때

                if (isUserInArea > -1) { // 한사람이라도 선택 영역에 있을 때

                    if (isLockUserInLine > -1) {

                        GuidePanel.setCloseState(true);
                        GuidePanel.showLockGuide(true);
                        playAudio(3);

                    } else {

                        GuidePanel.setCloseState(false);
                        GuidePanel.showLockGuide(true);
                        playAudio(6);                           // 발자국 위에 서면 : 02_stand 사운드 재생

                    }

                    lockTrigger(vtouch, true);

                } else { // 아무도 선택 영역에 없을 때

                    if (isLockUserInLine > -1) {    // 유저가 앞에 있을 때

                        GuidePanel.setCloseState(true);
                        GuidePanel.showLockGuide(true);
                        playAudio(2);

                    } else {

                        GuidePanel.hideArrow();
                        GuidePanel.setCloseState(false);
                        GuidePanel.showPosterGuide();

                        if (isUser > -1) playAudio(1);          // 화각에 들어오면 : 01_angle 사운드 재생      

                    }

                }

            }

        };

        // mm => pixel
        var getScreenPoint = function (_point) {

            var x = Math.round(_point.x * (1920 + 62 + 1920));
            var y = Math.round(_point.y * 1080);

            var point = { 'x': x, 'y': y };

            return point;

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

                                            selectIndex(0, touch.point.x, touch.point.y, i);

                                        } else if (touch.point.x > (1 / 6) * 1 && touch.point.x < (1 / 6) * 2) {

                                            selectIndex(1, touch.point.x, touch.point.y, i);

                                        } else if (touch.point.x > (1 / 6) * 2 && touch.point.x < (1 / 6) * 3) {

                                            selectIndex(2, touch.point.x, touch.point.y, i);

                                        } else if (touch.point.x > (1 / 6) * 3 && touch.point.x < (1 / 6) * 4) {

                                            selectIndex(3, touch.point.x, touch.point.y, i);

                                        } else if (touch.point.x > (1 / 6) * 4 && touch.point.x < (1 / 6) * 5) {

                                            selectIndex(4, touch.point.x, touch.point.y, i);

                                        } else if (touch.point.x > (1 / 6) * 5 && touch.point.x < (1 / 6) * 6) {

                                            selectIndex(5, touch.point.x, touch.point.y, i);

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

        var lockTrigger = function (vtouch, isAudio) {

            for (var i = 0; i < 6; i++) {

                if (vtouch[i].isTracking) {

                    if (Users[i].tracking == 0) { // *** 락된 사용자

                        if (-vtouch[i].head.z > Area.front && -vtouch[i].head.z < Area.back && vtouch[i].head.x > Area.left && vtouch[i].head.x < Area.right) {

                            if ((vtouch[i].right.isHit || vtouch[i].left.isHit) && (vtouch[i].right.id == "POSTER" || vtouch[i].left.id == "POSTER")) {

                                var leftOrRight = isLockAreaInUse(vtouch[i]);

                                if (leftOrRight > 0) {

                                    if (vtouch[i].trigger == "D" || vtouch[i].trigger == "H") {

                                        if (!isReady) continue;

                                        isReady = false;

                                        if (timeout !== null) clearTimeout(timeout);

                                        timeout = setTimeout(function () {

                                            isReady = true;

                                        }, 1500);

                                        Users[i].isRight = getIsRight(vtouch[i], leftOrRight);
                                        Users[i].tracking = 1;
                                        Users[i].color = leftOrRight;

                                        if (leftOrRight === 1) GuidePanel.doEffect(3);
                                        else if (leftOrRight === 2) GuidePanel.doEffect(0); // 락버튼 애니메이션
                                        if (isAudio) playAudio(13);

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
            //var isUserInLine = -1;
            var isUnlockUserInLine = -1; // 언락 유저가 라인 앞으로 등장
            var isLockUserInLine = -1; // 락 유저가 라인 앞으로 등장
            var isUnlockUser = -1; // 언락 유저가 있는가
            var isLockUserHitDisplay = -1; // 락인 유저가 손 들었을때
            var isUnlockUserHitDisplay = -1; // 언락인 유저가 손 들었을때

            var isUser = -1; // 언락인 유저가 손 들었을때

            // 영역 구분 처리
            for (var i = 0; i < 6; i++) {

                if (vtouch[i].isTracking) {

                    isUser = i;

                    if (Users[i].tracking == -1) { // 없다.

                        Users[i].tracking = 0;
                        console.log("Users " + i + " 이 카메라에 새로 등장함.");

                    } else if (Users[i].tracking == 0) { // *** 락된 사용자

                        if (-vtouch[i].head.z < Area.front) isLockUserInLine = i;

                        if (-vtouch[i].head.z < Area.back && vtouch[i].head.x > Area.left && vtouch[i].head.x < Area.right) {

                            if (vtouch[i].right.isHit || vtouch[i].left.isHit) isLockUserHitDisplay = i;

                            if (-vtouch[i].head.z >= Area.front) isUserInArea = i;

                        }

                    } else if (Users[i].tracking == 1) { // *** 언락된 사용자

                        isUnlockUser = i;

                        if (-vtouch[i].head.z < Area.front) isUnlockUserInLine = i;

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

            trigger(vtouch, isLockUserInLine, isUnlockUserInLine, isUserInArea, isUnlockUser, isLockUserHitDisplay, isUnlockUserHitDisplay, isUser);

        };

        var getIsRight = function (vtouch, _leftOrRight) {

            if (_leftOrRight == 1) { // left

                if (vtouch.right.isHit && vtouch.left.isHit) {

                    if (vtouch.right.id == "POSTER" && vtouch.left.id == "POSTER") {

                        var right = getScreenPoint(vtouch.right.point);
                        var left = getScreenPoint(vtouch.left.point);

                        var isR = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);
                        var isL = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                        if (isR && isL) {

                            console.log("우세안 위치로 비교 right : " + Math.abs(right.x - UNLOCK_LEFT_POS_X) + ", left : " + Math.abs(left.x - UNLOCK_LEFT_POS_X));

                            if (Math.abs(right.x - UNLOCK_LEFT_POS_X) <= Math.abs(left.x - UNLOCK_LEFT_POS_X)) { return true; }
                            else { return false; }

                        } else if (isR) { return true; }

                        else if (isL) { return false; }

                    } else if (vtouch.right.id == "POSTER") {

                        var right = getScreenPoint(vtouch.right.point);
                        var isR = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);

                        if (isR) { return true; }


                    } else if (vtouch.left.id == "POSTER") {

                        var left = getScreenPoint(vtouch.left.point);
                        var isL = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                        if (isL) { return false; }

                    }

                } else if (vtouch.right.isHit) {

                    if (vtouch.right.id == "POSTER") {

                        var right = getScreenPoint(vtouch.right.point);

                        var isR = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);

                        if (isR) { return true; }

                    }

                } else if (vtouch.left.isHit) {

                    if (vtouch.left.id == "POSTER") {

                        var left = getScreenPoint(vtouch.left.point);

                        var isL = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                        if (isL) { return false; }

                    }

                }

                return true;

            } else if (_leftOrRight == 2) { // right

                if (vtouch.right.isHit && vtouch.left.isHit) {

                    if (vtouch.right.id == "POSTER" && vtouch.left.id == "POSTER") {

                        var right = getScreenPoint(vtouch.right.point);
                        var left = getScreenPoint(vtouch.left.point);

                        var isR = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);
                        var isL = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                        if (isR && isL) {

                            console.log("우세안 위치로 비교 right : " + Math.abs(right.x - UNLOCK_RIGHT_POS_X) + ", left : " + Math.abs(left.x - UNLOCK_RIGHT_POS_X));

                            if (Math.abs(right.x - UNLOCK_RIGHT_POS_X) <= Math.abs(left.x - UNLOCK_RIGHT_POS_X)) { return true; }
                            else { return false; }

                        } else if (isR) { return true; }

                        else if (isL) { return false; }

                    } else if (vtouch.right.id == "POSTER") {

                        var right = getScreenPoint(vtouch.right.point);
                        var isR = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);

                        if (isR) { return true; }


                    } else if (vtouch.left.id == "POSTER") {

                        var left = getScreenPoint(vtouch.left.point);
                        var isL = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                        if (isL) { return false; }

                    }

                } else if (vtouch.right.isHit) {

                    if (vtouch.right.id == "POSTER") {

                        var right = getScreenPoint(vtouch.right.point);

                        var isR = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);

                        if (isR) { return true; }

                    }

                } else if (vtouch.left.isHit) {

                    if (vtouch.left.id == "POSTER") {

                        var left = getScreenPoint(vtouch.left.point);

                        var isL = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                        if (isL) { return false; }

                    }

                }

                return true;

            }

        };

        var isLockAreaInUse = function (vtouch) {

            var i = vtouch.id;

            if (vtouch === undefined) return;
            if (vtouch === null) return;
            if (!vtouch.isTracking) return;

            if (vtouch.right.isHit && vtouch.left.isHit) {

                if (vtouch.right.id == "POSTER" && vtouch.right.id == "POSTER") {

                    // 1. 우안 / 좌안 전부 포스터에 닿음.

                    var right = getScreenPoint(vtouch.right.point);
                    var left = getScreenPoint(vtouch.left.point);

                    // 라이트 언락 체크

                    var isR_RLock = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);
                    var isL_RLock = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if (isR_RLock || isL_RLock) return 2;
                   // else return 0;

                    // 레프트 언락 체크

                    var isR_LLock = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);
                    var isL_LLock = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if (isR_LLock || isL_LLock) return 1;
                    else return 0;


                } else if (vtouch.right.id == "POSTER") {

                    // 2. 우안만 포스터에 닿음
                    var right = getScreenPoint(vtouch.right.point);

                    // 라이트 언락 체크

                    var isR_RLock = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);

                    if (isR_RLock) return 2;
                    else return 0;

                    // 레프트 언락 체크

                    var isR_LLock = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);

                    if (isR_LLock) return 1;
                    else return 0;

                } else if (vtouch.left.id == "POSTER") {

                    // 3. 좌안만 포스터에 닿음
                    var left = getScreenPoint(vtouch.left.point);

                    // 라이트 언락 체크

                    var isL_RLock = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if (isL_RLock) return 2;
                    else return 0;

                    // 레프트 언락 체크

                    var isL_LLock = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if (isL_LLock) return 1;
                    else return 0;

                } else return 0;

            } else if (vtouch.right.isHit) {

                if (vtouch.right.id == "POSTER") {

                    // 2. 우안만 포스터에 닿음
                    var right = getScreenPoint(vtouch.right.point);

                    // 라이트 언락 체크

                    var isR_RLock = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);

                    if (isR_RLock) return 2;
                    else return 0;

                    // 레프트 언락 체크

                    var isR_LLock = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);

                    if (isR_LLock) return 1;
                    else return 0;

                }

            } else if (vtouch.left.isHit) {

                if (vtouch.left.id == "POSTER") {

                    // 3. 좌안만 포스터에 닿음
                    var left = getScreenPoint(vtouch.left.point);

                    // 라이트 언락 체크

                    var isL_RLock = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if (isL_RLock) return 2;
                    else return 0;

                    // 레프트 언락 체크

                    var isL_LLock = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if (isL_LLock) return 1;
                    else return 0;

                } else return 0;

            } else return 0;

            return 0;

        };

        var reload = function () {

            location.reload(true);

        };

        var like = function (_id) {
            /*
            WinJS.xhr({
    
                url: "http://lotte.vtouchinc.com/api/like/" + _id,
    
                headers: { "If-Modified-Since": "Mon, 27 Mar 1972 00:00:00 GMT" }
    
            }).done(
    
                function completed(req) {
    
                    console.log("like success");
    
                },
                function error(req) {
    
                    console.log("like error");
    
                },
                function progress(req) {
    
    
                }
    
            );
            */
        };

        var playAudio = function (_index) {

            if (audindex == _index && !audtag.ended) return;

            if (audtag === null) {

                audtag = document.createElement('audio');
                audtag.setAttribute("id", "audtag");
                audtag.setAttribute("controls", "false");
                audtag.setAttribute("msAudioCategory", "backgroundcapablemedia");
                document.getElementById("hooking").appendChild(audtag);

            }

            if (!audtag.paused) {

                audtag.pause();

            }

            audtag.volume = 1.0;
            audtag.setAttribute("src", "audio/" + _index + ".mp3");
            audtag.load();
            audtag.play();
            audindex = _index;

        };

        

        /*
            * 초기화
            * 돔 생성
        */
        var init = function () {

            var self = this;

            PosterPanel.setApp(self);
            GuidePanel.setApp(self);
            VideoPanel.setApp(self);

            // 1. state 파일을 읽어서 돔 생성.
            WinJS.xhr({

                url: serviceIp + "state.txt",

                headers: { "If-Modified-Since": "Mon, 27 Mar 1972 00:00:00 GMT" }

            }).then(function (xhr) {

                var items = JSON.parse(xhr.responseText);

                for (var i = 0; i < items.movies.length; i++) {

                    if (items.movies[i].title === undefined) continue;

                    movieDB.push(items.movies[i]);

                }

                PosterPanel.makeDom();
                VideoPanel.makeDom();

            });

            if (audtag === null) {

                audtag = document.createElement('audio');
                audtag.setAttribute("id", "audtag");
                audtag.setAttribute("controls", "false");
                audtag.setAttribute("msAudioCategory", "backgroundcapablemedia");
                document.getElementById("hooking").appendChild(audtag);

            }

        };

        var getRootPath = function () {

            return rootPath;

        };

        return {

            init: init,

            rootPath: rootPath,

            getIndex: getIndex,

            getMovieDB: getMovieDB,

            selectIndex: selectIndex,

            nextIndex: nextIndex,

            prevIndex: prevIndex,

            checkVTouch: checkVTouch,

            reload: reload,

            like: like,

            playAudio: playAudio,

            getRootPath: getRootPath

        };

    }());

    return app;

});