# Loan Management Module for an existing Bank Application

## Architecture

We used an **Event-Based architecture**.

![architecture](https://raw.githubusercontent.com/ShathaCodes/LoanManagementModule/main/architecture.PNG)

## Running the app

```
$ docker-compose up
```

We suppose that a functional Client Application already exists with a UI.

The client fills the loan application form and attach the neccessary docs.

The informations gets processed and sent to a Kafka Topic "apply".

### Commercial Service

![1](https://raw.githubusercontent.com/ShathaCodes/LoanManagementModule/main/1.PNG)

### Risk Management Service

![2](https://raw.githubusercontent.com/ShathaCodes/LoanManagementModule/main/2.PNG)

### Credit Service

![3](https://raw.githubusercontent.com/ShathaCodes/LoanManagementModule/main/3.PNG)

The generated docs and the application status are sent in another Kafka Topic "notify" to be accessed by the Client Application.



