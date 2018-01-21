import { Aurelia } from 'aurelia-framework';
import { WebpackLoader } from 'aurelia-loader-webpack';
import { DirtyCheckProperty } from 'aurelia-binding';
// disable the dirty checker
// otherwise the setTimeout of the dirty checker
// prevents nodejs from garbage collecting the app
DirtyCheckProperty.prototype.subscribe = () => { };
const palNodeJS = require('aurelia-pal-nodejs');
const pal = require('aurelia-pal');
function initialize() {
    const { initialize } = palNodeJS;
    const { PLATFORM } = pal;
    initialize();
    // expose anything the ssr-engine needs
    return {
        PLATFORM,
    };
}
function start(configure) {
    const aurelia = new Aurelia(new WebpackLoader());
    aurelia.host = pal.DOM.querySelectorAll('body')[0];
    const attribute = pal.DOM.createAttribute('aurelia-app');
    attribute.value = 'main';
    aurelia.host.attributes.setNamedItem(attribute);
    return new Promise(resolve => {
        // we need to wait for aurelia-composed as otherwise
        // the router hasn't been fully initialized and 
        // generated routes by route-href will be undefined
        pal.DOM.global.window.addEventListener('aurelia-composed', () => {
            resolve({ aurelia, pal, palNodeJS, stop });
        });
        return configure(aurelia);
    });
}
function stop() {
    require('aurelia-pal').reset();
    require('aurelia-pal-nodejs').reset(pal.DOM.global.window);
}
export default function (configure) {
    return {
        initialize,
        stop,
        start: function () {
            return start(configure);
        }
    };
}
;
