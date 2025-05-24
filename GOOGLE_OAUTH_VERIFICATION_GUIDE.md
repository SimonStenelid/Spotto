# Google OAuth Verification Guide for Spotto

## ✅ What I've Created

1. **Privacy Policy Page** - `/privacy-policy`
   - Comprehensive privacy policy covering data collection, usage, and user rights
   - Accessible at: `https://spotto-iota.vercel.app/privacy-policy`

2. **Terms of Service Page** - `/terms-of-service`
   - Complete terms covering user accounts, acceptable use, payments, and legal requirements
   - Accessible at: `https://spotto-iota.vercel.app/terms-of-service`

3. **Updated Footer** - Added links to both pages in the landing page footer
   - Links appear in both the main footer section and bottom copyright area
   - Uses proper React Router navigation

## 🚀 Next Steps for Google OAuth Verification

### 1. Deploy the Changes
```bash
# Deploy to Vercel
npm run build
vercel --prod
```

### 2. Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **OAuth consent screen**
3. Click **"Edit App"**
4. Update the following fields:

**App Information:**
- **App name**: Spotto
- **App logo**: Upload `/public/spotto-logo-120.svg` (120x120px)
- **User support email**: Your support email

**App Domain:**
- **App homepage**: `https://spotto-iota.vercel.app`
- **Privacy policy URL**: `https://spotto-iota.vercel.app/privacy-policy`
- **Terms of service URL**: `https://spotto-iota.vercel.app/terms-of-service`

**Authorized domains:**
- Add: `spotto-iota.vercel.app` (without https://)

### 3. Publish Your App
1. In OAuth consent screen, look for **"Publishing status"**
2. Change from "Testing" to "Production"
3. Click **"Publish App"**

### 4. Submit for Verification
1. Click **"Prepare for Verification"**
2. Review all information
3. Click **"Submit for Verification"**

## 📋 Verification Requirements Checklist

- ✅ App name: "Spotto"
- ✅ App logo: 120x120px (created)
- ✅ User support email: [Your email]
- ✅ Privacy policy URL: Available
- ✅ Terms of service URL: Available
- ✅ App homepage: Available
- ✅ Authorized domains: Configured
- ✅ App published to production

## ⏱️ Timeline

- **Verification Review**: 1-4 weeks typically
- **Custom Branding**: Shows after verification approval
- **Internal Apps**: Immediate custom branding (requires Google Workspace)

## 🔧 Alternative: Internal App (Immediate Solution)

If you have Google Workspace and want immediate custom branding:

1. Change **User Type** from "External" to "Internal"
2. This requires a Google Workspace organization
3. Internal apps show custom branding immediately without verification
4. Limited to users in your organization

## 📞 Contact Information

Update these email addresses in the legal pages before deploying:
- Privacy Policy: `privacy@spotto.app`
- Terms of Service: `legal@spotto.app`
- Support: Use your actual support email

## 🎯 What This Achieves

Once verified, users will see:
- "Spotto" instead of generic app name
- Your custom logo on the OAuth consent screen
- Professional, trustworthy appearance
- Compliance with Google's requirements

## 🚨 Important Notes

1. **Don't change scopes** after submitting for verification
2. **Keep contact information updated** - Google communicates via email
3. **Test thoroughly** before submitting
4. **Be patient** - verification can take several weeks

The enhanced login forms I created will show your Spotto branding immediately, while the Google OAuth consent screen will show custom branding after verification approval. 