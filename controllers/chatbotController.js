function getBotResponse(message) {
    const msg = message.toLowerCase().trim();

    // ---- Greetings ----
    if (msg.match(/^(hi|hello|hey|sup|yo|hola|howdy|greetings|good morning|good afternoon|good evening)/i)) {
        return "👋 Hi there! Welcome to GreenWheel Auto. How can I help you today?";
    }

    // ---- Range questions ----
    if (msg.match(/range|how far|km|kilometer|mile|distance|long range|battery life/i)) {
        return "Our EVs have ranges from 310 km (Nissan Ariya) to 630 km (BMW iX). Tip: Winter conditions can reduce range by 25-40%. Check our Range Suitability Checker to find the perfect EV for your commute.";
    }

    // ---- Price questions ----
    if (msg.match(/price|cost|expensive|cheap|affordable|dollar|\$|how much|budget|finance|payment/i)) {
        return "Our EVs range from $43,000 (Chevrolet Equinox EV) to $133,000 (Porsche Taycan). Check out our Hot Deals section for the best discounts. We also offer financing options - contact us for details.";
    }

    // ---- Charging questions ----
    if (msg.match(/charge|charging|battery|plug|fast charge|slow charge|charge time|how long to charge|electricity|power/i)) {
        return "All our EVs support fast charging. Charging times: Fast (250kW): 20-35 min (0-80%) | Standard (50kW): 40-60 min (0-80%). Most come with a home charger option too. Level 2 home charging typically takes 6-10 hours for a full charge.";
    }

    // ---- Browse / Catalogue ----
    if (msg.match(/browse|view|show|catalogue|list|vehicles|cars|models|inventory|available|stock/i)) {
        return "You can browse all our EVs on the Catalogue page. Use filters to narrow down by brand, shape, or year. Click on any vehicle to see full details including specs, photos, and history reports.";
    }

    // ---- Comparison ----
    if (msg.match(/compare|vs|versus|difference|better|best|which one|recommend|suggest|pick|choose|decision/i)) {
        return "We don't have a full comparison tool yet, but you can: 1) Check vehicle specs on the Detail page 2) Use the Range Suitability Checker to find the best match for your commute 3) Compare prices and features side-by-side in our catalogue. I can also help answer specific questions about different models!";
    }

    // ---- Cart / Purchase ----
    if (msg.match(/cart|buy|purchase|order|checkout|payment|pay|credit card|shipping|delivery|transaction|secure/i)) {
        return "Ready to buy? Here's how: 1) Add a vehicle to your Cart 2) Go to Checkout 3) Enter your shipping and payment info. All transactions are secure and JWT-protected. You'll need to be logged in to complete a purchase.";
    }

    // ---- Hot Deals ----
    if (msg.match(/deal|discount|sale|hot deal|promo|offer|special|savings|markdown|clearance/i)) {
        return "Current Hot Deals: Tesla Model Y - $67,999 | Hyundai IONIQ 6 - $54,000 | Ford Mustang Mach-E - $58,000. Don't miss out — these deals won't last! Check the Hot Deals section on our homepage for the latest promotions.";
    }

    // ---- Help / Support ----
    if (msg.match(/help|support|assist|guide|tutorial|how do i|how can i|what is|explain|confused|stuck|question/i)) {
        return "I can help you with: Vehicles - range, specs, pricing | Catalogue - browsing and filtering | Charging - speeds and times | Buying - cart and checkout | Hot Deals - current promotions. Just ask me anything about GreenWheel Auto and I'll do my best to assist!";
    }

    // ---- Thanks / Goodbye ----
    if (msg.match(/thank|thanks|ty|appreciate|goodbye|bye|see ya|cya|later|talk soon|take care|have a good day/i)) {
        return "You're welcome! Drive safe and happy EV shopping. Come back anytime if you need more help. Have a great day!";
    }

    // ---- About / Company ----
    if (msg.match(/about|company|greenwheel|who are you|what is greenwheel|tell me about|history|mission|vision/i)) {
        return "GreenWheel Auto is an online electric vehicle retail platform dedicated to making EV shopping easy and accessible. We offer a curated selection of new and used electric vehicles, with features like range checking, hot deals, and secure checkout. Our mission is to help you find the perfect EV for your lifestyle!";
    }

    // ---- Warranty / Returns ----
    if (msg.match(/warranty|guarantee|return|refund|exchange|policy|protection|repair|service|maintenance/i)) {
        return "All our vehicles come with a manufacturer warranty. New vehicles typically include a 4-year/80,000 km warranty, while used vehicles may have remaining factory warranty or extended coverage options. For specific warranty details, please check the vehicle's detail page or contact our support team.";
    }

    // ---- Test Drive ----
    if (msg.match(/test drive|test|drive|demo|see in person|viewing|appointment|visit|showroom/i)) {
        return "We encourage test drives! You can schedule a test drive by visiting our partner dealerships. Contact us through the website and we'll help arrange a convenient time for you to experience your chosen EV in person.";
    }

    // ---- Trade-in ----
    if (msg.match(/trade in|trade-in|trade|sell my car|exchange|old car|value|appraisal/i)) {
        return "We offer trade-in options! You can get an estimate for your current vehicle when you're ready to purchase. Contact our support team for a personalized appraisal and to learn more about our trade-in program.";
    }

    // ---- EV vs Gas ----
    if (msg.match(/ev vs gas|gas vs ev|savings|compare gas|fuel savings|gas savings|co2|emissions|environment|eco friendly/i)) {
        return "Switching to an EV offers significant savings! On average, EV owners save $1,000-$2,000 annually on fuel costs. EVs also produce zero tailpipe emissions, reducing your carbon footprint. Check out our EV vs Gas comparison tool to see your potential savings!";
    }

    // ---- Winter Driving ----
    if (msg.match(/winter|cold|snow|ice|freezing|winter range|cold weather|heating|defrost|battery cold/i)) {
        return "Winter driving tips for EVs: 1) Pre-heat your vehicle while plugged in 2) Use seat heaters instead of cabin heat when possible 3) Keep your battery above 20% 4) Store your EV in a garage if possible 5) Use Eco mode for better efficiency. Winter range can be 25-40% less than EPA estimates, so plan accordingly!";
    }

    // ---- Home Charger Installation ----
    if (msg.match(/home charger|charger installation|install charger|charger setup|level 2 charger|wall box|evse|charging station/i)) {
        return "Home charger installation: We recommend a Level 2 (240V) charger for fastest home charging. Installation costs typically range from $500-$1,500 depending on your electrical panel. Many utility companies offer rebates for home charger installation. Check with your local provider for available incentives!";
    }

    // ---- Fallback ----
    return "I'm not quite sure about that. Here's what I can help with: Vehicle info - Ask about range, specs, or pricing | Charging - Charging speeds and times | Buying - How to purchase a vehicle | Deals - Current promotions and discounts. Or try asking something else!";
}

const handleChatbot = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Please enter a message.'
            });
        }

        const response = getBotResponse(message);

        res.json({
            success: true,
            response: response
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
};

module.exports = {
    handleChatbot
};