
"use strict";

// ==========================================
// KEYINGI SHAKL QAYSI?
// 30 BOSQICH × 5 TOPSHIRIQ
// ==========================================

const $ = (id) => document.getElementById(id);

const jamiBosqich = 30;
const savollarSoni = 5;

let bosqich = 1;
let savol = 0;
let ball = 0;
let togriJavob = 0;
let joriyJavob = null;
let javobBerildi = false;
let yordamIshlatildi = false;

const bajarilganBosqichlar = new Set();

const belgilar = [
  "●", "■", "▲", "◆", "★", "♥",
  "⬟", "⬢", "⬡", "✦", "✿", "⬣"
];

// HTML elementlari
const el = {
  ball: $("ball"),
  togri: $("togriJavob"),
  topshiriq: $("topshiriq"),
  bosqichBadge: $("bosqichBadge"),
  savolRaqam: $("savolRaqam"),
  ketmaKetlik: $("ketmaKetlik"),
  variantlar: $("variantlar"),
  xabar: $("xabar"),
  progress: $("progress"),
  foiz: $("foiz"),
  bosqichlar: $("bosqichlar"),
  yordam: $("yordam"),
  keyingi: $("keyingi"),
  modal: $("yakunModal"),
  yakunBall: $("yakunBall"),
  qayta: $("qaytaBoshlash")
};

// HTML elementlarini tekshirish
function kerakliElementlarniTekshir() {
  const yoqElementlar = Object.entries(el)
    .filter(([, element]) => !element)
    .map(([nom]) => nom);

  if (yoqElementlar.length) {
    console.error(
      "HTML elementlari topilmadi:",
      yoqElementlar.join(", ")
    );
    return false;
  }

  return true;
}

// Tasodifiy son
function tasodifiy(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Massivni aralashtirish
function aralashtir(massiv) {
  const natija = [...massiv];

  for (let i = natija.length - 1; i > 0; i--) {
    const j = tasodifiy(0, i);
    [natija[i], natija[j]] = [natija[j], natija[i]];
  }

  return natija;
}

// Takrorlanmaydigan belgilar
function turliBelgilar(son) {
  return aralashtir(belgilar).slice(0, son);
}

// Savol yaratish
function savolMalumoti() {
  let ketma = [];
  let javob;

  const tur = Math.floor((bosqich - 1) / 5);

  // 1–5-bosqich
  if (tur === 0) {
    const shakl = belgilar[tasodifiy(0, 5)];
    const boshqa = belgilar[tasodifiy(6, 11)];

    ketma = savol % 2 === 0
      ? [shakl, shakl, shakl, shakl]
      : [shakl, boshqa, shakl, boshqa];

    javob = shakl;
  }

  // 6–10-bosqich
  else if (tur === 1) {
    const [a, b] = turliBelgilar(2);

    ketma = [a, b, a, b, a];
    javob = b;
  }

  // 11–15-bosqich
  else if (tur === 2) {
    const [a, b, c] = turliBelgilar(3);

    ketma = [a, b, c, a, b];
    javob = c;
  }

  // 16–20-bosqich
  else if (tur === 3) {
    const boshlanish = tasodifiy(5, 30);
    const qadam = tasodifiy(2, 9);

    if (savol % 2 === 0) {
      ketma = [0, 1, 2, 3].map(
        (i) => boshlanish + qadam * i
      );

      javob = boshlanish + qadam * 4;
    } else {
      const start = boshlanish + qadam * 5;

      ketma = [0, 1, 2, 3].map(
        (i) => start - qadam * i
      );

      javob = start - qadam * 4;
    }
  }

  // 21–25-bosqich
  else if (tur === 4) {
    const boshlanish = tasodifiy(1, 4);
    const kopaytiruvchi = tasodifiy(2, 3);

    ketma = [0, 1, 2, 3].map(
      (i) => boshlanish * kopaytiruvchi ** i
    );

    javob = boshlanish * kopaytiruvchi ** 4;
  }

  // 26–30-bosqich
  else {
    const boshlanish = tasodifiy(1, 5);

    if (savol % 2 === 0) {
      ketma = [0, 1, 2, 3].map(
        (i) => (boshlanish + i) ** 2
      );

      javob = (boshlanish + 4) ** 2;
    } else {
      const a = boshlanish;
      const b = boshlanish + 1;

      ketma = [
        a,
        b,
        a + b,
        a + 2 * b,
        2 * a + 3 * b
      ];

      javob = 3 * a + 5 * b;
    }
  }

  return { ketma, javob };
}

// Javob variantlarini yaratish
function variantYarat(javob) {
  const variantlar = [javob];

  if (typeof javob === "number") {
    const farqlar = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11, 12, 13, 15, 17, 20, 25
    ];

    while (variantlar.length < 4) {
      const farq = farqlar[
        tasodifiy(0, farqlar.length - 1)
      ];

      const yangi = javob + (
        Math.random() < 0.5 ? -farq : farq
      );

      if (
        yangi >= 0 &&
        !variantlar.includes(yangi)
      ) {
        variantlar.push(yangi);
      }
    }
  } else {
    const boshqaBelgilar = aralashtir(
      belgilar.filter((belgi) => belgi !== javob)
    );

    variantlar.push(...boshqaBelgilar.slice(0, 3));
  }

  return aralashtir(variantlar);
}

