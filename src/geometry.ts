
/**
 * geometry.js
 */

module dreambuild.geometry {
    "use strict";

    export class Utils {

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
    }

    export class Vector {

        x: number;
        y: number;
        z: number;

        constructor(x?: number, y?: number, z?: number) {
            if (arguments.length < 3) {
                z = 0;
                if (arguments.length < 2) {
                    y = 0;
                    if (arguments.length < 1) {
                        x = 0;
                    }
                }
            }
            this.set(x, y, z);
        }

        set(x: number, y: number, z?: number) {
            if (arguments.length < 3) {
                z = 0;
            }
            this.x = x;
            this.y = y;
            this.z = z;
        }

        get() {
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

        dot(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }

        cross(v) {
            var x = this.y * v.z - this.z * v.y,
                y = this.z * v.x - this.x * v.z,
                z = this.x * v.y - this.y * v.x;
            return new Vector(x, y, z);
        }

        normalize() {
            return this.div(this.mag());
        }

        limit(max: number) {
            return this.mag() > max ? this.setMag(max) : this.get();
        }

        setMag(len: number) {
            return this.normalize().mult(len);
        }

        heading() {
            return Math.atan2(this.y, this.x);
        }

        rotate(theta: number) {
            // this is 2D only.
            var x = this.x * Math.cos(theta) + this.y * Math.sin(theta),
                y = -this.x * Math.sin(theta) + this.y * Math.cos(theta),
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

        static fromString(str: string) {
            var ns = str.split(",").map(function (s) {
                return parseFloat(s);
            });
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
            var xUnit = new Vector(1, 0);
            return xUnit.rotate(angle);
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
}