# Kubernetes

## Control Plane
- collection of system services that implement the brains of Kubernetes
- exposes API, schedules apps, implements self-healing, manages scaling operations and more

### The API server
- exposes RESTful API over HTTPS
- all requests are subject to authentication and authorization
- application in YAML -> POST to API server -> authenticate and authorize request -> persis app definition in cluster store -> app containers will be scheduled

### The cluster store
- holds the desired state of all apps and cluster components
- only stateful part of control plane
- based on etcd -> replica on every control plane node
- large clusters -> max run separate etcd cluster

### Controllers and the controller manager
- controler implement a lot of the cluster intelligence
- conroller run as a process on conroll plane
  - The Deployment controller
  - The StatefulSet controller
  - The ReplicaSet controller
- controller manager is responsilbe for spawning and managing individual controllers

### The scheduler
- watches API server for new work tasks
- identify capable nodes
- assign tasks to nodes
- involves predicate checks, filtering and a ranking algorithm
- checks for taints, affinity and anti-affinity rules, poet availability and available CPU and memory
- marks tasks as pending if it can't find a suitable node
- if node autoscaling -> kicks off a cluster autoscaling event that adds a new node

### The cloud controller manager
- if cluster is on a public cloud
- integrates with cloud services such as isntances, load balancers and storage

## Worker nodes
### Kubelet
- main kubernetes agent
- handles communication with the cluster
- watches API server for new tasks
- instructs appropriate runtime to execute tasks
- reports taks status to API server
- task won't run -> reports problem to API server -> control plane decides on action

### Runtime
- every worker node has one or more runtimes for executing tasks
- most new kubernetes clusters pre-install containerd
- Tasks include:
  - Pulling contaier images
  - managing lifecycle operations (starting, stopping containers etc.)
- Older clusters -> shipped with docker runtime
- Redhat OpenShift -> CRI-O runtime

### Kube-proxy
- implements cluster networking
- load balances traffic to rasks running on the node
