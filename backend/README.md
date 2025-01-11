# Backend - NestJS

## Setup

1.  Install Dependencies: ` npm install `

2.  Environment Variables: Create a `.env` file in the root directory and add your configuration variables: 
```ts
JWT_SECRET=your-jwt-secret-key
MONGODB_URI=your-mongodb-uri
```
1.  Run the Application: ` npm run start `

## Project Structure

-   `src/auth/auth.controller.ts`: Handles authentication routes (login, register, whoami, logout, refresh token).

-   `src/auth/auth.service.ts`: Contains the logic for user authentication, registration, and token management.

-   `src/auth/auth.guard.ts`: Auth guard to protect routes.

-   `src/user/user.service.ts`: Manages user data.

-   `src/schemas/user.schema.ts`: Mongoose schema for user data.