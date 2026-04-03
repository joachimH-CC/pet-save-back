<template>
    <div class="common">
        <div class="page-title">
            课程编辑
        </div>
        <div class="lesson-edit">
            <div class="lesson-edit-container">
                <el-form :rules="rules" ref="formRef" :model="form" label-width="120px" size="small">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="classType">
                        <el-select v-model="form.classType" placeholder="请选择课程类型">
                            <el-option key="0" label="品种知识" value="0"></el-option>
                            <el-option key="1" label="养育技巧" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" prop="knowledgeType">
                        <el-select v-model="form.knowledgeType" placeholder="请选择课程状态">
                            <el-option key="0" label="草稿" value="0"></el-option>
                            <el-option key="1" label="已发布" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="课程介绍" prop="content">
                        <el-input v-model="form.content" type="textarea" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-upload :before-upload="beforeUpload" :on-success="handleSuccess" :action="uploadImgUrl"
                            :headers="headers" :file-list="fileList" list-type="picture">
                            <el-button size="small" type="primary">点击上传视频</el-button>
                        </el-upload>
                        <div v-if="form.classVideo" style="margin-top: 10px;">
                            <video width="400" height="300" :src="form.classVideo" controls></video>
                        </div>
                    </el-form-item>
                    <!-- <el-form-item label="课程视频" prop="video">
                        <el-upload accept="video/*" :limit="1" :show-file-list="true" :on-remove="handleRemove"
                            action="http://mashang.eicp.vip:5555/ms_stu_pro297/dev-api" :http-request="handleRequest"
                            :on-success="(res, file) => { form.video = (res && res.url) || file.name }">
                            <el-button size="small" type="primary">点击上传视频</el-button>
                        </el-upload>
                    </el-form-item> -->
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
import { addLesson, detailLesson, editLesson } from '../../../../api/petAdopt/lesson'
import { getToken } from "@/utils/auth";
export default {
    name: 'editNotice',
    data() {
        return {
            mode: 'add',
            form: {
                knowledgeId: undefined,
                title: undefined,
                classType: undefined,
                knowledgeType: undefined,
                content: undefined,
                classVideo: undefined,
                videoTime: undefined
            },
            rules: {
                title: [
                    { required: true, trigger: "blur", message: "请输入标题" },
                ],
                classType: [
                    { required: true, trigger: "blur", message: "请选择类型" },
                ],
                knowledgeType: [
                    { required: true, trigger: "blur", message: "请选择状态" },
                ],
                content: [
                    { required: true, trigger: "blur", message: "请输入内容" },
                ],
                classVideo: [
                    { required: true, trigger: "blur", message: "请传入视频" },
                ],
                exp: [
                    { required: true, trigger: "blur", message: "请传入经验值" },
                ],

            },
            dialogImageUrl: '',
            dialogVisible: false,
            fileList: [],
            uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
            headers: {
                Authorization: "Bearer " + getToken(),
            },
            knowledgeId: undefined,

        }
    },
    created() {


    },
    mounted() {
        const data = this.$route.params
        if (data.mode == "edit") {
            this.mode = 'edit'
            this.getLessonDtl(data.id)
            this.knowledgeId = data.id
        }
        console.log(data) // 输出: 123
    },
    methods: {
        getLessonDtl(id) {
            detailLesson(id).then(res => {
                console.log(res);
                this.$nextTick(() => {
                    this.form = { ...res.data }
                })

            })
        },
        beforeUpload(file) {
            // 检查文件类型是否为视频
            const isVideo = file.type.startsWith('video/');
            if (!isVideo) {
                this.$message.error('请上传视频文件!');
                return false;
            }

            // 创建视频对象来获取时长
            const video = document.createElement('video');
            const videoUrl = URL.createObjectURL(file);

            video.onloadedmetadata = () => {
                // 保存视频时长（秒）
                this.tempVideoDuration = video.duration;
                URL.revokeObjectURL(videoUrl);
            };

            video.src = videoUrl;
            return true;
        },
        handleSuccess(res, file) {
            this.form.classVideo = res.url;
            // 使用之前获取的视频时长
            this.form.videoTime = this.tempVideoDuration || 0;
            console.log('视频时长:', this.form.videoTime, '秒');
        },
        //提交表单
        handleSubmit() {
            console.log(this.form);
            this.$refs["formRef"].validate(async valid => {
                if (!valid) return
                //过滤不需要的参数
                const { ...rest } = this.form
                try {
                    let result = {}
                    switch (this.mode) {
                        case 'add':
                            result = await addLesson({ ...rest })
                            break;
                        case 'edit':
                            result = await editLesson({ knowledgeId: this.knowledgeId, ...rest })
                            break;

                    }
                    this.$message.success(result.msg)
                    this.resetForm("form")
                    this.$router.replace("/knowledge/lesson")
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
            this.$router.replace("/knowledge/lesson")
        },


    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.lesson-edit {
    padding: 20px;
    box-sizing: border-box;



    .lesson-edit-container {
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
        min-height: 100px !important;
        width: 800px !important;
    }
}
</style>