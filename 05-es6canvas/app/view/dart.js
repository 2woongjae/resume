import $ from 'jquery';
import Base from './Base';
import * as Constant from '../Constant';

const CONSTANT = Constant.Dart;

const STATE = {
  
  Menu : 0, // 초기 메뉴 화면
  Game : 1, // 실제 게임 화면
  EndResult : 2, // 게임 종료후 결과 화면
  Info : 3, // 게임 설명 화면
  
};

class Dart extends Base {
  
  constructor(_app) {
    super(_app);
        
  }

  init = () => {
    
    this.state = STATE.Menu;
  
    this.isReady = true;
    
    this.setValue();
    
    this.setImage();
    
    this.setAudio();
    
    this.reinitialize();

    return Promise.resolve();

  }
  
  reinitialize() {
    
    $('#debug')
      .empty().hide()
      .append('<button id="btn_start">start</button>')
      .append('<button id="btn_info">info</button>')
      .append('<button id="btn_back">back</button>')
      .append('<button id="btn_shoot">shoot</button>')
      .append('<button id="btn_rematch">rematch</button>')
      .append('<br /><br />')
      .append('<button id="btn_application">Application</button>');
          
    $('#btn_start').click(() => { this. Click_Start() });
    $('#btn_info').click(() => { this. Click_Info() });
    $('#btn_back').click(() => { this. Click_Back() });
    $('#btn_shoot').click(() => { this. Click_Shoot() });
    $('#btn_rematch').click(() => { this. Click_Rematch() });
    
    $('#btn_application').click(() => {this.app.changeView('Application');});

    this.PREPARE_APP();
    this.state = STATE.Menu;
    this.isReady = true;
    
  }
  
  hideLock() {
    
    
  }
  
  Update() {
    
  }

  // 이미지 세팅
  setImage() {
    
    this.img = {
    
      pan: new Image(),
      info: new Image(),
      startbtn : new Image(),
      backbtn : new Image(),
      guide : new Image(),
      redTurn : new Image(),
      greenTurn : new Image(),
      waitIcon : new Image(),
      turnCircle : new Image(),
      turnIcon : new Image(),
      sumIcon : new Image(),
      redDart : new Image(),
      greenDart : new Image(),
      redWin : new Image(),
      greenWin : new Image(),
      
    };
    
    this.img.pan.src = "/app/resource/Application/Dart/pan.png";
    this.img.pan.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.info.src = "/app/resource/Application/Dart/info.png";
    this.img.info.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.startbtn.src = "/app/resource/Application/Dart/start.png";
    this.img.startbtn.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.backbtn.src = "/app/resource/Outside/icon_back.png";
    this.img.backbtn.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.guide.src = "/app/resource/Application/Dart/guide.png";
    this.img.guide.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.redTurn.src = "/app/resource/Application/Dart/red_turn.png";
    this.img.redTurn.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.greenTurn.src = "/app/resource/Application/Dart/green_turn.png";
    this.img.greenTurn.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.waitIcon.src = "/app/resource/Application/Dart/person.png";
    this.img.waitIcon.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.turnCircle.src = "/app/resource/Application/Dart/pop_bust.png";
    this.img.turnCircle.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.turnIcon.src = "/app/resource/Application/Dart/pop_bust_icon.png";
    this.img.turnIcon.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.sumIcon.src = "/app/resource/Application/Dart/sum.png";
    this.img.sumIcon.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.redDart.src = "/app/resource/Application/Dart/dart_red.png";
    this.img.redDart.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.greenDart.src = "/app/resource/Application/Dart/dart_green.png";
    this.img.greenDart.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.redWin.src = "/app/resource/Application/Dart/win_r.png";
    this.img.redWin.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.greenWin.src = "/app/resource/Application/Dart/win_g.png";
    this.img.greenWin.addEventListener('load', this.onResourceLoaded, false);
    
  }
  // 사운드 세팅
  setAudio() {
    
    this.sound = {
      
      bull : new Audio(),
      bust : new Audio(),
      hit : new Audio(),
      win : new Audio(),
      
    };
    
    this.sound.bull.src = "/app/resource/Application/Dart/dartsound/Bull.mp3";
    this.sound.bull.addEventListener('load', this.onResourceLoaded, false);
    
    this.sound.bust.src = "/app/resource/Application/Dart/dartsound/Bust.mp3";
    this.sound.bust.addEventListener('load', this.onResourceLoaded, false);
    
    this.sound.hit.src = "/app/resource/Application/Dart/dartsound/hit.mp3";
    this.sound.hit.addEventListener('load', this.onResourceLoaded, false);
    
    this.sound.win.src = "/app/resource/Application/Dart/dartsound/win.mp3";
    this.sound.win.addEventListener('load', this.onResourceLoaded, false);
    
  }
  
