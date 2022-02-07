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

    async presignedUrl(key: string) {
        const options = {
            Bucket: this.bucket,
            Key: key,
            Expires: 60 * 60,
            ContentType: 'image/*'
        };
        return await this.s3.getSignedUrl('putObject', options);
    }

    async listFiles(key: string): Promise<string[]> {
        var params = { Bucket: this.bucket, Prefix: key };
        var response = await this.s3.listObjectsV2(params).promise();
        var objects = response.Contents as S3.ObjectList;

        if (!objects || objects.length == 0) return [];
        return objects
            .sort((a, b) => (a.LastModified as Date).getTime()- (b.LastModified as Date).getTime())
            .map(obj => obj.Key as string);
    }

    async getFile(key: string): Promise<Buffer> {
        var options = { Bucket: this.bucket, Key: key}
        var response = await this.s3.getObject(options).promise();
        return response.Body as Buffer;
    }

    async putFile(key: string, file: Buffer) {
        var options = { Bucket: this.bucket, Key: key, Body: file };
        await this.s3.putObject(options).promise();
    }

    async deleteFile(key: string) {
        var options = { Bucket: this.bucket, Key: key };
        await this.s3.deleteObject(options).promise();
    }
}

export default Storage;