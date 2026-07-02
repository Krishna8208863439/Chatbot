// ==========================================
// SMART KISAN AGRI-SUITE - APPLICATION ENGINE
// ==========================================

// Global Application State
const state = {
    currentTab: 'dashboard',
    language: 'en', // 'en' or 'hi'
    speechOutputEnabled: true,
    activeCropPlan: null,
    mandiData: {
        Wheat: [2100, 2180, 2250, 2220, 2300, 2350],
        Paddy: [1950, 2020, 2100, 2080, 2120, 2150],
        Cotton: [5800, 5950, 6100, 6050, 6150, 6200],
        Mustard: [4900, 5050, 5200, 5100, 5250, 5300]
    },
    cropPrices: {
        Wheat: 2350,
        Rice: 2150,
        Cotton: 6200,
        Tomato: 1500
    },
    // Crop Ideal Soil Profiles
    cropProfiles: [
        { name: "Wheat", icon: "🌾", type: "Rabi", N: 80, P: 45, K: 120, pH: 6.8, rainfall: 700, desc: "Thrives in loamy, well-drained soils. High nitrogen demand during germination. Moderate cold tolerant." },
        { name: "Rice (Paddy)", icon: "🍚", type: "Kharif", N: 110, P: 55, K: 150, pH: 6.2, rainfall: 1500, desc: "Requires high moisture retention soils (clayey/loamy). Demands high potassium and heavy rain or flood irrigation." },
        { name: "Cotton", icon: "🌿", type: "Cash Crop", N: 90, P: 40, K: 180, pH: 7.2, rainfall: 900, desc: "Thrives in black soil. Deep-root crop requiring solid potassium parameters. Sensitive to water stagnation." },
        { name: "Tomato", icon: "🍅", type: "Horticulture", N: 60, P: 35, K: 110, pH: 6.0, rainfall: 600, desc: "Requires sandy-loamy soil with moderate acidities. Demands calcium inputs to avoid blossom end rots." },
        { name: "Sugarcane", icon: "🎋", type: "Perennial", N: 120, P: 70, K: 200, pH: 7.0, rainfall: 1300, desc: "Heavy feeder crop demanding thick nitrogen deposits and loose organic carbon soils." }
    ],
    // Leaf Disease Database
    diseases: {
        Tomato_Early_Blight: {
            name: "Tomato Early Blight",
            crop: "Tomato (Solanum lycopersicum)",
            confidence: "96%",
            symptoms: "Concentric black spots ('target-board' appearance) on older lower leaves. Yellow chlorotic halo around spots.",
            bio: "Apply liquid copper fungicide or Bacillus subtilis solution during early morning. Prune bottom leaves to avoid splash-back.",
            chem: "Spray Chlorothalonil or Mancozeb fungicide (2g per liter water). Re-apply after 10-14 days.",
            prevention: "Practice 3-year nightshade crop rotation. Avoid overhead watering to keep foliage dry."
        },
        Wheat_Rust: {
            name: "Wheat Leaf Rust (Puccinia triticina)",
            crop: "Wheat (Triticum aestivum)",
            confidence: "93%",
            symptoms: "Small, oval, orange-brown pustules scattering randomly on leaf surfaces and sheaths. Rust rubs off on fingers.",
            bio: "Plant rust-resistant cultivars (like HD 2967, WH 1105). Apply biological bio-control Trichoderma viride.",
            chem: "Apply Propiconazole 25% EC (Tebuconazole) at 1ml per liter water immediately upon pustule observation.",
            prevention: "Avoid excessive nitrogen application. Maintain weed-free boundaries to disrupt fungus cycles."
        },
        Cotton_Curl: {
            name: "Cotton Leaf Curl Virus (CLCuV)",
            crop: "Cotton (Gossypium hirsutum)",
            confidence: "91%",
            symptoms: "Upward or downward curling of leaf margins, thickening of leaf veins, and cup-like enations on undersides.",
            bio: "Uproot and destroy infected plants early. Release predatory lacewings to control vector whiteflies naturally.",
            chem: "Spray systemic insecticides like Imidacloprid (0.5 ml/L) or Acetamiprid to control Whitefly vectors.",
            prevention: "Plant resistant cotton cotton hybrids. Eradicate alternative host weeds like Parthenium near fields."
        }
    }
};

