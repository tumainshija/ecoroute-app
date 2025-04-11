# EcoRoute

EcoRoute is a sustainable travel planning application that helps users find eco-friendly routes for their journeys.

## GitHub Pages Deployment

This repository is configured to automatically deploy the frontend to GitHub Pages. The live version can be accessed at:

https://yourusername.github.io/ecoroute-app/

## Features

- Eco-friendly route planning
- Carbon footprint calculation
- AR route visualization
- Community forum
- User profiles and trip history

## Architecture

- **Frontend**: Next.js React application
- **Backend**: Node.js Express API
- **Database**: MongoDB

## Local Development

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB (optional, uses in-memory DB for development)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ecoroute-app.git
   cd ecoroute-app
   ```

2. Install dependencies:
   ```
   npm run install:all
   ```

3. Start development servers:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The application is deployed to:

- **Frontend**: GitHub Pages (via GitHub Actions)
- **Backend**: Render.com
- **Database**: MongoDB Atlas

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License. 