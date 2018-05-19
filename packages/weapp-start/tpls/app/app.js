/* global App */

App({
  // Function 生命周期函数--监听小程序初始化 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  // path	String	打开小程序的路径
  // query	Object	打开小程序的query
  // scene	Number	打开小程序的场景值
  // shareTicket	String	shareTicket，详见 获取更多转发信息
  // referrerInfo	Object	当场景为由从另一个小程序或公众号或App打开时，返回此字段
  // referrerInfo.appId	String	来源小程序或公众号或App的 appId，详见下方说明
  // referrerInfo.extraData	Object	来源小程序传过来的数据，scene=1037或1038时支持
  onLaunch() {},

  // Function 生命周期函数--监听小程序显示 当小程序启动，或从后台进入前台显示，会触发 onShow
  // 参数同 onLaunch
  onShow() {},

  // Function 生命周期函数--监听小程序隐藏 当小程序从前台进入后台，会触发 onHide
  onHide() {},

  // Function 错误监听函数 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  onError() {},

  // Function 页面不存在监听函数 当小程序出现要打开的页面不存在的情况，会带上页面信息回调该函数，详见下文
  onPageNotFound() {},

  // Any 开发者可以添加任意的函数或数据到 Object 参数中，用 this 可以访问
});
