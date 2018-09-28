# ShortCutManager
DOM에 단축키를 부여하고 관리합니다  
사용방법은 아래의 예제로 설명을 대신합니다  
데모는 https://codepen.io/cssbaby/pen/wYvjjo 에서 체험 가능합니다  

```javascript
new ShortCutManager({
   element: document.getElementById('test1'),
   short_cut: [{
      combination: ['KeyA'], command: function (obj) {
         console.log('에이 키를 눌렀다');
      }
   }]
});
new ShortCutManager({
   element: document.getElementById('test2'),
   short_cut: [{
      combination: ['KeyA'], once: true, command: function (obj) {
         console.log('에이 키를 눌렀다. once 옵션이 주어져서 키를 누르고 있어도 계속 이벤트가 발생하지는 않는다. 다만 입력은 된다');
      }
   }]
});
new ShortCutManager({
   element: document.getElementById('test3'),
   short_cut: [{
      combination: ['ControlLeft', 'KeyA'], command: function (obj) {
         console.log('컨트롤+에이 키를 눌렀다');
      }
   }]
});
new ShortCutManager({
   element: document.getElementById('test4'),
   short_cut: [{
      combination: ['ControlLeft', 'KeyA'], prevent_default: true, command: function (obj) {
         console.log('컨트롤+에이 키를 눌렀다. prevent_default 옵션이 주어져서 전체선택은 되지 않는다');
      }
   }]
});
new ShortCutManager({
   element: document.getElementById('test5'),
   short_cut: [{
      combination: [['ControlLeft', 'KeyB'], ['ShiftLeft', 'KeyB']], command: function (obj) {
         console.log('컨트롤+b, 쉬프트+b 두개의 이벤트를 걸 수 있다');
      }
   }]
});
new ShortCutManager({
   element: document.getElementById('test6'),
   short_cut: [{
      combination: ['ControlLeft', 'KeyB'], command: function (obj) {
         console.log('컨트롤+b 눌림');
      }
   }, {
      combination: ['KeyB'], command: function (obj) {
         console.log('그냥 b 눌림');
      }
   }, {
      combination: ['Backspace'], command: function (obj) {
         console.log('그냥 Backspace 눌림');
      }
   }, {
      combination: [], prevent_default: true, command: function (obj) {
         console.log('키가 특별히 정해지지않은 것 (' + obj.event.code + ') 들에 대해서 모두 이 이벤트가 발생한다');
      }
   }]
});
new ShortCutManager({
   spnn: true,
   element: document.getElementById('test7'),
   short_cut: [{
      combination: [], command: function (obj) {
         console.log('키가 특별히 정해지지않은 것 (' + obj.event.code + ') 들에 대해서 모두 이 이벤트가 발생한다. 하지만 spnn 옵션을 주면 특별키들에 대해서는 발생하지 않는다. 특별키란 shift, ctrl, alt 같은 다른키와 조합해서 사용하는 키다');
      }
   }]
});
var keyMan = new ShortCutManager({
   element: document.getElementById('test8'),
   short_cut: [{
      combination: [], command: function (obj) {
         console.log('누른키가에이인가: ' + (obj.obj.is_pressed('KeyA')));
         console.log('obj.obj는 keyMan과 같은가: ' + (obj.obj === keyMan));
         console.log(obj.code);
         obj.element.style.background = Math.floor(Math.random() * 2) ? 'red' : 'blue';
         obj.element.style.color = 'white';
      }
   }]
});
```
