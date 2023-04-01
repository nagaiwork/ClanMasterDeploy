//=============================================================================
// MKR_ActorBattleCommandSort.js
//=============================================================================
// Copyright (c) 2016 mankind
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/10/27 処理方法を変更。
// 1.0.0 2016/10/27 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @target MZ MV
 * @url https://raw.githubusercontent.com/munokura/MKR-MV-plugins/master/MKR_ActorBattleCommandSort.js
 * @plugindesc (v1.0.1) アクターバトルコマンドの並びを
 *「攻撃」「防御」「スキル」「アイテム」に変更します。
 *
 * @author mankind
 *
 * @help
 * プラグインを導入すれば自動的にコマンドが並び替えられます。
 *
 *
 * プラグインコマンド:
 *   ありません。
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 *
 * 利用規約:
 *   ・作者に無断で本プラグインの改変、再配布が可能です。
 *     (ただしヘッダーの著作権表示部分は残してください。)
 *
 *   ・利用形態(フリーゲーム、商用ゲーム、R-18作品等)に制限はありません。
 *     ご自由にお使いください。
 *
 *   ・本プラグインを使用したことにより発生した問題について作者は一切の責任を
 *     負いません。
 *
 *   ・要望などがある場合、本プラグインのバージョンアップを行う
 *     可能性がありますが、
 *     バージョンアップにより本プラグインの仕様が変更される可能性があります。
 *     ご了承ください。
 *
 *
*/
(function () {
    'use strict';

    //=========================================================================
    // Window_Command
    //  ・コマンドリストを操作する処理を定義します。
    //
    //=========================================================================
    // コマンドリスト内から指定したindexのコマンドを返す。
    Window_Command.prototype.getCommand = function (index) {
        if (index < this.maxItems()) {
            return this._list[index];
        } else {
            return {};
        }
    };

    // コマンドリスト内から指定したindexのコマンドを削除する。
    Window_Command.prototype.deleteCommand = function (index) {
        if (index < this.maxItems()) {
            this._list.splice(index, 1);
        }
    };

    // コマンドリストの指定した位置にコマンドを挿入する。
    Window_Command.prototype.insertCommand = function (index, command) {
        if (index < this.maxItems()) {
            this._list.splice(index, 0, command);
        }
    };


    //=========================================================================
    // Window_ActorCommand
    //  ・コマンドの並び順を変更します。
    //
    //=========================================================================
    var _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    // コマンド作成処理関数
    Window_ActorCommand.prototype.makeCommandList = function () {
        // 元の処理を呼び出し
        _Window_ActorCommand_makeCommandList.call(this);
        // コマンドの順序変更関数呼び出し
        this.sortCommand();
    };

    Window_ActorCommand.prototype.sortCommand = function () {
        var command, i;

        // コマンドリストに登録されているコマンドを走査し、
        // 名前が「固有」であるコマンドの並び順を先頭に変更する。
		var haveUniqueSkillCmd = false;
		var attakCommandIdx = 0;
        for (i = 0; i < this.maxItems(); i++) {
            if (this.commandName(i) == $dataSystem.skillTypes[3]) {
                command = this._list[i];
                this.deleteCommand(i);
                this.insertCommand(0, command);
				haveUniqueSkillCmd = true;
				break;
            }
        }
		
		// 「固有」コマンドを所有している場合、「攻撃」と「防御」コマンドを削除
		if(haveUniqueSkillCmd) {
			for (i = 0; i < this.maxItems(); i++) {
				if(this.commandName(i) == TextManager.attack ||
					this.commandName(i) == TextManager.guard) {
					this.deleteCommand(i);
				}
			}
		}
		
    }
})();