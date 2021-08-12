import fs from 'fs';
import path from 'path';
import fetch from 'cross-fetch';

const outputFilePath: string = './output/prettyEarthViewOutput.json';
let dataObject: IPhotoMetaData[] = [];

const fetchApi: (file: string) => Promise<IPhotosJson[] | IPhotoMetaData> = (file: string) => {
    return new Promise((resolve, reject) => {
        fetch(`https://earthview.withgoogle.com/_api/${file}.json`)
            .then((response: Response) => (response.status === 200 ? response.text() : undefined))
            .then((data: string | undefined) => {
                if (typeof data !== 'undefined') {
                    // eslint-disable-next-line no-console
                    console.log(`success!`);

                    resolve(JSON.parse(data));
                }
            })
            .catch((reason: unknown) => reject(reason));
    });
};

const fetchPhotosJson: () => Promise<IPhotosJson[]> = () => {
    // eslint-disable-next-line no-console
    console.log(`fetching photos json data.`);

    return fetchApi('photos') as Promise<IPhotosJson[]>;
};

const fetchPhotoMetaData: (slug: string) => Promise<IPhotoMetaData> = (slug: string) => {
    // eslint-disable-next-line no-console
    console.log(`fetching photo metadata for slug "${slug}".`);

    return fetchApi(slug) as Promise<IPhotoMetaData>;
};

const writeOutputFile: () => Promise<void> = () => {
    return new Promise((resolve, reject) => {
        fs.writeFile(
            outputFilePath,
            JSON.stringify(dataObject, null, 2),
            (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    reject();
                    // eslint-disable-next-line no-console
                    return console.error(err);
                }

                // eslint-disable-next-line no-console
                console.log('output file was saved!');
                resolve();
            }
        );
    });
};

const scrape = async () => {
    const photosData: IPhotosJson[] = await fetchPhotosJson();

    for await (const photo of photosData) {
        if (dataObject.find((obj: IPhotoMetaData) => obj.slug === photo.slug)) {
            // eslint-disable-next-line no-console
            console.log(`metadata for slug "${photo.slug}" already exists, skipping.`);
            continue;
        }

        const photoData: IPhotoMetaData = await fetchPhotoMetaData(photo.slug);

        dataObject.push(photoData);

        dataObject.sort((a: IPhotoMetaData, b: IPhotoMetaData) => {
            return parseInt(a.id, 10) - parseInt(b.id, 10);
        });

        await writeOutputFile();
    }
};

(() => {
    fs.readFile(outputFilePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            } else {
                const dirName: string = path.dirname(outputFilePath);

                if (!fs.existsSync(dirName)) fs.mkdirSync(dirName);

                scrape();
            }
        } else {
            dataObject = JSON.parse(data as unknown as string);
            scrape();
        }
    });
})();

interface IPhotosJson {
    hue: number;
    lat: number;
    lng: number;
    primaryColor: number[];
    slug: string;
}

interface IPhotoMetaData {
    attribution: string;
    country: string;
    earthLink: string;
    earthLinkTitle: string;
    hue: number;
    id: string;
    lat: number;
    lng: number;
    mapsLink: string;
    mapsLinkTitle: string;
    name: string;
    nextSlug: string;
    photoUrl: string;
    prevSlug: string;
    primaryColor: number[];
    region: string;
    shareUrl: string;
    slug: string;
    thumbUrl: string;
    title: string;
}
