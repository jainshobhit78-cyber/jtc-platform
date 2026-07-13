# Jain Trading Corporation - Enterprise B2B Platform

A unified enterprise B2B platform prototype and interactive design emulator for **Jain Trading Corporation**. The platform allows cross-device simulations between B2B dealer operations, field collection actions, and administrative oversight.

## Project Structure
- **`index.html`**: Master dashboard interface container hosting:
  - **Admin Web Dashboard (Desktop)**: View analytics KPIs, Chart.js line and doughnut visualization, B2B order verification timelines, and ERP syncing.
  - **Customer Mobile App (iPhone Frame)**: Product catalogs, bulk orders booking (24hr reservation holds), timelines, and online payment dues.
  - **Collection Agent App (Android Frame)**: Daily operations route tracking, ledger collection receipts generator, and leaderboard.
  - **Design System Spec**: Layout grid specifications, colors, buttons, inputs, status badges.
- **`styles.css`**: Strict JTC brand design tokens implementation (18px card curves, 14px buttons/inputs, sticky grids, custom states, transition animations).
- **`app.js`**: Orchestration logic managing cross-device simulations, data mutations, filters, and notification center triggers.
- **`mockData.js`**: Shared persistent LocalStorage databases representing electrical distribution supplies, cables, agents, dealers, and sync logs.

## Quick Start
1. Open the project folder on your Desktop: `jtc-platform`
2. Open **`index.html`** in any web browser.
3. Switch views at the top bar to test end-to-end B2B sales cycles (e.g. place order in customer app, inspect in Admin portal, verify, clear collections).
