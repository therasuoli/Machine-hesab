/* =========================================
   PROFESSIONAL CALCULATOR
   APP.JS - VERSION 2026
   Developer: Hadi Rasouli
========================================= */

"use strict";

/* =========================================
   HELPERS & STORAGE
========================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const STORAGE = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Storage error:", error);
    }
  }
};

const state = {
  expression: "",
  result: "0",
  history: STORAGE.get("pc_history", []),
  favorites: STORAGE.get("pc_favorites", []),
  alarms: STORAGE.get("pc_alarms", []),
  language: STORAGE.get("pc_language", "fa"),
  theme: STORAGE.get("pc_theme", "system"),
  scientific: false,
  currentPage: "calculator",
  onboardingStep: 0,
  installPrompt: null
};

/* =========================================
   TRANSLATIONS
========================================= */

const translations = {
  fa: {
    appSubtitle: "ماشین حساب حرفه‌ای",
    calculator: "ماشین حساب",
    tools: "ابزارها",
    history: "تاریخچه",
    favorites: "علاقه‌مندی‌ها",
    calculatorTitle: "ماشین حساب",
    calculatorDescription: "محاسبات سریع و دقیق",
    install: "نصب اپلیکیشن",
    installed: "اپلیکیشن نصب شده است",
    notificationEnabled: "اعلان‌ها فعال شدند",
    notificationDenied: "اجازه اعلان داده نشد",
    copied: "نتیجه کپی شد",
    saved: "ذخیره شد",
    deleted: "حذف شد",
    emptyHistory: "هنوز محاسبه‌ای ثبت نشده است.",
    emptyFavorites: "هنوز موردی ذخیره نشده است.",
    invalid: "عبارت ریاضی نامعتبر است",
    onboardingTitle: [
      "به Professional Calculator خوش آمدید",
      "محاسبات سریع و آسان",
      "ابزارهای کاربردی",
      "شخصی‌سازی برنامه"
    ],
    onboardingDescription: [
      "با ماشین حساب حرفه‌ای، محاسبات روزمره خود را ساده کنید.",
      "از محاسبات پایه و علمی برای حل مسائل استفاده کنید.",
      "از ابزارهای درصد، تخفیف، اقساط و تبدیل واحد بهره ببرید.",
      "زبان، ظاهر و تنظیمات اپلیکیشن را مطابق نیاز خود تغییر دهید."
    ]
  },

  en: {
    appSubtitle: "Professional Calculator",
    calculator: "Calculator",
    tools: "Tools",
    history: "History",
    favorites: "Favorites",
    calculatorTitle: "Calculator",
    calculatorDescription: "Fast and accurate calculations",
    install: "Install App",
    installed: "App already installed",
    notificationEnabled: "Notifications enabled",
    notificationDenied: "Notification permission denied",
    copied: "Result copied",
    saved: "Saved",
    deleted: "Deleted",
    emptyHistory: "No calculations yet.",
    emptyFavorites: "No favorites yet.",
    invalid: "Invalid mathematical expression",
    onboardingTitle: [
      "Welcome to Professional Calculator",
      "Fast and easy calculations",
      "Useful tools",
      "Customize your app"
    ],
    onboardingDescription: [
      "Make your daily calculations easier.",
      "Use basic and scientific calculations.",
      "Explore percentage, discount, loan and unit tools.",
      "Customize language, theme and settings."
    ]
  },

  tr: {
    appSubtitle: "Profesyonel Hesap Makinesi",
    calculator: "Hesap Makinesi",
    tools: "Araçlar",
    history: "Geçmiş",
    favorites: "Favoriler",
    calculatorTitle: "Hesap Makinesi",
    calculatorDescription: "Hızlı ve doğru hesaplamalar",
    install: "Uygulamayı yükle",
    installed: "Uygulama yüklendi",
    notificationEnabled: "Bildirimler etkinleştirildi",
    notificationDenied: "Bildirim izni reddedildi",
    copied: "Sonuç kopyalandı",
    saved: "Kaydedildi",
    deleted: "Silindi",
    emptyHistory: "Henüz hesaplama yok.",
    emptyFavorites: "Henüz favori yok.",
    invalid: "Geçersiz matematiksel ifade",
    onboardingTitle: [
      "Professional Calculator'a hoş geldiniz",
      "Hızlı ve kolay hesaplama",
      "Kullanışlı araçlar",
      "Uygulamanızı özelleştirin"
    ],
    onboardingDescription: [
      "Günlük hesaplamalarınızı kolaylaştırın.",
      "Temel ve bilimsel hesaplamaları kullanın.",
      "Yüzde, indirim, kredi ve birim araçlarını keşfedin.",
      "Dil, tema ve ayarları özelleştirin."
    ]
  },

  ar: {
    appSubtitle: "آلة حاسبة احترافية",
    calculator: "الحاسبة",
    tools: "الأدوات",
    history: "السجل",
    favorites: "المفضلة",
    calculatorTitle: "الحاسبة",
    calculatorDescription: "حسابات سريعة ودقيقة",
    install: "تثبيت التطبيق",
    installed: "تم تثبيت التطبيق",
    notificationEnabled: "تم تفعيل الإشعارات",
    notificationDenied: "تم رفض إذن الإشعارات",
    copied: "تم نسخ النتيجة",
    saved: "تم الحفظ",
    deleted: "تم الحذف",
    emptyHistory: "لا توجد حسابات حتى الآن.",
    emptyFavorites: "لا توجد عناصر مفضلة.",
    invalid: "تعبير رياضي غير صالح",
    onboardingTitle: [
      "مرحباً بك في Professional Calculator",
      "حسابات سريعة وسهلة",
      "أدوات مفيدة",
      "خصص التطبيق"
    ],
    onboardingDescription: [
      "اجعل حساباتك اليومية أسهل.",
      "استخدم الحسابات الأساسية والعلمية.",
      "اكتشف أدوات النسبة والخصم والقروض والوحدات.",
      "خصص اللغة والمظهر والإعدادات."
    ]
  }
};

