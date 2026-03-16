I'm working on learning how to use the Aspire.dev framework to host an application.  I want you to do the following:

1. Create a new application in Python.  This app should be a containerized app that can run locally in docker.  Eventually I want to deploy it using Aspire, but I don't want to start with that.
2. The application is called "Posts".  It is a micro-blogging platform that allows people to post their thoughts on a web application page.  Think of it as an ultra-lightweight version of Twitter.  In the initial version, the app works like this:
    1. Users create a handle for their current session.  e.g. @coolguy, @pizzalover, @mrtea.  Don't worry about passwords for now, just the handle.
    2. After they create a handle, they can create posts.  Posts are short text messages, up to 256 characters in length.  
    3. When a post is finished, a user can publish it to the site, at which time it appears at the top of the global feed of posts.
    4. Posts are timestamped and indicate the author of the post.  Posts can be deleted and edited by the author.
3. The application should have a backend service and a front-end web API.  Use a backend like FastAPI and a frontend like React.  
4. Generate instructions for how I can run the application locally using docker.