// Conversational Responses (English & Hindi)
const chatbotKnowledge = {
    en: [
        {
            keywords: /(hello|hi|namaste|hey)/i,
            response: "Namaste! I am your Kisan AI assistant. How can I help you today? You can ask about soil chemistries, crop planning, or pest control."
        },
        {
            keywords: /(tomato|blight|yellow spot)/i,
            response: "For yellow leaves with black circular rings on Tomato plants, it points to **Early Blight**. Action needed:\n1. Prune affected bottom leaves.\n2. Spray organic **Copper Fungicide** or chemical **Mancozeb** (2g/L).\n3. Use drip watering instead of overhead sprinklers."
        },
        {
            keywords: /(fertilizer|urea|npk|manure)/i,
            response: "Crop fertilizer recommendations:\n* **Wheat/Rice**: Apply N:P:K in 120:60:40 kg/hectare ratio. Split Nitrogen into 3 doses.\n* **Organic alternative**: Apply 10 tons of Farm Yard Manure (FYM) per acre during field preparation to improve organic carbon content."
        },
        {
            keywords: /(wheat|wheat price|sow wheat)/i,
            response: "Wheat (Kanak) is a Rabi crop sown between Nov 1 - Nov 25. Ideal soil pH is 6.5-7.5. Current average market rate is **₹2,350 per Quintal** (Rohtak Mandi)."
        },
        {
            keywords: /(pest|insect|worm|spray)/i,
            response: "For general insect attacks:\n* Apply **Neem Oil spray** (5ml/L + soap liquid) as an eco-friendly pest repellent.\n* For severe attacks like Pink Bollworm or stem borer, spray chemical **Chlorantraniliprole (Coragen)** at 0.4 ml/L."
        },
        {
            keywords: /(soil|clay|sand|ph|clayey soil)/i,
            response: "Soil chemistry tips:\n1. For heavy clayey soil, crops like **Rice (Paddy)** or **Sugarcane** are optimal due to high water retention properties.\n2. Adjust pH: For acidic soils (pH < 6), apply **Lime**. For alkaline soils (pH > 8), apply **Gypsum**.\n3. Try our new **Soil Recommender** tab to input your NPK soil test card details directly."
        },
        {
            keywords: /(crop recommendation|what to grow|recommend)/i,
            response: "To recommend crops tailored to your land:\n1. Check your soil's N-P-K (Nitrogen, Phosphorus, Potassium) parameters.\n2. Go to our **Soil Recommender** tab, adjust the chemistry sliders, and run the matching engine to check crop suitability scores."
        },
        {
            keywords: /(weather|rain)/i,
            response: "Weather conditions indicate partly cloudy skies today. **Immediate Advisory**: Postpone heavy field irrigations if you are in the Rohtak area as slight localized rain showers are possible."
        }
    ],
    hi: [
        {
            keywords: /(नमस्ते|हैलो|राम|प्रणाम)/i,
            response: "नमस्ते! मैं आपका किसान एआई सहायक हूँ। आज मैं आपकी क्या मदद कर सकता हूँ? आप मिट्टी की जांच, फसल योजना या कीट नियंत्रण के बारे में पूछ सकते हैं।"
        },
        {
            keywords: /(टमाटर|पीला|पत्ता|धब्बा)/i,
            response: "टमाटर के पत्तों पर काले गोल छल्ले और पीलापन **अगेती झुलसा (Early Blight)** के लक्षण हैं। उपाय:\n1. प्रभावित निचले पत्तों को काटकर हटा दें।\n2. कॉपर फंगिसाइड या **मैनकोजेब** (2 ग्राम/लीटर) का छिड़काव करें।\n3. पत्तों के ऊपर पानी छिड़कने से बचें।"
        },
        {
            keywords: /(खाद|उर्वरक|यूरिया|एनपीके)/i,
            response: "खाद की सलाह:\n* **गेहूँ/धान**: 120:60:40 किग्रा/हेक्टेयर के अनुपात में N:P:K डालें।\n* **जैविक विकल्प**: खेत की जुताई के समय प्रति एकड़ 10 टन गोबर की खाद डालें, जिससे मिट्टी की उपजाऊ शक्ति बढ़ती है।"
        },
        {
            keywords: /(गेहूं|कनक|दाम)/i,
            response: "गेहूँ रबी की मुख्य फसल है जिसकी बुवाई 1 से 25 नवंबर के बीच होती है। रोहतक मंडी में गेहूँ का औसत भाव अभी **₹2,350 प्रति क्विंटल** है।"
        },
        {
            keywords: /(कीड़ा|इल्ली|दवा)/i,
            response: "कीट नियंत्रण के लिए:\n* जैविक उपाय: **नीम का तेल** (5 मिली/लीटर) पानी में मिलाकर छिड़कें।\n* रासायनिक उपाय: गंभीर सुंडी कीट के लिए **कोराजन (Coragen)** 0.4 मिली/लीटर का छिड़काव करें।"
        },
        {
            keywords: /(मिट्टी|जांच|पीएच)/i,
            response: "मिट्टी स्वास्थ्य सलाह:\n1. मिट्टी का पीएच ठीक रखने के लिए क्षारीय मिट्टी में **जिप्सम** का प्रयोग करें।\n2. अपने मिट्टी परीक्षण कार्ड के आधार पर सही फसल जानने के लिए हमारे **Soil Recommender** टैब का उपयोग करें।"
        }
    ]
};

// Default fallbacks
const fallbacks = {
    en: "I'm sorry, I couldn't find a direct match for your agriculture query. Try searching keywords like 'Tomato Blight', 'NPK soil values', 'Soil PH', or 'Crop recommendation'. Alternatively, click 'Open Expert Ticket' to ask a district officer.",
    hi: "क्षमा करें, मुझे इस प्रश्न का सटीक उत्तर नहीं मिला। कृपया 'टमाटर झुलसा रोग', 'मिट्टी पीएच सुधार' या 'फसल बुवाई' जैसे सरल शब्दों का प्रयोग करें।"
};

