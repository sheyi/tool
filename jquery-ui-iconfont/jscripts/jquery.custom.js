/**
 * Some jQuery and jQuery UI plugins and widgets
 *
 * Copyright: (c) 2015-2017 Michael Keck
 *               (https://github.com/mkkeck/jquery-ui-icons)
 * License:   http://www.gnu.org/licenses/gpl.html
 * Modified:  Michael Keck, 2017-02-27
 */

/**
 * string $.blankimg(true); oder
 * jQuery $.blankimg([false]);
 *
 * Gibt ein 1x1 px grosses Transparentes GIF-Bild zurueck.
 *
 * @param   {boolean} [string]
 * @param   {string}  [data]
 * @returns {string|jQuery}
 */
(function($) {
  $.blankimg = function(string, data) {
    data = data || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    return (string ? data : $('<img src="' + data + '" />'));
  };
})(jQuery);


/**
 * boolean|string|null $.cookie(
 *   'name'
 *   [, 'wert']
 *   [, { 'expires':0, 'path':'', 'domain':'', 'secure':false, 'raw':false }]
 * );
 *
 * Setzt, loescht oder liest einen Cookie.
 *
 * @param {string}              name;     Name des Cookies
 * @param {string|number|null} [value];   Wert des Cookies
 * @param {object}             [options]; Cookie-Parameter
 * @returns boolean|string|null
 */
(function($) {
  $.cookie = function(name, value, options) {
    var list, item, i,
        decode = function(value, raw) {
          return raw ? value : decodeURIComponent(value);
        },
        encode = function(value, raw) {
          return raw ? value : encodeURIComponent(value);
        };

    if (arguments.length > 1 && (
      !/Object/.test(Object.prototype.toString.call(value))
      || value === null || value === 'undefined')
    ) {
      options = $.extend({
        'expires': 0,
        'domain': '',
        'path': '/',
        'secure': false,
        'raw': false
      }, options);
      if (value === null || value === 'undefined') {
        options.expires = 'Thu, 01 Jan 1970 00:00:01 GMT';
        value = '';
      }
      else {
        value = String(value);
      }
      if (typeof options.expires === 'number' && options.expires > 0) {
        var seconds = (options.expires * 1000), expires = new Date();
        expires.setTime(expires.getTime() + seconds);
        options.expires = expires.toUTCString();
      }
      return (document.cookie = [
        encode(name, true), '=', encode(value, options.raw),
        (options.expires ? '; expires=' + options.expires : ''),
        (options.path ? '; path=' + options.path : ''),
        (options.domain ? '; domain=' + options.domain : ''),
        (options.secure ? '; secure' : '')
      ].join(''));
    }
    options = value || {};
    options = $.extend(true,{'raw': false}, options);
    list = document.cookie.split('; ');
    for (i = 0; item = list[i] && list[i].split('='); i++) {
      if (decode(item[0], true) === name) {
        return decode(item[1] || '', options.raw);
      }
    }
    return null;
  };

})(jQuery);


/**
 * ui colorpicker 1.1
 * ColorPicker Widget for jQuery UI
 *
 * Copyright: (c) 2015-2016 Michael Keck
 *               (https://github.com/mkkeck/jquery-ui-icons)
 * License:   http://www.gnu.org/licenses/gpl.html
 * Modified:  Michael Keck, 2016-02-23
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *
 *
 * Usage:
 *   $('selector').colorpicker({
 *     'color': '#000',          // any hexvalue
 *     'palette': 'theme'        // 'theme' or 'web'
 *   }).on('change', function(event, val) {
 *     // function on change the value
 *   });
 */