// Ketma-ketlikni chiqarish
function ketmaKetlikChiqar(ketma) {
  el.ketmaKetlik.innerHTML = "";

  ketma.forEach((qiymat) => {
    const element = document.createElement("div");

    element.className = "element";
    element.textContent = qiymat;

    el.ketmaKetlik.appendChild(element);
  });

  const nomaLumElement = document.createElement("div");

  nomaLumElement.className = "element bosh";
  nomaLumElement.textContent = "?";

  el.ketmaKetlik.appendChild(nomaLumElement);
}

// Variantlarni chiqarish
function variantlarniChiqar(variantlar) {
  el.variantlar.innerHTML = "";

  variantlar.forEach((variant) => {
    const tugma = document.createElement("button");

    tugma.type = "button";
    tugma.className = "variant";
    tugma.textContent = variant;

    tugma.addEventListener("click", () => {
      javobniTekshir(variant, tugma);
    });

    el.variantlar.appendChild(tugma);
  });
}

// Statistikani yangilash
function statistikaYangila() {
  el.ball.textContent = ball;
  el.togri.textContent = togriJavob;

  el.topshiriq.textContent =
    `${savol + 1} / ${savollarSoni}`;

  el.bosqichBadge.textContent =
    `${bosqich}-bosqich`;

  el.savolRaqam.textContent =
    String(savol + 1).padStart(2, "0");

  const umumiyBajarilgan =
    (bosqich - 1) * savollarSoni + savol;

  const foiz = Math.round(
    umumiyBajarilgan /
    (jamiBosqich * savollarSoni) * 100
  );

  el.foiz.textContent = `${foiz}%`;
  el.progress.style.width = `${foiz}%`;
}

// Bosqichlar ro'yxati
function bosqichlarniChiqar() {
  el.bosqichlar.innerHTML = "";

  for (let i = 1; i <= jamiBosqich; i++) {
    const tugma = document.createElement("button");

    tugma.type = "button";
    tugma.className = "stage";
    tugma.textContent = i;

    if (bajarilganBosqichlar.has(i)) {
      tugma.classList.add("done");
    }

    if (i === bosqich) {
      tugma.classList.add("active");
    }

    tugma.disabled =
      i > bosqich && !bajarilganBosqichlar.has(i);

    tugma.addEventListener("click", () => {
      if (
        i <= bosqich ||
        bajarilganBosqichlar.has(i)
      ) {
        bosqichniOch(i);
      }
    });

    el.bosqichlar.appendChild(tugma);
  }
}

