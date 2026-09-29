# shutout-site

The one-page site for [Shutout](https://github.com/phortysiks/Shutout), the EIHL app: <https://shutout.charliecox.dev>.

Plain HTML, CSS and JavaScript in `site/` - no build step.

## Working on it

Serve `site/` locally, then open <http://localhost:8765>:

```bash
python3 -m http.server 8765 --directory site
```

## Deploying

Every push to `main` publishes `site/` to GitHub Pages (see `.github/workflows/deploy.yml`). A deploy can also be started by hand from the Actions tab. The custom domain is set in the repo's Pages settings, with a `CNAME` record for `shutout` pointing at `phortysiks.github.io` in the domain's DNS.

## Screenshots

The phone screenshots in `site/assets/` come from the iOS Simulator (iPhone 17 Pro), scaled to 780px wide and saved as WebP. The widget and Live Activity shots use sample content replaying a real game (Manchester Storm v Guildford Flames, 27 September 2026).
