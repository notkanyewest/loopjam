define([
  'text!templates/TrackInfoViewTemplate.html'
], function(template){
  var TrackInfoView = Backbone.View.extend({

    template: Handlebars.compile(template),

    initialize: function() {

      this.model.on('modalShowWaiting', this.modalShowWaiting, this)
      this.model.on('modalShowShare', this.modalShowShare, this)
      this.model.on('enableSave', this.enableSave, this);
      this.model.on('disableSave', this.disableSave, this);
    },

    events: {
      'click .playMet': 'playMetronome',
      'click .visualizer': 'activateVisualiser',
      'click .saveTrackBtn': 'saveTrackModel',

    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));

      var port = this.model.get('port');
      var tempo = this.model.get('tempo') || 120;

      $(this.el).find('#slider-vertical' + port).slider({
        orientation: "vertical",
        range: "min",
        min: 30,
        max: 180,
        value: tempo,
        slide: function( event, ui ) {
          $( "#amount" + port ).val( ui.value );
          this.model.changeTempo(ui.value, this.model.get('context').currentTime);
        }.bind(this)
      });


      this.$el.find( "#amount" + port ).val( tempo );

      // this.delegateEvents();

      return this;
    },

    playMetronome: function() {
      var metronomePlaying = this.model.get('metronomePlaying');

      if (!metronomePlaying) {
        this.model.set('metronomePlaying', !metronomePlaying);
      } else {
        this.model.set('metronomePlaying', !metronomePlaying);
      }

      console.log('tempo changed: ', this.model.get('tempo'));
    },

    activateVisualiser: function() {
      var visualiserOn = this.model.get('visualiserOn');
      if (!visualiserOn) {
        this.model.set('visualiserOn', !visualiserOn);
      } else {
        this.model.set('visualiserOn', !visualiserOn);
      }
    },

    saveTrackModel: function(){
      // POST request to server
      var trackName = this.$el.find('.trackName').val();
      this.model.saveTrack(trackName);
    },

    modalShowWaiting: function(){
      var savingAnimation ='<h5 style="text-align:center">Saving...</h5>\
      <div class="loader" title="0"> \
        <svg version="1.1" id="loader-1" style="  margin-top: -33px;  margin-left: 166px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" \
         width="150px" height="150px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"> \
        <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 \
          s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 \
          c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/> \
        <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 \
          C22.32,8.481,24.301,9.057,26.013,10.047z"> \
          <animateTransform attributeType="xml" \
            attributeName="transform" \
            type="rotate" \
            from="0 20 20" \
            to="360 20 20" \
            dur="0.5s" \
            repeatCount="indefinite"/> \
          </path> \
        </svg> \
      </div>'
      $(this.el).find('.saved-body').html(savingAnimation);
    },
    modalShowShare: function(){
      var hashURL = this.model.get('hashURL');
      var trackName = this.model.get('trackName');
      var modalTitle = '<i class="fa fa-save"></i> Save Complete'
      var modalBody = '<h5> Share your track</h5><p>' +'<div class="fb-share-button"><a href="https://www.facebook.com/sharer/sharer.php?u=http://www.loopjam.in/%23/tracks/' + hashURL + '" target=_blank><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-facebook fa-stack-1x"></i></span><a></div> ' + '<div class="twitter-share-button"><a href="https://twitter.com/share?url=http://www.loopjam.in/%23/tracks/' +  hashURL + '&text=Check out a track I recorded at Loopjam.in: " target=_blank><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-twitter fa-stack-1x"></i></span><a></div><div style="display: inline-block" class="reddit-share-button"><a target="_blank" href="http://www.reddit.com/r/loopjam/submit?url=loopjam.in/%23/tracks/' +  hashURL  +'&title=' + trackName  + '"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-reddit fa-stack-1x"></i></span></a></div> '  + '</p> <a target="_blank" href="http://www.loopjam.in/#/tracks/' + hashURL + '" class="trackURL">URL: loopjam.in/#/tracks/' + hashURL + '</a>';
      var modalFooter = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
      $(this.el).find('.saved-title').html(modalTitle);
      $(this.el).find('.saved-body').html(modalBody);
      $(this.el).find('.saved-footer').html(modalFooter);
    },

    disableSave: function() {
      this.$el.find('.btn-save').attr('disabled', true).removeClass('ani-shake');
    },

    enableSave: function() {
      this.$el.find('.btn-save').attr('disabled', false).addClass('ani-shake');
    }
  });

  return TrackInfoView;


});