#include <node.h>
#include <windows.h>
#include <stdio.h>

using namespace v8;


//_bClick 0=> move, 1=> down, 2=>up
void DispatchMouseEvent(int _x, int _y, int _bClick = 0){

  SetCursorPos(_x, _y);

  if (_bClick == 1){
    mouse_event(0x02, _x, _y, 0, 0);
  } else if(_bClick == 2) {
    mouse_event(0x04, _x, _y, 0, 0);
  }
}

void DispatchKeyboardEvent(int keycode){

  int key;
  
  if (keycode == 27){
    
    key = VK_ESCAPE;

  }
  else if (keycode == 37){
    
    key = VK_LEFT;

  }
  else if (keycode == 38){
    
    key = VK_UP;

  }
  else if (keycode == 39){
    
    key = VK_RIGHT;

  }
  else if (keycode == 40){

    key = VK_DOWN;
  }
  else if ((keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122) || (keycode >= 48 && keycode <= 57)){
    
    key = keycode;

  } else {

    return;

  }
  
  BYTE keyState[256];


  GetKeyboardState((LPBYTE)&keyState);

  keybd_event(key,
    0x45,
    KEYEVENTF_EXTENDEDKEY | 0,
      0);

  keybd_event(key,
    0x45,
    KEYEVENTF_EXTENDEDKEY | KEYEVENTF_KEYUP,
    0);

  //printf("keyPressed : %d" , key );

}


void MouseEvent(const FunctionCallbackInfo<Value>& args) {
    
  DispatchMouseEvent((int)(args[0]->NumberValue()), (int)(args[1]->NumberValue()), (int)(args[2]->NumberValue()));
  
}

void KeyboardEvent(const FunctionCallbackInfo<Value>& args) {

  DispatchKeyboardEvent((int)(args[0]->NumberValue()));
  
}


void Init(Handle<Object> exports) {
  NODE_SET_METHOD(exports, "mouseEvent", MouseEvent);
  NODE_SET_METHOD(exports, "keyboardEvent", KeyboardEvent);
}

NODE_MODULE(addon, Init)
