// debounce(() => {});
// import _ from 'lodash';

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
