# Lannister-pay-getting-started

Lannister pay is a Node JS API service that implements transaction payment splitting service(tpss). This service calculates the amount due to one or more split payment as well as the balance left after all splits has been calculated and shared.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/dmdhassan/lannister-pay-tpss.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).


## Documentation


### Getting Started
- Base URL: Presently, this app can only run locally and is not hosted as a base URL on a remote server. The backend app is hosted at the default, `http://127.0.0.1:5000/`, which can be set as a proxy in the frontend config.

- Authentication: The present version of the app does not require authentication or API keys(until further updates).

#### Error Handling
Errors are returned as JSON objects in the brlow format:
```
{
    "success": False, 
    "error": 400,
    "message": "bad request"
}
```


#### POST /split-payments/compute
Sends a post request in order to make some calculations on the request body.
This API service is exposed to a single HTTP POST endpoint ```/split-payments/compute``` that accepts a transaction object with the following properties:

Request Body:
```
{
     "ID": 1308,
    "Amount": 12580,
    "Currency": "NGN",
    "CustomerEmail": "anon8@customers.io",
    "SplitInfo": [
        {
            "SplitType": "FLAT",
            "SplitValue": 45,
            "SplitEntityId": "LNPYACC0019"
        },
        {
            "SplitType": "RATIO",
            "SplitValue": 3,
            "SplitEntityId": "LNPYACC0011"
        },
        {
            "SplitType": "PERCENTAGE",
            "SplitValue": 3,
            "SplitEntityId": "LNPYACC0015"
        }
    ]
}
```

On successful computation, the endpoint returns with the 200 0K HTTP code and a JSON containing the following fields:
```
{
    "ID": 1308,
    "Balance": 0,
    "SplitBreakdown": [
        {
            "SplitEntityId": "LNPYACC0019",
            "Amount": 5000
        },
        {
            "SplitEntityId": "LNPYACC0011",
            "Amount": 2000
        },
        {
            "SplitEntityId": "LNPYACC0015",
            "Amount": 2000
        }
    ]
}
```
## Deployment N/A
### Deploying to Heroku

```
$ heroku create
$ git push heroku main
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Live API server [here](http://guarded-wave-01810.herokuapp.com/)



## Authors
Yours truly, Hassan Yahya 

## Acknowledgements 
This projects was inspired by flutterwave in form of an assessement
