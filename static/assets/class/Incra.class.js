class Incra {
	constructor(jwt) {
		this.url_api = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/v1`;
		this.jwt = jwt;
	}
	async listIncra(page){
		let data = await (await (fetch(`${this.url_api}/incra/${ (() => {
				if(page == undefined) {return ``;} else {return `?page=${page}`;}
				})()}`, {
					headers: {
						"Authorization":  `Bearer  ${this.jwt}`,
						'Content-Type': 'application/json'
					}
				}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listIncraIntersectsAreaByGeojson(geojson,city_id){
		let data = await (await (fetch(`${this.url_api}/incra/intersects/${ (() => {
				if(city_id == undefined) {return ``;} else {return `?city=${city_id}`;}
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

	async listIncraByRadiusLatLng(km,lat,lng,city_id){
		let data = await (await (fetch(`${this.url_api}/incra/radius/${km}/${lat}/${lng}${ (() => {
				if(city_id == undefined) {return ``;} else {return `?city=${city_id}`;}
				})()}`, {
					headers: {
						"Authorization":  `Bearer  ${this.jwt}`,
						'Content-Type': 'application/json'
					}
				}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};


	async listIncraByCityId(city_id){

		let data = await (await (fetch(`${this.url_api}/incra/city/${city_id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listIncraByCityDadosRegistrais(city_id,search){
		let data = await (await (fetch(`${this.url_api}/incra/search/${city_id}/${search}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listIncraById(id){
		let data = await (await (fetch(`${this.url_api}/incra/${id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};
};
