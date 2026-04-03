<template>
    <div>
        <div class="page-title">
            用户评论
        </div>
        <div class="user-review">
            <div class="user-review-container">
                <el-form label-width="70px" ref="queryFormRef" :model="queryForm" inline>
                    <el-form-item label="用户名" prop="nickName">
                        <el-input size="mini" placeholder="请输入用户名" v-model="queryForm.nickName"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="queryForm.status" placeholder="请选择" size="mini">
                            <el-option v-for="item in dict.type.user_comment_status" :key="item.value"
                                :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
                        <el-button size="mini" @click="resetForm('queryForm'), getReviewList()">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="reviewList" style="width: 100%;" border>
                    <el-table-column prop="commentId" label="评论ID" align="center" width="100"></el-table-column>
                    <el-table-column prop="content" label="评论内容" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="nickName" label="用户名" align="center" width="150"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column prop="commentPost" label="评论帖子" align="center"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" label="评论时间" align="center">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center" width="100">
                        <template #default="{ row }">
                            <el-tag size="mini" v-if="row.status == 0" type="success">未违规</el-tag>
                            <el-tag size="mini" v-if="row.status == 1" type="danger">违规</el-tag>
                            <el-tag size="mini" v-if="row.status == 2" type="warning">待审核</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right" width="120">
                        <template #default="{ row }">
                            <el-button type="text" @click="showDetail(row)" size="mini">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" style="margin-top: 20px;" v-if="pagination">
                    <el-pagination background layout="total,prev,pager, next, sizes" :total="pagination.total"
                        :page-size="pagination.pageSize" :current-page.sync="pagination.pageNum"
                        @size-change="handleSizeChange" @current-change="getReviewList">
                    </el-pagination>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { query } from '@/utils/common';
import { listComment } from '@/api/petAdopt/comment';
export default {
    name: 'UserReview',
    dicts: ["user_comment_status"],
    data() {
        return {
            //评论列表
            reviewList: [],
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
        this.getReviewList()
    },
    methods: {
        //获取租户列表
        getReviewList() {
            const query = this.queryForm || {}
            const { total, ...rest } = this.pagination
            listComment({ ...rest, ...query }).then(res => {
                console.log(res);

                this.reviewList = res.rows
                this.pagination.total = res.total

            })
        },
        //查询
        handleQuery() {
            const hasInput = query(this.queryForm)
            if (!hasInput) return this.$message.warning("请输入数据!")
            this.pagination.pageNum = 1
            this.getReviewList()
        },
        //点击分页页数时更新pageSize
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.pageNum = 1
            this.getReviewList()
        },
        //跳转至评论详情页面
        showDetail(row) {
            this.$router.push({
                name: "ReviewDetail",
                params: {
                    id: row.commentId
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
.user-review {
    padding: 20px;
    box-sizing: border-box;

    .user-review-container {
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