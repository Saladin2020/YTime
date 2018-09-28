import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner"; /*my*/
import { AlertController, LoadingController } from "ionic-angular"; /*my*/
import { Storage } from "@ionic/storage"; /*my*/
import { Device } from "@ionic-native/device"; /*my*/
import { ServiceapiProvider } from "../../providers/serviceapi/serviceapi"; /*my*/
import { Geolocation } from "@ionic-native/geolocation"; /*my*/

/**
 * Generated class for the QrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-qr",
  templateUrl: "qr.html"
})
export class QrPage {
  urlAPI: string;
  udidNum: any;
  nidNum: string;

  options: BarcodeScannerOptions;
  scannedData: any = {};
  respondData: any = {};

  scanStatus: any = {};
  items: any;

  locationServer: any = {};

  latitudeP: any;
  longitudeP: any;

  distanceP: any;
  distanceInRange: any;

  constructor(
    public navCtrl: NavController,
    public scanner: BarcodeScanner,
    private alertCtrl: AlertController,
    private storage: Storage,
    public serviceAPI: ServiceapiProvider,
    private device: Device,
    private geolocation: Geolocation,
    public loadingController: LoadingController
  ) {
    this.get_urlapi();
    this.udidNum = this.device.uuid;
    //this.locationCheck();
    //this.scannedData = "as123"; // remove
  }

  loadPage() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  loadList() {
    let param = { user: this.udidNum, nid: this.nidNum };
    this.serviceAPI.setBaseURL(this.urlAPI);
    this.serviceAPI.getViewListScan(param).subscribe(result => {
      this.items = result;
    });
  }

  presentAlert(status: string, name: string, time: string, date: string) {
    let alert = this.alertCtrl.create({
      title: name + " | " + status,
      subTitle: "เช็คเวลา : " + time + " น.<br>วันที่ : " + date + "",
      buttons: ["ok"]
    });
    alert.present();
  }

  scanAlert(status: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: status,
      subTitle: msg,
      buttons: ["ok"]
    });
    alert.present();
  }

  presentConfirm(status: string) {
    let alert = this.alertCtrl.create({
      title: "ยืนยัน",
      message: "คุณยืนยันที่จะ",
      buttons: [
        {
          text: "ยกเลิก",
          role: "cancel",
          handler: () => {
            console.log("Cancel");
          }
        },
        {
          text: status,
          handler: () => {
            this.send();
            console.log("Scan");
          }
        }
      ] //,cssClass: 'alertCustomCss',
    });
    alert.present();
  }

  scan2() {
    this.options = {
      prompt: "Scan you barcode"
    };
    this.scanner.scan(this.options).then(
      data => {
        this.scannedData = data.text;
        this.locationCheck();
      },
      err => {
        console.log("Error :", err);
      }
    );
  }

  scan() {
    this.scannedData = "123";

    this.locationCheck();
  }

  /*async scan2() {
    this.options = {
      prompt: "Scan you barcode"
    };
    let scd = await this.scanner.scan(this.options);
    this.scannedData = scd.text;
    this.setRes();
  }*/

  setRes() {
    let param = {
      user: this.udidNum,
      qr: this.scannedData,
      nid: this.nidNum
    };

    this.serviceAPI.getViewStatusScan(param).subscribe(result => {
      this.scanStatus = result;

      if (this.scanStatus.message == "[001-IN]") {
        this.presentConfirm("แสกนเข้า");
      } else if (this.scanStatus.message == "[001-OUT]") {
        this.presentConfirm("แสกนออก");
      } else if (this.scanStatus.message == "[001-FULL]") {
        this.scanAlert("คุณได้เช็คชื่อออกแล้ว", "กรุณาเช็คครั้งต่อไป");
      } else if (this.scanStatus.message == "[002-QRCODE]") {
        this.scanAlert("ไม่สามารถเช็คได้", "กรุณาเช็ค QR CODE");
      } else if (this.scanStatus.message == "[003-UNREG]") {
        this.scanAlert("คุณยังไม่ได้ลงทะเบียน", "กรุณาลงทะเบียนก่อนทำการแสกน");
      } else if (this.scanStatus.message == "[004-SCAN_ANOTHER_DEVICE]") {
        this.scanAlert(
          "คุณไม่สามารถแสกนในเครื่องอื่นได้",
          "กรุณาทำการแสกนเครื่องที่คุณลงทะเบียน"
        );
      }
      console.log(result);
    });
  }

  send() {
    let param = { user: this.udidNum, qr: this.scannedData, nid: this.nidNum };
    this.serviceAPI.setScanData(param).subscribe(result => {
      this.respondData = result;
      this.loadList();
      console.log(result);
    });
  }

  async get_urlapi() {
    let val = await this.storage.get("urlapi");
    this.urlAPI = val;
    this.getProfile();
    console.log(this.urlAPI);
  }

  async getProfile() {
    let val = await this.storage.get("token");
    this.nidNum = val.nid;
    this.loadList();
    console.log(this.nidNum);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.loadPage();
      refresher.complete();
    }, 2000);
  }
  /*  ionViewDidLoad() {
      console.log('ionViewDidLoad QrPage');
    }*/

  currentLocation() {}

  locationCheck() {
    let ld = this.loadingController.create({
      content: "Please wait..."
    });
    ld.present();
    let param = { qr: this.scannedData };
    console.log(this.scannedData);
    this.serviceAPI.getLocationCheck(param).subscribe(
      result => {
        if (result[0] != null) {
          this.locationServer = result[0];
          this.distanceInRange = this.locationServer.cet_unit;
          //this.currentLocation();
          this.geolocation.getCurrentPosition().then(resp => {
            this.latitudeP = resp.coords.latitude;
            this.longitudeP = resp.coords.longitude;
            this.calculateDistance(
              this.locationServer.cet_latitude, //latitude server
              this.locationServer.cet_longitude, // logitude serve
              this.latitudeP, //latitude client
              this.longitudeP, //logitude client
              "meter" //unit
            );
            if (this.distanceP <= this.distanceInRange) {
              ld.dismiss();
              this.setRes();
            } else {
              ld.dismiss();
              this.scanAlert(
                "ไม่สามารถเช็คได้",
                "คุณไม่ได้อยู่ในพื้นที่ที่กำหนด"
              );
            }
          });
        } else {
          ld.dismiss();
          this.scanAlert("ไม่สามารถเช็คได้", "กรุณาเช็ค QR CODE");
        }

        console.log(this.locationServer);
        console.log(this.locationServer.cet_latitude);
        console.log(this.locationServer.cet_longitude);
        console.log(this.distanceP);
        console.log(this.distanceInRange);
      },
      err => {
        ld.dismiss();
        this.scanAlert("ไม่สามารถเช็คได้", "กรุณาเช็คสัญญานของคุณ");
      }
    );
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: string
  ) {
    let radlat1 = (Math.PI * lat1) / 180;
    let radlat2 = (Math.PI * lat2) / 180;
    let theta = lon1 - lon2;
    let radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    } else if (unit == "meter") {
      dist = dist * 1.609344 * 1000;
    } else if (unit == "N") {
      dist = dist * 0.8684;
    }
    this.distanceP = dist;
  }
}
