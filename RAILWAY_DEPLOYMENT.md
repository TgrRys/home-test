# Deploying Home Test API to Railway

This guide will walk you through deploying your Home Test API to Railway for free.

## Prerequisites

1. A GitHub account with your project repository
2. A Railway account (sign up at https://railway.app)
3. Your project should be pushed to GitHub

## Step 1: Prepare Your Repository

Make sure your repository includes these files (already added):
- `railway.json` - Railway deployment configuration
- `Procfile` - Process file for Railway
- `.env.railway` - Environment variables template

## Step 2: Deploy to Railway

### Option A: Deploy from GitHub (Recommended)

1. **Sign up/Login to Railway**
   - Go to https://railway.app
   - Sign up with your GitHub account

2. **Create a New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `home-test` repository

3. **Add PostgreSQL Database**
   - In your Railway project dashboard
   - Click "New Service"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create a PostgreSQL instance

4. **Configure Environment Variables**
   - Click on your app service (not the database)
   - Go to "Variables" tab
   - Add these environment variables:
     ```
     NODE_ENV=production
     JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
     JWT_EXPIRES_IN=12h
     ```
   - Railway automatically provides `DATABASE_URL` from the PostgreSQL service

5. **Deploy**
   - Railway will automatically build and deploy your application
   - The deployment will run `npm install` and then `npm start`
   - Initial deployment may take 3-5 minutes

### Option B: Deploy with Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Railway Project**
   ```bash
   railway init
   ```

4. **Add PostgreSQL Database**
   ```bash
   railway add postgresql
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your_super_secure_jwt_secret_key
   railway variables set JWT_EXPIRES_IN=12h
   ```

6. **Deploy**
   ```bash
   railway up
   ```

## Step 3: Verify Deployment

1. **Check Application Status**
   - In Railway dashboard, check if the deployment is successful
   - Look for the "Active" status with a green indicator

2. **Get Your App URL**
   - In the Railway dashboard, click on your app service
   - Copy the generated URL (e.g., `https://your-app-name.up.railway.app`)

3. **Test Health Check**
   ```bash
   curl https://your-app-name.up.railway.app/api/health
   ```
   
   Expected response:
   ```json
   {
     "status": 0,
     "message": "API is running",
     "data": {
       "timestamp": "2025-07-27T10:00:00.000Z",
       "version": "1.0.0"
     }
   }
   ```

## Step 4: Test with Postman

1. **Update Postman Environment**
   - Import your Postman collection and environment
   - Update the `base_url` variable to your Railway URL
   - Example: `https://your-app-name.up.railway.app`

2. **Test Registration**
   ```bash
   POST https://your-app-name.up.railway.app/api/registration
   ```

3. **Test Login**
   ```bash
   POST https://your-app-name.up.railway.app/api/login
   ```

## Step 5: Database Management

### Accessing Railway PostgreSQL

1. **View Database Credentials**
   - In Railway dashboard, click on PostgreSQL service
   - Go to "Connect" tab to see connection details

2. **Connect with psql (Optional)**
   ```bash
   # Railway provides a connection URL
   psql postgresql://username:password@host:port/database
   ```

### Database Initialization

The application automatically initializes the database on first run:
- Creates all required tables
- Seeds initial data (admin user, banners, services)
- Sets up the complete database schema

## Step 6: Custom Domain (Optional)

1. **Add Custom Domain**
   - In Railway dashboard, go to your app service
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Update DNS records as instructed

## Environment Variables Reference

Railway automatically provides these from PostgreSQL service:
- `DATABASE_URL` - Complete PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

You need to set these manually:
- `NODE_ENV=production`
- `JWT_SECRET` - Your secure JWT secret
- `JWT_EXPIRES_IN=12h`

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify PostgreSQL service is running
   - Check if `DATABASE_URL` is set
   - Ensure SSL configuration is correct

2. **Application Won't Start**
   - Check build logs in Railway dashboard
   - Verify all required environment variables are set
   - Ensure `package.json` has correct start script

3. **502 Bad Gateway**
   - Application may still be starting up
   - Check if the app is listening on the correct port
   - Verify health check endpoint is working

### Viewing Logs

1. **Railway Dashboard**
   - Click on your app service
   - Go to "Deployments" tab
   - Click on the latest deployment to view logs

2. **Railway CLI**
   ```bash
   railway logs
   ```

## Cost Information

**Railway Free Tier Includes:**
- $5 of usage credits per month
- PostgreSQL database hosting
- Automatic SSL certificates
- Custom domains
- GitHub integration

**Typical Usage:**
- Small API like this: ~$1-3/month
- Database: ~$1-2/month
- Well within free tier limits

## Post-Deployment Checklist

- [ ] Application is accessible via Railway URL
- [ ] Health check endpoint responds correctly
- [ ] Database is properly initialized
- [ ] User registration works
- [ ] User login returns JWT token
- [ ] Protected endpoints work with authentication
- [ ] Postman collection works with new URL
- [ ] (Optional) Custom domain configured

## Production Considerations

1. **Security**
   - Use a strong JWT secret
   - Enable HTTPS (automatic with Railway)
   - Consider rate limiting for production

2. **Monitoring**
   - Set up Railway notifications
   - Monitor application logs
   - Set up uptime monitoring

3. **Backup**
   - Railway handles database backups
   - Consider exporting important data periodically

## Support

- **Railway Documentation**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app

Your Home Test API is now deployed and ready for production use! 🚀
