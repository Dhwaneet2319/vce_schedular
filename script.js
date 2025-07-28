// ============================================
// VCE AI Study Planner - Modern JavaScript
// Professional animations with GSAP & AOS
// ============================================

// Configuration for API with premium/free plans
const API_CONFIG = {
    API_KEY: "ddc-a4f-cff88ac4cac64292ad5685995a06ae03",
    API_ENDPOINT: "https://api.a4f.co/v1/chat/completions",
    // Image Generation API Configuration
    IMAGE_API_KEY: "infip-f05e3058",
    IMAGE_API_ENDPOINT: "https://api.infip.pro/v1/images/generations",
    IMAGE_MODELS: [
        { id: "img3", name: "Imagen 3", description: "High-quality image generation" },
        { id: "img4", name: "Imagen 4", description: "Latest Imagen model" },
        { id: "qwen", name: "Qwen Visual", description: "Advanced visual AI" },
        { id: "uncen", name: "Creative Pro", description: "Unrestricted creative generation" }
    ],
    // Premium code configuration
    PREMIUM_CODE_CONFIG: {
        DEVELOPER_CODE: "DEV25", // Special code for developer access - simplified
        PREFIX_OPTIONS: ["VCEAI", "STUDY", "PLAN"],
        CODE_LENGTH: 5
    },
    // AI Models organized by plan
    FREE_MODELS: [
        { name: "Llama-3", model: "provider-3/llama-3.1-405b", description: "Open-source AI model" }
    ],
    PREMIUM_MODELS: [
        { name: "GPT-4o", model: "provider-6/gpt-4o", description: "Latest OpenAI model" },
        { name: "O3-High", model: "provider-6/o3-high", description: "Advanced reasoning AI" },
        { name: "Dhwaneet AI Pro", model: "provider-6/r1-1776", description: "Advanced study AI" },
        { name: "Dhwaneet AI", model: "provider-3/deepseek-v3", description: "Custom trained model" },
        { name: "Gemini-2.5-Pro", model: "provider-1/gemini-2.5-pro", description: "Google's latest AI" },
        { name: "GPT-4", model: "provider-3/gpt-4", description: "Reliable OpenAI model" },
        { name: "Llama-3.1-405B", model: "provider-3/llama-3.1-405b", description: "Meta's powerful AI" },
        { name: "Kimi-K2", model: "provider-6/kimi-k2", description: "Fast and efficient AI" },
        { name: "Sonar-Pro", model: "provider-1/sonar-pro", description: "Search-enhanced AI" },
        { name: "Gemini Flash Thinking", model: "provider-6/gemini-2.5-flash-thinking", description: "Fast reasoning model" },
        { name: "GPT-4o Mini Search", model: "provider-6/gpt-4o-mini-search-preview", description: "Search-optimized model" },
        { name: "GPT-4.1", model: "provider-6/gpt-4.1", description: "Enhanced GPT-4 model" },
        { name: "O4-Mini High", model: "provider-6/o4-mini-high", description: "Compact high-performance AI" },
        { name: "Sonar Deep Research", model: "provider-1/sonar-deep-research", description: "Advanced research AI" },
        { name: "Sonar Reasoning Pro", model: "provider-1/sonar-reasoning-pro", description: "Professional reasoning AI" }
    ],
    IMAGE_MODEL: "provider-4/imagen-4",
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // 1 second delay between retries
};

// ===== SECURE PREMIUM CODE MANAGER =====
class SecurePremiumCodeManager {
    constructor() {
        this.validCodes = new Map();
        // First try to load saved codes from storage
        this.loadValidCodesFromStorage();
        // Then generate default codes if needed
        this.generateSecureCodes();
        this.usedCodes = new Set(this.getUsedCodesFromStorage());
        this.isDevMode = false;
    }

    generateSecureCodes() {
        // If we already have codes from storage, don't generate again
        if (this.validCodes.size > 0) {
            return;
        }

        // Static codes with expiration dates and single-use flags - using simple formats
        const staticCodes = {
            "D25": { expires: new Date(2025, 11, 31), singleUse: false, source: "static" },
            "VCE5": { expires: new Date(2025, 11, 31), singleUse: false, source: "static" },
            "STUDY": { expires: new Date(2025, 11, 31), singleUse: false, source: "static" },
            [API_CONFIG.PREMIUM_CODE_CONFIG.DEVELOPER_CODE]: { expires: null, singleUse: false, source: "developer", isDev: true } // Never expires
        };

        // Add to our valid codes map
        Object.entries(staticCodes).forEach(([code, details]) => {
            this.validCodes.set(code, details);
        });

        // Generate some dynamic codes with shorter expiration
        this.generateDynamicCodes(5);
    }

    generateDynamicCodes(count) {
        // Generate simple 4-5 character codes
        for (let i = 0; i < count; i++) {
            const code = this.generateSimpleCode();

            // Set expiration to 30 days from now for dynamic codes
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);

            this.validCodes.set(code, {
                expires: expiryDate,
                singleUse: true,
                source: "generated"
            });

            console.log(`Generated premium code: ${code} (expires ${expiryDate.toLocaleDateString()})`);
        }

        // Save the generated codes to storage
        this.saveValidCodesToStorage();
    }

    generateRandomString(length) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like O/0, I/1
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    generateSimpleCode() {
        // Generate a simple 4-5 character code (mixed numbers and letters)
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
        const length = Math.random() > 0.5 ? 4 : 5; // Randomly choose 4 or 5 characters
        let code = '';
        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    validateCode(code) {
        // Normalize the code (uppercase, trim spaces)
        code = code.trim().toUpperCase();

        console.log(`Validating code: ${code}`);
        console.log(`Valid codes in system: ${Array.from(this.validCodes.keys()).join(', ')}`);

        // Special check for developer code (directly compare with config)
        if (code === API_CONFIG.PREMIUM_CODE_CONFIG.DEVELOPER_CODE) {
            this.isDevMode = true;
            console.log('🔑 Developer code detected and activated');
            return {
                valid: true,
                message: "Developer access granted!",
                source: "developer",
                expires: null,
                isDev: true
            };
        }

        // Check if code exists
        if (!this.validCodes.has(code)) {
            return { valid: false, message: "Invalid premium code." };
        }

        const codeDetails = this.validCodes.get(code);

        // Check if code has been used (for single-use codes)
        if (codeDetails.singleUse && this.usedCodes.has(code)) {
            return { valid: false, message: "This code has already been used." };
        }

        // Check if code has expired
        if (codeDetails.expires && new Date() > codeDetails.expires) {
            return { valid: false, message: "This premium code has expired." };
        }

        // Check if this is a developer code
        if (codeDetails.isDev) {
            this.isDevMode = true;
            console.log('🔧 Developer mode activated via stored code');
        }

        // Valid code! Mark as used if it's single-use
        if (codeDetails.singleUse) {
            this.usedCodes.add(code);
            this.saveUsedCodesToStorage();
        }

        return {
            valid: true,
            message: "Premium activated successfully!",
            source: codeDetails.source,
            expires: codeDetails.expires,
            isDev: codeDetails.isDev || false
        };
    }

    getUsedCodesFromStorage() {
        const storedCodes = localStorage.getItem('vceStudyPlanner_usedCodes');
        return storedCodes ? JSON.parse(storedCodes) : [];
    }

    saveUsedCodesToStorage() {
        localStorage.setItem('vceStudyPlanner_usedCodes', JSON.stringify([...this.usedCodes]));
    }

    loadValidCodesFromStorage() {
        const storedCodes = localStorage.getItem('vceStudyPlanner_validCodes');
        if (storedCodes) {
            try {
                const codesData = JSON.parse(storedCodes);

                // Convert the simple object format back to a Map with proper Date objects
                Object.entries(codesData).forEach(([code, details]) => {
                    // Convert expires string back to Date object if it exists
                    if (details.expires) {
                        details.expires = new Date(details.expires);
                    }
                    this.validCodes.set(code, details);
                });

                console.log(`✅ Loaded ${this.validCodes.size} valid codes from storage`);
            } catch (error) {
                console.error('Error loading valid codes from storage:', error);
            }
        }
    }

    saveValidCodesToStorage() {
        // Convert Map to a plain object for JSON serialization
        const codesObject = {};
        this.validCodes.forEach((details, code) => {
            codesObject[code] = details;
        });

        localStorage.setItem('vceStudyPlanner_validCodes', JSON.stringify(codesObject));
        console.log(`✅ Saved ${this.validCodes.size} valid codes to storage`);
    }

    generateNewInviteCode(count = 1) {
        // Only allow generating codes if in developer mode
        if (!this.isDevMode) {
            return { success: false, message: "Developer access required to generate codes." };
        }

        const newCodes = [];
        for (let i = 0; i < count; i++) {
            // Generate a simple 4-5 character code
            const code = this.generateSimpleCode();

            // Set expiration to 7 days from now for invite codes
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7);

            this.validCodes.set(code, {
                expires: expiryDate,
                singleUse: true,
                source: "invitation"
            });

            newCodes.push({
                code,
                expires: expiryDate.toLocaleDateString()
            });
        }

        // Save the generated invite codes to storage
        this.saveValidCodesToStorage();

        return { success: true, codes: newCodes };
    }

    getStoredCodes() {
        // Get all valid codes that were either generated or from invitations
        // (excluding static and developer codes)
        const generatedCodes = [];
        this.validCodes.forEach((details, code) => {
            if (details.source === 'generated' || details.source === 'invitation') {
                generatedCodes.push({
                    code,
                    expires: details.expires ? details.expires.toLocaleDateString() : 'Never',
                    used: this.usedCodes.has(code),
                    source: details.source
                });
            }
        });
        return generatedCodes;
    }
}

// ===== SUBSCRIPTION MANAGER =====
class SubscriptionManager {
    constructor() {
        this.codeManager = new SecurePremiumCodeManager();
        this.isPremium = this.checkPremiumStatus();
        this.premiumExpiry = this.getPremiumExpiryFromStorage();

        // Check if premium was just activated
        const wasJustActivated = localStorage.getItem('premiumActivated') === 'true';
        if (wasJustActivated) {
            console.log('🎉 Premium was just activated, ensuring status is updated');
            this.isPremium = true;
            localStorage.removeItem('premiumActivated'); // Clear the flag
        }

        this.selectedModel = null;
        this.init();
    }

    init() {
        this.setupModelSelector();
        this.bindEvents();
    }

    checkPremiumStatus() {
        const savedCode = localStorage.getItem('premiumCode');
        if (!savedCode) return false;

        // Check if the saved code is still valid
        const result = this.codeManager.validateCode(savedCode);

        // If valid, ensure the premium status is properly reflected
        if (result.valid) {
            console.log('🔑 Premium status confirmed with valid code');
            return true;
        }

        // Clear invalid codes
        if (!result.valid) {
            localStorage.removeItem('premiumCode');
            localStorage.removeItem('premiumExpiry');
        }

        return false;
    }

    isDevModeActive() {
        // Check if we're in developer mode through multiple ways
        return (
            this.codeManager.isDevMode ||
            localStorage.getItem('premiumCode') === API_CONFIG.PREMIUM_CODE_CONFIG.DEVELOPER_CODE ||
            localStorage.getItem('devModeActive') === 'true'
        );
    }

    getPremiumExpiryFromStorage() {
        const expiryStr = localStorage.getItem('premiumExpiry');
        return expiryStr ? new Date(expiryStr) : null;
    }

