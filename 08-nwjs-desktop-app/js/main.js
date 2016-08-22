$(function () {
		
	application.run();

	/*
		* [ 디버깅 용 ] 키프레스 이벤트 연결
		* 1 [96] : 새로고침.
	*/
	$(document).keypress(function(e) {application.document_keypress(e);});
		
	// [ 뷰 패널 ]
	$("#panel_view").click(function(){application.panel_view_click();});
		
	// [ 뷰 패널 ] 공간 저장 버튼 클릭.
	$("#btn_save").click(function() {application.panel_view_save_click();});
		
	// [ 키넥트 패널 ] 키넥트 인풋 박스 연결.
	$("#kinect_position_x").change(function() {application.kinect_text_change();});
	$("#kinect_position_y").change(function() {application.kinect_text_change();});
	$("#kinect_position_z").change(function() {application.kinect_text_change();});
	$("#kinect_angle_x").change(function() {application.kinect_text_change();});
	$("#kinect_angle_y").change(function() {application.kinect_text_change();});
		
	// [ 런 패널 ] 시작 / 정지 / 자동 시작 버튼 클릭.
	$("#btn_start").click(function() {application.panel_run_start_click();});
	$("#btn_stop").click(function() {application.panel_run_stop_click();});
	$("#panel_run_check_auto_nor").click(function() {application.panel_run_check_auto_nor_click();});
	$("#panel_run_check_auto_sel").click(function() {application.panel_run_check_auto_sel_click();});
		
	// [ 타이틀바 ] 버튼 클릭.
	$("#titlebar_set").click(function() {application.titlebar_set_click();});
	$("#titlebar_min").click(function() {application.titlebar_min_click();});
	$("#titlebar_close").click(function() {application.titlebar_close_click();});
		
	// 패널 확장 버튼 클릭.
	$("#btn_more").click(function() {application.btn_more_click();});
				
});