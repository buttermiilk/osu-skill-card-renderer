const { createCanvas, loadImage, registerFont } = require('canvas');
const skillCalc = require('../osu/Skill.js');
const bestData = require('../osu/GetTop.js');
const { Mods } = require('../osu/Base.js');
const fetchData = require('./fetchData');
const generatePlayerType = require('./playerType');
registerFont("./src/font/IBMPlexSans-Regular.ttf", { family: "IBM Plex Sans", weight: "regular" });
registerFont("./src/font/IBMPlexSans-Bold.ttf", { family: "IBM Plex Sans", weight: "bold" });

const drawCanvas = async (id, mode, client_id, client_secret, description, color, bgColor, imageUrl) => {
  const canvas = createCanvas(600, 1000);
  const ctx = canvas.getContext('2d');

  let start, end;
  start = performance.now();
  const profile = await fetchData.fetchProfile(id, mode, client_id, client_secret);
  const bestPlays = await fetchData.fetchTops(id, mode, client_id, client_secret);
  end = performance.now();

  console.log('fetch took', ((end - start) / 1000).toFixed(3) + 's');

  start = performance.now();
  const skills = await calculateSkills(bestPlays, mode);
  end = performance.now();

  console.log('calc took', ((end - start) / 1000).toFixed(3) + 's');

  let image;
  if (imageUrl) {
    image = await loadImage(imageUrl);
  }

  start = performance.now();
  await drawBackground(ctx, bgColor, color, image);
  await drawSkills(ctx, skills, mode, color);
  await drawStats(ctx, profile, color);
  await drawMods(ctx, skills.modAvg, color);
  await drawCustomizeBox(ctx, color);
  await drawProfile(ctx, profile, description, color);
  end = performance.now();
  
  console.log('drawing took', ((end - start) / 1000).toFixed(3) + 's');

  return canvas.toBuffer('image/png');
};

const drawBackground = async (ctx, bgColor, color, image) => {
  await new Promise((resolve) => {
    ctx.beginPath();
    ctx.fillStyle = !image ? bgColor || 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.8)';
    ctx.moveTo(50, 0);
    ctx.lineTo(550, 0);
    ctx.arcTo(600, 0, 600, 50, 50);
    ctx.lineTo(600, 950);
    ctx.arcTo(600, 1000, 550, 1000, 50);
    ctx.lineTo(50, 1000);
    ctx.arcTo(0, 1000, 0, 950, 50);
    ctx.lineTo(0, 50);
    ctx.arcTo(0, 0, 50, 0, 50);
    ctx.closePath();
    if (!image) ctx.fill();
    ctx.clip();

    if (image) {
      ctx.drawImage(image, 0, 0, 600, 1200);
    }

    ctx.beginPath();
    ctx.fillStyle = color || 'rgb(0,0,0)';
    ctx.moveTo(0, 325);
    ctx.lineTo(600, 325);
    ctx.lineTo(600, 1000);
    ctx.arcTo(600, 1000, 550, 1000, 50);
    ctx.lineTo(50, 1000);
    ctx.arcTo(0, 1000, 0, 950, 50);
    ctx.lineTo(0, 325);
    ctx.closePath();
    ctx.fill();
    resolve();
  });
};

