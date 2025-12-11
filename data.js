// data.js - 数据添加和管理功能

// 全局变量
let timelineData = [];
let activeTag = 'all';

// 初始化数据管理功能
function initDataManagement() {
    loadTimelineData();
    initAddDataFunction();
    bindGlobalEvents();
}

// 从localStorage加载数据
function loadTimelineData() {
    const savedData = localStorage.getItem('zmTimelineData');
    if (savedData) {
        try {
            timelineData = JSON.parse(savedData);
        } catch (e) {
            console.error('加载数据失败:', e);
            timelineData = getDefaultData();
        }
    } else {
        timelineData = getDefaultData();
        saveTimelineData();
    }
}

// 获取默认数据
function getDefaultData() {
    return [
        {
            date: "2024年4月20日",
            title: "微博互动直播",
            type: "直播",
            details: {
                平台: "微博直播",
                描述: "与粉丝进行在线互动交流",
                链接: "https://weibo.com/live/123456"
            },
            tags: ["直播", "互动", "张康乐", "马柏全", "微博"]
        },
        {
            date: "2024年4月18日",
            title: "舞蹈练习室日常",
            type: "训练",
            details: {
                地点: "ZM练习室",
                参与成员: "ZM男团全体",
                内容: "新歌舞蹈排练",
                描述: "为即将发布的新单曲进行舞蹈训练"
            },
            tags: ["训练", "ZM男团", "日常"]
        }
        // 可以保留你原有的其他默认数据
    ];
}

// 保存数据到localStorage
function saveTimelineData() {
    try {
        localStorage.setItem('zmTimelineData', JSON.stringify(timelineData));
        return true;
    } catch (e) {
        console.error('保存数据失败:', e);
        alert('保存数据失败，可能是存储空间不足');
        return false;
    }
}

