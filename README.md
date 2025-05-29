# Image Categorizer

An application that helps categorize and verify images based on guidelines using Google Cloud Vision API.

## Features

- Upload images or take photos
- Automatic image categorization
- Guideline verification
- Real-time image analysis
- Modern, responsive UI

## Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- Google Cloud Vision API credentials

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd image-categorizer
   ```

2. Set up Google Cloud Vision API:
   - Create a project in Google Cloud Console
   - Enable the Vision API
   - Create a service account and download the credentials JSON file
   - Place the credentials file at `backend/google-credentials.json`

3. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

## Development

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   ng serve
   ```

3. Open your browser and navigate to `http://localhost:4200`

## Deployment

1. Build and run using Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://localhost`

## Environment Variables

### Backend
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)

### Frontend
- `API_URL`: Backend API URL (default: http://localhost:3000)

## Project Structure

```
image-categorizer/
├── backend/              # Node.js backend
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded images
│   └── Dockerfile       # Backend Docker configuration
├── frontend/            # Angular frontend
│   ├── src/            # Source code
│   ├── nginx.conf      # Nginx configuration
│   └── Dockerfile      # Frontend Docker configuration
└── docker-compose.yml   # Docker Compose configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 