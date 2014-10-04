var Susanin = require('susanin');
var augment = require('augment');

var ExSu = augment(Susanin.Route, function (uber) {
	this.constructor = function () {
		if ( ! (this instanceof ExSu)) {
			// tricky logic to pass arguments to the constructor after new
			var args = Array.prototype.slice.call(arguments);
			var TmpCtor = Function.prototype.bind.apply(ExSu, [null].concat(args));
			return new TmpCtor();
		}
		uber.constructor.apply(this, arguments);
	};

	/**
	 * Override build method to switch off addition query_params to route
	 * @param  {Object} params Params for building route
	 * @return {String} url after building        
	 */
	this.build = function (params) {
		var newParams = {},
				hasOwnProp = Object.prototype.hasOwnProperty,
				key,
				isMainParam,
				i, size;

		for (key in params) {
			if (
				hasOwnProp.call(params, key) &&
				params[key] !== null &&
				typeof params[key] !== 'undefined'
			) {
				isMainParam = false;
				for (i = 0, size = this._paramsMap.length; i < size; ++i) {
					if (this._paramsMap[i] === key) {
						isMainParam = true;
						break;
					}
				}

				if (isMainParam) {
					newParams[key] = params[key];
				}
			}
		}

		return this._buildFn(newParams);

	};

	/**
	 * Bridge between susanin and express-style routing
	 * @return {String} url after building
	 */
	this.buildForRouter = function () {
		var key;
		var newParams = {};

		for (i = 0, size = this._paramsMap.length; i < size; ++i) {
			key = this._paramsMap[i];
			if (key !== 'query_string') {
				newParams[key] = ':' + key;
			}
		}
		
		return this._buildFn(newParams);
	};

});

module.exports = ExSu;