// 初始化数据添加功能
function initAddDataFunction() {
    // 创建添加按钮
    const addDataBtn = document.createElement('div');
    addDataBtn.className = 'add-data-btn';
    addDataBtn.id = 'addDataBtn';
    addDataBtn.innerHTML = '<i class="fas fa-plus"></i>';
    document.body.appendChild(addDataBtn);

    // 创建弹窗
    const modalHTML = `
        <div class="modal-overlay" id="addDataModal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>添加日常营业记录</h3>
                    <span class="close-btn" id="closeModal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="addDataForm">
                        <div class="form-group">
                            <label>日期：</label>
                            <input type="date" id="newDate" required>
                        </div>
                        <div class="form-group">
                            <label>标题：</label>
                            <input type="text" id="newTitle" required placeholder="请输入活动标题">
                        </div>
                        <div class="form-group">
                            <label>类型：</label>
                            <select id="newType" required>
                                <option value="">请选择类型</option>
                                <option value="直播">直播</option>
                                <option value="训练">训练</option>
                                <option value="社交">社交</option>
                                <option value="视频">视频</option>
                                <option value="健身">健身</option>
                                <option value="互动">互动</option>
                                <option value="创作">创作</option>
                                <option value="商务">商务</option>
                                <option value="时尚">时尚</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>标签选择：</label>
                            <div class="tags-selection" id="tagsSelection">
                                <div class="tag-option" data-tag="张康乐">张康乐</div>
                                <div class="tag-option" data-tag="马柏全">马柏全</div>
                                <div class="tag-option" data-tag="ZM男团">ZM男团</div>
                                <div class="tag-option" data-tag="微博">微博</div>
                                <div class="tag-option" data-tag="直播">直播</div>
                                <div class="tag-option" data-tag="互动">互动</div>
                                <div class="tag-option" data-tag="日常">日常</div>
                                <div class="tag-option" data-tag="训练">训练</div>
                                <div class="tag-option" data-tag="商务">商务</div>
                                <div class="tag-option" data-tag="时尚">时尚</div>
                            </div>
                            <input type="text" id="customTags" placeholder="自定义标签（用逗号分隔）" style="margin-top: 10px;">
                        </div>
                        <div class="form-group">
                            <label>详情信息：</label>
                            <div id="detailFields">
                                <div class="detail-field">
                                    <input type="text" class="detail-key" placeholder="项目名称（如：平台、地点等）" value="描述">
                                    <input type="text" class="detail-value" placeholder="内容" value="">
                                    <button type="button" class="remove-detail">删除</button>
                                </div>
                            </div>
                            <button type="button" id="addDetailField">添加详情项</button>
                        </div>
                        <div class="form-actions">
                            <button type="submit">添加记录</button>
                            <button type="button" id="cancelAdd">取消</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    bindModalEvents();
}

// 绑定弹窗事件
function bindModalEvents() {
    const addDataBtn = document.getElementById('addDataBtn');
    const addDataModal = document.getElementById('addDataModal');
    const closeModal = document.getElementById('closeModal');
    const cancelAdd = document.getElementById('cancelAdd');
    const addDataForm = document.getElementById('addDataForm');
    const addDetailField = document.getElementById('addDetailField');
    const detailFields = document.getElementById('detailFields');
    const tagsSelection = document.getElementById('tagsSelection');

    // 显示弹窗
    addDataBtn.addEventListener('click', function() {
        addDataModal.style.display = 'flex';
        document.getElementById('newDate').valueAsDate = new Date();
    });

    // 关闭弹窗
    function closeModalFunc() {
        addDataModal.style.display = 'none';
        addDataForm.reset();
        detailFields.innerHTML = '<div class="detail-field"><input type="text" class="detail-key" placeholder="项目名称" value="描述"><input type="text" class="detail-value" placeholder="内容"><button type="button" class="remove-detail">删除</button></div>';
        // 重置标签选择
        document.querySelectorAll('.tag-option').forEach(tag => {
            tag.classList.remove('selected');
        });
    }

    closeModal.addEventListener('click', closeModalFunc);
    cancelAdd.addEventListener('click', closeModalFunc);

    // 点击遮罩层关闭
    addDataModal.addEventListener('click', function(e) {
        if (e.target === addDataModal) {
            closeModalFunc();
        }
    });

    // 标签选择
    tagsSelection.addEventListener('click', function(e) {
        if (e.target.classList.contains('tag-option')) {
            e.target.classList.toggle('selected');
        }
    });

    // 添加详情字段
    addDetailField.addEventListener('click', function() {
        const newField = document.createElement('div');
        newField.className = 'detail-field';
        newField.innerHTML = `
            <input type="text" class="detail-key" placeholder="项目名称">
            <input type="text" class="detail-value" placeholder="内容">
            <button type="button" class="remove-detail">删除</button>
        `;
        detailFields.appendChild(newField);
    });

    // 删除详情字段
    detailFields.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-detail')) {
            if (document.querySelectorAll('.detail-field').length > 1) {
                e.target.closest('.detail-field').remove();
            } else {
                alert('至少需要保留一个详情项');
            }
        }
    });

    // 提交表单
    addDataForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 收集表单数据
        const newDate = document.getElementById('newDate').value;
        const newTitle = document.getElementById('newTitle').value.trim();
        const newType = document.getElementById('newType').value;
        
        if (!newTitle) {
            alert('请输入标题');
            return;
        }
        
        if (!newType) {
            alert('请选择类型');
            return;
        }

        // 收集标签
        const selectedTags = Array.from(document.querySelectorAll('.tag-option.selected'))
            .map(tag => tag.getAttribute('data-tag'));
        const customTags = document.getElementById('customTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);
        
        const allTags = [...selectedTags, ...customTags];
        if (allTags.length === 0) {
            alert('请选择或输入至少一个标签');
            return;
        }

        // 收集详情数据
        const details = {};
        const detailFields = document.querySelectorAll('.detail-field');
        let hasEmptyFields = false;
        
        detailFields.forEach(field => {
            const key = field.querySelector('.detail-key').value.trim();
            const value = field.querySelector('.detail-value').value.trim();
            
            if (!key || !value) {
                hasEmptyFields = true;
                return;
            }
            details[key] = value;
        });

        if (hasEmptyFields) {
            alert('请填写完整的详情信息');
            return;
        }

        // 格式化日期
        const formattedDate = formatDate(newDate);
        
        // 创建新数据对象
        const newData = {
            date: formattedDate,
            title: newTitle,
            type: newType,
            details: details,
            tags: allTags
        };

        // 添加到数据数组
        timelineData.unshift(newData);
        
        // 保存数据
        if (saveTimelineData()) {
            // 重新渲染时间线
            filterContent();
            // 关闭弹窗
            closeModalFunc();
            // 显示成功提示
            showMessage('数据添加成功！', 'success');
        }
    });
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// 显示消息提示
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 4px;
        z-index: 3000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 绑定全局事件
function bindGlobalEvents() {
    // 标签筛选事件
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            tags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            activeTag = this.getAttribute('data-tag');
            filterContent();
        });
    });
}

// 导出函数供其他文件使用
window.initDataManagement = initDataManagement;
window.timelineData = timelineData;
window.filterContent = filterContent;