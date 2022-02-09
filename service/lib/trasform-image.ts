import sharp from 'sharp';

class TransformImage {
    public static async toJpg(file: Buffer, height: number, width: number) {
        let jpg = await sharp(file).resize(width, height).toFormat('jpg').toBuffer();
        return jpg;
    }

    public static async toPng(file: Buffer, height: number, width: number) {
        let png = await sharp(file).resize(width, height).toFormat('png').toBuffer();
        return png;
    }
}

export default TransformImage;