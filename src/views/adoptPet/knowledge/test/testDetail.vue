<template>
    <div>
        <div class="page-title">测试详情</div>

        <div class="test-detail">
            <div class="test-detail-container">
                <el-card class="box-card" style="margin:10px;">
                    <el-descriptions title="基础信息" :column="3">
                        <el-descriptions-item label="测试ID">{{ form.knowledgeId }}</el-descriptions-item>
                        <el-descriptions-item label="测试标题">{{ form.title }}</el-descriptions-item>
                        <el-descriptions-item label="测试难度">
                            <el-tag size="mini" v-if="form.testDifficulty == '简单'" type="success">简单</el-tag>
                            <el-tag size="mini" v-if="form.testDifficulty == '中等'" type="warning">中等</el-tag>
                            <el-tag size="mini" v-if="form.testDifficulty == '困难'" type="danger">困难</el-tag>
                        </el-descriptions-item>
                    </el-descriptions>
                </el-card>
                <el-descriptions :colon="false" :column="1">
                    <el-descriptions-item v-for="(Q, idx) in questions" :key="idx">
                        <el-card class="box-card item-card">
                            <div slot="header" class="clearfix">
                                <span>{{ "题目" + (idx + 1) + " :" + Q.stem }}</span><span v-if="Q.type == 1">[多选]</span>
                                <el-tag style="float: right; padding: 3px 5px" type="text">{{ "答案 : " + Q.answer
                                    }}</el-tag>
                            </div>
                            <div v-for="(opt, index) in Q.optionList" :key="index" class="item">
                                {{ String.fromCharCode(65 + index) + " " + opt }}
                            </div>
                            <div style="margin-top: 5px;">{{ "答案解析 :" + Q.analysis }}</div>
                        </el-card>
                    </el-descriptions-item>

                </el-descriptions>

                <el-divider></el-divider>
                <el-row type="flex" justify="center" style="margin-top: 30px;">
                    <el-button @click="returnPage">返回</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { detailTest } from '@/api/petAdopt/test'

export default {
    name: "TestDetail",
    data() {
        return {
            form: {
                knowledgeId: undefined,
                title: undefined,
                testDifficulty: undefined,
            },
            questions: [],
        };
    },
    watch: {
        // 监听路由变化
        $route(to, from) {
            const data = to.params;
            console.log(data);
            if (data.id) {
                this.getTestDetal(data.id);
            }
        }
    },
    mounted() {
        const data = this.$route.params
        console.log(data);
        if (data.id) {
            this.getTestDetal(data.id)
        }
    },
    methods: {
        getTestDetal(id) {
            detailTest(id).then(res => {
                console.log(res);
                const { title, testDifficulty } = res.data
                this.form.title = title
                this.form.testDifficulty = testDifficulty
                this.form.knowledgeId = id
                this.questions = res.data.topicList.map(item => {
                    return {
                        stem: item.stem,
                        optionList: JSON.parse(item.options).map(opt => opt.value),
                        analysis: item.analysis,
                        answer: item.answer,
                        type: item.type,
                        topicId: item.topicId
                    }
                })
            })
        },
        returnPage() {
            this.$router.push("/knowledge/test");
        },
        isCorrectAnswer(question, optionIndex) {
            return question.answer === String.fromCharCode(65 + optionIndex);
        }
    }
}
</script>

<style lang="scss" scoped>
.test-detail {
    padding: 20px;
    box-sizing: border-box;

    .test-detail-container {
        padding: 20px;
        background-color: white;

        .el-descriptions {
            margin-right: 10px;
            color: rgb(148, 148, 148);

            .item-card {
                width: 100%;
            }
        }

        .box-card {
            font-size: 13px;
            margin-bottom: 10px;

            .item {
                padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
            }
        }

        .test-content {
            padding: 10px 70px;
        }

    }
}
</style>