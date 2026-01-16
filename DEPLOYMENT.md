# Deployment Instructions / Tilmaamaha Deploy-ka

## Backend Deployment (Render.com)

### Somali
1. **Render.com ku sameyso account**
   - Tag: https://render.com
   - Sign up with GitHub account-kaaga

2. **Backend Deploy**
   - Click "New +" → "Web Service"
   - Connect GitHub repository-gaaga
   - Render wuxuu automatically arkayaa `render.yaml` file-ka
   - Click "Apply" si uu u deploy gareyso

3. **URL-ka qaado**
   - Markuu deploy noqdo, waxaad heli doontaa URL sida: `https://house-price-backend.onrender.com`
   - Copy URL-kan

4. **Frontend-ka update gareey**
   - Fur `frontend/.env.production`
   - Beddel `VITE_API_BASE` URL-ka cusub
   - Example: `VITE_API_BASE=https://house-price-backend.onrender.com`

---

## Frontend Deployment (Netlify)

### Somali
1. **Netlify.com ku sameyso account**
   - Tag: https://netlify.com
   - Sign up with GitHub account-kaaga

2. **Frontend Deploy**
   - Click "Add new site" → "Import an existing project"
   - Select GitHub repository-gaaga
   - Netlify wuxuu automatically arkayaa `netlify.toml` configuration-ka
   - Click "Deploy site"

3. **Environment Variables**
   - Tag Site settings → Environment variables
   - Add: `VITE_API_BASE` = `https://house-price-backend.onrender.com`

4. **Redeploy**
   - Click "Trigger deploy" → "Deploy site"

---

## Testing / Tijaabinta

1. Open Netlify URL-kaaga
2. Fill in house details
3. Click "GENERATE ESTIMATE"
4. Hubi inuu prediction soo celiyo

---

## English Instructions

### Backend (Render)
1. Create account at https://render.com
2. New Web Service → Connect GitHub repo
3. Render auto-detects `render.yaml`
4. Copy the deployed URL

### Frontend (Netlify)
1. Create account at https://netlify.com
2. Import GitHub repository
3. Add environment variable: `VITE_API_BASE` with Render URL
4. Deploy

---

## Important Notes / Qoraalka Muhiimka ah

- **Free Tier Limits**: Render free tier wuxuu seexdaa after 15 minutes of inactivity. First request-ka cusub wuxuu qaadan karaa 30-60 seconds si uu u wake up gareyo.
- **Cold Starts**: Haddii application-ku aanu shaqeynin, sug 1 minute oo dib u day.
- **Logs**: Haddii wax khalad ah dhacaan, check Render logs: Dashboard → Service → Logs
