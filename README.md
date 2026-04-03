# 🐾 宠物救助平台 - 后台管理系统

## 📋 项目简介

这是一个基于 **RuoYi 框架**开发的**宠物救助/领养平台后台管理系统**，采用 Vue 全家桶技术栈。平台集成了宠物浏览筛选、领养申请、在线聊天、电子合同签署、AI智能匹配和数据可视化等核心功能，旨在优化宠物领养/救助效率与用户体验。

> 通过高效的前端设计和开发，确保用户交互的流畅性和界面的友好性，支持平台的各项核心功能。

---

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Vue** | 2.6.12 | 前端框架 (89.4%) |
| **JavaScript** | ES6+ | 编程语言 (9.4%) |
| **Element UI** | 2.15.14 | UI 组件库 |
| **RuoYi** | 3.8.8 | 后台管理框架 |
| **Axios** | 0.28.1 | HTTP 请求库 |
| **Vue Router** | 3.4.9 | 路由管理 |
| **echarts** | 5.4.0 | 图标 |

---

## 📁 项目结构

```
src/views/adoptPet/
├── adopt/                          # 领养管理模块
│   ├── index.vue                   # 领养申请列表
│   └── adoptDetail.vue             # 领养详情
│
├── content/                        # 内容管理模块
│   ├── notice/                     # 公告管理
│   │   ├── index.vue               # 公告列表
│   │   └── editNotice.vue          # 公告编辑
│   ├── userQuestion/               # 用户疑问
│   │   ├── index.vue               # 疑问列表
│   │   └── questionDetail.vue      # 疑问详情
│   └── userReview/                 # 用户评论
│       ├── index.vue               # 评论列表
│       └── reviewDetail.vue        # 评论详情
│
├── pet/                            # 宠物管理模块
│   ├── petManage/                  # 宠物信息管理
│   │   ├── index.vue               # 宠物列表
│   │   └── petDetail.vue           # 宠物详情
│   ├── petClassify/                # 宠物分类管理
│   │   └── index.vue               # 分类列表
│   └── petLabel/                   # 宠物标签管理
│       └── index.vue               # 标签列表
│
├── knowledge/                      # 知识库管理
│   ├── lesson/                     # 课程管理
│   │   ├── index.vue               # 课程列表
│   │   ├── editLesson.vue          # 课程编辑
│   │   └── lessonDetail.vue        # 课程详情
│   └── test/                       # 测试管理
│       ├── index.vue               # 测试列表
│       ├── editTest.vue            # 测试编辑
│       └── testDetail.vue          # 测试详情
│
└── user/                           # 用户管理
    └── index.vue                   # 用户列表和详情
```

---

## 🎯 核心功能模块

### 1. 🐶 宠物管理
- **宠物信息管理**：新增、编辑、删除宠物信息
- **宠物分类**：按品种、类别分类管理宠物
- **标签体系**：支持性格、品种、来源等多维度标签
- **详情展示**：包含基础信息、健康护理、救助故事等

### 2. 📝 领养管理
- **领养申请列表**：支持按申请人、品种、申请状态筛选
- **流程跟踪**：展示AI审核、人工审核等各阶段进展
- **申请状态**：待审核 → 已通过/拒绝 → 已取消
- **详情查看**：完整的领养申请信息展示

### 3. 📢 内容管理
- **公告系统**
  - 支持通知、活动两种类型
  - 草稿/发布/已过期多种状态
  - 公告海报上传与管理
  
- **用户疑问**
  - 问题收集与回复
  - 解决状态追踪
  - 回复历史记录

- **用户评论**
  - 评论内容审核
  - 违规检测与处理
  - 支持未违规/违规/待审核状态

### 4. 🎓 知识库管理
- **课程体系**
  - 品种知识、养育技巧两大分类
  - 视频课程上传与管理
  - 草稿/发布状态管理
  
- **测试系统**
  - 支持单选、多选、判断题
  - 难度分级（简单/中等/困难）
  - 答案解析与学习评估

### 5. 👥 用户管理
- **用户列表**：查看所有平台用户
- **用户详情**：角色、身份信息、账号状态
- **账号控制**：启用/禁用用户账号
- **强制登出**：禁用用户时自动注销其会话

---

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run serve
```

### 生产构建
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

---

## 📊 数据流向

```
用户操作
  ↓
表单数据验证
  ↓
API 请求 (src/api/)
  ↓
后端处理
  ↓
响应数据处理
  ↓
