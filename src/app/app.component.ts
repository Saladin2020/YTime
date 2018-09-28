import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";
import { QrPage } from "../pages/qr/qr";
import { ListPage } from "../pages/list/list";
import { AboutPage } from "../pages/about/about";

import { Device } from "@ionic-native/device"; /*my*/
import { Storage } from "@ionic/storage"; /*my*/
import { AlertController, LoadingController } from "ionic-angular"; /*my*/
import { ServiceapiProvider } from "../providers/serviceapi/serviceapi"; /*my*/

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = "LoginPage";

  pages: Array<{ title: string; component: any; iconlist: string }>;

  urlAPI: string;
  udidNum: string;
  nidNum: string;
  profileName: string;
  profileImage: string;
  token: any;
  sideShow: boolean;
  regist: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private device: Device,
    private alertCtrl: AlertController,
    private storage: Storage,
    public serviceAPI: ServiceapiProvider,
    public events: Events,
    public loadingController: LoadingController
  ) {
    this.sideShow = false;
    this.initializeApp();
    //this.getProfile();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: "หน้าหลัก", component: HomePage, iconlist: "home" },
      { title: "แสกน", component: QrPage, iconlist: "finger-print" },
      { title: "ประวัติการแสกน", component: ListPage, iconlist: "book" },
      { title: "เกี่ยวกับเรา", component: AboutPage, iconlist: "people" }
    ];

    events.subscribe("user:login", () => {
      this.sideShow = true;
      this.get_urlapi();
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
    this.profileName = val.fname + " " + val.lname;
    this.nidNum = val.nid;
    console.log(this.profileName);
    this.udidNum = this.device.uuid;
    this.profileImage = "assets/imgs/user.png";
  }

  //loadPage() {
  //this.navCtrl.setRoot(this.navCtrl.getActive().component);
  //}

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async destroyToken(tokenName: string) {
    await this.storage.remove(tokenName);
  }

  async clearToken() {
    await this.storage.clear();
  }

  logoutConfirm() {
    let alert = this.alertCtrl.create({
      title: "ออกจากระบบ",
      message: "คุณแน่ใจที่จะออกจากระบบ",
      buttons: [
        {
          text: "ยกเลิก",
          role: "cancel",
          handler: () => {
            console.log("Cancel");
          }
        },
        {
          text: "ตกลง",
          handler: () => {
            this.destroyToken("token");
            this.sideShow = false;
            this.nav.setRoot("LoginPage");
          }
        }
      ] //,cssClass: 'alertCustomCss',
    });
    alert.present();
  }

  registerConfirm() {
    let alert = this.alertCtrl.create({
      title: "ลงทะเบียน",
      message: "คุณยืนยันที่จะลงทะเบียน",
      buttons: [
        {
          text: "ยกเลิก",
          role: "cancel",
          handler: () => {
            console.log("Cancel");
          }
        },
        {
          text: "ยืนยัน",
          handler: () => {
            this.registerAlert(
              "ลงทะเบียนเรียบร้อยแล้ว",
              "คุณสามารถทำการแสกนได้แล้วค่ะ"
            );
            console.log("Scan");
          }
        }
      ] //,cssClass: 'alertCustomCss',
    });
    alert.present();
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  register() {
    let ld = this.loadingController.create({
      content: "Please wait..."
    });
    ld.present();
    let param = { nid: this.nidNum, uuid: this.udidNum };
    this.serviceAPI.setBaseURL(this.urlAPI);
    this.serviceAPI.setRegister(param).subscribe(
      result => {
        this.regist = result;
        if (this.regist.message == "[005-REGISTER]") {
          ld.dismiss();
          this.registerConfirm();
        } else if (this.regist.message == "[004-ALLREADYREG]") {
          ld.dismiss();
          this.registerAlert(
            "คุณเคยลงทะเบียนมาแล้ว",
            "หากต้องการเปลี่ยนเครื่องกรุณาติดต่อเจ้าหน้าที่"
          );
        } else if (this.regist.message == "[006-REGISTER_REPEAT]") {
          ld.dismiss();
          this.registerAlert(
            "เครื่องนี้ได้ลงทะเบียนชื่อผู้อื่นแล้ว",
            "กรุณาลงทะเบียนในเครื่องของคุณเอง"
          );
        } else {
          ld.dismiss();
        }
        console.log(this.regist);
      },
      err => {
        ld.dismiss();
        this.registerAlert(
          "โปรดตรวจสอบการเชื่อมต่อของท่าน",
          "การเชื่อมต่อ Internet"
        );
      }
    );
  }

  registerAlert(status: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: status,
      subTitle: msg,
      buttons: ["ok"]
    });
    alert.present();
  }
}
