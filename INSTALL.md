# Local Installation
This guide will support you with the local setup of the _BYOD Launcher_ application for development purposes. It is **not** suitable for production environments.

## .NET Core SDK
You need the .NET Core SDK in version 3.1 or higher. You might verify this with the command `dotnet --info`.

In case you ned to install .NET Core SDK, head over to [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download).

## Node Package Manager (npm)
For building the frontends components, you need the command-line tool `npm`. If you already worked with frontend frameworks like _Angular_, _React_, _Vue_ or developed backend services with _Node.js_, you probably have `npm` installed already.

To verify whether you have _Node.js_ and _npm_ installed, use the `node -v` and `npm -v` command respectively.

Head over to [https://nodejs.org/](https://nodejs.org/) to install _npm_ along with _Node.js_.

## Database
For the data storage you need a local running _MariaDB_ database server. Depending on your preferences, you may install such a database server on your local machine or you might run it inside a Docker container.

### Install Database Server
#### Variant A: Local Database Server
To install a local _MariaDB_ database server, head over to [https://mariadb.org/download/](https://mariadb.org/download/) to download the installer for your operating system. Run the installer and start the database server.

Using a local installed database server, _MariaDB_ is probably running on the default port `3306`. You need to change the corresponding `Port` directive of the connection string in [appsettings.Development.json](appsettings.Development.json).

#### Variant B: Docker container
To run _MariaDB_ in a Docker container, you need a running instance of Docker and Docker Compose. The easiest way to achieve this is by running the [installer for Docker Desktop](https://docs.docker.com/desktop/#download-and-install) (Windows, macOS).

To fire up a Docker container which runs _MariaDb_ you can point your console to the [Docker](Docker) directory of this repository. Inside you'll find a file named [docker-compose.yaml](Docker/docker-compose.yaml). Execute `docker-compose up` to run a docker-compose database service named _db_. Note, that the _MariaDb_ database server inside the Docker container will be reachable locally on port `13306`.

### Create Database and User
To create the initial, empty database and a database user with access rights for this database, execute the following SQL statements:

```sql
-- Create database named "byodlauncher"
CREATE DATABASE byodlauncher;

-- Create user "user" with password "password" with access on the "byodlauncher" database
GRANT ALL PRIVILEGES ON byodlauncher.* TO 'user'@'%' identified by 'password';

-- Reload privileges
FLUSH PRIVILEGES;
```

### Example Data
You might want to create the required tables for the application and insert some sample data. For this purpose, you might insert the content of the file [sampleData.sql](sampleData.sql) into your previously created database.

Use your favorite SQL Client to connect to the running database server and insert/execute the contents of the [sampleData.sql](sampleData.sql) file.