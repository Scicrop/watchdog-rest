var toGeoJSON = (function() {
    'use strict';

    var removeSpace = /\s*/g,
        trimSpace = /^\s*|\s*$/g,
        splitSpace = /\s+/;
    // generate a short, numeric hash of a string
    function okhash(x) {
        if (!x || !x.length) return 0;
        for (var i = 0, h = 0; i < x.length; i++) {
            h = ((h << 5) - h) + x.charCodeAt(i) | 0;
        } return h;
    }
    // all Y children of X
    function get(x, y) { return x.getElementsByTagName(y); }
    function attr(x, y) { return x.getAttribute(y); }
    function attrf(x, y) { return parseFloat(attr(x, y)); }
    // one Y child of X, if any, otherwise null
    function get1(x, y) { var n = get(x, y); return n.length ? n[0] : null; }
    // https://developer.mozilla.org/en-US/docs/Web/API/Node.normalize
    function norm(el) { if (el.normalize) { el.normalize(); } return el; }
    // cast array x into numbers
    function numarray(x) {
        for (var j = 0, o = []; j < x.length; j++) { o[j] = parseFloat(x[j]); }
        return o;
    }
    // get the content of a text node, if any
    function nodeVal(x) {
        if (x) { norm(x); }
        return (x && x.textContent) || '';
    }
    // get the contents of multiple text nodes, if present
    function getMulti(x, ys) {
        var o = {}, n, k;
        for (k = 0; k < ys.length; k++) {
            n = get1(x, ys[k]);
            if (n) o[ys[k]] = nodeVal(n);
        }
        return o;
    }
    // add properties of Y to X, overwriting if present in both
    function extend(x, y) { for (var k in y) x[k] = y[k]; }
    // get one coordinate from a coordinate array, if any
    function coord1(v) { return numarray(v.replace(removeSpace, '').split(',')); }
    // get all coordinates from a coordinate array as [[],[]]
    function coord(v) {
        var coords = v.replace(trimSpace, '').split(splitSpace),
            o = [];
        for (var i = 0; i < coords.length; i++) {
            o.push(coord1(coords[i]));
        }
        return o;
    }
    function coordPair(x) {
        var ll = [attrf(x, 'lon'), attrf(x, 'lat')],
            ele = get1(x, 'ele'),
            // handle namespaced attribute in browser
            heartRate = get1(x, 'gpxtpx:hr') || get1(x, 'hr'),
            time = get1(x, 'time'),
            e;
        if (ele) {
            e = parseFloat(nodeVal(ele));
            if (!isNaN(e)) {
                ll.push(e);
            }
        }
        return {
            coordinates: ll,
            time: time ? nodeVal(time) : null,
            heartRate: heartRate ? parseFloat(nodeVal(heartRate)) : null
        };
    }

    // create a new feature collection parent object
    function fc() {
        return {
            type: 'FeatureCollection',
            features: []
        };
    }

    var serializer;
    if (typeof XMLSerializer !== 'undefined') {
        /* istanbul ignore next */
        serializer = new XMLSerializer();
    } else {
        var isNodeEnv = (typeof process === 'object' && !process.browser);
        var isTitaniumEnv = (typeof Titanium === 'object');
        if (typeof exports === 'object' && (isNodeEnv || isTitaniumEnv)) {
            serializer = new (require('xmldom').XMLSerializer)();
        } else {
            throw new Error('Unable to initialize serializer');
        }
    }
    function xml2str(str) {
        // IE9 will create a new XMLSerializer but it'll crash immediately.
        // This line is ignored because we don't run coverage tests in IE9
        /* istanbul ignore next */
        if (str.xml !== undefined) return str.xml;
        return serializer.serializeToString(str);
    }

    var t = {
        kml: function(doc) {

            var gj = fc(),
                // styleindex keeps track of hashed styles in order to match features
                styleIndex = {}, styleByHash = {},
                // stylemapindex keeps track of style maps to expose in properties
                styleMapIndex = {},
                // atomic geospatial types supported by KML - MultiGeometry is
                // handled separately
                geotypes = ['Polygon', 'LineString', 'Point', 'Track', 'gx:Track'],
                // all root placemarks in the file
                placemarks = get(doc, 'Placemark'),
                styles = get(doc, 'Style'),
                styleMaps = get(doc, 'StyleMap');

            for (var k = 0; k < styles.length; k++) {
                var hash = okhash(xml2str(styles[k])).toString(16);
                styleIndex['#' + attr(styles[k], 'id')] = hash;
                styleByHash[hash] = styles[k];
            }
            for (var l = 0; l < styleMaps.length; l++) {
                styleIndex['#' + attr(styleMaps[l], 'id')] = okhash(xml2str(styleMaps[l])).toString(16);
                var pairs = get(styleMaps[l], 'Pair');
                var pairsMap = {};
                for (var m = 0; m < pairs.length; m++) {
                    pairsMap[nodeVal(get1(pairs[m], 'key'))] = nodeVal(get1(pairs[m], 'styleUrl'));
                }
                styleMapIndex['#' + attr(styleMaps[l], 'id')] = pairsMap;

            }
            for (var j = 0; j < placemarks.length; j++) {
                gj.features = gj.features.concat(getPlacemark(placemarks[j]));
            }
            function kmlColor(v) {
                var color, opacity;
                v = v || '';
                if (v.substr(0, 1) === '#') { v = v.substr(1); }
                if (v.length === 6 || v.length === 3) { color = v; }
                if (v.length === 8) {
                    opacity = parseInt(v.substr(0, 2), 16) / 255;
                    color = '#' + v.substr(6, 2) +
                        v.substr(4, 2) +
                        v.substr(2, 2);
                }
                return [color, isNaN(opacity) ? undefined : opacity];
            }
            function gxCoord(v) { return numarray(v.split(' ')); }
            function gxCoords(root) {
                var elems = get(root, 'coord', 'gx'), coords = [], times = [];
                if (elems.length === 0) elems = get(root, 'gx:coord');
                for (var i = 0; i < elems.length; i++) coords.push(gxCoord(nodeVal(elems[i])));
                var timeElems = get(root, 'when');
                for (var j = 0; j < timeElems.length; j++) times.push(nodeVal(timeElems[j]));
                return {
                    coords: coords,
                    times: times
                };
            }
            function getGeometry(root) {
                var geomNode, geomNodes, i, j, k, geoms = [], coordTimes = [];
                if (get1(root, 'MultiGeometry')) { return getGeometry(get1(root, 'MultiGeometry')); }
                if (get1(root, 'MultiTrack')) { return getGeometry(get1(root, 'MultiTrack')); }
                if (get1(root, 'gx:MultiTrack')) { return getGeometry(get1(root, 'gx:MultiTrack')); }
                for (i = 0; i < geotypes.length; i++) {
                    geomNodes = get(root, geotypes[i]);
                    if (geomNodes) {
                        for (j = 0; j < geomNodes.length; j++) {
                            geomNode = geomNodes[j];
                            if (geotypes[i] === 'Point') {
                                geoms.push({
                                    type: 'Point',
                                    coordinates: coord1(nodeVal(get1(geomNode, 'coordinates')))
                                });
                            } else if (geotypes[i] === 'LineString') {
                                geoms.push({
                                    type: 'LineString',
                                    coordinates: coord(nodeVal(get1(geomNode, 'coordinates')))
                                });
                            } else if (geotypes[i] === 'Polygon') {
                                var rings = get(geomNode, 'LinearRing'),
                                    coords = [];
                                for (k = 0; k < rings.length; k++) {
                                    coords.push(coord(nodeVal(get1(rings[k], 'coordinates'))));
                                }
                                geoms.push({
                                    type: 'Polygon',
                                    coordinates: coords
                                });
                            } else if (geotypes[i] === 'Track' ||
                                geotypes[i] === 'gx:Track') {
                                var track = gxCoords(geomNode);
                                geoms.push({
                                    type: 'LineString',
                                    coordinates: track.coords
                                });
                                if (track.times.length) coordTimes.push(track.times);
                            }
                        }
                    }
                }
                return {
                    geoms: geoms,
                    coordTimes: coordTimes
                };
            }
            function getPlacemark(root) {
                var geomsAndTimes = getGeometry(root), i, properties = {},
                    name = nodeVal(get1(root, 'name')),
                    address = nodeVal(get1(root, 'address')),
                    styleUrl = nodeVal(get1(root, 'styleUrl')),
                    description = nodeVal(get1(root, 'description')),
                    timeSpan = get1(root, 'TimeSpan'),
                    timeStamp = get1(root, 'TimeStamp'),
                    extendedData = get1(root, 'ExtendedData'),
                    lineStyle = get1(root, 'LineStyle'),
                    polyStyle = get1(root, 'PolyStyle'),
                    visibility = get1(root, 'visibility');

                if (!geomsAndTimes.geoms.length) return [];
                if (name) properties.name = name;
                if (address) properties.address = address;
                if (styleUrl) {
                    if (styleUrl[0] !== '#') {
                        styleUrl = '#' + styleUrl;
                    }

                    properties.styleUrl = styleUrl;
                    if (styleIndex[styleUrl]) {
                        properties.styleHash = styleIndex[styleUrl];
                    }
                    if (styleMapIndex[styleUrl]) {
                        properties.styleMapHash = styleMapIndex[styleUrl];
                        properties.styleHash = styleIndex[styleMapIndex[styleUrl].normal];
                    }
                    // Try to populate the lineStyle or polyStyle since we got the style hash
                    var style = styleByHash[properties.styleHash];
                    if (style) {
                        if (!lineStyle) lineStyle = get1(style, 'LineStyle');
                        if (!polyStyle) polyStyle = get1(style, 'PolyStyle');
                        var iconStyle = get1(style, 'IconStyle');
                        if (iconStyle) {
                            var icon = get1(iconStyle, 'Icon');
                            if (icon) {
                                var href = nodeVal(get1(icon, 'href'));
                                if (href) properties.icon = href;
                            }
                        }
                    }
                }
                if (description) properties.description = description;
                if (timeSpan) {
                    var begin = nodeVal(get1(timeSpan, 'begin'));
                    var end = nodeVal(get1(timeSpan, 'end'));
                    properties.timespan = { begin: begin, end: end };
                }
                if (timeStamp) {
                    properties.timestamp = nodeVal(get1(timeStamp, 'when'));
                }
                if (lineStyle) {
                    var linestyles = kmlColor(nodeVal(get1(lineStyle, 'color'))),
                        color = linestyles[0],
                        opacity = linestyles[1],
                        width = parseFloat(nodeVal(get1(lineStyle, 'width')));
                    if (color) properties.stroke = color;
                    if (!isNaN(opacity)) properties['stroke-opacity'] = opacity;
                    if (!isNaN(width)) properties['stroke-width'] = width;
                }
                if (polyStyle) {
                    var polystyles = kmlColor(nodeVal(get1(polyStyle, 'color'))),
                        pcolor = polystyles[0],
                        popacity = polystyles[1],
                        fill = nodeVal(get1(polyStyle, 'fill')),
                        outline = nodeVal(get1(polyStyle, 'outline'));
                    if (pcolor) properties.fill = pcolor;
                    if (!isNaN(popacity)) properties['fill-opacity'] = popacity;
                    if (fill) properties['fill-opacity'] = fill === '1' ? properties['fill-opacity'] || 1 : 0;
                    if (outline) properties['stroke-opacity'] = outline === '1' ? properties['stroke-opacity'] || 1 : 0;
                }
                if (extendedData) {
                    var datas = get(extendedData, 'Data'),
                        simpleDatas = get(extendedData, 'SimpleData');

                    for (i = 0; i < datas.length; i++) {
                        properties[datas[i].getAttribute('name')] = nodeVal(get1(datas[i], 'value'));
                    }
                    for (i = 0; i < simpleDatas.length; i++) {
                        properties[simpleDatas[i].getAttribute('name')] = nodeVal(simpleDatas[i]);
                    }
                }
                if (visibility) {
                    properties.visibility = nodeVal(visibility);
                }
                if (geomsAndTimes.coordTimes.length) {
                    properties.coordTimes = (geomsAndTimes.coordTimes.length === 1) ?
                        geomsAndTimes.coordTimes[0] : geomsAndTimes.coordTimes;
                }
                var feature = {
                    type: 'Feature',
                    geometry: (geomsAndTimes.geoms.length === 1) ? geomsAndTimes.geoms[0] : {
                        type: 'GeometryCollection',
                        geometries: geomsAndTimes.geoms
                    },
                    properties: properties
                };
                if (attr(root, 'id')) feature.id = attr(root, 'id');
                return [feature];
            }
            return gj;
        },
        gpx: function(doc) {
            var i,
                tracks = get(doc, 'trk'),
                routes = get(doc, 'rte'),
                waypoints = get(doc, 'wpt'),
                // a feature collection
                gj = fc(),
                feature;
            for (i = 0; i < tracks.length; i++) {
                feature = getTrack(tracks[i]);
                if (feature) gj.features.push(feature);
            }
            for (i = 0; i < routes.length; i++) {
                feature = getRoute(routes[i]);
                if (feature) gj.features.push(feature);
            }
            for (i = 0; i < waypoints.length; i++) {
                gj.features.push(getPoint(waypoints[i]));
            }
            function initializeArray(arr, size) {
                for (var h = 0; h < size; h++) {
                    arr.push(null);
                }
                return arr;
            }
            function getPoints(node, pointname) {
                var pts = get(node, pointname),
                    line = [],
                    times = [],
                    heartRates = [],
                    l = pts.length;
                if (l < 2) return {};  // Invalid line in GeoJSON
                for (var i = 0; i < l; i++) {
                    var c = coordPair(pts[i]);
                    line.push(c.coordinates);
                    if (c.time) times.push(c.time);
                    if (c.heartRate || heartRates.length) {
                        if (!heartRates.length) initializeArray(heartRates, i);
                        heartRates.push(c.heartRate || null);
                    }
                }
                return {
                    line: line,
                    times: times,
                    heartRates: heartRates
                };
            }
            function getTrack(node) {
                var segments = get(node, 'trkseg'),
                    track = [],
                    times = [],
                    heartRates = [],
                    line;
                for (var i = 0; i < segments.length; i++) {
                    line = getPoints(segments[i], 'trkpt');
                    if (line) {
                        if (line.line) track.push(line.line);
                        if (line.times && line.times.length) times.push(line.times);
                        if (heartRates.length || (line.heartRates && line.heartRates.length)) {
                            if (!heartRates.length) {
                                for (var s = 0; s < i; s++) {
                                    heartRates.push(initializeArray([], track[s].length));
                                }
                            }
                            if (line.heartRates && line.heartRates.length) {
                                heartRates.push(line.heartRates);
                            } else {
                                heartRates.push(initializeArray([], line.line.length || 0));
                            }
                        }
                    }
                }
                if (track.length === 0) return;
                var properties = getProperties(node);
                extend(properties, getLineStyle(get1(node, 'extensions')));
                if (times.length) properties.coordTimes = track.length === 1 ? times[0] : times;
                if (heartRates.length) properties.heartRates = track.length === 1 ? heartRates[0] : heartRates;
                return {
                    type: 'Feature',
                    properties: properties,
                    geometry: {
                        type: track.length === 1 ? 'LineString' : 'MultiLineString',
                        coordinates: track.length === 1 ? track[0] : track
                    }
                };
            }
            function getRoute(node) {
                var line = getPoints(node, 'rtept');
                if (!line.line) return;
                var prop = getProperties(node);
                extend(prop, getLineStyle(get1(node, 'extensions')));
                var routeObj = {
                    type: 'Feature',
                    properties: prop,
                    geometry: {
                        type: 'LineString',
                        coordinates: line.line
                    }
                };
                return routeObj;
            }
            function getPoint(node) {
                var prop = getProperties(node);
                extend(prop, getMulti(node, ['sym']));
                return {
                    type: 'Feature',
                    properties: prop,
                    geometry: {
                        type: 'Point',
                        coordinates: coordPair(node).coordinates
                    }
                };
            }
            function getLineStyle(extensions) {
                var style = {};
                if (extensions) {
                    var lineStyle = get1(extensions, 'line');
                    if (lineStyle) {
                        var color = nodeVal(get1(lineStyle, 'color')),
                            opacity = parseFloat(nodeVal(get1(lineStyle, 'opacity'))),
                            width = parseFloat(nodeVal(get1(lineStyle, 'width')));
                        if (color) style.stroke = color;
                        if (!isNaN(opacity)) style['stroke-opacity'] = opacity;
                        // GPX width is in mm, convert to px with 96 px per inch
                        if (!isNaN(width)) style['stroke-width'] = width * 96 / 25.4;
                    }
                }
                return style;
            }
            function getProperties(node) {
                var prop = getMulti(node, ['name', 'cmt', 'desc', 'type', 'time', 'keywords']),
                    links = get(node, 'link');
                if (links.length) prop.links = [];
                for (var i = 0, link; i < links.length; i++) {
                    link = { href: attr(links[i], 'href') };
                    extend(link, getMulti(links[i], ['text', 'type']));
                    prop.links.push(link);
                }
                return prop;
            }
            return gj;
        }
    };
    return t;
})();

