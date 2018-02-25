"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_loader_webpack_1 = require("aurelia-loader-webpack");
var aurelia_binding_1 = require("aurelia-binding");
// disable the dirty checker
// otherwise the setTimeout of the dirty checker
// prevents nodejs from garbage collecting the app
aurelia_binding_1.DirtyCheckProperty.prototype.subscribe = function () { };
// https://github.com/angular/angular-cli/issues/8412
// https://github.com/ag-grid/ag-grid-react/issues/24
global.Element = typeof Element === 'undefined' ? function () { } : Element;
global.HTMLElement = typeof HTMLElement === 'undefined' ? function () { } : HTMLElement;
global.HTMLSelectElement = typeof HTMLSelectElement === 'undefined' ? function () { } : HTMLSelectElement;
var palNodeJS = require('aurelia-pal-nodejs');
var pal = require('aurelia-pal');
function initialize() {
    var initialize = palNodeJS.initialize;
    var PLATFORM = pal.PLATFORM;
    initialize();
    // expose anything the ssr-engine needs
    return {
        PLATFORM: PLATFORM,
    };
}
function start(configure) {
    var aurelia = new aurelia_framework_1.Aurelia(new aurelia_loader_webpack_1.WebpackLoader());
    aurelia.host = pal.DOM.querySelectorAll('body')[0];
    var attribute = pal.DOM.createAttribute('aurelia-app');
    attribute.value = 'main';
    aurelia.host.attributes.setNamedItem(attribute);
    return new Promise(function (resolve) {
        // we need to wait for aurelia-composed as otherwise
        // the router hasn't been fully initialized and 
        // generated routes by route-href will be undefined
        pal.DOM.global.window.addEventListener('aurelia-composed', function () {
            setTimeout(function () {
                resolve({ aurelia: aurelia, pal: pal, palNodeJS: palNodeJS, stop: stop });
            }, 20);
        });
        return configure(aurelia);
    });
}
function stop() {
    require('aurelia-pal').reset();
    require('aurelia-pal-nodejs').reset(pal.DOM.global.window);
}
function default_1(configure) {
    return {
        initialize: initialize,
        stop: stop,
        start: function () {
            return start(configure);
        }
    };
}
exports.default = default_1;
;
