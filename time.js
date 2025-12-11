// time.js - 时间筛选功能
class TimeFilter {
    constructor() {
        this.currentYear = 0; // 0 表示全部
        this.currentMonth = 0; // 0 表示全年
        this.init();
    }
    
    init() {
        this.createYearOptions();
        this.createMonthOptions();
        this.bindEvents();
        this.updateDisplay();
    }
    
    createYearOptions() {
        // 创建年份选项（全部、2024、2025、2026）
        this.years = [
            {value: 0, name: '全部'},
            {value: 2024, name: '2024年'},
            {value: 2025, name: '2025年'},
            {value: 2026, name: '2026年'}
        ];
    }
    
    createMonthOptions() {
        this.months = [
            {value: 0, name: '全年'},
            {value: 1, name: '1月'},
            {value: 2, name: '2月'},
            {value: 3, name: '3月'},
            {value: 4, name: '4月'},
            {value: 5, name: '5月'},
            {value: 6, name: '6月'},
            {value: 7, name: '7月'},
            {value: 8, name: '8月'},
            {value: 9, name: '9月'},
            {value: 10, name: '10月'},
            {value: 11, name: '11月'},
            {value: 12, name: '12月'}
        ];
    }
    
    bindEvents() {
        const yearSelector = document.getElementById('yearSelector');
        const monthSelector = document.getElementById('monthSelector');
        
        if (yearSelector) {
            yearSelector.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleYearDropdown();
            });
        }
        
        if (monthSelector) {
            monthSelector.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMonthDropdown();
            });
        }
        
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });
    }
    
    toggleYearDropdown() {
        const dropdown = document.getElementById('yearDropdown');
        if (!dropdown) {
            this.createYearDropdown();
        } else {
            dropdown.classList.toggle('show');
        }
    }
    
    toggleMonthDropdown() {
        const dropdown = document.getElementById('monthDropdown');
        if (!dropdown) {
            this.createMonthDropdown();
        } else {
            dropdown.classList.toggle('show');
        }
    }
    
    createYearDropdown() {
        const yearSelector = document.getElementById('yearSelector');
        const dropdown = document.createElement('div');
        dropdown.id = 'yearDropdown';
        dropdown.className = 'time-dropdown';
        
        this.years.forEach(year => {
            const option = document.createElement('div');
            option.className = `time-option ${year.value === this.currentYear ? 'active' : ''}`;
            option.textContent = year.name;
            option.addEventListener('click', () => {
                this.selectYear(year.value);
            });
            dropdown.appendChild(option);
        });
        
        yearSelector.appendChild(dropdown);
        dropdown.classList.add('show');
    }
    
    createMonthDropdown() {
        const monthSelector = document.getElementById('monthSelector');
        const dropdown = document.createElement('div');
        dropdown.id = 'monthDropdown';
        dropdown.className = 'time-dropdown';
        
        this.months.forEach(month => {
            const option = document.createElement('div');
            option.className = `time-option ${month.value === this.currentMonth ? 'active' : ''}`;
            option.textContent = month.name;
            option.addEventListener('click', () => {
                this.selectMonth(month.value);
            });
            dropdown.appendChild(option);
        });
        
        monthSelector.appendChild(dropdown);
        dropdown.classList.add('show');
    }
    
    selectYear(year) {
        this.currentYear = year;
        this.updateDisplay();
        this.closeAllDropdowns();
        this.triggerFilter();
    }
    
    selectMonth(month) {
        this.currentMonth = month;
        this.updateDisplay();
        this.closeAllDropdowns();
        this.triggerFilter();
    }
    
    updateDisplay() {
        const currentYearElement = document.getElementById('currentYear');
        const currentMonthElement = document.getElementById('currentMonth');
        
        if (currentYearElement) {
            // 找到对应的年份名称
            const yearObj = this.years.find(y => y.value === this.currentYear);
            currentYearElement.textContent = yearObj ? yearObj.name : '全部';
        }
        
        if (currentMonthElement) {
            currentMonthElement.textContent = this.currentMonth === 0 ? '全年' : `${this.currentMonth}月`;
        }
    }
    
    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.time-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
    
    triggerFilter() {
        if (typeof window.filterContent === 'function') {
            window.filterContent();
        }
    }
    
    filterByTime(data) {
        return data.filter(item => {
            const dateMatch = item.date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
            if (!dateMatch) return false;
            
            const year = parseInt(dateMatch[1]);
            const month = parseInt(dateMatch[2]);
            
            // 年份筛选
            if (this.currentYear !== 0 && year !== this.currentYear) return false;
            
            // 月份筛选
            if (this.currentMonth !== 0 && month !== this.currentMonth) return false;
            
            return true;
        });
    }
}

// 初始化时间筛选器
function initTimeFilter() {
    window.timeFilter = new TimeFilter();
}