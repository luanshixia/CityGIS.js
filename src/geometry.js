/**
* geometry.js
*/
var dreambuild;
(function (dreambuild) {
    (function (geometry) {
        "use strict";

        /*
        * Utility functions.
        */
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

            Utils.floatEquals = function (a, b) {
                return Math.abs(a - b) < Utils.epsilon;
            };
            Utils.epsilon = 0.000001;
            return Utils;
        })();
        geometry.Utils = Utils;

        /*
        * Point or vector of 2d or 3d.
        */
        var Vector = (function () {
            function Vector(x, y, z) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof z === "undefined") { z = 0; }
                this.x = x;
                this.y = y;
                this.z = z;
            }
            Vector.prototype.get = function (dimension) {
                return this.array()[dimension];
            };

            Vector.prototype.equals = function (v) {
                var _this = this;
                return [0, 1, 2].every(function (i) {
                    return Utils.floatEquals(_this.get(i), v.get(i));
                });
            };

            Vector.prototype.copy = function () {
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

            Vector.prototype.kross = function (v) {
                return this.x * v.y - this.y * v.x;
            };

            Vector.prototype.normalize = function () {
                return this.div(this.mag());
            };

            Vector.prototype.limit = function (max) {
                return this.mag() > max ? this.setMag(max) : this.copy();
            };

            Vector.prototype.setMag = function (len) {
                return this.normalize().mult(len);
            };

            Vector.prototype.heading = function () {
                return Math.atan2(this.y, this.x);
            };

            Vector.prototype.angleTo = function (v, mode) {
                if (typeof mode === "undefined") { mode = "0ToPi"; }
                if (mode === "0ToPi") {
                    return Vector.angleBetween(this, v);
                }
                var dir0 = this.heading(), dir1 = v.heading(), angle = dir1 - dir0;
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
            };

            Vector.prototype.rotate = function (theta) {
                // this is 2D only.
                var x = this.x * Math.cos(theta) - this.y * Math.sin(theta), y = this.x * Math.sin(theta) + this.y * Math.cos(theta), z = this.z;
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
                return Vector.xAxis().rotate(angle);
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

        /*
        * Bounding box of 2d or 3d.
        */
        var Extents = (function () {
            function Extents(min, max) {
                if (typeof max === "undefined") { max = min; }
                this.min = min ? min.copy() : min;
                this.max = max ? max.copy() : max;
            }
            Extents.prototype.copy = function () {
                return new Extents(this.min, this.max);
            };

            Extents.prototype.equals = function (e) {
                if (this.isEmpty() || e.isEmpty()) {
                    return this.isEmpty() && e.isEmpty();
                }
                return this.min.equals(e.min) && this.max.equals(e.max);
            };

            Extents.prototype.add = function (e) {
                if (this.isEmpty()) {
                    return e.copy();
                } else if (e.isEmpty()) {
                    return this.copy();
                }
                return Extents.create(Math.min(this.min.x, e.min.x), Math.max(this.max.x, e.max.x), Math.min(this.min.y, e.min.y), Math.max(this.max.y, e.max.y), Math.min(this.min.z, e.min.z), Math.max(this.max.z, e.max.z));
            };

            Extents.prototype.addPoint = function (p) {
                if (this.isEmpty()) {
                    return new Extents(p, p);
                }
                return Extents.create(Math.min(this.min.x, p.x), Math.max(this.max.x, p.x), Math.min(this.min.y, p.y), Math.max(this.max.y, p.y), Math.min(this.min.z, p.z), Math.max(this.max.z, p.z));
            };

            Extents.prototype.extend = function (factor) {
                var center = this.center();
                return new Extents(center.add(this.min.sub(center).mult(factor)), center.add(this.max.sub(center).mult(factor)));
            };

            Extents.prototype.range = function (dimension) {
                return this.max.sub(this.min).get(dimension);
            };

            Extents.prototype.area = function () {
                return this.range(0) * this.range(1);
            };

            Extents.prototype.volume = function () {
                return this.range(0) * this.range(1) * this.range(2);
            };

            Extents.prototype.center = function () {
                return this.min.add(this.max).mult(0.5);
            };

            Extents.prototype.isEmpty = function () {
                return !this.min;
            };

            Extents.prototype.isPointIn = function (p) {
                return p.x >= this.min.x && p.x <= this.max.x && p.y >= this.min.y && p.y <= this.max.y && p.z >= this.min.z && p.z <= this.max.z;
            };

            Extents.prototype.isIn = function (e) {
                return this.min.x >= e.min.x && this.max.x <= e.max.x && this.min.y >= e.min.y && this.max.y <= e.max.y && this.min.z >= e.min.z && this.max.z <= e.max.z;
            };

            Extents.prototype.isCross = function (e) {
                var _this = this;
                var union = this.add(e);
                return [0, 1, 2].every(function (i) {
                    return union.range(i) <= _this.range(i) + e.range(i);
                });
            };

            Extents.create = function (minx, maxx, miny, maxy, minz, maxz) {
                if (typeof minz === "undefined") { minz = 0; }
                if (typeof maxz === "undefined") { maxz = 0; }
                return new Extents(new Vector(minx, miny, minz), new Vector(maxx, maxy, maxz));
            };

            Extents.empty = function () {
                return new Extents();
            };
            return Extents;
        })();
        geometry.Extents = Extents;

        /*
        * Multi points, polyline or polygon.
        */
        var PointString = (function () {
            function PointString(pts) {
                this.points = pts;
            }
            PointString.prototype.get = function (i) {
                return this.points[i];
            };

            PointString.prototype.extents = function () {
                var e = Extents.empty();
                this.points.forEach(function (p) {
                    e = e.addPoint(p);
                });
                return e;
            };

            PointString.prototype.length = function () {
                var len = 0, i;
                for (i = 0; i < this.points.length - 1; i++) {
                    len += this.points[i].dist(this.points[i + 1]);
                }
                return len;
            };

            PointString.prototype.area = function () {
                return Math.abs(this.algebraicArea());
            };

            PointString.prototype.algebraicArea = function () {
                var a = 0, i, j;
                for (i = 0; i < this.points.length; i++) {
                    j = (i < this.points.length - 1) ? (i + 1) : 0;
                    a += 0.5 * this.points[i].kross(this.points[j]);
                }
                return a;
            };

            PointString.prototype.average = function () {
                return this.points.reduce(function (x, y) {
                    return x.add(y);
                }).div(this.points.length);
            };

            PointString.prototype.centroid = function () {
                var a = 0, a1 = 0, c = Vector.zero(), i, j;
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
            };

            PointString.prototype.lerp = function (param) {
                var i = Math.floor(param), p1 = this.points[i], p2 = this.points[i + 1];
                if (!p2) {
                    return p1.copy();
                }
                return p1.lerp(p2, param - i);
            };

            PointString.prototype.dir = function (param) {
                var i = Math.floor(param), p1 = this.points[i], p2 = this.points[i + 1];
                if (!p2) {
                    return p1.sub(this.points[i - 1]).normalize();
                }
                return p2.sub(p1).normalize();
            };

            PointString.prototype.isPointIn = function (p) {
                var a = 0, i, j;
                for (i = 0; i < this.points.length; i++) {
                    j = (i < this.points.length - 1) ? (i + 1) : 0;
                    a += this.points[i].sub(p).angleTo(this.points[j].sub(p), "-PiToPi");
                }
                return Math.abs(a - 2 * Math.PI) < 0.1;
            };
            return PointString;
        })();
        geometry.PointString = PointString;
    })(dreambuild.geometry || (dreambuild.geometry = {}));
    var geometry = dreambuild.geometry;
})(dreambuild || (dreambuild = {}));
