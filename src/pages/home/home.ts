import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { ServiceapiProvider } from "../../providers/serviceapi/serviceapi"; /*my*/
import { Storage } from "@ionic/storage"; /*my*/

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  //selectedItem: any;
  //icons: string[];
  //items: Array<{ title: string, note: string, icon: string }>;
  items: any;
  urlAPI: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public serviceAPI: ServiceapiProvider
  ) {
    this.get_urlapi();
  }


  async get_urlapi() {
    let val = await this.storage.get("urlapi");
    this.urlAPI = val;
    this.loadList();
  }

  loadList() {
    this.serviceAPI.setBaseURL(this.urlAPI);
    this.serviceAPI.getViewNewsAll().subscribe(result => {
      this.items = result;
      /* for (let i = 0; i < data.length; i++) {
        this.listProduct.push(data[i]);
      }*/
    });
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(HomePage, {
      item: item
    });
  }
}
