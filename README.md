# Restowaves TestTask

That is an API for a test task that requires you to develop a server and database using Node.js, Express.js, Postgresql (sequelize if desired) or MySQL.

## Installation

Use the [npm](https://www.npmjs.com/) to install packages for the project.

```bash
npm install
```

## Explanation
Taking into account the requirement of the test task to process data in real time and the need for scalability, Node.js and Express.js were chosen for the test task. The event-driven and non-blocking I/O model of Node.js met the needs of real-time data processing when parsing tables. I used the official Google Sheets API in the absence of an npm library that would allow free parsing and custom output. For the database, I used PostgreSQL because I was familiar with this technology. And the databases themselves were designed from an ER diagram to a relational table with respect to the normalisation of relations (1:1, 1:n, n:n), an example is provided below.

![db_schematic_view](https://github.com/Habubinator/2023_Restowaves_TestTask/blob/main/database/schematic%20view/databaseModel.drawio.png?raw=true)

## Usage
Example's full API is available from [Postman documentation link](https://documenter.getpostman.com/view/28939212/2s9YsGhYjZ)

### GET /api/get-all 
Returns all product items in a form of array of objects.
```curl
curl --location 'https://two023-restowaves-testtask.onrender.com/api/get-all'
```
### GET /api/get-one 
Returns one product item in a form of a object
```curl
curl --location --request GET 'https://two023-restowaves-testtask.onrender.com/api/get-one' \
--data '{
    "itemId":"1233"
}'
```
### PUT /api/change-item
Changes a specific item by it's id Returns a product item that was changed
```curl
curl --location --request PUT 'https://two023-restowaves-testtask.onrender.com/api/change-item' \
--data '{
    "itemId": "1233",
    "itemName" : "Adidas Yeezy Boost 700 '\''Magnet'\'' 18"
}'
```
### GET /api/get-by-size 
Returns all product items of a specific size in a form of array of objects.
```curl
curl --location --request GET 'https://two023-restowaves-testtask.onrender.com/api/get-by-size' \
--data '{
    "size" : "41"
}'
```
## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
