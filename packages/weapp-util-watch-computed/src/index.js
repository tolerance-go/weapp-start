const whc = ({ initHook }) => opts => {
  const oldReady = opts[initHook];

  opts[initHook] = function() {
    opts.$setData.call(this, this.data, 'force');
    oldReady && oldReady.apply(this, arguments);
  };

  opts.$setData = function(newData, force) {
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
          let hasChanged = false;
          denpendsField.forEach(field => {
            const newVal = newData[field];
            const oldVal = oldData[field];
            if (newVal !== oldVal) {
              hasChanged = true;
            }
            denpendsVal.push(hasChanged ? newVal : oldVal);
          });

          if (force || hasChanged) {
            const updatedVal = compute.apply(this, denpendsVal);
            newData[prop] = updatedVal;
          }
        }
      }
    }

    return this.setData(newData);
  };

  return opts;
};

const whcComponent = whc({ initHook: 'attached' });
const whcPage = whc({ initHook: 'onReady' });

export { whc, whcComponent, whcPage };
