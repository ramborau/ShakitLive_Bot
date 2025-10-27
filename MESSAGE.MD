TEST MESSAGE

{
"messaging_type":"RESPONSE",
"recipientid":"24614877841461856",
"pageid":"759563007234526",
"type":"template",
"payload":{
"template_type":"generic",
"elements":[
{
"title":"Welcome!",
"image_url":"https://petersfancybrownhats.com/company_image.png",
"subtitle":"We have the right hat for everyone.",
"default_action": {
"type": "web_url",
"url": "https://petersfancybrownhats.com/view?item=103",
"webview_height_ratio": "tall"
},
"buttons":[
{
"type":"web_url",
"url":"https://petersfancybrownhats.com",
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
,
"quick_replies":[
{
"content_type":"text",
"title":"Search",
"payload":"<POSTBACK_PAYLOAD>",
"image_url":"http://example.com/img/red.png"
},
{
"content_type":"location"
}
]

}

TEXT
{
"messaging_type":"RESPONSE",
"recipientid":"RECIPIENTID",
"pageid":"PAGEID",
"type":"text",
"payload":"What do you want to do next?"
}

BUTTONS
{
"messaging_type":"RESPONSE",
"recipientid":"RECIPIENTID",
"pageid":"PAGEID",
"type":"template",
"payload": {
"template_type":"generic",
"elements":[
{
"title":"Welcome!",
"image_url":"https://petersfancybrownhats.com/company_image.png",
"subtitle":"We have the right hat for everyone.",
"default_action": {
"type": "web_url",
"url": "https://petersfancybrownhats.com/view?item=103",
"messenger_extensions": false,
"webview_height_ratio": "tall",
"fallback_url": "https://petersfancybrownhats.com/"
},
"buttons":[
{
"type":"web_url",
"url":"https://petersfancybrownhats.com",
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

### Carousel

{
"messaging_type":"RESPONSE",
"recipientid":"24614877841461856",
"pageid":"759563007234526",
"type":"template",
"payload":{
"template_type":"generic",
"elements":[
{
"title":"Welcome!",
"image_url":"https://petersfancybrownhats.com/company_image.png",
"subtitle":"We have the right hat for everyone.",
"default_action": {
"type": "web_url",
"url": "https://petersfancybrownhats.com/view?item=103",
"webview_height_ratio": "tall"
},
"buttons":[
{
"type":"web_url",
"url":"https://petersfancybrownhats.com",
"title":"View Website"
},{
"type":"postback",
"title":"Start Chatting",
"payload":"DEVELOPER_DEFINED_PAYLOAD"
}
]
},{
"title":"Welcome!",
"image_url":"https://petersfancybrownhats.com/company_image.png",
"subtitle":"We have the right hat for everyone.",
"default_action": {
"type": "web_url",
"url": "https://petersfancybrownhats.com/view?item=103",
"webview_height_ratio": "tall"
},
"buttons":[
{
"type":"web_url",
"url":"https://petersfancybrownhats.com",
"title":"View Website"
},{
"type":"postback",
"title":"Start Chatting",
"payload":"DEVELOPER_DEFINED_PAYLOAD"
}
]
},{
"title":"Welcome!",
"image_url":"https://petersfancybrownhats.com/company_image.png",
"subtitle":"We have the right hat for everyone.",
"default_action": {
"type": "web_url",
"url": "https://petersfancybrownhats.com/view?item=103",
"webview_height_ratio": "tall"
},
"buttons":[
{
"type":"web_url",
"url":"https://petersfancybrownhats.com",
"title":"View Website"
},{
"type":"postback",
"title":"Start Chatting",
"payload":"DEVELOPER_DEFINED_PAYLOAD"
}
]
},{
"title":"Welcome!",
"image_url":"https://petersfancybrownhats.com/company_image.png",
"subtitle":"We have the right hat for everyone.",
"default_action": {
"type": "web_url",
"url": "https://petersfancybrownhats.com/view?item=103",
"webview_height_ratio": "tall"
},
"buttons":[
{
"type":"web_url",
"url":"https://petersfancybrownhats.com",
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

### ADDRESS

{
"messaging_type":"RESPONSE",
"recipientid":"24614877841461856",
"pageid":"759563007234526",
"type":"template",
"payload": {
"template_type": "customer_information",
"countries": [
"PH"
],
"business_privacy": {
"url": "https://bird.com/"
},
"expires_in_days": 1
}

}

### AFTER CHAT

{
"messaging_type":"RESPONSE",
"recipientid":"24614877841461856",
"pageid":"759563007234526",
"type":"template",
"payload": {
"template_type": "customer_feedback",
"title": "Rate your experience with Zappy!.", // Business needs to define.
"subtitle": "Let Shakeys Pizza know how I am doing by answering two questions", // Business needs to define.
"button_title": "Rate Experience", // Business needs to define.
"feedback_screens": [{
"questions":[{
"id": "hauydmns8", // Unique id for question that business sets
"type": "csat",
"title": "How would you rate your experience with Zappy?", // Optional. If business does not define, we show standard text. Standard text based on question type ("csat", "nps", "ces" >>> "text")
"score_label": "neg_pos", // Optional
"score_option": "five_stars", // Optional
}]
}],
"business_privacy":
{
"url": "https://www.example.com"
},
"expires_in_days" : 3 // Optional, default 1 day, business defines 1-7 days
}

}

### ORDER RECIPT

{
"messaging_type":"RESPONSE",
"recipientid":"24614877841461856",
"pageid":"759563007234526",
"type":"template",
"payload":{
"template_type":"receipt",
"recipient_name":"Stephane Crozatier",
"order_number":"12345678902",
"currency":"USD",
"payment_method":"Visa 2345",
"order_url":"http://originalcoastclothing.com/order?order_id=123456",
"timestamp":"1428444852",
"address":{
"street_1":"1 Hacker Way",
"street_2":"",
"city":"Menlo Park",
"postal_code":"94025",
"state":"CA",
"country":"US"
},
"summary":{
"subtotal":75.00,
"shipping_cost":4.95,
"total_tax":6.19,
"total_cost":56.14
},
"adjustments":[
{
"name":"New Customer Discount",
"amount":20
},
{
"name":"$10 Off Coupon",
"amount":10
}
],
"elements":[
{
"title":"Classic White T-Shirt",
"subtitle":"100% Soft and Luxurious Cotton",
"quantity":2,
"price":50,
"currency":"USD",
"image_url":"http://originalcoastclothing.com/img/whiteshirt.png"
},
{
"title":"Classic Gray T-Shirt",
"subtitle":"100% Soft and Luxurious Cotton",
"quantity":1,
"price":25,
"currency":"USD",
"image_url":"http://originalcoastclothing.com/img/grayshirt.png"
}
]
}

}
