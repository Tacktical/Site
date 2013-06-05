class TrackStatistics

  StatsDisplay = (heading,speed,latlng) ->
    "<span class='heading'>  #{ heading }&deg;</span>"+
    "<span class='speed'>    #{ speed   }knts</span>"

  constructor: (@display,@format=StatsDisplay,@latlng=LatitudeLongitude) ->

  load: (@track) ->

  set: (index) ->
    current = @track[index-1]
    heading = if current.cog && current.cog >= 0 then (current.cog).toFixed(1)              else '---.-'
    speed   = if current.sog && current.sog >= 0 then (current.sog * 1.94384449).toFixed(1) else '--.-'
    @display.html @format heading, speed, new @latlng current.lat, current.lng

(exports ? this).TrackStatistics = TrackStatistics

class CombinedPlayer

  constructor: () ->
    @tracks = []

  start_time: ->
    time = @tracks[0].start_time()
    for track in @tracks
      time = track.start_time() if time.getTime() > track.start_time().getTime()
    time

  finish_time: ->
    time = @tracks[0].finish_time()
    for track in @tracks
      time = track.finish_time() if time.getTime() < track.finish_time().getTime()
    time

  set_to: (timecode) ->
    if @tracks.length > 0
      origin = @start_time().getTime()
      $('#progress_bar .bar').width( (timecode.progress(@finish_time().getTime()-origin)*100)+'%' )
      for track in @tracks
        tc = new TimeCode( timecode.timecode - (track.start_time().getTime() - origin) )
        track.set_to tc

  push: (track) ->
    @tracks.push track

(exports ? this).CombinedPlayer = CombinedPlayer

class DeferredControls extends Controls
  constructor: (@player,@display,@count,@time_code=TimeCode) ->
    @current = new @time_code

  loaded: ->
    @start = @player.start_time().getTime()
    @max   = @player.finish_time().getTime() - @start
    @current = new @time_code @max
    @player.set_to @current

(exports ? this).DeferredControls = DeferredControls
