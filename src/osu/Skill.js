module.exports = async ({ best, mode, user = "" }) => {
  const calculateNormalSkills = async (userId) => {
    const normalSkillsResponse = await fetch(
      `https://fun.yorunoken.com/api/user/skills?id=${userId}`
    ).then(async (res) => await res.json());

    return {
      aimAvg: Number(normalSkillsResponse.aim).toFixed(1),
      speedAvg: Number(normalSkillsResponse.speed).toFixed(1),
      accAvg: Number(normalSkillsResponse.acc).toFixed(1),
    };
  };

  const calculateTaikoSkills = (scores) => {
    let starAvg = 0;
    let speedAvg = 0;
    let accAvg = 0;

    for (const score of scores) {
      starAvg += score.star;

      if (score.bpm > 250) score.star *= 97 / 100;
      else if (score.bpm <= 170) score.star *= 102 / 100;

      const speedSkill = Math.pow(score.star / 1.1, Math.log(score.bpm) / Math.log(score.star * 20));
      let accSkill =
        Math.pow(score.star, (Math.pow(score.acc, 3) / Math.pow(100, 3)) * 1.06) *
        (Math.pow(score.od, 0.03) / Math.pow(6, 0.03)) *
        (Math.pow(score.hp, 0.03) / Math.pow(5, 0.03));

      if (score.bpm > 250 && (!score.mod_text.includes('DT') || !score.mod_text.includes('NC'))) accSkill *= 98 / 100;

      speedAvg += speedSkill;
      if (accSkill !== Infinity && !isNaN(accSkill)) accAvg += accSkill;

      score.addScoreSkill({ accSkill, speedSkill, starSkill: score.star });
    }

    return { starAvg, speedAvg, accAvg };
  };

  const calculateCatchSkills = (scores) => {
    let starAvg = 0;
    let aimAvg = 0;
    let accAvg = 0;

    for (const score of scores) {
      starAvg += score.star;

      const aimSkill =
        Math.pow(score.star, Math.log(score.bpm) / Math.log(score.star * 20)) * (Math.pow(score.cs, 0.1) / Math.pow(4, 0.1));
      const accSkill =
        Math.pow(score.star, (Math.pow(score.acc, 3.5) / Math.pow(100, 3.5)) * 1.1) *
        (Math.pow(score.od, 0.02) / Math.pow(6, 0.02)) *
        (Math.pow(score.hp, 0.02) / Math.pow(5, 0.02));

      aimAvg += aimSkill;
      if (accSkill !== Infinity) accAvg += accSkill;

      score.addScoreSkill({ accSkill, aimSkill, starSkill: score.star });
    }

    return { starAvg, aimAvg, accAvg };
  };

  const calculateManiaSkills = (scores) => {
    let starAvg = 0;
    let aimAvg = 0;
    let speedAvg = 0;
    let accAvg = 0;

    for (const score of scores) {
      starAvg += score.star;

      const aimSkill = Math.pow(score.star / 1.1, Math.log(score.bpm) / Math.log(score.star * 20));
      const accSkill =
        Math.pow(score.star, (Math.pow(score.acc, 3) / Math.pow(100, 3)) * 1.08) *
        (Math.pow(score.od, 0.03) / Math.pow(6, 0.02)) *
        (Math.pow(score.hp, 0.03) / Math.pow(5, 0.02));
      const speedSkill =
        Math.pow(score.star, 1.1 * Math.pow(score.bpm / 250, 0.4) * (Math.log(score.circle + score.slider) / Math.log(score.star * 900))) *
        (Math.pow(score.od, 0.4) / Math.pow(8, 0.4)) *
        (Math.pow(score.hp, 0.2) / Math.pow(7.5, 0.2)) *
        Math.pow(score.cs / 4, 0.1);

      aimAvg += aimSkill;
      speedAvg += speedSkill;
      if (accSkill !== Infinity) accAvg += accSkill;

      score.addScoreSkill({ accSkill, aimSkill, speedSkill, starSkill: score.star });
    }

    return { starAvg, aimAvg, speedAvg, accAvg };
  };

  let starAvg = 0;
  let aimAvg = 0;
  let speedAvg = 0;
  let accAvg = 0;
  const modAvg = [];
  const calcCount = 50;

  if (mode == 0) {
    const res = await calculateNormalSkills(user);
    aimAvg = res.aimAvg;
    speedAvg = res.speedAvg;
    accAvg = res.accAvg;
    const scores = best.slice(0, calcCount + 1);
    for (const score of scores) {
      const findMod = modAvg.find((m) => m.mod == score?.mods.join(''));
      if (findMod == undefined) {
        modAvg.push({ mod: score?.mods.join(''), count: 1 });
      } else {
        findMod.count += 1;
      }
    };
  } else {
    const scores = best.slice(0, calcCount + 1);
    for (const score of scores) {
      const findMod = modAvg.find((m) => m.mod == score?.mod_text);
      if (findMod == undefined) {
        modAvg.push({ mod: score?.mod_text, count: 1 });
      } else {
        findMod.count += 1;
      }
    };
    if (mode == 1) {
      const { starAvg: taikoStarAvg, speedAvg: taikoSpeedAvg, accAvg: taikoAccAvg } = calculateTaikoSkills(scores);
      starAvg = taikoStarAvg;
      speedAvg = taikoSpeedAvg;
      accAvg = taikoAccAvg;
    } else if (mode == 2) {
      const { starAvg: catchStarAvg, aimAvg: catchAimAvg, accAvg: catchAccAvg } = calculateCatchSkills(scores);
      starAvg = catchStarAvg;
      aimAvg = catchAimAvg;
      accAvg = catchAccAvg;
    } else if (mode == 3) {
      const { starAvg: maniaStarAvg, aimAvg: maniaAimAvg, speedAvg: maniaSpeedAvg, accAvg: maniaAccAvg } = calculateManiaSkills(scores);
      starAvg = maniaStarAvg;
      aimAvg = maniaAimAvg;
      speedAvg = maniaSpeedAvg;
      accAvg = maniaAccAvg;
    }
  }

  return {
    starAvg,
    aimAvg,
    speedAvg,
    accAvg,
    modAvg,
    calcCount,
  };
};