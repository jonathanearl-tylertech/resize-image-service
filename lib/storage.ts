import S3, { ClientConfiguration } from 'aws-sdk/clients/s3';

export interface StorageConfig {
    accessKeyId: string,        // 'minioadmin'
    secretAccessKey: string,    // 'minioadmin'
    endpoint: string,           // 'http:127.0.0.1:9000'
    s3ForcePathStyle: true,     // true
    sslEnabled: boolean,        // false
    signatureVersion: string    // 'v4'
}

class Storage {
    public config: StorageConfig;
    public bucket: string;
    public s3: S3;

    constructor(config: StorageConfig, bucket: string) {
        this.config = config;
        this.bucket = bucket;
        this.s3 = new S3(this.config as ClientConfiguration);
    }

    async getFile(key: string): Promise<Buffer> {
        var params = { Bucket: this.bucket, Key: key}
        var response = await this.s3.getObject(params).promise();
        return response.Body as Buffer;
    }

    async putFile(key: string, file: Buffer) {
        var putOptions = { Bucket: this.bucket, Key: key, Body: file };
        await this.s3.putObject(putOptions).promise();
    }
}

export default Storage;