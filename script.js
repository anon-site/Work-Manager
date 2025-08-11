// Loading Screen Management
class LoadingManager {
    constructor() {
        this.progress = 0;
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.currentLanguage = 'en';
        this.init();
    }

    init() {
        this.detectLanguage();
        this.simulateLoading();
    }

    detectLanguage() {
        // Detect language from HTML dir attribute or browser language
        const htmlDir = document.documentElement.getAttribute('dir');
        if (htmlDir === 'rtl') {
            this.currentLanguage = 'ar';
        } else {
            const browserLang = navigator.language || navigator.userLanguage;
            this.currentLanguage = browserLang.startsWith('ar') ? 'ar' : 'en';
        }
    }

    getText(english, arabic) {
        return this.currentLanguage === 'en' ? english : arabic;
    }

    simulateLoading() {
        const loadingSteps = [
            { 
                progress: 20, 
                messageEn: 'Initializing...',
                messageAr: 'جاري التهيئة...'
            },
            { 
                progress: 40, 
                messageEn: 'Loading data...',
                messageAr: 'جاري تحميل البيانات...'
            },
            { 
                progress: 60, 
                messageEn: 'Setting up interface...',
                messageAr: 'جاري إعداد الواجهة...'
            },
            { 
                progress: 80, 
                messageEn: 'Almost ready...',
                messageAr: 'تقريباً جاهز...'
            },
            { 
                progress: 100, 
                messageEn: 'Complete!',
                messageAr: 'مكتمل!'
            }
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];
                const message = this.getText(step.messageEn, step.messageAr);
                this.updateProgress(step.progress, message);
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 500);
            }
        }, 800);
    }

    updateProgress(progress, message) {
        this.progress = progress;
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        if (this.progressText) {
            this.progressText.textContent = `${progress}%`;
        }
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                // Trigger a custom event when loading is complete
                document.dispatchEvent(new CustomEvent('loadingComplete'));
            }, 500);
        }
    }
}

// Application State
class WorkManagerApp {
    constructor() {
        this.currentLanguage = 'en';
        this.currentTheme = 'light';
        this.data = {
            workEntries: [],
            expenses: [],
            debts: [],
            settings: {
                hourlyRate: 10.00,
                currency: 'EUR'
            }
        };
        this.loadingManager = new LoadingManager();
        this.init();
    }

    init() {
        // Wait for loading to complete before initializing the app
        document.addEventListener('loadingComplete', () => {
            this.loadData();
            this.loadSettingsToForms();
            this.setupEventListeners();
            this.updateDashboard();
            this.updateAllTables();
            this.applyTheme();
            this.setDefaultDates();
            this.startClock();
            
            // Add a subtle entrance animation to the main content
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.opacity = '0';
                mainContent.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    mainContent.style.transition = 'all 0.6s ease-out';
                    mainContent.style.opacity = '1';
                    mainContent.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }

    // Clock functionality
    startClock() {
        this.updateClock();
        // Update clock every second
        setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    updateClock() {
        const now = new Date();
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        const dayElement = document.getElementById('current-day');

        if (timeElement && dateElement && dayElement) {
            const locale = this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
            
            // Update time
            const timeString = now.toLocaleTimeString(locale, {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeElement.textContent = timeString;

            // Update date
            const dateString = now.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            dateElement.textContent = dateString;

            // Update day
            const dayString = now.toLocaleDateString(locale, {
                weekday: 'long'
            });
            dayElement.textContent = dayString;
        }
    }

    // Data Management
    saveData() {
        localStorage.setItem('workManagerData', JSON.stringify(this.data));
    }

    loadData() {
        const saved = localStorage.getItem('workManagerData');
        if (saved) {
            this.data = { ...this.data, ...JSON.parse(saved) };
        }
    }

    loadSettingsToForms() {
        // Load salary settings
        if (this.data.settings) {
            // Set hourly rate
            const hourlyRateInput = document.getElementById('default-hourly-rate');
            if (hourlyRateInput && this.data.settings.hourlyRate) {
                hourlyRateInput.value = this.data.settings.hourlyRate;
            }

            // Set currency
            const currencySelect = document.getElementById('currency');
            if (currencySelect && this.data.settings.currency) {
                currencySelect.value = this.data.settings.currency;
            }

            // Set theme
            const themeSelect = document.getElementById('theme');
            if (themeSelect && this.data.settings.theme) {
                themeSelect.value = this.data.settings.theme;
                this.currentTheme = this.data.settings.theme;
            }

            // Set colors
            const primaryColorInput = document.getElementById('primary-color');
            const accentColorInput = document.getElementById('accent-color');
            if (primaryColorInput && this.data.settings.primaryColor) {
                primaryColorInput.value = this.data.settings.primaryColor;
            }
            if (accentColorInput && this.data.settings.accentColor) {
                accentColorInput.value = this.data.settings.accentColor;
            }

            // Set font size
            const fontSizeSelect = document.getElementById('font-size');
            if (fontSizeSelect && this.data.settings.fontSize) {
                fontSizeSelect.value = this.data.settings.fontSize;
            }
        }
    }

    // Navigation
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(e.target.closest('.nav-link').getAttribute('href').substring(1));
            });
        });

        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Language toggle
        document.getElementById('language-toggle').addEventListener('click', () => {
            this.toggleLanguage();
        });

        // Work entry form
        document.getElementById('work-entry-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addWorkEntry();
        });

