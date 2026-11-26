# Experiment 1: Express CRUD on Product Data

## Aim
Develop an Express application and execute CRUD operations using RESTful routing on product data containing product name, price and description.

## Run
Open this folder in VS Code terminal and run:

```bash
npm install
npm start
```

Open http://localhost:3001

## REST routes
| HTTP Method | Route | Operation |
|---|---|---|
| GET | /api/products | Read all products |
| GET | /api/products/:id | Read one product |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

## Result
CRUD operations on product data are implemented through Express RESTful routes. Data is stored in products.json.
