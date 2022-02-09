import Storage, { StorageConfig } from '../lib/storage';
import Server from '../lib/server';
import dotenv from 'dotenv';
dotenv.config();

const storageConfig: StorageConfig = {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    endpoint:  process.env.S3_ENDPOINT as string,   
    s3ForcePathStyle: true,
    sslEnabled: (process.env.S3_ENDPOINT as string).toLowerCase().includes('http://') ? false : true,
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