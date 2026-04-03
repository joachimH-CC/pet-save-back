<template>
    <div>
        <div class="page-title">
            测试管理
        </div>
        <div class="test">
            <div class="test-container">
                <el-form label-width="70px" ref="queryFormRef" :model="queryForm" inline>
                    <el-form-item label="标题" prop="title">
                        <el-input size="mini" placeholder="请输入标题" v-model="queryForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="knowledgeType">
                        <el-select v-model="queryForm.knowledgeType" placeholder="请选择状态" size="mini">
                            <el-option key="2" label="已发布" :value="2"></el-option>
                            <el-option key="4" label="草稿" :value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="难度" prop="testDifficulty">
                        <el-select v-model="queryForm.testDifficulty" placeholder="请选择" size="mini">
                            <el-option v-for="item in dict.type.test_level_type" :key="item.value" :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
                        <el-button size="mini" @click="resetForm('queryForm'), getTestList()">重置</el-button>
                    </el-form-item>
                </el-form>
                <div style="display: flex;">
                    <el-button size="mini" icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
                </div>
                <el-table :data="testList" style="width: 100%;" border>
                    <el-table-column prop="knowledgeId" label="测试ID" align="center" width="100"></el-table-column>
                    <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="updateTime" label="发布时间" align="center"></el-table-column>
                    <el-table-column prop="updateBy" label="发布者" align="center"></el-table-column>
                    <el-table-column prop="testDifficulty" label="难度" align="center">
                        <template #default="{ row }">
                            <el-tag v-if="row.testDifficulty == '简单'" type="success">简单</el-tag>
                            <el-tag v-if="row.testDifficulty == '中等'" type="warning">中等</el-tag>
                            <el-tag v-if="row.testDifficulty == '困难'" type="danger">困难</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="knowledgeType" label="状态" align="center">
                        <template #default="{ row }">
                            <el-tag v-if="row.knowledgeType == 2" type="success">已发布</el-tag>
                            <el-tag v-if="row.knowledgeType == 4" type="primary">草稿</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template #default="{ row }">
                            <el-button v-if="row.knowledgeType == 4" type="text" @click="handleEdit(row)"
                                size="mini">编辑</el-button>
                            <el-button v-if="row.knowledgeType == 2" type="text" @click="showDetail(row)"
                                size="mini">查看</el-button>
                            <el-button type="text" @click="handleDel(row)" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" style="margin-top: 20px;" v-if="pagination">
                    <el-pagination background layout="total,prev,pager, next, sizes" :total="pagination.total"
                        :page-size="pagination.pageSize" :current-page.sync="pagination.pageNum"
                        @size-change="handleSizeChange" @current-change="getTestList">
                    </el-pagination>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import { query } from '@/utils/common';
import { delTest, listTest } from '@/api/petAdopt/test';
export default {
    name: 'Test',
    dicts: ["test_level_type"],
    data() {
        return {
            //评论列表
            testList: [],
            queryForm: {
                title: undefined,
                knowledgeType: undefined,
                testDifficulty: undefined,
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
        this.getTestList()
    },
    methods: {
        //获取课程列表
        getTestList() {
            const query = this.queryForm || {}
            const { total, ...rest } = this.pagination
            listTest({ ...rest, ...query }).then(res => {
                console.log(res);
                this.testList = res.data.records
                this.pagination.total = res.data.total

            })
        },
        //查询
        handleQuery() {
            const hasInput = query(this.queryForm)
            if (!hasInput) return this.$message.warning("请输入数据!")
            this.pagination.pageNum = 1
            this.getTestList()
        },
        //点击分页页数时更新pageSize
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.pageNum = 1
            this.getTestList()
        },
        //跳转至评论详情页面
        showDetail(row) {
            this.$router.push({
                name: "TestDetail",
                params: {
                    id: row.knowledgeId
                }
            })
        },
        handleAdd() {
            this.mode = "add"
            this.$router.push("/knowledge/editTest");
        },
        handleEdit(row) {
            this.$router.push({
                name: "EditTest",
                params: {
                    mode: "edit",
                    id: row.knowledgeId
                }
            })
        },
        //删除
        handleDel(row) {
            MessageBox.confirm(`是否删除改测试`, "系统提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: 'warning',
            }).then((res) => {
                delTest(row.knowledgeId).then(res => {
                    this.$message.success("删除成功!")
                    if (this.pagination.total <= this.pagination.pageSize + 1) this.pagination.pageNum = 1
                    this.getTestList()
                })

            }).catch((err) => {
            });
        },
        // 重置
        resetForm(val) {
            this.$refs[`${val}Ref`].resetFields()
        },
    }
}
</script>

<style lang="scss">
.test {
    padding: 20px;
    box-sizing: border-box;

    .test-container {
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