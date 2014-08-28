/// <reference path="geometry.ts" />

/**
 * gis.js
 */

module dreambuild.gis {
    "use strict";

    export class Map {

        name: string;
        layers: Layer[];

        constructor(name?: string) {
            this.name = name;
            this.layers = [];
        }

        extents() {
            return this.layers.map(l => l.extents()).reduce((e1, e2) => e1.add(e2));
        }

        serialize() {
            return JSON.stringify(this);
        }

        static deserialize(json: string) {
            return <Map>JSON.parse(json);
        }
    }

    export class Layer {

        name: string;
        type: GeometricType;
        features: Feature[];

        constructor(name?: string, type?: GeometricType) {
            this.name = name;
            this.type = type;
            this.features = [];
        }

        extents() {
            return this.features.map(f => f.extents()).reduce((e1, e2) => e1.add(e2));
        }
    }

    export class Feature {

        id: string;
        geometry: geometry.Vector[];
        properties: { [name: string]: string };

        constructor(id?: string, geometry?: geometry.Vector[]) {
            this.id = id;
            this.geometry = geometry;
            this.properties = {};
        }

        extents() {
            return new geometry.PointString(this.geometry).extents();
        }
    }

    export enum GeometricType {
        unknown = 0,
        point = 1,
        linear = 2,
        region = 4,
        solid = 8,
        multiPoints = 17,
        multiLinears = 18,
        multiRegions = 20
    }
}