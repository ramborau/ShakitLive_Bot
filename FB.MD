URL https://graph.facebook.com/v24/759563007234526/messages
TOKEN EAASnq7m5LikBP13zyYHKYuaxYk6plvbaKXSz5oIVrngXyizfiZCI8soZCN775KU1ylWZBsyZBCXpqNU5JuP11Ih2ZBPHNG1Kqc3XCJfdKPZAYzn9KQQKJJZBmQCkV6Mv7pddFyQRAMqjVEHO8DjZCuF5vRBZBHc3hykVUZBK5uZBKVYu0OhCgZAeDzc9oZC2ZAcSQdVH9Bq81RaQZDZD

GET USER PROFILE
https://graph.facebook.com/{PSID}?fields=first_name,last_name,profile_pic&access_token=EAASnq7m5LikBP13zyYHKYuaxYk6plvbaKXSz5oIVrngXyizfiZCI8soZCN775KU1ylWZBsyZBCXpqNU5JuP11Ih2ZBPHNG1Kqc3XCJfdKPZAYzn9KQQKJJZBmQCkV6Mv7pddFyQRAMqjVEHO8DjZCuF5vRBZBHc3hykVUZBK5uZBKVYu0OhCgZAeDzc9oZC2ZAcSQdVH9Bq81RaQZDZD

SAMPLE_IMAGE = https://confidentialcontent.s3.eu-west-1.wasabisys.com/flow/workflow/mh8lfq1h.png

TEXT
curl -X POST -H "Content-Type: application/json" -d '{
"recipient":{
"id":"{PSID}"
},
"messaging_type": "RESPONSE",
"message":{
"text":"Hello, world!"
}
}' "https://graph.facebook.com/v24.0/{PAGE-ID}/messages?access_token={PAGE-ACCESS-TOKEN}"

ATTACHMENT

curl -X POST -H "Content-Type: application/json" -d '{
"recipient": {
"id": "1254459154682919"
},
"message": {
"attachments": [
{
"type": "image",
"payload": {
"url": "http://www.messenger-rocks.com/image.jpg"
}
},
{
"type": "image",
"payload": {
"url": "http://www.messenger-rocks.com/image.jpg"
}
}
]
}
}' "https://graph.facebook.com/v24.0/me/messages?access_token={PAGE_ACCESS_TOKEN}"

REPLY TO
curl -X POST -H "Content-Type: application/json" -d '{
"recipient": {
"id": "{PSID}",
}
"messaging_type": "RESPONSE"
"message": {
"text": "Hello, world!"
},
"reply_to": {
"mid": "{MESSAGE_ID}"
}
}' "https://graph.facebook.com/v23.0/{PAGE-ID}/messages?access_token={PAGE_ACCESS_TOKEN}"

BUTTON
curl -X POST -H "Content-Type: application/json" -d '{
"recipient":{
"id":"{PSID}"
},
"message":{
"attachment":{
"type":"template",
"payload":{
"template_type":"button",
"text":"What do you want to do next?",
"buttons":[
{
"type":"web_url",
"url":"https://www.messenger.com",
"title":"Visit Messenger"
}
]
}
}
}
}' "https://graph.facebook.com/v24.0/me/messages?access_token={PAGE_ACCESS_TOKEN}"

COUPON
curl -X POST -H "Content-Type: application/json" -d '{
"recipient":{
"id":"PSID"
},
"message":{
"attachment": {
"type": "template",
"payload": {
"template_type": "coupon",
"title":"10% off everything",
"coupon_code":"10PERCENT",
},
}
}
}' "https://graph.facebook.com/LATEST-API-VERSION/PAGE-ID/messages?access_token=PAGE-ACCESS-TOKEN"

COMPLEX COUPON

