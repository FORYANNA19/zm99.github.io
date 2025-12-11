// common.js
// 皮肤管理器
class SkinManager {
    constructor() {
        this.currentSkin = this.getStoredSkin() || 'blue';
        this.init();
    }
    
    init() {
        this.applySkin(this.currentSkin);
        this.bindEvents();
    }
    
    bindEvents() {
        // 绑定皮肤切换器事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('skin-icon')) {
                const skin = e.target.getAttribute('data-skin');
                this.setSkin(skin);
            }
        });
    }
    
    setSkin(skin) {
        this.currentSkin = skin;
        this.applySkin(skin);
        this.storeSkin(skin);
    }
    
    applySkin(skin) {
        // 移除所有皮肤类
        document.body.classList.remove('skin-red-active', 'skin-blue-active', 'skin-green-active');
        
        // 添加当前皮肤类
        document.body.classList.add(`skin-${skin}-active`);
        
        // 更新皮肤切换器的视觉状态（如果有的话）
        this.updateSkinSwitcher(skin);
    }
    
    updateSkinSwitcher(skin) {
        const skinIcons = document.querySelectorAll('.skin-icon');
        skinIcons.forEach(icon => {
            icon.style.opacity = '0.6';
            if (icon.getAttribute('data-skin') === skin) {
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1.1)';
            } else {
                icon.style.transform = 'scale(1)';
            }
        });
    }
    
    storeSkin(skin) {
        localStorage.setItem('zm-skin', skin);
    }
    
    getStoredSkin() {
        return localStorage.getItem('zm-skin');
    }
}

// 移动端菜单管理器
class MobileMenuManager {
    constructor() {
        this.isMobile = window.innerWidth <= 600;
        this.init();
    }
    
    init() {
        this.createMobileMenuButton();
        this.bindEvents();
        this.checkScreenSize();
    }
    
    createMobileMenuButton() {
        // 移除已存在的按钮
        const existingBtn = document.getElementById('mobileMenuBtn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // 只在移动端创建菜单按钮
        if (this.isMobile) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            menuBtn.id = 'mobileMenuBtn';
            menuBtn.type = 'button'; // 添加类型防止表单提交
            document.body.appendChild(menuBtn);
            console.log('移动端菜单按钮已创建'); // 调试信息
        }
    }
    
    bindEvents() {
        // 使用事件委托处理菜单按钮点击
        document.body.addEventListener('click', (e) => {
            if (e.target.id === 'mobileMenuBtn' || e.target.closest('#mobileMenuBtn')) {
                console.log('菜单按钮被点击'); // 调试信息
                this.toggleSidebar();
                e.stopPropagation(); // 阻止事件冒泡
            }
        });
        
        // 点击侧边栏外部关闭侧边栏
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.sidebar');
            const menuBtn = document.getElementById('mobileMenuBtn');
            
            if (sidebar && sidebar.classList.contains('mobile-visible') && 
                !sidebar.contains(e.target) && 
                e.target !== menuBtn && 
                !menuBtn?.contains(e.target)) {
                this.hideSidebar();
            }
        });
        
        // 窗口大小变化时调整
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const isVisible = sidebar.classList.contains('mobile-visible');
            if (isVisible) {
                this.hideSidebar();
            } else {
                this.showSidebar();
            }
            console.log('侧边栏状态:', isVisible ? '隐藏' : '显示'); // 调试信息
        }
    }
    
    showSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.add('mobile-visible');
        }
    }
    
    hideSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('mobile-visible');
        }
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 600;
        
        if (wasMobile !== this.isMobile) {
            // 屏幕尺寸跨越了移动端边界
            this.createMobileMenuButton();
            this.hideSidebar(); // 重置侧边栏状态
            
            if (!this.isMobile) {
                // 从移动端切换到桌面端，确保侧边栏可见
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    sidebar.style.display = 'block';
                }
            }
        }
    }
    
    checkScreenSize() {
        // 初始检查
        if (this.isMobile) {
            this.hideSidebar();
        }
    }
}

// 初始化皮肤管理器
document.addEventListener('DOMContentLoaded', function() {
    window.skinManager = new SkinManager();
    window.mobileMenuManager = new MobileMenuManager();
});

function setSkin(skin) {
    document.body.classList.remove('skin-red-active', 'skin-blue-active', 'skin-green-active');
    document.body.classList.add(`skin-${skin}-active`);
}

// 首页链接功能
const homeLink = document.getElementById('homeLink');
if (homeLink) {
    homeLink.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

// 标签筛选功能（基础版）
function initializeTagFilter(callback) {
    const tags = document.querySelectorAll('.tag');
    let selectedTags = new Set(['all']);
    
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagValue = this.getAttribute('data-tag');
            
            if (tagValue === 'all') {
                selectedTags.clear();
                selectedTags.add('all');
                tags.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            } else {
                selectedTags.delete('all');
                tags[0].classList.remove('active');
                
                if (selectedTags.has(tagValue)) {
                    selectedTags.delete(tagValue);
                    this.classList.remove('active');
                } else {
                    selectedTags.add(tagValue);
                    this.classList.add('active');
                }
                
                if (selectedTags.size === 0) {
                    selectedTags.add('all');
                    tags[0].classList.add('active');
                }
            }
            
            if (callback) callback(selectedTags);
        });
    });
    
    return selectedTags;
}

// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    // 这些函数可能在其他地方定义，暂时注释掉
    // initializeSkinSwitcher();
    // initializeHomeLink();
});