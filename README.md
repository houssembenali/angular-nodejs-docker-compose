Angular — Local Development With Docker-Compose
===============================================

An example project with Angular, Nodejs Project
-----------------------------------------------

<p align="center">
<img src="https://dragonprogrammer.com/wp-content/uploads/2018/12/angular_docker.png" width="400" height="150">
</p>


Docker Compose is really useful when we don’t have the development environment setup on our local machine to run all parts of the application to test or we want to run all parts of the application with one command. For example, if you want to run Angular and nodes express server on different ports and you need a single command to run you can accomplish that with Docker Compose.

In this post, we will see what is Docker Compose and how we can do the local development with Docker Compose and advantages as well.

*   **_What is Docker Compose_**
*   **_Example Project_**
*   **_Run Without Docker Compose_**
*   **_With Docker Compose_**
*   **_Communication Between Services_**
*   **_Summary_**
*   **_Conclusion_**

**_What is Docker Compose_**
============================

Docker-compose is a tool that is used for multi-container applications in a single host. As we can see in the following figure, we can run multi containers as services in the single host with the help of **docker-compose.yaml**.

Once we install docker-compose, basically, we need to follow these three steps

*   Define Dockerfile for the service/container
*   Define **docker-compose.yaml** file with all the services, ports and other details
*   Run this command **_docker-compose up_**

Here are some useful commands

// create and start containers  
docker-compose up// start services with detached mode  
docker-compose -d up// start specific service  
docker-compose up <service-name>// list images  
docker-compose images// list containers  
docker-compose ps// start service  
docker-compose start// stop services  
docker-compose stop// display running containers  
docker-compose top// kill services  
docker-compose kill// remove stopped containers  
docker-compose rm// stop all contaners and remove images, volumes  
docker-compose down

Example Project
===============

This is a simple project which demonstrates developing and running Angular application with NodeJS. We have a simple app in which we can add users, count, and display them at the side, and retrieve them whenever you want.

![](https://miro.medium.com/v2/resize:fit:700/0*N60UPEjkPjLN4E36.gif)

**Example Project**

If you want to practice your own here is a Github link to this project. You can clone it and run it on your machine as well.

// clone the project  
git clone [https://github.com/bbachi/angular-nodejs-docker-compose.git](https://github.com/bbachi/angular-nodejs-docker-compose.git)

**_Run Without Docker Compose_**
================================

If you want to run without Docker Compose for the development. You need to run two terminals and run start commands on each.

// install Angular dependencies and start  
cd app-ui  
npm install  
npm start// install server side dependencies and start  
cd api  
npm install  
npm run dev

**_With Docker Compose_**
=========================

Let’s set up the development environment with Docker Compose. First, we need to install Docker Compose on your machine [here is the link](https://docs.docker.com/compose/install/). Check the installation with this command `docker-compose --version`

API Dockerfile
--------------

Once you have docker-compose installed, you need to have two separate docker files for each environment. I would name these Dockerfiles as **Dockerfile-dev.** Here is the Dockerfile for the node express API and the following are the steps.

**Dockerfile for API**

1.  We are starting from the base image **node:10.**
2.  Set the working directory as **/usr/src/app/api.**
3.  copy the **package.json** to install all the dependencies
4.  Install all the dependencies
5.  We need to put this expose command for the documentation purpose so that other developers know this service runs on port 3080.
6.  Finally, we run the command `npm run dev`

UI Dockerfile
-------------

Here is the Dockerfile for the angular UI and the following are the steps.

**Dockerfile for UI**

1.  We are starting from the base image **node:10.**
2.  Set the working directory as **/usr/src/app/app-ui**
3.  copy the **package.json** to install all the dependencies
4.  We need to install **angular/cli** and **angular-devkit/build-angular** globally so that you don’t have to put the whole path while running commands
5.  Exposing the port 4201
6.  Finally, we run the command `npm start`

Start Commands in Package.json
------------------------------

In the above Dockerfiles, we are running commands with npm on instantiating the containers. Let’s see what are those commands in each package.json files.

For the API, we are running this command `npm run dev` which in turn runs this command `nodemon ./server.js localhost 3080.` Since it’s a development environment we are using nodemon which listens for the changes in files and restart the server automatically.

![](https://miro.medium.com/v2/resize:fit:699/1*B5k0i132XL-aSb3Gbm_rUw.png)

**API package.json**

For the UI, we are running this command `npm start` which in turn runs this command `ng serve --host=0.0.0.0 --port 4201.` We are using Angular CLI here to serve the application on port 4201 that's why we had to install Angular CLI globally.

![](https://miro.medium.com/v2/resize:fit:700/1*QRHCduCSgUIV4xRYBz-6SA.png)

**UI package.json**

Docker Compose File
-------------------

Finally, let’s look at the docker-compose file here. Since we need to run Angular on port **4201** and express API on port **3080** we need to define two services: **nodejs-server** and **angular-ui.**

**docker-compose.yml**

If you look at the above file we defined two services each has its own docker file. The most important thing here is the volumes part we need to mount the whole part of the application and node\_modules folder as well. **We need to mount the node\_modules folder because the volume is not mounted during the build.**

Let’s run the following steps to run the whole setup in the development mode

// build with no cache  
docker-compose build --no-cache// start the services  
docker-compose up// list the services  
docker-compose ps// list the containers  
docker ps// stop services  
docker-compose stop

If you look at the below diagram each service running on the respective ports and they are on the same network **angular-nodejs-docker-compose\_default**

![](https://miro.medium.com/v2/resize:fit:700/1*prWOxBD9SlD0HG-c1Qflsw.png)

**docker-compose**

![](https://miro.medium.com/v2/resize:fit:700/1*8nkvRcfAzJWlnPLD4zM-mA.gif)

**docker-compose up**

**_Communication Between Services_**
====================================

Now the services are running on the default network and these services should be reachable by the service name. By default Compose sets up a single [network](https://docs.docker.com/engine/reference/commandline/network_create/) for your app. Each container for a service joins the default network and is both _reachable_ by other containers on that network, and _discoverable_ by them at a hostname identical to the container name.

We should have the service name in the **proxy.config.json** instead of localhost.

**proxy.config.json**

If you look at the below diagram the entire setup is working with a single command `docker-compose up` and the moment you change anything in the code you can see those changes on the UI immediately.

![](https://miro.medium.com/v2/resize:fit:700/1*k0kJPvOhdMlSagJzVymNQg.gif)

**development environment**

**_Summary_**
=============

*   Docker-compose is a tool that is used for multi-container applications in a single host.
*   Docker Compose is really useful when we don’t have the development environment setup on our local machine to run all parts of the application to test
*   You can run the whole development environment with one command `docker-compose up`
*   You should define separate Dockerfile for development for services. In the above case one for Angular UI and one for node api.
*   We need to mount volumes for the application code and node\_modules since volumes are not mounted during the build.
*   By default Compose sets up a single [network](https://docs.docker.com/engine/reference/commandline/network_create/) for your app. Each container for a service joins the default network and is both _reachable_ by other containers on that network, and _discoverable_ by them at a hostname identical to the container name.
*   If the container\_name is node-api you should call the api with [**http://node-api:3080/api**](http://node-api:3080/api)
*   If you want to install any new dependency while developing the project you need to rebuild the docker-compose.

Conclusion
==========

With Docker Compose, We can run as many services you want with just one command. It’s really useful to run the applications when you don’t have all the setup needed to run those on your machine.
