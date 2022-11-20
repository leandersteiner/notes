# Kubernetes

```
$ kubectl create deployment app-cache --image=memcached:1.6.8 --replicas=1
deployment.apps/app-cache created
```

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-cache
  labels:
    app: app-cache
spec:
  replicas: 4
  selector:
    matchLabels:
      app: app-cache
  template:
    metadata:
      labels:
        app: app-cache
  spec:
    containers:
    - name: memcached
      image: memcached:1.6.8
```

```
$ kubectl get deployments
NAME        READY   UP-TO-DATE   AVAILABLE   AGE
app-cache   1/1     1            1           17s
```

```
$ kubectl get pods
NAME                         READY   STATUS    RESTARTS   AGE
app-cache-6d4467c8dd-gsp8f   1/1     Running   0          32s
```

```
$ kubectl describe deployment app-cache
Name:                   app-cache
Namespace:              default
CreationTimestamp:      Sun, 20 Nov 2022 16:15:44 +0100
Labels:                 app=app-cache
Annotations:            deployment.kubernetes.io/revision: 1
Selector:               app=app-cache
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=app-cache
  Containers:
   memcached:
    Image:        memcached:1.6.8
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  <none>
NewReplicaSet:   app-cache-6d4467c8dd (1/1 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  50s   deployment-controller  Scaled up replica set app-cache-6d4467c8dd to 1
```

```
$ kubectl get deployments,pods,replicasets
NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/app-cache   1/1     1            1           78s

NAME                             READY   STATUS    RESTARTS   AGE
pod/app-cache-6d4467c8dd-gsp8f   1/1     Running   0          78s

NAME                                   DESIRED   CURRENT   READY   AGE
replicaset.apps/app-cache-6d4467c8dd   1         1         1       78s
```

```
$ kubectl delete deployment app-cache
deployment.apps "app-cache" deleted
```

```
$ kubectl set image deployment app-cache memcached=memcached:1.6.10 --record
deployment.apps/app-cache image updated
```

```
$ kubectl rollout status deployment app-cache
Waiting for rollout to finish: 2 out of 4 new replicas have been updated...
deployment "app-cache" successfully rolled out
```

```
$ kubectl rollout history deployment app-cache
deployment.apps/app-cache
REVISION CHANGE-CAUSE
1 <none>
2 kubectl set image deployment app-cache memcached=memcached:1.6.10 --record=true
```

```
$ kubectl rollout history deployments app-cache --revision=2
deployment.apps/app-cache with revision #2
Pod Template:
Labels: app=app-cache
pod-template-hash=596bc5586d
Annotations: kubernetes.io/change-cause: kubectl set image deployment app-cache memcached=memcached:1.6.10 --record=true
Containers:
memcached:
Image: memcached:1.6.10
Port: <none>
Host Port: <none>
Environment: <none>
Mounts: <none>
Volumes: <none>
```

```
$ kubectl rollout undo deployment app-cache --to-revision=1
deployment.apps/app-cache rolled back
```

```
$ kubectl rollout history deployment app-cache
deployment.apps/app-cache
REVISION CHANGE-CAUSE
2 kubectl set image deployment app-cache memcached=memcached:1.6.10 --record=true
3 <none>
```

```
$ kubectl scale deployment app-cache --replicas=6
deployment.apps/app-cache scaled
```

## Architecture

- consists of Master Nodes(Control Plane) and Workder Nodes which run containerized applications
- pods consist of one or more containers
- all containers of a pod will run on the same node in the cluster
- a node can contain one or more pods
- pods are the smallest schedulable workload
- kubectl is used to interact with the cluster
- resources are described in manifest files(YAML or JSON)
- on one or more master nodes runs the control plane

Control plane consists of:

- **kube-scheduler**: decides where to run newly created pods
- **kube-controller-manager**: responsible for running resource controllers such as deployments
- **cloud-controller-manager**: interacts with the cloud provider, managing resources such as load balancers and disk volumes
- **etcd**: database where kubernetes stores all its information, what nodes exist, what resources exist on the cluster, and so on
- **kube-apiserver**: frontend server for the control plane, handling API requests

Node Components:

- **kubelet**: responsible for driving the container runtime to start workloads and monitoring their status
- **kube-proxy**: routes requests between pods on different nodes and between pods and the internet
- **Container runtime**: starts and stops containers and handles their communication(containerd, CRI-O)

![kubernetes architecture](img/kubernetes-architecture.png)

The components of the control plane configure the whole cluster and react to cluser events.

Important Kubernetes resources:

![kubernetes resources](img/kubernetes-resources.png)

Workloads:

- **Deployment**: running services
- **Job**: services that terminate with a result
- **Cron Job**: periodical jobs
- **Daemon-Set**: background processes that must run on all nodes inside a cluster
- **Stateful-Set**: stable applications mostly distributed databases

### Deployments

![](img/container-in-pod-managed-by-deployment.png)
