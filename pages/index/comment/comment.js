var url = getApp().globalData.publicUrl;

Page({
  data: {
    Topnum: 1,
    goods_id: '',
    allpinglun: [],
    xhpinlun: [],
    status: '',
  },
  page: {
    pages: 1,
  },
  onLoad: function (e) {
    console.log( e )
    this.setData({ goods_id: e.goods_id, })
    this.getstoreeval();
  },
  onReachBottom: function () {//下拉加载更多
    this.page.pages++;
    this.getstoreeval();
  },
  onPullDownRefresh: function () {//上拉刷新
    wx.showNavigationBarLoading();
    this.page.pages = 1;
    this.getstoreeval();
  },
  click: function (e) {
    var num = e.target.dataset.num;
    var status;
    if (num == 1) {
      status = ''
    } else if (num == 2) {
      status = 4
    } else if (num == 3) {
      status = 3
    } else if (num == 4) {
      status = 2
    } else {
      status = 1
    }
    this.setData({
      Topnum: num,
      status: status,
      type: 10
    });
    this.page.pages = 1
    this.getstoreeval();
  },
  getstoreeval(e) {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 55000,
      mask: true
    })
    wx.request({//获取内容
      url: url + 'Store/store_eval',
      data: {
        store_id: '',
        type: this.page.pages * 10,
        goods_id: this.data.goods_id,
        status: this.data.status,
      },
      method: 'POST',
      success: res => {
        var list;
        if (res.data.data.list.length != 0) {
          list = res.data.data.list
          wx.hideToast();
        } else {
          list = '';
          wx.showToast({
            title: '没有更多数据',
            icon: 'success',
            duration: 500,
            mask: true
          })
        }
        that.setData({
          allpinglun: res.data.data,
          xhpinlun: list,
          isMsl:false
        });

        if (that.page.pages == 1) {
          if (res.data.data.list == '') {
            that.setData({ isMsl: true })
          }
        }

        // 隐藏导航栏加载框  
        wx.hideNavigationBarLoading();
        // 停止下拉动作  
        wx.stopPullDownRefresh();

      }
    })
  },
})