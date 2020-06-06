import { getArticles } from '@/api/article'

export default {
    name: 'ArticleList',
    components: {},
    props: {
        channel: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            articles: [], // 数据列表
            loading: false, // 控制加载中的 loading 状态
            finished: false, // 控制加载结束的状态，当加载结束，不再触发加载更多
            timestamp: null // 获取下一页数据的时间戳
        }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
        async onLoad () {
            console.log('onLoad')
            // 1. 请求获取数据
            const { data } = await getArticles({
                channel_id: this.channel.id, // 频道 ID
                timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳，timestamp 相当于页码，请求最新数据使用当前最新时间戳，下一页数据使用上一次返回的数据中的时间戳
                with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
            })

            // 2. 把数据放到 list 数组中
            const { results } = data.data
            this.articles.push(...results)

            // 3. 设置本次加载状态结束，它才可以判断是否需要加载下一次，否则就会永远的停在这里
            this.loading = false

            // 4. 数据全部加载完成
            if (results.length) {
                // 更新获取下一页数据的页码
                this.timestamp = data.data.pre_timestamp
            } else {
                // 没有数据了，把加载状态设置结束，不再触发加载更多
                this.finished = true
            }
        }
    }
}