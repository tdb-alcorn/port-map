# port-map

Forward local ports to anywhere, transparently.

```
  Usage: port-map [options]

  Forward local ports to anywhere, transparently.


  Options:

    -V, --version     output the version number
    -p --port <port>  Local port to forward
    -h --host <host>  Remote host:port to forward to (e.g. 192.168.1.99:5432)
    -h, --help        output usage information

  Examples:

    Map local port 5432 to some remote service:
      $ port-map -p 8080 -h 183.101.99.87:8080

    Map local port 8080 to local port 8081:
      $ port-map -p 8080 -h localhost:8081

    Map local port 8080 to a docker process listening on 8080:
      $ port-map -p 8080 -h $(docker-machine ip dev):8080

```
