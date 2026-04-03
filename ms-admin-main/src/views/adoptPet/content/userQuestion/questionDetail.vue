<template>
    <div>
        <div class="page-title">
            问题详情
        </div>
        <div class="question-detail">
            <div class="question-detail-container">
                <el-descriptions title="问题信息" :column="2" style="margin-right: 200px;">
                    <el-descriptions-item label="问题ID">{{ form.feedbackId }}</el-descriptions-item>
                    <el-descriptions-item label="用户名">{{ form.nickName }}</el-descriptions-item>
                    <el-descriptions-item label="提问时间">{{ form.askTime }}</el-descriptions-item>
                    <el-descriptions-item label="当前状态">
                        <el-tag v-if="form.status == 0" size="mini"> 未解决</el-tag>
                        <el-tag v-if="form.status == 1" size="mini"> 已解决</el-tag>
                    </el-descriptions-item>
                </el-descriptions>

                <el-divider></el-divider>
                <el-descriptions title="问题内容" :column="1" :colon="false">
                    <el-descriptions-item>{{ form.questionContent }}</el-descriptions-item>
                </el-descriptions>
                <el-divider></el-divider>
                <el-descriptions title="回复历史" :column="1" style="margin-right: 200px;" :colon="false">
                    <el-descriptions-item v-for="(item, index) in form.recordList" :key="index">
                        <el-card class="box-card">
                            <div slot="header">
                                <i class="el-icon-time time"></i><span>{{ item.createTime }}</span>
                                <el-button style="float: right; padding: 3px 0" type="text"
                                    @click="delRecord(item.feedbackRecordId)"><i class="el-icon-delete"></i></el-button>
                            </div>
                            <div style="margin: 10px;">
                                {{ item.answerContent }}
                            </div>
                        </el-card></el-descriptions-item>
                </el-descriptions>
                <el-divider></el-divider>
                <div style="width: 800px;margin:50px 30px;">
                    <el-form :rules="rules" ref="questionFormRef" :model="questionForm" label-width="100px"
                        size="small">
                        <!-- <el-form-item label="问题状态" prop="userName">
                            <el-select v-model="questionForm.status" placeholder="请选择" size="mini">
                                <el-option key="0" label="未解决" :value="0"></el-option>
                                <el-option key="1" label="已解决" :value="1"></el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="回复内容" prop="answerContent">
                            <el-input type="textarea" size="mini" placeholder="请输入回复内容"
                                v-model="questionForm.answerContent"></el-input>
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
import { delResponse, detailQuestion, responseQuestion } from '@/api/petAdopt/userQuestion';


export default {
    name: "QuestionDetail",
    data() {
        return {
            form: {
                feedbackId: undefined,
                nickName: undefined,
                askTime: undefined,
                status: undefined,
                questionContent: undefined,
                recordList: []
            },
            questionForm: {
                // status: undefined,
                feedbackId: undefined,
                answerContent: undefined
            },
            rules: {
                answerContent: [
                    { required: true, trigger: "blur", message: "请输入回复" },
                ],

            }
        }
    },
    watch: {
        // 监听路由变化
        $route(to, from) {
            const data = to.params;
            console.log(data);
            if (data.id) {
                this.getQuestionDetail(data.id);
                this.questionForm.feedbackId = data.id;
            }
        }
    },
    mounted() {
        const data = this.$route.params
        console.log(data);
        if (data.id) {
            this.getQuestionDetail(data.id)
            this.questionForm.feedbackId = data.id
        }
    },
    computed: {
    },
    methods: {
        getQuestionDetail(id) {
            detailQuestion(id).then(res => {
                console.log(res);
                this.$nextTick(() => {
                    this.form = JSON.parse(JSON.stringify(res.data))
                })
            })
        },
        handleSubmit() {
            this.$refs["questionFormRef"].validate(async valid => {
                if (!valid) return
                //过滤不需要的参数
                responseQuestion(this.questionForm).then(res => {
                    console.log(res);

                    this.$message.success(res.msg)
                    this.getQuestionDetail(this.form.feedbackId)
                    this.resetForm("questionForm")
                })


            })
        },
        delRecord(id) {
            this.$confirm('是否删除该条回复记录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delResponse(id).then(res => {
                    console.log(res);
                    this.$message.success(res.msg)
                    this.getQuestionDetail(this.form.feedbackId)
                })
            }).catch(() => {
                this.$message.info('已取消删除')
            });
        },
        // 重置
        resetForm(val) {
            this.$refs[`${val}Ref`].resetFields()
        },
        //回到用户疑问页面
        returnPage() {
            this.$router.push("/content/userQuestion")
        },
    }
}
</script>

<style lang="scss" scoped>
.question-detail {
    padding: 20px;
    box-sizing: border-box;

    .question-detail-container {
        padding: 20px;
        background-color: white;

        .box-card {
            min-width: 400px;
        }

        .el-descriptions {
            padding: 10px 70px;
            color: rgb(148, 148, 148);

            .time {
                margin: 0 5px;
                font-size: 16px;
                color: #1890ff;
            }
        }


    }
}
</style>