    signOut() {
        // Remove all premium and developer related items from storage
        localStorage.removeItem('premiumCode');
        localStorage.removeItem('premiumExpiry');
        localStorage.removeItem('devModeActive');

        // Reset subscription state
        this.isPremium = false;
        this.premiumExpiry = null;
        this.codeManager.isDevMode = false;

        // Reset selected model to default - using first free model
        this.selectedModel = API_CONFIG.FREE_MODELS[0].model;
        this.updateModelSelector();

        console.log('👋 User signed out, premium and developer features disabled');

        // Reload page for complete reset - this is more reliable
        setTimeout(() => location.reload(), 1000);
    }

    setupModelSelector() {
        // Create compact dropdown selector after the input panel
        const inputPanel = document.querySelector('.input-panel');
        const modelSelector = document.createElement('div');
        modelSelector.className = 'model-selector-dropdown';
        modelSelector.innerHTML = `
            <div class="dropdown-header">
                <label for="model-select">
                    <i data-lucide="cpu" class="dropdown-icon"></i>
                    Select AI Model
                </label>
                <span class="plan-status">${this.isPremium ? '👑 Premium' : '🆓 Free Plan'}</span>
            </div>
            <div class="dropdown-container">
                <select id="model-select" class="model-dropdown">
                    <option value="" disabled selected>Choose your AI model...</option>
                    ${this.buildModelOptions()}
                </select>
                <i data-lucide="chevron-down" class="dropdown-arrow"></i>
            </div>
            ${!this.isPremium ? `
                <div class="upgrade-hint">
                    <span>🔒 Want access to premium models? </span>
                    <button class="upgrade-link" onclick="window.subscriptionManager.showUpgradeModal()">
                        Upgrade to Premium
                    </button>
                </div>
            ` : ''}
        `;

        inputPanel.insertAdjacentElement('afterend', modelSelector);

        // Add styles
        this.addDropdownStyles();

        // Bind selection events
        this.bindModelDropdown();

        // Select first available model by default
        const firstModel = this.isPremium ? API_CONFIG.PREMIUM_MODELS[0] : API_CONFIG.FREE_MODELS[0];
        this.selectModel(firstModel.model);
        document.getElementById('model-select').value = firstModel.model;
    }

    buildModelOptions() {
        const freeModels = API_CONFIG.FREE_MODELS;
        const premiumModels = API_CONFIG.PREMIUM_MODELS.filter(model =>
            !freeModels.find(free => free.model === model.model)
        );

        let options = '';

        // Add free models first (always accessible)
        options += '<optgroup label="🆓 Free Models">';
        freeModels.forEach(model => {
            options += `<option value="${model.model}">${model.name} - ${model.description}</option>`;
        });
        options += '</optgroup>';

        // Add premium models
        options += '<optgroup label="👑 Premium Models">';
        premiumModels.forEach(model => {
            const disabled = !this.isPremium ? 'disabled' : '';
            const icon = !this.isPremium ? '🔒 ' : '';
            options += `<option value="${model.model}" ${disabled}>${icon}${model.name} - ${model.description}</option>`;
        });
        options += '</optgroup>';

        return options;
    }

    bindModelDropdown() {
        const dropdown = document.getElementById('model-select');
        dropdown.addEventListener('change', (e) => {
            const selectedModel = e.target.value;
            if (selectedModel) {
                this.selectModel(selectedModel);
            }
        });

        // Prevent selection of disabled options for free users
        dropdown.addEventListener('mousedown', (e) => {
            if (!this.isPremium && e.target.disabled) {
                e.preventDefault();
                this.showUpgradeModal();
            }
        });
    }

    updateModelSelector() {
        // Log premium status for debugging
        console.log(`💫 Updating model selector - Premium status: ${this.isPremium ? 'PREMIUM' : 'FREE'}`);

        // Update dropdown options
        const dropdown = document.getElementById('model-select');
        if (dropdown) {
            dropdown.innerHTML = `
                <option value="" disabled>Choose your AI model...</option>
                ${this.buildModelOptions()}
            `;

            // Select default model
            const firstModel = this.isPremium ? API_CONFIG.PREMIUM_MODELS[0] : API_CONFIG.FREE_MODELS[0];
            this.selectModel(firstModel.model);
            dropdown.value = firstModel.model;

            // Update plan status display
            const planStatus = document.querySelector('.plan-status');
            if (planStatus) {
                planStatus.textContent = this.isPremium ? '👑 Premium' : '🆓 Free Plan';
            }

            // Update upgrade hint visibility
            const upgradeHint = document.querySelector('.upgrade-hint');
            if (upgradeHint) {
                upgradeHint.style.display = this.isPremium ? 'none' : 'flex';
            } else if (!this.isPremium) {
                // Create upgrade hint if it doesn't exist
                const modelSelector = document.querySelector('.model-selector-dropdown');
                if (modelSelector) {
                    const newUpgradeHint = document.createElement('div');
                    newUpgradeHint.className = 'upgrade-hint';
                    newUpgradeHint.innerHTML = `
                        <span>🔒 Want access to premium models? </span>
                        <button class="upgrade-link" onclick="window.subscriptionManager.showUpgradeModal()">
                            Upgrade to Premium
                        </button>
                    `;
                    modelSelector.appendChild(newUpgradeHint);
                }
            }
        }
    }

    selectModel(modelPath) {
        this.selectedModel = modelPath;
        console.log(`🎯 Selected model: ${this.getSelectedModelName()}`);
    }

    getSelectedModelName() {
        const allModels = [...API_CONFIG.FREE_MODELS, ...API_CONFIG.PREMIUM_MODELS];
        const selectedModel = allModels.find(model => model.model === this.selectedModel);
        return selectedModel ? selectedModel.name : 'Unknown Model';
    }

    addDropdownStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .model-selector-dropdown {
                background: var(--bg-primary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-xl);
                padding: var(--space-4);
                margin: var(--space-4) 0;
                box-shadow: var(--shadow-sm);
            }

