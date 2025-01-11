# Frontend - Angular

## Setup

1.  Install Dependencies: ` npm install `

2.  Run the Application: ` ng serve `

## Project Structure

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