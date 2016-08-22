//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved

var Users = [
    {
        tracking:-1,
        triggerState: -1,
        isRight: null,
        vtouch: null,
        vtouch_s: null,
        vtouch_m: null,
        vtouch_p: null,
        vtouch_t: null,
        vtouchs: null
    },
    {
        tracking: -1,
        triggerState: -1,
        isRight: null,
        vtouch: null,
        vtouch_s: null,
        vtouch_m: null,
        vtouch_p: null,
        vtouch_t: null,
        vtouchs: null
    },
    {
        tracking: -1,
        triggerState: -1,
        isRight: null,
        vtouch: null,
        vtouch_s: null,
        vtouch_m: null,
        vtouch_p: null,
        vtouch_t: null,
        vtouchs: null
    },
    {
        tracking:-1,
        triggerState: -1,
        isRight: null,
        vtouch: null,
        vtouch_s: null,
        vtouch_m: null,
        vtouch_p: null,
        vtouch_t: null,
        vtouchs: null
    },
    {
        tracking: -1,
        triggerState: -1,
        isRight: null,
        vtouch: null,
        vtouch_s: null,
        vtouch_m: null,
        vtouch_p: null,
        vtouch_t: null,
        vtouchs: null
    },
    {
        tracking: -1,
        triggerState: -1,  
        isRight: null,
        vtouch: null,
        vtouch_s: null,
        vtouch_m: null,
        vtouch_p: null,
        vtouch_t: null,
        vtouchs: null
    }
];

var Message = {

    userCountInCameraCount: 0,
    isOn: null,
    stopFrame: 10,
    isReady:true,
    isFirstUser: -1,
    isFirstUserLock:-1,
    isFirstUserInSwitch: -1,
    isFirstUserInMusic: -1,
    isFirstUserInPhoto: -1,
    isFirstUserInThermo: -1

};

// public
Message.checkUser = function (_info) {

    if (Message.isOn == null) { // # 처음 프로그램이 실행되어 있으면, isOn 이 null
    
        if (_info.userCountInCamera > 0) {

            console.log("처음이다. 켜져랏!");
            Message.tvOn();

        }

    } else if (Message.isOn) { // # 켜진 상태

        if (_info.userCountInCamera < 1) Message.userCountInCameraCount++;

        if (Message.userCountInCameraCount > Message.stopFrame) {

            console.log("사람없다. 꺼져랏!");
            Message.tvOff();

        }

    } else if (!Message.isOn) {

        if (_info.userCountInCamera > 0) {

            console.log("사람왔다. 켜져랏!");
            Message.tvOn();

        }

    }

};

// private tv 끄기
Message.tvOff = function () {

    // 락 씬으로 교체
    app.setScene(Lock);
    // 씬 히스토리 정리
    self.sceneHistory = [];

    // 전등 끄기
    //Switch.turnOff();
    Users = [
        { tracking: -1, triggerState: -1, isRight: null, vtouch: null, vtouchs: null },
        { tracking: -1, triggerState: -1, isRight: null, vtouch: null, vtouchs: null },
        { tracking: -1, triggerState: -1, isRight: null, vtouch: null, vtouchs: null },
        { tracking: -1, triggerState: -1, isRight: null, vtouch: null, vtouchs: null },
        { tracking: -1, triggerState: -1, isRight: null, vtouch: null, vtouchs: null },
        { tracking: -1, triggerState: -1, isRight: null, vtouch: null, vtouchs: null }
    ];

    // Data
    Message.userCountInCameraCount = Message.stopFrame;
    Message.isOn = false;

};

// private tv 켜기
Message.tvOn = function () {

    // 검은 화면에서 TV 로고와 언락 버튼 띄우기
    Lock.tv_on();
    Lock.showBtn();

    // 데이타 바인딩
    Message.userCountInCameraCount = 0;
    Message.isOn = true;

};

