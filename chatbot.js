// ===== CHATBOT CONFIGURATION =====
const CHATBOT_CONFIG = {
    API_ENDPOINT: "https://api.a4f.co/v1/chat/completions",
    API_KEY: "ddc-a4f-cff88ac4cac64292ad5685995a06ae03",
    IMAGE_API_ENDPOINT: "https://api.infip.pro/v1/images/generations",
    IMAGE_API_KEY: "infip-f05e3058",

    FREE_MODELS: [
        { id: "provider-3/llama-3.1-405b", name: "Llama-3", description: "Open-source AI model", badge: "Free" }
    ],

    PREMIUM_MODELS: [
        { id: "provider-6/gpt-4o", name: "GPT-4o", description: "Latest OpenAI model", badge: "Premium" },
        { id: "provider-6/o3-high", name: "O3-High", description: "Advanced reasoning AI", badge: "Premium" },
        { id: "provider-6/r1-1776", name: "Dhwaneet AI Pro", description: "Advanced study AI", badge: "Premium" },
        { id: "provider-3/deepseek-v3", name: "Dhwaneet AI", description: "Custom trained model", badge: "Premium" },
        { id: "provider-6/kimi-k2", name: "Kimi-K2", description: "Fast and efficient AI", badge: "Premium" },
        { id: "provider-1/gemini-2.5-pro", name: "Gemini-2.5-Pro", description: "Google's latest AI", badge: "Premium" },
        { id: "provider-3/gpt-4", name: "GPT-4", description: "Reliable OpenAI model", badge: "Premium" },
        { id: "provider-3/llama-3.1-405b", name: "Llama-3.1-405B", description: "Meta's powerful AI", badge: "Premium" },
        { id: "provider-1/sonar-pro", name: "Sonar-Pro", description: "Search-enhanced AI", badge: "Premium" },
        { id: "provider-6/gemini-2.5-flash-thinking", name: "Gemini Flash Thinking", description: "Fast reasoning model", badge: "Premium" },
        { id: "provider-6/gpt-4o-mini-search-preview", name: "GPT-4o Mini Search", description: "Search-optimized model", badge: "Premium" },
        { id: "provider-6/gpt-4.1", name: "GPT-4.1", description: "Enhanced GPT-4 model", badge: "Premium" },
        { id: "provider-6/o4-mini-high", name: "O4-Mini High", description: "Compact high-performance AI", badge: "Premium" },
        { id: "provider-1/sonar-deep-research", name: "Sonar Deep Research", description: "Advanced research AI", badge: "Premium" },
        { id: "provider-1/sonar-reasoning-pro", name: "Sonar Reasoning Pro", description: "Professional reasoning AI", badge: "Premium" }
    ],

    IMAGE_MODELS: [
        { id: "img3", name: "Imagen 3", description: "High-quality image generation", badge: "Image" },
        { id: "img4", name: "Imagen 4", description: "Latest Imagen model", badge: "Image" },
        { id: "qwen", name: "Qwen Visual", description: "Advanced visual AI", badge: "Image" }
    ]
};

// ===== CHATBOT APPLICATION =====
class VCEChatbot {
    constructor() {
        console.log('🤖 Initializing VCE Chatbot...');

        this.selectedModel = "provider-3/llama-3.1-405b"; // Default to free model
        this.selectedModelType = "text";
        this.messages = [];
        this.isGenerating = false;
        this.imageGenerationEnabled = false;
        this.isPremium = this.checkPremiumStatus();

        this.initializeElements();
        this.bindEvents();
        this.updateImageToggle();
        this.populateModelDropdown();

        // Load conversation history
        this.loadConversationHistory();

        console.log('✅ VCE Chatbot initialized successfully');
    }

    checkPremiumStatus() {
        // Check if user has premium (same logic as study planner)
        const premiumCode = localStorage.getItem('premiumCode');
        return premiumCode !== null;
    }

    getModelDisplayName(modelId) {
        // Find the model in all available models and return the display name
        const allModels = [
            ...CHATBOT_CONFIG.FREE_MODELS,
            ...CHATBOT_CONFIG.PREMIUM_MODELS,
            ...CHATBOT_CONFIG.IMAGE_MODELS
        ];

        const model = allModels.find(m => m.id === modelId);
        return model ? model.name : 'Unknown Model';
    }

