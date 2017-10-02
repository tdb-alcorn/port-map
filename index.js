const net = require('net');
const commander = require('commander');
const package = require('./package.json');

const argparser = commander
    .command(package.name)
    .version(package.version)
    .description(package.description)
    .option('-p --port <port>', 'Local port to forward', parseInt)
    .option('-h --host <host>', 'Remote host:port to forward to (e.g. 192.168.1.99:5432)');

argparser.on('--help', function() {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    Map local port 5432 to some remote service:');
    console.log('      $ port-map -p 8080 -h 183.101.99.87:8080');
    console.log('');
    console.log('    Map local port 8080 to local port 8081:');
    console.log('      $ port-map -p 8080 -h localhost:8081');
    console.log('');
    console.log('    Map local port 8080 to a docker process listening on 8080:');
    console.log('      $ port-map -p 8080 -h $(docker-machine ip dev):8080');
    console.log('');
});

function main() {
    argparser.parse(process.argv);

    if (!argparser.port || !argparser.host) {
        console.error('Missing required options');
        argparser.help();
    }

    const host = argparser.host.split(':')[0];
    const port = parseInt(argparser.host.split(':')[1]);

    const server = net.createServer();
    const socket = new net.Socket();
    let socketClosed = true;
    socket.on('error', console.error);
    socket.on('close', function(hadError) {
        if (hadError) {
            console.error('Closed due to an error.');
            process.exit(1);
        }
        socketClosed = true;
    });

    server.on('connection', function(client) {
        if (socketClosed) {
            socket.connect({
                port: port,
                host: host,
            });
            socketClosed = false;
        }
        socket.pipe(client);
        client.pipe(socket);
    });
    server.on('error', function(err) {
        console.error(err);
        process.exit(1);
    });
    server.listen(argparser.port, function() {
        console.log(`Forwarding connections on ::${argparser.port} to ${host}:${port}`);
    });
}

main();