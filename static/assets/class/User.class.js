class User {
	constructor(jwt) {
		this.url_api = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/v1`;
		this.jwt = jwt;
	}

	async listUser(){
		let data = await (await (fetch(`${this.url_api}/user/`, {
					headers: {
						"Authorization":  `Bearer  ${this.jwt}`,
						'Content-Type': 'application/json'
					}
				}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async insertUser(user){
		let data = await (await (fetch(`${this.url_api}/user/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)

		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async getJWTByEmailPassword(user){
		let data = await (await (fetch(`${this.url_api}/user/auth/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)

		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

};