  // 필요한 값들 세팅
  setValue() {
            
    this.props = {
      
      Menu : {
      
        isStart : false,
        isInfo : false,
      
      },
      Game : {
        
        isStart : false,      
        nowPlay : 0,
        score : [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
        quarterScore : [0,0,0,0,0,0,0,0],
        totalScore : [0,0],
        time: 20,
        isTurnChange : false,
        isTurnVector : false,
        isTurnAngle : 0,
        isTurnAlpha : 0,
        
        x : 0,
        y : 0,
        dartSprite : 0,
        isDartAnimation : false,
        isDartColor : null,

      },
      EndResult : {
        
        winnerBG : null,
        
      }
      
    };
      
    this.Timeinterval = null;
    this.Interval = null;
    this.Timeout = null;
    
  }
  
  // 초기화 -> 앱이 실행되면 하게 한다? 혹은 나갈때 한다???
  PREPARE_APP() {
    
    this.setValue();
    
  }
  
  pause() {
    
    this.EXIT();
    
  }
  
  // 종료하기전 호출하는 함수. 
  EXIT() {
    
    this.STOPSOUND();
    clearInterval(this.Timeinterval);
    clearInterval(this.Interval);
    clearTimeout(this.Timeout);
    
  }
  
  // 사운드 종료
  STOPSOUND() {
    
    this.sound.bull.pause();
    this.sound.bust.pause();
    this.sound.hit.pause();
    this.sound.win.pause();
    
  }
  
  // 실제 다트게임을 시작하기전에 호출하는 함수
  PREPARE_DART() {
    
    // 스테이트 변경시키고 게임 시작하면 된다.
    this.Timeout = setTimeout(() => {
        
      this.state = STATE.Game;
      this.props.Game.isStart = false;
      this.props.Game.isTurnAlpha = 0;
        
      this.Interval = setInterval(() => {
                    
        if(this.props.Game.isTurnAlpha === 1.0) {
            
          this.props.Game.isTurnAlpha = 1.0;
          clearInterval(this.Interval);
          this.Timeout = setTimeout(() => {
                            
            this.Interval = setInterval(() => {
                                
              if(this.props.Game.isTurnAlpha === 0) {
                  
                this.props.Game.isTurnAlpha = 0;
                clearInterval(this.Interval);
                this.props.Game.isStart = true;
                this.Timer();
                  
              }
              else this.props.Game.isTurnAlpha = Math.round((this.props.Game.isTurnAlpha - 0.1) * 10 ) / 10;
                
            },30);
              
          },1000);
             
        }
        else this.props.Game.isTurnAlpha = Math.round((this.props.Game.isTurnAlpha + 0.1) * 10 ) / 10;
          
      },30);
                
    },500);
    
  }
  
  // Menu에서 Start 버튼 함수
  Click_Start() {
    
    if (this.state === STATE.Menu && this.isReady && !this.props.Menu.isStart) {
            
      this.props.Menu.isStart = !this.props.Menu.isStart;
      
      this.isReady = !this.isReady;
            
      this.PREPARE_DART();
      
    }
    
  }
  
  // Menu에서 Info 버튼 함수
  Click_Info() {
    
    if (this.state === STATE.Menu && this.isReady && !this.props.Menu.isInfo) {
      
      this.props.Menu.isInfo = !this.props.Menu.isInfo;
      
      this.isReady = !this.isReady;
            
      // 스테이트 변경
      this.Timeout = setTimeout(() => {
        
        this.state = STATE.Info;
        this.isReady = true;
        this.props.Menu.isInfo = false;
        
      },500);
      
    }
    
  }
  
  // Back 버튼 함수
  Click_Back() {
    
    if(this.isReady) { 
      
      this.STOPSOUND();
      
      if (this.state !== STATE.Info) {
        
        this.app.changeView('Application');
        
      } else {
        
        this.isReady = !this.isReady;
       
        this.Timeout = setTimeout(() => {
        
          this.state = STATE.Menu;
          this.isReady = true;
          this.props.Menu.isInfo = false;
        
        },500); 
        
      } 
      
    }
    
  }
  
  // Game에서 다트 던지는 함수
  Click_Shoot(_x , _y) {
    
    if (this.state === STATE.Game && this.isReady && this.props.Game.nowPlay < 24) {
      
      this.isReady = !this.isReady;
      
      this.stopTimer();
      
      this.STOPSOUND();
      
      // 좌표 처리
      this.props.Game.x = (_x === undefined) ? (Math.random() * 960) + 480 : _x;
      this.props.Game.y = (_y === undefined) ? Math.random() * 1080 : _y;
      
      // 다트 색
      this.props.Game.isDartColor = parseInt(parseInt(this.props.Game.nowPlay / 3) % 2) === 0 ? this.img.redDart : this.img.greenDart;  
      
      this.DartAnimation();
    
    }
    
  }
  
  // 다트 날아가는 애니메이션
  DartAnimation() {
    
    // 다트 날아가는 애니메이션 시작됨을 알림.
    this.props.Game.isDartAnimation = true;
    // 다트 이미지의 프레임 초기화
    this.props.Game.dartSprite = 0;
      
    // 다트 스프라이트 이미지 처리
    this.Interval = setInterval(() => {
        
      if(this.props.Game.dartSprite > 8) {
          
        this.props.Game.dartSprite = 8;
        clearInterval(this.Interval);
          
        // 다트 날아가는 애니메이션이 끝나면 점수 처리
        this.props.Game.score[this.props.Game.nowPlay] = this.GetScore(this.props.Game.x,this.props.Game.y);
          
        if(this.props.Game.score[this.props.Game.nowPlay] > 0) this.props.Game.score[this.props.Game.nowPlay] === 50 ? this.sound.bull.play() : this.sound.hit.play();
          
        this.Timeout = setTimeout(() => {
                
          this.NextPlay();
        
        },500);
          
      } 
      else this.props.Game.dartSprite++;
        
    } , 10);  
    
  }
  
  // 다음 선수 
  NextPlay() {
    
    let beforePlay = this.props.Game.nowPlay;
    let nowPlay = this.props.Game.nowPlay+1;
        
    if(nowPlay > 23) {
      
      this.props.Game.nowPlay = 24;
      
      this.props.Game.quarterScore[parseInt(beforePlay / 3)] = this.props.Game.quarterScore[parseInt(beforePlay / 3)] + this.props.Game.score[beforePlay];
      this.props.Game.totalScore = [0,0];
      for(let i = 0 ; i < 8 ; i++) parseInt(i % 2) === 0 ? this.props.Game.totalScore[0] += this.props.Game.quarterScore[i] : this.props.Game.totalScore[1] += this.props.Game.quarterScore[i];
      
      // 일정 시간뒤 종료화면으로
      
      this.Timeout = setTimeout(() => {
        
        this.sound.win.load();
        this.sound.win.play();
        
        this.checkWinner();
        
      },1000);
      
    }
    else {
      
      // 다음 플레이어가 각 팀의 첫번째 일 경우에는 턴 넘기는 애니메이션이 있어야 한다.
      const turnCheck = parseInt(nowPlay % 3);
      // 턴이 넘어가는 경우에는 
      if(turnCheck === 0) {
        
        this.props.Game.isTurnChange = true;
        
        // 팀 체크 : false = red , true = green
        this.props.Game.isTurnVector = (parseInt(nowPlay % 2) === 0 ) ? false : true;
        
        // 레드팀으로 변경시
        if(!this.props.Game.isTurnVector) {
          
          // 시작angle = 180
          this.props.Game.isTurnAngle = 180;
          
          this.props.Game.quarterScore[parseInt(beforePlay / 3)] = this.props.Game.quarterScore[parseInt(beforePlay / 3)] + this.props.Game.score[beforePlay];
          this.props.Game.totalScore = [0,0];
          for(let i = 0 ; i < 8 ; i++) parseInt(i % 2) === 0 ? this.props.Game.totalScore[0] += this.props.Game.quarterScore[i] : this.props.Game.totalScore[1] += this.props.Game.quarterScore[i];
          
          this.Interval = setInterval(() => {
                  
              if(this.props.Game.isTurnAngle <= 0) {
                    
                clearInterval(this.Interval);

                this.Timeout = setTimeout(() => {
                  
                  this.props.Game.nowPlay = nowPlay;
                  this.props.Game.isTurnChange = false;
                  this.props.Game.isDartAnimation = false;
                  
                  this.Timer();

                },500);
                    
              }
              else this.props.Game.isTurnAngle-=5;
                  
          } , 10);
          
        // 그린팀으로 변경시  
        } else {
          
          // 시작angle = 0 
          this.props.Game.isTurnAngle = 0;
          
          this.props.Game.quarterScore[parseInt(beforePlay / 3)] = this.props.Game.quarterScore[parseInt(beforePlay / 3)] + this.props.Game.score[beforePlay];
          this.props.Game.totalScore = [0,0];
          for(let i = 0 ; i < 8 ; i++) parseInt(i % 2) === 0 ? this.props.Game.totalScore[0] += this.props.Game.quarterScore[i] : this.props.Game.totalScore[1] += this.props.Game.quarterScore[i];
          
          this.Interval = setInterval(() => {
                  
              if(this.props.Game.isTurnAngle >= 180) {
                    
                clearInterval(this.Interval);
              
                this.Timeout = setTimeout(() => {

                  this.props.Game.nowPlay = nowPlay;
                  this.props.Game.isTurnChange = false;
                  this.props.Game.isDartAnimation = false;
                      
                  this.Timer();
       
                },500);
       
              }
              else this.props.Game.isTurnAngle+=5;
                  
          } , 10);
          
        }
      // 턴이 넘어가지 않는 경우에는      
      } else {
            
        this.props.Game.nowPlay = nowPlay;
        this.props.Game.quarterScore[parseInt(beforePlay / 3)] = this.props.Game.quarterScore[parseInt(beforePlay / 3)] + this.props.Game.score[beforePlay];
        this.props.Game.totalScore = [0,0];
        for(let i = 0 ; i < 8 ; i++) parseInt(i % 2) === 0 ? this.props.Game.totalScore[0] += this.props.Game.quarterScore[i] : this.props.Game.totalScore[1] += this.props.Game.quarterScore[i];   
        this.Timer();
            
      }
          
    }
    
  }
  
  // 점수 산출
  GetScore(_x , _y) {
    
    let score = 0;
    
    const center = { x: 960, y: 540};
    
    const dist = Math.sqrt( ((_x - center.x) ** 2) + ( (_y - center.y) ** 2 ) );
    
    let angle = (180 / Math.PI) * Math.atan2(( _x - center.x ), (_y - center.y));
    
    angle = angle < 0 ? 360 + angle : angle;
        
    if (dist > 450) score = 0;
    else if (dist < 35) score = 50;
    else if (dist < 67) score = 25;
    else {
      if (angle >= 351 || angle < 9) score = 3;
      else if (angle >= 9 && angle < 27) score = 17;
      else if (angle >= 27 && angle < 45) score = 2;
      else if (angle >= 45 && angle < 63) score = 15;
      else if (angle >= 63 && angle < 81) score = 10;
      else if (angle >= 81 && angle < 99) score = 6;
      else if (angle >= 99 && angle < 117) score = 13;
      else if (angle >= 117 && angle < 135) score = 4;
      else if (angle >= 135 && angle < 153) score = 18;
      else if (angle >= 153 && angle < 171) score = 1;
      else if (angle >= 171 && angle < 189) score = 20;
      else if (angle >= 189 && angle < 207) score = 5;
      else if (angle >= 207 && angle < 225) score = 12;
      else if (angle >= 225 && angle < 243) score = 9;
      else if (angle >= 243 && angle < 261) score = 14;
      else if (angle >= 261 && angle < 279) score = 11;
      else if (angle >= 279 && angle < 297) score = 8;
      else if (angle >= 297 && angle < 315) score = 16;
      else if (angle >= 315 && angle < 333) score = 7;
      else if (angle >= 333 && angle < 351) score = 19;
      if (dist > 270 && dist < 290) score = score * 3;
      else if(dist > 427 && dist < 450) score = score * 2;
      
    }

    return score;
    
  }
  
  // 게임 종료 후, 어떤 팀이 이겼는지 체크
  checkWinner() {
    
    this.props.EndResult.winnerBG = this.props.Game.totalScore[0] > this.props.Game.totalScore[1] ? this.img.redWin : this.img.greenWin;
    
    this.state = STATE.EndResult;
    
    this.isReady = true;
    
  }
  
  // EndResult 에서 Rematch 버튼
  Click_Rematch() {
    
    if(this.isReady && this.state === STATE.EndResult) {
      
      this.isReady = !this.isReady;
      
      this.STOPSOUND();
      
      this.setValue();
      
      this.state = STATE.Game;
         
      this.props.Menu.isStart = !this.props.Menu.isStart;
               
      this.PREPARE_DART();
      
    }
    
  }

  /**
   *  Timer 관련 부분
   */ 
  Timer() {
    
    this.props.Game.time = 20;
    
    this.continueTimer();
    
  }
  
  stopTimer() {
    
    if(this.Timeinterval !== null) clearInterval(this.Timeinterval);
    
  }
  
  continueTimer() {
    
    this.stopTimer();
    
    this.isReady = true;
    
    this.Timeinterval = setInterval(() => {
      
      this.props.Game.time--;
      
      if(this.props.Game.time < 0) {
        
        this.sound.bust.play();
        this.Click_Shoot(2000,2000); // 타임 오버
        
      }
      
    },1000);
    
  }
  
  /**
   *  Render 관련 부분
   */
  Render_Menu() {

    this.drawImage(this.context, this.img.pan, {cx: 960, cy: 540, w: 1920, h: 1080}, null , null);
    this.drawRect({color: 'rgba(25, 27, 38, 0.95)', shape: {cx: 960, cy: 540, w: 1920, h: 1080}});
    (!this.props.Menu.isStart) ? this.drawSpriteImage(this.context, this.img.startbtn, {cx: 960, cy:540, w: 480, h: 480}, null , null) : this.drawSpriteImage(this.context, this.img.startbtn, {cx: 960, cy: 540, w: 480, h: 480, l: 480}, null , null);
    (!this.props.Menu.isInfo) ? this.drawSpriteImage(this.context, this.img.info, {cx: 960, cy: 180, w: 540, h: 121}, null , null) : this.drawSpriteImage(this.context, this.img.info, {cx: 960, cy: 180, w: 540, h: 121, l: 540}, null , null);
    this.drawImage(this.context, this.img.backbtn, {cx: 30, cy: 1050, w: 60, h: 60}, null , null);
    
  }
  
  Render_Game() {
    
    this.drawImage(this.context, this.img.pan, {cx: 960, cy: 540, w: 1920, h: 1080}, null , null);
    
    this.drawImage(this.context, this.img.backbtn, {cx: 30, cy: 1050, w: 60, h: 60}, null , null);
    
    let position = null;
          
    // 각각의 점수 표시되는 부분
    for(let i = 0; i < 4; i++) {
        
      for(let j = 0; j < 6; j++) {
          
        position = (i*6) + j;
          
        const column = parseInt(position / 3); 
        const turn = parseInt(position % 3); // 각 팀의 몇번째 플레이어 인지
        const row = parseInt(column % 2);
                  
        const left = (row === 0) ? (85*turn) + 65 : (85*turn) + 1695;
          
        const top = (95 * i) + 409;
          
        const circleimg = (row === 0) ? this.img.redTurn : this.img.greenTurn;
          
        if(this.props.Game.isStart) {
          
          let circle_alpha = 1;
            
          if(this.props.Game.nowPlay < position) circle_alpha = 0.1;
            
          this.drawImage(this.context, circleimg, {cx: left, cy: top, w: 70, h: 70}, null , circle_alpha);
            
          if(this.props.Game.nowPlay <= position) {
              
            if(this.props.Game.isTurnChange && this.props.Game.nowPlay === position && this.props.Game.score[position] !== null) {
                
              this.drawText(
                this.context, 
                {title: this.props.Game.score[position], width: left, height: (top + 10), font: CONSTANT.TITLE_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
                {strokeStyle: '#000', lineWidth: 1}, 
                {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
              );
                
            }
            else this.drawCircle(this.context, 'rgba(255, 255, 255, 1)',{cx: left , cy: top, r: 6});
            
          } else {
            
            this.drawText(
              this.context,  
              {title: this.props.Game.score[position], width: left, height: (top + 10), font: CONSTANT.TITLE_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
              {strokeStyle: '#000', lineWidth: 1}, 
              {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
            );
            
          }
          
        } else {
            
          this.drawImage(this.context, circleimg, {cx: left, cy: top, w: 70, h: 70}, null , 0.1);

          this.drawCircle(this.context, 'rgba(255, 255, 255, 1)',{cx: left , cy: top, r: 6});
            
        }
          
      }
        
    }
      
    // 쿼터 점수 표시되는 부분
    for(let i = 0; i < 8; i++) {
                    
      const top = (95 * (parseInt(i / 2))) + 409;  
      const left = ( parseInt(i % 2) === 0 ) ? 325 : 1605;
      const circleimg = ( parseInt(i % 2) === 0 ) ? this.img.redTurn : this.img.greenTurn;
        
      if(this.props.Game.isStart) {
        
        let circle_alpha = 1;
        
        if(parseInt(this.props.Game.nowPlay / 3) < i) circle_alpha = 0.1;
              
        this.drawImage(this.context, circleimg, {cx: left, cy: top, w: 70, h: 70}, null , circle_alpha);
        
        if(parseInt(this.props.Game.nowPlay / 3) < i) this.drawCircle(this.context, 'rgba(255, 255, 255, 1)',{cx: left , cy: top, r: 6});
        else {
          this.drawText(
            this.context, 
            {title: this.props.Game.quarterScore[i], width: left, height: (top + 10), font: CONSTANT.TITLE_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
            {strokeStyle: '#000', lineWidth: 1}, 
            {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
          );
          
        }
        
      } else {
          
        this.drawImage(this.context, circleimg, {cx: left, cy: top, w: 70, h: 70}, null , 0.1);
        
        this.drawCircle(this.context, 'rgba(255, 255, 255, 1)',{cx: left , cy: top, r: 6});
          
      }
        
    }
      
    // 시간 표시되는 부분
    for(let i = 0; i < 6; i++) {
        
      const top = 789;
      const turn = parseInt(i % 3);
      const left = ( parseInt(i / 3) === 0 ) ? (85*turn) + 65 : (85*turn) + 1695;
      const circleimg = ( parseInt(i / 3) === 0 ) ? this.img.redTurn : this.img.greenTurn;
        
      if(this.props.Game.isStart) {
        
        let circle_alpha = 0.1;
        
        if(parseInt(this.props.Game.nowPlay % 6) === i  && this.props.Game.nowPlay < 24) circle_alpha = 1;
        
        this.drawImage(this.context, circleimg, {cx: left, cy: top, w: 70, h: 70}, null , circle_alpha);
        
        if(parseInt(this.props.Game.nowPlay % 6) !== i || this.props.Game.nowPlay > 23) this.drawImage(this.context, this.img.waitIcon, {cx: left, cy: top, w: 24, h: 30}, null , 1);
        else if(parseInt(this.props.Game.nowPlay % 6) === i  && this.props.Game.nowPlay < 24) {
          
          this.drawText(
            this.context, 
            {title: this.props.Game.time, width: left, height: (top + 10), font: CONSTANT.TITLE_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
            {strokeStyle: '#000', lineWidth: 1}, 
            {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
          );
          
        }
        
      } else {
          
        this.drawImage(this.context, circleimg, {cx: left, cy: top, w: 70, h: 70}, null , 0.1);
        
        this.drawImage(this.context, this.img.waitIcon, {cx: left, cy: top, w: 24, h: 30}, null , 1);
          
          
      }
        
    }
      
    this.drawImage(this.context, this.img.sumIcon, {cx: 325, cy: 789, w: 64, h: 64}, null , 1);
    this.drawImage(this.context, this.img.sumIcon, {cx: 1605, cy: 789, w: 64, h: 64}, null , 1);
    
    this.drawText(
      this.context,
      {title: 'SCORE BOARD', width: 103, height: 355, font: CONSTANT.TEXT_FONT, fillStyle: '#EEEEEE', textAlign: 'center'},
      {strokeStyle: '#EEEEEE', lineWidth: 0}, 
      {shadowColor: 'rgba(0, 0, 0, 0)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
    );
      
    this.drawText(
      this.context,
      {title: 'SCORE BOARD', width:1827, height: 355, font: CONSTANT.TEXT_FONT, fillStyle: '#EEEEEE', textAlign: 'center'},
      {strokeStyle: '#EEEEEE', lineWidth: 0}, 
      {shadowColor: 'rgba(0, 0, 0, 0)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
    ); 
      
    if(this.props.Game.isStart) {
      
      this.drawText(
        this.context, 
        {title: this.props.Game.totalScore[0], width: 210, height: 82, font: CONSTANT.SCORE_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
        {strokeStyle: '#000', lineWidth: 1}, 
        {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
      );
      
      this.drawText(
        this.context,
        {title: this.props.Game.totalScore[1], width: 1690, height: 82, font: CONSTANT.SCORE_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
        {strokeStyle: '#000', lineWidth: 1}, 
        {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
      );
      
      if(this.props.Game.isDartAnimation) {
        
        this.drawSpriteImage(this.context, this.props.Game.isDartColor, {cx: this.props.Game.x, cy: this.props.Game.y + 148, w: 500, h: 510, l: this.props.Game.dartSprite * 500}, null , 1);
        //this.drawCircle(this.context, 'rgba(255, 0, 0, 1)',{cx: this.props.Game.x , cy: this.props.Game.y, r: 6});
        
      }
      if(this.props.Game.isTurnChange) {
        
        this.drawImage(this.context, this.img.turnCircle, {cx: 960, cy: 540, w: 506, h: 506}, null , 1);
        (!this.props.Game.isTurnVector) ? this.drawRotatedImage(this.img.turnIcon, 960, 540, this.props.Game.isTurnAngle) : this.drawRotatedImage(this.img.turnIcon, 960, 540, this.props.Game.isTurnAngle);
        
      }
      
    } else {
        
      this.drawImage(this.context, this.img.turnCircle, {cx: 960, cy: 540, w: 506, h: 506}, null , this.props.Game.isTurnAlpha);
      this.drawRotatedImage(this.img.turnIcon, 960, 540, 0 , this.props.Game.isTurnAlpha);
        
    }
    
  }
  
  Render_EndResult() {
    
    this.drawImage(this.context, this.props.EndResult.winnerBG, {cx: 960, cy: 540, w: 1920, h: 1080}, null , null);
    
    this.drawImage(this.context, this.img.backbtn, {cx: 30, cy: 1050, w: 60, h: 60}, null , null);
    
    this.drawText(
      this.context, 
      {title: this.props.Game.totalScore[0], width: 355, height: 570, font: CONSTANT.RESULT_FONT, fillStyle: '#ff4a4a', textAlign: 'center'},
      {strokeStyle: '#ff4a4a', lineWidth: 0}, 
      {shadowColor: 'rgba(0, 0, 0, 0)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
    );
    
    this.drawText(
      this.context, 
      {title: this.props.Game.totalScore[1], width: 1565, height: 570, font: CONSTANT.RESULT_FONT, fillStyle: '#009e77', textAlign: 'center'},
      {strokeStyle: '#009e77', lineWidth: 0}, 
      {shadowColor: 'rgba(0, 0, 0, 0)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
    );  
    
  }
 
  Render_Info() {
    
    this.drawImage(this.context, this.img.pan, {cx: 960, cy: 540, w: 1920, h: 1080}, null , null);
    this.drawImage(this.context, this.img.guide, {cx: 960, cy: 540, w: 1920, h: 1080}, null , null);
    this.drawImage(this.context, this.img.backbtn, {cx: 30, cy: 1050, w: 60, h: 60}, null , null);
    
  }
  
  Render() {
        
    if (this.state === STATE.Menu) this.Render_Menu();  
    else if (this.state === STATE.Game) this.Render_Game();  
    else if (this.state === STATE.EndResult) this.Render_EndResult();
    else if (this.state === STATE.Info) this.Render_Info();
    
    this.effect.Render();
    
  }

  onResourceLoaded(params) {
    
    
  }
    
  trigger(_eventName, _id, _hit) {
        
    if (_eventName === '[매니저] 언락유저의 우선권이 생김') {
      
      if (_id === 'BL') this.effect.selectEffect(30, 1050);  
      else {
        
        if (_hit.id === 'DISPLAY') {
                  
          const x = _hit.point.x * 1920;
          const y = _hit.point.y * 1080;
          
          if (this.state === STATE.Menu) {
            
            if (x > 480 && x < 1440 && y > 0 && y < 240) this.Click_Info();
            else if (x > 680 && x < 1240 && y > 240 && y < 840) this.Click_Start();
            
          } else if (this.state === STATE.Game) {
            
            this.Click_Shoot(x, y);
            
          } else if (this.state === STATE.EndResult) {
            
            if (x > 680 && x < 1240 && y > 240 && y < 840) this.Click_Rematch();
            
          }
           
        }
        
      }
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 사라짐 : 영역에서 나감') {
      
      this.effect.cancelEffect();
       
    } else if (_eventName === '[매니저] 언락유저의 우선권이 사라짐 : 취소') {
   
      this.effect.cancelEffect();
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 사라짐 : 컴펌 성공') {
      
      if (_id === 'BL') {
        
        this.effect.confirmEffect();
        this.Click_Back();
        
      }
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 한번 더 셀렉트') {
      
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 스와이프') {
      
      
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 그대로') {
      
     
    }
    
  }
  
  triggerLock(_eventName) {
    
    if (_eventName === '[매니저] 락유저의 우선권이 생김') {
      
      this.effectLock.selectEffect(960, 1050);
      
    } else if (_eventName === '[매니저] 락유저의 우선권이 사라짐 : 영역에서 나감') {
       
       this.effectLock.cancelEffect();
       
    } else if (_eventName === '[매니저] 락유저의 우선권이 사라짐 : 취소') {
      
       this.effectLock.cancelEffect();
      
    } else if (_eventName === '[매니저] 락유저의 우선권이 사라짐 : 컴펌 성공') {
    
      this.effectLock.confirmEffect();
      
      this.hideLock();
      
    } else if (_eventName === '[매니저] 락유저의 우선권이 있는 상태에서 한번 더 셀렉트') {
      
    } else if (_eventName === '[매니저] 락유저의 우선권이 있는 상태에서 그대로') {
     
    }
    
  }
  
  getDrag() {
    
    let sum = 0;
    
    this.drags.forEach(drag => {
      
      sum = sum + drag;
      
    });
    
    return Math.round(sum / this.drags.length);
    
  }
  
}

export default Dart;
