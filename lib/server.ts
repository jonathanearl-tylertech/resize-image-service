import express from 'express';
import Storage from './storage';
import TransformImage from './trasform-image';

class Server {
    version: string;
    port: number;
    storage: Storage;

    constructor(options: { version: string, port: number, storage: Storage }) {
        this.version = options.version || 'v1';
        this.port = options.port || 5010;
        this.storage = options.storage;
    }

    run() {
        const app = express();

        app.get('/api/v1/customer/:customerId/banner/presignedUrl', async (req, res) => {
            // should wrap these calls in 'banner lib or whatever'
            const presignedUrl = await this.storage.presignedUrl('/assets/customer/1/banner/staging/banner');
            res.json({data: presignedUrl});
        });

        app.post('/api/v1/customer/:customerId/banner/staging', async (req, res) => {
            // get banner
            const customerId = req.params.customerId;
            const stagedKey = `/assets/customer/${customerId}/banner/staging/banner`;
            const banner = await this.storage.getFile(stagedKey);
            if (!banner) {
                return res.sendStatus(404);
            }

            // convert to jpg
            const bannerJpg = await TransformImage.toJpg(banner, 300, 300);

            // save to published url
            const bannerUrl = `/assets/customer/${customerId}/published/banner.jpg`;
            await this.storage.putFile(bannerUrl, bannerJpg);

            // delete staged files
            await this.storage.deleteFile(stagedKey);
            res.sendStatus(201);
        });
        
        app.listen(this.port, () => {
            console.log(`Server now listening on ${this.port}`);
        });
    }
}


export default Server;