class GenericGeom {
	constructor(jwt) {
		this.url_api = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/v1`;
		this.jwt = jwt;
	}
	async listGenericGeom(page){
		let data = await (await (fetch(`${this.url_api}/generic_geom/${ (() => {
				if(page == undefined) {return ``;} else {return `?page=${page}`;}
				})()}`, {
					headers: {
						"Authorization":  `Bearer  ${this.jwt}`,
						'Content-Type': 'application/json'
					}
				}).then(res => { return res.json() }).catch(err => {throw(err);}) ));
		return data
	};

	async listGenericGeomByRadiusLatLng(km,lat,lng,city_id,generic_type_id){
		let data = await (await (fetch(`${this.url_api}/generic_geom/radius/${km}/${lat}/${lng}${ (() => {
				if(city_id == undefined) {return ``;} else {return `?city=${city_id}`;}
				})()}${ (() => {
				if(generic_type_id != undefined && city_id == undefined) {return `?generic_type_id=${generic_type_id}`;} else {return ``;}
				})()}${ (() => {
				if(generic_type_id != undefined && city_id != undefined) {return `&generic_type_id=${generic_type_id}`;} else {return ``;}
				})()}`, {
					headers: {
						"Authorization":  `Bearer  ${this.jwt}`,
						'Content-Type': 'application/json'
					}
				}).then(res => { return res.json() }).catch(err => { throw(err);}) ));
		console.log(data);
		return data
	};


	async listGenericGeomByCityId(city_id){
		let data = await (await (fetch(`${this.url_api}/generic_geom/city/${city_id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => { return res.json() }).catch(err => { throw(err);}) ));
		return data
	};

	async listGenericGeomIntersectsAreaByGeojson(geojson,generic_type_id,city_id){
		let data = await (await (fetch(`${this.url_api}/generic_geom/intersects/${ (() => {
				if(city_id == undefined) {return ``;} else {return `?city=${city_id}`;}
				})()}${ (() => {
				if(generic_type_id != undefined && city_id == undefined) {return `?generic_type_id=${generic_type_id}`;} else {return ``;}
				})()}${ (() => {
				if(generic_type_id != undefined && city_id != undefined) {return `&generic_type_id=${generic_type_id}`;} else {return ``;}
				})()}`, {
			method: 'POST',
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(geojson)

		}).then(res => { return res.json() }).catch(err => {throw(err);}) ));
		return data
	};


	async listGenericGeomById(id){
		let data = await (await (fetch(`${this.url_api}/generic_geom/${id}`, {
			headers: {
				"Authorization":  `Bearer  ${this.jwt}`,
				'Content-Type': 'application/json'
			}
		}).then(res => { return res.json() }).catch(err => {  throw(err);}) ));
		return data
	};
};

//GenericGeom.listGenericGeom().then( res => {console.log(res)});
//GenericGeom.listGenericGeom(2).then( res => {console.log(res)});
//GenericGeom.listGenericGeomByCityId(2835).then( res => {console.log(res)}).catch(err => {  console.log('Error: ', err) });
//GenericGeom.listGenericGeomById(12).then( res => {console.log(res)}).catch(err => {  console.log('Error: ', err) });
//GenericGeom.listGenericGeomByRadiusLatLng(5,-44.108734130859375,-20.173922931901977).then( res => {console.log(res)}).catch(err => {  console.log('Error: ', err) });
//GenericGeom.listGenericGeomByRadiusLatLng(5,-44.108734130859375,-20.173922931901977,2835).then( res => {console.log(res)}).catch(err => {  console.log('Error: ', err) });
