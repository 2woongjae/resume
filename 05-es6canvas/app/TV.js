import Home from './view/Home';
import Live from './view/Live';
import VodList from './view/VodList';
import Vod from './view/Vod';
import MusicList from './view/MusicList';
import Music from './view/Music';
import Photo from './view/Photo';
import Smart from './view/Smart';
import Thermo from './view/Thermo';
import Door from './view/Door';
import Light from './view/Light';
import Plug from './view/Plug';
import Cctv from './view/Cctv';
import Application from './view/Application';
import Dart from './view/Dart';
import FireStove from './view/FireStove';

import $ from 'jquery';
import FrameCounter from './FrameCounter';
import {TransitionFadeOut, TransitionFadeIn} from './Transition';
import Manager from './VTouch/Manager';

import * as Constant from './Constant';

const CONSTANT = Constant.TV;

class TV {
    
  constructor() {

    Promise.resolve()
           .then(this.createBackground)
           .then(this.createViews)
           .then(this.initViews)
           .then(this.setFirstView)
           .then(this.setMembers)
           .then(this.Start)
           .catch(err => console.log(err));
    
  }

  createViews = () => {

    this.views = {};

    this.views.Home = new Home(this);
    this.views.Live = new Live(this);
    this.views.VodList = new VodList(this);
    this.views.Vod = new Vod(this);
    this.views.MusicList = new MusicList(this);
    this.views.Music = new Music(this);
    this.views.Photo = new Photo(this);
    this.views.Smart = new Smart(this);
    this.views.Application = new Application(this);

    this.views.Thermo = new Thermo(this);
    this.views.Door = new Door(this);
    this.views.Light = new Light(this);
    this.views.Plug = new Plug(this);
    this.views.Cctv = new Cctv(this);

    this.views.Dart = new Dart(this);
    this.views.FireStove = new FireStove(this);

    return Promise.resolve();

  }

  initViews = () => {

    const ps = [];

    for (const prop in this.views) {
      
      ps.push(this.views[prop].init());

    }

    return Promise.all(ps);

  }

  setFirstView = () => {

    this.state = this.views['Home'];

    return Promise.resolve();

  }

  createBackground = () => {

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = 1920;
    canvas.height = 1080;
    canvas.style.width = 1920;
    canvas.style.height = 1080;

    context.fillStyle = '#141414';
    context.fillRect(0, 0, 1920, 1080);

    return Promise.resolve();

  }

  setMembers = () => {

    this.manager = new Manager(this);

    this.frameCounter = new FrameCounter();

    return Promise.resolve();

  }

  Start = () => {

    setInterval(() => {
    
      this.Update();
      this.Render();
     
      this.frameCounter.countFrame();
  
    }, CONSTANT.FPS);

  }
  
  Update() {
    
    if (this.state !== undefined) this.state.Update();
    
  }
  
  Render() {
    
    if (this.state !== undefined) {
      
      this.state.Render();
    
      $('#fps').text('fps : ' + this.frameCounter.Lastfps);

    }
    
  }
  
  changeView(name, payload) {
  
    this.state.pause();

    const view = this.views[name];

    if (payload === undefined) view.reinitialize();
    else view.reinitialize(payload);
          
    this.ChangeState(new TransitionFadeOut(this, this.state, new TransitionFadeIn(this, this.state, view, CONSTANT.CHANGE_VIEW_TIME), CONSTANT.CHANGE_VIEW_TIME));
    
  }
  
  ChangeState(_state) {
    
    this.state = _state;
    
  }
  
}

export default TV;
