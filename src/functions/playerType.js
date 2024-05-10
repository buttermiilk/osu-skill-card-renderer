const generatePlayerType = (mods) => {
  const synonyms = {
    SD: ["Adrenaline Junkie", "Thrill Seeker", "High Roller"],
    PF: ["Accuracy Ace", "Flawless Phenom", "Precision Pro"], 
    NF: ["Safety Net Superstar", "Unbreakable", "Steady Eddy"],
    HR: ["Rock 'n' Roll Rebel", "Guitar Hero", "Headbanger"],
    EZ: ["Effortless Expert", "Smooth Sailing", "Cakewalk King"],
    DT: ["Sonic Speedster", "Blur Master", "Time Warp Traveler"],
    NC: ["Hyperdrive Hero", "Energetic Enigma", "BPM Blaster"],
    HT: ["Smooth Operator", "Mellow Maestro", "Relaxed Rhythm"],
    FL: ["Pathfinder", "Illuminator", "Trailblazer"],
    FI: ["Shadow Dancer", "Stealth Specialist", "Fade-In Fanatic"],
    HD: ["Mystery Mover", "Invisible Virtuoso", "Cloaked Crusader"]
  };

  const priorityOrder = ["HT", "EZ", "NF", "FL", "DT", "NC", "HR", "HD", "FI", "PF", "SD"];

  for (const modifier of priorityOrder) {
    if (mods.includes(modifier)) {
      const options = synonyms[modifier];
      const playerType = options[Math.floor(Math.random() * options.length)];
      return playerType.trim();
    }
  }

  return "Rhythm Rookie";
};

module.exports = generatePlayerType;