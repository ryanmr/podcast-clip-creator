import {parseBlob, IAudioMetadata} from "music-metadata-browser";
import { IPicture } from "music-metadata/lib/type";
import slugify from '@sindresorhus/slugify';


export interface FileInfo {
  name: string;
  type: string;
  size: number;
}

export function getFileInfo(file: File) {
  const  {name, size, type} = file;
  const info: FileInfo = {name, size, type};
  return info;
}

export function getMetadataFromMediaFile(blob: Blob) {
  return parseBlob(blob);
}

export function getAlbumArtData(metadata: IAudioMetadata) {
  const pictures = metadata.common.picture;
  if (!pictures || pictures.length === 0) { throw Error("no album art available"); }

  const picture = pictures[0];
  return picture;
}

export async function getAlbumArtImage(picture: IPicture) {
  const {data, format} = picture;

  const blob = new Blob([data], { type: format });
  const imageUrl = URL.createObjectURL(blob);

  const image = await getImage(imageUrl);
  
  return image;
}

function getImage(url: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = url;
  return new Promise((rv, rj) => {
    image.onload = () => {
      return rv(image);
    };
  });
}

export function getSafeFilename(filename: string) {
  return slugify(filename);
}