// ================= TAB NAVIGATION =================
function switchTab(tabId) {
    state.currentTab = tabId;
    
    // Update active nav link
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update active content block
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Mobile specific: close sidebar on tab switch
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }

    // Perform specific tab actions
    if (tabId === 'financials') {
        drawMandiChart();
    }
}

// ================= LIVE CLOCK & DATE =================
function updateLiveDateTime() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-US', options);
    const dateEl = document.getElementById('liveDate');
    if (dateEl) dateEl.innerText = dateStr;
}

// ================= KISAN AI CHATBOT =================
function speakText(text) {
    if (!state.speechOutputEnabled || !('speechSynthesis' in window)) return;
    
    // Cancel ongoing speech
    window.speechSynthesis.cancel();
    
    // Strip markdown formatting before speaking
    const cleanText = text.replace(/[*#`_\-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (state.language === 'hi') {
        utterance.lang = 'hi-IN';
    } else {
        utterance.lang = 'en-IN';
    }
    
    window.speechSynthesis.speak(utterance);
}

function appendChatMessage(sender, text) {
    const box = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender === 'user' ? 'user' : ''}`;
    
    const avatar = sender === 'user' ? 'ME' : 'AI';
    
    // Render markdown formatting
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\* (.*?)\n/g, '<li>$1</li>')
        .replace(/\n/g, '<br>');
        
    if (formattedText.includes('<li>')) {
        formattedText = formattedText.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
    }

    msgDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-bubble">
            ${formattedText}
            <span class="message-time">${time}</span>
        </div>
    `;
    
    box.appendChild(msgDiv);
    box.scrollTop = box.scrollHeight;
}

