#!/usr/bin/env node
import { build } from './build.js';
import { add } from './add.js';
import { init } from './init.js';
import { open } from './open.js';
import { diff } from './diff.js';
import { digest } from './digest.js';
import { publish } from './publish.js';
import { notify } from './notify.js';
import { preview } from './preview.js';
import { validate } from './validate.js';
import { latest } from './latest.js';

const [, , command = 'help', ...args] = process.argv;

switch (command) {
  case 'init':
    init().catch((err) => { console.error(err); process.exit(1); });
    break;
  case 'build':
    build(args);
    break;
  case 'add':
    add(args[0]);
    break;
  case 'open':
    open();
    break;
  case 'diff':
    diff(args[0]);
    break;
  case 'digest':
    digest(args[0]);
    break;
  case 'publish': {
    const flags = args.filter((a) => a.startsWith('--'));
    const versionArg = args.find((a) => !a.startsWith('--'));
    publish(flags, versionArg);
    break;
  }
  case 'notify':
    notify(args[0]);
    break;
  case 'preview':
    preview();
    break;
  case 'validate':
    validate();
    break;
  case 'latest':
    latest();
    break;
  default:
    console.log('Usage: ship-notes <command>');
    console.log('');
    console.log('Commands:');
    console.log('  init                                Set up ship-notes in a new project');
    console.log('  add [patch|minor|major|<version>]   Scaffold a new release file');
    console.log('  build [--since <version>]           Assemble releases/ into changelog/CHANGELOG.md');
    console.log('  validate                            Check all release files for errors');
    console.log('  latest                              Print the latest version number');
    console.log('  open                                Open the deployed changelog in the browser');
    console.log('  preview                             Start a local preview of the changelog site');
    console.log('  diff [<version>|<v1>..<v2>]         Print release(s) as Markdown to stdout');
    console.log('  digest [<version>]                  Write an HTML email digest to changelog/');
    console.log('  publish --github [<version>]        Post a release to GitHub Releases');
    console.log('  notify [<version>]                  Send a release summary to Slack or Discord');
}
