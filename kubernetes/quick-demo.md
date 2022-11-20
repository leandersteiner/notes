# Basics

main.go

```go
package main

import (
  "fmt"
  "log"
  "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintln(w, "Hello, 世界")
}

func main() {
  http.HandleFunc("/", handler)
  fmt.Println("Running demo app. Press Ctrl+C to exit...")
  log.Fatal(http.ListenAndServe(":8888", nil))
}
```

Dockerfile

```Dockerfile
FROM golang:1.17-alpine AS build

WORKDIR /src/
COPY main.go go.* /src/
RUN CGO_ENABLED=0 go build -o /bin/demo

FROM scratch
COPY --from=build /bin/demo /bin/demo
ENTRYPOINT ["/bin/demo"]
```

Building the image

`docker image build -t myhello .`

Running the image

`docker container run -p 9999:8888 myhello`

Running using kubernetes

`kubectl run demo --image=docker_id/myhello --port=9999 --labels app=demo`

Forwarding ports

`kubectl port-forward pod/demo 9999:8888`

Check status

`kubectl get pods --selector app=demo`

---

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-pod
  labels:
    app.kubernetes.io/name: hello
spec:
  containers:
    - name: hello-container
      image: busybox
      command: ["sh", "-c", "echo Hello from my container! && sleep 3600"]
```

```
$ kubectl apply -f pod.yaml
pod/hello-pod created
```

```
$ kubectl get pods
NAME        READY   STATUS    RESTARTS   AGE
hello-pod   1/1     Running   0          7s
```

```
$ kubectl logs hello-pod
Hello from my container!
```

```
$ kubectl delete pod hello-pod
pod "hello-pod" deleted
```

```
$ kubectl get pods
No resources found in default namespace.
```

---

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: hello
  labels:
    app.kubernetes.io/name: hello
spec:
  replicas: 5
  selector:
    matchLabels:
      app.kubernetes.io/name: hello
  template:
    metadata:
      labels:
        app.kubernetes.io/name: hello
    spec:
      containers:
        - name: hello-container
          image: busybox
          command: ["sh", "-c", "echo Hello from my container! && sleep 3600"]
```

```
$ kubectl apply -f replicaset.yaml
replicaset.apps/hello created
```

```
$ kubectl get replicaset
NAME    DESIRED   CURRENT   READY   AGE
hello   5         5         5       16s
```

```
$ kubectl get pods
NAME          READY   STATUS    RESTARTS   AGE
hello-2csjw   1/1     Running   0          40s
hello-5dm88   1/1     Running   0          40s
hello-fbc5d   1/1     Running   0          40s
hello-lh2sn   1/1     Running   0          40s
hello-qppzr   1/1     Running   0          40s
```

```
$ kubectl get pod hello-2csjw -o yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2022-11-20T19:33:33Z"
  generateName: hello-
  labels:
    app.kubernetes.io/name: hello
  name: hello-2csjw
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: hello
    uid: a387a8a5-2113-47b9-974e-c7ecbaa89d2b
  resourceVersion: "125603"
  uid: 2eb2defd-d32a-4c61-97ea-a8ed4dd692a1
spec:
  containers:
  - command:
    - sh
    - -c
    - echo Hello from my container! && sleep 3600
    image: busybox
    imagePullPolicy: Always
    name: hello-container
    resources: {}
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: kube-api-access-9vwtj
      readOnly: true
  dnsPolicy: ClusterFirst
  enableServiceLinks: true
  nodeName: docker-desktop
  preemptionPolicy: PreemptLowerPriority
  priority: 0
  restartPolicy: Always
  schedulerName: default-scheduler
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  tolerations:
  - effect: NoExecute
    key: node.kubernetes.io/not-ready
    operator: Exists
    tolerationSeconds: 300
  - effect: NoExecute
    key: node.kubernetes.io/unreachable
    operator: Exists
    tolerationSeconds: 300
  volumes:
  - name: kube-api-access-9vwtj
    projected:
      defaultMode: 420
      sources:
      - serviceAccountToken:
          expirationSeconds: 3607
          path: token
      - configMap:
          items:
          - key: ca.crt
            path: ca.crt
          name: kube-root-ca.crt
      - downwardAPI:
          items:
          - fieldRef:
              apiVersion: v1
              fieldPath: metadata.namespace
            path: namespace
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: "2022-11-20T19:33:33Z"
    status: "True"
    type: Initialized
  - lastProbeTime: null
    lastTransitionTime: "2022-11-20T19:33:40Z"
    status: "True"
    type: Ready
  - lastProbeTime: null
    lastTransitionTime: "2022-11-20T19:33:40Z"
    status: "True"
    type: ContainersReady
  - lastProbeTime: null
    lastTransitionTime: "2022-11-20T19:33:33Z"
    status: "True"
    type: PodScheduled
  containerStatuses:
  - containerID: docker://8a88a5d3a4a044c3732f434b2a3eabb7ca6629195811425628f7b613a0b914ea
    image: busybox:latest
    imageID: docker-pullable://busybox@sha256:fcd85228d7a25feb59f101ac3a955d27c80df4ad824d65f5757a954831450185
    lastState: {}
    name: hello-container
    ready: true
    restartCount: 0
    started: true
    state:
      running:
        startedAt: "2022-11-20T19:33:39Z"
  hostIP: 192.168.65.4
  phase: Running
  podIP: 10.1.0.35
  podIPs:
  - ip: 10.1.0.35
  qosClass: BestEffort
  startTime: "2022-11-20T19:33:33Z"
```

```
$ kubectl get pod hello-2csjw -o yaml | grep -A5 ownerReferences
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: hello
```

```
$ kubectl delete pod hello-2csjw
pod "hello-2csjw" deleted
```

```
$ kubectl get pods
NAME          READY   STATUS    RESTARTS   AGE
hello-5dm88   1/1     Running   0          4m20s
hello-8c2lc   1/1     Running   0          49s
hello-fbc5d   1/1     Running   0          4m20s
hello-lh2sn   1/1     Running   0          4m20s
hello-qppzr   1/1     Running   0          4m20s
```

```
$ kubectl delete replicaset hello
replicaset.apps "hello" deleted
```

```
$ kubectl get pods
NAME          READY   STATUS        RESTARTS   AGE
hello-5dm88   1/1     Terminating   0          6m19s
hello-8c2lc   1/1     Terminating   0          2m48s
hello-fbc5d   1/1     Terminating   0          6m19s
hello-lh2sn   1/1     Terminating   0          6m19s
hello-qppzr   1/1     Terminating   0          6m19s
```
