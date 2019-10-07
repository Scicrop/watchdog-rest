class Province {
	constructor(jwt) {
		this.url_api = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/v1`;
		this.jwt = jwt;
	}
	async listProvince(){
		let data = await (await (fetch(`${this.url_api}/province/`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};


	async listSimpleProvince(){
		let data = await (await (fetch(`${this.url_api}/province/simple/`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listProvinceIntersectsAreaByGeojson(geojson,country_id){
		let data = await (await (fetch(`${this.url_api}/province/intersects/${ (() => {
				if(country_id == undefined) {return ``;} else {return `?country=${country_id}`;}
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

	async listProvinceByRadiusLatLng(km,lat,lng){
		let data = await (await (fetch(`${this.url_api}/province/radius/${km}/${lat}/${lng}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};


	async listProvinceById(id){
		let data = await (await (fetch(`${this.url_api}/province/${id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};
};