(function($, document) {
  if ($.widget === undefined) {
    return;
  }
  var colors = {
    'theme': [
      ['ffffff','000000','eeece1','1f497d','4f81bd','c0504d','9bbb59','8064a2','4bacc6','f79646'],
      [
        ['f2f2f2','7f7f7f','ddd9c3','c6d9f0','dbe5f1','f2dcdb','ebf1dd','e5e0ec','dbeef3','fdeada'],
        ['d8d8d8','595959','c4bd97','8db3e2','b8cce4','e5b9b7','d7e3bc','ccc1d9','b7dde8','fbd5b5'],
        ['bfbfbf','3f3f3f','938953','548dd4','95b3d7','d99694','c3d69b','b2a2c7','92cddc','fac08f'],
        ['a5a5a5','262626','494429','17365d','366092','953734','76923c','5f497a','31859b','e36c09'],
        ['7f7f7f','0c0c0c','1d1b10','0f243e','244061','632423','4f6128','3f3151','205867','974806']
      ],
      ['c00000','ff0000','ffc000','ffff00','92d050','00b050','00b0f0','0070c0','002060','7030a0']
    ],
    'web': [
      [
        ['003366','336699','3366cc','003399','000099','0000cc','000066'],
        ['006666','006699','0099cc','0066cc','0033cc','0000ff','3333ff','333399'],
        ['669999','009999','33cccc','00ccff','0099ff','0066ff','3366ff','3333cc','666699'],
        ['339966','00cc99','00ffcc','00ffff','33ccff','3399ff','6699ff','6666ff','6600ff','6600cc'],
        ['339933','00cc66','00ff99','66ffcc','66ffff','66ccff','99ccff','9999ff','9966ff','9933ff','9900ff'],
        ['006600','00cc00','00ff00','66ff99','99ffcc','ccffff','ccccff','cc99ff','cc66ff','cc33ff','cc00ff','9900cc'],
        ['003300','009933','33cc33','66ff66','99ff99','ccffcc','ffffff','ffccff','ff99ff','ff66ff','ff00ff','cc00cc','660066'],
        ['333300','009900','66ff33','99ff66','ccff99','ffffcc','ffcccc','ff99cc','ff66cc','ff33cc','cc0099','993399'],
        ['336600','669900','99ff33','ccff66','ffff99','ffcc99','ff9999','ff6699','ff3399','cc3399','990099'],
        ['666633','99cc00','ccff33','ffff66','ffcc66','ff9966','ff6666','ff0066','d60094','993366'],
        ['a58800','cccc00','ffff00','ffcc00','ff9933','ff6600','ff0033','cc0066','660033'],
        ['996633','cc9900','ff9900','cc6600','ff3300','ff0000','cc0000','990033'],
        ['663300','996600','cc3300','993300','990000','800000','993333']
      ],
      [
        ['ffffff','ebebeb','d7d7d7','c3c3c3','afafaf','9b9b9b','878787','737373','5f5f5f','4b4b4b','373737','232323','0f0f0f'],
        ['f5f5f5','e1e1e1','cdcdcd','b9b9b9','a5a5a5','919191','7d7d7d','696969','555555','414141','2d2d2d','191919','050505']
      ]
    ]
  };
  var index = 0, plugin = 'colorpicker';

  $.widget('ui.'+plugin, {
    'version': '1.1',
    'options': {
      'color': '#000000',
      'palette': 'theme',
      'pointer': true,
      'icon': true,
      'readonly': true,
      'strings': {
        'cancel': 'default',
        'back': '&#8249; back',
        'next': 'next &#8250;',
        'defaultColors': 'Standard Colors',
        'themeColors':  'Theme Colors',
        'webColors': 'Web Colors'
      }
    },

    _create: function() {
      index++;
      var element = this.element, options = this.options, that = this, value, span = '<span></span>';
      if ((''+element.get(0).tagName).toLowerCase() !== 'input') {
        return;
      }
      if (options.color !== '') {
        element.val(options.color);
      }
      else {
        value = element.val();
        if (value !== '') {
          options.color = value;
        }
      }
      this._active = false;
      this._name = ['ui-',plugin,'-',index].join('') ;
      this.enabled = true;
      this.palette = null;
      this.icon = (options.icon ? $(span).addClass('ui-icon ui-icon-triangle-1-s') : null);
      this.pointer = (options.pointer ? $(span).addClass('pointer') : null);
      this.noprint = options.noprint ? (typeof options.noprint !== 'string' ? ' no-print' : ' '+ options.noprint) : '';
      element
        .addClass('ui-'+plugin+'-inp '+this._name)
        .wrap('<div class="ui-'+plugin+' ui-state-default ui-corner-all ui-helper-clearfix"></div>')
        .on('focus.'+this._name, this, function() {
          if (!that._active) {
            $(this).select();
            that.show();
          } else {
            that.hide();
          }
        });
      if (this.pointer) {
        element.after(this.pointer);
      }
      if (this.icon) {
        element.after(this.icon);
      }
      if (options.readonly) {
        element.attr('readonly','readonly').css({'cursor':'pointer'});
      }
      element.parent()
        .css({'cursor':'pointer'})
        .on('click.'+this._name, this, function(){
          setTimeout(function(){
            element.focus();
          },10);
        }).on('mouseover', this, function() {
          $(this).addClass('ui-state-hover');
        })
        .on('mouseout', this, function() {
          $(this).removeClass('ui-state-hover');
        });
      this._setColor(options.color);
    },

    _createContent: function(palette) {
      var cols, html, row, rows, strings = this.options.strings;
      var cells = function(colors) {
        var col = 0, cols = colors.length, row = '', val;
        for (; col < cols; col++) {
          val = '#'+colors[col];
          row += '<td style="background-color:'+val+'"><a href="'+val+'" title="'+val+'">&#160;</a></td>';
        }
        return row;
      };
      $('.ui-'+plugin+'-pal', this.palette).empty().remove();
      switch(palette) {
        case 'theme':
          $('.button-switch', this.palette).html(strings.next).attr({'data-palette':'web'});
          cols = colors.theme[0].length;
          html = '<table>'
            + '<tr class="title"><th colspan="'+cols+'">'+strings.themeColors+'</th></tr>'
            + '<tr>' + cells(colors.theme[0]) + '</tr>'
            + '<tr class="space"><th colspan="'+cols+'">&#160;</th></tr>';
          rows = colors.theme[1].length;
          for (row = 0; row < rows; row++) {
            html += '<tr class="'+((row === 0) ? 'first' : (row === (rows - 1) ? 'last' : 'inner'))+'">'
              + cells(colors.theme[1][row])
              + '</tr>';
          }
          html += '<tr class="title"><th colspan="'+cols+'">'+ strings.defaultColors+'</th></tr>'
            + '<tr>' + cells(colors.theme[2]) + '</tr>'
            + '</table>';
          break;
        default:
          $('.button-switch', this.palette).html(strings.back).attr({'data-palette':'theme'});
          html = '<table>'
            + '<tr class="title"><th>'+ strings.webColors+'</th></tr>'
            + '<tr><td>';
          rows = colors.web[0].length;
          for(row = 0; row < rows; row++) {
            html += '<table><tr>' + cells(colors.web[0][row]) + '</tr></table>';
          }
          html += '</td></tr>'
            + '<tr class="space"><th>&#160;</th></tr>'
            + '<tr><td>'
            + '<table>';
          rows = colors.web[1].length;
          for(row = 0; row < rows; row++) {
            html += '<tr>'+cells(colors.web[1][row])+'</tr>';
          }
          html += '</table>'
            + '</td></tr>'
            + '</table>';
          break;
      }
      this.palette.prepend('<div class="ui-'+plugin+'-pal ui-'+plugin+'-pal-'+palette+' ui-helper-clearfix">'+html+'</div>');
    },

    _setColor: function(value) {
      value = (''+value).replace(/\s/g,'');
      this.element.val(value);
      this.element.parent().find('.pointer').css({'background-color': value});
      this.element.trigger('change', value);
    },

    _setOption: function(key, value) {
      if (key === 'color') {
        this._setColor(value);
      } else {
        this.options[key] = value;
      }
    },

    clear: function() {
      this.hide().val('');
    },

    enable: function() {
      var element = this.element;
      element.removeAttr('disabled');
      element.removeAttr('aria-disabled');
      this.enabled = true;
      return this;
    },

    disable: function() {
      var element = this.element;
      element.attr('disabled', 'disabled');
      element.attr('aria-disabled','true');
      this.enabled = false;
      return this;
    },

    destroy: function() {
      if (this.icon) {
        this.icon.remove();
      }
      if (this.pointer) {
        this.pointer.remove();
      }
      this.element.parent().off('.'+this._name);
      this.element.off('.'+this._name).removeClass(this._name).unwrap();
      this.palette.off('.'+this._name, '.button-cancel, .button-switch, td a');
      this.palette.empty().remove();
      this.icon = this.pointer = this.palette = null;
      $(document).off('.'+this._name);
      $.Widget.prototype.destroy.call(this);
    },

    isDisabled: function() {
      return !this.enabled;
    },

    hide: function() {
      var that = this;
      if (this.palette !== null) {
        that.element.parent().removeClass('ui-state-focus ui-state-hover');
        $(document).off('.' + that._name);
        that.palette.off('.' + that._name, 'a');
        that.palette.empty().remove();
        that.palette = null;
        that._active = false;
      }
      return this;
    },

    show: function() {
      if (this.enabled) {
        var that = this, options = this.options, cancel, buttons, button;
        $('.ui-'+plugin+'-inp').not('.'+this._name)[plugin]('hide');
        if (this.palette === null) {
          buttons =  $('<div class="ui-helper-clearfix" />');
          button = $('<button class="ui-button ui-widget ui-state-default ui-corner-all button-switch" data-palette="'+options.palette+'">&#187;</button>')
            .on('click.'+this._name, this, function() {
              that._createContent($(this).attr('data-palette'));
              $(this).removeClass('ui-state-hover ui-state-focus ui-state-active');
              return false;
            });
          cancel  = $('<button class="ui-button ui-widget ui-state-default ui-corner-all button-cancel">'+options.strings.cancel+'<button>')
            .on('click.'+this._name, this, function() {
              that._active = false;
              that._setColor(that.options.color);
              that.hide();
              $(this).removeClass('ui-state-hover ui-state-focus ui-state-active');
              return false;
            });
          buttons.append(button, cancel);
          buttons.on('mousedown.'+this._name, 'button', function() { $(this).addClass('ui-state-active'); })
            .on('mouseover.'+this._name+' focus.'+this._name, 'button', function() { $(this).addClass('ui-state-hover'); })
            .on('mouseout.'+this._name+' blur.'+this._name, 'button', function() { $(this).removeClass('ui-state-hover'); });
          this.palette = $('<div class="ui-widget ui-widget-content ui-corner-all" />');
          this.palette.append(buttons).insertAfter(this.element);
          that._createContent(options.palette);
          this.palette.on('click.'+this._name, 'td a', function() {
            if (that.enabled) {
              that._active = false;
              that._setColor($(this).attr('href'));
              that.hide();
            }
            return false;
          });
          $(document).on('click.' + that._name, function(event) {
            if (event.target !== that.element.get(0)) {
              that.hide();
            }
          }).on('keyup.' + that._name, function(event) {
            if (event.keyCode === 27) {
              that.hide();
            }
          });
          that.element.parent().addClass('ui-state-focus');
          setTimeout(function(){ that._active = true; }, 200);
        }
      }
      return this;
    }

  });

})(jQuery, document);


