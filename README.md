# nodejs wrapper around the WhenIWork API.

[![Build Status](https://semaphoreci.com/api/v1/mysolace/wheniwork-nodejs-unofficial/branches/master/shields_badge.svg)](https://semaphoreci.com/mysolace/wheniwork-nodejs-unofficial)

---

The structure of this code comes from WhenIWork PHP API.

```javascript
var WhenIWork = require('wheniwork-unofficial');
var api = new WhenIWork('api_key', 'email', 'password');

api.get('users', function (users) {
    console.log(users.users);
});
```

Methods provided:
- get
- post
- create
- update
- delete

Function signature for the methods:
```
.method(api_route, request_body, additional_headers, callback)
```

However, request_body and additional_headers are optional.

