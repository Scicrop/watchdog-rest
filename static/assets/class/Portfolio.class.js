class Portfolio {
	constructor(jwt) {
		this.url_api = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/v1`;
		this.jwt = jwt;
	}
	async insertPortfolio(ref_name,geojson, monitoring, value,html, tag, category_id){
		let data = await (await (fetch(`${this.url_api}/portfolio/`, {
			method: 'POST',
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({refName : ref_name, geojson: geojson, monitoring: monitoring, value: value, html: html, tag: tag, category: {id : category_id}})

		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async updatePortfolio(id, ref_name, monitoring, value, tag, category_id){
		let data = await (await (fetch(`${this.url_api}/portfolio/${id}`, {
			method: 'PUT',
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({refName : ref_name, monitoring: monitoring, value: value, tag: tag, category: {id : category_id}})

		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async deletePortfolio(id){
		let data = await (await (fetch(`${this.url_api}/portfolio/${id}`, {
			method: 'DELETE',
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};


	async insertCategory(description,user_id){
		let data = await (await (fetch(`${this.url_api}/portfolio/category/`, {
			method: 'POST',
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({description : description, user: {id:user_id}})

		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async updateCategory(id, description,user_id){
		let data = await (await (fetch(`${this.url_api}/portfolio/category/${id}`, {
			method: 'PUT',
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({description : description, user: {id:user_id}})

		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async deleteCategory(id){
		let data = await (await (fetch(`${this.url_api}/portfolio/category/${id}`, {
			method: 'DELETE',
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listCategory(){
		let data = await (await (fetch(`${this.url_api}/portfolio/category/`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listPortfolioById(id){
		let data = await (await (fetch(`${this.url_api}/portfolio/${id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listPortfolio(){
		let data = await (await (fetch(`${this.url_api}/portfolio/`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listPortfolioIntersectsAreaByGeojson(geojson){
		let data = await (await (fetch(`${this.url_api}/portfolio/intersects/`, {
			method: 'POST',
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(geojson)
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

};
