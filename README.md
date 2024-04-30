# My List Feature

My List Feature is a Nest.js application that allows users to manage their watchlist by adding and removing movies or TV shows.

## Setup

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vibh1103/assignment-stage.git
   ```

2. Navigate to the project directory:
  
    ```bash
    cd assignment-stage 
    ```

### Running the Application

1. Run Docker Command to start the MongoDB:

    ```bash 
      docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
    ```

2. Run the Application
    ```bash
      npm run start
    ```

### Populating Initial Data

To populate initial data into the MongoDB database, you can run the provided script:

1. Go to Scripts folder
    ```bash
    cd scripts
    ```
2. Run the command
    ```bash
    node index
    ```