function t(key) {
  return translations[state.language]?.[key] ??
    translations.fa[key] ??
    key;
}

/* =========================================
   TOAST
========================================= */

function toast(message) {
  const container = $("#toast-container");
  if (!container) return;

  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;

  container.appendChild(item);

  setTimeout(() => item.remove(), 2800);
}

/* =========================================
   THEME
========================================= */

function applyTheme() {
  let theme = state.theme;

  if (theme === "system") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  document.documentElement.dataset.theme = theme;

  if ($("#theme-select")) {
    $("#theme-select").value = state.theme;
  }

  if ($("#theme-toggle")) {
    $("#theme-toggle").querySelector("span").textContent =
      theme === "dark" ? "☀" : "☾";
  }
}

function setTheme(theme) {
  state.theme = theme;
  STORAGE.set("pc_theme", theme);
  applyTheme();
}

/* =========================================
   LANGUAGE
========================================= */

function setLanguage(language) {
  if (!translations[language]) return;

  state.language = language;
  STORAGE.set("pc_language", language);

  document.documentElement.lang = language;
  document.documentElement.dir =
    ["fa", "ar"].includes(language) ? "rtl" : "ltr";

  $$("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    if (translations[language][key]) {
      element.textContent = t(key);
    }
  });

  renderHistory();
  renderFavorites();
  renderOnboarding();

  if ($("#language-select")) {
    $("#language-select").value = language;
  }
}

/* =========================================
   NAVIGATION
========================================= */

function navigate(page) {
  const target = $(`#page-${page}`);
  if (!target) return;

  $$(".page").forEach(item => item.classList.remove("active"));
  target.classList.add("active");

  $$(".nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.page === page);
  });

  state.currentPage = page;

  $("#main-navigation").classList.remove("menu-open");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$(".nav-item").forEach(button => {
  button.addEventListener("click", () => navigate(button.dataset.page));
});

$$("[data-open-page]").forEach(button => {
  button.addEventListener("click", () => navigate(button.dataset.openPage));
});

$("#menu-toggle")?.addEventListener("click", () => {
  $("#main-navigation").classList.toggle("menu-open");
});

/* =========================================
   CALCULATOR ENGINE
========================================= */

function updateDisplay() {
  $("#calculation-expression").textContent =
    state.expression || "0";

  $("#calculation-result").textContent =
    state.result;
}

function appendValue(value) {
  state.expression += value;
  state.result = previewCalculation(state.expression);
  updateDisplay();
}

function clearCalculator() {
  state.expression = "";
  state.result = "0";
  updateDisplay();
}

