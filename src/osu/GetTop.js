const { Score, Beatmap } = require('./Base.js');
const { modBit } = require('./ModEnum.js');

module.exports = async ({ mode, best }) => {
  try {
    let top = [];
    for (let i = 0; i < best.length; i++) {
      let count_300 = Number(best[i].statistics.count_300)
      let count_100 = Number(best[i].statistics.count_100)
      let count_50 = Number(best[i].statistics.count_50)
      let count_miss = Number(best[i].statistics.count_miss)
      let count_geki = Number(best[i].statistics.count_geki)
      let count_katu = Number(best[i].statistics.count_katu)
      let acc = Number((300 * count_300 + 100 * count_100 + 50 * count_50) / (300 * (count_300 + count_100 + count_50 + count_miss)) * 100)
      let accdetail = `[ ${count_300} • ${count_100} • ${count_50} • ${count_miss} ]`
      if (mode == 1) {
        acc = Number((0.5 * count_100 + count_300) / (count_300 + count_100 + count_miss) * 100)
        accdetail = `[ ${count_300} • ${count_100} • ${count_miss} ]`
      }
      if (mode == 2) {
        acc = Number((count_50 + count_100 + count_300) / (count_katu + count_miss + count_50 + count_100 + count_300) * 100)
        accdetail = `[ ${count_300} • ${count_100} • ${count_katu} • ${count_miss} ]`
      }
      if (mode == 3) {
        acc = Number((50 * count_50 + 100 * count_100 + 200 * count_katu + 300 * (count_300 + count_geki)) / (300 * (count_miss + count_50 + count_100 + count_katu + count_300 + count_geki)) * 100)
        accdetail = `[ ${count_geki} • ${count_300} • ${count_katu} • ${count_100} • ${count_50} • ${count_miss} ]`
      }
      top[i] = new Score({
        beatmap_id: best[i].beatmap.id, score: best[i].score, combo: best[i].max_combo,
        count_50: count_50, count_100: count_100, count_300: count_300,
        count_miss: count_miss, count_katu: count_katu, count_geki: count_geki,
        perfect: best[i].perfect, mod_num: modBit({ mod: best[i].mods.join("") }).mod_num,
        date: best[i].created_at, rank: best[i].rank, pp: best[i].pp, acc: acc, acc_detail: accdetail,
        top: i + 1, user_id: best[i].user_id, mod_text: best[i].mods.join("")
      })
      let fc = 0;
      let data = new Beatmap({
        title: best[i].beatmapset.title, creator: best[i].beatmapset.creator,
        diff: best[i].beatmap.version, source: best[i].beatmapset.source,
        artist: best[i].beatmapset.artist, bpm: best[i].beatmap.bpm,
        beatmapset_id: best[i].beatmapset.id,
        fc: fc, star: best[i].beatmap.difficulty_rating,
        time_total: best[i].beatmap.total_length,
        time_drain: best[i].beatmap.hit_length, circle: best[i].beatmap.count_circles,
        slider: best[i].beatmap.count_sliders, spinner: best[i].beatmap.count_spinners,
        ar: best[i].beatmap.ar,
        hp: best[i].beatmap.drain, cs: best[i].beatmap.cs,
        od: best[i].beatmap.accuracy
      })
      top[i].addBeatmapInfo({ ...data, mode: mode, mod_num: top[i].mod_num })
    }
    return top;
  } catch (err) {
    console.log(err)
  }
}