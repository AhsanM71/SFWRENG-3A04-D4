### Running the backend
To run the backend you need to be in the DealCheckBackend directory.
Set the `LOCAL_PROJECT_PATH` environment variable in the `.env` to `.` to symbolize the locaiton of the code on the local machine.

```ssh
cd DealCheckBackend
docker compose up --build
```
Running the command above will build the docker image and run the container. When changing the backend code, you don't need to rebuild the image, changes will be detected automatically by Flask (like running and developing it on your local machine).