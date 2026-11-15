(function () {
  "use strict";
  const API_URL = "https://REPLACE-WITH-WORKER.workers.dev";
  if (document.getElementById("bekiuz-ai-root")) return;

  const style = document.createElement("style");
  style.textContent = `
    #bekiuz-ai-root{position:fixed;right:22px;bottom:22px;z-index:9999;font-family:Inter,system-ui,sans-serif;color:#f7f4fc}
    #bekiuz-ai-root *{box-sizing:border-box}
    .bc-launch{width:62px;height:62px;border:1px solid rgba(225,196,255,.5);border-radius:22px;background:linear-gradient(140deg,#d7b7ff,#ffabd9);color:#160d20;font-weight:900;font-size:25px;cursor:pointer;box-shadow:0 12px 40px #0008;display:grid;place-items:center}
    .bc-panel{position:absolute;right:0;bottom:76px;width:min(390px,calc(100vw - 28px));height:min(590px,calc(100dvh - 120px));display:none;flex-direction:column;overflow:hidden;border:1px solid #443452;border-radius:21px;background:#100d16;box-shadow:0 24px 90px #000a}
    .bc-panel.open{display:flex}
    .bc-head{padding:16px 17px;background:linear-gradient(110deg,#21172e,#17111f);border-bottom:1px solid #33263f;display:flex;align-items:center;gap:11px}
    .bc-avatar{width:39px;height:39px;border-radius:13px;background:linear-gradient(130deg,#d7b7ff,#ffabd9);color:#180e21;font-weight:900;display:grid;place-items:center}
    .bc-head strong{display:block;font-size:13px;letter-spacing:.04em}
    .bc-head small{display:block;color:#b9a8ca;font-size:10px;margin-top:2px}
    .bc-close{margin-left:auto;border:0;background:transparent;color:#cbbbd8;font-size:22px;cursor:pointer}
    .bc-messages{flex:1;min-height:0;overflow:auto;padding:15px;display:flex;flex-direction:column;gap:10px}
    .bc-msg{max-width:88%;padding:11px 13px;border-radius:14px;font-size:12px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere}
    .bc-msg.bot{background:#20182a;border:1px solid #382a46;align-self:flex-start;color:#f3eafa;border-top-left-radius:5px}
    .bc-msg.user{background:linear-gradient(120deg,#4c3563,#613c65);align-self:flex-end;color:#fff;border-top-right-radius:5px}
    .bc-quick{display:flex;gap:7px;overflow:auto;padding:0 14px 10px;scrollbar-width:none}
    .bc-quick button{flex:0 0 auto;border:1px solid #493656;border-radius:999px;background:#1a1422;color:#d8c6e8;padding:7px 10px;font-size:10px;cursor:pointer}
    .bc-consent{display:flex;align-items:flex-start;gap:8px;padding:10px 14px;border-top:1px solid #2d2436;color:#a99db5;font-size:10px;line-height:1.45}
    .bc-consent input{accent-color:#c49aff;margin:2px 0 0}
    .bc-form{display:flex;gap:8px;padding:0 14px 14px}
    .bc-input{min-width:0;flex:1;background:#191420;border:1px solid #403148;border-radius:12px;padding:12px;color:#fff;font-size:12px;outline:none}
    .bc-input:focus{border-color:#b98de9}
    .bc-send{width:43px;border:0;border-radius:12px;background:linear-gradient(130deg,#d7b7ff,#ffabd9);color:#180e21;font-weight:900;font-size:17px;cursor:pointer}
    .bc-send:disabled{opacity:.5;cursor:wait}
    .bc-note{padding:0 14px 10px;color:#756a80;font-size:9px}
    @media(max-width:480px){#bekiuz-ai-root{right:14px;bottom:14px}.bc-launch{width:56px;height:56px;border-radius:19px}.bc-panel{right:-5px;bottom:68px;height:min(610px,calc(100dvh - 95px))}}
  `;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "bekiuz-ai-root";
  root.innerHTML = `
    <section class="bc-panel" id="bc-panel" aria-label="Bekiuz AI chat" aria-hidden="true">
      <header class="bc-head">
        <div class="bc-avatar">B.</div>
        <div><strong>BEKIUZ AI</strong><small>Virtual yordamchi · Odatda tez javob beradi</small></div>
        <button class="bc-close" type="button" aria-label="Yopish">×</button>
      </header>
      <div class="bc-messages" id="bc-messages" aria-live="polite"></div>
      <div class="bc-quick">
        <button type="button">Xizmatlar haqida</button>
        <button type="button">Sayt buyurtma qilmoqchiman</button>
        <button type="button">AI yechim kerak</button>
      </div>
      <label class="bc-consent"><input id="bc-consent" type="checkbox"><span>Murojaat ma’lumotlarimni Bekiuz Company CRM bazasida saqlash va mas’ul xodimga yuborishga roziman.</span></label>
      <form class="bc-form" id="bc-form">
        <input class="bc-input" id="bc-input" maxlength="1600" autocomplete="off" placeholder="Xabaringizni yozing..." aria-label="Xabaringiz">
        <button class="bc-send" id="bc-send" type="submit" aria-label="Yuborish">↑</button>
      </form>
      <div class="bc-note">Ma’lumotlar faqat murojaatingizni ko‘rib chiqish uchun ishlatiladi.</div>
    </section>
    <button class="bc-launch" type="button" aria-label="Bekiuz AI yordamchini ochish">B.</button>
  `;
  document.body.appendChild(root);

  const panel = root.querySelector("#bc-panel");
  const launch = root.querySelector(".bc-launch");
  const close = root.querySelector(".bc-close");
  const list = root.querySelector("#bc-messages");
  const form = root.querySelector("#bc-form");
  const input = root.querySelector("#bc-input");
  const send = root.querySelector("#bc-send");
  const consent = root.querySelector("#bc-consent");
  let history = [];
  try { history = JSON.parse(sessionStorage.getItem("bekiuz-ai-chat") || "[]"); } catch { history = []; }

  function save() {
    try { sessionStorage.setItem("bekiuz-ai-chat", JSON.stringify(history.slice(-12))); } catch {}
  }
  function addMessage(role, content) {
    const node = document.createElement("div");
    node.className = "bc-msg " + (role === "user" ? "user" : "bot");
    node.textContent = content;
    list.appendChild(node);
    list.scrollTop = list.scrollHeight;
  }
  history.forEach(m => addMessage(m.role, m.content));
  if (!history.length) {
    const greeting = "Assalomu alaykum! Men Bekiuz AI — kompaniyaning virtual yordamchisiman. Sizga web-sayt, Telegram bot, AI yoki dizayn bo‘yicha qanday yordam bera olaman?";
    history.push({ role: "assistant", content: greeting });
    save();
    addMessage("assistant", greeting);
  }
  function toggle(open) {
    panel.classList.toggle("open", open);
    panel.setAttribute("aria-hidden", String(!open));
    launch.style.display = open ? "none" : "grid";
    if (open) input.focus();
  }
  launch.addEventListener("click", () => toggle(true));
  close.addEventListener("click", () => toggle(false));
  root.querySelectorAll(".bc-quick button").forEach(button => {
    button.addEventListener("click", () => {
      input.value = button.textContent;
      form.requestSubmit();
    });
  });
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value || send.disabled) return;
    if (API_URL.includes("REPLACE-WITH-WORKER")) {
      addMessage("assistant", "AI hali serverga ulanmagan. Backend sozlangach, shu yerda ishlaydi. Hozircha Aloqa bo‘limidagi formadan foydalaning.");
      return;
    }
    history.push({ role: "user", content: value });
    addMessage("user", value);
    save();
    input.value = "";
    send.disabled = true;
    const typing = document.createElement("div");
    typing.className = "bc-msg bot";
    typing.textContent = "Javob tayyorlanmoqda...";
    list.appendChild(typing);
    list.scrollTop = list.scrollHeight;
    try {
      const response = await fetch(API_URL + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12), consent: consent.checked })
      });
      const data = await response.json();
      typing.remove();
      if (!response.ok) throw new Error(data.error || "Server xatoligi");
      const reply = typeof data.reply === "string" ? data.reply : "Javob topilmadi.";
      history.push({ role: "assistant", content: reply });
      save();
      addMessage("assistant", reply);
    } catch (error) {
      typing.remove();
      const message = error.message || "Ulanishda xatolik.";
      addMessage("assistant", message + " Birozdan so‘ng qayta urinib ko‘ring yoki Aloqa bo‘limidan yozing.");
    } finally {
      send.disabled = false;
      input.focus();
    }
  });
})();