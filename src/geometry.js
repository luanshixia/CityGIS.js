/**
* geometry.js
*/
var dreambuild;
(function (dreambuild) {
    (function (geometry) {
        "use strict";

        var Utils = (function () {
            function Utils() {
            }
            Utils.random = function (min, max) {
                var rand = Math.random();
                return min + rand * (max - min);
            };

            Utils.formatString = function (format) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    args[_i] = arguments[_i + 1];
                }
                return format.replace(/\{(\d+)\}/g, function (match, index) {
                    return typeof args[index] !== 'undefined' ? args[index] : match;
                });
            };
            return Utils;
        })();
        geometry.Utils = Utils;

        var Vector = (function () {
            function Vector(x, y, z) {
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
            Vector.prototype.set = function (x, y, z) {
                if (arguments.length < 3) {
                    z = 0;
                }
                this.x = x;
                this.y = y;
                this.z = z;
            };

            Vector.prototype.get = function () {
                return new Vector(this.x, this.y, this.z);
            };

            Vector.prototype.mag = function () {
                return Math.sqrt(this.magSq());
            };

            Vector.prototype.magSq = function () {
                return this.x * this.x + this.y * this.y + this.z * this.z;
            };

            Vector.prototype.add = function (v) {
                return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
            };

            Vector.prototype.sub = function (v) {
                return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
            };

            Vector.prototype.mult = function (n) {
                return new Vector(this.x * n, this.y * n, this.z * n);
            };

            Vector.prototype.div = function (n) {
                return new Vector(this.x / n, this.y / n, this.z / n);
            };

            Vector.prototype.dist = function (v) {
                return this.sub(v).mag();
            };

            Vector.prototype.dot = function (v) {
                return this.x * v.x + this.y * v.y + this.z * v.z;
            };

            Vector.prototype.cross = function (v) {
                var x = this.y * v.z - this.z * v.y, y = this.z * v.x - this.x * v.z, z = this.x * v.y - this.y * v.x;
                return new Vector(x, y, z);
            };

            Vector.prototype.normalize = function () {
                return this.div(this.mag());
            };

            Vector.prototype.limit = function (max) {
                return this.mag() > max ? this.setMag(max) : this.get();
            };

            Vector.prototype.setMag = function (len) {
                return this.normalize().mult(len);
            };

            Vector.prototype.heading = function () {
                return Math.atan2(this.y, this.x);
            };

            Vector.prototype.rotate = function (theta) {
                // this is 2D only.
                var x = this.x * Math.cos(theta) + this.y * Math.sin(theta), y = -this.x * Math.sin(theta) + this.y * Math.cos(theta), z = this.z;
                return new Vector(x, y, z);
            };

            Vector.prototype.lerp = function (v, amt) {
                return this.add(v.sub(this).mult(amt));
            };

            Vector.prototype.array = function () {
                return [this.x, this.y, this.z];
            };

            Vector.prototype.toString = function () {
                return Utils.formatString("{0},{1},{2}", this.x, this.y, this.z);
            };

            Vector.fromString = function (str) {
                var ns = str.split(",").map(function (s) {
                    return parseFloat(s);
                });
                return new Vector(ns[0], ns[1], ns[2]);
            };

            Vector.random2D = function () {
                var theta = Utils.random(0, Math.PI * 2);
                return Vector.fromAngle(theta);
            };

            Vector.random3D = function () {
                var theta = Utils.random(0, Math.PI * 2), phi = Utils.random(-Math.PI / 2, Math.PI / 2), unit = new Vector(1, 0), xy = unit.rotate(theta), z = unit.rotate(phi);
                return new Vector(xy.x, xy.y, z.y);
            };

            Vector.fromAngle = function (angle) {
                var xUnit = new Vector(1, 0);
                return xUnit.rotate(angle);
            };

            Vector.angleBetween = function (v1, v2) {
                return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
            };

            Vector.zero = function () {
                return new Vector(0, 0, 0);
            };

            Vector.xAxis = function () {
                return new Vector(1, 0, 0);
            };

            Vector.yAxis = function () {
                return new Vector(0, 1, 0);
            };

            Vector.zAxis = function () {
                return new Vector(0, 0, 1);
            };
            return Vector;
        })();
        geometry.Vector = Vector;
    })(dreambuild.geometry || (dreambuild.geometry = {}));
    var geometry = dreambuild.geometry;
})(dreambuild || (dreambuild = {}));
