class Alert {
	constructor(jwt) {
		this.url_api = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/v1`;
		this.jwt = jwt;
	}
	async listAlert(page){
		let data = await (await (fetch(`${this.url_api}/alert/${ (() => {
				if(page == undefined) {return ``;} else {return `?page=${page}`;}
				})()}`, {
					headers: {
						"Authorization":  `Bearer  ${this.jwt}`,
						'Content-Type': 'application/json'
					}
				}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async check_fire(){
		let data = await (await (fetch(`${this.url_api}/alert/check_fire/`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listAlertById(id){
		let data = await (await (fetch(`${this.url_api}/alert/${id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listAlertByPortfolioId(portfolio_id){
		let data = await (await (fetch(`${this.url_api}/alert/portfolio/${portfolio_id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};
};
