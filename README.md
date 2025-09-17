# DutyBot (Slack MVP)

DutyBot is a simple Slack bot that lets Vice Presidents assign duties to board members with due dates.  
All interaction happens inside Slack using slash commands.

---

## Setup Instructions

1. **Prerequisites**
   - Install **Node.js** v18+ (LTS recommended)  
   - Have a **Slack workspace** where you can install DutyBot  
   - Install **ngrok** (account already included with credentials below)  

2. **Clone and Install**
   - Clone the repository and install dependencies:
     ```bash
     git clone <this-repo-url> dutybot
     cd dutybot
     npm install
     ```

3. **Environment Setup**
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Create a `.env` and paste this into it:
     ```env
     SLACK_BOT_TOKEN=xoxb-8763317038693-9529823891666-eLmfnV8gYcgp4A8BmMjbNVPj
     SLACK_SIGNING_SECRET=01a73845e9fa450ebd95723b2f99b0c0
     PORT=3000
     ```
   - These credentials are already configured for you — just paste them.

4. **Start the Bot**
   - Run the bot in one terminal:
     ```bash
     npm start
     # or: node index.js
     ```
   - You should see:
     ```
     ⚡️ DutyBot is running on port 3000
     ```

5. **Start ngrok**
   - In another terminal, run:
     ```bash
     ngrok config add-authtoken 32nra9Bns85Y9N0OzFJFHq0ZHNg_JoyeYn7zFB89MZNvLA8o
     ngrok http 3000
     ```
   - You’ll see something like:
     ```
     Forwarding    https://f6fafdc3108e.ngrok-free.app -> http://localhost:3000
     ```
   - This gives you a **public forwarding URL**.

6. **Slack Request URLs**
   - Take your ngrok forwarding URL (e.g. `https://f6fafdc3108e.ngrok-free.app`) and set it in your Slack App settings:
     - **Slash Commands** (`/duty`, `/duties`) →  
       `https://f6fafdc3108e.ngrok-free.app/slack/events`
     - **Interactivity & Shortcuts** →  
       `https://f6fafdc3108e.ngrok-free.app/slack/events`
     - *(Optional)* **Event Subscriptions** →  
       `https://f6fafdc3108e.ngrok-free.app/slack/events`

7. **node_modules**
   - Note that npm start or node index.js should automatically generate a node_modules folder.

---

✅ After step 6, your bot is fully connected to Slack. Test it with `/duty` and `/duties` in your workspace.