curl -X POST -H "Content-Type: application/json" -d '{
"recipient":{
"id":"PSID"
},
"message":{
"attachment": {
"type": "template",
"payload": {
"template_type": "coupon",
"title":"10% off everything",
"subtitle":"10% off. Limit 1 per customer. Expires on October 1st, 2022",
"coupon_code":"10PERCENT",
"coupon_url":"https://www.myshop.com/",
"coupon_url_button_title":"Shop now",
"coupon_pre_message":"Here'\''s a deal just for you!",
"image_url": "https://www.myshop.com/sale-image.png",
"payload":"The coupon for 10% off everything that expires 2022-10-1",
},
}
}
}' "https://graph.facebook.com/LATEST-API-VERSION/PAGE-ID/messages?access_token=PAGE-ACCESS-TOKEN"

CSAT
curl -X POST -H "Content-Type: application/json" -d '{
"recipient": {
"id": "<PSID>"
},
"message": {
"attachment": {
"type": "template",
"payload": {
"template_type": "customer_feedback",
"title": "Rate your experience with Original Coast Clothing.", // Business needs to define.
"subtitle": "Let Original Coast Clothing know how they are doing by answering two questions", // Business needs to define.
"button_title": "Rate Experience", // Business needs to define.
"feedback_screens": [{
"questions":[{
"id": "hauydmns8", // Unique id for question that business sets
"type": "csat",
"title": "How would you rate your experience with Original Coast Clothing?", // Optional. If business does not define, we show standard text. Standard text based on question type ("csat", "nps", "ces" >>> "text")
"score_label": "neg_pos", // Optional
"score_option": "five_stars", // Optional
"follow_up": // Optional. Inherits the title and id from the previous question on the same page. Only free-from input is allowed. No other title will show.
{
"type": "free_form",
"placeholder": "Give additional feedback" // Optional
}
}]
}],
"business_privacy":
{
"url": "https://www.example.com"
},
"expires_in_days" : 3 // Optional, default 1 day, business defines 1-7 days
}
}
}
}' "https://graph.facebook.com/v7.0/me/messages?access_token=<PAGE_ACCESS_TOKEN>"

GENERIC
curl -X POST -H "Content-Type: application/json" -d '{
"recipient":{
"id":"<PSID>"
},
"message":{
"attachment":{
"type":"template",
"payload":{
"template_type":"generic",
"elements":[
{
"title":"Welcome!",
"image_url":"https://raw.githubusercontent.com/fbsamples/original-coast-clothing/main/public/styles/male-work.jpg",
"subtitle":"We have the right hat for everyone.",
"default_action": {
"type": "web_url",
"url": "https://www.originalcoastclothing.com/",
"webview_height_ratio": "tall"
},
"buttons":[
{
"type":"web_url",
"url":"https://www.originalcoastclothing.com/",
"title":"View Website"
},{
"type":"postback",
"title":"Start Chatting",
"payload":"DEVELOPER_DEFINED_PAYLOAD"
}
]
}
]
}
}
}
}' "https://graph.facebook.com/v15.0/me/messages?access_token=<PAGE_ACCESS_TOKEN>"

QUICK REPLIES
curl -X POST -H "Content-Type: application/json" -d '{
"recipient":{
"id":"{PSID}"
},
"messaging_type": "RESPONSE",
"message":{
"text": "Pick a color:",
"quick_replies":[
{
"content_type":"text",
"title":"Red",
"payload":"{POSTBACK_PAYLOAD}",
"image_url":"http://example.com/img/red.png"
},{
"content_type":"text",
"title":"Green",
"payload":"{POSTBACK_PAYLOAD}",
"image_url":"http://example.com/img/green.png"
}
]
}
}' "https://graph.facebook.com/v24.0/me/messages?access_token={PAGE_ACCESS_TOKEN}"

TYPING INDECATOR
curl -X POST -H "Content-Type: application/json" -d '{
"recipient":{
"id":"<PSID>"
},
"sender_action":"typing_on"
}' "https://graph.facebook.com/VERSION/PAGE-ID/messages?access_token=PAGE-ACCESS_TOKEN;"

