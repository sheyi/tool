(function($, window, document, undefined) {
  "use strict";
  var $bottom = { element: null, hide: function() {} },
      $html = $('html'), $body = $('body'), $head = $('#head'), $foot = $('#foot'), $win = $(window),
      $error, $mobile, $widget,
      icons = [],
      loading = function(done, elem) {
        elem = elem || '#loading';
        if (done) {
          $(elem).stop().fadeOut(500, function() {
            $(elem).hide();
          });
          return;
        }
        $(elem).stop().show();
      },
      msie = {
        lt8: document.all && !document.querySelector,
        lt9: document.all && !document.addEventListener,
        lt10: document.all && !window.atob
      },
      win = {
        bottom: 0,
        height: $win.height(),
        heighthalf: $win.height() * 0.5,
        scrolled: 0,
        sects: {},
        width: $win.width()
      };

  $('#browser-error').remove();
  loading(0);

  if (msie.lt9 || msie.lt8) {
    loading(1);
    $error = $('<div />')
      .attr({'id':'browser-error'})
      .html([
        '<div ', 'class="wrapper">',
        '<span ', 'class="ui-icon ui-icon-alert">!</', 'span>',
        'Your browser is <', 'strong>out of date</', 'strong>.',
        'It has known security flaws and may not display all features of this websites. ',
        '<a ', 'class="external" href="https://browser-update.org/en/update.html">&#187;',
        'Please update your browser.<', '/a><', '/div>'
      ].join(''));
    $body.append($error);
    $html.addClass('lt-ie9');
    if (msie.lt8) {
      $html.addClass('lt-ie8');
      $('#main,#head .nav').hide();
      return;
    }
  }

  $('.icon-list > ul').first().find('li').each(function() {
    var i = ''+$(this).attr('class'), d = ''+($(this).attr('data-ui') || '');
    if (i.indexOf('ui-icon-') === -1) {
      return;
    }
    icons.push([
      i.replace(/ui-icon-/, ''),
      (d.indexOf('b') !== -1), (d.indexOf('m') !== -1)
    ]);
  });

  var inits = {

    /* jQuery UI Demos */
    demos: function(d,e,m,o,s) {
      d = '#demo-'; e = d+'button-'; m = 'ui-icon-'; o = 'ui-state-';
      /* Button with icon only */
      $(e+'1').button({
        showLabel: false,
        icon: m+'gear'
      });
      /* Button with  icon left */
      $(e+'2').button({
        showLabel: true, icon: m+'circle-arrow-w'
      });
      /* Button with icon right */
      $(e+'3').button({
        showLabel: true, icon: m+'circle-arrow-e', iconPosition: 'end'
      });
      /* Button with icon left and right */
      $(e+'4').button({
        showLabel: true, icon: m+'gear'
      });
      /* Button set (for jQuery UI 1.12.x) */
      $('input', $(d+'radioset-1')).checkboxradio();
      $('input', $(d+'radioset-2')).checkboxradio({icon:false});
      $('input', $(d+'checkboxset-1')).checkboxradio();
      $('input', $(d+'checkboxset-2')).checkboxradio({icon:false});
      /* Accordion */
      $(d+'accordion').accordion();
      $(d+'controlgroup-1').controlgroup();
      $(d+'controlgroup-2').controlgroup({direction:'vertical'});
      /* Datapicker */
      $(d+'datepicker').datepicker({inline: true});
      /* Menu */
      $(d+'menu').menu();
      /* Selectmenu */
      $(d+'selectmenu')[!msie.lt8 ? 'selectmenu' : 'hide']();
      /* Spinner */
      $(d+'spinner').spinner();
      /* Dialog */
      d = d+'dialog'; e = $(d+'-link'); d = $(d);
      if (d && e) {
        d.dialog({
          buttons: [
            { text: 'Ok', click: function() { d.dialog('close'); } },
            { text: 'Cancel', click: function() { d.dialog('close'); } }
          ],
          classes: { 'ui-dialog': 'demo-dialog' },
          autoOpen: false, modal: true, width: 280
        });
        e.on('click', this, function() {
          $(this).removeClass(o+'hover '+o+'focus '+o+'active');
          d.dialog('open');
          return false;
        }).on('mousedown', this, function() {
          $(this).addClass(o+'active');
        }).on('mouseover focus', this, function() {
          $(this).addClass(o+'hover');
        }).on('mouseout blur', this, function() {
          $(this).removeClass(o+'hover');
        });
        $('body').on('click.dialog', function() {
          d.dialog('close');
        });
      }
      /* Theme selection for the demos */
      var a = 'themeswitch', b, f;
      s = $('#'+a)[a]({ attach: {
        stylesheet:'jquery-ui.min.css', before:false,
        version: '1.12.1',
        basefile: 'jquery-ui.min.css',
        baseurl: '//code.jquery.com/ui'
      } });
      a += 'menu';
      if (s.menu === undefined || s.menu[a] === undefined) {
        return;
      }
      f = function() { s.menu[a]('close'); };
      b = $('<button />')
        .addClass('ui-button-close')
        .button({ label: false, icons: {primary: m+'closethick'} })
        .on('click', this, function() { f(); });
      b = $('<div />')
        .addClass('ui-selectmenu-overlay')
        .on('click',this,function() { f(); })
        .append(b);
      $('.ui-selectmenu-menu', s).append(b);
    },

    /* Window Events */
    events: function() {
      var _scroll = 'scrollTop';
      var evnt = { hashchange: null, load: 'load', resize: 'resize', scroll: 'scroll' };
      var nohash = 'head home intro start top';
      var page = { url: location.href, title: document.title };
      var uri = { base: page.url,  hash: location.hash || '' };
      var timer = {};

      if ('onDOMContentLoaded' in window) {
        evnt.load = [evnt.load,'DOMContentLoaded'].join(' ');
      }
      if ('onorientationchange' in window) {
        evnt.resize = [evnt.resize, 'orientationchange'].join(' ');
      }
      if ('onhashchange' in window) {
        evnt.hashchange = 'hashchange';
      }

      var deltimer = function(name) {
          if (!timer.hasOwnProperty(name)) {
            timer[name] = null;
            return;
          }
          clearTimeout(timer[name]);
          timer[name] = null;
        },
        getsect = function() {
          var k, v = null;
          for (k in win.sects) {
            if (win.sects.hasOwnProperty(k) && win.scrolled >= win.sects[k]) {
              v = k;
            }
          }
          return v;
        },
        init = function() {
          win.height = $win.height();
          win.width = $win.width();
          win.heighthalf = Math.ceil(win.height * 0.5);
          win.bottom = $foot.get(0).offsetTop - win.height;
          var sects = $('.section', $('#main'));
          if (!sects.length) {
            return;
          }
          sects.each(function() {
            var el = $(this), id = el.attr('id') || null;
            if (id) {
              win.sects[id] = Math.round(el.get(0).offsetTop);
            }
          });
        };

      if (evnt.hashchange) {
        $win.on(evnt.hashchange, function() {
          var clss = 'active', hash = location.hash || '#start', title = [page.title], curr, pos;
          $('a', $head).removeClass(clss);
          curr = $('a[href$="'+hash+'"]',$head).addClass(clss);
          hash = hash.replace(/^#/,'') || '';
          hash = (nohash.indexOf(hash)!==-1) ? '' : hash;
          if (hash !== '') {
            title.push(curr.first().text());
            pos = (win.sects.hasOwnProperty(hash) ? win.sects[hash] : 0);
            $win[_scroll](pos);
            uri = {
              base: page.url.replace(new RegExp('#'+hash,'i'),''),
              hash: '#'+hash
            };
          }
          document.title = title.join(' » ');
        });
      }

      $win.on(evnt.resize, function() {
        if ($mobile) {
          $mobile.hide(1);
        }
        $bottom.hide(1);
        deltimer('resize');
        timer['resize'] = setTimeout(function() {
          init();
          $win.trigger('scroll');
          deltimer('resize');
        }, 200);
      }).on(evnt.scroll, function() {
        win.scrolled = $win[_scroll]();
        deltimer('scroll');
        timer['scroll'] = setTimeout(function() {
          $bottom.hide(1);
          $('.scroll,.toggle', $foot)[(win.scrolled > win.bottom ? 'add' : 'remove') + 'Class']('absolute');
          $('.scroll', $foot)[win.scrolled < win.heighthalf ? 'hide' : 'show']();
          var clss = 'active', curr, sect = getsect();
          if (sect === null) {
            return;
          }
          curr = $('a[href$="#' + sect + '"]', $head);
          if (!curr || curr.first().hasClass(clss)) {
            return;
          }
          $('a', $head).removeClass(clss);
          curr.addClass(clss);
          deltimer('scroll');
        }, 50);
      }).on(evnt.load, function() {
        page = { url: location.href, title: document.title };
        uri = { base: page.url, hash: location.hash || '' };
        init();
        $win.trigger('scroll');
        if (evnt.hashchange) {
          $win.trigger('hashchange');
        }
      });

    },

    /* Icon Form Widget */
    iconform: function() {
      var d = 'div', l = 'label', s = 'span';
      if (msie.lt9) {
        return;
      }
      $widget = {
        element: $('<div />').addClass('base').attr({id: 'icon-widget'}).appendTo($('.section[id]',$('#main')).first()),
        fields: null,
        output: {},
        apply: function(key, val) {
          var w = $widget, o, a = null;
          if (!w.hasOwnProperty(key)) {
            return;
          }
          o = w.output;
          if (w.hasOwnProperty('animation')) {
            a = w.animation;
          }
          switch(key) {
            case 'animation':
              if (!a) {
                return;
              }
              o.icon.removeClass(
                $('option', a.input)
                  .map(function() { return $(this).val(); })
                  .get().join(' ')
              );
              if (val !== '') {
                o.icon.addClass(val);
              }
              return;
            case 'bgcolor':
              o.back.css('background-color', val);
              return;
            case 'color':
            case 'size':
              key = key === 'size' ? 'font-'+key : key;
              o.icon.css(key,val);
              return;
            default:
              o.name.text(w[key].val());
              o.icon.removeClass().addClass(['ui-icon ui-icon-',val].join(''));
              if (a) {
                a.val('');
              }
              return;
          }

        },
        init: function() {
          var i = 0, k = ['icon','size','color','bgcolor','animation'], l = k.length;
          for (;i < l; i++) {
            if ($widget.hasOwnProperty(k[i])) {
              $widget.apply(k[i], $widget[k[i]].val());
            }
          }
        }
      };
      $('<div />')
        .addClass('icon-widget ui-widget ui-widget-content ui-corner-all ui-helper-clearfix')
        .html([
          '<','form class="form" method="get" action="/"></','form>',
          '<',d,' class="view">',
            '<',d,' class="view-icon ui-widget-content ui-corner-all ui-helper-clearfix">',
              '<',s,'></',s,'>',
            '</',d,'>',
            '<',d,' class="view-name">ui-icon-<',s,'></',s,'></',d,'>',
          '</',d,'>'
          ].join(''))
        .appendTo($widget.element);
      $widget.output = {
        back: $('.view-icon',$widget.element),
        icon: $('.view-icon > span',$widget.element),
        name: $('.view-name > span',$widget.element)
      };
      $widget.fields = $('.form', $widget.element)
        .on('submit', this, function() {
          $widget.init();
          return false;
        })
        .html([
          '<'+l+' for="field-icon">Icon:&#160;</'+l+'>',
          '<'+l+' for="field-size">Icon size:&#160;</'+l+'>',
          '<'+l+' for="field-color">Icon color:&#160;</'+l+'>',
          '<'+l+' for="field-bgcolor">Backcolor:&#160;</'+l+'>',
          [!msie.lt10 ? '<'+l+' for="field-animation">Animation:&#160;</'+l+'>':'']
        ].join(''));
      $('label', $widget.fields).each(function() {
        var w = $('<'+'div />').addClass('ui-front form-field'), f, k, v;
        var a = ' value=', c, l, o = 'option';
        f = $(this).wrap(w);
        k = f.attr('for').substring(6);

        if (k === 'size' || k === 'animation') {
          v = (k !== 'animation')
            ? [['', 'Default',''], ['200%', '2em',''], ['400%', '4em',''], ['600%', '6em',''], ['800%', '8em',' selected="selected"']]
            : [['', 'None',' selected="selected"'], ['rotate', 'Rotate clockwise',''], ['rotate-reverse', 'Rotate anti clockwise',''], ['bounce', 'Bouncing','']];
          c = 0; l = v.length;
          while (c < l) { v[c] = ['<',o,a,'"',v[c][0],'"',v[c][2],'>',v[c][1],'</',o,'>'].join(''); c++; }
          $widget[k] = $('<'+'select />')
            .attr({ id: ['field',k].join('-') })
            .html(v.join(''))
            .insertAfter(f);
          $widget[k]
            .selectmenu({
              'change': function(event, ui) { $widget.apply(k, ui.item.value); }
            });
          return;
        }

        if (k === 'color' || k === 'bgcolor') {
          $widget[k] = $('<'+'input />')
            .attr({ type:'text', autocomplete: 'off', id: ['field',k].join('-') })
            .val('#'+(k !== 'bgcolor' ? '4f81bd':'ffffff'))
            .insertAfter(f);
          $widget[k]
            .colorpicker({
              color: $widget[k].val(),
              palette: 'theme'
            })
            .on('change', this, function(event, val) {
              $widget.apply(k,val);
            });
          return;
        }
        c = 0; l = icons.length; v = [];
        while (c < l) { v.push(icons[c][0]); c++; }
        c = 0; l = v.length;
        while (c < l) { v[c] = ['<',o,a,'"',v[c],'"',(v[c] === 'jquery'?' selected="selected"':''),'>',v[c],'</',o,'>'].join(''); c++; }
        $widget[k] = $('<s'+'elect />')
          .attr({ id: ['field',k].join('-') })
          .html(v.join(''))
          .insertAfter(f);
        $widget[k]
          .combobox({
            focus: function(event, ui) {
              $(this).val(ui.item.value);
            },
            select: function(event, ui) {
              $(this).val(ui.item.value);
              $widget.apply(k, ui.item.value);
            }
        });
        $widget.combobox = $('.ui-combobox', $widget.element);
        $widget.comboboxmenu = $('.ui-menu', $widget.combobox);
        $widget.combobox.on('focus', 'input', function() {
          $widget.comboboxmenu.addClass('ui-menu-overflow').css({'max-height':''});
          if (!(win.height < 479 || win.width < 639)) {
            return;
          }
          $win['scrollTop']($(this).offset().top - parseInt($widget.element.parent().css('padding-top'), 10) - 10);
          $widget.comboboxmenu.css({'max-height': (Math.floor(win.height / 3))});
        });
      });
      $widget.init();
    },

    /* Icon Grid */
    icongrid: function() {
      var demo = $('.demo', $('#demos'));
      if (!demo.length || ! icons.length) {
        return;
      }
      var icon, li, max, num, tabs = [];
      demo = demo.first();
      demo = $('<div />')
        .addClass('demo icon-tabs')
        .insertBefore(demo);
      demo.html('<h3 class="base-hl">Framework Icons (content color preview)</h3>');
      tabs[0] = $('<div />')
        .attr('id','icon-tabs')
        .html('<ul class="no-print"><li><a href="#icon-grid-1">jQuery UI</a></li><li><a href="#icon-grid-2">jQuery Mobile</a></li></ul>')
        .appendTo(demo);
      for(num = 1; num < 3; num++) {
        tabs[num] = $('<div />').addClass('icon-grid').attr('id','icon-grid-'+num).appendTo(tabs[0]);
        tabs[num] = $('<ul />').addClass('ui-helper-clearfix').appendTo(tabs[num]);
      }
      max = icons.length;
      for (num = 0; num < max; num++) {
        icon = icons[num];
        if (!icon[1] && !icon[2]) {
          continue;
        }
        li = ['<li class="ui-state-default ui-corner-all" title="',icon[0],'"><span class="ui-icon ui-icon-',icon[0],'"></','span></','li>'].join('');
        for (var i = 1; i < 3; i++) {
          if (!icon[i]) {
            continue
          }
          tabs[i].append($(li));
        }
      }
      $('.icon-grid', tabs[0]).on('mouseover mouseout mousedown mouseup', 'li', function(e) {
        var i = $(this), a = 'active', c = 'ui-state-', h = 'hover';
        e = e.type;
        switch (e) {
          case 'mouseover':
            return i.addClass([c,h].join(''));
          case 'mouseout':
            return i.removeClass([c,h,' ',c,a].join(''));
          case 'mousedown':
            return i.addClass([c,a].join(''));
          case 'mouseup':
            return i.removeClass([c,a].join(''));
        }
      });
      tabs[0].tabs({
        activate: function(event, ui) { $win.trigger('resize'); }
      });
    },

    /* Icon List */
    iconlist: function() {
      var i = 3, l = $('.icon-list > ul').first(), n = l.find('li').length, s = 'icon-table';
      if (!n || n < i) {
        return;
      }
      var r = Math.ceil(n/i);
      for (var c = 0; c < i; c++) {
        var a = l.find('li').slice(0, r);
        var b = $('<ul></ul>').addClass([s,'-cell ',s, '-cell-',(c+1)].join('')).append(a);
        l.before(b);
      }
      l.parent().wrap('<div class="'+s+'"></div>');
      l.remove();
    },

    /* Navigation */
    menus: function() {
      var menu, temp;
      temp = $('<div />')
        .addClass('badge')
        .html('<a href="https://github.com/mkkeck/jquery-ui-iconfont" target="_blank">Fork me on GitHub</a>');
      $head.addClass('has-badge fixed').append(temp);

      $mobile = {
        button: $('<button />').addClass('nav-mobile-button').html('<span class="ui-icon ui-icon-bars">&#9776;</span>'),
        items: $('<div />').addClass('nav-mobile-items'),
        hide: function(s) {
          var a = $mobile.element, b = $mobile.items;
          s = s || b.is(':visible');
          if (s) {
            a.removeClass('open').css({'height':''});
            b.hide();
            return false;
          }
          a.addClass('open').css({'height':win.height});
          b.show().css({'height':a.height()-b.position().top});
          return false;
        },
        element: $('<div />').addClass('nav nav-mobile')
      };
      $mobile.button.on('mouseup', this, function() {
        $(this).blur();
        return $mobile.hide();
      });
      $mobile.items.on('click', 'a', function() { $mobile.hide(1); });

      menu = $('.nav-main', $head).first().after(
        $mobile.element.append($mobile.button, $mobile.items)
      );
      temp = $('li', menu);
      if (temp.length > 0) {
        var ul = $('<ul></ul>').appendTo($mobile.items);
        temp.each(function() {
          var me = $(this).clone();
          if (!$('a',me).length) { return; }
          ul.append($(me).removeAttr('class').find('a').removeAttr('class'));
        });
        ul.prepend();
      }
      temp = $('.nav', $foot);
      if (temp.length > 0) {
        temp.each(function() {
          var me, hl, li, ul;
          me = $(this).clone(); hl = $('h4', me); li = $('li', me);
          if (!li.length) { return; }
          if (hl.length) {
            $mobile.items.append(['<','p>',hl.text(),'</','p>'].join(''));
          }
          ul = $('<ul></ul>').appendTo($mobile.items);
          li.each(function() {
            if (!$('a',$(this)).length) { return; }
            ul.append($(this).removeAttr('class').find('a').removeAttr('class'));
          });
          ul.append($(me).removeAttr('class').find('a').removeAttr('class'));
        });
      }

      $foot.on('click', '.scroll', function() {
        $win['scrollTop'](0);
        $(this).blur();
        return false;
      });
      $bottom = {
        element: $('<div />').addClass('toggle')
          .append(
            $('<div />').addClass('toggle-button').html('<span class="ui-icon ui-icon-grip-dotted-horizontal">=</span>'),
            $('.wrapper',$foot).first().clone().addClass('toggle-content').removeAttr('id')
          )
          .prependTo($foot),
        hide: function(s) {
          var a = $('.toggle-content',$bottom.element), b = $('.scroll',$foot) || null;
          s = s || a.is(':visible');
          a[s?'hide':'show']();
          if (b) {
            b.css({'bottom':s?'':a.outerHeight()});
          }
        }
      };
      $bottom.element.on('click', '.toggle-button', function() {
        $bottom.hide();
        $(this).blur();
        return false;
      });
    },

    /* Prism */
    prism: function(p, r, e) {
      if (typeof Prism === 'undefined') {
        return;
      }
      if (Prism.plugins.hasOwnProperty('NormalizeWhitespace')) {
        Prism.plugins.NormalizeWhitespace.setDefaults({
          'break-lines':80, 'indent':0, 'left-trim':true, 'right-trim':true,
          'remove-indent':true, 'remove-initial-line-feed':true, 'remove-trailing':true
        });
      }
      Prism.highlightAll();
      p = 'line-numbers';
      r = ['.',p,'-rows'].join('');
      p = ['pre',p].join('.');
      e = parseInt($([p,r].join(' ')).css('left'),10);
      $(p).on('scroll',this,function() {
        var t = $(this);
        $(r, t).css({'left':t['scrollLeft']()+e});
      });
    }
  };

  loading(0);
  var i = -1, r = ['events','menus','iconform','iconlist','prism','icongrid','demos'];
  if (msie.lt9) {
    r = ['events','demos','iconform','icongrid'];
  }
  while (i < r.length) {
    i++;
    if (!inits.hasOwnProperty(r[i]) || typeof inits[r[i]] !== 'function') {
      continue;
    }
    inits[r[i]]();
  }

  setTimeout(function() {
    loading(1);
    $(window).resize();
  }, 500);

})(jQuery,window,document);
