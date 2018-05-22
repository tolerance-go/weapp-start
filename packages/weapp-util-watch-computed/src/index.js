export default opts => {
  opts.$setData = function(newData) {
    const oldData = this.data;

    if (this.watch) {
      for (let prop in this.watch) {
        if (!this.watch.hasOwnProperty(prop)) break;

        const newVal = newData[prop];
        const oldVal = oldData[prop];

        if (newData.hasOwnProperty(prop) && newVal !== oldVal) {
          this.watch[prop].call(this, newVal, oldVal);
        }
      }
    }

    if (this.computed) {
      for (let prop in this.computed) {
        const item = this.computed[prop];
        const denpendsField = item.slice(0, item.length - 1);
        const compute = item[item.length - 1];
        const denpendsVal = [];

        if (denpendsField.some(field => newData.hasOwnProperty(field))) {
          let hasChanged = false;
          denpendsField.forEach(field => {
            const newVal = newData[field];
            const oldVal = oldData[field];
            if (newData.hasOwnProperty(field)) {
              if (newVal !== oldVal) {
                hasChanged = true;
              }
            }
            denpendsVal.push(hasChanged ? newVal : oldVal);
          });

          if (hasChanged) {
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
