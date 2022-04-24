import el from "./utils.js";

const App = document.getElementById("app");

const Elem = {
  loginForm: el(
    "div",
    { class: "login-box" },
    el(
      "div",
      {
        class: "box-wrapper"
      },
      el("h2", { class: "bos-wrapper__title" }, "Login to My Momentum"),
      el(
        "form",
        { id: "login-form" },
        el("label", { class: "login-form__label" },
          el("span", { class: "username-label" }, "username"),
          el("input", { class: "username", name: "username", type: "text", maxlength: 15, placeholder: "What's your name?", required: true })
        ),
        el("button", { type: "submit" }, "Log in")
      )
    )
  ),
  contentBox: el(
    "div",
    { class: "content-box" },
    el(
      "div",
      { class: "content-box__grid" },
      el("section", { class: "content__todo" }),
      el("section", { class: "content__clock" }),
      el("section", { class: "content__weather" }),
    )
  )
};


App.append(Elem.loginForm, Elem.contentBox);