Message.checkVTouch = function (vtouch) {

    var isLOCKHIT = -1;
    var isLOCKAREA = -1;
    var isDISPLAY = -1;
    var isSWITCH = -1;
    var isPHOTO = -1;
    var isTHERMO = -1;
    var isMUSIC = -1;

    // 영역 구분 처리
    for (var i = 0; i < 6; i++) {

        if (vtouch[i].isTracking) {

            // 시작 - 유저의 현재 트리거 스테이트 계산
            if (vtouch[i].trigger == "D") { // D

                if (Users[i].triggerState == -1) {

                    Users[i].triggerState = 0;
                    Users[i].isDownCount = 1;

                } else if (Users[i].triggerState == 0) {

                    Users[i].isDownCount++;

                }

            } else if (vtouch[i].trigger == "U") { // U

                if (Users[i].triggerState == 0) {

                    Users[i].triggerState = 1;

                }

            } else if (vtouch[i].trigger == "NU") { // NU


            } else { // N

                Users[i].triggerState = -1;
                Users[i].isDownCount = 0;

            }
            // 끝 - 유저의 현재 트리거 스테이트 계산

            if (Users[i].tracking == -1) { // 없다.

                Users[i].tracking = 0;
                console.log("Users " + i + " 이 카메라에 새로 등장함.");

            } else if (Users[i].tracking == 0) { // *** 락된 사용자

                if (app.scene.getName() == "Lock") {

                    if ((vtouch[i].right.isHit || vtouch[i].left.isHit) && (vtouch[i].right.id == "DISPLAY" || vtouch[i].left.id == "DISPLAY")) {

                        if (Message.isLockArea(vtouch[i])) {

                            isLOCKAREA = i;

                        }

                        isLOCKHIT = i;
                        
                    }

                } else {

                    if ((vtouch[i].right.isHit || vtouch[i].left.isHit) && (vtouch[i].right.id == "DISPLAY" || vtouch[i].left.id == "DISPLAY")) {

                        if (Message.isLockAreaInUse(vtouch[i])) {

                            isLOCKAREA = i;

                        }

                        isLOCKHIT = i;

                    }

                }

            } else if (Users[i].tracking == 1) { // *** 언락된 사용자

                if (Users[i].isRight === null) console.log("언락된 사용자가 'Users[i].isRight === null' 코드 오류");

                // 각 스페이스 별로 주도자 설정
                var touch = (Users[i].isRight) ? vtouch[i].right : vtouch[i].left;

                if (touch.isHit) {
                    
                    if (touch.id == "DISPLAY" || touch.id == "L" || touch.id == "TL" || touch.id == "T" || touch.id == "TR" || touch.id == "R" || touch.id == "BR" || touch.id == "B" || touch.id == "BL") {
                        // 화면
                        isDISPLAY = i;
                    
                    } else if (touch.id == "SWITCH") {
                        // 스위치
                        isSWITCH = i;

                    } else if (touch.id == "PHOTO") {
                        // 포토
                        isPHOTO = i;

                    } else if (touch.id == "THERMO") {
                        // 온도계
                        isTHERMO = i;

                    } else if (touch.id == "MUSIC") {
                        // 뮤직
                        isMUSIC = i;

                    }

                }

            }

        } else {

            if (Users[i].tracking != -1) {

                Users[i].tracking = -1;
                Users[i].triggerState = -1;
                Users[i].isRight = null;
                Users[i].isDownCount = 0;

                console.log("Users " + i + " 이 카메라에서 사라짐.");

            }

        }

    }



    // 이벤트 전달
    if (app.scene.getName() != "Lock") {

        if (isLOCKHIT > -1) {

            Notification.Lock.show();

        }

    }

    app.scene.trigger(vtouch, isLOCKHIT, isLOCKAREA, isDISPLAY, isSWITCH, isPHOTO, isTHERMO, isMUSIC);

};