    initializeElements() {
        // Main elements
        this.chatMessages = document.getElementById('chat-messages');
        this.emptyState = document.getElementById('empty-state');
        this.messageInput = document.getElementById('message-input');
        this.sendBtn = document.getElementById('send-btn');
        this.attachBtn = document.getElementById('attach-btn');

        // Header elements
        this.modelSelector = document.getElementById('model-selector');
        this.modelDropdown = document.getElementById('model-dropdown');
        this.selectedModelName = document.getElementById('selected-model-name');
        this.clearChatBtn = document.getElementById('clear-chat');
        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.backToPlanner = document.getElementById('back-to-planner');

        // Feature toggles
        this.imageToggle = document.getElementById('image-toggle');

        // Check for missing critical elements
        const criticalElements = {
            'chat-messages': this.chatMessages,
            'message-input': this.messageInput,
            'send-btn': this.sendBtn,
            'model-selector': this.modelSelector
        };

        for (const [name, element] of Object.entries(criticalElements)) {
            if (!element) {
                console.error(`❌ Critical element missing: ${name}`);
            }
        }

        console.log('📋 Elements initialized:', {
            chatMessages: !!this.chatMessages,
            messageInput: !!this.messageInput,
            sendBtn: !!this.sendBtn,
            modelSelector: !!this.modelSelector
        });
    }

    bindEvents() {
        // Send message
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        }