            .dropdown-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-3);
            }

            .dropdown-header label {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                font-weight: 600;
                color: var(--text-primary);
                margin: 0;
            }

            .dropdown-icon {
                width: 18px;
                height: 18px;
                color: var(--color-primary);
            }

            .plan-status {
                font-size: 0.875rem;
                padding: var(--space-1) var(--space-3);
                background: var(--bg-secondary);
                border-radius: var(--radius-full);
                font-weight: 500;
                color: var(--text-secondary);
            }

            .dropdown-container {
                position: relative;
            }

            .model-dropdown {
                width: 100%;
                padding: var(--space-3) var(--space-4);
                padding-right: var(--space-10);
                border: 2px solid var(--border-primary);
                border-radius: var(--radius-lg);
                background: var(--bg-secondary);
                color: var(--text-primary);
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s var(--ease-smooth);
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
            }

            .model-dropdown:focus {
                outline: none;
                border-color: var(--color-primary);
                box-shadow: 0 0 0 3px var(--color-primary-alpha);
            }

            .model-dropdown:hover {
                border-color: var(--color-primary);
            }

            .dropdown-arrow {
                position: absolute;
                right: var(--space-3);
                top: 50%;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                color: var(--text-secondary);
                pointer-events: none;
                transition: transform 0.2s ease;
            }

            .model-dropdown:focus + .dropdown-arrow {
                transform: translateY(-50%) rotate(180deg);
            }

            .model-dropdown optgroup {
                font-weight: 600;
                color: var(--text-primary);
                background: var(--bg-primary);
            }

            .model-dropdown option {
                padding: var(--space-2);
                background: var(--bg-secondary);
                color: var(--text-primary);
            }

            .model-dropdown option:disabled {
                color: var(--text-secondary);
                background: var(--bg-primary);
                opacity: 0.6;
            }

            .model-dropdown option[disabled]:hover {
                background: var(--bg-primary) !important;
            }

            .upgrade-hint {
                margin-top: var(--space-3);
                padding: var(--space-3);
                background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary));
                border: 1px dashed var(--border-primary);
                border-radius: var(--radius-lg);
                text-align: center;
                font-size: 0.875rem;
                color: var(--text-secondary);
            }

            .upgrade-link {
                background: var(--color-primary);
                color: white;
                border: none;
                padding: var(--space-1) var(--space-3);
                border-radius: var(--radius-md);
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                margin-left: var(--space-1);
                transition: all 0.2s ease;
            }

            .upgrade-link:hover {
                background: var(--color-primary-dark);
                transform: scale(1.05);
            }

            @media (max-width: 768px) {
                .dropdown-header {
                    flex-direction: column;
                    gap: var(--space-2);
                    align-items: flex-start;
                }

                .plan-status {
                    align-self: flex-end;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    showUpgradeModal() {
        const modal = document.createElement('div');
        modal.className = 'upgrade-modal';

        // Force refresh developer status when modal opens
        if (localStorage.getItem('premiumCode') === API_CONFIG.PREMIUM_CODE_CONFIG.DEVELOPER_CODE) {
            this.codeManager.isDevMode = true;
            console.log('Developer status updated based on localStorage');
        }

        // Check if we're in dev mode to show appropriate content
        const isDevMode = this.isDevModeActive();

        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${isDevMode ? '�️ Developer Console' : '�🚀 Upgrade to Premium'}</h2>
                    <button class="close-modal" id="close-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${!isDevMode ? `
                        <div class="premium-features">
                            <h3>Premium Features:</h3>
                            <ul>
                                <li>✨ Access to ${API_CONFIG.PREMIUM_MODELS.length} AI models</li>
                                <li>🧠 Advanced models like GPT-4o, O3-High</li>
                                <li>🎨 Image generation (Coming Soon)</li>
                                <li>🚀 Priority processing</li>
                                <li>📊 Advanced study analytics</li>
                            </ul>
                        </div>
                        <div class="invite-code-section">
                            <h3>Enter Invite Code:</h3>
                            <input type="text" id="invite-code" placeholder="Enter your premium code" maxlength="30">
                            <button id="activate-premium" class="activate-btn">Activate Premium</button>
                        </div>
                        <div class="contact-info">
                            <p>Want a premium code? Contact the developer:</p>
                            <a href="mailto:dhwaneet@example.com" class="contact-link">📧 Get Premium Access</a>
                        </div>
                    ` : `
                        <div class="dev-console">
                            <div class="dev-section">
                                <h3>🔑 Generate New Premium Code</h3>
                                <div class="dev-controls">
                                    <div class="number-field">
                                        <label for="code-count">Number of codes:</label>
                                        <input type="number" id="code-count" min="1" max="10" value="1">
                                    </div>
                                    <button id="generate-codes" class="dev-button">
                                        <i data-lucide="key" class="button-icon"></i>
                                        Generate
                                    </button>
                                </div>
                            </div>
                            
                            <div class="dev-section" id="generated-codes-container">
                                <h3>📋 Generated Codes</h3>
                                <div class="code-list" id="code-list">
                                    <div class="loading-codes">Loading existing codes...</div>
                                </div>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add modal styles
        this.addModalStyles();

        // Animate in
        gsap.fromTo(modal,
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo(modal.querySelector('.modal-content'),
            { scale: 0.8, y: 50 },
            { scale: 1, y: 0, duration: 0.4, delay: 0.1, ease: "back.out(1.7)" }
        );

        // Bind events
        this.bindModalEvents(modal);

        lucide.createIcons();

        // If in dev mode, load existing codes
        if (isDevMode) {
            this.loadGeneratedCodes();
        }
    }

    loadGeneratedCodes() {
        const codeList = document.getElementById('code-list');
        if (!codeList) {
            console.error('Code list container not found');
            return;
        }

        // Add loading indicator
        codeList.innerHTML = '<div class="loading-codes">Loading codes...</div>';

        // Get all codes
        const codes = this.codeManager.getStoredCodes();

        // Handle empty code list
        if (codes.length === 0) {
            codeList.innerHTML = '<div class="no-codes">No codes generated yet.<br>Use the controls above to create invite codes.</div>';
            return;
        }

        let codeListHTML = '<div class="code-table">';
        codeListHTML += `
            <div class="table-header">
                <div class="header-cell">Code</div>
                <div class="header-cell">Expires</div>
                <div class="header-cell">Status</div>
                <div class="header-cell">Source</div>
                <div class="header-cell">Action</div>
            </div>
        `;

        codes.forEach(code => {
            codeListHTML += `
                <div class="table-row">
                    <div class="table-cell code-value">${code.code}</div>
                    <div class="table-cell">${code.expires}</div>
                    <div class="table-cell">${code.used ?
                    '<span class="status used">Used</span>' :
                    '<span class="status available">Available</span>'}</div>
                    <div class="table-cell">${code.source === 'invitation' ? 'Invite' : 'Generated'}</div>
                    <div class="table-cell">
                        <button class="copy-code-btn" data-code="${code.code}" title="Copy to clipboard">
                            <i data-lucide="copy" class="copy-icon"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        codeListHTML += '</div>';
        codeList.innerHTML = codeListHTML;

        // Initialize the copy buttons
        this.initCopyButtons();
    }

    // Cross-browser clipboard copy function
    async copyToClipboard(text) {
        // Try the modern Clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            try {
                return await navigator.clipboard.writeText(text);
            } catch (err) {
                console.warn('Clipboard API failed:', err);
                // Continue to fallback methods
            }
        }

        // Fallback 1: execCommand with textarea
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;

            // Make the textarea out of viewport
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            const success = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (success) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('execCommand copy failed'));
        } catch (err) {
            console.warn('execCommand fallback failed:', err);
        }

        // Fallback 2: prompt user to copy manually
        // For browsers that don't support any automatic methods
        const confirmation = confirm(`Please copy this text manually (Ctrl+C / Cmd+C):\n\n${text}\n\nPress OK when copied.`);
        return confirmation ? Promise.resolve() : Promise.reject(new Error('User canceled manual copy'));
    }

    initCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-code-btn');

        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const code = button.getAttribute('data-code');
                const icon = button.querySelector('.copy-icon');

                // Try to copy to clipboard using multiple methods
                this.copyToClipboard(code)
                    .then(() => {
                        // Show success feedback
                        icon.setAttribute('data-lucide', 'check');
                        button.classList.add('copied');

                        // Show success toast
                        this.showSuccessMessage(`Code ${code} copied to clipboard!`);

                        // Reset after 2 seconds
                        setTimeout(() => {
                            icon.setAttribute('data-lucide', 'copy');
                            button.classList.remove('copied');
                            lucide.createIcons({
                                icons: {
                                    copy: true,
                                    check: true
                                },
                                elements: [icon]
                            });
                        }, 2000);

                        // Update icon
                        lucide.createIcons({
                            icons: {
                                copy: true,
                                check: true
                            },
                            elements: [icon]
                        });
                    })
                    .catch(err => {
                        console.error('Failed to copy code:', err);
                        this.showError('Failed to copy to clipboard. Please try again.');
                    });
            });
        });
    }

    bindModalEvents(modal) {
        const closeBtn = modal.querySelector('#close-modal');
        const backdrop = modal.querySelector('.modal-backdrop');

        [closeBtn, backdrop].forEach(el => {
            el.addEventListener('click', () => this.closeModal(modal));
        });

        // If in dev mode, bind dev console events
        const isDevMode = this.isDevModeActive();
        console.log('Modal binding - Dev mode status:', isDevMode);

        if (isDevMode) {
            const generateBtn = modal.querySelector('#generate-codes');
            const codeCount = modal.querySelector('#code-count');

            if (!generateBtn) {
                console.error('Generate button not found - dev mode UI might not be showing correctly');
                // Force refresh the modal to show dev content
                setTimeout(() => {
                    this.closeModal(modal);
                    this.showUpgradeModal();
                }, 100);
                return;
            }

            generateBtn.addEventListener('click', () => {
                const count = parseInt(codeCount.value) || 1;
                const result = this.codeManager.generateNewInviteCode(count);

                if (result.success) {
                    this.showSuccessMessage(`${count} new premium code${count > 1 ? 's' : ''} generated!`);
                    this.loadGeneratedCodes(); // Refresh code list
                } else {
                    this.showError(result.message);
                }
            });
        } else {
            // Regular premium activation flow
            const activateBtn = modal.querySelector('#activate-premium');
            const codeInput = modal.querySelector('#invite-code');

            activateBtn.addEventListener('click', () => {
                this.activatePremiumCode(codeInput.value.trim());
            });

            codeInput.addEventListener('input', () => {
                codeInput.style.borderColor = 'var(--border-primary)';
            });

            // Allow activation with Enter key
            codeInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.activatePremiumCode(codeInput.value.trim());
                }
            });
        }
    }

    activatePremiumCode(code) {
        const result = this.codeManager.validateCode(code);

        if (result.valid) {
            localStorage.setItem('premiumCode', code);

            // Check specifically for developer code
            const isDevCode = code.trim().toUpperCase() === API_CONFIG.PREMIUM_CODE_CONFIG.DEVELOPER_CODE;
            if (isDevCode || result.isDev) {
                this.codeManager.isDevMode = true;
                console.log('🔧 Developer mode activated explicitly', { isDevCode, resultIsDev: result.isDev });
                // Save dev status to storage for persistence
                localStorage.setItem('devModeActive', 'true');
            }

            // Store expiration date if applicable
            if (result.expires) {
                localStorage.setItem('premiumExpiry', result.expires.toISOString());
                this.premiumExpiry = result.expires;
            } else {
                localStorage.removeItem('premiumExpiry');
                this.premiumExpiry = null;
            }

            this.isPremium = true;
            // Set a flag to indicate premium status was just activated
            localStorage.setItem('premiumActivated', 'true');

            // If it's a dev code, don't close modal but refresh it to show dev console
            if (isDevCode || result.isDev) {
                // Refresh the modal to show dev console
                const currentModal = document.querySelector('.upgrade-modal');
                if (currentModal) {
                    this.closeModal(currentModal);
                }

                // Show developer console immediately
                setTimeout(() => {
                    this.showUpgradeModal();
                }, 300);

                this.showSuccessMessage('🛠️ Developer mode activated!');
            } else {
                this.closeModal(document.querySelector('.upgrade-modal'));
                this.showSuccessMessage('🎉 Premium activated successfully!');

                // Update the model selector immediately
                this.updateModelSelector();

                // Refresh premium features in the main app
                if (window.studyPlannerApp && window.studyPlannerApp.refreshPremiumFeatures) {
                    window.studyPlannerApp.refreshPremiumFeatures();
                }

                // Update profile manager display
                if (window.profileManager && window.profileManager.refreshProfileDisplay) {
                    window.profileManager.refreshProfileDisplay();
                }
            }
        } else {
            this.showError(result.message);
            document.getElementById('invite-code').style.borderColor = 'var(--color-error)';
        }
    }

    closeModal(modal) {
        gsap.to(modal, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => modal.remove()
        });
    }

    showError(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `
            <i data-lucide="alert-circle" class="toast-icon"></i>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-error);
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            z-index: var(--z-tooltip);
            transform: translateX(100%);
            box-shadow: var(--shadow-lg);
        `;

        document.body.appendChild(toast);
        lucide.createIcons();

        // Animate in
        gsap.to(toast, {
            x: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });

        // Remove after 4 seconds
        setTimeout(() => {
            gsap.to(toast, {
                x: '100%',
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => toast.remove()
            });
        }, 4000);
    }

    showSuccessMessage(message = '🎉 Premium activated! Refreshing...') {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `
            <i data-lucide="check-circle" class="toast-icon"></i>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            z-index: var(--z-tooltip);
            transform: translateX(100%);
            box-shadow: var(--shadow-lg);
        `;

        document.body.appendChild(toast);
        lucide.createIcons();

        gsap.to(toast, {
            x: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });

        // Auto hide after 4 seconds
        setTimeout(() => {
            gsap.to(toast, {
                x: '100%',
                duration: 0.5,
                onComplete: () => toast.remove()
            });
        }, 4000);
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `
            <i data-lucide="alert-circle" class="toast-icon"></i>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-error);
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            z-index: var(--z-tooltip);
            transform: translateX(100%);
            box-shadow: var(--shadow-lg);
        `;

        document.body.appendChild(toast);
        lucide.createIcons();

        gsap.to(toast, {
            x: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });

        setTimeout(() => {
            gsap.to(toast, {
                x: '100%',
                duration: 0.5,
                onComplete: () => toast.remove()
            });
        }, 4000);
    }

    addModalStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .upgrade-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: var(--z-modal);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--space-4);
            }

            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
            }

            .modal-content {
                position: relative;
                background: var(--bg-primary);
                border-radius: var(--radius-xl);
                width: 100%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: var(--shadow-xl);
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-6);
                border-bottom: 1px solid var(--border-primary);
            }

            .modal-header h2 {
                margin: 0;
                color: var(--text-primary);
            }

            .close-modal {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: var(--space-2);
                border-radius: var(--radius-md);
                transition: background 0.2s ease;
            }

            .close-modal:hover {
                background: var(--bg-secondary);
            }

            .modal-body {
                padding: var(--space-6);
            }

            /* Premium features section */
            .premium-features {
                margin-bottom: var(--space-6);
            }

            .premium-features h3 {
                color: var(--text-primary);
                margin-bottom: var(--space-3);
            }

            .premium-features ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .premium-features li {
                padding: var(--space-2) 0;
                color: var(--text-secondary);
            }

            .invite-code-section {
                margin-bottom: var(--space-6);
            }

            .invite-code-section h3 {
                color: var(--text-primary);
                margin-bottom: var(--space-3);
            }

            #invite-code {
                width: 100%;
                padding: var(--space-3);
                border: 2px solid var(--border-primary);
                border-radius: var(--radius-lg);
                background: var(--bg-secondary);
                color: var(--text-primary);
                font-size: 1rem;
                margin-bottom: var(--space-3);
            }

            #invite-code:focus {
                outline: none;
                border-color: var(--color-primary);
            }

            .activate-btn {
                width: 100%;
                background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
                color: white;
                border: none;
                padding: var(--space-3);
                border-radius: var(--radius-lg);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
            }

            .activate-btn:hover {
                transform: scale(1.02);
            }

            .contact-info {
                text-align: center;
                padding-top: var(--space-4);
                border-top: 1px solid var(--border-primary);
            }

            .contact-info p {
                color: var(--text-secondary);
                margin-bottom: var(--space-2);
            }

            .contact-link {
                color: var(--color-primary);
                text-decoration: none;
                font-weight: 500;
            }

            .contact-link:hover {
                text-decoration: underline;
            }
            
            /* Developer Console Styles */
            .dev-console {
                display: flex;
                flex-direction: column;
                gap: var(--space-6);
            }
            
            .dev-section {
                padding: var(--space-4);
                background: var(--bg-secondary);
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-primary);
            }
            
            .dev-section h3 {
                margin-top: 0;
                margin-bottom: var(--space-3);
                color: var(--text-primary);
                font-size: 1rem;
                display: flex;
                align-items: center;
                gap: var(--space-2);
            }
            
            .dev-controls {
                display: flex;
                gap: var(--space-3);
                align-items: flex-end;
            }
            
            .number-field {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: var(--space-2);
            }
            
            .number-field label {
                font-size: 0.875rem;
                color: var(--text-secondary);
            }
            
            #code-count {
                width: 100%;
                padding: var(--space-2);
                border: 2px solid var(--border-primary);
                border-radius: var(--radius-lg);
                background: var(--bg-primary);
                color: var(--text-primary);
            }
            
            .dev-button {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                padding: var(--space-2) var(--space-4);
                background: var(--color-primary);
                color: white;
                border: none;
                border-radius: var(--radius-lg);
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            
            .dev-button:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
            }
            
            .button-icon {
                width: 18px;
                height: 18px;
            }
            
            /* Code list styles */
            .code-list {
                max-height: 300px;
                overflow-y: auto;
                margin-top: var(--space-3);
            }
            
            .loading-codes, .no-codes {
                color: var(--text-secondary);
                font-style: italic;
                text-align: center;
                padding: var(--space-4);
            }
            
            .code-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .table-header {
                display: grid;
                grid-template-columns: 1.5fr 1fr 1fr 0.8fr 0.5fr;
                padding: var(--space-2) var(--space-1);
                background: var(--bg-tertiary);
                border-radius: var(--radius-sm);
                margin-bottom: var(--space-2);
                font-weight: 500;
                color: var(--text-primary);
                font-size: 0.875rem;
            }
            
            .header-cell {
                padding: var(--space-1);
            }
            
            .table-row {
                display: grid;
                grid-template-columns: 1.5fr 1fr 1fr 0.8fr 0.5fr;
                padding: var(--space-2) var(--space-1);
                border-bottom: 1px solid var(--border-primary);
                font-size: 0.875rem;
                color: var(--text-secondary);
            }
            
            .table-row:last-child {
                border-bottom: none;
            }
            
            .table-cell {
                padding: var(--space-1);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .code-value {
                font-family: 'JetBrains Mono', monospace;
                color: var(--text-primary);
                font-weight: 500;
            }
            
            .copy-code-btn {
                background: var(--bg-tertiary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-sm);
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                padding: 0;
                color: var(--text-secondary);
            }
            
            .copy-code-btn:hover {
                background: var(--bg-secondary);
                color: var(--text-primary);
                transform: scale(1.05);
            }
            
            .copy-code-btn.copied {
                background: var(--color-success, #10b981);
                color: white;
                border-color: var(--color-success, #10b981);
            }
            
            .copy-icon {
                width: 16px;
                height: 16px;
            }
            
            .status {
                display: inline-block;
                padding: 2px 8px;
                border-radius: var(--radius-full);
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .status.available {
                background: var(--color-success-light);
                color: var(--color-success);
            }
            
            .status.used {
                background: var(--color-warning-light);
                color: var(--color-warning);
            }

            .visual-placeholder {
                text-align: center;
                padding: var(--space-8);
                background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary));
                border: 2px dashed var(--border-primary);
                border-radius: var(--radius-lg);
                color: var(--text-secondary);
            }

            .visual-icon {
                width: 48px;
                height: 48px;
                margin-bottom: var(--space-4);
                color: var(--color-primary);
            }

            .visual-placeholder h3 {
                color: var(--text-primary);
                margin-bottom: var(--space-2);
            }

            .visual-placeholder p {
                margin-bottom: var(--space-4);
            }

            .premium-badge {
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #000;
                padding: var(--space-1) var(--space-3);
                border-radius: var(--radius-full);
                font-size: 0.75rem;
                font-weight: 600;
            }
        `;
        document.head.appendChild(styles);
    }

    bindEvents() {
        // Add keyboard shortcut for upgrading
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                if (!this.isPremium) {
                    this.showUpgradeModal();
                }
            }
        });
    }

    // ===== IMAGE GENERATION METHODS =====
    async generateImages(subjects, weakAreas) {
        console.log('🎨 generateImages method called!');
        console.log('📚 Subjects:', subjects);
        console.log('⚠️ Weak areas:', weakAreas);
        console.log('🔑 API Config:', {
            endpoint: API_CONFIG.IMAGE_API_ENDPOINT,
            key: API_CONFIG.IMAGE_API_KEY ? 'Present' : 'Missing',
            models: API_CONFIG.IMAGE_MODELS
        });

        console.log('🎨 Starting image generation with infip.pro API');

        try {
            // Create prompts for different types of visual study materials
            const imagePrompts = [
                `Create a colorful mind map diagram for ${subjects} showing key concepts and connections, educational style`,
                `Design an infographic showing study schedule and topics for ${subjects}, clean academic design`,
                `Create a flowchart diagram explaining ${weakAreas} concepts in ${subjects}, educational illustration`,
                `Design visual study cards for ${subjects} with key formulas and concepts, academic style`
            ];

            console.log('📝 Generated prompts:', imagePrompts);

            const generatedImages = [];

            // Generate images using different models for variety
            for (let i = 0; i < Math.min(imagePrompts.length, 4); i++) {
                const modelIndex = i % API_CONFIG.IMAGE_MODELS.length;
                const selectedModel = API_CONFIG.IMAGE_MODELS[modelIndex];

                console.log(`🖼️ Generating image ${i + 1}/4 with ${selectedModel.name} (${selectedModel.id})`);

                try {
                    const requestBody = {
                        model: selectedModel.id,
                        prompt: imagePrompts[i],
                        num_images: 1,
                        size: "1024x1024"
                    };

                    console.log('📤 API Request:', {
                        url: API_CONFIG.IMAGE_API_ENDPOINT,
                        method: 'POST',
                        body: requestBody
                    });

                    const response = await fetch(API_CONFIG.IMAGE_API_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${API_CONFIG.IMAGE_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestBody)
                    });

                    console.log(`📥 Response status for image ${i + 1}:`, response.status, response.statusText);

                    if (response.ok) {
                        const data = await response.json();
                        console.log(`📦 Response data for image ${i + 1}:`, data);

                        if (data.images && data.images.length > 0) {
                            generatedImages.push({
                                url: data.images[0],
                                title: this.getImageTitle(i),
                                description: this.getImageDescription(i, subjects),
                                model: selectedModel.name,
                                seed: data.seed
                            });
                            console.log(`✅ Successfully generated image ${i + 1} with ${selectedModel.name}`);
                        } else {
                            console.warn(`⚠️ No images in response for ${selectedModel.name}:`, data);
                        }
                    } else {
                        const errorText = await response.text();
                        console.error(`❌ Failed to generate image with ${selectedModel.name}: ${response.status} - ${errorText}`);
                    }
                } catch (error) {
                    console.error(`❌ Error generating image with ${selectedModel.name}:`, error);
                }

                // Small delay between requests to avoid rate limiting
                if (i < imagePrompts.length - 1) {
                    console.log('⏱️ Waiting 500ms before next request...');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            console.log(`🎉 Image generation complete. Generated ${generatedImages.length} images`);

            if (generatedImages.length > 0) {
                console.log(`🎉 Successfully generated ${generatedImages.length} images`);
                return { type: 'images', content: generatedImages };
            } else {
                console.log('⚠️ No images were generated, falling back to visual descriptions');
                return await this.generateVisualDescriptions(subjects, weakAreas);
            }

        } catch (error) {
            console.error('❌ Image generation failed:', error);
            return await this.generateVisualDescriptions(subjects, weakAreas);
        }
    }

    getImageTitle(index) {
        const titles = [
            "📊 Concept Mind Map",
            "📅 Study Schedule Infographic",
            "🔄 Process Flowchart",
            "📚 Study Reference Cards"
        ];
        return titles[index] || "📋 Study Visual";
    }

    getImageDescription(index, subjects) {
        const descriptions = [
            `Interactive mind map showing the key concepts and relationships in ${subjects}`,
            `Visual study schedule and timeline designed specifically for ${subjects}`,
            `Step-by-step flowchart breaking down complex processes in ${subjects}`,
            `Quick reference cards with essential formulas and concepts for ${subjects}`
        ];
        return descriptions[index] || `Study material for ${subjects}`;
    }

    async generateVisualDescriptions(subjects, weakAreas) {
        console.log('🎨 Generating visual descriptions as fallback');

        const visualDescriptions = [
            {
                type: "mind-map",
                title: "📊 Concept Mind Map",
                description: `A comprehensive mind map for ${subjects} connecting key concepts, formulas, and study topics. Central theme branches out to major units with color-coded sub-branches for detailed topics.`,
                content: `Create a mind map with "${subjects}" at the center, branching out to cover: main units, key formulas, important dates/events, practice questions, and study techniques.`
            },
            {
                type: "infographic",
                title: "📅 Study Timeline",
                description: `Visual study schedule showing optimal learning progression for ${subjects}. Includes daily goals, revision cycles, and exam preparation milestones.`,
                content: `Design a timeline showing: Week 1-2 (Foundation building), Week 3-4 (Deep dive into ${weakAreas}), Week 5-6 (Practice & revision), Final week (Exam strategy).`
            },
            {
                type: "flowchart",
                title: "🔄 Problem-Solving Flow",
                description: `Step-by-step flowchart for tackling difficult problems in ${subjects}, especially focusing on ${weakAreas}.`,
                content: `Create a decision tree: Read problem → Identify type → Apply relevant formula/concept → Check answer → Review if incorrect. Include specific strategies for ${weakAreas}.`
            }
        ];

        return { type: 'visual-descriptions', content: visualDescriptions };
    }
}