function deleteLast() {
  state.expression = state.expression.slice(0, -1);
  state.result = previewCalculation(state.expression);
  updateDisplay();
}

function changeSign() {
  const match = state.expression.match(/(\d*\.?\d+)$/);

  if (match) {
    const value = match[0];
    const start = match.index;

    const before = state.expression.slice(0, start);
    state.expression =
      before.endsWith("-")
        ? before.slice(0, -1) + value
        : before + "-" + value;

    state.result = previewCalculation(state.expression);
    updateDisplay();
  }
}

function percentValue() {
  const match = state.expression.match(/(\d*\.?\d+)$/);

  if (!match) return;

  const value = Number(match[0]) / 100;
  state.expression =
    state.expression.slice(0, match.index) + value;

  state.result = previewCalculation(state.expression);
  updateDisplay();
}

/*
  Safe arithmetic parser:
  Does not use eval() or new Function().
*/

function tokenize(expression) {
  const source = expression.replace(/\s+/g, "");
  const tokens = [];
  let i = 0;

  while (i < source.length) {
    const char = source[i];

    if (/[0-9.]/.test(char)) {
      let number = "";
      let dots = 0;

      while (i < source.length && /[0-9.]/.test(source[i])) {
        if (source[i] === ".") dots++;
        if (dots > 1) throw new Error("Invalid number");

        number += source[i++];
      }

      tokens.push(Number(number));
      continue;
    }

    if ("+-*/^()".includes(char)) {
      tokens.push(char);
      i++;
      continue;
    }

    throw new Error("Invalid character");
  }

  return tokens;
}

function parseExpression(tokens) {
  let position = 0;

  function peek() {
    return tokens[position];
  }

  function consume() {
    return tokens[position++];
  }

  function primary() {
    const token = consume();

    if (token === "(") {
      const value = addSub();

      if (consume() !== ")") {
        throw new Error("Missing parenthesis");
      }

      return value;
    }

    if (token === "+") return unary();
    if (token === "-") return -unary();

    if (typeof token === "number" && Number.isFinite(token)) {
      return token;
    }

    throw new Error("Invalid expression");
  }

  function unary() {
    if (peek() === "+") {
      consume();
      return unary();
    }

    if (peek() === "-") {
      consume();
      return -unary();
    }

    return primary();
  }

  function power() {
    let value = unary();

    if (peek() === "^") {
      consume();
      value = Math.pow(value, power());
    }

    return value;
  }

  function multiplyDivide() {
    let value = power();

    while (peek() === "*" || peek() === "/") {
      const operator = consume();
      const next = power();

      value = operator === "*"
        ? value * next
        : value / next;
    }

    return value;
  }

  function addSub() {
    let value = multiplyDivide();

    while (peek() === "+" || peek() === "-") {
      const operator = consume();
      const next = multiplyDivide();

      value = operator === "+"
        ? value + next
        : value - next;
    }

    return value;
  }

  const result = addSub();

  if (position !== tokens.length) {
    throw new Error("Unexpected token");
  }

  return result;
}

function calculate(expression) {
  const tokens = tokenize(expression);

  if (!tokens.length) throw new Error("Empty expression");

  const result = parseExpression(tokens);

  if (!Number.isFinite(result)) {
    throw new Error("Invalid result");
  }

  return Number(result.toPrecision(12)).toString();
}

function previewCalculation(expression) {
  if (!expression) return "0";

  try {
    return calculate(expression);
  } catch {
    return " ";
  }
}

function calculateResult() {
  if (!state.expression) return;

  try {
    const result = calculate(state.expression);

    addHistory(state.expression, result);

    state.result = result;
    state.expression = result;

    updateDisplay();

  } catch {
    toast(t("invalid"));
  }
}

/* =========================================
   SCIENTIFIC CALCULATOR
========================================= */

