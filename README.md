# BYOD Launcher
BYOD Launcher is a tool used at _Gewerblich-industrielles Bildungszentrum Zug (GIBZ)_ to provide students and teachers a possibility to easily setup their personal device.

It's an application developed and used internally at GIBZ although it's publicly available at https://byod-launcher.ch.

## Tech Stack
At it's core, BYOD Launcher is a ASP.NET Core web application. The frontend is built using the progressive javascript framework [Vue.js](https://vuejs.org) and the material design framework [Vuetify](https://vuetifyjs.com). Additionally, [Vuex](https://vuex.vuejs.org/) is used for state management and [Vue Router](https://router.vuejs.org/) for routing in the frontend.  

Communication between frontend and backend depends on a REST api implemented in ASP.NET Core as well as [ASP.NET Core SignalR](https://docs.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-3.1).

The live BYOD Launcher application is running on a virtual machine in [Google Cloud Compute](https://cloud.google.com/compute?hl=de). This machine is running a [Debian 10 (Buster)](https://www.debian.org/News/2019/20190706) operating system. The applications data is kept in a [MariaDB](https://mariadb.org/) database. [Nginx](https://www.nginx.com/) is used as a reverse proxy, redirecting incoming traffic on ports 80 (http) and 443 (https) to the port 5000 where the ASP.NET Core application is running.

TLS certificates for HTTPS connections are retrieved from [Let's encrypt](https://letsencrypt.org) using [certbot](https://certbot.eff.org/).

## Installation
You'll find an installation guide in the [INSTALL.md](INSTALL.md) file.

This installation guide is intended for local development installations only and should _not_ be used for production environments. Also, the guide is not complete and needs some degree of technical curiosity.

## Known Bugs and Security Issues
In thi section, known bugs ans security issues in the currently live running application are listed.

### Failing API Requests
When the user visits the BYOD Launcher application using _www_ in the domain name (https://**www**.byod-launcher.ch), certain api requests are failing due to a restriction in Content Security Policy (CSP).

### Edit-Code for Sessions Publicly Available
When inspecting certain api responses, regular users of the application ("students" / participants) receive the six-digit code for editing a prepared session. This edit-code should be kept secret since it allows (mis)configuration of existing sessions.

_Thanks to Noah E. for pointing out this security issue!_

## Known Limitations
In this sections, known restrictions and limitations in the currently live running application are listed. This items might be a good starting point for further optimizations and developments ;-)

### Personal setup
It is desirable for individuals (students and teachers) to complete a BYOD setup completely on their own using BYOD Launcher. The interested subjects should be allowed to chose various setup targets and follow the instructions on their own - without prior preparation through a third party.

### Persistence and Editing of Sessions
Teachers are able to compose a session for setting up multiple student devices in class. These sessions currently are not easy accessible for further editing and/or usage in class. Teachers need to record a six-digit edit-code to later access the edit section of BYOD Launcher. Currently, this edit section is not directly accessible by a link - uses are required to type the `/edit-session` url manually.

It would be much easier for teachers, if they could use a kind of authentication to access all their previously created sessions. To lower the barrier for teachers, one should consider to use existing authenticating mechanisms like Microsofts O365 or [GIBZ Portal](https://portal.gibz.ch) instead of rolling yet another authentication.

### Presentation of Tutorial Steps
The presentation of tutorials should be improved - especially when images are used within tutorial steps. Sometimes, bigger tutorials seem to overlap the viewport which results in inaccessible buttons.

### Editing of Tutorials
Tutorials or individual tutorial steps cannot be edited after they have been created.

### More Detailed Results in Sessions
When teachers conduct BYOD setup sessions with their classes, there are multiple mechanisms for feedback of completed steps. This feedback is either returned automatically or manually and results in simple red/green status bars in the presenters view.

Desirable are features like:
- Participants can request help through manual interaction
- Presenters can see which participants completed or failed specific steps
- Participants can provide textual feedback to the presenter
- ...