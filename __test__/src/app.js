import debounce from 'lodash/debounce';
import common from 'common';
import common2 from 'common2';

// debounce(() => {});

App({
  onLaunch: function() {
    // test promise
    const p = new Promise(() => {}); // eslint-disable-line
    console.log('App Launch');
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  },
});
