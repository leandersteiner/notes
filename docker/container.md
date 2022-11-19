# Container

## Container - TLDR

- is the runtime instance of an image
- can start one or more containers from a single image
- containers are faster and more lightweight compared to vms
- share the OS/kernel with the host they are running on
- common to be based on minimalist images

```
$ docker container run -it ubuntu bash
```

Containers run until the app they are executing exits.

```
$ docker container run -it alpine:latest sleep 10
```

The container will start, seize your terminal for 10 seconds, then exit.

```
$ docker container stop <id/name>
$ docker container rm <id/name>
```

## Container - Deep dive

### Running containers

```
$ docker container run -it ubuntu:latest bash
Unable to find image 'ubuntu:latest' locally
latest: Pulling from library/ubuntu
d51af753c3d3: Pull complete
fc878cd0a91c: Pull complete
6154df8ff988: Pull complete
fee5db0ff82f: Pull complete
Digest: sha256:747d2dbbaaee995098c9792d99bd333c6783ce56150d1b11e333bbceed5c54d7
Status: Downloaded newer image for ubuntu:latest
root@dba51f2fbc6f:/# ls -l
total 48
lrwxrwxrwx   1 root root    7 Nov  1 21:15 bin -> usr/bin
drwxr-xr-x   2 root root 4096 Apr 18  2022 boot
drwxr-xr-x   5 root root  360 Nov 19 19:45 dev
drwxr-xr-x   1 root root 4096 Nov 19 19:45 etc
drwxr-xr-x   2 root root 4096 Apr 18  2022 home
lrwxrwxrwx   1 root root    7 Nov  1 21:15 lib -> usr/lib
lrwxrwxrwx   1 root root    9 Nov  1 21:15 lib32 -> usr/lib32
lrwxrwxrwx   1 root root    9 Nov  1 21:15 lib64 -> usr/lib64
lrwxrwxrwx   1 root root   10 Nov  1 21:15 libx32 -> usr/libx32
drwxr-xr-x   2 root root 4096 Nov  1 21:15 media
drwxr-xr-x   2 root root 4096 Nov  1 21:15 mnt
drwxr-xr-x   2 root root 4096 Nov  1 21:15 opt
dr-xr-xr-x 336 root root    0 Nov 19 19:45 proc
drwx------   2 root root 4096 Nov  1 21:18 root
drwxr-xr-x   5 root root 4096 Nov  1 21:18 run
lrwxrwxrwx   1 root root    8 Nov  1 21:15 sbin -> usr/sbin
drwxr-xr-x   2 root root 4096 Nov  1 21:15 srv
dr-xr-xr-x  11 root root    0 Nov 19 19:45 sys
drwxrwxrwt   2 root root 4096 Nov  1 21:18 tmp
drwxr-xr-x  14 root root 4096 Nov  1 21:15 usr
drwxr-xr-x  11 root root 4096 Nov  1 21:18 var
```

```
$ docker container ls
CONTAINER ID   IMAGE           COMMAND   CREATED              STATUS              PORTS     NAMES
dba51f2fbc6f   ubuntu:latest   "bash"    About a minute ago   Up About a minute             quirky_black
```

To exit an interactive container without killing the main process press ```Ctrl-PQ``` otherwise the container will exit.

To reattach to a running container use the ```docker container exec -it <id/name> bash``` command:

```
$ docker container exec -it dba51f2fbc6f bash
root@dba51f2fbc6f:/#
```

```
$ docker container stop dba51f2fbc6f
dba51f2fbc6f
```

```
$ docker container rm dba51f2fbc6f
dba51f2fbc6f
```

### Container lifecycle

Let's create a new container this time with a name and create some data inside the ```tmp``` directory:

```
$ docker container run --name test -it ubuntu:latest bash
root@b48ff21c73f0:/# cd tmp
root@b48ff21c73f0:/tmp# ls -l
total 0
root@b48ff21c73f0:/tmp# echo "Some test data" > testfile
root@b48ff21c73f0:/tmp# ls -l
total 4
-rw-r--r-- 1 root root 15 Nov 19 19:53 testfile
root@b48ff21c73f0:/tmp# cat testfile
Some test data
root@b48ff21c73f0:/tmp#
```

Now exit the container without killing it(```Ctrl-PQ```) and stop the container after:

```
$ docker container stop test
test

$ docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

$ docker container ls -a
CONTAINER ID   IMAGE           COMMAND   CREATED         STATUS                        PORTS   NAMES
b48ff21c73f0   ubuntu:latest   "bash"    4 minutes ago   Exited (137) 42 seconds ago           test
```

Stopping a container is like stopping a VM all configuration and files still exist in the local filesystem of the host.
Let's start it back up:

```
$ docker container start test
test

$ docker container ls
CONTAINER ID   IMAGE           COMMAND   CREATED         STATUS          PORTS     NAMES
b48ff21c73f0   ubuntu:latest   "bash"    7 minutes ago   Up 25 seconds             test
```

Let's check, that our created file still exists:

```
$ docker container exec -it test bash
root@b48ff21c73f0:/# cd tmp
root@b48ff21c73f0:/tmp# ls -l
total 4
-rw-r--r-- 1 root root 15 Nov 19 19:53 testfile
root@b48ff21c73f0:/tmp# cat testfile
Some test data
root@b48ff21c73f0:/tmp#
```

Two important things:
1. data is stored on the docker hosts local filesystem
2. Containers are designed to be immutable objects and it's not a good practice to write data to them

Let's now stop and delete our container:

```
$ docker container stop test
test

$ docker container rm test
test

$ docker container ls -a
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
```

### Restart policies

Most of the time we want containers to restart when they shut down unexpectedly.
These policies are applied per container and can be configured on the command line when starting a container.

The following policies exist:

- always
- unless-stopped
- on-failed

```
$ docker container run --name restart-always -it --restart always alpine sh
Unable to find image 'alpine:latest' locally
latest: Pulling from library/alpine
ca7dd9ec2225: Pull complete
Digest: sha256:b95359c2505145f16c6aa384f9cc74eeff78eb36d308ca4fd902eeeb0a0b161b
Status: Downloaded newer image for alpine:latest
/ # exit

$ docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED              STATUS          PORTS     NAMES
66edee594769   alpine    "sh"      About a minute ago   Up 11 seconds             restart-always
```

The container was created about a minute ago but the uptime only says 11 seconds which means that the container was restarted after the ```exit``` command.

### Tidying up

Delete all containers:

```
$ docker container rm $(docker container ls -aq) -f
66edee594769
```

### Commands

- ```docker container run```
- ```Ctrl-PQ```
- ```docker container ls```
- ```docker container exec```
- ```docker container stop```
- ```docker container start```
- ```docker container rm```
- ```docker container inspect```
