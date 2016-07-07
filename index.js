
var VERSION = '0.2.0';

var Request = require('request');

var WhenIWork = function (key, email, password, companyName, failureCallback) {
    if (typeof companyName==="function") {
        failureCallback = companyName;
        companyName = false;
    }
    this.token = '';
    this.headers = {};
    this.endpoint = 'https://api.wheniwork.com/2';
    this._login({key:key, email:email, password:password, companyName:companyName}, failureCallback);
    this.authenticated = false;
};

WhenIWork.prototype._login = function (options, failureCallback) {
    // options: {key, email, password, companyName}
    var self = this;
    var params = {
        username: options.email,
        password: options.password
    };

    this._makeRequest('login', 'post', params, {'W-Key': options.key}, function (response) {
        if (response.login && response.login.token) {
            self.headers['W-Token'] = options.companyName ? findToken(response, options.companyName) : response.login.token;
            self.authenticated = true;
        } else {
            // we didn't receive a token. log why
            console.log(response);
            if (typeof failureCallback !== 'undefined') {
                failureCallback(response);
            }
        }
    });
};

function findToken (response, companyName) {
    var accountId;

    for (var i = 0; i < response.accounts.length; i++) {
        if (response.accounts[i].company === companyName) {
            accountId = response.accounts[i].id;
            break;
        }
    }

    for (var j = 0; j < response.users.length; j++) {
        if (response.users[j].account_id === accountId) {
            return response.users[j].token;
        }
    }

    return false;
}

WhenIWork.prototype.setToken = function (token) {
    this.token = token;

    return this;
};

WhenIWork.prototype.getToken = function (token) {
    return this.token;
};

WhenIWork.prototype.setHeaders = function (headers, reset) {
    if (typeof reset == undefined) {
        reset = false;
    }

    if (reset) {
        this.headers = {};
    }

    for (var i in headers) {
        this.headers[i] = headers[i];
    }

    return this;
};

WhenIWork.prototype.get = function () {
    var params = putFunctionLast(arguments, 4);

    var method = params[0]
      , requestParams = params[1]
      , headers = params[2]
      , callback = params[3]
    ;

    var u = '';
    for (var i in requestParams) {
        u = u + i + '=' + requestParams[i] + '&';
    }

    var uri = method + '?' + u;
        
    this._makeRequest(uri, 'get', requestParams, headers, callback);
};

WhenIWork.prototype.post = function () {
    var params = putFunctionLast(arguments, 4);

    var method = params[0]
      , requestParams = params[1]
      , headers = params[2]
      , callback = params[3]
    ;

    this._makeRequest(method, 'post', requestParams, headers, callback);
};

WhenIWork.prototype.create = function () {
    var params = putFunctionLast(arguments, 4);

    var method = params[0]
      , requestParams = params[1]
      , headers = params[2]
      , callback = params[3]
    ;

    this.post(method, requestParams, headers, callback);
};

WhenIWork.prototype.update = function () {
    var params = putFunctionLast(arguments, 4);

    var method = params[0]
      , requestParams = params[1]
      , headers = params[2]
      , callback = params[3]
    ;

    this._makeRequest(method, 'put', requestParams, headers, callback);
};

WhenIWork.prototype.delete = function () {
    var params = putFunctionLast(arguments, 4);

    var method = params[0]
      , requestParams = params[1]
      , headers = params[2]
      , callback = params[3]
    ;

    this._makeRequest(method, 'delete', requestParams, headers, callback);
};

WhenIWork.prototype._makeRequest = function(method, request, params, headers, callback) {
    if (method !== 'login' && !this.authenticated) {
        var self = this;
        setTimeout(function (m, r, p, h, c) {
            self._makeRequest(m, r, p, h, c);
        }, 100, method, request, params, headers, callback);
        return;
    }

    var url = this.endpoint + '/' + method;

    if (typeof headers != 'undefined') {
        for (var i in headers) {
            this.headers[i] = headers[i];
        }
    }

    this.headers['User-Agent'] = 'WhenIWork-nodejs/' + VERSION;

    var options = {
        method: request,
        url: url,
        headers: this.headers,
        body: JSON.stringify(params)
    };

    Request(options, function (error, response, body) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            callback(JSON.parse(body));
        }
    });
}

module.exports = exports = WhenIWork;

function putFunctionLast(params, length) {
    var returnArray = [],
        foundFunction = false;

    for (var i = 0; i < length-1; i++) {
        if (foundFunction) {
            returnArray[i] = null;
        } else {
            if (typeof params[i] == 'function') {
                foundFunction = true;
                returnArray[length-1] = params[i];
            } else {
                returnArray[i] = params[i];
            }
        }
    }

    if (typeof returnArray[length-1] !== 'function') {
        returnArray[length-1] = function () {};
    }

    return returnArray;
}