        // Expense form
        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Debt form
        document.getElementById('debt-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addDebt();
        });

        // Settings forms
        document.getElementById('salary-settings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSalarySettings();
        });

        document.getElementById('appearance-settings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAppearanceSettings();
        });

        // Data management
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-data').addEventListener('click', () => {
            document.getElementById('import-file-input').click();
        });

        document.getElementById('import-file-input').addEventListener('change', (e) => {
            this.importData(e);
        });

        document.getElementById('clear-data').addEventListener('click', () => {
            this.showConfirmModal(
                this.getText('Clear All Data', 'مسح جميع البيانات'),
                this.getText('Are you sure you want to clear all data? This action cannot be undone.', 'هل أنت متأكد من أنك تريد مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.'),
                () => this.clearAllData()
            );
        });

        document.getElementById('reset-settings').addEventListener('click', () => {
            this.showConfirmModal(
                this.getText('Reset Settings to Default', 'إعادة تعيين الإعدادات للافتراضي'),
                this.getText('Are you sure you want to reset all settings to their default values? This will not affect your work data, expenses, or debts.', 'هل أنت متأكد من أنك تريد إعادة تعيين جميع الإعدادات إلى قيمها الافتراضية؟ لن يؤثر هذا على بيانات عملك أو مصاريفك أو ديونك.'),
                () => this.resetSettingsToDefault()
            );
        });

        // Modal
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal-overlay')) {
                // Don't close modal when clicking overlay - only close button
                return;
            }
        });

        // Work entry calculations
        document.getElementById('start-time').addEventListener('change', () => this.calculateWorkHours());
        document.getElementById('end-time').addEventListener('change', () => this.calculateWorkHours());

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    navigateToSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');

        // Show section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        // Close mobile menu
        const navMenu = document.getElementById('nav-menu');
        const menuToggle = document.getElementById('menu-toggle');
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }

    // Language Management
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
        document.documentElement.setAttribute('dir', this.currentLanguage === 'ar' ? 'rtl' : 'ltr');
        this.updateLanguageUI();
        this.updateClock(); // Update clock with new language
        this.saveData();
    }

    updateLanguageUI() {
        document.querySelectorAll('[data-en][data-ar]').forEach(element => {
            element.textContent = this.getText(element.getAttribute('data-en'), element.getAttribute('data-ar'));
        });

        // Update language toggle button
        const toggleBtn = document.getElementById('language-toggle');
        const span = toggleBtn.querySelector('span');
        span.textContent = this.getText('العربية', 'English');
        
        // Update modal title if modal is open
        const modalTitle = document.getElementById('edit-modal-title');
        if (modalTitle && modalTitle.getAttribute('data-en')) {
            modalTitle.textContent = this.getText(
                modalTitle.getAttribute('data-en'), 
                modalTitle.getAttribute('data-ar')
            );
        }
    }

    getText(english, arabic) {
        return this.currentLanguage === 'en' ? english : arabic;
    }

    // Work Entry Management
    addWorkEntry() {
        const form = document.getElementById('work-entry-form');
        const formData = new FormData(form);
        
        const workEntry = {
            id: Date.now(),
            date: formData.get('work-date'),
            startTime: formData.get('start-time'),
            endTime: formData.get('end-time'),
            totalHours: parseFloat(formData.get('total-hours')),
            hourlyRate: this.data.settings?.hourlyRate || 10.00,
            totalSalary: parseFloat(formData.get('total-salary-calc')),
            notes: formData.get('work-notes'),
            createdAt: new Date().toISOString()
        };

        this.data.workEntries.unshift(workEntry);
        this.saveData();
        this.updateDashboard();
        this.updateWorkHistoryTable();
        this.addActivity('work', workEntry);
        
        form.reset();
        this.setDefaultDates();
        this.showSuccessMessage(this.getText('Work entry added successfully!', 'تم إضافة إدخال العمل بنجاح!'));
    }

    calculateWorkHours() {
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
        const hourlyRate = this.data.settings?.hourlyRate || 10.00;

        if (startTime && endTime) {
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(`2000-01-01T${endTime}`);
            
            if (end < start) {
                end.setDate(end.getDate() + 1); // Next day
            }
            
            const diffMs = end - start;
            const diffHours = diffMs / (1000 * 60 * 60);
            
            document.getElementById('total-hours').value = diffHours.toFixed(2);
            document.getElementById('total-salary-calc').value = (diffHours * hourlyRate).toFixed(2);
        }
    }

    // Expense Management
    addExpense() {
        const form = document.getElementById('expense-form');
        const formData = new FormData(form);
        
        const expense = {
            id: Date.now(),
            date: formData.get('expense-date'),
            amount: parseFloat(formData.get('expense-amount')),
            category: formData.get('expense-category'),
            description: formData.get('expense-description'),
            createdAt: new Date().toISOString()
        };

        this.data.expenses.unshift(expense);
        this.saveData();
        this.updateDashboard();
        this.updateExpensesTable();
        this.addActivity('expense', expense);
        
        form.reset();
        this.setDefaultDates();
        this.showSuccessMessage(this.getText('Expense added successfully!', 'تم إضافة المصروف بنجاح!'));
    }

    // Debt Management
    addDebt() {
        const form = document.getElementById('debt-form');
        const formData = new FormData(form);
        
        const debt = {
            id: Date.now(),
            date: formData.get('debt-date'),
            amount: parseFloat(formData.get('debt-amount')),
            type: formData.get('debt-type'),
            description: formData.get('debt-description'),
            status: formData.get('debt-status'),
            dueDate: formData.get('debt-due-date'),
            createdAt: new Date().toISOString()
        };

        this.data.debts.unshift(debt);
        this.saveData();
        this.updateDashboard();
        this.updateDebtsTable();
        this.addActivity('debt', debt);
        
        form.reset();
        this.setDefaultDates();
        this.showSuccessMessage(this.getText('Debt added successfully!', 'تم إضافة الدين بنجاح!'));
    }

    // Dashboard Updates
    updateDashboard() {
        const stats = this.calculateStats();
        
        document.getElementById('work-days').textContent = stats.workDays;
        document.getElementById('work-hours').textContent = stats.workHours.toFixed(2);
        document.getElementById('total-salary').textContent = `€${stats.totalSalary.toFixed(2)}`;
        document.getElementById('withdrawn-amount').textContent = `€${stats.withdrawnAmount.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `€${stats.totalExpenses.toFixed(2)}`;
        document.getElementById('total-debts').textContent = `€${stats.totalDebts.toFixed(2)}`;
        document.getElementById('remaining-balance').textContent = `€${stats.remainingBalance.toFixed(2)}`;

        // Update summary cards
        document.getElementById('total-expenses-summary').textContent = `€${stats.totalExpenses.toFixed(2)}`;
        document.getElementById('monthly-expenses').textContent = `€${stats.monthlyExpenses.toFixed(2)}`;
        document.getElementById('total-debts-summary').textContent = `€${stats.totalDebts.toFixed(2)}`;
        document.getElementById('active-debts').textContent = `€${stats.pendingDebts.toFixed(2)}`;
        document.getElementById('paid-debts').textContent = `€${stats.completedDebts.toFixed(2)}`;

        this.updateRecentActivity();
    }

    calculateStats() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const workDays = this.data.workEntries.length;
        const workHours = this.data.workEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
        const totalSalary = this.data.workEntries.reduce((sum, entry) => sum + entry.totalSalary, 0);
        
        const withdrawnAmount = this.data.expenses
            .filter(expense => expense.category === 'withdrawal')
            .reduce((sum, expense) => sum + expense.amount, 0);
        
        const totalExpenses = this.data.expenses
            .filter(expense => expense.category !== 'withdrawal')
            .reduce((sum, expense) => sum + expense.amount, 0);
        
        const monthlyExpenses = this.data.expenses
            .filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === currentMonth && 
                       expenseDate.getFullYear() === currentYear &&
                       expense.category !== 'withdrawal';
            })
            .reduce((sum, expense) => sum + expense.amount, 0);
        
        const totalDebts = this.data.debts.reduce((sum, debt) => sum + debt.amount, 0);
        const pendingDebts = this.data.debts
            .filter(debt => debt.status === 'pending')
            .reduce((sum, debt) => sum + debt.amount, 0);
        const completedDebts = this.data.debts
            .filter(debt => debt.status === 'completed')
            .reduce((sum, debt) => sum + debt.amount, 0);
        
        const remainingBalance = totalSalary - withdrawnAmount - totalExpenses - pendingDebts;

        return {
            workDays,
            workHours,
            totalSalary,
            withdrawnAmount,
            totalExpenses,
            monthlyExpenses,
            totalDebts,
            pendingDebts,
            completedDebts,
            remainingBalance
        };
    }

    // Table Updates
    updateAllTables() {
        this.updateWorkHistoryTable();
        this.updateExpensesTable();
        this.updateDebtsTable();
    }

    updateWorkHistoryTable() {
        const tbody = document.getElementById('work-history-body');
        tbody.innerHTML = '';

        this.data.workEntries.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.formatDate(entry.date)}</td>
                <td>${entry.startTime}</td>
                <td>${entry.endTime}</td>
                <td>${entry.totalHours.toFixed(2)}</td>
                <td>€${entry.hourlyRate.toFixed(2)}</td>
                <td>€${entry.totalSalary.toFixed(2)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="app.editWorkEntry(${entry.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteWorkEntry(${entry.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateExpensesTable() {
        const tbody = document.getElementById('expenses-body');
        tbody.innerHTML = '';

        this.data.expenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.formatDate(expense.date)}</td>
                <td><span class="category-badge">${this.getCategoryText(expense.category)}</span></td>
                <td>${expense.description}</td>
                <td>€${expense.amount.toFixed(2)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="app.editExpense(${expense.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteExpense(${expense.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateDebtsTable() {
        const tbody = document.getElementById('debts-body');
        tbody.innerHTML = '';

        this.data.debts.forEach(debt => {
            const row = document.createElement('tr');
            const statusButton = debt.status === 'pending' 
                ? `<button class="btn btn-sm btn-success" onclick="app.toggleDebtStatus(${debt.id})" title="${this.getText('Mark as Done', 'تحديد كتم')}">
                     <i class="fas fa-check"></i>
                   </button>`
                : `<button class="btn btn-sm btn-warning" onclick="app.toggleDebtStatus(${debt.id})" title="${this.getText('Mark as Not Done', 'تحديد كلم يتم')}">
                     <i class="fas fa-undo"></i>
                   </button>`;
            
            row.innerHTML = `
                <td>${this.formatDate(debt.date)}</td>
                <td>${this.getDebtTypeText(debt.type)}</td>
                <td>${debt.description}</td>
                <td>€${debt.amount.toFixed(2)}</td>
                <td><span class="status-badge status-${debt.status}">${this.getStatusText(debt.status)}</span></td>
                <td>${debt.dueDate ? this.formatDate(debt.dueDate) : '-'}</td>
                <td>
                    <div class="action-buttons">
                        ${statusButton}
                        <button class="btn btn-sm btn-secondary" onclick="app.editDebt(${debt.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteDebt(${debt.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Activity Management
    addActivity(type, item) {
        const activity = {
            id: Date.now(),
            type,
            item,
            timestamp: new Date().toISOString()
        };

        // Keep only last 10 activities
        if (!this.data.activities) this.data.activities = [];
        this.data.activities.unshift(activity);
        this.data.activities = this.data.activities.slice(0, 10);
        
        this.saveData();
    }

    updateRecentActivity() {
        const container = document.getElementById('recent-activity-list');
        container.innerHTML = '';

        if (!this.data.activities || this.data.activities.length === 0) {
            container.innerHTML = `
                <div class="activity-item">
                    <div class="activity-content">
                        <p>${this.getText('No recent activity', 'لا توجد نشاطات حديثة')}</p>
                    </div>
                </div>
            `;
            return;
        }

        this.data.activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            let icon, title, description;
            
            switch (activity.type) {
                case 'work':
                    icon = 'fas fa-clock';
                    title = this.getText('Work Entry Added', 'تم إضافة إدخال عمل');
                    description = `${this.getText('Worked', 'عمل')} ${activity.item.totalHours.toFixed(2)} ${this.getText('hours', 'ساعات')} - €${activity.item.totalSalary.toFixed(2)}`;
                    break;
                case 'expense':
                    icon = 'fas fa-receipt';
                    title = this.getText('Expense Added', 'تم إضافة مصروف');
                    description = `${activity.item.description} - €${activity.item.amount.toFixed(2)}`;
                    break;
                case 'debt':
                    icon = 'fas fa-credit-card';
                    title = this.getText('Debt Added', 'تم إضافة دين');
                    description = `${activity.item.description} - €${activity.item.amount.toFixed(2)}`;
                    break;
            }

            item.innerHTML = `
                <div class="activity-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${title}</h4>
                    <p>${description}</p>
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    // Settings Management
    saveSalarySettings() {
        const hourlyRate = parseFloat(document.getElementById('default-hourly-rate').value);
        const currency = document.getElementById('currency').value;
        
        this.data.settings.hourlyRate = hourlyRate;
        this.data.settings.currency = currency;
        

        
        this.saveData();
        this.showSuccessMessage(this.getText('Salary settings saved!', 'تم حفظ إعدادات الراتب!'));
    }

    saveAppearanceSettings() {
        const theme = document.getElementById('theme').value;
        const primaryColor = document.getElementById('primary-color').value;
        const accentColor = document.getElementById('accent-color').value;
        const fontSize = document.getElementById('font-size').value;
        
        this.currentTheme = theme;
        
        // Save all appearance settings to data
        this.data.settings.theme = theme;
        this.data.settings.primaryColor = primaryColor;
        this.data.settings.accentColor = accentColor;
        this.data.settings.fontSize = fontSize;
        
        this.applyTheme(theme, primaryColor, accentColor, fontSize);
        
        this.saveData();
        this.showSuccessMessage(this.getText('Appearance settings applied!', 'تم تطبيق إعدادات المظهر!'));
    }

    resetSettingsToDefault() {
        // Reset to default values
        const defaultSettings = {
            hourlyRate: 10.00,
            currency: 'EUR',
            theme: 'light',
            primaryColor: '#3b82f6',
            accentColor: '#10b981',
            fontSize: 'medium'
        };

        // Update form fields
        document.getElementById('default-hourly-rate').value = defaultSettings.hourlyRate;
        document.getElementById('currency').value = defaultSettings.currency;
        document.getElementById('theme').value = defaultSettings.theme;
        document.getElementById('primary-color').value = defaultSettings.primaryColor;
        document.getElementById('accent-color').value = defaultSettings.accentColor;
        document.getElementById('font-size').value = defaultSettings.fontSize;



        // Apply theme
        this.currentTheme = defaultSettings.theme;
        this.applyTheme(defaultSettings.theme, defaultSettings.primaryColor, defaultSettings.accentColor, defaultSettings.fontSize);

        // Update settings in data
        this.data.settings = { ...this.data.settings, ...defaultSettings };

        // Save data
        this.saveData();

        this.showSuccessMessage(this.getText('Settings reset to default successfully!', 'تم إعادة تعيين الإعدادات للافتراضي بنجاح!'));

        // Close modal
        this.closeModal();
    }

    applyTheme(theme = this.currentTheme, primaryColor = null, accentColor = null, fontSize = null) {
        if (theme === 'auto') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        
        // Apply saved colors if not provided
        if (!primaryColor && this.data.settings && this.data.settings.primaryColor) {
            primaryColor = this.data.settings.primaryColor;
        }
        if (!accentColor && this.data.settings && this.data.settings.accentColor) {
            accentColor = this.data.settings.accentColor;
        }
        if (!fontSize && this.data.settings && this.data.settings.fontSize) {
            fontSize = this.data.settings.fontSize;
        }
        
        if (primaryColor) {
            document.documentElement.style.setProperty('--primary-color', primaryColor);
        }
        
        if (accentColor) {
            document.documentElement.style.setProperty('--accent-color', accentColor);
        }
        
        if (fontSize) {
            document.documentElement.setAttribute('data-font-size', fontSize);
        }
    }

    // Data Export/Import
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `work-manager-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showSuccessMessage(this.getText('Data exported successfully!', 'تم تصدير البيانات بنجاح!'));
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = { ...this.data, ...importedData };
                this.saveData();
                this.updateDashboard();
                this.updateAllTables();
                this.showSuccessMessage(this.getText('Data imported successfully!', 'تم استيراد البيانات بنجاح!'));
            } catch (error) {
                this.showErrorMessage(this.getText('Invalid file format!', 'تنسيق ملف غير صحيح!'));
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    clearAllData() {
        this.data = {
            workEntries: [],
            expenses: [],
            debts: [],
            activities: [],
            settings: {
                hourlyRate: 10.00,
                currency: 'EUR',
                theme: 'light',
                primaryColor: '#3b82f6',
                accentColor: '#10b981',
                fontSize: 'medium'
            }
        };
        this.saveData();
        this.loadSettingsToForms();
        this.applyTheme();
        this.updateDashboard();
        this.updateAllTables();
        this.closeModal();
        this.showSuccessMessage(this.getText('All data cleared!', 'تم مسح جميع البيانات!'));
    }

    // Modal Management
    showConfirmModal(title, message, onConfirm) {
        const modal = document.getElementById('edit-modal');
        const modalTitle = document.getElementById('edit-modal-title');
        const editForm = document.getElementById('edit-form');
        
        modalTitle.textContent = title;
        editForm.innerHTML = `
            <div class="form-group full-width">
                <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">${message}</p>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-danger" id="confirm-action">
                    <i class="fas fa-trash"></i>
                    <span>${this.getText('Confirm', 'تأكيد')}</span>
                </button>
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                    <i class="fas fa-times"></i>
                    <span>${this.getText('Cancel', 'إلغاء')}</span>
                </button>
            </div>
        `;
        
        modal.classList.add('active');
        
        document.getElementById('confirm-action').addEventListener('click', () => {
            onConfirm();
        });
    }

    closeModal() {
        const modal = document.getElementById('edit-modal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            // Clear the edit form
            const editForm = document.getElementById('edit-form');
            if (editForm) {
                editForm.innerHTML = '';
            }
        }
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString(this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US');
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        document.querySelectorAll('input[type="date"]').forEach(input => {
            if (!input.value) {
                input.value = today;
            }
        });
    }

    getCategoryText(category) {
        const categories = {
            food: { en: 'Food', ar: 'طعام' },
            transport: { en: 'Transport', ar: 'مواصلات' },
            bills: { en: 'Bills', ar: 'فواتير' },
            entertainment: { en: 'Entertainment', ar: 'ترفيه' },
            shopping: { en: 'Shopping', ar: 'تسوق' },
            withdrawal: { en: 'Withdrawal', ar: 'سحب' },
            other: { en: 'Other', ar: 'أخرى' }
        };
        return categories[category]?.[this.currentLanguage] || category;
    }

    getDebtTypeText(type) {
        const types = {
            loan: { en: 'Loan', ar: 'قرض' },
            credit: { en: 'Credit Card', ar: 'بطاقة ائتمان' },
            personal: { en: 'Personal Debt', ar: 'دين شخصي' },
            other: { en: 'Other', ar: 'أخرى' }
        };
        return types[type]?.[this.currentLanguage] || type;
    }

    getStatusText(status) {
        const statuses = {
            pending: { en: 'Not Done', ar: 'لم يتم' },
            completed: { en: 'Done', ar: 'تم' }
        };
        return statuses[status]?.[this.currentLanguage] || status;
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type} fade-in`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            color: white;
            font-weight: 500;
            z-index: 3000;
            box-shadow: var(--shadow-lg);
            ${type === 'success' ? 'background-color: var(--success-color);' : 'background-color: var(--danger-color);'}
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Edit/Delete Functions
    editWorkEntry(id) {
        const workEntry = this.data.workEntries.find(entry => entry.id === id);
        if (!workEntry) {
            this.showErrorMessage(this.getText('Work entry not found!', 'لم يتم العثور على إدخال العمل!'));
            return;
        }

        const modal = document.getElementById('edit-modal');
        const modalTitle = document.getElementById('edit-modal-title');
        const editForm = document.getElementById('edit-form');

        modalTitle.textContent = this.getText('Edit Work Entry', 'تعديل إدخال العمل');

        editForm.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-work-date" data-en="Date" data-ar="التاريخ">Date</label>
                    <input type="date" id="edit-work-date" name="work-date" value="${workEntry.date}" required>
                </div>
                <div class="form-group">
                    <label for="edit-start-time" data-en="Start Time" data-ar="وقت البدء">Start Time</label>
                    <input type="time" id="edit-start-time" name="start-time" value="${workEntry.startTime}" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-end-time" data-en="End Time" data-ar="وقت الانتهاء">End Time</label>
                    <input type="time" id="edit-end-time" name="end-time" value="${workEntry.endTime}" required>
                </div>
                <div class="form-group">
                    <label for="edit-total-hours" data-en="Total Hours" data-ar="إجمالي الساعات">Total Hours</label>
                    <input type="number" id="edit-total-hours" name="total-hours" step="0.01" value="${workEntry.totalHours}" readonly>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-total-salary" data-en="Total Salary (€)" data-ar="إجمالي الراتب (€)">Total Salary (€)</label>
                    <input type="number" id="edit-total-salary" name="total-salary" step="0.01" value="${workEntry.totalSalary}" readonly>
                </div>
            </div>
            
            <div class="form-group full-width">
                <label for="edit-work-notes" data-en="Notes" data-ar="ملاحظات">Notes</label>
                <textarea id="edit-work-notes" name="work-notes" rows="3">${workEntry.notes || ''}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i>
                    <span data-en="Save Changes" data-ar="حفظ التغييرات">Save Changes</span>
                </button>
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                    <i class="fas fa-times"></i>
                    <span data-en="Cancel" data-ar="إلغاء">Cancel</span>
                </button>
            </div>
        `;

        // Add event listeners for time calculation
        const startTimeInput = document.getElementById('edit-start-time');
        const endTimeInput = document.getElementById('edit-end-time');
        const totalHoursInput = document.getElementById('edit-total-hours');
        const totalSalaryInput = document.getElementById('edit-total-salary');

        const calculateEditHours = () => {
            const startTime = startTimeInput.value;
            const endTime = endTimeInput.value;
            const hourlyRate = this.data.settings?.hourlyRate || 10.00;

            if (startTime && endTime) {
                const start = new Date(`2000-01-01T${startTime}`);
                const end = new Date(`2000-01-01T${endTime}`);
                
                if (end < start) {
                    end.setDate(end.getDate() + 1); // Next day
                }
                
                const diffMs = end - start;
                const diffHours = diffMs / (1000 * 60 * 60);
                
                totalHoursInput.value = diffHours.toFixed(2);
                totalSalaryInput.value = (diffHours * hourlyRate).toFixed(2);
            }
        };

        startTimeInput.addEventListener('change', calculateEditHours);
        endTimeInput.addEventListener('change', calculateEditHours);

        // Handle form submission
        editForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(editForm);
            
            workEntry.date = formData.get('work-date');
            workEntry.startTime = formData.get('start-time');
            workEntry.endTime = formData.get('end-time');
            workEntry.totalHours = parseFloat(formData.get('total-hours'));
            workEntry.hourlyRate = this.data.settings?.hourlyRate || 10.00;
            workEntry.totalSalary = parseFloat(formData.get('total-salary'));
            workEntry.notes = formData.get('work-notes');

            this.saveData();
            this.updateDashboard();
            this.updateWorkHistoryTable();
            this.closeModal();
            this.showSuccessMessage(this.getText('Work entry updated successfully!', 'تم تحديث إدخال العمل بنجاح!'));
        };

        modal.classList.add('active');
    }

    deleteWorkEntry(id) {
        this.showConfirmModal(
            this.getText('Delete Work Entry', 'حذف إدخال العمل'),
            this.getText('Are you sure you want to delete this work entry?', 'هل أنت متأكد من أنك تريد حذف إدخال العمل هذا؟'),
            () => {
                this.data.workEntries = this.data.workEntries.filter(entry => entry.id !== id);
                this.saveData();
                this.updateDashboard();
                this.updateWorkHistoryTable();
                this.closeModal();
                this.showSuccessMessage(this.getText('Work entry deleted!', 'تم حذف إدخال العمل!'));
            }
        );
    }

    editExpense(id) {
        const expense = this.data.expenses.find(exp => exp.id === id);
        if (!expense) {
            this.showErrorMessage(this.getText('Expense not found!', 'لم يتم العثور على المصروف!'));
            return;
        }

        const modal = document.getElementById('edit-modal');
        const modalTitle = document.getElementById('edit-modal-title');
        const editForm = document.getElementById('edit-form');

        modalTitle.textContent = this.getText('Edit Expense', 'تعديل المصروف');

        editForm.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-expense-date" data-en="Date" data-ar="التاريخ">Date</label>
                    <input type="date" id="edit-expense-date" name="expense-date" value="${expense.date}" required>
                </div>
                <div class="form-group">
                    <label for="edit-expense-amount" data-en="Amount (€)" data-ar="المبلغ (€)">Amount (€)</label>
                    <input type="number" id="edit-expense-amount" name="expense-amount" step="0.01" value="${expense.amount}" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-expense-category" data-en="Category" data-ar="الفئة">Category</label>
                    <select id="edit-expense-category" name="expense-category" required>
                        <option value="food" ${expense.category === 'food' ? 'selected' : ''} data-en="Food" data-ar="طعام">Food</option>
                        <option value="transport" ${expense.category === 'transport' ? 'selected' : ''} data-en="Transport" data-ar="مواصلات">Transport</option>
                        <option value="utilities" ${expense.category === 'utilities' ? 'selected' : ''} data-en="Utilities" data-ar="مرافق">Utilities</option>
                        <option value="entertainment" ${expense.category === 'entertainment' ? 'selected' : ''} data-en="Entertainment" data-ar="ترفيه">Entertainment</option>
                        <option value="shopping" ${expense.category === 'shopping' ? 'selected' : ''} data-en="Shopping" data-ar="تسوق">Shopping</option>
                        <option value="health" ${expense.category === 'health' ? 'selected' : ''} data-en="Health" data-ar="صحة">Health</option>
                        <option value="education" ${expense.category === 'education' ? 'selected' : ''} data-en="Education" data-ar="تعليم">Education</option>
                        <option value="withdrawal" ${expense.category === 'withdrawal' ? 'selected' : ''} data-en="Withdrawal" data-ar="سحب">Withdrawal</option>
                        <option value="other" ${expense.category === 'other' ? 'selected' : ''} data-en="Other" data-ar="أخرى">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-expense-description" data-en="Description" data-ar="الوصف">Description</label>
                    <input type="text" id="edit-expense-description" name="expense-description" value="${expense.description}" required>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i>
                    <span data-en="Save Changes" data-ar="حفظ التغييرات">Save Changes</span>
                </button>
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                    <i class="fas fa-times"></i>
                    <span data-en="Cancel" data-ar="إلغاء">Cancel</span>
                </button>
            </div>
        `;

        // Handle form submission
        editForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(editForm);
            
            expense.date = formData.get('expense-date');
            expense.amount = parseFloat(formData.get('expense-amount'));
            expense.category = formData.get('expense-category');
            expense.description = formData.get('expense-description');

            this.saveData();
            this.updateDashboard();
            this.updateExpensesTable();
            this.closeModal();
            this.showSuccessMessage(this.getText('Expense updated successfully!', 'تم تحديث المصروف بنجاح!'));
        };

        modal.classList.add('active');
    }

    deleteExpense(id) {
        this.showConfirmModal(
            this.getText('Delete Expense', 'حذف المصروف'),
            this.getText('Are you sure you want to delete this expense?', 'هل أنت متأكد من أنك تريد حذف هذا المصروف؟'),
            () => {
                this.data.expenses = this.data.expenses.filter(expense => expense.id !== id);
                this.saveData();
                this.updateDashboard();
                this.updateExpensesTable();
                this.closeModal();
                this.showSuccessMessage(this.getText('Expense deleted!', 'تم حذف المصروف!'));
            }
        );
    }

    editDebt(id) {
        const debt = this.data.debts.find(d => d.id === id);
        if (!debt) {
            this.showErrorMessage(this.getText('Debt not found!', 'لم يتم العثور على الدين!'));
            return;
        }

        const modal = document.getElementById('edit-modal');
        const modalTitle = document.getElementById('edit-modal-title');
        const editForm = document.getElementById('edit-form');

        modalTitle.textContent = this.getText('Edit Debt', 'تعديل الدين');

        editForm.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-debt-date" data-en="Date" data-ar="التاريخ">Date</label>
                    <input type="date" id="edit-debt-date" name="debt-date" value="${debt.date}" required>
                </div>
                <div class="form-group">
                    <label for="edit-debt-amount" data-en="Amount (€)" data-ar="المبلغ (€)">Amount (€)</label>
                    <input type="number" id="edit-debt-amount" name="debt-amount" step="0.01" value="${debt.amount}" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-debt-type" data-en="Type" data-ar="النوع">Type</label>
                    <select id="edit-debt-type" name="debt-type" required>
                        <option value="loan" ${debt.type === 'loan' ? 'selected' : ''} data-en="Loan" data-ar="قرض">Loan</option>
                        <option value="credit" ${debt.type === 'credit' ? 'selected' : ''} data-en="Credit Card" data-ar="بطاقة ائتمان">Credit Card</option>
                        <option value="personal" ${debt.type === 'personal' ? 'selected' : ''} data-en="Personal Debt" data-ar="دين شخصي">Personal Debt</option>
                        <option value="other" ${debt.type === 'other' ? 'selected' : ''} data-en="Other" data-ar="أخرى">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-debt-description" data-en="Description" data-ar="الوصف">Description</label>
                    <input type="text" id="edit-debt-description" name="debt-description" value="${debt.description}" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-debt-status" data-en="Status" data-ar="الحالة">Status</label>
                    <select id="edit-debt-status" name="debt-status" required>
                        <option value="pending" ${debt.status === 'pending' ? 'selected' : ''} data-en="Not Done" data-ar="لم يتم">Not Done</option>
                        <option value="completed" ${debt.status === 'completed' ? 'selected' : ''} data-en="Done" data-ar="تم">Done</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-debt-due-date" data-en="Due Date" data-ar="تاريخ الاستحقاق">Due Date</label>
                    <input type="date" id="edit-debt-due-date" name="debt-due-date" value="${debt.dueDate || ''}">
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i>
                    <span data-en="Save Changes" data-ar="حفظ التغييرات">Save Changes</span>
                </button>
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                    <i class="fas fa-times"></i>
                    <span data-en="Cancel" data-ar="إلغاء">Cancel</span>
                </button>
            </div>
        `;

        // Handle form submission
        editForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(editForm);
            
            debt.date = formData.get('debt-date');
            debt.amount = parseFloat(formData.get('debt-amount'));
            debt.type = formData.get('debt-type');
            debt.description = formData.get('debt-description');
            debt.status = formData.get('debt-status');
            debt.dueDate = formData.get('debt-due-date');

            this.saveData();
            this.updateDashboard();
            this.updateDebtsTable();
            this.closeModal();
            this.showSuccessMessage(this.getText('Debt updated successfully!', 'تم تحديث الدين بنجاح!'));
        };

        modal.classList.add('active');
    }

    toggleDebtStatus(id) {
        const debt = this.data.debts.find(d => d.id === id);
        if (!debt) return;

        const newStatus = debt.status === 'pending' ? 'completed' : 'pending';
        const statusText = newStatus === 'completed' 
            ? this.getText('Done', 'تم') 
            : this.getText('Not Done', 'لم يتم');

        debt.status = newStatus;
        this.saveData();
        this.updateDashboard();
        this.updateDebtsTable();
        
        const message = newStatus === 'completed' 
            ? this.getText('Debt marked as completed!', 'تم تحديد الدين كمكتمل!')
            : this.getText('Debt marked as pending!', 'تم تحديد الدين كقيد الانتظار!');
        
        this.showSuccessMessage(message);
    }

    deleteDebt(id) {
        this.showConfirmModal(
            this.getText('Delete Debt', 'حذف الدين'),
            this.getText('Are you sure you want to delete this debt?', 'هل أنت متأكد من أنك تريد حذف هذا الدين؟'),
            () => {
                this.data.debts = this.data.debts.filter(debt => debt.id !== id);
                this.saveData();
                this.updateDashboard();
                this.updateDebtsTable();
                this.closeModal();
                this.showSuccessMessage(this.getText('Debt deleted!', 'تم حذف الدين!'));
            }
        );
    }
}

// Initialize the application
const app = new WorkManagerApp();

// Handle form names for FormData
document.addEventListener('DOMContentLoaded', () => {
    // Add name attributes to form inputs
    document.querySelectorAll('input, select, textarea').forEach(input => {
        if (!input.name && input.id) {
            input.name = input.id;
        }
    });
});
