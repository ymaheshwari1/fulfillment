import { Component, createApp, h, Prop, render } from 'vue'
import App from './App.vue'
import router from './router';
import logger from './logger';

import { IonicVue, IonLabel } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import "@hotwax/apps-theme";

import store from './store'
import permissionPlugin from '@/authorization';
import permissionRules from '@/authorization/Rules';
import permissionActions from '@/authorization/Actions';
import { dxpComponents } from '@hotwax/dxp-components';
import { login, logout, loader } from '@/utils/user';
import { getConfig, getProductIdentificationPref, initialise, setProductIdentificationPref, setUserLocale, setUserTimeZone,
  getAvailableTimeZones } from './adapter';
import localeMessages from '@/locales';
import { addNotification, storeClientRegistrationToken } from '@/utils/firebase';

const app: any = createApp(App)
  .use(IonicVue, {
    mode: 'md',
    innerHTMLTemplatesEnabled: true
  })
  .use(logger, {
    level: process.env.VUE_APP_DEFAULT_LOG_LEVEL
  })
  .use(router)
  .use(store)
  .use(permissionPlugin, {
    rules: permissionRules,
    actions: permissionActions
  })
  .use(dxpComponents, {
    addNotification,
    defaultImgUrl: require("@/assets/images/defaultImage.png"),
    login,
    logout,
    loader,
    appLoginUrl: process.env.VUE_APP_LOGIN_URL as string,
    appFirebaseConfig: JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG as any),
    appFirebaseVapidKey: process.env.VUE_APP_FIREBASE_VAPID_KEY,
    getConfig,
    getProductIdentificationPref,
    initialise,
    setProductIdentificationPref,
    localeMessages,
    setUserLocale,
    setUserTimeZone,
    storeClientRegistrationToken,
    getAvailableTimeZones
  });

app.render = function(Component: Component, props: any, el: any) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  if (!el) {
    throw new Error('el not found')
  }

  if (props && {}.toString.call(props) !== '[object Object]') {
    throw Error('props must be an object')
  }

  const childTree = h(Component, props) as any
  childTree.appContext = app._context

  // Creating a wrapper element here is clunky and ideally wouldn't be necessary
  const div = document.createElement('div')
  el.appendChild(div)

  render(childTree, div)

  return childTree.component.proxy
}

app.component('ion-label', IonLabel);

router.isReady().then(() => {
  app.mount('#app');
});

export {
  app
}