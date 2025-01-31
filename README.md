# HealthMate

**HealthMate** is your AI-powered health assistant designed to help you analyze symptoms, track your health patterns, and receive personalized medical recommendations. 

## Features

- **Analyze Symptoms:** Get potential conditions based on your symptoms.
- **Specialist Recommendations:** Know which medical specialist to consult.
- **Medication Information:** Receive basic details on common medications.
- **Health Tracking:** Monitor your health history and detect patterns.
- **Wellness Guidance:** Personalized suggestions for a healthier lifestyle.

## Live Demo
Check out **HealthMate** here: [HealthMate Live](https://healthmate-frontend.vercel.app/auth/login)

## Repository
Frontend Source Code: [GitHub - HealthMate Frontend](https://github.com/Pranav-1100/healthmate-frontend)
Backend Source Code: [GitHub - HealthMate Backend](https://github.com/Pranav-1100/doctor-appointment)
Frontend Source Code: [GitHub - HealthMate Frontend](https://github.com/Pranav-1100/healthmate-frontend)

## Getting Started Locally

Follow these steps to set up **HealthMate** locally.

### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- SQLite3 (for the backend database)

### Backend Setup (Express.js with SQLite)
1. Clone the backend repository (If applicable, add repo link).
   ```sh
   git clone <backend-repo-url>
   cd healthmate-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env` file):
   ```env
   PORT=5000
   DATABASE_URL=sqlite:./database.sqlite
   JWT_SECRET=your_secret_key
   ```
4. Initialize the SQLite database:
   ```sh
   npm run migrate
   ```
5. Start the server:
   ```sh
   npm start
   ```
   The backend will run on `http://localhost:5000`.

### Frontend Setup (Next.js)
1. Clone the frontend repository:
   ```sh
   git clone https://github.com/Pranav-1100/healthmate-frontend.git
   cd healthmate-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```
4. Start the frontend server:
   ```sh
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

## Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

---
Made with ❤️ by [Pranav Aggarwal](https://github.com/Pranav-1100).