        if (this.messageInput) {
            this.messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });

            // Auto-resize textarea
            this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
        }

        // Model selector
        if (this.modelSelector) {
            this.modelSelector.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleModelDropdown();
            });
        }

        // Model options
        if (this.modelDropdown) {
            this.modelDropdown.addEventListener('click', (e) => {
                if (e.target.closest('.model-option')) {
                    const option = e.target.closest('.model-option');
                    const modelId = option.dataset.model;
                    const modelType = option.dataset.type || 'text';
                    this.selectModel(modelId, modelType);
                }
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.modelSelector && !this.modelSelector.contains(e.target)) {
                this.closeModelDropdown();
            }
        });

        // Header actions
        if (this.clearChatBtn) {
            this.clearChatBtn.addEventListener('click', () => this.clearChat());
        }
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
        if (this.backToPlanner) {
            this.backToPlanner.addEventListener('click', () => this.goBackToPlanner());
        }

        // Image toggle
        if (this.imageToggle) {
            this.imageToggle.addEventListener('click', () => this.toggleImageGeneration());
        }

        // Example prompts
        if (this.emptyState) {
            this.emptyState.addEventListener('click', (e) => {
                if (e.target.closest('.example-prompt')) {
                    const prompt = e.target.closest('.example-prompt').dataset.prompt;
                    if (this.messageInput) {
                        this.messageInput.value = prompt;
                        this.messageInput.focus();
                    }
                }
            });
        }

        console.log('🔗 Events bound');
    }

    updateImageToggle() {
        if (!this.imageToggle) {
            console.warn('⚠️ Image toggle element not found');
            return;
        }

        // Always disable image generation for now (Coming Soon)
        this.imageToggle.classList.add('disabled', 'coming-soon');
        this.imageToggle.style.opacity = '0.5';
        this.imageToggle.style.cursor = 'not-allowed';
        this.imageGenerationEnabled = false;

        // Add tooltip for coming soon
        this.imageToggle.title = 'Image Generation - Coming Soon!';

        console.log('🚧 Image generation disabled - Coming Soon');
    }

    populateModelDropdown() {
        if (!this.modelDropdown) {
            console.error('❌ Model dropdown element not found');
            return;
        }

        if (!this.selectedModelName) {
            console.error('❌ Selected model name element not found');
            return;
        }

        console.log('🔧 Populating model dropdown...');

        // Get all available models
        const freeModels = CHATBOT_CONFIG.FREE_MODELS;
        const premiumModels = CHATBOT_CONFIG.PREMIUM_MODELS;
        const imageModels = CHATBOT_CONFIG.IMAGE_MODELS;

        // Clear existing dropdown content
        this.modelDropdown.innerHTML = '';

        // Add text models section
        const textSection = document.createElement('div');
        textSection.className = 'dropdown-section';
        textSection.innerHTML = '<div class="section-title">Free Models</div>';

        // Add free models
        freeModels.forEach(model => {
            const option = this.createModelOption(model);
            if (model.id === this.selectedModel) {
                option.classList.add('selected');
                this.selectedModelName.textContent = model.name;
            }
            textSection.appendChild(option);
        });

        this.modelDropdown.appendChild(textSection);

        // Add premium models section - always show, but grey out for free users
        const premiumSection = document.createElement('div');
        premiumSection.className = 'dropdown-section';
        premiumSection.innerHTML = `<div class="section-title">Premium Models ${this.isPremium ? '' : '🔒'}</div>`;

        premiumModels.forEach(model => {
            const option = this.createModelOption(model, 'text', !this.isPremium);

            if (this.isPremium && model.id === this.selectedModel) {
                option.classList.add('selected');
                this.selectedModelName.textContent = model.name;
            }

            // Add click handler for free users to show upgrade message
            if (!this.isPremium) {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showPremiumUpgradeMessage();
                });
            }

            premiumSection.appendChild(option);
        });

        this.modelDropdown.appendChild(premiumSection);

        // Add image models section (disabled for now)
        const imageSection = document.createElement('div');
        imageSection.className = 'dropdown-section coming-soon-section';
        imageSection.innerHTML = '<div class="section-title">Image Models - Coming Soon 🚧</div>';

        imageModels.forEach(model => {
            const option = this.createModelOption(model, 'image', false);

            // Disable click event for image models
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showComingSoonMessage();
            });

            imageSection.appendChild(option);
        });

        this.modelDropdown.appendChild(imageSection);

        console.log('✅ Model dropdown populated with',
            freeModels.length + premiumModels.length + imageModels.length,
            'models. Premium access:', this.isPremium);
    }

    createModelOption(model, type = 'text', isDisabled = false) {
        const option = document.createElement('button');
        option.className = 'model-option';
        option.dataset.model = model.id;

        if (type === 'image') {
            option.dataset.type = 'image';
        }

        // Handle different states
        let badgeText, badgeClass;

        if (type === 'image') {
            badgeText = 'Coming Soon';
            badgeClass = 'coming-soon-badge';
            option.classList.add('disabled', 'coming-soon');
            option.style.opacity = '0.5';
            option.style.cursor = 'not-allowed';
            option.title = `${model.name} - Coming Soon!`;
        } else if (isDisabled) {
            badgeText = 'Premium';
            badgeClass = 'premium-locked-badge';
            option.classList.add('disabled', 'premium-locked');
            option.style.opacity = '0.6';
            option.style.cursor = 'not-allowed';
            option.title = `${model.name} - Premium Required`;
        } else {
            badgeText = model.badge;
            badgeClass = '';
        }

        option.innerHTML = `
            <div class="model-info">
                <div class="model-name">${model.name}</div>
                <div class="model-description">${model.description}</div>
            </div>
            <div class="model-badge ${badgeClass}">${badgeText}</div>
        `;

        return option;
    }

    toggleImageGeneration() {
        // Always show coming soon message
        this.showComingSoonMessage();
        return;
    }

    showComingSoonMessage() {
        const toast = document.createElement('div');
        toast.className = 'coming-soon-toast';
        toast.innerHTML = `
            <i data-lucide="construction" class="toast-icon"></i>
            <span>Image Generation - Coming Soon! 🚧</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 1000;
            transform: translateX(100%);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border: 2px solid rgba(255, 255, 255, 0.2);
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
                ease: "power2.in",
                onComplete: () => toast.remove()
            });
        }, 3000);
    }

    showPremiumUpgradeMessage() {
        const toast = document.createElement('div');
        toast.className = 'premium-upgrade-toast';
        toast.innerHTML = `
            <i data-lucide="crown" class="toast-icon"></i>
            <div class="toast-content">
                <span class="toast-title">Premium Required</span>
                <span class="toast-subtitle">Upgrade to access advanced AI models</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 1000;
            transform: translateX(100%);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border: 2px solid rgba(255, 255, 255, 0.2);
            min-width: 280px;
        `;

        const toastContent = toast.querySelector('.toast-content');
        toastContent.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 2px;
        `;

        const toastTitle = toast.querySelector('.toast-title');
        toastTitle.style.cssText = `
            font-weight: 600;
            font-size: 14px;
        `;

        const toastSubtitle = toast.querySelector('.toast-subtitle');
        toastSubtitle.style.cssText = `
            font-size: 12px;
            opacity: 0.9;
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
                ease: "power2.in",
                onComplete: () => toast.remove()
            });
        }, 4000);
    }

    showPremiumRequiredMessage() {
        const toast = document.createElement('div');
        toast.className = 'premium-toast';
        toast.innerHTML = `
            <i data-lucide="crown" class="toast-icon"></i>
            <span>Image generation requires Premium access</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 1000;
            transform: translateX(100%);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
                ease: "power2.in",
                onComplete: () => toast.remove()
            });
        }, 3000);
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    toggleModelDropdown() {
        if (!this.modelDropdown) {
            console.error('❌ Model dropdown not found');
            return;
        }

        const isOpen = this.modelDropdown.classList.contains('active');
        console.log('🔄 Toggling dropdown, currently open:', isOpen);

        if (isOpen) {
            this.closeModelDropdown();
        } else {
            this.openModelDropdown();
        }
    }

    openModelDropdown() {
        if (!this.modelDropdown) {
            console.error('❌ Cannot open dropdown - element not found');
            return;
        }

        console.log('📂 Opening model dropdown');
        this.modelDropdown.classList.add('active');

        // Use GSAP animation if available
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(this.modelDropdown,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            );
        }
    }

    closeModelDropdown() {
        if (!this.modelDropdown) {
            console.error('❌ Cannot close dropdown - element not found');
            return;
        }

        console.log('📁 Closing model dropdown');
        this.modelDropdown.classList.remove('active');
    }

    selectModel(modelId, modelType = 'text') {
        if (!modelId) {
            console.error('❌ No model ID provided');
            return;
        }

        console.log('🔄 Selecting model:', modelId, 'Type:', modelType);

        this.selectedModel = modelId;
        this.selectedModelType = modelType;

        // Update UI - remove all selected states first
        if (this.modelDropdown) {
            const allOptions = this.modelDropdown.querySelectorAll('.model-option');
            allOptions.forEach(option => option.classList.remove('selected'));

            // Find and select the new option
            const selectedOption = this.modelDropdown.querySelector(`[data-model="${modelId}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');

                // Update the displayed model name
                const modelNameEl = selectedOption.querySelector('.model-name');
                if (modelNameEl && this.selectedModelName) {
                    this.selectedModelName.textContent = modelNameEl.textContent;
                    console.log('✅ Updated model name to:', modelNameEl.textContent);
                }
            } else {
                console.warn('⚠️ Could not find option for model:', modelId);
            }
        }

        this.closeModelDropdown();

        console.log(`✅ Model selected: ${modelId} (${modelType})`);
    }

    async handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isGenerating) return;

        console.log('📤 Sending message:', message);
        console.log('🔧 Current model:', this.selectedModel);
        console.log('🔧 Is generating:', this.isGenerating);

        // Add user message
        this.addMessage('user', message);

        // Clear input
        this.messageInput.value = '';
        this.autoResizeTextarea();

        // Hide empty state
        this.hideEmptyState();

        // Determine if this is an image generation request
        const isImageRequest = this.imageGenerationEnabled && this.isPremium && this.isImageGenerationRequest(message);

        console.log('🎨 Is image request:', isImageRequest);
        console.log('🎨 Image generation enabled:', this.imageGenerationEnabled);
        console.log('👑 Is premium:', this.isPremium);

        try {
            if (isImageRequest) {
                console.log('🎨 Processing as image generation...');
                await this.handleImageGeneration(message);
            } else {
                console.log('💬 Processing as text generation...');
                await this.handleTextGeneration(message);
            }
        } catch (error) {
            console.error('❌ Critical error in handleSendMessage:', error);
            this.addMessage('assistant', 'Sorry, something went wrong. Please try again.', { error: true });
        }

        // Save conversation
        this.saveConversationHistory();
    }

    isImageGenerationRequest(message) {
        const imageKeywords = [
            'generate image', 'create image', 'draw', 'illustrate', 'visualize',
            'make a picture', 'show me', 'image of', 'picture of', 'diagram',
            'chart', 'graph', 'artwork', 'visual', 'sketch'
        ];

        const lowerMessage = message.toLowerCase();
        return imageKeywords.some(keyword => lowerMessage.includes(keyword));
    }

    async handleTextGeneration(message) {
        console.log('🤖 Starting handleTextGeneration...');
        this.isGenerating = true;
        this.updateSendButton(true);

        // Add typing indicator
        const typingId = this.addTypingIndicator();
        console.log('⏳ Added typing indicator:', typingId);

        try {
            console.log('🔄 Calling generateTextResponse...');
            const response = await this.generateTextResponse(message);
            console.log('✅ Got response:', response);

            this.removeTypingIndicator(typingId);
            this.addMessage('assistant', response.content, { model: response.model });
            console.log('💬 Added assistant message');
        } catch (error) {
            console.error('❌ Text generation failed:', error);
            console.error('❌ Error stack:', error.stack);

            this.removeTypingIndicator(typingId);
            this.addMessage('assistant', `Sorry, I encountered an error: ${error.message}. Please try again.`, { error: true });
        } finally {
            this.isGenerating = false;
            this.updateSendButton(false);
            console.log('🏁 Text generation complete');
        }
    }

    async handleImageGeneration(message) {
        this.isGenerating = true;
        this.updateSendButton(true);

        // Add typing indicator
        const typingId = this.addTypingIndicator('Generating image...');

        try {
            const images = await this.generateImages(message);
            this.removeTypingIndicator(typingId);

            if (images && images.length > 0) {
                this.addMessage('assistant', 'Here are the generated images:', { images: images });
            } else {
                this.addMessage('assistant', 'Sorry, I couldn\'t generate an image for that request. Please try rephrasing your prompt.', { error: true });
            }
        } catch (error) {
            console.error('❌ Image generation failed:', error);
            this.removeTypingIndicator(typingId);
            this.addMessage('assistant', 'Sorry, I encountered an error while generating the image. Please try again.', { error: true });
        } finally {
            this.isGenerating = false;
            this.updateSendButton(false);
        }
    }

    async generateTextResponse(message) {
        console.log('🤖 Starting text generation for message:', message);
        console.log('🔧 Using model:', this.selectedModel);
        console.log('🔧 API endpoint:', CHATBOT_CONFIG.API_ENDPOINT);
        console.log('🔧 API key:', CHATBOT_CONFIG.API_KEY);

        // Build conversation history for context
        const conversationMessages = [
            {
                role: 'system',
                content: 'You are a helpful AI assistant specializing in VCE (Victorian Certificate of Education) studies. Provide clear, accurate, and educational responses to help students with their learning. Remember context from previous messages in this conversation.'
            }
        ];

        // Add previous messages for context (limit to last 10 exchanges to avoid token limits)
        const recentMessages = this.messages.slice(-20); // Last 20 messages (10 exchanges)
        recentMessages.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                conversationMessages.push({
                    role: msg.role === 'assistant' ? 'assistant' : 'user',
                    content: msg.content
                });
            }
        });

        // Add current message
        conversationMessages.push({
            role: 'user',
            content: message
        });

        console.log('💬 Sending conversation with', conversationMessages.length, 'messages for context');

        // Use the exact same structure as the working main script
        try {
            console.log('📤 Making API request...');

            const response = await fetch(CHATBOT_CONFIG.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CHATBOT_CONFIG.API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.selectedModel,
                    messages: conversationMessages,
                    max_tokens: 2000,
                    temperature: 0.7
                })
            });

            console.log('📡 API Response received:', response);
            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error response:', errorText);

                if (response.status === 404) {
                    throw new Error('Model not available. Please try selecting a different AI model.');
                }

                throw new Error(`API Error: ${response.status} - ${response.statusText}\n${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Full API Response data:', data);

            // Validate response structure
            if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
                console.error('❌ Invalid response structure - missing choices array:', data);
                throw new Error('Invalid response structure from API - no choices found');
            }

            const choice = data.choices[0];
            if (!choice || !choice.message || !choice.message.content) {
                console.error('❌ Invalid choice structure:', choice);
                throw new Error('Invalid response structure from API - no message content');
            }

            console.log('✅ Extracted content:', choice.message.content);

            return {
                content: choice.message.content.trim(),
                model: this.selectedModel
            };

        } catch (error) {
            console.error('❌ Complete error in generateTextResponse:', error);
            console.error('❌ Error stack:', error.stack);

            // Re-throw with more context
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Network error: Unable to connect to the AI service. Please check your internet connection.');
            }

            throw error;
        }
    }

    async generateImages(prompt) {
        console.log('🎨 Generating images with prompt:', prompt);

        // Use a random image model from available ones
        const imageModels = CHATBOT_CONFIG.IMAGE_MODELS;
        const randomModel = imageModels[Math.floor(Math.random() * imageModels.length)];

        console.log('🔧 Using image model:', randomModel.id);
        console.log('🔧 Image API endpoint:', CHATBOT_CONFIG.IMAGE_API_ENDPOINT);
        console.log('🔧 Image API key:', CHATBOT_CONFIG.IMAGE_API_KEY);

        try {
            const requestBody = {
                model: randomModel.id,
                prompt: prompt,
                num_images: 2,
                size: "1024x1024"
            };

            console.log('📤 Image API request body:', requestBody);

            const response = await fetch(CHATBOT_CONFIG.IMAGE_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CHATBOT_CONFIG.IMAGE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📡 Image API Response Status:', response.status);
            console.log('📡 Image API Response OK:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Image API Error Response:', errorText);
                throw new Error(`Image API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('🖼️ Image API Response Data:', data);

            // Handle the correct response format from Infip API
            if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                return data.images.map((imageUrl, index) => ({
                    url: imageUrl,
                    model: randomModel.name,
                    seed: data.seed || `${Date.now()}-${index}`
                }));
            } else {
                console.warn('⚠️ No images in API response or invalid format');
                throw new Error('No images returned from API');
            }

        } catch (error) {
            console.error('❌ Image generation error:', error);

            // Re-throw the original error for better debugging
            throw new Error(`Image generation failed: ${error.message}`);
        }
    }

    addMessage(role, content, metadata = {}) {
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Store in conversation history
        this.messages.push({
            role: role,
            content: content,
            timestamp: new Date(),
            ...metadata
        });

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${role}`;
        messageEl.id = messageId;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';

        if (role === 'user') {
            avatar.innerHTML = '<i data-lucide="user" width="20" height="20"></i>';
        } else {
            avatar.innerHTML = '<i data-lucide="bot" width="20" height="20"></i>';
        }

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const messageText = document.createElement('div');
        messageText.className = 'message-text';

        if (metadata.images) {
            // Handle image messages
            messageText.innerHTML = marked.parse(content);

            const imagesContainer = document.createElement('div');
            imagesContainer.className = 'message-images';

            metadata.images.forEach(image => {
                const imageCard = document.createElement('div');
                imageCard.className = 'generated-image';
                imageCard.innerHTML = `
                    <img src="${image.url}" alt="Generated image" loading="lazy">
                `;
                imagesContainer.appendChild(imageCard);
            });

            messageContent.appendChild(messageText);
            messageContent.appendChild(imagesContainer);
        } else {
            // Handle text messages
            messageText.innerHTML = marked.parse(content);
            messageContent.appendChild(messageText);
        }

        // Add metadata
        if (metadata.model || metadata.error) {
            const messageMeta = document.createElement('div');
            messageMeta.className = 'message-meta';

            if (metadata.error) {
                messageMeta.innerHTML = `
                    <i data-lucide="alert-circle" width="12" height="12"></i>
                    <span>Error occurred</span>
                `;
            } else if (metadata.model) {
                messageMeta.innerHTML = `
                    <i data-lucide="cpu" width="12" height="12"></i>
                    <span>${this.getModelDisplayName(metadata.model)}</span>
                    <i data-lucide="clock" width="12" height="12"></i>
                    <span>${new Date().toLocaleTimeString()}</span>
                `;
            }

            messageContent.appendChild(messageMeta);
        }

        messageEl.appendChild(avatar);
        messageEl.appendChild(messageContent);

        this.chatMessages.appendChild(messageEl);

        // Create icons and scroll to bottom
        lucide.createIcons();
        this.scrollToBottom();

        console.log(`💬 Added ${role} message:`, content.substring(0, 50) + '...');

        return messageId;
    }

    addTypingIndicator(text = 'AI is thinking...') {
        const typingId = `typing-${Date.now()}`;

        const typingEl = document.createElement('div');
        typingEl.className = 'typing-indicator';
        typingEl.id = typingId;

        typingEl.innerHTML = `
            <div class="message-avatar">
                <i data-lucide="bot" width="20" height="20"></i>
            </div>
            <div class="message-content">
                <div class="message-text">
                    <span>${text}</span>
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;

        this.chatMessages.appendChild(typingEl);
        lucide.createIcons();
        this.scrollToBottom();

        return typingId;
    }

    removeTypingIndicator(typingId) {
        const typingEl = document.getElementById(typingId);
        if (typingEl) {
            typingEl.remove();
        }
    }

    updateSendButton(isGenerating) {
        if (!this.sendBtn) {
            console.error('❌ Send button not found, cannot update');
            return;
        }

        const icon = this.sendBtn.querySelector('i');
        if (!icon) {
            console.error('❌ Send button icon not found, cannot update');
            return;
        }

        try {
            if (isGenerating) {
                this.sendBtn.disabled = true;
                icon.setAttribute('data-lucide', 'loader-2');
                gsap.to(icon, {
                    rotation: 360,
                    duration: 1,
                    repeat: -1,
                    ease: "none"
                });
            } else {
                this.sendBtn.disabled = false;
                icon.setAttribute('data-lucide', 'send');
                gsap.killTweensOf(icon);
                gsap.set(icon, { rotation: 0 });
            }

            lucide.createIcons();
        } catch (error) {
            console.error('❌ Error updating send button:', error);
        }
    }

    hideEmptyState() {
        if (this.emptyState && !this.emptyState.classList.contains('hidden')) {
            gsap.to(this.emptyState, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    this.emptyState.style.display = 'none';
                }
            });
        }
    }

    showEmptyState() {
        if (this.emptyState) {
            this.emptyState.style.display = 'flex';
            gsap.fromTo(this.emptyState,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    clearChat() {
        if (this.messages.length === 0) return;

        if (confirm('Are you sure you want to clear the chat history?')) {
            this.messages = [];
            this.chatMessages.innerHTML = '';
            this.showEmptyState();
            this.saveConversationHistory();

            console.log('🗑️ Chat cleared');
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update icon
        const icon = this.themeToggleBtn.querySelector('i');
        icon.setAttribute('data-lucide', newTheme === 'dark' ? 'sun' : 'moon');
        lucide.createIcons();

        console.log('🎨 Theme changed to:', newTheme);
    }

    goBackToPlanner() {
        // Save conversation before going back
        this.saveConversationHistory();
        window.location.href = 'index.html';
    }

    saveConversationHistory() {
        try {
            localStorage.setItem('chatbot_conversation', JSON.stringify(this.messages));
            console.log('💾 Conversation saved');
        } catch (error) {
            console.warn('⚠️ Failed to save conversation:', error);
        }
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('chatbot_conversation');
            if (saved) {
                this.messages = JSON.parse(saved);

                // Restore messages to UI (but don't include them in API calls)
                if (this.messages.length > 0) {
                    this.hideEmptyState();

                    // Clear existing messages from display to avoid duplicates
                    this.chatMessages.innerHTML = '';

                    this.messages.forEach(msg => {
                        if (msg.role !== 'system') {
                            this.addMessageToUI(msg.role, msg.content, {
                                model: msg.model,
                                images: msg.images,
                                error: msg.error
                            });
                        }
                    });

                    console.log(`📚 Loaded ${this.messages.length} messages from history`);
                }
            }
        } catch (error) {
            console.warn('⚠️ Failed to load conversation:', error);
            this.messages = [];
        }
    }

    // Separate method for adding messages to UI without affecting conversation history
    addMessageToUI(role, content, metadata = {}) {
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${role}`;
        messageEl.id = messageId;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';

        if (role === 'user') {
            avatar.innerHTML = '<i data-lucide="user" width="20" height="20"></i>';
        } else {
            avatar.innerHTML = '<i data-lucide="bot" width="20" height="20"></i>';
        }

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const messageText = document.createElement('div');
        messageText.className = 'message-text';

        if (metadata.images) {
            // Handle image messages
            messageText.innerHTML = marked.parse(content);

            const imagesContainer = document.createElement('div');
            imagesContainer.className = 'message-images';

            metadata.images.forEach(image => {
                const imageCard = document.createElement('div');
                imageCard.className = 'generated-image';
                imageCard.innerHTML = `
                    <img src="${image.url}" alt="Generated image" loading="lazy">
                `;
                imagesContainer.appendChild(imageCard);
            });

            messageContent.appendChild(messageText);
            messageContent.appendChild(imagesContainer);
        } else {
            // Handle text messages
            messageText.innerHTML = marked.parse(content);
            messageContent.appendChild(messageText);
        }

        // Add metadata
        if (metadata.model || metadata.error) {
            const messageMeta = document.createElement('div');
            messageMeta.className = 'message-meta';

            if (metadata.error) {
                messageMeta.innerHTML = `
                    <i data-lucide="alert-circle" width="12" height="12"></i>
                    <span>Error occurred</span>
                `;
            } else if (metadata.model) {
                messageMeta.innerHTML = `
                    <i data-lucide="cpu" width="12" height="12"></i>
                    <span>${this.getModelDisplayName(metadata.model)}</span>
                    <i data-lucide="clock" width="12" height="12"></i>
                    <span>${new Date().toLocaleTimeString()}</span>
                `;
            }

            messageContent.appendChild(messageMeta);
        }

        messageEl.appendChild(avatar);
        messageEl.appendChild(messageContent);

        this.chatMessages.appendChild(messageEl);

        // Create icons and scroll to bottom
        lucide.createIcons();
        this.scrollToBottom();

        return messageId;
    }
}

// ===== INITIALIZE CHATBOT =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM Content Loaded - Starting chatbot initialization...');

    // Check for required libraries
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP not loaded!');
        return;
    }

    if (typeof marked === 'undefined') {
        console.error('❌ Marked.js not loaded!');
        return;
    }

    console.log('✅ All libraries loaded successfully');

    // Test API configuration
    console.log('🧪 Testing API configuration...');
    console.log('🔧 API Endpoint:', CHATBOT_CONFIG.API_ENDPOINT);
    console.log('🔧 API Key length:', CHATBOT_CONFIG.API_KEY ? CHATBOT_CONFIG.API_KEY.length : 'MISSING');
    console.log('🔧 Free models:', CHATBOT_CONFIG.FREE_MODELS.length);
    console.log('🔧 Premium models:', CHATBOT_CONFIG.PREMIUM_MODELS.length);

    // Initialize the chatbot
    try {
        window.vceChatbot = new VCEChatbot();
        console.log('🚀 VCE Chatbot initialized successfully');

        // Add global test function
        window.testChatbotAPI = async () => {
            console.log('🧪 Testing chatbot API...');
            try {
                const testMessage = 'Hello, can you help me?';
                const response = await window.vceChatbot.generateTextResponse(testMessage);
                console.log('✅ API test successful:', response);
                return response;
            } catch (error) {
                console.error('❌ API test failed:', error);
                return { error: error.message };
            }
        };

        console.log('🧪 Test function available: window.testChatbotAPI()');

    } catch (error) {
        console.error('❌ Failed to initialize VCE Chatbot:', error);

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
        errorDiv.textContent = 'Failed to initialize the chatbot. Please refresh the page.';
        document.body.appendChild(errorDiv);
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Update theme toggle icon
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
        themeIcon.setAttribute('data-lucide', savedTheme === 'dark' ? 'sun' : 'moon');
    }

    // Initialize icons
    lucide.createIcons();
});

