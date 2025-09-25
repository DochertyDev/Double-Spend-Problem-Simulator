# Double Spend Problem Simulator‼️🏧
This repo contains a webpage with a simple simulator showcasing the double spend problem. This problem occurs (in this example) due to fraction-reserve banking leading to money creation, but there are other cases where the double spend problem can apply.

---
## Features
- Dynamically set the initial deposit amount
- Dynamically set the number of times the cycle should occur (or until < $1)
- Dyanmically set the fractional-reserve % (default is standard 10%)
- Key metric dashboard containing starting deposit, created money, and total money
- Use different colors to differentiate between deposits, reserves, and loans
- Ability to toggle between a flow diagram view, table view (showing deposits, reserves, loans, and total money at each step), and graph view (plotting growth of total money and reserves over cycles)
- Ability for users to change whether 100% of loaned money is spent and redeposited
- Shows the ratio of reserves to total deposits
- Education mode including hover tooltips with definitions (ex. reserve = portion banks must hold back and cannot loan out) and "Why this matters" explanations at key points
- Comparison toggle giving ability to run two simulations side by side with different reserve ratios (ex. 10% vs 20%) so users can *see how money creation differ*


---
## Background
This is a vibe coding project fueled by my interest in 💵Finance, 📈Economics, and 🖥️Tech! I am not a trained developer and leveraged 🤖AI for the majority of the coding. 