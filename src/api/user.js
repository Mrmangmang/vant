/**
 * 获取用户频道列表
 */
import request from "../utils/request";

export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/channels'
    })
}