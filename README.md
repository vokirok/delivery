# Delivery

## Development requirements:

### Скачать и установить Visual Studio Code

https://code.visualstudio.com/

### Скачать и установить Node.js

https://nodejs.org/

### Установить Firebase tools

После установки Node.js выполнить команду в терминале:

```sh
npm install -g firebase-tools
```

Возможно потребуются права администратора.

### Склонировать проект

Склонировать репозиторий в нужную папку.

### Установить используемые в проекте пакеты

После установки Node.js выполнить команду в терминале внутри папки проекта:

```sh
npm install
```

### Разрабатывать

1. Открыть Visual Studio Code.

2. Открыть папку с проектом.

3. Запустить Firerbase Emulator:

```sh
firebase emulators:start
```

4. Запустить локальный отладочный сервер:

```sh
npm run dev
```

---

## Soft + Packages

### Visual Studio Code

https://code.visualstudio.com/

### Node.js

https://nodejs.org/

Рантайм для разработки веб приложений.
Кратко — JavaScript движок, исполняемый в операционной системе.
Он в том числе устанавливает `npm` — менеджер JavaScript пакетов.

### Vue

https://vuejs.org/

Фреймворк для создания веб приложений.

### Vite

https://vitejs.dev/

Инструмент для разработки и сборки веб приложений.

Следующая команда создаёт проект Vue для разработки в `node.js`:

```sh
npm create vite@latest delivery -- --template vue
```

Дальше нужно войти в эту папку:

```sh
cd delivery
```

### PrimeVue

https://primevue.org/

UI kit для приложений на Vue.
Там 3 пакета:

- `primevue` — UI компоненты. Например [`DataView`](https://primevue.org/dataview/)
- `primeicons` — иконки https://primevue.org/icons/
- `primeflex` — CSS утилиты https://primeflex.org

Вот так добавляются сразу 3 пакета в проект:

```
npm i primevue primeicons primeflex
```

### Vue Router

https://router.vuejs.org/

Библиотека для создания роутинга в Vue приложениях.
Чтобы можно было в Vue веб приложении описать поведение на разные URL'ы, что https://delivery/login — это форма логина, https://delivery/cart — это корзина и пр.

Вот так добавляется пакет библиотеки в проект:

```sh
npm i vue-router
```

### VueFire + Firebase

https://vuefire.vuejs.org/guide/getting-started.html

Библиотека для удобной работы с Google Firebase.

Вот так добавляется пакет библиотеки в проект:

```sh
npm i vuefire firebase
```

## Firebase

Сначала нужно войти в консоль [Google Firebase](https://firebase.google.com/) создать там проект (`Add Project`), настроить модули `Authentication` и `Firestore Database`.

Потом в `Project settings` создать `Web app` и скопировать оттуда настройки `firebaseConfig`, положить, например в `main.js`:

```js
const firebaseConfig = {
  apiKey: 'AIzaSyBVcOGf_kWfvni5NtyPWsUJh1fiyGVUY0A',
  authDomain: 'delivery-mall.firebaseapp.com',
  projectId: 'delivery-mall',
  storageBucket: 'delivery-mall.appspot.com',
  messagingSenderId: '705423343764',
  appId: '1:705423343764:web:19b43839bea1147869f481',
  measurementId: 'G-S18WGX11TD',
};
```

Дальше уже можно разрабатывать локально.

Для удобной работы с Firebase стоит поставить локальный эмулятор, чтобы запускать его на своём компьютере и не зависеть от соединения и лимитов Firebase:

Прочитать можно тут:

- [Install, configure and integrate Local Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)
- [Connect your app and start prototyping](https://firebase.google.com/docs/emulator-suite/connect_and_prototype)

Поставить `firebase-tools` как глобальный (флаг `-g`) пакет:

```sh
npm install -g firebase-tools
```

Потом в папке проекта выполнить инициализацию:

```sh
firebase init
```

Для этого проекта выбрать только:

- auth
- firestore

Больше тут ничего не нужно.

Сгенерированные для проекта настройки лежат в файлах:

- `.firebaserc` — тут только название проекта;
- `firebase.json` — тут настройки эмулятора: порты и ссылки на правила;
- `firestore.rules` — тут правила 'Firestore Security Rules', читать подробнее [тут](https://firebase.google.com/docs/firestore/security/get-started).

Потом можно запустить локальный эмулятор:

```sh
firebase emulators:start
```

Команда должна вывести в конце примерно такую информацию:

```sh
┌─────────────────────────────────────────────────────────────┐
│ V  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://127.0.0.1:4000/               │
└─────────────────────────────────────────────────────────────┘

┌────────────────┬────────────────┬─────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI             │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Authentication │ 127.0.0.1:9099 │ http://127.0.0.1:4000/auth      │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Firestore      │ 127.0.0.1:8080 │ http://127.0.0.1:4000/firestore │
└────────────────┴────────────────┴─────────────────────────────────┘
  Emulator Hub running at 127.0.0.1:4400
  Other reserved ports: 4500, 9150
```

Если потом в браузере открыть http://127.0.0.1:4000/auth, то можно попасть в _локальную_ консоль Google Firebase.

В файле `main.js` есть следующие строчки, чтобы в дебаге использовалась локальная Google Firebase:

```js
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  connectAuthEmulator(firebaseAuth, 'http://127.0.0.1:9099');
  connectFirestoreEmulator(firebaseDb, '127.0.0.1', 8080);
}
```


