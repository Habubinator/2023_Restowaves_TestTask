# Restowaves TestTask

That is an API for a test task that requires you to develop a server and database using Node.js, Express.js, Postgresql (sequelize if desired) or MySQL.

## Installation

Use the [npm](https://www.npmjs.com/) to install packages for the project.

```bash
npm install
```

## Usage
Example's full API is available from [Postman documentation link](https://documenter.getpostman.com/view/28939212/2s9YsGhYjZ)

GET /api/get-all - Returns all product items in a form of array of objects.
```curl
curl --location 'https://two023-restowaves-testtask.onrender.com/api/get-all'
```
GET /api/get-one - Returns one product item in a form of a object
```curl
curl --location --request GET 'https://two023-restowaves-testtask.onrender.com/api/get-one' \
--data '{
    "itemId":"1233"
}'
```
PUT /api/change-item - Changes a specific item by it's id Returns a product item that was changed
```curl
curl --location --request PUT 'https://two023-restowaves-testtask.onrender.com/api/change-item' \
--data '{
    "itemId": "1233",
    "itemName" : "Adidas Yeezy Boost 700 '\''Magnet'\'' 18"
}'
```
GET /api/get-by-size - Returns all product items of a specific size in a form of array of objects.
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
