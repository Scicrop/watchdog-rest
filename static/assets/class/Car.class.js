class Car {
	constructor(jwt) {
		this.url_api = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/v1`;
		this.jwt = jwt;
	}
	async listCar(page){
		let data = await (await (fetch(`${this.url_api}/car/${ (() => {
				if(page == undefined) {return ``;} else {return `?page=${page}`;}
				})()}`, {
					headers: {
						"Authorization":  `Bearer  ${this.jwt}`,
						'Content-Type': 'application/json'
					}
				}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listCarIntersectsAreaByGeojson(geojson,city_id){
		let data = await (await (fetch(`${this.url_api}/car/intersects/${ (() => {
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

	async listCarByRadiusLatLng(km,lat,lng,city_id){
		let data = await (await (fetch(`${this.url_api}/car/radius/${km}/${lat}/${lng}${ (() => {
				if(city_id == undefined) {return ``;} else {return `?city=${city_id}`;}
				})()}`, {
					headers: {
						"Authorization":  `Bearer  ${this.jwt}`,
						'Content-Type': 'application/json'
					}
				}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listCarByCityId(city_id){
		let data = await (await (fetch(`${this.url_api}/car/city/${city_id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};

	async listCarById(id){
		let data = await (await (fetch(`${this.url_api}/car/${id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => {  if(res.status == 200){return res.json(); }else{ throw(res);} }).catch(err => {throw(err);	})	));
		return data
	};
};
