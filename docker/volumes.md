# Docker Volumes

## Non-persistent data

Containers are designed to be immutabel.
Every Docker container is created by adding a thin read-write layer on top of the read-only image it's based on. This thin writable layer is an integral part of a container and enables read/write operations. It is tightly coupled to the lifecycle of a container: created when the container is created, deleted when the container is deleted.

## Persistent data

Volumes are the recommended way to persist data in containers:

- Volumes are independent objects that are not tied to the lifecycle of a container
- Volumes can be mapped to specialized external storage systems
- Volumes enable multiple containers on different Docker hosts to access and share the same data

You create a volume, then you create a container and mount the volume into it.
The volume is mounted into a directory in the containers filesystem and anything written to that directory is stored in the volume.

```
$ docker volume create testvol
testvol
```

```
$ docker volume ls
DRIVER    VOLUME NAME
local     testvol
```

```
$ docker volume inspect testvol
[
    {
        "CreatedAt": "2022-11-20T14:23:38Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/testvol/_data",
        "Name": "testvol",
        "Options": {},
        "Scope": "local"
    }
]
```

All volumes created with the ```local``` drive get their own directory under ```/var/lib/docker/volumes```.

Ways to delete a Docker volume:

- ```docker volume prune```: will delete all volumes
- ```docker volume rm```: will delete only the specified volume