function scientificFunction(name) {
  const match = state.expression.match(/(\d*\.?\d+)$/);

  if (name === "power") {
    appendValue("^");
    return;
  }

  if (!match && name !== "sqrt") return;

  const number = Number(match?.[0] || 0);
  let result;

  switch (name) {
    case "sin":
      result = Math.sin(number * Math.PI / 180);
      break;

    case "cos":
      result = Math.cos(number * Math.PI / 180);
      break;

    case "tan":
      result = Math.tan(number * Math.PI / 180);
      break;

    case "log":
      result = Math.log10(number);
      break;

    case "ln":
      result = Math.log(number);
      break;

    case "sqrt":
      result = Math.sqrt(number);
      break;

    case "square":
      result = number ** 2;
      break;

    default:
      return;
  }

  if (!Number.isFinite(result)) {
    toast(t("invalid"));
    return;
  }

  const formatted = Number(result.toPrecision(12)).toString();

  state.expression = formatted;
  state.result = formatted;
  updateDisplay();
}

$("#calculator-mode-toggle")?.addEventListener("click", () => {
  state.scientific = !state.scientific;

  $("#scientific-keys").classList.toggle(
    "hidden",
    !state.scientific
  );

  $("#calculator-mode-toggle").textContent =
    state.scientific ? "عادی" : "علمی";
});

/* =========================================
   CALCULATOR BUTTON EVENTS
========================================= */

$$(".key-button").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") clearCalculator();
    else if (action === "delete") deleteLast();
    else if (action === "percent") percentValue();
    else if (action === "sign") changeSign();
    else if (action === "calculate") calculateResult();
    else if (value !== undefined) appendValue(value);
  });
});

$$(".scientific-keys button").forEach(button => {
  button.addEventListener("click", () => {
    scientificFunction(button.dataset.value);
  });
});

document.addEventListener("keydown", event => {
  if (state.currentPage !== "calculator") return;

  if (/^[0-9.]$/.test(event.key)) {
    appendValue(event.key);
  } else if (["+", "-", "*", "/", "^", "(", ")"].includes(event.key)) {
    appendValue(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculateResult();
  } else if (event.key === "Backspace") {
    deleteLast();
  } else if (event.key === "Escape") {
    clearCalculator();
  }
});

/* =========================================
   HISTORY
========================================= */

function addHistory(expression, result) {
  state.history.unshift({
    id: Date.now(),
    expression,
    result,
    date: new Date().toISOString()
  });

  state.history = state.history.slice(0, 100);

  STORAGE.set("pc_history", state.history);
  renderHistory();
}

function renderHistory() {
  const container = $("#history-list");
  if (!container) return;

  container.replaceChildren();

  if (!state.history.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("emptyHistory");
    container.appendChild(empty);
    return;
  }

  state.history.forEach(item => {
    const card = document.createElement("div");
    card.className = "history-item";

    const info = document.createElement("div");

    const expression = document.createElement("div");
    expression.textContent = item.expression;

    const result = document.createElement("strong");
    result.textContent = "= " + item.result;

    const date = document.createElement("small");
    date.textContent = new Date(item.date).toLocaleString();

    info.append(expression, result, date);

    const reuse = document.createElement("button");
    reuse.className = "secondary-button";
    reuse.textContent = "استفاده مجدد";

    reuse.addEventListener("click", () => {
      state.expression = item.expression;
      state.result = item.result;
      updateDisplay();
      navigate("calculator");
    });

    card.append(info, reuse);
    container.appendChild(card);
  });
}

$("#clear-history")?.addEventListener("click", () => {
  if (!confirm("آیا از پاک کردن تاریخچه مطمئن هستید؟")) return;

  state.history = [];
  STORAGE.set("pc_history", []);
  renderHistory();
  toast(t("deleted"));
});

/* =========================================
   FAVORITES
========================================= */

function saveFavorite() {
  if (!state.expression) return;

  const item = {
    id: Date.now(),
    expression: state.expression,
    result: state.result
  };

  state.favorites.unshift(item);
  STORAGE.set("pc_favorites", state.favorites);

  renderFavorites();
  toast(t("saved"));
}

$("#save-favorite")?.addEventListener("click", saveFavorite);

function renderFavorites() {
  const container = $("#favorites-list");
  if (!container) return;

  container.replaceChildren();

  if (!state.favorites.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("emptyFavorites");
    container.appendChild(empty);
    return;
  }

  state.favorites.forEach(item => {
    const card = document.createElement("div");
    card.className = "favorite-item";

    const info = document.createElement("div");
    info.textContent = `${item.expression} = ${item.result}`;

    const remove = document.createElement("button");
    remove.className = "danger-button";
    remove.textContent = "حذف";

    remove.addEventListener("click", () => {
      state.favorites = state.favorites.filter(
        favorite => favorite.id !== item.id
      );

      STORAGE.set("pc_favorites", state.favorites);
      renderFavorites();
    });

    card.append(info, remove);
    container.appendChild(card);
  });
}

/* =========================================
   COPY RESULT
========================================= */

$("#copy-result")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(state.result);
    toast(t("copied"));
  } catch {
    toast("امکان کپی در این مرورگر وجود ندارد.");
  }
});

