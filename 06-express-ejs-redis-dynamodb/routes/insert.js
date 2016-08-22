module.exports = (function(){
    "use strict";

    var fs = require('fs');
    var path = require('path');
    var mongojs = require('mongojs');
    var moment = require('moment');

    /**
     * 모듈을 시작하는 함수
     */
    var insertDB = function(_filename, _callback) {

        var lowData = readFile(_filename);
        var isTracking = selectIsTracking(lowData);

        var masterData = [];

        for(var i = 0 ; i < isTracking.isTrackingUser.length ; i++) {

            masterData.push(isTracking.isTrackingUser[i]);

        }

        checkUser(masterData, _callback);

    };

    /**
     * 미확정 파일을 읽는 함수. 인자로 어떤 파일을 읽을지 선택한다. 미확정 데이터는 모듈 안에 보관한다.
     */
    var pendingDataFile = function() {

        var data = fs.readFileSync("/home/ubuntu/lotte/routes/pendingData/data.json");

        var pendingData = JSON.parse(data);

        return pendingData;

    };

    /**
     * 파일을 읽는 함수. 인자로 어떤 파일을 읽을지 선택한다. 파일 네임은 경로까지 정해줘야 한다.
     */
    var readFile = function(_filename) {

        var lowData = JSON.parse(fs.readFileSync(_filename));

        return lowData;

    };

    /**
     * 이번에 들어온 데이터 파일에서 isTracking이 true가 포함된 프레임만 뽑아낸다.
     */
    var selectIsTracking = function(_lowData) {

        var isTrackingUser = [];

        var systemCheckLog = [];     

        Outer:
        for(var i = 0 ; i < _lowData.length; i++) {

            var nowFrameTime = moment(_lowData[i].Time.substring(0,8) + "T" + _lowData[i].Time.substring(8,17) , 'YYYYMMDDHHmmssSSS'); 

            if(i !== 0 ) {

                var beforeFrameTime = moment(_lowData[i-1].Time.substring(0,8) + "T" + _lowData[i-1].Time.substring(8,17) , 'YYYYMMDDHHmmssSSS');

                if( nowFrameTime.diff(beforeFrameTime , 'milliseconds') > 33) systemCheckLog.push({ "Data" : _lowData , "event" : "unNormalFrame"});

            }

            Inner:
            for(var j = 0 ; j < 6 ; j++) {

                if (_lowData[i].vtouch[j].isTracking) {

                  isTrackingUser.push(_lowData[i]);
                  continue Outer;

                }

                

            }

        }

        return {

            isTrackingUser : isTrackingUser,
            systemCheckLog : systemCheckLog

        };

    };

    /**
     * 데이터를 분석하는 함수. 확정된 데이터는 지정된 공간에 저장하고, 모든 작업이 끝난뒤 데이터베이스에 입력한다.
     */
    var checkUser = function(_masterData, _callback) {

        var pendingData = pendingDataFile();

        // 존 영역 , 롯데시네마 기준
        var ZoneArea = {

            front: 1700,
            back: 2600,
            left: -1200,
            right: 1200

        };

        var showUserCount = [0,0,0,0,0,0];

        var confirmData = [[],[],[],[],[],[]];

        var assistData = [[],[],[],[],[],[]];

        var lastSelect = {
                            "action" : null,
                            "actionTime" : null,
                            "actionIndex" : null,
                            "lastIndex" : null
                         };

        var sortData = [];

        console.log("_masterData.length : " + _masterData.length);

        if(_masterData.length === 0) {

            console.log("start");

            for (var j = 0 ; j < 6 ; j++) {

                if(pendingData.remainuser[j].key !== undefined) {

                    confirmData[j][showUserCount[j]] = {

                        "key" : pendingData.remainuser[j].key,
                        "log" : pendingData.remainuser[j].log

                    }

                    assistData[j][showUserCount[j]] = {

                        "unLock" : pendingData.remainuser[j].unLock,
                        "mainEyes" : pendingData.remainuser[j].mainEyes,
                        "inzone" : pendingData.remainuser[j].inzone

                    }

                    if(pendingData.remainuser[j].inzone) {

                        assistData[j][showUserCount[j]].inzone = false;

                        confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "OUTZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                                
                    }

                    var leaveTime = moment(pendingData.lastTime.substring(0,8) + "T" + pendingData.lastTime.substring(8,17) , 'YYYYMMDDHHmmssSSS').add(34,'ms').format("YYYYMMDD" + "T" + "HHmmssSSS");

                    confirmData[j][showUserCount[j]].log.push({ "event" : "LEAVE" , "TIME" : leaveTime });

                    sortData.push(confirmData[j][showUserCount[j]]);

                    // 여기까진 이전 사람 데이터

                    pendingData.remainuser[j] = {};

                    showUserCount[j]++;     

                }

            }

            console.log("end");
            
        } else {

            Outer:
            for(var i =  0 ; i < _masterData.length ; i++) { 
                
                var nowFrameTime = moment(_masterData[i].Time.substring(0,8) + "T" + _masterData[i].Time.substring(8,17) , 'YYYYMMDDHHmmssSSS'); 

                if(i !== 0 ) var beforeFrameTime = moment(_masterData[i-1].Time.substring(0,8) + "T" + _masterData[i-1].Time.substring(8,17) , 'YYYYMMDDHHmmssSSS');
                 
                Inner:
                for(var j = 0 ; j < 6 ; j++) {

                    if(_masterData[i].vtouch[j].isTracking) { // 들어온 데이터의 isTracking 이 true
                        
                        if(i === 0) { // 데이터가 isTracking이고 첫번째 인덱스의 경우에는 이전 파일에서 가져와야할 데이터가 있는지 확인한다.

                            if(pendingData.remainuser[j].key !== undefined) { // 남겨진 데이터 있다.

                                var checkTrueRemainTime = moment(pendingData.remainuser[j].key.substring(0,8) + "T" + pendingData.remainuser[j].key.substring(8,17) , 'YYYYMMDDHHmmssSSS');
                                
                                if(_masterData[i].Index - pendingData.lastIndex === 1 && nowFrameTime.diff(checkTrueRemainTime , 'hours') < 1 ) { // 연속된 프레임이다.

                                    confirmData[j][showUserCount[j]] = {

                                        "key" : pendingData.remainuser[j].key,
                                        "log" : pendingData.remainuser[j].log

                                    }

                                    assistData[j][showUserCount[j]] = {

                                        "unLock" : pendingData.remainuser[j].unLock,
                                        "mainEyes" : pendingData.remainuser[j].mainEyes,
                                        "inzone" : pendingData.remainuser[j].inzone

                                    }

                                    if(-_masterData[i].vtouch[j].head.z > ZoneArea.front && -_masterData[i].vtouch[j].head.z < ZoneArea.back && -_masterData[i].vtouch[j].head.x > ZoneArea.left && -_masterData[i].vtouch[j].head.x < ZoneArea.right) {

                                        if(!assistData[j][showUserCount[j]].inzone) {

                                            assistData[j][showUserCount[j]].inzone = true;

                                            confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "INZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                        }

                                    }

                                    lastSelect.action = pendingData.action;
                                    lastSelect.actionTime = pendingData.actionTime;
                                    lastSelect.actionIndex = pendingData.actionIndex;

                                } else { // 불연속 프레임

                                    confirmData[j][showUserCount[j]] = {

                                        "key" : pendingData.remainuser[j].key,
                                        "log" : pendingData.remainuser[j].log

                                    }

                                    assistData[j][showUserCount[j]] = {

                                        "unLock" : pendingData.remainuser[j].unLock,
                                        "mainEyes" : pendingData.remainuser[j].mainEyes,
                                        "inzone" : pendingData.remainuser[j].inzone

                                    }

                                    if(pendingData.remainuser[j].inzone) {

                                        assistData[j][showUserCount[j]].inzone = false;

                                        confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "OUTZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                                                                
                                    }

                                    lastSelect.action = pendingData.action;
                                    lastSelect.actionTime = pendingData.actionTime;
                                    lastSelect.actionIndex = pendingData.actionIndex;

                                    var leaveTime = moment(pendingData.lastTime.substring(0,8) + "T" + pendingData.lastTime.substring(8,17) , 'YYYYMMDDHHmmssSSS').add(34,'ms').format("YYYYMMDD" + "T" + "HHmmssSSS");

                                    confirmData[j][showUserCount[j]].log.push({ "event" : "LEAVE" , "TIME" : leaveTime });

                                    sortData.push(confirmData[j][showUserCount[j]]);

                                    // 여기까진 이전 사람 데이터

                                    showUserCount[j]++;

                                    // 새로운 인물 등장 

                                    confirmData[j][showUserCount[j]] = {

                                        "key" : nowFrameTime.format("YYYYMMDDHHmmssSSS") + j,
                                        "log" : [ { "vtouch" : _masterData[i].vtouch[j] , "event" : "INFOV" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS")} ]

                                    }

                                    assistData[j][showUserCount[j]] = {

                                        "unLock" : false,
                                        "mainEyes" : null,
                                        "inzone" : false

                                    }

                                    if(-_masterData[i].vtouch[j].head.z > ZoneArea.front && -_masterData[i].vtouch[j].head.z < ZoneArea.back && -_masterData[i].vtouch[j].head.x > ZoneArea.left && -_masterData[i].vtouch[j].head.x < ZoneArea.right) {

                                        if(!assistData[j][showUserCount[j]].inzone) {

                                            assistData[j][showUserCount[j]].inzone = true;

                                            confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "INZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                        }

                                    }

                                }


                            } else { // 남겨진 데이터 없다.

                                confirmData[j][showUserCount[j]] = {

                                    "key" : nowFrameTime.format("YYYYMMDDHHmmssSSS") + j,
                                    "log" : [ { "vtouch" : _masterData[i].vtouch[j] , "event" : "INFOV" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS")} ]

                                }

                                assistData[j][showUserCount[j]] = {

                                    "unLock" : false,
                                    "mainEyes" : null,
                                    "inzone" : false

                                }

                                if(-_masterData[i].vtouch[j].head.z > ZoneArea.front && -_masterData[i].vtouch[j].head.z < ZoneArea.back && -_masterData[i].vtouch[j].head.x > ZoneArea.left && -_masterData[i].vtouch[j].head.x < ZoneArea.right) {

                                    if(!assistData[j][showUserCount[j]].inzone) {

                                        assistData[j][showUserCount[j]].inzone = true;

                                        confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "INZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                    }

                                }

                            }

                        } else { // 중간 이라면 + 화각에 있다.

                            if(_masterData[i].Index - _masterData[i-1].Index === 1) { // 연속된 프레임

                                if(!_masterData[i-1].vtouch[j].isTracking) { // 이전프레임에 화각에 없었다.

                                    confirmData[j][showUserCount[j]] = {

                                        "key" : nowFrameTime.format("YYYYMMDDHHmmssSSS") + j,
                                        "log" : [ { "vtouch" : _masterData[i].vtouch[j] , "event" : "INFOV" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") } ]

                                    }

                                    assistData[j][showUserCount[j]] = {

                                        "unLock" : false,
                                        "mainEyes" : null,
                                        "inzone" : false

                                    }

                                    if(-_masterData[i].vtouch[j].head.z > ZoneArea.front && -_masterData[i].vtouch[j].head.z < ZoneArea.back && -_masterData[i].vtouch[j].head.x > ZoneArea.left && -_masterData[i].vtouch[j].head.x < ZoneArea.right) {

                                        if(!assistData[j][showUserCount[j]].inzone) {

                                            assistData[j][showUserCount[j]].inzone = true;

                                            confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "INZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                        }

                                    }

                                } else { // 이전프레임에 화각에 있었다

                                    // 존에 있는지 확인
                                    if(-_masterData[i].vtouch[j].head.z > ZoneArea.front && -_masterData[i].vtouch[j].head.z < ZoneArea.back && -_masterData[i].vtouch[j].head.x > ZoneArea.left && -_masterData[i].vtouch[j].head.x < ZoneArea.right) {

                                        if(-_masterData[i-1].vtouch[j].head.z > ZoneArea.front && -_masterData[i-1].vtouch[j].head.z < ZoneArea.back && -_masterData[i-1].vtouch[j].head.x > ZoneArea.left && -_masterData[i-1].vtouch[j].head.x < ZoneArea.right) {


                                        } else {

                                            if(!assistData[j][showUserCount[j]].inzone) {

                                                assistData[j][showUserCount[j]].inzone = true;

                                                confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "INZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                            }

                                        }
                                        
                                        if(_masterData[i].vtouch[j].right.isHit || _masterData[i].vtouch[j].left.isHit) {

                                            // 언락하지 않은 유저라면, 
                                            if(!assistData[j][showUserCount[j]].unLock) {

                                                if(lastSelect.action === "unlock" && nowFrameTime.diff(moment(lastSelect.actionTime.substring(0,8) + "T" + lastSelect.actionTime.substring(8,17) , 'YYYYMMDDHHmmssSSS') , 'milliseconds') < 1500) {

                                                    confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "unlockDelay" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                                    continue Inner;

                                                }
                                                else if (lastSelect.action === "select" && nowFrameTime.diff(moment(lastSelect.actionTime.substring(0,8) + "T" + lastSelect.actionTime.substring(8,17) , 'YYYYMMDDHHmmssSSS') , 'milliseconds') < 500) {

                                                    confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "selectDelay" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                                    continue Inner;

                                                }

                                                // 언락 체크
                                                var lockCheck = isLockAreaCheck(_masterData[i].vtouch[j]);

                                                if(lockCheck > 0) {

                                                    if(_masterData[i].vtouch[j].trigger === "D" || _masterData[i].vtouch[j].trigger === "H") {

                                                        assistData[j][showUserCount[j]].mainEyes = getIsEyes(_masterData[i].vtouch[j] , lockCheck);

                                                        assistData[j][showUserCount[j]].unLock = true;

                                                        lastSelect.action = "unlock";

                                                        lastSelect.actionTime = _masterData[i].Time;

                                                        lastSelect.actionIndex = _masterData[i].Index;

                                                        confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "UNLOCK" , "mainEyes" : assistData[j][showUserCount[j]].mainEyes , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                                    }

                                                    //confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "unlockFail" , "TIME" : nowFrameTime.format("YYYYMMDDHHmmssSSS") });

                                                } else {

                                                    if(_masterData[i].vtouch[j].trigger === "D" || _masterData[i].vtouch[j].trigger === "H") confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "unlockFail" , "TIME" : nowFrameTime.format("YYYYMMDDHHmmssSSS") });

                                                }

                                            } else {

                                                //언락 상태이므로 다른거 체크
                                                if(assistData[j][showUserCount[j]].mainEyes === "L-Right" || assistData[j][showUserCount[j]].mainEyes === "R-Right") var touch = _masterData[i].vtouch[j].right;
                                                else if(assistData[j][showUserCount[j]].mainEyes === "L-Left" || assistData[j][showUserCount[j]].mainEyes === "R-Left") var touch = _masterData[i].vtouch[j].left;

                                                if(touch.isHit) {

                                                    if(lastSelect.action === "unlock" && nowFrameTime.diff(moment(lastSelect.actionTime.substring(0,8) + "T" + lastSelect.actionTime.substring(8,17) , 'YYYYMMDDHHmmssSSS') , 'milliseconds') < 1500) {

                                                        confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "unlockDelay" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                                        continue Inner;

                                                    }
                                                    else if (lastSelect.action === "select" && nowFrameTime.diff(moment(lastSelect.actionTime.substring(0,8) + "T" + lastSelect.actionTime.substring(8,17) , 'YYYYMMDDHHmmssSSS') , 'milliseconds') < 500) {

                                                        confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "selectDelay" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                                        continue Inner;

                                                    }

                                                    if(touch.id === "POSTER" || touch.id === "L" || touch.id === "R") {

                                                        if(_masterData[i].vtouch[j].trigger === "D" || _masterData[i].vtouch[j].trigger === "H") {

                                                            lastSelect.action = "select";

                                                            lastSelect.actionTime = _masterData[i].Time;

                                                            lastSelect.actionIndex = _masterData[i].Index;

                                                            if(touch.id === "POSTER") {

                                                                if (touch.point.x > (1 / 6) * 0 && touch.point.x < (1 / 6) * 1) {

                                                                    confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "SELECT" , "POSTER" : "0" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                                                } else if (touch.point.x > (1 / 6) * 1 && touch.point.x < (1 / 6) * 2) {

                                                                    confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "SELECT" , "POSTER" : "1" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                                                    
                                                                } else if (touch.point.x > (1 / 6) * 2 && touch.point.x < (1 / 6) * 3) {

                                                                    confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "SELECT" , "POSTER" : "2" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                                                    
                                                                } else if (touch.point.x > (1 / 6) * 3 && touch.point.x < (1 / 6) * 4) {

                                                                    confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "SELECT" , "POSTER" : "3" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                                                    
                                                                } else if (touch.point.x > (1 / 6) * 4 && touch.point.x < (1 / 6) * 5) {

                                                                    confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "SELECT" , "POSTER" : "4" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                                                } else if (touch.point.x > (1 / 6) * 5 && touch.point.x < (1 / 6) * 6) {

                                                                    confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "SELECT" , "POSTER" : "5" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                                                    
                                                                }

                                                            } else if(touch.id === "L") {

                                                                confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "SELECT" , "POSTER" : "L" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                                            } else if(touch.id === "R") {

                                                                confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "HIT" , "note" : "SELECT" , "POSTER" : "R" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                                            }

                                                        } else {


                                                        }

                                                    } else {


                                                    }

                                                }

                                            }

                                        }

                                    } else {

                                        if(-_masterData[i-1].vtouch[j].head.z > ZoneArea.front && -_masterData[i-1].vtouch[j].head.z < ZoneArea.back && -_masterData[i-1].vtouch[j].head.x > ZoneArea.left && -_masterData[i-1].vtouch[j].head.x < ZoneArea.right) {

                                            if(assistData[j][showUserCount[j]].inzone) {

                                                assistData[j][showUserCount[j]].inzone = false;

                                                confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "OUTZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });


                                            }

                                        } else {


                                        }

                                    }

                                }

                            } else { // 불연속 프레임

                                if(_masterData[i - 1].vtouch[j].isTracking) { // 불연속 프레임 + 바로전 인덱스데이터에는 isTracking이라면 이전사람은 나가고 새로운 사람이 등장한것

                                    if(assistData[j][showUserCount[j]].inzone) {

                                        assistData[j][showUserCount[j]].inzone = false;

                                        confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "OUTZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                        
                                    }

                                    var leaveTime = moment(confirmData[j][showUserCount[j]].log[confirmData[j][showUserCount[j]].log.length - 1].TIME , 'YYYYMMDDHHmmssSSS').add(34,'ms').format("YYYYMMDD" + "T" + "HHmmssSSS");

                                    confirmData[j][showUserCount[j]].log.push({ "event" : "LEAVE" , "TIME" : leaveTime });

                                    sortData.push(confirmData[j][showUserCount[j]]);

                                    // 여기까진 이전 사람 데이터

                                    showUserCount[j]++;

                                }

                                confirmData[j][showUserCount[j]] = {

                                    "key" : nowFrameTime.format("YYYYMMDDHHmmssSSS") + j,
                                    "log" : [ { "vtouch" : _masterData[i].vtouch[j] , "event" : "INFOV" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") } ]

                                }

                                assistData[j][showUserCount[j]] = {

                                    "unLock" : false,
                                    "mainEyes" : null,
                                    "inzone" : false

                                }

                                if(-_masterData[i].vtouch[j].head.z > ZoneArea.front && -_masterData[i].vtouch[j].head.z < ZoneArea.back && -_masterData[i].vtouch[j].head.x > ZoneArea.left && -_masterData[i].vtouch[j].head.x < ZoneArea.right) {

                                    if(!assistData[j][showUserCount[j]].inzone) {

                                        assistData[j][showUserCount[j]].inzone = true;

                                        confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "INZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                    }

                                }

                            }

                        }
                        
                    } else { //화각에 없다.
                        
                        if(i !== 0) { // 중간프레임

                            if(_masterData[i - 1].vtouch[j].isTracking) {

                                if(assistData[j][showUserCount[j]].inzone) {

                                    assistData[j][showUserCount[j]].inzone = false;

                                    confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "OUTZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                    
                                }

                                confirmData[j][showUserCount[j]].log.push({"event" : "LEAVE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });

                                sortData.push(confirmData[j][showUserCount[j]]);

                                showUserCount[j]++;

                            }

                        } else { // 첫 프레임에서 

                            if(pendingData.remainuser[j].key !== undefined) { // 남겨진 데이터 있다.

                                confirmData[j][showUserCount[j]] = {

                                    "key" : pendingData.remainuser[j].key,
                                    "log" : pendingData.remainuser[j].log

                                }

                                assistData[j][showUserCount[j]] = {

                                    "unLock" : pendingData.remainuser[j].unLock,
                                    "mainEyes" : pendingData.remainuser[j].mainEyes,
                                    "inzone" : pendingData.remainuser[j].inzone

                                }

                                if(pendingData.remainuser[j].inzone) {

                                    assistData[j][showUserCount[j]].inzone = false;

                                    confirmData[j][showUserCount[j]].log.push({ "vtouch" : _masterData[i].vtouch[j] , "event" : "OUTZONE" , "TIME" : nowFrameTime.format("YYYYMMDD" + "T" + "HHmmssSSS") });
                                    
                                }

                                var leaveTime = moment(pendingData.lastTime.substring(0,8) + "T" + pendingData.lastTime.substring(8,17) , 'YYYYMMDDHHmmssSSS').add(34,'ms').format("YYYYMMDD" + "T" + "HHmmssSSS");

                                confirmData[j][showUserCount[j]].log.push({ "event" : "LEAVE" , "TIME" : leaveTime });

                                sortData.push(confirmData[j][showUserCount[j]]);

                                // 여기까진 이전 사람 데이터

                                showUserCount[j]++;

                            }

                        }

                    }
                    // 마지막 프레임에서 남아있는 사람이 있는지 체크한다.
                    if(i === _masterData.length - 1) {
                        
                        if(confirmData[j][showUserCount[j]] === undefined) pendingData.remainuser[j] = {};
                        else {

                            pendingData.action = lastSelect.action;
                            pendingData.actionTime = lastSelect.actionTime;
                            pendingData.actionIndex = lastSelect.actionIndex;
                            pendingData.lastIndex = _masterData[i].Index;
                            pendingData.lastTime = _masterData[i].Time;
                            pendingData.remainuser[j] = {

                                "key" : confirmData[j][showUserCount[j]].key,
                                "log" : confirmData[j][showUserCount[j]].log,
                                "unLock" : assistData[j][showUserCount[j]].unLock,
                                "mainEyes" : assistData[j][showUserCount[j]].mainEyes,
                                "inzone" : assistData[j][showUserCount[j]].inzone

                            }

                            confirmData[j].splice(confirmData[j].length-1 , 1);

                        }
                        
                    }

                }
                
            }

        }

        var writeFile = JSON.stringify(pendingData);

        fs.writeFileSync("/home/ubuntu/lotte/routes/pendingData/data.json" , writeFile);

        insertMongoDB(sortData, _callback);

    };

    var insertMongoDB = function(_Data, _callback) {

        if (_Data.length === 0) {

	  _callback();
          
          return;

        }

        var db = mongojs("10.0.20.143/lotte", ['log']);
 
        db.log.insert(_Data , function(err) {

            if (err) {

		console.log(err);
            
            } else {

                 console.log("success");
                 db.close();
                        
                 _callback();

            }

        });

    };

    var isLockAreaCheck = function(vtouch) {

        var UNLOCK_RIGHT_POS_X = 3205; // 오른쪽 다트 버튼 중앙 X 위치
        var UNLOCK_LEFT_POS_X = 635; // 왼쪽 다트 버튼 중앙 X위치

        if(vtouch.right.isHit && vtouch.left.isHit) {

            if (vtouch.right.id === "POSTER" && vtouch.right.id === "POSTER") {

                var right = getScreenPoint(vtouch.right.point);
                var left = getScreenPoint(vtouch.left.point);
                var isRR = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);
                var isLR = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                if(isRR || isLR) return 2;
                else {

                    var isRL = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);
                    var isLL = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if(isRL || isLL) return 1;          
                    else return 0;

                }

            } else if(vtouch.right.id === "POSTER") {

                var right = getScreenPoint(vtouch.right.point);
                var isRR = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);

                if(isRR) return 2;
                else {

                    var isRL = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);

                    if(isRL) return 1;          
                    else return 0;

                }

            } else if(vtouch.left.id === "POSTER") {

                var left = getScreenPoint(vtouch.left.point);
                var isLR = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                if(isLR) return 2;
                else {

                    var isLL = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if(isLL) return 1;          
                    else return 0;

                }

            } else return 0;

        } else if (vtouch.right.isHit) {

            if(vtouch.right.id === "POSTER") {

                var right = getScreenPoint(vtouch.right.point);
                var isRR = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);

                if(isRR) return 2;
                else {

                    var isRL = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);

                    if(isRL) return 1;          
                    else return 0;

                }
                
            } else return 0;

        } else if (vtouch.left.isHit) {

            if(vtouch.left.id === "POSTER") {

                var left = getScreenPoint(vtouch.left.point);
                var isLR = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                if(isLR) return 2;
                else {

                    var isLL = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if(isLL) return 1;          
                    else return 0;

                }

            } else return 0;

        } else return 0;

    };

    var getScreenPoint = function(_point) {

        var x = Math.round(_point.x * (1920 + 62 + 1920));
        var y = Math.round(_point.y * 1080);
        var point = { 'x': x, 'y': y };

        return point;

    };

    var getIsEyes = function(vtouch , _leftOrRight) {

        var UNLOCK_RIGHT_POS_X = 3205; // 오른쪽 다트 버튼 중앙 X 위치
        var UNLOCK_LEFT_POS_X = 635; // 왼쪽 다트 버튼 중앙 X위치

        if(_leftOrRight === 1) { // left 언락

            if(vtouch.right.isHit && vtouch.left.isHit) {

                if (vtouch.right.id === "POSTER" && vtouch.right.id === "POSTER") {

                    var right = getScreenPoint(vtouch.right.point);
                    var left = getScreenPoint(vtouch.left.point);
                    var isR = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);
                    var isL = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if(isR && isL) {

                        if (Math.abs(right.x - UNLOCK_LEFT_POS_X) <= Math.abs(left.x - UNLOCK_LEFT_POS_X)) { return "L-Right"; }
                        else { return "L-Left"; }

                    } else if(isR) { return "L-Right"; }
                    else if(isL) { return "L-Left"; }

                } else if(vtouch.right.id === "POSTER") {

                    var right = getScreenPoint(vtouch.right.point);
                    var isR = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);

                    if(isR) { return "L-Right"; }

                } else if(vtouch.left.id === "POSTER") {

                    var left = getScreenPoint(vtouch.left.point);
                    var isL = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if (isL) { return "L-Left"; }

                }

            } else if (vtouch.right.isHit) {

                if(vtouch.right.id === "POSTER") {

                    var right = getScreenPoint(vtouch.right.point);
                    var isR = (right.x > UNLOCK_LEFT_POS_X - 300 && right.x < UNLOCK_LEFT_POS_X + 300 && right.y > 0 && right.y < 1080);

                    if(isR) { return "L-Right"; }
                    
                }

            } else if (vtouch.left.isHit) {

                if(vtouch.left.id === "POSTER") {

                    var left = getScreenPoint(vtouch.left.point);
                    var isL = (left.x > UNLOCK_LEFT_POS_X - 300 && left.x < UNLOCK_LEFT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if (isL) { return "L-Left"; }

                }

            } 

            return "L-Right"; 

        } else if (_leftOrRight === 2) { // Right 언락

            if (vtouch.right.isHit && vtouch.left.isHit) {

                if (vtouch.right.id == "POSTER" && vtouch.left.id == "POSTER") {

                    var right = getScreenPoint(vtouch.right.point);
                    var left = getScreenPoint(vtouch.left.point);

                    var isR = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);
                    var isL = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if (isR && isL) {

                        if (Math.abs(right.x - UNLOCK_RIGHT_POS_X) <= Math.abs(left.x - UNLOCK_RIGHT_POS_X)) { return "R-Right"; }
                        else { return "R-Left"; }

                    } else if (isR) { return "R-Right"; }

                    else if (isL) { return "R-Left"; }

                } else if (vtouch.right.id == "POSTER") {

                    var right = getScreenPoint(vtouch.right.point);
                    var isR = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);

                    if (isR) { return "R-Right"; }


                } else if (vtouch.left.id == "POSTER") {

                    var left = getScreenPoint(vtouch.left.point);
                    var isL = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if (isL) { return "R-Left"; }

                }

            } else if (vtouch.right.isHit) {

                if (vtouch.right.id == "POSTER") {

                    var right = getScreenPoint(vtouch.right.point);

                    var isR = (right.x > UNLOCK_RIGHT_POS_X - 300 && right.x < UNLOCK_RIGHT_POS_X + 300 && right.y > 0 && right.y < 1080);

                    if (isR) { return "R-Right"; }

                }

            } else if (vtouch.left.isHit) {

                if (vtouch.left.id == "POSTER") {

                    var left = getScreenPoint(vtouch.left.point);

                    var isL = (left.x > UNLOCK_RIGHT_POS_X - 300 && left.x < UNLOCK_RIGHT_POS_X + 300 && left.y > 0 && left.y < 1080);

                    if (isL) { return "R-Left"; }

                }

            }

            return "R-Right";

        }
    
    };

    return {

        insertDB:insertDB

    };

}());
