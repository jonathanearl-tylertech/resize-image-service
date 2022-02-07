import S3, { ClientConfiguration } from 'aws-sdk/clients/s3';

class Storage {
    public config: ClientConfiguration;
    public bucket: string;
    public s3: S3;

    constructor(config: ClientConfiguration, bucket: string) {
        this.config = config;
        this.bucket = bucket;
        this.s3 = new S3(this.config);
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