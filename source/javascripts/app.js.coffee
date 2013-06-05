@load_regatta = (id,race,$) ->
  colours = ['blue','coral','darkorchid','crimson','cyan','darkgreen','cadetblue','darkmagenta']
  tracks = controls = map = undefined
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
        $('.mod-event-stats ul').append('<li class="info" data-remaining='+regatta.tracks.length+'>Loading '+regatta.tracks.length+' competitors...</li>')

      for track, i in regatta.tracks
        $('.mod-event-stats ul').append(
          '<li id="track_'+i+'">'+
            '<h2>'+
              '<span class="stats"></span>'+
            '</h2>'+
            '<span class="graph"></span>'+
          '</li>'
        )

        $.ajax('https://tacktical-plot.herokuapp.com'+track.link,
          accepts: 'application/json',
          headers: { Authorization: track.signature[0], 'X-HMAC-Nonce': track.signature[1], 'X-HMAC-Date': track.signature[2] },
          success: ((index) ->
            (track) ->
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
          )(i)
        )

      slider document.getElementById('playback'), ((event) -> controls.skip(event) )
      controls.end()
      $('#play').click(-> controls.play() )
