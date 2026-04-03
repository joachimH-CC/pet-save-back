<template>
    <div>
        <div class="page-title">
            评论详情
        </div>
        <div class="review-detail">
            <div class="review-detail-container">
                <el-descriptions title="评论信息" :column="2" style="margin-right: 200px;">
                    <el-descriptions-item label="评论ID">{{ form.commentId }}</el-descriptions-item>
                    <el-descriptions-item label="用户名">{{ form.nickName }}</el-descriptions-item>
                    <el-descriptions-item label="评论帖子"> {{ form.commentPost }}</el-descriptions-item>
                    <el-descriptions-item label="评论时间">{{ form.createTime }}</el-descriptions-item>
                    <el-descriptions-item label="当前状态">
                        <el-tag size="mini" v-if="form.status == 0" type="success">未违规</el-tag>
                        <el-tag size="mini" v-if="form.status == 1" type="danger">违规</el-tag>
                        <el-tag size="mini" v-if="form.status == 2" type="warning">待审核</el-tag>
                    </el-descriptions-item>
                </el-descriptions>

                <el-divider></el-divider>
                <el-descriptions title="评论内容" :column="1" :colon="false">
                    <el-descriptions-item>{{ form.content }}</el-descriptions-item>
                </el-descriptions>
                <el-divider></el-divider>
                <el-descriptions title="审核内容" :column="1" :colon="false">
                    <el-descriptions-item>{{ form.remark }}</el-descriptions-item>
                </el-descriptions>
                <el-divider></el-divider>
                <div style="width: 800px;margin:50px 30px;">
                    <el-form ref="reviewFormRef" :model="reviewForm" label-width="100px" size="small">
                        <el-form-item label="审核操作" prop="userName">
                            <el-select v-model="reviewForm.status" placeholder="请选择" size="mini">
                                <el-option v-for="item in dict.type.user_comment_status" :key="item.value"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审核内容" prop="remark">
                            <el-input type="textarea" size="mini" placeholder="请输入审核内容"
                                v-model="reviewForm.remark"></el-input>
                        </el-form-item>

                    </el-form>
                </div>
                <el-row type="flex" justify="center" style="margin-top: 30px;">
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                    <el-button @click="returnPage">返回</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { detailComment, editComment } from '@/api/petAdopt/comment';
import { MessageBox } from 'element-ui';


export default {
    name: "ReviewDetail",
    dicts: ["user_comment_status"],
    data() {
        return {
            form: {
                commentId: undefined,//合同编号
                nickName: undefined,
                commentPost: undefined,
                createTime: undefined,
                status: undefined,
                content: undefined,
                remark: undefined
            },
            reviewForm: {
                commentId: undefined,
                status: undefined,
                remark: undefined
            }
        }
    },
    watch: {
        // 监听路由变化
        $route(to, from) {
            const data = to.params;
            console.log(data);
            if (data.id) {
                this.getReviewDetail(data.id);
            }
        }
    },
    mounted() {
        const data = this.$route.params
        console.log(data);
        if (data.id) {
            this.getReviewDetail(data.id)
        }
    },
    computed: {
    },
    methods: {
        getReviewDetail(id) {
            detailComment(id).then(res => {
                console.log(res);
                this.$nextTick(() => {
                    this.form = { ...res.data }
                    this.reviewForm.status = res.data.status
                })
            })
        },
        handleSubmit() {
            this.reviewForm.commentId = this.form.commentId

            editComment(this.reviewForm).then(res => {
                this.$message.success("操作成功")
                this.reviewForm.remark = undefined
                this.resetForm.commentId = undefined
                this.returnPage()
            })



        },
        // 重置
        resetForm(val) {
            this.$refs[`${val}Ref`].resetFields()
        },
        //回到合同管理页面
        returnPage() {
            this.$router.push("/content/userReview")
        },
    }
}
</script>

<style lang="scss" scoped>
.review-detail {
    padding: 20px;
    box-sizing: border-box;

    .review-detail-container {
        padding: 20px;
        background-color: white;

        .el-descriptions {
            padding: 10px 70px;
            color: rgb(148, 148, 148);

        }


    }
}
</style>