import utils from '../../utils';

Component({
  properties: {
    last: {
      type: Boolean,
      value: false,
    },
    item: {
      type: Object,
      value: {},
    },
  },
  methods: {
    onRemove() {
      this.triggerEvent('remove', this.data.item, {});
    },
    onDone() {
      this.triggerEvent('done', this.data.item, {});
    },
  },
});
