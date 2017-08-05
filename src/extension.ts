'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mob-timer" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {

        let cycleMinutes = 10;
        let timer = new MobTimer(cycleMinutes);
        timer.startTimer();
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class MobTimer {

    cycleMinutes: number;

    cyclesElapsed: number = 0;
    secondsElapsed: number = 0;

    paused: boolean = false;

    private _statusBarItem: vscode.StatusBarItem;

    constructor(cycleMinutes: number) {
        this.cycleMinutes = cycleMinutes;
    }


    public startTimer() {

        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        }

        vscode.window.showInformationMessage(`Starting with rotations every ${this.cycleMinutes} minutes, good luck!`);
        
        // Show status bar for cycle and elapsed time
        this._statusBarItem.show();
        setInterval(this.updateTimer, 1000, this);
        
    }

    addCycle() {
        this.cyclesElapsed += 1;
    }

    pause() {
        this.paused = true;
    }

    rotate() {
        this.addCycle();
        this.pause();
        this.rotateTimerModal();   
    }

    restartTimer() {
        console.log("Restarting timer.");        
        this.secondsElapsed = 0;
        this.paused = false;
    }

    updateTimer(_this: MobTimer) {

        if (_this.paused) {
            return;
        }

        _this._statusBarItem.text = `Rotations done: ${_this.cyclesElapsed}, Current rotation: ${_this.secondsElapsed}`;

        if (_this.secondsElapsed == _this.cycleMinutes * 60) {
            _this.rotate();
        } else {
            _this.secondsElapsed += 1;
        }
    }

    rotateTimerModal() {
        // When the time is up we inform of rotation
        let msgOptions = {'modal': true};
        let actions = ['Restart timer'];
        vscode.window.showWarningMessage('Time to change driver.', msgOptions, ...actions).then(action => this.restartTimer());
    }

}