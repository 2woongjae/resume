const TV = {
  CHANGE_VIEW_TIME: 20,
  FPS: Math.round(1000 / 60)
};

const Base = {
    
  DRAG_AVG_LENGTH: 5
    
};

const Live = {
  
  TITLE_FONT: '36px Noto Sans CJK KR Thin',
  TITLE_TEXT: 'Home',
  DRAG_AVG_LENGTH: 5,
  DRAG_START_DISTANCE: 100

};

const Home = {
    
  LIST_SHADOW: {color: 'rgba(0, 0, 0, 0.3)', blur: 10, x: 0, y: 2},
  TITLE_FONT: '36px Noto Sans CJK KR Thin',
  TITLE_TEXT: 'Home',
  MAX_INDEX: 2,
  DRAG_AVG_LENGTH: 5,
  DRAG_START_DISTANCE: 100
    
};

const VodList = {
    
  LIST_SHADOW: {color: 'rgba(0, 0, 0, 0.3)', blur: 10, x: 0, y: 2},
  TITLE_FONT: '36px Noto Sans CJK KR Thin',
  VOD_TITLE_FONT: '28px Noto Sans CJK KR Thin',
  TITLE_TEXT: 'Vod',
  MAX_INDEX: 2,
  DRAG_AVG_LENGTH: 5,
  DRAG_START_DISTANCE: 100
    
};

const Vod = {
    
  LIST_SHADOW: {color: 'rgba(0, 0, 0, 0.3)', blur: 10, x: 0, y: 2},
  TITLE_FONT: '36px Noto Sans CJK KR Thin',
  VOD_TITLE_FONT: '28px Noto Sans CJK KR Thin',
  TITLE_TEXT: 'Vod',
  MAX_INDEX: 2,
  DRAG_AVG_LENGTH: 5,
  DRAG_START_DISTANCE: 100
    
};

const MusicList = {
    
  LIST_SHADOW: {color: 'rgba(0, 0, 0, 0.3)', blur: 10, x: 0, y: 2},
  TITLE_FONT: '36px Noto Sans CJK KR Thin',
  MUSIC_TITLE_FONT: '28px Noto Sans CJK KR Thin',
  TITLE_TEXT: 'Music',
  MAX_INDEX: 2,
  DRAG_AVG_LENGTH: 5,
  DRAG_START_DISTANCE: 100
    
};

const Music = {
    
  LIST_SHADOW: {color: 'rgba(0, 0, 0, 0.3)', blur: 10, x: 0, y: 2},
  TITLE_FONT: '36px Noto Sans CJK KR Thin',
  VOD_TITLE_FONT: '28px Noto Sans CJK KR Thin',
  TITLE_TEXT: 'Vod',
  MAX_INDEX: 2,
  DRAG_AVG_LENGTH: 5,
  DRAG_START_DISTANCE: 100
    
};

const Photo = {

  LIST_SHADOW: {color: 'rgba(0, 0, 0, 0.3)', blur: 10, x: 0, y: 2},
  TITLE_FONT: '36px Noto Sans CJK KR Thin',
  PHOTONAME_FONT: '30px Noto Sans CJK KR Thin',
  ISNEW_FONT: '24px Noto Sans CJK KR Thin',
  TITLE_TEXT: 'Photos',
  MAX_INDEX: 2,

};

const Smart = {
  
  LIST_SHADOW: {color: 'rgba(0, 0, 0, 0.3)', blur: 10, x: 0, y: 2},
  TITLE_FONT: '36px Noto Sans CJK KR Thin',
  TITLE_TEXT: 'Smart Home',
  MAX_INDEX: 2,
  DRAG_AVG_LENGTH: 5,
  DRAG_START_DISTANCE: 100
  
};

const Thermo = {

  ROOM_FONT: '36px Noto Sans CJK KR Light',
  FAN_FONT: '60px Light hel 55',
  TEMPERATURE_FONT: '80px Noto Sans CJK KR Light',
  TEMPERATURE__FONT: '30px Noto Sans CJK KR Light',

  MOVE_SPEED: 60,
  MAX_TEMPERATURE : 30,
  MIN_TEMPERATURE : 18,
  
  mode : ['Dehumidify' , 'Cool' , 'Heat' , 'Auto']

};

const Light = {
  
  TITLE_TEXT: 'Lights On / Off',
  
  TITLE_FONT: '36px Noto Sans CJK KR Light',
  LIGHT_FONT: '30px Noto Sans CJK KR Light',
  
  MAX_INDEX: 0
  
};

const Plug = {
  
  TITLE_TEXT: 'Device On / Off',
  
  TITLE_FONT: '36px Noto Sans CJK KR Light',
  LIGHT_FONT: '30px Noto Sans CJK KR Light',
  
  MAX_INDEX: 0

};

const Iot = {
  
  SERVER_HOST: '192.168.123.103:50116',
  
};

const FireStove = {
  FireStove_FONT: '80px Noto Sans CJK KR Light',
  FireStove__FONT: '30px Noto Sans CJK KR Light',
  Max_State: 3,
  Min_State: 0
};

const Application = {
  LIST_SHADOW: {color: 'rgba(0, 0, 0, 0.3)', blur: 10, x: 0, y: 2},
  TITLE_FONT: '36px Noto Sans CJK KR Light',
  TITLE_TEXT: 'Apps',
  MAX_INDEX: 0,
  DRAG_AVG_LENGTH: 5,
  DRAG_START_DISTANCE: 100
};

const Dart = {
  TITLE_FONT: '30px Script MT Std',
  SCORE_FONT: '80px Script MT Std',
  RESULT_FONT: '100px Script MT Std',
  TEXT_FONT: '24px Helvetica Neue LT Pro',
};

export {
  TV,
  Iot,
  Base,
  Home,
  Live,
  VodList,
  Vod,
  MusicList,
  Music,
  Photo,
  Smart, Thermo, Light, Plug, FireStove,
  Application, Dart
};