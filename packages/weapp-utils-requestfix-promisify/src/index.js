/* global wx */
const native = {};

const MAX_REQUEST = 10;

const RequestMQ = {
  map: {},
  mq: [],
  running: [],
  push(param) {
    param.t = +new Date();
    while (this.mq.indexOf(param.t) > -1 || this.running.indexOf(param.t) > -1) {
      param.t += (Math.random() * 10) >> 0;
    }
    this.mq.push(param.t);
    this.map[param.t] = param;
  },
  next() {
    if (this.mq.length === 0) return;

    if (this.running.length < MAX_REQUEST - 1) {
      let newone = this.mq.shift();
      let obj = this.map[newone];
      let oldComplete = obj.complete;
      obj.complete = (...args) => {
        this.running.splice(this.running.indexOf(obj.t), 1);
        delete this.map[obj.t];
        oldComplete && oldComplete.apply(obj, args);
        this.next();
      };
      this.running.push(obj.t);
      return wx.request(obj);
    }
  },
  request(obj) {
    obj = obj || {};
    obj = typeof obj === 'string' ? { url: obj } : obj;

    this.push(obj);

    return this.next();
  },
};

const center = {
  _addons: {},

  _interceptors: {},

  _initAPI(wepy, noPromiseAPI) {
    const self = this;
    const noPromiseMethods = {
      // 媒体
      stopRecord: true,
      getRecorderManager: true,
      pauseVoice: true,
      stopVoice: true,
      pauseBackgroundAudio: true,
      stopBackgroundAudio: true,
      getBackgroundAudioManager: true,
      createAudioContext: true,
      createInnerAudioContext: true,
      createVideoContext: true,
      createCameraContext: true,

      // 位置
      createMapContext: true,

      // 设备
      canIUse: true,
      startAccelerometer: true,
      stopAccelerometer: true,
      startCompass: true,
      stopCompass: true,
      onBLECharacteristicValueChange: true,
      onBLEConnectionStateChange: true,

      // 界面
      hideToast: true,
      hideLoading: true,
      showNavigationBarLoading: true,
      hideNavigationBarLoading: true,
      navigateBack: true,
      createAnimation: true,
      pageScrollTo: true,
      createSelectorQuery: true,
      createCanvasContext: true,
      createContext: true,
      drawCanvas: true,
      hideKeyboard: true,
      stopPullDownRefresh: true,

      // 拓展接口
      arrayBufferToBase64: true,
      base64ToArrayBuffer: true,
    };

    if (noPromiseAPI) {
      if (Array.isArray(noPromiseAPI)) {
        noPromiseAPI.forEach(v => (noPromiseMethods[v] = true));
      } else {
        for (let k in noPromiseAPI) {
          noPromiseMethods[k] = noPromiseAPI[k];
        }
      }
    }

    Object.keys(wx).forEach(key => {
      if (!noPromiseMethods[key] && key.substr(0, 2) !== 'on' && !/\w+Sync$/.test(key)) {
        Object.defineProperty(native, key, {
          get() {
            return obj => {
              obj = obj || {};
              if (self._interceptors[key] && self._interceptors[key].config) {
                let rst = self._interceptors[key].config.call(self, obj);
                if (rst === false) {
                  if (self._addons.promisify) {
                    return Promise.reject(new Error('aborted by interceptor'));
                  } else {
                    obj.fail && obj.fail('aborted by interceptor');
                    return;
                  }
                }
                obj = rst;
              }
              if (key === 'request') {
                obj = typeof obj === 'string' ? { url: obj } : obj;
              }
              if (typeof obj === 'string') {
                return wx[key](obj);
              }
              if (self._addons.promisify) {
                let task;
                const p = new Promise((resolve, reject) => {
                  let bak = {};
                  ['fail', 'success', 'complete'].forEach(k => {
                    bak[k] = obj[k];
                    obj[k] = res => {
                      if (self._interceptors[key] && self._interceptors[key][k]) {
                        res = self._interceptors[key][k].call(self, res);
                      }
                      if (k === 'success') resolve(res);
                      else if (k === 'fail') reject(res);
                    };
                  });
                  if (self._addons.requestfix && key === 'request') {
                    RequestMQ.request(obj);
                  } else {
                    task = wx[key](obj);
                  }
                });
                if (key === 'uploadFile' || key === 'downloadFile') {
                  p.progress = cb => {
                    task.onProgressUpdate(cb);
                    return p;
                  };
                  p.abort = cb => {
                    cb && cb();
                    task.abort();
                    return p;
                  };
                }
                return p;
              } else {
                let bak = {};
                ['fail', 'success', 'complete'].forEach(k => {
                  bak[k] = obj[k];
                  obj[k] = res => {
                    if (self._interceptors[key] && self._interceptors[key][k]) {
                      res = self._interceptors[key][k].call(self, res);
                    }
                    bak[k] && bak[k].call(self, res);
                  };
                });
                if (self._addons.requestfix && key === 'request') {
                  RequestMQ.request(obj);
                } else {
                  return wx[key](obj);
                }
              }
            };
          },
        });
        wx[key] = native[key];
      } else {
        Object.defineProperty(native, key, {
          get() {
            return (...args) => wx[key].apply(wx, args);
          },
        });
        wx[key] = native[key];
      }
    });
  },

  init(wepy, config = {}) {
    this._initAPI(wepy, config.noPromiseAPI);
  },

  use(addon, ...args) {
    if (typeof addon === 'string') {
      this._addons[addon] = 1;
    }
  },

  intercept(api, provider) {
    this._interceptors[api] = provider;
  },
};

export default center;
