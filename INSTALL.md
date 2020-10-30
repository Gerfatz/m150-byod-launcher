# Local Installation
This guide will support you with the local setup of the _BYOD Launcher_ application for development purposes. It is **not** suitable for production environments.

[[_TOC_]]

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

#### Variant B: Docker Container
To run _MariaDB_ in a Docker container, you need a running instance of Docker and Docker Compose. The easiest way to achieve this is by running the [installer for Docker Desktop](https://docs.docker.com/desktop/#download-and-install) (Windows, macOS).

To fire up a Docker container which runs _MariaDb_ you can point your console to the [Docker](Docker) directory of this repository. Inside you'll find a file named [docker-compose.yaml](Docker/docker-compose.yaml). Execute `docker-compose up` to run a docker-compose database service named _db_. Note, that the _MariaDb_ database server inside the Docker container will be reachable locally on port `13306`.

### Create Database and User
**If you choose to run a containerized version of MariaDB (Docker Container), you may skip this step since the database and user will be created when the container starts.**
 
To create the initial, empty database and a database user with access rights for this database, execute the following SQL statements:

```sql
-- Create database named "byodlauncher"
CREATE DATABASE byodlauncher;

-- Create user "user" with password "password" with access on the "byodlauncher" database
GRANT ALL PRIVILEGES ON byodlauncher.* TO 'user'@'%' identified by 'password';

-- Reload privileges
FLUSH PRIVILEGES;
```

### Import Example Data
You might want to create the required tables for the application and insert some sample data. For this purpose, you might insert the content of the file [sampleData.sql](sampleData.sql) into your previously created database.

Depending on your experience and needs, you might want to use the commandline or a graphical database client to import. So, either use your favorite SQL Client or the `mysql` commandline tool to connect to the running database server and insert/execute the contents of the [sampleData.sql](sampleData.sql) file.

#### Graphical Database Client

Recommended graphical clients which work with _MariaDB_ are [HeidiSQL](https://www.heidisql.com/) (which comes bundled with the Windows version of the local _MariaDB_ database server!) or most graphical _MySQL_ clients like [phpMyAdmin](https://www.phpmyadmin.net/) (which you might already have installed with your local [XAMPP](https://www.apachefriends.org) application). Just use them to connect to the database server.

#### Commandline Interface

##### Variant A: Local Database Server
Running a local _MariaDB_ server, use the commandline to navigate to this projects root directory and use the following command to import the sample data into the local database server:

```shell
# Connect with "user" and "password" to database "byodlauncher" to import the contents of "sampleData.sql"
mysql -u user -p byodlauncher < sampleData.sql

# Enter password "password" and confirm with ENTER
```

##### Variant B: Docker Container
Running a _MariaDB_ server inside a docker container, use the commandline to navigate to the [Docker](Docker) directory and use the following commands to connect to the database server:

```shell
# Start an interactive shell inside the "db" docker container
docker-compose exec db /bin/bash

# Navigate to the /root/ directory (where the sampleData.sql) file from your host machine is linked to.
cd /root/

# Connect wither "user" and "password" to database "byodlauncher" to import the contents of "sampleData.sql"
mysql -u user -p byodlauncher < sampleData.sql

# Enter password "password" and confirm with ENTER
```

## Configuration
The _BYOD Launcher_ application has two files, where configuration is stores (as most .NET Core). The [appsettings.json](appsettings.json) file contains all relevant configuration items **for the production environment**. Even in case you won't need some configuration items in production environment, you must create a corresponding entry in this file, if you'd like to use it in any other environment.

The [appsettings.Development.json](appsettings.Development.json) file contains configuration **overwrites** for any items which are introduced in [appsettings.json](appsettings.json). Here you want to make some changes while developing the application. To start, you need to provide/verify at least two configuration items.

### Connection String
The connection string at configuration path `ConnectionString.MariaDb` contains the relevant directives for the local database connection. Verify, that the various directives match your actual environment. Default values are:

- Server = `localhost`
- Database = `byodlauncher`
- Port = `13306` --> you need to change this to `3306` if you're running the local database server (variant A)
- User = `user`
- Password = `password`

### Absolute Path for File Uploads
Users of the application might upload some files (images) while creating new tutorial steps. The configuration item at path `FileUpload.FilesystemAbsolutePath` should contain the absolute path to a (writable) directory where these uploads should be persisted.

For your local development environment it is recommended to create a new and empty directory at root level of this project for these uploaded files. Copy the absolute path of this directory and paste it at the corresponding place in the configuration file (i.e. replace `<your-local-absolute-path-here>`). Don't forget to add the directory to your [.gitignore](.gitignore) file since you probably don't want to synchronize these files with anybody.

## Running the Application
Finally, you might run the application. It won't be sufficient to just hit the play button in you IDE although. Since the project consists of two quite distinct parts, you need to start them individually.

### Run the Frontend
To run the frontend, use the commandline to navigate to the [wwwroot](wwwroot) directory and execute the following command to run the frontend:

```shell
# Run the frontend
npm run serve
```

For the very first launch, this command might take a while to download and install all dependencies. Don't worry although - for subsequent launches, it will be much faster :-)

You might want to try if the frontend is reachable already? Just click on the link in the commandline or open [your favorite browser](https://brave.com/de/) and enter the url [http://localhost:8080](http://localhost:8080) manually.

### Run the Backend
Since the backend is just a plain ASP.NET Core application, you finally might want to hit the play button in your IDE. In case you liked working with the commandline, there's of course a command for that, too:

```shell
# Run the backend using the dotnet commandline tool
dotnet run --launch-profile ByodLauncher
```

### Verify Running Application
Depending on the way to start the backend, your local application runs on different ports. For HTTPS connections, this may be ports `5001` or `44369`. For unsecured HTTP connections, this may be ports `5000` or `43847`.

For the frontend, there's a configuration item named `VUE_APP_API_HOST` in the file [wwwroot/.env.development](wwwroot/.env.development). The default value in this configuration file is set to `http://localhost:5000`.

Since the application is configured to accept network requests only from the same origin, the ports of this configuration item and the running application must match. You can either update the configuration in [wwwroot/.enf.development](wwwroot/.env.development) or the ports in [Properties/launchSettings.json](Properties/launchSettings.json).

To finally verify, that everything works as expected, you can point your browser to the path `/edit-session` and enter a valid edit code (e.g. [https://localhost:5001/edit-session](https://localhost:5001/edit-session), where you might need to adjust the port number). Have a look at the database for retrieving such an edit code. One example from the _sampleData_ is: `549-496`.