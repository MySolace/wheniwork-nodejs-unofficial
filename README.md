#nodejs wrapper around the WhenIWork API.

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

