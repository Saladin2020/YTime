import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
//import { Device } from "@ionic-native/device"; /*my*/
import { Storage } from "@ionic/storage"; /*my*/
import { AlertController, LoadingController } from "ionic-angular"; /*my*/
import { ServiceapiProvider } from "../../providers/serviceapi/serviceapi"; /*my*/

import { HomePage } from "../home/home";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  token: any;
  urlAPI: string;
  udidNum: any;
  userForm: any = {};
  items: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    /* private device: Device,*/
    private storage: Storage,
    private alertCtrl: AlertController,
    public serviceAPI: ServiceapiProvider,
    public events: Events,
    public loadingController: LoadingController
  ) {
    this.getAllow();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }

  async get_urlapi() {
    let val = await this.storage.get("urlapi");
    this.urlAPI = val;
  }

  async set_urlapi(data: string) {
    let val = await this.storage.set("urlapi", data);
    val = await this.storage.get("urlapi");
    this.urlAPI = val;
    /*this.storage.set("urlapi", data).then(() => {
      this.storage.get("urlapi").then(val => {
        this.urlAPI = val;
      });
    });*/
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: "ตั้งค่า",
      inputs: [
        {
          name: "IP",
          placeholder: "URL API SERVER",
          value: this.urlAPI
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Save",
          handler: data => {
            this.set_urlapi(data.IP);
          }
        }
      ]
    });
    alert.present();
  }

  loginSend() {
    let ld = this.loadingController.create({
      content: "Please wait..."
    });
    ld.present();
    if (this.userForm.usr == null || this.userForm.pwd == null) {
      ld.dismiss();
      this.loginFailAlert("โปรดกรอกข้อมูล", "ชื่อผู้ใช้/รหัสผ่าน ก่อนเข้าระบบ");
    } else {
      this.serviceAPI.setBaseURL(this.urlAPI);
      this.serviceAPI.setLoginData(this.userForm).subscribe(result => {
        this.items = result;
        if (this.items.status == "allow") {
          ld.dismiss();
          console.log(this.items.status);
          this.setToken(this.items);
          this.events.publish("user:login");
          this.navCtrl.setRoot(HomePage);
        } else {
          ld.dismiss();
          this.loginFailAlert("โปรดตรวจสอบ", "ชื่อผู้ใช้/รหัสผ่าน ให้ถูกต้อง");
        }
        console.log(result);
      },(err)=>{
        ld.dismiss();
          this.loginFailAlert("โปรดตรวจสอบการเชื่อมต่อของท่าน", "การเชื่อม Internet หรือ URL API SERVER");
      });
    }
  }

  loginFailAlert(status: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: status,
      subTitle: msg,
      buttons: ["ok"]
    });
    alert.present();
  }

  async setToken(tokenValue: string) {
    let val = await this.storage.set("token", tokenValue);
    val = await this.storage.get("token");
    this.token = val;
    console.log(this.token);
  }

  async getAllow() {
    console.log(1);
    let val = await this.storage.get("token");
    this.token = val;
    console.log(this.token);
    if (this.token == null) {
      this.get_urlapi();
    } else {
      this.events.publish("user:login");
      this.navCtrl.setRoot(HomePage);
    }
  }
}
