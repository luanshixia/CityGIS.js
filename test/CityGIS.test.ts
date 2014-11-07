/// <reference path="qunit.d.ts" />
/// <reference path="../src/geometry.ts" />

/**
 * CityGIS.test.js
 * 
 * by WANG Yang
 * 
 */

import geo = dreambuild.geometry;

function floatEqual(actual: number, expected: number, message: string) {
    return ok(Math.abs(actual - expected) < 0.001, message);
}

QUnit.module("CityGIS.test.basics");

test("Hello", function () {
    ok(true, "hello test");
});

QUnit.module("CityGIS.test.geometry");

test("Utils", function () {
    var min = 2010, max = 2015,
        rand = geo.Utils.random(2010, 2015);

    ok(geo.Utils.formatString("{0} {1}, {2}", "Aug.", "29th", 2014) === "Aug. 29th, 2014", "formatString() works fine!");
    ok(rand >= min && rand <= max, geo.Utils.formatString("{0} <= {1} <= {2}", min, rand, max));
});

test("Vector", function () {
    var v = new geo.Vector(2, 1),
        e = geo.Vector.xAxis(),
        piOver2 = Math.PI * 0.5,
        piOver4 = Math.PI * 0.25;

    ok(v.toString() === "2,1,0", "v is vector (2, 1)");
    ok(v.magSq() === v.kross(v.rotate(piOver2)), "v.magSq() === v.kross(v.rotate(piOver2))");
    ok(v.mag().toFixed(3) === "2.236", "v.mag() === 2.236");
    floatEqual(v.normalize().mag(), 1, "v.normalize().mag() === 1");
    floatEqual(v.rotate(-piOver2).dot(v), 0, "v.rotate(-piOver2).dot(v) === 0");
    ok(v.cross(v).mag() === 0, "v.cross(v).mag() === 0");
    ok(geo.Vector.fromAngle(piOver4).heading() === piOver4, "geo.Vector.fromAngle(piOver4).heading() === piOver4");
    ok(v.setMag(5).mag() === 5, "v.setMag(5).mag() === 5");
    floatEqual(v.angleTo(e), v.heading(), "v.angleTo(e) === v.heading()");
    ok(v.lerp(e, 1).equals(e), "v.lerp(e, 1).equals(e)");
});

test("Extents", function () {
    var e = geo.Extents.empty();
    ok(e.isEmpty(), "e.isEmpty()");

    e = e.addPoint(geo.Vector.zero());
    ok(!e.isEmpty(), "!e.isEmpty()");
    ok(e.area() === 0, "e.area() === 0");

    e = e.addPoint(new geo.Vector(1, 1));
    ok(e.area() === 1, "e.area() === 1");
    ok(e.center().equals(new geo.Vector(0.5, 0.5)), "e.center().equals(new geo.Vector(0.5, 0.5))");

    e = e.extend(2);
    ok(e.area() === 4, "e.area() === 4");
});

test("PointString", function () {
    var poly = new geo.PointString([geo.Vector.zero(), new geo.Vector(1, 0), new geo.Vector(1, 1)]);

    ok(poly.extents().equals(geo.Extents.create(0, 1, 0, 1)), "poly.extents().equals(geo.Extents.create(0, 1, 0, 1))");
    ok(poly.length() === 2, "poly.length() === 2");
    ok(poly.area() === 0.5, "poly.area() === 0.5");
    ok(poly.average().equals(new geo.Vector(2 / 3, 1 / 3)), "poly.average().equals(new geo.Vector(2 / 3, 1 / 3))");
    ok(poly.centroid().equals(poly.average()), "poly.centroid().equals(poly.average())");
    ok(poly.lerp(1.5).equals(new geo.Vector(1, 0.5)), "poly.lerp(1.5).equals(new geo.Vector(1, 0.5))");
    ok(poly.isPointIn(poly.centroid()), "poly.isPointIn(poly.centroid())");
    ok(!poly.isPointIn(geo.Vector.yAxis()), "!poly.isPointIn(geo.Vector.yAxis())");
});