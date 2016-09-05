(function ($$1) {
'use strict';

$$1 = 'default' in $$1 ? $$1['default'] : $$1;

// import 'public-source/js/addins/jquery/placeholder';

const supportsPlaceholder = 'placeholder' in document.createElement('input');

function placeholder($context = document) {
  if(supportsPlaceholder) { return; }
  $$1('[placeholder]', $context).placeHolder();
}

function releasePlaceholder($form) {
  if(supportsPlaceholder) { return; }
  $$1($form).find('[placeholder]').each((i, $input) => {
    $input = $$1($input);
    if($input.val() === $input.attr('placeholder')) { $input.val(''); }
  });
}

function isFunction$1(func) {
  return typeof func === 'function';
}

// TODO: Use vanillajs-helpers or lodash for this

function isNumber(num) {
  return typeof num === 'number' && isFinite(num);
}

let $msg;
let $text;
let hideTo;
function hideMsg() {
  return new Promise((resolve, reject) => {
    if(!$msg) { return resolve($msg); }
    $msg.fadeOut('fast', () => resolve($msg));
  });
}

function displayMsg(msg, msgClass, delay, redirectUrl) {
  clearTimeout(hideTo);

  if(!$msg) {
    $text = $$1('<div class="display-msg-text"></div>');
    $msg = $$1(`
      <div id='display-msg' class='alert'>
        <div class='display-msg-icon'>
          <i class='glyphicons'></i>
        </div>
      </div>
    `)
    .appendTo('body')
    .click(() => hideMsg())
    .append($text);
  }

  $text.html(String(msg));

  $msg[0].className = 'alert';
  $msg.addClass(msgClass).fadeIn('fast');

  if(delay >= 0) {
    hideTo = setTimeout(() => {
      hideMsg();
      if(redirectUrl) { document.location.href = redirectUrl; }
    }, delay);
  }
}

function displayInfo(msg, delay = 3000) {
  displayMsg(msg, 'alert-info', delay);
}

function displayError$1(msg, delay) {
  displayMsg(msg, 'alert-danger', delay);
}

function stringToJSON(str) {
	try { return str ? JSON.parse(str) : null; } catch(e) { return null; }
}

function path(...paths) {
  return paths.join('/').replace(/\/+/g, '/');
}

// TODO: Improve the url building, to use a '__clientName' variable instead (unless the webUrls are set)

let rootUrl = __webUrl;
let uploadUrl = __webUrlUpload;
let nodeUrl = __webUrlNodeJs;

const hasClient = typeof __clientName !== 'undefined'
const protocol = location.protocol;

function cleanUrl(url) { return url.replace(/(^https?:\/\/|\/$)/, ''); }

if(!rootUrl) {
  const ext = location.hostname.match(/yoomap.(\w+)^/);
  rootUrl = ext && hasClient ? `${__clientName}.yoomap.${ext[1]}` : location.hostname;
  if(typeof __webPath !== 'undefined') { rootUrl = `${rootUrl}/${__webPath}`; }
} else {
  rootUrl = cleanUrl(rootUrl);
}

if(!uploadUrl) {
  const uploadpath = typeof __webPathUpload !== 'undefined' ? __webPathUpload : `/uploads/_${hasClient ? `_${__clientName}` : '_default'}`;
  uploadUrl = path(rootUrl, uploadpath);
} else {
  uploadUrl = cleanUrl(uploadUrl);
}

nodeUrl = nodeUrl ? cleanUrl(nodeUrl) : `${rootUrl}:8080`;

function rootURL(...paths) {
  return `${protocol}//${path(rootUrl, ...paths)}`;
}

function rootUploadURL(...paths) {
  return `${protocol}//${path(uploadUrl, ...paths)}`;
}

function nodeURL() {
  return `${protocol}//${path(nodeUrl)}`;
}

// FIXME: The options part is a bit hacky. Should be updated, to replace 'data' (and possibly waitMess)

function execQuery(q, data = {}, waitMess = 'Chargement ...', options = {}) {
  let req = new Promise((resolve, reject) => {
    $$1.post($$1.extend({
      type: 'POST',
      url: rootURL(`/query?q=${q}`),
      processData: true,
      dataType: 'json'
    }, options, {
      data,
      success(json) {
        if(json.type === 'error' || json.errors.length) { return reject(json); }
        resolve(json);
      },
      error(jqXHR, textStatus, errorThrown) { reject(errorThrown); }
    }));
  });

  if(waitMess) {
    displayInfo(waitMess);

    req = req
      .then((json) => hideMsg().then(() => json))
      .catch((err) => hideMsg().then(() => { throw err; }));
  }

  return req
    .catch((err) => {
      displayError$1(err.msg ? err.msg : err);
      throw err;
    });
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

function interopDefault(ex) {
	return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var utf8 = createCommonjsModule(function (module, exports) {
/*! https://mths.be/utf8js v2.0.0 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			checkScalarValue(codePoint);
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			var byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				checkScalarValue(codePoint);
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.0.0',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(commonjsGlobal));
});

var utf8$1 = interopDefault(utf8);

function base64Decode(data) {
  return data ? utf8$1.decode(window.atob(data)) : '';
}

// import './jquery-bundles/tooltip-popover';

function tooltip(elm = 'body', config = {}) {
  config = $$1.extend({
    selector: '[data-toggle=tooltip]',
    container: 'body'
  }, config);

  $$1(elm).tooltip(config);
}

function hideTooltip($elm) {
  $$1($elm).tooltip('hide');
}

function removeTooltip($elm) {
  $$1($elm).tooltip('destroy');
}

function displaySuccess$1(msg, delay = 3000) {
  displayMsg(msg, 'alert-success', delay);
}

function formModyfied($elm) {
  const $modal = $$1($elm).parents('.modal-window');
  $$1('.modal-window-modif', $modal.length ? $modal : 'body').val('1');
}

window.formModyfied = formModyfied;

function getModalWindow$1(elt) {
  if((typeof(elt) == "string") || (typeof(elt) == "number")) {
    if($$1(".modal-window").find("input[value=\"" + String(elt) + "\"].modal-window-uid").length > 0)
      return $$1(".modal-window").find("input[value=\"" + String(elt) + "\"]").parents(".modal-window");
  } else {
    if($$1(elt).hasClass("modal-window-button")) {
      return getModalWindow$1($$1(elt).find(".modal-window-button-uid").val());
    } else {
      return $$1(elt).hasClass("modal-window") ? $$1(elt) : $$1(elt).parents(".modal-window");
    }
  }

  return null;
}

function closeKeywordHoverContainer() {
  if($(document).find("body .keyword-hover-container").length > 0) {
    $(document).find("body .keyword-hover-container").hide();
    $(document).find("body .keyword-hover-container .content").html("<center>Chargement</center>");
  }
}

let timerKeywordHover = null;
var flagKeywordContainer = false;

function getKeywordHover(elt) {

  var keyword = $$1(elt).html();

  if($$1(document).find("body .keyword-hover-container").length <= 0)
    $$1(document).find("body").append("<div class='keyword-hover-container'><div class='content'></div></div>");

  var offset = $$1(elt).offset();
  var winWidth = $$1(window).width();
  var bboxR = mouseX + $$1('.keyword-hover-container').width();

  $$1(document).find("body .keyword-hover-container .content").html("<center>Chargement</center>");

  if(winWidth > bboxR)
    $$1(document).find("body .keyword-hover-container").css('right', 'auto').css("left", (offset.left) + "px").css("top", (offset.top + $$1(elt).height() + 10) + "px");
  else
    $$1(document).find("body .keyword-hover-container").css('left', 'auto').css("right", winWidth - (offset.left + $$1(elt).width())).css("top", (offset.top + $$1(elt).height() + 10) + "px");

  $$1(document).find("body .keyword-hover-container").show();

  $$1(document).find("body .keyword-hover-container").unbind("mouseenter").bind("mouseenter", function() {
    flagKeywordContainer = true;
  }).unbind("mouseleave").bind("mouseleave", function() {
    flagKeywordContainer = false;

    setTimeout(function() {
      if(!flagKeywordContainer) closeKeywordHoverContainer();
    }, 500);
  });

  $$1(elt).unbind('mouseleave').bind('mouseleave', function() {
    flagKeywordContainer = false;

    setTimeout(function() {
      if(!flagKeywordContainer) closeKeywordHoverContainer();
    }, 500);
  });

  execQuery("get-keyword-linked-datas", {
      keyword
    })
    .then((json) => $$1(".keyword-hover-container .content").html(base64Decode(json.content)))
    .catch(() => closeKeywordHoverContainer());
}


function initKeywordHover() {

  $$1(".label-keyword-mouse").unbind("mouseenter").bind("mouseenter", function() {
    var that = $$1(this);
    //closeKeywordHoverContainer();
    if(timerKeywordHover != null) clearTimeout(timerKeywordHover);
    timerKeywordHover = setTimeout(function() {
      getKeywordHover(that);
    }, 500);
  }).unbind("mouseleave").bind("mouseleave", function() {
    if(timerKeywordHover != null) clearTimeout(timerKeywordHover);
  });
  $$1('html').click(function() {
    closeKeywordHoverContainer();
  });
  $$1(".keyword-hover-container").click(function(event) {
    event.stopPropagation();
  });
}

let compteur = 0;

function imageLoadingAction(tailleImage) {
	const nbCol = 10;
	const nbLigne = 15;
	compteur = (compteur + 1) % (nbCol * nbLigne);

	const numLigne = Math.floor(compteur/nbCol);
	const numCol = compteur % nbCol;

	const postionX = numCol * tailleImage;
	const positionY = numLigne * tailleImage;

	$$1('.loading').css('background-position', '-'+postionX+'px -'+positionY+'px');
}

function imageLoading() { imageLoadingAction(197); }

function imageLoadingSmall() { imageLoadingAction(99); }

let _nameTimer = null;

function nameTimer(loader) {
  if(isFunction$1(loader)) {
    if(_nameTimer) {
      clearInterval(_nameTimer);
    }
    _nameTimer = setInterval(loader, 40);
  } else if(loader === null) {
    clearInterval(_nameTimer);
    _nameTimer = null;
  }

  return _nameTimer;
}

function getDivMiniLoading() {
  return "<div class='msg-loading'>\
		<p style=\"padding-top: 150px;\">Chargement en cours</p>\
	</div>";
}

function resizeModalWindowFormFields(modalWindow) {

  $$1(modalWindow).find(".row:visible:has(.form-field)").not(".resized").each(function() {
    var maxHeightHeading = 0;
    var maxHeight = 0;
    var row = $$1(this);


    $$1(row).find(".form-field").each(function() {
      if($$1(this).find('.panel-heading .title').height() > maxHeightHeading)
        maxHeightHeading = $$1(this).find('.panel-heading .title').height();
    });

    if(maxHeightHeading > 0) {
      $$1(row).find(".form-field .panel-heading").css("height", maxHeightHeading + "px");
    }

    $$1(row).find(".form-field").each(function() {
      if($$1(this).height() > maxHeight)
        maxHeight = $$1(this).height();
    });

    $$1(row).addClass("resized");

    if(maxHeight > 0) {
      $$1(row).find(".form-field").css("min-height", maxHeight + "px");
      //$(row).find(".form-field").find(".panel").css("min-height", maxHeight+"px");
      var heightPanelBody = maxHeight - maxHeightHeading;
      $$1(row).find(".form-field").find(".panel").find('.panel-body').not('.form-field .panel .panel-body .panel-body').css("min-height", heightPanelBody + "px");

      if($$1(row).find(".form-field").find(".panel").find('.panel-body').find('textarea').length > 0)
        $$1(row).find(".form-field").find(".panel").find('.panel-body').find('textarea').css('height', (heightPanelBody - 40) + "px");
    }
  });
}


/**
 * Adjust modal form fields
 * @returns {undefined}
 */
function resizeFormFields() {

  $$1(".modal-window").each(function() {

    var modalWindow = $$1(this);

    $$1(this).find('.nav .li:visible').not('.handled').bind('click', function() {
      resizeModalWindowFormFields(modalWindow);
    });

    resizeModalWindowFormFields(modalWindow);
  });
}

// import 'bootstrap-stylus/js/tab';

// FIXME: Should probably be done with a delegate
function navTabs() {
	$$1('.nav-tabs a, .nav-pills a').unbind("click").bind("click", function (e) {
		e.preventDefault();
		$$1(this).tab('show');
		setTimeout(function() { resizeFormFields(); }, 100);
	});
}

const users_idcard = [];

function openUserModal() {
  $$1("#user-idcard").show();
}

function finalizeLoadUser() {
  nameTimer(null);

  navTabs();
  tooltip();
  formRequester();
}

function consultUser(iduser) {
  for(var i = 0; i < users_idcard.length; i++) {
    if(users_idcard[i].iduser == iduser) {
      openUserModal();
      $$1("#user-idcard .modal-body").html(base64Decode(users_idcard[i].content));
      finalizeLoadUser();
      return;
    }
  }

  execQuery("consult-user", {
      iduser
    })
    .then((json) => {
      if($$1('#user-idcard').data('hover') == iduser && $$1('#user-idcard').data('close') == 0) {
        openUserModal();
        $$1("#user-idcard .modal-body").html(base64Decode(json.content));
        users_idcard.push({
          iduser: iduser,
          content: json.content
        });
        finalizeLoadUser();
      }
    });
}

function showUserCard(iduser) {
  if(iduser == $$1('#user-idcard').data('hover')) {
    consultUser(iduser);
  }
}

function calculPosIDCard(x, y, cntH) {
  var popin = $$1('#user-idcard');
  var w = popin.width();
  var h = popin.height();

  var winW = $$1(window).width();
  var winH = $$1(window).height();

  if(x + w > winW) {
    popin.css('left', '').css('right', '15px');
  }

  if(y + h - $$1(window).scrollTop() > winH) {
    popin.css('top', (y - (cntH * 1.5) - h) + 'px');
  }
}

function initUserHover$1() {
  var timerStartLoadUser;
  var onUserLink = false;
  $$1('.user-idcard-hover').on('mouseenter', function(evt) {
    timerStartLoadUser = setTimeout(function() {
      var offset = $$1(evt.currentTarget).offset();
      var htd = $$1(evt.currentTarget).height();
      var iduser = parseInt($$1(evt.currentTarget).data('user'));

      $$1('#user-idcard').css('top', (offset.top + (htd + 5)) + 'px').css('left', offset.left + 'px').data('close', 0);

      $$1('.user-idcard-hover').off('mouseleave').on('mouseleave', function(evt) {
        clearTimeout(timerStartLoadUser);
        if($$1(evt.currentTarget).parents('#user-idcard').length == 0 && $$1(evt.currentTarget).prop('id') != 'user-idcard') {

          $$1('#user-idcard').data('close', iduser);
          setTimeout(function() {
            if($$1('#user-idcard').data('close') == iduser)
              $$1('#user-idcard').hide(); /*"clip", null, "fast"*/
          }, 750);
        }
      });

      nameTimer(imageLoading);

      if($$1('#user-idcard').data('hover') != iduser || $$1('#user-idcard .loading').length > 0) {

        $$1('#user-idcard').data('hover', iduser);

        if($$1('#user-idcard:visible').length > 0) {

          if($$1('#user-idcard .loading').length === 0)
            $$1('#user-idcard .modal-body').html(getDivMiniLoading());

          calculPosIDCard($$1('#user-idcard').offset().left, $$1('#user-idcard').offset().top, htd);
          showUserCard(iduser);

        } else { //first time
          if($$1('#user-idcard').data('close') === 0 && $$1('#user-idcard').data('hover') === iduser) {

            $$1('#user-idcard').show(); /*"blind", null, "fast"*/

            calculPosIDCard($$1('#user-idcard').offset().left, $$1('#user-idcard').offset().top, htd);

            if($$1('#user-idcard .loading').length === 0)
              $$1('#user-idcard .modal-body').html(getDivMiniLoading());

            showUserCard(iduser);
          }
        }
      } else { //same user	so we just open the modal
        showUserCard(iduser); //$('#user-idcard').show();/*"blind", null, "fast"*/
        calculPosIDCard($$1('#user-idcard').offset().left, $$1('#user-idcard').offset().top, htd);
      }
    }, 1000);
  }).on("mouseleave", function() {
    clearTimeout(timerStartLoadUser);
  });
}

function displayMessage(msg, delay = 5000) {
  displayMsg(msg, 'alert-message', delay);
}

// FIXME: There is no viable senario for a sync AJAX call = Shuold be removed


function execQuerySync(q, data = null) {
  return $$1.post({
    url: rootURL(`/query?q=${q}`),
    processData: true,
    async: false,
    data,
    responseType: 'text'
  }).responseText;
}

function isAjaxError(ajaxResponse) {
  return ajaxResponse && ajaxResponse.type === 'error';
}

function isAjaxSuccess(ajaxResponse) {
  return ajaxResponse && ajaxResponse.type === 'success';
}

function Class(__proto__) {
    var Class = __proto__.hasOwnProperty("constructor") ? __proto__.constructor : (__proto__.constructor = function () {});
    Class.prototype = __proto__;
    return Class;
}

Class.prototype = Function.prototype;

// import 'blueimp-file-upload';
// import 'bootstrap-stylus/js/modal';

const ie = (function() {

  var undef,
    v = 3,
    div = document.createElement('div'),
    all = div.getElementsByTagName('i');

  while(
    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
    all[0]
  );

  return v > 4 ? v : undef;

}());

const FileManager = Class({

  constructor: function(options) {

    var self = this;

    if(!options) { options = {}; }

    self.DISPLAY_MODE_THUMB = 'thumb';
    self.DISPLAY_MODE_DETAIL = 'detail';

    self.SELECTION_MODE_NONE = 'none';
    self.SELECTION_MODE_SINGLE = 'single';
    self.SELECTION_MODE_MULTI = 'multi';

    self.uid = options.uid ? options.uid : 'public'; // current root uid
    self.fmContainer = options.container ? options.container : null; // current FileManager DOM container
    self.fnCallback = options.fnCallback ? options.fnCallback : null; // callback function after validating selection
    self.selectionMode = options.selectionMode ? options.selectionMode : self.SELECTION_MODE_NONE;
    self.displayMode = options.displayMode ? options.displayMode : self.DISPLAY_MODE_THUMB;

    self.idfolder = 0; // current idfolder
    self.timerSearch;

    self.fileUploader = null; // the fileUploader object
    self.filesList = null; // the list of files to upload

    self.cutFilesArray = null; // array of cut files Array(id,id,id,...)

    // $(window).resize(function() { self.resize(); });
  },

  resize: function() {

    var self = this;
    var windowHeight = $$1(window).height();

    var offsetTop1 = ($$1(self.fmContainer).find('.content:first').length > 0) ? $$1(self.fmContainer).find('.content:first').offset().top : 0;
    var offsetTop2 = $$1('#modal-filemanager').length ? 35 : 0;

    var contentHeight = windowHeight - (offsetTop1 + offsetTop2);
    if(contentHeight <= 0) { contentHeight = 400; }
    $$1(self.fmContainer).find('.content:first').css('height', `${contentHeight}px`);
  },

  init: function() {

    var self = this;

    $$1(self.fmContainer).find('#select-folder').unbind('change').bind('change', function() {

      self.uid = $$1(this).val();
      self.render();
    });

    $$1(self.fmContainer).find('.span-mode-thumb').unbind('click').bind('click', function() {

      self.setDisplayMode(self.DISPLAY_MODE_THUMB);
    });

    $$1(self.fmContainer).find('.span-mode-detail').unbind('click').bind('click', function() {

      self.setDisplayMode(self.DISPLAY_MODE_DETAIL);
    });
    $$1(self.fmContainer).find('.span-upload').unbind('click').bind('click', function() {

      self.openPicturesUploader();
    });
    $$1(self.fmContainer).find('.span-delete').unbind('click').bind('click', function() {

      self.deleteFiles();
    });
    $$1(self.fmContainer).find('.span-refresh').unbind('click').bind('click', function() {

      self.refresh();
    });
    $$1(self.fmContainer).find('.span-new-folder').unbind('click').bind('click', function() {

      self.createFolder();
    });
    $$1(self.fmContainer).find('.span-cut').unbind('click').bind('click', function() {

      self.cutFiles();
    });
    $$1(self.fmContainer).find('.span-paste').unbind('click').bind('click', function() {

      self.pastFiles();
    });
    $$1(self.fmContainer).find('.span-search input[type=text]').unbind('keyup').bind('keyup', function() {

      self.searchFile();
    });
    $$1(self.fmContainer).find('.span-select .btn').unbind('click').bind('click', function() {

      self.selectFiles();
    });

    // <--- select item
    $$1(self.fmContainer).find('.item-check input[type=checkbox]').unbind('click').bind('click', function() {

      self.selectItem($$1(this).parents('.item'));
    });
    $$1(self.fmContainer).find('.item-file .item-thumb').unbind('click').bind('click', function() {

      self.selectItem($$1(this).parents('.item'));
    });
    // select item --->

    $$1(self.fmContainer).find('.item-folder .item-name').unbind('click').bind('click', function() {

      self.editFolder($$1(this).parents('.item-folder').data('id'));
    });

    // <--- refresh (load folder)
    $$1(self.fmContainer).find('.item-folder .item-thumb').unbind('click').bind('click', function() {

      self.refresh($$1(this).parents('.item-folder').data('id'));
    });
    $$1(self.fmContainer).find('.item-folder-parent').unbind('click').bind('click', function() {

      self.refresh($$1(this).data('id'));
    });
    // refresh (load folder) --->

    self.initPicturesUploader();

    self.adjustPicturesPositions();

    self.resize();
  },

  /**
   * Render the whole filemanager DOM
   */
  render: function() {

    var self = this;

    execQuery('filemanager-render', {
      'uid': self.uid,
      'displayMode': self.displayMode,
      'selectionMode': self.selectionMode
    }, false)
      .then((json) => {
        $$1(self.fmContainer).html(base64Decode(json.content));
        setTimeout(function() {
          self.init();
        }, 200);
      });
  },
  /**
   * Render only files and folder DOM
   */
  refresh: function(idfolder) {

    var self = this;

    if(typeof(idfolder) === 'undefined') { idfolder = self.idfolder; }

    self.displayMsg('Chargement en cours ...', false);

    execQuery('filemanager-refresh', {
      'uid': self.uid,
      'displayMode': self.displayMode,
      'id': idfolder
    }, false)
      .then((json) => {
        self.hideMsg();

        $$1(self.fmContainer).find('.span-search input[type=text]').val('');
        $$1(self.fmContainer).find('.items').html(base64Decode(json.content));

        $$1(self.fmContainer).find('.span-position span').html(json.path);

        self.idfolder = idfolder;

        setTimeout(function() {
          self.init();
        }, 200);
      })
      .catch(() => self.hideMsg());
  },

  adjustPicturesPositions: function() {

    var self = this;

    $$1(self.fmContainer).find('.item-thumb img').each(function() {
      var containerWidth = $$1(this).parent().width();
      var containerHeight = $$1(this).parent().height();

      var imgWidth = $$1(this).data('original-width');
      var imgHeight = $$1(this).data('original-height');

      var offsetX = 0;
      var offsetY = 0;

      var finalWidth = containerWidth;
      var finalHeight = imgHeight * (containerWidth / imgWidth);

      if(finalHeight < containerHeight) {
        finalHeight = containerHeight;
        finalWidth = imgWidth * (containerHeight / imgHeight);
      }

      offsetX = (containerWidth - finalWidth) / 2;
      offsetY = (containerHeight - finalHeight) / 2;

      $$1(this)
        .css({ width: `${finalWidth}px`, height: `${finalHeight}px`, top: `${offsetY}px`, left: `${offsetX}px` });
    });
  },

  setDisplayMode: function(displayMode) {
    var self = this;

    switch(displayMode) {
      case self.DISPLAY_MODE_THUMB:
        $$1(self.fmContainer).find('.items').removeClass('mode-thumb mode-detail').addClass('mode-thumb');
        self.displayMode = self.DISPLAY_MODE_THUMB;
        self.init();
        break;
      case self.DISPLAY_MODE_DETAIL:
        $$1(self.fmContainer).find('.items').removeClass('mode-thumb mode-detail').addClass('mode-detail');
        self.displayMode = self.DISPLAY_MODE_DETAIL;
        self.init();
        break;
    }
  },
  selectItem: function(item) {

    var self = this;

    var itemClass = $$1(item).attr('class');
    if(typeof(itemClass) == 'undefined') { itemClass = ''; }

    if(itemClass.indexOf('selected') >= 0) {

      $$1(item).removeClass('selected');
      $$1(item).find('input[type=checkbox]').prop('checked', false);

    } else {
      //
      if(self.selectionMode == self.SELECTION_MODE_SINGLE) {
        $$1(self.fmContainer).find('.item').not('.item-folder, .item-folder-parent').not(item).removeClass('selected');
        $$1(self.fmContainer).find('.item').not('.item-folder, .item-folder-parent').not(item).find('input[type=checkbox]').prop('checked', false);
      }

      $$1(item).addClass('selected');
      $$1(item).find('input[type=checkbox]').prop('checked', true);

    }
  },

  selectFiles: function() {

    var self = this;
    var arrayFiles = [];

    $$1(self.fmContainer).find('.item-file .item-check input[type=checkbox]:checked').each(function() {

      var id = $$1(this).parents('.item').data('id');
      var width = $$1(this).parents('.item').find('.picture').data('original-width');
      var height = $$1(this).parents('.item').find('.picture').data('original-height');
      var type = $$1(this).parents('.item').data('type');
      var title = $$1(this).parents('.item').find('.item-name p').html();
      var filename = $$1(this).parents('.item').find('.item-filename').val(); // /uploads/_UploadFolder/public/folder1/filename.jpg
      var filenameThumb = $$1(this).parents('.item').find('.item-filename-thumb').val(); // /uploads/_UploadFolder/public/folder1/_thumbs/filename.jpg
      var filenameShort = $$1(this).parents('.item').find('.item-filename-short').val(); // /public/folder1/filename.jpg

      arrayFiles.push({
        'id': id,
        'filename': filename,
        'filenameShort': filenameShort,
        'filenameThumb': filenameThumb,
        'title': title,
        'width': width,
        'height': height,
        'type': type
      });
    });

    if(typeof(self.fnCallback) !== 'undefined') { self.fnCallback(arrayFiles); }
  },
  cutFiles: function() {

    var self = this;
    var counter = 0;
    self.cutFilesArray = [];
    $$1(self.fmContainer).find('.item-check input[type=checkbox]:checked').each(function() {
      $$1(this).parents('.item').removeClass('selected').removeClass('cut').addClass('cut');
      self.cutFilesArray.push($$1(this).parents('.item').data('id'));
      counter++;
    });

    $$1(self.fmContainer).find('.span-paste').show();
    displayInfo(`${counter} élément${(counter > 1 ? 's' : '')} copié${(counter > 1 ? 's' : '')}`);
  },
  pastFiles: function(idfolder) {

    var self = this;
    if(typeof(idfolder) === 'undefined') { idfolder = self.idfolder; }

    self.moveFiles(self.cutFilesArray, idfolder);

    $$1(self.fmContainer).find('.span-paste').hide();
  },
  moveFiles: function(filesArray, idfolder) {

    var self = this;

    for(var i = 0; i <= filesArray.length - 1; i++) {
      var id = filesArray[i];
      if(self.moveFile(id, idfolder)) {
        if($$1(`.item[data-id='${id}']`).length > 0) {
          $$1(`.item[data-id='${id}']`).remove();
        }
      }
    }

    if(self.idfolder == idfolder) { self.refresh(); }
  },
  moveFile: function(idfile, idfolder) {

    var self = this;

    var returnCode = execQuerySync('move-file', {
      'idfile': idfile,
      'idfolder': idfolder,
      'root': self.uid
    });

    if(returnCode == 'ok') {
      return true;
    }

    displayError$1(returnCode);
  },


  // <--- upload function
  initPicturesUploader: function() {

    var self = this;

    if($$1(document).find('#filemanager-uploader').length <= 0) {
      var content = base64Decode(execQuerySync('get-filemanager-uploader'));
      $$1(document).find('body').find('#modal-filemanager').prepend(content);
    }

    $$1('#btn-filemanager-upload').unbind('click').bind('click', function() {
      if((self.filesList == null) || (self.filesList.length <= 0)) {
        return alert('Aucun fichier a envoyer');
      }

      $$1('#btn-filemanager-upload-container, #btn-filemanager-cancel-container, #btn-filemanager-close').hide();
      $$1('#upload-wait-message').show();

      $$1('#filemanager-upload-file').fileupload('send', {
        'url': rootURL('/query?q=uploader&type=fileManager'),
        files: self.filesList,

        formData: {
          'uid': self.uid,
          'idfolder': self.idfolder,
          'filemanager-resize-pictures': $$1('#filemanager-resize-pictures').prop('checked'),
          'filemanager-resize-picture-width': $$1('#filemanager-resize-picture-width').val(),
          'filemanager-resize-picture-height': $$1('#filemanager-resize-picture-height').val()
        }
      });
    });

    $$1('#btn-filemanager-cancel').unbind('click').bind('click', function() {

      self.filesList = null;
      $$1('#btn-filemanager-upload-container').hide();
      $$1('#btn-filemanager-cancel-container').hide();
      $$1('#files-list').html('');
    });

    // <--- fileUploader ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

    self.fileUploader = $$1('#filemanager-upload-file').fileupload({

      'url': rootURL('/query?q=uploader&type=fileManager'),
      'autoUpload': false,

      // <--- called when a file is added within the list
      'add': function(e, data) {

        data.formData = {

          'uid': self.uid,
          'idfolder': self.idfolder,
          'filemanager-resize-pictures': $$1('#filemanager-resize-pictures').prop('checked'),
          'filemanager-resize-picture-width': $$1('#filemanager-resize-picture-width').val(),
          'filemanager-resize-picture-height': $$1('#filemanager-resize-picture-height').val()
        };

        // <--- fill the fileList
        if(self.filesList === null) {
          self.filesList = [];
        }

        for(let i = 0; i < data.files.length; i++) {
          self.filesList.push(data.files[i]);
        }
        // fill the fileList --->

        // <--- update fileList html content
        $$1('#files-list').html('');

        for(let i = 0; i <= self.filesList.length - 1; i++) {
          $$1('#files-list').append(`<li class="list-group-item">${self.filesList[i].name}</li>`);
        }
        // --->

        // <--- no files
        if((self.filesList === null) || (self.filesList.length <= 0)) {

          $$1('#btn-filemanager-upload-container').hide();
          $$1('#btn-filemanager-cancel-container').hide();
          return false;
        }
        // no files --->

        if(ie <= 9) {
          data.submit();
        } else {
          $$1('#btn-filemanager-upload-container').show();
          $$1('#btn-filemanager-cancel-container').show();
        }

      }, // --->

      // <--- progress
      'progressall': function(e, data) {

        var progress = parseInt(data.loaded / data.total * 100, 10);

        $$1('#filemanager-upload-progress .progress-bar').show();
        $$1('#filemanager-upload-progress .progress-bar').css('width', progress + '%');
      },
      // --->

      // <--- done
      'done': function(e, data) {

        // FIXME: Fix to return promise and skip all the 'isXX' methods

        $$1('#btn-filemanager-upload-container').hide();
        $$1('#btn-filemanager-cancel-container').hide();
        $$1('#btn-filemanager-close').show();
        $$1('#upload-wait-message').hide();

        $$1('#filemanager-upload-progress .progress-bar').hide();
        $$1('#filemanager-upload-progress .progress-bar').css('width', '0');

        if(!data) {
          return displayError$1('Unknown error');
        }

        var json = data.result;

        if(isAjaxError(json)) {
          return displayError$1(json.msg);
        }

        if(isAjaxSuccess(json)) {
          displaySuccess$1(json.msg);
        }

        self.filesList = null;

        $$1('#files-list').html('');

        self.refresh();
      }
        // --->
    });
    // fileUploader --------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  },
  openPicturesUploader: function() {

    if($$1(document).find('#filemanager-uploader').length <= 0) {
      var content = base64Decode(execQuerySync('get-filemanager-uploader'));
      $$1(document).find('body').find('#modal-filemanager').prepend(content);
    }

    var self = this;

    $$1('#filemanager-uploader').find('#btn-filemanager-close').unbind('click').bind('click', function() {
      self.closePicturesUploader();
    });
    $$1('#filemanager-uploader #filemanager-uploader-uid').val(self.uid);

    $$1(self.fmContainer).find('#filemanager-upload-progress .progress-bar').hide();
    $$1(self.fmContainer).find('#filemanager-upload-progress .progress-bar').css('width', 0);

    $$1('#filemanager-uploader').css('z-index', 1000000001);
    $$1('#filemanager-uploader').fadeIn('fast');
  },
  closePicturesUploader: function() {

    $$1('#filemanager-uploader').hide();
  },
  // upload function --->


  // <--- delete functions
  deleteFiles: function() {

    var self = this;

    if($$1(self.fmContainer).find('.item-check input[type=checkbox]:checked').length <= 0) {
      return alert('Merci de sélectionner au moins un fichier dans la liste');
    }

    if(!confirm('Attention, vous allez supprimer un ou plusieurs fichiers.\r\nSouhaitez-vous continuer ?')) {
      return;
    }

    $$1(self.fmContainer).find('.item-check input[type=checkbox]:checked').each(function() {
      var idfile = $$1(this).parents('.item').data('id');
      self.deleteFile(idfile);
    });
  },
  deleteFile: function(id) {

    var self = this;

    var returnCode = execQuerySync('delete-file', {
      'root': self.uid,
      'id': id
    });

    if(returnCode == 'ok') {
      if($$1(self.fmContainer).find(`.item[data-id='${id}']`).length > 0) {
        $$1(self.fmContainer).find(`.item[data-id='${id}']`).remove();
      }
    } else {
      displayError$1(returnCode);
    }
  },
  // delete functions --->


  // <--- search functions
  searchFile: function() {

    var self = this;
    if(self.timerSearch !== null) {
      clearTimeout(self.timerSearch);
    }

    self.timerSearch = setTimeout(function() {
      self.searchFileFinal();
    }, 300);
  },

  searchFileFinal: function() {

    var self = this;

    var keywords = $$1(self.fmContainer).find('.span-search input[type=text]').val();

    if(keywords.length <= 0) {
      return $$1(self.fmContainer).find('.item').show();
    }

    var arrayKeywords = keywords.split(';');

    $$1(self.fmContainer).find('.item .item-name p').each(function() {

      var filename = $$1(this).html();

      var flagFound = false;
      for(var i = 0; i <= arrayKeywords.length - 1; i++) {
        if(self.cleanFilename(filename).indexOf(self.cleanFilename(arrayKeywords[i])) >= 0) {
          flagFound = true;
        }
      }

      flagFound ? $$1(this).closest('.item').show() : $$1(this).closest('.item').hide();
    });
  },
  // search functions --->


  // <--- folder functions
  editFolder: function(id) {

    var self = this;

    execQuery('edit-folder', { id })
      .then((json) => {
        self.openFolderModal();

        $$1('#folder-modal .modal-body').html(base64Decode(json.content));
        $$1('#form-folder').find('#root').val(self.uid);
        $$1('#form-folder').find('#idparent').val(0);

        self.finalizeLoadFolder();
      });
  },
  createFolder: function() {

    var self = this;

    execQuery('create-folder')
      .then((json) => {
        self.openFolderModal();

        $$1('#folder-modal .modal-body').html(base64Decode(json.content));
        $$1('#form-folder').find('#root').val(self.uid);
        $$1('#form-folder').find('#idparent').val(self.idfolder);

        self.finalizeLoadFolder();
      });
  },
  finalizeLoadFolder: function() {

    var self = this;

    formRequester();

    $$1('#btn-folder-modal-close').unbind('click').bind('click', function() {
      self.closeFolderModal();
    });
    $$1('#form-folder #folder').focus();
  },
  initFolderModal: function() {

    if($$1(document).find('#folder-modal').length > 0) {
      return;
    }

    $$1(document).find('body').append('\
			<div class="modal" id="folder-modal" tabindex="-1" role="dialog">\
				<div class="modal-dialog" style="width:400px;">\
					<div class="modal-content">\
						<div class="modal-header">\
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>\
							<h2 class="modal-title">Dossier</h2>\
						</div>\
						<div class="modal-body">\
						</div>\
					</div>\
				</div>\
			</div>\
		');
  },
  openFolderModal: function() {

    this.initFolderModal();
    $$1('#folder-modal').modal('show');
    setTimeout(function() {
      $$1('#folder-modal').css('z-index', 3000000);
    }, 200);
  },
  closeFolderModal: function() {

    $$1('#folder-modal').modal('hide');
  },
  // folder functions --->


  // <--- usefull functions
  cleanFilename: function(entry) {
    entry = entry.replace(/\s+/gi, '-'); // Replace white space with dash
    return entry.replace(/[^a-zA-Z0-9\-]/gi, ''); // Strip any special charactere
  },
  displayMsg: function(msg, flagAutoHide) {

    if(typeof(flagAutoHide) == 'undefined') {
      flagAutoHide = true;
    }

    var self = this;
    $$1(self.fmContainer).find('#msg').html(msg);
    $$1(self.fmContainer).find('#msg').show();

    if(flagAutoHide === true) {
      setTimeout(function() { self.hideMsg(); }, 5000);
    }
  },
  hideMsg: function() {
    $$1(this.fmContainer).find('#msg').hide();
  }
    // usefull functions --->
});

let currentFileManager = null;

function myFilemanager(options) {
  if(options) {
    currentFileManager = new FileManager(options);
  }

  return currentFileManager;
}

// import 'bootstrap-stylus/js/modal';

function _resizeFileManagerModal() {
  $$1("#modal-filemanager").each((i, elm) => {
    var modalBodyHeight = $$1(window).height() - ((30 * 2) + $$1(".modal-header", elm).height());
    $$1(".modal-body", elm).css("height", `${modalBodyHeight}px`);
  });
}

function initFileManagerModal() {

  if($$1(document).find("#modal-filemanager").length > 0) return;

  $$1(document).find("body").append('\
		<div class="modal" id="modal-filemanager" tabindex="-1" role="dialog" style="z-index:1000000000">\
			<div style="width:90%" class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>\
						<h2 class="modal-title">Gestionnaire de fichiers</h2>\
					</div>\
					<div class="modal-body"></div>\
				</div>\
			</div>\
		</div>\
	');

  $$1(window).resize(function() {

    _resizeFileManagerModal();
  });
}

function _openFileManagerModal(fnCallback) {

  initFileManagerModal();

  $$1("#modal-filemanager .modal-body").html("<br><center>Chargement</center>");
  $$1("#modal-filemanager").modal("show");

  _resizeFileManagerModal();

  if(typeof(fnCallback !== "undefined"))
    fnCallback();
}


/**
 *
 * @param {array} options
 * uid=><br>
 * fnCallback=><br>
 * container=> (default is $("#modal-filemanager .modal-body")<br>
 * selectionMode=><br>
 */
function openFileManager(options) {

  if(!options) options = {};

  options.container = "#modal-filemanager .modal-body";

  _openFileManagerModal(function() {
    myFilemanager(options).render();
  });
}

// import 'bootstrap-stylus/js/modal';

function closeFileManagerModal() {
  $$1("#modal-filemanager").modal("hide");
}

// import 'public-source/js/core/jquery-bundles/tinymce';

function _addTinyMceSelectPictureButton(ed) {
  ed.addButton('selectPicture', {
    title: 'Sélectionner une image',
    image: rootURL('/pub/js/tinymce/skins/lightgray/img/ajouter_image.png'),
    onclick: function() {
      setTimeout(function() {
        const finalString = [];

        openFileManager({
          'selectionMode': 'multi',
          'uid': 'users',
          'fnCallback': function(files) {
            if(!files) { return false; }

            for(var i=0; i<=files.length-1; i++) {
              const filename = files[i].filename;
              const width = files[i].width;
              const height = files[i].height;
              const type = files[i].type;

              if(type === 'img') {
                finalString.push(`<img src='${filename}' width='${width}' height='${height}' alt='' />`);
              } else if(type === 'video') {
                alert('Insertion de vidéos en cours de développement');
              } else {
                finalString.push(`<a href='${filename}' target='_blank'>${type}</a>`);
              }
            }
            ed.selection.setContent(finalString);
            closeFileManagerModal();
          }
        });
      }, 500);
    }
  });
}

function _setTinyMce(elt, query, options) {
  const $inputs = $$1(query, elt).not('.input-html-initialized').each(function() {
    const cssFile = $$1(this).data('css-file');
    const opts = $$1.extend({}, options);

    if(cssFile) { opts['content_css'] = rootURL(cssFile); }

    $$1(this).tinymce(opts);
  });

  setTimeout(() => $inputs.addClass('input-html-initialized'), 1000);
}

function _getTinyMceOptionsSimple() {
  return {
    plugins: [
      'advlist autolink link image lists charmap hr anchor',
      'searchreplace wordcount visualblocks visualchars code fullscreen media nonbreaking',
      'save table contextmenu directionality paste textcolor'
    ],
    resize: true,
    menubar: false,
    toolbar1: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
    image_advtab: true,
    submit_patch: true,
    schema: 'html5',
    statusbar: true,
    language:'fr_FR',
    forced_root_block : '',
    force_p_newlines: false,
    relative_urls : false,
    document_base_url : rootURL()
  };
}

function _getTinyMceOptionsAdvanced() {
  return $$1.extend({}, _getTinyMceOptionsSimple(), {
    menubar: 'view, edit, insert, format, table, tools',
    toolbar1: 'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image selectPicture | media | forecolor backcolor',
    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image selectPicture | print preview media fullpage | forecolor backcolor emoticons',

    setup: function(ed) {
      _addTinyMceSelectPictureButton(ed);

      // On detecte une modification dans tinymce pour mettre à jour le hidden de modification
      ed.on('change', function() {
        if($$1(this.contentAreaContainer).parents('#page-content').find('#data-iddata').length) {
          $$1('#page-content').find('.modal-window-modif').val('1');
        } else {
          $$1(this.contentAreaContainer).parents('.modal-window').find('.modal-window-modif').val('1');
        }
      });
    }
  });
}

function _initTinyMceSimple(elt, query) {
  _setTinyMce(elt, query, _getTinyMceOptionsSimple());
}

function _initTinyMceAdvanced(elt, query) {
  _setTinyMce(elt, query, _getTinyMceOptionsAdvanced());
}

function tinyMCE$1(elt) {
  _initTinyMceAdvanced(elt,'.input-html');
  _initTinyMceSimple(elt, '.input-html-simple');
}

function removeTinyMCE$1(elt) {
  $$1(elt).find('.input-html-initialized').each(function() {
    if($$1(this).tinymce()) { $$1(this).tinymce().remove(); }
  });
}

function getModalWindowButton(elt) {

  if(typeof(elt) == "string") {

    if($$1(".modal-window-button").find("input[value=\"" + elt + "\"].modal-window-button-uid").length > 0)
      return $$1(".modal-window-button").find("input[value=\"" + elt + "\"]").parents(".modal-window-button");
  } else {
    if($$1(elt).hasClass("modal-window")) {

      var uid = $$1(elt).find("input.modal-window-uid").val();
      return getModalWindowButton(uid);

    }
    if($$1(elt).hasClass("modal-window-button")) {
      return elt;
    }
  }

  return null;
}

// TODO: Use vanillajs-helpers or lodash for this

function isArray$1(arr) {
  return !!arr && arr instanceof Array;
}

var _modalWindows = []; // array containing pushed modalWindows wich have to be re-opened after main window closing
function modalWindows(modal) {
  if(modal) {
    if(isArray$1(modal)) {
      _modalWindows = [];
    } else {
      _modalWindows.push(modal);
    }
  }

  return _modalWindows;
}

function removeModalWindow(modalWindow) {
  const modals = modalWindows();

  if(modals.length <= 0)
    return false;

  // <--- remove the modalWindow from modalWindows if exists
  var modalWindowIndex = null;
  for(var i = 0; i <= modals.length - 1; i++)
    if($$1(modals[i]).attr("id") == $$1(modalWindow).attr("id"))
      modalWindowIndex = i;

  if(modalWindowIndex !== null)
    modalWindows(modals.splice(modalWindowIndex, 1));
  // --->

  return true;
}

function hideModalWindowOverlay$1() {
  if($$1(document).find("body .modal-window-overlay").length > 0)
    $$1(document).find("body .modal-window-overlay").hide();
  $$1(document).find('html, body').css('overflow', 'auto');
}

function minimizeAllModalsWindows() {
  $$1(".modal-window").not(".full-page .modal-window").each(function() {
    $$1(this).removeClass("minimized").addClass("minimized");
    $$1(this).hide();
  });
  $$1(".modal-window-button").not(".full-page .modal-window-button").each(function() {
    $$1(this).removeClass("minimized").addClass("minimized");
  });

  updateModalWindowOverlay();
}

function resizeModalWindowOverlay() {
  $$1("body .modal-window-overlay").css("height", $$1(window).height() + "px");
}

function showModalWindowOverlay() {

  if($$1(document).find("body .modal-window-overlay").length <= 0) {
    $$1(document).find("body").prepend("<div class='modal-window-overlay'></div>");
    $$1(document).find(".modal-window-overlay").css('z-index', 600).bind("click", function() {
      if($$1(document).find(".modal-window-xs-overlay").length == 0)
        minimizeAllModalsWindows();
    });
  }
  resizeModalWindowOverlay();
  $$1(document).find("body .modal-window-overlay").show();

  $$1(document).find('html, body').css('overflow', 'hidden');
}

function updateModalWindowOverlay() {

  var opened_modal = $$1(document).find("body .modal-window").not(".minimized").not(".full-page .modal-window")
  if(opened_modal.length <= 0) {
    hideModalWindowOverlay$1();
  } else {
    var zindex = 600;
    var zindexxs = 800;
    opened_modal.each(function() {
      var z = parseInt($$1(this).css('z-index'));
      if($$1(this).hasClass('modal-window-xs') && zindexxs < z)
        zindexxs = z;
      if(!$$1(this).hasClass('modal-window-xs') && zindex < z)
        zindex = z;
    });
    $$1(document).find(".modal-window-overlay").css('z-index', zindex);
    $$1(document).find(".modal-window-xs-overlay").css('z-index', zindexxs);

    showModalWindowOverlay();
  }
}

function updateModalWindowBar() {
  $$1(document).find(".modal-window-bar")
    .toggle(!!$$1(document).find("body .modal-window").not(".full-page .modal-window").length)
}

function resizeModalWindowContent(modalWindow) {

  // <--- adjust modal window content sizes
  if($$1(modalWindow).find(".modal-window-content").length > 0) {

    var newModalWindowHeight = $$1(modalWindow).find(".modal-window-container").height();
    var modalWindowHeaderBarHeight = 0;
    var modalWindowHeaderHeight = 0;
    var modalWindowFooterHeight = 0;
    var modalWindowBeforeFooterHeight = 0;
    var modalWindowBeforeFooterTwitterHeight = 0;

    if($$1(modalWindow).find(".modal-window-header-bar").length > 0)
      modalWindowHeaderBarHeight = parseInt($$1(modalWindow).find(".modal-window-header-bar").css("height").replace("px", ""));

    if($$1(modalWindow).find(".modal-window-header").length > 0)
      modalWindowHeaderHeight = parseInt($$1(modalWindow).find(".modal-window-header").css("height").replace("px", ""));

    if($$1(modalWindow).find(".modal-window-footer:visible").length > 0)
      modalWindowFooterHeight = parseInt($$1(modalWindow).find(".modal-window-footer").css("height").replace("px", ""));

    if($$1(modalWindow).find(".modal-window-before-footer:visible").length > 0)
      modalWindowBeforeFooterHeight = parseInt($$1(modalWindow).find(".modal-window-before-footer").css("height").replace("px", ""));

    if($$1(modalWindow).find(".modal-window-before-footer-twitter:visible").length > 0)
      modalWindowBeforeFooterTwitterHeight = parseInt($$1(modalWindow).find(".modal-window-before-footer-twitter").css("height").replace("px", ""));

    var newModalWindowContentHeight = newModalWindowHeight - (modalWindowHeaderBarHeight + modalWindowHeaderHeight + modalWindowBeforeFooterHeight + modalWindowBeforeFooterTwitterHeight + modalWindowFooterHeight);

    $$1(modalWindow).find(".modal-window-content").css("height", newModalWindowContentHeight + "px");
  }
  // --->
}

function resizeModalWindow(modalWindow) {

  if((typeof(modalWindow) == "undefined") || (modalWindow === null) || (typeof(modalWindow) != "object"))
    return false;

  var windowWidth = $$1(window).width();
  var windowHeight = $$1(window).height();

  // <--- resize modal window height
  var newModalWindowHeight = parseInt(windowHeight);
  if(modalWindow.hasClass('modal-window-xs'))
    newModalWindowHeight = parseInt(windowHeight) - 150;

  if(($$1('.modal-window-bar').length > 0) && $$1('.modal-window-bar').is(':visible'))
    newModalWindowHeight -= 35;

  $$1(modalWindow).not('.modal-window-xs-overlay').css("height", newModalWindowHeight + "px");
  $$1(modalWindow).find(".modal-window-container").css("height", (newModalWindowHeight) + "px");
  // --->

  resizeModalWindowContent(modalWindow, newModalWindowHeight);
}

function getTopModalZindex(xs) {
  var zindex = xs ? 800 : 600;
  $$1('body .modal-window').each(function() {
    var z = parseInt($$1(this).css('z-index'));
    if(zindex < z)
      zindex = z;
  });
  return zindex + 1;
}

function maximizeModalWindow(elt, flagUpdateUi) {

  if(typeof(flagUpdateUi) == "undefined")
    flagUpdateUi = true;

  var modalWindow = getModalWindow$1(elt); // retrieve modalWindow
  if(modalWindow === null)
    return false;

  var modalWindowButton = getModalWindowButton(modalWindow); // retrieve related modalWindowButton
  if(modalWindowButton === null)
    return false;

  $$1(modalWindow).removeClass("minimized");
  $$1(modalWindowButton).removeClass("minimized");

  var zindex = getTopModalZindex($$1(modalWindow).hasClass('modal-window-xs'));
  $$1(modalWindow).css('z-index', zindex);

  if($$1(modalWindow).hasClass('modal-window-xs'))
    $$1('.modal-window-xs-overlay').css('z-index', zindex);
  else
    $$1('.modal-window-overlay').css('z-index', zindex);

  $$1(modalWindow).fadeIn("fast", function() {
    resizeModalWindow(modalWindow);
  });
  // --->


  if(flagUpdateUi) {
    updateModalWindowOverlay();
    updateModalWindowBar();
  }
  // --->
}

function restoreLastModalWindow(modalWindow) {

  const modals = modalWindows();

  if(modals.length <= 0)
    return false;

  for(var i = modals.length - 1; i >= 0; i--) {

    if(typeof(modals) != "undefined") {
      if($$1(modals[i]).length > 0 && $$1(modals[i]).attr("id") != modals.attr("id"))
        return maximizeModalWindow(modals[i]);
    } else {
      if($$1(modals[i]).length > 0) {
        if(modals[i].is(':visible'))
          return maximizeModalWindow(modals[i]);
      }
    }
  }
}

function closeModalWindow$1(elt) {

  var modalWindow = getModalWindow$1(elt); // retrieve the modalWindow
  var modalWindowButton = getModalWindowButton(modalWindow); // retrieve the related modalWindowButton

  if(modalWindow !== null) {
    removeTinyMCE$1($$1(modalWindow));
    removeModalWindow(modalWindow);
    $$1(modalWindow).remove();
  }
  if(modalWindowButton !== null)
    $$1(modalWindowButton).remove();

  if($$1(document).find('.modal-window.modal-window-xs').length == 0)
    $$1(document).find('.modal-window-xs-overlay').remove();

  nameTimer(null);

  updateModalWindowOverlay();
  updateModalWindowBar();

  restoreLastModalWindow();
}

function setModalWindowLoading(uid) {

  var modalWindow = getModalWindow$1(uid);
  if(modalWindow === null)
    return;

  var content = `<div class='msg-loading'>\
		<p>Chargement en cours</p>\
		<div class='loading'></div>\
	</div>`;

  if(nameTimer() == null)
    $$1(modalWindow).find(".modal-window-container").html(content);

  // Timer
  nameTimer(imageLoading);
}

function checkAndInitChampsDoublon($input, $parent) {
  $input = $$1($input);
  $parent = $$1($parent);

  const type = $input.attr('type');

  const id = type === 'checkbox' ? $input.prop('id') : $input.closest('div').prop('id');
  const value = $input.val();

  const $idElms = $parent.find(`[id="${id}"]`);

  if(!$idElms.length) {
    return;
  }

  if(type === 'checkbox') {
    const checked = $input.prop('checked');

    $idElms.find('input').each((i, input) => {
      const $idInput = $$1(input);
      if($idInput.val() === value) {
        $idInput.prop('checked', checked);
      }
    });
  } else {
    $idElms.val(value);
  }
}

function initModalWindowBar() {
  if($$1("body .modal-window-bar").length <= 0) {
    const $modalBar = $$1(`<div class='modal-window-bar hidden-xs hidden-sm'>
          <div onclick='confirmClosaAllModalWindow();' class='modal-window-bar-close-all tooltiped' data-placement='top' data-title='Fermer toutes les fenêtres'>
            <i class='glyphicon glyphicon-remove-circle'></i>
          </div>
        </div>`);

    $$1("body").append($modalBar);
    tooltip($modalBar);
  }

  updateModalWindowBar();
}

function pushModalWindowButton(uid, title) {

  initModalWindowBar();

  $$1(document).find(".modal-window-bar").append("\
		<div onclick='setMainModalWindow(this);' class='modal-window-button'>\
			<input type='hidden' class='modal-window-button-uid' value='" + uid + "' />\
			<p>" + title + "</p>\
		</div>\
	");
}

function minimizeModalWindow(elt, flagUpdateUi, flagForce) {
  if(typeof(flagUpdateUi) == "undefined")
    flagUpdateUi = true;
  if(typeof(flagForce) == "undefined")
    flagForce = false;

  var modalWindow = getModalWindow$1(elt); // retrieve the modalWindow DOM
  if(modalWindow === null)
    return false;

  var modalWindowButton = getModalWindowButton(modalWindow);
  if(modalWindowButton === null)
    return false;

  $$1(modalWindow).removeClass("minimized").addClass("minimized");
  if(!flagForce)
    $$1(modalWindow).hide();

  if(modalWindowButton !== null)
    $$1(modalWindowButton).removeClass("minimized").addClass("minimized");

  updateModalWindowOverlay();

  if(flagUpdateUi == true) {
    updateModalWindowBar();
  }
}

function setMainModalWindow(elt, flagForce) {

  if(typeof(flagForce) == "undefined")
    flagForce = false;

  var modalWindow = getModalWindow$1(elt); // retrieve the modalWindow DOM
  if(modalWindow === null)
    return false;

  // <--- toggle modalWindow to minimize
  if((!(modalWindow).hasClass("minimized")) && !flagForce) {
    minimizeModalWindow(modalWindow, false, flagForce);
    return modalWindow;
  }
  // --->

  // <--- minimize all maximized windows and maximize the current one
  $$1(".modal-window").not(".minimized").not(".full-page .modal-window").not(modalWindow).each(function() {
    minimizeModalWindow($$1(this), false, flagForce);
  });

  maximizeModalWindow(modalWindow, true);

  return modalWindow;
  // --->
}

function pushModalWindow(uid, options) {
  initModalWindowBar();

  var modalWindow = null;
  if((typeof(uid) == "undefined") || uid == null)
    uid = Math.round(Math.random() * 10000); // generate a random uid if not specified

  // try to search if modalWindow doesn't already exists
  var modalWindowTmp = getModalWindow$1(uid);

  // if it exists, set it as main window and return
  if(modalWindowTmp !== null)
    return setMainModalWindow(modalWindowTmp, true);


  // else create the modal-window
  // <--- retrieve options
  var classe = "";
  var title = "";
  var addXs = '';
  var overlayXs = '';
  if(typeof(options) != "undefined") {
    if(typeof(options.classe) != "undefined")
      classe = options.classe;
    if(typeof(options.title) != "undefined")
      title = options.title;
    if(typeof(options.minifiche) != "undefined" && options.minifiche == true) {
      addXs = 'modal-window-xs';
      if($$1('.modal-window-xs-overlay').length == 0)
        overlayXs = '<div class="modal-window-xs-overlay" ></div>';
    }
  }
  // --->

  // <--- create the modalWindow and the modalWindowButton if not existing
  var zindex = getTopModalZindex(overlayXs);

  modalWindow = $$1("\
		<div id='modal-window-" + uid + "' class='modal-window " + addXs + " " + classe + "'>\
			<input type='hidden' class='modal-window-uid' value='" + uid + "' />\
			<input type='hidden' class='modal-window-modif' value='0' />\
			<input type='hidden' class='modal-window-close-after-submit' value='0' />\
			<input type='hidden' class='modal-window-save-statut' value='0' />\
			<input type='hidden' class='display-kindex-waitingmsg' value='0' />\
			<div class='modal-window-title'>" + title + "</div>\
			<div class='modal-window-container'></div>\
		</div>\
	");
  if(overlayXs)
    $$1("body").prepend(overlayXs);

  $$1("body").append(modalWindow.css('z-index', zindex));

  $$1('#modal-window-' + uid).unbind("change").bind("change", function(e) {
    var forum = $$1(e.target).hasClass('input-control-discussion');
    if(!forum)
      $$1(this).find('.modal-window-modif').val('1');

    checkAndInitChampsDoublon(e.target, this);
  });

  modalWindows(modalWindow);
  // --->

  pushModalWindowButton(uid, title); // push the related ModalWindowButton

  return setMainModalWindow(modalWindow, true); // finally set the modal window as main
}

function setModalWindowTitle(uid, content) {

  var modalWindow = getModalWindow$1(uid);

  if(modalWindow !== null)
    $$1(modalWindow).find(".modal-window-title").html(content);

  var modalWindowButton = getModalWindowButton(uid);
  if(modalWindowButton !== null)
    $$1(modalWindowButton).find("p").html(content);
}

function setModalWindowHeader(uid, content) {

  var modalWindow = hideModalWindowOverlay$1(uid);

  if(modalWindow !== null)
    $$1(modalWindow).find(".modal-window-header-bar").html(content);
}

function setModalWindowFooter(uid, content) {

  var modalWindow = getModalWindow$1(uid);

  if(modalWindow !== null)
    $$1(modalWindow).find(".modal-window-footer").html(content);
}

function setModalWindowContainer(uid, content) {

  var modalWindow = getModalWindow$1(uid);
  if(modalWindow === null)
    return;

  $$1(modalWindow).find(".modal-window-container").html(content);
  nameTimer(null);

  resizeModalWindowContent(modalWindow);
}

// TODO: Optimize
// FIXME: Possibly move to bundle or module

function searchTableSelectorValue(tableSelector) {
	var searchValue = $$1(tableSelector).find(".search-input").val();

	if (typeof(searchValue)!="undefined") {
		if (searchValue.length<=0) {
			$$1(tableSelector).find("tbody tr").show();
		}else {
			$$1(tableSelector).find("tbody tr td label").each(function() {
				var cellValue = $$1(this).html();
				if (cellValue.length>0) {
					(cellValue.toLowerCase().indexOf(searchValue.toLowerCase())>=0) ? $$1(this).parent().parent().show() : $$1(this).parent().parent().hide();
				}
			});
		}
	}
}

function tableSelector() {

	if ($$1(".table-selector").length<=0) return;

	$$1(".table-selector tbody tr td input[type=radio].selector").each(function() {
		$$1(this).unbind("click").bind("click", function() {
			($$1(this).parent().parent().find("input[type=radio][value!=none].selector:checked").length>0) ? $$1(this).parent().parent().addClass("success") : $$1(this).parent().parent().removeClass("success");
		});
	});

	var timerTableSelector = null;

	$$1(".table-selector .search-input").unbind("keydown").bind("keydown", function(evt) {

		if (evt.keyCode===13) { evt.preventDefault(); return false; }

		if (timerTableSelector!==null) clearTimeout(timerTableSelector);

		//var tableSelector = $(this).parent().parent().parent().parent().parent().parent().parent();
		var tableSelector = $$1(this).parents(".table-selector");

		timerTableSelector = setInterval(function() {

			searchTableSelectorValue(tableSelector);

			clearTimeout(timerTableSelector);
			timerTableSelector = null;

		}, 500);
	});
}

// TODO: Optimize :)
// NOTE: Used in 'main.js' and 'finalizeLoadData.js'

// initStars
function stars() {
	if($$1('.control-selector2').length == 0)
		return;
	// On ajoute la classe "js" à la liste pour mettre en place par la suite du code CSS uniquement dans le cas où le Javascript est activé
	$$1(".control-selector2 div.notes-echelle").addClass("js");
	// On passe chaque note à l'état grisé par défaut
	$$1(".control-selector2 div.notes-echelle label").addClass("note-off");
	// Au survol de chaque note à la souris
	$$1(".control-selector2 div.notes-echelle label").mouseover(function() {
		// On passe les notes supérieures à l'état inactif (par défaut)
		$$1(this).parent().nextAll("div").children('label').addClass("note-off");
		// On passe les notes inférieures à l'état actif
		$$1(this).parent().prevAll("div").children('label').removeClass("note-off");
		// On passe la note survolée à l'état actif (par défaut)
		$$1(this).removeClass("note-off");

	});

	// Lorsque l'on sort du sytème de notation à la souris
	$$1(".control-selector2 div.notes-echelle").mouseout(function() {
		// On passe toutes les notes à l'état inactif
		$$1(this).children("div").children("label").addClass("note-off");
		// On simule (trigger) un mouseover sur la note cochée s'il y a lieu
		$$1(this).find("label input:checked").parent("label").trigger("mouseover");
	});

	$$1(".control-selector2 div.notes-echelle input")
	// Lorsque le focus est sur un bouton radio
	.focus(function() {
		// On passe les notes supérieures à l'état inactif (par défaut)
		$$1(this).parent().parent().nextAll("div").children('label').addClass("note-off");
		// On passe les notes inférieures à l'état actif
		$$1(this).parent().parent().prevAll("div").children('label').removeClass("note-off");
		// On passe la note du focus à l'état actif (par défaut)
		$$1(this).parent().removeClass("note-off");
	})
	// Lorsque l'on sort du sytème de notation au clavier
	.blur(function() {
		// Si il n'y a pas de case cochée
		if($$1(this).parents("div.notes-echelle").find("label input:checked").length == 0) {
			// On passe toutes les notes à l'état inactif
			$$1(this).parents("div.notes-echelle").find("label").addClass("note-off");
		}
	});

	$$1(".control-selector2 div.notes-echelle input")
	// Lorsque le focus est sur un bouton radio
	.focus(function() {
		// On supprime les classes de focus
		$$1(this).parents("div.notes-echelle").find("label").removeClass("note-focus");
		// On applique la classe de focus sur l'item tabulé
		$$1(this).parent("label").addClass("note-focus");
		// [...] cf. code précédent
	})
	// Lorsque l'on sort du sytème de notation au clavier
	.blur(function() {
		// On supprime les classes de focus
		$$1(this).parents("div.notes-echelle").find("label").removeClass("note-focus");
		// [...] cf. code précédent
	})
	// Lorsque la note est cochée
	.click(function() {
		// On supprime les classes de note cochée
		$$1(this).parents("div.notes-echelle").find("label").removeClass("note-checked");
		// On applique la classe de note cochée sur l'item choisi
		$$1(this).parent("label").addClass("note-checked");
	});

	// On simule un survol souris des boutons cochés par défaut
	$$1(".control-selector2 div.notes-echelle input:checked").parent("label").trigger("mouseover");
	// On simule un click souris des boutons cochés
	$$1(".control-selector2 div.notes-echelle input:checked").trigger("click");
}

var timerLikePopinShow = null;
var timerLikePopinHide = null;
var flagLikeBtnMouseEnter = false; // indicate that mouse entered hover a btnLike
var flagLikePopinMouseEnter = false; // indicate that mouse entered hover a LikePopIn
var flagLikePopinDisplayed = false; // indicate that LikePopin is displayed or not

function showLikePopin(id, type, mouseX, mouseY) {

  if(flagLikeBtnMouseEnter === false) return;

  if(typeof(type) == "undefined") type = "data";

  if(!$$1(".likes-popin").length) $$1(document).find("body").append("<div class='likes-popin'></div>");

  flagLikePopinDisplayed = true;

  $$1(".likes-popin").unbind("mouseleave").bind("mouseleave", function(evt) {

    flagLikePopinMouseEnter = false;
    $$1(".likes-popin").hide();

  }).unbind("mouseenter").bind("mouseenter", function(evt) {

    flagLikePopinMouseEnter = true;

  });

  var popinWidth = 300;
  var popinHeight = 30;
  var positionLeft = mouseX + 10;
  var positionTop = mouseY + 10;
  if(positionLeft + popinWidth > $$1(window).width()) positionLeft = mouseX - popinWidth - 10;
  if(positionTop + popinHeight > $$1(window).height()) positionTop = mouseY - popinHeight - 10;

  $$1(".likes-popin").html("<center>Chargement...</center>");
  $$1(".likes-popin").css("left", positionLeft + "px").css("top", positionTop + "px");
  $$1(".likes-popin").fadeIn("fast");

  execQuery("get-likers", {
      id,
      type
    }, false)
    .then((json) => $$1(".likes-popin").html(base64Decode(json.content)));
}

function initLikesHover() {

  $$1(".btn-like").each(function() {

    var id = $$1(this).data("id");
    var type = $$1(this).data("type");

    var counter = $$1(this).find(".counter").html();

    if(id && (counter != "0")) {

      $$1(this).unbind("mouseenter").bind("mouseenter", function(e) {

        flagLikeBtnMouseEnter = true;

        if(timerLikePopinHide != null) clearTimeout(timerLikePopinHide);

        if(timerLikePopinShow !== null) clearTimeout(timerLikePopinShow);
        timerLikePopinShow = setTimeout(function() {
          showLikePopin(id, type, e.pageX, e.pageY);
        }, 500);

      }).unbind("mouseleave").bind("mouseleave", function() {

        if(timerLikePopinShow !== null) clearTimeout(timerLikePopinShow);

        flagLikeBtnMouseEnter = false;

        if(flagLikePopinDisplayed === true) {

          if(timerLikePopinHide != null) clearTimeout(timerLikePopinHide);

          timerLikePopinHide = setTimeout(function() {

            if(flagLikePopinMouseEnter === true) return;
            $$1(".likes-popin").hide();

          }, 500);

        } else {

          $$1(".likes-popin").hide();
        }
      });
    }
  });
}

// import 'bootstrap-stylus/js/modal';

// <--- control selector 2 functions
var controlFlagSelector2 = false;
var controlSelector2TimerSearch = null;

function controlSelector2Search(controlSelector2) {

  controlSelector2TimerSearch = null;

  var keywords = $$1(controlSelector2).find('.control-selector2-content-search-input').val().toLowerCase();

  if(keywords.length <= 0)
    return $$1(controlSelector2).find('.control-selector2-content-value').show();

  $$1(controlSelector2).find('.control-selector2-content-value').each(function() {
    var str = $$1(this).find('span').html();
    (str.toLowerCase().indexOf(keywords) >= 0) ? $$1(this).show(): $$1(this).hide();
  });
}

function controlSelector2Update(controlSelector2) {

  var ids = new Array();
  var str = new Array();

  $$1(controlSelector2).find('.control-selector2-content-checkbox:checked').each(function() {

    ids.push($$1(this).val());
    str.push('<span>' + $$1(this).parents('.control-selector2-content-value:first').find('span').html() + '</span>');
  });

  $$1(controlSelector2).find('.control-selector2-value').val(ids.join(','));
  $$1(controlSelector2).not('.control-selector2-radiobox').find('.control-selector2-label').html(str.join(''));
}

function controlSelector2Init() {

  var is_modal = false;
  if(window.screen.width < 900 || window.innerHeight < 600)
    is_modal = true;

  // <--- selector2 all
  $$1('.control-selector2').each(function() {

    var controlSelector2 = $$1(this);


    // <--- mouseEnter / mouseLeave
    $$1(controlSelector2).not('.control-selector2-radiobox').unbind('mouseenter').bind('mouseenter', function() {
      controlFlagSelector2 = true;
    }).unbind('mouseleave').bind('mouseleave', function() {
      controlFlagSelector2 = false;
    });
    // --->

    $$1(controlSelector2).not('.control-selector2-radiobox').find('.control-selector2-erase').unbind('click').bind('click', function() {

      $$1(controlSelector2).not('.control-selector2-radiobox').find('.control-selector2-value').val('');
      $$1(controlSelector2).not('.control-selector2-radiobox').find('.control-selector2-label').html('');

    });

    // <---- toggler
    $$1(controlSelector2).not('.control-selector2-radiobox').find('.control-selector2-toggler, .control-selector2-label').unbind('click').bind('click', function() {
      if($$1(controlSelector2).find('.control-selector2-content').is(':visible')) {

        $$1(controlSelector2).find('.control-selector2-content').hide();
        $$1(controlSelector2).find('.control-selector2-content-search-input').val('');
        $$1(controlSelector2).find('.control-selector2-content-value').show();

      } else {
        if(is_modal) {
          if($$1(controlSelector2).find('.control-selector2-modal').length == 0) {
            var temp = $$1(controlSelector2).find('.control-selector2-content').html();
            $$1(controlSelector2).find('.control-selector2-content').remove();
            $$1(controlSelector2).append(
              '<div class="modal modal-page control-selector2-modal"  tabindex="-1" role="dialog" style="z-index:9999999;" >\
								<div class="modal-dialog" style="width:500px; max-width:100%; margin-top:10%;">\
									<div class="modal-content">\
										<div class="modal-header">\
											<button type="button" class="closeModal modal-header-close" aria-hidden="true"><i class="glyphicon glyphicon-remove"></i></button>\
											<h2 class="modal-title">' + $$1(controlSelector2).parents('.form-field:first').find('.title').html() + '</h2>\
										</div>\
										<div class="modal-body " >\
											<div class="control-selector2-content mode-list" >\
												' + temp + '\
											<div>\
										</div>\
									</div>\
								</div>\
							</div>'
            );
            controlSelector2Init();
          }

          $$1(controlSelector2).find('.control-selector2-modal').modal('show');
          $$1(controlSelector2).parents('.modal-window .modal-window-container').css('overflow', 'visible');
          $$1(controlSelector2).find('.control-selector2-modal .control-selector2-content').show();

          // <--- "closem modal" click
          $$1(controlSelector2).find('.closeModal').unbind("click").bind("click", function() {
            $$1(controlSelector2).parents('.modal-window .modal-window-container').css('overflow', 'hidden');
            $$1(this).parents('.modal:first').modal('hide');
          });
          // --->
        } else {
          var offset = $$1(controlSelector2).offset();
          var w = $$1(controlSelector2).parents('.modal-window-content:first');

          if(w.length == 0)
            w = $$1(controlSelector2.parents('#page-content'));

          var espace_en_bas = w.height() - 370 - (offset.top - w.offset().top);
          var espace_en_haut = (offset.top - w.offset().top);

          $$1(controlSelector2).find('.control-selector2-content').show();

          if(espace_en_bas < -10 && espace_en_haut > 360) {
            $$1(controlSelector2).find(".control-selector2-content").css('height', $$1(controlSelector2).find(".control-selector2-content").css('max-height'));
            $$1(controlSelector2).find(".control-selector2-content").css('top', -($$1(controlSelector2).find(".control-selector2-content").height()));
            var input = $$1(controlSelector2).find(".control-selector2-content-search");
            $$1(controlSelector2).find(".control-selector2-content-values").after(input);
            //input.remove();
          } else {
            $$1(controlSelector2).find(".control-selector2-content").css('height', 'auto');
            $$1(controlSelector2).find(".control-selector2-content").css('top', 'auto');
            var input = $$1(controlSelector2).find(".control-selector2-content-search");
            $$1(controlSelector2).find(".control-selector2-content-values").before(input);
          }

          $$1(controlSelector2).find('.control-selector2-content-search-input').focus();
        }
      }
    });
    // --->
    //

    //
    // <--- search
    $$1(controlSelector2).not('.control-selector2-radiobox').find('.control-selector2-content-search-input').unbind('keyup').bind('keyup', function() {

      if(controlSelector2TimerSearch !== null)
        clearTimeout(controlSelector2TimerSearch);

      controlSelector2TimerSearch = setTimeout(function() {
        controlSelector2Search(controlSelector2);
      }, 500);

    });
    // search --->

    // <--- add value
    $$1(controlSelector2).find('.control-selector2-action-add-value-input').unbind('keydown').bind('keydown', function(evt) {
      if(evt.keyCode == 13)
        return false;
    });
    // add value --->

  });
  // selector2 all --->


  // <--- selector2 single
  $$1('.control-selector2').not('.control-selector2-multiple, .control-selector2-radiobox').each(function() {

    var controlSelector2 = $$1(this);

    $$1(controlSelector2).find('.control-selector2-content-value').unbind('click').bind('click', function() {

      var id = $$1(this).data('id');
      var str = $$1(this).find('span').html();

      $$1(controlSelector2).find('.control-selector2-value').val(id);
      $$1(controlSelector2).find('.control-selector2-label').html('<span>' + str + '<i class="control-selector2-erase glyphicon glyphicon-remove-circle" ></i></span>');

      $$1(controlSelector2).find('.control-selector2-content').hide();
      $$1(controlSelector2).find('.control-selector2-content-search-input').val('');
      $$1(controlSelector2).find('.control-selector2-content-value').show();

      $$1(controlSelector2).not('.control-selector2-radiobox').find('.control-selector2-erase').unbind('click').bind('click', function() {

        $$1(controlSelector2).not('.control-selector2-radiobox').find('.control-selector2-value').val('');
        $$1(controlSelector2).not('.control-selector2-radiobox').find('.control-selector2-label').html('');

      });

      if(is_modal) {
        $$1(controlSelector2).parents('.modal-window .modal-window-container').css('overflow', 'hidden');
        $$1(this).parents('.modal:first').modal('hide');
      }

      // maj notation
      if(controlSelector2.hasClass('control-notation')) {
        controlSelector2.trigger('change');
      }
    });

  });
  // selector2 single --->


  // <--- selector2 multiple
  $$1('.control-selector2.control-selector2-multiple').not('.control-selector2-radiobox').each(function() {

    var controlSelector2 = $$1(this);

    $$1(controlSelector2).find('.control-selector2-content-checkbox').unbind('change').bind('change', function() {

      if($$1(this).prop('checked') == true) {
        $$1(this).parents('.control-selector2-content-value:first').removeClass('selected').addClass('selected');
      } else {
        $$1(this).parents('.control-selector2-content-value:first').removeClass('selected');
      }

      controlSelector2Update(controlSelector2);
    });
  });
  // selector2 multiple --->

  // selector2 radiobox mode
  $$1('.control-selector2.control-selector2-radiobox').each(function() {

      var controlSelector2 = $$1(this);

      $$1(controlSelector2).find('.control-selector2-content-checkbox').unbind('change').bind('change', function() {
        controlSelector2Update(controlSelector2);
      });
    })
    // selector2 radiobox mode
}

function controlInitMultiSelect() {
  $$1('.multi-select').each(function() {
    var multiSelect = $$1(this);
    multiSelect.find('.multi-select-filters-first-checkboxs').each(function() {
      $$1(this).click(function() {
        //alert($(this).data('firstid'));
        //alert($(this).prop('checked'));
        if($$1(this).prop('checked')) {
          multiSelect.find('.multi-select-filters-second .multi-select-filter-second-' + $$1(this).data('firstid')).removeClass('hidden');
          multiSelect.find('.multi-select-filters-second .multi-select-filter-second-' + $$1(this).data('firstid') + ' .multi-select-filters-second-checkbox').prop('checked', true);
        } else {
          multiSelect.find('.multi-select-filters-second .multi-select-filter-second-' + $$1(this).data('firstid')).addClass('hidden');
          multiSelect.find('.multi-select-filters-second .multi-select-filter-second-' + $$1(this).data('firstid') + ' .multi-select-filters-second-checkbox').prop('checked', false);
        }
      });
    });
  });
}

function controlCloseSelectMultiple() {
  $$1(".input-select-multiple").removeClass("unfolded");
}

$$1(document).click(controlCloseSelectMultiple);

function controlInitSelectMultiple() {
  $$1(".input-select-multiple").each(function() {
    var elt = $$1(this);
    var separator = $$1(elt).data("separator");
    if(!separator) separator = ",";

    if($$1(elt).find(".arrow").length <= 0) $$1(this).append('<span class="arrow"></span>');

    $$1(elt).find(".arrow, .label").unbind("click").bind("click", function() {
      $$1(elt).toggleClass("unfolded");
    });

    tooltip($$1(elt).find(".label"));
    if($$1(elt).find(".label").html().length <= 0) {
      $$1(elt).find(".label").removeClass("placeholder").addClass("placeholder");
      $$1(elt).find(".label").html($$1(elt).find(".label").data("placeholder"));
    }

    $$1(elt).find("input[type=checkbox]").unbind("click").bind("click", function() {

      var value = "";
      var valueDisplayed = "";

      $$1(elt).find("input[type=checkbox]:checked").each(function() {

        value += (value.length <= 0) ? $$1(this).val() : separator + $$1(this).val();

        if($$1(this).parent().find("span").length > 0) {
          valueDisplayed += (valueDisplayed.length <= 0) ? $$1(this).parent().find("span").html() : ", " + $$1(this).parent().find("span").html();
        } else {
          valueDisplayed += (valueDisplayed.length <= 0) ? $$1(this).val() : ", " + $$1(this).val();
        }
      });

      if($$1(elt).find("input[type=hidden]").length > 0) $$1(elt).find("input[type=hidden]").val(value);

      $$1(elt).find(".label").attr("title", valueDisplayed);
      tooltip($$1(elt).find(".label"));

      if(valueDisplayed.length <= 0) {

        var placeholder = $$1(elt).find(".label").data("placeholder");
        if(typeof(placeholder) == "undefined") placeholder = "";
        $$1(elt).find(".label").removeClass("placeholder").addClass("placeholder");
        $$1(elt).find(".label").html(placeholder);

      } else {

        $$1(elt).find(".label").removeClass("placeholder");
        $$1(elt).find(".label").html(valueDisplayed);
      }
    });

    $$1(elt).find("li").unbind("mouseenter").bind("mouseenter", function() {
      $$1(this).removeClass("hovered").addClass("hovered");
    }).unbind("mouseleave").bind("mouseleave", function() {
      $$1(this).removeClass("hovered");
    });

    $$1(elt).click((e) => e.stopPropagation());
  });
}

function fieldFileSliderFastForward(elt) {

  var slider = $$1(elt).parents('.data-file-slider:first');
  var slidesCount = $$1(slider).find('.data-file-slide').length;

  $$1(slider).find('.data-file-slide').removeClass('data-file-slide-visible');
  $$1(slider).find('.data-file-slide:last').addClass('data-file-slide-visible');

  $$1(slider).find('.data-file-slider-counter').html(slidesCount + '/' + slidesCount);
}

// import 'blueimp-file-upload';

function controlInitFilesDatasSelector$1(elt, iddata) {

  $$1(document).bind('ondrop dragover', function(e) {
    e.preventDefault();
  });

  $$1(".control-data-upload-file").each(function() {

    var container = $$1(this).parents(".form-group-files");
    var modalWindow = $$1(container).parents('.modal-window');
    var displayMode = $$1(container).data('display-mode');

    $$1(this).bind('fileuploadsubmit', function(evt, data) {

      var fieldUid = $$1(container).find('.data-files-value').data('field-uid');
      var iddata = $$1(container).parents("#form-data").find("#data-iddata").val();
      var iddataType = $$1(container).parents("#form-data").find("#data-iddata-type").val();

      data.formData = {
        'iddata': iddata,
        'iddataType': iddataType,
        'fieldUid': fieldUid,
        'displayMode': displayMode
      };
    });

    $$1(this).fileupload({

      'dataType': 'json',

      'drop': function(e, data) {

      },
      'dropZone': container.parent(),
      'progressall': function(e, data) {

        var progress = parseInt(data.loaded / data.total * 100, 10);

        $$1(container).find('.progress').show();
        $$1(container).find('.progress .progress-bar').css('width', progress + '%');
      },

      'done': function(e, data) {

        $$1(modalWindow).find('.modal-window-modif').val('1');
        $$1(container).find('.progress').hide();
        $$1(container).find('.progress .progress-bar').css('width', '0');

        // FIXME: Fix to return promise and avoid all the 'isXX' methods
        if(!data)
          return displayError$1("Unknown error 1");

        var json = data.result;

        if(!json)
          return displayError$1("Unknown error 2");

        if(isAjaxError(json))
          return displayError$1(json.msg);

        if(isAjaxSuccess(json)) {

          displaySuccess$1(json.msg);

          if(json.ids) {

            var value = $$1(container).find(".data-files-value").val();

            for(var i = 0; i <= json.ids.length - 1; i++)
              value += ((value.length <= 0) ? "" : ",") + String(json.ids[i]);

            $$1(container).find(".data-files-value").val(value);
          }

          if(json.content) {
            if($$1(container).find('.data-files .data-file-slider').length > 0) {

              $$1(container).find(".data-files .data-file-slider").append(base64Decode(json.content));
              fieldFileSliderFastForward($$1(container).find(".data-files .data-file-slider .data-file-slide:first"));

            } else {
              $$1(container).find(".data-files").append(base64Decode(json.content));
            }

          }
        }
      }
    }); // fileupload()
  });
}

function getModalWindowMain() {

  if($$1(".modal-window").not(".minimized").length <= 0)
    return null;

  var fullPage = $$1(".full-page .modal-window");
  if($$1(".modal-window").not(".minimized").not(fullPage).length > 0)
    return $$1(".modal-window").not(".minimized").not(fullPage).first();
  else
    return $$1(".modal-window").not(".minimized").first();
}

function resizeModalsWindows() {
  $$1(".modal-window").not(".minimized").not(".full-page .modal-window").each(function() {
    resizeModalWindow($$1(this));
  });
}

function resizeModals() {

  var windowHeight = $$1(window).height();

  $$1(".modal.resizable").each(function() {

    var modalTop = 10;
    var modalHeaderHeight = $$1(this).find(".modal-header").height();
    var modalBodyHeight = windowHeight - (modalTop + modalHeaderHeight + 70);
    $$1(this).find(".form-content").css("height", modalBodyHeight + "px");
  });
}

function hidePopinDatasHover() {
  $$1('#popin-datas-hover').hide();
}

// import 'public-source/js/core/jquery-bundles/fancybox';
// import 'public-source/js/addins/jquery/ui-datetime';
// import 'public-source/3rdpart/jquery.li-scroller';

var timerDatasHover = null;
var currentIddataHover = null;
var flagDatasHover = false;
var flagPopInDatasHover = false;

function showPopinDatasHover() {
  $$1('#popin-datas-hover').show();
}

function initPopinDatasHover(elm) {

  if($$1(document).find("body").find("#popin-datas-hover").length > 0)
    return true;

  $$1(document).find("body").append('\
		<div id="popin-datas-hover">\
			<div class="content"></div>\
		</div>\
	');

  $$1('#popin-datas-hover').unbind('mouseenter').bind('mouseenter', function() {
    flagPopInDatasHover = true;
  }).unbind('mouseleave').bind('mouseleave', function() {
    flagPopInDatasHover = false;

    setTimeout(function() {
      if(!flagPopInDatasHover) hidePopinDatasHover();
    }, 500);
  });

  elm.unbind('mouseleave').bind('mouseleave', function() {
    flagPopInDatasHover = false;

    setTimeout(function() {
      if(!flagPopInDatasHover) hidePopinDatasHover();
    }, 500);
  });


  $$1(document).bind("mousedown", function() {
    if(flagPopInDatasHover === false)
      $$1('#popin-datas-hover').hide();
  });
}

function displayPopinDatasHover(content, elm) {

  initPopinDatasHover(elm);

  $$1('#popin-datas-hover .content').html(content);
  $$1('#popin-datas-hover').css('left', mouseX + 'px').css('top', mouseY + 'px');
  showPopinDatasHover();
}

function controlCalculationInit() {
  $$1('.control-notation').each(function(i, control) {
    let $modalWindow = getModalWindowMain();
    if(!$modalWindow) {
      return;
    }

    $modalWindow = $$1($modalWindow);

    const $calculation = $modalWindow.find('.calculation');
    const $textControls = $modalWindow.find('.control-texte-notation');
    const $nonTextControls = $modalWindow.find('.control-notation:not(.control-texte-notation)');

    if(!$calculation.val()) {
      $calculation.val('0');
    }

    $$1(control).change(() => {
      $calculation.each((i, calc) => {
        const $calc = $$1(calc);
        const formule = $calc.data('formule');
        const precision = Math.pow(10, Number($calc.data('precision')));
        let num = 0;

        if(formule === 'auto') {
          let total = 0;

          $nonTextControls.each((i, cont) => {
            const $cont = $$1(cont);
            const choice = $cont.children('input').val();

            if(choice) {
              const content = Number($cont.find(`.control-selector2-content-value[data-id="${choice}"]`).data('note'));
              if(!isNaN(content)) {
                total += content;
              }
            }

            num++;
          });

          $textControls.each((i, cont) => {
            const content = Number(cont.value);
            if(!isNaN(content)) {
              total += content;
            }
            num++;
          });

          num = total / num;
        } else {
          // FIXME: Can maybe be done simpler this look up

          const reg = /fielduid-([A-z0-9\-_]+)/ig;

          let newformule = formule;
          let match;

          while(match = reg.exec(formule)) { // eslint-disable-line no-cond-assign
            const $uidControl = $modalWindow.find(`.control-notation[data-uid="${match[1]}"]`);
            let content;

            if($uidControl.length > 0) {
              const uid = $uidControl.val();
              content = $uidControl.find(`.control-selector2-content-value[data-id="${uid}"]`).data('note');
            } else {
              content = $modalWindow.find(`#data-${match[1]}`).val();
            }

            content = Number(content);

            if(!isNaN(content)) {
              newformule = newformule.replace(match[0], content);
            }
          }

          if(!reg.exec(newformule)) {
            num = eval(newformule); // eslint-disable-line no-eval
          }
        }

        calc.value = !num ? 0 : Math.round(num * precision) / precision;
      });
    });
  });
}


function showSelectorHover(iddata, datatype, uid, elm) {

  if(iddata != currentIddataHover)
    return false;

  execQuery('get-data-selector', {
      'iddata': iddata,
      'datatype': datatype,
      'uid': uid,
      'text': $$1(elm).text()
    })
    .then((json) => displayPopinDatasHover(base64Decode(json.content), elm));
}

function showDatasHover(iddata, elm) {

  if(iddata != currentIddataHover)
    return false;

  execQuery('get-data-relations', {
      'iddata': iddata,
      'text': $$1(elm).text()
    })
    .then((json) => displayPopinDatasHover(base64Decode(json.content), elm));
}

function initDatasHover() {

  $$1(".data-hoverable").unbind("mouseenter").bind("mouseenter", function() {

    flagDatasHover = true;

    var elt = $$1(this),
      field = null;

    var isSelectData = elt.parent().hasClass('control-selector-label');

    if(!isSelectData)
      field = elt.parents('.control-selector2').first();

    currentIddataHover = $$1(elt).data('id');

    if(timerDatasHover != null)
      clearTimeout(timerDatasHover);

    timerDatasHover = setTimeout(function() {
      if(isSelectData)
        showDatasHover($$1(elt).data('id'), elt);
      else
        showSelectorHover($$1(elt).data('id'), field.data('type'), field.data('uid'), elt);
    }, 100);

  }).unbind("mouseleave").bind("mouseleave", function() {

    flagDatasHover = false;

    if(timerDatasHover != null)
      clearTimeout(timerDatasHover);
  });
}

/**
 * Function AddTweets
 *  Show tweet in footer of the page
 */
function AddTweets() {
  var modalWindow = getModalWindowMain();

  var url = $$1(modalWindow).find('#zone-twitter').data('addrtwitter');
  if(url) {

    // search crawling information
    execQuery('get-twitter-tweets', {
        'url': url,
        'count': 5
      })
      .then((json) => {
        $$1('#zone-twitter').append(json.data);
        if(json.resType == 'ok')
          $$1("#container-twitter").liScroll({
            travelocity: 0.05
          });
      })

  }

}

function updateDatasInformations(modalWindow) {

  $$1(modalWindow).find('.data-user-creation').each(function() {
    (trim($$1(this).html()).length <= 0) ? $$1(this).hide(): $$1(this).show();
  });

  $$1(modalWindow).find('.data-user-update').each(function() {
    (trim($$1(this).html()).length <= 0) ? $$1(this).hide(): $$1(this).show();
  });
}

function controlInitDatepickers() {
  $$1('[datepicker]').each(function() {
    var elt = $$1(this);
    if(elt.hasClass('hasDatepicker')) {
      return;
    }
    var callPicker = elt.attr('datepicker');
    elt[callPicker]({
      //altField: elt,
      beforeShow: function(input) {
        $$1(input).css('z-index', 1000);
      },
      onClose: function(txt, input) {
        $$1(input).css('z-index', 'auto');
      }
    });
    elt.click(function() {
      $$1(this)[callPicker]('show');
    });
    elt.parent().find('.data-datepicker').click(function() {
      elt[callPicker]('show');
    });

  });
}

function controlLinkFindWebsiteRow(container) {
  var row = false;
  var type = false
    // case link multiple
  $$1('.data-container .row-link', container).each(function() {
    type = 'linkmultiple';
    if(row)
      return;
    var title = $$1(this).find('.link-title').val();

    var regex = new RegExp("^(site|site web|site internet|web site)$", "i");
    if(regex.test(title)) {
      row = $$1(this);
    }
  });
  // case link single
  $$1('.input-container .row-link', container).each(function() {
    type = 'linksingle';
    row = $$1(this);
  });
  // case input
  if(!type)
    $$1('input', container).each(function() {
      if(row)
        return;
      row = $$1(this).parent();
    });
  return row;
}

function initWatcher() {
  $$1('[watcher-change-website]').each(function() {
    var $form = $$1(this).parents('form');
    var field = $$1(this).attr('watcher-change-website');
    var fieldwebsite = controlLinkFindWebsiteRow($form.find('#form-group-' + field));
    if(fieldwebsite) {
      var newval = $$1(this).text();
      var selector = '.link-url';
      if(fieldwebsite.find(selector).length == 0)
        selector = 'input';
      var fieldval = $$1(fieldwebsite.find(selector).get(0));
      if(fieldval.val() != newval) {
        $$1('<div class="tooltip_action" value="' + newval + '"><span class="crawler_notif">Remplacer par ' + newval + '</span></div>')
          .click(function() {
            $$1(this).parent().find(selector).val($$1(this).attr('value')).trigger('change');
            $$1(this).remove();
          })
          .insertBefore(fieldval);
      }
    }
  })
}


// NOTE: Include as 'onready'

var timerCheckSocialContainerMobile = null;
function finalizeLoadData() {
  const modalWindow = getModalWindowMain();

  $$1(document).trigger('finalize.loaddata');

  tinyMCE$1();
  navTabs();
  tooltip();
  placeholder();
  tableSelector();
  formRequester();
  initKeywordHover();
  initDatasHover();
  stars();
  initWatcher();

  $$1('.fancybox').fancybox();

  initLikesHover();

  controlInitDatasSelector();
  controlInitSelectMultiple();
  controlInitFilesDatasSelector$1();
  controlInitMultiSelect();
  controlSelector2Init();
  controlCalculationInit();
  controlInitDatepickers();

  resizeModals();



  if(modalWindow === null)
    return false;

  updateDatasInformations(modalWindow);

  // to avoid tinyMce focus scrollBottom
  $$1(modalWindow).find(".modal-window-content").scrollTop(0);

  $$1(modalWindow).find(".modal-window-content").scroll(function() {
    if($$1(window).width() < 768) {
      $$1(modalWindow).find('.button-social-container-mobile').fadeIn();
      if(timerCheckSocialContainerMobile != null) clearTimeout(timerCheckSocialContainerMobile);
      timerCheckSocialContainerMobile = setTimeout(function() {
        $$1(modalWindow).find('.button-social-container-mobile').fadeOut();
      }, 1500);
    }
  });

  resizeFormFields();
  AddTweets();

  //On lance la requete de matchinf uniquement si on est pas en creation
  var idData = $$1(modalWindow).find('#data-iddata').val()
  if($$1(window).width() >= 768 && idData > 0) {
    execQuery("update-modal-window-kindex-matching", {
        'iddata': $$1(modalWindow).find('#data-iddata').val(),
        'iddataType': $$1(modalWindow).find('#data-iddata-type').val(),
        'iddataDisplay': $$1(modalWindow).find('#data-iddata-display').val(),
        'createKindex': false
      }, false)
      .then((json) => {
        if(isNumber(json.kindexModalDisplay)) {
          var kindexdata = stringToJSON(json.kindexModalData);

          //On met a jour le nombre de matching
          $$1(modalWindow).find('.button-social-match').append('<span class="counter">' + kindexdata.length + '</span>');
          $$1(modalWindow).find('.button-social-match').css('visibility', 'visible');

          //On cree la fenetre des matching
          displayKindexModal(modalWindow, kindexdata, false);
        } else {
          $$1(modalWindow).find('.button-social-match').css('visibility', 'hidden');
        }
      });
  }
}

function renderData(modalWindow, json) {

  // <--- update modal window UID if need
  var modalWindowUid = $$1(modalWindow).find(".modal-window-uid").val();

  if(typeof(modalWindowUid) != 'undefined' && (modalWindowUid.indexOf("create-data") >= 0) && (isNumber(json.iddata))) {
    var modalWindowButton = getModalWindowButton(modalWindow);
    $$1(modalWindow).find(".modal-window-uid").val("data-" + json.iddata);
    $$1(modalWindowButton).find(".modal-window-button-uid").val("data-" + json.iddata);
  }
  // --->

  // <--- set some variables contents
  if(json.dataTitle)
    setModalWindowTitle(modalWindow, json.dataTitle);

  if(json.dataHeader)
    setModalWindowHeader(modalWindow, json.dataHeader);

  if(json.dataFooter)
    setModalWindowFooter(modalWindow, json.dataFooter);

  if(json.dataContainer)
    setModalWindowContainer(modalWindow, base64Decode(json.dataContainer));

  if(json.iddata && ($$1(modalWindow).find("#data-iddata").length > 0))
    $$1(modalWindow).find("#data-iddata").val(json.iddata);
  else {
    if(json.iddata && ($$1('#page-content').find("#data-iddata").length > 0))
      $$1('#page-content').find("#data-iddata").val(json.iddata);
  }

  if(json.url && ($$1(modalWindow).find("#data-url").length > 0))
    $$1(modalWindow).find("#data-url").val(json.url);

  // <--- kindex
  if(json.kindexColorBg && json.kindexColorBg != '')
    $$1(modalWindow).find(".modal-window-before-footer").css("background-color", json.kindexColorBg);
  if(json.kindexColorText && json.kindexColorText != '') {
    $$1(modalWindow).find(".modal-window-before-footer .before-footer").css("color", json.kindexColorText);
    $$1(modalWindow).find(".modal-window-before-footer .link-nu").css("color", json.kindexColorText);
  }
  if(json.kindexColorLink && json.kindexColorLink != '')
    $$1(modalWindow).find(".modal-window-before-footer .link-nu").css("border-color", json.kindexColorLink);
  if(json.kindexDisplayWaitingMsg && json.kindexDisplayWaitingMsg != '')
    $$1(modalWindow).find('.display-kindex-waitingmsg').val(json.kindexDisplayWaitingMsg);
  // kindex --->


  // <--- fields callback update
  if(json.fields) {
    for(var i = 0; i <= json.fields.length - 1; i++) {
      var fieldUid = json.fields[i].uid;
      if($$1(modalWindow).find("#" + fieldUid).length > 0)
        $$1(modalWindow).find("#" + fieldUid).val(json.fields[i].value);
    }
  }
  // --->

  setTimeout(function() {
    finalizeLoadData();
    initUserHover$1();
  }, 100);
}

// FIXME: Used in 'onclick'

function consultData$1(iddata, options) {

  if(typeof(iddata) == "object") {
    var container = iddata;
    iddata = $$1(container).parents(".modal-window").find("#data-iddata").val();
  }

  iddata = Number(iddata);

  if(!options) options = {};
  if(!iddata || !isNumber(iddata)) return displayError$1("Veuillez enregistrer avant d'effectuer cette opération");
  //options.minifiche = true;
  var modalWindow = pushModalWindow("data-" + iddata, options);
  if(modalWindow === null) return false;

  setModalWindowLoading(modalWindow);

  execQuery("consult-data", {
      'sourceIddata': options.sourceIddata,
      iddata,
      options
    }, false)
    .then((json) => {
      if(json.type === 'message') {
        closeModalWindow$1(modalWindow);
        hideModalWindowOverlay$1();
        displayMessage(json.msg);
      } else {
        renderData(modalWindow, json);
      }
    })
    .catch((err) => {
      closeModalWindow$1(modalWindow);
      hideModalWindowOverlay$1();
      displayMessage(err.msg ? err.msg : err);
    });
}

function removeItemSelector(control, iditem) {
  $$1(control).find('.control-selector-search-container-down li[data-id=' + iditem + '] .control-selector-content-checkbox').prop('checked', false);
  $$1(control).find('.control-selector-search-container-down li[data-id=' + iditem + '] ').removeClass('selected');

  var span = $$1(control).find('.control-selector-label span[data-id=' + iditem + ']');

  formModyfied(span);

  var id = $$1(span).data("id");
  hideTooltip(span);
  var flagExists = false;
  if($$1(control).find('input.data-add').length > 0) { // data-value is present for field select users & select groups ie

    var dataAdd = $$1(control).find('input.data-add').val().split(',');
    var dataAddFinal = new Array();
    for(var i = 0; i <= dataAdd.length - 1; i++) {
      flagExists = true;
      if(dataAdd[i] != id)
        dataAddFinal.push(dataAdd[i]);
    }

    $$1(control).find('input.data-add').val(dataAddFinal.join(','));
  }

  if($$1(control).find('input.data-value').length > 0) { // data-value is present for field select users & select groups ie

    var dataValue = $$1(control).find('input.data-value').val().split(',');
    var dataValueFinal = new Array();
    for(var i = 0; i <= dataValue.length - 1; i++)
      if(dataValue[i] != id)
        dataValueFinal.push(dataValue[i]);

    $$1(control).find('input.data-value').val(dataValueFinal.join(','));

  } else { // data-add is present for field select data ie

    if($$1(control).find('input.data-remove').length > 0) {
      var dataRemove = $$1(control).find('input.data-remove').val().split(',');
      flagExists = false;
      for(var i = 0; i <= dataRemove.length - 1; i++)
        if(dataRemove[i] == id)
          flagExists = true;

      if(!flagExists) {
        dataRemove.push(id);
        $$1(control).find('input.data-remove').val(dataRemove.join(','));
      }
    }
  }

  // remove the span
  //$(span).remove();
  $$1(control).find(".control-selector-label span .glyphicon").parent('[data-id="' + id + '"]').remove();

  // display or not the placeholder
  ($$1(control).find(".control-selector-label span").length > 0) ? $$1(control).find(".control-selector-placeholder").hide(): $$1(control).find(".control-selector-placeholder").show();
}

// import 'bootstrap-stylus/js/modal';

let controlFlagSelector = false;

function controlSelectorClose() {
  $$1('.control-selector').find('.control-selector-search-container-down').hide();
  controlFlagSelector = false;
}

function controlDatasSelectorGetIds(control) {
  var ids = "";
  $$1(control).find(".control-selector-label span").each(function() {
    ids += ((ids.length <= 0) ? "" : ",") + String($$1(this).data("id"));
  });
  return ids;
}

function controlSelectorShowNewValue(elt) {
  $$1(elt).parents('.control-selector:first').find('.control-selector-overlay').show();
  $$1(elt).parents('.control-selector:first').find('.control-selector-content-action-add-value').fadeIn('fast');
  $$1(elt).parents('.control-selector:first').find('.control-selector-content-action-add-value .control-selector-action-add-value-input').focus();
  $$1(elt).parents('.control-selector:first').find('.control-selector-content-action-add-value').find('.alert').hide();
}

function controlSelectorCancelNewValue(elt) {
  $$1(elt).parents('.control-selector-content-action-add-value:first').hide();
  $$1(elt).parents('.control-selector:first').find('.control-selector-overlay').hide();
}

function getDataSelector(control) {

  hideTooltip($$1(control).find('.control-selector-search li'));

  var currentIds = controlDatasSelectorGetIds(control);
  //var search = $(control).find(".control-selector-search .control-selector-search-input").val();
  $$1(control).find(".control-selector-search .control-selector-search-input").val('')
  var search = '';
  var params = $$1(control).data("params");
  var kindex = $$1(control).attr("data-kindex");
  var kindexhaveproposition = $$1(control).data("kindex-haveproposition");
  var query = $$1(control).data("query");
  var iddata = $$1(control).parents("#form-data").find("#data-iddata").val();
  var uid = $$1(control).data("uid");
  var kindexdata = $$1(control).data("kindexinfos");

  //for keywords bundle we check if data are modified to reindex
  var modalWindow = getModalWindow$1(control);
  var reindex = false;
  var tempkindex = $$1(control).attr("data-tempkindex");
  if($$1(modalWindow).find('.modal-window-modif').val() == '1' && (query == 'get-keywords-selector-list') && search == '') {
    $$1(control).find(".control-selector-search ul").html("<li><center>Recherche en cours (réindexation de la fiche)..</center></li>");
    reindex = true;
  } else
    $$1(control).find(".control-selector-search ul").html("<li><center>Recherche en cours..</center></li>");

  if(!query) return false;

  /*if ((! $(control).data("allow-full-list") ) && (search.length<=0)) {
  	$(control).find(".control-selector-search ul").html("<li><center>Veuillez saisir un ou plusieurs mots-clés de recherche</center></li>");
  	return false;
  }*/

  execQuery(query, {
      'ids': currentIds,
      'search': search,
      'params': params,
      'kindex': kindex,
      'iddata': iddata,
      'kindexhaveproposition': kindexhaveproposition,
      'uid': uid,
      'kindexdata': kindexdata,
      'iddatatype': $$1(control).parents("#form-data").find("#data-iddata-type").val(),
      'form-datas': reindex ? $$1(control).parents("#form-data").serializeArray() : null,
      'tempkindex': tempkindex,
      'field': $$1(control).data("field")
    })
    .then((json) => {
      if(json.tempkindex)
        $$1(control).attr("data-tempkindex", json.tempkindex)
      else
        $$1(control).removeAttr("data-tempkindex");

      var content = stringToJSON(base64Decode(json.content));
      if(typeof(content) == "undefined") return false;

      $$1(control).find(".control-selector-search ul").html("").append(content);

      controlInitDatasSelector();
    })
    .catch(() => $$1(control).find(".control-selector-search ul").html("<li><center>Aucun résultat</center></li>"));

}

function controlSelectorValidNewValue(elt) {

  $$1(elt).parents('.control-selector-content-action-add-value:first').find('.alert').hide();

  var value = $$1(elt).parents('.control-selector-content-action-add-value:first').find('.control-selector-action-add-value-input').val();

  $$1(elt).parents('.control-selector-content-action-add-value:first').find('.btn').hide();
  $$1(elt).parents('.control-selector-content-action-add-value:first').find('.wait').show();

  if(value.length <= 0) {
    $$1(elt).parents('.control-selector-content-action-add-value:first').find('.alert').html('Veuillez saisir une valeur');
    $$1(elt).parents('.control-selector-content-action-add-value:first').find('.alert').fadeIn('fast');
    $$1(elt).parents('.control-selector-content-action-add-value:first').find('.btn').show();
    $$1(elt).parents('.control-selector-content-action-add-value:first').find('.wait').hide();
    return false;
  }

  execQuery("kindex-add-word", {
      'word': value
    })
    .then((json) => {
      $$1(elt).parents('.control-selector-content-action-add-value:first').find('.btn').show();
      $$1(elt).parents('.control-selector-content-action-add-value:first').find('.wait').hide();

      var controlSelector = $$1(elt).parents('.control-selector:first');

      var span = $$1("<span data-id='" + json.id + "'>" + value + "<i class='glyphicon glyphicon-remove-circle'></i></span>");
      $$1(controlSelector).find(".control-selector-label").append(span);
      $$1(controlSelector).find(".control-selector-search .control-selector-search-input").val('');
      if($$1(controlSelector).find('input.data-value').length > 0) { // data-value is present for field select users & select groups ie

        var dataValue = $$1(controlSelector).find('input.data-value').val().split(',');
        var flagExists = false;
        for(var i = 0; i <= dataValue.length <= 0; i++)
          if(dataValue[i] == json.id)
            flagExists = true;

        if(!flagExists) dataValue.push(json.id);
        $$1(controlSelector).find('input.data-value').val(dataValue.join(','));

      } else { // data-add is present for field select data ie

        var dataAdd = $$1(controlSelector).find('input.data-add').val().split(',');
        dataAdd.push(json.id);
        $$1(controlSelector).find('input.data-add').val(dataAdd.join(','));
      }
      //$(control).find(".control-selector-search .control-selector-search-input").trigger("keyup");
      getDataSelector(controlSelector);

      $$1(controlSelector).find('.control-selector-content-action-add-value-input').val('');
      $$1(controlSelector).find('.control-selector-content-action-add-value').hide();
      $$1(controlSelector).find('.control-selector-overlay').hide();

      controlInitDatasSelector();

      displaySuccess$1(json.msg);
    })
    .catch((err) => {
      $$1(elt).parents('.control-selector-content-action-add-value:first').find('.btn').show();
      $$1(elt).parents('.control-selector-content-action-add-value:first').find('.wait').hide();

      if(err.type !== 'err') {
        return;
      }

      $$1(elt).parents('.control-selector-content-action-add-value:first').find('.alert').html(err.msg);
      $$1(elt).parents('.control-selector-content-action-add-value:first').find('.alert').fadeIn('fast');
    });

}

function controlSelectorSearch(control) {

  controlSelectorTimerSearch = null;
  $$1(control).find('.control-selector-search .noresult').remove();

  var keywords = $$1(control).find('.control-selector-search-input').val().toLowerCase();

  if(keywords.length <= 0)
    return $$1(control).find('.control-selector-search li').show();

  var nbresult = 0;
  $$1(control).find('.control-selector-search li').not('.noclick').each(function() {
    var str = $$1(this).find('div:first').text();
    if(str.toLowerCase().indexOf(keywords) >= 0) {
      $$1(this).show();
      nbresult++;
    } else {
      $$1(this).hide();
    }
  });
  if(nbresult == 0) {
    $$1(control).find('.control-selector-search ul').append('<li class="noresult" ><div>Aucun resultat</div></li>');
  }
}









$$1(document).click(function() {
  if(controlFlagSelector && !controlFlagSelector)
    controlSelectorClose();
});

var controlSelectorTimerSearch = null;
function controlInitDatasSelector() {

  tooltip();
  initKeywordHover();

  $$1(".control-selector").each(function() {

    var control = $$1(this);
    var is_modal = false;
    if(window.screen.width < 900 || window.innerHeight < 600)
      is_modal = true;

    // <--- mouseEnter / mouseLeave
    $$1(control).unbind('mouseenter').bind('mouseenter', function() {
      controlFlagSelector = true;
    }).unbind('mouseleave').bind('mouseleave', function() {
      controlFlagSelector = false;
    });
    // --->
    var forceModal = $$1(control).data("force-modal");
    var allowFullList = true; // on force toute la liste car le si elle est a false ca ne fonctionne pas mais ce n'est pas necesaire $(control).data("allow-full-list");
    var iskindex = $$1(control).data("kindex");
    var kindexsortdefault = $$1(control).data("kindex-sort-default");
    var haveProposition = $$1(control).data("kindex-haveproposition");
    if(!allowFullList) allowFullList = false;

    if(forceModal == 1)
      is_modal = true;

    // <-- append "arrow" DOM element if not existing
    if($$1(control).find(".no-selectable").length <= 0) {
      if($$1(control).find(".control-selector-label .arrow").length <= 0) {
        $$1(this).find(".control-selector-label").append("<div class='arrow'><i class='glyphicon glyphicon-chevron-down' ></i></div>");
        if(haveProposition)
          $$1(control).find(".control-selector-label .arrow").addClass('arrowred');
      }
    }
    // --->


    // append "placeholder" DOM element if not existing
    if($$1(control).find(".control-selector-placeholder").length <= 0) {
      var placeholder = $$1(control).find(".control-selector-label").data("placeholder");
      if(placeholder && placeholder != '') $$1(control).append("<div class=\"control-selector-placeholder\">" + placeholder + "</div>");
    }
    // --->

    // if no "span" element exists show the "placeholder", hide it else
    ($$1(control).find(".control-selector-label span").length > 0) ? $$1(control).find(".control-selector-placeholder").hide(): $$1(control).find(".control-selector-placeholder").show();

    var add_button = '';
    if($$1(control).data("can-create-keyword") == 1) {
      add_button = '<div class="btn-add-details">\
								<button class="btn btn-xs " type="button">\
								<i class="glyphicons glyphicons-plus"></i>&nbsp;Créer un mot clé\
								</button>\
							</div>\
							<div class="control-selector-overlay"></div>\
							<div class="control-selector-content-action-add-value">\
								<div class="alert alert-danger">Message d\'erreur</div>\
								<p>Saisissez la nouvelle valeur</p>\
								<input type="text" class="form-control control-selector-action-add-value-input" />\
								<div class="clearfix"></div>\
								<button type="button" class="btn btn-default btn-sm pull-left" style="margin:15px 10px 0 0">Ok</button>\
								<button type="button" class="btn btn-default btn-sm pull-left" style="margin:15px 10px 0 0;">Annuler</button>\
								<p class="wait" style="display:none; margin:15px 0 0 0">Veuillez patienter</p>\
								<div class="clearfix"></div>\
							</div>';
    }

    // <--- append "search-container" DOM element if not existing
    if(!is_modal) {
      if($$1(control).find(".control-selector-search-container-down").length <= 0) {

        var values = $$1(control).find(".control-selector-label").html();
        var titremodal = $$1(control).find(".control-selector-label").data("placeholder");

        var helpdesc = '';
        if(typeof($$1(control).find(".control-selector-label").data("desc-edit")) != 'undefined')
          helpdesc = $$1(control).find(".control-selector-label").data("desc-edit");

        var menu;
        if(iskindex) {
          menu = '<table style="width:100%" ><tr><td><input type="text" class="control-selector-search-input" placeholder="Mots-clés de recherche" /></td>\
								<td style="font-size: 14pt;width:20px;" ><span><i data-title="Trier par ordre alphabétique" class="sort glyphicon ' + (kindexsortdefault != 'pertinence' ? 'selected' : '') + ' glyphicon-sort-by-alphabet tooltiped" data-toggle="tooltip" data-placement="top"  ></i></span></td>\
								<td style="font-size: 14pt;width:20px;" ><span><i data-title="Trier par ordre de pertinence" class="sort sortkindex ' + (kindexsortdefault == 'pertinence' ? 'selected' : '') + ' glyphicon glyphicon-sort-by-attributes-alt tooltiped" data-toggle="tooltip" data-placement="top" ></i></span></td></tr></table>';
          if(kindexsortdefault != 'pertinence')
            $$1(control).attr("data-kindex", '0');
        } else {
          menu = '<input type="text" class="control-selector-search-input" placeholder="Mots-clés de recherche" />';
        }

        const $selector = $$1('<div class="control-selector-search-container-down" ><div class="control-selector-search">\
					<div class="control-selector-search-input-container" >' + menu + '</div>\
					<ul></ul>\
					' + add_button + '\
				</div></div>');

        $selector.find('.btn-add-details button').click((e) => controlSelectorShowNewValue(e.currentTarget));

        $selector.find('.control-selector-content-action-add-value button').each((i, elm) => {
          const $elm = $$1(elm);
          if($elm.text() === 'Ok') {
            $elm.click(() => controlSelectorValidNewValue(elm));
          }
          if($elm.text() === 'Annuler') {
            $elm.click(() => controlSelectorCancelNewValue(elm));
          }
        });

        $$1(control).append($selector);
      }
    } else {
      // <--- append "search-container" DOM element if not existing
      if($$1(control).find(".control-selector-search-container").length <= 0) {

        var values = $$1(control).find(".control-selector-label").html();
        var titremodal = $$1(control).find(".control-selector-label").data("placeholder");

        var helpdesc = '';
        if(typeof($$1(control).find(".control-selector-label").data("desc-edit")) != 'undefined')
          helpdesc = $$1(control).find(".control-selector-label").data("desc-edit");

        var menu;
        if(iskindex) {
          menu = '<table style="width:100%" ><tr><td><input type="text" class="control-selector-search-input" placeholder="Mots-clés de recherche" /></td>\
								<td style="font-size: 14pt;width:20px;" ><span><i data-title="Trier par ordre alphabétique" class="sort glyphicon ' + (kindexsortdefault != 'pertinence' ? 'selected' : '') + ' glyphicon-sort-by-alphabet tooltiped" data-toggle="tooltip" data-placement="top"  ></i></span></td>\
								<td style="font-size: 14pt;width:20px;" ><span><i data-title="Trier par ordre de pertinence" class="sort sortkindex ' + (kindexsortdefault == 'pertinence' ? 'selected' : '') + ' glyphicon glyphicon-sort-by-attributes-alt tooltiped" data-toggle="tooltip" data-placement="top" ></i></span></td></tr></table>';
          if(kindexsortdefault != 'pertinence')
            $$1(control).attr("data-kindex", '0');
        } else {
          menu = '<input type="text" class="control-selector-search-input" placeholder="Mots-clés de recherche" />';
        }
        $$1(control).append(
          '<div class="modal modal-page control-selector-search-container"  tabindex="-1" role="dialog" style="z-index:9999999;" >\
						<div class="modal-dialog" style="width:700px; max-width:100%; margin-top:5%;">\
							<div class="modal-content">\
								<div class="modal-header">\
									<button type="button" class="closeModal modal-header-close" aria-hidden="true"><i class="glyphicon glyphicon-remove"></i></button>\
									<h2 class="modal-title">' + titremodal + '</h2>\
									<div class="description-text" >' + helpdesc + '</div>\
								</div>\
								<div class="modal-body" >\
									<div class="control-selector-label" style="max-height: 193px" >\
									' + values + '\
									</div>\
									<div class="control-selector-search">\
											<div class="control-selector-search-input-container" >' + menu + '</div>\
											<ul></ul>\
											' + add_button + '\
									</div>\
								</div>\
								<div class="modal-footer">\
									<button type="button"  class="closeModal btn btn-default pull-right" id="cancel">Ok</button>\
									<div class="clearfix"></div>\
								</div>\
							</div>\
						</div>\
					</div>'
        );
      }
    }
    if($$1(control).find(".btn-add-details").length == 0 && $$1(control).find(".btn-add-display").length > 0) {
      var mydiv = $$1('<div class="btn-add-details" ></div>');
      mydiv.append($$1(control).find(".btn-add-display").html());
      $$1(control).find(".control-selector-search-container-down").append(mydiv);
      $$1(control).find(".btn-add-display").remove();
    }
    // --->


    // ???
    $$1(control).find(".control-selector-search-container .control-selector-label i").remove();


    // append the "remove-circle" glyphicon to each span haven't one
    if($$1(control).find(".no-deletable").length <= 0) {
      $$1(control).find(".control-selector-label span:not(:has(.glyphicon))").append("<i class='glyphicon glyphicon-remove-circle'></i>");
    }


    // <-- sort click
    $$1(control).find(".sort").unbind("click").bind("click", function() {
      if(!$$1(this).hasClass('selected')) {
        $$1(control).find(".sort").removeClass('selected');
        $$1(this).addClass('selected');
        if($$1(this).hasClass('sortkindex')) {
          $$1(control).attr("data-kindex", '1');
        } else
          $$1(control).attr("data-kindex", '0');

        getDataSelector(control);
      }
    });
    // --->


    // <--- "closem modal" click
    $$1(control).find('.closeModal').unbind("click").bind("click", function() {
      $$1(control).parents('.modal-window .modal-window-container').css('overflow', 'hidden');
      $$1(this).parents('.modal:first').modal('hide');
    });
    // --->

    // <--- "arrow" click
    if($$1(control).find(".no-selectable").length <= 0) {
      $$1(control).find(".control-selector-label .arrow, .control-selector-placeholder").unbind("click").bind("click", function() {

        if($$1(this).hasClass('arrowred'))
          $$1(this).removeClass('arrowred');

        if(!is_modal) {
          var offset = $$1(control).offset();
          var w = ($$1(control).parents('.modal-window-content:first').length > 0) ? $$1(control).parents('.modal-window-content:first') : $$1('body');

          if($$1(control).parents('.modal-window-content:first').length > 0) {

            var w = $$1(control).parents('.modal-window-content:first');

            var espace_en_bas = w.height() - 370 - (offset.top - w.offset().top);
            var espace_en_haut = (offset.top - w.offset().top);
            if(espace_en_bas < -10 && espace_en_haut > 360) {
              $$1(control).find(".control-selector-search-container-down ul:first").css('height', $$1(control).find(".control-selector-search-container-down ul").css('max-height'));
              if($$1(control).find(".btn-add-details").length > 0)
                $$1(control).find(".control-selector-search-container-down").css('top', -349);
              else
                $$1(control).find(".control-selector-search-container-down").css('top', -310);
              var input = $$1(control).find(".control-selector-search-input-container");
              $$1(control).find(".control-selector-search-container-down ul:first").after(input);
              //input.remove();
            } else {
              $$1(control).find(".control-selector-search-container-down ul:first").css('height', 'auto');
              //$(control).find(".control-selector-search-container-down").css('top','auto');
              var input = $$1(control).find(".control-selector-search-input-container");
              $$1(control).find(".control-selector-search-container-down ul:first").before(input);
            }
          }

          if($$1(control).find(".control-selector-search-container-down").is(":visible")) {

            $$1(control).find(".control-selector-search-container-down").css('display', 'none');
          } else {
            $$1(control).find(".control-selector-search-container-down").css('display', 'block');

            $$1(control).find(".control-selector-search .control-selector-search-input").focus();

            var isKeywordsSelector = false;
            if($$1(control).data('query') == 'get-keywords-selector-list')
              isKeywordsSelector = true;
            if(isKeywordsSelector)
              $$1(control).find(".control-selector-search .control-selector-search-input").val('');
            if((($$1(control).find(".control-selector-search ul li").length <= 0) && (allowFullList == true)) || (isKeywordsSelector)) {
              getDataSelector(control);
            }
          }
        } else {
          if($$1(control).find(".control-selector-search-container").is(":visible")) {
            $$1(control).parents('.modal-window .modal-window-container').css('overflow', 'hidden');
            $$1(control).find(".control-selector-search-container").modal('hide');
          } else {
            $$1(control).find(".control-selector-search-container").modal('show');
            $$1(control).parents('.modal-window .modal-window-container').css('overflow', 'visible');
            //$(control).find(".control-selector-search .control-selector-search-input").focus();
            var isKeywordsSelector = false;
            if($$1(control).data('query') == 'get-keywords-selector-list')
              isKeywordsSelector = true;
            if(isKeywordsSelector)
              $$1(control).find(".control-selector-search .control-selector-search-input").val('');
            if((($$1(control).find(".control-selector-search ul li").length <= 0) && (allowFullList == true)) || (isKeywordsSelector)) {
              getDataSelector(control);
            }
          }
        }
      });
    }
    // --->


    // <--- "remove-circle" click
    $$1(control).find(".control-selector-label span .glyphicon").unbind("click").bind("click", function() {
      removeItemSelector(control, $$1(this).parent("span").attr('data-id'));
    });
    // --->


    // <--- eye-open click (consult data)
    $$1(control).find(".control-selector-search ul li .glyphicon-eye-open").unbind("click").bind("click", function() {
      var id = $$1(this).parents('li').data("id");
      consultData$1(id);
      return false;
    });
    // --->


    // <--- selector add record function
    $$1(control).find(".control-selector-search ul li").not('.noclick').not('.addonlist').unbind("click").bind("click", function() {

      formModyfied(this);

      if(!$$1(this).hasClass('selected')) {
        var id = $$1(this).data("id");
        hideTooltip(this);
        var isSelectUser = ($$1(control).data('query') == 'get-users-selector-list');
        var content_obj = $$1(this).find("div:first");
        //$(content_obj).find('i').remove();
        //$(content_obj).find('.tooltip').remove();
        var content = content_obj.html();
        var spanAdd = '';

        if(isSelectUser) {
          spanAdd = ' data-user="' + id + '" class="user-idcard-hover" ';
        }

        if($$1(control).data('query') == 'get-keywords-selector-list')
          var span = $$1("<span data-id='" + id + "' " + spanAdd + "><div class='label-keyword-mouse' style='cursor:pointer;'  >" + content + "</div><i class='glyphicon glyphicon-remove-circle'></i></span>");
        else
          var span = $$1("<span data-id='" + id + "' " + spanAdd + ">" + content + "<i class='glyphicon glyphicon-remove-circle'></i></span>");

        $$1(span).find('.control-selector-content-checkbox').remove();
        $$1(span).find('.txt-xs').remove();
        $$1(span).find('.glyphicon').remove();
        if($$1(control).hasClass("panel-easy-data")) {
          execQuery("update-modal-window-control-selectors", {
              'iddata': id,
              'field': $$1(control).data('field')
            }, false)
            .then((json) => {
              if($$1(control).find(".list-group").length > 0) {
                $$1(control).find(".list-group").append(base64Decode(json.content));
              } else {
                if($$1(control).find("table tbody").length > 0)
                  $$1(control).find("table tbody").append(base64Decode(json.content));
                else
                  $$1(control).find("table").append(base64Decode(json.content));
              }
            });


        } else
          $$1(control).find(".control-selector-label").append(span);

        $$1(this).addClass('selected');
        $$1(this).find('.control-selector-content-checkbox').prop('checked', true);

        if($$1(control).find('input.data-value').length > 0) { // data-value is present for field select users & select groups ie

          var dataValue = $$1(control).find('input.data-value').val().split(',');
          var flagExists = false;
          for(var i = 0; i <= dataValue.length <= 0; i++)
            if(dataValue[i] == id)
              flagExists = true;

          if(!flagExists) dataValue.push(id);
          $$1(control).find('input.data-value').val(dataValue.join(','));

        } else { // data-add is present for field select data ie
          if($$1(control).find('input.data-add').length > 0) {
            var dataAdd = $$1(control).find('input.data-add').val().split(',');

            if($$1(control).find('input.data-add').val().length > 0)
              dataAdd.push(id);
            else
              dataAdd = [id];

            $$1(control).find('input.data-add').val(dataAdd.join(','));
          }
        }

        if($$1(control).find('input.data-remove').length > 0) {
          var dataRemove = $$1(control).find('input.data-remove').val().split(',');
          var dataRemoveFinal = new Array();
          for(var i = 0; i <= dataRemove.length - 1; i++) {
            flagExists = true;
            if(dataRemove[i] != id)
              dataRemoveFinal.push(dataRemove[i]);
          }
          $$1(control).find('input.data-remove').val(dataRemoveFinal.join(','));
        }


        if(!is_modal)
          $$1(control).find(".control-selector-search-input").focus();

        setTimeout(function() {
          $$1(control).find('.control-selector-search-input').select();
          initUserHover$1();
        }, 100);
      } else {
        removeItemSelector(control, $$1(this).attr('data-id'));
      }
      controlInitDatasSelector(); // exec a new control initialize
    });
    // ---->


    $$1(control).find(".control-selector-search .control-selector-search-input").unbind("keyup").bind("keyup", function() {

      if(controlSelectorTimerSearch !== null)
        clearTimeout(controlSelectorTimerSearch);

      controlSelectorTimerSearch = setTimeout(function() {
        controlSelectorSearch(control);
      }, 100);
    });
    // <--- selector search and query function

    // selector search and query function ---->

  });
}

// import 'bootstrap-stylus/js/modal';

function initKindexModal(modalWindow) {

  if($$1(modalWindow).find("#kindex-modal").length > 0) {
    return;
  }

  $$1(modalWindow).append('\
		<div class="modal" id="kindex-modal" tabindex="-1" data-backdrop="static" role="dialog" style="z-index:9999999999;">\
			<div class="modal-dialog modal-dialog-kindex">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button class="modal-header-close"><i class="glyphicon glyphicon-remove"></i></button>\
						<span class="modal-header-icon"><i class="glyphicons glyphicons-forward"></i></span>\
						<h2 class="modal-title">Dernière étape ...</h2>\
					</div>\
					<div class="modal-body">\
						<div class="wide kindexcontent-container">\
							<i class="kindexinfosicon glyphicons glyphicons-circle-info"></i>\
							<p class="kindexinfos">\
								Nous pensons que les éléments ci-dessous pourraient être en rapport avec votre donnée.<br /><b>Validez celles qui vous semblent pertinentes après consultation</b>\
							</p>\
							<div class="wide kindexcontent">\
							</div>\
						</div>\
					</div>\
					<div class="modal-footer">\
						<button type="button" class="submit-kindex btn btn-success pull-right">Valider</button>\
						<div class="clearfix"></div>\
					</div>\
				</div>\
			</div>\
		</div>\
	');
}

function addItemFromKindex(modalWindow, objDatas) {
  for(var onedata in objDatas) {
    if(objDatas[onedata].uid && objDatas[onedata].title) {
      if($$1(modalWindow).find("#form-group-" + objDatas[onedata].uid).length > 0) {
        if($$1(modalWindow).find("#form-group-" + objDatas[onedata].uid).find('input').length > 0) {
          $$1(modalWindow).find("#form-group-" + objDatas[onedata].uid).find('.control-selector-placeholder').css('display', 'none');
          var objAdd = $$1(modalWindow).find("#form-group-" + objDatas[onedata].uid).find('#data-add-' + objDatas[onedata].uid);

          objAdd.val(objAdd.val() + ',' + onedata);

          $$1(modalWindow).find("#form-group-" + objDatas[onedata].uid).find('.control-selector-label').append(
            '<span data-id="' + onedata + '">\
								#' + onedata + ' - ' + objDatas[onedata].title + '<i class="glyphicon glyphicon-remove-circle"></i>\
							</span>');


        } else {
          $$1(modalWindow).find("#form-group-" + objDatas[onedata].uid).append('<a onclick="consultData(\'' + onedata + '\');" href="#">\
						<span class="label label-primary my-label">\
							<p style="line-height:17px;" class="wide unmarged">' + objDatas[onedata].title + '</p>\
						</span>\
						</a>');
        }
        controlInitDatasSelector();
      }
    }
  }
}

function controlKindexModal(modalWindow, display) {

  $$1(modalWindow).find("#kindex-modal .submit-kindex").unbind("click").bind("click", function() {
    var iddatas = new Array();
    var arrayKeys = new Array();
    var objDatas = new Array();

    $$1("#kindex-modal .list-group-item").each(function() {
      if($$1(this).find(".btn-danger").length > 0) {
        iddatas.push($$1(this).data('iddata'));
        arrayKeys.push($$1(this).data('key'));
        objDatas[$$1(this).data('iddata')] = {
          'title': $$1(this).find('.datatitle').html(),
          'uid': $$1(this).data('uid')
        };
      }
    });

    if(iddatas.length == 0) {
      if(!display || confirm('Vous n\'avez validé aucune donnée corespondante. Confirmez-vous ce choix?')) {
        $$1("#kindex-modal").modal('hide');
        //$("#kindex-modal").modal('destroy');

        //On lance l'enregistrement de la fiche
        if(display) {
          $$1(modalWindow).find('#form-data').find('#force-reload').val(1);
          $$1(modalWindow).find('#form-data').submit();
        }
      }
    } else {
      if(display) {
        execQuery("kindex-data-save", {
            'iddata': $$1(modalWindow).find("#data-iddata").val(),
            'iddatas': iddatas,
            'arrayKeys': arrayKeys
          })
          .then(() => {
            addItemFromKindex(modalWindow, objDatas);

            $$1("#kindex-modal").modal('hide');
            //On lance l'enregistrement de la fiche
            if(display) {
              $$1(modalWindow).find('#form-data').find('#force-reload').val(1);
              $$1(modalWindow).find('#form-data').submit();
            }
          });
      } else {
        addItemFromKindex(modalWindow, objDatas);
        $$1(modalWindow).find('.modal-window-modif').val('1');
        $$1("#kindex-modal").modal('hide');
      }
    }
  });

  $$1(modalWindow).find("#kindex-modal .btnadddata").unbind("click").bind("click", function() {
    if($$1(this).hasClass('btn-danger')) {
      $$1(this).removeClass('btn-danger');
      $$1(this).addClass('btn-info');
      $$1(this).html('<i class="glyphicon glyphicon-ok"></i>&nbsp;Valider');
    } else {
      $$1(this).removeClass('btn-info');
      $$1(this).addClass('btn-danger');
      $$1(this).html('<i class="glyphicon glyphicon-remove"></i>&nbsp;Annuler');
    }
  });

  $$1(modalWindow).find("#kindex-modal .close, #kindex-modal .modal-header-close").unbind("click").bind("click", function() {
    if(display) {
      if(confirm('Vous n\'avez validé aucune donnée corespondante. Confirmez-vous ce choix ?')) {
        $$1("#kindex-modal").modal('hide');

        $$1(modalWindow).find('#form-data').find('#force-reload').val(1);
        $$1(modalWindow).find('#form-data').submit();
      }
    } else
      $$1("#kindex-modal").modal('hide');

    return false;
  });
}

function displayKindexModal(modalWindow, datakindex, display) {
  if(typeof(display) == 'undefined')
    display = true;

  if(datakindex.length == 0) {
    if(display == true) {
      $$1(modalWindow).find('#form-data').submit();
      //alert('Pour information, aucun élément de la plateforme ne correspond aujourd\'hui à votre fiche');

      return 'finalize';
    }

    return;
  }
  initKindexModal(modalWindow);

  $$1(modalWindow).find("#kindex-modal .kindexcontent").html('');
  for(var i = 0; i <= datakindex.length - 1; i++) {
    if($$1(modalWindow).find("#kindex-modal ." + datakindex[i].uid).length == 0) {
      $$1(modalWindow).find("#kindex-modal .kindexcontent").append('<label class="kindexlabel ' + datakindex[i].uid + '" >' + datakindex[i].fieldtitle + '</label>\
								<ul class="kindexlist list' + datakindex[i].uid + ' list-group list-group-hover">\
								</ul>\
								');
    }

    $$1(modalWindow).find("#kindex-modal .list" + datakindex[i].uid + " ").append('\
			<li data-iddata="' + datakindex[i].iddata + '" data-uid="' + datakindex[i].uid + '" data-key="' + datakindex[i].key + '" class="list-group-item">\
				<h4 class="link-nu"  onclick="consultData(' + datakindex[i].iddata + ');">\
					<b class="datatitle" >' + datakindex[i].title + '</b>\
					<div class="tooltiped pull-right" data-toggle="tooltip" title="' + datakindex[i].percent + ' %">\
						<div class="pull-right kindexmatchingicon" ' + datakindex[i].star3 + '></div>\
						<div class="pull-right kindexmatchingicon" ' + datakindex[i].star2 + '></div>\
						<div class="pull-right kindexmatchingicon" ' + datakindex[i].star1 + '></div>\
					</div>\
				</h4>\
				<div>\
					<div class="kindexsummary">\
						<p class="txt-sm">' + datakindex[i].summary + '</p>\
					</div>\
					<div class="kindexbuttons">\
						<button type="button" onclick="consultData(' + datakindex[i].iddata + ');" class=" btn btn-xs btn-default pull-right"><i class="glyphicon glyphicon-eye-open"></i>&nbsp;Consulter</button>\
						<button type="button" class="btnadddata btn btn-xs btn-info pull-right"><i class="glyphicon glyphicon-ok"></i>&nbsp;Ajouter</button>\
					</div>\
					<div class="clearfix"></div>\
				</div>\
			</li>\
		');

  }
  controlKindexModal(modalWindow, display);

  if(display)
    $$1(modalWindow).find('#kindex-modal').modal('show');
}

// import 'bootstrap-stylus/js/modal';

// form requester functions --->
function displayModalKindexWaiting(container, display) {
  if(display) {

    if($$1(container).find('.display-kindex-waitingmsg').length > 0 && $$1(container).find('.display-kindex-waitingmsg').val() == '1') {
      if($$1('#KindexModalLoading').length <= 0 && ($$1(container).find('#data-published').length == 0 || ($$1(container).find('#data-published').length > 0 && $$1(container).find('#data-published').val() == 1))) {
        $$1(container).append(
          '<div class="modal modal-page" id="KindexModalLoading"  data-backdrop="static" tabindex="-1" role="dialog">\
						<div class="modal-dialog" style="width:550px; margin-top:15%;" >\
							<div class="modal-content">\
								<div class="modal-header">\
									<span class="modal-header-icon"><i class="glyphicons glyphicons-show-thumbnails-with-lines"></i></span>\
									<h2 class="modal-title">Indexation sémantique</h2>\
								</div>\
								<div class="modal-body"  >\
									<div style="padding:10px;text-align:center;" class="wide">\
										<div style="float:left;width:400px;padding-top:10px;">\
											<h3 style="font-size:26px;color:#00B5B2;">Veuillez patientez...</h3>\
											<h4>Nous recherchons des éléments correspondant à votre fiche</h4>\
										</div>\
										<div class="loading">\
										</div>\
										<div style="clear:both;">\
											&nbsp;\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>'
        );
      }

      setTimeout(function() {
        nameTimer(imageLoadingSmall);
        $$1('#KindexModalLoading').modal('show');
      }, 1000);
    }
  } else {
    $$1('#KindexModalLoading').modal('hide');
    nameTimer(null);
    if($$1('#KindexModalLoading').length > 0)
      $$1('#KindexModalLoading').remove();
  }
}

function base64Encode$1(data) {
  return data ? window.btoa(utf8$1.encode(data)) : '';
}

function tablerGetFilters(tabler) {

  var filters = {};

  $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell").each(function() {

    var flagFiltered = false;
    var uid = $$1(this).data("uid");

    if($$1(this).find(".filters input[type=checkbox]:checked").length > 0) {

      flagFiltered = true;

      var values = new Array();
      $$1(this).find(".filters input[type=checkbox]:checked").each(function() {
        values.push($$1(this).val());
      });

      filters[uid] = values;
    }

    (flagFiltered == true) ? $$1(this).removeClass("filtered").addClass("filtered"): $$1(this).removeClass("filtered");
  });

  return filters;
}

// TODO: Use vanillajs-helpers or lodash for this

function isString(str) {
  return typeof str === 'string';
}

function trim$1(str, char) {
  if(!isString(str)) { str = `${str}`; }
  if(!char) { return str.trim(); }
  return str.replace(new RegExp(`^[${char}]+|[${char}]+$`, 'g'), '');
}

function tablerGetVars(tabler) {
  var vars = {};
  if($$1(tabler).find("input[name=tabler-vars]").length <= 0) return vars;

  var varsTmp = $$1(tabler).find("input[name=tabler-vars]").val();
  if(varsTmp.length <= 0) return vars;

  var aVarsTmp = varsTmp.split(";");
  for(var i = 0; i <= aVarsTmp.length - 1; i++) {
    var aVarTmp = aVarsTmp[i].split("=");
    if(aVarTmp.length == 2)
      vars[trim$1(aVarTmp[0])] = trim$1(aVarTmp[1]);
  }

  return vars;
}

var index = createCommonjsModule(function (module, exports) {
exports.remove = removeDiacritics;

var replacementList = [
  {
    base: ' ',
    chars: "\u00A0",
  }, {
    base: '0',
    chars: "\u07C0",
  }, {
    base: 'A',
    chars: "\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F",
  }, {
    base: 'AA',
    chars: "\uA732",
  }, {
    base: 'AE',
    chars: "\u00C6\u01FC\u01E2",
  }, {
    base: 'AO',
    chars: "\uA734",
  }, {
    base: 'AU',
    chars: "\uA736",
  }, {
    base: 'AV',
    chars: "\uA738\uA73A",
  }, {
    base: 'AY',
    chars: "\uA73C",
  }, {
    base: 'B',
    chars: "\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0181",
  }, {
    base: 'C',
    chars: "\u24b8\uff23\uA73E\u1E08\u0106\u0043\u0108\u010A\u010C\u00C7\u0187\u023B",
  }, {
    base: 'D',
    chars: "\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018A\u0189\u1D05\uA779",
  }, {
    base: 'Dh',
    chars: "\u00D0",
  }, {
    base: 'DZ',
    chars: "\u01F1\u01C4",
  }, {
    base: 'Dz',
    chars: "\u01F2\u01C5",
  }, {
    base: 'E',
    chars: "\u025B\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E\u1D07",
  }, {
    base: 'F',
    chars: "\uA77C\u24BB\uFF26\u1E1E\u0191\uA77B",
  }, {
    base: 'G',
    chars: "\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E\u0262",
  }, {
    base: 'H',
    chars: "\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D",
  }, {
    base: 'I',
    chars: "\u24BE\uFF29\xCC\xCD\xCE\u0128\u012A\u012C\u0130\xCF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197",
  }, {
    base: 'J',
    chars: "\u24BF\uFF2A\u0134\u0248\u0237",
  }, {
    base: 'K',
    chars: "\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2",
  }, {
    base: 'L',
    chars: "\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780",
  }, {
    base: 'LJ',
    chars: "\u01C7",
  }, {
    base: 'Lj',
    chars: "\u01C8",
  }, {
    base: 'M',
    chars: "\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C\u03FB",
  }, {
    base: 'N',
    chars: "\uA7A4\u0220\u24C3\uFF2E\u01F8\u0143\xD1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u019D\uA790\u1D0E",
  }, {
    base: 'NJ',
    chars: "\u01CA",
  }, {
    base: 'Nj',
    chars: "\u01CB",
  }, {
    base: 'O',
    chars: "\u24C4\uFF2F\xD2\xD3\xD4\u1ED2\u1ED0\u1ED6\u1ED4\xD5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\xD6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\xD8\u01FE\u0186\u019F\uA74A\uA74C",
  }, {
    base: 'OE',
    chars: "\u0152",
  }, {
    base: 'OI',
    chars: "\u01A2",
  }, {
    base: 'OO',
    chars: "\uA74E",
  }, {
    base: 'OU',
    chars: "\u0222",
  }, {
    base: 'P',
    chars: "\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754",
  }, {
    base: 'Q',
    chars: "\u24C6\uFF31\uA756\uA758\u024A",
  }, {
    base: 'R',
    chars: "\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782",
  }, {
    base: 'S',
    chars: "\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784",
  }, {
    base: 'T',
    chars: "\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786",
  }, {
    base: 'Th',
    chars: "\u00DE",
  }, {
    base: 'TZ',
    chars: "\uA728",
  }, {
    base: 'U',
    chars: "\u24CA\uFF35\xD9\xDA\xDB\u0168\u1E78\u016A\u1E7A\u016C\xDC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244",
  }, {
    base: 'V',
    chars: "\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245",
  }, {
    base: 'VY',
    chars: "\uA760",
  }, {
    base: 'W',
    chars: "\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72",
  }, {
    base: 'X',
    chars: "\u24CD\uFF38\u1E8A\u1E8C",
  }, {
    base: 'Y',
    chars: "\u24CE\uFF39\u1EF2\xDD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE",
  }, {
    base: 'Z',
    chars: "\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762",
  }, {
    base: 'a',
    chars: "\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250\u0251",
  }, {
    base: 'aa',
    chars: "\uA733",
  }, {
    base: 'ae',
    chars: "\u00E6\u01FD\u01E3",
  }, {
    base: 'ao',
    chars: "\uA735",
  }, {
    base: 'au',
    chars: "\uA737",
  }, {
    base: 'av',
    chars: "\uA739\uA73B",
  }, {
    base: 'ay',
    chars: "\uA73D",
  }, {
    base: 'b',
    chars: "\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253\u0182",
  }, {
    base: 'c',
    chars: "\uFF43\u24D2\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184",
  }, {
    base: 'd',
    chars: "\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\u018B\u13E7\u0501\uA7AA",
  }, {
    base: 'dh',
    chars: "\u00F0",
  }, {
    base: 'dz',
    chars: "\u01F3\u01C6",
  }, {
    base: 'e',
    chars: "\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u01DD",
  }, {
    base: 'f',
    chars: "\u24D5\uFF46\u1E1F\u0192",
  }, {
    base: 'ff',
    chars: "\uFB00",
  }, {
    base: 'fi',
    chars: "\uFB01",
  }, {
    base: 'fl',
    chars: "\uFB02",
  }, {
    base: 'ffi',
    chars: "\uFB03",
  }, {
    base: 'ffl',
    chars: "\uFB04",
  }, {
    base: 'g',
    chars: "\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\uA77F\u1D79",
  }, {
    base: 'h',
    chars: "\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265",
  }, {
    base: 'hv',
    chars: "\u0195",
  }, {
    base: 'i',
    chars: "\u24D8\uFF49\xEC\xED\xEE\u0129\u012B\u012D\xEF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131",
  }, {
    base: 'j',
    chars: "\u24D9\uFF4A\u0135\u01F0\u0249",
  }, {
    base: 'k',
    chars: "\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3",
  }, {
    base: 'l',
    chars: "\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747\u026D",
  }, {
    base: 'lj',
    chars: "\u01C9",
  }, {
    base: 'm',
    chars: "\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F",
  }, {
    base: 'n',
    chars: "\u24DD\uFF4E\u01F9\u0144\xF1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5\u043B\u0509",
  }, {
    base: 'nj',
    chars: "\u01CC",
  }, {
    base: 'o',
    chars: "\u24DE\uFF4F\xF2\xF3\xF4\u1ED3\u1ED1\u1ED7\u1ED5\xF5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\xF6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\xF8\u01FF\uA74B\uA74D\u0275\u0254\u1D11",
  }, {
    base: 'oe',
    chars: "\u0153",
  }, {
    base: 'oi',
    chars: "\u01A3",
  }, {
    base: 'oo',
    chars: "\uA74F",
  }, {
    base: 'ou',
    chars: "\u0223",
  }, {
    base: 'p',
    chars: "\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755\u03C1",
  }, {
    base: 'q',
    chars: "\u24E0\uFF51\u024B\uA757\uA759",
  }, {
    base: 'r',
    chars: "\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783",
  }, {
    base: 's',
    chars: "\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B\u0282",
  }, {
    base: 'ss',
    chars: "\xDF",
  }, {
    base: 't',
    chars: "\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787",
  }, {
    base: 'th',
    chars: "\u00FE",
  }, {
    base: 'tz',
    chars: "\uA729",
  }, {
    base: 'u',
    chars: "\u24E4\uFF55\xF9\xFA\xFB\u0169\u1E79\u016B\u1E7B\u016D\xFC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289",
  }, {
    base: 'v',
    chars: "\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C",
  }, {
    base: 'vy',
    chars: "\uA761",
  }, {
    base: 'w',
    chars: "\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73",
  }, {
    base: 'x',
    chars: "\u24E7\uFF58\u1E8B\u1E8D",
  }, {
    base: 'y',
    chars: "\u24E8\uFF59\u1EF3\xFD\u0177\u1EF9\u0233\u1E8F\xFF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF",
  }, {
    base: 'z',
    chars: "\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763",
  }
];

var diacriticsMap = {};
for (var i = 0; i < replacementList.length; i += 1) {
  var chars = replacementList[i].chars;
  for (var j = 0; j < chars.length; j += 1) {
    diacriticsMap[chars[j]] = replacementList[i].base;
  }
}

function removeDiacritics(str) {
  return str.replace(/[^\u0000-\u007e]/g, function(c) {
    return diacriticsMap[c] || c;
  });
}
});

interopDefault(index);
var cleanDiacritics = index.remove;

function displayOrderBtns(dsp) {
  if($$1('#btn-order-tabler').length == 0) {
    return;
  }

  if(!dsp) {
    $$1('#btn-order-tabler .btn')
      .first().css('display', 'initial')
      .next().css('display', 'none')
      .next().css('display', 'none');
  } else {
    $$1('#btn-order-tabler .btn')
      .first().css('display', 'none')
      .next().css('display', 'initial')
      .next().css('display', 'initial');
  }
}

const sharedVars = {
  timerTablerUpdate: null,
  scrollRun: false
};

function findTabler(elt) {
  let tabler;

  if(elt) {
    tabler = $$1(elt).parents('.tabler-container:first').find('.tabler-datas:first');
  }

  if(!tabler || !tabler.length) {
    tabler = $$1('.tabler-datas:first');
  }

  return tabler;
}

function tablerRefresh(elt) {
  const $tabler = findTabler(elt);
  $tabler.find('input[name=tabler-offset]').val(0);
  return tablerUpdate($tabler);
}

let timerFiltersSearch = null;
let controlFlagFilters = false;

function tablerSetDatasStatus($tabler, idstatus) {
  $tabler = $$1($tabler);
  const ids = [];

  $tabler.find('.tabler-cell-selector input[type=checkbox]:checked').each(function() {
    const val = Number($$1(this).val());
    if(isNumber(val)) {
      ids.push(val);
    }
  });

  if(!ids.length) {
    return alert("Merci de cocher au moins un enregistrement dans la liste");
  }

  if(!confirm("Attention, vous allez modifier le statut d'un ou plusieurs enregistrement.\r\nSouhaitez-vous continuer ?")) {
    return;
  }

  execQuery('set-datas-status', {
      idstatus,
      ids
    })
    .then((json) => tablerRefresh($tabler).then(() => displaySuccess$1(json.msg)))
    .catch((err) => displaySuccess$1(err.msg || err));
}


/**
 * Apply a string search within filters container
 * @param {DOM} filtersContainer
 * @param {string} searchedValue
 */
function applyFiltersSearch(filtersContainer, searchedValue) {

  if(searchedValue.length <= 0) return $$1(filtersContainer).find("li").show();

  searchedValue = cleanDiacritics(searchedValue);

  $$1(filtersContainer).find("li").each(function() {

    var value = cleanDiacritics($$1(this).find("span").html());
    (value.indexOf(searchedValue) >= 0) ? $$1(this).show(): $$1(this).hide();
  });
}

function _tablerSetEventsSorts(tabler) {

  $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell.sortable, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sortable").each(function() {

    var cell = $$1(this);

    $$1(this).find(".tabler-header-cell-content").unbind("click").bind("click", function() {
      $$1(tabler).find("input[name=tabler-offset]").val(0);

      displayOrderBtns(false);

      var cellClass = $$1(cell).attr("class");

      // remove all sorts
      $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell").removeClass("sort-asc sort-desc");
      $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell .filters .filters-header .filters-orders .sortable").removeClass("active");

      if(cellClass.indexOf("sort-asc") >= 0) {
        $$1(cell).addClass("sort-desc");
        $$1(cell).find('.filters .filters-header .filters-orders .sortable.sort-desc').addClass('active');
      } else if(cellClass.indexOf("sort-desc") >= 0) {
        $$1(cell).addClass("sort-asc");
        $$1(cell).find('.filters .filters-header .filters-orders .sortable.sort-asc').addClass('active');
      } else {
        if($$1(cell).data("type") == "numeric") {
          $$1(cell).addClass("sort-desc");
          $$1(cell).find('.filters .filters-header .filters-orders .sortable.sort-desc').addClass('active');
        } else {
          $$1(cell).addClass("sort-asc");
          $$1(cell).find('.filters .filters-header .filters-orders .sortable.sort-asc').addClass('active');
        }
      }

      clearTimeout(sharedVars.timerTablerUpdate);
      sharedVars.timerTablerUpdate = setTimeout(function() {
        sharedVars.timerTablerUpdate = null;
        tablerUpdate(tabler);
      }, 500);
    });
  });

  $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell .filters .filters-header .filters-orders .sortable").unbind("click").bind("click", function() {
    $$1(tabler).find("input[name=tabler-offset]").val(0);
    var cellClass = $$1(this).attr("class");
    var cellParent = $$1(this).closest('.tabler-header-cell.sortable');

    // remove all sorts
    $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell").removeClass("sort-asc sort-desc");
    $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell .filters .filters-header .filters-orders .sortable").removeClass("active");

    $$1(this).addClass('active');
    if(cellClass.indexOf("sort-asc") >= 0) {
      $$1(cellParent).addClass("sort-asc");
    } else if(cellClass.indexOf("sort-desc") >= 0) {
      $$1(cellParent).addClass("sort-desc");
    } else {
      ($$1(cellParent).data("type") == "numeric") ? $$1(cellParent).addClass("sort-desc"): $$1(cellParent).addClass("sort-asc");
    }

    clearTimeout(sharedVars.timerTablerUpdate);

    sharedVars.timerTablerUpdate = setTimeout(function() {
      sharedVars.timerTablerUpdate = null;
      tablerUpdate(tabler);
    }, 500);
  });
}


function _tablerSetEventsFiltersKeyupSearch(tabler) {

  $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell .filters .filters-search, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell .filters .filters-search").unbind("keyup").bind("keyup", function() {
    var filtersContainer = $$1(this).parents(".filters").find("ul");
    var searchedValue = $$1(this).val();

    if(timerFiltersSearch != null) clearTimeout(timerFiltersSearch);

    timerFiltersSearch = setTimeout(function() {
      applyFiltersSearch(filtersContainer, searchedValue);
      timerFiltersSearch = null;
    }, 500);
  });
}

/**
 * Launch an ajax function to retrieve tabler column filter list
 * @param {tabler} tabler
 * @param {dom} headerCell
 */
function _tablerGetFiltersList(tabler, headerCell) {

  var id = $$1(tabler).attr("id");
  var uid = $$1(headerCell).data("uid");
  var vars = tablerGetVars($$1(tabler));

  if($$1(headerCell).find('.filters .searching').length <= 0)
    $$1(headerCell).find('.filters').append('<center class="searching"><br /><i class="glyphicon glyphicon-search"></i>&nbsp;Recherche en cours...<br /><br /></center>');
  else
    $$1(headerCell).find('.filters .searching').html('<br /><i class="glyphicon glyphicon-search"></i>&nbsp;Recherche en cours...<br /><br />');

  $$1(headerCell).find('.filters-search-container').hide();
  $$1(headerCell).find('.filters-header').hide();

  execQuery("tabler-get-filters", {
      id,
      uid,
      vars
    }, false)
    .then((json) => {
      $$1(headerCell).find('.filters-header').show();
      $$1(headerCell).find('.filters-search-container').show();
      $$1(headerCell).find('.filters .searching').remove();

      var values = stringToJSON(base64Decode(json.values));

      if(!values) return displayError$1('Error while decoding filters values list');

      for(var i = 0; i <= values.length - 1; i++) {
        var id = values[i]['id'];
        var value = values[i]['value'];
        $$1(headerCell).find('.filters ul').append('<li><label><input type="checkbox" value="' + id + '" /><span>' + value + '</span>');
      }

      _tablerSetEventsFiltersClickFilter(tabler);
    })
    .catch(() => {
      if(err.msg) {
        $$1(headerCell).find('.filters-header').show();
        $$1(headerCell).find('.filters-search-container').show();

        if($$1(headerCell).find('.filters .searching').length <= 0)
          $$1(headerCell).find('.filters').append('<center class="searching">' + err.msg + '</center>');
        else
          $$1(headerCell).find('.filters .searching').html(err.msg);
      }
    });
}

function getScreenPosition(obj) {
  var left = obj.offsetLeft;
  var top = obj.offsetTop;

  while(obj.parentNode) {
    left += obj.offsetLeft;
    top += obj.offsetTop;
    obj = obj.parentNode;
  }

  return {
    'left': left,
    'top': top
  };
}

function _tablerSetEventsFiltersClickToggle(tabler) {

  $$1(tabler).find('.tabler-thumb-header .tabler-thumb-header-toggle').unbind('click').bind('click', function() {
    var toggle = $$1(this);

    if($$1(this).attr('class').indexOf('expanded') >= 0) {

      $$1(tabler).find('.tabler-thumb-header .tabler-thumb-header-row').fadeOut('fast', function() {
        $$1(tabler).find('.tabler-thumb-header').css('width', '0');
        $$1(tabler).find('.tabler-thumb-body').css('width', '100%');
        $$1(toggle).removeClass('expanded');
      });
    } else {

      $$1(tabler).find('.tabler-thumb-header').css('width', '20%');
      $$1(tabler).find('.tabler-thumb-body').css('width', '79%');
      $$1(tabler).find('.tabler-thumb-header .tabler-thumb-header-row').fadeIn('fast', function() {
        $$1(toggle).addClass('expanded');
      });
    }
  });

  $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell .btn-filters-toggle, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell .btn-filters-toggle").unbind("click").bind("click", function() {

    $$1('.tabler-header-cell .filters').hide();

    $$1('.tabler-header-cell.active').removeClass('active');
    $$1(this).closest('.tabler-header-cell').addClass('active');

    // <--- hide the filters list
    if($$1(this).parents(".tabler-header-cell").find(".filters").is(":visible"))
      return $$1(this).parents(".tabler-header-cell").find(".filters").hide();
    // --->

    // <--- show the filters list
    // <--- retrieve filters-container position and set it stacked to right if needed
    var position = getScreenPosition($$1(this).parents(".tabler-header-cell").find(".filters").get(0));
    if(position) {

      var left = position.left;
      var width = $$1(this).parents(".tabler-header-cell").find(".filters").width();

      if((left + width) > $$1(window).width())
        $$1(this).parents(".tabler-header-cell").find(".filters").css("left", "auto").css("right", "0");
    }
    // --->



    $$1(this).parents(".tabler-header-cell").find(".filters").show();

    $$1(this).parents(".tabler-header-cell").find(".filters .filters-search").focus();

    // <--- launch a filters search if not already initialized
    if($$1(this).parents(".tabler-header-cell").find(".filters ul li").length <= 0)
      _tablerGetFiltersList(tabler, $$1(this).parents('.tabler-header-cell'));
    // --->

    // show the filters list --->
  });
}


function _tablerSetEventsFiltersClickFilter(tabler) {


  $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell .filters input[type=checkbox], .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell .filters input[type=checkbox]").unbind("change").bind("change", function() {
    $$1(tabler).find("input[name=tabler-offset]").val(0);

    displayOrderBtns(false);
    clearTimeout(sharedVars.timerTablerUpdate);
    sharedVars.timerTablerUpdate = setTimeout(function() {
      sharedVars.timerTablerUpdate = null;
      tablerUpdate(tabler);
    }, 1000);
  });
}

function _tablerSetEventsFiltersClickClose(tabler) {

  $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell .btn-filters-close, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell .btn-filters-close").unbind("click").bind("click", function() {
    $$1(this).parents(".filters").hide();
  });
}

function _tablerSetEventsFilters(tabler) {
  $$1('.tabler-header-cell').each(function() {
    var controlFilter = $$1(this);

    $$1(controlFilter).unbind('mouseenter').bind('mouseenter', function() {
      controlFlagFilters = true;
    }).unbind('mouseleave').bind('mouseleave', function() {
      controlFlagFilters = false;
    });
  });

  _tablerSetEventsFiltersClickToggle(tabler);
  _tablerSetEventsFiltersClickClose(tabler);
  _tablerSetEventsFiltersKeyupSearch(tabler);
  _tablerSetEventsFiltersClickFilter(tabler);
}

$$1(document).bind("mousedown", function() {
  if(controlFlagFilters !== true) {
    $$1('.tabler-header-cell.active').removeClass('active');
    $$1('.tabler-header-cell .filters').hide();
    controlFlagFilters = false;
  }
});

function tablerSetEvents(tabler) {

  _tablerSetEventsSorts(tabler);
  _tablerSetEventsFilters(tabler);

  $$1(tabler).parents('.tabler-container').find('.btn-change-status li a').unbind('click').bind('click', function() {
    tablerSetDatasStatus(tabler, $$1(this).parent('li:first').data('idstatus'));
  });
}

let nameTimer$1 = null;

function tablerSetLoading(tabler, flagLoading) {

  if($$1('.modal-loader-container').length <= 0)
    $$1(document).find('body').append("<div class='modal-loader-container'></div>");

  if($$1('.modal-overlay').length <= 0)
    $$1(document).find('body').append("<div class='modal-overlay'></div>");

  var content = "\
		<div class='msg-loading'>\
			<p>Chargement en cours</p>\
			<div class='loading'></div>\
		</div>";

  if(nameTimer$1 == null)
    $$1(".modal-loader-container").html(content);

  if(flagLoading == true) {
    // Timer
    nameTimer$1 = setInterval(imageLoading, 40);
    $$1(document).find('html, body').css('overflow', 'hidden');
    $$1('.modal-overlay').show();
    $$1(".modal-loader-container").show();

  } else {
    $$1(document).find('html, body').css('overflow', 'auto');
    $$1(".modal-loader-container").hide();
    $$1('.modal-overlay').hide();

    clearInterval(nameTimer$1);
    nameTimer$1 = null;
  }
}

function tablerUpdate(tabler, vars2, flagComplete, flagEvent, flagNextPages, silentReload) {

  if(!flagComplete) { flagComplete = false; } // indicate if the entire table (headers included) have to be updated
  if(!flagEvent) { flagEvent = false; } // indicate if the event of table table have to be reinitiate
  if(!flagNextPages) { flagNextPages = false; }

  let waitMsg = 'Chargement...';

  if(!flagNextPages && !silentReload) {
    tablerSetLoading(tabler, true);
    waitMsg = false;
  }

  var id = $$1(tabler).attr('id');
  var sortColumn = '';
  var sortOrder = 0;
  var search = $$1(tabler).find('input[name=tabler-search]').val();
  var ids = $$1(tabler).find('input[name=tabler-ids]').val();
  var offset = $$1(tabler).find('input[name=tabler-offset]').val();
  var limit = $$1(tabler).find('input[name=tabler-limit]').val();
  var display = $$1(tabler).find('input[name=tabler-display]').val();
  var filters = tablerGetFilters(tabler);

  if(!search) { search = ''; }
  if(!ids) { ids = ''; }
  if(!offset) { offset = 0; }
  if(!limit) { limit = ''; }

  var vars = tablerGetVars($$1(tabler));

  // <--- merge variables
  if(typeof(vars2) == 'object') {
    for(var variable in vars2) {
      vars[variable] = vars2[variable];
    }
  }
  // merge variables --->

  if((Object.keys(filters).length > 0) || (search.length > 0)) {
    $$1(tabler).parents('.tabler-container').find('.tabler-remove-filters').show();
  } else {
    $$1(tabler).parents('.tabler-container').find('.tabler-remove-filters').hide();
  }

  if($$1(tabler).find('.tabler-header .tabler-header-row .tabler-header-cell.sort-asc, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sort-asc').length > 0) {
    sortOrder = 1;
    sortColumn = $$1(tabler).find('.tabler-header .tabler-header-row .tabler-header-cell.sort-asc, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sort-asc').data('uid');
  }
  if($$1(tabler).find('.tabler-header .tabler-header-row .tabler-header-cell.sort-desc, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sort-desc').length > 0) {
    sortOrder = -1;
    sortColumn = $$1(tabler).find('.tabler-header .tabler-header-row .tabler-header-cell.sort-desc, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sort-desc').data('uid');
  }

  return execQuery('tabler-update', {
    'id': id,
    'sortColumn': sortColumn,
    'sortOrder': sortOrder,
    'search': (search ? base64Encode$1(search) : ''),
    'ids': (ids ? base64Encode$1(ids) : ''),
    'offset': offset,
    'limit': limit,
    'display': display,
    'filters': filters,
    'vars': vars,
    'flagComplete': flagComplete
  }, waitMsg)
    .then((json) => {
      if(!flagNextPages) {
        tablerSetLoading(tabler, false);
      }

      const $tablerContainer = $$1(tabler).parents('.tabler-container:first');

      // On met à jour le nombre de données en résultat
      $tablerContainer.find('.page-header .tabler-total-records').html(json.totalRecords);

      $$1(tabler).find('input[name=tabler-nbpages]').val(json.nbPages);

      if(flagComplete) {

        $$1(tabler).find('.tabler-content').html(base64Decode(json.content));

      } else {
        // fill the tabler-body
        if($$1(tabler).find('.tabler-body').length > 0) {
          if(flagNextPages) {
            $$1(tabler).find('.tabler-body .tabler-loading').remove();
            $$1(tabler).find('.tabler-body').append(base64Decode(json.body));
          } else {
            $$1(tabler).find('.tabler-body').html(base64Decode(json.body));
          }

          // console.log(base64Decode(json.pagination));
        }

        // fill the tabler-thumb-body
        if($$1(tabler).find('.tabler-thumb-body').length > 0) {
          if(flagNextPages) {
            $$1(tabler).find('.tabler-thumb-body .tabler-loading').remove();
            $$1(tabler).find('.tabler-thumb-body .thumb-body-content').append(base64Decode(json.body));
          } else {
            $$1(tabler).find('.tabler-thumb-body').html(base64Decode(json.body));
          }
        }
      }

      setTimeout(function() {
        if(flagEvent) { tablerSetEvents(tabler); }
      }, 1000);

      if(flagNextPages) { sharedVars.scrollRun = false; }

      tooltip();
      initClickToNextPage();
      initUserHover$1();
    })
    .catch((err) => {
      console.error(err, err.stack);

      if(!flagNextPages) { tablerSetLoading(tabler, false); }
    });
}

let nbPageScrolledTabler = 0;

function gotToNextPage() {
  var tabler = $$1(".tabler-container:visible .tabler");
  var index = parseInt($$1(tabler).find("input[name=tabler-offset]").val()) + 1;
  nbPageScrolledTabler = index;
  if(index < parseInt($$1(tabler).find("input[name=tabler-nbpages]").val())) {
    $$1(tabler).find("input[name=tabler-offset]").val(index);
    tablerUpdate(tabler, {}, false, false, true);
  } else {
    sharedVars.scrollRun = false;
  }
}

function initClickToNextPage() {
  $$1('.tabler-loading .tabler-loading-img').click(gotToNextPage);
}

function tablerRowUpdate(tabler, iddata) {

  if(!$$1(tabler).parents(".tabler-container:first").hasClass('tabler-auto-update')) {
    return false;
  }

  var id = $$1(tabler).attr("id");
  var sortColumn = "";
  var sortOrder = 0;
  var search = $$1(tabler).find("input[name=tabler-search]").val();
  var ids = $$1(tabler).find("input[name=tabler-ids]").val();
  var offset = $$1(tabler).find("input[name=tabler-offset]").val();
  var limit = $$1(tabler).find("input[name=tabler-limit]").val();
  var display = $$1(tabler).find("input[name=tabler-display]").val();
  var filters = tablerGetFilters(tabler);

  if(!search) search = "";
  if(!ids) ids = "";
  if(!offset) offset = 0;
  if(!limit) limit = "";

  var vars = tablerGetVars($$1(tabler));

  var mode = $$1(tabler).find(".tabler-body .tabler-row-" + iddata).length > 0 ? 'update' : 'insert';

  if((Object.keys(filters).length > 0) || (search.length > 0)) {
    $$1(tabler).parents(".tabler-container").find(".tabler-remove-filters").show();
  } else {
    $$1(tabler).parents(".tabler-container").find(".tabler-remove-filters").hide();
  }

  if($$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell.sort-asc, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sort-asc").length > 0) {
    sortOrder = 1;
    sortColumn = $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell.sort-asc, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sort-asc").data("uid");
  }
  if($$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell.sort-desc, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sort-desc").length > 0) {
    sortOrder = -1;
    sortColumn = $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell.sort-desc, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sort-desc").data("uid");
  }

  execQuery("tabler-row-update", {
      'id': id,
      'iddata': iddata,
      'sortColumn': sortColumn,
      'sortOrder': sortOrder,
      'search': (search.length > 0 ? base64Encode$1(search) : ""),
      'ids': (ids.length > 0 ? base64Encode$1(ids) : ""),
      'offset': offset,
      'limit': limit,
      'display': display,
      'filters': filters,
      'vars': vars,
      'mode': mode
    })
    .then((json) => {
      var body = '';
      var bodyrow = ''
        // fill the tabler-body if the line exists
      if($$1(tabler).find(".tabler-body").length > 0) {
        body = '.tabler-body ';
        bodyrow = '.tabler-row-';
      } else if($$1(tabler).find(".tabler-thumb-body").length > 0) {
        body = '.tabler-thumb-body ';
        bodyrow = '.thumb-';

      } else
        return false; // probleme

      if(json.row) {

        var html = json.row.replace('\n', '');

        if($$1(tabler).find(body + bodyrow + iddata).length > 0) {
          $$1(tabler).find(body + bodyrow + iddata).replaceWith(html);
        } else if(json.previd > 0 && $$1(tabler).find(body + bodyrow + json.previd).length > 0) {
          $$1(tabler).find(body + bodyrow + json.previd).after(html);
          $$1('.page-header .tabler-total-records').html(json.totalRecords);
          $$1(tabler).find('input[name=tabler-nbpages]').val(json.nbPages);
        } else if(json.previd == null) {
          $$1(tabler).find(body).children().first().before(html);
          $$1('.page-header .tabler-total-records').html(json.totalRecords);
          $$1(tabler).find('input[name=tabler-nbpages]').val(json.nbPages);
        }

        if(html && $$1('#row' + iddata).length > 0 && html.length > 0)
          $$1('html, body').animate({
            scrollTop: $$1('#row' + iddata).offset().top - 100
          }, 'fast');
      }

      tooltip();
      initClickToNextPage();
      initUserHover$1();
    });
}

function cleanForm($form) {
  $form = $$1($form);
  $form.find('.has-error').removeClass('has-error');
  $form.find('.error-msg').remove();
}

// FIXME: Remove dependency of the modal
function finalizeForm($form, json) {
  $form = $$1($form);
  if(!$form.length || !(json && json.msg)) { return; }

  if($form.parents('.modal-window').find('.modal-window-close-after-submit').val() === '1') {
    closeModalWindow$1($form);
  }

  if(json.formContent) { $form.html(json.formContent); }

  if(isFunction$1(window[json.fnCallback])) {
    window[json.fnCallback](json)
  }

  if(isString(json.redirectUrl)) {
    if(!isNumber(json.redirectUrlDelay)) { json.redirectUrlDelay = 0; }
    setTimeout(() => document.location.href = json.redirectUrl, json.redirectUrlDelay);
  } else {
    $form.find(':button:not(.protected)').show();
    $form.find('.submit-waiting-msg').hide();
  }

  placeholder();

  const title = json.dataTitle;
  if(title) {
    const $titleText = $$1(`<span id="data-title-text" class="tooltiped" data-toggle="tooltip" data-title="${title}" data-placement="bottom">${title}</span>`);
    $form.find('.data-title #data-title-text')
      .replaceWith($titleText);

    tooltip($titleText);

    $form.find('.menu-data-endline .data-user').html(json.dataUser);
  }

}

function displayFormErrors($form, json) {
  $form = $$1($form);
  if(!$form.length || !(json && json.formErrors)) { return; }

  json.formErrors.forEach((err) => {
    const controlId = err.controlId;
    let $control = $$1(`#${controlId}`);

    if(!$control.length) { $control = $$1(`#data-form-${controlId}`); }
    if(!$control.length) { return; }

    if(!$control.hasClass('form-group') && !$control.hasClass('error-container')) {
      $control = $control.parents('.form-group');
    }

    if(!$control.length) { return; }

    $control.addClass('has-error');

    if(err.msg) {
      let $msg = $control.find('.error-msg');

      if(!$msg.length) {
        let $container = $control.find('.error-container');
        if(!$container.length) { $container = $control; }

        $msg = $$1('<span class="help-block error-msg"></span>')
          .prependTo($container);
      }

      $msg.html(err.msg);
    }
  });
}

/* globals tinyMCE */

function formRequester() {
  $$1('.form-requester').each((i, form) => {
    $$1(form).unbind('submit').bind('submit', (e) => {
      if(typeof tinyMCE !== 'undefined') { tinyMCE.triggerSave(); }

      const $form = $$1(e.currentTarget);
      const formId = $form.attr('id');

      if(!formId) { return false; }

      const formIdClean = formId.replace(/-/g,'_');
      const $statusList = $form.find('.data-status-list');

      // on envoie le statut en cours de soumission si jamais il existe
      if($statusList.length) {
        const $statusFirst = $statusList.first();
        const $statusFirstOld = $form.find(`input[name=${$statusFirst.prop('name')}-old]`);

        $form.find('input[name=data-iddata-status], input[name=data-iddata-status-old]').remove();

        $form
          .append(`<input type="hidden" name="data-iddata-status" value="${$statusFirst.val()}">`)
          .append(`<input type="hidden" name="data-iddata-status-old" value="${$statusFirstOld.val()}">`);
      }

      // on envoie le full page sinon en full page ca fait n'imp (ramène la croix des popups si changement de statut)
      const $fullPage = $form.parents('.full-page');

      if($fullPage.length) {
        form.find('input[name=full-page-view]').remove();
        form.append(`<input type="hidden" name="full-page-view" value="${$fullPage.first().length}">`);
      }

      const formDatas = $form.serializeArray();

      // <--- more datas is filled with an optional external function named getMoreDatas_form_name(); wich return json additionnal datas
      let moreDatas = null;

      const jsFnMoreDatas = window[`getMoreDatas_${formIdClean}`];
      if(isFunction$1(jsFnMoreDatas)) { moreDatas = jsFnMoreDatas(); }
      // --->

      // <--- check form function if exists
      const jsFnCheckForm = window[`check_${formIdClean}`];
      if(isFunction$1(jsFnCheckForm) && !jsFnCheckForm()) { return false; }
      // check form function if exists --->

      cleanForm($form);
      releasePlaceholder($form);

      const $buttons = $form.find(':button:not(.protected)').hide();
      const $waitMsg = $form.find('.submit-waiting-msg').show();

      const $modal = $form.parents('.modal-window');

      // Si il y a une discussion en création on l'ajoute
      $modal.find('.btn-post-discussion').click();
      // Si il y a une discussion en modification on l'enregistre
      $modal.find('.btn-update-discussion').click();

      if($$1(window).width() >= 768 && ($$1('#data-iddata').val() < 1 || $$1('#data-published').val() > 0)) {
        displayModalKindexWaiting($modal, true);
      }

      execQuery('submit-form', {
        'form-id': formId,
        'form-datas': formDatas,
        'more-datas': moreDatas
      })
        .then((json) => {
          // ajax info
          if(json.type === 'info') {
            displayModalKindexWaiting($modal, false);
            if(json.msg) { displayInfo(json.msg); }

            $buttons.show();
            placeholder($form);
          }

          // Si on est en publication on vérifie le matching

          // On reinitialise le champs permettant de catcher qu'il y a eu des modifications dans la fiche
          $modal.find('.modal-window-modif').val('0');

          if($$1(window).width() >= 768 && json.published) {
            execQuery('update-modal-window-kindex-matching', {
              'iddata': json.iddata,
              'iddataType': $modal.find('#data-iddata-type').val(),
              'iddataDisplay': $modal.find('#data-iddata-display').val(),
              'createKindex': true
            }, false)
              .then((kindexJson) => {
                displayModalKindexWaiting($modal, false);

                if($$1('.tabler-container:first').length > 0 && $form.find('input[name=minifiche]').val() != '1') {
                  tablerRowUpdate($$1('.tabler-container:visible').first().find('.tabler'), json.iddata);
                }

                if(isNumber(kindexJson.kindexModalDisplay)) {
                  const kindexdata = kindexJson.kindexModalData; // toJSON(kindexJson.kindexModalData);

                  $$1('#data-iddata').val(json.iddata);
                  $$1('#data-published').val(0);

                  // On cree la fenetre des matching
                  const resultDisplay = displayKindexModal($modal , kindexdata, true);
                  if(resultDisplay === 'finalize') { finalizeForm(form, json); }
                } else {
                  // Si pas de kindex on recharge la fiche
                  finalizeForm(form, json);
                }
              });
          } else {
            displayModalKindexWaiting($modal, false);

            if($$1('.tabler-container:first').length > 0 && $$1(form).find('input[name=minifiche]').val() != '1') {
              tablerRowUpdate($$1('.tabler-container:visible').first().find('.tabler'), json.iddata);
            }

            finalizeForm(form, json);
          }
        })
        .catch((err) => {
          $buttons.show();
          $waitMsg.hide();

          displayModalKindexWaiting($modal, false);
          displayFormErrors($form, err);
          placeholder($form);

          if(err.errorCallback) {
            try {
              window[err.errorCallback](err);
            } catch(ex) {
              console.error(`Callback function not defined: ${err.errorCallback}`);
            }
          }
        });

      return false;
    });
  });

  return false;
}

function resizeSliderNews() {
	$$1('#slider').each(function() {
		var sliderWidth = $$1(this).width();
		var sliderHeight = $$1(this).height();

		var counter = 0;

		$$1(this).find('.slide').each(function() {
			$$1(this).css('width', sliderWidth+'px').css('height', sliderHeight+'px').css('left', (counter*sliderWidth)+'px');
			counter++;
		});

		$$1(this).find('.slides-container').css('left','0');
	});
}

// import 'public-source/js/core/jquery-bundles/fancybox';

// TODO: Optimize/refactor
// TODO: Move to module/bundle
// FIXME: The slider is not very solid, refactor is needed (get slider from tickets)
// NOTE: All is only initialized in 'main.js'

var sliderNewsIsHovered = false;
var sliderNewsIsStopped = false;
var sliderNewsIsMoving = false;
var timerSliderNewsIsHovered = null;
var sliderNewsDirection = 1;
var sliderNewsDelay = 8000;
var sliderNewsDuration = 500;

function tickSliderNews() {

	if ($$1('#slider .slide').length<=1) return;

	if (sliderNewsIsStopped==true) return;

	if ((!sliderNewsIsHovered) && !newsContainerIsReduced())
		(sliderNewsDirection==1) ? gotoNextSlideNews() : gotoPrevSlideNews();

	setTimeout(function() { tickSliderNews(); }, sliderNewsDelay);
}

function gotoNextSlideNews(flagStopSlider) {

	if (sliderNewsIsMoving===true) return;
	if (flagStopSlider===true) sliderNewsIsStopped = true;

	var width = $$1('#slider').width();
	var nbSlides = $$1('#slider .slide').length-1;
	var left = parseInt($$1('#slider .slides-container').css('left').replace('px',''));
	var leftNew = parseInt(left) - parseInt(width);

	if (leftNew>=-(nbSlides*width)) {
		sliderNewsIsMoving = true;
		$$1('#slider .slides-container').animate({
			'left':leftNew+'px'
		}, {
			'duration':sliderNewsDuration,
			'complete':function() { sliderNewsIsMoving = false; }
		});
	}else {
		if (!flagStopSlider) {
			sliderNewsDirection*=-1;
			gotoPrevSlideNews();
		}
	}
}

function gotoPrevSlideNews(flagStopSlider) {

	if (sliderNewsIsMoving===true) return;
	if (flagStopSlider===true) sliderNewsIsStopped = true;

	var width = $$1('#slider').width();
	var left = parseInt($$1('#slider .slides-container').css('left').replace('px',''));
	var leftNew = parseInt(left) + parseInt(width);

	if (leftNew<=0) {
		sliderNewsIsMoving = true;
		$$1('#slider .slides-container').animate({
			'left':leftNew+'px'
		}, {
			'duration':sliderNewsDuration,
			'complete':function() { sliderNewsIsMoving = false; }
		});
	}else {
		if (!flagStopSlider) {
			sliderNewsDirection*=-1;
			gotoNextSlideNews();
		}
	}
}

function toggleNewsContainer() {

	var isReduced = newsContainerIsReduced();

	isReduced ? $$1('#news-container').removeClass('reduced') : $$1('#news-container').addClass('reduced');

	//On met en session si l'utilisateur affiche ou cache les actualités
	execQuery("open-close-news", {'openNews':isReduced}, null);
}

function newsContainerIsReduced() {

	var classe = $$1('#news-container').attr('class');
	if (typeof(classe)=='undefined') classe = '';

	return (classe.indexOf('reduced')>=0);
}

function news() {
	if ($$1('#slider').length<=0)
		return;

	$$1('#news-container .toggler-news').bind('click', function() { toggleNewsContainer(); });

	// <--- stop the slider if user's mouse enter in during 2 sec
	$$1('#slider').bind('mouseenter', function() {

		if (timerSliderNewsIsHovered!=null) clearTimeout(timerSliderNewsIsHovered);
		sliderNewsIsHovered = true;
		timerSliderNewsIsHovered = setTimeout(function() { sliderNewsIsStopped = true; }, 1000);

	}).bind('mouseleave', function() {

		sliderNewsIsHovered = false;
		if (timerSliderNewsIsHovered!=null) clearTimeout(timerSliderNewsIsHovered);
	});
	// ---->

	// <--- next & previous buttons
	if (($$1('#slider .next-slide').length<=0) && ($$1('#slider .slide').length>1))
		$$1('#slider').append('<div class="next-slide"><i class="glyphicon glyphicon-circle-arrow-right"></div></div>');

	if (($$1('#slider .prev-slide').length<=0) && ($$1('#slider .slide').length>1))
		$$1('#slider').append('<div class="prev-slide"><i class="glyphicon glyphicon-circle-arrow-left"></div></div>');

	if ($$1('#slider .next-slide').length>0)
		$$1('#slider .next-slide').bind('click', function() { gotoNextSlideNews(true); });

	if ($$1('#slider .prev-slide').length>0)
		$$1('#slider .prev-slide').bind('click', function() { gotoPrevSlideNews(true); });
	// next & previous buttons --->

	resizeSliderNews();

	$$1('#news-container .slide-content-txt a[href="#"]:has(img)').fancybox();

	setTimeout(function() { tickSliderNews(); }, sliderNewsDelay);
}

function leadingZero(num, len=2) {
  len = Math.max(String(num).length, len);
  return `${Math.pow(10, len)}${num}`.substr(-len);
}

// FIXME: check usecase
// NOTE: Is only used in app.js

let $chronos = $$1([]);

const secPerMin = 60;
const secPerHour = secPerMin * 60;
const secPerDay = secPerHour * 24;

function updateChrono() {
  // Remove chronos from the list that have reached zero
  $chronos = $chronos.filter((i, $chrono) => {
    const chrono = $$1($chrono).data('chrono');

    // filter out this chrono if we reached 0
    // (decrease time after the check)
    if(!chrono || chrono.time-- <= 0) { return false; }

    const { days, hours, min, sec, time } = chrono;

    const d = Math.floor(time / secPerDay);
    const h = Math.floor((time - d) / secPerHour);
    const m = Math.floor((time - h) / secPerMin);
    const s = time - m;

    days.text(leadingZero(d));
    hours.text(leadingZero(h));
    min.text(leadingZero(m));
    sec.text(leadingZero(s));

    return true;
  });

  // We only update again if there are any chronos to update
  if($chronos.length) { setTimeout(updateChrono, 1000); }
}

function startChrono() {
  $chronos = $$1('.dynamic-chrono').each((index, $chrono) => {
    $chrono = $$1($chrono);

    const $sec = $chrono.find('.chrono-value.seconds:first');
    const $min = $chrono.find('.chrono-value.minutes:first');
    const $hour = $chrono.find('.chrono-value.hours:first');
    const $day = $chrono.find('.chrono-value.days:first');

    $chrono.data('chrono', {
      time: (Number($day.text()) * secPerDay) + (Number($hour.text()) * secPerHour) + (Number($min.text()) * secPerMin) + Number($sec.text()),
      sec: $sec,
      min: $min,
      hour: $hour,
      day: $day
    });
  });

  updateChrono();
}

// TODO: Optimize/refactor
// NOTE: Used in 'main.js' and 'subPaddle.js'

var statsTimer = null;

function tickstats() {

	$$1('.stats-slider-container').each(function() {

		var statsContainer = $$1(this);

		if ($$1(statsContainer).find('.stat').length>1) {

			var index = $$1(statsContainer).find('input[name=index]').val();
			var count = $$1(statsContainer).find('input[name=count]').val();
			var width = $$1(statsContainer).find('input[name=width]').val();
			var direction = $$1(statsContainer).find('input[name=direction]').val();

			index = parseInt(index) + parseInt(direction);

			if ((index<=0)||(index>=parseInt(count)-1)) {
				direction*=-1;
			}

			$$1(statsContainer).find('.stats-slider').animate({
				'left':'-'+(index*width)+'px'
			}, {
				'easing':'easeOutBounce',
				'duration':600
			});

			$$1(statsContainer).find('input[name=direction]').val(direction);
			$$1(statsContainer).find('input[name=index]').val(index);
		}

	});

	statsTimer = setTimeout(function() {

		tickstats();

	}, 2000);
}

function stats() {
	const $container = $$1('.stats-slider-container').each(function() {

		var statsContainer = $$1(this);
		var width = $$1(statsContainer).width();
		var count = 0;

		// <-- initialize stat width and left
		$$1(statsContainer).find('.stat').each(function() {
			$$1(this).css("width", width+"px").css("left", (width*count)+"px");
			count++;
		});
		// --->

		// <-- append hidden inputs to store slider values
		$$1(statsContainer).append($$1('<input />', {
			'type':'hidden',
			'name':'width',
			'value':width
		}));
		$$1(statsContainer).append($$1('<input />', {
			'type':'hidden',
			'name':'count',
			'value':count
		}));
		$$1(statsContainer).append($$1('<input />', {
			'type':'hidden',
			'name':'index',
			'value':0
		}));
		$$1(statsContainer).append($$1('<input />', {
			'type':'hidden',
			'name':'direction',
			'value':1
		}));
		// -->

		// <-- init events
		$$1(statsContainer).off("mousenter").on("mouseenter", function() {
			if (statsTimer!=null) {
				clearTimeout(statsTimer);
			}
		}).unbind("mouseleave").bind("mouseleave", function() {
			statsTimer = setTimeout(function() {
				tickstats();
			}, 2000);
		});
		// --->

		// finaly display stats
		$$1(statsContainer).find('.stat').fadeIn();
	});

	if(!$container.length) { return; }

	// launch stats ticker
	if (statsTimer!=null) {
		clearTimeout(statsTimer);
	}

	statsTimer = setTimeout(function() {

		tickstats();

	}, 2000);

}

const UPDATE_UI_DELAY = 1000 * 60 * 2; // 2 mn

// <--- frequently UI update (notifications and logged users)
function updateUi() {
	const $cagnotte = $('.counter-cagnotte');

	execQuery("update-ui", { cagnotte: !!$cagnotte[0] }, null)
		.then((response) => {
			if(!isAjaxSuccess(response)) { return; }

			const $notification = $('#notifications-user');

			if(!$notification[0]) { return; }

			const count = parseInt(response.notifications.count);
			const $badge = $notification.find('.notifications-badge');
			const $container = $notification.find('.notifications-container');

			$notification.toggleClass('active', count > 0);
			$badge.html(count > 0 ? `Vous avez ${count} notification${count > 1 ? 's': ''}` : '');

			if(count > 0) {
				$container.show().effect("bounce");
			} else {
				$container.hide();
			}

			$("#logged-users-info").html(response.users.count);
			$cagnotte.html(response.cagnotte);
		});

	setTimeout(updateUi, UPDATE_UI_DELAY);
}
// ---->

// NOTE: only used in app.js

function codeContainers() {
  $$1(document).on('keydown', 'textarea.code-container', (e) => {
    if(e.which === 9) {
      e.preventDefault();

      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      // set textarea value to: text before caret + tab + text after caret
      textarea.value = `${text.substring(0, start)}\t${text.substring(end)}`;
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }
  });
}

function resizeStructure(fnCallback) {

	if (!$$1(".structure-container").length) { return; }

	var structureContainerWidth = $$1(".structure-container").width();

	var structureLeftWidth = ($$1(".structure-container .left").length>0 && $$1('.structure-container .left').is(':visible')) ? $$1(".structure-container .left").width()+20 : 0;
	var structureRightWidth = ($$1(".structure-container .right").length>0 && $$1('.structure-container .right').is(':visible')) ? $$1(".structure-container .right").width()+20 : 0;



	if ($$1(window).width() < 768)
		$$1(".structure-container .middle").css("padding", 0);
	else {
		$$1(".structure-container .middle").css("padding-left", structureLeftWidth);
		$$1(".structure-container .middle").css("padding-right", structureRightWidth);
	}

	if (!$$1(".structure-container .middle").is(':visible'))
		$$1(".structure-container .middle").fadeIn();

	if (typeof(fnCallback)!='undefined') fnCallback();
}

function checkAll(elt, classe) {
	$$1(classe).prop("checked", $$1(elt).prop("checked"));
}

/**
 * removeCrawlingResult
 * Remove values inserted by crawling and remove crawling-highlight class.
 * @author Thibault Stocker
 */
function removeCrawlingResult(elt) {
  if(elt) {
    $$1(elt).parents('.input-group').find(':input:first').val('');
  }
  $$1('.crawling-highlight,.crawling-item, .crawling-result').each(function() {
    if($$1(this).val()) {
      $$1(this).val('');

      $$1(this).removeClass('crawling-highlight');
    } else if($$1(this).hasClass('crawling-list') || $$1(this).hasClass('crawling-item') || $$1(this).hasClass('crawling-result'))
      $$1(this).remove();
    else {

      // remove files
      var regResult = /data-file-([0-9]+)/.exec($$1(this).attr('class'))
      if(regResult) {

        var parent = $$1(this).parents('[class^="form-group"]');
        var input = $$1(parent).find('input[name^="data-"]')
        if($$1(input).val()) {
          var aValues = $$1(input).val().split(',');
          var idx = aValues.indexOf(regResult[1]);
          if(idx != -1) {
            aValues.splice(idx, 1);
          }
          $$1(input).val(aValues.join());
          $$1(this).remove();
        }
        return;
      }

      // remove keywords
      var regResult = /([0-9]+)/.exec($$1(this).attr('data-id'))
      if(regResult) {

        var parent = $$1(this).parent().parent().parent();
        var input = $$1(parent).find('input[name^="data-add-"]');
        if($$1(input).val()) {
          aValues = $$1(input).val().split(',');
          var idx = aValues.indexOf(regResult[1]);
          if(idx != -1) {
            aValues.splice(idx, 1);
          }
          $$1(input).val(aValues.join());
          $$1(this).remove();
        }
        return;
      }
    }
  });
}

// TODO: Modyfied, so verify functionality

function nl2br(str = '') {
  return str.replace(/[\n\r]+/g, '<br>');
}

/**
 * Changes all concatination chars into a dash and removes all non letters/numbers.
 * It will remove all diacritics (accents etc.) from the letters, unless instructed not to
 * @param  {string} str = Input string
 * @param  {Boolean} keepDiacritics = Whether to keep the diacritics or not
 * @return {string} Dash formated string
 */
function dashString(str, keepDiacritics) {
  str = `${(str || '')}`.toLowerCase();
  if(!keepDiacritics) { str = cleanDiacritics(str); }
  return str
    .replace(/[·./_,:;\s]+/g, '-') // Convert concatination chars into dash ('-')
    .replace(/^-+|[^a-z0-9-]|-+$/g, '') // Remove invalid chars and end dashes
    .replace(/-+/g, '-'); // Collapse multiple dashes
}

/**
 * closeSearchEasyDataField close the search results container and reset search flag to 0
 * @param  {DOM} panel current field panel
 */
function closeSearchEasyDataField(parent, flagReset) {

  if(typeof(flagReset) == 'undefined')
    flagReset = true;

  if(flagReset == true)
    $$1(parent).find('.easy-data-field-flag-search').val('0');
  else
    $$1(parent).find('.easy-data-field-flag-search').val('3');

  $$1(parent).find('.easy-data-field-search').hide();
  $$1(parent).find('easy-data-field-search-content').html('');
}

function initEasyDataFields() {

  // update easy-data-value when change is picked up
  $$1('.easy-data-field-input').unbind('change').bind('change', function() {

    var input = $$1(this);
    var item = $$1(input).parents('.list-group-easydata:first');
    var obj = {};
    var flagEmpty = true;
    $$1(item).find('.easy-data-field-input').each(function() {
      var uid = $$1(this).data('uid');
      var value = $$1(this).val();
      obj[uid] = value;

      if(value != '') {
        flagEmpty = false;
      }
    });

    if(flagEmpty) {
      $$1(item).find('.easy-data-field-value').val('');
      return;
    }

    obj['__id__'] = $$1(item).find('.easy-data-field-id').val();

    $$1(item).find('.easy-data-field-value').val(base64Encode(JSON.stringify(obj)));
  });

  //initEasyDataFieldsSearch();
}

function addEasyDataField(elt) {
  var panel = $$1(elt).parents('.panel:first');
  var template = $$1(panel).find('.easy-data-edit-fields-template');
  var fieldTemplate = base64Decode($$1(template).html());

  var field = $$1(fieldTemplate);
  if($$1(panel).find('.panel-body .list-group').length > 0)
    $$1(panel).find('.panel-body .list-group').append(field);
  else
    $$1(panel).find('.panel-body .tabler').append(field);

  $$1(field).find('.easy-data-field-id:first').val(-(Math.round(111111 + (Math.random() * 888888))));

  $$1(panel).find('.easy-data-field-search').hide();

  initEasyDataFields();
}

function controlLinkUpdateValue(elt) {

  var url = $$1(elt).parents('.row-link:first').find('.link-url').val();
  var title = $$1(elt).parents('.row-link:first').find('.link-title').val();

  $$1(elt).parents('.row-link:first').find('.link-value').val(url + '|||' + title);
}

// import 'bootstrap-stylus/js/modal';

function UserActionModal(options) {
  if(!options) options = {};
  options.body = $$1('<div>')
    .addClass('modal-body')
    .append(options.body);
  $$1.extend(this, options);
  var self = this;

  var zindex = parseInt(this.parentdiv.parents('.modal, .modal-window').css('z-index'));

  var modal = $$1('<div>')
    .addClass('modal modal-page ' + (this.class || ''))
    .css('z-index', zindex + 1)
    .attr('role', 'dialog')
    .attr('tabindex', '-1');
  if(this.id)
    modal.attr('id', this.id);
  var title = $$1('<div>')
    .addClass('modal-header')
    .append('<button id="cancelIcon" class="modal-header-close" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i></button>');
  if(this.icon)
    title.append('<span class="modal-header-icon"><i class="glyphicons glyphicons-' + this.icon + '"></i></span>')
  title.append('<h2 class="modal-title">' + (this.title || '') + '</h2>')

  var content = $$1('<div>')
    .addClass('modal-content')
    .append(title)
    .append(this.body);

  var footer = $$1('<div>').addClass('modal-footer');
  for(var action_name in this.actions) {
    var action = this.actions[action_name];
    this.actions[action_name].button = $$1('<button>')
      .attr('type', 'button')
      .addClass('btn ' + (action.class || 'btn-default'))
      .html(action.title)
      .click({
        modal: self
      }, action.click);

    if(!this.prevent_dismiss)
      this.actions[action_name].button.attr('data-dismiss', 'modal');
    footer.append(
      this.actions[action_name].button
    );
  }
  content.append(footer.append('<div class="clearfix"></div>'));

  modal.append(content);
  content.wrap('<div class="modal-dialog">');

  $$1(document).find("body").append(modal);
  this.modal = modal;

  this.open = function() {

    this.modal.modal({
      show: true,
      backdrop: this.backdrop || 'static',
      keyboard: false
    })
  }
  this.close = function(keep) {
    this.modal.modal('hide');
    if(!keep)
      this.remove();
  }
  this.remove = function() {
    this.modal.remove();
  }
  return this;
}

function Crawling(idData, form) {
  var self = this;
  this.crawler_ref = idData;
  this.$form = form;

  this.google_datas = {};
  this.mouseOnResults = false;

  this.google_xhr;


  this.loaded = function(callback) {
    if(!self.mapping) {
      setTimeout(function() {
        self.loaded(callback);
      }, 100);
    } else {
      callback();
    }
  };

  execQuery('crawling-definition', {
      'dataRef': self.crawler_ref
    })
    .then((json) => {
      self.mapping = json.definition;
      for(var cfield in self.mapping) {
        var datafield = self.mapping[cfield].uik;
        $$1('#form-group-' + datafield + '>.crawling').remove();

        var div = $$1('<div>')
          .addClass('crawling')
          .append(
            $$1('<div>')
            .addClass('crawling-status')
            .append($$1('<div>'))
            .append($$1('<div class="tp" data-title="Recherche en cours">'))
            .bind('pending', function() {
              $$1(this).addClass('pending');
            })
            .bind('ok', function() {
              $$1(this).removeClass('pending');
              hideTooltip($$1('> div.tp', this));
            })
          );
        $$1('#form-group-' + datafield).prepend(div);

        tooltip(div.find('.crawling-status > div.tp'), {
          container: div
        });
      }
    });

  this.displayWebsiteResults = function(elt, websitesList) {

    self.removeGoogleListOptions(elt.parent());
    var nameHelp = $$1('[name=help-' + elt.attr('name') + ']', elt.parent());
    if(nameHelp.length && nameHelp.html() !== '' && nameHelp.html() !== undefined)
      var help = $$1('<li>').html(nameHelp.html()).addClass('list-group-item row google-helper');

    var ul = $$1('<ul class="list-group google-result" id="choice-google-result">')
      .click(function(e) {
        e.stopPropagation();
      });
    if(help)
      ul.append(help);

    if(websitesList && websitesList.length) {
      for(var i = 0;
        (i < 5 && i < websitesList.length); i++) {
        var item = websitesList[i];
        var elttext = $$1('<div class="col-xs-11">')
          .append('<div class="googleTitle">' + item.htmlTitle + '</div>')
          .append('<div class="googleLink">' + item.link + '</div>')
          .click({
            url: item.link,
            elt: elt
          }, self.selectSite);
        var eltlink = $$1('<a target="_blank" href="' + item.link + '">')
          .append('<img alt="voir" width="20px" src="' + rootURL('pub/img/btn-consult.png') + '" />')
          .click(function() {
            //elt.focus();
            setTimeout(function() {
              self.mouseOnResults = false;
            }, 100);
            //	window.open(link)
          });

        var li = $$1('<li class="list-group-item row">')
          .attr('id', 'choice-startup-' + i)
          .append(elttext)
          .append($$1('<div class="col-xs-1">')
            .append(eltlink)
          );
        $$1(ul).append(li);
      }


    } else {
      $$1(ul).append('<li class="list-group-item row"><i>--- Pas de résultats ---</i></li>');
    }

    elt.parent().append(ul);
    ul
      .mouseenter(function(e) {
        e.stopPropagation();
        self.mouseOnResults = true;
      })
      .mouseleave(function(e) {
        e.stopPropagation();
        self.mouseOnResults = false;
        //  elt.focus();
      });
    $$1(document).unbind('removegoogleresults').on('removegoogleresults', function() {
      if(!self.mouseOnResults) {
        self.removeGoogleListOptions(elt.parent());
      }
    });
    $$1(document).click(function(e) {
      $$1(this).trigger('removegoogleresults');
    });
  };
  this.search = function(elt, keyword, referer) {

    referer.trigger('loadgoogle');
    if(!keyword.length) {
      self.removeGoogleListOptions();
      referer.trigger('loadedgoogle');
      return;
    }

    var processGoogleResponse = function(response) {

      if(typeof(response) === 'object') { // TODO : and not an error
        self.displayWebsiteResults(elt, response.items);
      }
      referer.trigger('loadedgoogle');
    }

    if(self.google_datas[keyword] != undefined) {
      processGoogleResponse(self.google_datas[keyword]);
    } else {

      execQuery('crawling-searchsite', {
          'search': keyword
        })
        .then((json) => {
          self.google_datas[keyword] = json;
          processGoogleResponse(json);
          referer.trigger('loadedgoogle');
        });
    }

  };
  this.removeGoogleListOptions = function(container) {
    $$1('#choice-google-result', container).remove();
  };
  this.selectSite = function(event) {
    if(event.stopPropagation)
      event.stopPropagation();
    var url = event.data.url;
    var elt = event.data.elt;
    setTimeout(function() {
      self.removeGoogleListOptions(elt.parent());
    }, 1000);

    var searchstring = elt.val();
    //elt.val('Recherche automatique en cours');
    elt.attr('disabled', 'disabled');

    $$1('.crawling .crawling-status', self.$form).trigger('pending');
    // search crawling information
    execQuery('crawling-search', {
        'search': url,
        'dataRef': self.crawler_ref
      })
      .then((json) => {
        removeCrawlingResult();
        self.completeInfo(json.datas, json.definition, elt);

        elt.attr('disabled', false);
        $$1('.crawling .crawling-status', self.$form).trigger('ok');
        elt.trigger('loadedgoogle');
      })
      .catch(() => {
        elt.attr('disabled', false);
        $$1('.crawling .crawling-status', self.$form).trigger('ok');
        elt.trigger('loadedgoogle');
      });
  };
  this.completeInfo = function(data, definition, elt) {
    var has_result = false;
    for(var crawling_field in definition) {

      var crawling_value = data[crawling_field];
      var def = definition[crawling_field];

      if(crawling_value) {
        var fn = 'set' + def.type;

        if(typeof this[fn] != 'function') {
          console.warn('function crawler.' + fn + ' is not defined');
          continue;
        }
        var container = $$1('#form-field-' + def.uik + ' .crawling', self.$form);
        container.append('<div class="crawling-result"></div>');

        if(this[fn](crawling_value, def, data.company)) {
          /*$('.crawling-result', container)
           .prepend(
           '<div class="crawling-remove-buttons"><button class="btn btn-default" type="button" onClick="removeCrawlingResult()" data-toggle="tooltip" data-placement="top" title="Effacer les données trouvées par la recherche automatique"><span class="glyphicons glyphicons-remove"></span> Effacer</button></div>'
           );
           */
          if($$1('.crawling-result', container).text().trim() == '') {
            $$1('.crawling-result', container).remove();
          }
          has_result = true;
        } else {
          $$1('.crawling-result', container).remove();
        }
      }
    }
    if(has_result) {
      const $result = $$1('<span class="crawling-result" data-toggle="tooltip" data-placement="top" title="Réinitialiser les données trouvées par la recherche automatique">\n\
      <span class="glyphicons glyphicons-remove"></span>\n'
        //+'        <span class="visible-lg-inline">Réinitialiser les données trouvées par la recherche automatique</span>\n'
        //+'        <span class="visible-md-inline">Réinitialiser la rech. auto.</span>\n'
        +
        '        Réinit.' +
        '    </span>').click((e) => {
        removeCrawlingResult(e.currentTarget);
      });

      elt.parent().find('.crawling-buttons').prepend($result);
    }
  };
  this.settext = function(value, def) {
    var elt = this.$form.find('[name="data-' + def.uik + '"]');
    if(!elt.length)
      return false;

    if(elt.val() == '') {
      elt.val(value).addClass('crawling-highlight');
      elt.trigger('keyup');
      elt.on('change keyup', function() {
        if($$1(this).val() != value)
          $$1(this).removeClass('crawling-highlight');
      });
    } else {
      if(elt.val() == value) {
        return false;
      }
      this.$form.find('#form-group-' + def.uik + ' .crawling .crawling-result').append(
        $$1('<div>').addClass('crawling-highlight')
        .html(nl2br(value))
        .prepend($$1('<div>').addClass('crawling-note')
          .html('<b>La recherche automatique a récupéré un contenu différent :</b>'))

      );
    }
    return true;
  };

  this.setarray = function(value, def) {

    var changed = false;
    var fields = this.$form.find('.data-container [name="data-' + def.uik + '"]');
    if(!fields.length)
      return false;

    var datacontainer = $$1(fields.get(0)).parents('.data-container');
    if($$1(fields.get(0)).parents('.input-container').find('.data-model').length > 0) {

      var istable = datacontainer.find('table').length ? true : false;

      for(var linkName in value) {

        if(istable) {

          var e = datacontainer.find('[name="data-' + def.uik + '"]').filter(function() {
            if(linkName == 'website')
              return new RegExp('\\|\\|\\|((\\*.*)|(site internet)|website)', 'i').test($$1(this).val());
            else
              return new RegExp('\\|\\|\\|' + linkName + '', 'i').test($$1(this).val());
          });

          if(!e.length) {
            datacontainer.parents('.input-container').find('.btn-add').trigger('click');
            e = datacontainer.find('tr:last-child [name="data-' + def.uik + '"]');
            e.parents('tr').find('input[type="text"]:first').val(linkName).addClass('crawling-highlight');
            e.parents('tr').addClass('crawling-item');
            changed = true;
          }
          var l = e.parents('tr').find('input[type="text"]:last');

          if(l.val() == '') {
            l.val(value[linkName]).addClass('crawling-highlight');
            controlLinkUpdateValue(l);
            changed = true;
          }
        } else //cas multi emails
        {
          var elt = datacontainer.find('input[name="data-' + def.uik + '"][value="' + value[linkName] + '"]');
          var empty = datacontainer.find('input[name="data-' + def.uik + '"]').filter(function(index) {
            return $$1(this).val() == '';
          });

          if(!elt.length) {
            if(empty.length)
              $$1(empty.get(0)).val(value[linkName]).addClass('crawling-highlight');
            else {
              datacontainer.parents('.input-container').find('.btn-add').trigger('click');
              datacontainer.find('.row:last [name="data-' + def.uik + '"]')
                .val(value[linkName])
                .addClass('crawling-highlight');
              controlLinkUpdateValue(l);
              datacontainer.find('.row:last').addClass('crawling-item');

            }
            changed = true;
          }
        }
      }
    } else {

      for(var linkName in value) {
        var nodeToFill = elt.parent().find('input.link-url');
        if(nodeToFill.val() == '') {
          nodeToFill.val(value).addClass('crawling-highlight');
          var urlelt = elt.parents(".row-link").find(".link-value");
          urlelt.val(urlelt.val() + "|||" + elt.parents(".row-link").find(".link-title").val());
          changed = true;
        }
      }
    }

    return changed;
  };

  this.setkeywords = function(values, def) {

    var control = $$1('[data-uid="' + def.uik + '"]', this.$form);
    if(!control.length)
      return false;

    var changed = false;

    var removeIds = $$1('#data-remove-' + def.uik, control).val().split(',').filter(function(v) {
      return v != '';
    });
    var aIds = $$1('#data-present-' + def.uik, control).val().split(',').filter(function(v) {
      return v != '' && $$1.inArray(v, removeIds) == -1;
    });

    var aIdsBack = JSON.parse(JSON.stringify(aIds));
    // for all keyword create node and add it
    for(var idValues in values) {
      if(values[idValues]['id'] && $$1.inArray(values[idValues]['id'] + '', aIdsBack) == -1) {
        if(values[idValues]['html']) {
          var sHtml = values[idValues]['html'];
          var p = $$1('<div>').addClass('label-keyword-mouse wide unmarged').html(sHtml)
          var span = $$1('<span>').attr('data-id', values[idValues]['id']).addClass('crawling-highlight');
          aIds.push(values[idValues]['id']);
          $$1('.control-selector-placeholder').hide();
          //		var ctrlLabel = $($(".control-selector")
          var i = $$1('<i>').addClass('glyphicon glyphicon-remove-circle').unbind("click").bind("click", function() {
            removeItemSelector(control, $$1($$1(this).parents('[data-id]').get(0)).attr('data-id'));
          })
          $$1(span).append($$1(p)).append($$1(i));
          control.find('.control-selector-label').append(span);
        }
      }
    }

    if(aIds.join() != aIdsBack.join()) {
      $$1('#data-add-' + def.uik).val(aIds.join());
      changed = true;
    }
    return changed;
  };

  this.setfile = function(value, def) {
    if(!$$1('#form-group-' + def.uik).length)
      return false;

    if(value.length <= 0)
      return false;

    if(!$$1('.data-files'))
      $$1('#form-group-' + def.uik).append($$1('<div>').addClass('data-files'));

    // add id img in value to save
    ($$1("#data-" + def.uik).val().length === 0) ? $$1("#data-" + def.uik).val(value['id']): $$1("#data-" + def.uik).val($$1("#data-" + def.uik).val() + ',' + value['id']);

    var class1 = "";
    var class2 = "";
    switch(def.display_mode) {
      case 'thumb':
        class1 = "data-file-thumb";
        class2 = "data-file-icon";
        break;
      case 'icon':
        class1 = "data-file-icon-all";
        class2 = "data-file-icon-big";
        break;
      case 'list':
        class1 = "data-file-list";
        class2 = "data-file-list-title";
        break;
      case 'slider':
        class1 = 'data-file-slide';
        if($$1('#form-group-' + def.uik).find('.data-files > div').length === 0)
          class1 += ' data-file-slide-visible';
        class2 = "data-file-slide-content";
        break;
    }

    var eltimg = $$1('<div>')
      .append(
        $$1('<a>')
        .attr('target', '_blank')
        .attr('href', value['url'])
        .append(
          $$1('<div>')
          .addClass(class2)
          .append($$1('<img>').attr('src', def.display_mode === 'thumb' ? value['thumb'] : value['url']))
        )
      );
    if(def.display_mode === 'thumb' || def.display_mode === 'list') {
      if(def.display_mode === 'thumb') {
        eltimg.find('img').parent().append(
          $$1('<div>')
          .addClass("data-file-title")
          .html(value['fileName'])
        );
      }
      if(def.display_mode === 'list') {
        eltimg.find('img').parent().append(value['fileName']);
      }

      eltimg.addClass(class2);
      eltimg.find('a').addClass('fancybox').attr('rel', 'gallery-' + def.uik).removeAttr('target').find('div').removeClass(class2);
      eltimg.find('img').unwrap();
    }

    var newdivfile = $$1('<div>')
      .addClass('data-file ' + class1 + ' ' + def.display_mode + ' data-file-' + value['id'] + ' crawling-highlight crawling-item')
      .append(
        $$1('<span>')
        .addClass('data-file' + (def.display_mode === 'list' ? '-list' : '') + '-btn-remove')
        .click(function() {
          controlRemoveFile(this, value['id']);
        })
        .append($$1('<i>').addClass('glyphicon glyphicon-remove-sign'))

      ).append(eltimg);
    if(def.display_mode === 'slider') {
      $$1('#form-group-' + def.uik).find('.data-file-slider')
        .append(newdivfile);
    } else
      $$1('#form-group-' + def.uik).find('.data-files')
      .append(
        newdivfile

      );

    return true;
  };

  this.setcontacts = function(value, def, company) {
    if(!$$1('#form-group-' + def.uik).length)
      return false;

    var container = $$1('<div>').addClass('crawling-list').addClass('crawling-list-contacts');
    var ul = $$1('<ul>').addClass('list-inline');
    ul.append('<div>Voici une liste de personnes susceptibles de faire partie de la société' + (company ? ' ' + company : '') + '.</div>');

    var isExistantContact = function(contact) {
      var found = false;
      if(def.mode === 'bloc' || def.mode === 'tableau') {

        $$1('#form-group-' + def.uik + ' .list-group >div').each(function() {
          if(def.fields.name && $$1('[data-field-uid="' + def.fields.name + '"]', this).val().toLowerCase() === contact.name.toLowerCase())
            found = $$1('.easy-data-field-id', this).val();
          if(def.fields.lastname && $$1('[data-field-uid="' + def.fields.lastname + '"]', this).val().toLowerCase() === contact.lastname.toLowerCase() &&
            def.fields.firstname && $$1('[data-field-uid="' + def.fields.firstname + '"]', this).val().toLowerCase() === contact.firstname.toLowerCase())
            found = $$1('.easy-data-field-id', this).val();

        });
      } else if(def.mode === 'etiquette') {

        $$1('.control-selector[data-uid="' + def.uik + '"] .control-selector-label span', self.$form).each(function() {
          if($$1(this).text().toLowerCase().trim() === contact.name.toLowerCase()) {
            found = $$1(this).attr('data-id');
          }
        });

      }
      return found;

    };

    var addContactToList = function(contact) {

      if(def.mode === 'bloc' || def.mode === 'tableau') {
        var $form;
        var already_here = $$1('#form-group-' + def.uik + ' .easy-data-field-id[value="' + contact.iddata + '"]', self.$form);
        if(already_here.length > 0) {
          $form = already_here.parent();
        } else {
          addEasyDataField(container);

          if(def.mode === 'bloc')
            $form = $$1('#form-group-' + def.uik + ' .list-group >div:last');
          if(def.mode === 'tableau')
            $form = $$1('#form-group-' + def.uik + ' .panel-body .tabler tr.list-group-easydata:last');
        }
        if(contact.iddata) {
          $$1('.btn-open-field').show();
          $$1('.easy-data-field-id', $form).val(contact.iddata);
        }
        for(var cfield in def.fields) {
          var field = def.fields[cfield];

          if(!$$1('[data-field-uid="' + field + '"]', $form).val())
            $$1('[data-field-uid="' + field + '"]', $form).val(contact[cfield]).trigger('change');
        }
        initEasyDataFields(); //trigger modifs
      } else { //mode etiquette


        var id = contact.iddata;
        var control = $$1('.control-selector[data-uid="' + def.uik + '"]', self.$form);
        var already_here = $$1('[data-id="' + id + '"]', control);
        if(already_here.length > 0) {
          return;
        }
        var content = '<p style="line-height:16px" class="wide unmarged"><a onclick="consultData(' + contact.iddata + ',{minifiche:1});" style="" href="#">' + contact.title + '</a></p>';
        var span = $$1('<span data-id="' + contact.iddata + '" >' + content + '<i class="glyphicon glyphicon-remove-circle"></i></span>');
        $$1('.control-selector[data-uid="' + def.uik + '"]').find(".control-selector-label").append(span);

        if(control.find('input.data-value').length > 0) { // data-value is present for field select users & select groups ie

          var dataValue = $$1(control).find('input.data-value').val().split(',');
          var flagExists = false;
          for(var i = 0; i <= dataValue.length <= 0; i++)
            if(dataValue[i] == id)
              flagExists = true;

          if(!flagExists)
            dataValue.push(id);
          control.find('input.data-value').val(dataValue.join(','));
        } else { // data-add is present for field select data ie
          if(control.find('input.data-add').length > 0) {
            var dataAdd = $$1(control).find('input.data-add').val().split(',');

            if(control.find('input.data-add').val().length > 0)
              dataAdd.push(id);
            else
              dataAdd = [id];

            control.find('input.data-add').val(dataAdd.join(','));
          }
        }
      }
    };

    var addContact = function(contact, callback, action) {
      var formDatas = [];
      for(var cfield in def.fields) {
        formDatas.push({
          name: cfield,
          value: contact[cfield]
        });
      }

      execQuery('crawling-add-contact', {
          form_datas: formDatas,
          crawler_ref: self.crawler_ref,
          action: action
        })
        .then((json) => {
          contact['iddata'] = json.iddata;
          contact['title'] = json.title;
          addContactToList(contact);

          if(isFunction(callback)) {
            callback('Ajouté');
          }
        })
        .catch((err) => {
          if(err.type !== 'error') {
            return;
          }

          var selected_contact = 0;
          var plural = (err.dupplicates.length > 1);
          var modal = new UserActionModal({
            title: 'Doublon' + (plural ? 's' : '') + ' trouvé' + (plural ? 's' : '') + '!',
            parentdiv: self.$form,
            icon: 'parents',
            class: 'crawling-dupplicates',
            prevent_dismiss: true,
            actions: {
              'merge': {
                title: 'Fusionner les infos avec le contact',
                click: function(e) {
                  addContact(contact, function(modal) {
                    e.data.modal.close();
                    if(typeof callback === 'function') {
                      callback.call(null, 'Ajouté');
                    }
                  }, 'merge|' + selected_contact);
                }
              },
              'create': {
                title: 'Créer un nouveau contact',
                click: function(e) {
                  addContact(contact, function(modal) {
                    e.data.modal.close();
                    if(typeof callback === 'function') {
                      callback.call(null, 'Ajouté');
                    }
                  }, 'create');
                }
              }
            }
          });
          var ul = $$1('<ul>').addClass('list-unstyled');
          for(var i in err.dupplicates) {
            var dupplicate = err.dupplicates[i];
            ul.append($$1('<li>')
              .attr('data-iddata', dupplicate.id)

              .append($$1('<img>')
                .attr('alt', 'voir')
                .attr('width', '20px')
                .attr('src', rootURL('pub/img/btn-consult.png'))
                .addClass('tooltiped')
                .attr('data-title', 'Ouvrir la fiche')
                .click(function() {
                  consultData($$1(this).parent('li').attr('data-iddata'), {
                    minifiche: 1
                  });
                }))
              .append(dupplicate.title + ' - ' + '#' + dupplicate.id + '')
              .click(function(e) {
                if(e.target.nodeName === 'img')
                  return;
                $$1('[name="dupplicate_action"][value="merge"]').prop('checked', true);
                selected_contact = $$1(this).attr('data-iddata');
                ul.find('.active').removeClass('active');
                $$1(this).addClass('active');
                $$1('[name="dupplicate_action"]', modal.body).trigger('changeaction')
              })
            );
          }
          modal.body
            .append(
              $$1('<div>')
              .addClass('row')
              .append('<b>' + err.dupplicates.length + ' ' + (plural ? 'doublons ont été trouvés' : 'doublon a été trouvé') + ' pour ce contact.</b><br/>Sélectionner l\'action à effectuer :')
            )
            .append(
              $$1('<div>')
              .addClass('row')
              .append($$1('<label class="checkbox-inline">')
                .append('<input type="radio" name="dupplicate_action" value="merge"> Sélectionner le contact avec lequel fusionner <span class="glyphicons glyphicons-circle-question-mark tooltiped" data-toggle="tooltip" data-title="Les propriété vides seront complétées avec les informations trouvées"></span> :')
              )
              .append(ul)
            )
            .append(
              $$1('<div>')
              .addClass('row')
              .append('<label class="checkbox-inline"><input type="radio" name="dupplicate_action" value="create"> Créer un nouveau contact</label> ')
            );
          tooltip($$1('.tooltiped', modal.body));
          $$1('[name="dupplicate_action"]', modal.body).each(function() {
            $$1(this).on('changeaction', function() {
              var check = ($$1(this).attr('value') == 'merge' ? (selected_contact ? true : false) : true);
              if($$1(this).is(':checked') && check)
                modal.actions[this.value].button.removeAttr('disabled').removeClass('btn-default').addClass('btn-success');
              else
                modal.actions[this.value].button.attr('disabled', 'disabled').addClass('btn-default').removeClass('btn-success');
            });
            $$1(this).on('change', function() {
              $$1('[name="dupplicate_action"]', modal.body).trigger('changeaction');
            });
            $$1(this).trigger('changeaction');
          });
          modal.open();
        });
    };

    for(var i in value) {
      var contact = value[i];
      var li = $$1('<li>');
      var img = $$1('<img>')
        .attr('src', rootUploadURL('system/users/avatars/1/Profil_H.jpg'))
        //	.attr('height', '95');
      if(contact.photo) {
        img.attr('src', contact.photo);
      }
      img.error(function() {
        $$1(this).attr('src', rootUploadURL('system/users/avatars/1/Profil_H.jpg'));
        $$1(this).unbind('error');
        delete(contact.photo);
      });

      img.addClass('tooltiped')
        .attr('data-title', contact.name + '<br/>' + contact.role)
        .attr('data-html', true);
      li.append(img);
      li.append('<div class="row">' + contact.name + '</div>');
      li.append('<div class="row">' + (contact.role || '') + '</div>');

      var existant_contact_id = isExistantContact(contact);
      if(existant_contact_id) {
        li
          .attr('data-contactk', i)
          .attr('data-contactid', existant_contact_id)
          .append($$1('<button>')
            .addClass('btn btn-default')
            .attr('type', 'button')

            .html('Fusionner')
            .prepend('<i class="glyphicons glyphicons-drop"></i>')
          )
          .click(function() {
            var contact = value[$$1(this).attr('data-contactk')];
            contact.iddata = $$1(this).attr('data-contactid');
            var li = $$1(this);
            addContact(contact, function() {
              li.addClass('added');
              $$1('button', li).replaceWith('<div class="btn status"><span class="glyphicons glyphicons-ok"></span> Fusionné</div>');
            }, 'merge|' + contact.iddata);
          });
      } else {
        li.append(
            $$1('<button>')
            .addClass('btn btn-default')
            .attr('type', 'button')
            .html('Ajouter')
            .prepend('<i class="glyphicons glyphicons-plus"></i>')
          )
          .attr('data-contactk', i)
          .click(function() {
            var li = $$1(this);
            addContact(value[$$1(this).attr('data-contactk')], function(action_done) {
              li.addClass('added');
              $$1('button', li).replaceWith('<div class="btn status"><span class="glyphicons glyphicons-ok"></span> ' + action_done + '</div>');
            });
          });
      }
      ul.append(li);
    }
    container.append(ul);
    container.addClass('crawling-highlight')
    $$1('#form-group-' + def.uik + ' .crawling .crawling-result').append(container);
    tooltip($$1('.tooltiped', container));

    return true;
  };
};

window.removeCrawlingResult = removeCrawlingResult;

function watchForCrawling(elt, onlycrawling) {
  if(!$$1.data(elt, "crawling")) {
    var form = $$1(elt).parents('form').get(0);
    var crawling;
    if(!$$1.data(form, "crawling")) {
      var crawling = new Crawling(form['data-iddata-type'].value, $$1(form));
      $$1.data(form, "crawling", crawling);
    }
    var crawling = $$1.data(form, "crawling");
    var field = $$1(elt);
    var changeTimer = false;
    var searchstring = '';
    var search = function(force) {
      if(force || searchstring !== field.val()) {
        searchstring = field.val();

        crawling.loaded(function() {
          if(/^https?:\/\//.test(searchstring) || onlycrawling) {
            if(!(/^https?:\/\//.test(searchstring))) {
              searchstring = 'http://' + searchstring;
            }
            crawling.selectSite({
              data: {
                url: searchstring,
                elt: $$1(elt)
              }
            });
          } else
            crawling.search($$1(elt), field.val(), field);
        });
      }
    }
    field.bind('loadgoogle', function() {
      //field.attr('disabled', true);

    });
    field.bind('loadedgoogle', function() {

    });
    field.unbind('crawling.go').on('crawling.go', function(e) {
      search(true);
    });

    field.on('blur change', function(e) {
      if(searchstring != field.val())
        search();
    });

    if(!onlycrawling) {
      field.on('keyup', function(e) {
        if(changeTimer !== false)
          clearTimeout(changeTimer);
        changeTimer = window.setTimeout(function() {

          search();
          changeTimer = false;
        }, 1000);
      });
    }

    $$1.data(elt, "crawling", 1);
  }
};

// FIXME: include in a on ready script
// NOTE: This was activated on mouse over on an input-group (Crawling.php line 969),
// check when to activate it
function crawling() {
  $$1('[crawling-watcher]').each(function() {
    var $elt = $$1(this).find(':input:first');

    if($elt.length) {
      var elt = $elt.get(0);
      if(!$$1.data(elt, "crawling")) {
        $$1.data(elt, "crawling", true);
        var onlycrawling = $$1(this).attr('crawling-watcher') == 'crawling';
        watchForCrawling($$1(this).find(':input:first'), onlycrawling);
        $$1('.crawling-action', this).click(function(e) {
          e.stopPropagation();
          if(!$$1(elt).hasClass('crawling-result'))
            $$1(elt).trigger('crawling.go');
        })

      }
    }
  });
}

window.crawling = crawling;

let flagMouseLoggedUsers = false;

function initLoggedUsersList() {
  if($$1("#logged-users").find("#logged-users-list").length > 0) return;

  $$1("#logged-users").append("<div id='logged-users-list'></div>");

  $$1("#logged-users-list, #logged-users").bind("mouseenter", function() {
    flagMouseLoggedUsers = true;
  }).bind("mouseleave", function() {
    flagMouseLoggedUsers = false;
  });
}

function showLoggedUsersList() {
  initLoggedUsersList();
  flagMouseLoggedUsers = true;
  $$1("#logged-users-list").html("<center>Chargement ...</center>");
  $$1("#logged-users-list").show();
}

function getLoggedUsers() {
  flagMouseLoggedUsers = true;

  showLoggedUsersList();

  execQuery("get-logged-users", false)
    .then((json) => {
      $$1("#logged-users-list").html(base64Decode(json.content));
      initUserHover$1();
    });
}

function initLoggedUsers() {
  $$1("#logged-users").bind("mousedown", function() {
    $$1("#logged-users-list").is(":visible") ? $$1("#logged-users-list").hide() : getLoggedUsers();
  });
}

const vars = {
  lastGlobalSearchTable: "",
  lastGlobalSearchGlobal: "",
  currentGlobalSearch: "",
  globalSearchContainerZIndex: null,
  searchDegraded: false,
  autoCompletion: null,
  nameTimer: null
}

var timerFeeds = null;

function loadWallPHP() {

  var uikDataType = '';
  var filtersType = '';
  var keywordsDegraded = '';
  var idkeyword = 0;
  var my = false;
  var optionsWall = stringToJSON(base64Decode($$1('#feeds-filters #optionsWall').val()));
  var allAdmin = optionsWall.allAdmin;
  var datasTypesIds = optionsWall.datasTypesIds;
  var displayDataType = optionsWall.displayDataType;
  var user = optionsWall.user;

  if(currentFiltersSearch !== null) {
    if(currentFiltersSearch.uikDataType !== '') uikDataType = currentFiltersSearch.uikDataType;
    if(currentFiltersSearch.filtersType.length > 0) filtersType = currentFiltersSearch.filtersType;
    if(currentFiltersSearch.idkeyword !== '') idkeyword = currentFiltersSearch.idkeyword;
    if(currentFiltersSearch.my !== '') my = currentFiltersSearch.my;
  }

  $$1('#feeds-container').html('<div class="msg-loading">\
			<p>Chargement en cours</p>\
			<div class="loading"></div>\
		</div>');
  $$1("#feeds-container .msg-loading").fadeIn("fast");

  vars.nameTimer = setInterval(imageLoading, 40);

  execQuery("refresh-home-feeds", {
      'uikDataType': uikDataType,
      'filtersType': filtersType,
      'keywordsDegraded': keywordsDegraded,
      'idkeyword': idkeyword,
      'my': my,
      'user': user,
      'datasTypesIds': datasTypesIds,
      'displayDataType': displayDataType,
      'allAdmin': allAdmin
    }, false)
    .then((json) => {
      clearInterval(vars.nameTimer);
      vars.nameTimer = null;

      $$1(".structure-container #feeds-container").html(base64Decode(json.content));
      initUserHover$1();
    })
    .catch(() => {
      clearInterval(vars.nameTimer);
      vars.nameTimer = null;

      $$1(".structure-container #feeds-container .loading").hide();
      $$1(".structure-container #feeds-container .list-group-item, .structure-container #feeds-container .msg").fadeIn("fast");
    });
}


function launchSearchWallFilters(filters) {
  currentFiltersSearch = filters;
  loadWallPHP();
}


function getFeedsFilters(ids = '') {

  var idkeyword = $$1("#keywords-container .label-keyword.active").data("idkeyword") || '';
  var filtersDataType = new Array();
  var filtersType = new Array();
  var my = ($$1('#feeds-filters .filter-my.selected').length > 0);


  // <--- retrieve feed DataType
  $$1('#feeds-filters .filter.selected').each(function() {
    filtersDataType.push($$1(this).data('uid'));
  });
  // --->

  // <--- retrieve feed Type
  $$1('#feeds-filters .filter-type.selected').each(function() {
    filtersType.push($$1(this).data('uid'));
  });
  // --->

  return {
    'idkeyword': idkeyword,
    'uikDataType': filtersDataType,
    'filtersType': filtersType,
    'my': my,
    'ids': ids
  };
}

function refreshFeeds(ids) {
  timerFeeds = null;
  launchSearchWallFilters(getFeedsFilters(ids));
}

function initFeedsFilters() {

  $$1('#feeds-filters .filter-mode').bind('click', function() {

    var classe = $$1(this).attr('class');

    $$1('#feeds-filters .filter-mode').not($$1(this)).removeClass('selected');

    if((typeof(classe) == 'undefined') || (classe.indexOf('selected') < 0)) {
      $$1(this).addClass('selected');
    } else {
      $$1(this).removeClass('selected');
    }
  });
  $$1('#feeds-filters .filter').bind('click', function() {

    var classe = $$1(this).attr('class');

    if((typeof(classe) == 'undefined') || (classe.indexOf('selected') < 0)) {
      $$1(this).removeClass('selected').addClass('selected');
    } else {
      $$1(this).removeClass('selected');
    }
  });
  $$1('#feeds-filters .filter-type').bind('click', function() {

    var classe = $$1(this).attr('class');

    if((typeof(classe) == 'undefined') || (classe.indexOf('selected') < 0)) {
      $$1(this).addClass('selected');
    } else {
      $$1(this).removeClass('selected');
    }
  });

  $$1('#feeds-filters .label-default').bind('click', function() {

    if(timerFeeds != null) clearTimeout(timerFeeds);
    timerFeeds = setTimeout(function() {
      refreshFeeds();
    }, 1000);
  });
}

function initSubPaddle() {
  $('.sub-paddle .title').unbind('click').bind('click', function() {
    $(this).closest('.sub-paddle').toggleClass('active');
    stats();
  });
}

var flagMouseNotificationMenu = false;
var nbPageScrolledNotification = 0;

function showNotifications() {
  nbPageScrolledNotification = 1;

  $$1('html').css('overflow-y', 'hidden');

  execQuery("get-notifications")
    .then((json) => {
      $$1("#notifications-user").removeClass("active");
      $$1("#notifications-user .notifications-list").html(base64Decode(json.content));
      $$1("#notifications-user .notifications-list").show();
      $$1("#notifications-user .notifications-badge").html("");
      $$1("#notifications-user .notifications-container").hide();
    })
    .catch(() => {
      $$1("#notifications-user").removeClass("active");
    });
}

function initNotificationsEvents() {
  $$1(document).bind("mousedown", function() {
    if(flagMouseNotificationMenu !== true) setTimeout(function() {
      $$1("#notifications-user .notifications-list").hide();
      $$1('html').css('overflow-y', 'auto');
    }, 200);
  });

  if($$1("#notifications-user").length <= 0) return;

  $$1("#notifications-user").bind("click", function() {
    if($$1("#notifications-user .notifications-list").is(":visible")) {
      $$1("#notifications-user .notifications-list").hide();
      $$1('html').css('overflow-y', 'visible');
    } else {
      $$1("#notifications-user .notifications-list").html("<center><br /><br />Chargement des notifications...</center>");
      $$1("#notifications-user .notifications-list").fadeIn("fast");
      showNotifications();
    }
  });

  $$1("#notifications-user .notifications-list").bind("scroll", function() {
    var obj = $$1("#notifications-user .notifications-list");
    var obj2 = $$1("#notifications-user .notifications-list .list-group");
    if($$1("#notifications-user .notifications-list .list-group-suivant").length > 0) {
      if(Math.ceil(obj.scrollTop() + obj.height()) >= obj2.height() - 20) {
        if(nbPageScrolledNotification != $$1("#notifications-user .notifications-list .list-group-suivant").data('page')) {
          nbPageScrolledNotification = $$1("#notifications-user .notifications-list .list-group-suivant").data('page');
          $$1("#notifications-user .notifications-list .list-group-suivant").html('Chargement en cours ...');

          execQuery("get-notifications", {
              page: nbPageScrolledNotification
            })
            .then((json) => {
              $$1("#notifications-user .notifications-list .list-group-suivant").remove();
              $$1(base64Decode(json.content)).insertAfter("#notifications-user .notifications-list .list-group-item:last-child");
            })
            .catch(() => $$1("#notifications-user").removeClass("active"));
        }
      }
    }
  });


  $$1("#notifications-user, #notifications-user .notifications-list")
    .bind("mouseenter", function() {
      flagMouseNotificationMenu = true;
    })
    .bind("mouseleave", function() {
      flagMouseNotificationMenu = false;
    });
}

var index$3 = createCommonjsModule(function (module) {
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};
});

var index$4 = interopDefault(index$3);


var require$$5 = Object.freeze({
    default: index$4
});

var index$5 = createCommonjsModule(function (module) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}
});

var index$6 = interopDefault(index$5);


var require$$0$1 = Object.freeze({
  default: index$6
});

var debug = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = interopDefault(require$$0$1);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});

var debug$1 = interopDefault(debug);
var formatters = debug.formatters;
var skips = debug.skips;
var names = debug.names;
var humanize = debug.humanize;
var enabled$1 = debug.enabled;
var enable = debug.enable;
var disable = debug.disable;
var coerce = debug.coerce;

var require$$0 = Object.freeze({
  default: debug$1,
  formatters: formatters,
  skips: skips,
  names: names,
  humanize: humanize,
  enabled: enabled$1,
  enable: enable,
  disable: disable,
  coerce: coerce
});

var browser = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = interopDefault(require$$0);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}
});

var browser$1 = interopDefault(browser);
var colors = browser.colors;
var storage = browser.storage;
var useColors = browser.useColors;
var load = browser.load;
var save = browser.save;
var formatArgs = browser.formatArgs;
var log = browser.log;

var require$$1 = Object.freeze({
  default: browser$1,
  colors: colors,
  storage: storage,
  useColors: useColors,
  load: load,
  save: save,
  formatArgs: formatArgs,
  log: log
});

var url = createCommonjsModule(function (module) {
/**
 * Module dependencies.
 */

var parseuri = interopDefault(require$$5);
var debug = interopDefault(require$$1)('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url(uri, loc){
  var obj = uri;

  // default to window.location
  var loc = loc || commonjsGlobal.location;
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' == typeof uri) {
    if ('/' == uri.charAt(0)) {
      if ('/' == uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' != typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    }
    else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port == obj.port ? '' : (':' + obj.port));

  return obj;
}
});

var url$1 = interopDefault(url);


var require$$4 = Object.freeze({
  default: url$1
});

var json3 = createCommonjsModule(function (module, exports) {
/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function () {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // A set of types used to distinguish objects from primitives.
  var objectTypes = {
    "function": true,
    "object": true
  };

  // Detect the `exports` object exposed by CommonJS implementations.
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context,
  // and the `window` object in browsers. Rhino exports a `global` function
  // instead.
  var root = objectTypes[typeof window] && window || this,
      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof commonjsGlobal == "object" && commonjsGlobal;

  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root["Object"]());
    exports || (exports = root["Object"]());

    // Native constructor aliases.
    var Number = context["Number"] || root["Number"],
        String = context["String"] || root["String"],
        Object = context["Object"] || root["Object"],
        Date = context["Date"] || root["Date"],
        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
        TypeError = context["TypeError"] || root["TypeError"],
        Math = context["Math"] || root["Math"],
        nativeJSON = context["JSON"] || root["JSON"];

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty, forEach, undef;

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    try {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    } catch (exception) {}

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] !== undef) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("json-parse");
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            try {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            } catch (exception) {
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse;
          if (typeof parse == "function") {
            try {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  try {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  } catch (exception) {}
                  if (parseSupported) {
                    try {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    } catch (exception) {}
                  }
                  if (parseSupported) {
                    try {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    } catch (exception) {}
                  }
                }
              }
            } catch (exception) {
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Define additional utility methods if the `Date` methods are buggy.
      if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
      }

      // Internal: Determines if a property is a direct property of the given
      // object. Delegates to the native `Object#hasOwnProperty` method.
      if (!(isProperty = objectProto.hasOwnProperty)) {
        isProperty = function (property) {
          var members = {}, constructor;
          if ((members.__proto__ = null, members.__proto__ = {
            // The *proto* property cannot be set multiple times in recent
            // versions of Firefox and SeaMonkey.
            "toString": 1
          }, members).toString != getClass) {
            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
            // supports the mutable *proto* property.
            isProperty = function (property) {
              // Capture and break the object's prototype chain (see section 8.6.2
              // of the ES 5.1 spec). The parenthesized expression prevents an
              // unsafe transformation by the Closure Compiler.
              var original = this.__proto__, result = property in (this.__proto__ = null, this);
              // Restore the original prototype chain.
              this.__proto__ = original;
              return result;
            };
          } else {
            // Capture a reference to the top-level `Object` constructor.
            constructor = members.constructor;
            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
            // other environments.
            isProperty = function (property) {
              var parent = (this.constructor || constructor).prototype;
              return property in this && !(property in parent && this[property] === parent[property]);
            };
          }
          members = null;
          return isProperty.call(this, property);
        };
      }

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      forEach = function (object, callback) {
        var size = 0, Properties, members, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        members = new Properties();
        for (property in members) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(members, property)) {
            size++;
          }
        }
        Properties = members = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
          };
        } else if (size == 2) {
          // Safari <= 2.0.4 enumerates shadowed properties twice.
          forEach = function (object, callback) {
            // Create a set of iterated properties.
            var members = {}, isFunction = getClass.call(object) == functionClass, property;
            for (property in object) {
              // Store each property name to prevent double enumeration. The
              // `prototype` property of functions is not enumerated due to cross-
              // environment inconsistencies.
              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forEach(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Double-quotes a string `value`, replacing all ASCII control
        // characters (characters with code unit values between 0 and 31) with
        // their escaped equivalents. This is an implementation of the
        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
        var unicodePrefix = "\\u00";
        var quote = function (value) {
          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
          for (; index < length; index++) {
            var charCode = value.charCodeAt(index);
            // If the character is a control character, append its Unicode or
            // shorthand escape sequence; otherwise, append the character as-is.
            switch (charCode) {
              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                result += Escapes[charCode];
                break;
              default:
                if (charCode < 32) {
                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                  break;
                }
                result += useCharIndex ? symbols[index] : value.charAt(index);
            }
          }
          return result + '"';
        };

        // Internal: Recursively serializes an object. Implements the
        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
          try {
            // Necessary for host object support.
            value = object[property];
          } catch (exception) {}
          if (typeof value == "object" && value) {
            className = getClass.call(value);
            if (className == dateClass && !isProperty.call(value, "toJSON")) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                if (getDay) {
                  // Manually compute the year, month, date, hours, minutes,
                  // seconds, and milliseconds if the `getUTC*` methods are
                  // buggy. Adapted from @Yaffle's `date-shim` project.
                  date = floor(value / 864e5);
                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                  date = 1 + date - getDay(year, month);
                  // The `time` value specifies the time within the day (see ES
                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                  // to compute `A modulo B`, as the `%` operator does not
                  // correspond to the `modulo` operation for negative numbers.
                  time = (value % 864e5 + 864e5) % 864e5;
                  // The hours, minutes, seconds, and milliseconds are obtained by
                  // decomposing the time within the day. See section 15.9.1.10.
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                } else {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                }
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
              } else {
                value = null;
              }
            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
              // ignores all `toJSON` methods on these objects unless they are
              // defined directly on an instance.
              value = value.toJSON(property);
            }
          }
          if (callback) {
            // If a replacement function was provided, call it to obtain the value
            // for serialization.
            value = callback.call(object, property, value);
          }
          if (value === null) {
            return "null";
          }
          className = getClass.call(value);
          if (className == booleanClass) {
            // Booleans are represented literally.
            return "" + value;
          } else if (className == numberClass) {
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
          } else if (className == stringClass) {
            // Strings are double-quoted and escaped.
            return quote("" + value);
          }
          // Recursively serialize objects and arrays.
          if (typeof value == "object") {
            // Check for cyclic structures. This is a linear search; performance
            // is inversely proportional to the number of unique nested objects.
            for (length = stack.length; length--;) {
              if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
              }
            }
            // Add the object to the stack of traversed objects.
            stack.push(value);
            results = [];
            // Save the current indentation level and indent one additional level.
            prefix = indentation;
            indentation += whitespace;
            if (className == arrayClass) {
              // Recursively serialize array elements.
              for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                results.push(element === undef ? "null" : element);
              }
              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
            } else {
              // Recursively serialize object members. Members are selected from
              // either a user-specified list of property names, or the object
              // itself.
              forEach(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                if (element !== undef) {
                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                  // is not the empty string, let `member` {quote(property) + ":"}
                  // be the concatenation of `member` and the `space` character."
                  // The "`space` character" refers to the literal space
                  // character, not the `space` {width} argument provided to
                  // `JSON.stringify`.
                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
              });
              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
            }
            // Remove the object from the traversed object stack.
            stack.pop();
            return result;
          }
        };

        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
        exports.stringify = function (source, filter, width) {
          var whitespace, callback, properties, className;
          if (objectTypes[typeof filter] && filter) {
            if ((className = getClass.call(filter)) == functionClass) {
              callback = filter;
            } else if (className == arrayClass) {
              // Convert the property names array into a makeshift set.
              properties = {};
              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
            }
          }
          if (width) {
            if ((className = getClass.call(width)) == numberClass) {
              // Convert the `width` to an integer and create a string containing
              // `width` number of space characters.
              if ((width -= width % 1) > 0) {
                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
              }
            } else if (className == stringClass) {
              whitespace = width.length <= 10 ? width : width.slice(0, 10);
            }
          }
          // Opera <= 7.54u2 discards the values associated with empty string keys
          // (`""`) only if they are used directly within an object member list
          // (e.g., `!("" in { "": 1})`).
          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
        };
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                if (source.slice(Index, Index + 4) == "true") {
                  Index += 4;
                  return true;
                } else if (source.slice(Index, Index + 5) == "false") {
                  Index += 5;
                  return false;
                } else if (source.slice(Index, Index + 4) == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undef) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forEach` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(value, length, callback);
              }
            } else {
              forEach(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports["runInContext"] = runInContext;
    return exports;
  }

  if (freeExports && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, freeExports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON,
        previousJSON = root["JSON3"],
        isRestored = false;

    var JSON3 = runInContext(root, (root["JSON3"] = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root["JSON3"] = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}).call(commonjsGlobal);
});

var json3$1 = interopDefault(json3);


var require$$4$1 = Object.freeze({
  default: json3$1
});

var index$9 = createCommonjsModule(function (module) {
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};
});

var index$10 = interopDefault(index$9);


var require$$0$2 = Object.freeze({
  default: index$10
});

var index$11 = createCommonjsModule(function (module) {
/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};
});

var index$12 = interopDefault(index$11);


var require$$2 = Object.freeze({
  default: index$12
});

var isBuffer = createCommonjsModule(function (module) {
module.exports = isBuf;

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (commonjsGlobal.Buffer && commonjsGlobal.Buffer.isBuffer(obj)) ||
         (commonjsGlobal.ArrayBuffer && obj instanceof ArrayBuffer);
}
});

var isBuffer$1 = interopDefault(isBuffer);


var require$$0$3 = Object.freeze({
  default: isBuffer$1
});

var binary = createCommonjsModule(function (module, exports) {
/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = interopDefault(require$$0$2);
var isBuf = interopDefault(require$$0$3);

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet){
  var buffers = [];
  var packetData = packet.data;

  function _deconstructPacket(data) {
    if (!data) return data;

    if (isBuf(data)) {
      var placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (isArray(data)) {
      var newData = new Array(data.length);
      for (var i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i]);
      }
      return newData;
    } else if ('object' == typeof data && !(data instanceof Date)) {
      var newData = {};
      for (var key in data) {
        newData[key] = _deconstructPacket(data[key]);
      }
      return newData;
    }
    return data;
  }

  var pack = packet;
  pack.data = _deconstructPacket(packetData);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  var curPlaceHolder = 0;

  function _reconstructPacket(data) {
    if (data && data._placeholder) {
      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
      return buf;
    } else if (isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i]);
      }
      return data;
    } else if (data && 'object' == typeof data) {
      for (var key in data) {
        data[key] = _reconstructPacket(data[key]);
      }
      return data;
    }
    return data;
  }

  packet.data = _reconstructPacket(packet.data);
  packet.attachments = undefined; // no longer useful
  return packet;
};

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((commonjsGlobal.Blob && obj instanceof Blob) ||
        (commonjsGlobal.File && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};
});

var binary$1 = interopDefault(binary);
var removeBlobs = binary.removeBlobs;
var reconstructPacket = binary.reconstructPacket;
var deconstructPacket = binary.deconstructPacket;

var require$$1$1 = Object.freeze({
  default: binary$1,
  removeBlobs: removeBlobs,
  reconstructPacket: reconstructPacket,
  deconstructPacket: deconstructPacket
});

var index$7 = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */

var debug = interopDefault(require$$1)('socket.io-parser');
var json = interopDefault(require$$4$1);
var isArray = interopDefault(require$$0$2);
var Emitter = interopDefault(require$$2);
var binary = interopDefault(require$$1$1);
var isBuf = interopDefault(require$$0$3);

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'ACK',
  'ERROR',
  'BINARY_EVENT',
  'BINARY_ACK'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    encodeAsBinary(obj, callback);
  }
  else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {
  var str = '';
  var nsp = false;

  // first is type
  str += obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    str += obj.attachments;
    str += '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' != obj.nsp) {
    nsp = true;
    str += obj.nsp;
  }

  // immediately followed by the id
  if (null != obj.id) {
    if (nsp) {
      str += ',';
      nsp = false;
    }
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    if (nsp) str += ',';
    str += json.stringify(obj.data);
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if ('string' == typeof obj) {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  }
  else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  }
  else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var p = {};
  var i = 0;

  // look up type
  p.type = Number(str.charAt(0));
  if (null == exports.types[p.type]) return error();

  // look up attachments if type binary
  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
    var buf = '';
    while (str.charAt(++i) != '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) != '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' == str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' == c) break;
      p.nsp += c;
      if (i == str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i == str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    try {
      p.data = json.parse(str.substr(i));
    } catch(e){
      return error();
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(data){
  return {
    type: exports.ERROR,
    data: 'parser error'
  };
}
});

var index$8 = interopDefault(index$7);
var Decoder = index$7.Decoder;
var Encoder = index$7.Encoder;
var BINARY_ACK = index$7.BINARY_ACK;
var BINARY_EVENT = index$7.BINARY_EVENT;
var ERROR = index$7.ERROR;
var ACK = index$7.ACK;
var EVENT = index$7.EVENT;
var DISCONNECT = index$7.DISCONNECT;
var CONNECT = index$7.CONNECT;
var types = index$7.types;
var protocol$2 = index$7.protocol;

var require$$6 = Object.freeze({
  default: index$8,
  Decoder: Decoder,
  Encoder: Encoder,
  BINARY_ACK: BINARY_ACK,
  BINARY_EVENT: BINARY_EVENT,
  ERROR: ERROR,
  ACK: ACK,
  EVENT: EVENT,
  DISCONNECT: DISCONNECT,
  CONNECT: CONNECT,
  types: types,
  protocol: protocol$2
});

var index$17 = createCommonjsModule(function (module) {
/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};
});

var index$18 = interopDefault(index$17);


var require$$2$1 = Object.freeze({
  default: index$18
});

var index$19 = createCommonjsModule(function (module) {
var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});

var index$20 = interopDefault(index$19);


var require$$6$1 = Object.freeze({
  default: index$20
});

var index$21 = createCommonjsModule(function (module) {
/**
 * JSON parse.
 *
 * @see Based on jQuery#parseJSON (MIT) and JSON2
 * @api private
 */

var rvalidchars = /^[\],:{}\s]*$/;
var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
var rtrimLeft = /^\s+/;
var rtrimRight = /\s+$/;

module.exports = function parsejson(data) {
  if ('string' != typeof data || !data) {
    return null;
  }

  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

  // Attempt to parse using the native JSON parser first
  if (commonjsGlobal.JSON && JSON.parse) {
    return JSON.parse(data);
  }

  if (rvalidchars.test(data.replace(rvalidescape, '@')
      .replace(rvalidtokens, ']')
      .replace(rvalidbraces, ''))) {
    return (new Function('return ' + data))();
  }
};
});

var index$22 = interopDefault(index$21);


var require$$4$2 = Object.freeze({
  default: index$22
});

var index$23 = createCommonjsModule(function (module, exports) {
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};
});

var index$24 = interopDefault(index$23);
var decode = index$23.decode;
var encode = index$23.encode;

var require$$4$3 = Object.freeze({
  default: index$24,
  decode: decode,
  encode: encode
});

var keys = createCommonjsModule(function (module) {
/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};
});

var keys$1 = interopDefault(keys);


var require$$6$3 = Object.freeze({
  default: keys$1
});

var index$25 = createCommonjsModule(function (module) {
/*
 * Module requirements.
 */

var isArray = interopDefault(require$$0$2);

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (commonjsGlobal.Buffer && commonjsGlobal.Buffer.isBuffer(obj)) ||
         (commonjsGlobal.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (commonjsGlobal.Blob && obj instanceof Blob) ||
         (commonjsGlobal.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      if (obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}
});

var index$26 = interopDefault(index$25);


var require$$5$2 = Object.freeze({
  default: index$26
});

var index$27 = createCommonjsModule(function (module) {
/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};
});

var index$28 = interopDefault(index$27);


var require$$4$4 = Object.freeze({
  default: index$28
});

var base64Arraybuffer = createCommonjsModule(function (module, exports) {
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(chars){
  "use strict";

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i+1]);
      encoded3 = chars.indexOf(base64[i+2]);
      encoded4 = chars.indexOf(base64[i+3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
});

var base64Arraybuffer$1 = interopDefault(base64Arraybuffer);
var decode$1 = base64Arraybuffer.decode;
var encode$1 = base64Arraybuffer.encode;

var require$$3 = Object.freeze({
  default: base64Arraybuffer$1,
  decode: decode$1,
  encode: encode$1
});

var index$29 = createCommonjsModule(function (module) {
module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}
});

var index$30 = interopDefault(index$29);


var require$$2$2 = Object.freeze({
    default: index$30
});

var utf8$2 = createCommonjsModule(function (module, exports) {
/*! https://mths.be/utf8js v2.0.0 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			checkScalarValue(codePoint);
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			var byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				checkScalarValue(codePoint);
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.0.0',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(commonjsGlobal));
});

var utf8$3 = interopDefault(utf8$2);


var require$$1$4 = Object.freeze({
	default: utf8$3
});

var index$31 = createCommonjsModule(function (module) {
/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = commonjsGlobal.BlobBuilder
  || commonjsGlobal.WebKitBlobBuilder
  || commonjsGlobal.MSBlobBuilder
  || commonjsGlobal.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && (function() {
  try {
    var b = new Blob([new Uint8Array([1,2])]);
    return b.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  for (var i = 0; i < ary.length; i++) {
    var chunk = ary[i];
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      ary[i] = buf;
    }
  }
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary);

  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }

  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  mapArrayBufferViews(ary);
  return new Blob(ary, options || {});
};

module.exports = (function() {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? commonjsGlobal.Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();
});

var index$32 = interopDefault(index$31);


var require$$0$5 = Object.freeze({
  default: index$32
});

var browser$2 = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */

var keys = interopDefault(require$$6$3);
var hasBinary = interopDefault(require$$5$2);
var sliceBuffer = interopDefault(require$$4$4);
var base64encoder = interopDefault(require$$3);
var after = interopDefault(require$$2$2);
var utf8 = interopDefault(require$$1$4);

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = navigator.userAgent.match(/Android/i);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = interopDefault(require$$0$5);

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if ('function' == typeof supportsBinary) {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if ('function' == typeof utf8encode) {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (commonjsGlobal.ArrayBuffer && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (Blob && data instanceof commonjsGlobal.Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    packet.data = fr.result;
    exports.encodePacket(packet, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (Blob && packet.data instanceof commonjsGlobal.Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += commonjsGlobal.btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  // String data
  if (typeof data == 'string' || data === undefined) {
    if (data.charAt(0) == 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      try {
        data = utf8.decode(data);
      } catch (e) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!commonjsGlobal.ArrayBuffer) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary == 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data != 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data == '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = ''
    , n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (':' != chr) {
      length += chr;
    } else {
      if ('' == length || (length != (n = Number(length)))) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      msg = data.substr(i + 1, n);

      if (length != msg.length) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      if (msg.length) {
        packet = exports.decodePacket(msg, binaryType, true);

        if (err.type == packet.type && err.data == packet.data) {
          // parser error in individual packet - ignoring payload
          return callback(err, 0, 1);
        }

        var ret = callback(packet, i + n, l);
        if (false === ret) return;
      }

      // advance cursor
      i += n;
      length = '';
    }
  }

  if (length != '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  var numberTooLong = false;
  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] == 255) break;

      if (msgLength.length > 310) {
        numberTooLong = true;
        break;
      }

      msgLength += tailArray[i];
    }

    if(numberTooLong) return callback(err, 0, 1);

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};
});

var browser$3 = interopDefault(browser$2);
var decodePayloadAsBinary = browser$2.decodePayloadAsBinary;
var encodePayloadAsBlob = browser$2.encodePayloadAsBlob;
var encodePayloadAsArrayBuffer = browser$2.encodePayloadAsArrayBuffer;
var decodePayload = browser$2.decodePayload;
var encodePayload = browser$2.encodePayload;
var decodeBase64Packet = browser$2.decodeBase64Packet;
var decodePacket = browser$2.decodePacket;
var encodeBase64Packet = browser$2.encodeBase64Packet;
var encodePacket = browser$2.encodePacket;
var packets = browser$2.packets;
var protocol$3 = browser$2.protocol;

var require$$5$1 = Object.freeze({
  default: browser$3,
  decodePayloadAsBinary: decodePayloadAsBinary,
  encodePayloadAsBlob: encodePayloadAsBlob,
  encodePayloadAsArrayBuffer: encodePayloadAsArrayBuffer,
  decodePayload: decodePayload,
  encodePayload: encodePayload,
  decodeBase64Packet: decodeBase64Packet,
  decodePacket: decodePacket,
  encodeBase64Packet: encodeBase64Packet,
  encodePacket: encodePacket,
  packets: packets,
  protocol: protocol$3
});

var transport = createCommonjsModule(function (module) {
/**
 * Module dependencies.
 */

var parser = interopDefault(require$$5$1);
var Emitter = interopDefault(require$$2$1);

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' == this.readyState || '' == this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function(packets){
  if ('open' == this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function(data){
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};
});

var transport$1 = interopDefault(transport);


var require$$6$2 = Object.freeze({
  default: transport$1
});

var index$35 = createCommonjsModule(function (module) {
/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}
});

var index$36 = interopDefault(index$35);


var require$$0$7 = Object.freeze({
  default: index$36
});

var xmlhttprequest = createCommonjsModule(function (module) {
// browser shim for xmlhttprequest module
var hasCORS = interopDefault(require$$0$7);

module.exports = function(opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch(e) { }
  }
}
});

var xmlhttprequest$1 = interopDefault(xmlhttprequest);


var require$$0$6 = Object.freeze({
  default: xmlhttprequest$1
});

var index$37 = createCommonjsModule(function (module) {
module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
});

var index$38 = interopDefault(index$37);


var require$$3$1 = Object.freeze({
  default: index$38
});

var index$39 = createCommonjsModule(function (module) {
'use strict';

var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;
});

var index$40 = interopDefault(index$39);


var require$$2$4 = Object.freeze({
  default: index$40
});

var polling$1 = createCommonjsModule(function (module) {
/**
 * Module dependencies.
 */

var Transport = interopDefault(require$$6$2);
var parseqs = interopDefault(require$$4$3);
var parser = interopDefault(require$$5$1);
var inherit = interopDefault(require$$3$1);
var yeast = interopDefault(require$$2$4);
var debug = interopDefault(require$$1)('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function() {
  var XMLHttpRequest = interopDefault(require$$0$6);
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function(){
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function(onPause){
  var pending = 0;
  var self = this;

  this.readyState = 'pausing';

  function pause(){
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function(){
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function(){
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function(){
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function(data){
  var self = this;
  debug('polling got data %s', data);
  var callback = function(packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' == self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' == packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' != this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' == this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function(){
  var self = this;

  function close(){
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' == this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function(packets){
  var self = this;
  this.writable = false;
  var callbackfn = function() {
    self.writable = true;
    self.emit('drain');
  };

  var self = this;
  parser.encodePayload(packets, this.supportsBinary, function(data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' == schema && this.port != 443) ||
     ('http' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};
});

var polling$2 = interopDefault(polling$1);


var require$$1$6 = Object.freeze({
  default: polling$2
});

var pollingXhr = createCommonjsModule(function (module) {
/**
 * Module requirements.
 */

var XMLHttpRequest = interopDefault(require$$0$6);
var Polling = interopDefault(require$$1$6);
var Emitter = interopDefault(require$$2$1);
var inherit = interopDefault(require$$3$1);
var debug = interopDefault(require$$1)('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty(){}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR(opts){
  Polling.call(this, opts);

  if (commonjsGlobal.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname != commonjsGlobal.location.hostname ||
      port != opts.port;
    this.xs = opts.secure != isSSL;
  } else {
    this.extraHeaders = opts.extraHeaders;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function(opts){
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function(data, fn){
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function(err){
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function(){
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function(data){
    self.onData(data);
  });
  req.on('error', function(err){
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request(opts){
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined != opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function(){
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}
    if (this.supportsBinary) {
      // This has to be done after open because Firefox is stupid
      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
      xhr.responseType = 'arraybuffer';
    }

    if ('POST' == this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.hasXDR()) {
      xhr.onload = function(){
        self.onLoad();
      };
      xhr.onerror = function(){
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function(){
        if (4 != xhr.readyState) return;
        if (200 == xhr.status || 1223 == xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function(){
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function() {
      self.onError(e);
    }, 0);
    return;
  }

  if (commonjsGlobal.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function(){
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function(data){
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function(err){
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function(fromError){
  if ('undefined' == typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch(e) {}
  }

  if (commonjsGlobal.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function(){
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response;
    } else {
      if (!this.supportsBinary) {
        data = this.xhr.responseText;
      } else {
        try {
          data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
        } catch (e) {
          var ui8Arr = new Uint8Array(this.xhr.response);
          var dataArray = [];
          for (var idx = 0, length = ui8Arr.length; idx < length; idx++) {
            dataArray.push(ui8Arr[idx]);
          }

          data = String.fromCharCode.apply(null, dataArray);
        }
      }
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function(){
  return 'undefined' !== typeof commonjsGlobal.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function(){
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

if (commonjsGlobal.document) {
  Request.requestsCount = 0;
  Request.requests = {};
  if (commonjsGlobal.attachEvent) {
    commonjsGlobal.attachEvent('onunload', unloadHandler);
  } else if (commonjsGlobal.addEventListener) {
    commonjsGlobal.addEventListener('beforeunload', unloadHandler, false);
  }
}

function unloadHandler() {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}
});

var pollingXhr$1 = interopDefault(pollingXhr);
var Request = pollingXhr.Request;

var require$$2$3 = Object.freeze({
  default: pollingXhr$1,
  Request: Request
});

var pollingJsonp = createCommonjsModule(function (module) {
/**
 * Module requirements.
 */

var Polling = interopDefault(require$$1$6);
var inherit = interopDefault(require$$3$1);

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Callbacks count.
 */

var index = 0;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!commonjsGlobal.___eio) commonjsGlobal.___eio = [];
    callbacks = commonjsGlobal.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (commonjsGlobal.document && commonjsGlobal.addEventListener) {
    commonjsGlobal.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function(e){
    self.onError('jsonp poll error',e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  }
  else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
  
  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch(e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function(){
      if (self.iframe.readyState == 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};
});

var pollingJsonp$1 = interopDefault(pollingJsonp);


var require$$1$7 = Object.freeze({
  default: pollingJsonp$1
});

var empty = {};


var require$$0$9 = Object.freeze({
	default: empty
});

var websocket$1 = createCommonjsModule(function (module) {
/**
 * Module dependencies.
 */

var Transport = interopDefault(require$$6$2);
var parser = interopDefault(require$$5$1);
var parseqs = interopDefault(require$$4$3);
var inherit = interopDefault(require$$3$1);
var yeast = interopDefault(require$$2$4);
var debug = interopDefault(require$$1)('engine.io-client:websocket');
var BrowserWebSocket = commonjsGlobal.WebSocket || commonjsGlobal.MozWebSocket;

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocket = BrowserWebSocket;
if (!WebSocket && typeof window === 'undefined') {
  try {
    WebSocket = interopDefault(require$$0$9);
  } catch (e) { }
}

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function(){
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var self = this;
  var uri = this.uri();
  var protocols = void(0);
  var opts = {
    agent: this.agent,
    perMessageDeflate: this.perMessageDeflate
  };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }

  this.ws = BrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'buffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function(){
  var self = this;

  this.ws.onopen = function(){
    self.onOpen();
  };
  this.ws.onclose = function(){
    self.onClose();
  };
  this.ws.onmessage = function(ev){
    self.onData(ev.data);
  };
  this.ws.onerror = function(e){
    self.onError('websocket error', e);
  };
};

/**
 * Override `onData` to use a timer on iOS.
 * See: https://gist.github.com/mloughran/2052006
 *
 * @api private
 */

if ('undefined' != typeof navigator
  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
  WS.prototype.onData = function(data){
    var self = this;
    setTimeout(function(){
      Transport.prototype.onData.call(self, data);
    }, 0);
  };
}

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function(packets){
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function(packet) {
      parser.encodePacket(packet, self.supportsBinary, function(data) {
        if (!BrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' == typeof data ? commonjsGlobal.Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        //Sometimes the websocket has already been closed but the browser didn't
        //have a chance of informing us about it yet, in that case send will
        //throw an error
        try {
          if (BrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e){
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done(){
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function(){
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function(){
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function(){
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' == schema && this.port != 443)
    || ('ws' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function(){
  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
};
});

var websocket$2 = interopDefault(websocket$1);


var require$$0$8 = Object.freeze({
  default: websocket$2
});

var index$33 = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies
 */

var XMLHttpRequest = interopDefault(require$$0$6);
var XHR = interopDefault(require$$2$3);
var JSONP = interopDefault(require$$1$7);
var websocket = interopDefault(require$$0$8);

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling(opts){
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (commonjsGlobal.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname != location.hostname || port != opts.port;
    xs = opts.secure != isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}
});

var index$34 = interopDefault(index$33);
var websocket = index$33.websocket;
var polling = index$33.polling;

var require$$1$5 = Object.freeze({
  default: index$34,
  websocket: websocket,
  polling: polling
});

var socket$1 = createCommonjsModule(function (module) {
/**
 * Module dependencies.
 */

var transports = interopDefault(require$$1$5);
var Emitter = interopDefault(require$$2$1);
var debug = interopDefault(require$$1)('engine.io-client:socket');
var index = interopDefault(require$$6$1);
var parser = interopDefault(require$$5$1);
var parseuri = interopDefault(require$$5);
var parsejson = interopDefault(require$$4$2);
var parseqs = interopDefault(require$$4$3);

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Noop function.
 *
 * @api private
 */

function noop(){}

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket(uri, opts){
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' == typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure :
    (commonjsGlobal.location && 'https:' == location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (commonjsGlobal.location ? location.hostname : 'localhost');
  this.port = opts.port || (commonjsGlobal.location && location.port ?
       location.port :
       (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.readyState = '';
  this.writeBuffer = [];
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;

  // other options for Node.js client
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
  if (freeGlobal.global === freeGlobal) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }
  }

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = interopDefault(require$$6$2);
Socket.transports = interopDefault(require$$1$5);
Socket.parser = interopDefault(require$$5$1);

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    agent: this.agent,
    hostname: this.hostname,
    port: this.port,
    secure: this.secure,
    path: this.path,
    query: query,
    forceJSONP: this.forceJSONP,
    jsonp: this.jsonp,
    forceBase64: this.forceBase64,
    enablesXDR: this.enablesXDR,
    timestampRequests: this.timestampRequests,
    timestampParam: this.timestampParam,
    policyPort: this.policyPort,
    socket: this,
    pfx: this.pfx,
    key: this.key,
    passphrase: this.passphrase,
    cert: this.cert,
    ca: this.ca,
    ciphers: this.ciphers,
    rejectUnauthorized: this.rejectUnauthorized,
    perMessageDeflate: this.perMessageDeflate,
    extraHeaders: this.extraHeaders
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function() {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function(transport){
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function(){
    self.onDrain();
  })
  .on('packet', function(packet){
    self.onPacket(packet);
  })
  .on('error', function(e){
    self.onError(e);
  })
  .on('close', function(){
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 })
    , failed = false
    , self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen(){
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' == msg.type && 'probe' == msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' == self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport() {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  //Handle any error that happens while probing
  function onerror(err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose(){
    onerror("transport closed");
  }

  //When the socket is closed while we're probing
  function onclose(){
    onerror("socket closed");
  }

  //When the socket is upgraded while we're probing
  function onupgrade(to){
    if (transport && to.name != transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  //Remove all listeners on the transport and on self
  function cleanup(){
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();

};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(parsejson(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if  ('closed' == this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' == self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function(){
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function() {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' != this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if('function' == typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' == typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' == this.readyState || 'closed' == this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function() {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close() {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose() {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade() {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i<j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};
});

var socket$2 = interopDefault(socket$1);


var require$$1$3 = Object.freeze({
  default: socket$2
});

var index$15 = createCommonjsModule(function (module) {
module.exports = interopDefault(require$$1$3);

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = interopDefault(require$$5$1);
});

var index$16 = interopDefault(index$15);
var parser = index$15.parser;

var require$$0$4 = Object.freeze({
	default: index$16,
	parser: parser
});

var index$13 = createCommonjsModule(function (module) {
module.exports =  interopDefault(require$$0$4);
});

var index$14 = interopDefault(index$13);


var require$$8 = Object.freeze({
	default: index$14
});

var index$41 = createCommonjsModule(function (module) {
/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};
});

var index$42 = interopDefault(index$41);


var require$$5$3 = Object.freeze({
  default: index$42
});

var index$43 = createCommonjsModule(function (module) {
module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}
});

var index$44 = interopDefault(index$43);


var require$$4$5 = Object.freeze({
    default: index$44
});

var on = createCommonjsModule(function (module) {
/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on(obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function(){
      obj.removeListener(ev, fn);
    }
  };
}
});

var on$1 = interopDefault(on);


var require$$3$2 = Object.freeze({
  default: on$1
});

var index$45 = createCommonjsModule(function (module) {
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};
});

var index$46 = interopDefault(index$45);


var require$$2$5 = Object.freeze({
  default: index$46
});

var index$47 = createCommonjsModule(function (module) {
/*
 * Module requirements.
 */

var isArray = interopDefault(require$$0$2);

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (commonjsGlobal.Buffer && commonjsGlobal.Buffer.isBuffer && commonjsGlobal.Buffer.isBuffer(obj)) ||
         (commonjsGlobal.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (commonjsGlobal.Blob && obj instanceof Blob) ||
         (commonjsGlobal.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      // see: https://github.com/Automattic/has-binary/pull/4
      if (obj.toJSON && 'function' == typeof obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}
});

var index$48 = interopDefault(index$47);


var require$$0$10 = Object.freeze({
  default: index$48
});

var socket$3 = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */

var parser = interopDefault(require$$6);
var Emitter = interopDefault(require$$5$3);
var toArray = interopDefault(require$$4$5);
var on = interopDefault(require$$3$2);
var bind = interopDefault(require$$2$5);
var debug = interopDefault(require$$1)('socket.io-client:socket');
var hasBin = interopDefault(require$$0$10);

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket(io, nsp){
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function() {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function(){
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' == this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function(){
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function(ev){
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var parserType = parser.EVENT; // default
  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
  var packet = { type: parserType, data: args };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' == typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  delete this.flags;

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function(packet){
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function(){
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' != this.nsp) {
    this.packet({ type: parser.CONNECT });
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function(reason){
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function(packet){
  if (packet.nsp != this.nsp) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function(packet){
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function(id){
  var self = this;
  var sent = false;
  return function(){
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
    self.packet({
      type: type,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function(packet){
  var ack = this.acks[packet.id];
  if ('function' == typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function(){
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function(){
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function(){
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function(){
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function(){
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function(compress){
  this.flags = this.flags || {};
  this.flags.compress = compress;
  return this;
};
});

var socket$4 = interopDefault(socket$3);


var require$$7 = Object.freeze({
  default: socket$4
});

var index$49 = createCommonjsModule(function (module) {
/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};
});

var index$50 = interopDefault(index$49);


var require$$0$11 = Object.freeze({
  default: index$50
});

var manager = createCommonjsModule(function (module) {
/**
 * Module dependencies.
 */

var eio = interopDefault(require$$8);
var Socket = interopDefault(require$$7);
var Emitter = interopDefault(require$$5$3);
var parser = interopDefault(require$$6);
var on = interopDefault(require$$3$2);
var bind = interopDefault(require$$2$5);
var debug = interopDefault(require$$1)('socket.io-client:manager');
var indexOf = interopDefault(require$$6$1);
var Backoff = interopDefault(require$$0$11);

/**
 * IE6+ hasOwnProperty
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager(uri, opts){
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' == typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  this.encoder = new parser.Encoder();
  this.decoder = new parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function() {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function(){
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.engine.id;
    }
  }
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function(v){
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function(v){
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function(v){
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function(v){
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function(v){
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function(v){
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function() {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};


/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function(fn){
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function() {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function(data){
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function(){
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function(){
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function(){
  this.lastPing = new Date;
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function(){
  this.emitAll('pong', new Date - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function(data){
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function(packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function(err){
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function(nsp){
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function(){
      socket.id = self.engine.id;
    });

    if (this.autoConnect) {
      // manually call here since connecting evnet is fired before listening
      onConnecting();
    }
  }

  function onConnecting() {
    if (!~indexOf(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function(socket){
  var index = indexOf(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function(packet){
  debug('writing packet %j', packet);
  var self = this;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function(encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function() {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function(){
  debug('cleanup');

  var sub;
  while (sub = this.subs.shift()) sub.destroy();

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function(){
  debug('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' == this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function(reason){
  debug('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function(){
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function(){
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function(err){
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function(){
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};
});

var manager$1 = interopDefault(manager);


var require$$1$2 = Object.freeze({
  default: manager$1
});

var index$2 = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */

var url = interopDefault(require$$4);
var parser = interopDefault(require$$6);
var Manager = interopDefault(require$$1$2);
var debug = interopDefault(require$$1)('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup(uri, opts) {
  if (typeof uri == 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }

  return io.socket(parsed.path);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = interopDefault(require$$1$2);
exports.Socket = interopDefault(require$$7);
});

var socket = interopDefault(index$2);

const connection = socket.connect(nodeURL(), { 'reconnect': false });

let enabled = false;

function screenSize() {
  return getComputedStyle(document.body, ':after').content.replace(/^"|"$/g, '');
}

function track(data) {
  data.screen = screenSize();
  data.url = rootURL();
  connection.emit('tracking', data);
}

function enableTracking() {
  if(enabled) {
    return;
  }

  $$1(document).on('mouseup', '[data-track-click]', (e) => {
    track({
      event: 'click',
      id: $$1(e.currentTarget).data('trackClick')
    });
  });

  enabled = true;
}

let liking = false;

function likeData(iddata, elt) {
  iddata = Number(iddata);
  if(!isNumber(iddata) || !elt) return false;

  if(($$1(elt).find(".like-container").length <= 0) || ($$1(elt).find(".counter").length <= 0)) return false;

  var counter = Number($$1(elt).find(".counter").html());
  if(!isNumber(counter)) counter = 0;

  if($$1(elt).find(".like-container").attr("class").indexOf("liked") >= 0) {
    counter--;
    $$1(elt).find(".like-container").removeClass("liked");
  } else {
    counter++;
    $$1(elt).find(".like-container").addClass("liked");
  }
  if(counter < 0) counter = 0;

  $$1(elt).find(".counter").html(counter);

  liking = true;

  execQuery("like-data", {
      iddata
    }, false)
    .then((json) => {
      if(isNumber(json.counterLikes)) {
        $$1(".btn-like-" + iddata + " .counter").html(json.counterLikes);
      }

      if(json.liked === true) {
        $$1(".btn-like-" + iddata + " .like-container").removeClass("liked").addClass("liked");
      } else if(json.liked === false) {
        $$1(".btn-like-" + iddata + " .like-container").removeClass("liked");
      }

      if(json.msg) {
        displayInfo(json.msg);
      }
      liking = false;
    }).catch(() => liking = false);
}

var timerLikeDiscussion = null;

function _likeDiscussion(iddiscussion) {

  timerLikeDiscussion = null;

  execQuery("like-discussion", {
      iddiscussion
    }, false)
    .then((json) => {
      if(isNumber(json.counterLikes)) {
        $$1(".btn-like-discussion-" + iddiscussion + " .counter").html(json.counterLikes);
      }

      if(json.liked === true) {
        $$1(".btn-like-discussion-" + iddiscussion + " .like-container").removeClass("liked").addClass("liked");
      } else if(json.liked === false) {
        $$1(".btn-like-discussion-" + iddiscussion + " .like-container").removeClass("liked");
      }

      if(json.msg) {
        displayInfo(json.msg);
      }
    });
}

function likeDiscussion(iddiscussion, elt) {
  iddiscussion = Number(iddiscussion);
  if(!isNumber(iddiscussion)) return false;
  if(!elt) return false;

  if(($$1(elt).find(".like-container").length <= 0) || ($$1(elt).find(".counter").length <= 0)) return false;

  var counter = Number($$1(elt).find(".counter").html());
  if(!isNumber(counter)) counter = 0;

  if($$1(elt).find(".like-container").attr("class").indexOf("liked") >= 0) {
    counter--;
    $$1(elt).find(".like-container").removeClass("liked");
  } else {
    counter++;
    $$1(elt).find(".like-container").addClass("liked");
  }
  if(counter < 0) counter = 0;

  $$1(elt).find(".counter").html(counter);

  if(timerLikeDiscussion != null) clearTimeout(timerLikeDiscussion);
  timerLikeDiscussion = setTimeout(function() {
    _likeDiscussion(iddiscussion);
  });
}

window.likeData = likeData;
window.likeDiscussion = likeDiscussion;

let translations;

function _l(entry, defaultValue = '') {
  if(!translations) {
    translations = stringToJSON(base64Decode(__langPack__));
  }

  let returnValue;

  if(entry.indexOf('.') >= 0) {
    const tmp = entry.split('.');
    returnValue = translations;
    for(var i = 0; i < tmp.length; i++) {
      if(returnValue[tmp[i]]) {
        returnValue = returnValue[tmp[i]];
      } else {
        return defaultValue;
      }
    }
  } else {
    returnValue = translations[entry] ? translations[entry] : defaultValue;
  }

  return returnValue;
}

function addDiscussion(elt) {

  var idrecord = Number($$1(elt).parents(".discussion-root").data("idrecord"));
  if(!isNumber(idrecord)) idrecord = Number($$1("#data-modal #data-iddata").val());
  if(!isNumber(idrecord)) return alert("Veuillez enregistrer avant d'ajouter une discussion");

  // <--- initialize and prepend the input-discussion
  var discussionRoot = $$1(elt).parents(".discussion-root")
  $$1(discussionRoot).find(".input-discussion").remove();

  $$1(discussionRoot).find(".discussion-container:first").prepend("\
		<div style='display:none;' class='input-discussion' data-type='discussion'>\
			<textarea onkeyup='adjustHeight(this)' style='height:160px;' class='form-control input-control-discussion' cols='10' rows='10'></textarea>\n\
			<div class='clearfix'></div>\
			<span><button type='button' onclick='postDiscussion(this); return false;' class='btn btn-primary btn-xs btn-post-discussion'>" + _l('discussion.btnAdd') + "</button></span>\
			<span><button type='button' onclick='cancelDiscussion(this); return false;' class='btn btn-default btn-xs btn-cancel-discussion'>" + _l('discussion.btnCancel') + "</button></span>\
		</div>");

  $$1(discussionRoot).find(".discussion-container:first").prepend($$1(elt).parents(".discussion-root").find(".discussion-container:first").find(".input-discussion").remove());
  // --->

  // <--- show and focus the input
  $$1(elt).closest(".discussion-root").find(".discussion-container:first").find(".input-discussion")
    .fadeIn("fast")
    .find(".input-control-discussion").focus();
  // --->

  $$1(discussionRoot).find(".btn-add-discussion").hide();
}

function adjustHeight(el) {
  //el.style.height = "160px";
  if(el.scrollHeight > el.clientHeight) {
    el.style.height = (el.scrollHeight + 10) + "px";
  } else {
    el.style.height = Math.max((el.clientHeight - 10), 160) + "px";
    if(el.clientHeight > 160)
      adjustHeight(el);
  }
}

function cancelComment(elt) {
  $$1(elt).parents(".discussion-root").find(".input-discussion").remove();
}

function cancelDiscussion(elt) {
  $$1(elt).parents(".discussion-root").find(".btn-add-discussion").show();
  $$1(elt).parents(".discussion-root").find(".input-discussion").remove();
}

function modifComment(elt, iddiscussion, typeDiscussionComment) {

  // remove the input discussion
  $$1(elt).parents(".discussion-root").find(".input-discussion").remove();

  // show the comments
  $$1(elt).parents(".discussion").find(".comments-container:first").show();

  var content = $$1(elt).parent('.discussion-footer').parent(".discussion-container").find(".discussion-content-no-link").html();
  content = content.replace(new RegExp('<br>', 'g'), '');

  // <-- initialize and append the input-comment
  $$1(elt).parents(".discussion").find(".comments-container:first").append("\
        <div style='display:none;' class='input-discussion' data-type='comment'>\
            <textarea onkeyup='adjustHeight(this)' style='height:160px;' class='form-control input-control-discussion' cols='10' rows='10'>" + content + "</textarea>\
            <div class='clearfix'></div>\
            <span><button type='button' onclick='updateCommentDiscussion(this, " + iddiscussion + ", " + typeDiscussionComment + "); return false;' class='btn btn-primary btn-xs btn-update-discussion'>" + _l('discussion.btnUpdate') + "</button></span>\
            <span><button type='button' onclick='cancelComment(this); return false;' class='btn btn-default btn-xs'>" + _l('discussion.btnCancel') + "</button></span>\
        </div>");
  // --->

  // <--- show and focus the input
  $$1(elt).parents(".discussion").find(".comments-container:first").find(".input-discussion").fadeIn("fast");
  $$1(elt).parents(".discussion").find(".comments-container:first").find(".input-discussion").find(".input-control-discussion").focus();
  // --->

}

function postDiscussion(elt, flagComment) {

  if(typeof(flagComment) === "undefined") flagComment = false;

  $$1(elt).parents(".discussion-root").find(".btn-post-discussion").hide();
  $$1(elt).parents(".discussion-root").find(".btn-cancel-discussion").hide();

  var gid = $$1(elt).parents(".discussion-root").data("gid");
  var typeRecord = $$1(elt).parents(".discussion-root").data("type-record");
  var idrecord = Number($$1(elt).parents(".discussion-root").data("idrecord"));
  if(!isNumber(idrecord)) idrecord = Number($$1(elt).parents(".modal-window").find("#data-iddata").val());
  if(!isNumber(idrecord)) return alert("Veuillez enregistrer votre fiche avant d'y ajouter une discussion");

  var iddiscussionParent = (flagComment == true) ? $$1(elt).parents(".discussion").data("iddiscussion") : 0;

  var content = base64Encode$1($$1(elt).parents(".discussion-root").find(".input-control-discussion:first").val());

  if(!content) return false;
  if(!iddiscussionParent) iddiscussionParent = 0;

  execQuery("post-discussion", {
      "gid": gid,
      "typeRecord": typeRecord,
      "idrecord": idrecord,
      "iddiscussionParent": iddiscussionParent,
      "content": content
    }, false)
    .then((json) => {
      if(flagComment) {
        $$1(elt).parents(".discussion").find(".comments-container:first").append(base64Decode(json.html));
      } else {
        $$1(elt).parents(".discussion-root").find(".discussion-container:first").prepend(base64Decode(json.html));
        $$1(elt).parents(".discussion-root").find(".btn-add-discussion").show();
        $$1(elt).parents(".discussion-root").find(".btn-post-discussion").show();
        $$1(elt).parents(".discussion-root").find(".btn-cancel-discussion").show();
      }

      $$1(elt).parents(".discussion-root").find(".input-discussion").remove();
    });
}

function postComment(elt) {
  postDiscussion(elt, true);
}

function removeDiscussion(id, elt) {

  if(!confirm("Attention, vous allez supprimer une discussion !\r\nSouhaitez-vous continuer ?")) return false;

  $$1(elt).hide();

  execQuery("delete-discussion", {
      id
    })
    .then(() => $$1(elt).parents(".discussion-container:first").remove());
}

function updateCommentDiscussion(elt, iddiscussion, typeDiscussionComment) {

  $$1(elt).parents(".discussion-root").find(".btn-post-discussion").hide();
  $$1(elt).parents(".discussion-root").find(".btn-cancel-discussion").hide();

  var gid = $$1(elt).parents(".discussion-root").data("gid");
  var typeRecord = $$1(elt).parents(".discussion-root").data("type-record");
  var idrecord = Number($$1(elt).parents(".discussion-root").data("idrecord"));
  if(!isNumber(idrecord)) idrecord = Number($$1(elt).parents(".modal-window").find("#data-iddata").val());

  var content = $$1(elt).parents(".discussion-root").find(".input-control-discussion:first").val();
  $$1('#discussion-' + iddiscussion + ' .discussion-content-no-link:first').html(content);
  content = base64Encode$1(content);

  if(!content) return false;

  execQuery("update-discussion", {
      "typeDiscussionComment": typeDiscussionComment,
      "iddiscussion": iddiscussion,
      "content": content
    }, false)
    .then((json) => {
      json.html = json.html.replace(new RegExp("\n", 'g'), "\n<br>");

      $$1('#discussion-' + iddiscussion).find(".discussion-content:first").html(base64Decode(json.html));

      if(typeDiscussionComment !== 2) {
        $$1(elt).parents(".discussion-root").find(".btn-add-discussion").show();
        $$1(elt).parents(".discussion-root").find(".btn-post-discussion").show();
        $$1(elt).parents(".discussion-root").find(".btn-cancel-discussion").show();
      }

      $$1(elt).parents(".discussion-root").find(".input-discussion").remove();
    });
}

window.addDiscussion = addDiscussion;
window.adjustHeight = adjustHeight;
window.cancelComment = cancelComment;
window.cancelDiscussion = cancelDiscussion;
window.modifComment = modifComment;
window.postComment = postComment;
window.postDiscussion = postDiscussion;
window.removeDiscussion = removeDiscussion;
window.updateCommentDiscussion = updateCommentDiscussion;

function consultDataWithNotif(idrecord, idnotificationUser, actionsUsers, viewed) {
  if(!viewed) {
    execQuery("set-notification-view", {
      idnotificationUser: idnotificationUser,
      actionsUsers: actionsUsers
    });

    var intbadge = Number($$1("#notifications-user .notifications-badge").html());
    if(isNumber(intbadge)) {
      if(intbadge > 1)
        $$1("#notifications-user .notifications-badge").html(intbadge - 1);
      else {
        $$1("#notifications-user .notifications-badge").html("");
        $$1("#notifications-user .notifications-container").hide();
      }
    }
  }

  consultData$1(idrecord);
}

function notificationAllViewed() {
  execQuery("set-notification-all-view")
    .then(() => {
      $$1("#notifications-user .notifications-badge").html("");
      $$1("#notifications-user .notifications-container").hide();
    });
}

window.consultDataWithNotif = consultDataWithNotif;
window.notificationAllViewed = notificationAllViewed;

function updateCountShoppingcartElement() {
  $$1('#inShoppingcart').css('display', 'block');
  $$1('#outShoppingcart').css('display', 'none');
  var countShoppingcart = parseInt($$1('#shoppingcart-user .shoppingcart-badge').html());
  $$1('#shoppingcart-user .shoppingcart-badge').html(countShoppingcart + 1);
}

// FIXME: Used in 'onclick'

function addOneShoppingcart(iddata, options) {

  if(typeof(iddata) == "object") {
    var container = iddata;
    iddata = $$1(container).parents(".modal-window").find("#data-iddata").val();
  }

  iddata = Number(iddata);

  if(!options) options = {};
  if(!iddata || !isNumber(iddata)) return displayError$1("Veuillez enregistrer avant d'effectuer cette opération");

  execQuery("shoppingcart-add-one-data", {
      iddata
    })
    .then((json) => {
      if(json.type === 'info') {
        return displayInfo(json.msg);
      }
      updateCountShoppingcartElement();
      displaySuccess$1(json.msg);
    });
}

// FIXME: Used in 'onclick'

function addShoppingcart(ids) {
  execQuery("shoppingcart-add-data", {
      ids
    })
    .then((json) => {
      if(json.type === 'info') {
        return displayInfo(json.msg);
      }
      // On met à jour le nombre d'élément dans le panier
      var countShoppingcart = parseInt($$1('#shoppingcart-user .shoppingcart-badge').html());
      $$1('#shoppingcart-user .shoppingcart-badge').html(countShoppingcart + json.idsAdd.length);
      displaySuccess$1(json.msg);
    });
}

// FIXME: Used in 'onclick'

function addShoppingcartDatas() {
  if($$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").length <= 0)
    return alert("Merci de cocher au moins un enregistrement dans la liste");
  else {
    var ids = new Array();

    $$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").each(function() {
      const val = Number($$1(this).val());
      if(isNumber(val)) ids.push(val);
    });

    addShoppingcart(ids);
  }
}

// FIXME: Used in 'onclick'

function archiveDatas() {

  if($$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").length <= 0)
    return alert("Merci de cocher au moins un enregistrement dans la liste");

  if(!confirm("Attention, vous allez archiver un ou plusieurs enregistrement.\r\nSouhaitez-vous continuer ?"))
    return;

  var ids = new Array();
  $$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").each(function() {
    const val = Number($$1(this).val());
    if(isNumber(val)) ids.push(val);
  });

  execQuery("archive-datas", {
      ids
    })
    .then((json) => {
      var flagShowArchives = ($$1("#ck-archives").prop("checked") == true);

      for(var i = 0; i <= json.ids.length - 1; i++) {
        var id = json.ids[i];
        flagShowArchives ? $$1(".tabler-datas .tabler-body .tabler-row-" + id + ", .tabler-datas .thumb-" + id).removeClass("archived").addClass("archived") : $$1(".tabler-datas .tabler-body .tabler-row-" + id + ", .tabler-datas .thumb-" + id).remove();
      }

      displaySuccess$1(json.msg);
    });
}

const _flags = {
  mouseMenuMain: false,
  mouseMenuMobile: false,
  mouseMenuAllMain: false
};

function flags() {
  return _flags;
}

function closeMenuMain() {
  flags().mouseMenuAllMain = false;
  $$1('.menuAll').fadeOut();
  $$1('html, body').css('overflow', 'auto');
}

const gid = {
  eval: null,
  select: null
};
// var gid_origin_for_eval = null;
// var gid_origin_for_select_data = null;

function gidOrigin() {
  return gid;
}

/**
 * Open a new modalWindow for specified iddataType
 * @param {numeric} iddataType
 * @param {mixed} elt DOM or object can be the current DOM element or object options
 * @param {object} options
 */
function createData(iddataType, elt, options) {

  if(typeof(elt) == "object") {
    if($$1(elt).parents('.control-eval').length > 0 && $$1(elt).parents('.control-eval').attr('data-gid').length > 0) {
      gidOrigin().eval = $$1(elt).parents('.control-eval').attr('data-gid');
      gidOrigin().select = null;
    } else if($$1(elt).parents('.control-selector').length > 0 && $$1(elt).parents('.control-selector').attr('data-gid').length > 0) {
      gidOrigin().eval = null;
      gidOrigin().select = $$1(elt).parents('.control-selector').attr('data-gid');
    } else {
      gidOrigin().eval = null;
      gidOrigin().select = null;
    }
  }


  // <-- retrieve options
  if(typeof(elt) == "object") {
    if(!elt.nodeName) {
      options = elt;
      elt = null;
    }
  }
  // --->

  var modalWindow = pushModalWindow("create-data-" + iddataType, options);
  if(modalWindow === null) return false;

  setModalWindowLoading(modalWindow);

  // <--- try to retrieve current modalWindow iddata and iddataType
  var sourceIddata = 0;
  var sourceIddataType = 0;
  var sourceFieldGid = null;

  if(elt) {
    sourceFieldGid = $$1(elt).parents('.control-selector:first').data('gid');
    const sourceModalWindow = getModalWindow$1(elt);
    if(sourceModalWindow !== null) {
      sourceIddata = $$1(sourceModalWindow).find("input[name=data-iddata]").val();
      sourceIddataType = $$1(sourceModalWindow).find("input[name=data-iddata-type]").val();
    }
  }
  // --->

  execQuery("create-data", {
      'iddataType': iddataType,
      'options': options,
      'sourceIddata': sourceIddata,
      'sourceIddataType': sourceIddataType,
      'sourceFieldGid': sourceFieldGid
    }, false)
    .then((json) => {
      if(json.type === 'message') {
        closeModalWindow(modalWindow);
        hideModalWindowOverlay();
        displayMessage(json.msg);
      } else {
        renderData(modalWindow, json);
      }
    })
    .catch((err) => {
      closeModalWindow(modalWindow);
      hideModalWindowOverlay();
      displayMessage(err.msg ? err.msg : err);
    });

  //if the main menu is open close it
  closeMenuMain();
}

// import 'bootstrap-stylus/js/modal';

function confirmClosaModalWindow(elt) {

  var modalWindow = getModalWindow$1(elt);
  var modification = $$1(modalWindow).find('.modal-window-modif').val();

  if(modification === '1') {

    //On ouvre une modal Enregistrer/Annuler/Fermer
    var modalConfirm = $$1('#confirmSaveCancelClose').modal({
      show: true,
      backdrop: 'static',
      keyboard: false
    });
    $$1(modalConfirm).unbind('click');
    $$1(modalConfirm)
      .on('click', '#save', function() {
        //On enregistre
        $$1(modalWindow).find('.modal-window-close-after-submit').val(1);
        $$1(modalWindow).find('#form-data').submit();
        $$1('#confirmSaveCancelClose').modal('hide');
      })
      .on('click', '#cancel, #cancelIcon', function() {
        $$1('#confirmSaveCancelClose').modal('hide');
        return false;
      })
      .on('click', '#close', function() {
        closeModalWindow$1(elt);
        $$1('#confirmSaveCancelClose').modal('hide');
      });

    return false;
  } else
    closeModalWindow$1(elt);
}

// FIXME: Used in 'onclick'

function deleteDatasQuery(ids, fromOneData, suffix) {

  if(!fromOneData)
    tablerSetLoading($$1(".tabler-datas"), true);
  else if(!confirm("Attention, vous allez supprimer un ou plusieurs enregistrement.\r\nSouhaitez-vous continuer ?"))
    return;

  var query = "delete-datas";

  if(suffix)
    query += "-" + suffix;


  execQuery(query, {
      ids
    }, !fromOneData ? false : 'Chargement...')
    .then((json) => {
      if(fromOneData) {
        const delLen = json.idsDeleted.length;
        json.idsDeleted.forEach((id) => {
          $$1(`.tabler-datas .tabler-body .tabler-row.tabler-row-${id}`).remove();
          $$1(`.tabler-datas .thumb-${id}`).remove();
        })

        const $total = $$1('#nbTotalRecord');
        const nbDataOld = parseInt($total.html());
        const nbDataNew = nbDataOld - delLen;
        $total.html(Math.max(count, 0));

        return displaySuccess$1(json.msg);
      } else {
        tablerSetLoading($$1(".tabler-datas"), false);

        if($$1('.full-page .modal-window').length > 0) {
          window.close();
        } else {
          json.idsDeleted.forEach((id) => {
            confirmClosaModalWindow($$1(`#modal-window-data-${id} .modal-window-header-bar .btn-close`).get(0));
          });
        }
      }
    })
    .catch(() => {
      if(!fromOneData) {
        tablerSetLoading($$1(".tabler-datas"), false);
      }
    });
}

function deleteDatas(suffix) {

  if($$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").length <= 0)
    return alert("Merci de cocher au moins un enregistrement dans la liste");

  if(!confirm("Attention, vous allez supprimer un ou plusieurs enregistrement.\r\nSouhaitez-vous continuer ?"))
    return;

  var ids = new Array();
  $$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").each(function() {
    const val = Number($$1(this).val());
    if(isNumber(val)) ids.push(val);
  });

  deleteDatasQuery(ids, null, suffix); // déplacé dans data.js
}

// FIXME: Used in 'onclick'
// NOTE: BIG ONE - used in a lot of places

function editData(iddata, options) {

  if(typeof(iddata) == "object") {
    var container = iddata;
    iddata = $$1(container).parents(".modal-window").find("#data-iddata").val();
  }

  iddata = Number(iddata);

  if(!options) options = {};
  if(!iddata || !isNumber(iddata)) return displayError$1("Veuillez enregistrer avant d'effectuer cette opération");

  var modalWindow = pushModalWindow("data-" + iddata, options);
  if(modalWindow === null) return false;

  setModalWindowLoading(modalWindow);

  execQuery("edit-data", {
      iddata,
      options
    }, false)
    .then((json) => {
      if(json.type === 'message') {
        closeModalWindow$1(modalWindow);
        hideModalWindowOverlay$1();
        displayMessage(json.msg);
      } else {
        renderData(modalWindow, json);
      }
    })
    .catch((err) => {
      closeModalWindow$1(modalWindow);
      hideModalWindowOverlay$1();
      displayMessage(err.msg ? err.msg : err);
    });
}

let _currentExportTabler = null;

function currentExportTabler(tabler) {
  if(tabler) {
    _currentExportTabler = tabler;
  }
  return _currentExportTabler;
}

// import 'bootstrap-stylus/js/modal';

function setExportDatasWaiting(type) {

  $$1("#export-datas2" + type + "-modal #btn-export-" + type + "").hide();
  $$1("#export-datas2" + type + "-modal #btn-wait-" + type + "").show();
  $$1("#export-data2s" + type + "-modal #btn-download-" + type + "").hide();

}

function setExportDatasDownload(href, type) {

  $$1("#export-datas2" + type + "-modal #btn-export-" + type + "").hide();
  $$1("#export-datas2" + type + "-modal #btn-wait-" + type + "").hide();
  $$1("#export-datas2" + type + "-modal #btn-download-" + type + "").show();
  if(href) $$1("#export-datas2" + type + "-modal #btn-download-" + type + "").attr("href", href);

}

function setExportDatasExport(type) {

  $$1("#export-datas2" + type + "-modal #btn-export-" + type + "").show();
  $$1("#export-datas2" + type + "-modal #btn-wait-" + type + "").hide();
  $$1("#export-datas2" + type + "-modal #btn-download-" + type + "").hide();

}

function cleanExportDatasModal(type) {

  $$1("#export-datas2" + type + "-modal #ck-export-datas2" + type + "-flyleaf").prop("checked", false);
  $$1("#export-datas2" + type + "-modal #export-data2" + type + "-flyleaf-title").val("");
  $$1("#export-datas2" + type + "-modal #export-data2" + type + "-flyleaf-title").hide();

  setExportDatasExport(type);
}

function execExportDatas(type) {
  var tabler = currentExportTabler();

  if(!tabler) {
    return false;
  }

  setExportDatasWaiting(type);

  var flagFlyleaf = $$1("#export-datas2" + type + "-modal #ck-export-datas2" + type + "-flyleaf").prop("checked");
  var flyleafTitle = $$1("#export-datas2" + type + "-modal #export-data2" + type + "-flyleaf-title").val();

  var ids = new Array();
  $$1(tabler).find(".tabler-cell-selector input[type=checkbox]:checked").each(function() {
    const val = Number($$1(this).val());
    if(isNumber(val)) ids.push(val);
  });

  execQuery("export-datas-" + type, {
      "ids": ids,
      "flag-flyleaf": flagFlyleaf,
      "flyleaf-title": flyleafTitle
    })
    .then((json) => {
      if(json.href) {
        return setExportDatasDownload(json.href, type);
      }
      setExportDatasExport(type);
    });
}

function initExportDatasModal(type) {

  if($$1(document).find("#export-datas2" + type + "-modal").length > 0) return cleanExportDatasModal(type);
  var typeLibelle = '';
  if(type == 'pdf')
    typeLibelle = 'Adobe Acrobat PDF';
  if(type == 'word')
    typeLibelle = 'WORD';

  $$1('\
		<div class="modal" id="export-datas2' + type + '-modal" tabindex="-1" role="dialog">\
			<input type="hidden" id="uid-data-' + type + '" value="" />\
			<div class="modal-dialog" style="width:600px;margin-top:100px;">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>\
						<h2 class="modal-title">Exportation ' + typeLibelle + '</h2>\
					</div>\
					<div class="modal-body" style="padding-top:5px;">\
						<center>\
							<div class="row">\
								<div class="col-xs-10 col-xs-offset-1">\
									<label class="checkbox-inline"><input type="checkbox" id="ck-export-datas2' + type + '-flyleaf" />&nbsp;Générer une page d\'accueil</label>\
								</div>\
							</div>\
							<div class="row">\
								<div class="col-xs-10 col-xs-offset-1">\
									<input type="text" class="form-control" id="export-data2' + type + '-flyleaf-title" value="" placeholder="Intitulé de la page d\'accueil" style="display:none;" />\
								</div>\
							</div>\
							<hr />\
							<button id="btn-export-' + type + '" type="button" class="btn btn-primary btn-lg">Exporter vers<br />' + typeLibelle + '</button>\
							<button style="display:none;" id="btn-wait-' + type + '" type="button" class="btn btn-default btn-lg">Exportation en cours<br />veuillez patienter ...</button>\
							<a style="display:none;" id="btn-download-' + type + '" class="btn btn-success btn-lg" href="" target="_blank">Cliquez ici<br />pour télécharger le fichier</a>\
						</center>\
					</div>\
					<div class="modal-footer">\
						<button class="btn btn-default" type="button" onclick="closeExportDatasModal(\'' + type + '\');">Fermer</button>\
					</div>\
				</div>\
			</div>\
		</div>\
	')
    .appendTo('body')
    .find(`#btn-export-${type}`).click(() => execExportDatas(type));

  $$1("#export-datas2" + type + "-modal #ck-export-datas2" + type + "-flyleaf").unbind("change").bind("change", function() {
    ($$1(this).prop("checked") == true) ? $$1("#export-datas2" + type + "-modal #export-data2" + type + "-flyleaf-title").show(): $$1("#export-datas2" + type + "-modal #export-data2" + type + "-flyleaf-title").hide();
  });
}

function openExportDatasModal(type) {
  initExportDatasModal(type);
  $$1("#export-datas2" + type + "-modal").modal("show");

}

// FIXME: Used in 'onclick'

function exportPdfDatas(elt) {
  const tabler = findTabler(elt);

  if(tabler.find('.tabler-cell-selector input[type=checkbox]:checked').length <= 0)
    return displayError("Merci de cocher au moins un enregistrement dans la liste", 2000);

  currentExportTabler(tabler);
  openExportDatasModal('pdf');
}

// FIXME: Used in 'onclick'

function exportWordDatas(elt) {

  var tabler = findTabler(elt);

  if(tabler.find('.tabler-cell-selector input[type=checkbox]:checked').length <= 0)
    return displayError("Merci de cocher au moins un enregistrement dans la liste", 2000);

  currentExportTabler(tabler);

  openExportDatasModal('word');
}

// import 'bootstrap-stylus/js/modal';

// FIXME: Include modal as well

function tablerExportXls(tabler) {

  tablerSetLoading(tabler, true);

  var ids = new Array();
  $$1(tabler).find(".tabler-cell-selector input[type=checkbox]:checked").each(function() {
    ids.push($$1(this).val());
  });

  var id = $$1(tabler).attr("id");
  var sortColumn = "";
  var sortOrder = 0;
  var search = $$1(tabler).find("input[name=tabler-search]").val();
  var offset = $$1(tabler).find("input[name=tabler-offset]").val();
  var limit = $$1(tabler).find("input[name=tabler-limit]").val();
  var filters = tablerGetFilters(tabler);
  var vars = tablerGetVars($$1(tabler));

  if(typeof(search) == "undefined") search = "";

  if((Object.keys(filters).length > 0) || (search.length > 0)) {
    $$1(tabler).parents(".tabler-container").find(".tabler-remove-filters").show();
  } else {
    $$1(tabler).parents(".tabler-container").find(".tabler-remove-filters").hide();
  }

  if($$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell.sort-asc, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sort-asc").length > 0) {
    sortOrder = 1;
    sortColumn = $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell.sort-asc").data("uid");
  }
  if($$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell.sort-desc, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sort-desc").length > 0) {
    sortOrder = -1;
    sortColumn = $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell.sort-desc, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell.sort-desc").data("uid");
  }

  execQuery("tabler-export-xls", {
      'id': id,
      'sortColumn': sortColumn,
      'sortOrder': sortOrder,
      'search': search,
      'offset': offset,
      'limit': limit,
      'filters': filters,
      'vars': vars,
      'ids': ids
    }, false)
    .then((json) => {
      tablerSetLoading(tabler, false);
      if(json.filename) {
        $$1('#exportExcelResult').remove();
        $$1("body").append(
          '<div class="modal modal-page" id="exportExcelResult" tabindex="-1" role="dialog">\
						<div class="modal-dialog" style="width:600px; margin-top:10%;">\
							<div class="modal-content">\
								<div class="modal-header">\
									<button class="modal-header-close" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i></button>\
									<span class="modal-header-icon"><i class="glyphicons glyphicons-disk-save"></i></span>\
									<h2 class="modal-title">Exportation terminée</h2>\
								</div>\
								<div class="modal-footer">\
									<span style="margin:0 5px;" type="button" class="btn btn-success pull-left" id="openExcel">\
										<a href="' + json.filename + '" target="_blank">Ouvrir le fichier</a>\
									</span>\
									<button style="margin:0 5px;" type="button" data-dismiss="modal" class="btn btn-default pull-right" id="close">Fermer</button>\
									<div class="clearfix"></div>\
								</div>\
							</div>\
						</div>\
					</div>'
        );

        var modalConfirm = $$1('#exportExcelResult').modal({
          show: true,
          backdrop: 'static',
          keyboard: false
        });
      }
    })
    .catch(() => tablerSetLoading(tabler, false));
}

function exportXlsDatas(elt) {
  return tablerExportXls(findTabler(elt));
}

// FIXME: Is used as a callback method - remove that

function failSaveData(json) {
  var modal = getModalWindowMain();

  modal.find('.data-status-list').each(function(idx, elm) {

    if($$1(modal).find('input[name=' + $$1(elm).prop('name') + '-old]').length > 0) {
      var old = $$1(modal).find('input[name=' + $$1(elm).prop('name') + '-old]').val();

      if($$1(elm).val() != old)
        $$1(modal).find('.modal-window-modif').val('1');

      $$1(elm).val(old);
    }
  });
}

function updateEval(modalWindow, iddataSource, iddataEval, gid, action) {
  if($$1(modalWindow).find(".control-eval[data-gid='" + gid + "'] .control-eval-label").length > 0) {
    execQuery("update-modal-window-control-eval", {
        'iddataSource': iddataSource,
        'iddata': iddataEval,
        'gid': gid,
        'uid': $$1(modalWindow).find(".control-eval[data-gid='" + gid + "']").data('uid'),
        'hideEval': $$1(modalWindow).find(".control-eval[data-gid='" + gid + "']").data('hide-eval'),
        'hideMoy': $$1(modalWindow).find(".control-eval[data-gid='" + gid + "']").data('hide-moy'),
        'action': action
      })
      .then((json) => {
        $$1(modalWindow).find(".control-eval[data-gid='" + gid + "'] .control-eval-label table").remove();
        $$1(modalWindow).find(".control-eval[data-gid='" + gid + "'] .control-eval-label input").remove();
        $$1(modalWindow).find(".control-eval[data-gid='" + gid + "'] .control-eval-label").append(json['return']);
        if($$1(modalWindow).find(".control-eval[data-gid='" + gid + "']").data('allow-multi-eval') == 0)
          $$1(modalWindow).find(".control-eval[data-gid='" + gid + "'] .btn-add").remove();
      });
  }
}

function updateModalWindowSourceSelectData(modalWindow, iddata) {
  execQuery("update-modal-window-control-selectors", {
      //'iddataSource':iddataSource,
      'iddata': iddata,
      'field': $$1(modalWindow).find(".control-selector[data-gid='" + gidOrigin().select + "']").data('field')
    }, false)
    .then((json) => {
      var possibilities = ['.list-group', '.tabler', '.control-selector-label'];
      var control = $$1(modalWindow).find('.control-selector[data-gid="' + gidOrigin().select + '"]');
      for(var i in possibilities) {
        var container = control.find(possibilities[i]);
        if(container.length > 0) {
          //trouve le bloc ou la ligne de tableau correspondant
          if(container.find('.easy-data-field-id[value="' + iddata + '"]').length > 0) {
            container.find('.easy-data-field-id[value="' + iddata + '"]').parents('.list-group-easydata').replaceWith(base64Decode(json.content));
          }
          //trouve l'etiquette correspondant
          else if(container.find('.control-selector-label [data-id="' + iddata + '"]').length > 0) {
            container.find('.control-selector-label [data-id="' + iddata + '"]').parents('.control-selector-label').replaceWith(base64Decode(json.content));
          } else {
            container.append(base64Decode(json.content));
          }
          if(possibilities[i] === '.control-selector-label') {
            if($$1(modalWindow).find(".control-selector[data-gid='" + gidOrigin().select + "'] input.data-add").length > 0) {
              var dataAdd = $$1(modalWindow).find(".control-selector[data-gid='" + gidOrigin().select + "'] input.data-add").val().split(',');
              if($$1(modalWindow).find(".control-selector[data-gid='" + gidOrigin().select + "'] input.data-add").val().length > 0)
                dataAdd.push(json.id);
              else
                dataAdd = [json.id];
              $$1(modalWindow).find(".control-selector[data-gid='" + gidOrigin().select + "'] input.data-add").val(dataAdd.join(','));
            }
          }

          break;
        }
      }
      //On met à jour la fiche pour dire qu'elle a ete modifie
      $$1(modalWindow).find('.modal-window-modif').val(1);
    });
}

function updateModalWindowSource(source) {

  var iddataSource = source.iddataSource;
  var modalWindow = getModalWindow("data-" + iddataSource); // retrieve related modalWindow
  if(modalWindow === null) return false;

  if(gidOrigin().eval != null) {
    updateEval(modalWindow, iddataSource, source.iddata, gidOrigin().eval, 'create');
  } else {
    updateModalWindowSourceSelectData(modalWindow, source.iddata, gidOrigin().select);
  }
}

/**
 * finalizeSaveData function executed just after data save action
 * @param  {object} json iddata, iddataSource, dataTitle, dataStatusTitle, fields(array('fieldUid'=>value), kindexModalDisplay, kindexModalData, )
 */

// FIXME: Is used in callback
function finalizeSaveData(json) {
  if(!json)
    return false;

  $$1('.crawling-highlight').each(function() {
    $$1(this).removeClass('crawling-highlight')
  });

  var modalWindow = getModalWindowMain();

  if(isNumber(json.iddataSource))
    updateModalWindowSource(json); // if current modal window have a parent, update it

  if(json.redirectUrl)
    document.location.href = json.redirectUrl;

  // field saveCallback function can return and array like array('fnCallback'=>function_name, 'value'=>some values). It is executed as defined below fnCallback(fieldUid, json, value)
  if(json.fnCallbackFields) {
    $$1.each(json.fnCallbackFields, function(index, fnCallbackField) {
      if(typeof window[fnCallbackField.fnCallback] === "function") {
        window[fnCallbackField.fnCallback](fnCallbackField.uid, json, fnCallbackField.value);
      }
    });
  }

  if(json.creationRedirect && json.creationRedirectContent != '') {
    if(json.creationMessage) {
      return displayMessage(base64Decode(json.creationMessageContent), json.creationRedirectContent, 1500);
    } else {
      if(json.creationRedirectContent)
        document.location.href = json.creationRedirectContent;
    }
  }



  if(json.creationClose) {
    if(json.creationMessage) {

      if($$1('.modal-window').not('.minimizes').not('.full-page .modal-window').length > 0)
        displayMessage(base64Decode(json.creationMessageContent));
      else
        $$1('#page-content').html('<div class="alert alert-message" id="display-msg" style="top:auto;"><div class="display-msg-icon"><i class="glyphicons"></i></div><div class="display-msg-text">' + base64Decode(json.creationMessageContent) + '</div></div>');
    }

    closeModalWindow$1(modalWindow);
    return false;
  } else if(json.creationMessage) {
    displayMessage(base64Decode(json.creationMessageContent));
  }

  if($$1(modalWindow).find('.modal-window-close-after-submit').val() === '1') {
    closeModalWindow$1(modalWindow);
  }

  //On recharge la fiche si necessaire
  if(json.dataContainer) {
    if($$1(modalWindow).parents('.full-page').length > 0) {
      formData = $$1(modalWindow).html(base64Decode(json.dataContainer));
      setTimeout(function() {
        finalizeLoadData();
      }, 100);
    } else {
      $$1(modalWindow).find('.modal-window-container').html(base64Decode(json.dataContainer));
      renderData(modalWindow, json);
    }

    $$1(modalWindow).find('.modal-window-modif').val('0');
  }

  // --->


  if(json.tmpStatus) {
    $$1(modalWindow).find('.data-status-list').each(function(id, elm) {

      $$1(modalWindow).find('input[name=' + $$1(elm).prop('name') + '-old]').val(json.tmpStatus);
      $$1(elm).val(json.tmpStatus);

    });

    $$1(modalWindow).find('.modal-window-modif').val('1');

  }
}

function removeShareUser(elt) {
  var iduser = $(elt).parents(".user").find(".user-value").val();
  $("#share-data-container .users-list ul li[data-iduser=" + iduser + "]").show();
  $("#share-data-container .users-list ul li[data-iduser=" + iduser + "] span").removeClass('alreadyAdd');
  $(elt).parents(".user").remove();
}

function addShareUser(elt) {

  var iduser = $$1(elt).parent().data("iduser");
  var typeClass = $$1(elt).parent().data("user-type");
  var username = $$1(elt).html();

  const $div = $$1(`<div class='user ${typeClass}'>${username}</div>`);
  const $i = $$1('<i class="glyphicon glyphicon-remove-sign"></i>').click((e) => removeShareUser(e.currentTarget));

  $div
    .prepend(`<input type="hidden" class="user-value" value="${iduser}" />`)
    .prepend($i)
    .insertBefore("#share-data-container .user-input");

  $$1(elt).parent().hide();
  $$1(elt).addClass('alreadyAdd');

  $$1("#share-data-container .users-list").hide();
  $$1("#share-data-container .user-input").val("");
  $$1("#share-data-container .user-input").focus();
}

// import 'bootstrap-stylus/js/modal';

function closeAddGuestContainer() {
  $$1("#guest-form-modal").modal("hide");
}

function clearGuestContainer() {
  $$1("#guest-form-modal").find('input[name=sex]').each(function() {
    $$1(this).prop('checked', false);
  });
  $$1("#guest-form-modal").find('#firstname').val('');
  $$1("#guest-form-modal").find('#lastname').val('');
  $$1("#guest-form-modal").find('#email-address').val('');
}

// FIXME: Is used in callback

function finalizeSaveGuestForm(json) {

  if(!json) return false;

  //On verifie que l'utilisateur n'est pas deja dans la liste des utilisateurs de partage
  var eltUserShare = $$1('#share-data-container .content').find('input[value=' + json.iduser + ']');

  if(eltUserShare.length > 0)
    displayError$1('Invité déjà dans la liste');
  else {
    //On ajoute l'utilisateur invité dans la liste des utilisateurs du partage
    $$1('.users-list .list-unstyled').append('<li data-iduser="' + json.iduser + '" data-user-type="guest" style="display: none;"><span href="#" onclick="addShareUser(this);">' + json.aliasname + '</span></li>');
    addShareUser($$1('.users-list').find('li[data-iduser=' + json.iduser + '] span'));
  }
  //On ferme la fenetre d'ajout d'un invité
  clearGuestContainer();
  closeAddGuestContainer();
}

// FIXME. Is used in 'onlick'

function moveOrderDatas(tabler, mvt) {

  if($$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").length <= 0)
    return alert("Merci de cocher au moins un enregistrement dans la liste");

  if($$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").length > 1)
    return alert("Merci de ne cocher qu'un seul enregistrement dans la liste");

  var iddata = $$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").first().val();

  execQuery("move-datas", {
      "id": iddata,
      "movement": mvt
    })
    .then((json) => {
      var row = $$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").parents('.tabler-row');

      // on monte
      if(mvt == -1) {
        row.prev().before(row);
      } else {
        row.next().after(row);
      }

      displaySuccess$1(json.msg);
    });
}

function tablerRemoveFilters(tabler) {
  $$1(tabler).find("input[name=tabler-offset]").val(0);
  $$1(tabler).find("input[name=tabler-search]").val("");
  $$1(tabler).find("input[name=tabler-ids]").val("");

  $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell").each(function() {
    $$1(this).removeClass("filtered");
    $$1(this).find(".filters input[type=checkbox]").prop("checked", false);
  });

  $$1(tabler).parents(".tabler-container").find(".tabler-remove-filters").show();

  tablerUpdate(tabler);
}

// FIXME: Used in 'onclick'

function orderDatas(tabler, quiet) {
  if(!quiet) {
    if(!confirm("Attention, vous allez réinitialiser tous les filtres.\r\nSouhaitez-vous continuer ?"))
      return;
  }

  // remove all sorts
  $$1(tabler).find(".tabler-header .tabler-header-row .tabler-header-cell, .tabler-thumb-header .tabler-thumb-header-row .tabler-header-cell").removeClass("sort-asc sort-desc");
  tablerRemoveFilters(tabler);
  displayOrderBtns(true);
}

function removeOneShoppingcart(iddata, options) {

  if(typeof(iddata) == "object") {
    var container = iddata;
    iddata = $$1(container).parents(".modal-window").find("#data-iddata").val();
  }

  execQuery("shoppingcart-remove-one-data", {
      'iddata': iddata
    })
    .then((json) => {
      if(json.type === 'info') {
        return displayInfo(json.msg);
      }
      //On met à jour le nombre d'élément dans le panier
      $$1('#inShoppingcart').css('display', 'none');
      $$1('#outShoppingcart').css('display', 'block');
      var countShoppingcart = parseInt($$1('#shoppingcart-user .shoppingcart-badge').html());
      $$1('#shoppingcart-user .shoppingcart-badge').html(countShoppingcart - 1);
      displaySuccess$1(json.msg);
    });
}

function removeShoppingcart() {

  if($$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").length <= 0) return alert("Merci de cocher au moins un enregistrement dans la liste");
  if(!confirm("Attention, vous allez enlever un ou plusieurs éléments des favoris.\r\nSouhaitez-vous continuer ?")) return;

  var ids = new Array();
  $$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").each(function() {
    const val = Number($$1(this).val());
    if(isNumber(val)) ids.push(val);
  });

  execQuery("shoppingcart-remove-data", {
    ids
  })
  then((json) => {
    //On met à jour le nombre d'élément dans le panier
    var countShoppingcart = parseInt($$1('#shoppingcart-user .shoppingcart-badge').html());
    $$1('#shoppingcart-user .shoppingcart-badge').html(countShoppingcart - json.idsRemove.length);

    json.idsRemove.forEach((id) => $$1(`.tabler-datas .tabler-body .tabler-row.tabler-row-${id}`).remove());

    const $total = $$1('#nbTotalRecord');
    const nbDataOld = $total.html();
    if(parseInt(nbDataOld) > 0) {
      const nbDataNew = parseInt(nbDataOld) - json.idsRemove.length;
      $total.html(nbDataNew);
    }

    displaySuccess$1(json.msg);
  });
}

function searchShareDataContainerUser() {

  timerShareDataContainerUserInput = null;

  var search = $$1("#share-data-container .user-input").val().toLowerCase();
  if(search == "") return $$1("#share-data-container .users-list").hide();

  $$1("#share-data-container .users-list ul li span").each(function() {
    if($$1(this).hasClass('alreadyAdd')) {
      $$1(this).parent().hide();
    } else {
      var username = $$1(this).html().toLowerCase();

      if(username.indexOf(search) >= 0) {
        $$1(this).parent().show();
      } else {
        $$1(this).parent().hide();
      }
    }
  });

  $$1("#share-data-container .users-list").show();
}

var timerShareDataContainerUserInput = null;

function initShareDataContainerEvents() {

  $$1("#share-data-container .user-input").unbind("keyup").bind("keyup", function(evt) {

    if(timerShareDataContainerUserInput != null) clearTimeout(timerShareDataContainerUserInput);

    if(evt.keyCode == 13)
      if($$1("#share-data-container .users-list ul li:visible").length == 1)
        return $$1("#share-data-container .users-list ul li:visible span	").trigger("click");

    timerShareDataContainerUserInput = setTimeout(function() {
      searchShareDataContainerUser();
    }, 300);
  });
}

function hideShareDataContainer() {

  if($$1("#share-data-container").length > 0) $$1("#share-data-container").fadeOut("fast");

  $$1("#share-data-container .users-list ul li").each(function() {
    $$1(this).find("span").removeClass('alreadyAdd');
  });
}

function showShareDataContainer(iddata) {
  if($$1(document).find("body").find("#share-data-container").length > 0)
    $$1("#share-data-container").remove();

  $$1(document).find("body").append('<div id="share-data-container"><h3 style="padding:40px 20px;"><center>Veuillez patienter ...</center></h3></div>');

  execQuery("get-share-data-container", {
      iddata
    })
    .then((json) => {
      $$1("#share-data-container").html(base64Decode(json.content));
      initShareDataContainerEvents();
      $$1("#share-data-container").show();
      $$1("#share-data-container .data-iddata").val(iddata);
      $$1("#share-data-container .user-input").focus();
      tooltip();
    })
    .catch(() => {
      hideShareDataContainer();
      tooltip();
    });
}

function shareData(iddata, options) {
  if(!options) options = {};

  if(!options.multipleShare) {
    if(typeof(iddata) == "object") {
      var container = iddata;
      iddata = $$1(container).parents(".modal-window").find("#data-iddata").val();
    }

    iddata = Number(iddata);

    if(!options) options = {};
    if(!iddata || !isNumber(iddata)) return displayError$1("Veuillez enregistrer avant d'effectuer cette opération");
  }

  showShareDataContainer(iddata);
}



function shareDatas() {
  if($$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").length <= 0)
    return alert("Merci de cocher au moins un enregistrement dans la liste");
  else {
    var ids = new Array();

    $$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").each(function() {
      if(isNumber($$1(this).val()))
        ids.push($$1(this).val());
    });

    shareData(ids, {
      "multipleShare": true
    });
  }
}

// import 'bootstrap-stylus/js/modal';

function showAddGuestContainer() {
  $$1("#guest-form-modal").modal({
    'show': true,
    'backdrop': 'static',
    'keyboard': false
  });

  formRequester();
}

function unarchiveDatas() {

  if($$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").length <= 0)
    return alert("Merci de cocher au moins un enregistrement dans la liste");

  if(!confirm("Attention, vous allez désarchiver un ou plusieurs enregistrement.\r\nSouhaitez-vous continuer ?"))
    return;

  var ids = new Array();
  $$1(".tabler-datas .tabler-cell-selector input[type=checkbox]:checked").each(function() {
    const val = Number($$1(this).val());
    if(isNumber(val)) ids.push(val);
  });

  execQuery("unarchive-datas", {
      ids
    })
    .then((json) => {
      for(var i = 0; i <= json.ids.length - 1; i++) {
        var id = json.ids[i];
        $$1(".tabler-datas .tabler-body .tabler-row-" + id + ", .tabler-datas .thumb-" + id).removeClass("archived");
      }

      displaySuccess$1(json.msg);
    });
}

function validShareData() {

  if($$1("#share-data-container").length <= 0) return false;

  var iddata = $$1("#share-data-container").find(".data-iddata").val();
  var msg = $$1("#share-data-container").find(".msg").val();
  var users = new Array();
  $$1("#share-data-container .content .user").each(function() {
    users.push($$1(this).find(".user-value").val());
  });

  $$1("#share-data-container .hide-while-sending").hide();
  $$1("#share-data-container .show-while-sending").show();

  execQuery("share-data", {
      'iddata': iddata,
      'msg': base64Encode$1(msg),
      'users': users
    })
    .then((json) => {
      $$1("#share-data-container .display-msg").html(base64Decode(json.content));
      setTimeout(function() {
        hideShareDataContainer();
      }, 2000);
    })
    .catch(() => {
      $$1("#share-data-container .hide-while-sending").show();
      $$1("#share-data-container .show-while-sending").hide();
    });
}

function WatcherNotifViewed(elt) {
  var parent = $$1(elt).parents('.crawler_notif');
  execQuery('watcher-oknotif', {
      iddata: $$1('#data-iddata').val()
    })
    .then(() => parent.remove())
    .catch(() => parent.remove());
}

// Expose methods to the global scope
window.addOneShoppingcart = addOneShoppingcart;
window.addShoppingcartDatas = addShoppingcartDatas;
window.archiveDatas = archiveDatas;
window.consultData = consultData$1;
window.createData = createData;
window.deleteDatas = deleteDatas;
window.deleteDatasQuery = deleteDatasQuery;
window.editData = editData;
window.exportPdfDatas = exportPdfDatas;
window.exportWordDatas = exportWordDatas;
window.exportXlsDatas = exportXlsDatas;
window.failSaveData = failSaveData;
window.finalizeSaveData = finalizeSaveData;
window.finalizeSaveGuestForm = finalizeSaveGuestForm;
window.moveOrderDatas = moveOrderDatas;
window.orderDatas = orderDatas;
window.removeOneShoppingcart = removeOneShoppingcart;
window.removeShoppingcart = removeShoppingcart;
window.shareData = shareData;
window.shareDatas = shareDatas;
window.hideShareDataContainer = hideShareDataContainer;
window.showAddGuestContainer = showAddGuestContainer;
window.unarchiveDatas = unarchiveDatas;
window.validShareData = validShareData;
window.removeShareUser = removeShareUser;
window.addShareUser = addShareUser;
window.WatcherNotifViewed = WatcherNotifViewed;

function selectStructureTab(elt, tabStr) {

  var structureContainer = $$1(elt).parents('.structure-container:first');

  if(!structureContainer)
    return false;

  var nav = null;
  var navId = null;

  $$1(structureContainer).find('.nav li a').each(function() {
    var href = $$1(this).attr('href');
    if(href.indexOf(tabStr) >= 0) {
      nav = $$1(this).parents('li');
      navId = href.replace('#', '');
    }
  });

  if(nav === null)
    return false;

  $$1(nav).parents('.nav:first').find('li').not(nav).removeClass('active');
  $$1(nav).addClass('active');

  var tabPane = $$1(structureContainer).find('#' + navId + '.tab-pane');
  if(tabPane) {
    var tabContent = $$1(tabPane).parents('.tab-content:first');
    $$1(tabContent).find('.tab-pane').not(tabPane).removeClass('active');
    $$1(tabPane).addClass('active');
  }

  if($$1('#slider:visible').length > 0) {
    resizeSliderNews();
  }

  return true;
}

window.selectStructureTab = selectStructureTab;

function refreshBooks(iddataType) {

  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  execQuery("get-books-table", {
      iddataType
    }, false)
    .then((json) => {
      tooltip($$1("#data-type-books .panel-body").html(base64Decode(json.content)));
    });
}

function __addDataBookTest(iddataType) {

  if(typeof(iddataType) === "undefined")
    iddataType = $$1("#iddata-type").val();

  iddataType = Number(iddataType);

  if(!isNumber(iddataType))
    return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  if(!confirm("FONCTIONNALITE DEVELOPPEUR : En cliquant sur ce bouton, vous allez créer un catalogue de test intégrant tous les champs existants du Data Type"))
    return false;

  execQuery('__add-data-book-test__', {
      iddataType
    })
    .then((json) => {
      refreshBooks(iddataType);
      displaySuccess$1(json.msg);
    });
}

function closeBookColumnModal() {
  $$1('#book-column-modal').modal('hide');
}

// import 'bootstrap-stylus/js/modal';

function closeBookModal() {
  $$1("#book-modal").modal("hide");
}

function implodeStyle(styles) {

  var str = '';

  for(var property in styles)
    str += property + ':' + styles[property] + ';';

  return str;
}

function pushStyle(styles, value, property, suffix, properties) {

  if(value != '') {

    styles[property] = value + ((typeof(suffix) != 'undefined') ? suffix : '');

    if(typeof(properties) != 'undefined')
      for(var property2 in properties)
        styles[property2] = properties[property2];

  }
}


function getThumbStyle() {

  var styles = {};

  pushStyle(styles, $$1('#thumb-width').val(), 'width', 'px');
  //	pushStyle(styles, $('#thumb-margin').val(), 'margin', 'px');
  pushStyle(styles, $$1('#thumb-border-size').val(), 'border-width', 'px', {
    'border-style': 'solid'
  });
  pushStyle(styles, $$1('#thumb-border-color').val(), 'border-color', '', {
    'border-style': 'solid'
  });

  return implodeStyle(styles) + ';' + $$1('#thumb-style').val();
}


function getThumbBodyStyle() {

  var styles = {};

  pushStyle(styles, $$1('#thumb-body-height').val(), 'height', 'px');
  pushStyle(styles, $$1('#thumb-body-background-color').val(), 'background-color');
  pushStyle(styles, $$1('#thumb-body-color').val(), 'color');

  return implodeStyle(styles) + ';' + $$1('#thumb-body-style').val();
}

function getThumbFooterStyle() {

  var styles = {};

  pushStyle(styles, $$1('#thumb-footer-height').val(), 'height', 'px');
  pushStyle(styles, $$1('#thumb-footer-background-color').val(), 'background-color');
  pushStyle(styles, $$1('#thumb-footer-color').val(), 'color');
  pushStyle(styles, $$1('#thumb-footer-font-size').val(), 'font-size', 'px');
  pushStyle(styles, $$1('#thumb-footer-align').val(), 'text-align');

  return implodeStyle(styles) + ';' + $$1('#thumb-footer-style').val();
}

function getThumbHeaderStyle() {

  var styles = {};

  pushStyle(styles, $$1('#thumb-header-height').val(), 'height', 'px');
  pushStyle(styles, $$1('#thumb-header-background-color').val(), 'background-color');
  pushStyle(styles, $$1('#thumb-header-color').val(), 'color');
  pushStyle(styles, $$1('#thumb-header-font-size').val(), 'font-size', 'px');
  pushStyle(styles, $$1('#thumb-header-align').val(), 'text-align');

  return implodeStyle(styles) + ';' + $$1('#thumb-header-style').val();
}

function updateBookThumb() {

  var thumbStyle = getThumbStyle();
  var thumbHeaderStyle = getThumbHeaderStyle();
  var thumbBodyStyle = getThumbBodyStyle();
  var thumbFooterStyle = getThumbFooterStyle();

  $$1('#thumb-preview').attr('style', thumbStyle);
  $$1('#thumb-preview .thumb-header').attr('style', thumbHeaderStyle);
  $$1('#thumb-preview .thumb-body').attr('style', thumbBodyStyle);
  $$1('#thumb-preview .thumb-footer').attr('style', thumbFooterStyle);

  var thumbContentDefaultPicture = $$1('#thumb-body-default-picture').val();
  var thumbContentDefaultGlyphicon = $$1('#thumb-body-default-glyphicon').val();

  if((thumbContentDefaultPicture.length <= 0) && (thumbContentDefaultGlyphicon.length <= 0)) {

    $$1('#thumb-preview .thumb-body-wrapper-content').html('');

  } else if(thumbContentDefaultPicture.length > 0) {
    var picture = rootUploadURL(thumbContentDefaultPicture);
    $$1('#thumb-preview .thumb-body-wrapper-content').html('<img src="' + picture + '" />');

  } else if(thumbContentDefaultGlyphicon.length > 0) {
    $$1('#thumb-preview .thumb-body-wrapper-content').html('<i class="thumb-glyphicon ' + thumbContentDefaultGlyphicon + '"></i>');
  }
}

function updateBookWidth() {

  var widthTotal = 0;
  $$1("#data-type-book-columns table tr td.book-column-width").each(function() {

    var width = $$1(this).html();
    if(width.indexOf("%") >= 0)
      widthTotal += parseFloat(width.replace("%", ""));
  });

  $$1(".table-book-width").html(widthTotal.toString());
}

// import 'public-source/js/core/jquery-bundles/tooltip-popover';
// import 'jquery-colpick';

function initBookThumbEvents() {

  $$1('#book-thumb .form-control').unbind('change').bind('change', function() {
    updateBookThumb();
  });

  $$1('#book-thumb .color-picker').colpick({
    onBeforeShow: function() {
      $$1(this).colpickSetColor(this.value);
    },
    onSubmit: function(hsb, hex, rgb, el) {
      $$1(el).val("#" + hex);
      $$1(el).parents('.input-group:first').find('.color-preview').css('background-color', '#' + hex);
      $$1(el).colpickHide();
      updateBookThumb();
    },
    onChange: function(hsb, hex, rgb, el) {
      $$1(el).val("#" + hex);
      $$1(el).parents('.input-group:first').find('.color-preview').css('background-color', '#' + hex);
      updateBookThumb();
    }
  });
}

function initBookThumb() {

  initBookThumbEvents();

  $$1('[data-toggle="popover"]').popover();

  $$1('#book-thumb span[data-toggle=popover]').on("show.bs.popover", function(e) {
    $$1(this).data()["bs.popover"].$tip.css("width", "500px");
  });

  updateBookThumb();
}

function finalizeLoadBook() {
  formRequester();
  navTabs();
  updateBookWidth();
  initBookThumb();

  $$1('#header-background-color').colpick({
    onBeforeShow: function() {
      $$1(this).colpickSetColor(this.value);
    },
    onSubmit: function(hsb, hex, rgb, el) {
      $$1(el).val("#" + hex);
      $$1(el).colpickHide();
    },
    onChange: function(hsb, hex, rgb) {
      $$1('#preview-header-colors').css('background-color', '#' + hex);
      $$1('#header-background-color').val("#" + hex);
    }
  });

  $$1('#header-text-color').colpick({
    onBeforeShow: function() {
      $$1(this).colpickSetColor(this.value);
    },
    onSubmit: function(hsb, hex, rgb, el) {
      $$1(el).val("#" + hex);
      $$1(el).colpickHide();
    },
    onChange: function(hsb, hex, rgb) {
      $$1('#preview-header-colors').css('color', '#' + hex);
      $$1('#header-text-color').val("#" + hex);
    }
  });
}

// import 'bootstrap-stylus/js/modal';

function initBookModal() {

  if($$1(document).find("#book-modal").length > 0) return;

  $$1(document).find("body").append('\
		<div class="modal" id="book-modal" tabindex="-1" role="dialog">\
			<div class="modal-dialog" style="width:960px;">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>\
						<h2 class="modal-title">Catalogue</h2>\
					</div>\
					<div class="modal-body"></div>\
				</div>\
			</div>\
		</div>\
	');

  $$1('#book-modal').on('hidden.bs.modal', function() {
    removeTinyMCE($$1("#book-modal"));
  });
}


function clearBookModal() {
  $$1("#book-modal .modal-body").html("<br ><center>Chargement ...</center>");
}

function openBookModal() {
  initBookModal();
  clearBookModal();
  $$1("#book-modal").modal("show");
}

function createBook(iddataType) {
  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  execQuery("get-book-create-form", {
      'iddataType': iddataType
    })
    .then((json) => {
      openBookModal();
      $$1("#book-modal .modal-body").html(base64Decode(json.content));
      setTimeout(function() {
        finalizeLoadBook();
      }, 100);
    });
}

function finalizeLoadBookColumn() {
  formRequester();
  navTabs();
}

// import 'bootstrap-stylus/js/modal';

function initBookColumnModal() {
  if($$1(document).find('#book-column-modal').length > 0) { return; }

  $$1(document).find('body').append(`
		<div class="modal" id="book-column-modal" tabindex="-1" role="dialog">
			<div class="modal-dialog" style="width:960px;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>
						<h2 class="modal-title">Colonne</h2>
					</div>
					<div class="modal-body"></div>
				</div>
			</div>
		</div>
	`);
}


function clearBookColumnModal() {
  $$1('#book-column-modal .modal-body').html('<br ><center>Chargement ...</center>');
}

function openBookColumnModal() {
  initBookColumnModal();
  clearBookColumnModal();
  $$1('#book-column-modal').modal('show');
}

function createBookColumn(iddataType, idbook) {
  if(!iddataType) { iddataType = $$1('#iddata-type').val(); }
  if(!idbook) { idbook = $$1('#iddata-book').val(); }

  iddataType = Number(iddataType);

  if(!isNumber(iddataType)) {
    return alert('Veuillez enregistrer votre type de données avant d\'effectuer cette action');
  }

  if(!idbook) {
    return alert('Veuillez enregistrer votre catalogue avant d\'effectuer cette action');
  }

  execQuery('get-book-column-create-form', {
    iddataType,
    idbook
  })
    .then((json) => {
      openBookColumnModal();
      $$1('#book-column-modal .modal-body').html(base64Decode(json.content));
      setTimeout(finalizeLoadBookColumn, 0);
    });

}

function deleteBookColumn(iddataType, idbook, idcolumn) {

  if(!iddataType) {
    iddataType = $$1("#iddata-type").val();
  }

  if(!idbook) {
    idbook = $$1("#iddata-book").val();
  }

  iddataType = Number(iddataType);

  if(!isNumber(iddataType)) {
    return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");
  }

  if(!idbook) {
    return alert("Veuillez enregistrer votre catalogue avant d'effectuer cette action");
  }

  // FIXME: Remove the use of 'execQuerySync'!!

  var response = execQuerySync("delete-book-column", {
    'iddataType': iddataType,
    'idbook': idbook,
    'idcolumn': idcolumn
  });

  var json = stringToJSON(response);

  if(!json) {
    return false;
  }
  if(isAjaxError(json)) {
    return false;
  }
  if(isAjaxSuccess(json)) {
    return true;
  }

  return false;
}


function deleteBookColumns(iddataType, idbook) {

  if(!iddataType) {
    iddataType = $$1("#iddata-type").val();
  }

  if(!idbook) {
    idbook = $$1("#iddata-book").val();
  }

  if(!isNumber(iddataType)) {
    return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");
  }

  if(!idbook) {
    return alert("Veuillez enregistrer votre catalogue avant d'effectuer cette action");
  }

  if($$1("#data-type-book-columns table input[type=checkbox]:checked").length <= 0) {
    return alert("Merci de cocher au moins un élément dans la liste");
  }

  if(!confirm("Attention, vous allez supprimer une ou plusieurs colonne\nSouhaitez-vous continuer ?")) {
    return false;
  }

  $$1("#data-type-book-columns table input[type=checkbox]:checked").each(function() {
    const id = $$1(this).val();
    if(id && deleteBookColumn(iddataType, idbook, id)) {
      $$1(`#row-book-column-${id}`).remove();
    }
  });

}

function deleteBook(iddataType, idbook) {

  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  // FIXME: Remove the use of 'execQuerySync'!!

  var response = execQuerySync("delete-book", {
    'iddataType': iddataType,
    'idbook': idbook
  });

  var json = stringToJSON(response);
  if(!json) return false;
  if(isAjaxError(json)) return false;
  if(isAjaxSuccess(json)) return true;

  return false;
}

function deleteBooks(iddataType) {

  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  if($$1("#data-type-books table input[type=checkbox]:checked").length <= 0) return alert("Merci de cocher au moins un élément dans la liste");

  if(!confirm("Attention, vous allez supprimer un ou plusieurs catalogues\nSouhaitez-vous continuer ?")) return false;

  $$1("#data-type-books table input[type=checkbox]:checked").each(function() {
    const id = $$1(this).val();
    if(id && deleteBook(iddataType, id)) {
      $$1(`#row-book-${id}`).remove();
    }
  });
}

function duplicateBook(iddataType, idbook) {

  if(typeof(iddataType) == "undefined") iddataType = $$1("#iddata-type").val();
  if(typeof(idbook) == "undefined") idbook = $$1("#idbook").val();

  if(!confirm("Attention, vous allez dupliquer le catalogue courant\r\nSouhaitez-vous continuer ?")) return false;

  execQuery("duplicate-book", {
      iddataType,
      idbook
    })
    .then((json) => {
      $$1("#form-data-type-book #uik").val("");
      if(json.idbook) $$1("#form-data-type-book #idbook").val(json.idbook);
      if(json.title) $$1("#form-data-type-book #title").val(json.title);
      if(json.url) $$1("#form-data-type-book #url").val(json.url);

      displaySuccess$1(json.msg);
      refreshBooks();
    });
}

function editBook(iddataType, idbook) {

  if(typeof(iddataType) === "undefined") {
    iddataType = $$1("#iddata-type").val();
  }
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) {
    return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");
  }

  execQuery("get-book-edit-form", {
      iddataType,
      idbook
    })
    .then((json) => {
      openBookModal();
      $$1("#book-modal .modal-body").html(base64Decode(json.content));
      setTimeout(function() {
        finalizeLoadBook();
      }, 100);
    });
}

function editBookColumn(iddataType, idbook, idcolumn) {

  if(!iddataType) {
    iddataType = $$1("#iddata-type").val();
  }

  if(!idbook) {
    idbook = $$1("#iddata-book").val();
  }

  iddataType = Number(iddataType);

  if(!isNumber(iddataType)) {
    return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");
  }
  if(!idbook) {
    return alert("Veuillez enregistrer votre catalogue avant d'effectuer cette action");
  }

  execQuery("get-book-column-edit-form", {
      iddataType,
      idbook,
      idcolumn
    })
    .then((json) => {
      openBookColumnModal();
      $$1("#book-column-modal .modal-body").html(base64Decode(json.content));
      setTimeout(function() {
        finalizeLoadBookColumn();
      }, 100);
    });
}

function finalizeSaveBook(json) {

  refreshBooks();

  if(!json) {
    return false;
  }
  if(json.idbook) {
    $$1("#book-modal").find("#idbook").val(json.idbook);
  }
  if(json.iddataBook) {
    $$1("#book-modal").find("#iddata-book").val(json.iddataBook);
  }
  if(json.url) {
    $$1("#book-modal").find("#url").val(json.url);
  }
}

function refreshBookColumns(iddataType, idbook, idcolumn) {
  if(!iddataType) { iddataType = $$1('#iddata-type').val(); }
  if(!idbook) { idbook = $$1('#iddata-book').val(); }
  if(!idcolumn) { idcolumn = ''; }

  iddataType = Number(iddataType);

  if(!isNumber(iddataType)) {
    return alert('Veuillez enregistrer votre type de données avant d\'effectuer cette action');
  }

  if(!idbook) {
    return alert('Veuillez enregistrer votre catalogue avant d\'effectuer cette action');
  }

  execQuery('get-book-columns-table', {
    iddataType,
    idbook,
    idcolumn
  })
    .then((json) => {
      $$1('#data-type-book-columns .panel-body').html(base64Decode(json.content));
      tooltip();
      updateBookWidth();
    })
    .catch((err) => console.log(err));
}

function finalizeSaveBookColumn(json) {
  refreshBookColumns();

  if(!json) { return false; }
  if(json.idcolumn) { $$1('#book-column-modal').find('#idcolumn').val(json.idcolumn); }
}

function removeThumbBodyDefaultPicture() {
  $$1('#thumb-body-default-picture').val('');
  $$1('#thumb-body-default-img').attr('src', '');
  updateBookThumb();
}

function selectThumbBodyDefaultPicture() {

  openFileManager({
    'selectionMode': 'single',
    'fnCallback': function(files) {

      if(!files) return false;
      var filename = files[0].filename;
      var filenameShort = files[0].filenameShort;

      $$1('#thumb-body-default-picture').val(filenameShort);
      $$1('#thumb-body-default-img').attr('src', filename);

      closeFileManagerModal();
      updateBookThumb();
    }
  });
}

function updateDataBookColumnTitle(select) {

  if($$1(select).parents('.form-group').find('#title').val().length <= 0) {
    var text = $$1(select).find('option:selected').text();
    var pos = text.lastIndexOf('(');
    if(pos >= 0) {
      text = text.substr(0, pos - 1); // -1 for the space before parenthese
    }

    $$1(select).parents('.form-group').find('#title').val(text);
  }
}

window.__addDataBookTest = __addDataBookTest;
window.closeBookColumnModal = closeBookColumnModal;
window.closeBookModal = closeBookModal;
window.createBook = createBook;
window.createBookColumn = createBookColumn;
window.deleteBookColumns = deleteBookColumns;
window.deleteBooks = deleteBooks;
window.duplicateBook = duplicateBook;
window.editBook = editBook;
window.editBookColumn = editBookColumn;
window.finalizeSaveBook = finalizeSaveBook;
window.finalizeSaveBookColumn = finalizeSaveBookColumn;
window.refreshBookColumns = refreshBookColumns;
window.refreshBooks = refreshBooks;
window.removeThumbBodyDefaultPicture = removeThumbBodyDefaultPicture;
window.selectThumbBodyDefaultPicture = selectThumbBodyDefaultPicture;
window.updateDataBookColumnTitle = updateDataBookColumnTitle;

function insertAtCaret(areaId, text) {
  var txtarea = document.getElementById(areaId);
  var scrollPos = txtarea.scrollTop;
  var strPos = 0;
  var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? "ff" : (document.selection ? "ie" : false));
  if(br == "ie") {
    txtarea.focus();
    var range = document.selection.createRange();
    range.moveStart('character', -txtarea.value.length);
    strPos = range.text.length;
  } else if(br == "ff") strPos = txtarea.selectionStart;

  var front = (txtarea.value).substring(0, strPos);
  var back = (txtarea.value).substring(strPos, txtarea.value.length);
  txtarea.value = front + text + back;
  strPos = strPos + text.length;
  if(br == "ie") {
    txtarea.focus();
    var range = document.selection.createRange();
    range.moveStart('character', -txtarea.value.length);
    range.moveStart('character', strPos);
    range.moveEnd('character', 0);
    range.select();
  } else if(br == "ff") {
    txtarea.selectionStart = strPos;
    txtarea.selectionEnd = strPos;
    txtarea.focus();
  }
  txtarea.scrollTop = scrollPos;
}

function insertCodeFieldIntoStructure(obj) {
  var uid = $$1(obj).find('.uid').html();
  insertAtCaret('structureCode', '{{' + uid + '}}');
}

function insertCodeDisplayIntoStructure(obj) {
  var uid = $$1(obj).find('.uid').html();
  insertAtCaret('structureCode', '{{__' + uid + '__}}');

  $$1(obj).addClass('selectedView');
}

window.insertCodeFieldIntoStructure = insertCodeFieldIntoStructure;
window.insertCodeDisplayIntoStructure = insertCodeDisplayIntoStructure;

// import 'bootstrap-stylus/js/modal';

function execExportData(type) {

  var iddata = $$1("#export-data-" + type + "-modal #id-data-" + type).val();

  $$1("#export-data-" + type + "-modal #btn-export-" + type).hide();
  $$1("#export-data-" + type + "-modal #btn-wait-" + type).show();
  $$1("#export-data-" + type + "-modal #btn-download-" + type).hide();

  setTimeout(function() {
    execQuery("export-data-" + type, {
        iddata
      }, false)
      .then((json) => {
        // FIXME: Possible double IDs
        if(json.href) {
          $$1("#export-data-" + type + "-modal #btn-export-" + type + "").hide();
          $$1("#export-data-" + type + "-modal #btn-wait-" + type + "").hide();
          $$1("#export-data-" + type + "-modal #btn-download-" + type + "").show();
          $$1("#export-data-" + type + "-modal #btn-download-" + type + "").attr("href", json.href);
          return;
        }

        $$1("#export-data-" + type + "-modal #btn-export-" + type).show();
        $$1("#export-data-" + type + "-modal #btn-wait-" + type).hide();
        $$1("#export-data-" + type + "-modal #btn-download-" + type).hide();
      });
  }, 500);
}

function closeExportDataModal(type) {
  $$1("#export-data-" + type + "-modal").modal("hide");
}

function initExportDataModal(type) {
  if($$1(document).find("#export-data-" + type + "-modal").length > 0) {
    $$1("#export-data-" + type + "-modal #btn-export-" + type + "").show();
    $$1("#export-data-" + type + "-modal #btn-wait-" + type + "").hide();
    $$1("#export-data-" + type + "-modal #btn-download-" + type + "").hide();
    return;
  }

  var nameoftype = type === 'word' ? 'Word' : 'Powerpoint';

  const $modal = $$1('\
		<div class="modal" id="export-data-' + type + '-modal" tabindex="-1" role="dialog" style="z-index:99999999;">\
			<input type="hidden" id="id-data-' + type + '" value="" />\
			<div class="modal-dialog" style="margin-top:100px;">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>\
						<h2 class="modal-title">Exportation</h2>\
					</div>\
					<div class="modal-body"><center>\
						<br />\
						<button id="btn-export-' + type + '" type="button" class="btn btn-primary btn-lg">Exporter vers<br />Microsoft ' + nameoftype + '</button>\
						<button style="display:none;" id="btn-wait-' + type + '" type="button" class="btn btn-default btn-lg">Exportation en cours<br />veuillez patienter ...</button>\
						<a style="display:none;" id="btn-download-' + type + '" class="btn btn-success btn-lg" href="" target="_blank">Cliquez ici<br />pour télécharger le fichier</a>\
						<br /><br />\
					</center></div>\
					<div class="modal-footer">\
						<button class="btn btn-default" type="button">Fermer</button>\
					</div>\
				</div>\
			</div>\
		</div>\
	')
    .appendTo('body');

  $modal.find(`#btn-export-${type}`).click(() => execExportData(type));
  $modal.find(`.modal-footer .btn`).click(() => closeExportDataModal(type));
}

function openExportDataModal(type) {
  initExportDataModal(type);
  $$1("#export-data-" + type + "-modal").modal("show");
}

function exportData(elt, type) {
  if(type != 'ppt' && type != 'word')
    return false;
  var id = $$1(elt).parents(".modal-window-container:first").find("#data-iddata").val();
  if(!isNumeric(id, 1))
    id = $$1(elt).parents("#page-content").find("#data-iddata").val(); //full page
  if(!isNumeric(id, 1)) alert("Merci d'enregistrer avant d'effectuer cette action");

  openExportDataModal(type);
  setTimeout(function() {
    $$1("#export-data-" + type + "-modal #id-data-" + type).val(id);
  }, 200);
}

// import 'bootstrap-stylus/js/modal';

function execExportData2Pdf() {
  var iddata = $$1("#export-data-pdf-modal #id-data-pdf").val();

  $$1("#export-data-pdf-modal #btn-export-pdf").hide();
  $$1("#export-data-pdf-modal #btn-wait-pdf").show();
  $$1("#export-data-pdf-modal #btn-download-pdf").hide();

  setTimeout(function() {
    execQuery("export-data-pdf", {
        iddata
      }, false)
      .then((json) => {
        // FIXME: Possible multiple IDs
        if(json.href) {
          $$1("#export-data-pdf-modal #btn-export-pdf").hide();
          $$1("#export-data-pdf-modal #btn-wait-pdf").hide();
          $$1("#export-data-pdf-modal #btn-download-pdf").show();
          $$1("#export-data-pdf-modal #btn-download-pdf").attr("href", json.href);
          return;
        }

        $$1("#export-data-pdf-modal #btn-export-pdf").show();
        $$1("#export-data-pdf-modal #btn-wait-pdf").hide();
        $$1("#export-data-pdf-modal #btn-download-pdf").hide();
      });
  }, 500);
}

function closeExportData2PdfModal() {
  $$1("#export-data-pdf-modal").modal("hide");
}

function initExportData2PdfModal() {
  if($$1(document).find("#export-data-pdf-modal").length > 0) {
    $$1("#export-data-pdf-modal #btn-export-pdf").show();
    $$1("#export-data-pdf-modal #btn-wait-pdf").hide();
    $$1("#export-data-pdf-modal #btn-download-pdf").hide();
    return;
  }

  const $modal = $$1('\
		<div class="modal" id="export-data-pdf-modal" tabindex="-1" role="dialog" style="z-index:99999999;">\
			<input type="hidden" id="id-data-pdf" value="" />\
			<div class="modal-dialog" style="margin-top:100px;">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>\
						<h2 class="modal-title">Exportation</h2>\
					</div>\
					<div class="modal-body"><center>\
						<br />\
						<button id="btn-export-pdf" type="button" class="btn btn-primary btn-lg">Exporter vers<br />Adobe Acrobat PDF</button>\
						<button style="display:none;" id="btn-wait-pdf" type="button" class="btn btn-default btn-lg">Exportation en cours<br />veuillez patienter ...</button>\
						<a style="display:none;" id="btn-download-pdf" class="btn btn-success btn-lg" href="" target="_blank">Cliquez ici<br />pour télécharger le fichier</a>\
						<br /><br />\
					</center></div>\
					<div class="modal-footer">\
						<button class="btn btn-default" type="button">Fermer</button>\
					</div>\
				</div>\
			</div>\
		</div>\
	');

  $modal.find('#btn-export-pdf').click(execExportData2Pdf);
  $modal.find(`.modal-footer .btn`).click(closeExportData2PdfModal);

  $$1(document).find("body").append();
}

function openExportData2PdfModal() {
  initExportData2PdfModal();
  $$1("#export-data-pdf-modal").modal("show");
}

function exportData2Pdf(elt) {
  var id = $$1(elt).parents(".modal-window-container:first").find("#data-iddata").val();
  if(!isNumeric(id, 1))
    id = $$1(elt).parents("#page-content").find("#data-iddata").val(); //full page
  if(!isNumeric(id, 1)) alert("Merci d'enregistrer avant d'effectuer cette action");

  openExportData2PdfModal();
  setTimeout(function() {
    $$1("#export-data-pdf-modal #id-data-pdf").val(id);
  }, 200);
}

function _formatFilters($thisModal, uid) {
  const objfilter = {
    uid
  };

  $thisModal.find('.filter-panel :input').each(function() {
    if(
      (($$1(this).prop('type') == 'checkbox' || $$1(this).prop('type') == 'radio') && $$1(this).prop('checked') == true) ||
      ($$1(this).prop('type') != 'checkbox' && $$1(this).prop('type') != 'radio' && $$1(this).prop('nodeName') == 'INPUT') ||
      $$1(this).prop('nodeName') == 'SELECT'
    )
      objfilter[$$1(this).prop('name')] = $$1(this).val();
  });

  return objfilter;
}

// import 'bootstrap-stylus/js/modal';

function chartExportXls(elt) {
  var $thisElt = $$1(elt).closest('.stat-graph-container');
  var uid = $thisElt.attr('data-uid');
  var $thisModal = $$1(document).find('#modal-window-' + uid);

  $thisElt.append('<div class="loading-chart" style="position: absolute;left:0;top:0;width:100%;background:#000;opacity:0.8;min-height: 100%;z-index: 5;"><div class="msg-loading"><p>Export en cours de création</p><div class="loading"></div></div></div>');
  setInterval(imageLoading, 40);

  if(!uid)
    uid = $$1('#chart-uid').val();

  if(!uid || uid.length == 0) {
    return displayError$1('Graphique invalide. Vous devez sauvegarder avant d\'exporter votre graphique.');
  }

  var objfilter = _formatFilters($thisModal, uid);

  if($thisElt.find('#overloaded_filters').length > 0) {
    objfilter['overloaded'] = $thisElt.find('#overloaded_filters').val();
  }

  execQuery("chart-export-xls", objfilter, false)
    .then((json) => {
      if(json.filename) {
        $$1('#exportExcelResult').remove();

        $$1("body").append(
          '<div class="modal modal-page" id="exportExcelResult" tabindex="-1" role="dialog">\
              <div class="modal-dialog" style="width:600px; margin-top:10%;">\
                <div class="modal-content">\
                  <div class="modal-header">\
                    <button class="modal-header-close" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i></button>\
                    <span class="modal-header-icon"><i class="glyphicons glyphicons-disk-save"></i></span>\
                    <h2 class="modal-title">Exportation terminée</h2>\
                  </div>\
                  ' + json.chartname + '\
                  <div class="modal-footer">\
                    <span style="margin:0 5px;" type="button" class="btn btn-success pull-left" id="openExcel">\
                    <a href="' + json.filename + '" target="_blank">Ouvrir le fichier</a>\
                    </span>\
                    <button style="margin:0 5px;" type="button" data-dismiss="modal" class="btn btn-default pull-right" id="close">Fermer</button>\
                    <div class="clearfix"></div>\
                  </div>\
                </div>\
              </div>\
            </div>'
        );

        var modalConfirm = $$1('#exportExcelResult').modal({
          show: true,
          backdrop: 'static',
          keyboard: false
        });

        $thisElt.find('.loading-chart').remove();
      }
    })
    .catch(() => $$1('.loading-circle').hide(200));
}

window.exportData = exportData;
window.exportData2Pdf = exportData2Pdf;
window.chartExportXls = chartExportXls;

// import 'bootstrap-stylus/js/modal';

function initFieldModal() {
  if($$1(document).find("#field-modal").length > 0) return;

  $$1(document).find("body").append('\
		<div class="modal" id="field-modal" tabindex="-1" role="dialog">\
			<div class="modal-dialog" style="width:960px;">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>\
						<h2 class="modal-title">Champ</h2>\
					</div>\
					<div class="modal-body">\
					</div>\
				</div>\
			</div>\
		</div>\
	');
}

function openFieldModal() {
  initFieldModal();
  $$1("#field-modal").modal("show");
}

// import 'public-source/js/core/jquery-bundles/tooltip-popover';

var _CRAWLING_MAPPING = {
  'crawling-urlTwitter': Array('link', 'textbox'),
  'crawling-urlYoutube': Array('link', 'textbox'),
  'crawling-urlLinkedin': Array('link', 'textbox'),
  'crawling-urlFacebook': Array('link', 'textbox'),
  'crawling-urlSocialNetwork': Array('link'),
  'crawling-email': Array('email'),
  'crawling-siren': Array('textbox'),
  'crawling-logo': Array('file'),
  'crawling-domain': Array('data-title', 'textbox'),
  'crawling-keywords': Array('keywords'),
  'crawling-description': Array('textarea')
};

var _CRAWLING_OPTIONS = {
  'crawling-urlTwitter': 'Lien Twitter',
  'crawling-urlYoutube': 'Lien Youtube',
  'crawling-urlLinkedin': 'Lien Linkedin',
  'crawling-urlFacebook': 'Lien Facebook',
  'crawling-urlSocialNetwork': 'Réseaux sociaux',
  'crawling-email': 'Mails de contact',
  'crawling-siren': 'Numéro de SIREN',
  'crawling-logo': 'Logo',
  'crawling-domain': 'Nom de domaine',
  'crawling-keywords': 'Mot-clés',
  'crawling-description': 'Description du site'
};

/**
 * Function buildOption
 * Build a selection option
 * @package crawling
 * @param  string id    - id of the option
 * @param  string value - text visible in option
 * @return node
 */
function buildOption(id, value) {
  return $$1('<option>').attr('id', encodeURI(id)).html(value);
}

/**
 * Function updateSelectCrawling
 * chose option in crawling select due to value selected in [node]
 * @package crawling
 * @param  node node - DOM Element
 * @return
 */
function updateSelectCrawling(node) {

  var id = $$1(node).find(':selected').val();
  $$1('#field-modal #class').find('option').remove();
  $$1('#field-modal #class').append(buildOption('crawling-none', ''));
  for(var key in _CRAWLING_MAPPING) {
    if(_CRAWLING_MAPPING[key].indexOf(id) >= 0)
      $$1('#field-modal #class').append(buildOption(key, _CRAWLING_OPTIONS[key]));
  }
}

function finalizeLoadField() {

  formRequester();
  navTabs();
  controlInitDatasSelector();

  $$1('[data-toggle="popover"]').popover();

  // field type on change
  $$1("#field-modal #type").unbind("change").bind("change", function() {

    updateSelectCrawling(this);

    var type = $$1(this).val();

    if(type == "") {

      $$1("#field-modal #tab-field-configuration").hide();
      $$1("#field-modal #config-container").html("");
      return;
    }

    execQuery("get-field-config", {
        "type": type,
        "iddataType": $$1("#iddata-type").val()
      })
      .then((json) => {
        if(json.content) {
          $$1("#field-modal #tab-field-configuration").show();
          $$1("#field-modal #config-container").html(base64Decode(json.content));
          navTabs();
        } else {
          $$1("#field-modal #tab-field-configuration").hide();
          $$1("#field-modal #config-container").html("");
        }
      })
      .catch(() => {
        $$1("#field-modal #tab-field-configuration").hide();
        $$1("#field-modal #config-container").html("");
      });
  });

  $$1("#field-modal #link-edit-type").unbind('change').bind('change', function() {

    switch($$1(this).val()) {

      case 'view':
      case 'form':
        $$1('#link-edit-type-view-form').show();
        $$1('#link-edit-type-file, #link-edit-type-url').hide();
        break;

      case 'file':
        $$1('#link-edit-type-file').show();
        $$1('#link-edit-type-view-form, #link-edit-type-url').hide();
        break;

      case 'url':
        $$1('#link-edit-type-url').show();
        $$1('#link-edit-type-view-form, #link-edit-type-file').hide();
        break;

      default:
        $$1('#link-edit-type-view-form, #link-edit-type-file, #link-edit-type-url').hide();
        break;
    }
  });

  $$1("#field-modal #link-consult-type").unbind('change').bind('change', function() {

    switch($$1(this).val()) {

      case 'view':
      case 'form':
        $$1('#link-consult-type-view-form').show();
        $$1('#link-consult-type-file, #link-consult-type-url').hide();
        break;

      case 'file':
        $$1('#link-consult-type-file').show();
        $$1('#link-consult-type-view-form, #link-consult-type-url').hide();
        break;

      case 'url':
        $$1('#link-consult-type-url').show();
        $$1('#link-consult-type-view-form, #link-consult-type-file').hide();
        break;

      default:
        $$1('#link-consult-type-view-form, #link-consult-type-file, #link-consult-type-url').hide();
        break;
    }
  });
}

function editField(iddataType, uid) {

  if(typeof(iddataType) === "undefined")
    iddataType = $$1("#iddata-type").val();

  iddataType = Number(iddataType);

  if(!isNumber(iddataType))
    return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  execQuery("get-field-edit-form", {
      iddataType,
      uid
    })
    .then((json) => {
      openFieldModal();
      $$1("#field-modal .modal-body").html(base64Decode(json.content));
      setTimeout(finalizeLoadField, 100);
    });
}

// import 'bootstrap-stylus/js/modal';

function closeFieldModal() {
  $$1("#field-modal").modal("hide");
}

function searchDataTypeField() {

  var searchValue = String($$1("#data-type-search-field").val()).toLowerCase();

  if(searchValue.length <= 0) {
    $$1("#panel-fields table tbody tr").show();
    return;
  }

  var flagMatch = false;

  $$1("#panel-fields table tbody tr").each(function() {

    var row = $$1(this);
    flagMatch = false;
    $$1(row).find("td").has(".searchable").each(function() {
      var content = String($$1(this).find(".searchable").html()).toLowerCase();
      if(content.indexOf(searchValue) >= 0) flagMatch = true;
    });

    flagMatch ? $$1(row).show() : $$1(row).hide();
  });
}

function refreshFields(iddataType) {
  if(typeof(iddataType) === "undefined")
    iddataType = $$1("#iddata-type").val();

  iddataType = Number(iddataType);

  if(!isNumber(iddataType))
    return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  execQuery("get-fields-table", {
      iddataType
    })
    .then((json) => {
      tooltip($$1("#data-type-fields .panel-body").html(base64Decode(json.content)));
      searchDataTypeField();
    });
}

function finalizeSaveField(json) {

  refreshFields();

  if(json) {

    if(json.iddataField)
      $$1("#field-modal").find("#iddata-field").val(json.iddataField);

    if(json.uik)
      $$1("#field-modal").find("#uik").val(json.uik);
  }
}

function removeLinkConsultData() {
  $$1('#link-consult-data').val('');
  $$1('#link-consult-data-title').val('');
}

function removeLinkEditData() {
  $$1('#link-edit-data').val('');
  $$1('#link-edit-data-title').val('');
}

// import 'bootstrap-stylus/js/modal';

const dataSelectorClass = Class({

  constructor: function(options) {

    var that = this;

    if(!options)
      options = {};

    that.fnCallback = options.fnCallback ? options.fnCallback : null;
    that.typesUik = options.typesUik ? options.typesUik : null; // array
    that.timerDatasSelectorInput = null;
    that.lastSearch = null;
  },

  render: function() {

    var that = this;

    that.initModal();
    that.showModal();
  },

  // <--- modal functions
  initModal: function() {

    var that = this;

    if($$1('#modal-datas-selector').length <= 0) {

      $$1(document).find("body").append('\
				<div class="modal" id="modal-datas-selector" tabindex="-1" role="dialog" style="z-index:1000000000">\
					<div style="width:50%" class="modal-dialog">\
						<div class="modal-content">\
							<div class="modal-header">\
								<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>\
								<h2 class="modal-title">Sélectionnez une données</h2>\
							</div>\
							<div class="modal-body">\
								<div class="panel panel-default">\
									<div class="panel-heading">\
										<div class="input-group">\
											<input type="text" class="form-control" id="modal-datas-selector-input" placeholder="Tapez vos mots clef de recherche" />\
											<span class="input-group-addon"><i class="glyphicon glyphicon-search"></i>\
										</div>\
									</div>\
									<div class="panel-body" style="min-height:300px; max-height:400px; overflow:auto;">\
									</div>\
									<div class="panel-footer">\
										<span class="pull-left"><button type="button" class="btn btn-default" id="modal-datas-selector-btn-cancel">Annuler</button></span>\
										<span class="pull-right"><button type="button" class="btn btn-primary" id="modal-datas-selector-btn-ok">Ok</button></span>\
										<div class="clearfix"></div>\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			');
    }

    that.initModalEvents();

  },
  initModalEvents: function() {

    var that = this;

    $$1('#modal-datas-selector-input').unbind('keyup').bind('keyup', function() {

      if(that.timerDatasSelectorInput != null) clearTimeout(that.timerDatasSelectorInput);
      that.timerDatasSelectorInput = setTimeout(function() {
        that.timerDatasSelectorInput = null;
        that.search();
      }, 600);
    });

    $$1('#modal-datas-selector-btn-cancel').unbind('click').bind('click', function() {
      that.hideModal();
    });

    $$1('#modal-datas-selector-btn-ok').unbind('click').bind('click', function() {

      var data = null;
      if($$1('#modal-datas-selector .modal-body .panel-body .table tr.success').length > 0) {

        var row = $$1('#modal-datas-selector .modal-body .panel-body .table tr.success:first');
        data = {
          'iddata': $$1(row).data('id'),
          'title': $$1(row).data('title')
        };
      }

      that.hideModal();

      if(that.fnCallback !== null)
        that.fnCallback(data);

    });

  },
  showModal: function() {

    var that = this;

    that.lastSearch = null;

    $$1('#modal-datas-selector .modal-body .panel-body').html('');
    $$1('#modal-datas-selector .modal-body .panel-heading #modal-datas-selector-input').val('');
    $$1("#modal-datas-selector").modal("show");
    $$1('#modal-datas-selector .modal-body .panel-heading #modal-datas-selector-input').focus();
  },
  hideModal: function() {

    var that = this;

    that.lastSearch = null;

    $$1('#modal-datas-selector .modal-body .panel-body').html('');
    $$1('#modal-datas-selector .modal-body .panel-heading #modal-datas-selector-input').val('');
    $$1("#modal-datas-selector").modal("hide");
  },
  // modal functions --->

  // <--- search functions
  search: function() {

    var that = this;

    var search = $$1('#modal-datas-selector #modal-datas-selector-input').val();

    if(that.lastSearch === search) return false;

    that.lastSearch = search;

    if(search.length <= 0)
      return $$1('#modal-datas-selector .modal-body .panel-body').html('<p class="text-center">Veuillez saisir vos mots clefs de recherche</p>');

    $$1('#modal-datas-selector .modal-body .panel-body').html('<p class="text-center">Recherche en cours ...</p>');

    execQuery('get-datas-selector-results', {

        'search': search,
        'typesUik': that.typesUik

      })
      .then((json) => {
        $$1('#modal-datas-selector .modal-body .panel-body').html(base64Decode(json.content));
        that.initResultsEvents();
      });
  },
  initResultsEvents: function() {

      $$1('#modal-datas-selector .modal-body .panel-body .table tbody tr').bind('click', function() {
        $$1('#modal-datas-selector .modal-body .panel-body .table tbody tr').not($$1(this)).removeClass('success');
        $$1(this).removeClass('selected').addClass('success');
      });
    }
    // search functions --->
});

function selectLinkConsultData() {

  var myDatasSelectorConsult = new dataSelectorClass({
    'fnCallback': function(data) {
      if(!data) {
        $$1('#link-consult-data').val('');
        $$1('#link-consult-data-title').val('');
      } else {
        $$1('#link-consult-data').val(data.iddata);
        $$1('#link-consult-data-title').val('#' + data.iddata + ' - ' + data.title);
      }
    }
  });
  myDatasSelectorConsult.render();
}

function selectLinkConsultFile() {
  openFileManager({
    'uid': 'public',
    'selectionMode': 'single',
    'fnCallback': function(files) {
      if(!files) return false;
      if(files.length > 0) {
        $$1('#link-consult-file').val(files[0].filenameShort);
      }

      closeFileManagerModal();
    }
  });
}

function selectLinkEditData() {
  var myDatasSelectorEdit = new dataSelectorClass({
    'fnCallback': function(data) {
      if(!data) {
        $$1('#link-edit-data').val('');
        $$1('#link-edit-data-title').val('');
      } else {
        $$1('#link-edit-data').val(data.iddata);
        $$1('#link-edit-data-title').val('#' + data.iddata + ' - ' + data.title);
      }
    }
  });

  myDatasSelectorEdit.render();
}

function selectLinkEditFile() {
  openFileManager({
    'uid': 'public',
    'selectionMode': 'single',
    'fnCallback': function(files) {

      if(!files) return false;
      if(files.length > 0) {
        $$1('#link-edit-file').val(files[0].filenameShort);
      }

      closeFileManagerModal();
    }
  });
}

window.editField = editField;
window.closeFieldModal = closeFieldModal;
window.finalizeSaveField = finalizeSaveField;
window.removeLinkConsultData = removeLinkConsultData;
window.removeLinkEditData = removeLinkEditData;
window.selectLinkConsultData = selectLinkConsultData;
window.selectLinkConsultFile = selectLinkConsultFile;
window.selectLinkEditData = selectLinkEditData;
window.selectLinkEditFile = selectLinkEditFile;
window.editField = editField;

let timerRefreshDatasDisplaysViews;

function refreshDatasDisplaysViews(iddataType, btn) {

  if(typeof(btn) !== 'undefined') {
    if($$1(btn).hasClass('btn-primary')) {
      $$1(btn).removeClass('btn-primary');
    } else {
      $$1(btn).addClass('btn-primary');
    }
  }

  if(typeof(timerRefreshDatasDisplaysViews) !== 'undefined') {
    clearTimeout(timerRefreshDatasDisplaysViews);
  }

  timerRefreshDatasDisplaysViews = setTimeout(function() {

    if(typeof(iddataType) === "undefined")
      iddataType = $$1("#iddata-type").val();

    iddataType = Number(iddataType);

    if(!isNumber(iddataType))
      return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

    var showParents = $$1('#show-data-display-view-parents').hasClass('btn-primary')
    var showChildren = $$1('#show-data-display-view-children').hasClass('btn-primary');

    execQuery("get-data-display-table-view", {
        iddataType,
        showParents,
        showChildren
      })
      .then((json) => $$1("#data-type-displays .panel-body").html(base64Decode(json.content)));

  }, 300);
}

function __addDataDisplayTest(iddataType) {

  if(typeof(iddataType) === "undefined")
    iddataType = $$1("#iddata-type").val();

  iddataType = Number(iddataType);

  if(!isNumber(iddataType))
    return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  if(!confirm("FONCTIONNALITE DEVELOPPEUR : En cliquant sur ce bouton, vous allez créer une vue intégrant tous les champs existants du Data Type"))
    return false;

  execQuery('__add-data-display-test__', {
      iddataType
    })
    .then((json) => {
      refreshDatasDisplaysViews(iddataType);
      displaySuccess$1(json.msg);
    });
}

// import 'bootstrap-stylus/js/modal';

function closeDataDisplayModal() {
  $$1("#data-display-modal").modal("hide");
}

function initDataDisplayModal() {
  if($$1(document).find("#data-display-modal").length > 0) return;

  $$1(document).find("body").append('\
        <div class="modal" id="data-display-modal" tabindex="-1" role="dialog">\
            <div class="modal-dialog" style="width:98%; height:98%">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>\
                        <h2 class="modal-title">Vue</h2>\
                    </div>\
                    <div class="modal-body">\
                    </div>\
                </div>\
            </div>\
        </div>\
    ');
}

function openDataDisplayModal(title) {
  if(typeof(title) == "undefined") title = "Vue";

  initDataDisplayModal();

  $$1("#data-display-modal .modal-header h2:first").html(title);
  $$1("#data-display-modal").modal("show");
}

function finalizeLoadDataDisplay() {
  formRequester();
  navTabs();
  tableSelector();
  tooltip();
}

// import 'bootstrap-stylus/js/modal';

function createDataDisplayView(iddataType) {

  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  execQuery("get-data-display-create-view", {
      iddataType
    })
    .then((json) => {
      openDataDisplayModal("Fiche");
      $$1("#data-display-modal .modal-body").html(base64Decode(json.content));
      setTimeout(function() {
        finalizeLoadDataDisplay();
      }, 100);
    });
}

function deleteDataDisplayView(iddataDisplay) {
  var response = execQuerySync("delete-data-display-view", {
    'iddataDisplay': iddataDisplay
  });
  var json = stringToJSON(response);
  if(!json) return false;
  if(isAjaxError(json)) return false;
  if(isAjaxSuccess(json)) return true;

  return false;
}

function deleteDatasDisplaysViews() {
  if($$1("#table-data-display-view input[type=checkbox]:checked").length <= 0) return alert("Merci de cocher au moins un élément dans la liste");

  if(!confirm("Attention, vous allez supprimer une ou plusieurs fiches\nSouhaitez-vous continuer ?")) return false;

  $$1("#table-data-display-view input[type=checkbox]:checked").each(function() {
    const id = $$1(this).val();
    if(id && deleteDataDisplayView(id)) {
      $$1(`#row-data-display-view-${id}`).remove();
    }
  });
}

function refreshDatasDisplaysForms(iddataType) {
  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  execQuery("get-data-display-table-form", {
      iddataType
    })
    .then((json) => $$1("#data-type-forms .panel-body").html(base64Decode(json.content)));
}

function finalizeSaveDataDisplay(json) {
  refreshDatasDisplaysForms();
  refreshDatasDisplaysViews();

  if(!json) {
    return false;
  }

  if(json.id) {
    $$1("#iddata-display").val(json.id);
  }

  if(json.availableFields) {
    $$1('#data-display-structure-fields').html(base64Decode(json.availableFields));

    if(json.structure) {
      $$1('#structureCode').val(base64Decode(json.structure));
    }
  }
}

function editDataDisplayView(iddataDisplay) {

  displayInfo('Chargement en cours ...');

  execQuery("get-data-display-edit-view", {

      "iddataDisplay": iddataDisplay

    })
    .then((json) => {

      openDataDisplayModal("Fiche");

      $$1("#data-display-modal .modal-body").html(base64Decode(json.content));

      setTimeout(function() {

        finalizeLoadDataDisplay();
      }, 100);
    });
}

window.__addDataDisplayTest = __addDataDisplayTest;
window.closeDataDisplayModal = closeDataDisplayModal;
window.createDataDisplayView = createDataDisplayView;
window.deleteDatasDisplaysViews = deleteDatasDisplaysViews;
window.finalizeSaveDataDisplay = finalizeSaveDataDisplay;
window.editDataDisplayView = editDataDisplayView;
window.refreshDatasDisplaysViews = refreshDatasDisplaysViews;

function createField(iddataType) {
  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  execQuery("get-field-create-form", {
      iddataType
    })
    .then((json) => {
      openFieldModal();
      $$1("#field-modal .modal-body").html(base64Decode(json.content));
      setTimeout(finalizeLoadField, 100);
    });
}

function deleteField(iddataType, uid) {
  var response = execQuerySync("delete-field", {

    'iddataType': iddataType,
    'uid': uid
  });

  var json = toJSON(response);

  if(!json)
    return false;

  if(isAjaxError(json))
    return false;

  return true;
}

function deleteFields(iddataType) {
  if(typeof(iddataType) === "undefined")
    iddataType = $$1("#iddata-type").val();

  iddataType = Number(iddataType);

  if(!isNumber(iddataType))
    return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  if($$1("#data-type-fields table input[type=checkbox]:checked").length <= 0)
    return alert("Merci de cocher au moins un élément dans la liste");

  if(!confirm("Attention, vous allez supprimer un ou plusieurs champs\nSouhaitez-vous continuer ?"))
    return false;

  $$1("#data-type-fields table input[type=checkbox]:checked").each(function() {
    const uid = $$1(this).val();
    if(uid && deleteField(iddataType, uid)) {
      $$1(`#row-field-${uid}`).remove();
    }
  });
}

let _dataTypeProfils = null;

function dataTypeProfiles(newProfiles) {
  if(newProfiles) {
    _dataTypeProfils = newProfiles;
  }
  return _dataTypeProfils;
}

function truncate(str, maxlength, end = '...') {
  if(!isString(str) || !isNumber(maxlength)) { return str; }

  const len = str.length;
  if(len <= maxlength) { return str; }

  return `${str.substr(0, maxlength)}${end}`;
}

function dataTypeProfilFormClean() {
  $$1("#form-data-type-profil #data-type-profil-uid").val("");
  $$1("#form-data-type-profil #data-type-profil-uik").val("");
  $$1("#form-data-type-profil #data-type-profil-title").val("");
  $$1("#form-data-type-profil #data-type-profil-description").val("");
  $$1("#form-data-type-profil #data-type-profil-level").val(0);
  $$1("#form-data-type-profil #data-type-profil-notification").prop("checked", false);
  $$1("#form-data-type-profil #data-type-profil-email-subject").val("");
  $$1("#form-data-type-profil #data-type-profil-email-body").val("");

  $$1("#form-data-type-profil #tab-data-type-profil li").removeClass("active");
  $$1("#form-data-type-profil #tab-data-type-profil li:first").addClass("active");
  $$1("#form-data-type-profil .tab-content .tab-pane").removeClass("active");
  $$1("#form-data-type-profil .tab-content .tab-pane:first").addClass("active");
}

// import 'bootstrap-stylus/js/modal';

function dataTypeProfilFormOpen() {
  $$1("#data-type-profil-modal").modal("show");
}

function dataTypeProfilEdit(uid) {
  const profiles = dataTypeProfiles();

  if(!profiles) return false;

  dataTypeProfilFormClean();

  for(var i = 0; i <= profiles.length - 1; i++) {
    if(profiles[i].uid == uid) {
      $$1("#form-data-type-profil #data-type-profil-uid").val(profiles[i].uid);
      $$1("#form-data-type-profil #data-type-profil-uik").val(profiles[i].uik);
      $$1("#form-data-type-profil #data-type-profil-title").val(profiles[i].title);
      $$1("#form-data-type-profil #data-type-profil-description").val(profiles[i].description);
      $$1("#form-data-type-profil #data-type-profil-level").val(profiles[i].level);
      $$1("#form-data-type-profil #data-type-profil-notification").prop("checked", profiles[i].notification);
      $$1("#form-data-type-profil #data-type-profil-email-subject").val(profiles[i].emailSubject);
      $$1("#form-data-type-profil #data-type-profil-email-body").val(profiles[i].emailBody);
    }
  }

  dataTypeProfilFormOpen();
}

function dataTypeProfilLevelToString(level) {
  switch(level) {
    case "1":
      return "Lecteur";
    case "2":
      return "Editeur";
    case "3":
      return "Administrateur";
  }
}

function dataTypeProfilRefresh() {
  const profiles = dataTypeProfiles();

  $$1("#data-type-profils tbody tr").remove();

  if(!profiles) return false;

  for(var i = 0; i <= profiles.length - 1; i++) {

    var $tr = $$1("<tr />");
    $tr.append("<td><input class='ck-data-type-profil' type='checkbox' value='" + profiles[i].uid + "' /></td>");

    $$1("<td><span class='link-nu'>" + profiles[i].title + "</span></td>")
      .click(() => dataTypeProfilEdit(profiles[i].uid))
      .appendTo($tr);

    $tr.append("<td>" + dataTypeProfilLevelToString(profiles[i].level) + "</td>");
    $tr.append("<td>" + (profiles[i].notification == true ? "<i class='glyphicon glyphicon-envelope tooltiped' data-title='Une notification automatique est configurée'></i>" : "") + "</td>");
    $tr.append("<td>" + (profiles[i].emailSubject != "" ? "<span class='tooltiped' data-title=\"" + profiles[i].emailSubject + "\">" + truncate(profiles[i].emailSubject, 30) + "</span>" : "") + "</td>");

    $$1("#data-type-profils tbody").append($tr);
  }
}

function dataTypeProfilLoad(iddataType) {
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return false;

  execQuery("get-data-type-profils", {
      iddataType
    })
    .then((json) => {
      dataTypeProfiles(stringToJSON(base64Decode(json.profils)));
      dataTypeProfilRefresh();
    });
}

function __addAllDatasFields(iddataType) {

  if(typeof(iddataType) === "undefined")
    iddataType = $$1("#iddata-type").val();

  iddataType = Number(iddataType);

  if(!isNumber(iddataType))
    return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  if(!confirm("FONCTIONNALITE DEVELOPPEUR : En cliquant sur ce bouton, vous allez créer, pour ce Data Type, tous les types de champs existants.\nSouhaitez-vous continuer ?"))
    return false;

  execQuery('__add-all-datas-fields__', {
      iddataType
    })
    .then(() => refreshFields(iddataType));
}

function changeDataTypeIcon(mode) {

  openFileManager({
    'selectionMode': 'single',
    'fnCallback': function(files) {

      if(!files) return false;
      var filename = files[0].filename;
      var filenameShort = files[0].filenameShort;

      $$1("img.icon-" + mode + "-img").show();
      $$1("img.icon-" + mode + "-img").attr("src", filename + "?rnd=" + Math.random());
      $$1("input[type=hidden][name=icon-" + mode + "]").val(filenameShort);

      closeFileManagerModal();
    }
  });
}

function duplicateDataType() {

  var iddataType = $$1("#iddata-type").val();
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  if(!confirm("Attention, vous allez dupliquer le type de données.\r\nSouhaitez-vous continuer ?")) return;

  execQuery("duplicate-data-type", {
      iddataType
    })
    .then((json) => {
      if(json.redirectUrl) {
        document.location.href = json.redirectUrl;
      }
    });
}

function refreshDatasStatus(iddataType) {

  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  execQuery("get-data-status-table", {
      iddataType
    })
    .then((json) => {
      tooltip($$1("#data-type-status .panel-body").html(base64Decode(json.content)));
    });
}

function finalizeSaveDataType(json) {

  if(!json)
    return false;

  if(json.id) {

    $$1("#form-data-type input[name=iddata-type]").val(json.id);

    $$1("#default-icon-selector").fadeIn("fast");

    dataTypeProfilLoad(json.id);
    refreshDatasStatus(json.id);
  }

  if(json.uik)
    $$1("#uik").val(json.uik);

  if(json.url)
    $$1("#url").val(json.url);

  if(json.title)
    $$1("#data-type-title-span").html(json.title);
}

function removeDataTypeIcon(mode) {
  $$1("img.icon-" + mode + "-img").attr("src", "");
  $$1("img.icon-" + mode + "-img").hide();
  $$1("input[type=hidden][name=icon-" + mode + "]").val("");
}

// import 'jquery-colpick';

window.refreshFields = refreshFields;
window.createField = createField;
window.deleteFields = deleteFields;

window.__addAllDatasFields = __addAllDatasFields;
window.changeDataTypeIcon = changeDataTypeIcon;
window.duplicateDataType = duplicateDataType;
window.finalizeSaveDataType = finalizeSaveDataType;
window.removeDataTypeIcon = removeDataTypeIcon;

// import 'bootstrap-stylus/js/modal';

function initLabelModal() {

  if($$1(document).find("#label-modal").length > 0) return;

  $$1(document).find("body").append('\
		<div class="modal" id="label-modal" tabindex="-1" role="dialog">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>\
						<h2 class="modal-title">Libellé</h2>\
					</div>\
					<div class="modal-body"></div>\
				</div>\
			</div>\
		</div>\
	');
}

function openLabelModal() {
  initLabelModal();
  $$1("#label-modal").modal("show");
}

function finalizeLoadLabel() {
  formRequester();
}

function createLabel(iddataType) {
  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  execQuery("get-label-create-form", {
      iddataType
    })
    .then((json) => {
      openLabelModal();
      $$1("#label-modal .modal-body").html(base64Decode(json.content));
      setTimeout(finalizeLoadLabel, 100);
    });
}

// import 'bootstrap-stylus/js/modal';

function closeLabelModal() {
  $$1("#label-modal").modal("hide");
}

function deleteLabel(iddataType, id) {

  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();


  // FIXME: Remove usage of 'execQuerySync'!!
  var response = execQuerySync("delete-label", {
    'iddataType': iddataType,
    'id': id
  });

  var json = stringToJSON(response);
  if(!json) return false;
  if(isAjaxError(json)) return false;
  if(isAjaxSuccess(json)) return true;

  return false;
}

function deleteLabels(iddataType) {

  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();

  if($$1("#data-type-labels table input[type=checkbox]:checked").length <= 0) return alert("Merci de cocher au moins un élément dans la liste");

  if(!confirm("Attention, vous allez supprimer un ou plusieurs libellés\nSouhaitez-vous continuer ?")) return false;

  $$1("#data-type-labels table input[type=checkbox]:checked").each(function() {
    const id = $$1(this).val();
    if(id && deleteLabel(iddataType, id)) {
      $$1("#row-label-" + id).remove();
    }
  });
}

function editLabel(iddataType, id) {

  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();

  execQuery("get-label-edit-form", {
      iddataType,
      id
    })
    .then((json) => {
      openLabelModal();
      $$1('#label-modal .modal-body').html(base64Decode(json.content));
      setTimeout(finalizeLoadLabel, 100);
    });
}

function refreshLabels(iddataType) {

  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  execQuery("get-labels-table", {
      iddataType
    })
    .then((json) => {
      const $panel = $$1("#data-type-labels .panel-body").html(base64Decode(json.content));
      tooltip($panel);
    });
}

function finalizeSaveLabel(json) {

  refreshLabels();

  if(!json) return false;
  if(json.id) $$1("#id").val(json.id);
  if(json.uid) $$1("#uid").val(json.uid);
}

window.createLabel = createLabel;
window.closeLabelModal = closeLabelModal;
window.deleteLabels = deleteLabels;
window.editLabel = editLabel;
window.finalizeSaveLabel = finalizeSaveLabel;

function deleteDatasAndDataTypeQuery(ids) {
  tablerSetLoading($$1("#tabler-datas-types"), true);

  execQuery("delete-datas-and-datas-types", {
      ids
    }, false)
    .then((json) => {
      tablerSetLoading($$1("#tabler-datas-types"), false);

      json.idsDeleted.forEach((id) => {
        $$1(`#tabler-datas-types .tabler-body .tabler-row.tabler-row-${id}`).remove();
      });

      const $total = $$1('#nbTotalRecord');
      $total.html(Math.max(Number($total.html()) - json.idsDeleted.length, 0));

      return displaySuccess$1(json.msg);
    });

}

/**
 * Function deleteDatasTypesQuery
 * 		call for delete datas and dataType
 * @param  array ids - ids to delete
 * @return
 */
function deleteDatasTypesQuery(ids) {

  tablerSetLoading($$1("#tabler-datas-types"), true);

  execQuery("delete-datas-types", {
      ids
    }, false)
    .then((json) => {
      tablerSetLoading($$1("#tabler-datas-types"), false);

      if(json['errors'].length > 0) {
        const msg = `Attention, les dataTypes que vous voulez supprimer possèdent des données ratachés.
Souhaitez-vous les supprimer aussi ?`;
        if(confirm(msg)) {
          return deleteDatasAndDataTypeQuery(ids);
        }
      }

      json.idsDeleted.forEach((id) => {
        $$1(`#tabler-datas-types .tabler-body .tabler-row.tabler-row-${id}`).remove();
      });

      return displaySuccess$1(json.msg);
    });
}


function deleteDatasTypes() {

  if($$1("#tabler-datas-types .tabler-body .tabler-row .tabler-cell-selector input[type=checkbox]:checked").length <= 0)
    return alert("Merci de cocher au moins un utilisateur dans la liste");

  if(!confirm("Attention, vous allez supprimer un ou plusieurs type de données.\r\nSouhaitez-vous continuer ?"))
    return;

  var ids = new Array();
  $$1("#tabler-datas-types .tabler-body .tabler-row .tabler-cell-selector input[type=checkbox]:checked").each(function() {
    ids.push($$1(this).val());
  });

  deleteDatasTypesQuery(ids);
}

/**
 * Function getDatasTypesBinIds
 * 	find ids checked for action
 * @return {[type]} [description]
 */
function getDatasTypesBinIds() {
  var ids = new Array();
  $$1("#tabler-datas-types-bin .tabler-body .tabler-row .tabler-cell-selector input[type=checkbox]:checked").each(function() {
    ids.push($$1(this).val());
  });
  return ids;
}

function hardDeleteDatasTypes() {
  var ids = getDatasTypesBinIds();

  execQuery("restore-datas-types", {
      ids
    }, false)
    .then((json) => {
      // TODO remove node restored
      // for(var i=0; i<=json.idsDeleted.length-1; i++)
      // 		$("#tabler-datas-types .tabler-body .tabler-row.tabler-row-"+json.idsDeleted[i]).remove();
      // display result of the request
      displaySuccess$1(json.msg);
    });

  // pdel-datas-types
}

/*****************************************
 * Function restoreDataTypes
 * 		retore datas and datasTypes checked
 * @return {[type]} [description]
 *****************************************/
function restoreDataTypes() {
  var ids = getDatasTypesBinIds();

  execQuery("restore-datas-types", {
      ids
    }, false)
    .then((json) => {
      // TODO remove node restored
      // for(var i=0; i<=json.idsDeleted.length-1; i++)
      // 		$("#tabler-datas-types .tabler-body .tabler-row.tabler-row-"+json.idsDeleted[i]).remove();
      // display result of the request
      displaySuccess$1(json.msg);
    });
}

window.deleteDatasTypes = deleteDatasTypes;
window.hardDeleteDatasTypes = hardDeleteDatasTypes;
window.restoreDataTypes = restoreDataTypes;

function dataTypeProfilAdd() {
  dataTypeProfilFormClean();
  dataTypeProfilFormOpen();
}

function dataTypeProfilDelete(uid) {
  const profiles = dataTypeProfiles();

  if(!profiles) return false;

  var dataTypeProfilesTmp = new Array();

  for(var i = 0; i <= profiles.length - 1; i++)
    if(profiles[i].uid != uid)
      dataTypeProfilesTmp.push(profiles[i]);

  dataTypeProfiles(dataTypeProfilesTmp);

  return true;
}

function dataTypeProfilDeleteList() {

  if($$1("#data-type-profils tbody tr input[type=checkbox]:checked").lenght <= 0)
    return alert("Merci de sélectionner au moins un profil dans la liste");

  $$1("#data-type-profils tbody tr input[type=checkbox]:checked").each(function() {
    dataTypeProfilDelete($$1(this).val());
  });

  dataTypeProfilRefresh();
}

// import 'bootstrap-stylus/js/modal';

function dataTypeProfilFormClose() {
  $$1("#data-type-profil-modal").modal("hide");
}

// TODO: Maybe this can be done better/differently
// TODO: Replace with random id from vanillas-helpers
// TODO: Investigate if the ID has to be formed in a certain way
// TODO: This is a port of the PHP "kernel\classes\Sys.php#getToken" method,
// see if the "vanillajs-helpers" method can be replicated in PHP

// NOTE: Only used in 'data-type-profils.js' and 'dfr.js'


function rand(min,max) {
  return min + Math.round(Math.random()*(max-min));
}

function token(len = 50, prefix = '') {
	var now = new Date();
	var returnString = now.getFullYear()+leadingZero(now.getMonth())+leadingZero(now.getDate())+leadingZero(now.getHours())+leadingZero(now.getMinutes())+leadingZero(now.getSeconds());

	for (var i=0;i<len;i++) {

		var ord = 0;
		switch(rand(1,3)) {
			case 1: // 0 - 9
				ord = rand(48, 57);
			break;
			case 2: // A - Z
				ord = rand(65, 90);
			break;
			case 3: // a - z
				ord = rand(97, 112);
				break;
		}
		returnString+= String.fromCharCode(ord);
	}

	return returnString;
}

function setFormError($form, msg) {
  $form = $$1($form).addClass('has-error');

  const $errorContainer = $form.find('.error-container');
  const errMsg = '<span class="help-block error-msg"></span>';

  if($errorContainer.length) {
    $errorContainer.prepend(errMsg);
  } else {
    $form.append(errMsg);
  }

  $form.find('.error-msg').html(msg);

  return true;
}

function dataTypeProfilSave() {

  var uid = $$1("#form-data-type-profil #data-type-profil-uid").val();
  var uik = $$1("#form-data-type-profil #data-type-profil-uik").val();
  var title = $$1("#form-data-type-profil #data-type-profil-title").val();
  var description = $$1("#form-data-type-profil #data-type-profil-description").val();
  var level = $$1("#form-data-type-profil #data-type-profil-level").val();
  var notification = $$1("#form-data-type-profil #data-type-profil-notification").prop("checked");
  var emailSubject = $$1("#form-data-type-profil #data-type-profil-email-subject").val();
  var emailBody = $$1("#form-data-type-profil #data-type-profil-email-body").val();

  cleanForm("form-data-type-profil");

  var flagErrors = false;

  if(title.length <= 0) flagErrors = setFormError("#group-data-type-profil-title", "Champs obligatoire");

  if(notification == true) {
    if(emailSubject.length <= 0) flagErrors = setFormError("#group-data-type-profil-email-subject", "Champs obligatoire");
    if(emailBody.length <= 0) flagErrors = setFormError("#group-data-type-profil-email-body", "Champs obligatoire");
  }

  if(flagErrors == true) return false;

  let pofiles = dataTypeProfiles();

  if(!pofiles) {
    pofiles = dataTypeProfiles([]);
  }

  if(uid.length <= 0) {

    var newProfil = {};
    newProfil.uid = token();
    newProfil.uik = uik;
    newProfil.title = title;
    newProfil.description = description;
    newProfil.level = level;
    newProfil.notification = notification;
    newProfil.emailSubject = emailSubject;
    newProfil.emailBody = emailBody;

    pofiles.push(newProfil);

  } else {

    for(var i = 0; i <= pofiles.length - 1; i++) {
      if(pofiles[i].uid == uid) {
        pofiles[i].uik = uik;
        pofiles[i].title = title;
        pofiles[i].description = description;
        pofiles[i].level = level;
        pofiles[i].notification = notification;
        pofiles[i].emailSubject = emailSubject;
        pofiles[i].emailBody = emailBody;
      }
    }
  }

  dataTypeProfilRefresh();

  dataTypeProfilFormClose();
}

window.dataTypeProfilAdd = dataTypeProfilAdd;
window.dataTypeProfilDeleteList = dataTypeProfilDeleteList;
window.dataTypeProfilRefresh = dataTypeProfilRefresh;
window.dataTypeProfilFormClose = dataTypeProfilFormClose;
window.dataTypeProfilSave = dataTypeProfilSave;

function changeDataStatusIcon(mode) {
  openFileManager({
    'selectionMode': 'single',
    'fnCallback': function(files) {

      if(!files) return false;
      var filename = files[0].filename;
      var filenameShort = files[0].filenameShort;

      $$1("img.icon-status-" + mode + "-img").show();
      $$1("img.icon-status-" + mode + "-img").attr("src", filename + "?rnd=" + Math.random());
      $$1("input[type=hidden][name=icon-status-" + mode + "]").val(filenameShort);

      closeFileManagerModal();
    }
  });
}

// import 'bootstrap-stylus/js/modal';

function closeDataStatusModal() {
  $$1("#data-status-modal").modal("hide");
}

// import 'bootstrap-stylus/js/modal';

function initDataStatusModal() {

  if($$1(document).find("#data-status-modal").length > 0) return;

  $$1(document).find("body").append('\
		<div class="modal modal-page" id="data-status-modal" tabindex="-1" role="dialog">\
			<div class="modal-dialog" style="width:960px;">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>\
						<h2 class="modal-title">Statut</h2>\
					</div>\
					<div class="modal-body"></div>\
				</div>\
			</div>\
		</div>\
	');
}

function openDataStatusModal() {
  initDataStatusModal();
  $$1("#data-status-modal").modal("show");
}

// import 'jquery-colpick';

function finalizeLoadDataStatus() {
  formRequester();
  navTabs();
  tableSelector();
  tooltip();

  $$1('#color-status-sheet').colpick({
    onBeforeShow: function() {
      $$1(this).colpickSetColor(this.value);
    },
    onSubmit: function(hsb, hex, rgb, el) {
      $$1(el).val("#" + hex);
      $$1('#icon-status-block').css('background-color', '#' + hex);
      $$1('#color-status-sheet').val("#" + hex);
      $$1(el).colpickHide();
    },
    onChange: function(hsb, hex, rgb) {
      $$1('#color-status-sheet-addon').css('background-color', '#' + hex);
      $$1('#icon-status-block').css('background-color', '#' + hex);
      $$1('#color-status-sheet').val("#" + hex);
    }
  });


}

function createDataStatus(iddataType) {

  if(typeof(iddataType) === "undefined") iddataType = $$1("#iddata-type").val();
  iddataType = Number(iddataType);
  if(!isNumber(iddataType)) return alert("Veuillez enregistrer votre type de données avant d'effectuer cette action");

  execQuery("get-data-status-create-form", {
      iddataType
    })
    .then((json) => {
      openDataStatusModal();
      $$1("#data-status-modal .modal-body").html(base64Decode(json.content));
      setTimeout(function() {
        finalizeLoadDataStatus();
      }, 100);
    });
}

function deleteDataStatus(iddataStatus) {
  var response = execQuerySync("delete-data-status", {
    'iddataStatus': iddataStatus
  });

  var json = stringToJSON(response);
  if(!json) return displayError$1(response);
  if(isAjaxError(json)) return displayError$1(json.msg);;

  if(isAjaxSuccess(json)) return true;

  return false;
}

function deleteDatasStatus() {
  if($$1("#table-data-status input[type=checkbox]:checked").length <= 0) return alert("Merci de cocher au moins un élément dans la liste");

  if(!confirm("Attention, vous allez supprimer un ou plusieurs statuts\nSouhaitez-vous continuer ?")) return false;

  $$1("#table-data-status input[type=checkbox]:checked").each(function() {
    const id = $$1(this).val();
    if(id && deleteDataStatus(id)) {
      $$1("#row-data-status-{$id}").remove();
    }
  });
}

function editDataStatus(iddataStatus) {
  execQuery("get-data-status-edit-form", {
      iddataStatus
    })
    .then((json) => {
      openDataStatusModal();
      $$1("#data-status-modal .modal-body").html(base64Decode(json.content));
      setTimeout(function() {
        finalizeLoadDataStatus();
      }, 100);
    });
}

function removeDataStatusIcon(mode) {
  $$1("img.icon-status-" + mode + "-img").attr("src", "");
  $$1("img.icon-status-" + mode + "-img").hide();
  $$1("input[type=hidden][name=icon-status-" + mode + "]").val("");
}

window.changeDataStatusIcon = changeDataStatusIcon;
window.closeDataStatusModal = closeDataStatusModal;
window.createDataStatus = createDataStatus;
window.deleteDatasStatus = deleteDatasStatus;
window.editDataStatus = editDataStatus;
window.refreshDatasStatus = refreshDatasStatus;
window.removeDataStatusIcon = removeDataStatusIcon;

// import 'bootstrap-stylus/js/modal';

function hideFieldLoader(modal, id) {
  $$1(modal).find(`#${id} .loader`).remove();
}


function showFieldLoader(modal, id) {
  var field = $$1(modal).find('#' + id);
  var head = field.find('.panel-heading');

  field.append('<img src="' + rootURL('/pub/img/ajax-loader.gif') + '" alt="Loading..." style="position: absolute; top: ' + (10 + head.height()) + 'px; right: 10px;" class="loader-field" />');
}

function confirmChangeStatusWindow(source) {

  var modalWindow = getModalWindow$1(source);
  var modification = $$1(modalWindow).find('.modal-window-modif').val();

  var iddata = $$1(modalWindow).find('#data-iddata').val();
  if(iddata == '0')
    iddata = null;

  var idfieldStatut = $$1(modalWindow).find('.data-status-list').parents('.form-field').prop('id');

  var queryStatut = function() {

    $$1(modalWindow).find("input[type=button],input[type=submit],button").not(".protected").hide();

    execQuery('change-data-status', {
        'iddata': iddata,
        'iddataType': $$1(modalWindow).find('#data-iddata-type').val(),
        'iddataStatus': $$1(source).val(),
        'sourceIddata': 0,
        'sourceIddataType': 0,
        'full-page-view': $$1(modalWindow).parents('.full-page').first().length
      })
      .then((json) => {
        removeTinyMCE$1(modalWindow);
        hideFieldLoader(modalWindow, idfieldStatut);
        finalizeSaveData(json);

        $$1(modalWindow).find('.data-status-list').each((idx, elm) => {
          $$1(elm).val($$1(source).val());
          $$1(modalWindow).find('input[name=' + $$1(elm).prop('name') + '-old]').val($$1(source).val());
        });
      })
      .catch(() => {
        hideFieldLoader(modalWindow, idfieldStatut);
        $$1(modalWindow).find("input[type=button],input[type=submit],button").not(".protected").show();
      });

    removeTinyMCE$1(modalWindow);
  };

  if(modification === '1') {

    if($$1('#confirmSaveCancelStatus').length <= 0) {
      $$1(document).find("body").append(
        '<div class="modal modal-page" id="confirmSaveCancelStatus" tabindex="-1" role="dialog">\
					<div class="modal-dialog" style="margin-top:10%;width: 800px;">\
						<div class="modal-content">\
							<div class="modal-header">\
								<button id="cancelIconStatus" class="modal-header-close" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i></button>\
								<span class="modal-header-icon"><i class="glyphicons glyphicons-disk-save"></i></span>\
								<h2 class="modal-title">Enregistrer vos modifications avant de changer de statut ?</h2>\
							</div>\
							<div class="modal-body" style="margin:25px 10px; text-align:center;">\
								<h4>Souhaitez-vous enregistrer les modifications<br />que vous venez d\'effectuer avant de changer la fiche de statut ?</h4>\
								<br />Si vous cliquez sur "Changer de statut sans enregistrer" vos modifications seront perdues.\
							</div>\
							<div class="modal-footer">\
								<button style="margin:0 5px;" type="button" data-dismiss="modal" class="btn btn-success pull-left" id="saveStatus">Enregistrer et changer de statut</button>\
								<button style="margin:0 5px;" type="button" data-dismiss="modal" class="btn btn-warning pull-left" id="closeStatus">Changer de statut sans enregistrer</button>\
								<button type="button" data-dismiss="modal" class="btn btn-default pull-right" id="cancelStatus">Revenir à la fiche</button>\
								<div class="clearfix"></div>\
							</div>\
						</div>\
					</div>\
				</div>'
      );
    }

    //On ouvre une modal Enregistrer/Annuler/Fermer
    var modalConfirm = $$1('#confirmSaveCancelStatus').modal({
      show: true,
      backdrop: 'static',
      keyboard: false
    });
    $$1(modalConfirm).unbind('click');
    $$1(modalConfirm)
      .on('click', '#saveStatus', function() {
        //On enregistre
        $$1(source).parents('.form-requester').first().submit();
        removeTinyMCE$1(modalWindow);

        /*
         * #2128 - pb si erreur/mandatory manquant (pas de réaffichage de la fiche)
         */
        showFieldLoader(modalWindow, idfieldStatut);
        $$1('#confirmSaveCancelStatus').modal('hide');
      })
      .on('click', '#cancelStatus, #cancelIconStatus', function() {
        // on annule les changements de statut
        var modal = getModalWindowMain();

        modal.find('.data-status-list').each(function(idx, elm) {

          if($$1(modal).find('input[name=' + $$1(elm).prop('name') + '-old]').length > 0) {
            var old = $$1(modal).find('input[name=' + $$1(elm).prop('name') + '-old]').val();
            $$1(elm).val(old);
          }
        });
        $$1('#confirmSaveCancelStatus').modal('hide');
        return false;
      })
      .on('click', '#closeStatus', function() {

        showFieldLoader(modalWindow, idfieldStatut);
        queryStatut();
        $$1('#confirmSaveCancelStatus').modal('hide');
      });

    return false;
  } else {

    showFieldLoader(modalWindow, idfieldStatut);
    queryStatut();
  }
}

window.confirmChangeStatusWindow = confirmChangeStatusWindow;

var timerCheckDataTitle = null;

function _checkDataTitle(input, iddataType, iddata, typeCheckAlert) {
  iddata = Number(iddata);

  if(timerCheckDataTitle != null) clearTimeout(timerCheckDataTitle);
  timerCheckDataTitle = null;

  // reset error
  $$1(input).parents(".error-container").removeClass("has-error");
  if($$1(input).parents(".error-container").find(".error-msg").length > 0)
    $$1(input).parents(".error-container").find(".error-msg").html("");

  if(!iddataType) return false;
  if(!isNumber(iddata)) iddata = $$1(input).parents("form").find("#data-iddata").val();

  var title = $$1(input).val();
  if(title.length <= 0) return false;

  execQuery("check-data-title", {
      'title': title,
      'iddataType': iddataType,
      'iddata': iddata
    })
    .then((json) => {
      if(json.exists == true) {
        setTimeout(function() {
          if(iddata == $$1(input).parents("form").find("#data-iddata").val()) {
            if(typeCheckAlert == true) {
              return displayError$1(json.errorMsg + '<br /><br />Veuillez la sélectionner dans la liste.');
            } else {
              $$1(input).parents(".error-container").removeClass("has-error").addClass("has-error");
              if($$1(input).parents(".error-container").find(".error-msg").length <= 0)
                $$1(input).parents(".error-container").append("<span class='help-block error-msg'></span>");
              $$1(input).parents(".error-container").find(".error-msg").html(json.errorMsg);
            }
          }
        }, 500);
      }
    });
}

function checkDataTitle(input, iddataType, iddata, typeCheckAlert) {
  if(typeof(typeCheckAlert) == 'undefined')
    typeCheckAlert = false;

  if(timerCheckDataTitle != null) clearTimeout(timerCheckDataTitle);
  timerCheckDataTitle = setTimeout(function() {
    _checkDataTitle(input, iddataType, iddata, typeCheckAlert);
  }, 1000);
}

window.checkDataTitle = checkDataTitle;

function fillCondition(type, nodeToFill) {
  var form = $$1('#form-data-field').find('[name=iddata-type]');

  execQuery('get-config-date-' + type, {
      'iddata-type': form.val()
    })
    .then((json) => $$1(nodeToFill).html(json.html));
}

function dateSelectCondition(node) {
  var valueSelected = $$1(node).val();
  var oParent = $$1(node).parents('#config-bloc-condition').parent();
  var nodeToFill = oParent.find('#config-bloc-date-condition');

  switch(valueSelected) {
    case 'lt':
    case 'gt':
      fillCondition('lg', nodeToFill);
      break;
    case 'bt':
      fillCondition('bt', nodeToFill);
      break;
    default:
      nodeToFill.html('');
      break;
  }
}

// import 'public-source/js/addins/jquery/ui-datetime';

function configDateChoice1(node) {
  if($$1(node).val() == 'date') {
    var input = $$1(document.createElement('input')).attr('name', 'date-value-choice-1').addClass('form-control').datetimepicker({
      beforeShow: function(input) {
        $$1(input).css('z-index', 99999999999);
      },
      onClose: function(txt, input) {
        $$1(this).css('z-index', 'auto');
      }
    });
    $$1(node).next().append(input);
    input.click(function() {
      $$1(this).datetimepicker('show');
    });
  } else
    $$1(node).next().html('');
}

// import 'public-source/js/addins/jquery/ui-datetime';

function configDateChoice2(node) {
  if($$1(node).val() == 'date') {
    var input = $$1(document.createElement('input')).attr('name', 'date-value-choice-2').addClass('form-control').datetimepicker({
      beforeShow: function(input) {
        $$1(input).css('z-index', 99999999999);
      },
      onClose: function(txt, input) {
        $$1(this).css('z-index', 'auto');
      }
    });
    input.change(function() {
      var value = $$1(this).parent().parent().find('[name=config-date-choice-1]').val();
      // TODO @tstocker rejouter afficher une couleur d'alert en cas de date antérieur a la date de debut d'interval
      // if(/[0-9]{2}\/[0-9]{2}\/[0-9]{4} [0-9]{2}:[0-9]{2}/.test(value)){
      // 	var tmp = value.replace(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})( [0-9]{2}:[0-9]{2})/, '\3-\2-\1\4');

      // }
    });
    $$1(node).next().append(input);
    input.click(function() {
      $$1(this).datetimepicker('show');
    });
  } else
    $$1(node).next().html('');
}

window.dateSelectCondition = dateSelectCondition;
window.configDateChoice1 = configDateChoice1;
window.configDateChoice2 = configDateChoice2;

var configEasyDataDataTypeFields = {};

function configEasyDataUpdatePreview() {

  if($$1('#config-easy-data-fields').find('.list-group-item').length <= 0)
    $$1('#config-easy-data-preview .row').html('<p class="text-center">( Vide )</p>');

  $$1('#config-easy-data-preview .row').html('');

  $$1('#config-easy-data-fields').find('.list-group-item').each(function() {

    var label = $$1(this).find('.config-easy-data-field-label').val();
    var width = $$1(this).find('.config-easy-data-field-width').val();

    if(width != '')
      $$1('#config-easy-data-preview .row').append('<div class="' + width + '"><input type="text" class="form-control" placeholder="' + label + '" readonly="readonly" /></div>')
  });
}

function configEasyDataUpdateField(elt) {

  var classe = $$1(elt).attr('class');
  if(!classe)
    classe = '';

  var item = (classe.indexOf('list-group-item') >= 0) ? elt : $$1(elt).parents('.list-group-item:first');
  var input = $$1(item).find('input[type=hidden]:first');

  var label = $$1(item).find('.config-easy-data-field-label:first').val();
  var width = $$1(item).find('.config-easy-data-field-width:first').val();
  var field = $$1(item).find('.config-easy-data-field-field:first').val();
  var uid = $$1(item).find('.config-easy-data-field-uid:first').val();
  var index = $$1(item).index();
  var position = strFillLeft(index + 1, '0', 2);

  if((uid == '') && (label != '')) {
    uid = dashString(label, true);
    $$1(item).find('.config-easy-data-field-uid:first').val(uid);
  }

  var separator = '|||';

  var concat = label + separator + width + separator + field + separator + uid + separator + position;
  $$1(input).val(concat);
}

function configEasyDataUpField(elt) {

  var itemCurrent = $$1(elt).parents('.list-group-item:first');
  var item = $$1(itemCurrent).prev('.list-group-item:first');

  if(!item)
    return false;

  $$1(itemCurrent).insertBefore(item);

  setTimeout(function() {

    configEasyDataUpdateField(item);
    configEasyDataUpdateField(itemCurrent);
    configEasyDataUpdatePreview();
  }, 200);

  return true;
}

function configEasyDataUpdateDataTypeFields() {

  var dataTypeId = Number($$1('#config-easy-data-datatype').val());

  $$1('.config-easy-data-field-field').find('option:gt(0)').remove();

  if(!isNumber(dataTypeId) || !configEasyDataDataTypeFields.hasOwnProperty(dataTypeId))
    return false;

  dataTypeFields = configEasyDataDataTypeFields[dataTypeId];
  for(var i = 0; i <= dataTypeFields.length - 1; i++) {
    $$1('.config-easy-data-field-field').append($$1('<option>', {
      'value': dataTypeFields[i].uid,
      'text': dataTypeFields[i].title
    }));
  }
}

function configEasyDataRemoveField(elt) {
  var item = $$1(elt).parents('.list-group-item:first');
  $$1(item).remove();

  configEasyDataUpdatePreview();
}

function configEasyDataDownField(elt) {

  var itemCurrent = $$1(elt).parents('.list-group-item:first');
  var item = $$1(itemCurrent).next('.list-group-item:first');

  if(!item)
    return false;

  $$1(itemCurrent).insertAfter(item);

  setTimeout(function() {

    configEasyDataUpdateField(item);
    configEasyDataUpdateField(itemCurrent);
    configEasyDataUpdatePreview();
  }, 200);

  return true;
}

function configEasyDataAddField() {

  var uid = ''
  var label = '';
  var width = '';
  var field = '';
  var position = strFillLeft($$1('#config-easy-data-fields .list-group-item').length + 1, '0', 2);
  var separator = '|||';

  var concat = uid + separator + label + separator + width + separator + field + separator + position;

  var dataTypeId = $$1('#config-easy-data-datatype').val();

  var item = $$1('<div>', {
    'class': 'list-group-item',
    'style': 'padding:2px'
  });

  // input
  $$1(item).append($$1('<input>', {
    'type': 'hidden',
    'name': 'fields[]',
    'value': concat
  }));

  // row
  var row = $$1('<div>', {
    'class': 'row'
  });


  // <--- uid
  var colUid = $$1('<div>', {
    'class': 'col-xs-2'
  }).append($$1('<input>', {
    'type': 'text',
    'class': 'form-control config-easy-data-field-uid',
    'placeholder': 'UID'
  }));
  // uid --->


  // <--- label
  var colLabel = $$1('<div>', {
    'class': 'col-xs-3'
  }).append($$1('<input>', {
    'type': 'text',
    'class': 'form-control config-easy-data-field-label',
    'placeholder': 'Libellé'
  }));
  // label --->

  // <--- width
  var selectWidth = $$1('<select>', {
    'class': 'form-control config-easy-data-field-width'
  });
  $$1(selectWidth).append($$1('<option>', {
    'value': '',
    'text': '( Largeur )'
  }));
  for(var i = 1; i <= 12; i++) {
    $$1(selectWidth).append($$1('<option>', {
      'value': 'col-xs-' + i,
      'text': 'col' + i
    }));
  }
  var colWidth = $$1('<div>', {
    'class': 'col-xs-2',
  }).append(selectWidth);
  // width --->

  // <--- field field
  var selectDataTypeFields = $$1('<select>', {
    'class': 'form-control config-easy-data-field-field'
  });
  $$1(selectDataTypeFields).append($$1('<option>', {
    'value': '',
    'text': '( Champs destination )'
  }));
  if(isNumber(dataTypeId) && configEasyDataDataTypeFields.hasOwnProperty(dataTypeId)) {
    dataTypeFields = configEasyDataDataTypeFields[dataTypeId];
    for(var i = 0; i <= dataTypeFields.length - 1; i++) {
      $$1(selectDataTypeFields).append($$1('<option>', {
        'value': dataTypeFields[i].uid,
        'text': dataTypeFields[i].title
      }));
    }
  }

  var colField = $$1('<div>', {
    'class': 'col-xs-3'
  }).append(selectDataTypeFields);
  // field field --->

  // <--- action buttons
  var button1 = $$1('<button>', {
    'type': 'button',
    'class': 'btn btn-default btn-xs config-easy-data-field-btn-up',
    'tabindex': '-1'
  }).append($$1('<i>', {
    'class': 'glyphicon glyphicon-arrow-up'
  }));
  var button2 = $$1('<button>', {
    'type': 'button',
    'class': 'btn btn-default btn-xs config-easy-data-field-btn-down',
    'tabindex': '-1'
  }).append($$1('<i>', {
    'class': 'glyphicon glyphicon-arrow-down'
  }));
  var button3 = $$1('<button>', {
    'type': 'button',
    'class': 'btn btn-danger btn-xs config-easy-data-field-btn-remove',
    'tabindex': '-1',
    'style': 'margin-left:2px'
  }).append($$1('<i>', {
    'class': 'glyphicon glyphicon-remove-sign'
  }));

  var colButtons = $$1('<div>', {
    'class': 'col-xs-2',
    'style': 'padding-top:8px; padding-left:0; text-align:right;'
  }).append(button1).append(button2).append(button3);
  // action buttons --->

  $$1(row).append(colLabel).append(colWidth).append(colField).append(colUid).append(colButtons);
  $$1(item).append(row);

  $$1('#config-easy-data-fields .list-group').append(item);

  configEasyDataUpdatePreview();

  configEasyDataInit();
}

/**
 * configEasyDataInit Initialize the easy data field's configurator form
 * @param  {json object} all dataTypes's fields json structure
 */
function configEasyDataInit(dataTypeFields) {

  if(typeof(dataTypeFields) != 'undefined')
    configEasyDataDataTypeFields = stringToJSON(base64Decode(dataTypeFields));

  $$1('#config-easy-data-datatype').unbind('change').bind('change', function() {
    configEasyDataUpdateDataTypeFields();
  })
  $$1('#config-easy-data-btn-add-field').unbind('click').bind('click', function() {
    configEasyDataAddField();
  });
  $$1('.config-easy-data-field-btn-up').unbind('click').bind('click', function() {
    configEasyDataUpField($$1(this));
  })
  $$1('.config-easy-data-field-btn-down').unbind('click').bind('click', function() {
    configEasyDataDownField($$1(this));
  })
  $$1('.config-easy-data-field-btn-remove').unbind('click').bind('click', function() {
    configEasyDataRemoveField($$1(this));
  })
  $$1('.config-easy-data-field-label, .config-easy-data-field-uid, .config-easy-data-field-width, .config-easy-data-field-field').unbind('change').bind('change', function() {
    configEasyDataUpdateField($$1(this));
    configEasyDataUpdatePreview();
  });
}

function removeEasyDataField(elt) {

  var item = $$1(elt).parents('.list-group-easydata:first');
  var value = item.find('.easy-data-field-id').val();
  var control = item.parents('.control-selector');
  if(control.length > 0)
    removeItemSelector(control, value);
  $$1(item).remove();
}

function openEasyDataField(elt, options) {
  var item = $$1(elt).parents('.list-group-easydata:first');
  var id = Number($$1(item).find('.easy-data-field-id:first').val());

  if(!options) options = {};
  options.sourceIddata = $$1(elt).parents("#form-data").find("#data-iddata").val();
  gidOrigin().select = $$1(elt).parents('.control-selector').attr('data-gid');

  if(isNumber(id))
    consultData$1(id, options);
}

function JSONToString(obj) {
	try { return obj ? JSON.stringify(obj) : ''; } catch(e) { return ''; }
}

function finalizeFieldEasyData(fieldUid, json, value) {

  if(typeof(value) == 'string')
    value = stringToJSON(value);

  if(typeof(value) != 'object')
    return false;

  $$1.each(value, function(index, value) {
    if(index < 0) {
      if($$1('#' + fieldUid).find('input.easy-data-field-id[value=' + index + ']').length > 0) {
        $$1('#' + fieldUid).find('input.easy-data-field-id[value=' + index + ']').parents('.list-group-easydata:first').find('.btn-open-field').show();
        $$1('#' + fieldUid).find('input.easy-data-field-id[value=' + index + ']').val(value);
        var content = stringToJSON(base64Decode($$1('#' + fieldUid).find('input.easy-data-field-value').val()));
        content['__id__'] = value;
        $$1('#' + fieldUid).find('input.easy-data-field-value').val(base64Encode$1(JSONToString(content)));
      }
    }
  });
}

function validSearchEasyDataField(row) {

  var dataId = $$1(row).data('id');
  var item = $$1(row).parents('.list-group-easydata:first');
  var obj = {};

  $$1(item).find('.easy-data-field-id').val(dataId);
  $$1(item).find('.btn-open-field').show();

  obj['__id__'] = dataId;

  $$1(row).find('.easy-data-field-search-item').each(function() {

    var value = $$1(this).html();
    var fieldUid = $$1(this).data('field-uid');

    $$1(item).find('.easy-data-field-input').filter(function() {
      return $$1(this).data('field-uid') == fieldUid
    }).each(function() {

      var uid = $$1(this).data('uid');
      obj[uid] = value;

      if($$1(this).prop('type') == 'select-one') {

        $$1(this).find('option').filter(function() {
          return this.text == value;
        }).attr('selected', true);

      } else {
        $$1(this).val(value);
      }
    });
  });

  $$1(item).find('.easy-data-field-value').val(base64Encode$1(JSON.stringify(obj)));

  closeSearchEasyDataField($$1(item));
}

window.addEasyDataField = addEasyDataField;
window.removeEasyDataField = removeEasyDataField;
window.openEasyDataField = openEasyDataField;
window.finalizeFieldEasyData = finalizeFieldEasyData;
window.configEasyDataInit = configEasyDataInit;
window.validSearchEasyDataField = validSearchEasyDataField;
window.initEasyDataFields = initEasyDataFields;

function deleteEval(iddataSource, iddataEval, gid) {
  var modalWindow = getModalWindowMain();
  if(confirm('Etes-vous sur de vouloir supprimer cette évaluation ?'))
    updateEval(modalWindow, iddataSource, iddataEval, gid, 'delete');
}

window.deleteEval = deleteEval;

// NOTE: Used in kernel\bundles\fields\c\FieldFile.php
function fieldFileSliderBackward(elt) {

  var slider = $$1(elt).parents('.data-file-slider:first');
  var slidesCount = $$1(slider).find('.data-file-slide').length;

  var currentSlide = $$1(slider).find('.data-file-slide-visible');

  if(typeof(currentSlide) == 'undefined')
    return false;

  var newSlide = $$1(currentSlide).prev('.data-file-slide:first');

  if(typeof(newSlide) == 'undefined')
    return false;

  var index = $$1(newSlide).index();

  if(index < 0)
    return false;

  $$1(slider).find('.data-file-slide').not(newSlide).removeClass('data-file-slide-visible');
  $$1(newSlide).addClass('data-file-slide-visible');

  $$1(slider).find('.data-file-slider-counter').html(index + '/' + slidesCount);
}

function fieldFileSliderFastBackward(elt) {

  var slider = $$1(elt).parents('.data-file-slider:first');
  var slidesCount = $$1(slider).find('.data-file-slide').length;

  $$1(slider).find('.data-file-slide').removeClass('data-file-slide-visible');
  $$1(slider).find('.data-file-slide:first').addClass('data-file-slide-visible');

  $$1(slider).find('.data-file-slider-counter').html('1/' + slidesCount);
}

// NOTE: Used in kernel\bundles\fields\c\FieldFile.php
function fieldFileSliderForward(elt) {

  var slider = $$1(elt).parents('.data-file-slider:first');
  var slidesCount = $$1(slider).find('.data-file-slide').length;

  var currentSlide = $$1(slider).find('.data-file-slide-visible');

  if(typeof(currentSlide) == 'undefined')
    return false;

  var newSlide = $$1(currentSlide).next('.data-file-slide:first');

  if(typeof(newSlide) == 'undefined')
    return false;

  var index = $$1(newSlide).index();

  if(index < 0)
    return false;

  $$1(slider).find('.data-file-slide').not(newSlide).removeClass('data-file-slide-visible');
  $$1(newSlide).addClass('data-file-slide-visible');

  $$1(slider).find('.data-file-slider-counter').html(index + '/' + slidesCount);

}

function openFileManagerFieldFile() {

  openFileManager({
    'selectionMode': 'multi',
    'fnCallback': function(files) {

      if(!files) return false;

      for(var i = 0; i <= files.length - 1; i++) {

        var div = $$1('<div class="list-group-item">' + files[i].filenameShort + '</div>');
        $$1(div).append('<input type="hidden" name="default-files[]" value="' + files[i].id + '" />');
        $$1(div).append('<span style="position:absolute; right:5px; top;5px; cursor:pointer" onclick="$(this).parents(\'.list-group-item:first\').remove();"><i class="glyphicon glyphicon-remove-sign"></i></span>');

        $$1('#list-group-files').append(div);
      }
      closeFileManagerModal();
    }
  });
}

window.fieldFileSliderBackward = fieldFileSliderBackward;
window.fieldFileSliderFastBackward = fieldFileSliderFastBackward;
window.fieldFileSliderFastForward = fieldFileSliderFastForward;
window.fieldFileSliderForward = fieldFileSliderForward;
window.openFileManagerFieldFile = openFileManagerFieldFile;

function controlLinkAdd(elt) {
  var model = $$1(elt).parents('.input-container:first').find('.data-model').html();
  $$1(elt).parents('.input-container:first').find('.data-container table').append(base64Decode(model));
}

function controlLinkRemove(elt) {
  $$1(elt).parents('.row-link').remove();
}

function openLink(elt, type) {
  var link = $$1(elt).parent().parent().find('.open-link').val();

  if(link == '') {
    alert('Veuillez renseigner le champ');
    return false;
  }

  if(type == 'mail') {
    var test = window.open('mailto:' + link, "_blank");
    test.close();
  } else {
    var httpLink = link.substring(0, 4);
    if(httpLink.toLowerCase() != 'http') {
      link = 'http://' + link;
    }
    window.open(link, "_blank");
  }
}

window.controlLinkAdd = controlLinkAdd;
window.controlLinkUpdateValue = controlLinkUpdateValue;
window.controlLinkRemove = controlLinkRemove;
window.openLink = openLink;

/**
 * Retrieve a field textbox,textarea or dataTitle value in edition or consultation mode
 */
function getIcsFieldTextValue(container, field) {

  if(typeof(field) === 'undefined' || field == '')
    return '';

  value = '';

  if($$1(container).find('#form-field-' + field).has('input[type=text]').length > 0) {

    value = $$1(container).find('#form-field-' + field + ' input[type=text]:first').val();

  } else if($$1(container).find('#form-field-' + field).has('textarea').length > 0) {

    value = $$1(container).find('#form-field-' + field + ' textarea:first').val();

  } else {

    if($$1(container).find('#form-field-' + field).find('.field-full').length > 0) {

      value = $$1(container).find('#' + field).find('.field-full div:first').html(); // long text

    } else if($$1(container).find('#form-field-' + field).find('b').length > 0) {

      value = $$1(container).find('#form-field-' + field).find('b').html(); // title (b tag added)

    } else if($$1(container).find('#form-field-' + field).find('.form-control-static').length > 0) {

      value = $$1(container).find('#form-field-' + field).find('.form-control-static').html();

    } else {

      value = $$1(container).find('#form-field-' + field).html();
    }
  }

  value = value.replace('<br>', '');
  value = value.replace('<br />', '');

  return trim$1(value);
}

// TODO: Do this with a module like 'moment'

/**
 * Convert a date entry (string formated or object) as a string ICs format YYYYMMDDTHHIISSZ
 * @param  string or object entry date
 * @return string date ICS formated
 */
function dateToIcs(entry) {
	var dateObj = typeof entry == 'object' ? entry : strToDateObj(entry);
	if(!dateObj) { return ''; }
	return `${dateObj.year}${dateObj.month}${dateObj.day}T${dateObj.hours}${dateObj.minutes}${dateObj.seconds}Z`;
}

// TODO: Do this with a module like 'moment'

/**
 * Adjust date to GMT +0
 * @param  string or object entry date
 * @return object date object set to GMT +0
 */
function dateToGmt$1(entry) {

	var dateObj = (typeof(entry)=='object') ? entry : strToDateObj(entry);

	if (dateObj===false)
		return false;

	var currentDate = new Date();
	currentDate.setDate(dateObj.day);
	currentDate.setMonth(parseInt(dateObj.month)-1);
	currentDate.setFullYear(dateObj.year);
	currentDate.setHours(dateObj.hours);
	currentDate.setMinutes(dateObj.minutes);
	currentDate.setSeconds(dateObj.seconds);

	var obj = {};

	obj['day'] = String(currentDate.getUTCDate());
	obj['month'] = String(currentDate.getUTCMonth()+1);
	obj['year'] = String(currentDate.getUTCFullYear());

	obj['hours'] = String(currentDate.getUTCHours());
	obj['minutes'] = String(currentDate.getUTCMinutes());
	obj['seconds'] = String(currentDate.getUTCSeconds());

	if (String(obj.day).length==1)
		obj.day = '0'+obj.day;

	if (String(obj.month).length==1)
		obj.month = '0'+obj.month;

	if (String(obj.hours).length==1)
		obj.hours = '0'+obj.hours;

	if (String(obj.minutes).length==1)
		obj.minutes = '0'+obj.minutes;

	if (String(obj.seconds).length==1)
		obj.seconds = '0'+obj.seconds;

	return obj;
}

/**
 * Retrieve a field date value in edition or consultation mode
 */
function getIcsFieldDateValue(container, field) {

  if(field == '')
    return '';

  value = '';

  if($$1(container).find('#form-field-' + field).has('input[type=text]').length > 0) {

    value = dateToIcs(dateToGmt$1($$1(container).find('#form-field-' + field + ' input[type=text]:first').val()));

  } else {

    value = dateToIcs(dateToGmt$1($$1(container).find('#form-field-' + field + ' .form-control-static span:first').html()));
  }

  return trim$1(value);
}

function objToDate(dateObj) {

	if (typeof(dateObj)!='object')
		return false;

	var format = dateObj.year+'-'+dateObj.month+'-'+dateObj.day;

	if (dateObj.hours!='' && dateObj.minutes!='')
		format+='T'+dateObj.hours+':'+dateObj.minutes;

	if (dateObj.seconds!='')
		format+=':'+dateObj.seconds;

	var dateFinal = new Date(format.replace(/\-/g,'\/').replace(/[T|Z]/g,' ')); // replace is for browsers compatibility

	return dateFinal;
}

// TODO: Do this with a module like 'moment'
function dateToStr(entry, format) {

	if (typeof(entry)=='undefined')
		return '';

	if (typeof(format)=='undefined')
		format = 'd/m/Y h:i';

	switch(format) {

		case 'd/m/Y h:i':
			return `${leadingZero(entry.getDate())}/${leadingZero(entry.getMonth() +1)}/${entry.getFullYear()} ${leadingZero(entry.getHours())} ${leadingZero(entry.getMinutes())}`;

		case 'ics':
			return `${entry.getFullYear()}${leadingZero((entry.getMonth() +1))}${leadingZero(entry.getDate())}T${leadingZero(entry.getHours())}${leadingZero(entry.getMinutes())}00Z`;
	}

	return '';
}

function getDateEndDuration(container, field, duration) {

  var dateStart = null;

  if($$1(container).find('#form-field-' + field).has('input[type=text]').length > 0) {

    dateStart = $$1(container).find('#form-field-' + field + ' input[type=text]:first').val();

  } else {

    dateStart = $$1(container).find('#form-field-' + field + ' .form-control-static span:first').html();
  }

  if(dateStart === null)
    return false;

  var dateEnd = objToDate(dateToGmt(dateStart));

  dateEnd.setHours(dateEnd.getHours() + parseInt(duration));

  return dateToStr(dateEnd, 'ics');
}

// TODO: Optimize/refactor

/**
 * Retrieve a field select-user value in edition or consultation mode
 */
function _getIcsFieldParticipantsValue(container, field) {

  if(typeof(field) === 'undefined')
    return '';

  if(!isArray(field))
    field = new Array(field);

  var values = [];

  for(var i = 0; i < field.length; i++) {

    // detect group
    var prefix = ($$1(container).find('#form-field-' + field[i]).attr('class').indexOf('form-field-type-select-group') >= 0) ? 'g' : 'u';

    if($$1(container).find('#form-field-' + field[i]).has('input').length > 0) {

      var tmp = $$1(container).find('#form-field-' + field[i] + ' input').val().split(',');

      $$1.each(tmp, function(i, elt) {
        if($$1.inArray(prefix + trim$1(String(elt)), values) === -1)
          values.push(prefix + trim$1(String(elt)));
      });

    } else {

      if($$1(container).find('#form-field-' + field[i]).find('span').length > 0) {

        $$1(container).find('#form-field-' + field[i]).find('span').each(function() {

          var id = prefix + String($$1(this).data('id'));

          if($$1.inArray(id, values) === -1)
            values.push(id);
        });
      }
    }
  }

  return trim$1(values.join(','));
}

function sendIcsInvitations(elt, parametersStr) {
  iddata = Number(iddata);

  var parameters = stringToJSON(base64Decode(parametersStr));

  var container = $$1(elt).parents('#form-data:first');

  var modal = $$1(container).parents('.modal-window:first');
  var modif = $$1(modal).find('.modal-window-modif:first').val();
  if(modif == 1)
    return alert("Veuillez enregistrer votre fiche avant d'effectuer cette action");

  var iddata = $$1(container).find('#data-iddata').val();

  if(!isNumber(iddata))
    return alert("Veuillez enregistrer la fiche avant d'envoyer des invitations");

  var summary = getIcsFieldTextValue(container, parameters.fieldSummary);
  var dateStart = getIcsFieldDateValue(container, parameters.fieldDateStart);
  var dateEnd = getIcsFieldDateValue(container, parameters.fieldDateEnd);
  var description = getIcsFieldTextValue(container, parameters.fieldDescription);
  var location = getIcsFieldTextValue(container, parameters.fieldLocation);
  var participants = _getIcsFieldParticipantsValue(container, parameters.fieldParticipants);

  if(dateEnd == '' && parameters.duration != '')
    dateEnd = getDateEndDuration(container, parameters.fieldDateStart, parameters.duration);

  if(dateStart === false || dateEnd === false) {
    alert('Les dates ne sont pas valides');
    return false;
  }
  if(summary == '') {
    alert('L\'intitulé de l\'évènement est vide');
    return false;
  }

  if(!confirm("Attention, vous allez envoyer une invitation aux différents participants.\nSouhaitez-vous continuer ?"))
    return false;

  var ics = base64Encode$1(JSON.stringify({
    'iddata': iddata,
    'uid': parameters.uid, // field uid
    'dateStart': dateStart,
    'dateEnd': dateEnd,
    'summary': summary,
    'description': description,
    'location': location,
    'participants': participants
  }));

  $$1(elt).hide();

  execQuery('send-ics-invitations', {
      ics
    })
    .then((json) => {
      $$1(elt).show();
      displaySuccess(json.msg);
    })
    .catch(() => $$1(elt).show());
}

function setIcsGoogle(elt, parametersStr) {

  var parameters = stringToJSON(base64Decode(parametersStr));

  var container = $$1(elt).parents('#form-data:first');

  var modal = $$1(container).parents('.modal-window:first');
  var modif = $$1(modal).find('.modal-window-modif:first').val();
  if(modif == 1)
    return alert("Veuillez enregistrer votre fiche avant d'effectuer cette action");

  var summary = getIcsFieldTextValue(container, parameters.fieldSummary);
  var dateStart = getIcsFieldDateValue(container, parameters.fieldDateStart);
  var dateEnd = getIcsFieldDateValue(container, parameters.fieldDateEnd);
  var description = getIcsFieldTextValue(container, parameters.fieldDescription);
  var location = getIcsFieldTextValue(container, parameters.fieldLocation);

  if(dateEnd == '' && parameters.duration != '')
    dateEnd = getDateEndDuration(container, parameters.fieldDateStart, parameters.duration);

  if(dateStart === false || dateEnd === false) {
    alert('Les dates ne sont pas valides');
    return false;
  }
  if(summary == '') {
    alert('L\'intitulé de l\'évènement est vide');
    return false;
  }

  var href = "https://www.google.com/calendar/render?action=TEMPLATE";
  href += "&text=" + encodeURI(summary);
  href += "&dates=" + String(dateStart) + "/" + String(dateEnd);
  href += "&details=" + encodeURI(description);
  href += "&location=" + encodeURI(location);
  href += "&trp=true&sf=true&output=xml";

  $$1(elt).prop('href', href);

  return true;
}

function setIcsOutlook(elt, parametersStr) {

  var parameters = stringToJSON(base64Decode(parametersStr));

  var container = $$1(elt).parents('#form-data:first');

  var modal = $$1(container).parents('.modal-window:first');
  var modif = $$1(modal).find('.modal-window-modif:first').val();
  if(modif == 1)
    return alert("Veuillez enregistrer votre fiche avant d'effectuer cette action");

  var summary = getIcsFieldTextValue(container, parameters.fieldSummary);
  var dateStart = getIcsFieldDateValue(container, parameters.fieldDateStart);
  var dateEnd = getIcsFieldDateValue(container, parameters.fieldDateEnd);
  var description = getIcsFieldTextValue(container, parameters.fieldDescription);
  var location = getIcsFieldTextValue(container, parameters.fieldLocation);

  if(dateEnd == '' && parameters.duration != '')
    dateEnd = getDateEndDuration(container, parameters.fieldDateStart, parameters.duration);

  if(dateStart === false || dateEnd === false) {
    alert('Les dates ne sont pas valides');
    return false;
  }
  if(summary == '') {
    alert('L\'intitulé de l\'évènement est vide');
    return false;
  }

  var m = base64Encode$1(JSON.stringify({
    'dateStart': !!dateStart ? dateStart : '',
    'dateEnd': !!dateEnd ? dateEnd : '',
    'summary': !!summary ? summary : '',
    'description': !!description ? description : '',
    'location': !!location ? location : ''
  }));

  $$1(elt).prop('href', rootURL(`ics?m=${m}`));

  return true;
}

window.sendIcsInvitations = sendIcsInvitations;
window.setIcsGoogle = setIcsGoogle;
window.setIcsOutlook = setIcsOutlook;

function getFieldSelectorNewId() {
  var id = 0;
  $$1("#field-selector-list-group-values .value-id").each(function() {
    var currentId = Number($$1(this).val());
    if(isNumber(currentId) && (parseInt(currentId) > id))
      id = parseInt(currentId);
  });
  return parseInt(id) + 1;
}

function updateFieldSelectorValue(elt, extra) {
  const $groupItem = $$1(elt).parents(".list-group-item:first");
  let values = [$groupItem.find(".value-id").val(), $groupItem.find(".value-value").val()];

  if(typeof extra === 'function') {
    values = values.concat(extra($groupItem));
  }

  $groupItem.find(".value-id-value").val(values.join('|||'));
}

function removeFieldSelectorValue(elt) {
  $$1(elt).parents(".list-group-item:first").remove();
}

function addFieldSelectorValue(value) {
  var newId = getFieldSelectorNewId();

  var div = '\
		<div class="list-group-item">\
			<input type="hidden" class="form-control value-id-value" name="values[]" value="' + newId + '|||' + ((typeof(value) == 'string') ? value : '') + '" />\
			<div class="input-group">\
				<span class="input-group-addon"><i class="glyphicon glyphicon-info-sign"></i></span>\
				<span style="display:none;" class="input-group-addon">\
					<input tabindex="-1" type="number" class="value-id" style="width:50px;padding:4px;border:none;" value="' + newId + '" />\
				</span>\
				<input style="border:none;" type="text" class="form-control value-value" value="' + (typeof(value) == 'string' ? value : '') + '" />\
				<span class="input-group-btn"><button type="button" class="btn btn-danger" tabindex="-1"><i class="glyphicon glyphicon-remove"></i></button></span>\
			</div>\
		</div>';

  var newDom = $$1(div);

  newDom.find('.value-id, .value-value').change((e) => updateFieldSelectorValue(e.currentTarget));
  newDom.find('span.input-group-btn').change((e) => removeFieldSelectorValue(e.currentTarget));

  $$1("#field-selector-list-group-values")
    .append(newDom)
    .scrollTop($$1("#field-selector-list-group-values")[0].scrollHeight);

  $$1(newDom).find(".value-value").focus();
}

function switchDisplayToSelectData(value) {
  if(value == 'etiquette') {
    $$1('#display-data-type-field-configuration-base').removeClass('hidden');
    $$1('#display-data-type-field-configuration-base2').addClass('hidden');
  } else {
    $$1('#display-data-type-field-configuration-base').addClass('hidden');
    $$1('#display-data-type-field-configuration-base2').removeClass('hidden');
  }
}

window.switchDisplayToSelectData = switchDisplayToSelectData;

// NOTE: Used in 'kernel\bundles\fields\c\FieldSelector.php'
function controlSelector2CancelNewValue(elt) {
  $$1(elt).parents('.control-selector2-content-action-add-value:first').hide();
  $$1(elt).parents('.control-selector2:first').find('.control-selector2-overlay').hide();
}

// NOTE: Used in 'kernel\bundles\fields\c\FieldSelector.php'
function controlSelector2ShowNewValue(elt) {
  $$1(elt).parents('.control-selector2:first').find('.control-selector2-overlay').show();
  $$1(elt).parents('.control-selector2:first').find('.control-selector2-content-action-add-value').fadeIn('fast');
  $$1(elt).parents('.control-selector2:first').find('.control-selector2-content-action-add-value .control-selector2-action-add-value-input').focus();
  $$1(elt).parents('.control-selector2:first').find('.control-selector2-content-action-add-value').find('.alert').hide();
}

// NOTE: Used in 'kernel\bundles\fields\c\FieldSelector.php'
function controlSelector2ValidNewValue(elt, id, uid) {

  $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.alert').hide();

  var value = $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.control-selector2-action-add-value-input').val();

  $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.btn').hide();
  $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.wait').show();

  if(value.length <= 0) {
    $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.alert').html('Veuillez saisir une valeur');
    $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.alert').fadeIn('fast');
    $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.btn').show();
    $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.wait').hide();
    return false;
  }

  execQuery('control-selector2-add-value', {
      value,
      id,
      uid
    })
    .then((json) => {
      $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.btn').show();
      $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.wait').hide();

      var controlSelector2 = $$1(elt).parents('.control-selector2:first');

      $$1(controlSelector2).find('.control-selector2-values').append(json.newValueItem);

      var number = '';
      if($$1(controlSelector2).attr('class').indexOf('control-selector2-numbers') >= 0) {
        var currentItems = $$1(controlSelector2).find('.control-selector2-content-values .control-selector2-content-value').length;
        number = String(currentItems) + ' - ';
      }

      var code = json.code;

      if($$1(controlSelector2).attr('class').indexOf('control-selector2-multiple') >= 0) {

        var ids = $$1(controlSelector2).find('.control-selector2-value').val();
        ids += ((ids.length > 0) ? ',' : '') + String(code);
        $$1(controlSelector2).find('.control-selector2-value').val(ids);

        $$1(controlSelector2).find('.control-selector2-label').append('<span>' + value + '</span>');

        $$1(controlSelector2).find('.control-selector2-content-values').append("\
					<div class='control-selector2-content-value selected' data-id='" + code + "'>\
						<label class='checkbox-inline'><input checked='checked' type='checkbox' class='control-selector2-content-checkbox' value='" + code + "' />" + number + "\
							<span>" + value + "</span>\
						</label>\
					</div>\
				");

      } else if($$1(controlSelector2).attr('class').indexOf('control-selector2-radiobox') >= 0) {

        $$1(controlSelector2).find('.control-selector2-content-checkbox').prop('checked', false);

        $$1(controlSelector2).find('.control-selector2-value').val(code);

        var uid = $$1(controlSelector2).data('uid');

        $$1(controlSelector2).find('.control-selector2-content-values').append("\
					<div class='control-selector2-content-value' data-id='" + code + "'>" + number + "\
						<label class='radiobox-inline'><input checked='checked' type='radio' class='control-selector2-content-checkbox' name='radiobox-" + uid + "' value='" + code + "' />" + number + "\
							<span>" + value + "</span>\
						</label>\
					</div>\
				");

      } else {

        $$1(controlSelector2).find('.control-selector2-label').html('<span>' + value + '</span>');
        $$1(controlSelector2).find('.control-selector2-value').val(code);

        $$1(controlSelector2).find('.control-selector2-content-values').append("\
					<div class='control-selector2-content-value' data-id='" + code + "'>" + number + "\
						<span>" + value + "</span>\
					</div>\
				");

      }

      $$1(controlSelector2).find('.control-selector2-content-action-add-value-input').val('');
      $$1(controlSelector2).find('.control-selector2-content-action-add-value').hide();
      $$1(controlSelector2).find('.control-selector2-overlay').hide();

      controlSelector2Init();

      displaySuccess$1(json.msg);
    })
    .catch((err) => {
      $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.btn').show();
      $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.wait').hide();

      if(err.msg) {
        $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.alert').html(json.msg);
        $$1(elt).parents('.control-selector2-content-action-add-value:first').find('.alert').fadeIn('fast');
      }
    });
}

function checkValueSelector(val) {
  var resp = false;

  $$1('#field-selector-list-group-values .value-value').each(function() {

    resp = (resp || $$1(this).val() == val);
  });

  return resp;
}

function importFieldSelectorAnalyse(event, node) {
  var files = event.target.files;

  var data = new FormData();
  $$1.each(files, function(key, value) {
    data.append(key, value);
  });

  execQuery('import-field-selector', data, undefined, {
      cache: false,
      processData: false, // Don't process the files
      contentType: false // Set content type to false as jQuery will tell the server its a query string request
    })
    .then((json) => {
      json = stringToJSON(base64Decode(json.data));
      // FIXME: Use Object.keys instead
      for(var i in json) {
        if(json[i] && !checkValueSelector(json[i]) && json[i].length > 0)
          addFieldSelectorValue(json[i]);
      }
    });

  return;
}

// import 'bootstrap-stylus/js/modal';

function importFieldSelectorCreateModal() {

  if($$1(document).find("#importFieldSelector-modal").length > 0) return;

  const $modal = $$1('\
		<div class="modal" id="importFieldSelector-modal" tabindex="-1" role="dialog">\
			<div class="modal-dialog" style="width:960px;">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
						<h2 class="modal-title">Importation de valeurs</h2>\
					</div>\
					<div class="modal-body">\
						<span style="margin:0 2px;">\
							<label class="btn btn-success btn-xs btn-upload-file">\
								<span><i class="glyphicon glyphicon-plus-sign"></i> Télécharger</span>\
								<input class="control-data-upload-file input-upload-file" name="upload-files[]" \
									onclick="return controlSelectFilesDirect(this, \'single\');" \
									data-url="' + rootURL('/query?q=uploader&type=data') + '" multiple="" type="file">\
							</label>\
						</span>\
					</div>\
					<div class="modal-footer"><button type="button" class="btn btn-success btn-xs">Valider</button></div>\
				</div>\
			</div>\
		</div>\
	');

  $modal
    .find('.modal-body .control-data-upload-file')
    .change((e) => importFieldSelectorAnalyse(event, e.currentTarget));

  $$1("body").append($modal);

  return;
}

function importFieldSelectorValue() {
  importFieldSelectorCreateModal();
  $$1("#importFieldSelector-modal").modal("show");
}

var timerSearchFieldSelectorValue = null;

function searchFieldSelectorValue() {

  if(timerSearchFieldSelectorValue !== null)
    clearTimeout(timerSearchFieldSelectorValue);

  timerSearchFieldSelectorValue = setTimeout(function() {

    timerSearchFieldSelectorValue = null;

    var keywords = $$1("#field-selector-search-value").val();

    console.log("searching (" + keywords + ")");

    if(keywords.length <= 0)
      return $$1("#field-selector-list-group-values .list-group-item").show();

    $$1("#field-selector-list-group-values .list-group-item").each(function() {
      var value = $$1(this).find(".value-value").val();
      (value.toLowerCase().indexOf(keywords.toLowerCase()) >= 0) ? $$1(this).show(): $$1(this).hide();
    });

  }, 500);
}

window.addFieldSelectorValue = addFieldSelectorValue;
window.controlSelector2CancelNewValue = controlSelector2CancelNewValue;
window.controlSelector2ShowNewValue = controlSelector2ShowNewValue;
window.controlSelector2ValidNewValue = controlSelector2ValidNewValue;
window.importFieldSelectorAnalyse = importFieldSelectorAnalyse;
window.importFieldSelectorValue = importFieldSelectorValue;
window.removeFieldSelectorValue = removeFieldSelectorValue;
window.searchFieldSelectorValue = searchFieldSelectorValue;
window.updateFieldSelectorValue = updateFieldSelectorValue;

function enableIfChecked(node, todisable) {
  //var select = 'select[name='+name +']';

  if($$1(node).is(':checked')) {
    for(var i in todisable) {
      $$1('[name=' + todisable[i] + ']').removeAttr('disabled');
    }
  } else {
    for(var i in todisable) {
      $$1('[name=' + todisable[i] + ']').attr('disabled', 'disabled');
    }
  }
}

window.enableIfChecked = enableIfChecked;

function controlGetSelectFile(file, displayMode) {

  if(typeof(displayMode) == "undefined")
    displayMode = "thumb";

  var id = file.id;
  var link = file.filename;
  var icon = file.filenameThumb;
  var title = file.title;
  var html = '';
  var linkAttributes = ' target="_blank"';

  switch(displayMode) {

    case 'thumb':
      html = "\
				<div class='data-file data-file-thumb data-file-" + id + "'>\
					<span onclick='controlRemoveFile(this, " + id + ");'class='data-file-btn-remove'><i class='glyphicon glyphicon-remove-sign'></i></span>\
					<div class='data-file-icon'>\
						<a" + linkAttributes + " href='" + link + "'>\
							<img src='" + icon + "' />\
						</a>\
					</div>\
					<div class='data-file-title'>" + title + "</div>\
				</div>\
			";
      break;

    case 'icon':
      html = "\
				<div class='data-file data-file-icon-all data-file-" + id + "'>\
					<span onclick='controlRemoveFile(this, " + id + ");'class='data-file-btn-remove'><i class='glyphicon glyphicon-remove-sign'></i></span>\
					<div class='data-file-icon-big'>\
						<a target='_blank' href='" + link + "'>\
							<img src='" + link + "' />\
						</a>\
					</div>\
				</div>\
			";
      break;

    case 'slider':
      html = "\
				<div class='data-file data-file-slide {$classSlide} data-file-" + id + "'>\
					<span onclick='controlRemoveFile(this, " + id + ");' class='data-file-btn-remove'><i class='glyphicon glyphicon-remove-sign'></i></span>\
					<div class='data-file-slide-content'>\
						<a{$linkAttributes} href='" + link + "'>\
							<img src='" + link + "' />\
						</a>\
					</div>\
				</div>\
			";
      break;

    default:
      html = "\
				<div class='data-file data-file-list data-file-" + id + "'>\
					<span onclick='controlRemoveFile(this, " + id + ");return false;'class='data-file-list-btn-remove'><i class='glyphicon glyphicon-remove-sign'></i></span>\
					<div class='data-file-list-title'>\
						<a target='_blank' href='" + link + "'>\
							<img src='" + icon + "' />" + title + "\
						</a>\
					</div>\
				</div>\
			";
      break;
  }

  return html;
}


function controlSelectFiles(elt, mode, displayMode) {

  if(typeof(mode) == "undefined")
    mode = "single";

  if(typeof(displayMode) == "undefined")
    displayMode = "thumb";

  openFileManager({

    'selectionMode': mode,

    'fnCallback': function(files) {

      if(!files)
        return false;

      var ids = $$1(elt).parents(".form-group-files").find("input[type=hidden]").val();
      if(!ids)
        ids = "";

      if(mode == "single") {

        if(files.length > 0) {
          var content = controlGetSelectFile(files[0], displayMode);
          $$1(elt).parents(".form-group-files").find(".data-files").html(content);
          ids = files[0].id;
        }
      } else {

        for(var i = 0; i <= files.length - 1; i++) {
          var content = controlGetSelectFile(files[i], displayMode);
          $$1(elt).parents(".form-group-files").find(".data-files").append(content);
          ids += (ids.length <= 0) ? files[i].id : "," + files[i].id;
        }
      }

      $$1(elt).parents(".form-group-files").find("input[type=hidden]").val(ids);

      if(files.length > 0) {
        if($$1(elt).parents(".form-group-files").find(".btn-data-remove-files").length > 0)
          $$1(elt).parents(".form-group-files").find(".btn-data-remove-files").show();
      }

      closeFileManagerModal();
    }
  });
}

function controlRemoveFile$1(elt, id) {
  const $elt = $$1(elt);

  var ids = $elt.parents(".form-group-files").find("input[type=hidden]").val();
  if(!ids) {
    return false;
  }

  var idsFinal = "";
  var arrayIds = ids.split(",");

  for(var i = 0; i <= arrayIds.length - 1; i++) {
    if(arrayIds[i] != id) {
      idsFinal += (idsFinal.length <= 0) ? arrayIds[i] : "," + arrayIds[i];
    }
  }

  $elt.parents(".form-group-files").find("input[type=hidden]").val(idsFinal);
  $elt.parents(".data-file").remove();

  formModyfied($elt);
}

function controlRemoveFiles(elt) {

  if(!confirm("Attention, vous allez retirer tous les fichier ?\r\nSouhaitez-vous continuer ?"))
    return;

  $$1(elt).parents(".form-group-files").find("input[type=hidden]").val("");

  if($$1(elt).parents(".form-group-files").find(".data-files .data-file-slider").length > 0) {
    $$1(elt).parents(".form-group-files").find(".data-files .data-file-slider .data-file-slide").remove();
  } else {
    $$1(elt).parents(".form-group-files").find(".data-files").html("");
  }
  $$1(elt).hide();
}

function finalizeSaveFolder(json) {
  const manager = myFilemanager();

  if(!json) return false;

  if(json.id) {

    $$1("#form-folder #id").val(json.id);
    $$1("#form-folder #folder").val(json.folderName);
    $$1("#form-folder").find("#idparent").val(0);

    if(manager) {
      $$1("#form-folder").find("#root").val(manager.uid);
      manager.refresh();
    }
  }
}

function controlSelectFilesDirect(elt, mode) {

  if(typeof(mode) == "undefined")
    mode = "single";

  var nbElt = $$1(elt).parents(".form-group-files").find(".data-files .data-file").length;

  if(mode == "single" && nbElt > 0) {
    alert('Vous devez supprimer le document existant avant de pouvoir en déposer un nouveau');
    return false;
  }

  return true;
}

window.controlSelectFiles = controlSelectFiles;
window.controlRemoveFile = controlRemoveFile$1;
window.controlRemoveFiles = controlRemoveFiles;
window.finalizeSaveFolder = finalizeSaveFolder;
window.controlSelectFilesDirect = controlSelectFilesDirect;


function filesManager() {
  const $fm = $$1('#filemanager-container');
  if(!$fm.length) { return; }

  myFilemanager({
    'container': $fm,
    'selectionMode': 'single'|'multi'|'none',
    'displayMode': 'thumb'|'detail',
    fnCallback() { closeFileManagerModal(); }
  })
    .init();
}

// import 'blueimp-file-upload';

function profile() {
  var url = rootURL("/query?q=uploader&type=user");

  $$1('#progress-upload .progress-bar').css('width', '0');

  $$1('#fileupload').fileupload({

    url: url,
    dataType: 'json',
    progressall: function(e, data) {

      var progress = parseInt(data.loaded / data.total * 100, 10);
      $$1("#progress-upload").show();
      $$1('#progress-upload .progress-bar').css('width', progress + '%');
    },
    done: function(e, data) {

      $$1("#progress-upload").hide();
      $$1('#progress-upload .progress-bar').css('width', '0');

      var json = data.result;

      // FIXME: Fix to return promise and to skip all the 'isXX' calls

      if(isAjaxError(json)) return displayError$1(json.msg);

      if(json.pictureFilename) {

        $$1('#type-avatar option:first').prop('value', json.pictureFilename);

        $$1("#form-profil .picture").html("<img class='img-responsive' src='" + json.pictureFilename + "?rnd=" + (Math.random() * 999999) + "' />");
        $$1("#form-profil #btn-remove-profil-picture").show();

        $$1('#type-avatar').val($$1("#type-avatar option:first").val());

        $$1("#picture-profil-container").find("img").attr("src", json.pictureFilename + "?rnd=" + (Math.random() * 999999));
      }

      displaySuccess$1(json.msg);
    }
  }).prop('disabled', !$$1.support.fileInput).parent().addClass($$1.support.fileInput ? undefined : 'disabled');

  $$1('#type-avatar').unbind('change').change(function() {

    if($$1(this).val().length > 0) {
      $$1('#avatar').prop('src', $$1(this).val());
      $$1('#avatar').show(250);
    } else
      $$1('#avatar').hide(250);

    if($$1(this).val() == $$1(this).find('option').first().val()) {
      if($$1(this).val().length > 0)
        $$1('#btn-remove-profil-picture').show(250);
    } else {
      if($$1(this).val().length > 0)
        $$1('#btn-remove-profil-picture').hide(250);
    }

  });
}

function defaultClick(obj) {
  if($$1(obj).prop('checked') === true) {
    $$1(obj).closest('tr').find('td input.profil-other:checked').each(function() {
      $$1(this).prop('checked', false);
    });
  } else {
    if($$1(obj).closest('tr').find('td input:checked').length === 0)
      $$1(obj).closest('tr').find('td input[value="0"]').prop('checked', true);
  }
}

function otherClick(obj) {
  if($$1(obj).prop('checked') === true) {
    $$1(obj).closest('tr').find('td input.profil-default:checked').each(function() {
      $$1(this).prop('checked', false);
    });

    if($$1(obj).val() === '0') {
      $$1(obj).closest('tr').find('td input.profil-other:checked').each(function() {
        if($$1(this).val() !== '0')
          $$1(this).prop('checked', false);
      });
    } else {
      $$1(obj).closest('tr').find('td input.profil-other:checked[value="0"]').each(function() {
        $$1(this).prop('checked', false);
      });
    }

    if($$1(obj).val() === '11') {
      $$1(obj).closest('tr').find('td input.profil-other[value="1"]').each(function() {
        $$1(this).prop('checked', true);
      });
    } else if($$1(obj).val() === '1100') {
      $$1(obj).closest('tr').find('td input.profil-other[value="100"]').each(function() {
        $$1(this).prop('checked', true);
      });
    } else if($$1(obj).val() === '11100') {
      $$1(obj).closest('tr').find('td input.profil-other[value="100"]').each(function() {
        $$1(this).prop('checked', true);
      });
      $$1(obj).closest('tr').find('td input.profil-other[value="1100"]').each(function() {
        $$1(this).prop('checked', true);
      });
    }
  } else {
    if($$1(obj).val() === '1') {
      $$1(obj).closest('tr').find('td input.profil-other:checked[value="11"]').each(function() {
        $$1(this).prop('checked', false);
      });
    } else if($$1(obj).val() === '100') {
      $$1(obj).closest('tr').find('td input.profil-other:checked[value="1100"]').each(function() {
        $$1(this).prop('checked', false);
      });
      $$1(obj).closest('tr').find('td input.profil-other:checked[value="11100"]').each(function() {
        $$1(this).prop('checked', false);
      });
    } else if($$1(obj).val() === '1100') {
      $$1(obj).closest('tr').find('td input.profil-other:checked[value="11100"]').each(function() {
        $$1(this).prop('checked', false);
      });
    }

    if($$1(obj).closest('tr').find('td input:checked').length === 0) {
      $$1(obj).closest('tr').find('td input[value="0"]').prop('checked', true);
    }
  }
}

function removeChoiceAccess(obj) {
  $$1(obj).closest('tr')
    .css('display', 'none')
    .find('input:checkbox')
    .prop('checked', false)
    .first()
    .prop('checked', true);
}

const choicesAccess = [1, 11, 100, 1100, 11100, 100000, 0];

function addChoiceAccess($obj, choiseType, typeRelation, name) {
  $obj = $$1($obj);

  const $table = $obj
    .nextAll('.table-selector')
    .find(`.table-${choiseType}s-relation tbody`);

  const $lineHidden = $table
    .find(`input[name=${typeRelation}]:checkbox:first`)
    .closest('tr:hidden');

  if($lineHidden.length > 0) {
    $lineHidden.css('display', 'table-row');
    return;
  }

  const cells = choicesAccess.map((entry) => {
    return `
    <td align="center">
      <input class="profil-other" class="selector" type="checkbox" value="${entry}" name="${typeRelation}" />
    </td>`;
  });

  cells.push(`<td>
    <i class="glyphicon glyphicon-user"></i>
    <label>${name}</label>
  </td>`);

  const $def = $$1(`<td style="text-align:center;display:none;">
    <input class="profil-default" checked="checked" class="selector" type="checkbox" value="none" name="${typeRelation}" />
  </td>`).click((e) => defaultClick(e.currentTarget));

  const $del = $$1(`<td align="center">
    <i style="cursor:pointer;font-size:18px;" class="tooltiped glyphicons glyphicons-remove-circle" data-toggle="tooltip" data-title="Retirer de la liste"></i>
  </td>`).click((e) => removeChoiceAccess(e.currentTarget))

  $$1(`<tr></tr>`)
    .append($def)
    .append(cells)
    .append($del)
    .appendTo($table)
    .find('.profil-other').click((e) => otherClick(e.currentTarget));
}

function removeChoiceAffectation($obj) {
  $$1($obj)
    .closest('tr')
    .css('display', 'none')
    .find('input:radio')
    .prop('checked', false)
    .first().prop('checked', true);
}

function addChoiceAffectation($obj, typeChoice, typeRelation, name) {
  const $table = $$1($obj)
    .nextAll('.table-selector')
    .find(`.table-${typeChoice}s-relation tbody`);

  const $lineHidden = $table.find(`input[name=${typeRelation}]:radio:first`).closest('tr:hidden');
  if($lineHidden.length > 0) {
    $lineHidden
      .css('display', 'table-row')
      .find('input[value=ok]:radio')
      .prop('checked', true);

    return;
  }

  const $row = $$1(`
    <tr>
      <td style="text-align:center;display:none;">
        <input class="selector" type="radio" value="none" name="${typeRelation}" />
      </td>
      <td style="text-align:center;">
        <input class="selector" checked="checked" type="radio" value="ok" name="${typeRelation}" />
      </td>
      <td>
        <label>${name}</label>
      </td>
      <td align="center">
        <i style="cursor:pointer;font-size:18px;" class="tooltiped glyphicons glyphicons-remove-circle" data-toggle="tooltip" data-title="Retirer de la liste"></i>
      </td>
    </tr>
  `).appendTo($table);

  $row.find('.tooltiped').click((e) => removeChoiceAffectation(e.currentTarget));
}

function removeChoiceFieldAffectation($obj) {
  $$1($obj).closest('tr').remove();
}

function addChoiceFieldAffectation(obj, typeChoice, typeRelation, name) {
  const $table = $$1(`#table-${typeChoice}s tbody`);
  const $lineHidden = $$1(`input.ck-${typeChoice}:radio:first`).closest('tr:hidden');

  if($lineHidden.length > 0) {
    $lineHidden.css('display', 'table-row');
    $lineHidden.find(`input[value=${typeRelation}]:radio`).prop('checked', true);
    return;
  }

  const $row = $$1(`<tr>
    <td style="text-align:center;">
      <input id="ck-${typeChoice}-${typeRelation}" class="ck-${typeChoice}" checked="checked" type="radio" name="${typeChoice}s-${typeRelation}" value="${typeRelation}" />
    </td>
    <td>
      <label>${name}</label>
    </td>
    <td align="center">
      <i style="cursor:pointer;font-size:18px;" class="tooltiped glyphicons glyphicons-remove-circle" data-toggle="tooltip" data-title="Retirer de la liste"></i>\
    </td>
  </tr>`).appendTo($table);

  $row.find('.tooltiped').click((e) => removeChoiceFieldAffectation(e.currentTarget));
}

function clickOpenCardUser(iduser) {
  $$1('#user-idcard').data('hover', iduser);
  $$1('#user-idcard').data('close', 0);

  $$1('#user-idcard').css('top', '110px').css('left', '50%').css('margin-left', '-275px');

  $$1('#user-idcard .modal-body').html(getDivMiniLoading());
  $$1('#user-idcard').show();

  consultUser(iduser);
}

function clickOptionPublishedAuto() {
  $$1('#published-mode-creator').prop('checked', false);
  $$1('#published-mode-admin').prop('checked', false);
}

function clickOtherOptionPublished() {
  $$1('#published-mode-auto').prop('checked', false);
}

function finalizeSaveUserForm(json) {
  if(json.username) $$1("#user-modal .modal-header .modal-title").html(json.username);
}

function removeProfilPicture() {
  execQuery("remove-profil-picture")
    .then((json) => {
      displaySuccess$1(json.msg);
      $$1('#type-avatar option:first').prop('value', '');
      $$1("#form-profil #avatar").hide(250);
      $$1("#form-profil #btn-remove-profil-picture").hide(250);
    });
}

// import 'public-source/js/addins/jquery/dataTables';

function initSelectChoiceModal(idUniqueTab, typeSelectChoice, titleModal, tableChoice) {
  if($$1(`#${typeSelectChoice}-modal-${idUniqueTab}`).length > 0) {
    return;
  }

  // FIXME: Setup table from CSS
  // FIXME: Move HTML out of JS?
  $$1(document.body).append(`
    <div class="modal" id="${typeSelectChoice}-modal-${idUniqueTab}" tabindex="-1" role="dialog">
      <div class="modal-dialog" style="width:95%;">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>
            <h2 class="modal-title">${titleModal}</h2>
          </div>
          <div class="modal-body">
            <div style="margin:15px 20px 0;">
              ${tableChoice}
            </div>
          </div>
          <div class="modal-footer">
            <button id="validAddSelectChoiceUserGroup" class="btn btn-success pull-rigth" data-dismiss="modal" type="button" style="margin:0 5px;">Valider</button>
          </div>
        </div>
      </div>
    </div>
  `);
}


function initSelectChoiceUserModal(idUniqueTab) {
  const tableUser = `
  <table id="tableSelectChoiceUser${idUniqueTab}" style="width:100%" class="table table-striped table-bordered display dataTable no-footer DTTT_selectable">
    <thead>
      <tr>
        <th style="width:10px">&nbsp;</th>
        <th>Nom</th>
        <th>Prénom</th>
      </tr>
    </thead>
  </table>
  `;

  initSelectChoiceModal(idUniqueTab, 'selectChoiceUser', 'Utilisateurs', tableUser);
}

function initSelectChoiceRoleModal(idUniqueTab) {
  const tableRole = `
  <table id="tableSelectChoiceRole${idUniqueTab}" style="width:100%" class="table table-striped table-bordered display dataTable no-footer DTTT_selectable">
    <thead>
      <tr>
        <th style="width:10px">&nbsp;</th>
        <th>Role</th>
      </tr>
    </thead>
  </table>
  `;

  initSelectChoiceModal(idUniqueTab, 'selectChoiceRole', 'Roles', tableRole);
}

function initSelectChoiceGroupModal(idUniqueTab) {
  const tableGroup = `
  <table id="tableSelectChoiceGroup${idUniqueTab}" style="width:100%" class="table table-striped table-bordered display dataTable no-footer DTTT_selectable">
    <thead>
      <tr>
        <th style="width:10px">&nbsp;</th>
        <th>Nom</th>
      </tr>
    </thead>
  </table>
  `;

  initSelectChoiceModal(idUniqueTab, 'selectChoiceGroup', 'Groupes', tableGroup);
}

function columnChoice(idUniqueTab, typeChoice, typeAccessAffectation) {
  const choices = [{
    data: null,
    className: 'text-center',
    orderable: false,
    render(data) {
      const checked = data.active === 1 ? 'check' : 'unchecked';
      return `<i style="cursor:pointer;font-size:18px;" class="removeChoiceParent${typeAccessAffectation} glyphicons glyphicons-${checked}"></i>`;
    }
  }, {
    data: null,
    className: 'selectable',
    render() {}
  }];

  switch(typeChoice) {
    case 'group':
      initSelectChoiceGroupModal(idUniqueTab);
      choices[1].render = (data) => `
        <input class="idgroup" type="hidden" value="${data.idgroup}">
        <input class="name" type="hidden" value="${data.name}">
        <input class="selectChoiceGroupActive" type="hidden" value="${data.active}">
        ${data.name} [${data.idgroup}]
      `;

      break;

    case 'role':
      initSelectChoiceRoleModal(idUniqueTab);
      choices[1].render = (data) => `
        <input class="idrole" type="hidden" value="${data.idrole}">
        <input class="name" type="hidden" value="${data.name}">
        <input class="selectChoiceRoleActive" type="hidden" value="${data.active}">
        ${data.name}
      `;

      break;

    case 'user':
    default:
      initSelectChoiceUserModal(idUniqueTab);
      choices[1].render = (data) => `
        <input class="iduser" type="hidden" value="${data.iduser}">
        <input class="name" type="hidden" value="${data.content}">
        <input class="selectChoiceUserActive" type="hidden" value="${data.active}">
        ${data.lastname}
      `;

      choices.push({
        data: 'firstname',
        className: 'selectable'
      });
  }

  return choices;
}

// FIXME: This method doesn't really belong here. Move it to a correct place

function iniDataTable(obj, id, typeChoice, typeAccessAffectation, dtSettings, onActivate, onActive) {
  id = `#${id}`;

  if($$1.fn.DataTable.isDataTable(id)) {
    return;
  }

  const $dtElm = $$1(id);

  $dtElm.DataTable(
    Object.assign({
      dom: 'lTfiprtip',
      language: {
        processing: 'Traitement en cours...',
        search: 'Rechercher&nbsp;:',
        lengthMenu: 'Afficher _MENU_ &eacute;l&eacute;ments',
        info: 'Affichage de l\'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments',
        infoEmpty: 'Affichage de l\'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments',
        infoFiltered: '(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)',
        infoPostFix: '',
        loadingRecords: 'Chargement en cours...',
        zeroRecords: 'Aucun &eacute;l&eacute;ment &agrave; afficher',
        emptyTable: 'Aucune donnée disponible dans le tableau',
        paginate: {
          first: 'Premier',
          previous: 'Pr&eacute;c&eacute;dent',
          next: 'Suivant',
          last: 'Dernier'
        },
        aria: {
          sortAscending: ': activer pour trier la colonne par ordre croissant',
          sortDescending: ': activer pour trier la colonne par ordre décroissant'
        }
      },
      order: [1, 'asc'],
      lengthMenu: [
        [10, 50, 100, -1],
        [10, 50, 100, 'All']
      ],
      rowCallback($row) {
        $row = $$1($row);
        if($row.find(`.selectChoice${typeChoice[0] + typeChoice.substr(1)}Active`).val() === 1) {
          $row.addClass('active');
        }
      }
    }, dtSettings)
  );

  $dtElm.find('tbody').on('click', 'tr', function() {
    const $tr = $$1(this);
    if($tr.hasClass('active')) {
      onActive($tr);
    } else {
      $tr.addClass('active')
        .find('td:first')
        .html(`<i style="cursor:pointer;font-size:18px;" class="removeChoiceParent${typeAccessAffectation} glyphicons glyphicons-check"></i>`);

      if(typeof cb === 'function') {
        let name = $tr.find('.name').val();
        const typeId = $tr.find(`.id${typeChoice}`).val();
        const typeRelation = `${typeChoice}-relation-${typeId}`;
        if(typeChoice === 'group') {
          name = `${name} [${typeId}]`;
        }
        onActivate(obj, typeChoice, typeRelation, name);
      }
    }
  });
}

// import 'public-source/js/core/jquery-bundles/tooltip-popover';

const map = {
  popover: '[data-toggle="popover"]',
  'table-users': '#table-users tbody',
  'table-groups': '#table-groups tbody'
};

function appItem(id) {
  let $item = map[id];

  if(!$item) {
    $item = map[id] = $$1(`#${id}`);
  }

  if(isString($item)) {
    $item = map[id] = $$1($item);
  }

  return $item;

}

let apps = {};

function appApps(type, id, newApp) {
  let app = apps[type];
  if(!app) {
    app = apps[type] = {};
  }

  if(typeof id === 'object') {
    [id, newApp] = [id.id, id];
    if(!id) {
      return apps[type] = newApp || {};
    }
  }

  id = Number(id);

  if(isNumber(id)) {
    if(typeof newApp === 'object') {
      app[id] = newApp;
    }

    return app[id] || {};
  }

  return app;
}

let users$1 = {};

function appUsers(newUsers) {
  if(typeof newUsers === 'object') {
    users$1 = newUsers || {};
  }

  return users$1;
}

let groups = {};

function appGroups(newGroups) {
  if(typeof newGroups === 'object') {
    groups = newGroups || {};
  }

  return groups;
}

let $colorDisplays;

function colorDisplays() {
  if(!$colorDisplays) {
    $colorDisplays = appItem('app-background-color').parents('.form-group:first').find('.input-group-addon')
      .add(appItem('app-text-color').parents('.form-group:first').find('.input-group-addon'))
      .add(appItem('app-preview-color'));
  }

  return $colorDisplays;
}

function getAppById(id = appItem('app-id').val()) {
  const $elm = $(`#${id}`);
  if(!$elm.length) {
    return null;
  }
  const apps = appApps($elm.attr('data-type'));
  return apps[id] || null;
}

function countUsersGroupsAffectation() {
  const appUsersCount = $$1('.ck-user:checked').length;
  const appGroupsCount = $$1('.ck-group:checked').length;
  const appUsersGroupsCount = appUsersCount + appGroupsCount;

  $$1('.app-users-count').html(` (${appUsersCount})`);
  $$1('.app-groups-count').html(` (${appGroupsCount})`);
  $$1('.app-users-groups-count').html(` (${appUsersGroupsCount})`);
}

function removeChoiceAppAffectationParent(obj, typeChoice, typeRelation) {
  const $tr = $$1($elm).closest('tr');
  const id = $tr.find(':radio').val();
  const app = getAppById();

  if(app && app.users) {
    const index = app.users.indexOf(id);
    if(index > -1) {
      app.users.splice(index, 1);
    }
  }

  $$1(`#table-${typeChoice}s tbody`)
    .find('input[value=${typeRelation}]:radio')
    .first().closest('tr').remove();

  countUsersGroupsAffectation();
}

function removeChoiceFieldAffectationParent(obj, typeChoice, typeRelation) {
  $$1(`#ck-${typeChoice}-${typeRelation}:radio`).closest('tr').remove();
}

function removeChoiceAffectationParent($obj, typeChoice, typeRelation) {
  $$1($obj)
    .nextAll('.table-selector')
    .find(`table.table-${typeChoice}s-relation tbody input[name=${typeRelation}]:radio`)
    .prop('checked', false)
    .first()
    .prop('checked', true)
    .closest('tr').css('display', 'none');
}

function removeChoiceAccessParent(obj, typeChoice, typeRelation) {
  const $input = $$1(obj)
    .nextAll('.table-selector')
    .find(`.table-${typeChoice}s-relation tbody input[name=${typeRelation}]:checkbox`);

  $input
    .prop('checked', false)
    .first().prop('checked', true)
    .closest('tr').css('display', 'none');
}

function removeSelectChoice($elm, obj, typeRemove, typeChoice, typeChoiceMaj, typeAccessAffectation) {
  const $tr = $$1($elm).closest('tr');

  if($tr.hasClass('active')) {
    return true;
  }

  const typeId = $tr.find(`.id${typeChoice}`).val();
  const typeRelation = `${typeChoice}-relation-${typeId}`;

  // FIXME: This should be restructured, as it includes dependencies on a bundle
  switch(typeRemove) {
    case 'removeChoiceParentviewsAffectation':
      removeChoiceAffectationParent(obj, typeChoice, typeRelation);
      break;
    case 'removeChoiceParentappsAffectation':
      removeChoiceAppAffectationParent(obj, typeChoice, typeId);
      break;
    case 'removeChoiceParentfieldsAffectation':
      removeChoiceFieldAffectationParent(obj, typeChoice, typeId);
      break;
    default:
      removeChoiceAccessParent(obj, typeChoice, typeRelation);
  }

  $tr
    .removeClass('active')
    .find(`.selectChoice${typeChoiceMaj}Active`).val(0);

  $tr.find('td:first').html(`<i style="cursor:pointer;font-size:18px;" class="removeChoiceParent${typeAccessAffectation} glyphicons glyphicons-unchecked"></i>`);

  return false;
}

// import 'bootstrap-stylus/js/modal';

//when used with dataField configuration we can have a problem with the "Ajouter un groupe" button which can be recreated.
//This allow us to udpate the current obj linked to the opened selectChoiceGroup modal
var _currentObjSelectChoice;

function currentObjSelectChoice(newObj) {
  if(newObj) {
    _currentObjSelectChoice = newObj;
  }
  return _currentObjSelectChoice;
};

function selectChoiceUserGroup(obj, typeChoice, typeAccessAffectation, cb, idsElements, options) {
  // FIXME: The ':visible' does not make sense - investigate to remove it
  const idUniqueTab = $$1('div:visible #iddata-display').val() || $$1('div:visible #iddata-type:visible').val();

  if(!idUniqueTab) {
    return;
  }

  const typeChoiceMaj = typeChoice[0].toUpperCase() + typeChoice.substr(1);
  const idTable = `tableSelectChoice${typeChoiceMaj}${idUniqueTab}`;
  const columns = columnChoice(idUniqueTab, typeChoice, typeAccessAffectation);

  $$1(`#selectChoice${typeChoiceMaj}-modal-${idUniqueTab}`).modal('show');

  const dtSettings = {
    ajax: {
      type: 'POST',
      url: rootURL(`/query?q=get-select-choice-${typeChoice}`),
      data: {
        typeAccessAffectation: typeAccessAffectation,
        iddataType: $$1('#iddata-type').val(),
        iddataDisplay: $$1('#iddata-display').val(),
        appButtonId: $$1('#app-id').val(),
        appButtonType: $$1('#app-type').val(),
        hideAllUsers: options ? !!options.hideAllUsers : false,
        idsElements
      }
    },

    columns
  };

  const callback = (obj, typeChoice, typeRelation, name) => {
    cb(currentObjSelectChoice(), typeChoice, typeRelation, name);
  };

  iniDataTable(currentObjSelectChoice(obj), idTable, typeChoice, typeAccessAffectation, dtSettings, callback, ($tr) => {
    if($tr.find('.removeChoiceParentdatatypeAccess').length > 0) {
      removeSelectChoice($tr, currentObjSelectChoice(), 'removeChoiceParentdatatypeAccess', typeChoice, typeChoiceMaj, typeAccessAffectation);
    } else if($tr.find('.removeChoiceParentviewsAffectation').length > 0) {
      removeSelectChoice($tr, currentObjSelectChoice(), 'removeChoiceParentviewsAffectation', typeChoice, typeChoiceMaj, typeAccessAffectation);
    }
  });
}

// import 'bootstrap-stylus/js/modal';

function selectChoiceUserGroupField(obj, typeChoice, typeAccessAffectation, cb) {
  let idUniqueTab = $$1('#id').val();
  if(!idUniqueTab) {
    return;
  }

  idUniqueTab = `field-${idUniqueTab}`;

  const typeChoiceMaj = typeChoice[0].toUpperCase() + typeChoice.substr(1);
  const idTable = `tableSelectChoice${typeChoiceMaj}${idUniqueTab}`;
  const columns = columnChoice(idUniqueTab, typeChoice, typeAccessAffectation);

  $$1(`#selectChoice${typeChoiceMaj}-modal-${idUniqueTab}`).modal('show');

  const dtSettings = {
    ajax: {
      type: 'POST',
      url: rootURL(`/query?q=get-select-choice-${typeChoice}`),
      data: {
        typeAccessAffectation: typeAccessAffectation,
        iddataType: $$1('#iddata-type').val(),
        uidField: $$1('#id').val()
      }
    },

    columns
  };

  iniDataTable(obj, idTable, typeChoice, typeAccessAffectation, dtSettings, cb, ($tr) => {
    if($tr.find('.removeChoiceParentfieldsAffectation').length > 0) {
      removeSelectChoice($tr, obj, 'removeChoiceParentfieldsAffectation', typeChoice, typeChoiceMaj, typeAccessAffectation);
    }
  });
}

function finalizeSaveGroup(json) {
  if(!json) return false;
  if(json.idgroup) $$1("#form-group #idgroup").val(json.idgroup);
}

function deleteUsersQuery(ids) {
  tablerSetLoading($$1("#tabler-users"), true);

  execQuery("delete-users", {
      ids
    }, false)
    .then((json) => {
      tablerSetLoading($$1("#tabler-users"), false);

      json.idsDeleted.forEach((id) => {
        $$1(`#tabler-users-admin .tabler-body .tabler-row.tabler-row-${id}`).remove();
      });

      var nbDataOld = $$1('.page-header .tabler-total-records').find('#nbTotalRecord').html();
      if(parseInt(nbDataOld) > 0) {
        var nbDataNew = parseInt(nbDataOld) - json.idsDeleted.length;
        $$1('#nbTotalRecord').html(nbDataNew);
      }

      return displaySuccess$1(json.msg);
    });
}

function deleteUsers() {

  if($$1("#tabler-users-admin .tabler-body .tabler-row .tabler-cell-selector input[type=checkbox]:checked").length <= 0) return alert("Merci de cocher au moins un utilisateur dans la liste");
  if(!confirm("Attention, vous allez supprimer un ou plusieurs utilisateurs.\r\nSouhaitez-vous continuer ?")) return;

  var ids = new Array();
  $$1("#tabler-users-admin .tabler-body .tabler-row .tabler-cell-selector input[type=checkbox]:checked").each(function() {
    ids.push($$1(this).val());
  });

  deleteUsersQuery(ids);
}

window.addChoiceAccess = addChoiceAccess;
window.addChoiceAffectation = addChoiceAffectation;
window.addChoiceFieldAffectation = addChoiceFieldAffectation;
window.clickOpenCardUser = clickOpenCardUser;
window.clickOptionPublishedAuto = clickOptionPublishedAuto;
window.clickOtherOptionPublished = clickOtherOptionPublished;
window.consultUser = consultUser;
window.defaultClick = defaultClick;
window.finalizeSaveUserForm = finalizeSaveUserForm;
window.otherClick = otherClick;
window.removeChoiceAccess = removeChoiceAccess;
window.removeChoiceAffectation = removeChoiceAffectation;
window.removeChoiceFieldAffectation = removeChoiceFieldAffectation;
window.removeProfilPicture = removeProfilPicture;
window.selectChoiceUserGroup = selectChoiceUserGroup;
window.selectChoiceUserGroupField = selectChoiceUserGroupField;
window.finalizeSaveGroup = finalizeSaveGroup;
window.deleteUsers = deleteUsers;

function initUserModal() {
  if($$1(document).find("#user-idcard").length > 0) return;

  $$1("body").append('\
		<div id="user-idcard" tabindex="-1" role="dialog" style="display: none;">\
			<div class="modal-content">\
				<div class="modal-body">\
				</div>\
			</div>\
		</div>\
	');

  $$1('#user-idcard').on('mouseenter', function() {
    $$1(this).data('close', 0);
  }).on('mouseleave', function(evt) {
    if($$1(evt.currentTarget).parents('#user-idcard').length == 0) {
      $$1('#user-idcard').data('close', $$1('#user-idcard').data('hover'));
      $$1('#user-idcard').hide(); /*"clip", null, "fast"*/
    }
  });
}

function users() {
  initUserHover$1();
  initUserModal();
  profile();
}

const CTX$1 = {
  vars: {
    timers: {},
    tags: {}
  }
};

function openMenuMain() {
  flags().mouseMenuAllMain = true;
  $$1('.menuAll .submenu').show();
  $$1('.menuAll').fadeIn();
  $$1('html, body').css('overflow', 'hidden');
}

function initMenuMain() {
  $$1('#header .menuAllIconContainer').bind('mousedown', function() {
    if(flags().mouseMenuAllMain == true) {
      closeMenuMain();
    } else {
      openMenuMain();
    }
  }).bind('mouseleave', function() {
    flags().mouseMenuAllMain = false;
  });

  $$1('.menuAll').bind('mouseenter', function() {
    flags().mouseMenuAllMain = true;
  }).bind('mouseleave', function() {
    flags().mouseMenuAllMain = false;
  });

  $$1("#header .item:has(.menu)").not('#header .menuAllIconContainer .item:has(.menu)').bind("mousedown", function() {

    var current = $$1(this).find(".menu .submenu:first"); // retrieve current submenu

    if(typeof(current) !== "undefined") {
      $$1("#header .menu .submenu").not(current).hide(); // hide all others submenus
      $$1(current).fadeIn(); // show submenus
      flags().mouseMenuMain = true;
    } else {
      $$1("#header .menu .submenu").fadeOut();
    }

  }).bind("mouseleave", function() {
    flags().mouseMenuMain = false;
  });
}

function resizeMenuMobile() {
  $$1('#header-mobile-menu-container #header-mobile-menu-content').css('height', $$1(window).height() + 'px');
}

function initMenuMobile() {

  $$1("#header-mobile-menu-icon").bind('click', function() {
    $$1('#header-mobile-menu-container').addClass('expanded');
    resizeMenuMobile();
    $$1(document).find('html, body').css('overflow', 'hidden');
  });

  $$1('#header-mobile-menu-container').bind('mousedown', function() {
    flag().mouseMenuMobile = true;
  }).bind('mouseup', function() {
    setTimeout(function() {
      flag().mouseMenuMobile = false;
    }, 100);
  });
}

function getMenuMyDatas() {
  execQuery("get-menu-my-datas")
    .then((json) => {
      $$1(".menu-my-datas .menu-my-datas-container").html(base64Decode(json.content));

      tooltip();
      navTabs();
    })
    .catch(() => {
      $$1(".menu-my-datas .menu-my-datas-container").html("").hide();
    });
}


function initMenuMyDatas() {

  if(!$$1("#menu-my-datas").length) return;

  $$1("#menu-my-datas").unbind("mousedown").bind("mousedown", function(evt) {

    evt.stopPropagation();

    $$1("#header .menu").not($$1(this).find(".menu:first")).find(".submenu").hide();

    // create the menu-my-data-container
    if($$1(this).find(".menu-my-datas").find(".menu-my-datas-container").length <= 0)
      $$1(this).find(".menu-my-datas").append("<div class='menu-my-datas-container submenu'></div>");

    if(!$$1(this).find(".menu-my-datas").find(".menu-my-datas-container").is(":visible")) {
      $$1(this).find(".menu-my-datas").find(".menu-my-datas-container").fadeIn("fast");
      $$1(this).find(".menu-my-datas").find(".menu-my-datas-container").html("<br /><center>Chargement ...</center>");

      getMenuMyDatas();
    }

    return false;

  }).unbind("mouseenter").bind("mouseenter", function() {
    flag().mouseMenuMain = true;
  }).unbind("mouseleave").bind("mouseleave", function() {
    flag().mouseMenuMain = false;
  });
}

function exportPlatform() {
  execQuery('platform-export')
    .then((json) => {
      $$1('#contact-admin-form-modal').modal('hide');
      return displayMessage(json.msg);
    });
}

window.exportPlatform = exportPlatform;

function menuManager() {
  initMenuMain();
  initMenuMobile();
  initMenuMyDatas();

  $$1(window).resize(resizeMenuMobile);

  $$1(document)
    .bind('mouseup', function() {
      if(!flags().mouseMenuMobile) {
        var classe = $$1('#header-mobile-menu-container').attr('class');
        if(typeof(classe) == 'undefined') classe = '';
        if(classe.indexOf('expanded') >= 0) {
          $$1('#header-mobile-menu-container').removeClass('expanded');
          $$1(document).find('html, body').css('overflow', 'auto');
        }
      }
    })
    .bind("mousedown", function() {
      if(flags().mouseMenuMain !== true) setTimeout(function() {
        $$1("#header .menu .submenu").not('#header .menuAllIconContainer .menu .submenu').fadeOut();
      }, 200);

      if(flags().mouseMenuAllMain !== true) {
        setTimeout(function() {
          if($$1(document).find("body .modal-window-overlay:visible").length < 1 && $$1(".modal-loader-container:visible").length < 1 && $$1('.menuAll:visible').length > 0) {
            $$1(".menuAll").fadeOut();
            $$1('html, body').css('overflow', 'auto');
          }
        }, 200);
      }
    });
}

function hideOverlay() {

  if(vars.globalSearchContainerZIndex != null)
    $$1('#global-search-container').css('z-index', vars.globalSearchContainerZIndex);

  $$1('html').css('overflow', 'auto');
  $$1('#global-search-overlay').hide();
}

function closeSearchGlobal() {

  vars.lastGlobalSearchTable = "";
  vars.lastGlobalSearchGlobal = "";

  $$1("#global-search-block").removeClass('searchDegraded');

  $$1("#global-search-input").val("");

  $$1('#global-search-container-block').css('background-color', '#CCCBCB');
  $$1("#global-search-results").hide();
  $$1("#global-search-results #global-search-results-container").hide();
  $$1("#global-search-results #global-search-msg").hide();

  hideOverlay();

  $$1("#global-search-results #global-search-results-container").html("");
}

/**
 * Return search engine mode related to current existing and checked radiobox
 */
function getSearchEngineMode() {

  var mode = "global";

  if($$1("#global-search-table:checked").length > 0) mode = "table";
  if($$1("#global-search-table-admin:checked").length > 0) mode = "table-admin";

  return mode;
}

function updateSearchGlobal() {

  if($$1("#global-search-results .badge-type.active").data("id") === 0)
    return $$1("#global-search-results .result-type").show();


  $$1("#global-search-results .badge-type.active").each(function() {
    var dataType_id = $$1(this).data("id");
    $$1("#global-search-results .result-type-" + dataType_id).show();
  });

  $$1("#global-search-results .badge-type").not(".active").each(function() {
    var dataType_id = $$1(this).data("id");
    $$1("#global-search-results .result-type-" + dataType_id).hide();
  });
}

function initSearchGlobal() {
  $$1("#global-search-results .badge-type").bind("click", function() {
    var filtreActif = $$1(this).parent().find('.active');

    //Si un filtre était déjà sélectionné on l'enlève
    if(filtreActif.length > 0)
      $$1(filtreActif[0]).removeClass("active");

    ($$1(this).attr("class").indexOf("active") >= 0) ? $$1(this).removeClass("active"): $$1(this).addClass("active");
    updateSearchGlobal();
  });
}

function sendMailAdministrator(typeError, msgError) {
  execQuery("send_email_admin_recherche", {
    "typeError": typeError,
    "messageError": msgError
  });
}

if(typeof __elasticsearch === 'undefined') {
  __elasticsearch = '{}';
}
const esConfig = stringToJSON(__elasticsearch.replace(/&quot;/ig, '"'));

function searchTablerCallback(messages) {
  var ids = new Array();

  if(messages === null) {

  } else if(messages.status === 404) {
    //On envoie un mail avec le message d'erreur
    if(esConfig.esModeProd == true)
      sendMailAdministrator('indexElasticsearchError', 'Appel au moteur de recherche [Tabler] avec une erreur: ' + messages.error);

    vars.searchDegraded = true;
    timeSearchEngine(true, false);
    return;
  } else {
    var nbResult = messages.hits.total;

    //On verifie s'il y a des résultats
    if(nbResult > 0) {
      $$1.each(messages.hits.hits, function(key, hit) {
        ids.push(hit._source.iddata);
      });
    } else
      ids.push(0);
  }

  $$1(".tabler").each(function() {
    $$1(this).find("input[name=tabler-offset]").val(0);
    $$1(this).find("input[name=tabler-ids]").val(JSONToString(ids));
    tablerUpdate($$1(this));
  });
}

let timerGlobalSearch = null;
function showOverlay() {

  if(vars.globalSearchContainerZIndex == null)
    vars.globalSearchContainerZIndex = $$1('#global-search-container').css('z-index');

  //$('#global-search-container').css('z-index', 10000001);

  $$1('html').css('overflow', 'hidden');
  $$1('#global-search-overlay').css('z-index', vars.globalSearchContainerZIndex - 1).show();
}

function logSearch(mode) {
  if(trim$1(vars.currentGlobalSearch).length <= 0) return false;

  execQuery("log-search", {
    "mode": mode,
    "currentGlobalSearch": vars.currentGlobalSearch
  });
}

function launchSuggest(keywords, type) {
  var suggestGlobal = {
    "suggestType": type,
    "suggestQuery": {
      index: esConfig.esIndex,
      type: "datas",
      body: {
        "autosuggest": {
          "text": keywords,
          "completion": {
            "field": "suggest"
          }
        }
      }
    }
  };

  connection.emit('suggest', suggestGlobal);
}

function launchSearchTableAdmin(keywords, flagForce) {

  $$1("#global-search-results").hide();

  keywords = keywords.replace(/"/g, '');

  $$1(".tabler").each(function() {
    $$1(this).find("input[name=tabler-offset]").val(0);
    $$1(this).find("input[name=tabler-search]").val(keywords);
    tablerUpdate($$1(this));
  });
}

function launchSearchTable(keywords, flagForce) {
  $$1("#global-search-results").hide();

  if((!flagForce) && (keywords != vars.currentGlobalSearch)) return;

  if($$1(".tabler").length <= 0) return false;

  //On effectue la recherche elasticsearch et on prepare le tableau d'ids de retour
  keywords = trim$1(keywords);
  var firstCaracter = keywords.charAt(0);
  var lastCaracter = keywords.charAt(keywords.length - 1);
  var operatorSearch = 'or';
  if(firstCaracter === '"' && lastCaracter === '"')
    operatorSearch = 'and';
  var queryMatch = {
    match_all: {}
  };
  if(keywords === '')
    searchTablerCallback(null);
  else {
    var vars$$ = tablerGetVars($$1(".tabler"));
    var uid = vars$$.uidDataType;
    var filterSearch = {};
    if(uid !== '') {
      filterSearch = {
        "bool": {
          "must": [{
            "term": {
              "data_type_uid": uid
            }
          }]
        }
      };
    }

    var searchDatasTable = {
      "searchType": "datas_table",
      "searchQuery": {
        index: esConfig.esIndex,
        type: 'datas',
        body: {
          from: 0,
          size: 10000,
          min_score: esConfig.esMinScore,
          "sort": [{
              "iddata": "asc"
            },
            "_score"
          ],
          query: {
            match: {
              "_all": {
                "query": keywords,
                "operator": operatorSearch
              }
            }
          },
          filter: filterSearch,
          _source: ["iddata"]
        }
      }
    };

    connection.emit('search', searchDatasTable);
  }
}

function launchSearchGlobal(keywords, flagForce) {
  if((!flagForce) && (keywords != vars.currentGlobalSearch)) return;

  if(keywords == "") return closeSearchGlobal();

  $$1('#global-search-container-block').css('background-color', 'transparent');
  $$1("#global-search-results").show();
  vars.nameTimer = setInterval(imageLoading, 40);
  $$1("#global-search-results #global-search-msg").show();
  $$1("#global-search-results #global-search-results-container").hide();

  keywords = trim$1(keywords);
  var firstCaracter = keywords.charAt(0);
  var lastCaracter = keywords.charAt(keywords.length - 1);
  var operatorSearch = 'or';

  if(firstCaracter === '"' && lastCaracter === '"') {
    operatorSearch = 'and';
  }

  var boostTxt = [
    "data_title^" + esConfig.esBoostTitle,
    "data_type_title^" + esConfig.esBoostTitleType,
    "data_author^" + esConfig.esBoostAuthor,
    "kindex^" + esConfig.esBoostKindex,
    "content^" + esConfig.esBoostContent,
    "comment_author^" + esConfig.esBoostCommentAuthor,
    "comment^" + esConfig.esBoostComment,
    "attachment^" + esConfig.esBoostAttachement,
    "_all"
  ];

  if(isNumber(Number(keywords)))
    boostTxt = [
      "iddata^" + esConfig.esBoostId,
      "data_title^" + esConfig.esBoostTitle,
      "data_type_title^" + esConfig.esBoostTitleType,
      "data_author^" + esConfig.esBoostAuthor,
      "kindex^" + esConfig.esBoostKindex,
      "content^" + esConfig.esBoostContent,
      "comment_author^" + esConfig.esBoostCommentAuthor,
      "comment^" + esConfig.esBoostComment,
      "attachment^" + esConfig.esBoostAttachement,
      "_all"
    ];

  connection.emit('search', {
    'searchType': 'datas',
    'searchQuery': {
      index: esConfig.esIndex,
      type: 'datas',
      body: {
        from: 0,
        size: 10000,
        min_score: esConfig.esMinScore,
        "sort": [{
            "data_type_position": "asc",
            "data_type_title": "asc"
          },
          "_score"
        ],
        "query": {
          "multi_match": {
            "query": keywords,
            "operator": operatorSearch,
            "fields": boostTxt
          }
        },
        _source: ["iddata_type", "iddata", "data_type_title", "data_type_meta_datas", "content", "data_title", "summary", "comment"],
        "aggs": {
          "agg_data_type": {
            "terms": {
              "field": "data_type_position",
              "order": {
                "_term": "asc"
              }
            },
            "aggs": {
              "agg_data_type_title": {
                "terms": {
                  "field": "data_type_title"
                }
              },
              "agg_id_data_type": {
                "terms": {
                  "field": "iddata_type"
                }
              }
            }
          }
        }
      }
    }
  });
}

function timeSearchEngine(flagForce, autoComplete) {
  if(esConfig.esIndex === null) {
    if(esConfig.esModeProd == true)
      sendMailAdministrator('indexElasticsearchError', 'Appel au moteur de recherche avec un index null');

    vars.searchDegraded = true;
  }

  vars.currentGlobalSearch = $$1("#global-search-input").val();

  if(timerGlobalSearch !== null) clearTimeout(timerGlobalSearch);

  var mode = getSearchEngineMode();

  timerGlobalSearch = setTimeout(function() {
    if(vars.searchDegraded === true) {
      switch(mode) {
        case "table":
        case "table-admin":
          hideOverlay();

          if(!flagForce && vars.currentGlobalSearch == vars.lastGlobalSearchTable) return $$1("#global-search-results").hide();

          vars.lastGlobalSearchTable = vars.currentGlobalSearch;
          if(vars.currentGlobalSearch != '')
            $$1("#global-search-block").addClass('searchDegraded');
          else
            $$1("#global-search-block").removeClass('searchDegraded');
          logSearch(mode);
          launchSearchTableAdmin(vars.currentGlobalSearch, flagForce); //launchSearchTableAdmin
          break;

        case "global":
          if(vars.currentGlobalSearch == '') {
            $$1("#global-search-block").removeClass('searchDegraded');
            hideOverlay();
            $$1("#global-search-results").hide();
            return;
          }

          showOverlay();
          $$1("#global-search-block").addClass('searchDegraded');

          if(vars.currentGlobalSearch.length > 0 && csearchVars.urrentGlobalSearch.length < 3) {
            $$1("#global-search-results #global-search-msg").html('Veuillez taper au moins 3 caractères ...');
            $$1("#global-search-results").show();
            $$1("#global-search-results #global-search-msg").show();
            $$1("#global-search-results #global-search-results-container").hide();
            vars.lastGlobalSearchGlobal = vars.currentGlobalSearch;
            return;
          } else {
            $$1("#global-search-results #global-search-msg").html('<div class="msg-loading">\
								<p style="color:#666666;">Recherche en cours</p>\
								<div class="loading"></div>\
							</div>');
          }

          if(!flagForce && vars.currentGlobalSearch == vars.lastGlobalSearchGlobal)
            return;

          vars.lastGlobalSearchGlobal = vars.currentGlobalSearch;

          $$1("#global-search-results").show();
          $$1("#global-search-results #global-search-msg").show();
          $$1("#global-search-results #global-search-results-container").hide();
          vars.nameTimer = setInterval(imageLoading, 40);

          logSearch(mode);

          var keywords = vars.currentGlobalSearch;
          execQuery("get-search-results", {
              "keywords": vars.currentGlobalSearch
            })
            .then((json) => {
              if(vars.currentGlobalSearch === keywords) {
                $$1("#global-search-results #global-search-msg").hide();
                clearInterval(vars.nameTimer);
                vars.nameTimer = null;
                $$1("#global-search-results #global-search-results-container").html(base64Decode(json.results));
                $$1("#global-search-results #global-search-results-container").addClass('searchDegraded');
                $$1("#global-search-results #global-search-results-container").show();

                initSearchGlobal();
              }
            });
          break;
      }

      return;
    }

    //logguer la recherche utilisateur
    logSearch(mode);

    $$1("#global-search-block").removeClass('searchDegraded');
    switch(mode) {

      case "table-admin":

        hideOverlay();

        $$1('#suggest-container').remove();

        if(vars.currentGlobalSearch == vars.lastGlobalSearchTable) return $$1("#global-search-results").hide();

        vars.lastGlobalSearchTable = vars.currentGlobalSearch;
        launchSearchTableAdmin(vars.currentGlobalSearch, flagForce); //launchSearchTableAdmin
        break;

      case "table":

        hideOverlay();

        $$1('#suggest-container').remove();

        if(vars.currentGlobalSearch == vars.lastGlobalSearchTable) return $$1("#global-search-results").hide();

        vars.lastGlobalSearchTable = vars.currentGlobalSearch;
        launchSearchTable(vars.currentGlobalSearch, flagForce); //launchSearchTable
        break;

      case "global":

        //On supprime la div d'autocompletion pour les tableaux dans le cas d'une recherche global
        $$1('#suggest-container').remove();
        //Si pas de keyword on masque la fenetre de résultats
        if(vars.currentGlobalSearch === '') {
          hideOverlay();
          return $$1("#global-search-results").hide();
        }
        showOverlay();

        if(autoComplete) launchSuggest(vars.currentGlobalSearch, 'datas');

        if(vars.currentGlobalSearch == vars.lastGlobalSearchGlobal) return $$1("#global-search-results").show();

        vars.lastGlobalSearchGlobal = vars.currentGlobalSearch;
        launchSearchGlobal(vars.currentGlobalSearch, flagForce); //launchSearchGlobal
        break;
    }
  }, 700);
}

function keywordsSearch(textSearch) {

  $$1('#global-search-input').val('"' + textSearch + '"');
  vars.autoCompletion = null;
  timeSearchEngine(true, false);
}

window.closeSearchGlobal = closeSearchGlobal;


function texteLimitNbWord(summary, max) {
  var nouvelleChaine = '';
  var finChaine = ' ...';
  var chaineTab = summary.split(' ');
  var nbWordSummary = chaineTab.length;
  var nbWord = 0;

  if(nbWordSummary < max) {
    nbWord = nbWordSummary;
    finChaine = '';
  } else
    nbWord = max;

  for(var i = 0; i < nbWord; i++) {
    nouvelleChaine += ' ' + chaineTab[i];
  }

  return nouvelleChaine + finChaine;
}

function suggestDatasCallback(messages) {
  if(messages.status === 404)
    return;

  var listSuggest = '';

  if(typeof(messages.autosuggest) != 'undefined' && messages.autosuggest[0].options.length > 0) {
    $$1.each(messages.autosuggest[0].options, function(key, suggest) {
      listSuggest += '<li>' + suggest.text + '</li>';
    });

    vars.autoCompletion = '<div id="suggest-container-global"><ul><span>Affinez votre recherche:&nbsp;</span>' + listSuggest + '</ul></div>';
  } else
    vars.autoCompletion = null;
}

function suggestTablerCallback(messages) {
  if(messages.status === 404)
    return;

  var listSuggest = '';

  if(messages.autosuggest[0].options.length > 0) {
    $$1.each(messages.autosuggest[0].options, function(key, suggest) {
      listSuggest += '<li>' + suggest.text + '</li>';
    });

    $$1('#suggest-container').remove();
    $$1('#global-search-block').append('<div id="suggest-container"><ul><span>Affinez votre recherche:&nbsp;</span>' + listSuggest + '</ul></div>');
    $$1("#suggest-container li").unbind("click").bind("click", function() {
      keywordsSearch($$1(this).html());
    });
  } else
    $$1('#suggest-container').remove();
}

function searchDatasCallback(messages) {

  var contenuHtml = '';

  if(messages.status === 404) {

    //On envoie un mail avec le message d'erreur
    if(esConfig.esModeProd == true)
      sendMailAdministrator('indexElasticsearchError', 'Appel au moteur de recherche [Global] avec une erreur: ' + messages.error);

    vars.searchDegraded = true;
    timeSearchEngine(true, false);

    return;
  }

  if(vars.autoCompletion)
    contenuHtml = vars.autoCompletion;

  var nbResult = 0;
  if(typeof(messages.hits) != 'undefined')
    nbResult = messages.hits.total;

  //On verifie s'il y a des résultats
  if(nbResult > 0) {
    var dataTypeBefore = 0;

    //On crée le visuel pour afficher les résultats
    contenuHtml += '<div class="results-infos">' + nbResult + ' enregistrement' + ((nbResult > 1) ? 's' : '') + ' trouvé' + ((nbResult > 1) ? 's' : '') + '</div>';
    contenuHtml += '<div class="results-types">';
    contenuHtml += '   <span class="pull-right" style="margin:0 5px;"><button id="btn-close-search-global" class="btn btn-info btn-sm" onclick="closeSearchGlobal();">Fermer&nbsp;<i class="glyphicon glyphicon-remove-sign"></i></button></span>';
    contenuHtml += '   <div class="results-types-datas">';
    contenuHtml += '		<span class="pull-left" style="margin:3px 5px; font-size:10pt;">Filtrer l\'affichage :</span>';
    contenuHtml += '		<span class="badge-type active" data-id="0">Tous (' + nbResult + ')</span>';
    //Parcour des aggrégats elasticsearch sur les dataType pour avoir le nombre de résultat par dataType et créer les filtres d'affichage
    $$1.each(messages.aggregations.agg_data_type.buckets, function(keyTerm, valueTerm) {
      contenuHtml += '	<span class="badge-type" data-id="' + valueTerm.agg_id_data_type.buckets[0].key + '">' + valueTerm.agg_data_type_title.buckets[0].key + ' (' + valueTerm.doc_count + ')</span>';
    });
    contenuHtml += '   </div>';
    contenuHtml += '</div>';
    contenuHtml += '<div id="global-search-results-container-content">';

    //On parcour chaque résultat renvoyer par elasticsearch
    $$1.each(messages.hits.hits, function(key, hit) {
      var idDataType = hit._source.iddata_type;
      var dataTypeTitle = hit._source.data_type_title;
      var dataTypeMetaDatas = hit._source.data_type_meta_datas;
      var idData = hit._source.iddata;
      var title = hit._source.data_title;
      var summary = hit._source.summary;
      if(summary !== null && summary !== 'null')
        summary = texteLimitNbWord(summary, esConfig.nbWordSummaryMax);
      else
        summary = '';

      if(dataTypeBefore !== idDataType || dataTypeBefore === 0) {
        var counter = 0;
        var bgColor = '';

        //On récupère la couleur pour le dataType si elle est défini
        if(dataTypeMetaDatas !== null && typeof(dataTypeMetaDatas.colorCatalog) !== 'undefined')
          bgColor = ' style="background-color:' + dataTypeMetaDatas.colorCatalog + '"';

        //Si on est pas la premiere fois on commence par fermer le dataType précédent
        if(dataTypeBefore !== 0)
          contenuHtml += '</ul></div>';

        //On met à jour l'id de dataTypeBefore avec le dataType actuel
        dataTypeBefore = idDataType;

        //On ouvre le nouveau dataType
        contenuHtml += '   <div class="result-type result-type-' + idDataType + '">';
        contenuHtml += '       <div class="blocked" style="margin:5px 0; width:100%; padding:5px;">';
        contenuHtml += '           <h3' + bgColor + '>' + dataTypeTitle + '</h3>';
        contenuHtml += '       </div>';
        contenuHtml += '      <ul class="list-group">';
      }

      counter = parseInt(counter) + 1;
      contenuHtml += '           <li class="list-group-item ' + (((counter % 2) === 0) ? 'even' : 'odd') + '">';
      if(idDataType === 999999)
        contenuHtml += '           <div class="title" class="user-idcard-hover" data-user="' + idData + '"  onclick="clickOpenCardUser(\'' + idData + '\');">' + title + '</div>';
      else
        contenuHtml += '           <div class="title" onclick="consultData(\'' + idData + '\');">' + title + '</div>';
      contenuHtml += '               <div class="content">' + summary + '</div>';
      contenuHtml += '           </li>';
    });
    contenuHtml += '</ul>';
    contenuHtml += '</div>';
    contenuHtml += '</div>';
  } else
    contenuHtml += '<div id="global-search-msg">Aucun enregistrement n\'a été trouvé<span class="pull-right" style="margin:0 5px;"><button id="btn-close-search-global" class="btn btn-info btn-sm" onclick="closeSearchGlobal();">Fermer&nbsp;<i class="glyphicon glyphicon-remove-sign"></i></button></span></div>';

  $$1("#global-search-results #global-search-msg").hide();
  clearInterval(vars.nameTimer);
  vars.nameTimer = null;
  $$1("#global-search-results #global-search-results-container").html(contenuHtml);
  $$1("#global-search-results #global-search-results-container").show();
  $$1("#suggest-container-global li").unbind("click").bind("click", function() {
    keywordsSearch($$1(this).html());
  });

  initSearchGlobal();
}

function searchEngine() {
  if(!$$1("#global-search-input").length) {
    return;
  }

  $$1("select[name=global-search-toggle]").unbind("change").bind("change", function(e) {
    vars.lastGlobalSearchGlobal = '';
    timeSearchEngine(true, true);
  });

  $$1("#global-search-input").unbind("keyup").bind("keyup", function(e) {

    switch(getSearchEngineMode()) {

      case "table":
      case "table-admin":
        if(e.which === 13)
          timeSearchEngine(false, false);
        else
          timeSearchEngine(false, true);
        break;

      case "global":
        timeSearchEngine(false, true);
        break;
    }
  });

  $$1('#global-search-overlay').unbind("click").bind("click", function() {
    closeSearchGlobal();
  });

  //Si l'accès au serveur nodeJs est en erreur on se deconnecte
  connection.on('connect_error', function() {
    connection.disconnect();
    $$1('#errorElasticsearch').remove();

    vars.searchDegraded = true;
    if(vars.currentGlobalSearch != '')
      timeSearchEngine(true, false);
  });

  //Si l'accès au serveur elasticsearch est en erreur
  connection.on('serveurElasticsearchError', function(e) {
    $$1('#errorElasticsearch').remove();

    vars.searchDegraded = true;
    if(vars.currentGlobalSearch != '')
      timeSearchEngine(true, false);
  });

  //Fonction qui sera déclencher lorsque l'application du serveur node.js emmetra l'évènnement "returnResultElasticsearch"
  connection.on('returnResultElasticsearch', function(searchReturn) {

    switch(searchReturn.searchType) {
      case 'datas':
        searchDatasCallback(searchReturn.searchResult);
        break;
      case 'datas_table':
        searchTablerCallback(searchReturn.searchResult);
        break;
    }
  });

  connection.on('returnResultAutoCompletion', function(suggestReturn) {

    switch(suggestReturn.suggestType) {

      case 'datas':
        suggestDatasCallback(suggestReturn.suggestResult);
        break;

      case 'datas_table':
        suggestTablerCallback(suggestReturn.suggestResult);
        break;
    }
  });
}

function tablerSetVars(tabler, vars) {

  var varsStr = "";
  for(var attrname in vars)
    varsStr += ((varsStr.length <= 0) ? "" : ";") + attrname + "=" + vars[attrname];

  $$1(tabler).find("input[name=tabler-vars]	").val(varsStr);
}


function tablerSetVar(tabler, variable, value) {

  var vars = tablerGetVars(tabler);

  vars[variable] = value;

  tablerSetVars(tabler, vars);
}

function tablerDatasAllUpdate(idElt) {
  tablerSetVar($$1('#' + idElt), "showArchives", ($$1("#ck-archives").prop("checked") == true) ? 1 : 0);
  tablerUpdate($$1('#' + idElt));
}

function tablerSetOffset(tabler, offset, flagUpdate) {

  if($$1(tabler).parents(".tabler-container").find(".tabler-offset-select option:eq(" + offset + ")").length > 0) {

    $$1(tabler).parents(".tabler-container").find(".tabler-offset-select").each(function() {
      $$1(this).find("option:eq(" + offset + ")").prop("selected", true);
    });

    $$1(tabler).find("input[name=tabler-offset]").val(offset);

    if(typeof(flagUpdate) == "undefined") flagUpdate = true;

    if(flagUpdate == true) {
      clearTimeout(tablerSharedVars.timerTablerUpdate);
      tablerSharedVars.timerTablerUpdate = setTimeout(function() {
        tablerSharedVars.timerTablerUpdate = null;
        tablerUpdate(tabler);
      }, 500);
    }
  }
}

function tablerGotoNextRecord(elt) {

  var index = $$1(elt).parents(".tabler-container").find(".tabler-offset-select").val();
  tablerSetOffset($$1(elt).parents(".tabler-container").find(".tabler"), parseInt(index) + 1);
}

function tablerGotoPreviousRecord(elt) {

  var index = $$1(elt).parents(".tabler-container").find(".tabler-offset-select").val();
  tablerSetOffset($$1(elt).parents(".tabler-container").find(".tabler"), parseInt(index) - 1);
}

function tablerGotoRecord(elt) {

  var index = $$1(elt).val();
  tablerSetOffset($$1(elt).parents(".tabler-container").find(".tabler"), index);
}

function tablerToggle(tabler, display) {
  var displayInit = $$1(tabler).find('input[name=tabler-display]').val();
  var color = $$1('#btn-toggle-display-' + displayInit).css('color');
  var backColor = $$1('#btn-toggle-display-' + displayInit).css('background-color');

  $$1(tabler).find('input[name=tabler-display]').val(display);
  $$1(tabler).find("input[name=tabler-offset]").val(0);

  if(display == 'catalog') {
    $$1('#btn-toggle-display-thumb').removeClass('btn-default, btn-info').addClass('btn-default');
    $$1('#btn-toggle-display-catalog').removeClass('btn-default, btn-info').addClass('btn-info');
    $$1('#btn-toggle-display-catalog').css('color', color);
    $$1('#btn-toggle-display-catalog').css('background-color', backColor);
    $$1('#btn-toggle-display-catalog-bottom').css('color', color);
    $$1('#btn-toggle-display-catalog-bottom').css('background-color', backColor);
    $$1('#btn-toggle-display-thumb').css('color', backColor);
    $$1('#btn-toggle-display-thumb').css('background-color', 'transparent');
    $$1('#btn-toggle-display-thumb-bottom').css('color', backColor);
    $$1('#btn-toggle-display-thumb-bottom').css('background-color', 'transparent');

  } else {
    $$1('#btn-toggle-display-thumb').removeClass('btn-default, btn-info').addClass('btn-info');
    $$1('#btn-toggle-display-catalog').removeClass('btn-default, btn-info').addClass('btn-default');
    $$1('#btn-toggle-display-catalog').css('color', backColor);
    $$1('#btn-toggle-display-catalog').css('background-color', 'transparent');
    $$1('#btn-toggle-display-catalog-bottom').css('color', backColor);
    $$1('#btn-toggle-display-catalog-bottom').css('background-color', 'transparent');
    $$1('#btn-toggle-display-thumb').css('color', color);
    $$1('#btn-toggle-display-thumb').css('background-color', backColor);
    $$1('#btn-toggle-display-thumb-bottom').css('color', color);
    $$1('#btn-toggle-display-thumb-bottom').css('background-color', backColor);
  }

  tablerUpdate(tabler, {}, true, true);
}

window.tablerRefresh = tablerRefresh;
window.findTabler = findTabler;
window.tablerDatasAllUpdate = tablerDatasAllUpdate;
window.tablerGotoNextRecord = tablerGotoNextRecord;
window.tablerGotoPreviousRecord = tablerGotoPreviousRecord;
window.tablerGotoRecord = tablerGotoRecord;
window.tablerRemoveFilters = tablerRemoveFilters;
window.tablerToggle = tablerToggle;
window.tablerUpdate = tablerUpdate;

let timerTablerResize = null;

function initTablers(flagEvents) {

  if(typeof(flagEvents) == 'undefined')
    flagEvents = true;

  $$1(".tabler").each(function() {

    var tabler = $$1(this);
    var id = $$1(tabler).attr("id");

    if(typeof(id) != "undefined") {

      // display the overlay
      if($$1(tabler).find(".tabler-overlay").length > 0)
        $$1(tabler).find(".tabler-overlay").show();

      // set the events
      if(flagEvents)
        tablerSetEvents(tabler);

      // finally hide the overlay
      if($$1(tabler).find(".tabler-overlay").is(":visible"))
        $$1(tabler).find(".tabler-overlay").hide();
    }
  });
}

function tabler() {
  initTablers();
  initClickToNextPage();

  $$1(window).scroll(function() {
    if($$1('.tabler-loading-img img').css('display') == 'none') {
      $$1('.tabler-loading-img img').css('display', 'inline');
      $$1('.tabler-loading-img i').css('display', 'none');
    }

    if($$1(window).height() + $$1(window).scrollTop() >= $$1(document).height() - 10) {
      if(sharedVars.scrollRun == false) {
        sharedVars.scrollRun = true;
        gotToNextPage();
      }
    }

    //Valeur pour mobile
    var scrollValue = 10;

    //Valeur pour ordi
    if($$1('#header').css('display') === 'block')
      scrollValue = 120;

    if($$1(window).scrollTop() > scrollValue) {
      $$1('#tabler-action-bar-bottom').fadeIn();
    } else {
      $$1('#tabler-action-bar-bottom').fadeOut();
    }
  });

  $$1(window).resize(function() {

    if(timerTablerResize != null)
      clearTimeout(timerTablerResize);

    timerTablerResize = setTimeout(function() {
      timerTablerResize = null;
      initTablers(false);
    }, 100);

  });
}

function closeAllModalsWindows() {
  modalWindows([]);

  $$1(".modal-window").not(".full-page .modal-window").remove();
  $$1(".modal-window-button").not(".full-page .modal-window-button").remove();

  updateModalWindowOverlay();
  updateModalWindowBar();
}

function confirmClosaAllModalWindow() {
  var modification = 0;
  $$1('.modal-window').not(".full-page .modal-window").each(function() {
    if($$1(this).find('.modal-window-modif').val() === '1')
      modification = '1';
  });

  if(modification === '1') {
    if(confirm('Des modifications ont été apportées sur une fiche et n\'ont pas été enregistrées.\nSouhaitez-vous tout de même fermer ?'))
      closeAllModalsWindows();
    else
      return false;
  } else
    closeAllModalsWindows();
}

var controlFlagSelectMenuData = true;

$$1(document).bind("mousedown", function() {
  if(controlFlagSelectMenuData !== true) {
    setTimeout(function() {
      $$1('.menu-data-button-container').find('.menu-data-container').fadeOut('');
      controlFlagSelectMenuData = true;
    }, 200);
  }
});

function openMenuData(elt) {
  controlFlagSelectMenuData = true;

  var containerMenuData = $$1(elt).closest('.menu-data-button-container').find('.menu-data-container');
  $$1(containerMenuData).unbind("mouseenter").bind("mouseenter", function() {
    controlFlagSelectMenuData = true;
  }).unbind("mouseleave").bind("mouseleave", function() {
    controlFlagSelectMenuData = false;
  });

  $$1(elt).unbind("mouseenter").bind("mouseenter", function() {
    controlFlagSelectMenuData = true;
  }).unbind("mouseleave").bind("mouseleave", function() {
    controlFlagSelectMenuData = false;
  });

  $$1(containerMenuData).toggle();
}

function openFormContactAdminModal() {
  var modalContactAdmin = $$1("#contact-admin-form-modal").modal({
    'show': true,
    'backdrop': 'static',
    'keyboard': false
  });

  $$1('#send-mail-contact-admin').unbind('click').bind('click', function() {
    //On verifie que les champs sont remplies
    var msgSubjet = $$1('#message-subjet').val();
    var msgContent = $$1('#message-content').val();

    if(msgSubjet == '' || msgContent == '') {
      alert('Vous devez renseigner les champs pour envoyer votre message.');
      return false;
    }

    execQuery("send-email-contact-admin", {
        'msg-subjet': msgSubjet,
        'msg-content': msgContent
      }, false)
      .then((json) => {
        $$1('#contact-admin-form-modal').modal('hide');
        return displaySuccess$1(json.msg);
      });

    return false;
  });
}

window.setMainModalWindow = setMainModalWindow;
window.confirmClosaModalWindow = confirmClosaModalWindow;
window.confirmClosaAllModalWindow = confirmClosaAllModalWindow;
window.openMenuData = openMenuData;
window.openFormContactAdminModal = openFormContactAdminModal;

var timerResizeModalsWindows = null;

function modalManager() {
  $$1(window).resize(function() {
    if(timerResizeModalsWindows !== null)
      clearTimeout(timerResizeModalsWindows);

    timerResizeModalsWindows = setTimeout(function() {

      timerResizeModalsWindows = null;

      resizeModalWindowOverlay();
      resizeModalsWindows();

    }, 1000);
  });
}

function addField(node, sRequest) {

	var oParent = $$1(node).parents('[id^=form-group-]');
	var id = $$1(oParent).attr('id').replace(/^form-group-/, '');
	var num = 0;

	$$1('[id^=data-' + id +']').each(function(){
		var regex1 = new RegExp('^data-' + id + '(-[0-9])?$');
		if(regex1.test($$1(this).attr('id')))
		{
			var regex = new RegExp('^data-' + id + '-?');
			var parsed = parseInt($$1(this).attr('id').replace(regex, ''));
			if(num < parsed)
				num = parsed;
		}
	});

	num++;

	id = id + '-' +  num;

	// case dataType needed
	execQuery("request-" + sRequest, { 'iddataType': id }, false)
    .then((json) => {
      if (oParent){
				$$1(oParent).append(json.datas);
				// add tooltip action
				tooltip($$1(oParent).find('.tooltiped'));
				// add eventListener on filesubmit
				controlInitFilesDatasSelector();
			}
    });
}

function getListMembers(){
	// case we need to init members and group list
	if(!CTX$1.vars['members']) {
  	// case dataType needed
  	execQuery("request-getListMembers", { 'iddataType':'' }, false)
      .then((json) => CTX$1.vars['members'] = JSON.parse(json.datas));
	}
}

function removeChallengeMember(node){
	if($$1(node).parents('li').length > 0)
		$$1(node).parents('li').remove();
	else
		$$1(this).parents('li').remove();
}

function addChallengeMember(node) {
	// save node
	var copie = $$1(node);
	var oParent = $$1(node).parent();

	// delete from select list
	$$1(node).remove();

	// copie the element
	var lastChild = copie.find('div').last().removeClass();
	// resize for selected display with remove button
	lastChild.addClass('col-xs-9');

	// add remove button
	var removeButton = $$1(document.createElement('div'))
							.addClass('col-xs-2')
							.append($$1(document.createElement('i'))
								.addClass('glyphicon glyphicon-remove-sign')
								.click(removeChallengeMember))
								.css('cursor', 'pointer')
								.css('text-align', 'right');
	copie.append(removeButton);
	// add to selected members
	$$1(oParent).parent().parent().find('[id^=selectedMembers]').append(copie);

	if($$1(oParent).html() == '')
		$$1(oParent).hide();

}

function showSelectMembers(node) {
	// init current values
	var oParent = $$1(node).parent().parent().parent();
	var iGroup = oParent.find('[name=members-group-config]').val();
	var alreadyMembers = new Array();
	alreadyMembers['groups'] = new Array();
	alreadyMembers['users']  = new Array();
	$$1(oParent).find('#selectedMembers').find('input').each(function(){

		switch (true){
			case /^members-group-/.test($$1(this).attr('name')):
					alreadyMembers['groups'].push($$1(this).val());
				break;
			case /^members-user-/.test($$1(this).attr('name')):
					alreadyMembers['users'].push($$1(this).val());
				break;
		}

	});


	// if current user tape more than 2 char show list users
	if($$1(node).val() && $$1(node).val().length > 1) {

		var nodeSelectList = $$1(oParent).find('[name=selectMembers]');
		$$1(nodeSelectList).html('');
		if(CTX$1.vars['members']) {
			aMembers = CTX$1.vars['members'];
			// show groups
			if(aMembers['groups']) {
				for(var indexGroup in aMembers['groups']){
					var group = aMembers['groups'][indexGroup];
					var reg = new RegExp($$1(node).val(), 'i');
					if(reg.test(group['name']) && alreadyMembers['groups'].indexOf(group['id'].toString()) == -1){
						// add group smi idea id
						var inputGroup = $$1(document.createElement('input'))
											.attr('type', 'hidden')
											.val(group['id'])
											.attr('name', 'members-group-' + iGroup)
											.css('display', 'none');
						var divLabel = $$1(document.createElement('div'))
										.addClass('col-xs-1')
										.css('font-weight', 'bold')
										.css('text-align', 'center')
										.append($$1(document.createElement('span'))
											.addClass('glyphicons glyphicons-group'))
						var divName  = $$1(document.createElement('div'))
										.addClass('col-xs-11')
										.html(group['name']);
						var divRow = $$1(document.createElement('li'))
								.click(function(){addChallengeMember(this)})
								.addClass('row')
								.addClass('list-group-item')
								.append(inputGroup)
								.append(divLabel)
								.append(divName);
						if(nodeSelectList)
							nodeSelectList.append(divRow);
					}
				}
			}
			// show users
			if(aMembers['users']) {
				for(var idxUser in aMembers['users']){
					var user = aMembers['users'][idxUser];
					var reg = new RegExp($$1(node).val(), 'i');
					// test if user match with searched string and if it is not already selected
					if((reg.test(user['firstname']) || reg.test(user['lastname'])) &&  alreadyMembers['users'].indexOf(user['id'].toString()) == -1){

						// declare row user's elements
						var inputGroup = $$1(document.createElement('input'))
											.attr('type', 'hidden')
											.attr('name', 'members-user-' + iGroup)
											.css('display', 'none')
											.val(user['id']);
						var divLabel = $$1(document.createElement('div'))
										.addClass('col-xs-1')
										.css('font-weight', 'bold')
										.css('text-align', 'center')
										.append($$1(document.createElement('span'))
											.addClass('glyphicons glyphicons-user'))
						var divName  = $$1(document.createElement('div'))
										.addClass('col-xs-11')
										.html(user['lastname'] + ' ' + user['firstname']);
						// declare row
						var divRow = $$1(document.createElement('li'))
							.click(function(){addChallengeMember(this);})
							.addClass('row')
							.addClass('list-group-item')
							.append(inputGroup)
							.append(divLabel)
							.append(divName);
						if(nodeSelectList)
							nodeSelectList.append(divRow);
					}
				}
			}
		}
		$$1(nodeSelectList).css('display', 'block');
	}
}

function initSelectMembers(node){
	removeSelectMembers();
	showSelectMembers(node);
}

function outSelectListMembers(node){
	CTX$1.vars['tags']['selectMembers'] = false;
}

function overSelectListMembers(node){
	CTX$1.vars['tags']['selectMembers'] = true;
}

/**
 * Function smiShowEditTemplateId
 * show a reference datatype idea
 * @author thibault.stocker
 * @param  HTMLElement node nodeClicked
 * @param  string id   id dataType
 * @return boolean
 */
function smiShowEditTemplateId(node, id) {

	var parent = $$1(node).parents('[id^=form-group-]');
	CTX$1.vars['template-idea-node'] = parent;

	// case idea find in history
	if(('template-idea-' + id) in CTX$1.vars) {
		$$1(parent).html(CTX$1.vars['template-idea-' + id]);
		return true;
	}

	// case dataType needed
	execQuery("request-template-idea", {
		'iddataType':id,
		'disabled-status': $$1('#disabled-status').val(),
		'disabled-fields': $$1('#disabled-fields').val()
	}, false)
    .then((json) => {
      if (parent){
				CTX$1.vars['template-idea-' + id] = json.datas;
				CTX$1.vars['template-idea-listing'] = $$1(parent).html();
				$$1(parent).html(json.datas);
			}
    });
}

/**
 * Function smiTIdRollBack
 * show select datatype reference
 * @author thibault.stocker
 * @return
 */
function smiTIdRollBack(){
	if(CTX$1.vars['template-idea-node'] && $$1(CTX$1.vars['template-idea-node'])){
		$$1(CTX$1.vars['template-idea-node']).html(CTX$1.vars['template-idea-listing']);
		//CTX.vars['template-idea-node'] = parent;
	}
	return;
}

function smiToggleDisplay(node){
	node = $$1(node).parent().parent().next().children().toggle();
}

window.addField = addField;
window.getListMembers = getListMembers;
window.initSelectMembers = initSelectMembers;
window.outSelectListMembers = outSelectListMembers;
window.overSelectListMembers = overSelectListMembers;
window.removeChallengeMember = removeChallengeMember;
window.smiShowEditTemplateId = smiShowEditTemplateId;
window.smiTIdRollBack = smiTIdRollBack;
window.smiToggleDisplay = smiToggleDisplay;

function smi() {
  $$1(document)
    .bind("mousedown", function() {
      if(typeof(CTX) !== 'undefined' && CTX.vars['tags']['selectMembers'] !== undefined && CTX.vars['tags']['selectMembers'] === false)
        removeSelectMembers();
    });
}

// Node module dependencies
// import 'public-source/js/core/jquery-bundles/fancybox';

// Core dependencies
// Direct bundle dependencies
// Expose globals
// Bundle initializers
// Module initializers
window.checkAll = checkAll;

$$1(document).ready(function() {
  placeholder();
  formRequester();
  navTabs();
  tooltip();
  tableSelector();
  startChrono();
  stars();
  stats();
  resizeStructure(news);
  updateUi();
  codeContainers();

  controlInitDatasSelector();
  controlInitSelectMultiple();
  controlInitMultiSelect();

  initLikesHover();
  initLoggedUsers();
  initKeywordHover();
  initFeedsFilters();
  initSubPaddle();
  initNotificationsEvents();
  enableTracking();

  filesManager();
  users();
  menuManager();
  searchEngine();
  tabler();
  modalManager();
  crawling();

  smi();

  $$1('.fancybox').fancybox();

  // to avoid Google Chrome blocked bottom vertical scrollbar with tinyMCE
  $$1('a[href="#"]').click(() => false);

  if($$1('#page-content').find('#data-iddata').length > 0) {
    $$1('#page-content').unbind('change').bind('change', function(e) {
      var forum = $$1(e.target).hasClass('input-control-discussion');
      if(!forum) {
        $$1(this).find('.modal-window-modif').val('1');
      }

      checkAndInitChampsDoublon(e.target, this);
    });
  }
});

$$1(window).resize(function() {
  stats();
  resizeModals();
  resizeStructure();
  resizeSliderNews();
});

window.onbeforeunload = function(event) {
  var modification = false;
  // On verifie s'il y a au moins un changement non enregistré
  $$1('.modal-window').each(function() {
    if($$1(this).find('.modal-window-modif').val() === '1') {
      modification = true;
    }
  });

  if($$1('#page-content').find('.modal-window-modif').val() === '1') {
    modification = true; // dans le cas de fullpage on check la modif
  }

  if(modification) {
    // For IE and Firefox
    if(event) {
      event.returnValue = 'Des modifications ont été apportées sur la fiche et n\'ont pas été enregistrées.';
    }

    // For Safari
    return 'Des modifications ont été apportées sur la fiche et n\'ont pas été enregistrées.';
  }
};

// import 'bootstrap-stylus/js/modal';

function finalizeLoadUserAdminForm() {
  formRequester();
  navTabs();

  $$1("#btn-close-form-user").unbind("click").bind("click", function() {
    $$1("#user-form-modal").modal("hide");
  });
}

// import 'bootstrap-stylus/js/modal';

function initFormUserModal() {

  if($$1(document).find("#user-form-modal").length > 0) return;

  $$1(document).find("body").append('\
		<div class="modal" id="user-form-modal" tabindex="-1" role="dialog">\
			<div class="modal-dialog" style="width:960px;">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button class="modal-header-close" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i></button>\
						<span class="modal-header-icon"><i class="glyphicons glyphicons-user"></i></span>\
						<h2 class="modal-title">Utilisateur</h2>\
					</div>\
					<div class="modal-body">\
					</div>\
				</div>\
			</div>\
		</div>\
	');
}

function openFormUserModal() {
  initFormUserModal();

  $$1("#user-form-modal").modal({
    'show': true,
    'backdrop': 'static',
    'keyboard': false
  });
}

function createUser() {
  execQuery("create-user")
    .then((json) => {
      openFormUserModal();
      $$1("#user-form-modal .modal-body").html(base64Decode(json.content));
      finalizeLoadUserAdminForm();
    });
}

function deleteGroupsQuery(ids) {
  tablerSetLoading($$1("#tabler-groups-admin"), true);

  execQuery("delete-groups", {
      ids
    }, false)
    .then((json) => {
      tablerSetLoading($$1("#tabler-groups-admin"), false);
      json.idsDeleted.forEach((id) => {
        $$1(`#tabler-groups-admin .tabler-body .tabler-row.tabler-row-${id}`).remove();
      });

      const nbDataOld = Number($$1('#nbTotalRecord').html());
      $$1('#nbTotalRecord').html(Math.max(nbDataOld - json.idsDeleted.length, 0));

      return displaySuccess$1(json.msg);
    });
}

function deleteGroups() {

  if($$1("#tabler-groups-admin .tabler-body .tabler-row .tabler-cell-selector input[type=checkbox]:checked").length <= 0) return alert("Merci de cocher au moins un utilisateur dans la liste");
  if(!confirm("Attention, vous allez supprimer un ou plusieurs groupes utilisateurs.\r\nSouhaitez-vous continuer ?")) return;

  var ids = new Array();
  $$1("#tabler-groups-admin .tabler-body .tabler-row .tabler-cell-selector input[type=checkbox]:checked").each(function() {
    ids.push($$1(this).val());
  });

  deleteGroupsQuery(ids);
}

// import 'bootstrap-stylus/js/modal';

let timerSearchGroupUsers = null;

function searchGroupUsers() {
  $$1("#check-group-users").prop("checked", false);
  var searchedValue = $$1("#search-group-users").val();

  if(searchedValue.length <= 0) return $$1(".group-users-list li").show();

  $$1(".group-users-list li").each(function() {
    var content = String($$1(this).find(".searchable").html()).toLowerCase();
    (content.indexOf(searchedValue) >= 0) ? $$1(this).show(): $$1(this).hide();
  });
}

function initFormGroupModal() {
  if($$1(document).find("#form-group-modal").length > 0) return;

  $$1(document).find("body").append('\
		<div class="modal" id="form-group-modal" tabindex="-1" role="dialog">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button class="modal-header-close" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i></button>\
						<span class="modal-header-icon"><i class="glyphicons glyphicons-group"></i></span>\
						<h2 class="modal-title">Groupe</h2>\
					</div>\
					<div class="modal-body">\
					</div>\
				</div>\
			</div>\
		</div>\
	');
}

function openFormGroupModal() {

  initFormGroupModal();

  $$1("#form-group-modal").modal("show", {

    'show': true,
    'keyboard': false,
    'backdrop': 'static'
  });
}

function initSearchGroupUsers() {

  if($$1("#search-group-users").length <= 0) return;

  $$1("#search-group-users").unbind("keyup").bind("keyup", function() {
    if(timerSearchGroupUsers != null) clearTimeout(timerSearchGroupUsers);
    timerSearchGroupUsers = setTimeout(function() {
      searchGroupUsers();
    }, 500);
  });

  $$1("#check-group-users").unbind("click").bind("click", function() {
    var checked = $$1(this).prop("checked");
    $$1(".group-users-list li:visible").find("input[type=checkbox]").prop("checked", checked);
  });
}

function finalizeLoadGroup() {

  formRequester();
  navTabs();
  initSearchGroupUsers();

  $$1("#btn-close-form-group").unbind("click").bind("click", function() {
    $$1("#form-group-modal").modal("hide");
  });
}

function editGroup(idgroup) {
  execQuery("edit-group", {
      idgroup
    })
    .then((json) => {
      openFormGroupModal();
      $$1("#form-group-modal .modal-body").html(base64Decode(json.content));
      finalizeLoadGroup();
    });
}

function editUser(iduser) {
  execQuery("edit-user", {
      iduser
    })
    .then((json) => {
      openFormUserModal();
      $$1("#user-form-modal .modal-body").html(base64Decode(json.content));
      finalizeLoadUserAdminForm();
    });
}

function exportXlsGroups() {
  if($$1("#tabler-groups-admin .tabler-body .tabler-row .tabler-cell-selector input[type=checkbox]:checked").length <= 0)
    return alert("Merci de cocher au moins un groupe dans la liste");

  return tablerExportXls($$1("#tabler-groups-admin"));
}

function exportXlsUsers() {
  return tablerExportXls($$1("#tabler-users-admin"));
}

let $creditModal;
let $user;
let $container;
let $userCredits;
function userid() {
  if(!$user) {
    $user = $$1('#user');
  }
  return $user.val();
}

function userCredits() {
  if(!$userCredits) {
    $userCredits = $$1('#user-credits');
  }
  return $userCredits;
}

function creditsContainer() {
  if(!$container) {
    $container = $$1('#credits-container');
  }
  return $container;
}

function creditModal$1() {
  if($creditModal) {
    return $creditModal;
  }

  $creditModal = $$1(`
    <div class="modal" id="credit-modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" style="width:600px;">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>
            <h2 class="modal-title">Credit</h2>
          </div>
          <div class="modal-body"></div>
        </div>
      </div>
    </div>
  `).appendTo('body');
}

function refreshCredits(iduser) {
  iduser = Number(iduser || userid());

  if(!isNumber(iduser)) return displayError$1("Enregistrer l'utilisateur avant d'effectuer cette action");

  execQuery('get-credits-table', {
      iduser
    }, null)
    .then((json) => {
      if(json.content) {
        creditsContainer().html(base64Decode(json.content));
      }
      if(json.userCredits) {
        userCredits().html(json.userCredits);
      }
    });
}

function finalizeSaveUserAdminForm(json) {
  if(!json) return false;
  if(json.iduser) $$1("#form-user-admin #iduser").val(json.iduser);

  refreshCredits();
}

// import 'bootstrap-stylus/js/modal';

function closeUserModal() {
  $$1("#user-modal").modal("hide");
}

window.createUser = createUser;
window.deleteGroups = deleteGroups;
window.editGroup = editGroup;
window.editUser = editUser;
window.exportXlsGroups = exportXlsGroups;
window.exportXlsUsers = exportXlsUsers;
window.finalizeSaveUserAdminForm = finalizeSaveUserAdminForm;
window.closeUserModal = closeUserModal;

function cleanCreditModal() {
  creditModal$1().find('.modal-body').html("<br /><center><h3>Chargement en cours ...</h3></center>");
}

function openCreditModal(flagClean = true) {
  if(flagClean) cleanCreditModal();
  creditModal$1().modal("show");
}

function showCreditForm(data) {
  openCreditModal();

  execQuery('get-credit-form', data)
    .then((json) => {
      if(json.content) {
        creditModal$1().find('.modal-body').html(base64Decode(json.content));
      }

      formRequester();
      tooltip();
    });
}

// NOTE used in 'user-admin-form.twig' (and vendor variants)
function addCredit(iduser) {
  iduser = Number(iduser || userid());
  if(!isNumber(iduser)) return displayError$1("Enregistrer l'utilisateur avant d'effectuer cette action");

  showCreditForm({
    iduser
  });
}

// import 'bootstrap-stylus/js/modal';

// NOTE: Used in 'credit-form.twig'
function closeCreditModal() {
  creditModal$1().modal('hide');
}

function deleteCredit(idcredit) {
  return execQuery('delete-credit', {
      idcredit
    })
    .then(() => $$1(`#credit-${idcredit}`).remove());
}

function finalizeSaveCredit(json) {
  if(json.idcredit) creditModal().find('#idcredit').val(json.idcredit);
  if(json.userCredits) $("#user-form-modal #user-credits").html(json.userCredits);
  refreshCredits();
}

window.addCredit = addCredit;
window.closeCreditModal = closeCreditModal;
window.deleteCredit = deleteCredit;
window.refreshCredits = refreshCredits;
window.finalizeSaveCredit = finalizeSaveCredit;

function isAjaxMessage(ajaxResponse) {
  return ajaxResponse && ajaxResponse.type === 'message';
}

function zoomChart(chart) {
  var max = 20;
  if(chart.dataProvider.length > max)
    chart.zoomToIndexes(0, max);
}

var menu = [{
  class: "export-main",
  label: "Export",
  menu: [{
    label: "Download",
    menu: [{
      label: "JPG",
      click: function() {
        this.capture({}, function() {
          this.toJPG({}, function(data) {
            this.download(data, "image/jpg", "amCharts.jpg");
          });
        });
      }
    }, {
      label: "PNG",
      click: function() {
        this.capture({}, function() {
          this.toPNG({}, function(data) {
            this.download(data, "image/png", "amCharts.png");
          });
        });
      }
    }, {
      label: "PDF",
      click: function() {
        this.capture({}, function() {
          this.toPDF({}, function(data) {
            this.download(data, "application/pdf", "amCharts.pdf");
          });
        });
      }
    }]
  }, 'PRINT']
}];

function changeTab(index, uid) {
  var link = $$1('.stat-graph-container[data-uid="' + uid + '"] .nav-tabs li').removeClass('active').eq(index).addClass('active').find('a').attr('href');
  $$1('.stat-graph-container[data-uid="' + uid + '"] .tab-content div').removeClass('active').filter(link).addClass('active');
}

// import 'amcharts3';

const statsTextColor = "#000";
const statsGridColor = "#dddddd";

function filterTableWithItem(evt) {
  var cnt = $$1(evt.event.target).parents('.stat-graph-container');
  var uid = cnt.data('uid');
  var table = cnt.find('.chart-table');

  if(!uid || uid.length == 0)
    return;

  if(evt.dataItem)
    evt.item = evt.dataItem;

  // transformation en texte
  evt.item.dataContext.fulllabel += "";

  if(window.tables && window.tables[uid]) {
    changeTab(1, uid);
    table.html(window.tables[uid]);
    $$1('.stat-graph-container[data-uid="' + uid + '"] .chart-table table tbody tr').show().not('tr[data-abs="' + evt.item.dataContext.fulllabel.replace('"', '\"') + '"]').hide();
    $$1('.stat-graph-container[data-uid="' + uid + '"] .chart-table div.hidden').removeClass('hidden').find('.filter-text').text("Filtre : " + evt.item.dataContext.fulllabel);
    $$1('.stat-graph-container[data-uid="' + uid + '"] .chart-table').append('<input type="hidden" id="overloaded_filters" name="overloaded_filters" value="' + $$1('.stat-graph-container[data-uid="' + uid + '"] .chart-table table tbody tr:visible').first().data('absid') + '" />');
    initUserHover();
  }
}

function setGraphPie(graphId, datas, params) {
  AmCharts.makeChart(graphId, {
    "export": {
      enabled: true,
      menu: menu
    },
    "listeners": [{
      "event": "clickSlice",
      "method": filterTableWithItem
    }],
    "type": "pie",
    "theme": "none",
    "angle": 5,
    "depth3D": 15,
    "legend": {
      "markerType": "circle",
      "position": "right",
      "marginRight": 0,
      "autoMargins": false,
      "color": "#000",
      "markerDisabledColor": "#CFCFCF",
      "fontSize": 10,
    },
    "startDuration": 0,
    "color": statsTextColor,
    "valueField": params.valueField,
    "titleField": params.titleField,
    "balloonText": params.balloonText,
    "baseColor": params.color,
    "labelText": '[[percents]]%',
    "dataProvider": datas
  });
}

function setGraphLine(graphId, datas, graphs, params) {
  var parseDate = false,
    minPeriod = 'DD',
    dateFormat = 'YYYY-MM-DD';
  if(params.categoryField == 'date') {
    parseDate = true;
  } else if(params.categoryField == 'hours') {
    parseDate = true;
    minPeriod = 'hh';
    dateFormat = 'YYYY-MM-DD JJ';
  }

  AmCharts.monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

  AmCharts.makeChart(graphId, {
    "export": {
      enabled: true,
      menu: menu
    },
    "theme": "none",
    "type": "serial",

    "autoMargins": false,
    "marginLeft": 18,
    "marginRight": 8,
    "marginTop": 10,
    "marginBottom": 100,

    "dataProvider": datas,
    'dataDateFormat': dateFormat,
    "graphs": graphs,

    "valueAxes": [{
      "id": "v1",
      "axisAlpha": 0,
      "inside": true,
      "axisColor": statsTextColor,
      "gridColor": statsGridColor,
      "color": "#000",
      "labelsEnabled": true
    }],
    "pathToImages": __webUrl + "/pub/js/amcharts/images/",
    "chartScrollbar": {
      "autoGridCount": true,
      "scrollbarHeight": 40,
      "selectedBackgroundColor": "#666666",
      "backgroundColor": "#AAAAAA"
    },
    "zoomOutText": "Voir tout",
    "mouseWheelScrollEnabled": true,
    "mouseWheelZoomEnabled": true,
    "chartCursor": {
      "categoryBalloonEnabled": false,
      "cursorColor": "#FFFFFF"
    },

    "legend": {
      "horizontalGap": 5,
      "maxColumns": 1,
      "position": "right",
      "useGraphSettings": true,
      "markerSize": 10,
      "color": "#000",
      "markerDisabledColor": "#CFCFCF"
    },

    "categoryField": params.categoryField,
    "categoryAxis": {
      "parseDates": parseDate,
      "minPeriod": minPeriod,
      "minHorizontalGap": 60,
      "color": "#000",
      "gridAlpha": 0.1,
      "gridColor": statsGridColor,
      "axisAlpha": 0,
      "axisColor": statsTextColor,
      'labelRotation': 80
    }
  });
}

function setGraphHistoClusteredVertical(graphId, datas, graphs, params) {

  var options = {
    "export": {
      enabled: true,
      menu: menu
    },
    "type": "serial",
    "theme": "none",
    "color": statsTextColor,
    "fixedColumnWidth": 250,
    "autoDisplay": true,
    "dataProvider": datas,
    "graphs": graphs,
    "columnWidth": 0.8,
    "titles": [{
      "text": params.title,
      "size": 16
    }],
    "legend": {
      "maxColumns": 4,
      "position": "top",
      "fontSize": 11,
      "labelWidth": 250,
      "align": "center",
      "useGraphSettings": true,
      "markerSize": 10,
      "color": statsTextColor,
      "markerDisabledColor": "#CFCFCF"
    },

    "categoryAxis": {
      "gridPosition": "start",
      "position": "left",
      "gridAlpha": 0.1,
      "gridColor": statsGridColor,
      "axisAlpha": 0,
      "axisColor": statsTextColor,
      "labelsEnabled": true
    },

    "valueAxes": [{
      "stackType": "regular",
      "position": "top",
      "axisAlpha": 1,
      "axisColor": statsTextColor,
      "gridColor": statsGridColor,
      "labelsEnabled": true,
      "integersOnly": true
    }]
  };

  for(var index in params) options[index] = params[index];

  AmCharts.makeChart(graphId, options);

}

function setGraphHistoClustered(graphId, datas, graphs, params) {

  var colorT = (params.textColor ? params.textColor : statsTextColor);
  var colorG = (params.gridColor ? params.gridColor : statsGridColor);

  var options = {
    "export": {
      enabled: true,
      menu: menu
    },
    "type": "serial",
    "theme": "none",
    "color": colorT,
    "autoMargins": false,
    "marginLeft": 350,

    "dataProvider": datas,
    "graphs": graphs,

    "legend": {
      "maxColumns": 1,
      "position": "absolute",
      "top": 0,
      "left": -350,

      "horizontalGap": 0,
      "verticalGap": 0,
      "useGraphSettings": true,
      "markerSize": 10,
      "color": colorT,
      "markerDisabledColor": "#CFCFCF"
    },

    "categoryAxis": {
      "gridPosition": "start",
      "position": "left",
      "gridAlpha": 0.1,
      "gridColor": colorG,
      "axisAlpha": 0,
      "axisColor": colorT,
      "labelsEnabled": true
    },

    "valueAxes": [{
      "stackType": "regular",
      "position": "top",
      "axisAlpha": 0.5,
      "axisColor": colorT,
      "gridColor": colorG,
      "labelsEnabled": true,
    }]
  };

  for(var index in params) options[index] = params[index];

  AmCharts.makeChart(graphId, options);
}

function setGraphHisto(graphId, datas, graphs, params) {
  var iscol = (params._type == 'column');
  var rotate = (params.rotate);
  var labelRot = 0;
  if(!rotate)
    labelRot = 45;

  var options = {
    'export': {
      enabled: true,
      "position": "top-left",
      menu: menu
    },
    "listeners": [{
      "event": "clickGraphItem",
      "method": filterTableWithItem
    }],
    "type": "serial",
    "theme": "none",
    'categoryField': null,
    'rotate': false,
    "dataProvider": datas,
    "graphs": graphs,

    "depth3D": (iscol) ? 20 : 0,
    "angle": (iscol) ? 30 : 0,
    "mouseWheelScrollEnabled": true,

    "valueAxes": [{ // ordinate axes properties

      "labelsEnabled": true,
      "color": statsTextColor,
      "title": params.title,
      "axisColor": statsTextColor,
      "axisAlpha": 0.1,
      "minimum": 0,
      //"gridPosition":"middle",
      "gridAlpha": 0.1,
      "gridColor": statsGridColor
    }],

    "categoryAxis": { //abscissa axe properties

      "labelRotation": 0,
      "labelsEnabled": true,
      "fontSize": 11,
      "color": statsTextColor,

      "axisColor": statsTextColor,
      "axisAlpha": 0.1,

      "gridAlpha": 0.1,
      "gridColor": statsGridColor,
      "startOnAxis": !iscol,
      "labelOffset": (labelRot == 0) ? 25 : 0,
      "labelRotation": labelRot
    },
    "chartScrollbar": {
      "graph": "AmGraph-1",
      "gridAlpha": 0,
      "color": "#888888",
      "scrollbarHeight": 30,
      "backgroundAlpha": 0.5,
      "graphFillAlpha": 0.5,
      "autoGridCount": false,
      "selectedGraphFillAlpha": 0,
      "graphLineAlpha": 0.75,
      "graphLineColor": "#c2c2c2",
      "selectedGraphLineColor": "#888888",
      "selectedGraphLineAlpha": 1,
      "oppositeAxis": !params.rotate

    }
  };

  for(var index in params) {
    if(index.indexOf('_') != 0)
      options[index] = params[index];
  }

  var chart = AmCharts.makeChart(graphId, options);

  zoomChart(chart);
}

function setGraphFunnel(graphId, datas, params) {
  AmCharts.makeChart(graphId, {
    "export": {
      enabled: true
    },
    "type": "funnel",

    "theme": "none",
    "rotate": false,

    "dataProvider": datas,

    "titleField": params.titleField,
    "colorField": params.colorField,
    "valueField": params.valueField,
    "balloonText": params.balloonText,

    "marginRight": 250,
    "marginLeft": 0,
    "labelPosition": "right",
    "funnelAlpha": 0.9,

    "depth3D": 100,
    "angle": 40,

    "outlineAlpha": 1,
    "outlineColor": "#FFFFFF",
    "outlineThickness": 1,

    "startX": 0,
    "startAlpha": 0,

    // "neckHeight": "30%",
    "neckWidth": "10%",

    "color": statsTextColor
  });
}

function renderGraph(graphId, graphType, datasFinal, graphsFinal, paramsFinal) {
  switch(graphType) {

    case "graph-histo":
    case "graph-column":
      setGraphHisto(graphId, datasFinal, graphsFinal, paramsFinal);
      break;
    case "graph-funnel":
      setGraphFunnel(graphId, datasFinal, paramsFinal);
      break;
    case "graph-pie":
      setGraphPie(graphId, datasFinal, paramsFinal);
      break;
    case "graph-line":
      setGraphLine(graphId, datasFinal, graphsFinal, paramsFinal);
      break;
    case "graph-histo-clustered":
      setGraphHistoClustered(graphId, datasFinal, graphsFinal, paramsFinal);
      break;
    case "graph-histo-clustered-vertical":
      setGraphHistoClusteredVertical(graphId, datasFinal, graphsFinal, paramsFinal);
      break;
  }
}

function initChartTableFromStats(uid, idtable, objfilter) {

  if(!window.tables)
    window.tables = {};

  if(!objfilter)
    objfilter = {
      'uid': uid
    };

  execQuery('get-chart-table', objfilter)
    .then((json) => {
      window.tables[uid] = base64Decode(json.htmltable);
      $$1('#' + idtable)
        .html('<button type="button" class="form-control">Afficher les données</button>')
        .find('button.form-control')
        .click(() => openChartTable(uid));
    });
}

function initGraphStats(selector, objfilter) {
  if(!selector)
    selector = ".stat-graph:visible";

  $$1(selector).not('.stat-rendered').each(function() {
    var that = $$1(this);
    var graphId = $$1(this).attr("id");
    var graphType = $$1(this).data("type");

    if($$1(that).find(".datas").length > 0) {

      var datas = $$1(that).find(".datas").html();

      if(datas) {

        // //!!!\\ commentaires HTML sinon ca marche plus
        var graphs = ($$1(that).find(".graphs").length > 0) ? ($$1(that).find(".graphs").html().replace('<!--', '').replace('-->', '')) : null;
        var params = ($$1(that).find(".params").length > 0) ? $$1(that).find(".params").html().replace('<!--', '').replace('-->', '') : null;

        var datasFinal = jQuery.parseJSON(datas);

        var graphsFinal = (graphs != null && graphs != '') ? stringToJSON(graphs) : null;
        var paramsFinal = (params != null) ? stringToJSON(params) : null;

        renderGraph(graphId, graphType, datasFinal, graphsFinal, paramsFinal);

        that.addClass('stat-rendered');

        var uid = that.parents('.stat-graph-container').first().data('uid');
        if(uid && uid.length > 0) {
          initChartTableFromStats(uid, that.closest('.tab-content').find('.chart-table').prop('id'), objfilter);
        }
      }
    }
  });

  setTimeout(function() {
    $$1("a[href^='http://www.amcharts.com']").hide();
  }, 300);
  setTimeout(function() {
    $$1("a[href^='http://www.amcharts.com']").hide();
  }, 1000);

  if($$1('.stat-home').not(':visible').not('.stat-rendered').length) {
    setTimeout(initGraphStats, 250);
  }
}

function preparedGraph(json) {
  var provider;
  if(json) {
    provider = stringToJSON(base64Decode(json.provider));
    $$1('#chart-uid').val(json.uid);
    $$1('#chart').html('');
    $$1('.loading-circle').hide(200);
  } else
    provider = stringToJSON($$1('#field-provider').text());

  window.provider = provider;
  window.table = '';

  $$1('#field-table').html('<p><b>Aucune table des données n\'est disponible pour ce graphique</b></p>');

  renderGraph('chart', provider.type, provider.datas, provider.graphs, provider.params);
}

function closeFilters(elt) {
  var $thisElt = $$1(elt).closest('.modal-window');
  $thisElt.addClass('minimized');
  $thisElt.hide();
  hideModalWindowOverlay$1();
}

/**
 * Submit the chart filters
 */
function submitFilters(elt) {

  var $thisElt = $$1(elt).closest('.modal-window');
  var uid = $thisElt.find('.modal-window-uid').val();
  var $thisModal = $$1('#' + $thisElt.attr('id'));

  var cnt = $$1('.stat-graph-container[data-uid=' + uid + ']');
  var objfilter = _formatFilters($thisModal, uid);

  cnt
    .find('.loading-circle')
    .css('z-index', 999)
    .offset({
      left: (cnt.width() * 0.5 - 16),
      top: (cnt.height * 0.5 - 16)
    })
    .show(200);

  execQuery('filter-stat', objfilter)
    .then((json) => {
      cnt.find('.loading-circle').hide(200);

      var content = base64Decode(json.content);
      if(content) {
        cnt.find('.stat-graph').replaceWith(content);
        initGraphStats('', objfilter);
      } else {
        cnt.find('.stat-graph').html('<h2>Pas de données</h2>');
      }
    })
    .catch(() => {
      cnt.find('.loading-circle').hide(200);
    });

  closeFilters(elt);
}

function resetFilters(elt) {
  var $thisElt = $$1(elt).closest('.modal-window');

  $thisElt.find('.view-filter').prop('checked', false);
  $$1.each($thisElt.find('.filter-panel'), function(i, $thisFilter) {
    $thisFilter = $$1($thisFilter);
    if($thisFilter.parent().is(':visible')) {
      $thisFilter.parent().hide();
      $thisFilter.find('input[type!=radio][type!=checkbox]').val('');
      $thisFilter.find('input[type=radio]').prop('checked', false);
      $thisFilter.find('select').prop('selectedIndex', 0);
      $thisFilter.find('span[data-id]').remove();
      $thisFilter.find('.control-selector2-label').empty();
      $thisFilter.find('.control-selector-search').find('[data-id]').removeClass('selected').find('input[type=checkbox]').prop('checked', false);
      $thisFilter.find('.control-selector2-content-value[data-id]').removeClass('selected').find('input[type=checkbox]').prop('checked', false);
    }
  });
  submitFilters(elt);
}

function openChartTable$1(uid) {
  if(window.tables[uid]) {
    $$1('.stat-graph-container:visible').each(function(idx, elm) {
      $$1(elm)
        .find('.chart-table')
        .html('<button type="button" class="form-control">Afficher les données</button>')
        .find('buttons.form-control')
        .click(() => openChartTable$1($$1(elm).data('uid')));
    });

    $$1('.stat-graph-container[data-uid="' + uid + '"] .chart-table').html(window.tables[uid]);
    initUserHover$1();
  }
}

function changeChartTab(index) {
  var link = $$1('#tab-charts li').removeClass('active').eq(index).addClass('active').find('a').attr('href');
  $$1('#tab-charts').parent().find('.tab-content div').removeClass('active').filter(link).addClass('active');
}

function clearTableFilter() {
  var cnt = $$1(event.target).parents('.stat-graph-container');

  if(cnt.length > 0) {
    var uid = cnt.data('uid');
    cnt.find('.filter-text').parents('div').first().addClass('hidden');
    cnt.find('.chart-table tr').show();
    cnt.find('#overloaded_filters').remove();
    changeTab(0, uid);
  } else {
    $$1('.filter-text').parents('div').first().addClass('hidden');
    $$1('#field-table table tbody tr').show();
    cnt.find('#overloaded_filters').remove();
    changeChartTab(0);
  }
}

window.preparedGraph = preparedGraph;
window.submitFilters = submitFilters;
window.closeFilters = closeFilters;
window.resetFilters = resetFilters;
window.openChartTable = openChartTable$1;
window.clearTableFilter = clearTableFilter;

function renderFilter(modalWindow, json) {
  renderData(modalWindow, json);
}

/**
 * allow and disallow filter OR remove all Filters
 * @param  {[type]} modalId [description]
 * @return {[type]}         [description]
 */
function activeFilters(modalId) {
  $$1(modalId + ' .view-filter').click(function() {
    var filter = $$1(this);
    var filterUid = filter.attr('value');
    var $thisFilter = $$1(modalId + ' #' + filterUid);

    // if is checked hide panel AND unchecked this filter
    if(filter.is(':checked')) {
      $thisFilter.show();
    } else {
      $thisFilter.hide();
      $thisFilter.find('input[type!=radio][type!=checkbox]').val('');
      $thisFilter.find('input[type=radio]').prop('checked', false);
      $thisFilter.find('select').prop('selectedIndex', 0);
      $thisFilter.find('span[data-id]').remove();
      $thisFilter.find('.control-selector2-label').empty();
      $thisFilter.find('.control-selector-search').find('[data-id]').removeClass('selected').find('input[type=checkbox]').prop('checked', false);
      $thisFilter.find('.control-selector2-content-value[data-id]').removeClass('selected').find('input[type=checkbox]').prop('checked', false);
    }
  });
}

/**
 * Get the chart filters
 */
function getChartFilter(uid) {

  var $thisModalFilters = $$1('#modal-window-' + uid);
  var options = {
    'windowBarButton': false
  };

  showModalWindowOverlay();

  if($$1(document).find('#modal-window-' + uid).length == 0) { // if the modal NOT exist push it
    let modalWindow = pushModalWindow(uid, options);
    if(modalWindow === null) return false;

    setModalWindowLoading(modalWindow);

    $$1('.modal-window-bar').find('.modal-window-button-uid[value="' + uid + '"]').closest('.modal-window-button').remove();

    modalWindow = getModalWindowMain();

    execQuery("get-chart-filter", {
        uid,
        options
      }, false)
      .then((json) => {
        if(isAjaxMessage(json)) {
          closeModalWindow$1(modalWindow);
          hideModalWindowOverlay$1();
          return displayMessage(json.msg);
        }

        renderFilter(modalWindow, json);
        resizeModalWindow(modalWindow);
        activeFilters('#modal-window-' + uid);
      })
      .catch(() => {
        closeModalWindow$1(modalWindow);
        hideModalWindowOverlay$1();
      });

  } else { // but if the modal exist JUST show it
    $thisModalFilters.show();
    var zIndexOverlay = $$1(document).find('.modal-window-overlay').css("z-index");
    var zIndexModal = $thisModalFilters.css("z-index");
    if(zIndexModal < zIndexOverlay) {
      $$1(document).find('.modal-window-overlay').css("z-index", zIndexModal);
    }
  }
}

function initGraphsContainerSize() {
  $$1(".stat-graph:visible").not(".stat-graph-resized").each(function() {
    var width = $$1(this).width();
    $$1(this).css("width", width + "px");
    $$1(this).addClass("stat-graph-resized");
  });

  if($$1('.stat-home').length) {
    setTimeout(initGraphsContainerSize, 750);
  }
}

function stats$1() {
  setTimeout(function() {
    $$1("a[href^='http://www.amcharts.com']").hide();
  }, 300);

  initGraphsContainerSize();

  controlSelector2Init();

  setTimeout(function() {

    initGraphStats();
  }, 600);

  $$1(".nav li a").bind("mouseup", function() {

    setTimeout(function() {
      initGraphsContainerSize();
    }, 200);

    setTimeout(function() {
      initGraphStats();
    }, 600);
  });

  $$1('.stat-graph-filters .filters-graph').click(function() {
    var btn = this;
    var graphContainer = $$1(this).parents('.stat-graph-container');
    getChartFilter(graphContainer.data('uid'));
  });
}

// import 'amcharts3';

function filterChartTableWithItem(evt) {
  if(evt.dataItem)
    evt.item = evt.dataItem;

  // transformation en texte
  evt.item.dataContext.fulllabel += "";

  changeChartTab(1);

  $$1('#field-table').html(window.table);
  $$1('#field-table table tbody tr').show().not('tr[data-abs="' + evt.item.dataContext.fulllabel.replace('"', '\"') + '"]').hide();
  $$1('#field-table div.hidden').removeClass('hidden').find('.filter-text').text("Filtre : " + evt.item.dataContext.fulllabel);

  initUserHover$1();
}

function createPieChart(id, dataProvider, options) {
  var ch = AmCharts.makeChart(id, {
    "type": "pie",
    path: '/bower_components/amcharts3/amcharts',
    "titleField": options.titleField,
    "balloonText": '<b>[[' + options.titleField + ']]<br/>Nombre de données : [[value]] ([[percents]]%)</b><br/>[[bubble]]',
    "legend": {
      "position": "right",
      "marginRight": 100,
      "autoMargins": false
    },
    "valueField": options.valueField,
    "dataProvider": stringToJSON(dataProvider),
    "export": {
      "enabled": true,
      "menu": menu
    },
    "baseColor": window.color,
    "angle": 5,
    "depth3D": 15,
    "listeners": [{
      "event": "clickSlice",
      "method": filterChartTableWithItem
    }]
  });
}

function createFunnelChart(id, dataProvider, options) {
  var ch = AmCharts.makeChart(id, {
    "type": "funnel",
    path: '/bower_components/amcharts3/amcharts',
    "depth3D": 100,
    "balloonText": '<b>[[' + options.titleField + ']]<br/>Nombre de données : [[value]]</b><br/>[[bubble]]',
    "angle": 30,
    "titleField": options.titleField,
    "valueField": options.valueField,
    "dataProvider": stringToJSON(dataProvider),
    "rotate": options.rotation,
    "baseColor": window.color,
    "export": {
      "enabled": true,
      "menu": menu
    },
    "listeners": [{
      "event": "clickSlice",
      "method": filterChartTableWithItem
    }]
  });
}

function createSerialChart(id, dataProvider, options) {
  var graphs = {
    "id": "AmGraph-1",
    "title": "Yoomap",
    "balloonText": '<b>[[' + options.titleField + ']]<br/>Nombre de données : [[value]]</b><br/>[[bubble]]',
    "type": options.type,
    path: '/bower_components/amcharts3/amcharts',
    "valueField": options.valueField,
    "fillAlphas": 0.9,
    "fillColors": window.color,
    "lineColor": "#000000"
  };

  var iscol = (options.type != 'column');

  if(options.type == 'column') {
    options.d3d = 20;
    options.angle3d = 30;
    if(!options.rotation)
      options.labelRot = 45;
    else
      options.labelRot = 0;
  } else {
    options.d3d = 0;
    options.angle3d = 0;
    options.labelRot = 0;
  }

  var ch = AmCharts.makeChart(id, {
    "export": {
      enabled: true,
      "position": "top-left",
      "menu": menu
    },
    "listeners": [{
      "event": "clickGraphItem",
      "method": filterChartTableWithItem
    }],
    "type": "serial",
    path: '/bower_components/amcharts3/amcharts',
    "rotate": options.rotation,
    "categoryField": options.titleField,
    "depth3D": options.d3d,
    "angle": options.angle3d,
    "mouseWheelScrollEnabled": true,
    "graphs": [graphs],
    "dataProvider": stringToJSON(dataProvider),
    "categoryAxis": {
      "startOnAxis": iscol,
      "labelOffset": (options.labelRot == 0) ? 25 : 0,
      "labelRotation": options.labelRot
    },
    "chartScrollbar": {
      "graph": "AmGraph-1",
      "gridAlpha": 0,
      "color": "#888888",
      "scrollbarHeight": 30,
      "backgroundAlpha": 0.5,
      "graphFillAlpha": 0.5,
      "autoGridCount": false,
      "selectedGraphFillAlpha": 0,
      "graphLineAlpha": 0.75,
      "graphLineColor": "#c2c2c2",
      "selectedGraphLineColor": "#888888",
      "selectedGraphLineAlpha": 1,
      "oppositeAxis": !options.rotation

    },
    "valueAxes": [{
      "id": "ValueAxis-1",
      "title": $$1('#title').val(),
      "minimum": 0
    }]
  });

  zoomChart(ch);
}

function chooseChart(evt) {
  if(!window.provider) {
    window.provider = $$1('#field-provider').html();
    $$1('#field-provider').html('');
  }

  if(evt) {
    var uid = $$1('#chart-uid').val();

    if(uid == '') {
      if($$1(this).children(':selected').val() == 'histo')
        $$1('#rotation').prop('checked', true);
      else
        $$1('#rotation').prop('checked', false);
    } else {
      displayError$1('Ceci est un aperçu, veuillez enregistrer pour valider les modifications.');
    }
  }

  var rot = $$1('#rotation').prop('checked');

  $$1('#chart').html('<h2>Chargement du graphique en cours, veuillez patienter...</h2>');

  if($$1('#chart-error').text().length > 0) {
    displayError$1($$1('#chart-error').text());
    $$1('#chart-error').text('');
    $$1('#chart').text('');
    return false;
  }

  switch($$1('#dt-chart-type').val()) {
    case 'pie':
      if($$1('#chart').data('count') <= 25)
        createPieChart('chart', window.provider, {
          'titleField': 'category',
          'valueField': 'column-1'
        }, menu);
      else
        return displayError$1('Cette sélection comporte trop de données en abscisse pour ce type de graphique.');
      break;

    case 'histo':
      createSerialChart('chart', window.provider, {
        'titleField': 'category',
        'valueField': 'column-1',
        'type': 'column',
        'rotation': rot
      }, menu);
      break;

    case 'line':
      createSerialChart('chart', window.provider, {
        'titleField': 'category',
        'valueField': 'column-1',
        'type': 'line'
      }, menu);
      break;

    case 'curve':
      createSerialChart('chart', window.provider, {
        'titleField': 'category',
        'valueField': 'column-1',
        'type': 'smoothedLine'
      }, menu);
      break;

    case 'funnel':
      if($$1('#chart').data('count') <= 25)
        createFunnelChart('chart', window.provider, {
          'titleField': 'category',
          'valueField': 'column-1',
          'rotation': rot
        }, menu);
      else
        return displayError$1('Cette sélection comporte trop de données en abscisse pour ce type de graphique.');
      break;
  }

  setTimeout(function() {
    $$1("a[href*='amcharts']").hide().css('color', 'white');
  }, 500);
}

function finishExecChart(json) {
  var provider = base64Decode((json.provider));

  window.provider = provider;
  window.table = json.html;
  window.color = json.color;

  initUserHover();

  if(json.err && json.err.length > 0)
    displayError$1(json.err);

  $$1('#chart-uid').val(json.uid);
  $$1('#chart').html('');
  $$1('#chart').data('count', json.count);
  $$1('#dt-chart-type').off('change').on('change', chooseChart);
  $$1('.loading-circle').hide(200);

  if($$1('#tab-generateur li').first().hasClass('active') && $$1('.sourceQual:first.btn-success').length > 0)
    $$1('.export-btn-tabler').show();
  else
    $$1('.export-btn-tabler').hide();

  setTimeout(chooseChart, 100);

  $$1('#field-table')
    .html('<button type="button" class="form-control">Afficher les données</button>')
    .find('button.form-control')
    .click((e) => {
      e.currentTarget.parentNode.innerHTML = window.table;
      initUserHover();
    });
}

function failSaveChart(json) {
  if(json.uid && json.uid.length > 0)
    $$1('#chart-uid').val(json.uid);

  $$1('.loading-circle').hide(200);
}

// import 'amcharts3';

window.finishExecChart = finishExecChart;
window.failSaveChart = failSaveChart;


function initFieldsFilter() {
  tooltip();
  placeholder();
  tableSelector();
  formRequester();

  controlInitDatasSelector();
  controlInitSelectMultiple();
  controlSelector2Init();
}

function prepareFilters(dlist, dlistsup) {
  if(!dlistsup) {
    return;
  }

  $$1('.field-filter').off('change').change(function() {
    var result = [];
    var resid = [];

    $$1(".field-filter:visible option:hidden").prop('selected', true);
    $$1(".field-filter :selected").each(function() {
      result.push($$1(this).val());
      resid.push($$1(this).parents('.form-group').data('id'));

      $$1(this).hide();

      if(result.length == $$1('.field-filter :selected').length) {
        setListFilters(dlist.val(), dlistsup.val(), result.join(','), resid.join(','));
      }
    });

    if($$1(".field-filter :selected").length == 0) {
      setListFilters(dlist.val(), dlistsup.val(), '', '');
    }
  });
}

function setListFilters(datatype, datatype2, filters, filtersid) {
  var uid = $$1('#chart-uid').val();

  if(uid.length == 0)
    return displayError$1('Vous devez sauvegarder avant de pouvoir sélectionner des filtres');

  var selopen1 = ($$1('.filter-section > .form-group').eq(0).css('display') == 'none') ? 0 : 1;
  var selopen2 = ($$1('.filter-section > .form-group').eq(1).css('display') == 'none') ? 0 : 1;

  $$1('.field-filter').prop('disabled', true);

  execQuery('filter-chart', {
      'datatype': datatype,
      'datatype2': datatype2,
      'filters': filters,
      'filtersid': filtersid,
      'uid': uid,
      'selectopen1': selopen1,
      'selectopen2': selopen2
    })
    .then((json) => {
      $$1('.field-filter').prop('disabled', false);

      $$1('#field-filters').html(base64Decode(json.filtersList));
      prepareFilters($$1('#dt-list'), $$1('#dt-list-2'));
      prepareFieldList();
      initFieldsFilter();
    })
    .catch(() => $$1('.field-filter').prop('disabled', false));
}

function prepareFieldList() {
  var listName = 'ls-fds-';
  var calcName = 'ls-nb-';

  $$1('.addfilter').unbind('click').click(function() {

    $$1(this).find("i").toggleClass("glyphicons-plus-sign glyphicons-minus-sign");
    $$1(this).next().toggle(400);

  });

  $$1('.removefilter').unbind('click').click(function() {

    if(confirm('Voulez-vous vraiment supprimer ce filtre ?')) {
      var btn = $$1(this);
      btn.parents('.filter-section').find('select').first().find('option:selected').each(function() {

        if($$1(this).val() == btn.data('uid')) {

          $$1(this).prop('selected', false).show();
          $$1(btn).parents('.filter-panel').hide('blind', null, 400).delay(500).remove();
          $$1(this).parents('select').trigger('change');
        }
      });
    }

  });

  $$1('#' + listName + 'ord, #' + listName + 'abs, #' + listName + 'no-ord, #' + listName + 'no-abs').off('change').on('change', function() {

    var suff = ($$1(this).prop('name').indexOf('ord') > -1) ? 'ord' : 'abs';
    var suff2 = ($$1(this).prop('name').indexOf('no-') > -1) ? 'no-' : '';

    suff = suff2 + suff;

    var nb = $$1('#' + calcName + suff).children().length;

    //if ($(this).find(':selected').data('calcul') == 'true')
    if($$1(this).find(':selected').data('calcul')) {
      $$1('#' + calcName + suff).children().each(function(idx) {
        if($$1(this).data('calcul') == 1)
          $$1(this).show();
        else
          $$1(this).hide();
      });

      $$1('#' + calcName + suff).find('option:selected').prop('selected', false);
      $$1('#' + calcName + suff + ' option[data-calcul="1"]').first().prop('selected', true);
    } else {
      $$1('#' + calcName + suff).children().each(function(idx) {
        if($$1(this).data('calcul') != 1)
          $$1(this).show();
        else
          $$1(this).hide();
      });

      $$1('#' + calcName + suff).find('option:selected').prop('selected', false);
      $$1('#' + calcName + suff + ' option').not('option[data-calcul="1"]').first().prop('selected', true);
    }
  });
}

function initChartTable() {
  var uid = $$1('#chart-uid').val();

  if(!uid) {
    $$1('#field-table').html('');
    return false;
  }

  execQuery('get-chart-table', {
      uid
    })
    .then((json) => {
      window.table = base64Decode(json.htmltable);
      $$1('#field-table')
        .html('<button type="button" class="form-control">Afficher les données</button>')
        .find('button.form-control')
        .click((e) => {
          e.currentTarget.parentNode.innerHTML = window.table;
          initUserHover$1();
        });
    });
}

function charts() {
  $$1('.btn-reference').click(function() {

    $$1('.btn-reference').toggleClass('btn-success');
    $$1('.dependSource').toggleClass('hidden');

    $$1('#isAbstract').val($$1('.btn-reference.btn-success').data('value'));
  });

  var fncSourceFollow = function() {
    if($$1('#tab-title-row').hasClass('hidden')) {
      $$1('#tab-title-row').data('isHidden', 1);
    } else
      $$1('#tab-title-row').data('isHidden', 0);

    $$1('#tab-title-row').removeClass('hidden');

    if(!$$1('#list-model').children(':selected').data('nbdt') || $$1('#list-model').children(':selected').data('nbdt') == 0) {
      $$1('#ouFollow').addClass('hidden').find('input').prop('checked', false);
      $$1('#tabtitle').prop('disabled', false);
      $$1('#charts-models .form-group').not('*:eq(0)').addClass('hidden');
    } else if($$1('#list-model').children(':selected').data('nbdt') > 0) {
      $$1('#ouFollow').removeClass('hidden');

      $$1('#charts-models .form-group:eq(1)').removeClass('hidden');

      if($$1('#list-model').children(':selected').data('nbdt') == 2)
        $$1('#charts-models .form-group:eq(2)').removeClass('hidden');
    }
  };

  $$1('#tab-generateur li').click(function() {

    var id = $$1(this).index('#tab-generateur li');
    $$1('#chart-preset').val(id);

    if(id == 1) {
      fncSourceFollow();
    } else {
      if($$1('#tab-title-row').data('isHidden') == 1 || $$1('#isAbstract').val() == 1)
        $$1('#tab-title-row').addClass('hidden');

      $$1('#ouFollow').removeClass('hidden');
    }
  });

  $$1('#list-model').change(fncSourceFollow);

  $$1('#followTab').change(function() {
    $$1('#tabtitle').prop('disabled', $$1(this).prop('checked'));

    if($$1(this).prop('checked'))
      $$1('#tabtitle').val('');
  });

  $$1("#tabtitle").autocomplete({
    appendTo: '#charts-infos',
    source: function(request, resp) {
      execQuery('get-tabs-chart', request)
        .then((json) => {
          var arr = stringToJSON(base64Decode(json.list));
          if(arr.length > 0) resp(arr);
        });
    }
  });

  $$1('#dt-chart-type').change(chooseChart);

  $$1('#dt-list-2').change(function() {

    var dlist = $$1(this);

    $$1('.datasource').prop('disabled', true);

    if(dlist.find(':selected').data('field') && dlist.find(':selected').data('field').length > 0)
      $$1('#chart-fieldLink').val(dlist.find(':selected').data('field'));
    else
      $$1('#chart-fieldLink').val('');

    execQuery('get-fields-dt', {
        id2: dlist.val(),
        abs: 0,
        id: $$1('#dt-list').val()
      })
      .then((json) => {
        $$1('.datasource').prop('disabled', false);
        $$1('#field-list-dt-2').html(base64Decode(json.fieldList2)).show(250);
        $$1('#field-filters').html(base64Decode(json.htmlfilters));

        prepareFilters($$1('#dt-list'), dlist);
        prepareFieldList();
      })
      .catch(() => $$1('.datasource').prop('disabled', false));
  });

  $$1('#dt-list').change(function() {
    var dlist = $$1(this);

    $$1('#dt-list-test').val(dlist.val());

    $$1('.datasource').prop('disabled', true);

    execQuery('get-fields-dt', {
        id: dlist.val(),
        abs: 1,
        id2: dlist.val()
      })
      .then((json) => {
        $$1('.datasource').prop('disabled', false);

        var arr = stringToJSON(base64Decode(json.datasTypes));

        $$1('#dt-list-2')
          .html('')
          .append('<option value="' + dlist.val() + '">' + dlist.find(':selected').text() + '</option>');

        var fd = '';
        for(var i = 0; i < arr.length; i++) {
          if(arr[i].field)
            fd = ' data-field="' + arr[i].field + '" ';
          else
            fd = '';
          // puis on ajoute les datatypes liés par select-data
          $$1('#dt-list-2').append('<option ' + fd + ' value="' + arr[i].id + '">' + arr[i].title + '</option>');
        }

        $$1('#field-list-dt').html(base64Decode(json.fieldList)).show(250);
        $$1('#field-list-dt-2').html(base64Decode(json.fieldList2)).show(250);
        $$1('#field-filters').html(base64Decode(json.htmlfilters));

        prepareFilters(dlist, $$1('#dt-list-2'));
        prepareFieldList();
      })
      .catch(() => $$1('.datasource').prop('disabled', false));
  });

  prepareFilters($$1('#dt-list'), $$1('#dt-list-2'));
  prepareFieldList();
  initChartTable();

  $$1('#tab-charts li').last().click(function() {
    if(window.table && $$1('#charts-datas .table').length == 0) {
      $$1('#field-table').html(window.table);

      initUserHover$1();
    }

  });

  $$1('#submit-chart').click(function() {
    if($$1('#chart-uid').val() != '')
      $$1('.loading-circle').show(200);
  });

  $$1('.loading-circle').offset({
    left: ($$1('#charts-visu').width() * 0.5 - 16),
    top: ($$1('#charts-visu').height() * 0.5 - 16)
  }).css('z-index', 999);

  if($$1('#chart-uid').val() != '') {
    window.color = $$1('#chart-color').val();
    if($$1('#chart').data('fn') != '')
      setTimeout(window[$$1('#chart').data('fn')], 500);
    else
      setTimeout(chooseChart, 500);
  }
}

// import 'public-source/js/addins/jquery/ui-datetime';

function metricsSetLoading(flagLoading) {

  if(flagLoading == true) {
    $$1('#btn-metrics-calculate').hide();
    $$1('#btn-metrics-export').hide();
    $$1('.panel-metric').not('.panel-metric-global').find('.panel-body').html('<div class="loading">Preparing the awesome</div>');
    $$1('.panel-metric').not('.panel-metric-global').find('.panel-footer .details').html('<div class="loading">Getting some details...</div>');
  } else {
    $$1('#btn-metrics-calculate').show();
    $$1('#btn-metrics-export').show();
    $$1('.panel-metric').not('.panel-metric-global').find('.panel-body').html('');
    $$1('.panel-metric').not('.panel-metric-global').find('.panel-footer .details').html('');
  }
}

function metricsCalculate() {
  metricsSetLoading(true);

  var dateStart = $$1('#metrics-date-start').val();
  var dateEnd = $$1('#metrics-date-end').val();

  execQuery('get-metrics-values', {
      'date-start': dateStart,
      'date-end': dateEnd
    })
    .then((json) => {
      metricsSetLoading(false);

      var metrics = stringToJSON(base64Decode(json.metrics));
      if(!metrics) {
        return displayError$1('Error while retrieve metrics');
      }

      for(var i = 0; i <= metrics.length - 1; i++) {

        var id = metrics[i]['uid'];
        var value = metrics[i]['value'];
        var details = trim$1(metrics[i]['details']);

        $$1(`.metric-${id}`).each((i, elm) => {
          const $metric = $$1(elm);
          $metric.find('.panel-body').html(value);

          $metric.find('.panel-footer').each((i, elm) => {
            const $footer = $$1(elm);
            const $details = $footer.find('.details').html(details).toggle(!!details);

            const detailsShown = $details.is(':visible');

            const $show = $footer.find('.toggle-show').toggle(!!(details && detailsShown));
            const $hide = $footer.find('.toggle-hide').toggle(!!(details && !detailsShown));
          })
        });
      }

      navTabs();
    })
    .catch(() => metricsSetLoading(false));
}

function metricsExport() {

  $$1('#metrics-container #alert-metrics-export').remove();

  $$1('#metrics-container').prepend('\
		<div id="alert-metrics-export" class="alert alert-info" style="width:400px; margin:20px auto; text-align:center">\
			<a href="#" class="close" data-dismiss="alert">&times;</a>\
			<br />\
			<h3 style="color:#333">Chargement en cours...</h3>\
			<br />\
		</div>\
	');

  $$1('#btn-metrics-calculate').hide();
  $$1('#btn-metrics-export').hide();

  var dateStart = $$1('#metrics-date-start').val();
  var dateEnd = $$1('#metrics-date-end').val();

  execQuery('export-metrics-values', {
      'date-start': dateStart,
      'date-end': dateEnd
    })
    .then((json) => {
      $$1('#btn-metrics-calculate').show();
      $$1('#btn-metrics-export').show();

      var filename = base64Decode(json.filename);

      $$1('#alert-metrics-export').html('\
				<a href="#" class="close" data-dismiss="alert">&times;</a>\
				<br />\
				<h3 style="color:#333">Exportation terminée</h3><br />\
				<a href="' + filename + '" class="btn btn-lg btn-success">Cliquez ici pour télécharger votre fichier</a>\
				<br /><br />\
			');
    })
    .catch(() => {
      $$1('#btn-metrics-calculate').show();
      $$1('#btn-metrics-export').show();
    });
}

function metricsInit() {

  $$1('#btn-metrics-calculate').bind('click', function() {
    metricsCalculate();
  });
  $$1('#btn-metrics-export').bind('click', function() {
    metricsExport();
  });

  $$1('.panel-metric .panel-footer .toggle-show').bind('click', function() {
    $$1(this).hide();
    $$1(this).parents('.panel-footer').find('.toggle-hide').show();
    $$1(this).parents('.panel-footer').find('.details').show();
  });
  $$1('.panel-metric .panel-footer .toggle-hide').bind('click', function() {
    $$1(this).hide();
    $$1(this).parents('.panel-footer').find('.toggle-show').show();
    $$1(this).parents('.panel-footer').find('.details').hide();
  });
}

function metrics() {

  $$1('#tab-metrics .datepicker').datepicker({
    beforeShow: function(input) {
      $$1(input).css('z-index', 999999999999);
    },
    onClose: function(txt, input) {
      $$1(this).css('z-index', 'auto');
    }
  });
  $$1('#tab-metrics .datepicker-addon').click(function() {
    $$1(this).parents('.input-group').find('.datepicker').datepicker('show');
  });


  // <--- handle date-start and date-end change to adjust download-change-status links
  $$1('#metrics-date-start').off('change').on('change', function() {

    var dateStart = $$1(this).val();
    var dateEnd = $$1('#metrics-date-end').val();

    $$1('.metric-change-status-link').each(function() {

      var url = $$1(this).data('url');
      var dataTypeId = $$1(this).data('data-type-id');

      $$1(this).attr('href', url + '?type=' + dataTypeId + '&start=' + dateStart + '&end=' + dateEnd);
    });
  });

  $$1('#metrics-date-end').off('change').on('change', function() {

    var dateStart = $$1('#metrics-date-start').val();
    var dateEnd = $$1(this).val();

    $$1('.metric-change-status-link').each(function() {

      var url = $$1(this).data('url');
      var dataTypeId = $$1(this).data('data-type-id');

      $$1(this).attr('href', url + '?type=' + dataTypeId + '&start=' + dateStart + '&end=' + dateEnd);
    });
  });
  // --->


  metricsInit();

  navTabs();
}

$$1(document).ready(() => {
  stats$1();
  charts();
  metrics();
});

function setIcons({
  icon,
  glyph
}) {
  icon = icon ? rootUploadURL(icon) : '';
  glyph = icon ? '' : glyph;

  appItem('app-icon').val(icon);
  appItem('app-icon-img').toggle(!!icon).attr('src', icon);
  if(icon) {
    appItem('app-icon').trigger('change');
  }

  appItem('app-glyphicon').val(glyph);
  if(!glyph) {
    appItem('app-icon-img-glyphicon').find('i').remove();
  }
}

function setColor({
  bg,
  text
}) {
  const css = {};

  if(isString(bg)) {
    appItem('app-background-color').val(bg);
    css['background-color'] = bg;
  }

  if(isString(text)) {
    appItem('app-text-color').val(text);
    css.color = text;
  }

  colorDisplays().css(css);
}

function cleanAppForm() {
  appItem('app-id').val('');
  appItem('app-type').val('');
  appItem('app-status').val('enabled');
  appItem('app-title').val('');
  appItem('app-description').val('');

  setColor({
    bg: '',
    text: ''
  });

  appItem('app-url').val('');
  appItem('app-select-url').val('');
  appItem('app-target-blank').prop('checked', false);
  appItem('app-onclick').val('');

  setIcons({
    icon: '',
    glyph: ''
  });

  appItem('table-users').find('tr')
    .add(appItem('table-groups').find('tr'))
    .remove();
}

function removeChoiceAppAffectation($elm) {
  const $tr = $$1($elm).closest('tr');
  const id = $tr.find(':radio').val();
  const app = getAppById();

  if(app && app.users) {
    const index = app.users.indexOf(id);
    if(index > -1) {
      app.users.splice(index, 1);
    }
  }

  $tr.remove();

  countUsersGroupsAffectation();
}

function loadAppForm(app) {
  if(!app) {
    return;
  }

  cleanAppForm();

  if(!appItem('app-form').is(':visible')) {
    appItem('app-form-msg').hide();
    appItem('app-form').fadeIn();
  }

  appItem('app-id').val(app.id);
  appItem('app-type').val(app.type);
  appItem('app-status').val(app.status || 'enabled');
  appItem('app-title').val(app.title);
  appItem('app-description').val(app.description);

  setColor({
    bg: app.backgroundColor,
    text: app.textColor
  });

  appItem('app-url').val(app.url);
  appItem('app-select-url').val(app.url);

  appItem('app-target-blank').prop('checked', app.target === '_blank');
  appItem('app-onclick').val(app.onclick);

  setIcons({
    icon: app.icon,
    glyph: app.glyphicon
  });

  if(app.users) {
    const users = appUsers();

    for(let i = 0, l = app.users.length; i < l; i++) {
      const userid = app.users[i] || {};
      const user = users[userid];

      if(user) {
        continue;
      }

      $$1(`
        <tr class="success">
          <td align="center">
            <input type="radio" value="${userid}" id="ck-user-${userid}" class="ck-user" checked="checked">
          </td>
          <td class="searchable">${user.lastname} ${user.firstname}</td>
          <td align="center">
            <i data-title="Retirer de la liste" class="tooltiped glyphicons glyphicons-remove-circle" data-toggle="tooltip"
              style="cursor:pointer;font-size:18px;"></i>
          </td>
        </tr>
      `)
        .appendTo(appItem('table-users'))
        .find('.glyphicons-remove-circle').click((e) => removeChoiceAppAffectation(e.currentTarget));
    }
  }


  if(app.groups) {
    const groups = appGroups();

    for(let i = 0, l = app.groups.length; i < l; i++) {
      const groupid = app.groups[i];
      const group = groups[groupid] || {};

      if(group) {
        continue;
      }

      $$1(`
        <tr class="success">
          <td align="center">
            <input type="radio" value="${groupid}" id="ck-group-${groupid}" class="ck-group" checked="checked">
          </td>
          <td class="searchable">${group.name}</td>
          <td align="center">
            <i data-title="Retirer de la liste" class="tooltiped glyphicons glyphicons-remove-circle" data-toggle="tooltip"
              style="cursor:pointer;font-size:18px;"></i>
          </td>
        </tr>
      `)
        .appendTo(appItem('table-groups'))
        .find('.glyphicons-remove-circle').click((e) => removeChoiceAppAffectation(e.currentTarget));
    }
  }

  countUsersGroupsAffectation();
}


/**
 * Select the DOM app and js structure element and fill the form
 * @param elt
 */
function selectApp($elm) {
  $elm = $$1($elm);
  const type = $elm.attr('data-type');
  const app = appApps(type, $elm.prop('id'));

  loadAppForm(app);

  appItem('tab-content-apps-buttons').find('.selected').removeClass('selected');
  $elm.addClass('selected');

  $$1('.urls-list').hide();
  $$1(`.${type}-urls`).css('display', 'table-cell');
}

function getAppDefault(appType) {
  return {
    id: Math.floor(Math.random() * 999999),
    type: appType,
    title: 'Nouvelle App',
    description: '',
    backgroundColor: '',
    textColor: '',
    url: '',
    target: '',
    onclick: '',
    icon: '',
    users: [],
    groups: []
  };
}

/**
 * Add an App DOM and within js structure
 * @param app
 * @param flagSelect automaticly select the new added app (default = true)
 */
function addApp(app, flagSelect = true) {
  if(isString(app)) {
    app = getAppDefault(app);
  }

  app = appApps(app.type, app);

  const $appDiv = $$1('<div />', {
    'id': app.id,
    'class': app.type,
    'data-type': app.type
  });

  if(app.icon)
    $appDiv.addClass('app-img');
  else if(app.glyphicon)
    $appDiv.addClass('app-glyphicon');

  $appDiv.css('color', app.textColor);
  $appDiv.css('background-color', app.backgroundColor);

  $appDiv.append('<i class="glyphicons glyphicons-ban app-disabled" ' + ((app.status == 'disabled') ? 'style="display:block;"' : '') + '></i>');
  if(app.icon)
    $appDiv.append('<img src="' + rootUploadURL(app.icon) + '" />');
  if(app.glyphicon)
    $appDiv.append('<i class="' + (app.glyphicon || '') + '" />');

  $appDiv.append('<p>' + app.title + '</p>');

  if(app.type == 'button') {
    $appDiv.append('<span class="app-details glyphicons glyphicons-chevron-right"></span>');
    $appDiv.append('<div class="app-description">' + app.description + '</div>');
  }

  var container = app.type + 's-container';

  if($$1('#' + container).find('.msg').length > 0) $$1('#' + container).find('.msg').remove();
  $$1('#' + container).append($appDiv);

  if(flagSelect)
    selectApp($appDiv);
}

function getAppForm() {
  if(!appItem('app-Id').val()) {
    return false;
  }

  var app = {};
  var usersId = [];
  var groupsId = [];

  $$1('.ck-user:checked').each(function() {
    usersId.push(this.value);
  });
  $$1('.ck-group:checked').each(function() {
    groupsId.push(this.value);
  });

  app.id = appItem('app-id').val();
  app.type = appItem('app-type').val();
  app.status = appItem('app-status').val();
  app.title = appItem('app-title').val();
  app.description = appItem('app-description').val();
  app.backgroundColor = appItem('app-bgcolor').val();
  app.textColor = appItem('app-text-color').val();
  app.glyphicon = appItem('app-glyph-icon').val();
  app.url = appItem('app-icon').val();
  app.target = appItem('app-target-blank').is(':checked') ? '_blank' : '';
  app.onclick = appItem('app-onclick').val();
  app.icon = appItem('app-icon').val();
  app.users = usersId;
  app.groups = groupsId;

  return app;
}

/**
 * Update DOM app and js structure element from form informations
 * @param app
 */
function updateApp(app) {
  if(!app) {
    app = getAppForm();
  }
  if(!app) {
    return;
  }

  appApps(app.type, app);

  const appType = appItem('app-type').val();
  const $elm = $$1(`#${app.id}.${appType}`);

  $elm.find('p').html(app.title);
  $elm.find('.app-description').html(app.description);
  $elm.find('.app-disabled').toggle(app.status === 'disabled');

  $elm.removeClass('app-img').removeClass('app-glyphicon');

  if(app.icon) {
    $elm.addClass('app-img');
    $elm.find('img').show().attr('src', rootUploadURL(app.icon));
    $elm.find('i').hide().removeClass();
  } else if(app.glyphicon) {
    $elm.find('img').hide().attr('src', '');
    $elm.addClass('app-glyphicon');
    $elm.find('i').show().attr('class', app.glyphicon);

    appItem('app-icon-img-glyphicon').show().find('i').remove();
    appItem('app-icon-img-glyphicon').append(`<i class="${app.glyphicon}" style="font-size:30pt;margin-top:8px;"></i>`);
  }

  $elm.css({
    'background-color': app.backgroundColor,
    color: app.textColor
  });
}

// FIXME: Used in 'apps-admin-form-infos.twig' - move into this script
function removeAppIcon() {
  appItem('app-icon-img').attr('src', '').hide();
  appItem('app-icon').val('');
  updateApp();
}

// FIXME: Used in 'apps-admin-form-infos.twig'
function selectAppIcon() {
  filesManager.open({
    uid: 'apps',
    selectionMode: 'single',
    fnCallback: (files) => {
      if(!files) {
        return false;
      }

      if(files.length > 0) {
        appItem('app-icon-img').show().attr('src', files[0].filename);
        appItem('app-icon').val(files[0].filenameShort).trigger('change');
      }

      filesManager.close();
      updateApp();
    }
  });
}

// import 'bootstrap-stylus/js/modal';

function selectChoiceUserGroupJson(data, obj, typeChoice, typeAccessAffectation, cb) {
  // FIXME: The ':visible' does not make sense - investigate to remove it
  let idUniqueTab = $$1('div:visible #app-id').val();

  if(!idUniqueTab) {
    return;
  }

  // FIXME: The ':visible' does not make sense - investigate to remove it
  idUniqueTab = `${idUniqueTab}-${$$1('div:visible #app-id').val()}`;

  const typeChoiceMaj = typeChoice[0].toUpperCase() + typeChoice.substr(1);
  const idTable = `tableSelectChoice${typeChoiceMaj}${idUniqueTab}`;
  const columns = columnChoice(idUniqueTab, typeChoice, typeAccessAffectation);
  const dtSettings = {
    columns,
    data
  };

  $$1(`#selectChoice${typeChoiceMaj}-modal-${idUniqueTab}`).modal('show');

  iniDataTable(obj, idTable, typeChoice, typeAccessAffectation, dtSettings, cb, ($tr) => {
    if($tr.find('.removeChoiceParentappsAffectation').length > 0) {
      removeSelectChoice($tr, obj, 'removeChoiceParentappsAffectation', typeChoice, typeChoiceMaj, typeAccessAffectation);
    }
  });
}

function addChoiceAppAffectation(obj, typeChoice, typeRelation, name) {
  const $table = $$1(`#table-${typeChoice}s tbody`);

  const lineHidden = $table
    .find(`input.ck-${typeChoice}:radio`)
    .first().closest('tr:hidden');

  if(lineHidden.length > 0) {
    lineHidden
      .css('display', 'table-row')
      .find(`input[value=${typeRelation}]:radio`)
      .prop('checked', true);

    return;
  }

  const $line = $$1(`
    <tr>
      <td style="text-align:center;">
        <input type="radio" class="ck-${typeChoice}" checked="checked"
          value="${typeRelation}"
          name="ck-${typeChoice}-${typeRelation}">
      </td>
      <td>
        <label>${name}</label>
      </td>
      <td align="center">
        <i style="cursor:pointer;font-size:18px;" class="tooltiped glyphicons glyphicons-remove-circle" data-toggle="tooltip" data-title="Retirer de la liste"></i>
      </td>
    </tr>
  `);

  $line.find('.glyphicons-remove-circle').click((e) => removeChoiceAppAffectation(e.currentTarget));

  $table.append($line);

  countUsersGroupsAffectation();
}

function appSelectUser(obj) {
  const app = getAppById();
  if(!app) {
    return;
  }

  const users = appUsers();

  const tabUsers = Object.keys(users).map((iduser) => {
    const user = users[iduser] || {};

    return {
      iduser,
      active: (app.users || []).indexOf(iduser) > -1,
      lastname: user.lastname,
      firstname: user.firstname,
      content: `${user.lastname} ${user.firstname}`
    };
  });

  selectChoiceUserGroupJson(tabUsers, obj, 'user', 'appsAffectation', addChoiceAppAffectation);
}

function appSelectGroup(obj) {
  const app = getAppById();
  if(!app) {
    return;
  }

  const groups = appGroups();

  const tabGroups = Object.keys(groups).map((idgroup) => {
    const group = groups[idgroup] || {};
    return [{
      idgroup,
      active: (app.groups || []).indexOf(idgroup) > -1,
      name: group.name
    }];
  });

  selectChoiceUserGroupJson(tabGroups, obj, 'group', 'appsAffectation', addChoiceAppAffectation);
}

// import 'public-source/js/core/jquery-bundles/tooltip-popover';
// import 'jquery-colpick';

// Methods exposed to the global scope
window.removeAppIcon = removeAppIcon;
window.selectAppIcon = selectAppIcon;
window.appSelectUser = appSelectUser;
window.appSelectGroup = appSelectGroup;

function selectAppsButtons(appType) {
  appItem('tab-apps-buttons').find('li')
    .add(appItem('tab-content-apps-buttons').find('.tab-pane'))
    .removeClass('active');

  $$1(`#tab-${appType}, #${appType}`).addClass('active');
}

function saveApps(appType) {
  updateApp();

  const mapping = appApps(appType);
  const apps = [];

  appItem('tab-content-apps-buttons')
    .find(`.${appType}`)
    .each((i, elm) => {
      apps.push(mapping[elm.id]);
    })

  return execQuery(`save-${appType}s`, {
    apps
  });
}

function loadApps() {
  appItem('apps-container').html('<div class="msg">Chargement en cours</div>');

  cleanAppForm();

  execQuery('get-apps')
    .then((json) => {
      appItem('apps-container').html('');
      appApps('app', {});

      const _apps = stringToJSON(base64Decode(json.apps));
      if(!_apps) {
        return appItem('apps-container').html('<div class="msg">Aucune App</div>');
      }
      _apps.forEach((app) => addApp(app, false));
    });
}

function loadButtons() {
  appItem('buttons-container').html('<div class="msg">Chargement en cours</div>');

  cleanAppForm();

  execQuery('get-buttons')
    .then((json) => {
      appItem('buttons-container').html('');
      appApps('button', {});

      const buttons = stringToJSON(base64Decode(json.buttons));
      if(!buttons) {
        appItem('buttons-container').html('<div class="msg">Aucun Button</div>');
      }
      buttons.forEach((button) => addApp(button, false));
    });
}

function loadUsersGroups() {
  execQuery('get-users-groups')
    .then((json) => {
      const usersGroups = stringToJSON(base64Decode(json.usersGroups));

      if(usersGroups.users) {
        appUsers(usersGroups.users);
      }

      if(usersGroups.groups) {
        appGroups(usersGroups.groups.reduce((map, group) => {
          map[group.idgroup] = group;
          return map;
        }, {}));
      }
    });
}

function moveApp(dir) {
  if(dir === 0) {
    return;
  }

  const $curr = $$1(`#${appItem('app-id').val()}`);
  if(!$curr.length) {
    return alert('Merci de sélectionner une App');
  }

  if(dir > 0) {
    $curr.next().after($curr);
  } else {
    $curr.prev().before($curr);
  }
}

function moveAppDown() {
  moveApp(1);
}

function moveAppUp() {
  moveApp(-1);
}

function removeApp(id = appItem('app-id').val()) {
  const $elm = $$1(`#${id}`);

  if(!$elm.length) {
    return;
  }

  $elm.remove()
  hideAppForm();
}

function hideAppForm() {
  appItem('app-form-msg').fadeIn();
  appItem('app-form').hide();
  cleanAppForm();
}


function apps$1() {
  // Only use the app initialisation on the app management page
  if(!$$1('#tab-content-apps-buttons').length) {
    return;
  }

  loadUsersGroups();
  loadApps();
  loadButtons();

  appItem('popover').popover();

  // Init Events
  $$1('#up-app').click(() => moveAppUp());
  $$1('#down-app').click(() => moveAppDown());

  appItem('app-select-url').change(() => appItem('app-url').val(appItem('app-select-url').val()));

  appItem('app-background-color').colpick({
    onBeforeShow: () => appItem('app-background-color').colpickSetColor(appItem('app-background-color').val()),
    onSubmit: (hsb, hex, rgb) => {
      appItem('app-background-color').val(`#${hex}`).colpickHide();
      updateApp();
    },
    onChange: (hsb, hex) => {
      setColor({
        bg: `#${hex}`
      });
      updateApp();
    }
  });

  appItem('app-text-color').colpick({
    onBeforeShow: () => appItem('app-text-color').colpickSetColor(appItem('app-text-color').val()),
    onSubmit: (hsb, hex) => {
      appItem('app-text-color').val(`#${hex}`).colpickHide();
      updateApp();
    },
    onChange: (hsb, hex) => {
      setColor({
        text: `#${hex}`
      });
      updateApp();
    }
  });

  appItem('app-title')
    .add(appItem('app-description'))
    .add(appItem('app-icon'))
    .add(appItem('app-url'))
    .add(appItem('app-onclick'))
    .add(appItem('app-background-color'))
    .add(appItem('app-text-color'))
    .add(appItem('app-glyph-icon'))
    .add(appItem('app-status'))
    .change(updateApp);

  appItem('tab-apps-buttons').find('a').click(hideAppForm);

  // --- Control buttons ---
  $$1('#add-app').click(() => {
    selectAppsButtons('apps');
    addApp('app', true);
  });

  $$1('#add-button').click(() => {
    selectAppsButtons('buttons');
    addApp('button', true);
  });

  $$1('#remove-app').click(() => removeApp());
  $$1('#update-app').click(() => updateApp());

  $$1('#save-apps').click(() => {
    const $formbar = $$1('.form-action-bar').css('visility', 'hidden');

    Promise.all([
      saveApps('app'),
      saveApps('button')
    ]).then((jsons) => {
      $formbar.css('visility', '');
      displaySuccess$1(jsons[0].msg);
    })
  });

  appItem('tab-content-apps-buttons')
    .on('click', '.app, .button', (e) => selectApp(e.currentTarget));
}

// FIXME: Include sortable

function resetElementsPosition() {
  var position = 1;
  $$1('#sortable li').each(function() {
    $$1(this).find('input.data-type-position').val(position);
    $$1(this).find('span.positionDataType').html(position);
    position++;
  });
}

function initEventSortable() {
  $$1('.data-type-not-position span.glyphicons-circle-arrow-left').unbind('click').bind('click', function() {
    var eltLi = $$1(this).closest('li');
    var offline = '';
    if($$1(this).closest('li').hasClass('data-type-offline'))
      offline = 'data-type-offline';

    var newLi = '' +
      '<li class="ui-state-default data-type-in-position ' + offline + '">' +
      '	<span class="glyphicons glyphicons-sorting"></span>' +
      '		<span class="positionDataType"></span>. <span class="titleInPosition">' + $$1(eltLi).find('span.titleNotPosition').html() + '</span>' +
      '	<input type="hidden" class="data-type-position" name="data-type-position-' + $$1(eltLi).attr('id') + '" id="' + $$1(eltLi).attr('id') + '" value="" />' +
      '	<span class="glyphicons glyphicons-circle-arrow-right"></span>' +
      '</li>';

    $$1('#sortable').append(newLi);

    $$1(eltLi).remove();
    resetElementsPosition();
    initEventSortable();
  });

  $$1('.data-type-in-position span.glyphicons-circle-arrow-right').unbind('click').bind('click', function() {
    var eltLi = $$1(this).closest('li');
    var offline = '';
    if($$1(this).closest('li').hasClass('data-type-offline'))
      offline = 'data-type-offline';

    var newLi = '' +
      '<li class="ui-state-default data-type-not-position ' + offline + '" id="' + $$1(eltLi).find('input.data-type-position').attr('id') + '">' +
      '	<span class="glyphicons glyphicons-circle-arrow-left"></span>' +
      '	<span class="titleNotPosition">' + $$1(eltLi).find('span.titleInPosition').html() + '</span>' +
      '</li>';

    $$1('#notSortable').append(newLi);

    $$1(eltLi).remove();
    resetElementsPosition();
    initEventSortable();
  });
}

function elasticSeachAdmin() {
  // <--- enable drag'n drop up/down blocks positions
  $$1('#sortable').sortable({
    'placeholder': 'ui-state-highlight',
    'cancel': '.unsortable', // elements with "unsortable" class are cancelled
    'update': function(event, ui) {
      resetElementsPosition();
    }
  });

  initEventSortable();
}

// import 'blueimp-file-upload';

function Import() {
  var url = rootURL("/query?q=uploader&type=import");

  $$1('#progress-upload .progress-bar').css('width', '0');

  $$1('#fileupload').fileupload({
    url: url,
    dataType: 'json',
    progressall: function(e, data) {

      var progress = parseInt(data.loaded / data.total * 100, 10);
      $$1("#progress-upload").show();
      $$1('#progress-upload .progress-bar').css('width', progress + '%');
    },
    done: function(e, data) {
      // FIXME: Fix to return promise and toskip all the 'isXX' methods

      $$1('#zone-chargement').css('display', 'none');
      $$1("#progress-upload").hide();
      $$1('#progress-upload .progress-bar').css('width', '0');

      var json = data.result;

      if(isAjaxError(json)) return displayError$1(json.msg);

      if(json.pictureFilename) {

        $$1("#form-files .picture").html("<img class='img-responsive' src='" + json.pictureFilename + "?rnd=" + (Math.random() * 999999) + "' />");
        $$1("#form-files #btn-remove-files").show();

        $$1("#picture-profil-container").find("img").attr("src", json.pictureFilename + "?rnd=" + (Math.random() * 999999));
      }

      if(json.filename) {
        $$1('#btn-data-save').removeAttr('disabled');
        //alert(json.filename);
        $$1('#myfile').val(json.filename);
      }

      displaySuccess$1(json.msg);
    }
  }).prop('disabled', !$$1.support.fileInput).parent().addClass($$1.support.fileInput ? undefined : 'disabled');


  $$1('#btn-data-save').click(function() {
    $$1('#zone-chargement').show();
    $$1('#zone-chargement').html('<h3>Chargement en cours ...</h3>');

    execQuery("do-import", {
        'file': $$1('#myfile').val(),
        'typeOfData': $$1('#selectdata').val(),
        'typefile': $$1('#typefile').val()
      }, false)
      .then((json) => {
        displaySuccess$1(json.msg);
        $$1('#zone-chargement').toggle(!!json.logs).html(json.logs);
      })
      .catch(() => $$1('#zone-chargement').hide());
  });
}

let options = {
  fadeSpeed: 100,
  filter: function ($obj) {
    // Modify $obj, Do not return
  },
  above: 'auto',
  preventDoubleContext: true,
  compress: false
};

function initialize(opts) {

  options = $$1.extend({}, options, opts);

  $$1(document).on('click', 'html', function () {
    $$1('.dropdown-context').fadeOut(options.fadeSpeed, function(){
      $$1('.dropdown-context').css({display:''}).find('.drop-left').removeClass('drop-left');
    });
  });
  if(options.preventDoubleContext){
    $$1(document).on('contextmenu', '.dropdown-context', function (e) {
      e.preventDefault();
    });
  }
  $$1(document).on('mouseenter', '.dropdown-submenu', function(){
    var $sub = $$1(this).find('.dropdown-context-sub:first'),
      subWidth = $sub.width(),
      subLeft = $sub.offset().left,
      collision = (subWidth+subLeft) > window.innerWidth;
    if(collision){
      $sub.addClass('drop-left');
    }
  });

}

function updateOptions(opts){
  options = $$1.extend({}, options, opts);
}

function buildMenu(data, id, subMenu) {
  var subClass = (subMenu) ? ' dropdown-context-sub' : '',
    compressed = options.compress ? ' compressed-context' : '',
    $menu = $$1('<ul class="dropdown-menu dropdown-context' + subClass + compressed+'" id="dropdown-' + id + '"></ul>');
      var i = 0, linkTarget = '';
      for(i; i<data.length; i++) {
        if (typeof data[i].divider !== 'undefined') {
      $menu.append('<li class="divider"></li>');
    } else if (typeof data[i].header !== 'undefined') {
      $menu.append('<li class="nav-header">' + data[i].header + '</li>');
    } else {
      if (typeof data[i].href == 'undefined') {
        data[i].href = '#';
      }
      if (typeof data[i].target !== 'undefined') {
        linkTarget = ' target="'+data[i].target+'"';
      }
      if (typeof data[i].subMenu !== 'undefined') {
        $sub = ('<li class="dropdown-submenu"><a tabindex="-1" href="' + data[i].href + '">' + data[i].text + '</a></li>');
      } else {
        $sub = $$1('<li><a tabindex="-1" href="' + data[i].href + '"'+linkTarget+'>' + data[i].text + '</a></li>');
      }
      if (typeof data[i].action !== 'undefined') {
        var actiond = new Date(),
          actionID = 'event-' + actiond.getTime() * Math.floor(Math.random()*100000),
          eventAction = data[i].action;
        $sub.find('a').attr('id', actionID);
        $$1('#' + actionID).addClass('context-event');
        $$1(document).on('click', '#' + actionID, eventAction);
      }
      $menu.append($sub);
      if (typeof data[i].subMenu != 'undefined') {
        var subMenuData = buildMenu(data[i].subMenu, id, true);
        $menu.find('li:last').append(subMenuData);
      }
    }
    if (typeof options.filter == 'function') {
      options.filter($menu.find('li:last'));
    }
  }
  return $menu;
}

function addContext(selector, data) {

  var d = new Date(),
    id = d.getTime(),
    $menu = buildMenu(data, id);

  $$1('body').append($menu);


  $$1(document).on('contextmenu', selector, function (e) {
    e.preventDefault();
    e.stopPropagation();

    $$1('.dropdown-context:not(.dropdown-context-sub)').hide();

    $dd = $$1('#dropdown-' + id);
    if (typeof options.above == 'boolean' && options.above) {
      $dd.addClass('dropdown-context-up').css({
        top: e.pageY - 20 - $$1('#dropdown-' + id).height(),
        left: e.pageX - 13
      }).fadeIn(options.fadeSpeed);
    } else if (typeof options.above == 'string' && options.above == 'auto') {
      $dd.removeClass('dropdown-context-up');
      var autoH = $dd.height() + 12;
      if ((e.pageY + autoH) > $$1('html').height()) {
        $dd.addClass('dropdown-context-up').css({
          top: e.pageY - 20 - autoH,
          left: e.pageX - 13
        }).fadeIn(options.fadeSpeed);
      } else {
        $dd.css({
          top: e.pageY + 10,
          left: e.pageX - 13
        }).fadeIn(options.fadeSpeed);
      }
    }
  });
}

function destroyContext(selector) {
  $$1(document).off('contextmenu', selector).off('click', '.context-event');
}

/*
 * Context.js
 * Copyright Jacob Kelley
 * MIT License
 */

var context = {
	init: initialize,
	settings: updateOptions,
	attach: addContext,
	destroy: destroyContext
};

// import 'public-source/js/addins/jquery/dataTables';

var editor_keywordglobal;
var keywordglobal$1;

function keywordsglobal() {
  editor_keywordglobal = new $$1.fn.dataTable.Editor({
    ajax: rootURL('/query?q=do-modif-keywordglobal'),
    table: "#keywordglobal",
    fields: [{
      label: "KeyWord:",
      name: "title"
    }]
  });

  keywordglobal$1 = $$1('#keywordglobal').DataTable({

    dom: 'lTfiprtip',

    language: {
      processing: "Traitement en cours...",
      search: "Rechercher&nbsp;:",
      lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
      info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
      infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
      infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
      infoPostFix: "",
      loadingRecords: "Chargement en cours...",
      zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
      emptyTable: "Aucune donnée disponible dans le tableau",
      paginate: {
        first: "Premier",
        previous: "Pr&eacute;c&eacute;dent",
        next: "Suivant",
        last: "Dernier"
      },
      aria: {
        sortAscending: ": activer pour trier la colonne par ordre croissant",
        sortDescending: ": activer pour trier la colonne par ordre décroissant"
      }
    },

    ajax: rootURL('/query?q=get-keywordglobal'),
    columns: [{
      data: "title"
    }],
    order: [0, 'asc'],
    lengthMenu: [
      [20, 50, 100, -1],
      [20, 50, 100, "All"]
    ],
    tableTools: {
      sRowSelect: "os",
      sRowSelector: 'td:first-child',
      sSwfPath: "//cdn.datatables.net/tabletools/2.2.3/swf/copy_csv_xls_pdf.swf",
      aButtons: [{
        sExtends: "editor_create",
        sButtonText: "Create a keyword",
        editor: editor_keywordglobal
      }, {
        sExtends: "editor_remove",
        editor: editor_keywordglobal
      }, {
        sExtends: "collection",
        sButtonText: "Export",
        sButtonClass: "save-collection",
        aButtons: ['copy', 'csv', 'xls', 'pdf']
      }]
    }
  });
}

// import 'public-source/js/addins/jquery/dataTables';

var editor_stopwordglobal;
var stopwordglobal$1;

function stopwordsglobal() {
  editor_stopwordglobal = new $$1.fn.dataTable.Editor({
    ajax: rootURL('/query?q=do-modif-stopwordglobal'),
    table: "#stopwordglobal",
    fields: [{
      label: "Stop Word:",
      name: "title"
    }]
  });

  stopwordglobal$1 = $$1('#stopwordglobal').DataTable({
    dom: 'lTfiprtip',

    language: {
      processing: "Traitement en cours...",
      search: "Rechercher&nbsp;:",
      lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
      info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
      infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
      infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
      infoPostFix: "",
      loadingRecords: "Chargement en cours...",
      zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
      emptyTable: "Aucune donnée disponible dans le tableau",
      paginate: {
        first: "Premier",
        previous: "Pr&eacute;c&eacute;dent",
        next: "Suivant",
        last: "Dernier"
      },
      aria: {
        sortAscending: ": activer pour trier la colonne par ordre croissant",
        sortDescending: ": activer pour trier la colonne par ordre décroissant"
      }
    },

    ajax: rootURL('/query?q=get-stopwordglobal'),
    columns: [{
      data: "title"
    }],
    order: [0, 'asc'],
    lengthMenu: [
      [20, 50, 100, -1],
      [20, 50, 100, "All"]
    ],
    tableTools: {
      sRowSelect: "os",
      sRowSelector: 'td:first-child',
      sSwfPath: "//cdn.datatables.net/tabletools/2.2.3/swf/copy_csv_xls_pdf.swf",
      aButtons: [{
        sExtends: "editor_create",
        sButtonText: "Create a stopword",
        editor: editor_stopwordglobal
      }, {
        sExtends: "editor_remove",
        editor: editor_stopwordglobal
      }, {
        sExtends: "collection",
        sButtonText: "Export",
        sButtonClass: "save-collection",
        aButtons: ['copy', 'csv', 'xls', 'pdf']
      }]
    }
  });
}

// import 'public-source/js/addins/jquery/dataTables';

var editor; // use a global for the submit and return data rendering in the examples
var idsToGroup = new Array;
var datatable;
var canDoAdminAdd = false;

function definirMaster() {
  execQuery("word-master", {
      'ids': idsToGroup
    }, false)
    .then((json) => {
      displaySuccess$1(json.msg);
      idsToGroup = [];
      $$1('#group-btn').text('Grouper');
      $$1('#group-btn').attr('disabled', 'disabled');
      $$1('#changemaster-btn').css('visibility', 'hidden');
      datatable.ajax.reload();
    });
}

function groupWord(type) {
  removeTooltip($$1('#group-btn'));

  execQuery("word-group", {
      'ids': idsToGroup,
      'type': type
    }, false)
    .then((json) => {
      displaySuccess$1(json.msg);
      idsToGroup = [];
      $$1('#group-btn').text('Grouper').attr('disabled', 'disabled');
      $$1('#changemaster-btn').css('visibility', 'hidden');
      datatable.ajax.reload();
    });
}

function kindex() {
  keywordsglobal();
  stopwordsglobal();

  editor = new $$1.fn.dataTable.Editor({
    ajax: rootURL('/query?q=do-modif'),
    table: "#keywordindex",
    fields: [{
      label: "Isignore:",
      name: "isignore",
      className: "disabledInput",
      type: "checkbox",
      separator: "|",
      ipOpts: [{
        label: '',
        value: 1
      }]
    }, {
      label: "Keyword:",
      name: "title"
    }, {
      label: "Phonetic:",
      name: "phonetic",
      className: "disabledInput"
    }, {
      label: "Master:",
      name: "mastertitle",
      className: "disabledInput"
    }, {
      label: "Poids:",
      name: "weight",
      className: "disabledInput",
      def: '0'
    }, {
      label: "Ajustement:",
      name: "manualWeight"
    }]
  });

  editor
    .on('open', function(e, type) {
      if(type === 'inline') {
        // Listen for a tab key event when inline editing
        $$1(document).on('keydown.editor', function(e) {
          if(e.keyCode === 9) {
            e.preventDefault();

            // Find the cell that is currently being edited
            var cell = $$1('div.DTE').parent();

            if(e.shiftKey && cell.prev().length && cell.prev().index() !== 0) {
              // One cell to the left (skipping the first column)
              cell.prev().dblclick();
            } else if(e.shiftKey) {
              // Up to the previous row
              cell.parent().prev().children().last(0).dblclick();
            } else if(cell.next().length) {
              // One cell to the right
              cell.next().dblclick();
            } else {
              // Down to the next row
              cell.parent().next().children().eq(1).dblclick();
            }
          }
        });
      }
    })
    .on('close', function() {
      $$1(document).off('keydown.editor');
    });

  $$1('#keywordindex').on('dblclick', 'tbody td', function(e) {
    if($$1(this).index() !== 2 && $$1(this).index() !== 3 && $$1(this).index() !== 4 && $$1(this).index() !== 7) {
      editor.inline(this, {
        submitOnBlur: true
      });
    }
  });

  datatable = $$1('#keywordindex').DataTable({

    dom: 'lTfiprtip',

    "columnDefs": [{
      "searchable": false,
      "orderable": false,
      "targets": 0
    }],

    language: {
      processing: "Traitement en cours...",
      search: "Rechercher&nbsp;:",
      lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
      info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
      infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
      infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
      infoPostFix: "",
      loadingRecords: "Chargement en cours...",
      zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
      emptyTable: "Aucune donnée disponible dans le tableau",
      paginate: {
        first: "Premier",
        previous: "Pr&eacute;c&eacute;dent",
        next: "Suivant",
        last: "Dernier"
      },
      aria: {
        sortAscending: ": activer pour trier la colonne par ordre croissant",
        sortDescending: ": activer pour trier la colonne par ordre décroissant"
      }
    },

    ajax: rootURL('/query?q=get-kindex'),
    columns: [{
      data: null,
      className: ' selectable '
    }, {
      data: "title",
      className: ' selectable '
    }, {
      data: "phonetic",
      className: ' selectable '
    }, {
      data: "mastertitle",
      className: ' selectable '
    }, {
      data: "weight",
      className: ' selectable '
    }, {
      data: "manualWeight",
      className: ' selectable '
    }, {
      data: null,
      className: ' selectable ',
      render: function(data, type, row) {
        return data.weight + data.manualWeight;
      }
    }, {
      data: "isignore",
      render: function(data, type, row) {
        if(type === 'display') {
          return '<input type="checkbox" class="editor-active">';
        }
        return data;
      },
      className: "dt-body-center"
    }, {
      data: null,
      render: function(data, type, row) {
        var disab;
        if(data.isVisibleBtns) {
          disab = ' ';
          canDoAdminAdd = true;
        } else
          disab = ' disabled="disabled" ';
        if(data.stopword)
          return '<button ' + disab + ' style="width:75px;" class="word btn-xs btn btn-danger" data-id="' + data.title + '" data-type="stopword"   >Retirer</button>';
        else
          return '<button ' + disab + ' style="width:75px;" class="word add-word btn-xs btn btn-info" data-id="' + data.title + '" data-type="stopword"   >Ajouter</button>';
      }
    }, {
      data: null,
      render: function(data, type, row) {
        var disab;
        if(data.isVisibleBtns)
          disab = ' ';
        else
          disab = ' disabled="disabled" ';
        if(data.keyword)
          return '<button ' + disab + ' style="width:75px;" class="word btn-xs btn btn-danger" data-id="' + data.title + '" data-type="keyword"   >Retirer</button>';
        else
          return '<button ' + disab + ' style="width:75px;" class="word add-word btn-xs btn btn-info" data-id="' + data.title + '" data-type="keyword"   >Ajouter</button>';
      }
    }],
    order: [6, 'desc'],
    lengthMenu: [
      [20, 50, 100, -1],
      [20, 50, 100, "All"]
    ],
    tableTools: {
      sRowSelect: "os",
      sRowSelector: "td.special",
      sSwfPath: "//cdn.datatables.net/tabletools/2.2.3/swf/copy_csv_xls_pdf.swf",
      aButtons: [{
          sExtends: "editor_create",
          sButtonText: "Create a keyword",
          editor: editor
        },
        /*{ sExtends: "editor_edit",   editor: editor },
        { sExtends: "editor_remove", editor: editor },*/
        {
          sExtends: "collection",
          sButtonText: "Export",
          sButtonClass: "save-collection",
          aButtons: ['copy', 'csv', 'xls', 'pdf']
        }
      ]
    },
    rowCallback: function(row, data) {
      // Set the checked state of the checkbox in the table
      $$1('input.editor-active', row).prop('checked', data.isignore == 1);
    }
  });



  datatable.on('order.dt search.dt', function() {
    datatable.column(0, {
      search: 'applied',
      order: 'applied'
    }).nodes().each(function(cell, i) {
      cell.innerHTML = i + 1;
    });
  }).draw();

  $$1('#keywordindex').on('change', 'input.editor-active', function() {
    editor
      .edit($$1(this).closest('tr'), false)
      .set('isignore', $$1(this).prop('checked') ? 1 : 0)
      .submit();
  });

  var allowFilter = ['keywordindex'];

  $$1.fn.dataTable.ext.search.push(
    function(settings, data, dataIndex) {

      if($$1.inArray(settings.nTable.getAttribute('id'), allowFilter) == -1) {
        // if not table should be ignored
        return true;
      }

      var min = parseInt($$1('#min').val(), 10);
      var ignorekindex = $$1('#ignorekindex').is(':checked');

      var age = parseFloat(data[6]) || 0; // use data for the age column
      var ignore;
      if(data[7] == 1) ignore = true;
      else ignore = false;

      if(((isNaN(min)) ||
          (isNaN(min)) ||
          (min <= age) ||
          (min <= age)) && ((ignorekindex) || !ignore)) {
        //display
        return true;
      }
      return false;
    });

  $$1('#min').keyup(function() {
    datatable.draw();
  });
  $$1('#ignorekindex').change(function() {
    datatable.draw();
  });




  $$1('#keywordindex').on('draw.dt', function() {
    if(!canDoAdminAdd) {
      datatable.column(8).visible(false);
      datatable.column(9).visible(false);
    }
    $$1('.word').unbind("click").bind("click", function() {
      var mythis = this;
      $$1(this).html('<i class="glyphicon glyphicon-refresh gly-spin"></i>');

      execQuery("word-add", {
          'input-text-word': $$1(this).attr('data-id'),
          'type-word': $$1(this).attr('data-type'),
          'is-add': $$1(this).hasClass('add-word')
        }, false)
        .then((json) => {
          if($$1(mythis).hasClass('add-word')) {
            $$1(mythis).removeClass('btn-info');
            $$1(mythis).removeClass('add-word');
            $$1(mythis).addClass('btn-danger');
            $$1(mythis).html('Retirer');
          } else {
            $$1(mythis).addClass('btn-info');
            $$1(mythis).addClass('add-word');
            $$1(mythis).removeClass('btn-danger');
            $$1(mythis).html('Ajouter');
          }

          displaySuccess$1(json.msg);
          stopwordglobal.ajax.reload();
          keywordglobal.ajax.reload();
        });

      return false;
    });
  });


  $$1('#keywordindex tbody').on('click', 'tr', function() {
    $$1(this).toggleClass('active');

    $$1('#changemaster-btn').css('visibility', 'hidden');
    removeTooltip($$1('#group-btn'));
    idsToGroup = new Array;
    var ismasterempty = false;
    var ismasterset = false;
    var listemots = '';
    var choicetobemaster = '';
    var choicemastertitle = '';
    var nbmots = 0;
    var nbmotsmaster = 0;
    var choicemastertitleid;

    datatable.rows('.active').data().each(function(index) {

      if(index.mastertitle == null)
        ismasterempty = true;
      if(index.mastertitle != null) {
        ismasterset = true;
        nbmotsmaster++;
        choicemastertitle = index.mastertitle;
        choicemastertitleid = index.DT_RowId;
      }
      listemots += index.title + '<br/>';
      idsToGroup.push(index.DT_RowId);
      choicetobemaster = index.title;
      nbmots++;
    });

    if(datatable.rows('.active').data().length == 1 && !ismasterempty && ismasterset) {
      $$1('#group-btn').text('Dégrouper');
      $$1('#group-btn').removeAttr('disabled');

      $$1('#changemaster-btn').css('visibility', 'visible');



      if(choicetobemaster == choicemastertitle) {
        context.attach('#keywordindex tr.active', [{
          text: 'Dégrouper',
          action: function(e) {
            e.preventDefault();
            groupWord('degroup');
          }
        }]);
      } else {
        context.attach('#keywordindex tr.active', [{
          text: 'Définir "' + choicetobemaster + '" en master',
          action: function(e) {
            e.preventDefault();
            definirMaster();
          }
        }, {
          text: 'Dégrouper',
          action: function(e) {
            e.preventDefault();
            groupWord('degroup');
          }
        }, {
          text: 'Sortir "' + choicemastertitle + '" du groupe "' + choicetobemaster + '" ',
          action: function(e) {
            e.preventDefault();
            groupWord('exit');
          }
        }]);
      }
    } else {
      if(datatable.rows('.active').data().length > 1 && ismasterempty && !ismasterset) {
        $$1('#group-btn').text('Grouper les ' + datatable.rows('.active').data().length + ' keywords');
        $$1('#group-btn').removeAttr('disabled');

        tooltip($$1('#group-btn'), {
          html: true,
          placement: 'top',
          title: 'Grouper les mots <br/><b>' + listemots + '</b>',
          container: 'body'
        });

        context.attach('#keywordindex tr.active', [{
          text: 'Grouper les ' + nbmots + ' mots',
          action: function(e) {
            e.preventDefault();
            groupWord('group');
          }
        }]);
      } else {
        $$1('#group-btn').text('Grouper');
        $$1('#group-btn').attr('disabled', 'disabled');

        if(datatable.rows('.active').data().length > 1 && ismasterempty && ismasterset && nbmotsmaster == 1) {
          context.attach('#keywordindex tr.active', [{
            text: 'Rajouter ' + (nbmots - 1) + ' mots à "' + choicemastertitle + '"',
            action: function(e) {
              e.preventDefault();
              groupWord('addongroup');
            }
          }]);
        } else {
          context.attach('#keywordindex tr.active', [{
            header: 'Aucune action possible'
          }]);
        }
      }
    }

  });

  $$1('#changemaster-btn').on('click', function() {

    definirMaster();

  });

  $$1('#group-btn').on('click', function() {
    if($$1('#group-btn').text() == 'Dégrouper')
      groupWord('degroup');
    else
      groupWord('group');
  });

  context.init({
    preventDoubleContext: false
  });

  $$1('#validkindexform').on('click', function() {
    execQuery("kindex-maj-vars", {
        'kindex-global-seuil': $$1('#kindex-global-seuil').val(),
        'kindex-global-type': $$1("input[name='kindex-global-type']:checked").val(),
        'create-keyword': $$1("input[name='create-keyword']:checked").val(),
        'create-keyword-weight': $$1('#create-keyword-weight').val()
      }, false)
      .then((json) => displaySuccess$1(json.msg));
    return false;
  });
}

$$1.fn.xbsAreaTab = function() {
  return this.each(function() {
    $$1(this).on('keydown', function(e) {
      if(e.keyCode === 9) { // Appui sur la touche tab
        // Positions du curseur ou de la selection
        var start = this.selectionStart;
        var end = this.selectionEnd;
        // Place le contenu du textarea dans value
        var $this = $$1(this);
        var value = $this.val();

        // Change le contenu de textarea : texte avant la sélection + tab + texte après
        $this.val(value.substring(0, start) +
          "\t" +
          value.substring(end));

        // Positionne le curseur après la tabulation, efface la sélection
        this.selectionStart = this.selectionEnd = start + 1;

        // Désactive le comportement par défaut de tab
        e.preventDefault();
      }
    });
  });
}

let _datatable;

function datatable$1(newdatatable) {
  if(newdatatable) {
    _datatable = newdatatable;
  }
  return _datatable;
}

// import 'bootstrap-stylus/js/modal';

function initWFModal() {
  if($$1("#workflow-modal").length > 0) return;

  $$1("body").append('\
		<div class="modal modal-page" id="workflow-modal" tabindex="-1" role="dialog" data-backdrop="static" >\
			<div class="modal-dialog" style="width:1200px;">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>\
						<h2 class="modal-title">Nouveau Workflow</h2>\
					</div>\
					<div class="modal-body"></div>\
				</div>\
			</div>\
		</div>\
	');
}

function openWFModal() {
  initWFModal();
  $$1("#workflow-modal").modal("show");
}

function finalizeWFStatus() {
  formRequester();
  navTabs();
  tableSelector();
  tooltip();
}

function finalizeSaveWorkflow(json) {
  if(!json) return false;
  if(json.id) $$1("#workflow-modal").find("#idworkflow").val(json.id);
  $$1("#workflow-modal #btn-workflow-dlt").removeAttr('disabled');
  datatable$1().ajax.reload();
}

// import 'bootstrap-stylus/js/modal';

function closeWFModal() {
  $$1("#workflow-modal").modal("hide");
}

function createWF() {
  execQuery("get-workflow-create-form")
    .then((json) => {
      openWFModal();
      $$1("#workflow-modal .modal-body").html(base64Decode(json.content));
      $$1("#workflow-modal #btn-workflow-dlt").attr('disabled', 'disabled');
      $$1('#detailwf').xbsAreaTab(4);
      setTimeout(function() {
        finalizeWFStatus();
      }, 100);
    });
}

function deleteWF() {
  if(confirm("Etes-vos sur de vouloir supprimer ce workflow?")) {
    var idwf = $$1('#idworkflow').val();
    execQuery("workflow-delete", {
        'idworkflow': idwf
      })
      .then(() => {
        datatable$1().ajax.reload();
        closeWFModal();
        setTimeout(function() {
          finalizeWFStatus();
        }, 100);
      });
  }
}

// import 'blueimp-file-upload';
// import 'bootstrap-stylus/js/modal';

// import 'public-source/js/addins/jquery/dataTables';

window.finalizeSaveWorkflow = finalizeSaveWorkflow;
window.closeWFModal = closeWFModal;
window.createWF = createWF;
window.deleteWF = deleteWF;

function editWF(idwf) {
  execQuery("get-workflow-edit-form", {
      'idworkflow': idwf
    })
    .then((json) => {
      openWFModal();
      $$1("#workflow-modal .modal-body").html(base64Decode(json.content));
      $$1("#workflow-modal .modal-header h2").text('Modification d\'un workflow');
      $$1('#detailwf').xbsAreaTab(4);
      setTimeout(function() {
        finalizeWFStatus();
      }, 100);
    });
}

function initWFModalSmall() {
  if($$1(document).find("#workflow-modal-small").length > 0) return;

  $$1(document).find("body").append('\
		<div class="modal modal-page" id="workflow-modal-small" tabindex="-1" role="dialog" data-backdrop="static" >\
			<div class="modal-dialog" style="width:400px;">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>\
						<h2 class="modal-title">Ficher de workflow</h2>\
					</div>\
					<div class="modal-body"></div>\
				</div>\
			</div>\
		</div>\
	');
}

function openWFModalSmall() {
  initWFModalSmall();
  $$1("#workflow-modal-small").modal("show");
}

function action(soluce) {
  execQuery("do-action-wf", {
    'action': $$1('#actiongroupwf').val(),
    'wfids': soluce
  }, false)
  then((json) => {
    if(json.href) {
      openWFModalSmall();
      $$1("#workflow-modal-small .modal-body").html('<div style="padding:15px;" ><a  href="' + json.href + '" target="_blank" >Télécharger le fichier</a></div>')
    } else {
      displaySuccess$1(json.msg);
    }

    datatable$1().ajax.reload();
  });
}

function workflow() {
  datatable$1($$1('#listwf').DataTable({

    language: {
      processing: "Traitement en cours...",
      search: "Rechercher&nbsp;:",
      lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
      info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
      infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
      infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
      infoPostFix: "",
      loadingRecords: "Chargement en cours...",
      zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
      emptyTable: "Aucune donnée disponible dans le tableau",
      paginate: {
        first: "Premier",
        previous: "Pr&eacute;c&eacute;dent",
        next: "Suivant",
        last: "Dernier"
      },
      aria: {
        sortAscending: ": activer pour trier la colonne par ordre croissant",
        sortDescending: ": activer pour trier la colonne par ordre décroissant"
      }
    },

    ajax: rootURL('/query?q=get-listwf'),
    columns: [{
      data: null,
      render: function(data, type, row) {
        if(type === 'display') {
          return '<div class="details-control"><i class="glyphicon glyphicon-pencil"></i></div>';
        }
        return data;
      },
      className: "dt-body-center"
    }, {
      data: "title",
      className: 'togglable'
    }, {
      data: "lastExecution",
      className: 'togglable'
    }, {
      data: "date",
      className: 'togglable'
    }, {
      data: "isActive",
      className: 'togglable'
    }],
    order: [1, 'desc'],
    lengthMenu: [
      [20, 50, 100, -1],
      [20, 50, 100, "All"]
    ]
  }));

  $$1('#listwf').on('click', 'tbody tr .details-control', function(e) {
    var tr = $$1(this).closest('tr');
    editWF(datatable$1().row(tr).data().DT_RowId);
  });

  $$1('#listwf tbody').on('click', 'tr .togglable', function() {
    $$1(this).parent().toggleClass('active');
  });

  $$1('#ignore').change(function() {
    datatable$1().draw();
  });
  $$1('#actiongroupwf').change(function() {
    var soluce = new Array();
    datatable$1().rows('.active').data().each(function(index) {
      soluce.push(index.DT_RowId);
    });
    if(soluce.length == 0)
      alert('Vous n\'avez rien selectionné!');
    else
      action(soluce);

    $$1('#actiongroupwf option[value="default"]').prop('selected', true);
  });

  $$1.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
    var displaydisabled = $$1('#display-disabled').is(':checked');
    var ignore;

    if(data[4] == 'Inactif') ignore = true;
    else ignore = false;

    if(displaydisabled || !ignore) {
      return true;
    }

    return false;
  });

  $$1('#display-disabled').change(function() {
    datatable$1().draw();
  });

  $$1('#progress-upload .progress-bar').css('width', '0');

  $$1('#fileupload').fileupload({
      url: rootURL("/query?q=uploader&type=import"),
      dataType: 'json',
      progressall: function(e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $$1("#progress-upload").show();
        $$1('#progress-upload .progress-bar').css('width', progress + '%');
      },
      done: function(e, data) {
        // FIXME: Fix to return promise and to get rid of all the 'isXX' methods

        var json = data.result;
        if(isAjaxError(json)) return displayError$1(json.msg);
        if(json.filename) {
          execQuery("import-workflow", {
            'file': json.filename
          }, function(response) {
            var json = stringToJSON(response);
            if(!json) return displayError$1(response);
            if(isAjaxError(json)) return displayError$1(json.msg);
            if(isAjaxSuccess(json)) {
              datatable$1.ajax.reload();
              displaySuccess$1(json.msg);
            }
          }, false);
        }
      }
    })
    .prop('disabled', !$$1.support.fileInput)
    .parent()
    .addClass($$1.support.fileInput ? undefined : 'disabled');
}

$$1(document).ready(() => {
  apps$1();
  elasticSeachAdmin();
  Import();
  kindex();
  workflow();
});

// TODO: Optimize :)

var debugbar = 0;
function initDebugBar() {
	if ($$1("#debugbar").length<=0)
		return false;

	$$1("#debugbar .btnDebug").click(function(){
		if(debugbar==0) {
			$$1("#debugbar").animate({marginLeft:"0"});
			debugbar = 1;
			$$1("#debugbar .btnDebug i").removeClass('glyphicon-alert');
			$$1("#debugbar .btnDebug i").addClass('glyphicon-remove');
			$$1("#debugbar .btnDebug").css('margin-right','5px');
			$$1('#debugbar .contentdebug').css('display','inline-block');
		} else {
			$$1("#debugbar ").animate({marginLeft:"-715px",top:'68px',left:'0'});
			debugbar = 0;
			$$1("#debugbar .btnDebug i").removeClass('glyphicon-remove');
			$$1("#debugbar .btnDebug i").addClass('glyphicon-alert');
			$$1("#debugbar .btnDebug").css('margin-right','-140px');
			$$1('#debugbar .contentdebug').css('display','none');
		}
	});

	$$1('#debugbar').draggable({ handle: ".titleDebug" });
}

// FIXME: Verify usecase - possibly move to bundle
// TODO: Optimize/refactor
function getLastQueries() {
  execQuery('get-last-queries')
    .then((json) => {
      if(!json.content) { return displayError$1('No last queries'); }

      const $debugRequests = $$1('#debugbar #debug-requetes textarea');
      $debugRequests.val(
`${base64Decode(json.content)}
###################################
###################################

${$debugRequests.val()}`
			);
    });
}

function cleanLastQueries() {
  $$1('#debugbar #debug-requetes textarea').val('');
}

var trackings;
var colors$1 = {};
var settings = {
  initialized: false,
  active: false,
  pctByGroup: false,
  showClicks: false,
  showLabels: false,
  screenSize: null
};

function eventTrackings(event) {
  if(!trackings[__webUrl]) {
    return null;
  };
  return trackings[__webUrl][event] || null;
}

function trackingId(name) {
  return 'Tracking' + name[0].toUpperCase() + name.substr(1);
}

function groupName(id) {
  return id.substr(0, id.indexOf('::'));
}

function c() {
  return(0 + ((Math.random() * 256) | 0).toString(16)).substr(-2);
}

function randomColor() {
  return '#' + c() + c() + c();
}

function indicator($elm) {
  // If we are not showing labels return 'null'
  if(!$$1(document.body).hasClass('show-tracking')) {
    return null;
  }
  var $indicator = $elm.data('tracking-indicator');

  if($indicator) {
    return $indicator;
  }

  // Create indicator if it is not yet created
  $indicator = $$1('<span class="tracking-indicator"><span class="tracking-label"></span></span>');
  $elm.after($indicator).data('tracking-indicator', $indicator);

  // Return the indicator
  return $indicator;
}

function calc(id) {
  var clicks = eventTrackings('click');
  if(!clicks) {
    return {
      pct: 0,
      count: 0
    };
  }

  var group = groupName(id);

  // Regular count of all clicks (independent of screen size)
  var clickCount = clicks.count;
  var groupCount = clicks[group] || 0;
  var count = clicks[id] || 0;

  // If per screen size is selected, then grab the data corresponding to the screen size
  var ss = settings.screenSize;
  if(ss !== null) {
    clickCount = clicks[ss] || 0;
    groupCount = clicks[group + '::' + ss] || 0;
    count = clicks[id + '::' + ss] || 0;
  }

  // Calculate usage percentage
  var base = settings.pctByGroup ? groupCount : clickCount;

  return {
    pct: !base ? 0 : count / base,
    count: count
  };
}

function updateLabel($elm) {
  var $indicator = indicator($elm);
  if(!$indicator) {
    return null;
  }

  var elm = $elm[0];

  // If the element is hidden hide the indicator
  if((!elm.offsetWidth && !elm.offsetHeight) || getComputedStyle(elm).getPropertyValue('visibility') === 'hidden') {
    return $indicator.hide();
  } else {
    $indicator.show();
  }

  var elmW = elm.offsetWidth;

  // Get the label
  var $label = $$1($indicator[0].firstChild);

  const pos = $elm.position();
  const left = Math.max(elm.offsetLeft, pos.left);
  const top = Math.max(elm.offsetTop, pos.top);

  // Position the indicator
  $indicator
    .width(elmW).height(elm.offsetHeight)
    .css({
      top: top,
      left: left
    });

  // Set the color of the group
  var group = groupName($elm.data('trackClick'));
  if(!colors$1[group]) {
    colors$1[group] = randomColor();
  }
  $indicator.css({
    color: colors$1[group]
  });
  $label.css({
    backgroundColor: colors$1[group]
  });

  // Place the indicator default on the right side of the element (with 5 px margin)
  var labelW = $label[0].offsetWidth;

  // Place labels next to the element, if the label is bigger than the element
  // Primarily to the left, but if there is no space, to the right
  if(labelW > elmW) {
    var elmLeft = $elm.offset().left;
    // TODO: (when there is time) make whole group place labels the same way
    $label.css({
      right: elmLeft - labelW - 5 < 0 ? -labelW - 5 : elmW + 5
    });
  }

  // Update tracking data
  var c = calc($elm.data('trackClick'));
  var text = Math.round(c.pct * 100) + '%';
  if(settings.showClicks) {
    text += ' (' + c.count + ')';
  }
  $label.text(text);

  return $indicator;
}

function updateLabels() {
  $$1('[data-track-click]').each(function() {
    updateLabel($$1(this));
  });
}

function showLabels(show) {
  if(settings.showLabels) {
    show = true;
  }

  $$1(document.body).toggleClass('show-tracking-labels', show);
  updateLabels();
}

function initCheckbox(name, cb) {
  var id = trackingId(name);
  settings[name] = !!localStorage.getItem(id);

  $$1('#' + id)
    .each(function() {
      this.checked = settings[name];
    })
    .on('change', function() {
      var checked = this.checked;
      localStorage[(checked ? 'set' : 'remove') + 'Item'](id, checked);
      settings[name] = checked;
      cb();
    });
}

function initSelect(name, cb) {
  var id = trackingId(name);
  settings[name] = localStorage.getItem(id);

  $$1('#' + id)
    .on('change', function() {
      var val = this.options[this.selectedIndex].value;
      if(val === 'null') {
        val = null;
      }
      localStorage[(val ? 'set' : 'remove') + 'Item'](id, val);
      settings[name] = val;
      cb();
    })
    .each(function() {
      if(settings[name] === null) {
        return;
      }
      $$1.each(this.options, function(i, opt) {
        opt.selected = opt.value === settings[name];
      });
    });
}

function init() {
  // Init debugging settings
  $$1(document)
    .on('mouseenter', '[data-track-click]', function() {
      var $indc = updateLabel($$1(this));
      if($indc) {
        $indc.addClass('show-label');
      }
    })
    .on('mouseleave', '[data-track-click]', function() {
      var $indc = indicator($$1(this));
      if($indc) {
        $indc.removeClass('show-label');
      }
    })
    .on('keydown keyup', function(e) {
      showLabels(e.ctrlKey);
    });

  initCheckbox('pctByGroup', updateLabels);
  initCheckbox('showClicks', updateLabels);
  initCheckbox('showLabels', showLabels);
  initSelect('screenSize', updateLabels);

  showLabels(settings.showLabels);
  settings.initialized = true;
}

function updateTrackings(entries) {
  trackings = {};

  entries.forEach(function(entry) {
    var idParts = entry.id.split('::');
    var url = idParts.shift();
    var event = idParts.shift();
    var id = idParts.join('::');

    trackings[url] = trackings[url] || {};
    trackings[url][event] = trackings[url][event] || {
      count: 0
    };
    trackings[url][event][id ? id : 'count'] = entry.count;
  });

  !settings.initialized ? init() : updateLabels();
}

function getTrackings() {
  var url = __webUrl.replace(/[\\/]+$/g, '') + '/query?q=tracking';
  $$1.getJSON(url, function(data) {
      updateTrackings(data.result);
    })
    .fail(function onRequestFailed(xhr, status, err) {
      displayError$1('Failed to get trackings!<br>(Consult the console for details)');
      console.error('Tracking retrieval error');
      console.log('-- Error thrown:', err);
      console.log('-- URL:', url)
    });
}

function toggleTracking() {
  $$1(document.body).toggleClass('show-tracking', settings.active);
  if(settings.active) {
    getTrackings();
  }
}


function initTrackingDisplay() {
  // If localstorage is not supported just skip the display of the trackings
  if(!localStorage) {
    return;
  }

  initCheckbox('active', toggleTracking);
  toggleTracking();
}

window.cleanLastQueries = cleanLastQueries;
window.getLastQueries = getLastQueries;

$$1(document).ready(() => {
  initDebugBar();
  initTrackingDisplay()
});

}(jQuery));