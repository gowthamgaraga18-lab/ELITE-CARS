/* ==========================================================================
   ELITE MOTORS — data.js
   The showroom's stock, journal and helpers shared by the UI layer.
   Prices are in ₹ crore (on-road, Vijayawada) and are indicative.
   ========================================================================== */
(function () {
  'use strict';

  const IMG = 'assets/img/';
  const detailImages = [
    { src: IMG + 'detail-front.jpg', alt: 'Close study of the front bumper, intake and headlamp detail', caption: 'Front end — panel gaps and paint depth measured on every car' },
    { src: IMG + 'detail-wheel.jpg', alt: 'Close study of a forged alloy wheel and brake package', caption: 'Wheels and brakes — discs measured, pads checked, tyres dated' }
  ];

  const cars = [
    {
      id: 'amg-gt',
      brand: 'Mercedes-AMG',
      model: 'GT 63 S 4-Door Coupé',
      short: 'GT 63 S',
      year: 2024,
      condition: 'pre-owned',
      body: 'Coupe',
      price: 3.45,
      km: 4200,
      fuel: 'Petrol',
      transmission: '9-speed automatic',
      drivetrain: 'AWD',
      engine: '4.0 L V8 biturbo',
      power: 630,
      torque: 900,
      accel: 3.2,
      topSpeed: 315,
      seats: 4,
      owners: 1,
      colour: 'Obsidian Black',
      boot: 456,
      warranty: '18 months Elite Certified',
      badge: 'One owner',
      tagline: 'The four-door that thinks it is a supercar.',
      description:
        'One owner, full AMG service history and the optional carbon-ceramic brakes. This is the rare GT 63 S that has been driven gently and maintained without compromise — the paint depth readings are identical on every panel.',
      features: ['Carbon-ceramic brakes', 'Burmester 3D audio', 'AMG Performance seats', 'Head-up display', 'Panoramic roof', 'Night package'],
      image: { src: IMG + 'car-amg-gt.jpg', alt: 'Black Mercedes-AMG GT 63 S four-door coupé in a dark studio' },
      featured: true
    },
    {
      id: 'porsche-911',
      brand: 'Porsche',
      model: '911 Turbo S',
      short: '911 Turbo S',
      year: 2025,
      condition: 'new',
      body: 'Coupe',
      price: 4.1,
      km: 120,
      fuel: 'Petrol',
      transmission: '8-speed PDK',
      drivetrain: 'AWD',
      engine: '3.7 L flat-six turbo',
      power: 650,
      torque: 800,
      accel: 2.7,
      topSpeed: 330,
      seats: 4,
      owners: 0,
      colour: 'Carrara White',
      boot: 128,
      warranty: '3 years, unlimited km',
      badge: 'New arrival',
      tagline: 'The everyday supercar, still undefeated.',
      description:
        'Delivered to us straight from the transporter with 120 km on the clock — delivery mileage only. PDCC, rear-axle steering and the Sport Chrono package. First registration in your name.',
      features: ['Sport Chrono package', 'Rear-axle steering', 'PDCC', 'BOSE surround', 'Adaptive cruise', 'Sport exhaust'],
      image: { src: IMG + 'car-911.jpg', alt: 'White Porsche 911 Turbo S coupé photographed in low light' },
      featured: true
    },
    {
      id: 'bmw-m5',
      brand: 'BMW',
      model: 'M5 Competition',
      short: 'M5 Competition',
      year: 2023,
      condition: 'pre-owned',
      body: 'Sedan',
      price: 2.1,
      km: 18400,
      fuel: 'Petrol',
      transmission: '8-speed automatic',
      drivetrain: 'AWD',
      engine: '4.4 L V8 biturbo',
      power: 625,
      torque: 750,
      accel: 3.3,
      topSpeed: 305,
      seats: 5,
      owners: 1,
      colour: 'Marina Bay Blue',
      boot: 530,
      warranty: '12 months Elite Certified',
      badge: 'Best value',
      tagline: 'A limousine with a temper.',
      description:
        'Two services at authorised workshops, both stamped. New Michelin Pilot Sport 4S fitted at 17,000 km. The M Driver\'s package and carbon roof are both present — a remarkably complete car.',
      features: ['M Driver\'s package', 'Carbon roof', 'Bowers & Wilkins', 'M Sport seats', 'Laserlight', 'Soft-close doors'],
      image: { src: IMG + 'car-m5.jpg', alt: 'Blue BMW M5 Competition sedan in a studio setting' },
      featured: false
    },
    {
      id: 'audi-rs7',
      brand: 'Audi',
      model: 'RS 7 Sportback',
      short: 'RS 7',
      year: 2024,
      condition: 'new',
      body: 'Sedan',
      price: 2.35,
      km: 85,
      fuel: 'Petrol',
      transmission: '8-speed tiptronic',
      drivetrain: 'AWD',
      engine: '4.0 L V8 TFSI',
      power: 630,
      torque: 850,
      accel: 3.4,
      topSpeed: 305,
      seats: 5,
      owners: 0,
      colour: 'Nardo Grey',
      boot: 535,
      warranty: '2 years, unlimited km',
      badge: 'Featured',
      tagline: 'Understatement, at 305 km/h.',
      description:
        'Unregistered, delivery mileage, and the specification we would have ordered ourselves: dynamic package plus, RS sport exhaust and the Bang & Olufsen 3D system.',
      features: ['Dynamic package plus', 'RS sport exhaust', 'B&O 3D sound', 'Matrix LED', 'Air suspension', 'Carbon inlays'],
      image: { src: IMG + 'car-rs7.jpg', alt: 'Grey Audi RS 7 Sportback in a dark showroom' },
      featured: false
    },
    {
      id: 'ferrari-roma',
      brand: 'Ferrari',
      model: 'Roma',
      short: 'Roma',
      year: 2023,
      condition: 'pre-owned',
      body: 'Coupe',
      price: 5.2,
      km: 6100,
      fuel: 'Petrol',
      transmission: '8-speed DCT',
      drivetrain: 'RWD',
      engine: '3.9 L V8 biturbo',
      power: 620,
      torque: 760,
      accel: 3.4,
      topSpeed: 320,
      seats: 4,
      owners: 1,
      colour: 'Blu Corsa',
      boot: 272,
      warranty: 'Ferrari Power Warranty to 2028',
      badge: 'Rare spec',
      tagline: 'The most civilised Ferrari ever built.',
      description:
        'Ferrari Approved, with the balance of the factory Power Warranty until 2028. Front lift, passenger display and the full extended leather. No paintwork, no stories.',
      features: ['Front lift', 'Passenger display', 'Extended leather', 'Carbon steering wheel', 'Ferrari Approved', 'Scuderia shields'],
      image: { src: IMG + 'car-roma.jpg', alt: 'Deep blue Ferrari Roma coupé in a studio' },
      featured: true
    },
    {
      id: 'huracan',
      brand: 'Lamborghini',
      model: 'Huracán EVO Spyder',
      short: 'Huracán EVO',
      year: 2022,
      condition: 'pre-owned',
      body: 'Convertible',
      price: 5.85,
      km: 9800,
      fuel: 'Petrol',
      transmission: '7-speed DCT',
      drivetrain: 'AWD',
      engine: '5.2 L V10',
      power: 640,
      torque: 600,
      accel: 3.1,
      topSpeed: 325,
      seats: 2,
      owners: 1,
      colour: 'Arancio Borealis',
      boot: 100,
      warranty: '12 months Elite Certified',
      badge: 'Roof down',
      tagline: 'A naturally aspirated V10 — the last of them.',
      description:
        'The final generation of Lamborghini\'s V10, in the colour everyone photographs. Serviced annually, tyres replaced last season, and the soft top operates without a mark.',
      features: ['Naturally aspirated V10', 'LDVI dynamics', 'Sports exhaust', 'Alcantara interior', 'Lifting system', 'Rear camera'],
      image: { src: IMG + 'car-huracan.jpg', alt: 'Orange Lamborghini Huracán Spyder with the roof down' },
      featured: false
    },
    {
      id: 'range-rover-sv',
      brand: 'Range Rover',
      model: 'Sport SV',
      short: 'Sport SV',
      year: 2025,
      condition: 'new',
      body: 'SUV',
      price: 2.85,
      km: 60,
      fuel: 'Petrol',
      transmission: '8-speed automatic',
      drivetrain: 'AWD',
      engine: '4.4 L V8 mild hybrid',
      power: 635,
      torque: 750,
      accel: 3.8,
      topSpeed: 290,
      seats: 5,
      owners: 0,
      colour: 'Santorini Black',
      boot: 647,
      warranty: '3 years, 1,00,000 km',
      badge: 'Featured',
      tagline: 'The fastest Range Rover, and the quietest.',
      description:
        'A 2.6-tonne SUV that will hold 290 km/h and still take four adults to Coorg in silence. Carbon-fibre wheels, SV mode and the body-and-ride system.',
      features: ['Carbon-fibre wheels', 'SV mode', 'Meridian Signature', 'Executive rear seats', 'Terrain Response 2', 'Air suspension'],
      image: { src: IMG + 'car-rr-sport.jpg', alt: 'Black Range Rover Sport SV in a night studio' },
      featured: false
    },
    {
      id: 'bentayga',
      brand: 'Bentley',
      model: 'Bentayga V8',
      short: 'Bentayga V8',
      year: 2023,
      condition: 'pre-owned',
      body: 'SUV',
      price: 4.65,
      km: 12600,
      fuel: 'Petrol',
      transmission: '8-speed automatic',
      drivetrain: 'AWD',
      engine: '4.0 L V8 twin-turbo',
      power: 550,
      torque: 770,
      accel: 4.5,
      topSpeed: 290,
      seats: 5,
      owners: 1,
      colour: 'British Racing Green',
      boot: 484,
      warranty: '12 months Elite Certified',
      badge: 'Hand-finished',
      tagline: 'A private members\' club with wheels.',
      description:
        'Mulliner driving specification, contrast stitching and the rotating display. The veneers are unmarked, which on a Bentayga of this age is unusual.',
      features: ['Mulliner driving spec', 'Rotating display', 'Naim for Bentley', 'Contrast stitching', 'Ventilated seats', 'Night vision'],
      image: { src: IMG + 'car-bentayga.jpg', alt: 'Green Bentley Bentayga SUV lit in a studio' },
      featured: false
    },
    {
      id: 'aston-vantage',
      brand: 'Aston Martin',
      model: 'Vantage',
      short: 'Vantage',
      year: 2025,
      condition: 'new',
      body: 'Coupe',
      price: 3.95,
      km: 140,
      fuel: 'Petrol',
      transmission: '8-speed automatic',
      drivetrain: 'RWD',
      engine: '4.0 L V8 twin-turbo',
      power: 665,
      torque: 800,
      accel: 3.5,
      topSpeed: 325,
      seats: 2,
      owners: 0,
      colour: 'Podium Green',
      boot: 235,
      warranty: '3 years, unlimited km',
      badge: 'New arrival',
      tagline: 'The best-looking car in this showroom.',
      description:
        'New-generation Vantage, unregistered and in the launch colour. Carbon-ceramic brakes, sports exhaust and the Bowers & Wilkins audio upgrade.',
      features: ['Carbon-ceramic brakes', 'Sports exhaust', 'B&W audio', 'Carbon interior pack', 'Adaptive dampers', 'Launch control'],
      image: { src: IMG + 'car-vantage.jpg', alt: 'Green Aston Martin Vantage coupé in a dark studio' },
      featured: false
    },
    {
      id: 'continental-gt',
      brand: 'Bentley',
      model: 'Continental GT Speed',
      short: 'Continental GT',
      year: 2022,
      condition: 'pre-owned',
      body: 'Coupe',
      price: 5.45,
      km: 7400,
      fuel: 'Petrol',
      transmission: '8-speed dual-clutch',
      drivetrain: 'AWD',
      engine: '6.0 L W12 twin-turbo',
      power: 650,
      torque: 900,
      accel: 3.6,
      topSpeed: 335,
      seats: 4,
      owners: 1,
      colour: 'Silver Tempest',
      boot: 358,
      warranty: '12 months Elite Certified',
      badge: 'Last of the W12',
      tagline: 'The final W12 grand tourer — and the best one.',
      description:
        'Bentley has stopped building the W12, which makes this the last of a line: 650 hp, 900 Nm and a cabin that will do 335 km/h in silence. Two owners on paper, one on the V5, and a complete Crewe service file.',
      features: ['W12 Speed engine', 'Naim for Bentley', 'Rotating display', 'Carbon body kit', 'All-wheel steering', 'Diamond-quilted leather'],
      image: { src: IMG + 'car-continental.jpg', alt: 'Silver Bentley Continental GT Speed coupé in a dark studio' },
      featured: false
    }
  ];

  /* Every gallery starts with the hero photograph of the car itself. */
  cars.forEach(function (car) {
    car.gallery = [
      { src: car.image.src, alt: car.image.alt, caption: car.brand + ' ' + car.model + ' — showroom photography' }
    ].concat(detailImages);
  });

  const articles = [
    {
      tag: 'Buying guide',
      read: '8 min read',
      date: '12 November 2026',
      title: 'Why the cheapest example is rarely the cheapest car',
      image: { src: IMG + 'journal-1.jpg', alt: 'A performance coupé on a dark showroom floor' },
      body: [
        'Three cars, identical on paper, forty lakh apart. We buy at auction every month, and the pattern has not changed in a decade: the cheapest example is almost always the one that has been deferred-maintenance-driven and then valeted.',
        'The maths is boring, which is exactly why it works. A supercar brake refresh is ₹3–4 lakh. A clutch on a dual-clutch car can be ₹9 lakh. Tyres, mounts, fluids and a full geometry set are another ₹2 lakh before you have touched anything cosmetic. Add the first-year depreciation on a car with a gap in its service history and the "cheap" car is rarely cheap.'
      ],
      list: [
        'Ask for the invoice file, not the service stamp. A stamp tells you somebody opened the book.',
        'Check tyre date codes against the odometer. Four tyres from 2019 on a car showing 8,000 km tells a story.',
        'Have the paint measured on every panel. A single panel reading 180 microns means filler, not "a small smart repair".',
        'Insist on a cold start. Most noise complaints only appear before the oil is warm.'
      ],
      closing: 'The car we would actually buy is rarely the one we are asked to inspect. If you are comparing two listings, send both to the desk — we will tell you which to walk away from, and why.'
    },
    {
      tag: 'Workshop',
      read: '6 min read',
      date: '28 October 2026',
      title: 'Carbon-ceramics: the ₹9 lakh question',
      image: { src: IMG + 'journal-2.jpg', alt: 'Carbon-ceramic brake disc and caliper detail' },
      body: [
        'Carbon-ceramic brakes are the option buyers ask about most and understand least. They are not a consumable in the normal sense — a disc can last 100,000 km on the road — but they are also not immortal, and the failure mode is expensive.',
        'We measure every disc we take in: thickness at three points, plus a visual for edge chipping, glazing and the tell-tale ring of a pad that was run to the backing plate. A car that has done track days will show it here long before it shows anywhere else.'
      ],
      list: [
        'Light, faint scoring is normal. Deep grooves are not.',
        'A chipped edge can propagate. We reject any disc with a chip wider than 2 mm.',
        'Pad replacement is reasonable; disc replacement is ₹8–12 lakh depending on the car.',
        'If the car was stored for years without use, inspect the disc face for pitting before anything else.'
      ],
      closing: 'Our rule: if the discs are beyond specification, the cost comes off the offer — not into the asking price with a shrug. Ask for the measurements. Any serious seller will have them.'
    },
    {
      tag: 'Collecting',
      read: '11 min read',
      date: '9 October 2026',
      title: 'Five cars that will still matter in 2035',
      image: { src: IMG + 'journal-3.jpg', alt: 'A steering wheel and cockpit in low light' },
      body: [
        'Collecting advice ages badly, so treat this as a set of principles rather than predictions. The cars that hold value share three traits: a specification that cannot be repeated, a production number that is genuinely small, and a driving experience that legislation will make impossible.',
        'Naturally aspirated engines are disappearing. Manual gearboxes are already gone from most of the cars on our floor. Combine the two with a fixed roof and a documented history, and you have the formula that has worked for thirty years.'
      ],
      list: [
        'The last of a line beats the first of one. Send-off editions hold better.',
        'Colour matters more than options. A rare colour on a common car beats a common colour on a rare one.',
        'Documentation is a modification. A complete file adds value the way a factory option does.',
        'Drive it. A car with 2,000 km and a dead battery is worth less than one with 30,000 km and a full history.'
      ],
      closing: 'None of this is financial advice, and we would rather you bought the car you will actually drive. The best-performing collector car is, almost always, the one that stays in the family.'
    }
  ];

  function formatPrice(crore) {
    return '₹' + crore.toFixed(2) + ' Cr';
  }

  function formatKm(km) {
    return km.toLocaleString('en-IN') + ' km';
  }

  function formatEmi(crore) {
    /* Indicative EMI: 80% loan, 8.5% p.a., 60 months. */
    const principal = crore * 10000000 * 0.8;
    const monthly = 0.085 / 12;
    const emi = principal * monthly / (1 - Math.pow(1 + monthly, -60));
    return '₹' + Math.round(emi / 100000) / 10 + ' L / month';
  }

  function byId(id) {
    for (let i = 0; i < cars.length; i++) {
      if (cars[i].id === id) return cars[i];
    }
    return null;
  }

  window.EM = {
    cars: cars,
    articles: articles,
    byId: byId,
    money: formatPrice,
    km: formatKm,
    emi: formatEmi
  };
})();
