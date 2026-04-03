<template>
    <div class="common">
        <div class="page-title">
            公告编辑
        </div>
        <div class="notice-edit">
            <div class="notice-edit-container">
                <el-form :rules="rules" ref="formRef" :model="form" label-width="120px" size="small">
                    <el-form-item label="标题" prop="title">
                        <el-input placeholder="请输入标题" v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option v-for="item in dict.type.pet_annouce_type" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" prop="status" v-if="form.status != 1">
                        <el-select v-model="form.status" placeholder="请选择公告状态">
                            <el-option key="2" label="草稿" value="2"></el-option>
                            <el-option key="0" label="已发布" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="过期时间" :prop="form.status == 2 ? undefined : 'expirationTime'"
                        :required="form.status != 2">
                        <el-date-picker v-model="form.expirationTime" type="date" placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss" :disabled="form.status == 2">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="公告海报" prop="posterUrl">
                        <ImageUpload v-model="form.posterUrl" :limit="1" :fileSize="2" :isShowTip="false" />
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <el-input size="400px" autosize v-model="form.content" type="textarea"
                            placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-form>
                <el-row type="flex" justify="center">
                    <el-button type="primary" @click="handleSubmit">提交</el-button>
                    <el-button icon="el-icon-caret-left" @click="closeEdit">关闭</el-button>
                </el-row>
            </div>
        </div>

    </div>
</template>

<script>
import { addNotice, detailNotice, editNotice } from '@/api/petAdopt/notice'

export default {
    name: 'editNotice',
    dicts: ["anounce_status", "pet_annouce_type"],
    data() {
        return {
            mode: 'add',
            form: {
                title: undefined,
                type: undefined,
                expirationTime: undefined,
                status: undefined,
                content: undefined,
                posterUrl: undefined,
            },
            rules: {
                title: [
                    { required: true, trigger: "blur", message: "请输入标题" },
                ],
                type: [
                    { required: true, trigger: "blur", message: "请选择类型" },
                ],
                expirationTime: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入过期时间"
                        // 移除自定义验证器，改为动态控制prop属性
                    },
                ],
                status: [
                    { required: true, trigger: "blur", message: "请选择状态" },
                ],
                content: [
                    { required: true, trigger: "blur", message: "请输入内容" },
                ],
                posterUrl: [
                    { required: true, trigger: "blur", message: "请选择公告海报" },
                ],
            },
            announceId: undefined,
        }
    },
    watch: {
        // 监听状态变化，当状态变为草稿时清除过期时间并触发表单更新
        'form.status'(newVal) {
            if (newVal == 2) {
                this.form.expirationTime = undefined;
                // 强制更新表单，确保动态prop生效
                this.$nextTick(() => {
                    if (this.$refs.formRef) {
                        // 清除可能存在的验证错误
                        this.$refs.formRef.clearValidate(['expirationTime']);
                    }
                });
            }
        }
    },
    created() {


    },
    mounted() {
        const data = this.$route.params
        if (data.mode == "edit") {
            this.mode = 'edit'
            this.getNoticeDtl(data.id)
            this.announceId = data.id
        }
        console.log(data) // 输出: 123
    },
    methods: {
        getNoticeDtl(id) {
            detailNotice(id).then(res => {
                console.log(res);
                this.$nextTick(() => {
                    this.form = { ...res.data }
                })
            })
        },
        //提交表单
        handleSubmit() {
            console.log(this.form);

            this.$refs["formRef"].validate(async valid => {
                if (!valid) return
                //过滤不需要的参数
                const { userId, ...rest } = this.form;

                // 如果状态为草稿，移除过期时间字段
                if (rest.status === 2) {
                    delete rest.expirationTime;
                }

                try {
                    let result = {};
                    switch (this.mode) {
                        case 'add':
                            // 添加租户
                            result = await addNotice({ ...rest });
                            break;
                        case 'edit':
                            //修改租户
                            result = await editNotice({ announceId: this.announceId, ...rest });
                            break;
                    }
                    this.$message.success(result.msg);
                    this.resetForm("form");
                    this.$router.replace("/content/petNotice");
                } catch (error) {
                }
            })
        },
        // 重置
        resetForm(val) {
            this.$refs[`${val}Ref`].resetFields()
        },
        closeEdit() {
            this.resetForm("form")
            this.$router.replace("/content/petNotice")
        },


    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.notice-edit {
    padding: 20px;
    box-sizing: border-box;


    .el-input--mini .el-input__inner {
        width: 300px;
    }

    .notice-edit-container {
        padding: 40px 100px;
        //box-sizing: border-box;
        background-color: white;
    }

    .el-select.choose-rent-type {
        width: 100px !important;


    }

    .el-select {
        width: 300px;
    }

    .el-input--small {
        width: 300px;

    }

    .el-textarea__inner {
        min-height: 350px !important;
    }
}
</style>