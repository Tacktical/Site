(function() {
  this.bound_elements = {
    sliders: {}
  };

  this.slider = function(element, callback) {
    var _this = this;

    this.bound_elements.sliders[element] = element;
    element.addEventListener('click', function(event) {
      return callback(event.offsetX);
    });
    element._move_listener = function(event) {
      if (element._mouse_downed) {
        return callback(event.pageX - element.getBoundingClientRect().left);
      }
    };
    return element.addEventListener('mousedown', function() {
      this._mouse_downed = true;
      document.addEventListener('mousemove', this._move_listener);
      return document.addEventListener('mouseup', function() {
        element._mouse_downed = void 0;
        return document.removeEventListener('mousemove', this._move_listener);
      });
    });
  };

}).call(this);
(function() {
  var FullHeight,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FullHeight = (function() {
    function FullHeight(element, window, document) {
      var _this = this;

      this.element = element;
      this.window = window != null ? window : window;
      this.document = document != null ? document : document;
      this.header_padding = __bind(this.header_padding, this);
      this.header_height = __bind(this.header_height, this);
      this.window_height = __bind(this.window_height, this);
      this.element.style.width = '100%';
      this.element.style.height = this.full_height();
      this.window.onresize = function() {
        return _this.element.style.height = _this.full_height();
      };
    }

    FullHeight.prototype.window_height = function() {
      if (this.window.innerHeight) {
        return this.window.innerHeight;
      } else {
        return this.document.documentElement.offsetHeight;
      }
    };

    FullHeight.prototype.header_height = function() {
      var page;

      page = this.document.getElementsByClassName('mod-header')[0];
      if (page.offsetHeight) {
        return page.offsetHeight;
      } else {
        return this.document.defaultView.getComputedStyle(page).getPropertyValue('height');
      }
    };

    FullHeight.prototype.header_padding = function() {
      var page;

      page = this.document.getElementsByClassName('mod-header')[0].children[0];
      if (page.offsetHeight) {
        return page.offsetHeight;
      } else {
        return this.document.defaultView.getComputedStyle(page).getPropertyValue('height');
      }
    };

    FullHeight.prototype.full_height = function() {
      return this.window_height() - this.header_height() - (this.header_height() - this.header_padding()) + 'px';
    };

    return FullHeight;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).FullHeight = FullHeight;

}).call(this);
(function() {
  var TimeCode;

  TimeCode = (function() {
    function TimeCode(code) {
      if (code == null) {
        code = 0;
      }
      this.set(code);
    }

    TimeCode.prototype.set = function(code) {
      this.timecode = code;
      this.hours = Math.floor(this.timecode / 3600000);
      this.minutes = Math.floor((this.timecode - (Math.floor(this.hours * 3600000))) / 60000);
      this.seconds = Math.floor((this.timecode - (Math.floor(this.hours * 3600000 + this.minutes * 60000))) / 1000);
      return this.centis = Math.round((this.timecode - (Math.floor(this.hours * 3600000 + this.minutes * 60000 + this.seconds * 1000))) / 10);
    };

    TimeCode.prototype.display = function() {
      var pad;

      pad = function(number) {
        if (number < 10) {
          return '0' + number;
        } else {
          return number;
        }
      };
      return this.hours + ':' + pad(this.minutes) + ':' + pad(this.seconds) + ':' + pad(this.centis);
    };

    TimeCode.prototype.time_from = function(date) {
      return new Date(date.getTime() + this.timecode);
    };

    TimeCode.prototype.increment = function(delta) {
      return this.set(this.timecode + delta);
    };

    TimeCode.prototype.progress = function(max) {
      return this.timecode / max;
    };

    return TimeCode;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).TimeCode = TimeCode;

}).call(this);
(function() {
  var LatitudeLongitude;

  LatitudeLongitude = (function() {
    var ArcMinutes;

    ArcMinutes = function(value, pos_unit, neg_unit) {
      var abs_value, degrees, minutes, seconds, unit;

      abs_value = Math.abs(value);
      degrees = Math.floor(abs_value);
      minutes = Math.floor(60 * (abs_value - degrees));
      seconds = (abs_value - degrees - (minutes / 60)) * 3600;
      unit = value >= 0 ? pos_unit : neg_unit;
      return "" + degrees + "&deg; " + minutes + "' " + (seconds.toFixed(1)) + "\" " + unit;
    };

    function LatitudeLongitude(lat, lng) {
      this.lat = lat;
      this.lng = lng;
    }

    LatitudeLongitude.prototype.latitude = function() {
      return ArcMinutes(this.lat, 'N', 'S');
    };

    LatitudeLongitude.prototype.longitude = function() {
      return ArcMinutes(this.lng, 'E', 'W');
    };

    return LatitudeLongitude;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).LatitudeLongitude = LatitudeLongitude;

}).call(this);
(function() {
  var DistanceBetween;

  DistanceBetween = (function() {
    function DistanceBetween(start, finish) {
      var a, c, lat_1, lat_2, lat_distance, lng_distance;

      lat_distance = (finish.lat - start.lat) * (Math.PI / 180);
      lng_distance = (finish.lng - start.lng) * (Math.PI / 180);
      lat_1 = start.lat * (Math.PI / 180);
      lat_2 = finish.lat * (Math.PI / 180);
      a = Math.sin(lat_distance / 2) * Math.sin(lat_distance / 2) + Math.sin(lng_distance / 2) * Math.sin(lng_distance / 2) * Math.cos(lat_1) * Math.cos(lat_2);
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      this.nm = 3443.89849 * c;
    }

    DistanceBetween.prototype.to_nm = function() {
      return this.nm;
    };

    return DistanceBetween;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).DistanceBetween = DistanceBetween;

}).call(this);
(function() {
  var InnerAngleOfTriangle;

  InnerAngleOfTriangle = (function() {
    function InnerAngleOfTriangle(point_a, point_b, point_c, distance_between) {
      var a, b, c;

      if (distance_between == null) {
        distance_between = DistanceBetween;
      }
      a = new distance_between(point_c, point_b).to_nm();
      b = new distance_between(point_a, point_c).to_nm();
      c = new distance_between(point_a, point_b).to_nm();
      this._rad = Math.acos((a * a + b * b - c * c) / (2 * a * b));
    }

    InnerAngleOfTriangle.prototype.to_rad = function() {
      return this._rad;
    };

    InnerAngleOfTriangle.prototype.to_deg = function() {
      return this._rad * 180 / Math.PI;
    };

    return InnerAngleOfTriangle;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).InnerAngleOfTriangle = InnerAngleOfTriangle;

}).call(this);
(function() {
  var Controls;

  Controls = (function() {
    function Controls(player, display, time_code) {
      this.player = player;
      this.display = display;
      this.time_code = time_code != null ? time_code : TimeCode;
      this.start = this.player.start_time().getTime();
      this.max = this.player.finish_time().getTime() - this.start;
      this.current = new this.time_code;
      this.player.set_to(this.current);
    }

    Controls.prototype.tick = function(time) {
      var delta;

      delta = time - this.last;
      this.current.increment(delta);
      if (this.current.timecode < this.max) {
        this.player.set_to(this.current);
        this.display.set_to(this.current, this.current.progress(this.max));
        return this.last = time;
      } else {
        this.end();
        return clearInterval(this.timer);
      }
    };

    Controls.prototype.end = function() {
      var timecode;

      timecode = new this.time_code(this.max);
      this.player.set_to(timecode);
      this.display.set_to(timecode, 1);
      return this.current = new this.time_code(0);
    };

    Controls.prototype.skip = function(event) {
      var percent;

      percent = this.display.calculate(event);
      this.current = new this.time_code(this.max * percent);
      this.player.set_to(this.current);
      return this.display.set_to(this.current, percent);
    };

    Controls.prototype.play = function() {
      var _this = this;

      this.display.playing();
      this.last = new Date().getTime();
      this.timer = setInterval((function() {
        return _this.tick(new Date().getTime());
      }), 100);
      return this.tick(this.last);
    };

    Controls.prototype.pause = function() {
      this.display.stopped();
      return clearInterval(this.timer);
    };

    return Controls;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).Controls = Controls;

}).call(this);
(function() {
  var Display;

  Display = (function() {
    function Display(dom) {
      this.dom = dom != null ? dom : document;
    }

    Display.prototype.set_to = function(timecode, progress) {
      return this.dom.getElementById('playback_time').innerHTML = timecode.display();
    };

    Display.prototype.playing = function() {
      this.dom.getElementById('play').innerHTML = '||';
      return this.dom.getElementById('play').onclick = function() {
        return controls.pause();
      };
    };

    Display.prototype.stopped = function() {
      this.dom.getElementById('play').innerHTML = '&#9654;';
      return this.dom.getElementById('play').onclick = function() {
        return controls.play();
      };
    };

    Display.prototype.calculate = function(x) {
      var percent;

      percent = x / this.dom.getElementById('progress_bar').parentNode.offsetWidth;
      if (percent > 1) {
        return 1;
      } else if (percent < 0) {
        return 0;
      } else {
        return percent;
      }
    };

    return Display;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).Display = Display;

}).call(this);
(function() {
  var Course;

  Course = (function() {
    function Course(marks, angle, distance) {
      this.marks = marks;
      this.angle = angle != null ? angle : InnerAngleOfTriangle;
      this.distance = distance != null ? distance : DistanceBetween;
      this.mark_passes = [];
    }

    Course.prototype.angle_of_position_at = function(position, mark_index) {
      return new this.angle(position, this.marks[mark_index - 1], this.marks[mark_index], this.distance).to_deg();
    };

    Course.prototype.inner_angle_at = function(mark) {
      return new this.angle(this.marks[mark - 1], this.marks[mark + 1], this.marks[mark], this.distance).to_deg();
    };

    Course.prototype.boundary_angle_at = function(mark) {
      return (360 - this.inner_angle_at(mark)) / 2;
    };

    Course.prototype.load = function(track) {
      var i,
        _this = this;

      this.track = track;
      i = 1;
      return this.track.forEach(function(position) {
        if (i < _this.marks.length - 1 && _this.boundary_angle_at(i) < _this.angle_of_position_at(position, i)) {
          _this.mark_passes.push(position.time);
          return i++;
        }
      });
    };

    Course.prototype.next_mark_at = function(index) {
      var i, position;

      position = this.track[index - 1];
      i = 0;
      while (this.mark_passes[i] <= position.time) {
        i++;
      }
      return this.marks[i + 1];
    };

    return Course;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).Course = Course;

}).call(this);
(function() {
  var Map, Track;

  Track = (function() {
    function Track(api, map, points, options) {
      var _base;

      this.api = api;
      this.map = map;
      this.points = points;
      this.options = options != null ? options : {};
      (_base = this.options).colour || (_base.colour = "blue");
      this.actual = new this.api.Polyline({
        strokeColor: this.options.colour,
        strokeOpacity: 1.0,
        strokeWeight: 2.5,
        map: this.map
      });
    }

    Track.prototype.set_to = function(index) {
      return this.actual.setPath(this.points.slice(0, index));
    };

    return Track;

  })();

  Map = (function() {
    function Map(element, api) {
      this.element = element;
      this.api = api != null ? api : google.maps;
      this.actual = new this.api.Map(this.element, {
        zoom: 13,
        mapTypeId: this.api.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false
      });
      this.tracks = [];
    }

    Map.prototype.load = function(points, options) {
      var bounds,
        _this = this;

      if (options == null) {
        options = {};
      }
      if (points.length > 0) {
        points = points.map(function(point) {
          return new _this.api.LatLng(point.lat, point.lng);
        });
        if ((options.center == null) || options.center) {
          this.actual.setCenter(points[0]);
        }
        bounds = new this.api.LatLngBounds();
        points.forEach(function(point) {
          return bounds.extend(point);
        });
        this.actual.fitBounds(bounds);
        return this.tracks.push(new Track(this.api, this.actual, points, options));
      }
    };

    Map.prototype.center = function(point) {
      return this.actual.setCenter(new this.api.LatLng(point.lat, point.lng));
    };

    Map.prototype.set = function(index) {
      var track, _i, _len, _ref, _results;

      _ref = this.tracks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        track = _ref[_i];
        _results.push(track.set_to(index));
      }
      return _results;
    };

    Map.prototype.mark = function(lat, lng, opts) {
      if (opts == null) {
        opts = {};
      }
      opts.map = this.actual;
      opts.position = new this.api.LatLng(lat, lng);
      return new this.api.Marker(opts);
    };

    Map.prototype.line = function(opts) {
      opts.map = this.actual;
      return new this.api.Polyline(opts);
    };

    Map.prototype.icon = function(file, opts) {
      var icon;

      icon = new this.api.MarkerImage(file);
      if (opts.anchor) {
        icon.anchor = new this.api.Point(opts.anchor[0], opts.anchor[1]);
      }
      return icon;
    };

    Map.prototype.on = function(event, element, callback) {
      var listened_on;

      listened_on = element ? element.ui : this.actual;
      return this.api.event.addListener(listened_on, event, function(api_event) {
        var api_latlng;

        api_latlng = api_event.latLng;
        return callback({
          lat: api_latlng.lat(),
          lng: api_latlng.lng()
        });
      });
    };

    return Map;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).Map = Map;

}).call(this);
(function() {
  var YachtStatistics;

  YachtStatistics = (function() {
    var StatsDisplay;

    StatsDisplay = function(heading, speed, latlng) {
      return ("<div class='latitude'> " + (latlng.latitude()) + "</div>") + ("<div class='longitude'>" + (latlng.longitude()) + "</div>") + ("<div class='heading'>  " + heading + "&deg;</div>") + ("<div class='speed'>    " + speed + "knts</div>");
    };

    function YachtStatistics(dom, format, latlng) {
      if (dom == null) {
        dom = document;
      }
      this.format = format != null ? format : StatsDisplay;
      this.latlng = latlng != null ? latlng : LatitudeLongitude;
      this.display = dom.getElementById('course');
    }

    YachtStatistics.prototype.load = function(track) {
      this.track = track;
    };

    YachtStatistics.prototype.set = function(index) {
      var current, heading, speed;

      current = this.track[index - 1];
      heading = current.cog && current.cog >= 0 ? current.cog.toFixed(1) : '---.-';
      speed = current.sog && current.sog >= 0 ? (current.sog * 1.94384449).toFixed(1) : '--.-';
      return this.display.innerHTML = this.format(heading, speed, new this.latlng(current.lat, current.lng));
    };

    return YachtStatistics;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).YachtStatistics = YachtStatistics;

}).call(this);
(function() {
  var WindStatistics;

  WindStatistics = (function() {
    var StatsDisplay;

    StatsDisplay = function(heading, speed) {
      return ("<tr><th>TWA</th><td>" + heading + "&deg;</td></tr>") + ("<tr><th>TWS</th><td>" + speed + "knts</td></tr>");
    };

    function WindStatistics(dom, format) {
      if (dom == null) {
        dom = document;
      }
      this.format = format != null ? format : StatsDisplay;
      this.display = dom.getElementById('wind');
    }

    WindStatistics.prototype.load = function(track) {
      this.track = track;
    };

    WindStatistics.prototype.set = function(index) {
      var current, heading, speed;

      current = this.track[index - 1];
      speed = current.wind_speed && current.wind_speed >= 0 ? (current.wind_speed * 0.868976).toFixed(1) : '--.-';
      heading = current.wind_bearing && current.wind_bearing >= 0 ? current.wind_bearing.toFixed(1) : '---.-';
      return this.display.innerHTML = this.format(heading, speed);
    };

    return WindStatistics;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).WindStatistics = WindStatistics;

}).call(this);
/*! Javascript plotting library for jQuery, v. 0.8a.
 *
 * Released under the MIT license by IOLA, December 2007.
 *
 */

// first an inline dependency, jquery.colorhelpers.js, we inline it here
// for convenience

/* Plugin for jQuery for working with colors.
 * 
 * Version 1.1.
 * 
 * Inspiration from jQuery color animation plugin by John Resig.
 *
 * Released under the MIT license by Ole Laursen, October 2009.
 *
 * Examples:
 *
 *   $.color.parse("#fff").scale('rgb', 0.25).add('a', -0.5).toString()
 *   var c = $.color.extract($("#mydiv"), 'background-color');
 *   console.log(c.r, c.g, c.b, c.a);
 *   $.color.make(100, 50, 25, 0.4).toString() // returns "rgba(100,50,25,0.4)"
 *
 * Note that .scale() and .add() return the same modified object
 * instead of making a new one.
 *
 * V. 1.1: Fix error handling so e.g. parsing an empty string does
 * produce a color rather than just crashing.
 */
 
(function(B){B.color={};B.color.make=function(F,E,C,D){var G={};G.r=F||0;G.g=E||0;G.b=C||0;G.a=D!=null?D:1;G.add=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]+=I}return G.normalize()};G.scale=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]*=I}return G.normalize()};G.toString=function(){if(G.a>=1){return"rgb("+[G.r,G.g,G.b].join(",")+")"}else{return"rgba("+[G.r,G.g,G.b,G.a].join(",")+")"}};G.normalize=function(){function H(J,K,I){return K<J?J:(K>I?I:K)}G.r=H(0,parseInt(G.r),255);G.g=H(0,parseInt(G.g),255);G.b=H(0,parseInt(G.b),255);G.a=H(0,G.a,1);return G};G.clone=function(){return B.color.make(G.r,G.b,G.g,G.a)};return G.normalize()};B.color.extract=function(D,C){var E;do{E=D.css(C).toLowerCase();if(E!=""&&E!="transparent"){break}D=D.parent()}while(!B.nodeName(D.get(0),"body"));if(E=="rgba(0, 0, 0, 0)"){E="transparent"}return B.color.parse(E)};B.color.parse=function(F){var E,C=B.color.make;if(E=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10))}if(E=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10),parseFloat(E[4]))}if(E=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55)}if(E=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55,parseFloat(E[4]))}if(E=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(F)){return C(parseInt(E[1],16),parseInt(E[2],16),parseInt(E[3],16))}if(E=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(F)){return C(parseInt(E[1]+E[1],16),parseInt(E[2]+E[2],16),parseInt(E[3]+E[3],16))}var D=B.trim(F).toLowerCase();if(D=="transparent"){return C(255,255,255,0)}else{E=A[D]||[0,0,0];return C(E[0],E[1],E[2])}};var A={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})(jQuery);

