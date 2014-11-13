
/**
 * geometry.js
 */

module dreambuild.geometry {
    "use strict";

    /*
     * Utility functions.
     */
    export class Utils {

        static epsilon = 0.000001;

        static random(min: number, max: number) {
            var rand = Math.random();
            return min + rand * (max - min);
        }

        static formatString(format: string, ...args: any[]) {
            return format.replace(/\{(\d+)\}/g, function (match, index) {
                return typeof args[index] !== 'undefined'
                    ? args[index]
                    : match;
            });
        }

        static floatEquals(a: number, b: number) {
            return Math.abs(a - b) < Utils.epsilon;
        }
    }

    /*
     * Point or vector of 2d or 3d.
     */
    export class Vector {

        x: number;
        y: number;
        z: number;

        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        get(dimension: number) {
            return this.array()[dimension];
        }

        equals(v: Vector) {
            return [0, 1, 2].every(i => Utils.floatEquals(this.get(i), v.get(i)));
        }

        copy() {
            return new Vector(this.x, this.y, this.z);
        }

        mag() {
            return Math.sqrt(this.magSq());
        }

        magSq() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }

        add(v: Vector) {
            return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        }

        sub(v: Vector) {
            return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        }

        mult(n: number) {
            return new Vector(this.x * n, this.y * n, this.z * n);
        }

        div(n: number) {
            return new Vector(this.x / n, this.y / n, this.z / n);
        }

        dist(v: Vector) {
            return this.sub(v).mag();
        }

