import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { QrPage } from '../pages/qr/qr';
import { ListPage } from '../pages/list/list';
import { AboutPage } from '../pages/about/about';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';/*my*/
import { HttpClientModule } from '@angular/common/http';/*my*/
import { IonicStorageModule } from '@ionic/storage';/*my*/
import { Device } from '@ionic-native/device';/*my*/
import { ServiceapiProvider } from '../providers/serviceapi/serviceapi';

import { Geolocation } from '@ionic-native/geolocation';/*my*/



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QrPage,
    ListPage,
    AboutPage
  ],
  imports: [
    HttpClientModule, /*my*/
    IonicStorageModule.forRoot(),/*my*/

    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QrPage,
    ListPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,/*my*/
    Device,/*my*/
    Geolocation,/*my*/
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ServiceapiProvider
  ]
})
export class AppModule { }
