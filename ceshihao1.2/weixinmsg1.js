const formatMsg = require('./fmtwxmsg');

function help() {
    return `这是一个消息回复测试程序，会把消息原样返回，但是目前不支持视频类型的消息`;
}

function eventMsg(wxmsg, retmsg) {
    //默认让返回消息类型为文本
    retmsg.msgtype = 'text';

    switch (wxmsg.Event) {
        case 'subscribe':
            retmsg.msg = '欢迎关注，你好噢';
            return formatMsg(retmsg);
        case 'unsubscribe':
            console.log(wxmsg.FromUserName, '取消关注');
            break;
        case 'VIEW':
            console.log(wxmsg.EventKey);
            break;
        case 'CLICK':
            retmsg.msg = wxmsg.EventKey;
            return formatMsg(retmsg);
        default:
            return '';
    }
    return '';
}

function userMsg(wxmsg, retmsg) {
    /*
        检测是否为文本消息，如果是文本消息则先要检测是不是支持的关键词回复。
    */
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