        dot(v: Vector) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }

        cross(v: Vector) {
            var x = this.y * v.z - this.z * v.y,
                y = this.z * v.x - this.x * v.z,
                z = this.x * v.y - this.y * v.x;
            return new Vector(x, y, z);
        }

        kross(v: Vector) {
            return this.x * v.y - this.y * v.x;
        }

        normalize() {
            return this.div(this.mag());
        }

        limit(max: number) {
            return this.mag() > max ? this.setMag(max) : this.copy();
        }

        setMag(len: number) {
            return this.normalize().mult(len);
        }

        heading() {
            return Math.atan2(this.y, this.x);
        }

        angleTo(v: Vector, mode = "0ToPi") {
            if (mode === "0ToPi") {
                return Vector.angleBetween(this, v);
            }
            var dir0 = this.heading(),
                dir1 = v.heading(),
                angle = dir1 - dir0;
            if (mode === "0To2Pi") {
                if (angle < 0) {
                    angle += 2 * Math.PI;
                }
            } else if (mode === "-PiToPi") {
                if (angle < -Math.PI) {
                    angle += 2 * Math.PI;
                } else if (angle > Math.PI) {
                    angle -= 2 * Math.PI;
                }
            }
            return angle;
        }

        rotate(theta: number) {
            // this is 2D only.
            var x = this.x * Math.cos(theta) - this.y * Math.sin(theta),
                y = this.x * Math.sin(theta) + this.y * Math.cos(theta),
                z = this.z;
            return new Vector(x, y, z);
        }

        lerp(v: Vector, amt: number) {
            return this.add(v.sub(this).mult(amt));
        }

        array() {
            return [this.x, this.y, this.z];
        }

        toString() {
            return Utils.formatString("{0},{1},{2}", this.x, this.y, this.z);
        }

        static parse(str: string) {
            var ns = str.split(",").map(s => parseFloat(s));
            return new Vector(ns[0], ns[1], ns[2]);
        }

        static random2D() {
            var theta = Utils.random(0, Math.PI * 2);
            return Vector.fromAngle(theta);
        }

        static random3D() {
            var theta = Utils.random(0, Math.PI * 2),
                phi = Utils.random(-Math.PI / 2, Math.PI / 2),
                unit = new Vector(1, 0),
                xy = unit.rotate(theta),
                z = unit.rotate(phi);
            return new Vector(xy.x, xy.y, z.y);
        }

        static fromAngle(angle: number) {
            return Vector.xAxis().rotate(angle);
        }

        static angleBetween(v1: Vector, v2: Vector) {
            return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
        }

        static zero() {
            return new Vector(0, 0, 0);
        }

        static xAxis() {
            return new Vector(1, 0, 0);
        }

        static yAxis() {
            return new Vector(0, 1, 0);
        }

        static zAxis() {
            return new Vector(0, 0, 1);
        }
    }

    /*
     * Bounding box of 2d or 3d.
     */
    export class Extents {

        min: Vector;
        max: Vector;

        constructor(min?: Vector, max = min) {
            this.min = min ? min.copy() : min;
            this.max = max ? max.copy() : max;
        }

        copy() {
            return new Extents(this.min, this.max);
        }

        equals(e: Extents) {
            if (this.isEmpty() || e.isEmpty()) {
                return this.isEmpty() && e.isEmpty();
            }
            return this.min.equals(e.min) && this.max.equals(e.max);
        }

        add(e: Extents) {
            if (this.isEmpty()) {
                return e.copy();
            } else if (e.isEmpty()) {
                return this.copy();
            }
            return Extents.create(
                Math.min(this.min.x, e.min.x), Math.max(this.max.x, e.max.x),
                Math.min(this.min.y, e.min.y), Math.max(this.max.y, e.max.y),
                Math.min(this.min.z, e.min.z), Math.max(this.max.z, e.max.z));
        }

        addPoint(p: Vector) {
            if (this.isEmpty()) {
                return new Extents(p, p);
            }
            return Extents.create(
                Math.min(this.min.x, p.x), Math.max(this.max.x, p.x),
                Math.min(this.min.y, p.y), Math.max(this.max.y, p.y),
                Math.min(this.min.z, p.z), Math.max(this.max.z, p.z));
        }

        extend(factor: number) {
            var center = this.center();
            return new Extents(center.add(this.min.sub(center).mult(factor)), center.add(this.max.sub(center).mult(factor)));
        }

        range(dimension: number) {
            return this.max.sub(this.min).get(dimension);
        }

        area() {
            return this.range(0) * this.range(1);
        }

        volume() {
            return this.range(0) * this.range(1) * this.range(2);
        }

        center() {
            return this.min.add(this.max).mult(0.5);
        }

        isEmpty() {
            return !this.min;
        }

        isPointIn(p: Vector) {
            return p.x >= this.min.x && p.x <= this.max.x
                && p.y >= this.min.y && p.y <= this.max.y
                && p.z >= this.min.z && p.z <= this.max.z;
        }

        isIn(e: Extents) {
            return this.min.x >= e.min.x && this.max.x <= e.max.x
                && this.min.y >= e.min.y && this.max.y <= e.max.y
                && this.min.z >= e.min.z && this.max.z <= e.max.z;
        }

        isCross(e: Extents) {
            var union = this.add(e);
            return [0, 1, 2].every(i => union.range(i) <= this.range(i) + e.range(i));
        }

        static create(minx: number, maxx: number, miny: number, maxy: number, minz = 0, maxz = 0) {
            return new Extents(new Vector(minx, miny, minz), new Vector(maxx, maxy, maxz));
        }

        static empty() {
            return new Extents();
        }

        static fromPoints(pts: Vector[]) {
            var min = new Vector(pts.map(p => p.x).reduce((a, b) => Math.min(a, b)), pts.map(p => p.y).reduce((a, b) => Math.min(a, b)));
            var max = new Vector(pts.map(p => p.x).reduce((a, b) => Math.max(a, b)), pts.map(p => p.y).reduce((a, b) => Math.max(a, b)));
            return new Extents(min, max);
        }
    }

    /*
     * Multi points, polyline or polygon.
     */
    export class PointString {

        points: Vector[];

        constructor(pts: Vector[]) {
            this.points = pts;
        }

        get(i: number) {
            return this.points[i];
        }

        extents() {
            return Extents.fromPoints(this.points);
        }

        length() {
            var len = 0, i: number;
            for (i = 0; i < this.points.length - 1; i++) {
                len += this.points[i].dist(this.points[i + 1]);
            }
            return len;
        }

        area() {
            return Math.abs(this.algebraicArea());
        }

        algebraicArea() {
            var a = 0, i: number, j: number;
            for (i = 0; i < this.points.length; i++) {
                j = (i < this.points.length - 1) ? (i + 1) : 0;
                a += 0.5 * this.points[i].kross(this.points[j]);
            }
            return a;
        }

        average() {
            return this.points.reduce((x, y) => x.add(y)).div(this.points.length);
        }

        centroid() {
            var a = 0, a1 = 0, c = Vector.zero(), i: number, j: number;
            if (this.points.length === 1) {
                return this.points[0].copy();
            }
            for (i = 0; i < this.points.length; i++) {
                j = (i < this.points.length - 1) ? (i + 1) : 0;
                a1 = 0.5 * this.points[i].kross(this.points[j]);
                a += a1;
                c = c.add(this.points[i].add(this.points[j]).div(3).mult(a1));
            }
            return c.div(a);
        }

        lerp(param: number) {
            var i = Math.floor(param),
                p1 = this.points[i],
                p2 = this.points[i + 1];
            if (!p2) {
                return p1.copy();
            }
            return p1.lerp(p2, param - i);
        }

        dir(param: number) {
            var i = Math.floor(param),
                p1 = this.points[i],
                p2 = this.points[i + 1];
            if (!p2) {
                return p1.sub(this.points[i - 1]).normalize();
            }
            return p2.sub(p1).normalize();
        }

        isPointIn(p: Vector) {
            var a = 0, i: number, j: number;
            for (i = 0; i < this.points.length; i++) {
                j = (i < this.points.length - 1) ? (i + 1) : 0;
                a += this.points[i].sub(p).angleTo(this.points[j].sub(p), "-PiToPi");
            }
            return Math.abs(Math.abs(a) - 2 * Math.PI) < 0.1;
        }

        toString() {
            return this.points.map(p => p.toString()).join("|");
        }

        static parse(str: string) {
            return new PointString(str.split("|").map(s => Vector.parse(s)));
        }
    }
}