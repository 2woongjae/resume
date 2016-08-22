/*
	* A. View 에 바인딩 된 메서드 - 1. 디버깅 용 키보드 바인딩
	* A. View 에 바인딩 된 메서드 - 2. 뷰패널 클릭
	* A. View 에 바인딩 된 메서드 - 3. [뷰 패널] "저장 버튼" 클릭
	* A. View 에 바인딩 된 메서드 - 4. [키넥트 패널] "좌표 및 각도 텍스트" 수정
	* A. View 에 바인딩 된 메서드 - 5. [오브젝트 패널] "좌표 및 사이즈 텍스트" 수정
	* A. View 에 바인딩 된 메서드 - 6. [런 패널] "시작 버튼" 클릭
	* A. View 에 바인딩 된 메서드 - 7. [런 패널] "정지 버튼" 클릭
	* A. View 에 바인딩 된 메서드 - 8-1. [런 패널] "자동 시작 체크 버튼" 클릭 - false => true
	* A. View 에 바인딩 된 메서드 - 8-2. [런 패널] "자동 시작 체크 버튼" 클릭 - true => false
	* A. View 에 바인딩 된 메서드 - 9. [타이틀 바] "설정 버튼" 클릭
	* A. View 에 바인딩 된 메서드 - 10. [타이틀 바] "최소화 버튼" 클릭
	* A. View 에 바인딩 된 메서드 - 11-1. [타이틀 바] "최대화 버튼" 클릭
	* A. View 에 바인딩 된 메서드 - 11-2. [타이틀 바] "최소화 버튼" 클릭
	* A. View 에 바인딩 된 메서드 - 12. [타이틀 바] "닫기 버튼" 클릭
	* A. View 에 바인딩 된 메서드 - 13. [에지] "패널 확장 버튼" 클릭
	* A. View 에 바인딩 된 메서드 - 14. [뷰 패널] "카메라" 드래그
	* A. View 에 바인딩 된 메서드 - 15. [뷰 패널] "오브젝트" 드래그
*/

