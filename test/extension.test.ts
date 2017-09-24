import * as assert from 'assert';
import * as vscode from 'vscode';
import {MobTimer} from '../src/extension';

suite("Extension Tests", () => {

    var minutesPerRotation = 1,
        enableStatusBarText = true;
    let mobTimer = new MobTimer(minutesPerRotation, enableStatusBarText);

    test("Starting timer sets timer to not paused", () => {
        mobTimer.start();
        assert.equal(false, mobTimer.paused);
    });

    test("Starting timer will set show start msg to not show again", () => {
        var mobTimer = new MobTimer(minutesPerRotation, enableStatusBarText);

        assert.equal(true, mobTimer.showStartMsg);
        mobTimer.start();
        assert.equal(false, mobTimer.showStartMsg);
    });

});