import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Storage } from "@ionic/storage"; /*my*/
import { Device } from "@ionic-native/device"; /*my*/
import { ServiceapiProvider } from "../../providers/serviceapi/serviceapi"; /*my*/

@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  urlAPI: string;
  udidNum: any;
  nidNum: string;
  list: any[] = [];
  date: any;
  items: any;
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public serviceAPI: ServiceapiProvider,
    private device: Device
  ) {
    this.get_urlapi();
    this.udidNum = this.device.uuid;
  }
  loadDateList() {
    let param = { user: this.udidNum, nid: this.nidNum };
    this.serviceAPI.setBaseURL(this.urlAPI);
    this.serviceAPI.getViewHistory(param).subscribe(result => {
      this.items = result;
      this.serviceAPI.getViewDateHistory(param).subscribe(data => {
        this.date = data;
        let dat: any[] = [];
        for (let i = 0; i < this.date.length; i++) {
          this.list[i] = [];
          this.list[i].date = this.date[i].chk_date;
          for (let j = 0; j < this.items.length; j++) {
            if (this.items[j].date == this.date[i].chk_date) {
              dat.push(this.items[j]);
            }
          }
          this.list[i].data = dat;
          dat = [];
        }
        console.log(this.list);
      });
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
    this.loadDateList();
    console.log(this.nidNum);
  }
}
