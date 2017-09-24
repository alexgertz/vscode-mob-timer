# Changelog
All notable changes to the "mob-timer" extension will be documented in this file.

### 1.5.1

- Update readme to align with changes introduced in 1.5.0.

### 1.5.0

- Bugfix: Fix a bug introduced in 1.4.0 which could make the timer go double speed.
- Feature: Removed the command `Resume Mob Timer` as it was superfluous(use `Start Mob Timer` instead).
- Feature: The timer now keeps track of your total number of rotations. You can see it in your configuration (`mob-timer.rotationCountTotal`);


### 1.4.0

- Feature: Run command `Stop Mob Timer` to stop the timer.
- Feature: Give the option to not start the timer on rotation.
- Feature: Give the option for stopped rotations to be resumed with `Resume Mob Timer`.
- Feature: Give the option to reset the timer with the command `Reset Mob Timer`.
- Bugfix: Mob Timers are no longer stackable.


### 1.3.0

- Layout: Status bar time text is now padded for smoother time updates.


### 1.2.0

- Feature: Set minutes per rotation with setting `mob-timer.minutesPerRotation`
- Feature: Enable/disable status bar text with setting `mob-timer.enableStatusBarText`
- Feature: Changed time tracking format to show minutes:seconds instead of just seconds.
- Refactor: Rewrite MobTimer class to be easier to read.

### 1.1.0

- Update VSCode manifest header color.

### 1.0.1

- Update VSCode manifest
- Add icon with license in readme.

## 1.0.0
- Initial release
- Feature: timer with rotations
- Feature: timer and rotations show in status bar