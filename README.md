# Cybercare Automated Test Suite

## Overview

This repository contains an automated test suite for Cybercare's API and UI testing challenge using Playwright. The suite includes API tests for IP insights and UI tests for NordVPN's checkout flow.

## Setup Instructions

### Prerequisites

Ensure you have Node.js and npm installed on your system.

### Installation

1. Clone the repository:
   ```sh
   git clone <https://github.com/PanicAndDebug/CyberCare-home-task.git>
   cd cybercare-tests
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Running Tests

### Run all tests

```sh
npm test
```

### Run UI tests

```sh
npm run test:ui
```

### Run API tests

```sh
npm run test:api
```

### Run tests with Playwright UI

```sh
npm run test:visual
```

## Code Formatting and Linting

To format and lint the code before committing:

```sh
npm run format:lint
```

## Commit & Push

To format, lint, commit, and push changes:

```sh
npm run commit:push
```

## Test Coverage

- **API Tests**: Verify IP insight response structure, correct IP validation, ISP details, response times, and error handling.
- **UI Tests**: Validate pricing and login page navigation.