// ===== UTILITY FUNCTIONS =====
// Smooth scrolling for links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus on input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            messageInput.focus();
        }
    }

    // Escape to close dropdown
    if (e.key === 'Escape') {
        const chatbot = window.vceChatbot;
        if (chatbot) {
            chatbot.closeModelDropdown();
        }
    }
});

// ===== TESTING AND DEBUGGING FUNCTIONS =====
window.testChatbotAPI = async function () {
    console.log('🧪 Testing Chatbot API Connection...');

    try {
        const testMessage = "Hello, can you help me with VCE studies?";
        console.log('📝 Test message:', testMessage);

        if (!window.vceChatbot) {
            console.error('❌ Chatbot not initialized');
            return;
        }

        console.log('🔄 Calling generateTextResponse directly...');
        const response = await window.vceChatbot.generateTextResponse(testMessage);
        console.log('✅ Test successful! Response:', response);

        return response;
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error('❌ Full error:', error.message);
        return null;
    }
};

window.testAPIDirectly = async function () {
    console.log('🧪 Testing API directly...');

    try {
        const response = await fetch(CHATBOT_CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CHATBOT_CONFIG.API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "provider-3/llama-3.1-405b",
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI assistant.'
                    },
                    {
                        role: 'user',
                        content: 'Say hello in a short sentence.'
                    }
                ],
                max_tokens: 100,
                temperature: 0.7
            })
        });

        console.log('📡 Direct API Response:', response);
        console.log('📡 Status:', response.status);
        console.log('📡 Status Text:', response.statusText);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Direct API Success:', data);
            return data;
        } else {
            const errorText = await response.text();
            console.error('❌ Direct API Error:', errorText);
            return null;
        }
    } catch (error) {
        console.error('❌ Direct API Test failed:', error);
        return null;
    }
};

window.testDropdown = function () {
    console.log('🧪 Testing model dropdown functionality...');

    if (!window.vceChatbot) {
        console.error('❌ Chatbot not initialized');
        return;
    }

    const chatbot = window.vceChatbot;

    console.log('🔍 Checking dropdown elements...');
    console.log('Model selector:', !!chatbot.modelSelector);
    console.log('Model dropdown:', !!chatbot.modelDropdown);
    console.log('Selected model name:', !!chatbot.selectedModelName);

    if (chatbot.modelSelector) {
        console.log('📂 Testing dropdown toggle...');
        chatbot.toggleModelDropdown();

        setTimeout(() => {
            console.log('📁 Closing dropdown...');
            chatbot.closeModelDropdown();
        }, 2000);
    }

    // Test model selection
    setTimeout(() => {
        console.log('🔄 Testing model selection...');
        chatbot.selectModel('provider-6/kimi-k2', 'text');
    }, 3000);

    console.log('✅ Dropdown test complete - check console for results');
};

console.log('🤖 VCE Chatbot script loaded');
