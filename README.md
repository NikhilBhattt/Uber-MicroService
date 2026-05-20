# Uber Microservice Project

This project is a microservices-based architecture for an Uber-like application. It is divided into four main services:

1. **Gateway**: Acts as the entry point for the application, routing requests to the appropriate microservices.
2. **Captain Service**: Manages captain-related operations such as registration, authentication, and availability.
3. **Ride Service**: Handles ride-related operations such as booking, tracking, and ride history.
4. **User Service**: Manages user-related operations such as registration, authentication, and profile management.

---

## Project Structure

```
Uber MicroService/
├── gateway/
│   ├── package.json
│   └── server.js
├── captain/
│   ├── .env
│   ├── app.js
│   ├── package.json
│   ├── server.js
│   ├── controllers/
│   │   └── captain.controller.js
│   ├── db/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── blacklist.model.js
│   │   └── captain.model.js
│   ├── routes/
│   │   └── captain.routes.js
│   └── service/
│       └── rabbitmq.js
├── ride/
│   ├── .env
│   ├── app.js
│   ├── package.json
│   ├── server.js
│   ├── controller/
│   │   └── ride.controller.js
│   ├── db/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   └── ride.model.js
│   ├── routes/
│   │   └── ride.routes.js
│   └── service/
│       └── rabbitmq.js
├── user/
│   ├── .env
│   ├── app.js
│   ├── package.json
│   ├── server.js
│   ├── controllers/
│   │   └── user.controller.js
│   ├── db/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── blacklist.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   └── user.routes.js
│   └── service/
│       └── rabbitmq.js
└── README.md
```

---

## Prerequisites

- **Node.js**: Ensure Node.js is installed on your system.
- **MongoDB**: Set up a MongoDB database.
- **RabbitMQ**: Install and configure RabbitMQ for message brokering.

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Uber MicroService
   ```

2. **Install dependencies for each service**:
   ```bash
   cd gateway && npm install
   cd ../captain && npm install
   cd ../ride && npm install
   cd ../user && npm install
   ```

3. **Set up environment variables**:
   - Each service contains a `.env` file. Update these files with the required configuration values.

---

## Running the Services

1. **Start the Gateway service**:
   ```bash
   cd gateway
   node server.js
   ```

2. **Start the Captain service**:
   ```bash
   cd captain
   node server.js
   ```

3. **Start the Ride service**:
   ```bash
   cd ride
   node server.js
   ```

4. **Start the User service**:
   ```bash
   cd user
   node server.js
   ```

---

## API Endpoints

### Gateway
- Routes requests to the appropriate microservices.

### Captain Service
- **POST /captain/register**: Register a new captain.
- **POST /captain/login**: Authenticate a captain.
- **POST /captain/logout**: Logout a captain.
- **POST /captain/new-rides**: Check for new rides.

### Ride Service
- **POST /ride/create-ride**: Book a ride.

### User Service
- **POST /user/register**: Register a new user.
- **POST /user/login**: Authenticate a user.
- **POST /user/logout**: Logout a user.

---

## Technologies Used

- **Node.js**: Backend runtime.
- **Express.js**: Web framework.
- **MongoDB**: Database.
- **RabbitMQ**: Message broker.

---

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request.

---

## License

This project is licensed under the MIT License.

