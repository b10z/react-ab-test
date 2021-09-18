import Cookies from 'js-cookie';

// https://github.com/Modernizr/Modernizr/blob/d4c7b6082709e32fb0589ba38aa96581d44ce395/feature-detects/storage/cookies.js#L16-L35
const cookiesEnabled = (() => {
  try {
    document.cookie = 'cookietest=1';
    const ret = document.cookie.indexOf('cookietest=') !== -1;
    document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
    return ret;
  } catch (e) {
    return false;
  }
})();

// https://github.com/Modernizr/Modernizr/blob/d4c7b6082709e32fb0589ba38aa96581d44ce395/feature-detects/storage/localstorage.js#L17-L46
const localStorageEnabled = (() => {
  const mod = 'modernizr';
  try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    return true;
  } catch (e) {
    return false;
  }
})();

const store = {
  getItem(key) {
    if (localStorageEnabled) {
      return localStorage.getItem(key);
    }
    if (cookiesEnabled) {
      return Cookies.get(key);
    }
  },
  setItem(key, value) {
    if (localStorageEnabled) {
      return localStorage.setItem(key, value);
    }
    if (cookiesEnabled) {
      return Cookies.set(key, value);
    }
  },
};

export default store;
