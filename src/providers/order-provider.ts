import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { GlobalProvider } from './global-provider';
import { AuthProvider } from './auth-provider';

@Injectable()
export class OrderProvider {
	
	serverURL: String;
	order: any;
	price: number;
	orderList: any;
	
	constructor(
		private http: Http,
		private globalProvider: GlobalProvider,
		private authProvider: AuthProvider
	) {
		this.serverURL = this.globalProvider.getServerURL();
		this.newOrder();
	}

	newOrder() {
		this.order = {
			orderDish: [],
			quantity: 0,
		};
		this.price = 0;
	}
	
	addDishToOrder(dish, quantity) {
		this.order.orderDish[dish._id] = {
			dish: dish,
			quantity: quantity
		};
	}

	removeDishFromOrder(dishId) {
		if (this.order.orderDish[dishId]) {
			delete this.order.orderDish[dishId];
		}
	}
	
	getOrderMenuResume() {
		const resume = {
			quantity: 0,
			price: 0
		};
		for (let element in this.order.orderDish) {
			resume.quantity += this.order.orderDish[element].quantity;
			resume.price += this.order.orderDish[element].dish.price * this.order.orderDish[element].quantity;
		}
		this.price = resume.price;
		return resume;
	}

	getDishQuantity(dishId) {
		if (this.order.orderDish[dishId]) {
			return this.order.orderDish[dishId].quantity;
		}
		return 0;
	}

	resetOrder() {
		this.newOrder();
		return Promise.resolve();
	}
	




	formatDate() {
		var tzoffset = (new Date()).getTimezoneOffset() * 60000;
		
		var d = (new Date(Date.now() - tzoffset));
		d.setHours(Number(this.order.date.slice(0, -3)) + 1);
		d.setMinutes(Number(this.order.date.slice(3, 5)));
		this.order.date = d.toISOString();
		return d;
	}
	
	postOrder() {
		return this.order.validations().then(() => {
			return this.authProvider.getCredentials();
		}).then(response => {
			const params = {
				order: this.order.orderDish,
				date: this.formatDate(),
				note: this.order.note
			};
			return this.http.post(
				`${this.serverURL}order`,
				params,
				this.requestHeaders(response.token)
			).toPromise();
		}).catch(e => {
			if (e) {
				throw new Error(e.message);
			}
		});
	}
	
	public getOrderList(date) {
		return this.authProvider.getCredentials().then(response => {
			return this.http.get(
				`${this.serverURL}order/all?date=${date}`,
				this.requestHeaders(response.token)
			).toPromise();
		}).then((response: Response) => {
			const orders = response.json().orderList;
			const dishList = response.json().dishes;
			this.orderList = {};
			for (let i = 0; i < orders.length; i += 1) {
				this.orderList[orders[i]._id] = orders[i];
				this.orderList[orders[i]._id].price = 0;
				this.orderList[orders[i]._id].dishes = [];
				for (let j = 0; j < dishList.length; j += 1) {
					if (dishList[j].orderId === orders[i]._id) {
						this.orderList[orders[i]._id].dishes.push(dishList[j]);
						this.orderList[orders[i]._id].price += dishList[j].quantity * dishList[j].dish.price
					}
				}
			}
			return this.orderList;
		}).catch(e => {
			return Promise.reject(new Error(e.json().msg));
		});
	}
	
	
	public getUserOrderList(date) {
		return this.authProvider.getCredentials().then(response => {
			return this.http.get(
				`${this.serverURL}order/list?date=${date}`,
				this.requestHeaders(response.token)
			).toPromise();
		}).then((response: Response) => {
			const orders = response.json().orderList;
			const dishList = response.json().dishes;
			this.orderList = {};
			for (let i = 0; i < orders.length; i += 1) {
				this.orderList[orders[i]._id] = orders[i];
				this.orderList[orders[i]._id].price = 0;
				this.orderList[orders[i]._id].dishes = [];
				for (let j = 0; j < dishList.length; j += 1) {
					if (dishList[j].orderId === orders[i]._id) {
						this.orderList[orders[i]._id].dishes.push(dishList[j]);
						this.orderList[orders[i]._id].price += dishList[j].quantity * dishList[j].dish.price
					}
				}
			}
			return this.orderList;
		}).catch(e => {
			return Promise.reject(new Error(e.json().msg));
		});
	}
	
	public getSpecificOrder(key) {
		return this.orderList[key];
	}
	
	public deleteAdminOrder(key) {
		return this.authProvider.getCredentials().then(response => {
			return this.http.delete(
				`${this.serverURL}order/force?orderId=${this.orderList[key]._id}&user_id=${this.orderList[key].user._id}`,
				this.requestHeaders(response.token)
			).toPromise();
		}).catch(e => {
			return Promise.reject(new Error(e.json().msg));
		});
	}
	
	public acceptOrder(key) {
		return this.authProvider.getCredentials().then(response => {
			return this.http.put(
				`${this.serverURL}order/deliver`,
				JSON.stringify({ orderId: this.orderList[key]._id }),
				this.requestHeaders(response.token)
			).toPromise();
		}).catch(e => {
			return Promise.reject(new Error(e.json().msg));
		});
	}
	
	public deleteOrder(order) {
		return this.authProvider.getCredentials().then(response => {
			return this.http.delete(
				`${this.serverURL}order?orderId=${order._id}&date=${order.date}`,
				this.requestHeaders(response.token)
			).toPromise();
		}).catch(e => {
			return Promise.reject(new Error(e.json().msg));
		});
	}
	
	public updateOrder(order) {
		return this.authProvider.getCredentials().then(response => {
			return this.http.delete(
				`${this.serverURL}order?orderId=${order._id}&date=${order.date}`,
				this.requestHeaders(response.token)
			).toPromise();
		}).catch(e => {
			return Promise.reject(new Error(e.json().msg));
		});
	}
	
	public recreateMenuDeleted(order) {
		for (let i = 0; i < order.dishes.length; i += 1) {
			this.addDishToOrder(order.dishes[i].dish, order.dishes[i].quantity);
		}
		console.log(this.order);
	}
	
	private requestHeaders(token): RequestOptions {
		let headers = new Headers({ 'Authorization': 'Bearer ' + token });
    headers.append('Content-Type', 'application/json');
		return new RequestOptions({ headers: headers });
	}
}