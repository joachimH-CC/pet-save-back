<template>
    <div>
        <div class="page-title">
            课程管理
        </div>
        <div class="knowledge">
            <div class="knowledge-container">
                <el-form label-width="70px" ref="queryFormRef" :model="queryForm" inline>
                    <el-form-item label="标题" prop="title">
                        <el-input size="mini" placeholder="请输入标题" v-model="queryForm.title"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="课程种类" prop="classType">
                        <el-select v-model="queryForm.classType" placeholder="请选择" size="mini">
                            <el-option v-for="item in dict.type.pet_class_type" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="课程状态" prop="knowledgeType">
                        <el-select v-model="queryForm.knowledgeType" placeholder="请选择状态" size="mini">
                            <el-option key="1" label="已发布" :value="1"></el-option>
                            <el-option key="0" label="草稿" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
                        <el-button size="mini" @click="resetForm('queryForm'), getKnowledgeList()">重置</el-button>
                    </el-form-item>
                </el-form>
                <div style="display: flex;">
                    <el-button size="mini" icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
                </div>
                <el-table :data="knowledgeList" style="width: 100%;" border>
                    <el-table-column prop="knowledgeId" label="课程ID" align="center" width="100"></el-table-column>
                    <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="updateTime" label="发布时间" align="center"></el-table-column>
                    <el-table-column prop="updateBy" label="发布者" align="center"></el-table-column>
                    <el-table-column prop="knowledgeType" label="状态" align="center">
                        <template #default="{ row }">
                            <el-tag v-if="row.knowledgeType == 1" type="success">已发布</el-tag>
                            <el-tag v-if="row.knowledgeType == 0" type="primary">草稿</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template #default="{ row }">
                            <el-button v-if="row.knowledgeType == 0" type="text" @click="handleEdit(row)"
                                size="mini">编辑</el-button>
                            <el-button v-if="row.knowledgeType == 1" type="text" @click="showDetail(row)"
                                size="mini">查看</el-button>
                            <el-button type="text" @click="handleDel(row)" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" style="margin-top: 20px;" v-if="pagination">
                    <el-pagination background layout="total,prev,pager, next, sizes" :total="pagination.total"
                        :page-size="pagination.pageSize" :current-page.sync="pagination.pageNum"
                        @size-change="handleSizeChange" @current-change="getKnowledgeList">
                    </el-pagination>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import { query } from '@/utils/common';
import { listLesson, delLesson } from '@/api/petAdopt/lesson';
export default {
    name: 'lessson',
    dicts: ["pet_class_type"],
    data() {
        return {
            //评论列表
            knowledgeList: [],
            queryForm: {
                title: undefined,
                knowledgeType: undefined,//状态
                classType: undefined,
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
        this.getKnowledgeList()
    },
    methods: {
        //获取课程列表
        getKnowledgeList() {
            const query = this.queryForm || {}
            const { total, ...rest } = this.pagination
            listLesson({ ...rest, ...query }).then(res => {
                console.log(res);
                this.knowledgeList = res.data.records
                this.pagination.total = res.data.total

            })
        },
        //查询
        handleQuery() {
            const hasInput = query(this.queryForm)
            if (!hasInput) return this.$message.warning("请输入数据!")
            this.pagination.pageNum = 1
            this.getKnowledgeList()
        },
        //点击分页页数时更新pageSize
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.pageNum = 1
            this.getKnowledgeList()
        },
        //跳转至评论详情页面
        showDetail(row) {
            this.$router.push({
                name: "LessonDetail",
                params: {
                    id: row.knowledgeId
                }
            })
        },
        handleAdd() {
            this.mode = "add"
            this.$router.push("/knowledge/editLesson");
        },
        handleEdit(row) {
            this.$router.push({
                name: "EditLesson",
                params: {
                    mode: "edit",
                    id: row.knowledgeId
                }
            })
        },
        //删除
        handleDel(row) {
            MessageBox.confirm(`是否删除课程`, "系统提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: 'warning',
            }).then((res) => {
                delLesson(row.knowledgeId).then(res => {
                    this.$message.success("删除成功!")
                    if (this.pagination.total <= this.pagination.pageSize + 1) this.pagination.pageNum = 1
                    this.getKnowledgeList()
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
.knowledge {
    padding: 20px;
    box-sizing: border-box;

    .knowledge-container {
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