/* =========================================
   ONBOARDING
========================================= */

function renderOnboarding() {
  const lang = translations[state.language];
  if (!lang) return;

  const step = state.onboardingStep;

  $("#onboarding-title").textContent =
    lang.onboardingTitle[step];

  $("#onboarding-description").textContent =
    lang.onboardingDescription[step];

  $("#onboarding-step-indicator").textContent =
    `${step + 1} / 4`;

  $("#onboarding-progress-bar").style.width =
    `${(step + 1) * 25}%`;

  $("#onboarding-icon").textContent =
    ["ƒx", "＋", "▦", "⚙"][step];

  $("#onboarding-next").textContent =
    step === 3 ? "شروع استفاده" : "بعدی";
}

function openOnboarding() {
  state.onboardingStep = 0;
  renderOnboarding();
  $("#onboarding-modal").classList.remove("hidden");
}

function closeOnboarding() {
  $("#onboarding-modal").classList.add("hidden");
  STORAGE.set("pc_onboarding_done", true);
}

$("#onboarding-next")?.addEventListener("click", () => {
  if (state.onboardingStep < 3) {
    state.onboardingStep++;
    renderOnboarding();
  } else {
    closeOnboarding();
  }
});

$("#onboarding-skip")?.addEventListener("click", closeOnboarding);
$("#close-onboarding")?.addEventListener("click", closeOnboarding);

$("#replay-onboarding")?.addEventListener("click", openOnboarding);

/* =========================================
   PWA INSTALL
========================================= */

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();

  state.installPrompt = event;

  if (!STORAGE.get("pc_install_dismissed", false)) {
    $("#install-banner")?.classList.remove("hidden");
  }
});

$("#install-app")?.addEventListener("click", async () => {
  if (!state.installPrompt) {
    showIOSInstallHelp();
    return;
  }

  state.installPrompt.prompt();

  const choice = await state.installPrompt.userChoice;

  if (choice.outcome === "accepted") {
    toast("درخواست نصب پذیرفته شد.");
  }

  state.installPrompt = null;
  $("#install-banner")?.classList.add("hidden");
});

$("#dismiss-install")?.addEventListener("click", () => {
  $("#install-banner")?.classList.add("hidden");
  STORAGE.set("pc_install_dismissed", true);
});

function showIOSInstallHelp() {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (isIOS) {
    $("#ios-install-help")?.classList.remove("hidden");
  } else {
    toast("نصب مستقیم در این مرورگر در دسترس نیست.");
  }
}

window.addEventListener("appinstalled", () => {
  $("#install-banner")?.classList.add("hidden");
  toast(t("installed"));
  STORAGE.set("pc_installed", true);
});

/* =========================================
   NOTIFICATIONS
========================================= */

$("#enable-notifications")?.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    toast("این مرورگر از اعلان‌ها پشتیبانی نمی‌کند.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      toast(t("notificationEnabled"));
    } else {
      toast(t("notificationDenied"));
    }
  } catch {
    toast("خطا در فعال‌سازی اعلان‌ها.");
  }
});

function sendNotification(title, body) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "./icons/icon-192.png"
    });
  }
}

/* =========================================
   ALARMS
========================================= */

$("#open-alarm")?.addEventListener("click", () => {
  $("#alarm-panel").classList.toggle("hidden");
});

$("#save-alarm")?.addEventListener("click", async () => {
  const title = $("#alarm-title").value.trim();
  const dateValue = $("#alarm-datetime").value;

  if (!title || !dateValue) {
    toast("عنوان و زمان یادآور را وارد کنید.");
    return;
  }

  const date = new Date(dateValue);

  if (!Number.isFinite(date.getTime()) || date <= new Date()) {
    toast("زمان یادآور باید در آینده باشد.");
    return;
  }

  if (!("Notification" in window)) {
    toast("اعلان در این مرورگر پشتیبانی نمی‌شود.");
    return;
  }

  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      toast(t("notificationDenied"));
      return;
    }
  }

  const alarm = {
    id: Date.now(),
    title,
    time: date.toISOString()
  };

  state.alarms.push(alarm);
  STORAGE.set("pc_alarms", state.alarms);

  $("#alarm-title").value = "";
  $("#alarm-datetime").value = "";

  renderAlarms();
  toast("یادآور ذخیره شد.");
});

