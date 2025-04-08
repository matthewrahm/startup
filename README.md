# Your startup name here

[My Notes](notes.md)

THe application I will be creating is a live feed up cyrpto coins on the solana block chain. Users can filter and see live prices of multiple coins at once, and discover live PNLs of different users on different coins. This will incorporate live charts, live filters, and live tables of transactions occurring.

> [!NOTE]
> This is a template for your startup application. You must modify this `README.md` file for each phase of your development. You only need to fill in the section for each deliverable when that deliverable is submitted in Canvas. Without completing the section for a deliverable, the TA will not know what to look for when grading your submission. Feel free to add additional information to each deliverable description, but make sure you at least have the list of rubric items and a description of what you did for each item.

> [!NOTE]
> If you are not familiar with Markdown then you should review the [documentation](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) before continuing.

## 🚀 Specification Deliverable

> [!NOTE]
> Fill in this sections as the submission artifact for this deliverable. You can refer to this [example](https://github.com/webprogramming260/startup-example/blob/main/README.md) for inspiration.

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] Proper use of Markdown
- [ ] A concise and compelling elevator pitch
- [ ] Description of key features
- [ ] Description of how you will use each technology
- [ ] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Within the world of finance and stocks, there is a hidden gem known as cryptocurrency. With Bitcoin, BTC, making huge waves across the news, there are other cryptocurrnecies that are booming behind the scenes to those interested. One of the most booming coins of this current bull run, rising market, is Solana. This is a cutting-edge website that tracks current Solana meme coins in real-time. It features live price updates, interactive charts for detailed analysis, and dynamic transaction tables that let you follow the market as it happens. Whether you're looking to spot the next big trend, analyze market movements, or make informed trading decisions, our website is the ultimate hub for staying ahead in the fast-paced world of Solana meme coins."

### Design

![Design image](<website page 1.png>)![Design image 2](<website page 2.png>)

### Key features

- Live Price Updates: Provides instant access to the latest prices, ensuring users stay informed in the volatile meme coin market, continuously fetches and displays real-time price data for all tracked Solana meme coins, and helps trades make smart choices when choosing to buy or sell
- Interactive Live Charts: Offers a visual representation of price trends, trading volumes, and historical performance, and allows users to predict current coin trends
- Live Transaction Table: Displays live feeds of transactions, including details like token amounts, wallet addresses, and timestamps.

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - I will use to structure the website's content, such as headings, tables for transaction data, sections for charts, and navigation menus
- **CSS** - I will use to enhance and style the website to make it visually appealing for users and to ensure a clean and smooth visual expereince
- **React** - I will use React to manage the dynamic front-end, enabling real-time updates of prices, charts, and transaction tables. The React components will handle user interactions, state management, and rendering live data efficiently.
- **Service** - I will use API integration with services like Solana blockchain explorers or third-party providers for fetching price data, chart data, and transaction histories. Services will handle requests and responses for live updates
- **DB/Login** - I will use this to store user-specific data such as watchlists, preferences, and account information. Login functionality ensures secure access to personalized features like alerts and saved settings.
- **WebSocket** - I will use WebSocket to facilitate live data streaming for prices, charts, and transaction tables by maintaining real-time connections to the blockchain or data providers, ensuring instant updates without frequent API polling.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ x] **Server deployed and accessible with custom domain name** - [My server link](https://ramencrypto.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x ] **HTML pages** - I did complete this part of the deliverable.I added html pages for each section of my website that I will need.
- [x ] **Proper HTML element usage** - Each html element that I incorporated works successfully and follows all guidelines.
- [x ] **Links** - Each page is successfully linked
- [x ] **Text** - Each text is properly formatted and working correctly.
- [ x] **3rd party API placeholder** - Placeholder has been made, specifically for where my charts will go i used a simple logos.
- [ x ] **Images** - I added images that I have access to and put placeholders for future images that I will need to scrape.
- [ x] **Login placeholder** - I have an account creation section and temporary placeholder.
- [x ] **DB data placeholder** - I have a database placeholder which is known as my watchlist section where the username and each selected coin will be displayed
- [x ] **WebSocket placeholder** - Under each section that will require websocket I put proper placeholders for each one.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ x] **Header, footer, and main content body** - I made them all in the design i wanted with the landing page using a bootstrap theme and custom for the other pages.
- [ x] **Navigation elements** - I made my navbar include each oage, included a future search bar, and made it visually appealing.
- [ x] **Responsive to window resizing** - I use flex and made sure that each element still fits with window resizing
- [ x] **Application elements** - I made sure that the future websocket and data base features will fit the theme and the style.
- [ x] **Application text content** - I made sure that the future websocket and data base features will fit the theme and the style.
- [ x] **Application images** - I made sure that the future websocket and data base features will fit the theme and the style.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ x] **Bundled using Vite** - I did complete this part of the deliverable. This was the first part and the easiest out of the whole project. Simple commnads to get it running.
- [ x] **Components** - I did complete this part of the deliverable. This part took me the longest. When I did it for Simon, it did not take me that long at all. When I had to do it for all my own files, I ran into so many issues with React, my pages being incorrect, and so much more. I figured out that I was not linking my landing page properly and that I had to reconfigure the whole structure of my project. This took me way too many attempts and time for no reason. I also had to use the same photo as a placeholder in all the previous image spots.
- [x ] **Router** - Routing between login and voting components.

