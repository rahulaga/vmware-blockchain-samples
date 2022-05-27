# Getting started
We need a Kubernetes environment to deploy. You could use a remote cluster or locally with minikube (tested with minikube v1.25.1)

Before you start, please send an email to ask_VMware_blockchain@VMware.com to get JFROG_PASSWORD. This will be required in the next steps.

# k8s environment
Install minikube (https://minikube.sigs.k8s.io/docs/start/). 

Make sure to provide additional resources.

> **Note**: minikube creates a VM using a selected driver and depends on what you have installed. It could be docker, vmware etc. Please [see this list](https://minikube.sigs.k8s.io/docs/drivers/) and you may need to provide this underlying dependency with additional resources if necessary.

See scripts under `minikube` folder that provide convinience scripts to start and delete minikube.

This example using Virtual Box.

```
minikube start --cpus 4 --memory 12288 --disk-size 50g --vm-driver virtualbox
```

Install [`kubectl`](https://kubernetes.io/docs/tasks/tools/) to interact and you can also use a tool like [Lens](https://k8slens.dev/) or once minikube is started run `minikube dashboard` to see your cluster view in a browser.

Some additional useful utilities to have are `watch` and `kubectx`

Set the environment variable:
```
export JFROG_PASSWORD=<secret>
```

# VMBC Deployment

Clone this repo.

For easier testing it is recommended you enable free gas price by updating the `vmbc/config/genesis.json` file as follows:

```
"gasLimit": "0x7FFFFFFFFFFFFFFF"
```

 Now `cd vmbc/script` as all subsequent commands are at this location.

Make sure your kube config is pointed to minikube (eg: use `kubectx` to verify). Deploy VMBC with:
```
./k8s-launch.sh
```

This will end with something like
```
MINIKUBE_IP=192.168.1.2
MINIKUBE_PORT=30545
VMBC_URL=http://192.168.1.2:30545
```

You can use Lens or `watch -n0.1 kubectl get pods --all-namespaces -o wide` to see progress as containers come up. Four namespaces are created, each with 1 pod of the concord replica network. Additionally one namespace is created for the client.

> **Note:** In case you see the ethrpc service LoadBalancer as "pending" then you need to run `minikube tunnel` in a separate terminal window. [See minikube doc](https://minikube.sigs.k8s.io/docs/handbook/accessing/#using-minikube-tunnel). After this the can connect to the client.

Run a simple command like this to get a respone:
```
% curl -X POST --data '{"jsonrpc":"2.0","method":"eth_gasPrice","id":1}' --header "Content-Type: application/json" http://192.168.1.2:30545

{"id":1,"jsonrpc":"2.0","method":"eth_gasPrice","result":"0x0"}
```
        
To test VMBC 
```
./runTest.sh
```
This deploys a erc20test container in the client namespace. Watch the logs with `kubectl log` 
```
kubectl logs <erc20test-xxxx> --n vmbc-client1 
```

# Cleanup

After you are done, to destroy VMBC components:
```
./k8s-destroy.sh
```

Additionally to remove minikube:
```
minikube delete --all
```

# Additional Example Components
    Deploy DAPP
        To launch dapp
            cd dapp
            ./k8s-dapp-launch.sh
        To Destroy dapp
            cd dapp
            ./k8s-dapp-destroy.sh
        To get URL
            minikube service erc20-swap --url --namespace vmbc-dapp
    Deploy Explorer
        To launch explorer
            cd explorer
            ./k8s-explorer-launch.sh
        To Destroy explorer
            cd explorer
            ./k8s-explorer-destroy.sh
        To get URL
            minikube service vmbc-explorer --url --namespace vmbc-explorer
    Deploy ELK stack
        To launch elasticsearch
            cd elk
            ./elk-elastic-launch.sh ; ( make sure that elasticsearch is working before moving further )
        To launch kibana
            cd elk
            ./elk-kibana-launch.sh ; ( make sure that kibana is working before moving further )
        To launch fluentd
            cd elk
            ./elk-fluentd-lanch.sh
            Once all 3 PoDs are up and if you can launch Kibana successfully then you can add 'index' so that you can view all the logs which are matching with your 'index' pattern.
        To Destroy ELK stack
            cd elk
            ./elk-destroy.sh
