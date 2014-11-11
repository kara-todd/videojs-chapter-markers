/*! videojs-chapters - v0.0.0 - 2014-6-29
 * Copyright (c) 2014 Kara Todd
 * Licensed under the Apache-2.0 license. */
(function(window, videojs) {
  'use strict';

  var defaults = {
        option: true
      },
      chapters;

  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  chapters = function(options) {
    var settings = videojs.util.mergeOptions(defaults, options),
        player = this,
        tracks = player.textTracks(),
        i = 0,
        duration = 0,
        track, chaptersTrack, 
        cue, cues, 
        markup = '',
        trackLoaded = false;

    // Find chapters track
    for (;i<tracks.length;i++) {
      track = tracks[i];
      if (track.kind() === 'chapters') {
        chaptersTrack = track;
        break;
      }
    }

    // Set player duration.
    player.on("loadedmetadata", function () {
      duration = player.duration();
      createTracks(cues, duration);
    });
    
    // On load add tracks markers to timeline.
    chaptersTrack.on('loaded', function() {
        cues = chaptersTrack.cues();
        createTracks(cues, duration);
    });


    function createTracks(cues, duration) 
    {
      if (typeof cues === 'undefined' || duration === 0) return false;

      var position = 0,
          controlBar = player.controlBar.contentEl(),
          markers, data;

      for(i = 0; i < cues.length; i++)
      {
        cue = cues[i];
        position = parseInt((cue.startTime / duration) * 1000) / 10;

        markup += '<div class="vjs-chapter-marker vjs-chpater-marker-' + cue.index + '" style="left:' + position + '%;" data-timemark="' + cue.startTime + '">';
        markup += (cue.text !== '') ? '  <div class="vjs-chapter-marker-title">' + cue.text + '</div>' : '';
        markup += '</div>';
      }

      controlBar.querySelector('.vjs-progress-control').appendChild(player.createEl('div', {
        className: 'vjs-chapter-markers-bar',
        innerHTML: markup,
        tabindex: -1
      }));

      markers = controlBar.querySelectorAll('.vjs-chapter-marker');

      for (i = markers.length - 1; i >= 0; i--) {
        markers[i].addEventListener('click', function() {
            data = this.dataset;
            player.currentTime(data.timemark);
        }, false);
      }
    }
  };

  // register the plugin
  videojs.plugin('chapters', chapters);
})(window, window.videojs);
