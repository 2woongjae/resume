define(function (require) {

    // html 로드 되기 전 => init
    var app = require("./controller/app"); // => 어플리케이션 객체의 포인터

    app.init(); // 회사 내규
    
    // html 로드 된 후 동작
    $(function () {

        var socket = io("http://localhost:3000");

        socket.on("connect", function () {

            console.log('connect');

        });

        socket.on("update", function (vtouch, info) {

            if (vtouch === null) console.log("Debug");

            app.checkVTouch(vtouch);

        });

        socket.on("Reload", function () { app.reload(); });

        $(document).keydown(function (e) {

            console.log(e.keyCode);

            if (e.keyCode == 49) app.playAudio(1);
            else if (e.keyCode == 50) app.playAudio(2);
            else if (e.keyCode == 51) app.playAudio(3);
            else if (e.keyCode == 52) app.playAudio(4);
            else if (e.keyCode == 53) app.playAudio(5);
            else if (e.keyCode == 54) app.playAudio(6);
            else if (e.keyCode == 55) app.playAudio(7);

        });

    }); // 스크립트 로드 후 소켓 커넥션 및 이벤트 설정.
    
});