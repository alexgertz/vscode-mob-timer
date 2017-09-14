'use strict';

import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {

    // Get workspace configuration which is setup with defaults in package.json
    let workSpaceConfiguration = vscode.workspace.getConfiguration('mob-timer'),
        minutesPerRotation = workSpaceConfiguration.minutesPerRotation,
        enableStatusBarText = workSpaceConfiguration.enableStatusBarText;

    let mobTimer = new MobTimer(minutesPerRotation, enableStatusBarText);

    let startMobTimer = vscode.commands.registerCommand('extension.startMobTimer', () => {
        mobTimer.start();
    });

    let stopMobTimer = vscode.commands.registerCommand('extension.stopMobTimer', () => {
        mobTimer.stop();
    });

    let resumeMobTimer = vscode.commands.registerCommand('extension.resumeMobTimer', () => {
        mobTimer.resume();
    });

    let resetMobTimer = vscode.commands.registerCommand('extension.resetMobTimer', () => {
        mobTimer.reset();
    });
    
    context.subscriptions.push(startMobTimer);
    context.subscriptions.push(stopMobTimer);
    context.subscriptions.push(resumeMobTimer);
    context.subscriptions.push(resetMobTimer);
}
export function deactivate() {}


class MobTimer {

    minutesPerRotation: number;
    enableStatusBarText: boolean;

    rotations: number = 0;
    paused: boolean = true;
    secondsElapsed: number = 0;

    private _statusBarItem: vscode.StatusBarItem;

    constructor(minutesPerRotation: number, enableStatusBarText: boolean) {
        this.minutesPerRotation = minutesPerRotation;
        this.enableStatusBarText = enableStatusBarText;
    }

    public start() {

        if (!this.paused) {
            vscode.window.showInformationMessage('Timer is already started.');
        } else {

            // Enable status bar for showing rotations and time
            if (this.enableStatusBarText) {
                this.showStatusBar();
            }

            vscode.window.showInformationMessage(`Starting with rotations every ${this.minutesPerRotation} minutes, good luck!`);
            
            // Update timer
            this.unpause();
            setInterval(this.update, 1000, this);
        }
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

    private unpause() {
        this.paused = false;
    }

    public stop() {
        this.pause();
    }

    public resume() {
        this.unpause();
    }

    private rotate() {
        this.addRotation();
        this.pause();
        this.rotateModal();   
    }

    public reset() {
        this.secondsElapsed = 0;
        this.updateStatusBar();
    }

    private restart() {  
        this.reset();
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

    private handleAction(action) {
        // Doing this with callback somewhere in the future
        if (action === 'Restart timer') {
            this.restart();
        } else {
            // This is where native cancel will go
            this.stop();
        }
        
    }

    private rotateModal() {
        // When the time is up we inform of rotation
        let title = 'Time to change driver.',
            msgOptions = {'modal': true},
            actions = ['Restart timer'];

        vscode.window.showWarningMessage(title, msgOptions, ...actions).then(action => this.handleAction(action));
    }

}