/**
 * ui combobox 1.2
 * ComboBox Widget for jQuery UI
 *
 *
 * Copyright (c) 2015-2016 Michael Keck
 *               (https://github.com/mkkeck/jquery-ui-icons)
 * Licensed under the GPL license:
 * http://www.gnu.org/licenses/gpl.html
 *
 * Modified: Michael Keck, 2016-05-13
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.autocomplete.js
 *  jquery.ui.button.js
 *
 *
 * Usage:
 *   $('selector').combobox({
 *     focus: function(event, ui) {
 *       // ...
 *     },
 *     select: function(event, ui) {
 *       // ...
 *     }
 *   });
 */
(function($) {
  if ($.widget === undefined || !$.ui.autocomplete) {
    return;
  }
  $.widget('ui.combobox', $.ui.autocomplete, {

    _create: function() {
      this._id = this.element.attr('id') || null;
      this._name = (this._id ? this._id+'-autocomplete' : null);
      this._wrapper = $('<span />')
        .addClass('ui-combobox ui-front ui-corner-all ui-state-default')
        .insertAfter(this.element);
      this.element.hide();
      this.label = $('label[for="'+this._id+'"]') || null;
      this._createAutocomplete();
      this._createShowAllButton();
    },

    _createAutocomplete: function() {
      var that = this;
      var selected = this.element.children(':selected'),
          value = selected.val() ? selected.text() : '';
      this.input = $('<input type="text" />')
        .attr('autocomplete','off')
        .appendTo(this._wrapper)
        .val(value)
        .on('focus', function() {
          $(this).select().parent().addClass('ui-state-focus');
        })
        .on('blur', function() {
          $(this).parent().removeClass('ui-state-focus');
        })
        .autocomplete({
          autoFocus: true,
          delay: 0,
          minLength: 0,
          source: $.proxy(this, '_source')
        });
      if (this._id && this._name) {
        this.input.attr({'id':this._name});
        if (this.label) {
          this.label.attr({'for':this._name});
        }
      }
      this._on( this.input, {
        'autocompleteselect': function(event, ui) {
          ui.item.option.selected = true;
          this._trigger('select', event, { item: ui.item.option });
        },
        'autocompletechange': '_removeIfInvalid',
        'autocompleteclose': function(event, ui) {
          that._wrapper.removeClass('ui-combobox-open');
          if (typeof that.option.close === 'function') {
            that.option.close(event, ui);
          }
          that._loading(that.button, 0);
        },
        'autocompleteopen': function(event, ui) {
          that._loading(that.button, 1);
          that._wrapper.addClass('ui-combobox-open');
          if (typeof that.option.open === 'function') {
            that.option.open(event, ui);
          }
          that._loading(that.button, 0);
        }
      });
      this.input.autocomplete('widget');
    },

    _loading: function(e, s) {
      var a = 'ui-icon', b = a+'-triangle-1-s', c = a+'-loading-status-circle rotate';
      if (s) {
        $('.'+a,e).removeClass(b).addClass(c);
      }
      else {
        $('.'+a,e).removeClass(c).addClass(b);
      }
    },

    _createShowAllButton: function() {
      var that = this, input = this.input,
          opened = false;
      this.button = $('<a>')
        .attr('tabIndex', -1)
        .appendTo(this._wrapper)
        .button({ icons: { 'primary': 'ui-icon-triangle-1-s' }, text: false })
        .on('mousedown', this, function() {
          opened = input.autocomplete('widget').is(':visible');
          that._loading(that.button, 1);
        })
        .on('click', this, function() {
          input.focus();
          if (opened) {
            return;
          }
          input.autocomplete('search', '');
        });
    },

    _source: function(request, response) {
      var f = $.ui.autocomplete.escapeRegex(request.term), i = 0, l, m, o, r = [], s, t;
      m = (f.length > 0 &&  f.length < 3) ? new RegExp(['^', f].join(''), 'i') : new RegExp(f, 'i');
      s = this.element.get(0); l = s.length;
      for (; i < l; i++) {
        o = s.options[i]; t = o.text.trim();
        if (o.value && (!request.term || m.test(t))) {
          r.push({ label: t, value: t, option: o });
        }
      }
      response(r);
    },

    _removeIfInvalid: function(event, ui) {
      if (ui.item) {
        return;
      }
      var v = this.input.val(), r = false, c = this.element.children(':selected').text();
      this.element.children('option').each(function(k, o) {
        if ($(o).text().toLowerCase().trim() === v.toLowerCase()) {
          o.selected = r = true;
          return false;
        }
      });
      if (r) {
        return;
      }
      this.input.val('Item not found').parent().addClass('ui-state-error');
      this.element.val(c);
      this._delay(function() {
        this.input.val(c).parent().removeClass('ui-state-error');
      }, 1500);
      this.input.autocomplete('instance').term = '';
    },

    _destroy: function() {
      this._wrapper.remove();
      if (this.label && this._id) {
        this.label.attr({'id': this._id});
      }
      this.element.show();
      $.ui.autocomplete.prototype.destroy.call(this);
    },

    widget: function() {
      return this.input.autocomplete('widget');
    }
  });
})(jQuery);


