tracks = controls = map = undefined

@load_regatta = (id,race,$) ->
  colours = ['blue','coral','darkorchid','crimson','cyan','darkgreen','cadetblue','darkmagenta']
  $('.mod-event-stats ul li').remove()
  $.ajax 'https://tacktical-regatta.herokuapp.com/regattas/'+id+'/'+race,
    accepts: 'application/json',
    success: (regatta) ->
      track = tp = colour = row = undefined
      tracks = new CombinedPlayer()
      controls = new DeferredControls(tracks, new Display(), regatta.tracks.length)
      map = new Map(document.getElementById('map'))
      map.center lat: regatta.position[0], lng: regatta.position[1]

      if regatta.tracks.length == 0
        $('.mod-event-stats ul').append('<li class="info"><h3>No competitors yet...</h3></li>')
      else
        $('.mod-event-stats ul').append('<li class="info" data-remaining='+regatta.tracks.length+'><h3>Loading '+regatta.tracks.length+' competitors...</li>')

      for track, i in regatta.tracks
        $('.mod-event-stats ul').append(
          '<li id="track_'+i+'">'+
            '<h2>'+
              '<span class="stats"></span>'+
            '</h2>'+
            '<span class="graph"></span>'+
          '</li>'
        )

        $.ajax("https://tacktical-api.herokuapp.com/graphql?query=#{track.query}",
          accepts: 'application/json',
          headers: { Authorization: "Bearer #{track.jwt}" },
          success: ((index,link) ->
            (response) ->
              track = response.data.track
              info = $('.mod-event-stats .info')
              remaining = info.data('remaining')

              if (remaining > 1)
                remaining--;
                info.data('remaining',remaining)
                info.text('Loading '+remaining+' competitors...')
              else
                info.remove()

              colour = colours.shift()
              row = $('.mod-event-stats ul li#track_'+index)
              tp  = new TrackPlayer(track.positions,
                [
                  map,
                  new TrackStatistics(row.find('.stats')),
                  new SpeedGraph($.plot,row.find('.graph'),{ colour: colour })
                ], colour )
              tp.set_to(new TimeCode(tp.finish_time().getTime() - tp.start_time().getTime()))
              row.css('color',colour)
              tracks.push(tp)
              controls.loaded()
              source = new EventSource('https://tacktical-live.herokuapp.com/events/'+track.id)
              source.onmessage = (event) ->
                data = JSON.parse event.data
                if data.positions?
                  positions = data.positions.sort((a,b) -> a.time - b.time )
                  positions.forEach (point) ->
                    tp.add_point point unless point.time in tp.points.map( (point) -> point.time )
                  for track in tracks
                    tp.extend track
                    track.extend tp
                  controls.loaded()
          )(i,track.link)
        )

      slider document.getElementById('playback'), ((event) -> controls.skip(event) )
      controls.end()
      $('#play').click(-> controls.play() )
