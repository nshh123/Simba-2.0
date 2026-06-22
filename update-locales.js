const fs = require('fs');
const files = ['locales/en.json', 'locales/fr.json', 'locales/rw.json'];

const additions = {
  en: {
    "clearCart": "Clear Cart",
    "emptyCartMsg": "Looks like you haven't added anything to your cart yet.",
    "goToShop": "Go to Shop",
    "savedForLater": "Saved for Later",
    "moveToCart": "Move to Cart",
    "saveForLater": "Save for later",
    "share": "Share",
    "aboutSimba": "About Simba",
    "faq": "FAQ",
    "faqTitle": "Frequently Asked Questions",
    "faqDesc": "Find answers to common questions about shopping with Simba.",
    "stillHaveQuestions": "Still have questions?",
    "customerSupport": "Our customer support team is here to help you.",
    "contactUs": "Contact Us",
    "minOrderThreshold": "Minimum Order Threshold",
    "minOrderDesc": "Your cart total is {{subtotal}} RWF. To make deliveries logistically viable, the minimum order amount is 2,500 RWF.",
    "continueShopping": "Continue Shopping",
    "deliveryInstructions": "Delivery Instructions & Landmarks",
    "deliveryInstructionsPlaceholder": "e.g., Opposite Gisozi Sector Office or Near the pharmacy",
    "momoDepositMethod": "MoMo Deposit",
    "payDepositNowSubtitle": "Pay 500 RWF deposit now",
    "cashOnDelivery": "Cash on Delivery",
    "payFullOnCollection": "Pay full amount on collection",
    "faqQ1": "How does delivery work on public holidays?",
    "faqA1": "Our delivery service operates on a special schedule during public holidays. We typically stop taking same-day delivery orders at 2:00 PM on holidays to ensure all staff have time with their families. Please check our homepage for specific holiday announcements.",
    "faqQ2": "What is your return policy for fresh vegetables?",
    "faqA2": "We guarantee the freshness of all our produce. If you are not satisfied with the quality of any fresh vegetables or fruits upon delivery or pick-up, please notify us within 24 hours. We will replace the item or issue a full refund to your original payment method.",
    "faqQ3": "Do you offer Cash on Delivery?",
    "faqA3": "Yes, we do! You can select 'Cash on Delivery' at checkout. You simply pay the full amount when you collect your order or when it's delivered to you. We also offer a MoMo Deposit option for securing items in advance.",
    "faqQ4": "What happens if I miss my pick-up window?",
    "faqA4": "If you are running late, your order will be safely stored. Refrigerated or frozen items will be kept at the appropriate temperature. We hold pick-up orders until the end of the business day. If uncollected, we will contact you to reschedule.",
    "faqQ5": "Can I modify my order after placing it?",
    "faqA5": "You cannot modify an order yourself once it is placed. However, if you contact our customer support team immediately at info@simbasupermarket.rw or call us, we can typically make changes if the order hasn't been prepared or dispatched yet."
  },
  fr: {
    "clearCart": "Vider le panier",
    "emptyCartMsg": "On dirait que vous n'avez encore rien ajouté à votre panier.",
    "goToShop": "Aller à la boutique",
    "savedForLater": "Enregistré pour plus tard",
    "moveToCart": "Déplacer vers le panier",
    "saveForLater": "Enregistrer pour plus tard",
    "share": "Partager",
    "aboutSimba": "À propos de Simba",
    "faq": "FAQ",
    "faqTitle": "Foire aux questions",
    "faqDesc": "Trouvez des réponses aux questions courantes sur les achats avec Simba.",
    "stillHaveQuestions": "Vous avez encore des questions ?",
    "customerSupport": "Notre équipe de support client est là pour vous aider.",
    "contactUs": "Contactez-nous",
    "minOrderThreshold": "Seuil de commande minimum",
    "minOrderDesc": "Le total de votre panier est de {{subtotal}} RWF. Pour rendre les livraisons logistiquement viables, le montant minimum de commande est de 2 500 RWF.",
    "continueShopping": "Continuer les achats",
    "deliveryInstructions": "Instructions de livraison et repères",
    "deliveryInstructionsPlaceholder": "par ex., En face du bureau du secteur Gisozi ou près de la pharmacie",
    "momoDepositMethod": "Dépôt MoMo",
    "payDepositNowSubtitle": "Payez un acompte de 500 RWF maintenant",
    "cashOnDelivery": "Paiement à la livraison",
    "payFullOnCollection": "Payer la totalité à la collecte",
    "faqQ1": "Comment fonctionne la livraison les jours fériés ?",
    "faqA1": "Notre service de livraison fonctionne selon un horaire spécial les jours fériés. Nous arrêtons généralement de prendre les commandes de livraison le jour même à 14 h les jours fériés. Veuillez consulter notre page d'accueil pour les annonces spécifiques aux vacances.",
    "faqQ2": "Quelle est votre politique de retour pour les légumes frais ?",
    "faqA2": "Nous garantissons la fraîcheur de tous nos produits. Si vous n'êtes pas satisfait de la qualité de vos légumes ou fruits frais lors de la livraison, veuillez nous en informer dans les 24 heures.",
    "faqQ3": "Proposez-vous le paiement à la livraison ?",
    "faqA3": "Oui, nous le faisons ! Vous pouvez sélectionner « Paiement à la livraison » lors du paiement.",
    "faqQ4": "Que se passe-t-il si je manque ma fenêtre de collecte ?",
    "faqA4": "Si vous êtes en retard, votre commande sera conservée en toute sécurité.",
    "faqQ5": "Puis-je modifier ma commande après l'avoir passée ?",
    "faqA5": "Vous ne pouvez pas modifier vous-même une commande une fois qu'elle est passée."
  },
  rw: {
    "clearCart": "Siba Ikarita",
    "emptyCartMsg": "Ubusa, ntabwo urongeramo ibintu mu ikarita yawe.",
    "goToShop": "Jya kugura",
    "savedForLater": "Byabitswe",
    "moveToCart": "Shyira mu ikarita",
    "saveForLater": "Bika",
    "share": "Sangiza",
    "aboutSimba": "Ibyerekeye Simba",
    "faq": "Ibibazo",
    "faqTitle": "Ibibazo Bikunze Kubazwa",
    "faqDesc": "Shaka ibisubizo by'ibibazo bikunze kubazwa ku byerekeye guhaha na Simba.",
    "stillHaveQuestions": "Uracyari n'ibibazo?",
    "customerSupport": "Ikipe yacu ifasha abakiriya ihari kugira ngo igufashe.",
    "contactUs": "Twandikire",
    "minOrderThreshold": "Igiciro gito cy'itumiza",
    "minOrderDesc": "Igiciro cy'ikarita yawe ni {{subtotal}} RWF. Kugarura ibintu bikorwa ku biciro biri hejuru ya 2,500 RWF.",
    "continueShopping": "Komeza Uhaha",
    "deliveryInstructions": "Amabwiriza y'Itangwa",
    "deliveryInstructionsPlaceholder": "Urugero: Imbere y'ibiro by'umurenge wa Gisozi",
    "momoDepositMethod": "Kwishyura MoMo",
    "payDepositNowSubtitle": "Ishyura 500 RWF ubu",
    "cashOnDelivery": "Kwishyura ubushikirijwe",
    "payFullOnCollection": "Ishyura yose mu kubifata",
    "faqQ1": "Ni gute itangwa rikora mu minsi y'ikiruhuko rusange?",
    "faqA1": "Serivisi yacu yo gutanga ikora ku ngengabihe yihariye mu minsi y'ikiruhuko rusange.",
    "faqQ2": "Itegeko ryanyu ryo kugarura imboga nshya ni irihe?",
    "faqA2": "Twishingira ubwiza bw'ibicuruzwa byacu byose. Niba utanyuzwe, tubwire mu masaha 24.",
    "faqQ3": "Mwaba mutanga Kwishyura Ubushikirijwe?",
    "faqA3": "Yego! Ushobora guhitamo 'Kwishyura Ubushikirijwe'.",
    "faqQ4": "Bimera bite iyo nkererewe gufata ibyanjye?",
    "faqA4": "Niba ukererewe, icyatumijwe cyawe kizabikwa neza.",
    "faqQ5": "Ese nshobora guhindura ibyo natumije?",
    "faqA5": "Ntushobora guhindura ibyo watumije wenyine nyuma yuko bishyirwa mu gikorwa."
  }
};

files.forEach((file) => {
  const lang = file.match(/([a-z]{2})\.json$/)[1];
  let data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  // Extract products to add back later
  const products = data.products;
  delete data.products;

  // Add new keys
  Object.assign(data, additions[lang]);

  // Add products back so it remains at the end
  data.products = products;

  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
});