/**
 * ui themeswitch 1.1
 * ThemeSwitch for jQuery UI
 *
 * Copyright: (c) 2015-2016 Michael Keck
 *               (https://github.com/mkkeck/jquery-ui-icons)
 * License:   http://www.gnu.org/licenses/gpl.html
 * Modified:  Michael Keck, 2016-03-02
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.selectbox.js
 *
 *
 * Usage:
 *
 *   $('selector').themeswitch({
 *
 *     attach: {
 *       stylesheet: 'href/to/stylesheet/where/to/attach',
 *                   // or $('link[href$="stylesheet/where/to/attach"]', $('head'))
 *       before: false  // false insert after, true insert before attach.stylesheet
 *     },
 *     // Using Cookie (requires $.cookie)
 *     // cookie: true | false | null
 *     // or define
 *     cookie: {
 *       domain:'domain.tld',
 *       path:'/path/to/site',
 *       expires: 3600,         // int secconds; 0 is session cookie and default if not defined
 *       raw: false | true,
 *       secure: false | true
 *     },
 *
 *     // Label for the selectmenu
 *     // label: false | null
 *     // or define
 *     label: 'Theme',
 *
 *     // Default Theme
 *     // theme: null | 'theme-name'
 *     // or define
 *     theme: {
 *       name: 'base',
 *       title: 'Default'
 *     },
 *
 *     // Available Themes, if not set all themes from the
 *     // jquery-ui-themeroller will be added
 *     themes: [
 *       {
 *         name: 'theme-name',
 *         title: 'Description',
 *         url: 'http://domain.tld/path/theme-name.css',      // optional
 *         thumb: 'http://domain.tld/path/theme-name.png'     // optional
 *       }
 *       // , { ... }
 *     ],
 *
 *     // Thumbnails for themes selectmenu
 *     // thumbs: null | false | 'path'
 *     // or define:
 *     thumbs: {
 *       path: 'images',
 *       type: 'png'
 *     },
 *
 *     // Available userdefined Themes
 *     userthemes: [
 *       {
 *         name: 'user-theme-name',
 *         title: 'Description',
 *         url: 'http://domain.tld/path/user-theme-name.css',
 *         thumb: 'http://domain.tld/path/user-theme-name.png'  // optional
 *       }
 *       // , { ... }
 *     ],
 *
 *     // Version for download from google libs
 *     version: '1.11.4'
 *  });
 */
