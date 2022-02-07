import sharp from 'sharp';

class TransformImage {
    async toJpg(file: Buffer, height: number, width: number) {
        let jpg = await sharp(file).resize(width, height).toFormat('jpg').toBuffer();
        return jpg;
    }

    async toPng(file: Buffer, height: number, width: number) {
        let png = await sharp(file).resize(width, height).toFormat('png').toBuffer();
        return png;
    }
}

export default TransformImage;