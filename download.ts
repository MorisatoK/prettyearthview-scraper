import fs from 'fs';
// @ts-ignore
import downloader from 'image-downloader';
import {IPhotoMetaData} from './types';

const metaDataFilePath: string = './output/prettyEarthViewOutput.json';
const outputDirectory: string = './output/images';
let photoMetaData: IPhotoMetaData[] = [];

const download: () => void = async () => {
    for await (const photo of photoMetaData) {
        const filePath: string = `${outputDirectory}/${photo.slug}.jpg`;

        if (fs.existsSync(filePath)) {
            // eslint-disable-next-line no-console
            console.log(`image "${filePath}" already exists. skipping download.`);

            continue;
        }

        const downloadOptions: IImageDownloaderOptions = {
            dest: filePath,
            extractFilename: false,
            url: photo.photoUrl,
        };

        // eslint-disable-next-line no-console
        console.log(`downloading image "${photo.photoUrl}" for slug "${photo.slug}"`);

        await downloader.image(downloadOptions).then((result: IImageDownloaderResult) => {
            // eslint-disable-next-line no-console
            console.log(`success! saved image as "${result.filename}"\n`);
        });
    }
};

(() => {
    fs.readFile(metaDataFilePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // eslint-disable-next-line no-console
                console.error(
                    'meta data file not found. run `npm start` first to scrape metadata.'
                );
            } else {
                throw err;
            }
        } else {
            photoMetaData = JSON.parse(data as unknown as string);

            if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory);

            download();
        }
    });
})();

interface IImageDownloaderOptions {
    url: string;
    dest: string;
    extractFilename?: boolean;
    headers?: Headers;
    timeout?: number;
}

interface IImageDownloaderResult {
    filename: string;
}
