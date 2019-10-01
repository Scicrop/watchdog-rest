class City {
	constructor(jwt) {
		this.url_api = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/v1`;
		this.jwt = jwt;
	}
	async listCity(page){
		let data = await (await (fetch(`${this.url_api}/city/${ (() => {
				if(page == undefined) {return ``;} else {return `?page=${page}`;}
				})()}`, {
					headers: {
						"Authorization":  `Bearer  ${this.jwt}`,
						'Content-Type': 'application/json'
					}
				}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listCityIntersectsAreaByGeojson(geojson,province_id){
		let data = await (await (fetch(`${this.url_api}/city/intersects/${ (() => {
				if(province_id == undefined) {return ``;} else {return `?province=${province_id}`;}
				})()}`, {
					method: 'POST',
					headers: {
						"Authorization":  `Bearer  ${this.jwt}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(geojson)
				}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listCityByRadiusLatLng(km,lat,lng){
		let data = await (await (fetch(`${this.url_api}/city/radius/${km}/${lat}/${lng}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};


	async listCityById(id){
		let data = await (await (fetch(`${this.url_api}/city/${id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listCityByProvinceId(province_id){
		let data = await (await (fetch(`${this.url_api}/city/province/${province_id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listSimpleCityByProvinceId(province_id){
		let data = await (await (fetch(`${this.url_api}/city/simple/province/${province_id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};
};
