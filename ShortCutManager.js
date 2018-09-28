(function () {
   var root = this;
   var ShortCutManager = function (options) {
      var pointer = this;
      for (var key in options) { pointer[key] = options[key]; }
      if (pointer.special_keys === undefined) {
         pointer.special_keys = ['ShiftLeft', 'ControlLeft', 'MetaLeft', 'AltLeft', 'ShiftRight', 'ControlRight', 'MetaRight', 'AltRight'];
      }
      if (pointer.active_mode === undefined) {
         pointer.active_mode = true;
      }
      pointer.key_history = [];
      pointer.pressed = {};
      pointer.once_list = {};
      pointer.short_cut.forEach(ev => {
         if (ev.combination.length == 0) {
            ev.combination.push(ShortCutManager.ANYOTHERKEY);
         }
      });
      ['focus', 'focusout', 'blur'].forEach(ev => {
         pointer.element.addEventListener(ev, function (event) {
            pointer.release_special_key();
         }, false);
      });
      pointer.element.addEventListener('keyup', function (event) {
         pointer.switch_key(event.code, false);
      }, false);
      pointer.element.addEventListener('keydown', function (event) {
         pointer.switch_key(event.code, true);
         if (pointer.active_mode) {
            var cmd_for_key = pointer.find_short_cut(true);
            if (cmd_for_key && cmd_for_key.prevent_default) {
               event.preventDefault();
            }
            var any_key_pre = pointer.any_key_pressed();
            var arg = {
               obj: pointer,
               event: event,
               keyCode: event.keyCode,
               code: event.code,
               element: pointer.element
            };
            var co_mode = 0;
            if (pointer.spnn) {
               if ((!any_key_pre && cmd_for_key) || any_key_pre) {
                  co_mode = 1;
               } else if (!any_key_pre && !cmd_for_key) {
                  co_mode = 2;
               }
            } else {
               if (cmd_for_key) {
                  co_mode = 1;
               } else {
                  co_mode = 2;
               }
            }
            if (co_mode === 1) {
               pointer.touch_proc(cmd_for_key, function (cmd_for_key) {
                  return cmd_for_key.command(arg);
               });
            } else if (co_mode === 2) {
               var cm = pointer.find_short_cut(false);
               if (cm) {
                  cm.command(arg);
                  if (cm.prevent_default) {
                     event.preventDefault();
                  }
               }
            }
         }
      }, false);
   };
   ShortCutManager.prototype = {
      get_key_history: function () {
         if (!this.key_history) {
            this.reset_key_history();
         }
         return this.key_history;
      },
      reset_key_history: function () {
         this.key_history = [];
      },
      active: function (mode) {
         this.active_mode = mode;
      },
      find_short_cut: function (find) {
         if (find) {
            find = this.pressed_as_list().sort();
         } else {
            find = [ShortCutManager.ANYOTHERKEY];
         }
         var rtn = null;
         for (var i in this.short_cut) {
            if (rtn === null) {
               var itm = this.short_cut[i];
               if (itm.combination.length > 0) {
                  var insp = [];
                  if ((typeof itm.combination[0]) == 'object') {
                     itm.combination.forEach(ddf => {
                        insp.push(ddf);
                     });
                  } else {
                     insp.push(itm.combination);
                  }
                  insp.forEach(comb => {
                     var a1 = comb.sort();
                     var a2 = find.sort();
                     if (a1.length == a2.length) {
                        var cnt = 0;
                        for (var j in a1) {
                           var val1 = a1[j];
                           var val2 = a2[j];
                           if (false) {
                              if ((typeof val1) == 'string') {
                                 val1 = (val1.toUpperCase()).charCodeAt(0);
                              }
                              if ((typeof val2) == 'string') {
                                 val2 = (val2.toUpperCase()).charCodeAt(0);
                              }
                           }
                           if (val1 === val2) {
                              cnt++;
                           }
                        }
                        if (a1.length == cnt) {
                           rtn = itm;
                        }
                     }
                  });
               }
            }
         }
         return !rtn ? null : rtn;
      },
      any_key_pressed: function () {
         var pr = false;
         this.get_specials().forEach(name => {
            if (this.pressed[name]) {
               pr = true;
            }
         });
         return pr;
      },
      get_specials: function () {
         return this.special_keys;
      },
      release_special_key: function () {
         for (var key in this.pressed) {
            this.switch_key(key, false);
         }
      },
      pressed_as_list: function () {
         var ll = [];
         for (var key in this.pressed) {
            ll.push(key);
         }
         return ll;
      },
      touch_proc: function (cmd_for_key, proc) {
         var prsd = this.pressed_as_list().sort();
         var rtn = null;
         var move_cursor = false;
         if (cmd_for_key) {
            if (cmd_for_key.once) {
               var oncekey = JSON.stringify(prsd);
               if (!this.once_list[oncekey]) {
                  this.once_list[oncekey] = true;
                  rtn = proc(cmd_for_key);
               }
            } else {
               rtn = proc(cmd_for_key);
            }
         }
         if (rtn && rtn.move_cursor) {
            move_cursor = rtn.move_cursor;
         }
         return move_cursor;
      },
      is_pressed: function (name) {
         return this.pressed[name] ? true : false;
      },
      switch_key: function (code, mode) {
         this.pressed[code] = mode;
         if (!this.pressed[code]) {
            delete this.pressed[code];
         }
         if (!mode) {
            var new_ = JSON.parse(JSON.stringify(this.pressed_as_list()));
            new_.push(code);
            new_ = new_.sort();
            delete this.once_list[JSON.stringify(new_)];
         }
      }
   };
   root.ShortCutManager = ShortCutManager;
   root.ShortCutManager.ANYOTHERKEY = 100000;
}).call(this);
