import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { GlobalProvider } from './global-provider';

@Injectable()
export class GeneralProvider {

	private serverURL: String;

	constructor(
		public http: Http,
		private globalProvider: GlobalProvider
	) {
		this.serverURL = this.globalProvider.getServerURL();
	}

	public postFeedback(feedback): Promise<Response> {
		return this.http.post(`${this.serverURL}general/feedback`, { feedback: feedback }).toPromise();
	}

}
