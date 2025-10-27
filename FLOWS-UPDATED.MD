Welcome Message BUTTON -
WOW-ing day to you! 🎉
I’m Zappy, your virtual assistant.
I’m still learning, but I can already help with most questions.
If you'd prefer to talk to a human, just type “Live Agent.” 😊
BTN 1 - Order Now
BTN 2 Track Order
BTN 3 - Other

ORDER FLOW

1. Exciting message with two button options

1. AI Order - IF User Orders types realted food item, then match that with our products.json file and give the menu in Carousel if the menu is accurate if not if it something like pizza or generic then give options as 1. Classic Cheese Pizza Americana – SUPERSIZED 18-inch, oozing with pure mozzarella cheese (P1,204.00)

2) Super Trio Pizza Bundle 1 – 1 Supercard Classic, 1 Large Thin Crust Pizza (any Classic flavor), 2 Party Thin Crust Classic Pizzas, and a Coke 1.5L (P1,578.00)

3) Truffle Greens Pizza – Truffle pizza with tomatoes, olives, mushrooms, and feta cheese (P399.00)

4) Pizza Bianca Pizza Americana – SUPERSIZED 18-inch white sauce pizza with smoked bacon, ham, mushrooms, and cheddar cheese (P1,324.00)

5) Truffle Four Cheese Pizza Americana – SUPERSIZED 18-inch pizza with four cheeses and truffle flavor (P1,204.00)

6) Pizza Bianca – White sauce pizza with smoked bacon, ham, mushrooms, green bell pepper, cheddar & parmesan cheese (P399.00)

7) Super Trio Pizza Bundle 2 – 1 Supercard Classic and 3 Large Thin Crust Pizzas (Classic flavors) with a 1.5L Coke (P1,378.00)

8) Classic Cheese – Classic pizza with mozzarella cheese (P299.00)

9) Classic Beef N' Onion Pizza Americana – SUPERSIZED 18-inch pizza with mozzarella, ground beef, and onions (P1,204.00)

10) Angus Steakhouse Pizza – Angus beef, roasted onions, mushrooms, and potato strings (P469.00)

Use Nice Formatting for this then KEEP the flow active if user types 7 then reply with Super Trio Pizza Bundle 2 – 1 Supercard Classic and 3 Large Thin Crust Pizzas (Classic flavors) with a 1.5L Coke (P1,378.00) added to cart and then give message for drinks with option as order or skip with buttons and images then next for deserts same and then finally ask the location after location generate a payment link and push the cart data with address to an external webhook - that i will provide

2. Order Online

open the link give this link https://overfrugally-unsweltered-leonida.ngrok-free.dev/order in webview and then user will order from there

3. Locations - if user asks for locations then give locations in Carousel with image location and get directions and open random google map location

4. For Suparcard realted question give the answer and then share follow up question as GET CARD with nice image and External URL as https://overfrugally-unsweltered-leonida.ngrok-free.dev/cards

5. For Tracking give webview button with https://overfrugally-unsweltered-leonida.ngrok-free.dev/track and or ask to share Tracking ID - then show tracking in nice formmated way as getting delivered in 21 Mins

6. Whenever one flow is on make a entery of that flow in the database for eg order, location, supercard, tracking, complaints for comaplaints be little warm and applogise and then say you will be transffered to the live agent soon

7. Create AI Analaysis of chats at the backend give right hand side drawer menu for chat and ther show all the data and reports realted to chat aslo whenever any flow is live upload that icon infront of the <div class\="border-b p-4 bg-background"><div class\="flex items-center gap-3"><div class\="relative flex shrink-0 overflow-hidden rounded-full h-10 w-10"><div class\="flex h-full w-full items-center justify-center rounded-full bg-muted">RM</div\></div\><div\><h2 class\="font-semibold">Rahul<!-- --> <!-- -->Mane</h2\><p class\="text-xs text-muted-foreground">24614877841461856</p\></div\></div\></div\> name in red and show completed before that in green use icons for this also give option at backend to intiate any flow between 1) Order 2) Supercard 3) Location 4) Tracking it can be accesed from the right hand side panel only and also show cart value if user has added anything in past also give history of the user make it awesome

8. If you feel the chat is over as you have answered the user and there is no any question from user for more than 3 mins then write a bye message as 🎉 You’ve been awesome!
   Zappy is checking out for now, but I’ll be back whenever you need me.

9. and after that send a message as After chat message

Messages types to use A) all faqs - mostly text B) Location carousel with image and direction google map C) Order give option of both the flows in button 1) AI Order 2) Order - Webview D) If Menu Items are less than 6 - arousel with image and add to cart and then send updated cart value keep the cart value stored in cache and after each step store in Dabase E) Super card buy option - webview F) Tracking give text and webview both randomly G) Offers - with text

Webview ENDPOINTS - Order Online - https://shakeys-app.vercel.app/
Webview ENDPOINTS - Track Online - https://shakeys-app.vercel.app/track
Webview ENDPOINTS - Group / Party - https://shakeys-app.vercel.app/group-order
