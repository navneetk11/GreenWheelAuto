// Simple rule-based chatbot responses
function getBotResponse(message) {
    const msg = message.toLowerCase().trim();

    if (msg.match(/^(hi|hello|hey|sup|yo|hola)/i)) {
        return "👋 Hi there! Welcome to GreenWheel Auto. How can I help you today?";
    }

    if (msg.match(/range|how far|km|kilometer/i)) {
        return "Our EVs have ranges from 310 km (Nissan Ariya) to 630 km (BMW iX). Tip: Winter conditions can reduce range by 25-40%. Check our Range Suitability Checker to find the perfect EV for your commute.";
    }

    if (msg.match(/price|cost|expensive|cheap|affordable|dollar|\$/i)) {
        return "Our EVs range from $43,000 (Chevrolet Equinox EV) to $133,000 (Porsche Taycan). Check out our Hot Deals section for the best discounts.";
    }

    if (msg.match(/charge|charging|battery|plug|fast charge/i)) {
        return "All our EVs support fast charging. Charging times: Fast (250kW): 20-35 min (0-80%) | Standard (50kW): 40-60 min (0-80%). Most come with a home charger option too.";
    }

    if (msg.match(/browse|view|show|catalogue|list|vehicles/i)) {
        return "You can browse all our EVs on the Catalogue page. Use filters to narrow down by brand, shape, or year. Click on any vehicle to see full details.";
    }

    if (msg.match(/compare|vs|versus|difference|better|best/i)) {
        return "We don't have a full comparison tool yet, but you can: 1) Check vehicle specs on the Detail page 2) Use the Range Suitability Checker to find the best match for your commute 3) Compare prices and features side-by-side in our catalogue.";
    }

    if (msg.match(/cart|buy|purchase|order|checkout|payment/i)) {
        return "Ready to buy? Here's how: 1) Add a vehicle to your Cart 2) Go to Checkout 3) Enter your shipping and payment info. All transactions are secure and JWT-protected.";
    }

    if (msg.match(/deal|discount|sale|hot deal|promo|offer/i)) {
        return "Current Hot Deals: Tesla Model Y - $67,999 | Hyundai IONIQ 6 - $54,000 | Ford Mustang Mach-E - $58,000. Don't miss out — these deals won't last.";
    }

    if (msg.match(/help|support|assist|guide|tutorial|how do i|how can i/i)) {
        return "I can help you with: Vehicles - range, specs, pricing | Catalogue - browsing and filtering | Charging - speeds and times | Buying - cart and checkout | Hot Deals - current promotions. Just ask me anything about GreenWheel Auto.";
    }

    if (msg.match(/thank|thanks|ty|appreciate|goodbye|bye|see ya/i)) {
        return "You're welcome! Drive safe and happy EV shopping. Come back anytime if you need more help.";
    }

    return "I'm not quite sure about that. Here's what I can help with: Vehicle info - Ask about range, specs, or pricing | Charging - Charging speeds and times | Buying - How to purchase a vehicle | Deals - Current promotions and discounts. Or try asking something else.";
}

// Handle chatbot requests
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