var application = (function() {
	"use strict";

	/*
		* 상수
	*/
	const VIEW_SCALE = 5;

	/*
		* 윈도우와 트레이의 객체 포인터
	*/
	var gui = require("nw.gui");
	var url = require('url');
	var http = require('http');
	var win = gui.Window.get();

	var tray = null;

	var fs = require("fs");

  	var vtouch = require("vtouch");

	var http = require('http');
	var socketio = require('socket.io');
	var moment = require('moment');

	var webServer = http.createServer(function (req, res) {

	  res.writeHead(200, {'Content-Type': 'text/plain'});
	  res.end("vtouch");

	}).listen(3000, function() {

	  console.log("start");

	});

	var io = socketio.listen(webServer);
	var socket = null;

	io.sockets.on("connection", function (_socket) {

		socket = _socket;
	  	console.log("connect");

		socket.on("cancel", function(_id) {

			console.log("cancel : " + _id);
			cancel(_id);

		});

	});

  /*
    * 스페이스 관련
  */
  var SPACE_FILE_NAME = "space.json";
  var space = {
		kinect:{
			position:{x:0,y:0,z:0},
			angle:{x:0,y:0,z:0}
    },
    objects:[]
  };

  /*
		* 실행 중인지 리턴하는 값.
	*/
	var isRunning = false;

	/*
		* 자동 시작 체크
	*/
	var auto = false;
	var SETTINGS_FILE_NAME = "settings.json";
	var settings = {
		auto:false,
		port:50416
	};

	/*
		* 현재 타겟이 있는지 확인하는 값.
	*/
	var isTarget = false;

	/*
		* 유저 객체.
	*/
	var Users = [];

	/*
		* 컨텐츠 확인 
	*/
	var ServiceState = null;
	var ServiceInterval = null;
	var DOWNLOAD_DIR = './Downloads/';

	ServiceState = JSON.parse(fs.readFileSync('./state.txt', 'utf8'));

	var ServiceStart = function() {

		console.log('Service Start');

		ServiceUpdate();

		ServiceInterval = setInterval(function() {

			ServiceUpdate();

		} , 1000 * 60 * 10);

	};

	var ServiceUpdate = function() {

		$.get("http://lotte.vtouchinc.com/api/update/" + ServiceState.reg_date, function(data) {

			if (data == "N") {

				console.log("변화 없음.");

			} else {

				// 다운로드 리모트 => 로컬
				for (var i = 0; i < data.movies.length; i++) {

					download_file_httpget(data.movies[i].poster_url);
					download_file_httpget(data.movies[i].video_url);

				}

	            // 시간 저장
	            ServiceState = data;

	            fs.writeFileSync('./state.txt', JSON.stringify(ServiceState));

	            // 리셋 신호 보내기
				setTimeout(function () {
					
					ServiceReload();
				
				}, 1000 * 60 * 5);
				
			}
		
		});

	};

	var download_file_httpget = function(file_url) {
		
		var options = {
		   host: url.parse(file_url).host,
		   port: 80,
		   path: url.parse(file_url).pathname
		};

		var file_name = url.parse(file_url).pathname.split('/').pop();
		
		if (fs.existsSync(DOWNLOAD_DIR + file_name)) {
		
			console.log("이미 있음");
			
			return;
			
		}
		
		var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

		http.get(options, function(res) {
		   
		   	res.on('data', function(data) {
		           
		        file.write(data);
		    
		    }).on('end', function() {
		           
		        file.end();
		        console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
		       
		    });
		
		});
		
	};

	var ServiceReload = function() {

		console.log("리로드");

	};

	// 파일 저장 ( 임시 )

	var vtouchDataGroup = [];
	var saveFrameNum = 9000; // 1분 : 1800개 
	var saveFile = function(_vtouch) {

		var time = moment().format('YYYYMMDDHHmmssSSS');

		var vtouch = _vtouch;

		vtouchDataGroup.push({
			time: time,
			vtouch: vtouch
			});

		if (vtouchDataGroup.length === saveFrameNum) {
			var fileName = 'logs/' + time + '.json';
			fs.writeFileSync(fileName, JSON.stringify(vtouchDataGroup));
			vtouchDataGroup = [];
		} 
	};

  	/*
		* 초기화
  	*/
	var run = function() {

		ServiceStart();

		/*
			* 윈도우 사이즈에 맞게 재조직.
		*/
		if (win.width == 880) win_resize("small");
		else if (win.width == 1282) win_resize("large");

		/*
			* [ tray 초기화 및 이벤트 바인딩 ]
		*/
		tray = new gui.Tray({icon:'icon.png'});

		var trayMenu = new gui.Menu();

		var openMenuItem = new gui.MenuItem({ label: '열기'});
		var startMenuItem = new gui.MenuItem({ label: '시작'});
		var stopMenuItem = new gui.MenuItem({ label: '정지'});
		var exitMenuItem = new gui.MenuItem({ label: '끝내기'});

		openMenuItem.click = function() {tray_open_click();};
		startMenuItem.click = function() {tray_start_click();};
		stopMenuItem.click = function() {tray_stop_click();};
		exitMenuItem.click = function() {tray_exit_click();};

		trayMenu.append(openMenuItem);
		trayMenu.append(new gui.MenuItem({type:'separator'}));
		trayMenu.append(startMenuItem);
		trayMenu.append(stopMenuItem);
		trayMenu.append(new gui.MenuItem({type:'separator'}));
		trayMenu.append(exitMenuItem);

		tray.menu = trayMenu;

		/*
			* 트레이 아이콘을 클릭할 때 불리는 이벤트.
		*/
		tray.on('click', function() {tray_click();});

		/*
			* 윈도우 닫을 때 불리는 이벤트.
		*/
		win.on('close', function() {win_close();});

		/*
			* 윈도우 닫고 나서 불리는 이벤트.
		*/
		win.on('closed', function() {win_closed();});

		space = JSON.parse(fs.readFileSync(SPACE_FILE_NAME));

		/*
			* 스페이스를 뷰에 적용
		*/
		spaceToView();

		//console.log("vtouch event start");
		setLog("vtouch event start");

		vtouch.setCallback(function(_vtouch, _info) {

			update(_vtouch, _info);

			saveFile(_vtouch);

		});

		settings = JSON.parse(fs.readFileSync(SETTINGS_FILE_NAME));

		if (settings.auto) {

			panel_run_check_auto_nor_click();
			$("#panel_run_input_text_port").val(settings.port);
			panel_run_start_click();

		} else {

			panel_run_check_auto_sel_click();

		}

	};

	var tray_click = function() {

		win.show();
		win.focus();

	};

	var tray_open_click = function() {

		win.show();
		win.focus();

	};

	var tray_start_click = function() {

		panel_run_start_click();

	};

	var tray_stop_click = function() {

		panel_run_stop_click();

	};

	var tray_exit_click = function() {

		// 트레이 없애기
		if (tray !== null) {

		    tray.remove();
			tray = null;

		}

		// 윈도우 없애기
		if (win !== null) {

			win.close(true);
			win = null;

		}

	};

	var win_close = function() {

		win.hide();

	};

	var win_closed = function() {

		win = null;

	};

	window.onfocus = function() {

		$("body").css({"background-color":"#00ff54"});

	};

	window.onblur = function() {

  		$("body").css({"background-color":"#505050"});

	};

	var win_resize = function(_str) {

		if (_str == "large") {

			$("#content").css({"width":"1280px"});
			$("#titlebar").css({"width":"1280px"});
			$("#titlebar_border_bottom").css({"width":"1262px"});
			$("#panels").show();
			$("#btn_start").css({"top":"57px","right":"8px"});
			$("#btn_stop").css({"top":"57px","right":"8px"});

		} else if (_str == "small") {

			$("#content").css({"width":"878px"});
			$("#titlebar").css({"width":"878px"});
			$("#titlebar_border_bottom").css({"width":"860px"});
			$("#panels").hide();
			$("#btn_start").css({"top":"98px","right":"27px"});
			$("#btn_stop").css({"top":"98px","right":"27px"});

		}

	};

	/*
		* A. View 에 바인딩 된 메서드 - 1. 디버깅 용 키보드 바인딩
	*/
	var document_keypress = function(e) {

		if (e.keyCode == 96) win.reload();

	};

	/*
		* A. View 에 바인딩 된 메서드 - 2. 뷰패널 클릭
	*/
	var panel_view_click = function() {

		if (!isTarget) {

			$(".object").css({"background-color":"transparent"});
			$(".object_view").css({"border":"1px solid #fff"});

		}

	};

	/*
		* A. View 에 바인딩 된 메서드 - 3. [뷰 패널] "저장 버튼" 클릭
	*/
	var panel_view_save_click = function() {

		fs.writeFileSync(SPACE_FILE_NAME, JSON.stringify(space));

	};

	/*
		* A. View 에 바인딩 된 메서드 - 4. [키넥트 패널] "좌표 및 각도 텍스트" 수정
	*/
	var kinect_text_change = function() {

		// 1. 반올림 처리
	  	$("#kinect_position_x").val(Math.round(Number($("#kinect_position_x").val())));
		$("#kinect_position_y").val(Math.round(Number($("#kinect_position_y").val())));
		$("#kinect_position_z").val(Math.round(Number($("#kinect_position_z").val())));

	  	$("#kinect_angle_x").val(Math.round(Number($("#kinect_angle_x").val())));
		$("#kinect_angle_y").val(Math.round(Number($("#kinect_angle_y").val())));
		$("#kinect_angle_z").val(0);

		// 2. 키넥트 객체 변경
		var kinect_position_x = Number($("#kinect_position_x").val());
		var kinect_position_y = Number($("#kinect_position_y").val());
		var kinect_position_z = Number($("#kinect_position_z").val());
		var kinect_angle_x = Number($("#kinect_angle_x").val());
		var kinect_angle_y = Number($("#kinect_angle_y").val());
		var kinect_angle_z = Number($("#kinect_angle_z").val());

		space.kinect.position.x = kinect_position_x;
		space.kinect.position.y = kinect_position_y;
		space.kinect.position.z = kinect_position_z;

		space.kinect.angle.x = kinect_angle_x;
		space.kinect.angle.y = kinect_angle_y;
		space.kinect.angle.z = kinect_angle_z;

		// 3. 키넥트 뷰 변경
		$("#kinect").css({

			left:(kinect_position_x / VIEW_SCALE) + (420 - 36),
			top:(820 - 36) - (kinect_position_y / VIEW_SCALE)

		});

	};

	/*
		* A. View 에 바인딩 된 메서드 - 5. [오브젝트 패널] "좌표 및 사이즈 텍스트" 수정
	*/
	var objects_text_change = function(_id) { // _id 는 배열의 인덱스

  		// 1. 반올림 처리
  		$("#input_x_" + _id).val(Math.round(Number($("#input_x_" + _id).val())));
		$("#input_y_" + _id).val(Math.round(Number($("#input_y_" + _id).val())));
		$("#input_w_" + _id).val(Math.round(Number($("#input_w_" + _id).val())));
		$("#input_h_" + _id).val(Math.round(Number($("#input_h_" + _id).val())));

		// 2. 오브젝트 객체 변경
		var id = $("#input_id_" + _id).val();
		var tlx = Number($("#input_x_" + _id).val());
		var tly = Number($("#input_y_" + _id).val());
		var szw = Number($("#input_w_" + _id).val());
		var szh = Number($("#input_h_" + _id).val());

		space.objects[_id].id = id;
		space.objects[_id].tl.x = tlx;
		space.objects[_id].tl.y = tly;
		space.objects[_id].sz.w = szw;
		space.objects[_id].sz.h = szh;


		// 3. 오브젝트 뷰 변경
		$("#input_id_" + _id).html(id);
		$("#object_view" + _id).html();
		$("#object_view" + _id).css({

			width:szw / VIEW_SCALE,
			height:szh / VIEW_SCALE,
			left:(tlx / VIEW_SCALE) + 420,
			top:820 - (tly / VIEW_SCALE)

		});

	};

	/*
		* A. View 에 바인딩 된 메서드 - 6. [런 패널] "시작 버튼" 클릭
	*/
	var panel_run_start_click = function() {

		if (isRunning) {

			//console.log("panel_run_start_click error");

		} else {

			//
			if ($("#panel_run_input_text_port").val() == "") {

				alert("포트를 지정해야 합니다.");

				return;

			}

			vtouch.listen(Number($("#panel_run_input_text_port").val()), function(_isRunning) {

				if (_isRunning) {

					$("#btn_start").hide();
			    	$("#btn_stop").show();
			    	$("#panel_run_check_auto_nor").css({"opacity":"0.5"});
					$("#panel_run_check_auto_sel").css({"opacity":"0.5"});
			    	isRunning = true;
			    	setLog("vtouch event start");

			    	settings.auto = auto;
			    	settings.port = Number($("#panel_run_input_text_port").val());
			    	fs.writeFileSync(SETTINGS_FILE_NAME, JSON.stringify(settings));

				} else {

					alert("start port error");

				}

			});

		}

	};

	/*
		* A. View 에 바인딩 된 메서드 - 7. [런 패널] "정지 버튼" 클릭
	*/
	var panel_run_stop_click = function() {

		if (isRunning) {

			vtouch.close(function(_isRunning) {

				if (_isRunning) {

					alert("stop error");

				} else {

					$("#btn_start").show();
			    	$("#btn_stop").hide();
			    	$("#panel_run_check_auto_nor").css({"opacity":"1.0"});
					$("#panel_run_check_auto_sel").css({"opacity":"1.0"});
			    	isRunning = false;
			    	setLog("vtouch event stop");

				}

			});

		} else {

			//console.log("panel_run_stop_click error");

		}

	};

	/*
		* A. View 에 바인딩 된 메서드 - 8-1. [런 패널] "자동 시작 체크 버튼" 클릭 - false => true
	*/
	var panel_run_check_auto_nor_click = function() {

		if (!isRunning) {

			$("#panel_run_check_auto_nor").hide();
			$("#panel_run_check_auto_sel").show();
			auto = true;

		}

	};

	/*
		* A. View 에 바인딩 된 메서드 - 8-2. [런 패널] "자동 시작 체크 버튼" 클릭 - true => false
	*/
	var panel_run_check_auto_sel_click = function() {

		if (!isRunning) {

			$("#panel_run_check_auto_nor").show();
			$("#panel_run_check_auto_sel").hide();
			auto = false;

		}

	};

	/*
		* A. View 에 바인딩 된 메서드 - 9. [타이틀 바] "설정 버튼" 클릭
	*/
	var titlebar_set_click = function() {

		win.showDevTools();

	};

	/*
		* A. View 에 바인딩 된 메서드 - 10. [타이틀 바] "최소화 버튼" 클릭
	*/
	var titlebar_min_click = function() {

		win.minimize();

	};

	/*
		* A. View 에 바인딩 된 메서드 - 11-1. [타이틀 바] "최대화 버튼" 클릭
	*/
	var titlebar_max_on_click = function() {

		win.minimize();

	};

	/*
		* A. View 에 바인딩 된 메서드 - 11-2. [타이틀 바] "최소화 버튼" 클릭
	*/
	var titlebar_max_off_click = function() {

		win.minimize();

	};

	/*
		* A. View 에 바인딩 된 메서드 - 12. [타이틀 바] "닫기 버튼" 클릭
	*/
	var titlebar_close_click = function() {

		win.hide();

	};

	/*
		* A. View 에 바인딩 된 메서드 - 13. [에지] "패널 확장 버튼" 클릭
	*/
	var btn_more_click = function() {

		if (win.width == 880) {

			win.resizeTo(1282, 930);

			win_resize("large");

		} else if (win.width == 1282) {

			win.resizeTo(880, 930);

			win_resize("small");

		}

	};

	/*
		* A. View 에 바인딩 된 메서드 - 14. [뷰 패널] "카메라" 드래그
	*/
	var kinect_drag_change = function() {

		var x = Math.round(Number((($("#kinect").offset().left - $("#view_frame").offset().left) - (420 - 36)) * VIEW_SCALE));
		var y = Math.round(Number((-(($("#kinect").offset().top - $("#view_frame").offset().top) - (820 - 36))) * VIEW_SCALE));

		space.kinect.position.x = x;
		space.kinect.position.y = y;

		$("#kinect_position_x").val(x);
	  	$("#kinect_position_y").val(y);

	};

	/*
		* A. View 에 바인딩 된 메서드 - 15. [뷰 패널] "오브젝트" 드래그
	*/
	var objects_drag_change = function(_id) {

		var tlx = Math.round(Number((($("#object_view" + _id).offset().left - $("#view_frame").offset().left) - 420) * VIEW_SCALE));
		var tly = Math.round(Number((-(($("#object_view" + _id).offset().top - $("#view_frame").offset().top) - 820)) * VIEW_SCALE));

		space.objects[_id].tl.x = tlx;
		space.objects[_id].tl.y = tly;

		$("#input_x_" + _id).val(tlx);
	  	$("#input_y_" + _id).val(tly);

	};

	var addList = function(_index, _object) {

		var obj = _object;

		// 1. 리스트에 추가
		$("#objects").append("<div class = \"object\" id = \"object" + _index + "\">"
									+ "<input type = \"text\" class = \"input_id\" value = \"" + obj.id + "\" id = \"input_id_" + _index + "\" disabled = \"disabled\" />"
									+ "<div class = \"divide1\"></div>"
									+ "<div class = \"text_w\">W :</div>"
									+ "<input type = \"text\" class = \"input_w\" value = \"" + obj.sz.w + "\" id = \"input_w_" + _index + "\" />"
									+ "<div class = \"text_h\">H :</div>"
									+ "<input type = \"text\" class = \"input_h\" value = \"" + obj.sz.h + "\" id = \"input_h_" + _index + "\" />"
									+ "<div class = \"divide2\"></div>"
									+ "<div class = \"text_x\">X :</div>"
									+ "<input type = \"text\" class = \"input_x\" value = \"" + obj.tl.x + "\" id = \"input_x_" + _index + "\" />"
									+ "<div class = \"text_y\">Y :</div>"
									+ "<input type = \"text\" class = \"input_y\" value = \"" + obj.tl.y + "\" id = \"input_y_" + _index + "\" />"
								+ "</div>");

		// 2. 뷰에 추가
		$("#view_frame").prepend("<div class = \"object_view\" id = \"object_view" + _index + "\">" + obj.id + "</div>");

		$("#object" + _index).click(function() {

			var id = Number((this.id).split("object")[1]);

			// 1. 리스트
			$(".object").css({"background-color":"transparent"});
			$("#object" + id).css({"background-color":"#1a3c25"});

			// 2. 뷰
			$(".object_view").css({"border":"1px solid #fff"});
			$("#object_view" + id).css({"border":"1px solid #2ed666"});

		});

		$("#input_w_" + _index).focus(function() {

			var id = Number((this.id).split("input_w_")[1]);

			// 1. 리스트
			$(".object").css({"background-color":"transparent"});
			$("#object" + id).css({"background-color":"#1a3c25"});

			// 2. 뷰
			$(".object_view").css({"border":"1px solid #fff"});
			$("#object_view" + id).css({"border":"1px solid #2ed666"});

		}).change(function(){

			var id = Number((this.id).split("input_w_")[1]);

			objects_text_change(id);

		});

		$("#input_h_" + _index).focus(function() {

			var id = Number((this.id).split("input_h_")[1]);

			// 1. 리스트
			$(".object").css({"background-color":"transparent"});
			$("#object" + id).css({"background-color":"#1a3c25"});

			// 2. 뷰
			$(".object_view").css({"border":"1px solid #fff"});
			$("#object_view" + id).css({"border":"1px solid #2ed666"});

		}).change(function(){

			var id = Number((this.id).split("input_h_")[1]);

			objects_text_change(id);

		});

		$("#input_x_" + _index).focus(function() {

			var id = Number((this.id).split("input_x_")[1]);

			// 1. 리스트
			$(".object").css({"background-color":"transparent"});
			$("#object" + id).css({"background-color":"#1a3c25"});

			// 2. 뷰
			$(".object_view").css({"border":"1px solid #fff"});
			$("#object_view" + id).css({"border":"1px solid #2ed666"});

		}).change(function(){

			var id = Number((this.id).split("input_x_")[1]);

			objects_text_change(id);

		});

		$("#input_y_" + _index).focus(function() {

			var id = Number((this.id).split("input_y_")[1]);

			// 1. 리스트
			$(".object").css({"background-color":"transparent"});
			$("#object" + id).css({"background-color":"#1a3c25"});

			// 2. 뷰
			$(".object_view").css({"border":"1px solid #fff"});
			$("#object_view" + id).css({"border":"1px solid #2ed666"});

		}).change(function(){

			var id = Number((this.id).split("input_y_")[1]);

			objects_text_change(id);

		});

		var tlx = obj.tl.x;
		var tly = obj.tl.y;

		var szw = obj.sz.w;
		var szh = obj.sz.h;

		$("#object_view" + _index).css({

			width:szw / VIEW_SCALE,
			height:szh / VIEW_SCALE,
			left:(tlx / VIEW_SCALE) + 420,
			top:820 - (tly / VIEW_SCALE)

		});

		$("#object_view" + _index).draggable({

			containment:"#view_frame",
			scroll:false,
			cursor: "move",
			start: function() {

				var id = (this.id).split("object_view")[1];

				// 1. 리스트
				$(".object").css({"background-color":"transparent"});
				$("#object" + id).css({"background-color":"#1a3c25"});

				// 2. 뷰
				$(".object_view").css({"border":"1px solid #fff"});
				$("#object_view" + id).css({"border":"1px solid #2ed666"});

				objects_drag_change(id);

			},
			drag: function() {

				var id = (this.id).split("object_view")[1];

				// 1. 리스트
				$(".object").css({"background-color":"transparent"});
				$("#object" + id).css({"background-color":"#1a3c25"});

				// 2. 뷰
				$(".object_view").css({"border":"1px solid #fff"});
				$("#object_view" + id).css({"border":"1px solid #2ed666"});

				objects_drag_change(id);

	  		},
	  		stop: function() {

				var id = (this.id).split("object_view")[1];

				// 1. 리스트
				$(".object").css({"background-color":"transparent"});
				$("#object" + id).css({"background-color":"#1a3c25"});

				// 2. 뷰
				$(".object_view").css({"border":"1px solid #fff"});
				$("#object_view" + id).css({"border":"1px solid #2ed666"});

				objects_drag_change(id);

	  		},
	  		snap:true

		}).mouseenter(function() {

			isTarget = true;

		}).mouseout(function() {

			isTarget = false;

		}).click(function() {

			var id = (this.id).split("object_view")[1];

			// 1. 리스트
			$(".object").css({"background-color":"transparent"});
			$("#object" + id).css({"background-color":"#1a3c25"});

			// 2. 뷰
			$(".object_view").css({"border":"1px solid #fff"});
			$("#object_view" + id).css({"border":"1px solid #2ed666"});

			objects_drag_change(id);

		});

	};

	// 뷰 변경
	var spaceToView = function() {

		$("#objects").html("");
		$("#view_frame").html(	"<div id = \"kinect\"></div>" +
								"<div class = \"hit\" id = \"user0R\"></div>" +
								"<div class = \"hit\" id = \"user0L\"></div>" +
								"<div class = \"hit\" id = \"user1R\"></div>" +
								"<div class = \"hit\" id = \"user1L\"></div>" +
								"<div class = \"hit\" id = \"user2R\"></div>" +
								"<div class = \"hit\" id = \"user2L\"></div>" +
								"<div class = \"hit\" id = \"user3R\"></div>" +
								"<div class = \"hit\" id = \"user3L\"></div>" +
								"<div class = \"hit\" id = \"user4R\"></div>" +
								"<div class = \"hit\" id = \"user4L\"></div>" +
								"<div class = \"hit\" id = \"user5R\"></div>" +
								"<div class = \"hit\" id = \"user5L\"></div>"	);

		var x = space.kinect.position.x;
		var y = space.kinect.position.y;

		$("#kinect").css({

			left:(x / VIEW_SCALE) + (420 - 36),
			top:(820 - 36) - (y / VIEW_SCALE)

		});

		$("#kinect").draggable({

			containment:"#view_frame",
			scroll:false,
			cursor: "move",
			start: function() {

				kinect_drag_change();

			},
			drag: function() {

				kinect_drag_change();

			},
			stop: function() {

				kinect_drag_change();

			},
			snap:true

		}).click(function() {


		});

		for (var j = 0; j < space.objects.length; j++) {

			if (j != 0) $("#objects").append("<div class = \"object_border\"></div>");
		    addList(j, space.objects[j]);

		}

		//$(".user").css({backgroundColor:"red"});
		$("#kinect_position_x").val(space.kinect.position.x);
		$("#kinect_position_y").val(space.kinect.position.y);
		$("#kinect_position_z").val(space.kinect.position.z);

		$("#kinect_angle_x").val(space.kinect.angle.x);
		$("#kinect_angle_y").val(space.kinect.angle.y);
		$("#kinect_angle_z").val(space.kinect.angle.z);

		vtouch.setSpace(space);

	};

	var cancel = function(_id) {

		if (_id < 0) return;

		var id = Number(_id);

  		var str = "";

    	for (var i = 0; i < 6; i++) {

    		if (id === i) str = str + 1;
      		else str = str + 0;

    	}

		vtouch.cancel(str);

  	};

	//
	var update = function(_vtouch, _info) {

  	for (var i = 0; i < 6; i++) {

			if (_vtouch[i].isTracking) {

				$("#user" + i + " .text_name").css({"color":"white"});	// 0. 네임
				$("#user" + i + " .text_io").html("In").css({"color":"white"});	// 1. 인
				$("#user" + i + " .text_lock").html("").css({"color":"rgba(255, 255, 255, 0.05)"}); // 2. 노락
				$("#user" + i + " .text_eye").html("");	// 3. 우세안

			} else {

				$("#user" + i + " .text_name").css({"color":"rgba(255, 255, 255, 0.05)"}); // 0. 네임
				$("#user" + i + " .text_io").html("Out").css({"color":"rgba(255, 255, 255, 0.05)"}); // 1. 아웃
				$("#user" + i + " .text_lock").html("").css({"color":"rgba(255, 255, 255, 0.05)"}); // 2. 노락
				$("#user" + i + " .text_eye").html(""); // 3. 우세안

			}

		}

	  for (var i = 0; i < 6; i++) {

	  	if (_vtouch[i].isTracking) {

	  		if (_vtouch[i].right.isHit) {

	  			$("#user" + i + "R").css({
	  				backgroundColor:"white",
	  				left:(_vtouch[i].rightHit.x / VIEW_SCALE) + 420 - 5,
	  				top:-(_vtouch[i].rightHit.y / VIEW_SCALE) + 820 - 5
	  			}).show();

	  		} else {

	  			$("#user" + i + "R").css({
	  				backgroundColor:"red",
	  				left:(_vtouch[i].rightHit.x / VIEW_SCALE) + 420 - 5,
	  				top:-(_vtouch[i].rightHit.y / VIEW_SCALE) + 820 - 5
	  			}).show();

	  		}

	  		if (_vtouch[i].left.isHit) {

	  			$("#user" + i + "L").css({
	  				backgroundColor:"white",
	  				left:(_vtouch[i].leftHit.x / VIEW_SCALE) + 420 - 5,
	  				top:-(_vtouch[i].leftHit.y / VIEW_SCALE) + 820 - 5
	  			}).show();

	  		} else {

	  			$("#user" + i + "L").css({
	  				backgroundColor:"red",
	  				left:(_vtouch[i].leftHit.x / VIEW_SCALE) + 420 - 5,
	  				top:-(_vtouch[i].leftHit.y / VIEW_SCALE) + 820 - 5
	  			}).show();

			}

	  	} else {

			// 뷰패널
	  		$("#user" + i + "R").css({backgroundColor:"red"}).hide();
	  		$("#user" + i + "L").css({backgroundColor:"red"}).hide();

	  	}

	  }

		if (socket !== null) socket.emit("update", _vtouch, _info);

	};

	var setLog = function(_string) {

		if(_string === undefined) _string = "";

		$("#panel_logs_text").html(_string);

	};

	return {

		run:run,

		document_keypress:document_keypress,

		panel_view_click:panel_view_click,
		panel_view_save_click:panel_view_save_click,

		kinect_text_change:kinect_text_change,
		objects_text_change:objects_text_change,

		panel_run_start_click:panel_run_start_click,
		panel_run_stop_click:panel_run_stop_click,
		panel_run_check_auto_nor_click:panel_run_check_auto_nor_click,
		panel_run_check_auto_sel_click:panel_run_check_auto_sel_click,

		titlebar_set_click:titlebar_set_click,
		titlebar_min_click:titlebar_min_click,
		titlebar_max_on_click:titlebar_max_on_click,
		titlebar_max_off_click:titlebar_max_off_click,
		titlebar_close_click:titlebar_close_click,

		btn_more_click:btn_more_click

	};

}());