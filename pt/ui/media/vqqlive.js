
goog.provide('pt.ui.media.VqqLive');

goog.require('goog.ui.media.MediaModel');
goog.require('goog.ui.media.MediaModelRenderer');
goog.require('goog.ui.Component.State');
goog.require('goog.net.jsloader');

goog.scope(function() {

  var _ = pt.ui.media;

  var MediaModel = goog.ui.media.MediaModel;
  var MediaModelRenderer = goog.ui.media.MediaModelRenderer;

  /**
   * @constructor
   */
  _.VqqLive = function() {
    _.VqqLive.base(this, 'constructor');
  };
  goog.inherits(_.VqqLive, MediaModelRenderer);
  goog.addSingletonGetter(_.VqqLive);

  _.VqqLive.newControl = function(vqqLiveModel, opt_domHelper) {
    var control = new goog.ui.media.Media(
      vqqLiveModel,
      _.VqqLive.getInstance(),
      opt_domHelper);
    control.setStateInternal(goog.ui.Component.State.ACTIVE);
    return control;
  };

  /**
   * @type {string}
   */
  _.VqqLive.CSS_CLASS = goog.getCssName('pt-ui-media-vqqlive');

  /**
   * @param {goog.ui.Control} c The media control.
   * @param {goog.ui.Component.State} state The state to be set or cleared.
   * @param {boolean} enable Whether the state is enabled or disabled.
   * @override
   */
  _.VqqLive.prototype.setState = function(c, state, enable) {
    var control = /** @type {goog.ui.media.Media} */ (c);
    _.VqqLive.base(this. 'setState', control, state, enable);

    // control.createDom has to be called before any state is set.
    // Use control.setStateInternal if you need to set states
    if (!control.getElement()) {
      throw Error(goog.ui.Component.Error.STATE_INVALID);
    }

    var domHelper = control.getDomHelper();
    var dataModel =
      /** @type {goog.ui.media.YoutubeModel} */ (control.getDataModel());

  if (!!(state & goog.ui.Component.State.SELECTED) && enable) {
    var flashEls = domHelper.getElementsByTagNameAndClass(
        'div',
        goog.ui.media.FlashObject.CSS_CLASS,
        control.getElement());
    if (flashEls.length > 0) {
      return;
    }
  }
};
  
  /**
   * @constructor
   * @extends {goog.ui.media.MediaModel}
   * @final
   */
  _.VqqLiveModel = function(channelId, opt_caption, opt_description) {
    _.VqqLiveModel.base(
      this, 
      _.VqqLiveModel.buildUrl(channelId),
      opt_caption,
      opt_description,
      MediaModel.MimeType.FLASH);

    /**
     * @type {string}
     */
    this.channelId_ = channelId;

  };
  goog.inherits(_.VqqLiveModel, MediaModel);

  /**
   * @type {RegExp}
   * @private
   * @const
   */
  _.VqqLiveModel.MATCHER_ = /cnlid=([^=&'"]?)/;

  /**
   * @param {string} liveCode Vqq live html code.
   * @param {string=} opt_caption An optional caption of the live.
   * @param {string=} opt_description An optional description of the live.
   * @return {!pt.ui.media.VqqLiveModel} 
   * @throws Error in case the parsing fails.
   */
  _.VqqLiveModel.newInstance = function(liveCode, 
      opt_caption, opt_description) {
    var matcher = _.VqqLiveModel.MATCHER_.exec(liveCode);
    if (matcher) {
      var channelId = matcher[1];
      return new _.VqqLiveModel(channelId, opt_caption, opt_description);
    }
    throw Error('failed to parse channel id from vqq live code: ' + liveCode);
  };

  /**
   * @return {string}
   */
  _.VqqLiveModel.prototype.getChannelId = function() {
    return this.channelId_;
  };


});
