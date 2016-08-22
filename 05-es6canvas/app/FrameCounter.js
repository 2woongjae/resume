class FrameCounter {
  
  constructor() {
    
    this.Lastfps = 0;
    this.frameCount = 0;
    this.LastTime = 0;
    
  }
  
  countFrame() {
    
    this.frameCount++;
    
    const tmpDate = new Date();
    
    if (this.LastTime + 1000 < tmpDate.getTime()) {
      
      this.Lastfps = this.frameCount;
      this.frameCount = 0;
      this.LastTime = tmpDate.getTime();
      
    }
        
  }
  
}

export default FrameCounter;
