
let ajaxTimec = 0;
export const request = (params) => {

        //判断url中是否带有/my/请求的路径，然后就加上 token
        let header={...params.header}
        if(params.url.includes("/my/")){
            //拼接header 带上token
            header["Authorization"]=wx.getStorageSync('token')
        }

    ajaxTimec++;
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '加载中',
            mask: true //蒙板
        })
        const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
        wx.request({
            ...params,
            header:header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimec--;
                if (ajaxTimec === 0) {
                    //关闭弹框
                    wx.hideLoading();
                }
            }
        })
    })
}

//弹出框处理
export const showModel = ({ content }) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })

}


//弹出框处理
export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}


//弹出框处理
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 10000,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}


//弹出框处理
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
       wx.requestPayment({
           ...pay,
           success:(result)=>{
               resolve(result)
           },
           fail:(err) =>{
               reject(err);
           }
       })
    })
}