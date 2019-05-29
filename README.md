# nodejs-tsdns
Node.js tsdns server with restful api

# Api usage

All request requires a header:

authorization : YOUR_TSDNS_API_KEY

**List DNS zones**

Url: YOUR_TSDNS_SERVER_DOMAIN:3000/list

METHOD: GET 

**Add DNS zone**

Url: YOUR_TSDNS_SERVER_DOMAIN:3000/add/DNS_ZONE/TARGET

METHOD: GET 

**GET DNS zone**

Url: YOUR_TSDNS_SERVER_DOMAIN:3000/get/DNS_ZONE
METHOD: GET 

**Delete DNS zone**

Url: YOUR_TSDNS_SERVER_DOMAIN:3000/del/DNS_ZONE

METHOD: GET 
