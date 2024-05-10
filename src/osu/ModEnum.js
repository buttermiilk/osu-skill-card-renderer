const numbermods = [
  { mod_text: "MR", mod_bit: 1 << 30 },
  { mod_text: "V2", mod_bit: 1 << 29 },
  { mod_text: "2K", mod_bit: 1 << 28 },
  { mod_text: "3K", mod_bit: 1 << 27 },
  { mod_text: "1K", mod_bit: 1 << 26 },
  { mod_text: "KC", mod_bit: 1 << 25 },
  { mod_text: "9K", mod_bit: 1 << 24 },
  { mod_text: "TG", mod_bit: 1 << 23 },
  { mod_text: "CN", mod_bit: 1 << 22 },
  { mod_text: "RD", mod_bit: 1 << 21 },
  { mod_text: "FI", mod_bit: 1 << 20 },
  { mod_text: "8K", mod_bit: 1 << 19 },
  { mod_text: "7K", mod_bit: 1 << 18 },
  { mod_text: "6K", mod_bit: 1 << 17 },
  { mod_text: "5K", mod_bit: 1 << 16 },
  { mod_text: "4K", mod_bit: 1 << 15 },
  { mod_text: "PF", mod_bit: 1 << 14 },
  { mod_text: "AP", mod_bit: 1 << 13 },
  { mod_text: "SO", mod_bit: 1 << 12 },
  { mod_text: "AU", mod_bit: 1 << 11 },
  { mod_text: "FL", mod_bit: 1 << 10 },
  { mod_text: "NC", mod_bit: 1 << 9 },
  { mod_text: "HT", mod_bit: 1 << 8 },
  { mod_text: "RX", mod_bit: 1 << 7 },
  { mod_text: "DT", mod_bit: 1 << 6 },
  { mod_text: "SD", mod_bit: 1 << 5 },
  { mod_text: "HR", mod_bit: 1 << 4 },
  { mod_text: "HD", mod_bit: 1 << 3 },
  { mod_text: "TD", mod_bit: 1 << 2 },
  { mod_text: "EZ", mod_bit: 1 << 1 },
  { mod_text: "NF", mod_bit: 1 }
]
function calcMod({ mod }) {
  let number = parseInt(mod)
  let mod_list = []

  if (number & 1 << 0) mod_list.push('NF')
  if (number & 1 << 1) mod_list.push('EZ')
  if (number & 1 << 3) mod_list.push('HD')
  if (number & 1 << 4) mod_list.push('HR')
  if (number & 1 << 5) mod_list.push('SD')
  if (number & 1 << 9) mod_list.push('NC')
  else if (number & 1 << 6) mod_list.push('DT')
  if (number & 1 << 7) mod_list.push('RX')
  if (number & 1 << 8) mod_list.push('HT')
  if (number & 1 << 10) mod_list.push('FL')
  if (number & 1 << 12) mod_list.push('SO')
  if (number & 1 << 14) mod_list.push('PF')
  if (number & 1 << 15) mod_list.push('4K')
  if (number & 1 << 16) mod_list.push('5K')
  if (number & 1 << 17) mod_list.push('6K')
  if (number & 1 << 18) mod_list.push('7K')
  if (number & 1 << 19) mod_list.push('8K')
  if (number & 1 << 20) mod_list.push('FI')
  if (number & 1 << 24) mod_list.push('9K')
  if (number & 1 << 25) mod_list.push('10K')
  if (number & 1 << 26) mod_list.push('1K')
  if (number & 1 << 27) mod_list.push('3K')
  if (number & 1 << 28) mod_list.push('2K')

  return { mod_text: !mod_list.length? "NM" : mod_list.join(""), mod_num: mod }
}

function removeNonDiffIncreaseMod(mod) {
  const { mod_text } = calcMod({ mod });
  // Remove non-diff increase mods
  mod = mod_text.replace(/SD|PF|HD|NF|TD|FL|MR|V2|3K|2K|1K|KC|AP|SO|AU|FI|TG|CN|RD|4K|5K|6K|7K|8K|9K/g, "");
  // Then now request modbit calc
  const res = modBit(mod);
  return { mod_text: !res.mod_text? "NM" : res.mod_text, mod_num: res.mod_num };
}

function modBit({ mod }) {
  let m_text = "", m_num = 0;
  mod = mod.toUpperCase();
  if (mod !== 'NM') {
    for (let i = 0; i < mod.length / 2; i++) {
      let find_mod = numbermods.find(m => m.mod_text == mod.substr(i * 2, 2))
      m_text += find_mod.mod_text
      m_num += find_mod.mod_bit
    }
  }
  return { mod_text: !m_text? "NM" : m_text, mod_num: m_num };
}

module.exports = { calcMod, removeNonDiffIncreaseMod, modBit };