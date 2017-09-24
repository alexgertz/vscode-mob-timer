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
        mobTimer.pause(true);
    });

    let resetMobTimer = vscode.commands.registerCommand('extension.resetMobTimer', () => {
        mobTimer.reset();
    });
    
    context.subscriptions.push(startMobTimer);
    context.subscriptions.push(stopMobTimer);
    context.subscriptions.push(resetMobTimer);
}
export function deactivate() {}


export class MobTimer {

    minutesPerRotation: number;
    enableStatusBarText: boolean;

    rotations: number = 0;
    interval: any = false;
    paused: boolean = true;
    secondsElapsed: number = 0;
    showStartMsg: boolean = true;

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

            if (this.showStartMsg) {
                vscode.window.showInformationMessage(`Starting with rotations every ${this.minutesPerRotation} minutes, good luck!`);
                this.showStartMsg = false;
            }
            this.pause(false);
        }
    }

    private showStatusBar() {
        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        }
        this._statusBarItem.show();
    }

    public pause (paused: boolean) {
        this.paused = paused;
        if (paused) {
            clearInterval(this.interval);
        } else {
            this.interval = setInterval(this.update, 1000, this);
        }
        
    }

    private rotate() {
        this.rotations += 1;

        let configuration = vscode.workspace.getConfiguration('mob-timer');
        let rotationCountTotal = configuration.rotationCountTotal;
        configuration.update('rotationCountTotal', rotationCountTotal + 1);

        this.reset();
        this.pause(true);
        this.rotateModal();   
    }

    public reset() {
        this.secondsElapsed = 0;
        this.updateStatusBar();
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
        if (this.enableStatusBarText) {
            let timeElapsed = this.timeFormat(this.secondsElapsed);
            this._statusBarItem.text = `Rotations: ${this.rotations}, Time elapsed: ${timeElapsed}`;
        }
    }

    private update(_this: MobTimer) {
        if (_this.paused) return;

        _this.updateStatusBar();

        if (_this.secondsElapsed == _this.minutesPerRotation * 60) {
            _this.rotate();
        } else {
            _this.secondsElapsed += 1;
        }
    }

    // Just pause or not on action
    private handleAction(action) {
        this.pause(action !== 'Restart timer');
    }

    private rotateModal() {
        // When the time is up we inform of rotation
        let title = 'Time to change driver.',
            msgOptions = {'modal': true},
            actions = ['Restart timer'];

        vscode.window.showWarningMessage(title, msgOptions, ...actions).then(action => this.handleAction(action));
    }

}