<template>
  <a-modal
    :visible="visible"
    @update:visible="(val) => $emit('update:visible', val)"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-upload
      list-type="picture-card"
      :file-list="fileList"
      :limit="5"
      :multiple="true"
      :image-preview="true"
      @change="handleChange"
      :custom-request="customUpload"
      @before-upload="beforeUpload"
      @before-remove="handleRemove"
    >
      <template #upload-button>
        <div class="upload-button">
          <icon-plus />
          <div class="upload-text">上传图片</div>
        </div>
      </template>
    </a-upload>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { usePurchaseItemStore } from '@/stores'

const purchaseItemStore = usePurchaseItemStore()
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '上传图片'
  },
  purchaseItemId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'upload-success'])

const fileList = ref([])

// 监听 visible 变化，当打开弹窗时获取图片
watch(() => props.visible, async (newVal) => {
  if (newVal && props.purchaseItemId) {
    try {
      const response = await purchaseItemStore.getAllPurchaseItemPic(props.purchaseItemId)
      //console.log('response:', response)
      
      if (response.code === 200 && response.data && Array.isArray(response.data.pic_url)) {
        fileList.value = response.data.pic_url.map(url => ({
          uid: String(Math.random()),
          name: '图片',
          url: url,
          status: 'done'
        }))
      } else {
        fileList.value = []
      }
      
      //console.log('转换后的文件列表：', fileList.value)
    } catch (error) {
      console.log('error:', error)
      Message.error('获取图片失败！')
    }
  }
})

// 上传前验证
const beforeUpload = (file) => {
  console.log(file)
  const isImage = /^image\//.test(file.type)
  if (!isImage) {
    Message.error('只能上传图片文件！')
    return false
  }
  
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    Message.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 自定义上传方法
const customUpload = async (option) => {
  const { fileItem, onProgress, onSuccess, onError } = option
  console.log("customUpload", fileItem, onProgress, onSuccess, onError)
  try {

    // 使用 store 中的上传方法，传入进度回调
    const response = await purchaseItemStore.uploadPurchaseItemPic(
      props.purchaseItemId, 
      fileItem.file,
      (progress) => {
        onProgress(progress)
      }
    )
    
    if (response.code === 200) {
      onSuccess()
      // 重新获取图片列表
      const response = await purchaseItemStore.getAllPurchaseItemPic(props.purchaseItemId)
      if (response.code === 200 && response.data && Array.isArray(response.data.pic_url)) {
        fileList.value = response.data.pic_url.map(url => ({
          uid: String(Math.random()),
          name: '图片',
          url: url,
          status: 'done'
        }))
      }
      Message.success('上传成功')
    } else {
      onError(new Error(response.message || '上传失败'))
      Message.error(response.message || '上传失败')
    }
  } catch (error) {
    console.error('上传错误:', error)
    onError(error)
    Message.error('上传失败')
  }
}

// 处理文件变化
const handleChange = (files) => {
  fileList.value = files
}

// 处理取消
const handleCancel = () => {
  emit('update:visible', false)
  fileList.value = []
}

// 处理确认
const handleOk = () => {
  emit('upload-success', fileList.value)
  emit('update:visible', false)
  fileList.value = []
}

// 处理删除图片
const handleRemove = (file) => {
  return new Promise((resolve, reject) => {
    const regex = /aliyuncs.com\/([^/?]+)\?/
    const match = file.url.match(regex)
    const picName = match ? match[1] : null
    Modal.confirm({
      title: '删除图片',
      content:"确定要删除改图片吗？删除后不可恢复！",
      onOk: async () => {
        console.log(file)
        console.log(picName)
        if (!picName)resolve(true)
        
        const response = await purchaseItemStore.deletePurchaseItemPic(picName)
        if (response.code === 200) {
          Message.success('删除成功')
          resolve(true)
        } else {
          Message.error('删除失败')
          reject('删除失败')
        }
      },
      onCancel: () => reject('cancel'),
    });
  })
}
</script>

<style scoped>
.upload-button {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-text {
  margin-top: 8px;
  font-size: 14px;
  color: #4E5969;
}
</style>