if (typeof module !== 'undefined') module.exports = toGeoJSON;
/*
 * Load files *locally* (GeoJSON, KML, GPX) into the map
 * using the HTML5 File API.
 *
 * Requires Mapbox's togeojson.js to be in global scope
 * https://github.com/mapbox/togeojson
 */

(function (factory, window) {
    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd && window.toGeoJSON) {
        define(['leaflet'], function (L) {
            factory(L, window.toGeoJSON);
        });
    } else if (typeof module === 'object' && module.exports) {
        // require('LIBRARY') returns a factory that requires window to
        // build a LIBRARY instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined
        module.exports = function (root, L, toGeoJSON) {
            if (L === undefined) {
                if (typeof window !== 'undefined') {
                    L = require('leaflet');
                } else {
                    L = require('leaflet')(root);
                }
            }
            if (toGeoJSON === undefined) {
                if (typeof window !== 'undefined') {
                    toGeoJSON = require('togeojson');
                } else {
                    toGeoJSON = require('togeojson')(root);
                }
            }
            factory(L, toGeoJSON);
            return L;
        };
    } else if (typeof window !== 'undefined' && window.L && window.toGeoJSON) {
        factory(window.L, window.toGeoJSON);
    }
}(function fileLoaderFactory(L, toGeoJSON) {
    var FileLoader = L.Layer.extend({
        options: {
            layer: L.geoJson,
            geojson: "",
            layerOptions: {},
            fileSizeLimit: 1024
        },

        initialize: function (map, options) {
            this._map = map;
            L.Util.setOptions(this, options);

            this._parsers = {
                geojson: this._loadGeoJSON,
                json: this._loadGeoJSON,
                gpx: this._convertToGeoJSON,
                kml: this._convertToGeoJSON,
                kmz: this._kmzConvertToGeoJSON
            };
        },

        load: function (file, ext) {
            var parser,
                reader;

            // Check file is defined
            if (this._isParameterMissing(file, 'file')) {
                return false;
            }

            // Check file size
            if (!this._isFileSizeOk(file.size)) {
                return false;
            }

            // Get parser for this data type
            parser = this._getParser(file.name, ext);
            if (!parser) {
                return false;
            }

            // Read selected file using HTML5 File API
            reader = new FileReader();
            reader.onload = L.Util.bind(function (e) {
            	console.log(e);
                var layer;
                try {
                    this.fire('data:loading', { filename: file.name, format: parser.ext });
                    layer = parser.processor.call(this, e.target.result, parser.ext, file);
                    this.fire('data:loaded', {
                        layer: layer,
                        filename: file.name,
                        format: parser.ext
                    });
                } catch (err) {
                    this.fire('data:error', { error: err });
                }
            }, this);
            // Testing trick: tests don't pass a real file,
            // but an object with file.testing set to true.
            // This object cannot be read by reader, just skip it.
            if (!file.testing) {
                reader.readAsText(file);
            }
            // We return this to ease testing
            return reader;
        },

        loadMultiple: function (files, ext) {
            var readers = [];
            if (files[0]) {
              files = Array.prototype.slice.apply(files);
              while (files.length > 0) {
                readers.push(this.load(files.shift(), ext));
              }
            }
            // return first reader (or false if no file),
            // which is also used for subsequent loadings
            return readers;
        },

        loadData: function (data, name, ext, file) {
            var parser;
            var layer;


            // Check required parameters
            if ((this._isParameterMissing(data, 'data'))
              || (this._isParameterMissing(name, 'name'))) {
                return;
            }

            // Check file size
            if (!this._isFileSizeOk(data.length)) {
                return;
            }

            // Get parser for this data type
            parser = this._getParser(name, ext);
            if (!parser) {
                return;
            }

            // Process data
            try {
                this.fire('data:loading', { filename: name, format: parser.ext });
                layer = parser.processor.call(this, data, parser.ext, file);
                this.fire('data:loaded', {
                    layer: layer,
                    filename: name,
                    format: parser.ext
                });
            } catch (err) {
                this.fire('data:error', { error: err });
            }
        },

        _isParameterMissing: function (v, vname) {
            if (typeof v === 'undefined') {
                this.fire('data:error', {
                    error: new Error('Missing parameter: ' + vname)
                });
                return true;
            }
            return false;
        },

        _getParser: function (name, ext) {
            var parser;
            ext = ext || name.split('.').pop();
            parser = this._parsers[ext];
            if (!parser) {
                this.fire('data:error', {
                    error: new Error('Unsupported file type (' + ext + ')')
                });
                return undefined;
            }
            return {
                processor: parser,
                ext: ext
            };
        },

        _isFileSizeOk: function (size) {
            var fileSize = (size / 1024).toFixed(4);
            if (fileSize > this.options.fileSizeLimit) {
                this.fire('data:error', {
                    error: new Error(
                        'File size exceeds limit (' +
                        fileSize + ' > ' +
                        this.options.fileSizeLimit + 'kb)'
                    )
                });
                return false;
            }
            return true;
        },

        _loadGeoJSON: function _loadGeoJSON(content) {
            var layer;
            if (typeof content === 'string') {
                content = JSON.parse(content);
            }
            layer = this.options.layer(content, this.options.layerOptions);

            if (layer.getLayers().length === 0) {
                throw new Error('GeoJSON has no valid layers.');
            }

            if (this.options.addToMap) {
                layer.addTo(this._map);
            }
            return content;
        },

        _convertToGeoJSON: function _convertToGeoJSON(content, format) {
            var geojson;
            // Format is either 'gpx' or 'kml'
            if (typeof content === 'string') {
                content = (new window.DOMParser()).parseFromString(content, 'text/xml');
            }
            geojson = toGeoJSON[format](content);
            return this._loadGeoJSON(geojson);
        },
        _kmzConvertToGeoJSON: function _kmzConvertToGeoJSON(content, format,file) {
            var geojson;
            let ctx = this;
//            JSZip.loadSync(file));
//            .then(function(zip) {
//              return zip.file(/.*\.kml/)[0].async("string");
//            }).then(function success(text) {
//                // Format is either 'gpx' or 'kml'
//                if (typeof text === 'string') {
//                	text = (new window.DOMParser()).parseFromString(text, 'text/xml');
//                }
//                geojson = toGeoJSON['kml'](text);
//                console.log(geojson);
//                //return ctx._loadGeoJSON(geojson);
//              },
//              function error(e) {
//              alert(e);
//            }));
        }
    });

    var FileLayerLoad = L.Control.extend({
        statics: {
            TITLE: 'Load local file (GPX, KML, GeoJSON)',
            LABEL: '&#8965;'
        },
        options: {
            position: 'topleft',
            fitBounds: true,
            layerOptions: {},
            addToMap: true,
            fileSizeLimit: 1024
        },

        initialize: function (options) {
            L.Util.setOptions(this, options);
            this.loader = null;
        },

        onAdd: function (map) {
            this.loader = L.FileLayer.fileLoader(map, this.options);

            this.loader.on('data:loaded', function (e) {
                // Fit bounds after loading
                if (this.options.fitBounds) {
                    window.setTimeout(function () {
                        map.fitBounds(e.layer.getBounds());
                    }, 500);
                }
            }, this);

            // Initialize Drag-and-drop
            this._initDragAndDrop(map);

            // Initialize map control
            return this._initContainer();
        },

        _initDragAndDrop: function (map) {
            var callbackName;
            var thisLoader = this.loader;
            var dropbox = map._container;

            var callbacks = {
                dragenter: function () {
                    map.scrollWheelZoom.disable();
                },
                dragleave: function () {
                    map.scrollWheelZoom.enable();
                },
                dragover: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                },
                drop: function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    thisLoader.loadMultiple(e.dataTransfer.files);
                    map.scrollWheelZoom.enable();
                }
            };
            for (callbackName in callbacks) {
                if (callbacks.hasOwnProperty(callbackName)) {
                    dropbox.addEventListener(callbackName, callbacks[callbackName], false);
                }
            }
        },

        _initContainer: function () {
            var thisLoader = this.loader;

            // Create a button, and bind click on hidden file input
            var fileInput;
            var zoomName = 'leaflet-control-filelayer leaflet-control-zoom';
            var barName = 'leaflet-bar';
            var partName = barName + '-part';
            var container = L.DomUtil.create('div', zoomName + ' ' + barName);
            var link = L.DomUtil.create('a', zoomName + '-in ' + partName, container);
            link.innerHTML = L.Control.FileLayerLoad.LABEL;
            link.href = '#';
            link.title = L.Control.FileLayerLoad.TITLE;

            // Create an invisible file input
            fileInput = L.DomUtil.create('input', 'hidden', container);
            fileInput.type = 'file';
            fileInput.multiple = 'multiple';
            if (!this.options.formats) {
                fileInput.accept = '.gpx,.kml,.json,.geojson,.kmz';
            } else {
                fileInput.accept = this.options.formats.join(',');
            }
            fileInput.style.display = 'none';
            // Load on file change
            fileInput.addEventListener('change', function () {
                thisLoader.loadMultiple(this.files);
                // reset so that the user can upload the same file again if they want to
                this.value = '';
            }, false);

            L.DomEvent.disableClickPropagation(link);
            L.DomEvent.on(link, 'click', function (e) {
                fileInput.click();
                e.preventDefault();
            });
            return container;
        }
    });

    L.FileLayer = {};
    L.FileLayer.FileLoader = FileLoader;
    L.FileLayer.fileLoader = function (map, options) {
        return new L.FileLayer.FileLoader(map, options);
    };

    L.Control.FileLayerLoad = FileLayerLoad;
    L.Control.fileLayerLoad = function (options) {
        return new L.Control.FileLayerLoad(options);
    };
}, window));
