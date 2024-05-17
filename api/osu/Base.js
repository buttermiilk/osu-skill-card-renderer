const beatmap_detail = require('./BeatmapDetails.js')

class Score {
  constructor({ top, beatmap_id, score, combo, count_50, count_100, count_300, count_miss, count_katu, count_geki,
    perfect, mod_num, user_id, username, date, rank, pp, acc, acc_detail, mod_text }) {
    // Score
    this.top = Number(top)
    this.beatmap_id = beatmap_id
    this.score = Number(score)
    this.combo = Number(combo)
    this.count_50 = Number(count_50)
    this.count_100 = Number(count_100)
    this.count_300 = Number(count_300)
    this.count_miss = Number(count_miss)
    this.count_katu = Number(count_katu)
    this.count_geki = Number(count_geki)
    this.perfect = Number(perfect)
    this.mod_num = Number(mod_num)
    this.user_id = user_id
    this.username = username
    this.date = date
    this.rank = rank
    this.pp = Number(pp)
    this.acc = Number(acc)
    this.acc_detail = acc_detail
    this.mod_text = mod_text
  }
  addBeatmapInfo({ mode, mod_num, title, creator, diff, source, artist, bpm, beatmapset_id, fc, star, time_total, time_drain,
    circle, spinner, slider, od, ar, hp, cs }) {
    var { time_total, time_drain, bpm, cs, ar, od, hp } = beatmap_detail({
      mod_num: mod_num, mode: mode,
      time_total: Number(time_total), time_drain: Number(time_drain),
      bpm: Number(bpm), cs: Number(cs), ar: Number(ar), od: Number(od), hp: Number(hp)
    })
    this.title = title
    this.creator = creator
    this.diff = diff
    this.source = source
    this.artist = artist
    this.bpm = Number(bpm)
    this.beatmapset_id = beatmapset_id
    this.fc = Number(fc)
    this.star = Number(star)
    this.time_total = Number(time_total)
    this.time_drain = Number(time_drain)
    this.circle = Number(circle)
    this.slider = Number(slider)
    this.spinner = Number(spinner)
    this.od = Number(od)
    this.cs = Number(cs)
    this.hp = Number(hp)
    this.ar = Number(ar)
    //
    if ((mod_num & 2) == 2) {
      this.star /= (mode == 2) ? 1.25 : 1
    }
    if ((mod_num & 256) == 256) {
      this.star /= (mode == 1) ? 1.2 : (mode == 2 || mode == 3) ? 1.25 : 1
    }
    if ((mod_num & 16) == 16) {
      this.star *= (mode == 2) ? 1.13 : 1
    }
    if ((mod_num & 64) == 64 || (mod_num & 512) == 512) {
      this.star *= (mode == 1) ? 1.3 : (mode == 2 || mode == 3) ? 1.4 : 1
    }
  }
  addScoreSkill({ acc_skill, speed_skill, aim_skill, star_skill, old_acc_skill }) {
    this.star_skill = star_skill
    this.acc_skill = acc_skill
    this.old_acc_skill = old_acc_skill
    this.speed_skill = speed_skill
    this.aim_skill = aim_skill
  }
}

class Beatmap {
  constructor({ beatmap_id, title, creator, diff, bpm, approved, beatmapset_id, fc, star, time_total,
    time_drain, favorite, source, artist, circle, slider, spinner, od, cs, hp, ar, mode }) {
    let approvalStatus_list = ['Graveyard', 'WIP', 'Pending', 'Ranked', 'Approved', 'Qualified', 'Loved']
    this.beatmap_id = beatmap_id
    this.title = title
    this.creator = creator
    this.diff = diff
    this.bpm = Number(bpm)
    this.approved = Number(approved)
    this.approvalStatus = approvalStatus_list[this.approved + 2]
    this.beatmapset_id = beatmapset_id
    this.star = Number(star)
    this.time_total = Number(time_total)
    this.time_drain = Number(time_drain)
    this.favorite = favorite
    this.source = source
    this.artist = artist
    this.circle = Number(circle)
    this.slider = Number(slider)
    this.spinner = Number(spinner)
    this.fc = (mode == 1) ? this.circle :
      (mode == 2) ? Math.round(this.circle + (this.slider * 2.35)) :
        (mode == 4) ? this.circle + this.slider : Number(fc)
    this.od = Number(od)
    this.cs = Number(cs)
    this.hp = Number(hp)
    this.ar = Number(ar)
  }
}

const Mods = Object.freeze({
  HD: "mod_hidden",
  HR: "mod_hard-rock",
  SD: "mod_sudden-death",
  PF: "mod_perfect",
  DT: "mod_double-time",
  NC: "mod_nightcore",
  FL: "mod_flashlight",
  EZ: "mod_easy",
  NF: "mod_no-fail",
  HT: "mod_half",
  FI: "mod_fader",
  NM: "mod_no-mod",
  MR: "mod_mirror"
});

module.exports = { Score, Beatmap, Mods }