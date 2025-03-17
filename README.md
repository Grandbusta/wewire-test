# Currency converter

This is a simple currency converter application built using TypeScript, Next.js, Redux Toolkit, and Tailwind CSS. It allows users to convert between different currencies using real-time exchange rates.

## Features

-   User authentication
-   Transaction management
-   Currency conversion
-   Exchange rates retrieval

## Getting Started

To get started, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Grandbusta/wewire-test.git
```

This repository contains both the frontend and backend code. The frontend code is located in the `currency-converter-frontend` directory, while the backend code is in the `currency-converter-backend` directory.

### Running the frontend

2. Install dependencies:

```bash
cd currency-converter-frontend
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000` to access the application.

### Running the backend

2. Install dependencies:

```bash
cd currency-converter-backend
npm install
```

3. Create a `.env` file in the root directory and add the following content:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=currency_conversion
JWT_SECRET=yourJWTsecret
```

4. Run the seeds:

```bash
npm run seed
```

5. Start the development server:

```bash
npm run start:dev
```

6. Test the application by sending a request to `http://localhost:4000`

## Documentation

1. User Authentication
-   `POST /user/login`: Authenticate a user and return a JWT token.
body:
```json
{
    "email": "test@example.com",
    "password": "password123"
}
```

2. Transaction Management
-   `GET /user/transactions`: Retrieve a list of transactions for the authenticated user.

return:
```json
{
    "data": [
        {
            "id": "1",
            "source_currency": "USD",
            "target_currency": "EUR",
            "amount": 100,
            "converted_amount": 123.45,
            "conversion_rate": 1.23,
            "created_at": "2023-01-01T00:00:00.000Z"
        }
    ],
    "total": 1,
    "page": 1,
    "last_page": 1
}
```

3. Currency Conversion
-   `POST /convert`: Convert a given amount of currency from one currency to another.
body:
```json
{
    "source_currency": "USD",
    "target_currency": "EUR",
    "amount": 100,
    "idempotency_key": "unique-idempotency-key"
}
```
return:
```json
{
    "source_currency": "USD",
    "target_currency": "EUR",
    "amount": 100,
    "conversion_rate": 1.23,
    "converted_amount": 123.45
}
```

4. Exchange Rates Retrieval
-   `GET /exchange-rates`: Retrieve the latest exchange rates for supported currencies.
return:
```json
{
    "base": "USD",
    "rates": {
        "USD": 1.23,
        "EUR": 0.98,
        "GBP": 0.75
    }
}
```