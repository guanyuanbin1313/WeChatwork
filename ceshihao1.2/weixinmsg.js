const gohttp = require('gohttp');
const wxkey = require('./wxkey');
const formatMsg = require('./fmtwxmsg');

var token_api = `https://api.weixin.qq.com/cgi-bin/token`
    +`?grant_type=client_credential`
    +`&appid=${wxkey.appid}&secret=${wxkey.secret}`;

var menu_data = {
    button:[
        {
            name:"菜单类型",
            sub_button:[
                {
                    name:"扫码",
                    type:"scancode_waitmsg",
                    key:"Scan"
                },
                {
                    name:"拍照",
                    type:"pic_sysphoto",
                    key:"drawing"
                },
                {
                    name:"发图",
                    type:"pic_weixin",
                    key:"ptoto"
                },
                {
                    name:"位置",
                    type:"location_select",
                    key:"position"
                }
            ]
        },
        {
            name:"send",
            type:"click",
            key:"send-msg"
        },
        {
            name: "photo",
            type: "pic_weixin",
            key: "send-phtoto"
        }
    ]
};

(async() =>{
    let ret = await gohttp.get(token_api);
    
    let t = JSON.parse(ret);
    if(t.access_token === undefined){
        console.log(ret);
        process.exit(-1);
    }
    let create_menu_api = `https://api.weixin.qq.com/cgi-bin/menu/create`
        +`?access_token=${t.access_token}`;

    ret = await gohttp.post(create_menu_api,{
        body:menu_data,
        headers:{
            'content-type':'text/plain'
        }
    });

    console.log(ret);

})();

function help() {
    return `这是一个消息回复测试程序，会把消息原样返回，但是目前不支持视频类型的消息`;
}

function userMsg(wxmsg, retmsg) {
    if (wxmsg.MsgType == 'text') {
        if (wxmsg.Content == 'help' || wxmsg.Content == '?' || wxmsg.Content == '？') {
            retmsg.msg = help();
            retmsg.msgtype = 'text';
            return formatMsg(retmsg);
        } else if (wxmsg.Content == 'hello' || wxmsg.Content == '你好') {

            retmsg.msg = '你好，你可以输入一些关键字测试消息回复，输入help/?获取帮助';
            retmsg.msgtype = 'text';
            return formatMsg(retmsg);

        } else if (wxmsg.Content == 'who') {
            retmsg.msg = '姓名：官源斌  学号：2017011705  班级：20117软件1班';
            retmsg.msgtype = 'text';
            return formatMsg(retmsg);
        } else {
            retmsg.msg = wxmsg.Content;
            retmsg.msgtype = wxmsg.MsgType;
            return formatMsg(retmsg);
        }
    } else {
        switch (wxmsg.MsgType) {
            case 'event':
            case 'image':
            case 'voice':
                retmsg.msg = wxmsg.MediaId;
                retmsg.msgtype = wxmsg.MsgType;
                break;
            default:
                retmsg.msg = '不支持的类型';
        }

        return formatMsg(retmsg);
    }
}

exports.userMsg = userMsg;
exports.help = help;

exports.msgDispatch = function msgDispatch(wxmsg, retmsg) {
    return userMsg(wxmsg, retmsg);
};