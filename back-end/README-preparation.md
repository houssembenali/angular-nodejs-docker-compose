Developing Spring Boot Applications in Docker locally
=====================================================

with a focus on giving a great developer experience and productivity

![](https://miro.medium.com/v2/resize:fit:700/0*A6XAaGv4m0FY9Igx)

Photo by [Ian Taylor](https://unsplash.com/@carrier_lost?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com?utm_source=medium&utm_medium=referral)

Docker provides an unprecedented way of creating portable dev environments which are quick to set up and easy to extend. Creating containerized applications has the promise of the lowest [dev/prod parity](https://12factor.net/dev-prod-parity). However, any developer would take the path of least resistance when it comes to day-to-day coding workflows. The instructions provided for containerizing the spring boot applications often lack the focus on doing so on the local dev box. These also are not tested on all the three commonly used operating systems — Windows, OSX, and Linux. This tutorial aims to bridge the gap.

Step 1: Download and install Docker
-----------------------------------

Unless you already have Docker installed, you can download and install it from [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

Step 2: Create a Spring Boot Application
----------------------------------------

[

Spring Initializr
-----------------

### Initializr generates spring boot project with just what you need to start quickly!

start.spring.io



](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.5.5&packaging=jar&jvmVersion=11&groupId=com.trantorinc&artifactId=spring-boot-local-dev-docker&name=spring-boot-local-dev-docker&description=Demo%20project%20for%20Spring%20Boot%20using%20Docker%20for%20Local%20Dev&packageName=com.trantorinc.spring-boot-local-dev-docker&dependencies=devtools,webflux,lombok)

You can use the web-based Spring Initializr or a different method to create a spring boot application.

![](https://miro.medium.com/v2/resize:fit:700/1*1DtJhd4BVLUOij6yoRd7Fg.png)

A screenshot from Spring Initalizr

I have added three dependencies for the purpose of this tutorial:

*   \[Required\] Spring Boot DevTools — Provides fast application restarts, LiveReload, and configurations for enhanced development experience.
*   \[Optional\] Spring Reactive Web — Build reactive web applications with Spring WebFlux and Netty.
*   \[Optional\] Lombok — Java annotation library which helps to reduce boilerplate code.

Here are the maven dependencies:

<dependency>  
   <groupId>org.springframework.boot</groupId>  
   <artifactId>spring-boot-devtools</artifactId>  
   <scope>runtime</scope>  
   <optional>true</optional>  
</dependency><dependency>  
   <groupId>org.springframework.boot</groupId>  
   <artifactId>spring-boot-starter-webflux</artifactId>  
</dependency>  
  
<dependency>  
   <groupId>org.projectlombok</groupId>  
   <artifactId>lombok</artifactId>  
   <optional>true</optional>  
</dependency>

Step 3: Develop code inside Docker
----------------------------------

Following are some capabilities that we wish to have:

1.  Being able to develop code available in your local file system using an IDE such as IntelliJ Idea, VSCode or Eclipse (or STS)
2.  Avoid having to compile on the host
3.  Being able to automatically build and deploy changes to without having to manually build or restart the application

The first step is to create a Dockerfile at the application root.

Eclipse Temurin is the base image having the Open JDK 11 installed on a Debian OS.

The utility called “inotify-tools” helps monitor changes in the code.

We use “dos2unix” to workaround to normalize the line endings in files created in Windows and make them able to run inside the unix-based container.

Create a run.sh file to help automate the tasks to be run at application boot-up

The local source code directory is mounted inside the container at the path /app

A container’s local storage is supposed to be volatile. We would hate to lose our maven dependencies which can take a few minutes to cache the first time when we run the application. So, we have mounted the .m2 directory from inside the container to be available as a local directory on our local file system. This will allow you to destroy the container and recreate it without hassle.

The following ports are exposed:

1.  The application runs on port 8080.
2.  Port 35729 allows the [livereload plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) to listen to changes
3.  Port 5005 makes the debugger available to the IDE

The docker image can be built using the command

docker-compose build

and the container can be run using the following

docker-compose up

Step 4: Debugging with your IDE
-------------------------------

I’ll use IntelliJ Idea for the demonstration. Search for “remote debugging” in the context of your favorite IDE to find the instructions for your workflow.

Edit the run configurations

![](https://miro.medium.com/v2/resize:fit:545/1*aqeR9Ui51D2cIU_W1BkD5w.png)

Add new configuration

![](https://miro.medium.com/v2/resize:fit:302/1*RBRnhZ7nJ1wNlYA9JIMJ7w.png)

Choose “Remove JVM Debug”. The default options should work. Here’s what my configuration looks like:

![](https://miro.medium.com/v2/resize:fit:700/1*zdC_LRK0YZxiXzYqPiHD6w.png)

Now select your new remote configuration from the dropdown and hit the debug button

![](https://miro.medium.com/v2/resize:fit:400/1*Tlqt4BslO771IS-ngeDaDg.png)

Here’s what a successful console output looks like

![](https://miro.medium.com/v2/resize:fit:699/1*X5A45iuO5yqgWK8mUwOkqA.png)

Now add a breakpoint and run your API. It should hit your breakpoint.

![](https://miro.medium.com/v2/resize:fit:700/1*LJfrDaSBdN80L_b0SiG-Ig.png)

Make some changes to the codebase and observe that the code rebuilds automatically.

![](https://miro.medium.com/v2/resize:fit:700/1*R0n_zVeYSpGzq0wNjtJiZw.png)

Resources
---------

The source code for this tutorial can be found on [https://github.com/v1bh0r/spring-boot-local-dev-docker/](https://github.com/v1bh0r/spring-boot-local-dev-docker/)

Troubleshooting
---------------

Most of the issues that I have encountered with the setup have been around volume mounts on Windows.

You might face issues such as permission errors on the mounted source code or the code changes not triggering a re-build automatically.

Being aware of if you are using Hypervisor or WSL1 or WSL2 is the key to solving these issues.

[

\[WSL2\] File changes made by Windows apps on Windows filesystem don't trigger notifications for…
-------------------------------------------------------------------------------------------------

### WSL2 is really close to being a perfect runtime environment for server apps being developed in Windows. Great job! One…

github.com



](https://github.com/microsoft/WSL/issues/4739)

[

Volumes mounted from a Linux WSL instance don't resolve in container · Issue #2151 · docker/for-win
---------------------------------------------------------------------------------------------------

### You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or…

github.com



](https://github.com/docker/for-win/issues/2151)

[

Mounting data volume for Postgres in docker for Windows doesn't work · Issue #445 · docker/for-win
--------------------------------------------------------------------------------------------------

### nobleator added a commit to nobleator/ims-microservices that referenced this issue Dec 2, 2019 Attempt to add volume…

github.com



](https://github.com/docker/for-win/issues/445)