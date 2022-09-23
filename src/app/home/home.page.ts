import { Component } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Platform, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Media, } from '@capacitor-community/media';

const IMAGE_DIR = 'stored-images';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  myFiles = [];
  downloadProgress = 0;
  private album = null;

  constructor(private platform: Platform, private fileOpener: FileOpener, 
    private http: HttpClient) {
    this.album = this.platform.is('ios') ? 'album.identifier' : 'album.name';
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

  async downloadFile() {
    const urlPhoto = new URL('https://tesla-cdn.thron.com/delivery/public/image/tesla/03e533bf-8b1d-463f-9813-9a597aafb280/bvlatuR/std/4096x2560/M3-Homepage-Desktop-LHD.jpg');
    this.saveImage2(urlPhoto);
  }

  async saveImage(photo: URL) {
    const base64Data = await this.readAsBase64(photo);
    console.log(base64Data);
    const fileName = new Date().getTime() + '.jpeg';
    await Filesystem.writeFile({
      directory: Directory.Library,
      path: fileName,
      data: base64Data
    });
  }

  async saveImage2(photo: URL) {
    const fileName = new Date().getTime() + '.jpeg';
    const album = this.platform.is('ios') ? this.album.identifier : this.album.name;
    const savePhotoResult = await Media.savePhoto({
      path: 'https://tesla-cdn.thron.com/delivery/public/image/tesla/03e533bf-8b1d-463f-9813-9a597aafb280/bvlatuR/std/4096x2560/M3-Homepage-Desktop-LHD.jpg',
      album: album 
    });
  }

  async readAsBase64(photo: URL) {
      const response = await fetch(photo);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    
  }
}
