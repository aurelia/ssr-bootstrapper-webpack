System.register(["aurelia-framework", "aurelia-loader-webpack", "aurelia-binding"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
                resolve({ aurelia: aurelia, pal: pal, palNodeJS: palNodeJS, stop: stop });
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
    exports_1("default", default_1);
    var aurelia_framework_1, aurelia_loader_webpack_1, aurelia_binding_1, palNodeJS, pal;
    return {
        setters: [
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (aurelia_loader_webpack_1_1) {
                aurelia_loader_webpack_1 = aurelia_loader_webpack_1_1;
            },
            function (aurelia_binding_1_1) {
                aurelia_binding_1 = aurelia_binding_1_1;
            }
        ],
        execute: function () {
            // disable the dirty checker
            // otherwise the setTimeout of the dirty checker
            // prevents nodejs from garbage collecting the app
            aurelia_binding_1.DirtyCheckProperty.prototype.subscribe = function () { };
            palNodeJS = require('aurelia-pal-nodejs');
            pal = require('aurelia-pal');
            ;
        }
    };
});
