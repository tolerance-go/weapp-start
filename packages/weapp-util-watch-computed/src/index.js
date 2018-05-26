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

const whc = ({ initHook, path }) => opts => {
  const methodName = '$setData';
  let fullPath = path;
  if (!path) {
    fullPath = methodName;
  } else {
    fullPath += `.${methodName}`;
  }

  const oldReady = opts[initHook];

  set(opts, fullPath, $setData);

  opts[initHook] = function() {
    const result = oldReady && oldReady.apply(this, arguments);
    get(opts, fullPath).call(this, this.data, 'force');
    return result;
  };

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

const whcComponent = whc({ initHook: 'attached', path: 'methods' });
const whcPage = whc({ initHook: 'onReady' });

export { whc, whcComponent, whcPage };
