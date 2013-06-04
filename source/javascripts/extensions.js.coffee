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
      time = track.start_time() if time.getTime() < track.start_time().getTime()
    time

  finish_time: ->
    time = @tracks[0].finish_time()
    for track in @tracks
      time = track.finish_time() if time.getTime() > track.finish_time().getTime()
    time

  total_distance: ->
    distance = @tracks[0].total_distance()
    for track in @tracks
      distance = track.total_distance() if distance > track.total_distance()
    distance

  total_time: ->
    (this.finish_time() - this.start_time())/1000

  average_speed: ->
    this.total_distance() / (this.total_time() / 60 / 60)

  set_to: (timecode) ->
    for track in @tracks
      track.set_to timecode

  push: (track) ->
    @tracks.push track

(exports ? this).CombinedPlayer = CombinedPlayer

class DeferredControls extends Controls
  constructor: (@player,@display,@count,@time_code=TimeCode) ->
    @i = 0

  loaded: ->
    @i++
    if @i >= @count
      @start = @player.start_time( ).getTime()
      @max   = @player.finish_time().getTime() - @start

(exports ? this).DeferredControls = DeferredControls
