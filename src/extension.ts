'use strict';

import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {
    let startMobTimer = vscode.commands.registerCommand('extension.startMobTimer', () => {

        // Get workspace configuration which is setup with defaults in package.json
        let workSpaceConfiguration = vscode.workspace.getConfiguration('mob-timer'),
            minutesPerRotation = workSpaceConfiguration.minutesPerRotation,
            enableStatusBarText = workSpaceConfiguration.enableStatusBarText;
        
        new MobTimer(minutesPerRotation, enableStatusBarText).start();
    });

    
    context.subscriptions.push(startMobTimer);
}
export function deactivate() {}


class MobTimer {

    minutesPerRotation: number;
    enableStatusBarText: boolean;

    rotations: number = 0;
    paused: boolean = false;
    secondsElapsed: number = 0;

    private _statusBarItem: vscode.StatusBarItem;

    constructor(minutesPerRotation: number, enableStatusBarText: boolean) {
        this.minutesPerRotation = minutesPerRotation;
        this.enableStatusBarText = enableStatusBarText;
    }

    public start() {

        // Enable status bar for showing rotations and time
        if (this.enableStatusBarText) {
            this.showStatusBar();
        }

        vscode.window.showInformationMessage(`Starting with rotations every ${this.minutesPerRotation} minutes, good luck!`);
        
        // Update timer
        setInterval(this.update, 1000, this);
    }

    private showStatusBar() {
        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        }
        this._statusBarItem.show();
    }

    private addRotation() {
        this.rotations += 1;
    }

    private pause() {
        this.paused = true;
    }

    private rotate() {
        this.addRotation();
        this.pause();
        this.rotateModal();   
    }

    private restart() {  
        this.secondsElapsed = 0;
        this.paused = false;
    }

    private timeFormat(seconds) {
        let minutes = Math.floor(seconds/60);
        seconds = seconds - (minutes * 60);

        let secondsFormatted = this.timePad(seconds);
        let minutesFormatted = this.timePad(minutes);

        
        return `${minutesFormatted}:${secondsFormatted}`;
    }

    private timePad(n: number) {
        return ('0' + String(n)).slice(-2);
    }

    private updateStatusBar() {
        let timeElapsed = this.timeFormat(this.secondsElapsed);
        this._statusBarItem.text = `Rotations: ${this.rotations}, Time elapsed: ${timeElapsed}`;
    }

    private update(_this: MobTimer) {

        if (_this.paused) {
            return;
        }

        if (_this.enableStatusBarText) {
            _this.updateStatusBar();
        }

        if (_this.secondsElapsed == _this.minutesPerRotation * 60) {
            _this.rotate();
        } else {
            _this.secondsElapsed += 1;
        }
    }

    private rotateModal() {
        // When the time is up we inform of rotation
        let msgOptions = {'modal': true},
            actions = ['Restart timer'];

        vscode.window.showWarningMessage('Time to change driver.', msgOptions, ...actions).then(action => this.restart());
    }

}