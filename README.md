# Work Management System

A modern, responsive web application for managing work hours, expenses, and debts with support for both English and Arabic languages.

## Features

### 🌟 Core Features
- **Dashboard**: Overview of work statistics, earnings, expenses, and remaining balance
- **Work Entry**: Track work hours with automatic salary calculation
- **Expenses**: Manage and categorize expenses
- **Debts**: Track loans and debts with status management
- **Settings**: Customize hourly rate, currency, theme, and appearance

### 🌍 Language Support
- **English**: Primary language
- **Arabic**: Full RTL support with Arabic translations
- **Language Toggle**: Switch between languages instantly

### 💰 Currency Support
- **Euro (€)**: Default currency
- **USD ($)**: Available in settings
- **GBP (£)**: Available in settings

### 📱 Responsive Design
- **Mobile First**: Optimized for all screen sizes
- **Touch Friendly**: Easy navigation on mobile devices
- **Professional UI**: Modern, clean interface

### 🎨 Customization
- **Theme Support**: Light, Dark, and Auto themes
- **Color Customization**: Customize primary and accent colors
- **Font Size**: Adjustable text size (Small, Medium, Large)

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation
1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start using the application immediately

### First Time Setup
1. **Set Hourly Rate**: Go to Settings → Salary Settings and set your default hourly rate
2. **Add Work Entry**: Start by adding your first work entry with date, start time, and end time
3. **Track Expenses**: Add expenses as you spend money
4. **Monitor Dashboard**: View your financial overview on the dashboard

## How to Use

### Dashboard
The dashboard provides a comprehensive overview of your financial status:
- **Work Days**: Total number of work days recorded
- **Work Hours**: Total hours worked
- **Total Salary**: Total earnings from work
- **Withdrawn**: Total amount withdrawn
- **Expenses**: Total expenses (excluding withdrawals)
- **Debts**: Total outstanding debts
- **Remaining Balance**: Available balance after all deductions

### Work Entry
1. Navigate to "Work Entry" section
2. Select the work date
3. Enter start and end times
4. The system automatically calculates:
   - Total hours worked
   - Total salary based on hourly rate
5. Add optional notes
6. Click "Save Work Entry"

### Expenses
1. Go to "Expenses" section
2. Select date and enter amount
3. Choose category (Food, Transport, Bills, etc.)
4. Add description
5. Click "Add Expense"

**Note**: Use "Withdrawal" category for money you withdraw for personal use.

### Debts
1. Navigate to "Debts" section
2. Enter debt details:
   - Date
   - Amount
   - Type (Loan, Credit Card, Personal Debt, etc.)
   - Description
   - Status (Active, Paid, Partially Paid)
   - Due Date (optional)
3. Click "Add Debt"

### Settings

#### Salary Settings
- **Default Hourly Rate**: Set your standard hourly rate
- **Currency**: Choose your preferred currency

#### Appearance Settings
- **Theme**: Light, Dark, or Auto (follows system preference)
- **Primary Color**: Customize the main color scheme
- **Accent Color**: Customize secondary color
- **Font Size**: Adjust text size for better readability

#### Data Management
- **Export Data**: Download your data as JSON file
- **Import Data**: Restore data from previously exported file
- **Clear All Data**: Remove all data (use with caution)

## Data Storage

- **Local Storage**: All data is stored locally in your browser
- **No Server**: No data is sent to external servers
- **Privacy**: Your data stays on your device
- **Backup**: Use export/import feature to backup your data

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Mobile Features

### Responsive Navigation
- **Hamburger Menu**: Collapsible navigation on mobile
- **Touch Optimized**: Large touch targets for easy interaction
- **Swipe Friendly**: Smooth animations and transitions

### Mobile-Specific Features
- **Full Screen Forms**: Optimized form layouts for mobile
- **Scrollable Tables**: Horizontal scrolling for data tables
- **Responsive Cards**: Dashboard cards adapt to screen size

## Keyboard Shortcuts

- **Tab**: Navigate between form fields
- **Enter**: Submit forms
- **Escape**: Close modals
- **Arrow Keys**: Navigate through options

## Tips for Best Experience

### Work Entry Tips
- Set your default hourly rate in settings first
- Use consistent time formats (24-hour recommended)
- Add notes for important work details
- Review your work history regularly

### Expense Management
- Categorize expenses properly for better tracking
- Use "Withdrawal" category for money you take out
- Add detailed descriptions for better record keeping
- Review monthly expenses regularly

### Data Backup
- Export your data regularly
- Keep backup files in a safe location
- Import data when switching devices

### Performance
- Clear browser cache if experiencing issues
- Use modern browsers for best performance
- Close other tabs if application feels slow

## Troubleshooting

### Common Issues

**Data Not Saving**
- Check if localStorage is enabled in your browser
- Try clearing browser cache and cookies
- Ensure you're not in private/incognito mode

**Language Not Switching**
- Refresh the page after changing language
- Check if your browser supports RTL text

**Forms Not Working**
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser console for errors

**Mobile Menu Not Working**
- Tap the hamburger menu icon
- Ensure you're not in desktop mode on mobile
- Try refreshing the page

### Getting Help

If you encounter issues:
1. Check browser console for error messages
2. Try refreshing the page
3. Clear browser cache and cookies
4. Try a different browser
5. Ensure all files are in the same folder

## File Structure

```
work-management-system/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## Updates and Maintenance

### Regular Maintenance
- Export your data regularly
- Clear old browser data if needed
- Update your browser for security

### Data Migration
- Export data before major changes
- Keep backup files in multiple locations
- Test import functionality regularly

## Security and Privacy

- **No Data Transmission**: All data stays on your device
- **No Tracking**: No analytics or tracking scripts
- **Local Storage**: Data stored in browser's localStorage
- **No External Dependencies**: Only uses CDN for fonts and icons

## Future Enhancements

Planned features for future versions:
- Data export to Excel/CSV
- Charts and graphs for data visualization
- Multiple user profiles
- Cloud backup integration
- Advanced reporting features
- Tax calculation features

## License

This project is open source and available under the MIT License.

## Support

For support or feature requests, please create an issue in the project repository.

---

**Enjoy managing your work and finances with this modern, professional application!** 🚀
