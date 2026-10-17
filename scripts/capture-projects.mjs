/**
 * Capture REAL browser output from Lin Khant's public GitHub projects.
 * Run locally, where GitHub/npm are accessible:
 *   npm install
 *   npx playwright install chromium
 *   npm run capture:projects
 *
 * The script never replaces a successful screenshot with a generated mockup.
 * Each capture comes from the app served from its checked-out source.
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const root = resolve(import.meta.dirname, '..');
const capturesDir = join(root, 'public', 'images', 'projects');
const checkoutDir = join(root, '.local-project-captures');
const isWindows = process.platform === 'win32';
const command = name => isWindows ? `${name}.cmd` : name;

const projects = [
  {
    name: 'Classroom Management Dashboard',
    repository: 'https://github.com/penguthedev/classroom-dashboard.git',
    directory: 'classroom-dashboard',
    appDir: 'client',
    image: 'classroom-dashboard.png',
    port: 5411,
    note: 'This is the actual frontend; API-connected data requires a running FastAPI backend.',
  },
  {
    name: 'QuickDine Restaurant Booking',
    repository: 'https://github.com/penguthedev/RestaurantQuickDine.git',
    directory: 'quickdine',
    appDir: 'Client',
    image: 'quickdine.png',
    port: 5412,
    note: 'This is the actual frontend; reservation data requires the FastAPI backend.',
  },
  {
    name: 'Personal Portfolio',
    repository: 'https://github.com/penguthedev/portfolio.git',
    directory: 'personal-portfolio',
    appDir: '.',
    image: 'personal-portfolio.png',
    port: 5413,
  },
  {
    name: 'Lumi Movie App',
    repository: 'https://github.com/penguthedev/LumiMovieProject.git',
    directory: 'lumi-movie',
    appDir: '.',
    image: 'lumi-movie.png',
    port: 5414,
    note: "Movie results may need the project's TMDB API configuration.",
  },
  {
    name: 'Habit Tracker',
    repository: 'https://github.com/penguthedev/habit-tracker.git',
    directory: 'habit-tracker',
    appDir: '.',
    image: 'habit-tracker.png',
    port: 5415,
  },
];

function log(project, message) {
  console.log(`[${project.name}] ${message}`);
}

function runProcess(bin, args, cwd, timeoutMs = 240_000) {
  return new Promise((accept, reject) => {
    const child = spawn(command(bin), args, {
      cwd,
      stdio: 'inherit',
      shell: isWindows,
      windowsHide: true,
    });
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`Timed out: ${bin} ${args.join(' ')}`));
    }, timeoutMs);
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => {
      clearTimeout(timer);
      code === 0 ? accept() : reject(new Error(`${bin} exited with code ${code}`));
    });
  });
}

function startServer(directory, port) {
  const child = spawn(command('npm'), ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: directory,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: isWindows,
    windowsHide: true,
  });
  let output = '';
  child.stdout?.on('data', chunk => { output += String(chunk).slice(-800); });
  child.stderr?.on('data', chunk => { output += String(chunk).slice(-800); });
  return { child, getOutput: () => output };
}

async function waitForServer(url, child, timeoutMs = 50_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (child.exitCode !== null || child.killed) throw new Error('Dev server stopped before becoming ready');
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (response.ok) return;
    } catch { /* not ready */ }
    await sleep(600);
  }
  throw new Error(`Dev server did not start at ${url}`);
}

async function captureOne(project, browser) {
  const checkout = join(checkoutDir, project.directory);
  const frontend = join(checkout, project.appDir);
  try {
    try {
      await access(join(checkout, '.git'));
      log(project, 'Repository already cloned, fetching latest revision…');
      await runProcess('git', ['pull', '--ff-only'], checkout, 90_000);
    } catch {
      log(project, 'Cloning repository…');
      await runProcess('git', ['clone', '--depth', '1', project.repository, checkout], root, 150_000);
    }
    await access(join(frontend, 'package.json'));
    log(project, 'Installing application dependencies…');
    await runProcess('npm', ['install', '--no-audit', '--no-fund'], frontend);

    const url = `http://127.0.0.1:${project.port}/`;
    const server = startServer(frontend, project.port);
    try {
      await waitForServer(url, server.child);
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await page.evaluate(() => document.fonts.ready).catch(() => undefined);
        await page.waitForTimeout(2800);
        const health = await page.evaluate(() => ({
          body: document.body?.innerText?.trim().length || 0,
          viteError: Boolean(document.querySelector('vite-error-overlay')),
        }));
        if (health.viteError || health.body < 8) {
          throw new Error('The app shows a blank screen or Vite error overlay; not saving a misleading capture.');
        }
        const destination = join(capturesDir, project.image);
        await page.screenshot({ path: destination, animations: 'disabled', fullPage: false, type: 'png' });
        log(project, `SAVED actual running app → public/images/projects/${project.image}`);
        if (project.note) log(project, project.note);
        return true;
      } finally {
        await page.close();
      }
    } finally {
      server.child.kill('SIGTERM');
    }
  } catch (error) {
    log(project, `SKIPPED: ${error?.message || error}`);
    return false;
  }
}

await mkdir(capturesDir, { recursive: true });
await mkdir(checkoutDir, { recursive: true });
console.log('Capturing real screens from checked-out GitHub projects. No synthetic visuals will be produced.');
const browser = await chromium.launch({ headless: true });
let captured = 0;
try {
  for (const project of projects) if (await captureOne(project, browser)) captured++;
} finally {
  await browser.close();
}
console.log(`\nCaptured ${captured}/${projects.length} application screenshots.`);
console.log('Flappy Bird is a native Python/Tkinter game, so save a screenshot manually as public/images/projects/flappybird.png.');
console.log('Then run npm run dev in this portfolio folder and open the Projects section.');
if (captured === 0) process.exitCode = 1;
