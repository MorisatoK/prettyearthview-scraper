export interface IPhotosJson {
    hue: number;
    lat: number;
    lng: number;
    primaryColor: number[];
    slug: string;
}

export interface IPhotoMetaData {
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
