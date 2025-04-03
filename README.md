<p id="title" align="center">
  <a href="#title">
    <img width="80" height="80" style="border-radius: 999px;" src="./public/logo-readme.png">
  </a>
  <h1 align="center" style="font-weight: bold;">Cake E-commerce API</h1>
</p>

<p align="center">
  <a href="#features">Features</a> • 
  <a href="#technologies">Technologies</a> • 
  <a href="#started">Getting Started</a> • 
  <a href="#usage">Usage</a> • 
  <a href="#support">Support</a> • 
  <a href="#license">License</a>
</p>

<p align="center">
  <b>Cake E-commerce API is a powerful REST API designed to manage a fictional online cake store, inspired by the world of confectionery. This project was born from a mix of curiosity and personal connection, making it both a learning experience and a tribute to the art of baking. 👨‍🍳🍰</b>
</p>

<h2 id="features">✨ Features</h2>

- 🛍️ Product Management – Creation, update, and deletion of cakes, as well as management of cake types, categories, frostings, and fillings. These actions are properly protected so that only admins can perform them. Product listings are available to all users, with pagination, search, and multiple sorting and filtering options.

- 📄 File Upload – Supports image uploads, storing them either in the cloud or serving them directly from the server.

- 🛒 Order Management – Management of delivery dates and order statuses with advanced filtering and sorting options. Admin users have full order visibility, while individual users can access their own. This system focuses on order management and does not include payment features.

- 👤 User Authentication – Secure user registration and login using JWT (JSON Web Token) and role-based access control.

- 📦 Cart System – Add, remove, and update items in the shopping cart, with support for customizations based on each cake’s specific rules.

<h2 id="technologies">🧪 Technologies</h2>

This project was developed with the following technologies:

- [Node](https://nodejs.org/en)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Cloudinary](https://cloudinary.com/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

Project Dependencies:

- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [cloudinary](https://www.npmjs.com/package/cloudinary)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [multer](https://www.npmjs.com/package/multer)
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
- [zod](https://www.npmjs.com/package/zod)

Dev Dependencies:

- [@types/bcrypt](https://www.npmjs.com/package/@types/bcrypt)
- [@types/cors](https://www.npmjs.com/package/@types/cors)
- [@types/express](https://www.npmjs.com/package/@types/express)
- [@types/jsonwebtoken](https://www.npmjs.com/package/@types/jsonwebtoken)
- [@types/multer](https://www.npmjs.com/package/@types/multer)
- [@types/node](https://www.npmjs.com/package/@types/node)
- [@types/swagger-ui-express](https://www.npmjs.com/package/@types/swagger-ui-express)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [ts-node](https://www.npmjs.com/package/ts-node)
- [typescript](https://www.npmjs.com/package/typescript)

<h2 id="started">🚀 Getting started</h2>
<h3>Prerequisites</h3>

- [NodeJS](https://nodejs.org/en)
- [Git](https://git-scm.com)

<h3>Database</h3>

- Create a MongoDB database and put the connection URL in the `.env` file (see the section [Config .env variables](#env-config)).

- Recommendation: Use [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) to host your database in the cloud.

- Make sure to add your IP address to the list of allowed IPs to access the database.

<h3>Cloudinary environment (Optional)</h3>

Uploaded images can be stored in the cloud using [Cloudinary](https://cloudinary.com/). To do this, follow the steps below:

1. Create a Cloudinary environment [here](https://cloudinary.com/).
2. Retrieve the `cloud name`, `API key`, and `API secret`, then set them in the `.env` file (see the section [Config .env variables](#env-config)).

<h3>Cloning</h3>

To clone the project, follow the steps below:

```bash
# Clone the project
$ git clone https://github.com/JoaciFaustino/api-cake-ecommerce.git

# Access the project folder
$ cd api-cake-ecommerce
```

<h3 id="env-config">Config .env variables</h3>

Use the `.env.example` file as a reference to create your own `.env` configuration file in the root of the project.

- **`PORT`**: The HTTP port to listen on (Default: `3001`).
- **`DATABASE_URL`**: The URL of your MongoDB database.
- **`JWT_SECRET`**: A SHA-256 hash is recommended for security, but it can be any text.
- **`API_PROTOCOL`**: The protocol used by your API. Required only in the production environment (Default: `http`).
- **`API_HOST`**: The host of your API. Required only in the production environment (Default: `localhost`).
- **`DESTINATION_STORAGE_IMAGES`**: Where uploaded images are stored. It can be `local` or `cloudinary` (Default: `local`).
- **`CLOUD_NAME`**: The name of your Cloudinary environment (Optional).
- **`CLOUDINARY_API_KEY`**: The API key for your Cloudinary environment (Optional).
- **`CLOUDINARY_API_SECRET`**: The API secret for your Cloudinary environment (Optional).

<h3>Starting</h3>

To run it, follow the steps below:

```bash
# Install dependencies
npm install

# Seed the database
npm run seed

# Run the project
npm run dev
```

<h2 id="usage">💡 Usage</h2>

- To see all the endpoints in detail, open the Swagger UI at http://localhost:3001/api/docs in your browser (replace `3001` with the port you set in the `.env` file).

- To use authenticated endpoints:

  1. Create an account using the `/api/auth/signup` endpoint.
  2. Retrieve the JWT token received in the response.
  3. Include the token in the `Authorization` header of your requests.

- To access admin routes:
  1. Log in using the `/api/auth/login` endpoint with the following credentials:
     ```
     Email: admin@admin.com
     Password: joaciadmin
     ```
  2. Retrieve the JWT token received in the response.
  3. Include the token in the `Authorization` header of your requests.

<h2 id="support">💖 Support</h2>

To morally and mentally support the project, make sure to leave a ⭐️!

<h2 id="license">📃 License</h2>

This project is under [MIT](./LICENSE) license