**_ ONE TIME _**
ICE BRAKERS
curl -X POST -H "Content-Type: application/json" -d '{

     "ice_breakers":[
       {
          "call_to_actions":[
             {
                "question":"<QUESTION>",
                "payload":"<PAYLOAD>"
             },
             {
                "question":"<QUESTION>",
                "payload":"<PAYLOAD>"
             }
          ],
          "locale":"default" // default locale is REQUIRED
       },
       {
          "call_to_actions":[
             {
                "question":"<QUESTION>",
                "payload":"<PAYLOAD>"
             },
             {
                "question":"<QUESTION>",
                "payload":"<PAYLOAD>"
             }
          ],
          "locale":"en_GB"
       }
    ]

}' "https://graph.facebook.com/v24.0/me/messenger_profile?access_token=<PAGE_ACCESS_TOKEN>"

COMMANDS

curl -X POST -H "Content-Type: application/json" -d '{
"commands": [
{
"locale": "default",
"commands": [
{
"name": "flights",
"description": "Find real-time flights and fares"
},
{
"name": "hotels",
"description": "Find real-time hotel rooms and rates"
},
{
"name": "currency",
"description": "Find real-time currency exchange rates"
},
{
"name": "weather",
"description": "Find real-time weather reports and forecasts"
}
]
}
]
}' "https://graph.facebook.com/v24.0/me/messenger_profile?access_token=<PAGE_ACCESS_TOKEN>"

WELCOME
curl -X POST -H "Content-Type: application/json" -d '{
"Hey Zappy": {"payload": "<postback_payload>"}
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=<PAGE_ACCESS_TOKEN>"

PERSISTANT MENU

curl -X POST -H "Content-Type: application/json" -d '{
"psid": "<PSID>",
"persistent_menu": [
{
"locale": "default",
"composer_input_disabled": false,
"call_to_actions": [
{
"type": "postback",
"title": "Talk to an agent",
"payload": "CARE_HELP"
},
{
"type": "postback",
"title": "Outfit suggestions",
"payload": "CURATION"
},
{
"type": "web_url",
"title": "Shop now",
"url": "https://www.originalcoastclothing.com/",
"webview_height_ratio": "full"
}
]
}
]
}' "https://graph.facebook.com/v24.0/me/custom_user_settings?access_token=<PAGE_ACCESS_TOKEN>"

OTHER
ADDRESS MESSAGES
curl -X POST -H "Content-Type: application/json" -d '{
"recipient": {
"id": "CUSTOMER-PAGE-SCOPED-ID"
},
"message": {
"attachment": {
"type": "template",
"payload": {
"template_type": "customer_information",
"countries": [
"US"
],
"business_privacy": {
"url": "PRIVACY-POLICY-URL"
},
"expires_in_days": 1
}
}
}
}' "https://graph.facebook.com/LATEST-API-VERSION/PAGE-ID/messages?access_token=PAGE-ACCESS-TOKEN"

OPTIONS
Phillippines
Overide Property
label
required
Form Label
address_line_1
ADDRESS_LINE_1
true
Address Line 1
address_line_2
ADDRESS_LINE_2
false
Address Line 2
administrative_area
PROVINCE
true
Province
locality
BARAGGAY_DISTRICT_VILLAGE
false
Barangay/District/Village
postal_code
ZIP
false
Zip – Input is 5 numbers or 5 numbers, a hypen, and 4 numbers
subadministrative_area
CITY_MUNICIPALITY
true
City/Municipality

\*\*\* UPLOAD ASSET TO FACEBOOK
curl -X POST "https://graph.facebook.com/v24.0/Your-page-id/message_attachments" \
 -H "Content-Type: application/json" \
 -d '{
"access_token":"Your_page_access_token",
"message":{
"attachment":{
"type":"image",
"payload":{
"url":"https://your-url.com/image.jpg",
"is_reusable": true
}
}
}
}'