// ===== MODERN LOADING SCREEN CONTROLLER =====
class LoadingController {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressBar = document.querySelector('.progress-bar');
        this.init();
    }

    init() {
        // Animate progress bar
        gsap.to(this.progressBar, {
            x: '0%',
            duration: 3,
            ease: "power2.out"
        });

        // Hide loading screen after 3.5 seconds
        gsap.to(this.loadingScreen, {
            opacity: 0,
            duration: 0.5,
            delay: 3.5,
            onComplete: () => {
                this.loadingScreen.style.display = 'none';
            }
        });
    }
}

// ===== THEME CONTROLLER =====
class ThemeController {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
    }

    createThemeToggle(container) {
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle-setting';
        themeToggle.innerHTML = `
            <div class="setting-item">
                <div class="setting-info">
                    <i data-lucide="${this.currentTheme === 'dark' ? 'sun' : 'moon'}" class="setting-icon"></i>
                    <div class="setting-details">
                        <span class="setting-title">Theme</span>
                        <span class="setting-description">${this.currentTheme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
                    </div>
                </div>
                <button class="theme-toggle-btn" id="theme-toggle-btn">
                    <div class="toggle-track ${this.currentTheme === 'dark' ? 'active' : ''}">
                        <div class="toggle-thumb"></div>
                    </div>
                </button>
            </div>
        `;

        container.appendChild(themeToggle);

        // Bind toggle event
        const toggleBtn = themeToggle.querySelector('#theme-toggle-btn');
        toggleBtn.addEventListener('click', () => this.toggleTheme());

        return themeToggle;
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme(this.currentTheme);

        // Update toggle UI
        const track = document.querySelector('.toggle-track');
        const icon = document.querySelector('.setting-icon');
        const description = document.querySelector('.setting-description');

        if (track) {
            track.classList.toggle('active', this.currentTheme === 'dark');
        }

        if (icon) {
            icon.setAttribute('data-lucide', this.currentTheme === 'dark' ? 'sun' : 'moon');
            lucide.createIcons();
        }

        if (description) {
            description.textContent = this.currentTheme === 'dark' ? 'Dark mode' : 'Light mode';
        }

        // Create ripple effect
        this.createRippleEffect();
    }

    createRippleEffect() {
        const toggleBtn = document.querySelector('#theme-toggle-btn');
        if (!toggleBtn) return;

        const rect = toggleBtn.getBoundingClientRect();
        const ripple = document.createElement('div');

        ripple.style.cssText = `
            position: fixed;
            top: ${rect.top + rect.height / 2}px;
            left: ${rect.left + rect.width / 2}px;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, transparent 20%, var(--color-primary) 20%, var(--color-primary) 80%, transparent 80%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%) scale(0);
        `;

        document.body.appendChild(ripple);

        gsap.to(ripple, {
            scale: 50,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
    }
}

// ===== PROFILE MANAGER =====
class ProfileManager {
    constructor(subscriptionManager, themeController) {
        this.subscriptionManager = subscriptionManager;
        this.themeController = themeController;
        this.isDropdownOpen = false;
        this.init();
    }

    init() {
        this.createProfileSection();
        this.addProfileStyles();
        this.bindEvents();
    }

    createProfileSection() {
        // Find or create header
        let header = document.querySelector('.app-header');
        if (!header) {
            header = document.createElement('header');
            header.className = 'app-header';
            document.body.insertBefore(header, document.body.firstChild);
        }

        // Create profile section
        const profileSection = document.createElement('div');
        profileSection.className = 'profile-section';
        profileSection.innerHTML = `
            <button class="profile-trigger" id="profile-trigger">
                <div class="profile-avatar">
                    <i data-lucide="user" class="avatar-icon"></i>
                </div>
                <span class="profile-name">User</span>
                <i data-lucide="chevron-down" class="profile-arrow"></i>
            </button>
            
            <div class="profile-dropdown" id="profile-dropdown">
                <div class="dropdown-content">
                    <div class="profile-header">
                        <div class="profile-info">
                            <div class="profile-avatar-large">
                                <i data-lucide="user" class="avatar-icon-large"></i>
                            </div>
                            <div class="profile-details">
                                <h3>Guest User</h3>
                                <span class="profile-plan">${this.subscriptionManager.isPremium ? '👑 Premium' : '🆓 Free Plan'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dropdown-section">
                        <h4 class="section-title">Settings</h4>
                        <div class="settings-container" id="settings-container">
                            <!-- Theme toggle will be added here -->
                        </div>
                    </div>

                    <div class="dropdown-section">
                        <h4 class="section-title">Account</h4>
                        <button class="dropdown-item" id="update-info">
                            <i data-lucide="edit" class="item-icon"></i>
                            <span>Update Info</span>
                            <span class="item-badge">Coming Soon</span>
                        </button>
                        
                        ${!this.subscriptionManager.isPremium ? `
                            <button class="dropdown-item premium-item" id="get-premium">
                                <i data-lucide="crown" class="item-icon"></i>
                                <span>Get Premium</span>
                                <span class="item-badge premium">Upgrade</span>
                            </button>
                        ` : ''}
                        
                        <button class="dropdown-item" id="sign-out">
                            <i data-lucide="log-out" class="item-icon"></i>
                            <span>Sign Out</span>
                            <span class="item-badge">Test Mode</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        header.appendChild(profileSection);

        // Add theme toggle to settings
        const settingsContainer = document.getElementById('settings-container');
        this.themeController.createThemeToggle(settingsContainer);

        // Create icons
        lucide.createIcons();
    }

    addProfileStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            :root {
                --z-header: 100;
                --z-dropdown: 200;
                --z-modal: 1000;
                --z-tooltip: 1100;
                --color-info: #3b82f6;
                --color-primary-faded: rgba(79, 70, 229, 0.1);
                --color-accent-faded: rgba(6, 182, 212, 0.1);
                --color-primary-alpha: rgba(79, 70, 229, 0.2);
                --bg-tertiary: var(--bg-secondary);
            }

            .app-header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 60px;
                background: var(--bg-primary);
                border-bottom: 1px solid var(--border-primary);
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 0 var(--space-6);
                z-index: var(--z-header);
                backdrop-filter: blur(10px);
                box-shadow: var(--shadow-sm);
            }

            .profile-section {
                position: relative;
            }

            .profile-trigger {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                background: var(--bg-secondary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-full);
                padding: var(--space-2) var(--space-4);
                cursor: pointer;
                transition: all 0.3s var(--ease-smooth);
                color: var(--text-primary);
            }

            .profile-trigger:hover {
                background: var(--bg-tertiary);
                border-color: var(--color-primary);
            }

            .profile-trigger.active {
                background: var(--color-primary-faded);
                border-color: var(--color-primary);
            }

            .profile-avatar {
                width: 32px;
                height: 32px;
                background: var(--color-primary);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .avatar-icon {
                width: 18px;
                height: 18px;
                color: white;
            }

            .profile-name {
                font-weight: 500;
                color: var(--text-primary);
            }

            .profile-arrow {
                width: 16px;
                height: 16px;
                color: var(--text-secondary);
                transition: transform 0.2s ease;
            }

            .profile-trigger.active .profile-arrow {
                transform: rotate(180deg);
            }

            .profile-dropdown {
                position: absolute;
                top: calc(100% + var(--space-2));
                right: 0;
                width: 320px;
                background: var(--bg-primary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-xl);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s var(--ease-smooth);
                z-index: var(--z-dropdown);
            }

            .profile-dropdown.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .dropdown-content {
                padding: var(--space-4);
            }

            .profile-header {
                margin-bottom: var(--space-4);
                padding-bottom: var(--space-4);
                border-bottom: 1px solid var(--border-primary);
            }

            .profile-info {
                display: flex;
                align-items: center;
                gap: var(--space-3);
            }

            .profile-avatar-large {
                width: 48px;
                height: 48px;
                background: var(--color-primary);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .avatar-icon-large {
                width: 24px;
                height: 24px;
                color: white;
            }

            .profile-details h3 {
                margin: 0;
                color: var(--text-primary);
                font-size: 1.125rem;
                font-weight: 600;
            }

            .profile-plan {
                font-size: 0.875rem;
                color: var(--text-secondary);
            }

            .dropdown-section {
                margin-bottom: var(--space-4);
            }

            .dropdown-section:last-child {
                margin-bottom: 0;
            }

            .section-title {
                font-size: 0.75rem;
                font-weight: 600;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin: 0 0 var(--space-3) 0;
            }

            .dropdown-item {
                width: 100%;
                display: flex;
                align-items: center;
                gap: var(--space-3);
                padding: var(--space-3);
                background: none;
                border: none;
                border-radius: var(--radius-lg);
                cursor: pointer;
                transition: background 0.2s ease;
                color: var(--text-primary);
                text-align: left;
                margin-bottom: var(--space-1);
            }

            .dropdown-item:hover {
                background: var(--bg-secondary);
            }

            .dropdown-item.premium-item {
                background: linear-gradient(135deg, var(--color-primary-faded), var(--color-accent-faded));
                border: 1px solid var(--color-primary-alpha);
            }

            .dropdown-item.premium-item:hover {
                background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
                color: white;
            }

            .item-icon {
                width: 18px;
                height: 18px;
                color: var(--text-secondary);
            }

            .dropdown-item.premium-item .item-icon {
                color: var(--color-primary);
            }

            .dropdown-item.premium-item:hover .item-icon {
                color: white;
            }

            .item-badge {
                margin-left: auto;
                font-size: 0.75rem;
                background: var(--bg-secondary);
                color: var(--text-secondary);
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
            }

            .item-badge.premium {
                background: var(--color-primary);
                color: white;
            }

            .setting-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--space-3);
                border-radius: var(--radius-lg);
                transition: background 0.2s ease;
            }

            .setting-item:hover {
                background: var(--bg-secondary);
            }

            .setting-info {
                display: flex;
                align-items: center;
                gap: var(--space-3);
            }

            .setting-icon {
                width: 18px;
                height: 18px;
                color: var(--text-secondary);
            }

            .setting-details {
                display: flex;
                flex-direction: column;
            }

            .setting-title {
                font-weight: 500;
                color: var(--text-primary);
                font-size: 0.875rem;
            }

            .setting-description {
                font-size: 0.75rem;
                color: var(--text-secondary);
            }

            .theme-toggle-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
            }

            .toggle-track {
                width: 44px;
                height: 24px;
                background: var(--bg-tertiary);
                border: 2px solid var(--border-primary);
                border-radius: 12px;
                position: relative;
                transition: all 0.3s ease;
            }

            .toggle-track.active {
                background: var(--color-primary);
                border-color: var(--color-primary);
            }

            .toggle-thumb {
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                position: absolute;
                top: 2px;
                left: 2px;
                transition: transform 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .toggle-track.active .toggle-thumb {
                transform: translateX(20px);
            }

            @media (max-width: 768px) {
                .app-header {
                    padding: 0 var(--space-4);
                }

                .profile-dropdown {
                    width: 280px;
                }

                .profile-name {
                    display: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    bindEvents() {
        const trigger = document.getElementById('profile-trigger');
        const dropdown = document.getElementById('profile-dropdown');
        const getPremiumBtn = document.getElementById('get-premium');
        const updateInfoBtn = document.getElementById('update-info');
        const signOutBtn = document.getElementById('sign-out');

        // Toggle dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Premium button
        if (getPremiumBtn) {
            getPremiumBtn.addEventListener('click', () => {
                this.closeDropdown();
                this.subscriptionManager.showUpgradeModal();
            });
        }

        // Update info button (placeholder)
        updateInfoBtn.addEventListener('click', () => {
            this.showComingSoon('Update Info feature coming soon!');
        });

        // Sign out button - now functional
        signOutBtn.addEventListener('click', () => {
            this.closeDropdown();
            this.subscriptionManager.signOut();

            // Update the UI to reflect sign-out status
            const profilePlan = document.querySelector('.profile-plan');
            if (profilePlan) {
                profilePlan.textContent = '🆓 Free Plan';
            }

            // Update the "Get Premium" button if it doesn't exist
            const accountSection = document.querySelector('.dropdown-section:nth-child(2)');
            if (accountSection && !document.getElementById('get-premium')) {
                const getPremiumButton = document.createElement('button');
                getPremiumButton.id = 'get-premium';
                getPremiumButton.className = 'dropdown-item premium-item';
                getPremiumButton.innerHTML = `
                    <i data-lucide="crown" class="item-icon"></i>
                    <span>Get Premium</span>
                    <span class="item-badge premium">Upgrade</span>
                `;

                // Insert before sign out button
                accountSection.insertBefore(getPremiumButton, signOutBtn);

                // Bind event to the new button
                getPremiumButton.addEventListener('click', () => {
                    this.closeDropdown();
                    this.subscriptionManager.showUpgradeModal();
                });

                // Create icon
                lucide.createIcons();
            }

            // Update sign out button text
            const signOutBadge = signOutBtn.querySelector('.item-badge');
            if (signOutBadge) {
                signOutBadge.textContent = ''; // Remove "Coming Soon"
            }

            // Show success message
            this.showSuccessMessage('👋 Signed out successfully!');
        });

        // Close dropdown with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isDropdownOpen) {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        const trigger = document.getElementById('profile-trigger');
        const dropdown = document.getElementById('profile-dropdown');

        if (this.isDropdownOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        const trigger = document.getElementById('profile-trigger');
        const dropdown = document.getElementById('profile-dropdown');

        trigger.classList.add('active');
        dropdown.classList.add('active');
        this.isDropdownOpen = true;

        // Animate in
        gsap.fromTo(dropdown,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
    }

    closeDropdown() {
        const trigger = document.getElementById('profile-trigger');
        const dropdown = document.getElementById('profile-dropdown');

        trigger.classList.remove('active');
        dropdown.classList.remove('active');
        this.isDropdownOpen = false;
    }

    showComingSoon(message) {
        const toast = document.createElement('div');
        toast.className = 'coming-soon-toast';
        toast.innerHTML = `
            <i data-lucide="info" class="toast-icon"></i>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--color-info);
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            z-index: var(--z-tooltip);
            transform: translateX(100%);
            box-shadow: var(--shadow-lg);
        `;

        document.body.appendChild(toast);
        lucide.createIcons();

        gsap.to(toast, {
            x: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });

        setTimeout(() => {
            gsap.to(toast, {
                x: '100%',
                duration: 0.5,
                onComplete: () => toast.remove()
            });
        }, 3000);
    }

    showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `
            <i data-lucide="check-circle" class="toast-icon"></i>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--color-success, #10b981);
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            z-index: var(--z-tooltip);
            transform: translateX(100%);
            box-shadow: var(--shadow-lg);
        `;

        document.body.appendChild(toast);
        lucide.createIcons();

        gsap.to(toast, {
            x: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });

        setTimeout(() => {
            gsap.to(toast, {
                x: '100%',
                duration: 0.5,
                onComplete: () => toast.remove()
            });
        }, 3000);
    }

    refreshProfileDisplay() {
        // Update the plan status in the profile dropdown
        const planStatus = document.querySelector('.profile-plan');
        if (planStatus) {
            planStatus.textContent = this.subscriptionManager.isPremium ? '👑 Premium' : '🆓 Free Plan';
        }

        // Update the Get Premium button visibility
        const getPremiumBtn = document.getElementById('get-premium');
        if (getPremiumBtn) {
            getPremiumBtn.style.display = this.subscriptionManager.isPremium ? 'none' : 'flex';
        }

        console.log('🔄 Profile display refreshed');
    }
}

// ===== AI PROCESSING CONTROLLER =====
class AIProcessingController {
    constructor() {
        this.processingPanel = document.getElementById('ai-processing');
        this.processingStatus = document.getElementById('processing-status');
        this.steps = [
            { id: 'step-1', text: 'Analyzing your subjects and requirements...' },
            { id: 'step-2', text: 'Optimizing study schedule and priorities...' },
            { id: 'step-3', text: 'Generating personalized content and recommendations...' }
        ];
        this.currentStep = 0;
        this.currentProvider = null;
    }

    show() {
        this.processingPanel.classList.remove('hidden');
        gsap.fromTo(this.processingPanel,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
        this.startProcessing();
    }

    hide() {
        gsap.to(this.processingPanel, {
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => {
                this.processingPanel.classList.add('hidden');
                this.resetSteps();
            }
        });
    }

    startProcessing() {
        this.currentStep = 0;
        this.animateStep();
    }

    animateStep() {
        if (this.currentStep >= this.steps.length) return;

        const step = this.steps[this.currentStep];
        const stepElement = document.getElementById(step.id);

        // Update status text
        gsap.to(this.processingStatus, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                this.processingStatus.textContent = step.text;
                gsap.to(this.processingStatus, { opacity: 1, duration: 0.3 });
            }
        });

        // Activate step
        stepElement.classList.add('active');

        // Animate to next step after delay
        setTimeout(() => {
            this.currentStep++;
            this.animateStep();
        }, 2000);
    }

    resetSteps() {
        this.steps.forEach(step => {
            document.getElementById(step.id).classList.remove('active');
        });
        this.currentStep = 0;
        this.currentProvider = null;
    }

    updateProviderStatus(providerName, status = 'trying') {
        this.currentProvider = providerName;
        let statusText = '';

        switch (status) {
            case 'trying':
                statusText = `Connecting to ${providerName}...`;
                break;
            case 'success':
                statusText = `Successfully connected to ${providerName}`;
                break;
            case 'failed':
                statusText = `${providerName} unavailable, trying backup...`;
                break;
            case 'generating':
                statusText = `Generating with ${providerName}...`;
                break;
        }

        gsap.to(this.processingStatus, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                this.processingStatus.textContent = statusText;
                gsap.to(this.processingStatus, { opacity: 1, duration: 0.2 });
            }
        });
    }
}

// ===== RESULTS CONTROLLER =====
class ResultsController {
    constructor() {
        this.resultsPanel = document.getElementById('results-panel');
        this.planContent = document.getElementById('plan-content');
        this.visualContent = document.getElementById('visual-content');
        this.generationTime = document.getElementById('generation-time');
        this.confidenceScore = document.getElementById('confidence-score');
    }

    show(content, isVisual = false, metadata = {}) {
        this.resultsPanel.classList.remove('hidden');

        // Handle different content types
        if (typeof content === 'object' && content.hasVisuals !== undefined) {
            // New format with separate text and visual content
            this.planContent.innerHTML = content.text;
            this.planContent.style.display = 'block';

            if (content.hasVisuals && content.visuals) {
                this.visualContent.classList.remove('hidden');
                this.displayVisualContent(content.visuals);
            } else {
                this.visualContent.classList.add('hidden');
            }
        } else if (isVisual) {
            // Legacy visual mode (fallback)
            this.visualContent.classList.remove('hidden');
            this.planContent.style.display = 'none';
            this.visualContent.innerHTML = `
                <div class="visual-placeholder">
                    <i data-lucide="image" class="visual-icon"></i>
                    <h3>🎨 Visual Study Aids</h3>
                    <p>AI-generated diagrams and mind maps would appear here</p>
                    <span class="premium-badge">👑 Premium Feature</span>
                </div>
            `;
        } else {
            // Regular text content
            this.planContent.innerHTML = content;
            this.planContent.style.display = 'block';
            this.visualContent.classList.add('hidden');
        }

        // Update metadata
        if (metadata.time) {
            this.generationTime.textContent = `Generated in ${metadata.time}s`;
        }
        if (metadata.confidence) {
            this.confidenceScore.textContent = `${metadata.confidence}%`;
        }

        // Add model info if available
        if (metadata.model) {
            const modelInfo = document.createElement('div');
            modelInfo.className = 'model-info';
            modelInfo.innerHTML = `
                <i data-lucide="cpu" class="model-icon"></i>
                <span>Generated by ${metadata.model}</span>
            `;
            modelInfo.style.cssText = `
                display: flex;
                align-items: center;
                gap: var(--space-1);
                color: var(--text-secondary);
                font-size: 0.75rem;
                margin-top: var(--space-2);
            `;

            // Insert after confidence score
            this.confidenceScore.parentNode.appendChild(modelInfo);
        }

        // Animate in
        gsap.fromTo(this.resultsPanel,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );

        // Animate content
        gsap.fromTo(this.planContent.children,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3 }
        );

        // Create icons
        lucide.createIcons();
    }

    displayVisualContent(visualData) {
        console.log('🖼️ Displaying visual content:', visualData);

        if (visualData.type === 'images' && visualData.content.length > 0) {
            // Display actual generated images
            let imagesHTML = '<div class="images-grid">';

            visualData.content.forEach((image, index) => {
                imagesHTML += `
                    <div class="image-card">
                        <div class="image-container">
                            <img src="${image.url}" alt="${image.title}" loading="lazy" />
                            <div class="image-overlay">
                                <h4>${image.title}</h4>
                                <p>${image.description}</p>
                                <div class="image-meta">
                                    <span class="model-badge">Generated by ${image.model}</span>
                                    ${image.seed ? `<span class="seed-badge">Seed: ${image.seed}</span>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            imagesHTML += '</div>';
            this.visualContent.innerHTML = imagesHTML;

        } else if (visualData.type === 'visual-descriptions') {
            // Display visual descriptions as fallback
            let descriptionsHTML = '<div class="visual-descriptions">';
            descriptionsHTML += '<h3>🎨 Visual Study Aids</h3>';
            descriptionsHTML += '<p class="fallback-notice">🔄 Image generation is in progress. Here are visual study suggestions:</p>';

            visualData.content.forEach(desc => {
                descriptionsHTML += `
                    <div class="visual-description-card">
                        <h4>${desc.title}</h4>
                        <p class="description">${desc.description}</p>
                        <div class="content-suggestion">
                            <strong>Suggested content:</strong><br>
                            ${desc.content}
                        </div>
                    </div>
                `;
            });

            descriptionsHTML += '</div>';
            this.visualContent.innerHTML = descriptionsHTML;

        } else {
            // Default fallback
            this.visualContent.innerHTML = `
                <div class="visual-placeholder">
                    <i data-lucide="image" class="visual-icon"></i>
                    <h3>🎨 Visual Content</h3>
                    <p>Visual study aids are being generated...</p>
                    <span class="premium-badge">👑 Premium Feature</span>
                </div>
            `;
        }

        // Add visual content styles
        this.addVisualContentStyles();
    }

    addVisualContentStyles() {
        const existingStyle = document.getElementById('visual-content-styles');
        if (existingStyle) return; // Already added

        const styles = document.createElement('style');
        styles.id = 'visual-content-styles';
        styles.textContent = `
            .images-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: var(--space-4);
                margin: var(--space-4) 0;
            }

            .image-card {
                border-radius: var(--radius-lg);
                overflow: hidden;
                box-shadow: var(--shadow-md);
                background: var(--bg-secondary);
                transition: transform 0.3s ease;
            }

            .image-card:hover {
                transform: translateY(-4px);
            }

            .image-container {
                position: relative;
                aspect-ratio: 1;
                overflow: hidden;
            }

            .image-container img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }

            .image-card:hover img {
                transform: scale(1.05);
            }

            .image-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(transparent, rgba(0,0,0,0.8));
                color: white;
                padding: var(--space-3);
                transform: translateY(100%);
                transition: transform 0.3s ease;
            }

            .image-card:hover .image-overlay {
                transform: translateY(0);
            }

            .image-overlay h4 {
                margin: 0 0 var(--space-1) 0;
                font-size: 1rem;
                font-weight: 600;
            }

            .image-overlay p {
                margin: 0 0 var(--space-2) 0;
                font-size: 0.875rem;
                opacity: 0.9;
            }

            .image-meta {
                display: flex;
                gap: var(--space-2);
                flex-wrap: wrap;
            }

            .model-badge, .seed-badge {
                background: rgba(255,255,255,0.2);
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                font-size: 0.75rem;
                backdrop-filter: blur(4px);
            }

            .visual-descriptions {
                padding: var(--space-4);
            }

            .visual-descriptions h3 {
                text-align: center;
                margin-bottom: var(--space-3);
                color: var(--text-primary);
            }

            .fallback-notice {
                text-align: center;
                color: var(--text-secondary);
                font-style: italic;
                margin-bottom: var(--space-4);
                padding: var(--space-2);
                background: var(--bg-tertiary);
                border-radius: var(--radius-sm);
            }

            .visual-description-card {
                background: var(--bg-secondary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                margin-bottom: var(--space-3);
            }

            .visual-description-card h4 {
                color: var(--text-primary);
                margin-bottom: var(--space-2);
            }

            .visual-description-card .description {
                color: var(--text-secondary);
                margin-bottom: var(--space-3);
            }

            .content-suggestion {
                background: var(--bg-tertiary);
                padding: var(--space-3);
                border-radius: var(--radius-sm);
                font-size: 0.875rem;
                color: var(--text-secondary);
            }

            .content-suggestion strong {
                color: var(--text-primary);
            }
        `;
        document.head.appendChild(styles);
    }

    hide() {
        gsap.to(this.resultsPanel, {
            opacity: 0,
            y: -40,
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => {
                this.resultsPanel.classList.add('hidden');
            }
        });
    }
}

// ===== MAIN APPLICATION CONTROLLER =====
class StudyPlannerApp {
    constructor() {
        console.log('🚀 StudyPlannerApp constructor started');

        try {
            this.loadingController = new LoadingController();
            console.log('✅ LoadingController initialized');

            this.themeController = new ThemeController();
            console.log('✅ ThemeController initialized');

            this.subscriptionManager = new SubscriptionManager();
            console.log('✅ SubscriptionManager initialized');

            this.profileManager = new ProfileManager(this.subscriptionManager, this.themeController);
            console.log('✅ ProfileManager initialized');

            this.aiProcessingController = new AIProcessingController();
            console.log('✅ AIProcessingController initialized');

            this.resultsController = new ResultsController();
            console.log('✅ ResultsController initialized');

            this.isGenerating = false;

            console.log('🔧 Starting element initialization...');
            this.initializeElements();
            console.log('🔧 Starting event binding...');
            this.bindEvents();

            // Make managers globally accessible
            window.subscriptionManager = this.subscriptionManager;
            window.profileManager = this.profileManager;
            window.studyPlannerApp = this; // Make app accessible for refreshing UI

            // Add global test functions for debugging
            window.testGenerate = () => {
                console.log('🧪 Testing generate function manually...');
                this.handleGenerate();
            };

            window.testButtonClick = () => {
                console.log('🧪 Testing button click manually...');
                if (this.generateBtn) {
                    this.generateBtn.click();
                } else {
                    console.error('❌ Generate button not found!');
                }
            };

            window.testPremiumActivation = () => {
                console.log('🧪 Testing premium activation...');
                // Try one of the static codes
                const result = this.subscriptionManager.codeManager.validateCode('VCE5');
                console.log('Validation result:', result);
                if (result.valid) {
                    this.subscriptionManager.isPremium = true;
                    localStorage.setItem('premiumCode', 'VCE5');
                    this.updateImageToggle();
                    this.subscriptionManager.updateModelSelector();
                    console.log('✅ Premium activated for testing!');
                    console.log('👑 Premium status:', this.subscriptionManager.isPremium);
                    console.log('🎨 Image toggle disabled?', this.imageToggle.disabled);
                }
            };

            window.testImageGeneration = async () => {
                console.log('🧪 Testing image generation directly...');
                try {
                    const result = await this.subscriptionManager.generateImages('Chemistry, Math', 'organic chemistry, calculus');
                    console.log('🎨 Image generation result:', result);
                    return result;
                } catch (error) {
                    console.error('❌ Image generation test failed:', error);
                }
            };

            window.checkAPIStatus = async () => {
                console.log('🔍 Checking API configuration...');
                console.log('API Config:', {
                    endpoint: API_CONFIG.IMAGE_API_ENDPOINT,
                    key: API_CONFIG.IMAGE_API_KEY ? `${API_CONFIG.IMAGE_API_KEY.substring(0, 10)}...` : 'MISSING',
                    models: API_CONFIG.IMAGE_MODELS
                });

                // Test a simple API call
                try {
                    const response = await fetch(API_CONFIG.IMAGE_API_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${API_CONFIG.IMAGE_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: 'img3',
                            prompt: 'test image',
                            num_images: 1,
                            size: "512x512"
                        })
                    });

                    console.log('📡 API Response Status:', response.status);
                    const data = await response.text();
                    console.log('📦 API Response:', data.substring(0, 200) + '...');

                    if (!response.ok) {
                        console.error('❌ API Error:', response.status, data);
                    }

                    return { status: response.status, data };
                } catch (error) {
                    console.error('❌ Network Error:', error);
                    return { error: error.message };
                }
            };

            // Add a quick debug button to the page
            window.addDebugButton = () => {
                const debugBtn = document.createElement('button');
                debugBtn.textContent = '🧪 Quick Premium Test';
                debugBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                border: none;
                padding: 12px 16px;
                border-radius: 8px;
                cursor: pointer;
                z-index: 9999;
                font-size: 14px;
                font-weight: 600;
            `;
                debugBtn.onclick = () => {
                    testPremiumActivation();
                    alert('Premium activated! Now try the image toggle.');
                };
                document.body.appendChild(debugBtn);
            };

            // Auto-add debug button for testing
            setTimeout(() => addDebugButton(), 1000); console.log('🎉 StudyPlannerApp initialization complete!');
        } catch (error) {
            console.error('❌ Error during StudyPlannerApp initialization:', error);
        }
    }

    refreshPremiumFeatures() {
        // Refresh image toggle when premium status changes
        this.updateImageToggle();
        console.log('🔄 Premium features refreshed');
    }

    initializeElements() {
        console.log('🔧 Initializing DOM elements...');

        this.generateBtn = document.getElementById('generate-btn');
        this.subjectsInput = document.getElementById('subjects');
        this.daysInput = document.getElementById('days');
        this.weakAreasInput = document.getElementById('weak-areas');
        this.imageToggle = document.getElementById('image-toggle');
        this.inputPanel = document.querySelector('.input-panel');

        // Log element discovery
        console.log('📋 Elements found:');
        console.log('  - Generate button:', !!this.generateBtn, this.generateBtn);
        console.log('  - Subjects input:', !!this.subjectsInput, this.subjectsInput);
        console.log('  - Days input:', !!this.daysInput, this.daysInput);
        console.log('  - Weak areas input:', !!this.weakAreasInput, this.weakAreasInput);
        console.log('  - Image toggle:', !!this.imageToggle, this.imageToggle);
        console.log('  - Input panel:', !!this.inputPanel, this.inputPanel);

        // Test button functionality immediately
        if (this.generateBtn) {
            console.log('🧪 Testing button click directly...');
            this.generateBtn.onclick = (e) => {
                console.log('🎯 Direct onclick fired!');
                this.handleGenerate();
            };
        }

        // Update image toggle for premium users
        this.updateImageToggle();
    }

    updateImageToggle() {
        const imageToggleContainer = this.imageToggle.closest('.form-group');

        // Remove any existing labels first
        const existingLabel = imageToggleContainer.querySelector('.coming-soon-label');
        if (existingLabel) {
            existingLabel.remove();
        }

        if (!this.subscriptionManager.isPremium) {
            // Disable image generation for free users
            this.imageToggle.disabled = true;
            this.imageToggle.checked = false;

            // Add premium required message with upgrade link
            const premiumLabel = document.createElement('div');
            premiumLabel.className = 'coming-soon-label';
            premiumLabel.innerHTML = `
                <span>🎨 Premium Feature - </span>
                <button class="upgrade-link-inline" onclick="window.subscriptionManager.showUpgradeModal()">
                    Get Premium Access
                </button>
            `;
            premiumLabel.style.cssText = `
                color: var(--text-secondary);
                font-size: 0.75rem;
                margin-left: var(--space-2);
                background: var(--bg-secondary);
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                display: flex;
                align-items: center;
                gap: var(--space-1);
            `;

            // Style the upgrade link
            const upgradeBtn = premiumLabel.querySelector('.upgrade-link-inline');
            if (upgradeBtn) {
                upgradeBtn.style.cssText = `
                    background: var(--color-primary);
                    color: white;
                    border: none;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    cursor: pointer;
                    text-decoration: none;
                `;
            }

            imageToggleContainer.appendChild(premiumLabel);
        } else {
            // Enable image generation for premium users
            this.imageToggle.disabled = false;
            console.log('🎨 Image generation enabled for premium user');
        }
    }

    bindEvents() {
        console.log('🔧 Binding events to generate button:', this.generateBtn);

        if (!this.generateBtn) {
            console.error('❌ Generate button not found!');
            return;
        }

        this.generateBtn.addEventListener('click', (e) => {
            console.log('🎯 Generate button clicked!');
            e.preventDefault();
            this.handleGenerate();
        });

        // Add input animations
        [this.subjectsInput, this.daysInput, this.weakAreasInput].forEach(input => {
            if (input) {
                input.addEventListener('focus', () => this.animateInputFocus(input));
                input.addEventListener('blur', () => this.animateInputBlur(input));
            }
        });

        // Add button hover animations
        if (this.generateBtn) {
            this.generateBtn.addEventListener('mouseenter', () => this.animateButtonHover(true));
            this.generateBtn.addEventListener('mouseleave', () => this.animateButtonHover(false));
        }
    }

    animateInputFocus(input) {
        gsap.to(input, {
            scale: 1.02,
            duration: 0.2,
            ease: "power2.out"
        });
    }

    animateInputBlur(input) {
        gsap.to(input, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
        });
    }

    animateButtonHover(isHover) {
        gsap.to(this.generateBtn, {
            scale: isHover ? 1.05 : 1,
            duration: 0.3,
            ease: "power2.out"
        });
    }

    async handleGenerate() {
        console.log('🚀 handleGenerate called');

        if (this.isGenerating) {
            console.log('⏳ Already generating, skipping...');
            return;
        }

        const subjects = this.subjectsInput.value.trim();
        console.log('📚 Subjects entered:', subjects);

        if (!subjects) {
            console.log('❌ No subjects entered');
            this.showValidationError(this.subjectsInput, 'Please enter your subjects');
            return;
        }

        // Check if model is selected
        console.log('🤖 Selected model:', this.subscriptionManager.selectedModel);
        if (!this.subscriptionManager.selectedModel) {
            console.log('❌ No model selected');
            this.showValidationError(this.subjectsInput, 'Please select an AI model first');
            return;
        }

        // Check premium features
        console.log('🎨 Image toggle checked:', this.imageToggle.checked);
        console.log('👑 Is premium:', this.subscriptionManager.isPremium);

        if (this.imageToggle.checked && !this.subscriptionManager.isPremium) {
            console.log('❌ Premium required for images');
            this.showValidationError(this.imageToggle, 'Image generation is only available in Premium');
            return;
        }

        console.log('✅ All validations passed, starting generation...');
        this.isGenerating = true;
        this.updateGenerateButton(true);

        // Hide input panel and show processing
        gsap.to(this.inputPanel, {
            opacity: 0.3,
            scale: 0.98,
            duration: 0.5
        });

        this.aiProcessingController.show();

        try {
            const startTime = Date.now();
            const response = await this.generateStudyPlan();
            const endTime = Date.now();
            const generationTime = ((endTime - startTime) / 1000).toFixed(1);

            // Hide processing
            this.aiProcessingController.hide();

            // Show results
            setTimeout(() => {
                // Handle both old and new response formats
                const hasVisuals = response.hasVisuals && this.imageToggle.checked && this.subscriptionManager.isPremium;
                this.resultsController.show(response, hasVisuals, {
                    time: generationTime,
                    confidence: Math.floor(Math.random() * 10) + 90, // Simulate confidence
                    model: this.getSelectedModelName()
                });
            }, 600);

        } catch (error) {
            console.error('Generation failed:', error);

            // Enhanced error messages based on the type of failure
            let errorMessage = 'Failed to generate study plan. ';

            if (error.message.includes('HTTP 429')) {
                errorMessage += 'Rate limit exceeded. Please wait a moment and try again.';
            } else if (error.message.includes('HTTP 401')) {
                errorMessage += 'Authentication failed. Please refresh the page.';
            } else if (error.message.includes('HTTP 500')) {
                errorMessage += 'Server error. Please try again with a different model.';
            } else if (error.message.includes('Model not available')) {
                errorMessage += 'Selected model is currently unavailable. Please try a different model.';
            } else {
                errorMessage += 'Please check your connection and try again.';
            }

            this.showError(errorMessage);
            this.aiProcessingController.hide();
        } finally {
            this.isGenerating = false;
            this.updateGenerateButton(false);

            // Restore input panel
            gsap.to(this.inputPanel, {
                opacity: 1,
                scale: 1,
                duration: 0.5
            });
        }
    }

    getSelectedModelName() {
        return this.subscriptionManager.getSelectedModelName();
    }

    async generateStudyPlan() {
        const subjects = this.subjectsInput.value.trim();
        const days = parseInt(this.daysInput.value) || 5;
        const weakAreas = this.weakAreasInput.value.trim();
        const includeVisuals = this.imageToggle.checked && this.subscriptionManager.isPremium;

        const prompt = this.buildPrompt(subjects, days, weakAreas, includeVisuals);
        const selectedModel = this.subscriptionManager.selectedModel;
        const modelName = this.getSelectedModelName();

        console.log(`🔄 Using selected model: ${modelName} (${selectedModel})`);

        // Update processing status to show selected model
        this.aiProcessingController.updateProviderStatus(modelName, 'trying');

        try {
            // Generate text study plan first
            const response = await this.makeAPIRequest(selectedModel, prompt);

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Success with ${modelName}!`);

                // Update status to show successful generation
                this.aiProcessingController.updateProviderStatus(modelName, 'generating');

                const textContent = this.formatResponse(data.choices[0].message.content);

                // If visuals are requested and user is premium, generate images
                if (includeVisuals) {
                    console.log('🎨 Generating visual content for premium user...');
                    console.log('🎨 Calling generateImages with:', { subjects, weakAreas });
                    try {
                        const visualContent = await this.subscriptionManager.generateImages(subjects, weakAreas);
                        console.log('🎨 Visual content generated:', visualContent);

                        // If no images were generated, create placeholder visuals
                        if (!visualContent || !visualContent.content || visualContent.content.length === 0) {
                            console.log('⚠️ No actual images generated, creating visual placeholders...');
                            const placeholderVisuals = {
                                type: 'images',
                                content: [
                                    {
                                        url: 'https://via.placeholder.com/500x500/6366f1/ffffff?text=Mind+Map',
                                        title: '📊 Concept Mind Map',
                                        description: `Interactive mind map for ${subjects}`,
                                        model: 'Placeholder',
                                        seed: 'demo'
                                    },
                                    {
                                        url: 'https://via.placeholder.com/500x500/8b5cf6/ffffff?text=Study+Schedule',
                                        title: '📅 Study Schedule',
                                        description: `Visual timeline for ${subjects}`,
                                        model: 'Placeholder',
                                        seed: 'demo'
                                    },
                                    {
                                        url: 'https://via.placeholder.com/500x500/06b6d4/ffffff?text=Flowchart',
                                        title: '🔄 Process Flowchart',
                                        description: `Learning flow for ${subjects}`,
                                        model: 'Placeholder',
                                        seed: 'demo'
                                    }
                                ]
                            };

                            return {
                                text: textContent,
                                visuals: placeholderVisuals,
                                hasVisuals: true
                            };
                        }

                        return {
                            text: textContent,
                            visuals: visualContent,
                            hasVisuals: true
                        };
                    } catch (visualError) {
                        console.error('❌ Visual generation failed:', visualError);
                        console.warn('Visual generation failed, returning text only:', visualError);
                        return {
                            text: textContent,
                            visuals: null,
                            hasVisuals: false
                        };
                    }
                } else {
                    console.log('🚫 Visual generation skipped - includeVisuals:', includeVisuals);
                }

                return {
                    text: textContent,
                    visuals: null,
                    hasVisuals: false
                };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.warn(`❌ ${modelName} failed:`, error.message);

            // If it's a model-specific error, suggest trying another model
            if (error.message.includes('HTTP 404') || error.message.includes('not found')) {
                throw new Error('Model not available. Please try selecting a different AI model.');
            }

            throw error;
        }
    }

    async makeAPIRequest(model, prompt) {
        const response = await fetch(API_CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert VCE study planner. Create detailed, well-structured study plans.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
    }

    buildPrompt(subjects, days, weakAreas, includeVisuals) {
        let prompt = `Create a ${days}-day VCE study plan for: ${subjects}`;

        if (weakAreas) {
            prompt += `\n\nFocus areas that need extra attention: ${weakAreas}`;
        }

        if (includeVisuals) {
            prompt += '\n\nInclude suggestions for visual study aids, diagrams, and mind maps.';
        }

        prompt += '\n\nFormat the response with clear daily breakdowns, specific tasks, and study techniques.';

        return prompt;
    }

    formatResponse(content) {
        // Clean up the content first
        let cleanContent = content
            .replace(/#{1,6}\s*/g, '') // Remove markdown headers
            .replace(/\*{1,3}/g, '') // Remove asterisks (bold/italic)
            .replace(/`{1,3}/g, '') // Remove code blocks
            .trim();

        // Process line by line for better control
        const lines = cleanContent.split('\n').map(line => line.trim()).filter(line => line);
        let formattedLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Skip empty lines
            if (!line) continue;

            // Check for time blocks (e.g., "9:00 AM - 10:00 AM")
            if (/\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?\s*[-–]\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?/.test(line)) {
                formattedLines.push(`<div class="time-block">🕐 <strong>${line}</strong></div>`);
                continue;
            }

            // Check for day headers (e.g., "Day 1", "Day 2", etc.)
            if (/^Day\s+\d+/i.test(line)) {
                formattedLines.push(`<h3 class="day-title">📅 ${line}</h3>`);
                continue;
            }

            // Check for subject titles (ALL CAPS with colon or specific subjects)
            if (/^[A-Z][A-Z\s]{2,}:/.test(line) ||
                /^(Mathematics|English|Science|History|Geography|Chemistry|Physics|Biology|Psychology|Economics|Legal Studies|Business|Accounting|Art|Music|Drama|PE|Health|Literature|Media|Computing|Technology|Languages?|French|German|Italian|Japanese|Chinese|Spanish):/i.test(line)) {
                formattedLines.push(`<h4 class="subject-title">📚 ${line}</h4>`);
                continue;
            }

            // Check for bullet points
            if (/^[-•*]\s+/.test(line)) {
                const taskText = line.replace(/^[-•*]\s+/, '');
                formattedLines.push(`<div class="task-item">✓ ${taskText}</div>`);
                continue;
            }

            // Check for numbered lists
            if (/^\d+\.\s+/.test(line)) {
                const taskText = line.replace(/^\d+\.\s+/, '');
                formattedLines.push(`<div class="numbered-task">📋 ${taskText}</div>`);
                continue;
            }

            // Check for section headers (Review, Summary, etc.)
            if (/^(Review|Summary|Revision|Practice|Study|Break|Lunch|Dinner|Morning|Afternoon|Evening|Preparation|Assessment|Exam|Test|Quiz|Assignment|Project|Research|Reading|Writing|Notes|Homework)[\s:]/i.test(line)) {
                formattedLines.push(`<h4 class="section-header">📖 ${line}</h4>`);
                continue;
            }

            // Regular paragraph text
            if (line.length > 0) {
                formattedLines.push(`<p>${line}</p>`);
            }
        }

        // Join all formatted lines
        const formattedContent = formattedLines.join('');

        return `<div class="study-plan-content">${formattedContent}</div>`;
    }

    updateGenerateButton(isGenerating) {
        const buttonText = this.generateBtn.querySelector('.button-text');
        const buttonIcon = this.generateBtn.querySelector('.button-icon');

        if (isGenerating) {
            buttonText.textContent = 'Generating...';
            buttonIcon.setAttribute('data-lucide', 'loader-2');
            this.generateBtn.disabled = true;

            // Spin the icon
            gsap.to(buttonIcon, {
                rotation: 360,
                duration: 1,
                repeat: -1,
                ease: "none"
            });
        } else {
            buttonText.textContent = 'Generate Study Plan';
            buttonIcon.setAttribute('data-lucide', 'sparkles');
            this.generateBtn.disabled = false;

            // Stop spinning
            gsap.killTweensOf(buttonIcon);
            gsap.set(buttonIcon, { rotation: 0 });
        }

        lucide.createIcons();
    }

    showValidationError(input, message) {
        // Create error element
        const error = document.createElement('div');
        error.className = 'validation-error';
        error.textContent = message;
        error.style.cssText = `
            color: var(--color-error);
            font-size: 0.75rem;
            margin-top: var(--space-1);
            opacity: 0;
        `;

        input.parentNode.appendChild(error);

        // Animate in
        gsap.to(error, { opacity: 1, duration: 0.3 });
        gsap.to(input, { borderColor: 'var(--color-error)', duration: 0.3 });

        // Remove after 3 seconds
        setTimeout(() => {
            gsap.to(error, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => error.remove()
            });
            gsap.to(input, { borderColor: 'var(--border-primary)', duration: 0.3 });
        }, 3000);
    }

    showError(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `
            <i data-lucide="alert-circle" class="toast-icon"></i>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-error);
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            z-index: var(--z-tooltip);
            transform: translateX(100%);
            box-shadow: var(--shadow-lg);
        `;

        document.body.appendChild(toast);
        lucide.createIcons();

        // Animate in
        gsap.to(toast, {
            x: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });

        // Remove after 4 seconds
        setTimeout(() => {
            gsap.to(toast, {
                x: '100%',
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => toast.remove()
            });
        }, 4000);
    }
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM Content Loaded - Starting initialization...');

    // Wait for GSAP to load
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP not loaded! Animation library required.');
        return;
    }

    console.log('✅ GSAP loaded successfully');

    // Initialize the application with error handling
    try {
        window.studyPlannerApp = new StudyPlannerApp();
        console.log('🚀 VCE AI Study Planner initialized with modern UI');
    } catch (error) {
        console.error('❌ Failed to initialize StudyPlannerApp:', error);

        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ef4444;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 9999;
            font-family: system-ui, sans-serif;
        `;
        errorDiv.textContent = 'Failed to initialize the application. Please refresh the page.';
        document.body.appendChild(errorDiv);
    }
});

// ===== ADDITIONAL ANIMATIONS =====
// Smooth scroll for any internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                scrollTo: target,
                duration: 1,
                ease: "power2.inOut"
            });
        }
    }
});

// ===== SMART NAVBAR CONTROLLER =====
class SmartNavbarController {
    constructor() {
        this.navbar = document.querySelector('.app-header');
        this.lastScrollY = window.scrollY;
        this.ticking = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateNavbar();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateNavbar() {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';

        // Hide navbar when scrolling down and show when scrolling up or at top
        if (currentScrollY <= 50) {
            // At the top - always show
            this.showNavbar();
        } else if (scrollDirection === 'down' && currentScrollY > this.lastScrollY + 10) {
            // Scrolling down - hide with delay to prevent jittery behavior
            this.hideNavbar();
        } else if (scrollDirection === 'up' && this.lastScrollY > currentScrollY + 10) {
            // Scrolling up - show
            this.showNavbar();
        }

        this.lastScrollY = currentScrollY;
    }

    hideNavbar() {
        gsap.to(this.navbar, {
            y: -100,
            duration: 0.3,
            ease: "power2.out"
        });
    }

    showNavbar() {
        gsap.to(this.navbar, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    }
}

// Initialize smart navbar after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a brief delay to ensure everything is loaded
    setTimeout(() => {
        new SmartNavbarController();
    }, 100);
});