const drawSkills = async (ctx, skills, mode, color) => {
  await new Promise((resolve) => {
    const convertMode = (mode) => {
      switch (mode) {
        case "osu": return 0;
        case "taiko": return 1;
        case "fruits": return 2;
        case "mania": return 3;
        default: return 0
      };
    };

    const modeIndex = convertMode(mode);
    const rgbValue = color?.split("(")[1].split(")")[0].split(",");
    const bright = color ? (Math.sqrt(
      0.299 * (rgbValue[0] * rgbValue[0]) +
      0.587 * (rgbValue[1] * rgbValue[1]) +
      0.114 * (rgbValue[2] * rgbValue[2])
    )) >= 128 : false;
    console.log('- bright defined as', bright)

    const drawSkillCircle = (y, percent, number, name) => {
      ctx.beginPath();
      ctx.arc(y, 850, 60, 0, Math.PI * 2);
      ctx.lineWidth = 20;
      ctx.strokeStyle = bright ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(
        y,
        850,
        60,
        Math.PI * 1.5,
        Math.PI * 1.5 + (Math.PI * 2 * percent || 1)
      );
      ctx.strokeStyle = bright ? 'rgb(0,0,0)' : 'rgb(255,255,255)';
      ctx.stroke();
      ctx.beginPath();
      ctx.font = 'bold 35px "IBM Plex Sans", sans-serif';
      ctx.fillStyle = bright ? 'rgb(0,0,0)' : 'rgb(255,255,255)';
      ctx.textAlign = 'center';
      ctx.fillText(number, y, 853, 65);
      ctx.font = 'bold 18px "IBM Plex Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name, y, 875, 65);
      ctx.closePath();
    };

    if (mode !== "osu") {
      const { aimAvg, speedAvg, accAvg } = skills;
      const aim_avg = (aimAvg / skills.count * 100).toFixed(0);
      const speed_avg = (speedAvg / skills.count * 100).toFixed(0);
      const acc_avg = (accAvg / skills.count * 100).toFixed(0);

      drawSkillCircle(125, acc_avg / 1000, acc_avg, "ACC");
      drawSkillCircle(300, speed_avg / 1000, speed_avg, "SPD");
      if (modeIndex === 3) {
        drawSkillCircle(475, aim_avg / 1000, aim_avg, "AIM");
      } else {
        drawSkillCircle(475, 0, "-", "SKILL");
      }
    } else {
      const { aimAvg, speedAvg, accAvg } = skills;
      drawSkillCircle(125, 1, aimAvg, "AIM");
      drawSkillCircle(300, 1, speedAvg, "SPD");
      drawSkillCircle(475, 1, accAvg, "ACC");
    }
    resolve();
  });
};

const drawProfile = async (ctx, profile, description, color) => {
  await new Promise(async (resolve) => {
    const rgbValue = color?.split("(")[1].split(")")[0].split(",");
    const bright = color ? (Math.sqrt(
      0.299 * (rgbValue[0] * rgbValue[0]) +
      0.587 * (rgbValue[1] * rgbValue[1]) +
      0.114 * (rgbValue[2] * rgbValue[2])
    )) >= 128 : false;

    const centerX = 300;
    const y = 200;
    const avatarRadius = 100;

    ctx.beginPath();
    ctx.arc(centerX, y + avatarRadius, avatarRadius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = bright ? 'black' : 'white';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.font = 'bold 35px "IBM Plex Sans", sans-serif';
    ctx.fillStyle =  bright ? 'black' : 'white';
    ctx.textAlign = 'center';
    ctx.fillText(profile.username, centerX, y + avatarRadius + 150);

    ctx.font = '25px "IBM Plex Sans", sans-serif';
    ctx.fillStyle = bright ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';
    ctx.textAlign = 'center';
    ctx.fillText(description || "oh that's funny", centerX, y + avatarRadius + 180);

    ctx.beginPath(); 
    ctx.arc(centerX, y + avatarRadius, avatarRadius, 0, 2 * Math.PI);
    ctx.clip();
    ctx.closePath();

    const avatar = await loadImage(`${profile.avatar_url}`);
    ctx.drawImage(
      avatar,
      centerX - avatarRadius,
      y,
      avatarRadius * 2,
      avatarRadius * 2
    );
    resolve();
  });
};

const drawMods = async (ctx, modAvg, color) => {
  await new Promise(async (resolve) => {
    const modIconDir = "https://raw.githubusercontent.com/ppy/osu-web/master/public/images/badges/mods";

    const rgbValue = color?.split("(")[1].split(")")[0].split(",");
    const bright = color ? (Math.sqrt(
      0.299 * (rgbValue[0] * rgbValue[0]) +
      0.587 * (rgbValue[1] * rgbValue[1]) +
      0.114 * (rgbValue[2] * rgbValue[2])
    )) >= 128 : false;

    ctx.beginPath();
    ctx.moveTo(300, 525);
    ctx.lineTo(300, 725);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    const fillSkillValue = (y, text) => {
      ctx.font = 'bold 25px "IBM Plex Sans", sans-serif';
      ctx.fillStyle = bright ? 'black' : 'white';
      ctx.textAlign = 'left';
      ctx.fillText(text, 325, y);
    };

    fillSkillValue(693, generatePlayerType(modAvg[0].mod.match(/.{1,2}/g)));

    const splittedMods = modAvg[0].mod.match(/.{1,2}/g) || ['NM'];
    for (let i = 0; i < splittedMods.length; i++) {
      const image = await loadImage(`${modIconDir}/${Mods[splittedMods[i]]}.png`);
      ctx.drawImage(image, 325 + (50 * i), 625, 45, 32);
    };
    resolve();
  });
};

const drawStats = async (ctx, profile, color) => {
  await new Promise((resolve) => {
    const rgbValue = color?.split("(")[1].split(")")[0].split(",");
    const bright = color ? (Math.sqrt(
      0.299 * (rgbValue[0] * rgbValue[0]) +
      0.587 * (rgbValue[1] * rgbValue[1]) +
      0.114 * (rgbValue[2] * rgbValue[2])
    )) >= 128 : false;

    const fillSkillName = (y, text) => {
      ctx.font = '25px "IBM Plex Sans", sans-serif';
      ctx.fillStyle = bright ? 'black' : 'white';
      ctx.textAlign = 'right';
      ctx.fillText(text, 275, y);
    };

    const fillSkillValue = (y, text) => {
      ctx.font = 'bold 25px "IBM Plex Sans", sans-serif';
      ctx.fillStyle = bright ? 'black' : 'white';
      ctx.textAlign = 'left';
      ctx.fillText(text, 325, y);
    };

    fillSkillName(570, "PP");
    fillSkillValue(570, (+Math.round(profile.statistics.pp)).toLocaleString());
    fillSkillName(607, "Accuracy");
    fillSkillValue(607, `${Math.round(profile.statistics.hit_accuracy * 100) / 100}%`);
    fillSkillName(650, "Main Modifier");
    fillSkillName(693, "Skill");
    resolve();
  });
};

const drawRoundedRect = async (ctx, x, y, width, height, radius) => {
  await new Promise((resolve) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    resolve();
  });
};

