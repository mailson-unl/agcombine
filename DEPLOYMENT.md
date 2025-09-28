# GitHu2. Name it: `agcombine` (you've already created this!) Pages Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it: `agcombine-filter` (or keep current name)
4. Make it **Public** (required for GitHub Pages)
5. Don't initialize with README (we already have one)

### 2. Push Your Code to GitHub
```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: AgCombine Filter agricultural outlier detection tool"

# Add GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/mailson-unl/agcombine.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select "GitHub Actions"
5. The deployment will start automatically!

### 4. Access Your Live Site
After deployment (2-3 minutes), your site will be available at:
```
https://mailson-unl.github.io/agcombine/
```

## 🔧 What We've Set Up

✅ **Automatic Deployment**: GitHub Actions workflow deploys on every push to main  
✅ **Optimized Build**: Vite configuration for GitHub Pages  
✅ **Asset Handling**: Proper base path configuration  
✅ **Documentation**: Comprehensive README with usage instructions  

## 📁 Files Created/Modified

- `README.md` - Comprehensive project documentation
- `vite.config.ts` - GitHub Pages build configuration
- `.github/workflows/deploy.yml` - Automatic deployment workflow
- `package.json` - Added GitHub Pages build scripts

## 🛠️ Local Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Build specifically for GitHub Pages
npm run build:gh-pages

# Preview GitHub Pages build locally
npm run preview:gh-pages
```

## 🔄 Future Updates

To update your live site:
1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push
   ```
3. GitHub Actions will automatically rebuild and deploy!

## 🐛 Troubleshooting

### Build Fails
- Check the **Actions** tab in your GitHub repo for error details
- Ensure all dependencies are in `package.json`
- Test locally with `npm run build` first

### Site Not Loading
- Verify GitHub Pages is enabled in repository settings
- Check that repository is **public**
- Wait 5-10 minutes for DNS propagation

### Assets Not Loading
- Ensure `base` path in `vite.config.ts` matches your repository name
- Check browser developer tools for 404 errors

## 🎯 Next Steps

1. **Custom Domain** (optional): Add a CNAME file for custom domain
2. **Analytics**: Add Google Analytics if desired
3. **SEO**: Add meta tags and OpenGraph tags
4. **Sample Data**: Include example CSV files for users to try

Your agricultural outlier filtering tool is now ready to help researchers worldwide! 🌾