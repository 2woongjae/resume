class TransitionFadeOut {
    
  constructor(app, prevState, nextState, delay) {
      
    this.app = app;
    this.prevState = prevState;
    this.nextState = nextState;
    this.delay = delay;
      
    this.alpha = 0;
      
  }
    
  Update() {
      
    this.alpha += this.delay;
      
    if (this.alpha >= 255) {
        
      this.app.ChangeState(this.nextState);
        
    }
      
  }
    
  Render() {
      
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
      
    this.prevState.Render();
      
    const oldAlpha = context.globalAlpha;
    const oldFillStyle = context.fillStyle;
      
    context.globalAlpha = this.alpha / 255;
    context.fillStyle = '#141414';
    context.fillRect(0, 0, 1920, 1080);
    context.globalAlpha = oldAlpha;
    context.fillStyle = oldFillStyle;
         
  }
  
  trigger(_eventName, _id, _hit) {
    
  }
     
}
  
class TransitionFadeIn {
    
  constructor(app, prevState, nextState, delay) {
      
    this.app = app;
    this.prevState = prevState;
    this.nextState = nextState;
    this.delay = delay;
      
    this.alpha = 255;
      
  }
    
  Update() {
      
    this.alpha -= this.delay;
      
    if (this.alpha <= 0) {
        
      this.app.ChangeState(this.nextState);
        
    }
      
  }
    
  Render() {
      
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
      
    this.nextState.Render();
      
    const oldAlpha = context.globalAlpha;
    const oldFillStyle = context.fillStyle;
      
    context.globalAlpha = this.alpha / 255;
    context.fillStyle = '#141414';
    context.fillRect(0, 0, 1920, 1080);
    context.globalAlpha = oldAlpha;
    context.fillStyle = oldFillStyle;
          
  } 
    
  trigger(_eventName, _id, _hit) {
    
  }
  
}

export {TransitionFadeOut, TransitionFadeIn};
