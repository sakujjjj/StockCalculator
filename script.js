document.addEventListener('DOMContentLoaded', function() {
    // Language settings
    const langs = {
        en: {
            "trading-calculator": "Trading Calculator",
            "profit-target": "Profit Target",
            "trade-type": "Trade Type",
            "stock": "Stock",
            "day-trade": "Day Trade",
            "etf": "ETF",
            "fee-discount": "Fee Discount",
            "discount": "discount",
            "min-fee": "Min Fee",
            "buy-price": "Buy Price",
            "sell-price": "Sell Price",
            "shares": "Number of Shares",
            "trading-results": "Trading Results",
            "buy-cost": "Buy Cost",
            "buy-fee": "Buy Fee",
            "sell-value": "Sell Value",
            "sell-fee": "Sell Fee",
            "tax": "Securities Transaction Tax",
            "net-profit": "Net Profit",
            "roi": "ROI",
            "price-simulation": "Price Simulation",
            "profit": "Profit",
            "roi-table": "ROI",
            "current-price": "Current Price",
            "target-profit": "Target Profit (%)",
            "target-price": "Target Price",
            "target-sell-price": "Target Sell Price",
            "estimated-profit": "Estimated Profit",
            "footer-title": "Stock Trading Calculator",
            "footer-disclaimer": "For reference only, actual trading fees may vary by broker",
            "instructions": "Instructions",
            "about": "About",
            "settings": "Settings",
            "how-to-use": "How to Use",
            "instruction-1": "Enter buy price, sell price, and number of shares to calculate trading results.",
            "instruction-2": "Use the tabs at the top to switch between Trading Calculator and Profit Target modes.",
            "instruction-3": "Price simulation table shows potential profits at different sell prices.",
            "instruction-4": "Use the +/- buttons to adjust values quickly.",
            "instruction-5": "Switch between English and Chinese using the language button in the header.",
            "formula": "Formulas",
            "about-text": "This calculator is designed to help stock traders in Taiwan calculate potential profits and losses from their trades. It includes features for calculating transaction fees, taxes, and return on investment.",
            "about-inspiration": "Inspired by stock.epoch.tw",
            "about-version": "Version: 1.0.0",
            "last-update": "Last updated"
        },
        zh: {
            "trading-calculator": "交易計算",
            "profit-target": "獲利目標",
            "trade-type": "交易類型",
            "stock": "股票",
            "day-trade": "股票當沖",
            "etf": "ETF",
            "fee-discount": "手續費折扣",
            "discount": "折",
            "min-fee": "最低手續費",
            "buy-price": "買入價格",
            "sell-price": "賣出價格",
            "shares": "交易股數",
            "trading-results": "交易結果",
            "buy-cost": "買入成本",
            "buy-fee": "買入手續費",
            "sell-value": "賣出價值",
            "sell-fee": "賣出手續費",
            "tax": "證券交易稅",
            "net-profit": "淨利",
            "roi": "報酬率",
            "price-simulation": "價格模擬",
            "profit": "損益",
            "roi-table": "報酬率",
            "current-price": "目前股價",
            "target-profit": "目標獲利 (%)",
            "target-price": "目標價格",
            "target-sell-price": "目標賣出價",
            "estimated-profit": "預估淨利",
            "footer-title": "台股交易計算器",
            "footer-disclaimer": "本計算器僅供參考，實際交易費用可能因券商而異",
            "instructions": "使用說明",
            "about": "關於",
            "settings": "設定",
            "how-to-use": "如何使用",
            "instruction-1": "輸入買入價格、賣出價格和股數以計算交易結果。",
            "instruction-2": "使用頂部的標籤切換交易計算和獲利目標模式。",
            "instruction-3": "價格模擬表格顯示不同賣出價格下的潛在獲利。",
            "instruction-4": "使用 +/- 按鈕快速調整數值。",
            "instruction-5": "使用頂部的語言按鈕切換英文和中文。",
            "formula": "計算公式",
            "about-text": "這個計算器專為台灣股票交易者設計，幫助計算交易的潛在盈虧。包含各種手續費、稅金和投資報酬率的計算功能。",
            "about-design": "Design by Jack Ku",
            "about-version": "版本：1.0.0",
            "last-update": "最後更新"
        }
    };
    
    let currentLang = 'en';
    let rowCount = 5; // Display 5 rows for price simulation
    let taxRates = {
        'stock': 0.003,      // 0.3% for regular stock trading
        'day-trade': 0.0015, // 0.15% for day trading
        'etf': 0.001         // 0.1% for ETF
    };
    
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected tab
            tab.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Value controls (increase/decrease buttons)
    document.querySelectorAll('.value-control').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const step = parseFloat(input.getAttribute('step') || 1);
            
            if (this.classList.contains('increase')) {
                input.value = (parseFloat(input.value) || 0) + step;
            } else {
                input.value = Math.max(0, (parseFloat(input.value) || 0) - step);
            }
            
            // Trigger input event to recalculate
            input.dispatchEvent(new Event('input'));
        });
    });
    
    // Input event listeners for auto-update
    const buyPriceInput = document.getElementById('buy-price');
    const sellPriceInput = document.getElementById('sell-price');
    const sharesInput = document.getElementById('shares');
    const tradeTypeSelect = document.getElementById('trade-type');
    const feeDiscountInput = document.getElementById('fee-discount');
    const minFeeInput = document.getElementById('min-fee');
    
    // Attach event listeners to all inputs for dynamic calculation
    [buyPriceInput, sellPriceInput, sharesInput, tradeTypeSelect, feeDiscountInput, minFeeInput].forEach(input => {
        input.addEventListener('input', function() {
            calculateTrade();
            updatePriceSimulation();
        });
    });
    
    // For profit target tab
    const currentPriceInput = document.getElementById('current-price');
    const targetProfitInput = document.getElementById('target-profit');
    const targetSharesInput = document.getElementById('target-shares');
    
    [currentPriceInput, targetProfitInput, targetSharesInput].forEach(input => {
        input.addEventListener('input', calculateProfitTarget);
    });
    
    // Theme switching
    const themeSwitch = document.getElementById('theme-switch');
    themeSwitch.addEventListener('click', toggleTheme);
    
    function toggleTheme() {
        const isDarkTheme = document.body.classList.toggle('dark-theme');
        themeSwitch.querySelector('i').className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Language switching
    const langSwitch = document.getElementById('lang-switch');
    langSwitch.addEventListener('click', toggleLanguage);
    
    function toggleLanguage() {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        document.getElementById('lang-text').textContent = currentLang === 'en' ? '中文' : 'English';
        updateLanguage();
    }
    
    function updateLanguage() {
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (langs[currentLang][key]) {
                element.textContent = langs[currentLang][key];
            }
        });
        
        // Update title
        document.getElementById('title').textContent = langs[currentLang]['footer-title'];
        
        // Re-run calculations to update formats
        calculateTrade();
        updatePriceSimulation();
    }
    
    // Trading calculation function
    function calculateTrade() {
        // Get input values
        const buyPrice = parseFloat(buyPriceInput.value) || 0;
        const sellPrice = parseFloat(sellPriceInput.value) || 0;
        const shares = parseInt(sharesInput.value) || 0;
        const tradeType = tradeTypeSelect.value;
        const feeDiscount = parseFloat(feeDiscountInput.value) || 0.6;
        const minFee = parseFloat(minFeeInput.value) || 20;
        
        // Calculate costs with the fee discount
        const buyCost = buyPrice * shares;
        const buyFee = Math.max(minFee, Math.floor(buyCost * 0.001425 * feeDiscount)); // Buy fee with discount
        
        const sellValue = sellPrice * shares;
        const sellFee = Math.max(minFee, Math.floor(sellValue * 0.001425 * feeDiscount)); // Sell fee with discount
        const tax = Math.floor(sellValue * taxRates[tradeType]); // Tax based on trade type
        
        // Calculate net profit and ROI
        const netProfit = sellValue - buyCost - buyFee - sellFee - tax;
        const roi = buyCost > 0 ? (netProfit / (buyCost + buyFee)) * 100 : 0;
        
        // Display results
        document.getElementById('buy-cost').textContent = formatCurrency(buyCost);
        document.getElementById('buy-fee').textContent = formatCurrency(buyFee);
        document.getElementById('sell-value').textContent = formatCurrency(sellValue);
        document.getElementById('sell-fee').textContent = formatCurrency(sellFee);
        document.getElementById('tax').textContent = formatCurrency(tax);
        document.getElementById('net-profit').textContent = formatCurrency(netProfit);
        document.getElementById('roi').textContent = formatPercentage(roi);
        
        // Set color based on profit/loss
        const netProfitElement = document.getElementById('net-profit');
        const roiElement = document.getElementById('roi');
        
        netProfitElement.className = netProfit > 0 ? 'positive' : netProfit < 0 ? 'negative' : '';
        roiElement.className = roi > 0 ? 'positive' : roi < 0 ? 'negative' : '';
        
        // Update last updated time
        updateTimestamp();
        
        return { netProfit, roi };
    }
    
    // Update price simulation table
    function updatePriceSimulation() {
        const buyPrice = parseFloat(buyPriceInput.value) || 0;
        const sellPrice = parseFloat(sellPriceInput.value) || 0;
        const shares = parseInt(sharesInput.value) || 0;
        const tradeType = tradeTypeSelect.value;
        const feeDiscount = parseFloat(feeDiscountInput.value) || 0.6;
        const minFee = parseFloat(minFeeInput.value) || 20;
        
        if (buyPrice <= 0 || sellPrice <= 0 || shares <= 0) {
            return;
        }
        
        const tableBody = document.querySelector('#price-simulation tbody');
        tableBody.innerHTML = '';
        
        // Start from 2 steps below the sell price and go up
        const startPrice = sellPrice - 2;
        
        for (let i = 0; i < rowCount; i++) {
            const currentPrice = startPrice + i;
            
            // Skip negative prices
            if (currentPrice <= 0) continue;
            
            // Calculate trading costs
            const buyCost = buyPrice * shares;
            const buyFee = Math.max(minFee, Math.floor(buyCost * 0.001425 * feeDiscount));
            
            const sellValue = currentPrice * shares;
            const sellFee = Math.max(minFee, Math.floor(sellValue * 0.001425 * feeDiscount));
            const tax = Math.floor(sellValue * taxRates[tradeType]);
            
            const totalCost = buyCost + buyFee;
            const netProfit = sellValue - buyCost - buyFee - sellFee - tax;
            const roi = (netProfit / totalCost) * 100;
            
            // Create table row
            const row = document.createElement('tr');
            if (currentPrice === sellPrice) {
                row.classList.add('current-price');
            }
            
            const priceCell = document.createElement('td');
            priceCell.textContent = currentPrice.toFixed(2);
            
            const profitCell = document.createElement('td');
            profitCell.textContent = formatCurrency(netProfit).replace(' TWD', '');
            profitCell.className = netProfit > 0 ? 'positive' : netProfit < 0 ? 'negative' : '';
            
            const roiCell = document.createElement('td');
            roiCell.textContent = formatPercentage(roi).replace(' %', '');
            roiCell.className = roi > 0 ? 'positive' : roi < 0 ? 'negative' : '';
            
            row.appendChild(priceCell);
            row.appendChild(profitCell);
            row.appendChild(roiCell);
            
            tableBody.appendChild(row);
        }
    }
    
    // Profit target calculation function
    function calculateProfitTarget() {
        const currentPrice = parseFloat(currentPriceInput.value) || 0;
        const targetProfit = parseFloat(targetProfitInput.value) || 0;
        const shares = parseInt(targetSharesInput.value) || 0;
        const tradeType = tradeTypeSelect.value;
        const feeDiscount = parseFloat(feeDiscountInput.value) || 0.6;
        const minFee = parseFloat(minFeeInput.value) || 20;
        
        if (currentPrice <= 0 || shares <= 0) {
            return;
        }
        
        // Calculate buy cost and fees
        const buyCost = currentPrice * shares;
        const buyFee = Math.max(minFee, Math.floor(buyCost * 0.001425 * feeDiscount));
        const totalInvestment = buyCost + buyFee;
        
        // Calculate target sell price
        // Solving for x:
        // (x * shares - x * shares * 0.001425 * feeDiscount - x * shares * taxRate - totalInvestment) / totalInvestment = targetProfit / 100
        
        // Simplified calculation
        const targetReturn = 1 + (targetProfit / 100);
        const sellPrice = (totalInvestment * targetReturn) / (shares * (1 - 0.001425 * feeDiscount - taxRates[tradeType]));
        
        // Calculate estimated profit
        const sellValue = sellPrice * shares;
        const sellFee = Math.max(minFee, Math.floor(sellValue * 0.001425 * feeDiscount));
        const tax = Math.floor(sellValue * taxRates[tradeType]);
        const estimatedProfit = sellValue - sellFee - tax - totalInvestment;
        
        // Display results
        document.getElementById('target-price').textContent = formatCurrency(sellPrice);
        document.getElementById('estimated-profit').textContent = formatCurrency(estimatedProfit);
        
        // Update last updated time
        updateTimestamp();
    }
    
    // Copy results
    document.getElementById('copy-results').addEventListener('click', function() {
        const buyPrice = document.getElementById('buy-price').textContent;
        const sellPrice = document.getElementById('sell-price').textContent;
        const shares = document.getElementById('shares').textContent;
        const netProfit = document.getElementById('net-profit').textContent;
        const roi = document.getElementById('roi').textContent;
        
        const text = `${langs[currentLang]['buy-price']}: ${buyPrice}\n${langs[currentLang]['sell-price']}: ${sellPrice}\n${langs[currentLang]['shares']}: ${shares}\n${langs[currentLang]['net-profit']}: ${netProfit}\n${langs[currentLang]['roi']}: ${roi}`;
        
        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard!');
        });
    });
    
    // Export results
    document.getElementById('export-results').addEventListener('click', function() {
        const buyPrice = parseInt(document.getElementById('buy-price').textContent) || 0;
        const sellPrice = parseInt(document.getElementById('sell-price').textContent) || 0;
        const shares = parseInt(document.getElementById('shares').textContent) || 0;
        
        if (buyPrice <= 0 || sellPrice <= 0 || shares <= 0) {
            alert('Please enter valid values before exporting.');
            return;
        }
        
        const tableBody = document.querySelector('#price-simulation tbody');
        let csvContent = "Sell Price,Profit,ROI\n";
        
        Array.from(tableBody.querySelectorAll('tr')).forEach(row => {
            const cells = row.querySelectorAll('td');
            const csvRow = Array.from(cells).map(cell => cell.textContent).join(',');
            csvContent += csvRow + '\n';
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'stock_simulation.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Modal controls
    document.getElementById('settings-button').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('settings-modal').classList.add('active');
    });

    document.getElementById('show-instructions').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('instructions-modal').classList.add('active');
    });
    
    document.getElementById('show-about').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('about-modal').classList.add('active');
    });
    
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Format currency numbers
    function formatCurrency(number) {
        const formatter = new Intl.NumberFormat(currentLang === 'en' ? 'en-US' : 'zh-TW', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return formatter.format(number) + ' TWD';
    }
    
    // Format percentages
    function formatPercentage(number) {
        return number.toFixed(2) + ' %';
    }
    
    // Update timestamp
    function updateTimestamp() {
        const now = new Date();
        const options = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false
        };
        document.getElementById('update-time').textContent = now.toLocaleTimeString(
            currentLang === 'en' ? 'en-US' : 'zh-TW', 
            options
        );
    }
    
    // Initial setup
    updateLanguage();
    updateTimestamp();
    
    // Enable dark theme by default
    document.body.classList.add('dark-theme');
    themeSwitch.querySelector('i').className = 'fas fa-sun';
    
    // Initial calculations
    calculateTrade();
    updatePriceSimulation();
}); 