# Client API

This is an example project for consuming Actimi API service.

Program uses provided Actimi API key in environment variables and establishes connection to the service.

You can access Actimi API service's documentation via this (developer.actimi.com)[link]

## Environment variables:

| KEY | VALUE |
|---|---|
| SERVICE_BASE_URL | Base url for accessing Actimi API (api.actimi.health) |
| API_KEY | Your organization's API key for accessing to the data. |


## Usage

After your deployment you can access Patient and Observation records in following endpoints.


### Observations

Fetches all Observation resources linked to your Organization.

Has optional query parameter `afterDateTime`. When this parameter provided, it returns Observations that are created or updated after specified datetime only.

> Example Request
```bash
curl --location --request GET '/Observation?afterDateTime=2021-12-17T08:33:33.670Z'
```
> Example Response
```json
[
  {
    "resourceType": "Observation",
    "id": "<id>",
    "meta": {
      "lastUpdated": "2021-12-17T08:33:33.670947Z",
      "createdAt": "2021-11-11T01:10:41.669260Z",
      "versionId": "914502"
    },
    "effective": {
      "dateTime": "2021-07-10T07:59:00.000Z"
    },
    "value": {
      "Quantity": {
        "code": "8310-5",
        "unit": "°C",
        "value": 37.1
      }
    },
    "status": "registered",
    "hasMember": [],
    "code": {
      "text": "Body Temperature",
      "coding": [
        {
          "code": "8310-5",
          "display": "Body Temperature"
        }
      ]
    },
    "device": {
      "id": "8",
      "resourceType": "Device"
    },
    "subject": {
      "id": "<id>",
      "resourceType": "Patient"
    }
  }
]
```

### Patients

Fetches all Observation resources linked to your Organization.

Has optional query parameter `afterDateTime`. When this parameter provided, it returns Patients that are created or updated after specified datetime only.

> Example Request
```bash
curl --location --request GET '/Patient?afterDateTime=2022-04-29T10:01:32.558480'
```

> Example Response

```json
[
  {
    "address": [
      {
        "city": "Berlin",
        "line": [
          "Berlin, Germany"
        ],
        "country": "DE",
        "postalCode": "10115"
      }
    ],
    "meta": {
      "lastUpdated": "2022-04-29T11:34:32.274500Z",
      "createdAt": "2022-04-29T10:01:32.558480Z",
      "versionId": "1542669"
    },
    "managingOrganization": {
      "id": "<id>",
      "resourceType": "Organization"
    },
    "name": [
      {
        "given": [
          "John"
        ],
        "family": "Doe"
      }
    ],
    "birthDate": "2000-01-01",
    "resourceType": "Patient",
    "id": "<id>",
    "telecom": [],
    "generalPractitioner": [
      {
        "id": "<id>",
        "resourceType": "Practitioner"
      }
    ],
    "gender": "male",
    "contact": []
  }
]
```