// Yangi savol
function savolYarat() {
  javobBerildi = false;
  yordamIshlatildi = false;
  joriyJavob = null;

  el.xabar.textContent = "";
  el.xabar.className = "message";

  el.yordam.disabled = false;
  el.keyingi.disabled = true;

  const malumot = savolMalumoti();

  joriyJavob = malumot.javob;

  ketmaKetlikChiqar(malumot.ketma);

  const variantlar = variantYarat(malumot.javob);

  variantlarniChiqar(variantlar);

  statistikaYangila();
  bosqichlarniChiqar();
}

// Javobni tekshirish
function javobniTekshir(variant, tugma) {
  if (javobBerildi) return;

  javobBerildi = true;

  const tugmalar =
    el.variantlar.querySelectorAll(".variant");

  tugmalar.forEach((btn) => {
    btn.disabled = true;

    if (
      String(btn.textContent) === String(joriyJavob)
    ) {
      btn.classList.add("togri");
    }
  });

  if (String(variant) === String(joriyJavob)) {
    const mukofot = yordamIshlatildi ? 5 : 10;

    ball += mukofot;
    togriJavob++;

    el.xabar.textContent =
      `To‘g‘ri javob! +${mukofot} ball`;

    el.xabar.className = "message togri";
  } else {
    tugma.classList.add("xato");

    el.xabar.textContent =
      `Noto‘g‘ri javob. To‘g‘ri javob: ${joriyJavob}`;

    el.xabar.className = "message xato";
  }

  el.yordam.disabled = true;
  el.keyingi.disabled = false;

  el.ball.textContent = ball;
  el.togri.textContent = togriJavob;
}

// Yordam
function yordamBer() {
  if (javobBerildi || yordamIshlatildi) return;

  yordamIshlatildi = true;

  el.xabar.textContent =
    "Maslahat: shakllar yoki sonlar qanday tartibda o‘zgarayotganini kuzating.";

  el.xabar.className = "message";
  el.yordam.disabled = true;
}

// Keyingi savol
function keyingiSavol() {
  if (!javobBerildi) return;

  savol++;

  if (savol >= savollarSoni) {
    bajarilganBosqichlar.add(bosqich);

    if (bosqich === jamiBosqich) {
      oyinTugadi();
      return;
    }

    bosqich++;
    savol = 0;
  }

  savolYarat();
}

// Bosqichni ochish
function bosqichniOch(raqam) {
  bosqich = raqam;
  savol = 0;

  el.modal.classList.remove("show");

  savolYarat();
}

// O'yin yakuni
function oyinTugadi() {
  el.ketmaKetlik.innerHTML = "";
  el.variantlar.innerHTML = "";

  el.xabar.textContent =
    "Siz barcha 30 ta bosqichni muvaffaqiyatli yakunladingiz!";

  el.xabar.className = "message togri";

  el.keyingi.disabled = true;
  el.yordam.disabled = true;

  el.foiz.textContent = "100%";
  el.progress.style.width = "100%";

  el.yakunBall.textContent = `${ball} ball`;

  el.modal.classList.add("show");

  bosqichlarniChiqar();
}

// Qayta boshlash
function qaytaBoshlash() {
  bosqich = 1;
  savol = 0;
  ball = 0;
  togriJavob = 0;

  bajarilganBosqichlar.clear();

  el.modal.classList.remove("show");

  savolYarat();
}

// O'yinni boshlash
function boshlash() {
  if (!kerakliElementlarniTekshir()) return;

  el.yordam.addEventListener("click", yordamBer);
  el.keyingi.addEventListener("click", keyingiSavol);
  el.qayta.addEventListener("click", qaytaBoshlash);

  savolYarat();
}

// Sahifa yuklangach ishga tushirish
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boshlash);
} else {
  boshlash();
}
