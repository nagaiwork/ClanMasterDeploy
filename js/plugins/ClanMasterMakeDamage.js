/*:ja
 * @plugindesc 独自のダメージ計算式を定義
 * @author 菱影
 *
 * @help
 * 
 * 物理/魔法の基本ダメージ計算
 * 
 * Overview)
 * 攻撃側の攻撃力を基点に, 0%~200% の振れ幅でダメージ値を決定する.
 * 振れ幅の計算式：攻撃力 + ( 攻撃力 - 防御力 )
 * 
 * Usage)
 * CMD_normal(atk, def, [min, max])
 * 
 * atk : 攻撃側の攻撃力を指定. 攻撃力なら`a.atk`, 魔法力なら`a.mat`を指定.
 *       必須.
 * def : 防御側の防御力を指定. 防御力なら`b.def`, 魔法防御なら`b.mdf`を指定.
 *       必須.
 * min : 最低ダメージの値を指定.
 *       省略可. デフォルト値は`0`.
 * max : 最大ダメージの値を指定. 指定した値以上のダメージにはならなくなる.
 *       省略可. デフォルト値は`999`.
 * 
 * Ex)
 * CMD_normal(a.atk, b.def, 1, 100) // 物理
 * CMD_normal(a.mat, b.mdf)         // 魔法
 * 
 * 攻撃側の攻撃力：100 / 対象の防御力：100 = 100ダメージ
 * 攻撃側の攻撃力：100 / 対象の防御力：125 = 75ダメージ
 * 攻撃側の攻撃力：100 / 対象の防御力：50  = 150ダメージ
 * 攻撃側の攻撃力：100 / 対象の防御力：200 = 0ダメージ
 * 攻撃側の攻撃力：100 / 対象の防御力：1   = 199ダメージ
 * 攻撃側の攻撃力：250 / 対象の防御力：300 = 200ダメージ
 * 
 * -----
 * 
 * 回復力計算
 * 
 * Overview)
 * 使用者の能力値に応じた回復力を決定する.
 * 別途固定値や, 対象者の最大HPに応じた割合も設定可能.
 * 計算式：能力値+固定値+(最大HP割合)
 * 
 * Usage)
 * CMD_recovery(ability, [fixed], [b, ratio])
 * 
 * ability : 使用者の能力値を指定. 魔法力なら`a.mat`のように指定.
 *           必須.
 * fixed   : 固定値となる回復力を指定.
 *           省略可. デフォルト値は`0`.
 * b       : 最大HP割合を加える場合は対象者を指定する. `b`と指定する.
 *           省略可. デフォルト値は`null`.
 * ratio   : 最大HPの何割を回復力に加えるか指定する. `0.5`で50%, `1`で100%.
 *           省略可. デフォルト値は`0`.
 * 
 * Ex)
 * CMD_recovery(a.mat)             // 魔法力の分だけ回復
 * CMD_recovery(a.mat, 0, b, 0.25) // 魔法力+対象者の最大HPの25%分を回復
 */
var Imported = Imported || {};
Imported.ClanMasterMakeDamage = true;

// 基本ダメージ計算
function CMD_normal(atk, def, min = 0, max = 999) {
    let result = Math.floor(atk + (atk - def));
    if (result <= 0) {
        result = min;
    } else if (result >= max) {
        result = max;
    }
    return result;
}

// 回復力計算
function CMD_recovery(ability, fixed = 0, b = null, ratio = 0) {
    let result = Math.floor(ability + fixed);
    if (b != null && typeof b === "object") {
        if (b.hasOwnProperty("mhp")) {
            result += Math.floor(b.mhp * ratio);
        }
    }
    return result;
}
