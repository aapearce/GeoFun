# GeoFun Setup Guide for GitHub Codespaces

## Step 1: Copy Files to Your Repository

1. Download all the files from the geofun-app folder
2. In your GitHub Codespace, navigate to your GeoFun repository
3. Copy all files maintaining the folder structure:

```
GeoFun/
├── package.json
├── .gitignore
├── README.md
├── public/
│   ├── index.html
│   └── manifest.json
└── src/
    ├── App.js
    ├── App.css
    ├── index.js
    ├── index.css
    └── countriesData.js
```

## Step 2: Install Dependencies

In your Codespace terminal, run:

```bash
npm install
```

This will install:
- React 18
- React DOM
- React Scripts (Create React App tools)

## Step 3: Run the Development Server

Start the app with:

```bash
npm start
```

The app will open automatically in Codespaces. If it doesn't, you'll see a notification with a link to open it.

## Step 4: View Your App

- In Codespaces, a new port (usually 3000) will be forwarded automatically
- Click the notification or go to the "Ports" tab to open the app
- The app will reload automatically when you make changes

## Step 5: Build for Production

When ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Step 6: Deploy (Optional)

### Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/GeoFun",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
PORT=3001 npm start
```

### Dependencies Not Installing
Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### App Not Loading
1. Check the Ports tab in Codespaces
2. Make sure port 3000 (or your custom port) is forwarded
3. Click the globe icon next to the port to open in browser

## Features to Test

1. **Menu Screen**: Click different quiz types
2. **Region Selection**: Choose different continents
3. **Quiz Gameplay**: Answer questions, watch the timer
4. **Scoring**: See your score increase with correct answers
5. **Results Screen**: View statistics and accuracy
6. **Responsive Design**: Try resizing the browser window

## Customization Ideas

### Add More Countries
Edit `src/countriesData.js` and add new country objects following the existing format.

### Change Colors
Edit `src/App.css` and modify the CSS variables:
```css
:root {
  --primary: #FF6B35;
  --secondary: #F7931E;
  --accent: #00D9FF;
}
```

### Add New Quiz Types
1. Add new quiz type to the `quizTypes` array in `App.js`
2. Create a `generate[Type]Question` function
3. The app will automatically include it in the menu

### Modify Timer Duration
In `App.js`, change:
```javascript
setTimer(30); // Change 30 to your desired seconds
```

## File Structure Explained

- **package.json**: Project configuration and dependencies
- **public/index.html**: Main HTML template
- **public/manifest.json**: PWA configuration for Android
- **src/App.js**: Main application logic and components
- **src/App.css**: All styling and animations
- **src/countriesData.js**: Database of 30 countries with full information
- **src/index.js**: React entry point
- **src/index.css**: Global base styles

## Next Steps

1. Test all quiz types
2. Try different regions
3. Check responsive design on mobile view
4. Add more countries to the database
5. Deploy to a hosting platform
6. Share with friends!

Enjoy building with GeoFun! 🌍🎉
