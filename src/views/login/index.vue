<template>
    <div class="login-container">
        <van-nav-bar
                class="app-nav-bar"
                title="登录"
                left-arrow
                @click-left="$router.back()"
        />

        <!-- 登录表单 -->
        <van-cell-group>
            <van-form @submit="onSubmit"
                      ref="login-form"
                      :show-error="false"
                      :show-error-message="false"
                      @failed="onFailed"
            >
            <van-field
                    :rules="[{ required: true, message: '请填写手机号' }]"
                    v-model="user.mobile"
                    name="mobile"
                    icon-prefix="toutiao"
                    left-icon="shouji"
                    placeholder="请输入手机号"
            />
            <van-field
                    v-model="user.code"
                    clearable
                    icon-prefix="toutiao"
                    left-icon="yanzhengma"
                    placeholder="请输入验证码"
                    name="code"
                    :rules="[{ required: true, message: '请填写验证码' }]"
            >
                <template #button>
                    <van-count-down
                            v-if="isCountDownShow"
                            :time="1000 * 60"
                            format="ss s"
                            @finish="isCountDownShow = false"
                    />
                    <van-button
                            v-else
                            :loading="isSendSmsLoading"
                            class="send-btn"
                            size="mini"
                            round
                            @click.prevent="onSendSms"
                    >发送验证码</van-button>
                </template>
            </van-field>
            </van-form>
        </van-cell-group>
        <div class="login-btn-wrap">
            <van-button :loading="isSendSmsLoading" class="login-btn" type="info" native-type="submit" block @click="onLogin">登录</van-button>
        </div>
        <!-- /登录表单 -->
    </div>
</template>

<script>
    import { login, sendSms } from '@/api/user'
    export default {
        name: 'LoginIndex',
        components: {},
        props: {},
        data () {
            return {
                isSendSmsLoading: false,
                isCountDownShow: false,
                user: {
                    mobile: '', // 手机号
                    code: '' // 验证码
                }
            }
        },
        computed: {},
        watch: {},
        created () {},
        mounted () {},
        methods: {
            async onSendSms () {
                try {
                    // 校验手机号码
                    await this.$refs['login-form'].validate('mobile')

                    // 验证通过，请求发送验证码
                    this.isSendSmsLoading = true // 展示按钮的 loading 状态，防止网络慢用户多次点击触发发送行为
                    await sendSms(this.user.mobile)

                    // 短信发出去了,显示倒计时，关闭发送按钮
                        this.isCountDownShow = true

                    // 倒计时结束 -> 隐藏倒计时，显示发送按钮（监视倒计时的 finish 事件处理）
                } catch (err) {
                    // try 里面任何代码的错误都会进入 catch
                    // 不同的错误需要有不同的提示，那就需要判断了
                    let message = ''
                    if (err && err.response && err.response.status === 429) {
                        // 发送短信失败的错误提示
                        message = '发送太频繁了，请稍后重试'
                    } else if (err.name === 'mobile') {
                        // 表单验证失败的错误提示
                        message = err.message
                    } else {
                        // 未知错误
                        message = '发送失败，请稍后重试'
                    }

                    // 提示用户
                    this.$toast({
                        message,
                        position: 'top'
                    })
                }

                // 无论发送验证码成功还是失败，最后都要关闭发送按钮的 loading 状态
                this.isSendSmsLoading = false

                // 发送失败，显示发送按钮，关闭倒计时
                  this.isCountDownShow = false
            },
            onFailed (error) {
                if (error.errors[0]) {
                    this.$toast({
                        message: error.errors[0].message, // 提示消息
                        position: 'top' // 防止手机键盘太高看不见提示消息
                    })
                }
            },
            onSubmit(values) {
                console.log('submit', values);
            },
            async onLogin () {
                // 开始转圈圈
                this.$toast.loading({
                    duration: 0, // 持续时间，0表示持续展示不停止
                    forbidClick: true, // 是否禁止背景点击
                    message: '登录中...' // 提示消息
                })

                try {
                    const res = await request({
                        method: 'POST',
                        url: '/app/v1_0/authorizations',
                        data: this.user
                    })
                    console.log('登录成功', res)
                    // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
                    this.$toast.success('登录成功')
                } catch (err) {
                    console.log('登录失败', err)
                    this.$toast.fail('登录失败，手机号或验证码错误')
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .login-container {
        .send-btn {
            width: 76px;
            height: 23px;
            background-color: #ededed;
            .van-button__text {
                font-size: 11px;
                color: #666666;
            }
        }
        .login-btn-wrap {
            padding: 26px 16px;
            .login-btn {
                background-color: #6db4fb;
                border: none;
                .van-button__text {
                    font-size: 15px;
                }
            }
        }
    }
</style>