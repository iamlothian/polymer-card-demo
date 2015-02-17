(function(PolymerExpressions){

	if(!PolymerExpressions) {
		console.error('PolymerExpressions not found');
		return;
	};

	PolymerExpressions.prototype.json = function(input, pretty) {
		return !!pretty ? 
			JSON.stringify(input, null, '\t'): 
			JSON.stringify(input);
	};

	PolymerExpressions.prototype.currency = function(val, c, d, t){
		var n = val, 
		    c = isNaN(c = Math.abs(c)) ? 2 : c, 
		    d = d == undefined ? "." : d, 
		    t = t == undefined ? "," : t, 
		    s = n < 0 ? "-" : "", 
		    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
		    j = (j = i.length) > 3 ? j % 3 : 0;
	   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	}

	PolymerExpressions.prototype.currencyShort = function(val) {
			var cmpval = Math.abs(val);
			if (cmpval < 1000) {
				return '$' + val.toFixed(0);
			}
			else if (cmpval >= 1000 && cmpval < 1000000) {
				var truncVal = (val / 1000);
				return '$' + (truncVal % Math.floor(truncVal) ?
					truncVal.toFixed(1) :
					truncVal.toFixed(0)
					) + "K";
			} 
			else if (cmpval >= 1000000) {
				var truncVal = (val / 1000000);
				return '$' + (truncVal % Math.floor(truncVal) ?
					truncVal.toFixed(1) :
					truncVal.toFixed(0)
					) + "M";
			}
	};
})(window.PolymerExpressions);