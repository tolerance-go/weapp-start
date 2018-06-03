const set = (obj, path, val) => {
  const paths = path.split('.');
  return paths.reduce((obj, name, index) => {
    if (paths.length - 1 === index) {
      return (obj[name] = val);
    }
    if (!obj[name]) {
      obj[name] = {};
    }
    return obj[name];
  }, obj);
};

// eslint-disable-next-line
const get = (obj, path) => {
  const paths = path.split('.');
  return paths.reduce((obj, name, index) => {
    if (paths.length - 1 === index) {
      return obj[name];
    }
    if (!obj[name]) {
      return;
    }
    return obj[name];
  }, obj);
};

const normalizalProperties = properties => {
  for (let prop in properties) {
    if (!properties.hasOwnProperty(prop)) continue;
    const meta = properties[prop];
    if (typeof meta !== 'object') {
      properties[prop] = {
        type: meta,
      };
    }
  }
};

const getNormalizalPropertiesValue = properties => {
  const data = {};
  for (let prop in properties) {
    if (!properties.hasOwnProperty(prop)) continue;
    data[prop] = properties[prop].value;
  }
  return data;
};

const whc = ({ name }) => opts => {
  const methodName = '$setData';
  const isCom = name === 'component';
  const path = isCom ? 'methods' : '';
  const initHook = isCom ? 'attached' : 'onReady';
  let hookCalled = false;

  let fullPath = path;
  if (!path) fullPath = methodName;
  else fullPath += `.${methodName}`;
  set(opts, fullPath, $setData);

  if (isCom && opts.properties) {
    const properties = opts.properties;
    normalizalProperties(properties);
    for (let prop in properties) {
      if (!properties.hasOwnProperty(prop)) continue;
      const meta = properties[prop];
      if (meta.observer) {
        const oldOb = meta.observer;
        meta.observer = function(newVal, oldVal) {
          const result = oldOb.apply(this, arguments);
          observerRender.call(this, newVal, oldVal, prop);
          return result;
        };
      } else {
        meta.observer = function(newVal, oldVal) {
          // 接口 data 发生变化的时候，此时 this.data 已经改变了
          observerRender.call(this, newVal, oldVal, prop);
        };
      }
    }
  }

  const oldReady = opts[initHook];

  opts[initHook] = function() {
    hookCalled = true;
    // this.data 的顺序置于最后，因为 observer 的执行早于 hook，observer 执行之后，内部 this.data 已经修改
    const data = Object.assign({}, getNormalizalPropertiesValue(opts.properties), this.data);

    const result = oldReady && oldReady.apply(this, arguments);
    for (let k in data) {
      if (data[k] === undefined) {
        delete data[k];
      }
    }
    // ~~计算属性依赖 properties 的数据的初始化交由自身的 observer 来完成~~
    // 当外部一开始没有传值的时候，observer 是不会调用，因此这边主动将 properties 融入 data
    $setData.call(this, data, 'force');
    return result;
  };

  function observerRender(newVal, oldVal, prop) {
    // observer 执行之后，this.data 里面的值已经变了
    if (!hookCalled) {
      return;
    }
    if (newVal !== oldVal) {
      $setData.call(this, { [prop]: newVal }, 'force');
    }
  }

  function $setData(newData, force) {
    const oldData = this.data;

    if (opts.watch) {
      for (let prop in opts.watch) {
        if (!opts.watch.hasOwnProperty(prop)) break;

        const newVal = newData[prop];
        const oldVal = oldData[prop];

        if (force || (newData.hasOwnProperty(prop) && newVal !== oldVal)) {
          opts.watch[prop].call(this, newVal, oldVal);
        }
      }
    }

    if (opts.computed) {
      for (let prop in opts.computed) {
        const item = opts.computed[prop];
        const denpendsField = item.slice(0, item.length - 1);
        const compute = item[item.length - 1];
        const denpendsVal = [];

        if (denpendsField.some(field => newData.hasOwnProperty(field))) {
          const hasChangeds = [];
          denpendsField.forEach(field => {
            let changed = false;
            const newVal = newData[field];
            const oldVal = oldData[field];
            if (newData.hasOwnProperty(field)) {
              if (newVal !== oldVal) {
                changed = true;
              }
            }
            hasChangeds.push(changed);
            denpendsVal.push(changed ? newVal : oldVal);
          });

          if (force || hasChangeds.some(changed => changed)) {
            const updatedVal = compute.apply(this, denpendsVal);
            newData[prop] = updatedVal;
          }
        }
      }
    }

    return this.setData(newData);
  }

  return opts;
};

const whcComponent = whc({ name: 'component' });
const whcPage = whc({ name: 'page' });

export { whc, whcComponent, whcPage };