function renderAlarms() {
  const container = $("#alarm-list");
  if (!container) return;

  container.replaceChildren();

  state.alarms.forEach(alarm => {
    const item = document.createElement("div");
    item.className = "history-item";

    const info = document.createElement("div");
    info.textContent =
      `${alarm.title} - ${new Date(alarm.time).toLocaleString()}`;

    const remove = document.createElement("button");
    remove.className = "danger-button";
    remove.textContent = "حذف";

    remove.addEventListener("click", () => {
      state.alarms = state.alarms.filter(a => a.id !== alarm.id);
      STORAGE.set("pc_alarms", state.alarms);
      renderAlarms();
    });

    item.append(info, remove);
    container.appendChild(item);
  });
}

/*
  Browser timers work only while this page is running.
  They are not reliable background alarms.
*/

function checkAlarms() {
  const now = Date.now();
  let changed = false;

  state.alarms = state.alarms.filter(alarm => {
    const time = new Date(alarm.time).getTime();

    if (time <= now) {
      sendNotification("یادآور Professional Calculator", alarm.title);
      toast(alarm.title);
      changed = true;
      return false;
    }

    return true;
  });

  if (changed) {
    STORAGE.set("pc_alarms", state.alarms);
    renderAlarms();
  }
}

setInterval(checkAlarms, 10000);

/* =========================================
   SETTINGS EVENTS
========================================= */

$("#theme-select")?.addEventListener("change", event => {
  setTheme(event.target.value);
});

$("#language-select")?.addEventListener("change", event => {
  setLanguage(event.target.value);
});

$("#theme-toggle")?.addEventListener("click", () => {
  const current =
    document.documentElement.dataset.theme === "dark"
      ? "dark"
      : "light";

  setTheme(current === "dark" ? "light" : "dark");
});

/* =========================================
   TOOLS
========================================= */

const toolNames = {
  percentage: "محاسبه درصد",
  discount: "محاسبه تخفیف",
  loan: "محاسبه اقساط",
  interest: "محاسبه سود",
  unit: "تبدیل واحد",
  currency: "تبدیل ارز",
  bmi: "محاسبه BMI",
  date: "تبدیل تاریخ"
};

$$("[data-tool]").forEach(button => {
  button.addEventListener("click", () => {
    openTool(button.dataset.tool);
  });
});

