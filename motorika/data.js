window.SHOP = {
  key: 'motorika',
  name: 'МОТОРИКА',
  logo: '<span class="logo-mark">M</span>МОТОРИКА',
  topbar: '<span>Ежедневно 9:00–21:00</span><span class="hide-sm">Екатеринбург, ул. Металлургов, 87</span><span>Trade-in · Кредит от 4,9%</span>',
  footerAbout: 'Дилерский центр премиальных автомобилей с пробегом и новых машин под заказ. Работаем с 2011 года, продали более 6 400 автомобилей.',
  nav: [['index.html', 'Главная'], ['catalog.html', 'Автомобили'], ['news.html', 'Акции и новости'], ['contacts.html', 'Контакты']],
  contacts: {
    address: 'Екатеринбург, ул. Металлургов, 87',
    phone: '+7 (343) 000-77-17', phoneRaw: '+73430007717',
    email: 'sales@motorika-auto.ru',
    hoursShort: 'Ежедневно 9:00–21:00'
  },
  labels: {
    cart: 'Бронирование', addBtn: 'Забронировать', addedToCart: 'Автомобиль добавлен в бронь', alreadyInCart: 'Этот автомобиль уже в брони',
    cartEmpty: 'Вы пока ничего не забронировали.', checkout: 'Оформить бронь', checkoutNote: 'Предоплата возвращается, если вы откажетесь после осмотра.',
    depositLabel: 'Предоплата за бронь', deliveryLabel: 'Как забрать', orderNewStatus: 'Бронь активна', orderDone: 'Бронь оформлена',
    orderDoneText: 'Автомобиль закреплён за вами на 5 дней. Менеджер позвонит, чтобы согласовать время осмотра.',
    searchPh: 'Марка или модель', saleFilter: 'Только со скидкой', unitForms: ['автомобиль', 'автомобиля', 'автомобилей'],
    related: 'Похожие автомобили', ordersTab: 'Мои брони', requestsTab: 'Тест-драйвы и заявки', noOrders: 'Активных броней нет.',
    noRequests: 'Вы ещё не записывались на тест-драйв.', requestTarget: 'автомобиль', bonusTab: 'Клуб владельцев',
    bonusUnit: 'баллов', profileExtra: 'Ваш автомобиль сейчас (для trade-in)'
  },
  allowQty: false,
  deposit: 50000,
  brandFilter: true,
  priceStep: 500000,
  credit: { rate: 4.9 },
  bonusRate: 0.005,
  welcomeBonus: 5000,
  cardPrefix: 'MT-',
  extraAction: { label: 'Записаться на тест-драйв', title: 'Тест-драйв', dateField: true },
  deliveryOptions: ['Осмотр и выдача в салоне', 'Доставка автовозом по Уралу (от 15 000 ₽)', 'Доставка в другой регион (по расчёту)'],
  reviewSources: 'Яндекс Карты, 2ГИС, Авито',
  productPerks: ['Проверка по 120 пунктам и отчёт по VIN', 'Гарантия юридической чистоты', 'Гарантия на двигатель и КПП 1 год', 'Trade-in вашего автомобиля за 40 минут'],
  accountPerks: ['Онлайн-бронь автомобиля за 50 000 ₽ с возвратом', 'История тест-драйвов и заявок', 'Баллы клуба владельцев на сервис и аксессуары', 'Персональные предложения по trade-in'],
  levels: [
    { name: 'Silver', from: 0, perk: 'кэшбэк 0,5% баллами' },
    { name: 'Gold', from: 5000000, perk: 'бесплатная мойка и шиномонтаж' },
    { name: 'Black', from: 15000000, perk: 'подменный автомобиль и выездной менеджер' }
  ],
  demoUser: { name: 'Алексей Воронцов', email: 'demo@motorika-auto.ru', phone: '+7 900 000-00-00', extra: 'Toyota Camry 2018', spent: 6200000, bonus: 31000 },
  demoOrders: [
    { no: '204517', date: '12.09.2026', items: [{ id: 'bmw-530d', qty: 1, size: null }], total: 50000, status: 'Выдан', delivery: 'Осмотр и выдача в салоне' }
  ],
  cardMeta: p => `${p.year} · ${p.mileage ? p.mileage.toLocaleString('ru-RU') + ' км' : 'новый'} · ${p.power} л.с.`,
  cartMeta: p => `${p.year} · ${p.engine}`,
  specs: p => [['Год', p.year], ['Пробег', p.mileage ? p.mileage.toLocaleString('ru-RU') + ' км' : 'Новый'], ['Двигатель', p.engine], ['Мощность', p.power + ' л.с.'], ['Коробка', p.gearbox], ['Привод', p.drive], ['Кузов', p.cat], ['Цвет', p.color], ['Владельцев', p.owners ?? '—'], ['VIN', p.vin]],
  reviews: [
    { name: 'Дмитрий К.', rating: 5, date: 'октябрь 2026', about: 'BMW 530d', text: 'Брал 530d с пробегом. Перед сделкой дали посмотреть машину на подъёмнике и показали отчёт по VIN — всё сошлось. Оформили за пару часов.' },
    { name: 'Ирина С.', rating: 5, date: 'сентябрь 2026', about: 'trade-in', text: 'Сдала свою Kia в trade-in, оценка оказалась честной — примерно как на Авито, только без нервов. Менеджер Артём очень спокойно всё объяснил.' },
    { name: 'Руслан М.', rating: 4, date: 'август 2026', about: 'Jeep Wrangler', text: 'Машина отличная, всё как в описании. Минус звезда за то, что выдачу перенесли на день — ждали документы из ГИБДД.' },
    { name: 'Олег Т.', rating: 5, date: 'июль 2026', about: 'Porsche 911', text: 'Привезли 911 под заказ из Дубая за пять недель, держали в курсе на каждом этапе. Сервис уровня официального дилера.' },
    { name: 'Наталья В.', rating: 5, date: 'июнь 2026', about: 'кредит', text: 'Одобрили кредит в двух банках за час, выбрали ставку ниже, чем мне предлагал мой банк. Кофе в салоне тоже хороший.' }
  ],
  news: [
    { id: 'tradein', type: 'Акция', date: '20 октября 2026', until: '30 ноября', img: 'img/news-bmw.webp', title: 'Trade-in +250 000 ₽ к оценке вашего автомобиля', lead: 'Сдайте свою машину в зачёт и получите дополнительную выгоду при покупке любого авто из наличия.', body: ['До 30 ноября мы добавляем 250 000 ₽ к рыночной оценке вашего автомобиля при обмене на любой автомобиль из наличия дороже 5 млн ₽.', 'Оценка занимает около 40 минут, деньги учитываются сразу в сделке. Принимаем автомобили не старше 2012 года, в том числе кредитные.'] },
    { id: 'winter', type: 'Акция', date: '15 октября 2026', until: '15 декабря', img: 'img/news-winter.webp', title: 'Зимний комплект шин в подарок', lead: 'При покупке внедорожника — оригинальные зимние колёса и шиномонтаж бесплатно.', body: ['При покупке любого внедорожника из наличия устанавливаем комплект зимних колёс на дисках бесплатно.', 'Размер подбираем по рекомендациям производителя, хранение летнего комплекта — первый сезон за наш счёт.'] },
    { id: 'credit', type: 'Акция', date: '1 октября 2026', until: '31 декабря', img: 'img/showroom2.webp', title: 'Кредит от 4,9% на автомобили с пробегом', lead: 'Совместная программа с банками-партнёрами: первый взнос от 20%, срок до 7 лет.', body: ['Ставка от 4,9% действует при первом взносе от 20% и оформлении КАСКО у партнёров.', 'Решение — за 30 минут, заявка отправляется сразу в несколько банков. Посчитать платёж можно на странице любого автомобиля.'] },
    { id: 'ev', type: 'Новость', date: '8 октября 2026', img: 'img/news-charge.webp', title: 'Открыли зарядную станцию 150 кВт на парковке салона', lead: 'Владельцы электромобилей могут заряжаться у нас бесплатно, пока смотрят машины или ждут сервис.', body: ['На парковке шоурума заработала быстрая зарядная станция мощностью 150 кВт с разъёмами CCS2 и GB/T.', 'Для клиентов салона зарядка бесплатная, для остальных — по тарифу оператора. Средний электромобиль заряжается с 10 до 80% примерно за 30 минут.'] },
    { id: 'porsche-day', type: 'Событие', date: '2 октября 2026', img: 'img/news-lights.webp', title: 'Porsche Weekend: тест-драйвы на закрытой площадке', lead: '8–9 ноября проведём заезды на автодроме «Уральское кольцо». Количество мест ограничено.', body: ['Приглашаем на два дня тест-драйвов Porsche 911, Panamera и Cayman на закрытой трассе с инструктором.', 'Участие бесплатное для владельцев карты клуба уровня Gold и выше, для остальных — по предварительной записи в салоне.'] },
    { id: 'showroom', type: 'Новость', date: '18 сентября 2026', img: 'img/showroom.webp', title: 'Шоурум расширился до 60 автомобилей', lead: 'Достроили второй зал — теперь все машины из наличия стоят в тепле и их можно посмотреть в любую погоду.', body: ['Второй зал площадью 1 800 м² вмещает ещё 35 автомобилей. Добавили зону выдачи и лаунж для клиентов с детской комнатой.'] }
  ],
  products: [
    { id: 'panamera-4s', featured: true, brand: 'Porsche', title: 'Porsche Panamera 4S', cat: 'Седан', year: 2023, mileage: 18400, engine: '2.9 V6 бензин, битурбо', power: 440, gearbox: 'Робот PDK', drive: 'Полный', color: 'Чёрный металлик', owners: 1, vin: 'WP0ZZZ97ZPL•••••', price: 14900000, badge: 'Хит', img: 'img/panamera.webp', desc: 'Один владелец, обслуживание у официального дилера, полная история. Пакет Sport Chrono, пневмоподвеска, акустика Bose, панорамная крыша.' },
    { id: 'porsche-911', featured: true, brand: 'Porsche', title: 'Porsche 911 Carrera S', cat: 'Спорткар', year: 2024, mileage: 3200, engine: '3.0 бензин, битурбо', power: 450, gearbox: 'Робот PDK', drive: 'Задний', color: 'Чёрный', owners: 1, vin: 'WP0ZZZ99ZRS•••••', price: 19800000, badge: 'Новое поступление', img: 'img/porsche911.webp', desc: 'Практически новый автомобиль, привезён под заказ. Спортивный выхлоп, подруливающая задняя ось, керамические тормоза PCCB.' },
    { id: 'cayman-gts', brand: 'Porsche', title: 'Porsche 718 Cayman GTS 4.0', cat: 'Спорткар', year: 2023, mileage: 9800, engine: '4.0 оппозитный бензин', power: 400, gearbox: 'Робот PDK', drive: 'Задний', color: 'Тёмно-синий', owners: 1, vin: 'WP0ZZZ98ZPK•••••', price: 12300000, oldPrice: 12900000, img: 'img/taycan.webp', desc: 'Атмосферная «шестёрка» 4.0 и идеальная развесовка. Ковшеобразные сиденья, пакет Sport Chrono, сервисная история.' },
    { id: 'ferrari-roma', featured: true, brand: 'Ferrari', title: 'Ferrari Roma', cat: 'Спорткар', year: 2022, mileage: 7600, engine: '3.9 V8 бензин, битурбо', power: 620, gearbox: 'Робот 8 ст.', drive: 'Задний', color: 'Nero Daytona', owners: 1, vin: 'ZFF98RNA0N0•••••', price: 27500000, img: 'img/ferrari.webp', desc: 'Элегантное купе GT. Карбоновый пакет, пассажирский дисплей, подъём передней оси. Хранился в тёплом паркинге.' },
    { id: 'rolls-ghost', brand: 'Rolls-Royce', title: 'Rolls-Royce Ghost', cat: 'Седан', year: 2021, mileage: 21000, engine: '6.75 V12 бензин', power: 571, gearbox: 'Автомат 8 ст.', drive: 'Полный', color: 'Чёрный бриллиант', owners: 2, vin: 'SCA664S03MU•••••', price: 38900000, img: 'img/rolls.webp', desc: 'Звёздное небо Starlight, задние сиденья с массажем, холодильник. Безупречное состояние, без ДТП.' },
    { id: 'bmw-530d', featured: true, brand: 'BMW', title: 'BMW 530d xDrive M Sport', cat: 'Седан', year: 2022, mileage: 41000, engine: '3.0 дизель', power: 286, gearbox: 'Автомат 8 ст.', drive: 'Полный', color: 'Чёрный сапфир', owners: 1, vin: 'WBAJS710X0C•••••', price: 6900000, oldPrice: 7350000, badge: 'Скидка', img: 'img/bmw5.webp', desc: 'M-пакет, адаптивные фары, проекция на лобовое стекло, вентиляция сидений. Расход в смешанном цикле около 7 литров.' },
    { id: 'bmw-m3', brand: 'BMW', title: 'BMW M3 Competition', cat: 'Седан', year: 2021, mileage: 29500, engine: '3.0 бензин, битурбо', power: 510, gearbox: 'Автомат 8 ст.', drive: 'Задний', color: 'Brooklyn Grey', owners: 2, vin: 'WBS43AY0X0F•••••', price: 8300000, img: 'img/bmw-gray.webp', desc: 'Карбоновые ковши, M Drive Professional, лазерные фары. Сток, без чип-тюнинга, подтверждено диагностикой.' },
    { id: 'amg-c63', brand: 'Mercedes-Benz', title: 'Mercedes-AMG C 63 S Coupé', cat: 'Купе', year: 2020, mileage: 38200, engine: '4.0 V8 бензин, битурбо', power: 510, gearbox: 'Автомат 9 ст.', drive: 'Задний', color: 'Обсидиановый чёрный', owners: 2, vin: 'WDD2053871F•••••', price: 7400000, img: 'img/merc-coupe.webp', desc: 'Последнее поколение с V8. Выхлоп AMG Performance, панорама, Burmester. Свежее ТО и новые тормоза.' },
    { id: 'gle-450', featured: true, brand: 'Mercedes-Benz', title: 'Mercedes-Benz GLE 450 4MATIC', cat: 'Внедорожник', year: 2023, mileage: 24800, engine: '3.0 бензин + мягкий гибрид', power: 367, gearbox: 'Автомат 9 ст.', drive: 'Полный', color: 'Селенитовый серый', owners: 1, vin: 'W1N1671591A•••••', price: 11200000, img: 'img/gclass.webp', desc: 'Пакет AMG Line, пневмоподвеска Airmatic, 7 мест, камеры 360°. Гарантия производителя ещё год.' },
    { id: 'wrangler', brand: 'Jeep', title: 'Jeep Wrangler Rubicon', cat: 'Внедорожник', year: 2022, mileage: 33000, engine: '2.0 бензин, турбо', power: 272, gearbox: 'Автомат 8 ст.', drive: 'Полный, понижающая', color: 'Чёрный', owners: 1, vin: '1C4HJXFN2NW•••••', price: 6450000, img: 'img/wrangler.webp', desc: 'Блокировки обоих мостов, отключаемый стабилизатор, съёмная крыша. Ни разу не был в серьёзном офф-роуде — проверено на подъёмнике.' },
    { id: 'explorer', brand: 'Ford', title: 'Ford Explorer Limited', cat: 'Внедорожник', year: 2021, mileage: 52000, engine: '2.3 бензин, турбо', power: 300, gearbox: 'Автомат 10 ст.', drive: 'Полный', color: 'Белый перламутр', owners: 1, vin: '1FMSK8FH4MG•••••', price: 4650000, oldPrice: 4900000, badge: 'Скидка', img: 'img/explorer.webp', desc: 'Семейный трёхрядный кроссовер. Кожаный салон, обогрев всех сидений, электропривод багажника. Сервисная книжка.' },
    { id: 'silverado', brand: 'Chevrolet', title: 'Chevrolet Silverado 1500 High Country', cat: 'Пикап', year: 2022, mileage: 27400, engine: '6.2 V8 бензин', power: 426, gearbox: 'Автомат 10 ст.', drive: 'Полный', color: 'Чёрный', owners: 1, vin: '3GCUYHEL5NG•••••', price: 7900000, img: 'img/pickup.webp', desc: 'Топовая комплектация, мультифункциональный задний борт, проекция, вентиляция сидений. Буксировка до 4 тонн.' },
    { id: 'zeekr-001', brand: 'Zeekr', title: 'Zeekr 001 YOU', cat: 'Электро', year: 2024, mileage: 0, engine: 'Электро, 100 кВт·ч', power: 544, gearbox: 'Редуктор', drive: 'Полный', color: 'Белый', owners: 0, vin: 'L6T79X2E4RN•••••', price: 5600000, badge: 'Новый', img: 'img/ev.webp', desc: 'Запас хода до 650 км по CLTC. Пневмоподвеска, русифицированная мультимедиа, зарядное устройство в комплекте.' }
  ],
  onHome({ $, fmt, monthly }) {
    const f = $('#quick-calc'); if (!f) return;
    const upd = () => {
      const price = +f.price.value, down = Math.min(+f.down.value, price);
      $('#qc-price').textContent = fmt(price);
      $('#qc-down').textContent = fmt(down);
      $('#qc-pay').textContent = fmt(monthly(price - down, this.credit.rate, 60));
    };
    f.oninput = upd; upd();
  }
};
