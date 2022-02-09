import express from 'express';
import Storage from './storage';
import TransformImage from './trasform-image';
import bodyParser from 'body-parser';

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
            return res.json({data: presignedUrl});
        });

        app.post('/api/v1/customer/:customerId/banner', async (req, res) => {
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

        // can be used as lambda endpoint
        app.post('/', bodyParser.json(), async (req, res) => {
            try {
                if (!req.body?.Records) {
                    console.log(req.body);
                    return res.sendStatus(400);
                }
                const stagedKey = req.body.Records[0].s3.object.key.replaceAll('%2F', '/');

                // get banner
                const customerId = stagedKey.split('/')[2];
                const banner = await this.storage.getFile(stagedKey);
                if (!banner) {
                    return res.sendStatus(404);
                }

                // convert to jpg
                const bannerJpg = await TransformImage.toJpg(banner, 300, 300);

                // save to published url
                const bannerUrl = `/assets/customer/${customerId}/banner.jpg`;
                await this.storage.putFile(bannerUrl, bannerJpg);

                // delete staged files
                await this.storage.deleteFile(stagedKey);
                res.send('');
            } catch (err) {
                console.log(err);
                res.send('');
            }
        })

        app.listen(this.port, () => {
            console.log(`Server now listening on ${this.port}`);
        });
    }
}


export default Server;