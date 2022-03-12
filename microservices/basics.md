# Basics

## Monoliths

### In the beginning

- Simple to develop
- Easy to make radical changes
- Easy to test
- Easy to deploy
- Easy to scale (load balancer -> many instances)

### With time

Applications will outgrow the monolithic architecture.
Applications grow too large and complex making it impossible for individual developlers to fully understand.
This will make bugs harder to fix and implementing new features more time consuming.
The more complex a system already is, the harder it is to implement new features correctly making it even more complex.
Monoliths are also tightly coupled to its chosen technology stack. There is no way to change the stack of parts of the application.

## Microservices

### Scale Cube (The Art of Scalability - Martin Abbott & Michael Fisher)

- X-Axis scaling(horizontal duplication): scale by cloning (One instance -> Many instances)
- Y-Axis scaling(functional decomposition): scale by splitting things that are different (Monolith -> Microservices)
- Z-Axis scaling(data partitioning): scale by splitting similar things (One partition -> Many partitions)

### Modularity

Modern applications are too large to be developed or even understood by an individual.
Splitting them into many smaller modules makes understanding easier and in turn simplifies devlopment.

### Data

Each service has its own datastore.
Services are loosely coupled and only communicate via APIs.
Inter-service communication happends through message brokers or direct service-to-service communication using lightweight protocols like REST or gRPC.

### Benefits

- Services are small and easy to maintain
- Services are independently deployable
- Services are independently scalable
- Allows experimenting with new Technologies
- Fault isolation

### Drawbacks

- Decompositon is challenging
- Distributed systems are complex
- Harder to test
- Harder to deploy
