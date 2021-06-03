
// import {XRExtras} from './myxrextras/xrextras.js'
import {XRExtras} from './myxrextras/xrextras.js'
window.XRExtras = XRExtras
import {tapPlaceComponent} from './tap-place'
import './index.css'

// Register custom A-Frame components in app.js before the scene in body.html has loaded.
AFRAME.registerComponent('tap-place', tapPlaceComponent)