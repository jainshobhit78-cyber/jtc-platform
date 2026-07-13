# Jain Trading Corporation - Enterprise B2B Platform

A unified B2B enterprise platform prototype and design system emulator for **Jain Trading Corporation**. The platform allows cross-device simulations between B2B dealer operations, field collections, and administrative dashboard panels.

## Live Demo Previews
You can test each portal directly in your browser:
- 🖥️ **[Admin Dashboard Panel](https://jainshobhit78-cyber.github.io/jtc-platform/)**
- 📱 **[Customer Mobile App Simulator](https://jainshobhit78-cyber.github.io/jtc-platform/app.html)**
- 🏃‍♂️ **[Collection Agent App Simulator](https://jainshobhit78-cyber.github.io/jtc-platform/agent.html)**

## Installable Mobile App (Android APK)
- **Download APK File**: [📦 app-debug.apk (Direct Download)](https://github.com/jainshobhit78-cyber/jtc-platform/releases/download/v1.0.0-build/app-debug.apk)
- **Releases Page**: [JTC B2B App Release](https://github.com/jainshobhit78-cyber/jtc-platform/releases/tag/v1.0.0-build)

*Note for Mobile Users: When running the APK on your Android device, you will be presented with a B2B Portal Selection Screen to choose between loading the Dealer/Customer portal or the Field Agent portal in full screen.*

## Project Structure
- **`www/index.html`**: Master interface and responsive mobile launcher.
- **`www/app.html`**: Dedicated standalone page for the Customer Mobile App.
- **`www/agent.html`**: Dedicated standalone page for the Collection Agent Mobile App.
- **`www/styles.css`**: Design tokens styling sheets (colors, shadows, curves, transitions).
- **`www/app.js` / `www/mockData.js`**: State syncing controller and local persistent database.

## System Developer Toolchain Installed
The local Windows host has been fully set up with:
- **Node.js**: `v24.15.0`
- **npm**: `v11.12.1`
- **Vercel CLI**: `v55.0.0`
- **Docker Desktop**: `v4.81.0`
- **GitHub CLI**: `v2.96.0`
