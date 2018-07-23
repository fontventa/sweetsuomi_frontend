import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { LoadingComponent } from '../../components/loading/loading';
import { GlobalProvider } from '../../providers/global-provider';
import { MenuProvider } from '../../providers/menu-provider';
import { OrderProvider } from '../../providers/order-provider';

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  private cloudFrontURL: String;
	private order;

  constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private toastCtrl: ToastController,
		private loading: LoadingComponent,
		private globalProvider: GlobalProvider,
		private alertCtrl: AlertController,
		private menuProvider: MenuProvider,
		private orderProvider: OrderProvider
	) {}

  ionViewDidLoad() {
		this.loading.createAnimation('Cargando pedido...');
		this.cloudFrontURL = this.globalProvider.getCloudFrontUrl();
		this.order = this.orderProvider.getSpecificOrder(this.navParams.get('order'));
		this.loading.stopAnimation();
		this.checkUpdate()
	}
	
	setToastMessage(message) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'top'
		});
		toast.present();
	}
	
	checkUpdate() {
		var tzoffset = (new Date()).getTimezoneOffset() * 60000;
		var date2 = (new Date(Date.now() - tzoffset));		
		var date1 = new Date(this.order.date)
		var timeDiff = (date1.getTime() - date2.getTime()) / (1000 * 3600);
		if (timeDiff > 1) {
			return true;
		}
		return false;
	}
	
	deleteOrder() {
		// let prompt = this.alertCtrl.create({
		// 	title: 'Eliminar pedido',
		// 	message: "¿Estás seguro que quieres eliminar el pedido?",
		// 	buttons: [{
		// 		text: 'Cancelar'
		// 	}, {
		// 		text: 'Aceptar',
		// 		handler: data => {
		// 			this.loading.createAnimation('Eliminando pedido...');
		// 			this.orderProvider.deleteOrder(this.order)
		// 				.then(() => {
		// 					const date = new Date().toISOString().split('T')[0];
		// 					return this.menuProvider.getMenu(date);
		// 				}).then(data => {
		// 					return this.menuProvider.filterGroupByCategory();
		// 				}).then(() => {
		// 					this.loading.stopAnimation();
		// 					this.navCtrl.pop();
		// 				}).catch(error => {
		// 					this.setToastMessage(error.message);
		// 					this.loading.stopAnimation();
		// 				});
		// 		}
		// 	}]
		// });
		// prompt.present();
	}
	
	updateOrder() {
		// let prompt = this.alertCtrl.create({
		// 	title: 'Modificar pedido',
		// 	message: "¿Estás seguro que quieres modificar el pedido? Si lo modificas, tienes que salvar los cambios antes de cerrar tu aplicación. De lo contrario, tu pedido podría ser borrado.",
		// 	buttons: [{
		// 		text: 'Cancelar'
		// 	}, {
		// 		text: 'Aceptar',
		// 		handler: data => {
		// 			this.loading.createAnimation('Modificando pedido...');
		// 			this.orderProvider.updateOrder(this.order)
		// 				.then(() => {
		// 					const date = new Date().toISOString().split('T')[0];
		// 					return this.menuProvider.getMenu(date);
		// 				}).then(() => {
		// 					return this.menuProvider.filterGroupByCategory();
		// 				}).then(() => {
		// 					return this.orderProvider.recreateMenuDeleted(this.order);
		// 				}).then(() => {
		// 					this.loading.stopAnimation();
		// 					this.navCtrl.setRoot('HomePage');
		// 				}).catch(error => {
		// 					this.setToastMessage(error.message);
		// 					this.loading.stopAnimation();
		// 				});
		// 		}
		// 	}]
		// });
		// prompt.present();
	}

}