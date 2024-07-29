# NestJS Authentication and Angular Integration


This project demonstrates a full-stack application with authentication using NestJS and Angular. The backend handles user registration, login, and token-based authentication, while the frontend interacts with the backend to manage user sessions and access protected resources.

## Features


-   User Registration and Login: Secure user registration and login with hashed passwords.

-   Token-Based Authentication: JWT access tokens and refresh tokens for secure authentication.

-   Protected Routes: Ensure only authenticated users can access certain endpoints.

-   Automatic Token Refresh: Automatically refresh access tokens when they expire.

-   Angular Integration: A front-end application to interact with the backend.

## Backend - NestJS

### Setup

1.  Navigate to the Backend Directory: `cd nest-js-backend`

2.  Install Dependencies: ` npm install `

3.  Environment Variables: Create a `.env` file in the root directory and add your configuration variables: 
```ts
JWT_SECRET=your-jwt-secret-key
MONGODB_URI=your-mongodb-uri
```
1.  Run the Application: ` npm run start `

### Project Structure

-   `src/auth/auth.controller.ts`: Handles authentication routes (login, register, whoami, logout, refresh token).

-   `src/auth/auth.service.ts`: Contains the logic for user authentication, registration, and token management.

-   `src/auth/auth.guard.ts`: Auth guard to protect routes.

-   `src/user/user.service.ts`: Manages user data.

-   `src/schemas/user.schema.ts`: Mongoose schema for user data.

## Frontend - Angular

### Setup

1.  Navigate to the Frontend Directory: ` cd angular-frontend `

2.  Install Dependencies: ` npm install `

3.  Run the Application: ` ng serve `

### Project Structure

-   `src/app/services/http.service.ts`: HTTP service to handle API calls and token management.

-   `src/app/app.component.ts`: Main component with methods for user actions (login, register, logout, whoami, etc.).

-   `src/environments/environment.ts`: Configuration for API URL.

## Usage

### Register a New User
```ts
async register() {
  const { user, accessToken } = await this.http.post<{
    user: any;
    accessToken: string;
  }>('auth/register', {
    email: 'example@example.com',
    password: 'password',
    name: 'Example User',
  });
  this.http.accessToken = accessToken;
  console.log(user, accessToken);
}
```
### Login an Existing User
```ts
async login() {
  const { user, accessToken } = await this.http.post<{
    user: any;
    accessToken: string;
  }>('auth/login', {
    email: 'example@example.com',
    password: 'password',
  });
  this.http.accessToken = accessToken;
  console.log(user, accessToken);
}
```
### Access Protected Routes
```ts
async getProtected() {
  console.log(await this.http.get('protected'));
}
```
### Refresh Access Token
```ts
async requestNewAccessToken() {
  await this.http.requestNewAccessToken();
  console.log(this.http.accessToken);
}
```
### Logout
```ts
async logout() {
  await this.http.get('auth/logout');
  this.http.accessToken = '';
}
```
## Contributing

1.  Fork the repository.

2.  Create your feature branch (`git checkout -b feature/fooBar`).

3.  Commit your changes (`git commit -am 'Add some fooBar'`).

4.  Push to the branch (`git push origin feature/fooBar`).

5.  Create a new Pull Request.

## License

This project is licensed under the MIT License.