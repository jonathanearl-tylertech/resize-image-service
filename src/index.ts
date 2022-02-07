import Storage, { StorageConfig } from '../lib/storage';
import Server from '../lib/server';

const storageConfig: StorageConfig = {
    accessKeyId: 'minioadmin' ,
    secretAccessKey: 'minioadmin' ,
    endpoint: 'http://127.0.0.1:9000' ,
    s3ForcePathStyle: true, // needed with minio?
    sslEnabled: 'http://127.0.0.1:9000'.toLowerCase().includes('http://') ? false : true,
    signatureVersion: 'v4'
};

const storage = new Storage(storageConfig, 'tcp-local-dev');

const serverConfig = { 
    version: 'v1', 
    port: 5010, 
    storage
};
const server = new Server(serverConfig);
server.run();