const drawCustomizeBox = async (ctx, bgColor, color) => {
  await new Promise(async (resolve) => {
    const rgbValue = bgColor?.split("(")[1].split(")")[0].split(",");
    const bgBright = bgColor ? (Math.sqrt(
      0.299 * (rgbValue[0] * rgbValue[0]) +
      0.587 * (rgbValue[1] * rgbValue[1]) +
      0.114 * (rgbValue[2] * rgbValue[2])
    )) >= 128 : false;

    const boxWidth = 150;
    const boxHeight = 40;
    const boxX = 600 - boxWidth - 30;
    const boxY = 30;
    const cornerRadius = 20;

    ctx.beginPath();
    ctx.moveTo(boxX + cornerRadius, boxY);
    await drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, cornerRadius);
    ctx.fillStyle = bgBright ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
    ctx.fill();
    ctx.closePath();

    ctx.font = 'bold 20px "IBM Plex Sans", sans-serif';
    ctx.fillStyle = bgBright ? 'rgb(0,0,0)' : 'rgb(255,255,255)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('/osu profile', boxX + boxWidth / 2, boxY + boxHeight / 2);
    resolve();
  })
};

const calculateSkills = async (bestPlays, mode) => {
  if (bestPlays.length < 50) return;
  const convertMode = (mode) => {
    switch (mode) {
      case "osu": return 0;
      case "taiko": return 1;
      case "fruits": return 2;
      case "mania": return 3;
      default: return 0
    };
  };

  const modeIndex = convertMode(mode);
  const best = await bestData({ best: bestPlays, mode: modeIndex });
  let aimAvg, speedAvg, accAvg, modAvg, count = 50;

  if (mode !== "osu") {
    const normalSkills = await skillCalc({ best, mode: modeIndex });
    aimAvg = normalSkills.aimAvg;
    speedAvg = normalSkills.speedAvg;
    accAvg = normalSkills.accAvg;
    modAvg = normalSkills.modAvg;
  } else {
    const userId = bestPlays[0].user.id;
    const normalSkills = await skillCalc({ best: bestPlays, mode: modeIndex, user: userId });
    aimAvg = normalSkills.aimAvg;
    speedAvg = normalSkills.speedAvg;
    accAvg = normalSkills.accAvg;
    modAvg = normalSkills.modAvg;
  }

  return { aimAvg, speedAvg, accAvg, modAvg, count };
};

module.exports = drawCanvas;