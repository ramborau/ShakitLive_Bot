API Description:

Get the open API token, which is only applicable to all APIs of Sobot Open Platform v5.0. Contact the Sobot after-sales service personnel to get appid and app_key in the API.

Request method:

GET

Request URL:

https://sg.sobot.io/api/get_token
Request param:

Param Type Required Description
appid String Yes API credential id, the unique API call credential id for the 3rd-party users
create_time String Yes 10-digit timestamp
sign String Yes Signature md5(appid+create_time+app_key)

Return param:

Param Type Required Description
ret_code String Yes Return code
ret_msg String Yes Return message
item Object No Return object

Item object:

Param Type Required Description
token String Yes token code
expires_in String Yes Credential valid time (unit: s)

Timestamp conversion tool:

https://www.unixtimestamp.com/
sign signature generation example:

E.g., appid = "1"; create_time="1569397773"; app_key="2"

sign = Md5("115693977732") is 258eec3118705112b2c53dc8043d4d34.

Request example:

curl https://sg.sobot.io/api/get_token?appid=1&create_time=1569397773&sign=258eec3118705112b2c53dc8043d4d34
Return example:

{
"item": {
"token": "4ac37cb2e9c740dba4b75a34d5358802",
"expires_in": "86400"
},
"ret_code": "000000",
"ret_msg": "success"
}
