# NoZoo

Description of the project.

## Table of Contents

- [NoZoo](#nozoo)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Documentation](#api-documentation)
  - [Author](#author)
  - [License](#license)

## Features

The project aims to provide the following features:

- CRUD operations for managing spaces.
- Maintenance mode for spaces, which can be enabled by admin users. A maintenance log must be maintained to reduce issues, and a system to determine the best month for repairing a space must be provided for admins.
- Management of animals by space. Different species can be housed in the same space. A treatment log for animals must be maintained, which can only be edited by a veterinarian.
- Weekly management of employees: the zoo cannot open if there is not at least one person at the reception, one caretaker, one maintenance worker, and one seller.
- Ticket management: a ticket provides access to certain spaces. Different types of passes are available, including day passes, weekend passes, annual passes, and one-day-per-month passes. The API must validate whether a user can access a space before allowing entry.
- PASS Escape game: certain tickets provide access to spaces in a predefined order (e.g., tiger/lion/monkey).
- Daily and weekly statistics to highlight the zoo's attendance by space.
- Real-time attendance rates for the zoo and spaces.
- Nighttime opening of the zoo with a PASS Night (admin only).
- A user account is required to access the API, and only employees can perform actions for the zoo.

## Technologies

The following technologies were used in the project:

- Node.js
- Express
- MongoDB
- Docker
  
## Installation

To run the project locally, follow these steps:

1. Clone the repository
2. Install the dependencies using the command `npm install`
3. Start the docker using the command `docker-compose up --build`

## Usage

After starting the server, you can access the API using a tool like Postman or a web browser. The API endpoints and their parameters are documented in the [API Documentation](#api-documentation) section.

## API Documentation

The API documentation can be found in the [API.md](API.md) file. It provides details on the API endpoints, parameters, and responses.

## Author

Cristian URSU - GitHub [ZK1569](https://github.com/ZK1569)
julien RIVIERE - GitHub [julienEcole](https://github.com/julienEcole)
Samuel ATLANI - GitHub [SamEPK](https://github.com/SamEPK)

## License

This project is licensed under the [MIT License](LICENSE).
