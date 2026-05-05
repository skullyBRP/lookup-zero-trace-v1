const fs = require("fs");

const file = "./data.json";

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file));
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  setInfo: (id, info) => {
    const data = load();
    data[id] = info;
    save(data);
  },

  getInfo: (id) => {
    const data = load();
    return data[id] || null;
  }
};