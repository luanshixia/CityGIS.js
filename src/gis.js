/// <reference path="geometry.ts" />
var dreambuild;
(function (dreambuild) {
    /**
    * gis.js
    */
    (function (gis) {
        "use strict";

        var Map = (function () {
            function Map(name) {
                this.name = name;
                this.layers = [];
            }
            Map.prototype.extents = function () {
                return this.layers.map(function (l) {
                    return l.extents();
                }).reduce(function (e1, e2) {
                    return e1.add(e2);
                });
            };

            Map.prototype.serialize = function () {
                return JSON.stringify(this);
            };

            Map.deserialize = function (json) {
                return JSON.parse(json);
            };
            return Map;
        })();
        gis.Map = Map;

        var Layer = (function () {
            function Layer(name, type) {
                this.name = name;
                this.type = type;
                this.features = [];
            }
            Layer.prototype.extents = function () {
                return this.features.map(function (f) {
                    return f.extents();
                }).reduce(function (e1, e2) {
                    return e1.add(e2);
                });
            };
            return Layer;
        })();
        gis.Layer = Layer;

        var Feature = (function () {
            function Feature(id, geometry) {
                this.id = id;
                this.geometry = geometry;
                this.properties = {};
            }
            Feature.prototype.extents = function () {
                return new dreambuild.geometry.PointString(this.geometry).extents();
            };
            return Feature;
        })();
        gis.Feature = Feature;

        (function (GeometricType) {
            GeometricType[GeometricType["unknown"] = 0] = "unknown";
            GeometricType[GeometricType["point"] = 1] = "point";
            GeometricType[GeometricType["linear"] = 2] = "linear";
            GeometricType[GeometricType["region"] = 4] = "region";
            GeometricType[GeometricType["solid"] = 8] = "solid";
            GeometricType[GeometricType["multiPoints"] = 17] = "multiPoints";
            GeometricType[GeometricType["multiLinears"] = 18] = "multiLinears";
            GeometricType[GeometricType["multiRegions"] = 20] = "multiRegions";
        })(gis.GeometricType || (gis.GeometricType = {}));
        var GeometricType = gis.GeometricType;
    })(dreambuild.gis || (dreambuild.gis = {}));
    var gis = dreambuild.gis;
})(dreambuild || (dreambuild = {}));
