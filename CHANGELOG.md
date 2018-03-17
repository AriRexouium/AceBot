<!-- markdownlint-disable MD022 MD024 MD032 -->
# Changelog
<!-- http://keepachangelog.com -->
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!--
## [NEW] - YYYY-MM-DD
### Added
- Add here.

### Changed
- Change here.

## Removed
- Remove here.

## Fixed
- Fix here.
-->

## [Unreleased]
## [3.4.0] - 2018-03-16
### Added
- New dynamic config loading system.
- `inviteinfo` to get information on an invite.
- `getcommand` command for viewing a command's code.
- `shardstats` command to view stats on each shard.
- `seen` command to see when a user was last seen in a server.
- `listservers` and `listchannels`, these commands are self explanatory.
- Bot now sends a message when it joins a new guild.
- New MySQL support, you can now toggle between MySQL and SQLite.
- New profile system, users can now have a custom profile.
- Lockdown system, you can now lockdown the bot with a provided reason.
- Tunnel system, send and recieve messages from any channel the bot has access to.
### Changed
- Contributors get their own file.
- `eval` command shows information on functions.
- `stats` command is more efficient.
- `eval` and `exec` now work properly when using the `--silent` argument.
- Anything that used `.find('id', ID)` now uses `.get(ID)`.
- Commands are now organized properly.
### Fixed
- Fix bold text in `info` command.
- Fixed bot not shutting down properly.

## [3.3.0] - 2018-02-25
### Added
- Add Trello to package.json.
- Support for Sentry error logging with tags and release tracking.
- Style sheet for commands.
- New `channelinfo` command.
- Add AUTHORS.md file generator.
- New `settz` and `time` commands for setting and retrieving user's time zones. *(Includes custom group.)*
- Added lint command for linting code in the JavaScript Standard Style.

### Changed
- Embed colors for some commands are now dynamic.
- Made all commands that use embeds to use `message.embed()`.
- Update package versions.
- `discordstatus` command uses Statuspage API.
- Practically rewrote status and info commands respectively.
- Improve help documentation.
- Merged `repostatus` and `buildstatus` into `repo` command.
- Better module management.

### Removed
- Removed `.gitattributes`.
- Fixed README.md consistency.

### Fixed
- Prefix command is now guarded.

## [3.2.0] - 2018-02-09
### Added
- Added changelog for keeping track of changes.
- Added detailed JSDocs to source.
- Added comments to config files.
- Added AceBot logo as an asset.
- Added commit linting in jQuery style.
- The application owner is automatically set as the owner.

### Changed
- Changed config file extensions from `.yaml` to `.yml`.
- Improved README.md documentation.
- Switched from remark to markdownlint.
- License is now a plain text file.
- Improved CONTRIBUTING.md file.
- Removed unused async.
- Restart command now restarts all shards.
- Improved information in commands.

### Fixed
- Fixed broken links in README.
- Fixed config file issues.

## 3.1.0 - 2018-01-27
### Added
- Add `gitstatus` and `buildstatus` to retrieve information on AceBot from respective websites.
- Add `gitstatus` command.
- Add `buildstatus` command.

### Changed
- Fix style error in the discordstatus command.

<!-- [NEW]: http://github.com/olivierlacan/keep-a-changelog/compare/vOLD...vNEW -->
[Unreleased]: http://github.com/Aceheliflyer/AceBot/compare/v3.4.0...HEAD
[3.4.0]: http://github.com/Aceheliflyer/AceBot/compare/v3.3.0...v3.4.0
[3.3.0]: http://github.com/Aceheliflyer/AceBot/compare/v3.2.0...v3.3.0
[3.2.0]: http://github.com/Aceheliflyer/AceBot/compare/v3.1.0...v3.2.0