Message.getIsRight = function (vtouch) {

    if (vtouch.right.isHit && vtouch.left.isHit) {

        if (vtouch.right.id == "DISPLAY" && vtouch.left.id == "DISPLAY") {

            var right = app.getScreenPoint(vtouch.right.point);
            var left = app.getScreenPoint(vtouch.left.point);

            var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 540 - 200 && right.y < 540 + 340);
            var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 540 - 200 && left.y < 540 + 340);

            if (isR && isL) {

                console.log("우세안 위치로 비교 right : " + Math.abs(right.x - 960) + ", left : " + Math.abs(left.x - 960));

                if (Math.abs(right.x - 960) <= Math.abs(left.x - 960)) {

                    return true;

                } else {

                    return false;

                }

            } else if (isR) {

                return true;

            } else if (isL) {

                return false;

            }

        } else if (vtouch.right.id == "DISPLAY") {

            var right = app.getScreenPoint(vtouch.right.point);
            var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 540 - 200 && right.y < 540 + 340);

            if (isR) {

                return true;

            }

        } else if (vtouch.left.id == "DISPLAY") {

            var left = app.getScreenPoint(vtouch.left.point);
            var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 540 - 200 && left.y < 540 + 340);

            if (isL) {

                return false;

            }

        }

    } else if (vtouch.right.isHit) {

        if (vtouch.right.id == "DISPLAY") {

            var right = app.getScreenPoint(vtouch.right.point);

            var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 540 - 200 && right.y < 540 + 340);

            if (isR) {

                return true;

            }

        }

    } else if (vtouch.left.isHit) {

        if (vtouch.left.id == "DISPLAY") {

            var left = app.getScreenPoint(vtouch.left.point);

            var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 540 - 200 && left.y < 540 + 340);

            if (isL) {

                return false;

            }

        }

    }

    return true;

};

Message.isLockArea = function (vtouch) {

    var i = vtouch.id;

    if (vtouch === undefined) return;
    if (vtouch === null) return;
    if (!vtouch.isTracking) return;

    if (vtouch.right.isHit && vtouch.left.isHit) {

        if (vtouch.right.id == "DISPLAY" && vtouch.left.id == "DISPLAY") {

            var right = app.getScreenPoint(vtouch.right.point);
            var left = app.getScreenPoint(vtouch.left.point);

            var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 540 - 400 && right.y < 540 + 340);
            var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 540 - 400 && left.y < 540 + 340);

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

            var right = app.getScreenPoint(vtouch.right.point);
            var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 540 - 400 && right.y < 540 + 340);

            if (isR) {

                return true;

            } else {

                return false;

            }

        } else if (vtouch.left.id == "DISPLAY") {

            var left = app.getScreenPoint(vtouch.left.point);
            var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 540 - 400 && left.y < 540 + 340);

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

            var right = app.getScreenPoint(vtouch.right.point);

            var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 540 - 400 && right.y < 540 + 340);

            if (isR) {

                return true;

            } else {

                return false;

            }

        }

    } else if (vtouch.left.isHit) {

        if (vtouch.left.id == "DISPLAY") {

            var left = app.getScreenPoint(vtouch.left.point);

            var isL = (left.x > 960 - 300 && left.x < 960 + 300 && left.y > 540 - 400 && left.y < 540 + 340);

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


Message.isLockAreaInUse = function (vtouch) {

    var i = vtouch.id;

    if (vtouch === undefined) return;
    if (vtouch === null) return;
    if (!vtouch.isTracking) return;

    if (vtouch.right.isHit && vtouch.left.isHit) {

        if (vtouch.right.id == "DISPLAY" && vtouch.right.id == "DISPLAY") {

            var right = app.getScreenPoint(vtouch.right.point);
            var left = app.getScreenPoint(vtouch.left.point);

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

            var right = app.getScreenPoint(vtouch.right.point);
            var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 520 && right.y < 1080);

            if (isR) {

                return true;

            } else {

                return false;

            }

        } else if (vtouch.left.id == "DISPLAY") {

            var left = app.getScreenPoint(vtouch.left.point);
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

            var right = app.getScreenPoint(vtouch.right.point);

            var isR = (right.x > 960 - 300 && right.x < 960 + 300 && right.y > 520 && right.y < 1080);

            if (isR) {

                return true;

            } else {

                return false;

            }

        }

    } else if (vtouch.left.isHit) {

        if (vtouch.left.id == "DISPLAY") {

            var left = app.getScreenPoint(vtouch.left.point);

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

(function () {
    "use strict";
    
    var socket = io('http://localhost:50415');

    // 락 사용자 중에 한명이라도 손을 화면을 향할 때
    socket.on("message", function (vtouch, info) {

        if (vtouch === null) console.log("과연 있는가");

        Message.checkUser(info);

        Message.checkVTouch(vtouch);

    });

})();