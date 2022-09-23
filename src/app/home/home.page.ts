import { Component } from '@angular/core';
import {
  Filesystem,
  FilesystemDirectory,
  FilesystemEncoding,
} from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { HttpClient, HttpEventType } from '@angular/common/http';

export const FILE_KEY = 'files';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  myFiles = [];
  downloadProgress = 0;

  constructor(private fileOpener: FileOpener, private http: HttpClient) {
    this.loadFiles();
  }

  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  private getMimetype(name) {
    if (name.indexOf('pdf') >= 0) {
      return 'application/pdf';
    } else if (name.indexOf('jpeg')) {
      return 'image/jpeg';
    } else if (name.indexOf('mp4')) {
      return 'video/mp4';
    }
  }

  async loadFiles() {
    const videoList = await Storage.get({ key: FILE_KEY });
    this.myFiles = JSON.parse(videoList.value) || [];
  }

  // downloadFile() {
  //   const imgUrl =
  //     'https://file-examples.com/storage/fe8706f33862a362898ceed/2017/10/file-sample_150kB.pdf';
  //   this.http
  //     .get(imgUrl, {
  //       responseType: 'blob',
  //       reportProgress: true,
  //       observe: 'events',
  //     })
  //     .subscribe(async (event) => {
  //       if (event.type === HttpEventType.DownloadProgress) {
  //         this.downloadProgress = Math.round(
  //           (100 * event.loaded) / event.total
  //         );
  //       } else if (event.type === HttpEventType.Response) {
  //         this.downloadProgress = 0;

  //         const name = imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
  //         const base64 = (await this.convertBlobToBase64(event.body)) as string;

  //         const savedFile = await Filesystem.writeFile({
  //           path: name,
  //           data: base64,
  //           directory: Directory.Documents,
  //         });

  //         const path = savedFile.uri;
  //         const mimeType = this.getMimetype(name);

  //         this.fileOpener
  //           .open(path, mimeType)
  //           .then(() => console.log('File is opened', path))
  //           .catch((error) => console.log('Error opening file', error));

  //         this.myFiles.unshift(path);

  //         Storage.set({
  //           key: FILE_KEY,
  //           value: JSON.stringify(this.myFiles),
  //         });
  //       }
  //     });
  // }

  async downloadFile() {
    const url =
      'https://file-examples.com/storage/fe651bd80a632c9aa9a0f1d/2017/10/file_example_JPG_100kB.jpg';
    const fileName = url.split('/').pop();
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: url,
        directory: FilesystemDirectory.Data,
        encoding: FilesystemEncoding.UTF8,
      });
      console.log('file Downloaded', result);
    } catch (e) {
      console.error('Unable to write file', e);
    }
  }
}
