//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // console.log('logs',logs);
  },
  getUserInfo:function(cb){
      var that = this;
     //调用登录接口

      wx.login({
        success: function (msg) {
          console.log('code',msg);
          if(msg.code){
            if(that.globalData.login==false){
              wx.openSetting({
                success: function (data) {
                  if(data) {
                    if (data.authSetting["scope.userInfo"] == true) {
                      //loginStatus = true;
                      wx.getUserInfo({
                        withCredentials: false,
                        success: function (res) {
                            console.log('第二次成功',res);
                            that.globalData.userInfo = res.userInfo;
                            that.globalData.login = true;
                            typeof cb == "function" && cb(that.globalData.userInfo);
                        //    getOpenid(res);
                          
                        },
                        fail: function (res) {
                          that.globalData.login = false;
                          console.log('二次失败',res);
                        }
                      });
                    }else{
                      that.globalData.login = false;
                      console.log('二次失败02');
                    }
                  }
                },
                fail: function () {
                  console.info("设置失败返回数据");
                  //wx.reLaunch({
                  //    url: '../index/index'
                  //});
                }       });
            }else{
              wx.getUserInfo({
                success: function (res) {
                  console.log('第一次成功',res);
                  that.globalData.userInfo = res.userInfo;
                  that.globalData.login = true;
                  typeof cb == "function" && cb(that.globalData.userInfo);
                //   getOpenid(res);
                   wx.request({
                       url:'https://api.weixin.qq.com/sns/jscode2session',
                       data:{
                           appid: 'gh_9f2fb8cd8e00',
                           secret:'5b9412479cdd99059e26e391e74c2806',
                           js_code:msg.code,
                           grant_type:'authorization_code'

                     },
                     success:function(openData){
                         console.log(openData);
                         var openid = openData.data.openid;
                         wx.request({
                             url: 'https://h5php.xingyuanauto.com/food/public/index.php/port/Login/saveUserInfo',
                             data: {
                                 encryptedData: res.userInfo.encryptedData,
                                 iv:res.userInfo.iv,
                                 openid:openid

                             },
                             success: function (lastData) {
                                console.log(lastData);
                             }
                         })
                     }
                   })
                },fail:function(msg){
                  that.globalData.login = false;
                  console.log('第一次失败',msg);
                }
              })
            }


          }

        },
        fail:function(res){
          console.log(res);
        }
      })
    
  },
  globalData:{
    userInfo:null
    
  },
})