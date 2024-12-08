# Visa Management System - Backend

<h2>Description:</h2>
This repository contains the backend of the Visa Management System, a web application that allows users to manage visa information, apply for visas, and handle visa-related operations. The backend is built using Node.js, Express, and MongoDB, with RESTful APIs for seamless integration with the frontend.

## Key Features

1. **Visa Management**

   - Add, edit, and delete visa details.
   - Retrieve all visas or filter visas by type.
   - Access the latest visas with sorting and limit options.

2. **Visa Application Management**

   - Submit visa applications.
   - Retrieve applications by user email.
   - Delete specific visa applications.

3. **User Authentication Integration**

   - Routes designed to integrate with user authentication for personalized data retrieval.

4. **Filtering and Searching**

   - Filter visas by type or retrieve user-specific visas and applications based on email.

5. **Database Operations**
   - Optimized MongoDB queries with upsert and sorting capabilities.
   - Ensure efficient data handling and avoid duplicate entries with query checks.

## API Endpoints

### Visa Routes

- **GET** `/all-visas` - Fetch all visa records.
- **GET** `/latest-visas` - Fetch the latest visas (limited to 6).
- **POST** `/add-visa` - Add a new visa record.
- **POST** `/my-visas` - Fetch visas by user email.
- **POST** `/visas/filter-by-visa-type` - Filter visas by visa type.
- **GET** `/visas/:id` - Fetch details of a specific visa by ID.
- **PUT** `/visas/:id` - Update an existing visa by ID.
- **DELETE** `/visas/:id` - Delete a specific visa by ID.

### Visa Application Routes

- **POST** `/application/my-applications` - Fetch all applications for a user by email.
- **POST** `/application/add` - Add a new visa application.
- **DELETE** `/application/my-applications/:id` - Delete a specific visa application by ID.

## NPM Packages Used

1. **express** - Web framework for building RESTful APIs.
2. **cors** - Enable Cross-Origin Resource Sharing.
3. **dotenv** - Manage environment variables.
4. **mongodb** - MongoDB client for database operations.
