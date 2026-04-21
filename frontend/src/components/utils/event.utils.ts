export const pressX = () => {
  const event = new KeyboardEvent("keydown", {
    key: "x",
    code: "KeyX",
  });

  document.dispatchEvent(event);
};
