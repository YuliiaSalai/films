const setValue = {
  text: (v) => v,
  checkbox: (v) => v,
  email: (v) => v,
  password: (v) => v,
  textarea: (v) => v,
  "select-one": (v) => v,
  "select-multiple": (v) => v.map((o) => o.value),
  number: (v) => {
    const re = /(\d+)(\.\d{1,2})?/;
    const x = v.replace(/[^\d.]/g, "").match(re);
    if (v === "") return v;
    const val = !x[2] ? x[1] : x[1] + "" + x[2];
    return Number(val);
  },
};

const setFormObj =
  (data, fn) =>
  ({ target }) => {
    const type = target.type;
    let value =
      type === "checkbox"
        ? target.checked
        : type === "select-multiple"
        ? Array.from(target.selectedOptions)
        : target.value;

    const newValue = setValue[target.type](value) || "";
    return fn({ ...data, [target.name]: newValue });
  };

export const setFormErr = (errors, fn) => ({ target }) => {
  return fn({ ...errors, [target.name]: "" });
};


export default setFormObj;