function processUserQuery(query) {
    appendChatMessage('user', query);
    
    // Simulate AI loading dots
    const box = document.getElementById('chatMessages');
    const loadDiv = document.createElement('div');
    loadDiv.className = 'message';
    loadDiv.id = 'aiTempLoading';
    loadDiv.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-bubble" style="padding: 0.5rem 1rem;">
            <span style="opacity:0.6; font-style:italic;">Kisan AI is typing...</span>
        </div>
    `;
    box.appendChild(loadDiv);
    box.scrollTop = box.scrollHeight;

    setTimeout(() => {
        // Remove loading dots
        const loader = document.getElementById('aiTempLoading');
        if (loader) loader.remove();

        const lang = state.language;
        const library = chatbotKnowledge[lang];
        let answer = fallbacks[lang];

        // Search matching patterns
        for (const item of library) {
            if (item.keywords.test(query)) {
                answer = item.response;
                break;
            }
        }

        appendChatMessage('ai', answer);
        speakText(answer);
    }, 1200);
}

function sendQuickMessage(text) {
    processUserQuery(text);
}

function initChatControls() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const speakToggle = document.getElementById('speakResponseToggle');
    const langEng = document.getElementById('langEng');
    const langHindi = document.getElementById('langHindi');
    
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight - 10) + 'px';
    });

    sendBtn.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (text) {
            processUserQuery(text);
            chatInput.value = '';
            chatInput.style.height = '24px';
        }
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    voiceBtn.addEventListener('click', () => {
        const active = voiceBtn.classList.toggle('voice-active');
        const wave = document.getElementById('voiceWaveIndicator');
        
        if (active) {
            wave.classList.add('active');
            chatInput.placeholder = "Listening to voice input...";
            chatInput.disabled = true;
            
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            
            setTimeout(() => {
                voiceBtn.classList.remove('voice-active');
                wave.classList.remove('active');
                chatInput.disabled = false;
                chatInput.placeholder = "Type your query here or click mic to speak...";
                
                const mockPhrases = state.language === 'hi' 
                    ? ["टमाटर के पत्ते पीले क्यों हो रहे हैं?", "गेहूं का क्या भाव है?", "मिट्टी का पीएच कैसे ठीक करें?"]
                    : ["Why are tomato leaves turning yellow?", "What crops are good for clayey soil?", "Soil PH adjustments"];
                const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
                
                chatInput.value = randomPhrase;
                processUserQuery(randomPhrase);
                chatInput.value = '';
            }, 2500);
        } else {
            wave.classList.remove('active');
            chatInput.disabled = false;
            chatInput.placeholder = "Type your query here or click mic to speak...";
        }
    });

    speakToggle.addEventListener('click', () => {
        state.speechOutputEnabled = !state.speechOutputEnabled;
        if (state.speechOutputEnabled) {
            speakToggle.style.color = "var(--primary-light)";
            speakToggle.title = "Disable Voice Output";
        } else {
            speakToggle.style.color = "var(--text-muted)";
            speakToggle.title = "Enable Voice Output";
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        }
    });

    langEng.addEventListener('click', () => {
        state.language = 'en';
        langEng.classList.add('active');
        langHindi.classList.remove('active');
        document.getElementById('quickRepliesBox').innerHTML = `
            <button class="quick-reply-pill" onclick="sendQuickMessage('Best fertilizer for growing potatoes?')">Potato Fertilizer</button>
            <button class="quick-reply-pill" onclick="sendQuickMessage('What crops are good for clayey soil with pH 7.5?')">Clayey Soil Crops</button>
            <button class="quick-reply-pill" onclick="sendQuickMessage('Tomato leaves are turning yellow. Remedial measures?')">Tomato Yellow spots</button>
            <button class="quick-reply-pill" onclick="sendQuickMessage('What is the ideal soil pH for sugarcane?')">Sugarcane pH</button>
        `;
        appendChatMessage('system', "Language switched to English. Assistant voice output configured.");
    });

    langHindi.addEventListener('click', () => {
        state.language = 'hi';
        langHindi.classList.add('active');
        langEng.classList.remove('active');
        document.getElementById('quickRepliesBox').innerHTML = `
            <button class="quick-reply-pill" onclick="sendQuickMessage('टमाटर के पत्ते पीले होने का इलाज?')">टमाटर पीला पत्ता</button>
            <button class="quick-reply-pill" onclick="sendQuickMessage('गेहूं की बुवाई के लिए खाद?')">गेहूं खाद मात्रा</button>
            <button class="quick-reply-pill" onclick="sendQuickMessage('मिट्टी का पीएच कैसे ठीक करें?')">मिट्टी पीएच सुधार</button>
        `;
        appendChatMessage('system', "भाषा बदलकर हिंदी की गई। किसान सहायक आपकी सेवा में तत्पर है।");
    });
}

// ================= CROP DISEASE ANALYZER =================
function runSampleScan(diseaseId, displayName) {
    const overlay = document.getElementById('scannerOverlay');
    const preview = document.getElementById('scanPreview');
    const placeholder = document.getElementById('reportPlaceholder');
    const report = document.getElementById('diagnosticReport');
    const statusText = document.getElementById('scanStatusText');
    
    preview.style.backgroundImage = 'none';
    overlay.classList.add('active');
    statusText.innerText = `AI Vision: Scanning ${displayName}...`;
    
    setTimeout(() => {
        overlay.classList.remove('active');
        placeholder.style.display = 'none';
        report.classList.add('active');
        
        const data = state.diseases[diseaseId];
        document.getElementById('repDiseaseName').innerText = data.name;
        document.getElementById('repCropType').innerText = `Host Crop: ${data.crop}`;
        document.getElementById('repConfidence').innerText = `${data.confidence} Match`;
        document.getElementById('repSymptoms').innerText = data.symptoms;
        document.getElementById('repBioTreatment').innerText = data.bio;
        document.getElementById('repChemTreatment').innerText = data.chem;
        
        const prevList = document.getElementById('repPrevention');
        prevList.innerHTML = '';
        data.prevention.split('.').forEach(step => {
            if (step.trim()) {
                const li = document.createElement('li');
                li.innerText = step.trim() + '.';
                prevList.appendChild(li);
            }
        });

        speakText(`Diagnostic scan complete. Identified ${data.name} with ${data.confidence} confidence.`);
    }, 3000);
}

function sendReportToChat() {
    const name = document.getElementById('repDiseaseName').innerText;
    const match = document.getElementById('repConfidence').innerText;
    const treatment = document.getElementById('repBioTreatment').innerText;
    
    switchTab('chatbot');
    processUserQuery(`Leaf Scanner Report details for: **${name}** (${match}). Bio-Control Action Plan: ${treatment}`);
}

function initDiagnosticUploader() {
    const fileInput = document.getElementById('leafFileInput');
    const dragCard = document.getElementById('dragDropCard');
    
    dragCard.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragCard.style.borderColor = "var(--primary)";
    });
    
    dragCard.addEventListener('dragleave', () => {
        dragCard.style.borderColor = "var(--border-accent)";
    });
    
    dragCard.addEventListener('drop', (e) => {
        e.preventDefault();
        dragCard.style.borderColor = "var(--border-accent)";
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUploadedFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleUploadedFile(e.target.files[0]);
        }
    });
}

function handleUploadedFile(file) {
    const overlay = document.getElementById('scannerOverlay');
    const preview = document.getElementById('scanPreview');
    const statusText = document.getElementById('scanStatusText');
    
    const reader = new FileReader();
    reader.onload = function(event) {
        preview.style.backgroundImage = `url('${event.target.result}')`;
        overlay.classList.add('active');
        statusText.innerText = "Analyzing Leaf Tissue Chlorosis...";
        
        setTimeout(() => {
            const keys = Object.keys(state.diseases);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            runSampleScan(randomKey, file.name);
        }, 3000);
    };
    reader.readAsDataURL(file);
}

// ================= AGRI PLANNER SCHEDULER =================
function getFutureDate(baseDate, daysToAdd) {
    const result = new Date(baseDate);
    result.setDate(result.getDate() + daysToAdd);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return result.toLocaleDateString('en-US', options);
}

function generateCropTimeline(cropName, sowingDateStr) {
    const baseDate = new Date(sowingDateStr);
    
    let timelineConfig = {
        Wheat: {
            duration: 120,
            stages: [
                { name: "Germination & Crown Root Initiation", start: 0, end: 20, tasks: ["Initial light irrigation", "Check soil moisture level", "Apply first dose of Urea (nitrogen)"] },
                { name: "Tillering & Jointing Stage", start: 21, end: 50, tasks: ["Second irrigation cycle", "Weed clearing around soil borders", "Check for leaf aphids or yellow rust symptoms"] },
                { name: "Flowering & Heading Stage", start: 51, end: 90, tasks: ["Third critical irrigation", "Apply NPK fertilizer blend", "Apply bio-pesticide check if pest presence noted"] },
                { name: "Maturation & Grain Filling", start: 91, end: 120, tasks: ["Postpone heavy waterings to prevent lodging", "Monitor crop color transition to gold", "Plan harvesting equipment scheduling"] }
            ]
        },
        Rice: {
            duration: 135,
            stages: [
                { name: "Seedbed & Transplanting Phase", start: 0, end: 25, tasks: ["Maintain continuous 2-5cm standing water", "Apply basal fertilizer blend", "Hand-weed weeds or apply pre-emergent herbicide"] },
                { name: "Active Tillering Phase", start: 26, end: 60, tasks: ["Maintain shallow water margins", "Top dress with nitrogen/urea", "Inspect stem borer moths activity"] },
                { name: "Panicle Initiation & Heading", start: 61, end: 105, tasks: ["Ensure steady water supply, avoid field drying", "Apply mid-season spray checks", "Check for leaf folder or blast disease symptoms"] },
                { name: "Ripening & Harvesting Phase", start: 106, end: 135, tasks: ["Drain water completely 10 days before harvest", "Wait for grain moisture to drop below 20%", "Conduct harvesting and threshing"] }
            ]
        },
        Cotton: {
            duration: 150,
            stages: [
                { name: "Sowing & Early Seedling Phase", start: 0, end: 30, tasks: ["Light watering at borders", "Clear weeds between rows", "Monitor for early thrips or whiteflies vectors"] },
                { name: "Squaring & Vegetative Stage", start: 31, end: 70, tasks: ["Apply secondary fertilizer dose", "Deep inter-culture soil weeding", "Inspect for pink bollworm activity"] },
                { name: "Boll Development & Flowering", start: 71, end: 115, tasks: ["Irrigate at critical boll formation days", "Monitor boll cracking patterns", "Spray micro-nutrients check"] },
                { name: "Boll Maturation & Picking", start: 116, end: 150, tasks: ["Stop waterings 2-3 weeks before picking", "Conduct first manual cotton lint picking", "Prepare field stalks clearing"] }
            ]
        },
        Tomato: {
            duration: 90,
            stages: [
                { name: "Transplanting & Staking", start: 0, end: 20, tasks: ["Irrigate immediately after transplanting", "Set up support stakes/cages", "Apply soluble phosphate fertilizer"] },
                { name: "Early Vegetative Growth", start: 21, end: 45, tasks: ["Drip irrigation every alternate day", "Weeding & organic mulching application", "Inspect for early blight on lower canopy"] },
                { name: "Flowering & Fruit Set", start: 46, end: 70, tasks: ["Increase drip timing parameters", "Apply calcium nitrate to prevent blossom end rot", "Introduce pollinators or vibrate stakes"] },
                { name: "Harvesting & Picking", start: 71, end: 90, tasks: ["Pick ripe red tomatoes early mornings", "Inspect crop sorting metrics", "Pack and load in aeration crates"] }
            ]
        },
        Sugarcane: {
            duration: 360,
            stages: [
                { name: "Sett Germination & Tillering", start: 0, end: 60, tasks: ["Apply light irrigation along furrows", "In-row weeding operation", "Apply base dose nitrogen/potash"] },
                { name: "Grand Growth Stage (Elongation)", start: 61, end: 250, tasks: ["Maintain irrigation every 10 days", "Earthing-up operation to support stalks", "Inspect for early shoot borer"] },
                { name: "Sucrose Accumulation (Maturity)", start: 251, end: 320, tasks: ["Reduce water frequency to spike sugar accumulation", "Remove lower dry leaves (de-trashing)", "Monitor brix percentage using hand refractometer"] },
                { name: "Harvesting Phase", start: 321, end: 360, tasks: ["Cut crop at ground level", "Supply fresh harvested cane to sugar mills within 24 hours", "Prepare roots for ratoon crop cycle"] }
            ]
        }
    };

    const config = timelineConfig[cropName] || timelineConfig['Wheat'];
    
    state.activeCropPlan = {
        crop: cropName,
        sowingDate: sowingDateStr,
        config: config
    };

    document.getElementById('dashCropCycle').innerText = `${cropName} (Active)`;
    
    const alertsBox = document.getElementById('dashboardAlertsList');
    alertsBox.innerHTML = `
        <div class="alert-item">
            <div class="alert-icon">📅</div>
            <div class="alert-body">
                <h4>New Cultivation Workflow Active</h4>
                <p>Calculated seasonal timeline for <strong>${cropName}</strong> based on sowing date ${getFutureDate(baseDate, 0)}. Tasks generated successfully.</p>
                <div class="alert-time">Just now</div>
            </div>
        </div>
        ${alertsBox.innerHTML}
    `;
    
    const container = document.getElementById('plannerStagesList');
    container.innerHTML = '';
    
    config.stages.forEach((stage, idx) => {
        const stageDiv = document.createElement('div');
        stageDiv.className = `stage-card ${idx === 0 ? 'active' : ''}`;
        
        const startStr = getFutureDate(baseDate, stage.start);
        const endStr = getFutureDate(baseDate, stage.end);
        
        let tasksHtml = '';
        stage.tasks.forEach((task, tIdx) => {
            tasksHtml += `
                <label class="stage-task-item" onclick="toggleTaskCompletion(this)">
                    <input type="checkbox" id="task_${idx}_${tIdx}">
                    <span>${task}</span>
                </label>
            `;
        });

        stageDiv.innerHTML = `
            <div class="stage-card-header" onclick="toggleStageAccordion(this)">
                <div class="stage-title">
                    <span>${idx + 1}.</span> ${stage.name}
                </div>
                <div class="stage-date">${startStr} - ${endStr}</div>
            </div>
            <div class="stage-tasks-list" style="display: ${idx === 0 ? 'flex' : 'none'};">
                ${tasksHtml}
            </div>
        `;
        
        container.appendChild(stageDiv);
    });

    document.getElementById('plannerActiveCropTitle').innerText = `${cropName} Cultivation Scheduler`;
    document.getElementById('plannerDurationLabel').innerText = `Total Duration: ${config.duration} Days (Soil: ${document.getElementById('planSoilSelect').value})`;
    updateProgressPercent();
}

function toggleStageAccordion(headerEl) {
    const list = headerEl.nextElementSibling;
    const card = headerEl.parentElement;
    
    if (list.style.display === 'none') {
        list.style.display = 'flex';
        card.classList.add('active');
    } else {
        list.style.display = 'none';
        card.classList.remove('active');
    }
}

function toggleTaskCompletion(taskLabelEl) {
    const chk = taskLabelEl.querySelector('input');
    setTimeout(() => {
        if (chk.checked) {
            taskLabelEl.classList.add('completed');
        } else {
            taskLabelEl.classList.remove('completed');
        }
        updateProgressPercent();
    }, 50);
}

function updateProgressPercent() {
    const checkboxes = document.querySelectorAll('.stage-task-item input');
    if (checkboxes.length === 0) return;
    
    let checkedCount = 0;
    checkboxes.forEach(chk => {
        if (chk.checked) checkedCount++;
    });
    
    const percentage = Math.round((checkedCount / checkboxes.length) * 100);
    
    document.getElementById('plannerProgressPercentLabel').innerText = `${percentage}% Done`;
    document.getElementById('plannerProgressFill').style.width = `${percentage}%`;
}

function initPlanner() {
    const generateBtn = document.getElementById('generatePlannerBtn');
    
    generateBtn.addEventListener('click', () => {
        const crop = document.getElementById('planCropSelect').value;
        const sowingDate = document.getElementById('planSowingDate').value;
        
        document.getElementById('plannerPlaceholder').style.display = 'none';
        const timeline = document.getElementById('plannerTimelineContainer');
        timeline.classList.add('active');
        
        generateCropTimeline(crop, sowingDate);
    });
}

// ================= MANDI RATES & TRENDS SVG =================
function drawMandiChart() {
    const svg = document.getElementById('mandiChartSvg');
    if (!svg) return;
    
    const crop = document.getElementById('mandiCropSelect').value;
    const prices = state.mandiData[crop] || state.mandiData['Wheat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    svg.innerHTML = '';
    
    const width = 400;
    const height = 180;
    const padding = 35;
    
    const maxPrice = Math.max(...prices) + 200;
    const minPrice = Math.min(...prices) - 200;
    
    const getX = (index) => padding + (index * (width - padding * 2) / (prices.length - 1));
    const getY = (price) => height - padding - ((price - minPrice) * (height - padding * 2) / (maxPrice - minPrice));
    
    for (let i = 0; i <= 4; i++) {
        const yVal = minPrice + (i * (maxPrice - minPrice) / 4);
        const yCoord = getY(yVal);
        
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", padding);
        line.setAttribute("y1", yCoord);
        line.setAttribute("x2", width - padding);
        line.setAttribute("y2", yCoord);
        line.setAttribute("stroke", "var(--border-light)");
        line.setAttribute("stroke-dasharray", "4 4");
        svg.appendChild(line);
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", padding - 5);
        text.setAttribute("y", yCoord + 4);
        text.setAttribute("fill", "var(--text-muted)");
        text.setAttribute("font-size", "9");
        text.setAttribute("text-anchor", "end");
        text.textContent = `₹${Math.round(yVal)}`;
        svg.appendChild(text);
    }
    
    let pathPoints = [];
    prices.forEach((price, idx) => {
        const xCoord = getX(idx);
        const yCoord = getY(price);
        pathPoints.push(`${xCoord},${yCoord}`);
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", xCoord);
        text.setAttribute("y", height - 10);
        text.setAttribute("fill", "var(--text-muted)");
        text.setAttribute("font-size", "10");
        text.setAttribute("text-anchor", "middle");
        text.textContent = months[idx];
        svg.appendChild(text);
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", xCoord);
        circle.setAttribute("cy", yCoord);
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", "var(--primary-light)");
        circle.setAttribute("stroke", "var(--bg-main)");
        circle.setAttribute("stroke-width", "1.5");
        svg.appendChild(circle);
        
        const rateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        rateText.setAttribute("x", xCoord);
        rateText.setAttribute("y", yCoord - 8);
        rateText.setAttribute("fill", "var(--text-primary)");
        rateText.setAttribute("font-size", "8");
        rateText.setAttribute("font-weight", "bold");
        rateText.setAttribute("text-anchor", "middle");
        rateText.textContent = `₹${price}`;
        svg.appendChild(rateText);
    });
    
    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "var(--primary-light)");
    polyline.setAttribute("stroke-width", "2.5");
    polyline.setAttribute("points", pathPoints.join(" "));
    svg.insertBefore(polyline, svg.firstChild);
}

function updateMandiRatesOutputs() {
    const crop = document.getElementById('mandiCropSelect').value;
    const avgRate = state.cropPrices[crop] || 2000;
    
    const minVal = Math.round(avgRate * 0.94);
    const maxVal = Math.round(avgRate * 1.06);
    
    document.getElementById('mandiMinVal').innerText = `₹${minVal}/Q`;
    document.getElementById('mandiAvgVal').innerText = `₹${avgRate}/Q`;
    document.getElementById('mandiMaxVal').innerText = `₹${maxVal}/Q`;
    
    document.getElementById('dashMandiAvg').innerText = `${crop}: ₹${avgRate}/Q`;
}

function initMandiControls() {
    const searchBtn = document.getElementById('mandiSearchBtn');
    
    searchBtn.addEventListener('click', () => {
        updateMandiRatesOutputs();
        drawMandiChart();
    });
}

// ================= FINANCIAL YIELD CALCULATOR =================
function calculateAgriYield() {
    const area = parseFloat(document.getElementById('calcLandSize').value) || 1;
    const crop = document.getElementById('calcCropSelect').value;
    const inputCost = parseFloat(document.getElementById('calcCostInputs').value) || 0;
    const laborCost = parseFloat(document.getElementById('calcLaborCosts').value) || 0;
    
    const yieldMultipliers = {
        Wheat: 18,
        Rice: 22,
        Cotton: 11,
        Tomato: 35
    };
    
    const cropMultiplier = yieldMultipliers[crop] || 15;
    const avgMarketRate = state.cropPrices[crop] || 2000;
    
    const totalExpenses = area * (inputCost + laborCost);
    const expectedYield = area * cropMultiplier;
    const grossRevenue = expectedYield * avgMarketRate;
    const netProfit = grossRevenue - totalExpenses;
    const roi = (netProfit / totalExpenses) * 100;
    
    document.getElementById('calcTotalExpense').innerText = `₹${totalExpenses.toLocaleString('en-IN')}`;
    document.getElementById('calcExpectedYield').innerText = `${expectedYield} Quintals`;
    document.getElementById('calcGrossRevenue').innerText = `₹${grossRevenue.toLocaleString('en-IN')}`;
    document.getElementById('calcNetProfit').innerText = `₹${netProfit.toLocaleString('en-IN')}`;
    document.getElementById('calcROI').innerText = `${roi.toFixed(1)}%`;
    
    const profitContainer = document.querySelector('.calc-result-row.profit');
    if (netProfit < 0) {
        profitContainer.style.color = "var(--danger)";
        document.getElementById('calcNetProfit').style.color = "var(--danger)";
    } else {
        profitContainer.style.color = "var(--success)";
        document.getElementById('calcNetProfit').style.color = "var(--success)";
    }
}

function initFinancialCalculator() {
    const inputs = ['calcLandSize', 'calcCropSelect', 'calcCostInputs', 'calcLaborCosts'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', calculateAgriYield);
        el.addEventListener('change', calculateAgriYield);
    });
    
    calculateAgriYield();
}

// ================= SOIL CROP RECOMMENDER MATCHING ENGINE =================
function matchCropsToSoil() {
    const userN = parseInt(document.getElementById('soilN').value);
    const userP = parseInt(document.getElementById('soilP').value);
    const userK = parseInt(document.getElementById('soilK').value);
    const userPH = parseFloat(document.getElementById('soilPH').value);
    const userRainfall = parseFloat(document.getElementById('soilRainfall').value);
    
    document.getElementById('recommenderConfigSummary').innerText = `Profile parameters: N:${userN} mg/kg | P:${userP} mg/kg | K:${userK} mg/kg | pH:${userPH} | Rainfall:${userRainfall}mm`;
    
    const outputGrid = document.getElementById('recommenderResultsList');
    outputGrid.innerHTML = '';
    
    let scoredCrops = state.cropProfiles.map(crop => {
        // Compute delta absolute matching scores (capped/scaled)
        const diffN = Math.abs(userN - crop.N) / crop.N;
        const diffP = Math.abs(userP - crop.P) / crop.P;
        const diffK = Math.abs(userK - crop.K) / crop.K;
        const diffPH = Math.abs(userPH - crop.pH) / crop.pH;
        const diffRain = Math.abs(userRainfall - crop.rainfall) / crop.rainfall;
        
        // Match percentage score formula
        const penalty = (diffN * 0.25) + (diffP * 0.2) + (diffK * 0.2) + (diffPH * 0.2) + (diffRain * 0.15);
        let matchScore = Math.round((1 - penalty) * 100);
        
        if (matchScore > 99) matchScore = 99;
        if (matchScore < 15) matchScore = 15;
        
        return { ...crop, score: matchScore };
    });
    
    // Sort crops by match score descending
    scoredCrops.sort((a, b) => b.score - a.score);
    
    // Render matching crop cards
    scoredCrops.forEach(crop => {
        const card = document.createElement('div');
        card.className = "rec-card";
        
        // Set dynamic score pill color based on match
        let pillStyle = "background: rgba(46,125,50,0.1); border-color: rgba(46,125,50,0.2); color: var(--primary);";
        if (crop.score < 60) {
            pillStyle = "background: rgba(213,0,0,0.05); border-color: rgba(213,0,0,0.15); color: var(--danger);";
        } else if (crop.score < 80) {
            pillStyle = "background: rgba(255,109,0,0.08); border-color: rgba(255,109,0,0.2); color: var(--warning);";
        }
        
        card.innerHTML = `
            <div class="rec-header">
                <span class="rec-title">${crop.icon} ${crop.name}</span>
                <span class="rec-score-pill" style="${pillStyle}">${crop.score}% Match</span>
            </div>
            <p class="rec-body">${crop.desc}</p>
            <div class="rec-metrics-list">
                <div class="rec-metric-item">
                    <span>Target NPK:</span>
                    <strong>${crop.N} - ${crop.P} - ${crop.K}</strong>
                </div>
                <div class="rec-metric-item">
                    <span>Ideal pH:</span>
                    <strong>${crop.pH}</strong>
                </div>
                <div class="rec-metric-item">
                    <span>Ideal Rainfall:</span>
                    <strong>${crop.rainfall} mm</strong>
                </div>
            </div>
            <button class="rec-action-btn" onclick="recommendationActionSow('${crop.name}')">Sow & Track crop</button>
        `;
        
        outputGrid.appendChild(card);
    });
}

function recommendationActionSow(cropName) {
    const today = new Date().toISOString().substring(0, 10);
    
    // Auto populate the seasonal planner target values
    document.getElementById('planCropSelect').value = cropName;
    document.getElementById('planSowingDate').value = today;
    
    // Open the seasonal planner tab and trigger generation
    switchTab('planner');
    document.getElementById('generatePlannerBtn').click();
    
    alert(`Success! Automatic cultivation schedule generated for matched soil crop: "${cropName}". See task list details.`);
}

function initSoilRecommender() {
    const recommendBtn = document.getElementById('recommendCropsBtn');
    
    recommendBtn.addEventListener('click', () => {
        document.getElementById('recommenderPlaceholder').style.display = 'none';
        const container = document.getElementById('recommendationsListContainer');
        container.classList.add('active');
        
        matchCropsToSoil();
    });
}

// ================= MOBILE SIDEBAR TOGGLE =================
function initMobileNavigation() {
    const btn = document.getElementById('menuToggleBtn');
    const sidebar = document.getElementById('sidebar');
    
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// ================= AGROEXPERT modal forms =================
function initExpertTicketSupport() {
    const openBtn = document.getElementById('openExpertTicketBtn');
    const modal = document.getElementById('expertModal');
    const form = document.getElementById('expertTicketForm');
    
    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        modal.style.display = 'none';
        
        const subj = document.getElementById('expertSubject').value;
        alert(`Agro-Support Ticket Submitted Successfully!\n\nSubject: ${subj}\n\nOur agricultural block officer will contact you within 24 hours via registered mobile.`);
        
        const alertsBox = document.getElementById('dashboardAlertsList');
        alertsBox.innerHTML = `
            <div class="alert-item">
                <div class="alert-icon">👨‍🌾</div>
                <div class="alert-body">
                    <h4>Support Ticket Submitted</h4>
                    <p>Ticket ref #AGRI-2026-098 for subject: "<em>${subj}</em>" received by district officer.</p>
                    <div class="alert-time">Just now</div>
                </div>
            </div>
            ${alertsBox.innerHTML}
        `;
    });
}

// ================= INITIALIZATION ON DOM READY =================
document.addEventListener('DOMContentLoaded', () => {
    updateLiveDateTime();
    setInterval(updateLiveDateTime, 60000);
    
    initChatControls();
    initDiagnosticUploader();
    initPlanner();
    initMandiControls();
    initFinancialCalculator();
    initSoilRecommender();
    initMobileNavigation();
    initExpertTicketSupport();
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const tab = e.currentTarget.getAttribute('data-tab');
            switchTab(tab);
        });
    });
});