function openTool(tool) {
  const workspace = $("#tool-workspace");

  workspace.classList.remove("hidden");
  workspace.replaceChildren();

  const title = document.createElement("h3");
  title.textContent = toolNames[tool] || "ابزار";

  workspace.appendChild(title);

  const forms = {
    percentage: `
      <label>مقدار اصلی</label>
      <input id="tool-a" type="number" placeholder="مثلاً 200">
      <label>درصد</label>
      <input id="tool-b" type="number" placeholder="مثلاً 15">
      <button id="tool-calculate" class="primary-button">محاسبه</button>
      <p id="tool-result"></p>
    `,

    discount: `
      <label>قیمت اولیه</label>
      <input id="tool-a" type="number" placeholder="قیمت">
      <label>درصد تخفیف</label>
      <input id="tool-b" type="number" placeholder="درصد">
      <button id="tool-calculate" class="primary-button">محاسبه</button>
      <p id="tool-result"></p>
    `,

    bmi: `
      <label>وزن (کیلوگرم)</label>
      <input id="tool-a" type="number" placeholder="وزن">
      <label>قد (سانتی‌متر)</label>
      <input id="tool-b" type="number" placeholder="قد">
      <button id="tool-calculate" class="primary-button">محاسبه BMI</button>
      <p id="tool-result"></p>
    `,

    loan: `
      <label>مبلغ وام</label>
      <input id="tool-a" type="number" placeholder="مبلغ">
      <label>نرخ سود سالانه (درصد)</label>
      <input id="tool-b" type="number" placeholder="درصد سود">
      <label>مدت بازپرداخت (ماه)</label>
      <input id="tool-c" type="number" placeholder="تعداد ماه">
      <button id="tool-calculate" class="primary-button">محاسبه قسط</button>
      <p id="tool-result"></p>
    `,

    interest: `
      <label>سرمایه اولیه</label>
      <input id="tool-a" type="number" placeholder="مبلغ">
      <label>نرخ سود سالانه (درصد)</label>
      <input id="tool-b" type="number" placeholder="درصد">
      <label>مدت (سال)</label>
      <input id="tool-c" type="number" placeholder="سال">
      <button id="tool-calculate" class="primary-button">محاسبه سود ساده</button>
      <p id="tool-result"></p>
    `,

    unit: `
      <label>مقدار بر حسب متر</label>
      <input id="tool-a" type="number" placeholder="متر">
      <button id="tool-calculate" class="primary-button">تبدیل به سانتی‌متر</button>
      <p id="tool-result"></p>
    `,

    currency: `
      <p>نرخ‌های ارز این نسخه نمونه هستند و باید با منبع معتبر به‌روزرسانی شوند.</p>
      <label>مبلغ به دلار</label>
      <input id="tool-a" type="number" placeholder="USD">
      <button id="tool-calculate" class="primary-button">محاسبه نمونه به یورو</button>
      <p id="tool-result"></p>
    `,

    date: `
      <p>تاریخ امروز دستگاه:</p>
      <p id="tool-result">${new Date().toLocaleDateString()}</p>
    `
  };

  const content = document.createElement("div");
  content.innerHTML = forms[tool] || "<p>ابزار یافت نشد.</p>";

  workspace.appendChild(content);

  const calculateButton = $("#tool-calculate");

  if (!calculateButton) return;

  calculateButton.addEventListener("click", () => {
    const a = Number($("#tool-a")?.value);
    const b = Number($("#tool-b")?.value);
    const c = Number($("#tool-c")?.value);
    const output = $("#tool-result");

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      output.textContent = "لطفاً مقادیر معتبر وارد کنید.";
      return;
    }

    let result;

    switch (tool) {
      case "percentage":
        result = a * b / 100;
        output.textContent = `نتیجه: ${result}`;
        break;

      case "discount":
        if (b < 0 || b > 100 || a < 0) {
          output.textContent = "مقادیر نامعتبر هستند.";
          return;
        }
        result = a - (a * b / 100);
        output.textContent = `قیمت نهایی: ${result}`;
        break;

      case "bmi":
        if (a <= 0 || b <= 0) {
          output.textContent = "وزن و قد باید مثبت باشند.";
          return;
        }
        result = a / ((b / 100) ** 2);
        output.textContent = `BMI: ${result.toFixed(2)}`;
        break;

      case "loan": {
        if (!Number.isFinite(c) || a < 0 || b < 0 || c <= 0) {
          output.textContent = "مقادیر نامعتبر هستند.";
          return;
        }

        const rate = b / 1200;
        result = rate === 0
          ? a / c
          : a * rate / (1 - Math.pow(1 + rate, -c));

        output.textContent = `قسط ماهانه: ${result.toFixed(2)}`;
        break;
      }

      case "interest":
        if (!Number.isFinite(c) || a < 0 || b < 0 || c < 0) {
          output.textContent = "مقادیر نامعتبر هستند.";
          return;
        }
        result = a * b / 100 * c;
        output.textContent = `سود ساده: ${result.toFixed(2)}`;
        break;

      case "unit":
        output.textContent = `سانتی‌متر: ${(a * 100).toFixed(2)}`;
        break;

      case "currency":
        output.textContent = `یورو نمونه: ${(a * 0.92).toFixed(2)}`;
        break;
    }
  });
}

/* =========================================
   INITIALIZATION
========================================= */

function initializeApp() {
  applyTheme();
  setLanguage(state.language);

  if ($("#theme-select")) {
    $("#theme-select").value = state.theme;
  }

  renderHistory();
  renderFavorites();
  renderAlarms();
  updateDisplay();

  if (!STORAGE.get("pc_onboarding_done", false)) {
    openOnboarding();
  }

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)")
      .addEventListener?.("change", () => {
        if (state.theme === "system") applyTheme();
      });
  }

  $("#app-loader")?.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", initializeApp);