## 🚀 React part 2: Reactivity

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ x] **All functionality implemented or mocked out** - I did complete this part of the deliverable. I am loving the way that the website is turning out to be. I became addicted to wokring on it and making it look as good as it possibly can be. Everything works great and all the data is saved and stored.
- [ x] **Hooks** - I did complete this part of the deliverable. I used a lot of hooks and this took me a great deal of time to do but my website is almost completely finished except adding in the websocket data. I had a lot of fun doing this all and revamping my website.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ x ] **Node.js/Express HTTP service** - I did complete this part of the deliverable running on port 4000.The Express server listens on port 4000 and provides endpoints for serving the frontend and backend logic.
- [ x ] **Static middleware for frontend** - I did complete this part of the deliverable adding static middleware for the service.
- [ x ] **Calls to third party endpoints** - I did complete this part of the deliverable using CoinGecko API to fetch live cryptocurrency dat through using Axios and Fetch to make GET requests from the backend.
- [ x ] **Backend service endpoints** - I did complete this part of the deliverable making routes fetching live crypto data from CoinGecko.
- [ x ] **Frontend calls service endpoints** - I did complete this part of the deliverable. The React frontend communicates with the backend API using the fetch and axios requests.

## 🚀 DB/Login deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ x ] **User registration** - I implemented a registration endpoint that stores new users in MongoDB with hashed passwords.
- [ x ] **User login and logout** - I created login/logout routes that issue and clear secure auth cookies based on stored tokens.
- [ x ] **Stores data in MongoDB** - User accounts and application data are successfully stored and retrieved from MongoDB.
- [ x ] **Stores credentials in MongoDB** - Passwords are securely hashed using bcrypt and stored in the database during registration.
- [ x ] **Restricts functionality based on authentication** - API routes like watchlist data are protected with middleware that checks the auth cookie before proceeding.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Backend listens for WebSocket connection** - Implemented WebSocket server in `server.js` using the `ws` package. The server fetches real-time cryptocurrency data from CoinGecko API and broadcasts updates to connected clients.
- [x] **Frontend makes WebSocket connection** - Created WebSocket service in `src/services/websocketService.js` that establishes and maintains connections to the crypto data server. The service handles automatic reconnection and provides real-time updates for Solana price data and top cryptocurrencies.
- [x] **Data sent over WebSocket connection** - Implemented real-time transmission of cryptocurrency market data, including Solana's current price, market cap, 24h volume, and price changes. The server sends initial data on connection and updates every 30 seconds to keep the information current.
- [x] **WebSocket data displayed** - Updated the Home component to display real-time cryptocurrency data. The UI shows live price updates, market statistics, and top coins list.
- [x] **Application is fully functional** - The crypto application successfully maintains WebSocket connections for real-time price updates. Users can see live cryptocurrency data without manual refreshing, with proper error handling and automatic reconnection if the connection is lost.
