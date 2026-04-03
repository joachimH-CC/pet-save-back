<template>
    <div>
        <div class="page-title">
            用户疑问
        </div>
        <div class="user-question">
            <div class="user-question-container">
                <el-form label-width="70px" ref="queryFormRef" :model="queryForm" inline>
                    <el-form-item label="用户名" prop="nickName">
                        <el-input size="mini" placeholder="请输入用户名" v-model="queryForm.nickName"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="queryForm.status" placeholder="请选择" size="mini">
                            <el-option v-for="item in dict.type.user_question_status" :key="item.value"
                                :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
                        <el-button size="mini" @click="resetForm('queryForm'), getQuestionList()">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="questionList" style="width: 100%;" border>
                    <el-table-column prop="feedbackId" label="问题ID" align="center" width="100"></el-table-column>
                    <el-table-column prop="questionContent" label="问题内容" align="center" width="300"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column prop="nickName" label="用户名" align="center"></el-table-column>
                    <el-table-column prop="askTime" label="提问时间" align="center"></el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template #default="{ row }">
                            <el-tag v-if="row.status == 1" type="success">已解决</el-tag>
                            <el-tag v-if="row.status == 0" type="primary">未解决</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="answerNum" label="回复次数" align="center" width="100"></el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template #default="{ row }">
                            <el-button type="text" @click="showDetail(row)" size="mini">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" style="margin-top: 20px;" v-if="pagination">
                    <el-pagination background layout="total,prev,pager, next, sizes" :total="pagination.total"
                        :page-size="pagination.pageSize" :current-page.sync="pagination.pageNum"
                        @size-change="handleSizeChange" @current-change="getQuestionList">
                    </el-pagination>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import { query } from '@/utils/common';
import { listUserQuestion } from '../../../../api/petAdopt/userQuestion';
export default {
    name: 'UserQuestion',
    dicts: ["user_question_status"],
    data() {
        return {
            //评论列表
            questionList: [],
            queryForm: {
                nickName: undefined,
                status: undefined,
            },
            // 分页
            pagination: {
                pageSize: 10,
                pageNum: 1,
                total: 0,
            },
        }
    },
    created() {
        this.getQuestionList()
    },
    methods: {
        //获取疑问列表
        getQuestionList() {
            const query = this.queryForm || {}
            const { total, ...rest } = this.pagination
            listUserQuestion({ ...rest, ...query }).then(res => {
                console.log(res);
                this.questionList = res.data.records
                this.pagination.total = res.data.total

            })
        },
        //查询
        handleQuery() {
            const hasInput = query(this.queryForm)
            if (!hasInput) return this.$message.warning("请输入数据!")
            this.pagination.pageNum = 1
            this.getQuestionList()
        },
        //点击分页页数时更新pageSize
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.pageNum = 1
            this.getQuestionList()
        },
        //跳转至评论详情页面
        showDetail(row) {
            console.log(row.feedbackId);

            this.$router.push({
                name: "QuestionDetail",
                params: {
                    id: row.feedbackId
                }
            })
        },
        // 重置
        resetForm(val) {
            this.$refs[`${val}Ref`].resetFields()
        },
    }
}
</script>

<style lang="scss">
.user-question {
    padding: 20px;
    box-sizing: border-box;

    .user-question-container {
        padding: 20px;
        background-color: white;

        .el-table {
            margin-top: 20px;
        }
    }

    .el-dialog__body {
        padding: 10px 70px 40px 30px !important;
    }

    .el-dialog__header {
        border-bottom: 1px solid #d1d2d2;
    }


}
</style>