状态更新 (Vuex/Data)
  ↓
视图重新渲染
```

---

## 💡 开发规范

### 1. 组件命名
- 使用PascalCase命名Vue组件
- 文件名小写，多词用连字符分隔

### 2. 数据管理
- 使用data()定义组件私有数据
- 复杂状态可考虑使用Vuex

### 3. API调用
- 统一在methods中调用API
- 使用async/await处理异步操作
- 合理处理错误和加载状态

### 4. 表单验证
- 使用Element UI的Form和FormItem组件
- 定义rules对象进行表单验证
- 提交前调用validate方法

### 5. 路由参数
- 使用$route.params传递参数
- 支持watch监听路由变化

---

## 🔌 主要API接口

### 宠物相关
- `listPet()` - 获取宠物列表
- `petDetail(id)` - 获取宠物详情
- `petType()` - 获取宠物分类列表
- `petVariety()` - 获取宠物品种列表

### 领养相关
- `listPetApply()` - 获取领养申请列表
- `petApplyDetail(id)` - 获取申请详情
- `petApplyReview(id)` - 获取审核流程

### 公告相关
- `listNotice()` - 获取公告列表
- `addNotice()` / `editNotice()` - 新增/编辑公告
- `delNotice()` - 删除公告

### 用户相关
- `listPetUser()` - 获取用户列表
- `petUserDetail()` - 获取用户详情
- `changeUserStatus()` - 改变用户状态
- `forceLogout()` - 强制登出用户

---

## 🎨 UI组件使用

项目主要使用 **Element UI** 组件库，常用组件包括：

| 组件 | 用途 |
|------|------|
| `el-table` | 数据表格展示 |
| `el-form` | 表单输入与验证 |
| `el-dialog` | 弹窗对话框 |
| `el-pagination` | 分页组件 |
| `el-select` | 下拉选择 |
| `el-input` | 输入框 |
| `el-tag` | 标签展示 |
| `el-descriptions` | 描述列表 |

---

## 📝 常见操作示例

### 列表页面的查询与分页
```javascript
// 在methods中定义
getListData() {
  const query = this.queryForm || {}
  const { total, ...rest } = this.pagination
  listApi({ ...rest, ...query }).then(res => {
    this.dataList = res.rows
    this.pagination.total = res.total
  })
}
```

### 弹窗编辑/新增
```javascript
handleEdit(row) {
  this.dialog.mode = "edit"
  this.$nextTick(() => {
    this.dialog.form = JSON.parse(JSON.stringify(row))
  })
  this.dialog.visible = true
}
```

### 表单验证提交
```javascript
handleSubmit() {
  this.$refs["formRef"].validate(async valid => {
    if (!valid) return
    const { id, ...rest } = this.form
    const result = await submitApi({ id, ...rest })
    this.$message.success(result.msg)
  })
}
```

---

## 🔒 安全建议

1. **认证与授权**
   - 严格检查用户权限
   - 使用Token进行请求认证

2. **数据安全**
   - 敏感信息加密传输
   - 避免在本地存储敏感数据

3. **输入验证**
   - 前端进行表单验证
   - 后端再次验证数据

---

## 🐛 常见问题

### Q: 如何处理分页？
A: 修改 `pagination.pageNum` 自动触发列表刷新，分页信息包含：
- `pageSize`: 每页条数
- `pageNum`: 当前页码
- `total`: 总记录数

### Q: 如何实现弹窗表单重置？
A: 在关闭弹窗时调用 `resetForm()` 方法：
```javascript
resetForm(val) {
  this.$refs[`${val}Ref`].resetFields()
}
```

### Q: 如何添加新的字典类型？
A: 在组件的 `dicts` 数组中添加字典key，然后通过 `this.dict.type.[key名]` 访问

---

## 📈 性能优化

- ✅ 使用路由懒加载减少首屏加载时间
- ✅ 图片资源优化和压缩
- ✅ 合理使用v-if和v-show控制DOM渲染
- ✅ 虚拟滚动处理大列表数据

---

## 📚 参考资源

- [Vue.js 官方文档](https://cn.vuejs.org/)
- [Element UI 文档](https://element.eleme.cn/)
- [RuoYi 框架文档](http://doc.ruoyi.vip/)
- [JavaScript 标准参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

---

## 📞 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

---

**最后更新**: 2026年4月3日  
**项目仓库**: [joachimH-CC/pet-save-back](https://github.com/joachimH-CC/pet-save-back)