(function($, document, window) {
  if (!$.fn) {
    $.fn = {};
  }
  var head = document.getElementsByTagName('head')[0] ? $('head').first() : null,
      plugin = 'themeswitch',
      themes = [
        { 'name': 'black-tie', 'title': 'Black Tie'  },
        { 'name': 'blitzer', 'title': 'Blitzer' },
        { 'name': 'cupertino', 'title': 'Cupertino' },
        { 'name': 'dark-hive', 'title': 'Dark Hive' },
        { 'name': 'dot-luv', 'title': 'Dot Luv' },
        { 'name': 'eggplant', 'title': 'Eggplant' },
        { 'name': 'excite-bike', 'title': 'Excite Bike' },
        { 'name': 'flick', 'title': 'Flick' },
        { 'name': 'hot-sneaks', 'title': 'Hot Sneaks' },
        { 'name': 'humanity', 'title': 'Humanity' },
        { 'name': 'le-frog', 'title': 'Le Frog' },
        { 'name': 'mint-choc', 'title': 'Mint Choc' },
        { 'name': 'overcast', 'title': 'Overcast' },
        { 'name': 'pepper-grinder', 'title': 'Pepper Grinder' },
        { 'name': 'redmond', 'title': 'Redmond' },
        { 'name': 'smoothness', 'title': 'Smoothness' },
        { 'name': 'south-street', 'title': 'South Street' },
        { 'name': 'start', 'title': 'Start' },
        { 'name': 'sunny', 'title': 'Sunny' },
        { 'name': 'swanky-purse', 'title': 'Swanky Purse' },
        { 'name': 'trontastic', 'title': 'Trontastic' },
        { 'name': 'ui-darkness', 'title': 'UI Darkness' },
        { 'name': 'ui-lightness', 'title': 'UI Lightness' },
        { 'name': 'vader', 'title': 'Vader' }
      ];

  $.fn[plugin] = function(props) {

    var element = $(this), that = this, value;

    props = $.extend(true, {
      attach: { before: false, stylesheet: null },
      cookie: true,
      label: 'Theme',
      theme: { name: 'base', title: 'Default' },
      themes: [],
      thumbs: { path: 'images', type: 'png' },
      userthemes: [],
      version: (window.appConfig.hasOwnProperty('jqueryui') ? window.appConfig['jqueryui'] : '1.11.4')
    }, props);

    props.loadtheme = null;
    props.themefile = 'jquery-ui.min.css';
    props.themepath = ['//ajax.googleapis.com/ajax/libs/jqueryui', props.version, 'themes'].join('/');

    if (props.themes.length === 0) {
      props.themes = themes;
    }
    if (props.userthemes.length > 0) {
      props.themes = $.extend(props.themes, props.userthemes);
    }

    if (props.thumbs) {
      if (typeof props.thumbs === 'string') {
        props.thumbs = {'path': props.thumbs, 'type': 'png'};
      }
    }

    if (typeof $.cookie === 'function' && props.cookie) {
      value = {};
      value.name = 'jquery-ui-' + plugin;
      value.domain = (!props.cookie.domain || location.hostname.indexOf(props.cookie.domain) === -1) ? '' : props.cookie.domain;
      value.expires = (!props.cookie.expires ? 0 : props.cookie.expires);
      value.path = (!props.cookie.path ? location.pathname : props.cookie.path);
      props.cookie = value;
    }
    else {
      props.cookie = null;
    }

    if (props.attach) {
      if (!props.attach.hasOwnProperty('stylesheet')) {
        props.attach = { 'stylesheet': props.attach, 'before': false };
      }
      if (typeof props.attach.stylesheet === 'string') {
        props.attach.stylesheet = $('link[href$="'+props.attach.stylesheet+'"][rel="stylesheet"]') || null;
      }
      if (props.attach.stylesheet && props.attach.stylesheet.length > 0) {
        props.attach.stylesheet = props.attach.stylesheet[props.attach.after ? 'last' : 'first']();
      }
    }

    this._find = function(theme) {
      var result = null;
      if (!theme) {
        return result;
      }
      theme = (''+theme).toLowerCase();
      $.each(props.themes, function(key, item) {
        if (item.name.toLowerCase() === theme || item.title.toLowerCase() === theme) {
          result = item;
          return false;
        }
      });
      return result;
    };

    this._cookie = function(value) {
      if (props.cookie) {
        $.cookie(props.cookie.name, value, props.cookie);
      }
    };

    this._load = function(theme) {
      var link = $('link[href^="'+props.themepath+'"][rel="stylesheet"]');
      if (typeof theme === 'string') {
        theme = this._find(theme);
      }
      if (!theme) {
        return;
      }
      if (!theme.url) {
        if (link) {
          link.remove();
        }
        this._cookie(null);
        return;
      }
      if (link.length > 0) {
        link.first().attr('href', theme.url);
        this._cookie(theme.name);
        return;
      }
      link = $('<'+'link type="text/css" rel="stylesheet" href="' + theme.url + '" />');
      if (props.attach.stylesheet) {
        link['insert'+(props.attach.before ? 'Before' : 'After')](props.attach.stylesheet);
        this._cookie(theme.name);
        return;
      }
      head[(props.attach.before ? 'prepend' : 'append')](link);
      this._cookie(theme.name);
    };

    $.each(props.themes, function(key, item) {
      if (!item.url) {
        props.themes[key].url = [
          props.themepath,
          item.name,
          props.themefile
        ].join('/');
      }
      if (!item.thumb && props.thumbs && props.thumbs.path) {
        props.themes[key].thumb = [
          [props.thumbs.path, item.name].join('/'),
          (props.thumbs.type || 'png')
        ].join('.');
      }
    });

    if (typeof props.theme === 'string') {
      props.theme = this._find(props.theme, props.themes);
    }
    if (props.theme.name) {
      if (!this._find(props.theme.name, props.themes)) {
        props.themes.unshift({
          'name' : props.theme.name,
          'title' : props.theme.title || props.theme.name.substr(0,1).toUpperCase()+props.theme.name.substr(1),
          'thumb': (!props.theme.hasOwnProperty('thumb') && props.thumbs && props.thumbs.path
              ? [[props.thumbs.path, props.theme.name].join('/'), (props.thumbs.type || 'png')].join('.')
              : (props.theme.thumb ? props.theme.thumb : null)
          )
        });
      }
      props.loadtheme = this._find(props.theme.name);
    }
    if (props.cookie) {
      value = $.cookie(props.cookie.name);
      if (value) {
        props.loadtheme = this._find(value);
      }
    }

    $.widget('ui.'+plugin+'menu', $.ui.selectmenu, {
      _renderItem: function(ul, item) {
        var li = $('<li>'), html = item.label, sel = item.element.attr('selected');
        if (item.disabled) {
          li.addClass('ui-state-disabled');
        }
        if (sel !== undefined && sel !== false) { li.addClass('ui-state-selected'); }
        if (props.thumbs && item.element.data('thumb')) {
          html = ['<','div>','<','img src="', item.element.data('thumb'), '" class="thumb" /><','span class="title">', item.label, '</','span>','</','div>'].join('');
        }
        li.html(html);
        return li.appendTo(ul);
      }
    });

    this.wrapper = $('<div>')
      .addClass('ui-'+plugin+' ui-front ui-widget ui-helper-clearfix')
      .appendTo(element);
    if (props.label) {
      this.wrapper
        .append(['<label for="',plugin,'-select">',props.label,': </label>'].join(''));
    }
    this.menu = $('<select>')
      .attr('id',plugin+'-select')
      .on('change.'+plugin, function() { that._load($(this).val()); })
      .appendTo(this.wrapper);
    $.each(props.themes, function(key, item) {
      var option = $('<option>').text(item.title);
      option.attr({'value': item.name });
      option.data(item);
      if (props.loadtheme && props.loadtheme.name === item.name) {
        option.attr({'selected':'selected'});
      }
      that.menu.append(option);
    });

    if (!(document.all && !document.querySelector)) {
      this.menu[plugin + 'menu']({
        'change': function(event, ui) {
          var v = ui.item.value || 'base', s = $('option[value="'+v+'"]', that.menu);
          that._load(v);
          s.attr('selected','selected');
          $('option', that.menu).not(s).removeAttr('selected');
          that.menu[plugin + 'menu']('refresh');
        }
      });
      this.menu[plugin + 'menu']('menuWidget').addClass('ui-menu-overflow');
    }

    if (props.loadtheme) {
      this._load(props.loadtheme);
    }
    return this;
  };

})(jQuery, document, window);
