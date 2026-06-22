const fs = require('fs');
const files = ['locales/en.json', 'locales/fr.json', 'locales/rw.json'];

const additions = {
  en: {
    "aboutSubtitle": "Your trusted retail partner in Rwanda since 2007.",
    "ourHistory": "Our History",
    "historyP1": "Founded in 2007, Simba Supermarket has grown from a single store to become one of Rwanda's leading and most trusted retail chains.",
    "historyP2": "We are committed to providing our customers with the highest quality products, exceptional service, and a modern shopping experience, whether in-store or online.",
    "emailSupport": "Email Support",
    "localPhoneLines": "Local Phone Lines",
    "customerServicePhone": "Customer Service: +250 788 123 456",
    "deliveryTeamPhone": "Delivery Team: +250 788 654 321",
    "operatingHours": "Operating Hours",
    "operatingHoursTime": "Mon - Sun: 8:00 AM - 10:00 PM"
  },
  fr: {
    "aboutSubtitle": "Votre partenaire de vente au détail de confiance au Rwanda depuis 2007.",
    "ourHistory": "Notre Histoire",
    "historyP1": "Fondé en 2007, le supermarché Simba est passé d'un magasin unique à l'une des chaînes de vente au détail les plus importantes et les plus fiables du Rwanda.",
    "historyP2": "Nous nous engageons à fournir à nos clients des produits de la plus haute qualité, un service exceptionnel et une expérience d'achat moderne, en magasin ou en ligne.",
    "emailSupport": "Support par e-mail",
    "localPhoneLines": "Lignes téléphoniques locales",
    "customerServicePhone": "Service client : +250 788 123 456",
    "deliveryTeamPhone": "Équipe de livraison : +250 788 654 321",
    "operatingHours": "Heures d'ouverture",
    "operatingHoursTime": "Lun - Dim : 8h00 - 22h00"
  },
  rw: {
    "aboutSubtitle": "Umufatanyabikorwa wawe wizerwa mu bucuruzi mu Rwanda kuva 2007.",
    "ourHistory": "Amateka Yacu",
    "historyP1": "Simba Supermarket yatangiye mu 2007 ari iduka rimwe, ikura ivamo imwe mu maduka manini kandi yizerwa mu Rwanda.",
    "historyP2": "Twiyemeje guha abakiriya bacu ibicuruzwa byiza cyane, serivisi ihebuje, ndetse n'uburambe bugezweho bwo guhaha, yaba ku iduka cyangwa kuri interineti.",
    "emailSupport": "Kuvugana n'abakiriya ukoresheje imeyili",
    "localPhoneLines": "Imirongo ya terefone",
    "customerServicePhone": "Kuvugana n'abakiriya: +250 788 123 456",
    "deliveryTeamPhone": "Ikipe itanga ibicuruzwa: +250 788 654 321",
    "operatingHours": "Amasaha yo gukora",
    "operatingHoursTime": "Mbere - Cyumw: 8:00 AM - 10:00 PM"
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