(function(k){function T(z,U,s,Z){function H(a,d){for(var d=[p].concat(d),b=0;b<a.length;++b)a[b].apply(this,d)}function $(a){for(var d=[],b=0;b<a.length;++b){var c=k.extend(!0,{},f.series);null!=a[b].data?(c.data=a[b].data,delete a[b].data,k.extend(!0,c,a[b]),a[b].data=c.data):c.data=a[b];d.push(c)}r=d;b=r.length;for(a=d=0;a<r.length;++a)c=r[a].color,null!=c&&(b--,"number"==typeof c&&c>d&&(d=c));d>b&&(b=d+1);for(var d=[],e=f.colors,o=e.length,l=0,a=0;a<b;a++)c=k.color.parse(e[a%o]||"#666"),0==a%o&&
a&&(l=0<=l?0.5>l?-l-0.2:0:-l),d[a]=c.scale("rgb",1+l);for(a=b=0;a<r.length;++a){c=r[a];null==c.color?(c.color=d[b].toString(),++b):"number"==typeof c.color&&(c.color=d[c.color].toString());if(null==c.lines.show){var g,e=!0;for(g in c)if(c[g]&&c[g].show){e=!1;break}e&&(c.lines.show=!0)}c.xaxis=Q(A,R(c,"x"));c.yaxis=Q(D,R(c,"y"))}g=function(a,b,c){b<a.datamin&&b!=-C&&(a.datamin=b);c>a.datamax&&c!=C&&(a.datamax=c)};var j=Number.POSITIVE_INFINITY,h=Number.NEGATIVE_INFINITY,C=Number.MAX_VALUE,u,F,i;k.each(M(),
function(a,b){b.datamin=j;b.datamax=h;b.used=!1});for(a=0;a<r.length;++a)d=r[a],d.datapoints={points:[]},H(w.processRawData,[d,d.data,d.datapoints]);for(a=0;a<r.length;++a){var d=r[a],q=d.data,m=d.datapoints.format;if(!m){m=[];m.push({x:!0,number:!0,required:!0});m.push({y:!0,number:!0,required:!0});if(d.bars.show||d.lines.show&&d.lines.fill)m.push({y:!0,number:!0,required:!1,defaultValue:0}),d.bars.horizontal&&(delete m[m.length-1].y,m[m.length-1].x=!0);d.datapoints.format=m}if(null==d.datapoints.pointsize){d.datapoints.pointsize=
m.length;o=d.datapoints.pointsize;e=d.datapoints.points;insertSteps=d.lines.show&&d.lines.steps;d.xaxis.used=d.yaxis.used=!0;for(b=u=0;b<q.length;++b,u+=o){i=q[b];var t=null==i;if(!t)for(c=0;c<o;++c){l=i[c];if(F=m[c])if(F.number&&null!=l&&(l=+l,isNaN(l)?l=null:Infinity==l?l=C:-Infinity==l&&(l=-C)),null==l)F.required&&(t=!0),null!=F.defaultValue&&(l=F.defaultValue);e[u+c]=l}if(t)for(c=0;c<o;++c)l=e[u+c],null!=l&&(F=m[c],F.x&&g(d.xaxis,l,l),F.y&&g(d.yaxis,l,l)),e[u+c]=null;else if(insertSteps&&0<u&&
null!=e[u-o]&&e[u-o]!=e[u]&&e[u-o+1]!=e[u+1]){for(c=0;c<o;++c)e[u+o+c]=e[u+c];e[u+1]=e[u-o+1];u+=o}}}}for(a=0;a<r.length;++a)d=r[a],H(w.processDatapoints,[d,d.datapoints]);for(a=0;a<r.length;++a){d=r[a];e=d.datapoints.points;o=d.datapoints.pointsize;m=d.datapoints.format;i=u=j;t=q=h;for(b=0;b<e.length;b+=o)if(null!=e[b])for(c=0;c<o;++c)if(l=e[b+c],(F=m[c])&&!(l==C||l==-C))if(F.x&&(l<u&&(u=l),l>q&&(q=l)),F.y)l<i&&(i=l),l>t&&(t=l);if(d.bars.show){switch(d.bars.align){case "left":b=0;break;case "right":b=
-d.bars.barWidth;break;case "center":b=-d.bars.barWidth/2;break;default:throw Error("Invalid bar alignment: "+d.bars.align);}d.bars.horizontal?(i+=b,t+=b+d.bars.barWidth):(u+=b,q+=b+d.bars.barWidth)}g(d.xaxis,u,q);g(d.yaxis,i,t)}k.each(M(),function(a,b){b.datamin==j&&(b.datamin=null);b.datamax==h&&(b.datamax=null)})}function R(a,d){var b=a[d+"axis"];"object"==typeof b&&(b=b.n);"number"!=typeof b&&(b=1);return b}function M(){return k.grep(A.concat(D),function(a){return a})}function aa(a){var d={},
b,c;for(b=0;b<A.length;++b)(c=A[b])&&c.used&&(d["x"+c.n]=c.c2p(a.left));for(b=0;b<D.length;++b)(c=D[b])&&c.used&&(d["y"+c.n]=c.c2p(a.top));void 0!==d.x1&&(d.x=d.x1);void 0!==d.y1&&(d.y=d.y1);return d}function Q(a,d){a[d-1]||(a[d-1]={n:d,direction:a==A?"x":"y",options:k.extend(!0,{},a==A?f.xaxis:f.yaxis)});return a[d-1]}function ba(a){return 1<window.devicePixelRatio&&(void 0===a.webkitBackingStorePixelRatio||2>a.webkitBackingStorePixelRatio)?window.devicePixelRatio:1}function ca(a,d){var b=document.createElement("canvas");
b.className=d;b.getContext||(b=window.G_vmlCanvasManager.initElement(b));var c=b.getContext("2d"),e=ba(c);b.width=B*e;b.height=x*e;b.style.width=B+"px";b.style.height=x+"px";a||k(b).css({position:"absolute",left:0,top:0});k(b).appendTo(z);c.save();c.scale(e,e);return b}function da(){B=z.width();x=z.height();if(0>=B||0>=x)throw Error("Invalid dimensions for plot, width = "+B+", height = "+x);}function ea(a){var d=a.getContext("2d"),b=ba(d);a.style.width!=B&&(a.width=B*b,a.style.width=B+"px");a.style.height!=
x&&(a.height=x*b,a.style.height=x+"px");d.restore();d.save();d.scale(b,b)}function T(a){var d=a.labelWidth,b=a.labelHeight,c=a.options.position,e=a.options.tickLength,o=f.grid.axisMargin,g=f.grid.labelMargin,v="x"==a.direction?A:D,j=k.grep(v,function(a){return a&&a.options.position==c&&a.reserveSpace});k.inArray(a,j)==j.length-1&&(o=0);if(null==e)var e=k.grep(v,function(a){return a&&a.reserveSpace}),n=0==k.inArray(a,e),e=n?"full":5;isNaN(+e)||(g+=+e);"x"==a.direction?(b+=g,"bottom"==c?(h.bottom+=
b+o,a.box={top:x-h.bottom,height:b}):(a.box={top:h.top+o,height:b},h.top+=b+o)):(d+=g,"left"==c?(a.box={left:h.left+o,width:d},h.left+=d+o):(h.right+=d+o,a.box={left:B-h.right,width:d}));a.position=c;a.tickLength=e;a.box.padding=g;a.innermost=n}function fa(){var a,d=M(),b=f.grid.show;for(a in h){var c=f.grid.margin||0;h[a]="number"==typeof c?c:c[a]||0}H(w.processOffset,[h]);for(a in h)h[a]+=b?f.grid.borderWidth:0;k.each(d,function(a,b){b.show=b.options.show;null==b.show&&(b.show=b.used);b.reserveSpace=
b.show||b.options.reserveSpace;var c=b.options,d=+(null!=c.min?c.min:b.datamin),e=+(null!=c.max?c.max:b.datamax),f=e-d;if(0==f){if(f=0==e?1:0.01,null==c.min&&(d-=f),null==c.max||null!=c.min)e+=f}else{var g=c.autoscaleMargin;if(null!=g&&(null==c.min&&(d-=f*g,0>d&&(null!=b.datamin&&0<=b.datamin)&&(d=0)),null==c.max))e+=f*g,0<e&&(null!=b.datamax&&0>=b.datamax)&&(e=0)}b.min=d;b.max=e});if(b){var e={style:z.css("font-style"),size:Math.round(0.8*(+z.css("font-size").replace("px","")||13)),variant:z.css("font-variant"),
weight:z.css("font-weight"),family:z.css("font-family")},b=k.grep(d,function(a){return a.reserveSpace});k.each(b,function(a,b){var c=b.options,d;d="number"==typeof c.ticks&&0<c.ticks?c.ticks:0.3*Math.sqrt("x"==b.direction?B:x);b.delta=(b.max-b.min)/d;if("time"==c.mode&&!b.tickGenerator)throw Error("Time mode requires the flot.time plugin.");if(!b.tickGenerator){d=c.tickDecimals;var f=-Math.floor(Math.log(b.delta)/Math.LN10);null!=d&&f>d&&(f=d);var o=Math.pow(10,-f),l=b.delta/o,j;if(1.5>l)j=1;else if(3>
l){if(j=2,2.25<l&&(null==d||f+1<=d))j=2.5,++f}else j=7.5>l?5:10;j*=o;null!=c.minTickSize&&j<c.minTickSize&&(j=c.minTickSize);b.tickDecimals=Math.max(0,null!=d?d:f);b.tickSize=c.tickSize||j;b.tickGenerator=function(b){var a=[],d=b.tickSize*Math.floor(b.min/b.tickSize),c=0,e=Number.NaN,f;do{f=e;e=d+c*b.tickSize;a.push(e);++c}while(e<b.max&&e!=f);return a};b.tickFormatter=function(b,a){var d=Math.pow(10,a.tickDecimals);return""+Math.round(b*d)/d}}k.isFunction(c.tickFormatter)&&(b.tickFormatter=function(b,
a){return""+c.tickFormatter(b,a)});if(null!=c.alignTicksWithAxis){var h=("x"==b.direction?A:D)[c.alignTicksWithAxis-1];if(h&&h.used&&h!=b){d=b.tickGenerator(b);if(0<d.length&&(null==c.min&&(b.min=Math.min(b.min,d[0])),null==c.max&&1<d.length))b.max=Math.max(b.max,d[d.length-1]);b.tickGenerator=function(b){var a=[],d,c;for(c=0;c<h.ticks.length;++c){d=(h.ticks[c].v-h.min)/(h.max-h.min);d=b.min+d*(b.max-b.min);a.push(d)}return a};!b.mode&&null==c.tickDecimals&&(d=Math.max(0,-Math.floor(Math.log(b.delta)/
Math.LN10)+1),f=b.tickGenerator(b),1<f.length&&/\..*0$/.test((f[1]-f[0]).toFixed(d))||(b.tickDecimals=d))}}f=b.options.ticks;d=[];null==f||"number"==typeof f&&0<f?d=b.tickGenerator(b):f&&(d=k.isFunction(f)?f(b):f);b.ticks=[];for(f=0;f<d.length;++f)l=null,j=d[f],"object"==typeof j?(o=+j[0],1<j.length&&(l=j[1])):o=+j,null==l&&(l=b.tickFormatter(o,b)),isNaN(o)||b.ticks.push({v:o,label:l});d=b.ticks;if(b.options.autoscaleMargin&&0<d.length&&(null==b.options.min&&(b.min=Math.min(b.min,d[0].v)),null==b.options.max&&
1<d.length))b.max=Math.max(b.max,d[d.length-1].v);b.font=k.extend({},e,b.options.font);d=b.options;f=b.ticks||[];o=d.labelWidth||0;l=d.labelHeight||0;j=b.font;g.save();g.font=j.style+" "+j.variant+" "+j.weight+" "+j.size+"px '"+j.family+"'";for(var n=0;n<f.length;++n){var v=f[n];v.lines=[];v.width=v.height=0;if(v.label){for(var r=(v.label+"").replace(/<br ?\/?>|\r\n|\r/g,"\n").split("\n"),p=0;p<r.length;++p){var K={text:r[p]},s=g.measureText(K.text);K.width=s.width;K.height=null!=s.height?s.height:
j.size;K.height+=Math.round(0.15*j.size);v.width=Math.max(K.width,v.width);v.height+=K.height;v.lines.push(K)}null==d.labelWidth&&(o=Math.max(o,v.width));null==d.labelHeight&&(l=Math.max(l,v.height))}}g.restore();b.labelWidth=Math.ceil(o);b.labelHeight=Math.ceil(l)});for(a=b.length-1;0<=a;--a)T(b[a]);a=f.grid.minBorderMargin;var o={x:0,y:0};if(null==a)for(c=a=0;c<r.length;++c)a=Math.max(a,2*(r[c].points.radius+r[c].points.lineWidth/2));o.x=o.y=Math.ceil(a);k.each(M(),function(b,a){var d=a.direction;
a.reserveSpace&&(o[d]=Math.ceil(Math.max(o[d],("x"==d?a.labelWidth:a.labelHeight)/2)))});h.left=Math.max(o.x,h.left);h.right=Math.max(o.x,h.right);h.top=Math.max(o.y,h.top);h.bottom=Math.max(o.y,h.bottom);k.each(b,function(b,a){"x"==a.direction?(a.box.left=h.left-a.labelWidth/2,a.box.width=B-h.left-h.right+a.labelWidth):(a.box.top=h.top-a.labelHeight/2,a.box.height=x-h.bottom-h.top+a.labelHeight)})}L=B-h.left-h.right;I=x-h.bottom-h.top;k.each(d,function(b,a){var d=function(a){return a},c,e,f=a.options.transform||
d,o=a.options.inverseTransform;"x"==a.direction?(c=a.scale=L/Math.abs(f(a.max)-f(a.min)),e=Math.min(f(a.max),f(a.min))):(c=a.scale=I/Math.abs(f(a.max)-f(a.min)),c=-c,e=Math.max(f(a.max),f(a.min)));a.p2c=f==d?function(a){return(a-e)*c}:function(a){return(f(a)-e)*c};a.c2p=o?function(a){return o(e+a/c)}:function(a){return e+a/c}});z.find(".legend").remove();if(f.legend.show){d=[];b=[];a=!1;for(var c=f.legend.labelFormatter,l,v,j=0;j<r.length;++j)l=r[j],l.label&&(v=c?c(l.label,l):l.label)&&b.push({label:v,
color:l.color});if(f.legend.sorted)if(k.isFunction(f.legend.sorted))b.sort(f.legend.sorted);else{var n="descending"!=f.legend.sorted;b.sort(function(a,b){return a.label==b.label?0:a.label<b.label!=n?1:-1})}for(j=0;j<b.length;++j)entry=b[j],0==j%f.legend.noColumns&&(a&&d.push("</tr>"),d.push("<tr>"),a=!0),d.push('<td class="legendColorBox"><div style="border:1px solid '+f.legend.labelBoxBorderColor+';padding:1px"><div style="width:4px;height:0;border:5px solid '+entry.color+';overflow:hidden"></div></div></td><td class="legendLabel">'+
entry.label+"</td>");a&&d.push("</tr>");0!=d.length&&(b='<table style="font-size:smaller;color:'+f.grid.color+'">'+d.join("")+"</table>",null!=f.legend.container?k(f.legend.container).html(b):(d="",a=f.legend.position,c=f.legend.margin,null==c[0]&&(c=[c,c]),"n"==a.charAt(0)?d+="top:"+(c[1]+h.top)+"px;":"s"==a.charAt(0)&&(d+="bottom:"+(c[1]+h.bottom)+"px;"),"e"==a.charAt(1)?d+="right:"+(c[0]+h.right)+"px;":"w"==a.charAt(1)&&(d+="left:"+(c[0]+h.left)+"px;"),b=k('<div class="legend">'+b.replace('style="',
'style="position:absolute;'+d+";")+"</div>").appendTo(z),0!=f.legend.backgroundOpacity&&(a=f.legend.backgroundColor,null==a&&(a=(a=f.grid.backgroundColor)&&"string"==typeof a?k.color.parse(a):k.color.extract(b,"background-color"),a.a=1,a=a.toString()),c=b.children(),k('<div style="position:absolute;width:'+c.width()+"px;height:"+c.height()+"px;"+d+"background-color:"+a+';"> </div>').prependTo(b).css("opacity",f.legend.backgroundOpacity))))}}function ga(){g.clearRect(0,0,B,x);H(w.drawBackground,[g]);
var a=f.grid;a.show&&a.backgroundColor&&(g.save(),g.translate(h.left,h.top),g.fillStyle=ha(f.grid.backgroundColor,I,0,"rgba(255, 255, 255, 0)"),g.fillRect(0,0,L,I),g.restore());a.show&&!a.aboveData&&(ia(),ja());for(var d=0;d<r.length;++d){H(w.drawSeries,[g,r[d]]);var b=r[d];b.lines.show&&ta(b);b.bars.show&&ua(b);b.points.show&&va(b)}H(w.draw,[g]);a.show&&a.aboveData&&(ia(),ja())}function ka(a,d){for(var b,c,e,f,g=M(),h=0;h<g.length;++h)if(b=g[h],b.direction==d&&(f=d+b.n+"axis",!a[f]&&1==b.n&&(f=d+
"axis"),a[f])){c=a[f].from;e=a[f].to;break}a[f]||(b="x"==d?A[0]:D[0],c=a[d+"1"],e=a[d+"2"]);null!=c&&(null!=e&&c>e)&&(f=c,c=e,e=f);return{from:c,to:e,axis:b}}function ia(){var a;g.save();g.translate(h.left,h.top);var d=f.grid.markings;if(d){if(k.isFunction(d)){var b=p.getAxes();b.xmin=b.xaxis.min;b.xmax=b.xaxis.max;b.ymin=b.yaxis.min;b.ymax=b.yaxis.max;d=d(b)}for(a=0;a<d.length;++a){var b=d[a],c=ka(b,"x"),e=ka(b,"y");null==c.from&&(c.from=c.axis.min);null==c.to&&(c.to=c.axis.max);null==e.from&&(e.from=
e.axis.min);null==e.to&&(e.to=e.axis.max);c.to<c.axis.min||(c.from>c.axis.max||e.to<e.axis.min||e.from>e.axis.max)||(c.from=Math.max(c.from,c.axis.min),c.to=Math.min(c.to,c.axis.max),e.from=Math.max(e.from,e.axis.min),e.to=Math.min(e.to,e.axis.max),c.from==c.to&&e.from==e.to||(c.from=c.axis.p2c(c.from),c.to=c.axis.p2c(c.to),e.from=e.axis.p2c(e.from),e.to=e.axis.p2c(e.to),c.from==c.to||e.from==e.to?(g.beginPath(),g.strokeStyle=b.color||f.grid.markingsColor,g.lineWidth=b.lineWidth||f.grid.markingsLineWidth,
g.moveTo(c.from,e.from),g.lineTo(c.to,e.to),g.stroke()):(g.fillStyle=b.color||f.grid.markingsColor,g.fillRect(c.from,e.to,c.to-c.from,e.from-e.to))))}}b=M();d=f.grid.borderWidth;for(c=0;c<b.length;++c){e=b[c];a=e.box;var o=e.tickLength,l,v,j,n;if(e.show&&0!=e.ticks.length){g.strokeStyle=e.options.tickColor||k.color.parse(e.options.color).scale("a",0.22).toString();g.lineWidth=1;"x"==e.direction?(l=0,v="full"==o?"top"==e.position?0:I:a.top-h.top+("top"==e.position?a.height:0)):(v=0,l="full"==o?"left"==
e.position?0:L:a.left-h.left+("left"==e.position?a.width:0));e.innermost||(g.beginPath(),j=n=0,"x"==e.direction?j=L:n=I,1==g.lineWidth&&(l=Math.floor(l)+0.5,v=Math.floor(v)+0.5),g.moveTo(l,v),g.lineTo(l+j,v+n),g.stroke());g.beginPath();for(a=0;a<e.ticks.length;++a){var C=e.ticks[a].v;j=n=0;C<e.min||(C>e.max||"full"==o&&0<d&&(C==e.min||C==e.max))||("x"==e.direction?(l=e.p2c(C),n="full"==o?-I:o,"top"==e.position&&(n=-n)):(v=e.p2c(C),j="full"==o?-L:o,"left"==e.position&&(j=-j)),1==g.lineWidth&&("x"==
e.direction?l=Math.floor(l)+0.5:v=Math.floor(v)+0.5),g.moveTo(l,v),g.lineTo(l+j,v+n))}g.stroke()}}d&&(g.lineWidth=d,g.strokeStyle=f.grid.borderColor,g.strokeRect(-d/2,-d/2,L+d,I+d));g.restore()}function ja(){g.save();k.each(M(),function(a,d){if(d.show&&0!=d.ticks.length){var b=d.box,c=d.font;g.fillStyle=d.options.color;g.font=c.style+" "+c.variant+" "+c.weight+" "+c.size+"px "+c.family;g.textAlign="start";g.textBaseline="middle";for(c=0;c<d.ticks.length;++c){var e=d.ticks[c];if(e.label&&!(e.v<d.min||
e.v>d.max))for(var f,l,v=0,j,n=0;n<e.lines.length;++n)j=e.lines[n],"x"==d.direction?(f=h.left+d.p2c(e.v)-j.width/2,l="bottom"==d.position?b.top+b.padding:b.top+b.height-b.padding-e.height):(l=h.top+d.p2c(e.v)-e.height/2,f="left"==d.position?b.left+b.width-b.padding-j.width:b.left+b.padding),l+=j.height/2+v,v+=j.height,k.browser.opera&&(f=Math.floor(f),l=Math.ceil(l-2)),g.fillText(j.text,f,l)}}});g.restore()}function ta(a){function d(a,b,d,c,e){var f=a.points,a=a.pointsize,l=null,j=null;g.beginPath();
for(var o=a;o<f.length;o+=a){var h=f[o-a],i=f[o-a+1],m=f[o],n=f[o+1];if(!(null==h||null==m)){if(i<=n&&i<e.min){if(n<e.min)continue;h=(e.min-i)/(n-i)*(m-h)+h;i=e.min}else if(n<=i&&n<e.min){if(i<e.min)continue;m=(e.min-i)/(n-i)*(m-h)+h;n=e.min}if(i>=n&&i>e.max){if(n>e.max)continue;h=(e.max-i)/(n-i)*(m-h)+h;i=e.max}else if(n>=i&&n>e.max){if(i>e.max)continue;m=(e.max-i)/(n-i)*(m-h)+h;n=e.max}if(h<=m&&h<c.min){if(m<c.min)continue;i=(c.min-h)/(m-h)*(n-i)+i;h=c.min}else if(m<=h&&m<c.min){if(h<c.min)continue;
n=(c.min-h)/(m-h)*(n-i)+i;m=c.min}if(h>=m&&h>c.max){if(m>c.max)continue;i=(c.max-h)/(m-h)*(n-i)+i;h=c.max}else if(m>=h&&m>c.max){if(h>c.max)continue;n=(c.max-h)/(m-h)*(n-i)+i;m=c.max}(h!=l||i!=j)&&g.moveTo(c.p2c(h)+b,e.p2c(i)+d);l=m;j=n;g.lineTo(c.p2c(m)+b,e.p2c(n)+d)}}g.stroke()}g.save();g.translate(h.left,h.top);g.lineJoin="round";var b=a.lines.lineWidth,c=a.shadowSize;if(0<b&&0<c){g.lineWidth=c;g.strokeStyle="rgba(0,0,0,0.1)";var e=Math.PI/18;d(a.datapoints,Math.sin(e)*(b/2+c/2),Math.cos(e)*(b/
2+c/2),a.xaxis,a.yaxis);g.lineWidth=c/2;d(a.datapoints,Math.sin(e)*(b/2+c/4),Math.cos(e)*(b/2+c/4),a.xaxis,a.yaxis)}g.lineWidth=b;g.strokeStyle=a.color;if(c=V(a.lines,a.color,0,I)){g.fillStyle=c;for(var f=a.datapoints,c=a.xaxis,e=a.yaxis,l=f.points,f=f.pointsize,v=Math.min(Math.max(0,e.min),e.max),j=0,n=!1,C=1,k=0,r=0;!(0<f&&j>l.length+f);){var j=j+f,i=l[j-f],q=l[j-f+C],m=l[j],t=l[j+C];if(n){if(0<f&&null!=i&&null==m){r=j;f=-f;C=2;continue}if(0>f&&j==k+f){g.fill();n=!1;f=-f;C=1;j=k=r+f;continue}}if(!(null==
i||null==m)){if(i<=m&&i<c.min){if(m<c.min)continue;q=(c.min-i)/(m-i)*(t-q)+q;i=c.min}else if(m<=i&&m<c.min){if(i<c.min)continue;t=(c.min-i)/(m-i)*(t-q)+q;m=c.min}if(i>=m&&i>c.max){if(m>c.max)continue;q=(c.max-i)/(m-i)*(t-q)+q;i=c.max}else if(m>=i&&m>c.max){if(i>c.max)continue;t=(c.max-i)/(m-i)*(t-q)+q;m=c.max}n||(g.beginPath(),g.moveTo(c.p2c(i),e.p2c(v)),n=!0);if(q>=e.max&&t>=e.max)g.lineTo(c.p2c(i),e.p2c(e.max)),g.lineTo(c.p2c(m),e.p2c(e.max));else if(q<=e.min&&t<=e.min)g.lineTo(c.p2c(i),e.p2c(e.min)),
g.lineTo(c.p2c(m),e.p2c(e.min));else{var p=i,s=m;q<=t&&q<e.min&&t>=e.min?(i=(e.min-q)/(t-q)*(m-i)+i,q=e.min):t<=q&&(t<e.min&&q>=e.min)&&(m=(e.min-q)/(t-q)*(m-i)+i,t=e.min);q>=t&&q>e.max&&t<=e.max?(i=(e.max-q)/(t-q)*(m-i)+i,q=e.max):t>=q&&(t>e.max&&q<=e.max)&&(m=(e.max-q)/(t-q)*(m-i)+i,t=e.max);i!=p&&g.lineTo(c.p2c(p),e.p2c(q));g.lineTo(c.p2c(i),e.p2c(q));g.lineTo(c.p2c(m),e.p2c(t));m!=s&&(g.lineTo(c.p2c(m),e.p2c(t)),g.lineTo(c.p2c(s),e.p2c(t)))}}}}0<b&&d(a.datapoints,0,0,a.xaxis,a.yaxis);g.restore()}
function va(a){function d(a,b,c,d,e,f,h,i){for(var o=a.points,a=a.pointsize,m=0;m<o.length;m+=a){var k=o[m],r=o[m+1];null==k||(k<f.min||k>f.max||r<h.min||r>h.max)||(g.beginPath(),k=f.p2c(k),r=h.p2c(r)+d,"circle"==i?g.arc(k,r,b,0,e?Math.PI:2*Math.PI,!1):i(g,k,r,b,e),g.closePath(),c&&(g.fillStyle=c,g.fill()),g.stroke())}}g.save();g.translate(h.left,h.top);var b=a.points.lineWidth,c=a.shadowSize,e=a.points.radius,f=a.points.symbol;0<b&&0<c&&(c/=2,g.lineWidth=c,g.strokeStyle="rgba(0,0,0,0.1)",d(a.datapoints,
e,null,c+c/2,!0,a.xaxis,a.yaxis,f),g.strokeStyle="rgba(0,0,0,0.2)",d(a.datapoints,e,null,c/2,!0,a.xaxis,a.yaxis,f));g.lineWidth=b;g.strokeStyle=a.color;d(a.datapoints,e,V(a.points,a.color),0,!1,a.xaxis,a.yaxis,f);g.restore()}function la(a,d,b,c,e,f,h,g,j,n,k,r){var p,i,q,m;k?(m=i=q=!0,p=!1,k=b,b=d+c,e=d+e,a<k&&(d=a,a=k,k=d,p=!0,i=!1)):(p=i=q=!0,m=!1,k=a+c,a+=e,e=b,b=d,b<e&&(d=b,b=e,e=d,m=!0,q=!1));if(!(a<g.min||k>g.max||b<j.min||e>j.max))if(k<g.min&&(k=g.min,p=!1),a>g.max&&(a=g.max,i=!1),e<j.min&&
(e=j.min,m=!1),b>j.max&&(b=j.max,q=!1),k=g.p2c(k),e=j.p2c(e),a=g.p2c(a),b=j.p2c(b),h&&(n.beginPath(),n.moveTo(k,e),n.lineTo(k,b),n.lineTo(a,b),n.lineTo(a,e),n.fillStyle=h(e,b),n.fill()),0<r&&(p||i||q||m))n.beginPath(),n.moveTo(k,e+f),p?n.lineTo(k,b+f):n.moveTo(k,b+f),q?n.lineTo(a,b+f):n.moveTo(a,b+f),i?n.lineTo(a,e+f):n.moveTo(a,e+f),m?n.lineTo(k,e+f):n.moveTo(k,e+f),n.stroke()}function ua(a){g.save();g.translate(h.left,h.top);g.lineWidth=a.bars.lineWidth;g.strokeStyle=a.color;var d;switch(a.bars.align){case "left":d=
0;break;case "right":d=-a.bars.barWidth;break;case "center":d=-a.bars.barWidth/2;break;default:throw Error("Invalid bar alignment: "+a.bars.align);}var b=a.datapoints,c=d;d+=a.bars.barWidth;for(var e=a.bars.fill?function(b,c){return V(a.bars,a.color,b,c)}:null,f=a.xaxis,l=a.yaxis,k=b.points,b=b.pointsize,j=0;j<k.length;j+=b)null!=k[j]&&la(k[j],k[j+1],k[j+2],c,d,0,e,f,l,g,a.bars.horizontal,a.bars.lineWidth);g.restore()}function V(a,d,b,c){var e=a.fill;if(!e)return null;if(a.fillColor)return ha(a.fillColor,
b,c,d);a=k.color.parse(d);a.a="number"==typeof e?e:0.4;a.normalize();return a.toString()}function ma(a){f.grid.hoverable&&W("plothover",a,function(a){return!1!=a.hoverable})}function na(a){f.grid.hoverable&&W("plothover",a,function(){return!1})}function oa(a){W("plotclick",a,function(a){return!1!=a.clickable})}function W(a,d,b){var c=E.offset(),e=d.pageX-c.left-h.left,g=d.pageY-c.top-h.top,l=aa({left:e,top:g});l.pageX=d.pageX;l.pageY=d.pageY;var d=f.grid.mouseActiveRadius,k=d*d+1,j=null,n,p;for(n=
r.length-1;0<=n;--n)if(b(r[n])){var u=r[n],s=u.xaxis,i=u.yaxis,q=u.datapoints.points,m=u.datapoints.pointsize,t=s.c2p(e),y=i.c2p(g),A=d/s.scale,B=d/i.scale;s.options.inverseTransform&&(A=Number.MAX_VALUE);i.options.inverseTransform&&(B=Number.MAX_VALUE);if(u.lines.show||u.points.show)for(p=0;p<q.length;p+=m){var x=q[p],w=q[p+1];if(null!=x&&!(x-t>A||x-t<-A||w-y>B||w-y<-B))x=Math.abs(s.p2c(x)-e),w=Math.abs(i.p2c(w)-g),w=x*x+w*w,w<k&&(k=w,j=[n,p/m])}if(u.bars.show&&!j){s="left"==u.bars.align?0:-u.bars.barWidth/
2;u=s+u.bars.barWidth;for(p=0;p<q.length;p+=m)if(x=q[p],w=q[p+1],i=q[p+2],null!=x&&(r[n].bars.horizontal?t<=Math.max(i,x)&&t>=Math.min(i,x)&&y>=w+s&&y<=w+u:t>=x+s&&t<=x+u&&y>=Math.min(i,w)&&y<=Math.max(i,w)))j=[n,p/m]}}j?(n=j[0],p=j[1],m=r[n].datapoints.pointsize,b={datapoint:r[n].datapoints.points.slice(p*m,(p+1)*m),dataIndex:p,series:r[n],seriesIndex:n}):b=null;b&&(b.pageX=parseInt(b.series.xaxis.p2c(b.datapoint[0])+c.left+h.left),b.pageY=parseInt(b.series.yaxis.p2c(b.datapoint[1])+c.top+h.top));
if(f.grid.autoHighlight){for(c=0;c<J.length;++c)e=J[c],e.auto==a&&(!b||!(e.series==b.series&&e.point[0]==b.datapoint[0]&&e.point[1]==b.datapoint[1]))&&pa(e.series,e.point);b&&qa(b.series,b.datapoint,a)}z.trigger(a,[l,b])}function S(){var a=f.interaction.redrawOverlayInterval;-1==a?ra():P||(P=setTimeout(ra,a))}function ra(){P=null;y.save();y.clearRect(0,0,B,x);y.translate(h.left,h.top);var a,d;for(a=0;a<J.length;++a)if(d=J[a],d.series.bars.show)wa(d.series,d.point);else{var b=d.series,c=d.point;d=
c[0];var c=c[1],e=b.xaxis,f=b.yaxis;highlightColor="string"===typeof b.highlightColor?b.highlightColor:k.color.parse(b.color).scale("a",0.5).toString();if(!(d<e.min||d>e.max||c<f.min||c>f.max)){var g=b.points.radius+b.points.lineWidth/2;y.lineWidth=g;y.strokeStyle=highlightColor;g*=1.5;d=e.p2c(d);c=f.p2c(c);y.beginPath();"circle"==b.points.symbol?y.arc(d,c,g,0,2*Math.PI,!1):b.points.symbol(y,d,c,g,!1);y.closePath();y.stroke()}}y.restore();H(w.drawOverlay,[y])}function qa(a,d,b){"number"==typeof a&&
(a=r[a]);if("number"==typeof d)var c=a.datapoints.pointsize,d=a.datapoints.points.slice(c*d,c*(d+1));c=sa(a,d);-1==c?(J.push({series:a,point:d,auto:b}),S()):b||(J[c].auto=!1)}function pa(a,d){null==a&&null==d&&(J=[],S());"number"==typeof a&&(a=r[a]);"number"==typeof d&&(d=a.data[d]);var b=sa(a,d);-1!=b&&(J.splice(b,1),S())}function sa(a,d){for(var b=0;b<J.length;++b){var c=J[b];if(c.series==a&&c.point[0]==d[0]&&c.point[1]==d[1])return b}return-1}function wa(a,d){var b="string"===typeof a.highlightColor?
a.highlightColor:k.color.parse(a.color).scale("a",0.5).toString(),c="left"==a.bars.align?0:-a.bars.barWidth/2;y.lineWidth=a.bars.lineWidth;y.strokeStyle=b;la(d[0],d[1],d[2]||0,c,c+a.bars.barWidth,0,function(){return b},a.xaxis,a.yaxis,y,a.bars.horizontal,a.bars.lineWidth)}function ha(a,d,b,c){if("string"==typeof a)return a;for(var d=g.createLinearGradient(0,b,0,d),b=0,e=a.colors.length;b<e;++b){var f=a.colors[b];if("string"!=typeof f){var h=k.color.parse(c);null!=f.brightness&&(h=h.scale("rgb",f.brightness));
null!=f.opacity&&(h.a*=f.opacity);f=h.toString()}d.addColorStop(b/(e-1),f)}return d}var r=[],f={colors:["#edc240","#afd8f8","#cb4b4b","#4da74d","#9440ed"],legend:{show:!0,noColumns:1,labelFormatter:null,labelBoxBorderColor:"#ccc",container:null,position:"ne",margin:5,backgroundColor:null,backgroundOpacity:0.85,sorted:null},xaxis:{show:null,position:"bottom",mode:null,timezone:null,font:null,color:null,tickColor:null,transform:null,inverseTransform:null,min:null,max:null,autoscaleMargin:null,ticks:null,
tickFormatter:null,labelWidth:null,labelHeight:null,reserveSpace:null,tickLength:null,alignTicksWithAxis:null,tickDecimals:null,tickSize:null,minTickSize:null,monthNames:null,timeformat:null,twelveHourClock:!1},yaxis:{autoscaleMargin:0.02,position:"left"},xaxes:[],yaxes:[],series:{points:{show:!1,radius:3,lineWidth:2,fill:!0,fillColor:"#ffffff",symbol:"circle"},lines:{lineWidth:2,fill:!1,fillColor:null,steps:!1},bars:{show:!1,lineWidth:2,barWidth:1,fill:!0,fillColor:null,align:"left",horizontal:!1},
shadowSize:3,highlightColor:null},grid:{show:!0,aboveData:!1,color:"#545454",backgroundColor:null,borderColor:null,tickColor:null,margin:0,labelMargin:5,axisMargin:8,borderWidth:2,minBorderMargin:null,markings:null,markingsColor:"#f4f4f4",markingsLineWidth:2,clickable:!1,hoverable:!1,autoHighlight:!0,mouseActiveRadius:10},interaction:{redrawOverlayInterval:1E3/60},hooks:{}},N=null,O=null,E=null,g=null,y=null,A=[],D=[],h={left:0,right:0,top:0,bottom:0},B=0,x=0,L=0,I=0,w={processOptions:[],processRawData:[],
processDatapoints:[],processOffset:[],drawBackground:[],drawSeries:[],draw:[],bindEvents:[],drawOverlay:[],shutdown:[]},p=this;p.setData=$;p.setupGrid=fa;p.draw=ga;p.getPlaceholder=function(){return z};p.getCanvas=function(){return N};p.getPlotOffset=function(){return h};p.width=function(){return L};p.height=function(){return I};p.offset=function(){var a=E.offset();a.left+=h.left;a.top+=h.top;return a};p.getData=function(){return r};p.getAxes=function(){var a={};k.each(A.concat(D),function(d,b){b&&
(a[b.direction+(1!=b.n?b.n:"")+"axis"]=b)});return a};p.getXAxes=function(){return A};p.getYAxes=function(){return D};p.c2p=aa;p.p2c=function(a){var d={},b,c,e;for(b=0;b<A.length;++b)if((c=A[b])&&c.used)if(e="x"+c.n,null==a[e]&&1==c.n&&(e="x"),null!=a[e]){d.left=c.p2c(a[e]);break}for(b=0;b<D.length;++b)if((c=D[b])&&c.used)if(e="y"+c.n,null==a[e]&&1==c.n&&(e="y"),null!=a[e]){d.top=c.p2c(a[e]);break}return d};p.getOptions=function(){return f};p.highlight=qa;p.unhighlight=pa;p.triggerRedrawOverlay=S;
p.pointOffset=function(a){return{left:parseInt(A[R(a,"x")-1].p2c(+a.x)+h.left),top:parseInt(D[R(a,"y")-1].p2c(+a.y)+h.top)}};p.shutdown=function(){P&&clearTimeout(P);E.unbind("mousemove",ma);E.unbind("mouseleave",na);E.unbind("click",oa);H(w.shutdown,[E])};p.resize=function(){da();ea(N);ea(O)};p.hooks=w;for(var X=0;X<Z.length;++X){var Y=Z[X];Y.init(p);Y.options&&k.extend(!0,f,Y.options)}k.extend(!0,f,s);null==f.xaxis.color&&(f.xaxis.color=f.grid.color);null==f.yaxis.color&&(f.yaxis.color=f.grid.color);
null==f.xaxis.tickColor&&(f.xaxis.tickColor=f.grid.tickColor);null==f.yaxis.tickColor&&(f.yaxis.tickColor=f.grid.tickColor);null==f.grid.borderColor&&(f.grid.borderColor=f.grid.color);null==f.grid.tickColor&&(f.grid.tickColor=k.color.parse(f.grid.color).scale("a",0.22).toString());for(s=0;s<Math.max(1,f.xaxes.length);++s)f.xaxes[s]=k.extend(!0,{},f.xaxis,f.xaxes[s]);for(s=0;s<Math.max(1,f.yaxes.length);++s)f.yaxes[s]=k.extend(!0,{},f.yaxis,f.yaxes[s]);f.xaxis.noTicks&&null==f.xaxis.ticks&&(f.xaxis.ticks=
f.xaxis.noTicks);f.yaxis.noTicks&&null==f.yaxis.ticks&&(f.yaxis.ticks=f.yaxis.noTicks);f.x2axis&&(f.xaxes[1]=k.extend(!0,{},f.xaxis,f.x2axis),f.xaxes[1].position="top");f.y2axis&&(f.yaxes[1]=k.extend(!0,{},f.yaxis,f.y2axis),f.yaxes[1].position="right");f.grid.coloredAreas&&(f.grid.markings=f.grid.coloredAreas);f.grid.coloredAreasColor&&(f.grid.markingsColor=f.grid.coloredAreasColor);f.lines&&k.extend(!0,f.series.lines,f.lines);f.points&&k.extend(!0,f.series.points,f.points);f.bars&&k.extend(!0,f.series.bars,
f.bars);null!=f.shadowSize&&(f.series.shadowSize=f.shadowSize);null!=f.highlightColor&&(f.series.highlightColor=f.highlightColor);for(s=0;s<f.xaxes.length;++s)Q(A,s+1).options=f.xaxes[s];for(s=0;s<f.yaxes.length;++s)Q(D,s+1).options=f.yaxes[s];for(var G in w)f.hooks[G]&&f.hooks[G].length&&(w[G]=w[G].concat(f.hooks[G]));H(w.processOptions,[f]);G=z.children("canvas.flot-base");s=z.children("canvas.flot-overlay");0==G.length||0==s?(z.html(""),z.css({padding:0}),"static"==z.css("position")&&z.css("position",
"relative"),da(),N=ca(!0,"flot-base"),O=ca(!1,"flot-overlay"),G=!1):(N=G.get(0),O=s.get(0),G=!0);g=N.getContext("2d");y=O.getContext("2d");E=k(O);G&&(z.data("plot").shutdown(),p.resize(),y.clearRect(0,0,B,x),E.unbind(),z.children().not([N,O]).remove());z.data("plot",p);$(U);fa();ga();f.grid.hoverable&&(E.mousemove(ma),E.mouseleave(na));f.grid.clickable&&E.click(oa);H(w.bindEvents,[E]);var J=[],P=null}k.plot=function(z,U,s){return new T(k(z),U,s,k.plot.plugins)};k.plot.version="0.7";k.plot.plugins=
[]})(jQuery);
(function() {
  this.SpeedGraph = (function() {
    function SpeedGraph(api, element, options) {
      this.api = api;
      this.element = element;
      this.options = options;
    }

    SpeedGraph.prototype.load = function(track) {
      var highest, wind;

      highest = 0;
      wind = [];
      this.data = track.map(function(point) {
        if (point.sog > highest) {
          highest = point.sog + .1;
        }
        if (point.wind_speed > highest) {
          highest = point.wind_speed + .1;
        }
        wind.push([point.time.getTime(), point.wind_speed]);
        return [point.time.getTime(), point.sog];
      });
      this.wind_bg = {
        data: wind.slice(0, wind.length),
        color: '#CCC',
        lines: {
          show: true,
          fill: true,
          fillColor: '#CCC'
        },
        shadowSize: 0
      };
      this.pre = {
        data: this.data.slice(0, this.data.length),
        color: this.options.colour,
        lines: {
          show: true,
          fill: true,
          fillColor: this.options.colour
        },
        shadowSize: 0
      };
      this.post = {
        data: [],
        color: '#999',
        lines: {
          show: true,
          fill: true,
          fillColor: '#999'
        },
        shadowSize: 0
      };
      this.wind_line = {
        data: wind.slice(0, wind.length),
        color: '#666',
        lines: {
          show: true,
          fill: false,
          fillColor: '#666'
        },
        shadowSize: 0
      };
      return this.plot = this.api(this.element, [this.wind_bg, this.pre, this.post, this.wind_line], {
        xaxis: {
          show: false
        },
        yaxis: {
          show: false,
          min: 0,
          max: Math.ceil(highest)
        },
        grid: {
          show: false
        }
      });
    };

    SpeedGraph.prototype.set = function(point) {
      this.pre.data = this.data.slice(0, point);
      this.post.data = this.data.slice(point, this.data.length);
      this.plot.setData([this.wind_bg, this.pre, this.post, this.wind_line]);
      return this.plot.draw();
    };

    return SpeedGraph;

  })();

}).call(this);
(function() {
  var Display;

  Display = (function() {
    function Display(course, map, mark_klass) {
      var uniques,
        _this = this;

      this.course = course;
      this.map = map;
      if (mark_klass == null) {
        mark_klass = CourseDisplay.Mark;
      }
      uniques = {};
      this.marks = this.course.marks.map(function(mark) {
        var key;

        key = mark.lat + '_' + mark.lng;
        if (!uniques[key]) {
          uniques[key] = new mark_klass(mark, _this.map);
          uniques[key];
        }
        return uniques[key];
      });
    }

    Display.prototype.update = function() {
      var _this = this;

      this.line.setPath([]);
      return this.marks.forEach(function(mark) {
        return _this.line.getPath().push(mark.position());
      });
    };

    Display.prototype.load = function(track) {
      this.course.load(track);
      this.line = this.map.line({
        strokeColor: 'rgba(0,0,0,0.2)',
        zIndex: -1
      });
      return this.update();
    };

    Display.prototype.set = function(index) {
      var next_mark;

      next_mark = this.course.next_mark_at(index);
      return this.marks.forEach(function(mark) {
        if (mark.actual === next_mark) {
          return mark.active_icon();
        } else {
          return mark.default_icon();
        }
      });
    };

    return Display;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).CourseDisplay = Display;

}).call(this);
(function() {
  var Mark, _base;

  Mark = (function() {
    var Titleise;

    Titleise = function(lat, lng) {
      return "Port hand mark at " + (lat.toFixed(3)) + "," + (lng.toFixed(3));
    };

    function Mark(actual, map_api) {
      this.actual = actual;
      this.map_api = map_api;
      this.ui = this.map_api.mark(this.actual.lat, this.actual.lng, {
        title: Titleise(this.actual.lat, this.actual.lng)
      });
    }

    Mark.prototype.default_icon = function() {
      return this.ui.setIcon(this.map_api.icon('/images/p_mrk_s.png', {
        anchor: [5, 6]
      }));
    };

    Mark.prototype.active_icon = function() {
      return this.ui.setIcon(this.map_api.icon('/images/p_mrk_s_a.png', {
        anchor: [5, 6]
      }));
    };

    Mark.prototype.position = function() {
      return this.ui.getPosition();
    };

    Mark.prototype.make_editable = function() {
      return this.ui.setDraggable(true);
    };

    Mark.prototype.make_fixed = function() {
      return this.ui.setDraggable(false);
    };

    return Mark;

  })();

  (_base = typeof exports !== "undefined" && exports !== null ? exports : this).CourseDisplay || (_base.CourseDisplay = {});

  (typeof exports !== "undefined" && exports !== null ? exports : this).CourseDisplay.Mark = Mark;

}).call(this);
(function() {
  var Editable, _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Editable = (function() {
    function Editable(display, mark_klass) {
      var map,
        _this = this;

      this.display = display;
      this.mark_klass = mark_klass != null ? mark_klass : CourseDisplay.Mark;
      this.edit_mark = __bind(this.edit_mark, this);
      map = this.display.map;
      map.on('click', null, function(position) {
        var created_mark;

        created_mark = new _this.mark_klass(position, map);
        _this.edit_mark(created_mark, map);
        _this.display.marks.push(created_mark);
        return _this.display.update();
      });
      this.display.marks.forEach(function(mark) {
        return _this.edit_mark(mark, _this.display.map);
      });
    }

    Editable.prototype.edit_mark = function(mark, map) {
      mark.make_editable();
      map.on('click', mark, this.click_mark(this.display, mark));
      return map.on('drag', mark, this.drag_mark(this.display));
    };

    Editable.prototype.drag_mark = function(display) {
      return function() {
        return display.update();
      };
    };

    Editable.prototype.click_mark = function(display, mark) {
      return function() {
        display.marks.push(mark);
        return display.update();
      };
    };

    Editable.prototype.load = function(track) {
      return this.display.load(track);
    };

    Editable.prototype.set = function(index) {
      return this.display.set(index);
    };

    return Editable;

  })();

  (_base = typeof exports !== "undefined" && exports !== null ? exports : this).CourseDisplay || (_base.CourseDisplay = {});

  (typeof exports !== "undefined" && exports !== null ? exports : this).CourseDisplay.Editable = Editable;

}).call(this);
(function() {
  var TrackPlayer;

  TrackPlayer = (function() {
    function TrackPlayer(points, output, colour, calc) {
      var _this = this;

      this.output = output;
      if (colour == null) {
        colour = 'blue';
      }
      this.calc = calc != null ? calc : DistanceBetween;
      this.last_point = void 0;
      this.points = points.map(function(point) {
        var distance;

        distance = _this.last_point ? (new _this.calc(_this.last_point, {
          lat: point.coords[0],
          lng: point.coords[1]
        })).to_nm() : 0;
        return _this.last_point = {
          time: new Date(point.time),
          lat: point.coords[0],
          lng: point.coords[1],
          cog: point.course[0],
          sog: point.course[1],
          distance_since_last: distance,
          wind_speed: point.wind_speed,
          wind_bearing: point.wind_bearing
        };
      });
      this.output.forEach(function(out) {
        return out.load(_this.points, {
          colour: colour
        });
      });
    }

    TrackPlayer.prototype.start_time = function() {
      return this.points[0].time;
    };

    TrackPlayer.prototype.finish_time = function() {
      return this.points[this.points.length - 1].time;
    };

    TrackPlayer.prototype.total_time = function() {
      return (this.finish_time() - this.start_time()) / 1000;
    };

    TrackPlayer.prototype.total_distance = function() {
      var total, track, _i, _len, _ref;

      total = 0;
      _ref = this.points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        track = _ref[_i];
        total += track.distance_since_last;
      }
      return total;
    };

    TrackPlayer.prototype.average_speed = function() {
      return this.total_distance() / (this.total_time() / 60 / 60);
    };

    TrackPlayer.prototype.set_to = function(timecode) {
      var index, segment, time, track, _i, _len, _ref;

      time = timecode.time_from(this.start_time());
      segment = 0;
      _ref = this.points;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        track = _ref[index];
        if (track.time > time) {
          break;
        } else {
          segment = index;
        }
      }
      return this.output.map(function(out) {
        return out.set(segment + 1);
      });
    };

    return TrackPlayer;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).TrackPlayer = TrackPlayer;

}).call(this);


















