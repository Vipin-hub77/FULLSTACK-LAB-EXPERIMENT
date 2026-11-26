# Experiment 2: Express Product API with Client-Side Rendering

## Aim
Establish an Express server to create an API for product data containing id, name, price and rating. Use this API to construct a frontend that displays all product details and provides a form for adding new products, implementing client-side rendering.

## Run
Open this folder separately in VS Code terminal and run:

```bash
npm install
npm start
```

Open http://localhost:3002

## API routes
| HTTP Method | Route | Purpose |
|---|---|---|
| GET | /api/products | Fetch all product details |
| GET | /api/products/:id | Fetch one product |
| POST | /api/products | Add a new product |

## How it works
1. Express serves the frontend files from the public folder.
2. Browser JavaScript calls the Express API using fetch().
3. The GET request retrieves product data and renders product cards dynamically.
4. The form sends a POST request with JSON data to add a product.
5. The server saves product data in products.json.

## Result
An Express product API and client-side rendered frontend are implemented successfully. The frontend displays product ID, name, price and rating, and allows users to add new products.
