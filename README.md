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

- [ ] **Header, footer, and main content body** - I did not complete this part of the deliverable.
- [ ] **Navigation elements** - I did not complete this part of the deliverable.
- [ ] **Responsive to window resizing** - I did not complete this part of the deliverable.
- [ ] **Application elements** - I did not complete this part of the deliverable.
- [ ] **Application text content** - I did not complete this part of the deliverable.
- [ ] **Application images** - I did not complete this part of the deliverable.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - Routing between login and voting components.

## 🚀 React part 2: Reactivity

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.

## 🚀 DB/Login deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **User registration** - I did not complete this part of the deliverable.
- [ ] **User login and logout** - I did not complete this part of the deliverable.
- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Restricts functionality based on authentication** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
